"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import CaddieExplodeCanvas from "@/components/CaddieExplodeCanvas";
import { PRODUCT } from "@/lib/products";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// The 30% spec strip — hard numbers as proof, kept in one contained zone so the
// warm copy above stays warm. Values come from lib/products.ts so this stays in
// sync with the buy page.
const SPECS: { stat: string; label: string }[] = [
  ...PRODUCT.specs.map((s) => ({ stat: s.value, label: s.label })),
  { stat: String(PRODUCT.colors.length), label: "Colours" },
];

export default function ExplodedView() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

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

      return () => split.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      data-nav-dark
      className="relative z-20 w-full bg-[#0b0b0d] px-6 md:px-12 lg:h-screen lg:overflow-hidden"
    >
      <div className="mx-auto grid h-full max-w-[1440px] grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        {/* Left column — text + legend + stats, all in one fold. */}
        <div className="py-24 md:py-32 lg:flex lg:h-full lg:flex-col lg:justify-center lg:py-0">
          <p
            ref={eyebrowRef}
            className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500"
          >
            Exploded view
          </p>
          <h2
            ref={titleRef}
            className="mt-4 max-w-md font-inter font-medium text-white text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] leading-[1.05] tracking-tight"
          >
            Every part, by design.
          </h2>
          {/* The 70% — warm craftsmanship story. SAMPLE COPY (voice B, golfer-leaning). */}
          <p className="mt-5 max-w-lg font-inter text-zinc-300 text-sm md:text-base leading-[1.65]">
            No castings, no stamped parts. Each Caddie Companion pairs a
            stainless steel inner shell and tools with a hand-finished
            anodized aluminum exterior, folded down small enough to forget,
            built to hold up season after season in the bottom of your bag.
          </p>

          {/* The 30% — contained spec strip. */}
          <dl className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-5">
            {SPECS.map(({ stat, label }) => (
              <div key={label}>
                <dt className="font-inter text-xl font-medium tracking-tight text-white lg:text-lg">
                  {stat}
                </dt>
                <dd className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 lg:text-[9px]">
                  {label}
                </dd>
              </div>
            ))}
          </dl>

          {/* Materials, same contained zone as the spec strip. */}
          <div className="mt-6 max-w-md">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 lg:text-[9px]">
              Materials
            </p>
            <ul className="mt-2 space-y-1">
              {PRODUCT.materials.map((m) => (
                <li
                  key={m}
                  className="font-inter text-sm leading-[1.6] text-zinc-300"
                >
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right column — the dotted technical panel holding the live 3D model.
            Fills the fold; the section pins so the model explodes in place. */}
        <div className="h-[60vh] pb-10 lg:h-full lg:py-12">
          <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e11]">
            {/* The WebGL canvas is transparent, so these dots show through. */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.22) 1.3px, transparent 1.3px)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="relative z-10 h-full w-full">
              <CaddieExplodeCanvas pinRef={sectionRef} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
