"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  SplitText,
  DrawSVGPlugin,
  ScrambleTextPlugin
);

/**
 * Tool callouts for the full-bleed anatomy photo.
 *
 * Coordinates are percentages of the image box (0–100), so they map directly
 * onto the photo regardless of rendered size. `node` is the dot on the part;
 * `points` is the SVG connector polyline (node → elbow → label edge); `label`
 * is where the text block sits and which edge the line meets:
 *   right  → text left-aligned, grows rightward from {x}
 *   left   → text right-aligned, ends at {x}
 * Tweak these against the rendered screenshot — see comment block below.
 */
type Side = "left" | "right";

type Callout = {
  n: string;
  title: string;
  desc: string;
  // The "everything it replaces" photo this tool stands in for.
  src: string;
  // Place the photo below the text instead of above — for the bottom-most
  // callout in a gutter, where an above-text photo would collide with the
  // callout stacked above it.
  imgBelow?: boolean;
  node: [number, number];
  points: string;
  label: { x: number; y: number; side: Side; maxWidth?: string };
};

// Coordinates are calibrated to the wrapper box. The photo is centred at 70%
// width (so it occupies x:[15,85]); the node X values are the original photo
// coords remapped through x' = 15 + 0.70·x so the dots still land on the tool.
// Labels live out in the wide side gutters ([0,15] and [85,100]) — that extra
// room is what keeps them from crowding the photo.
const CALLOUTS: Callout[] = [
  {
    n: "01",
    title: "Magnetic Ball Markers",
    desc: "Two, seated in the body",
    src: "/6v1/ball-marker-nobg.png",
    node: [32, 45],
    points: "32,45 32,20 -12,20",
    label: { x: -12, y: 20, side: "right", maxWidth: "22rem" },
  },
  {
    n: "02",
    title: "T25 Torx Driver",
    desc: "Tunes adjustable clubs",
    src: "/6v1/torx-driver-nobg.png",
    node: [72, 35],
    points: "72,35 72,20 99,20",
    label: { x: 99, y: 20, side: "left", maxWidth: "22rem" },
  },
  {
    n: "03",
    title: "Divot Repair Fork",
    desc: "Fixes pitch marks",
    src: "/6v1/divot-tool-nobg.png",
    node: [69, 57],
    points: "69,57 86,53 99,53",
    label: { x: 99, y: 53, side: "left" },
  },
  {
    n: "04",
    title: "Knife",
    desc: "Full-tang, stainless",
    src: "/6v1/pocket-knife-nobg.png",
    node: [65, 73],
    points: "65,73 86,86 112,86",
    label: { x: 112, y: 86, side: "left" },
  },
  {
    n: "05",
    title: "Bottle Opener",
    desc: "For the 19th hole",
    src: "/6v1/bottle-opener-nobg.png",
    imgBelow: true,
    node: [55, 66],
    points: "55,66 27,91 1,91",
    label: { x: 1, y: 91, side: "right" },
  },
  {
    n: "06",
    title: "Brass Wire Brush",
    desc: "Cleans grooves",
    src: "/6v1/ChatGPT%20Image%20May%2024%2C%202026%2C%2012_02_58%20AM-nobg.png",
    node: [32, 74],
    points: "32,74 32,60 1,60",
    label: { x: 1, y: 60, side: "right" },
  },
];

// The photo only fills the central 70% of the wrapper, so each gutter is ~15%
// of the box — plenty of room for the two text lines at this cap.
const LABEL_MAX_WIDTH = "20rem";

