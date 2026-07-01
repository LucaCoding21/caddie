"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, SplitText);

// The animated hero copy. Split out of the hero so the LCP photo can live in a
// static server component (markup the preload scanner sees immediately) while
// only this overlay carries the GSAP client bundle.
export default function HeroCopy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Headline: split into lines, each masked so it rises up from behind.
      // autoSplit re-measures once the Montserrat webfont loads.
      const split = SplitText.create(headingRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.1,
            ease: "power4.out",
            stagger: 0.15,
            delay: 0.1,
          }),
      });

      // Tagline (former headline, now a subheading) fades up after the lines land.
      gsap.from(taglineRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.7,
      });

      // CTA fades up a beat after the subtitle (mobile only — it's hidden at sm+).
      gsap.from(ctaRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out",
        delay: 1.2,
      });

      return () => split.revert();
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative z-10 flex min-h-svh items-end justify-end px-6 pb-12 md:px-16 md:pb-16"
    >
      <div className="text-right">
        <h1
          ref={headingRef}
          className="font-brand font-bold uppercase text-white text-4xl min-[420px]:text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight"
        >
          6-in-1 Golf Multi-Tool
        </h1>
        <p
          ref={taglineRef}
          className="mt-4 text-white text-xl md:text-2xl font-normal tracking-wide [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]"
        >
          Everything but the swing.
        </p>

        {/* Mobile-only buy CTA. On desktop the persistent header pill carries
            the order action, so this is hidden at sm+. */}
        <div ref={ctaRef} className="mt-6 sm:hidden">
          <Link
            href="/select-color"
            className="inline-flex flex-col items-start gap-0.5 rounded-3xl bg-white py-2.5 pl-5 pr-7 text-accent shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] transition-colors active:bg-white/90"
          >
            <span className="flex items-center gap-2 text-base font-medium">
              Order now
              <span className="text-accent/40" aria-hidden>
                ·
              </span>
              <span className="tabular-nums">$29</span>
            </span>
            {/* Free-shipping nudge — desktop carries this inside the header
                pill, which is hidden on mobile, so tuck it into the CTA. */}
            <span className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Buy 2, get free shipping
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
