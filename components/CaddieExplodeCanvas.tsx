"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Canvas-only variant of the caddie-site CaddieExplode (the three.js + GSAP
 * logic is 1:1). It fills whatever box it's dropped into (the right column),
 * and pins `pinRef` — the whole one-fold section — so the section stays put
 * while scrolling scrubs the explosion from 0 → 1, then releases.
 */

/** Per-material PBR look. Keys match the `mat` field baked into explode.json. */
const MATERIALS: Record<
  string,
  { color: number; metalness: number; roughness: number }
> = {
  Cad: { color: 0xc2cace, metalness: 0.92, roughness: 0.34 }, // bright steel screws/pivots
  d_1: { color: 0xc3ccd2, metalness: 0.88, roughness: 0.3 }, // satin steel tools
  d_2: { color: 0xc8d2db, metalness: 1.0, roughness: 0.18 }, // mirror knife blades
  d_3: { color: 0x837a70, metalness: 0.85, roughness: 0.45 }, // steel pivot pins
  d_4: { color: 0xb07a2e, metalness: 1.0, roughness: 0.36 }, // brass brush bristles
  d_5: { color: 0x67728d, metalness: 0.82, roughness: 0.4 }, // anodised hardware
  scale: { color: 0x16181b, metalness: 0.28, roughness: 0.54 }, // matte black anodised handle
  engrave: { color: 0xd2d6da, metalness: 0.35, roughness: 0.6 }, // light etched logo on black
};

type PartMeta = {
  mat: string;
  off: [number, number, number]; // explode target offset (metres, model space)
  start: number; // 0..1 scroll point this part begins travelling (cascade ripple)
  // Optional: deploy by rotating around a pivot (e.g. the brush on its end disc)
  // instead of translating away. pivot in model metres; spin = [axisX,axisY,axisZ,angleRad].
  pivot?: [number, number, number];
  spin?: [number, number, number, number];
};

type ExplodeData = {
  parts: Record<string, PartMeta>;
};

