"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const BRUSH =
  "/6v1/ChatGPT%20Image%20May%2024%2C%202026%2C%2012_02_58%20AM-nobg.png";
const DIVOT = "/6v1/divot-tool-nobg.png";
const OPENER = "/6v1/bottle-opener-nobg.png";
const MARKER = "/6v1/ball-marker-nobg.png";
const KNIFE = "/6v1/pocket-knife-nobg.png";
const DRIVER = "/6v1/torx-driver-nobg.png";
// Standalone studio shot of the real product (not in-hand).
const PRODUCT = "/caddie-companion.png";

const TOOLS: { label: string; src: string; desc: string }[] = [
  { label: "Divot Tool", src: DIVOT, desc: "Repairs your pitch marks." },
  { label: "Brush", src: BRUSH, desc: "Cleans out your grooves." },
  { label: "Ball Marker", src: MARKER, desc: "Magnetic, marks your line." },
  { label: "T25 Torx Driver", src: DRIVER, desc: "Dials in your driver." },
  { label: "Pocket Knife", src: KNIFE, desc: "Cuts tape and tags." },
  { label: "Bottle Opener", src: OPENER, desc: "Cracks one on the turn." },
];

export default function SixIntoOne() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Split the heading into its rendered lines, each wrapped in an
      // overflow-hidden mask so the line can rise up from behind it.
      // autoSplit re-runs onSplit once webfonts load (or on resize) so the
      // line breaks are always measured against the real font.
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
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 80%",
              once: true,
            },
            // The line mask clips to leading-[1.05], which would otherwise crop
            // descenders (the "g" in golfer). The clip is only needed while the
            // line rises from behind the mask — release it once settled.
            onComplete: () =>
              gsap.set(
                self.lines.map((l) => l.parentNode),
                { overflow: "visible" }
              ),
          }),
      });

      // The section's one scroll moment, performing the headline: the six
      // tools rise into the grid in a row-by-row cascade, the arrow draws,
      // then the product resolves last as the payoff. useGSAP's context
      // reverts this timeline + its ScrollTrigger on cleanup; the
      // reduced-motion early return above skips it entirely.
      const q = gsap.utils.selector(sectionRef);
      gsap
        .timeline({
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 75%",
            once: true,
          },
        })
        .from(q(".tool-tile"), {
          autoAlpha: 0,
          yPercent: 16,
          duration: 0.55,
          ease: "power3.out",
          stagger: { each: 0.12, grid: [2, 3], axis: "y", from: "start" },
        })
        .from(
          q(".converge-arrow"),
          { autoAlpha: 0, x: -10, duration: 0.4, ease: "power2.out" },
          "-=0.1"
        )
        .from(
          q(".hero-tile"),
          { autoAlpha: 0, scale: 0.92, duration: 0.8, ease: "power3.out" },
          "<"
        );

      return () => split.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative z-20 w-full bg-[#fafaf7] px-6 md:px-12 py-24 md:py-32"
    >
      <div className="max-w-[1440px] mx-auto">
        <h2
          ref={titleRef}
          className="font-inter font-medium text-black text-3xl sm:text-4xl md:text-5xl lg:text-[3.75rem] leading-[1.05] tracking-tight max-w-5xl"
        >
          Six tools every golfer carries.
          <br className="hidden sm:block" />
          <span className="text-zinc-400"> Now it&apos;s just this.</span>
        </h2>

        {/* Composition — convergence. The six tools sit as a tidy 3×2 grid on
            the left, flow through an arrow, and resolve into one dominant
            product on the right. The product wins the eye; the grid + arrow
            carry the "six → one" story. Stacks to grid-over-product on mobile
            (arrow hidden). */}
        <div className="mt-12 md:mt-16 grid items-start gap-8 md:grid-cols-[1fr_auto_1fr]">
          {/* The six — an aligned grid of equal tiles. Each shows its tool;
              the label + function line slide up on hover, and hovering lifts
              the tile above its neighbours. */}
          <div ref={gridRef} className="grid grid-cols-3 gap-3 md:gap-4">
            {TOOLS.map(({ label, src, desc }) => (
              <figure
                key={label}
                className="tool-tile group relative aspect-square overflow-hidden rounded-2xl bg-[#efeeea] ring-1 ring-black/5 transition-transform duration-500 hover:z-20 hover:scale-[1.05]"
              >
                <Image
                  src={src}
                  alt={label}
                  fill
                  className="object-contain p-3 pb-8"
                  sizes="(max-width: 768px) 30vw, 16vw"
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-3">
                  <span className="block font-inter text-xs font-medium uppercase tracking-wide text-zinc-500 md:text-sm">
                    {label}
                  </span>
                  <span className="mt-0.5 block translate-y-1 font-inter text-[11px] leading-snug text-zinc-400 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:text-xs">
                    {desc}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Flow cue — points the scatter at the product. Desktop only; the
              vertical stack makes the relationship obvious on mobile. */}
          <svg
            aria-hidden
            className="converge-arrow hidden h-6 w-12 self-center text-zinc-300 md:block"
            viewBox="0 0 48 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="2" y1="12" x2="40" y2="12" />
            <path d="M34 6 L44 12 L34 18" />
          </svg>

          {/* The one — dominant, raised on white. */}
          <figure className="hero-tile relative h-[20rem] md:h-[28rem] overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
            <Image
              src={PRODUCT}
              alt="The Caddie Companion multi-tool"
              fill
              className="object-contain p-8 md:p-12"
              sizes="(max-width: 768px) 100vw, 44vw"
              priority
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-baseline justify-between p-5 md:p-6">
              <span className="font-inter text-xl md:text-2xl font-medium text-black tracking-tight">
                Caddie Companion
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                One tool
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
