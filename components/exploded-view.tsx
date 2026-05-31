"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// The dark technical illustration sliced into five pieces by connected-component
// analysis, so each is a full-canvas transparent PNG that stacks back into the
// original. The `from` offsets converge the pieces toward the centre; scrolling
// tweens them back to 0 (their drawn positions) — i.e. the parts fly apart.
const LAYERS = [
  { src: "/explode2-top.png", from: { yPercent: 19.4, xPercent: 7.9 } },
  { src: "/explode2-plate.png", from: { yPercent: 11.9, xPercent: 2.2 } },
  { src: "/explode2-pivot.png", from: { yPercent: 7.2, xPercent: 2.3 } },
  { src: "/explode2-body.png", from: { yPercent: -0.7, xPercent: 2.7 } },
  { src: "/explode2-bottom.png", from: { yPercent: -15.5, xPercent: -0.7 } },
];

// A parts legend keyed to the diagram — numbered top-to-bottom in the same
// order the pieces stack on the right, so it reads like a technical key rather
// than a product spec sheet.
const PARTS: { name: string; note: string }[] = [
  { name: "Handle scales", note: "Anodised 6061 aluminium, in your colour" },
  { name: "Pivot screw & pin", note: "Stainless — the hinge it all folds on" },
  { name: "Knife & divot tool", note: "The business end, ground from one billet" },
  { name: "Tool stack", note: "Marker, T25 driver and bottle opener" },
  { name: "Brass brush", note: "Clears your grooves between shots" },
];

export default function ExplodedView() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const headTrigger = { trigger: titleRef.current, start: "top 85%", once: true };

      gsap.from(eyebrowRef.current, {
        opacity: 0,
        y: 14,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: headTrigger,
      });

      const split = SplitText.create(titleRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1,
            ease: "power4.out",
            stagger: 0.15,
            scrollTrigger: headTrigger,
            // Release the mask so leading-[1.05] stops cropping the "g" descender.
            onComplete: () =>
              gsap.set(
                self.lines.map((l) => l.parentNode),
                { overflow: "visible" }
              ),
          }),
      });

      // Scrub the explode to scroll: pieces start converged toward the centre
      // and spread out to their drawn positions as the figure reaches centre.
      // Reverses on scroll-up, so it reads as an assemble/explode you can drive.
      const q = gsap.utils.selector(figureRef);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: figureRef.current,
          start: "top 75%",
          end: "center 55%",
          scrub: true,
        },
      });
      q<HTMLDivElement>(".ev-layer").forEach((layer, i) => {
        tl.from(layer, { ...LAYERS[i].from, ease: "none" }, 0);
      });

      return () => split.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      data-nav-dark
      className="relative z-20 w-full bg-[#0b0b0d] px-6 md:px-12 py-24 md:py-32"
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-stretch gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        {/* Left column — context + spec tables */}
        <div className="text-left">
          <p
            ref={eyebrowRef}
            className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500"
          >
            Exploded view
          </p>
          <h2
            ref={titleRef}
            className="mt-5 max-w-md font-inter font-medium text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.05] tracking-tight"
          >
            Every part, by design.
          </h2>
          <p className="mt-6 max-w-md font-inter text-zinc-400 text-base md:text-lg leading-[1.5]">
            From the pivot screw to the brass brush, each piece is machined to
            fold into one frame. Scroll to pull it apart.
          </p>

          {/* Parts legend — numbered to match the diagram, top to bottom. */}
          <ol className="mt-12 max-w-md border-t border-white/10">
            {PARTS.map(({ name, note }, idx) => (
              <li
                key={name}
                className="flex items-baseline gap-5 border-b border-white/10 py-4"
              >
                <span className="font-mono text-xs tabular-nums text-zinc-600">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-inter text-base font-medium text-white">
                    {name}
                  </p>
                  <p className="mt-0.5 font-inter text-sm leading-snug text-zinc-500">
                    {note}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {/* Headline meta — three quick numbers, not a spec table. */}
          <div className="mt-10 flex gap-10">
            {[
              { stat: "6", unit: "tools in one" },
              { stat: "62g", unit: "in your pocket" },
              { stat: "4", unit: "colourways" },
            ].map(({ stat, unit }) => (
              <div key={unit}>
                <p className="font-inter text-2xl font-medium tracking-tight text-white md:text-3xl">
                  {stat}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                  {unit}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — dotted panel with the layered illustration. Each
            layer animates independently for the explode; transparent gaps let
            the dotted backdrop show through. */}
        <div className="relative flex h-full min-h-[28rem] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e11] p-4 md:p-6">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.22) 1.3px, transparent 1.3px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div
            ref={figureRef}
            className="relative z-10 aspect-[1600/1236] w-full"
          >
            {LAYERS.map(({ src }) => (
              <div key={src} className="ev-layer absolute inset-0 will-change-transform">
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 92vw, 600px"
                />
              </div>
            ))}
            {/* One layer carries the alt text for the whole diagram (a11y). */}
            <span className="sr-only">
              Exploded view of the Caddie Companion: handle scales, pivot screw
              and pin, divot repair tool, knife blade, bottle opener, and brass
              brush.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