export default function CaddieExplodeCanvas({
  pinRef,
}: {
  pinRef: RefObject<HTMLElement | null>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const container = containerRef.current!;
    const pinEl = pinRef.current ?? container;
    // Pin (one-fold, section stays put) only where there's room — i.e. the
    // two-column desktop layout. Narrow screens scrub as the section passes.
    const canPin = window.matchMedia("(min-width: 1024px)").matches;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    // Cap at 1.5: a full-screen canvas at retina DPR 2 renders 4× the pixels,
    // a major GPU/VRAM cost on integrated graphics. 1.5 stays sharp for far less.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 100);
    camera.position.set(0, 0, 0.42);

    // Image-based lighting for believable metal reflections.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;

    // Key / fill / rim directional lights for crisp metal highlights.
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(0.4, 0.7, 0.8);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x9fc4ff, 1.1);
    fill.position.set(-0.6, 0.1, 0.4);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffe7c2, 1.6);
    rim.position.set(0.0, -0.5, -0.8);
    scene.add(rim);
    scene.add(new THREE.HemisphereLight(0xcfe0ff, 0x14181f, 0.5));

    const root = new THREE.Group();
    scene.add(root);

    // Drives the explosion; updated by ScrollTrigger, eased toward in the loop.
    const target = { p: 0 };
    const current = { p: 0 };
    const pointer = { x: 0, y: 0 };

    let parts: {
      node: THREE.Object3D;
      off: THREE.Vector3;
      start: number;
      pivot?: THREE.Vector3;
      axis?: THREE.Vector3;
      angle?: number;
    }[] = [];
    const _q = new THREE.Quaternion();
    const _v = new THREE.Vector3();
    let fanMid = 0; // vertical center of the fully-exploded fan
    // Half-extents used to auto-fit the camera (assembled vs fully exploded).
    const frame = { hx: 0.07, hy: 0.02, exHx: 0.1, exHy: 0.16 };
    let disposed = false;

    // ONE shared material per material-group (6 total), not one per mesh (372).
    // 372 unique materials = 372 shader compiles on the first frame, which can
    // hard-stall the GPU driver. Six shared programs render instantly.
    const matCache: Record<string, THREE.MeshStandardMaterial> = {};
    const materialFor = (key: string) => {
      const k = MATERIALS[key] ? key : "Cad";
      if (!matCache[k]) {
        const look = MATERIALS[k];
        matCache[k] = new THREE.MeshStandardMaterial({
          color: look.color,
          metalness: look.metalness,
          roughness: look.roughness,
          envMapIntensity: 1.1,
          side: k === "engrave" ? THREE.DoubleSide : THREE.FrontSide,
        });
      }
      return matCache[k];
    };

    // Render on demand: only draw while something is actually changing.
    let dirty = true;
    const wake = () => {
      dirty = true;
    };

    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
      wake();
    };
    window.addEventListener("pointermove", onPointer);

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      wake();
    };

    const smooth = (a: number, b: number, x: number) => {
      const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
      return t * t * (3 - 2 * t);
    };

    let st: ScrollTrigger | null = null;

    Promise.all([
      new GLTFLoader().loadAsync("/models/caddie_exploded_engraved.glb"),
      fetch("/explode.json").then((r) => r.json() as Promise<ExplodeData>),
    ]).then(([gltf, data]) => {
      if (disposed) return;

      gltf.scene.traverse((obj) => {
        const meta = data.parts[obj.name];
        if (!meta || !(obj as THREE.Mesh).isMesh) return;
        const mesh = obj as THREE.Mesh;
        mesh.material = materialFor(meta.mat);
        mesh.castShadow = false;
        const off = new THREE.Vector3(...meta.off);
        // Each part carries its own cascade start (outer/larger travel later).
        const entry: (typeof parts)[number] = { node: mesh, off, start: meta.start };
        if (meta.pivot && meta.spin) {
          entry.pivot = new THREE.Vector3(...meta.pivot);
          entry.axis = new THREE.Vector3(meta.spin[0], meta.spin[1], meta.spin[2]).normalize();
          entry.angle = meta.spin[3];
        }
        parts.push(entry);
      });

      root.add(gltf.scene);

      // Vertical midpoint of the exploded fan, so the camera can keep it framed.
      if (parts.length) {
        const ys = parts.map((p) => p.off.y);
        fanMid = (Math.min(...ys) + Math.max(...ys)) / 2;
      }

      // Frame the assembled model.
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      root.position.sub(center); // recenter at origin

      // Half-extents for auto-framing. Assembled = the model's own size; exploded
      // adds the furthest part offsets so the full fan still fits the panel.
      const maxAbs = (a: number, b: number) => Math.max(Math.abs(a), Math.abs(b));
      const offX = parts.map((p) => p.off.x);
      const offY = parts.map((p) => p.off.y);
      frame.hx = size.x / 2;
      frame.hy = size.y / 2;
      frame.exHx = size.x / 2 + maxAbs(Math.min(...offX, 0), Math.max(...offX, 0));
      frame.exHy =
        size.y / 2 +
        (Math.max(...offY, 0) - Math.min(...offY, 0)) / 2 +
        maxAbs(fanMid, 0);

      // Branding is now real geometry: the CADDIE logo + "CADDIE companion"
      // engraving is baked into the front/back scale parts (p05/p04) of the GLB
      // (merged from the SolidWorks export via scripts_merge_engraving.py), so it
      // rides with the scales during the explosion. No projected decal needed.

      setLoaded(true);

      // Pin the whole one-fold section in place; scrolling 420% of viewport
      // scrubs the explosion 0 → 1, then the section releases and scrolls on.
      st = ScrollTrigger.create({
        trigger: pinEl,
        start: "top top",
        end: canPin ? "+=85%" : "bottom top",
        pin: canPin ? pinEl : false,
        anticipatePin: 1,
        scrub: 0.6,
        onUpdate: (self) => {
          target.p = self.progress;
          setProgress(self.progress);
          wake();
        },
      });
      resize();
      ScrollTrigger.refresh();
    });

    window.addEventListener("resize", resize);
    resize();

    const clock = new THREE.Clock();
    renderer.setAnimationLoop(() => {
      const dt = Math.min(clock.getDelta(), 0.05);
      // critically-damped follow for buttery scrubbing
      const moving = Math.abs(target.p - current.p) > 1e-4;
      if (!dirty && !moving) return; // idle: nothing to redraw
      current.p += (target.p - current.p) * Math.min(1, dt * 6);
      const p = current.p;

      for (const part of parts) {
        const { node, off, start } = part;
        const t = smooth(start, start + 0.6, p);
        if (part.angle && part.pivot && part.axis) {
          // Rotate around the pivot (deploy/fold-out), then add any translation.
          // world = R·v + (pivot − R·pivot): so node.quat = R, node.pos = pivot − R·pivot.
          _q.setFromAxisAngle(part.axis, part.angle * t);
          _v.copy(part.pivot).applyQuaternion(_q);
          node.quaternion.copy(_q);
          node.position.copy(part.pivot).sub(_v).addScaledVector(off, t);
        } else {
          node.position.set(off.x * t, off.y * t, off.z * t);
        }
      }

      // Rotate from a 3/4 reveal toward a clean broadside as it explodes.
      // FRONT_YAW orients the logo (front) face toward the camera; π flips it
      // from the back side the model defaults to.
      const FRONT_YAW = 0;
      const spin = smooth(0, 0.55, p);
      root.rotation.y = FRONT_YAW + (1 - spin) * 0.7 + pointer.x * 0.18 * (0.4 + p);
      root.rotation.x = -0.12 * (1 - spin) + pointer.y * 0.08;

      // Auto-fit: pull the camera just far enough to frame the model (assembled)
      // → the full fan (exploded), aspect-aware so it fills the panel's width even
      // in a tall column. MARGIN < 1.0 lets it sit large with a little breathing room.
      const ex = smooth(0, 1, p);
      const midY = fanMid * ex;
      const halfTan = Math.tan((camera.fov * Math.PI) / 360);
      const W = frame.hx + (frame.exHx - frame.hx) * ex;
      const H = frame.hy + (frame.exHy - frame.hy) * ex;
      const MARGIN = 1.32;
      const dist = Math.max(W / (halfTan * camera.aspect), H / halfTan) * MARGIN;
      camera.position.z = dist;
      camera.position.y = midY;
      camera.lookAt(0, midY, 0);

      renderer.render(scene, camera);
      dirty = false; // settle until the next wake()
    });

    return () => {
      disposed = true;
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      st?.kill();
      envTex.dispose();
      pmrem.dispose();
      Object.values(matCache).forEach((m) => m.dispose());
      renderer.dispose();
      parts = [];
    };
  }, [pinRef]);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      <canvas ref={canvasRef} className="block h-full w-full" />

      {/* Progress + meta overlay */}
      <div className="pointer-events-none absolute inset-0">
        {/* top-right meta */}
        <div className="absolute right-6 top-6 text-right font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
          <div>Caddie Companion</div>
          <div className="text-zinc-600">No. 000001 · 34 parts</div>
        </div>

        {/* scroll hint, fades out once you start */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500 transition-opacity duration-500"
          style={{ opacity: progress < 0.03 ? 1 : 0 }}
        >
          scroll to disassemble ↓
        </div>
      </div>

      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center font-mono text-xs uppercase tracking-[0.3em] text-zinc-500">
          loading model…
        </div>
      )}
    </div>
  );
}