export default function Anatomy() {
  const sectionRef = useRef<HTMLElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Same line-mask rise as SixIntoOne: split each block into its rendered
      // lines, mask each behind overflow-hidden, then sweep them up from below.
      // autoSplit re-measures once webfonts load / on resize. The title leads;
      // the description trails by a beat so the eye lands left-then-right.
      const reveal = (
        el: Element | null,
        { delay = 0 }: { delay?: number } = {}
      ) =>
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1,
              ease: "power4.out",
              stagger: 0.15,
              delay,
              scrollTrigger: {
                trigger: titleRef.current,
                start: "top 80%",
                once: true,
              },
              // Release the line mask once settled so leading-[1.05] stops
              // cropping descenders (the "g" in golfer).
              onComplete: () =>
                gsap.set(
                  self.lines.map((l) => l.parentNode),
                  { overflow: "visible" }
                ),
            }),
        });

      const splits = [reveal(titleRef.current)];

      // The callout overlay only renders at lg, so scope its reveal to that
      // breakpoint — matchMedia cleans the timeline up if the viewport drops
      // below it (where the lines/labels are display:none and undrawable).
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const q = gsap.utils.selector(diagramRef);

        // Capture each label's final text, then hide it — the scramble tween
        // resolves back to this string. Read now, while the DOM still holds the
        // real copy (before any scramble has overwritten it).
        const labelLines = q(".anatomy-label-line");
        const finalText = labelLines.map((el) => el.textContent ?? "");
        gsap.set(labelLines, { autoAlpha: 0 });

        // The replaced-tool thumbnails fade in with their callout (one per
        // callout), so hide them up front too.
        const labelImgs = q(".anatomy-label-img");
        gsap.set(labelImgs, { autoAlpha: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: diagramRef.current,
            start: "top 70%",
            once: true,
          },
        });

        // Nodes pop on first, then each line draws outward from its node.
        tl.from(q(".anatomy-node"), {
          autoAlpha: 0,
          scale: 0,
          transformOrigin: "center",
          duration: 0.3,
          ease: "back.out(2)",
          stagger: 0.1,
        }).from(
          q(".anatomy-line"),
          { drawSVG: 0, duration: 0.5, ease: "power2.out", stagger: 0.1 },
          "<"
        );

        // Each label scrambles into place just as its line arrives — line i
        // lands ~i*0.1s in, so kick off that label's scramble a beat after.
        // The line fades in (autoAlpha) while the plugin churns random glyphs
        // and resolves them left-to-right into the captured text. Each label is
        // two lines (title + desc), so step the timeline by two per callout.
        labelLines.forEach((el, i) => {
          tl.to(
            el,
            {
              autoAlpha: 1,
              duration: 1.6,
              ease: "power2.out",
              scrambleText: {
                text: finalText[i],
                chars: "upperCase",
                speed: 0.3,
              },
            },
            0.25 + Math.floor(i / 2) * 0.1
          );
        });

        // Fade each thumbnail in on the same beat as its callout's text.
        labelImgs.forEach((el, j) => {
          tl.to(
            el,
            { autoAlpha: 1, duration: 0.6, ease: "power2.out" },
            0.25 + j * 0.1
          );
        });

        return () => {
          gsap.set(labelImgs, { clearProps: "all" });
          gsap.set(labelLines, { clearProps: "all" });
          labelLines.forEach((el, i) => {
            el.textContent = finalText[i];
          });
        };
      });

      return () => {
        splits.forEach((s) => s.revert());
        mm.revert();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative z-20 w-full bg-[#fafaf7] pt-32 md:pt-44 pb-24 md:pb-32 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:grid-rows-[auto_auto_auto] lg:items-center lg:gap-x-8 lg:gap-y-0 lg:pt-28 lg:pb-24"
    >
      {/* Section heading + intro, on top of the diagram. */}
      <div className="w-full max-w-5xl px-6 lg:pl-28 mb-16 md:mb-24 lg:mb-0 text-left lg:col-start-1 lg:row-start-1 lg:self-end">
        <h2
          ref={titleRef}
          className="font-inter font-medium text-black text-3xl sm:text-4xl md:text-5xl lg:text-5xl leading-[1.05] tracking-tight"
        >
          Six tools every golfer carries.
          <br className="hidden sm:block" />
          <span className="text-[#768dc5]"> Now it&apos;s just this.</span>
        </h2>
        <p className="mt-8 md:mt-10 max-w-2xl font-inter text-zinc-600 text-base md:text-lg leading-[1.5]">
          Every tool swings out of a single milled frame. Repair a pitch mark,
          clean your grooves, mark your line, tune your driver, cut, and crack
          one at the turn.
        </p>
      </div>

      {/* Closing line — replaces the old spec strip. Anchored in the section's
          bottom-right gutter (third grid row); on smaller screens it stacks
          under the diagram. */}
      <div className="w-full max-w-md px-6 mt-12 lg:mt-0 lg:px-0 lg:pr-28 lg:w-[36rem] lg:max-w-none lg:col-start-2 lg:row-start-3 lg:self-start lg:justify-self-end">
        <p className="font-inter text-base leading-[1.5] text-zinc-600 md:text-lg lg:text-right">
          It all folds into one piece, small enough for a pocket. Nothing to
          rattle, nothing to lose.
        </p>
      </div>

      {/* Relative wrapper sized to the image — annotations are absolutely
          positioned in here, so percentage coords map onto the photo. */}
      <div ref={diagramRef} className="relative mx-auto mt-24 mb-32 md:mt-36 md:mb-48 lg:mt-12 lg:mb-20 w-full max-w-5xl lg:max-w-[112vh] lg:col-span-2 lg:row-start-2 lg:self-center lg:justify-self-center">
        <Image
          src="/caddie-companion.png"
          alt="Caddie Companion folded fully open, every tool fanned out"
          width={1080}
          height={1080}
          className="mx-auto block h-auto w-full lg:w-[70%]"
          sizes="(max-width: 1024px) 100vw, 56rem"
        />

        {/* Connector lines. viewBox 0–100 + preserveAspectRatio=none lets us
            author endpoints in % space; non-scaling-stroke keeps lines crisp.
            Hidden on small screens — see the mobile legend below. */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible text-zinc-500/40 lg:block"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
        >
          {CALLOUTS.map((c) => (
            <polyline
              key={c.n}
              className="anatomy-line"
              points={c.points}
              stroke="currentColor"
              strokeWidth={1}
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        {/* Nodes (square markers on each part) */}
        <div aria-hidden className="absolute inset-0 hidden lg:block">
          {CALLOUTS.map((c) => (
            <span
              key={c.n}
              className="anatomy-node absolute h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 bg-zinc-900 outline outline-2 outline-[#fafaf7]/80"
              style={{ left: `${c.node[0]}%`, top: `${c.node[1]}%` }}
            />
          ))}
        </div>

        {/* Labels */}
        <div className="absolute inset-0 hidden lg:block">
          {CALLOUTS.map((c) => {
            const right = c.label.side === "right";
            return (
              <div
                key={c.n}
                className={`anatomy-label absolute -translate-y-1/2 ${
                  right ? "text-left" : "text-right"
                }`}
                style={{
                  // Right-gutter labels are anchored by their right edge so
                  // shrink-to-fit measures the room growing *leftward* (up to
                  // maxWidth), not the sliver between left:x% and the container
                  // edge — otherwise the text collapses to its longest word.
                  ...(right
                    ? { left: `${c.label.x}%` }
                    : { right: `${100 - c.label.x}%` }),
                  top: `${c.label.y}%`,
                  maxWidth: c.label.maxWidth ?? LABEL_MAX_WIDTH,
                }}
              >
                {/* Lifted above the text block (out of flow) so the connector
                    line — which meets the label horizontally at its center —
                    lands on the text, not across the photo. */}
                <Image
                  src={c.src}
                  alt=""
                  width={120}
                  height={120}
                  className={`anatomy-label-img absolute h-20 w-20 object-contain ${
                    c.imgBelow ? "top-full mt-2" : "bottom-full mb-2"
                  } ${right ? "left-0" : "right-0"}`}
                />
                <div className="anatomy-label-line font-mono text-xs font-medium uppercase leading-tight text-zinc-900 md:text-sm">
                  {c.title}
                </div>
                <div className="anatomy-label-line mt-1 font-mono text-[11px] leading-tight text-zinc-500 md:text-xs">
                  {c.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
