"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, SplitText);

// Tiny (16px) blurred previews, inlined so they paint instantly while the
// full hero downloads — no blank black frame on first load. Generated from the
// source images with sharp.
const MOBILE_BLUR =
  "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAACwAwCdASoQABwAPu1iqU2ppaOiMAgBMB2JYgC7ACHfhmljLxm0AAD+2M6u0jXOQ3/h3Cq1gwjyhOvmy/BskGQfcrQ8a19kSr45UbfsbipSkoFgW6Ng8sQA";
const DESKTOP_BLUR =
  "data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAADQAQCdASoQAAkAA4BaJZgCdAEPAg/zAAD+6+GQhfXBU7t9dXsUzBpjw7c2RD5YAAA=";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
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

      // Subtitle fades up just after the headline lines land.
      gsap.from(subRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.8,
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
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="sticky top-0 h-svh w-full overflow-hidden bg-black"
    >
      {/* Hero image — selected by viewport orientation, not width: any portrait
          viewport (phone or tablet held tall) gets the dedicated portrait crop,
          since the wide shot zooms in and crops the tool. Landscape viewports
          (tablet landscape, laptops, desktops) get the wide shot. */}
      {/* fetchPriority="high" (not preload) is the right hint here: only one of
          these two is ever visible per viewport, so preloading both would fetch
          a hidden image. The off-orientation image stays lazy and never loads;
          the visible one — already in the viewport — loads eagerly at high
          priority. */}
      <Image
        src="/caddie-mobile-hero.webp"
        alt=""
        fill
        fetchPriority="high"
        placeholder="blur"
        blurDataURL={MOBILE_BLUR}
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover object-center landscape:hidden"
      />
      <Image
        src="/hero-caddie2.webp"
        alt=""
        fill
        fetchPriority="high"
        placeholder="blur"
        blurDataURL={DESKTOP_BLUR}
        sizes="100vw"
        className="absolute inset-0 hidden h-full w-full object-cover object-[20%_center] landscape:block"
      />

      {/* Subtle top gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1/5 bg-gradient-to-b from-black/60 via-black/10 to-transparent"
      />

      {/* Subtle bottom gradient for text legibility */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
      />

      <div className="relative z-10 flex min-h-svh items-end justify-end px-6 pb-12 md:px-16 md:pb-16">
        <div className="text-right">
          <h1
            ref={headingRef}
            className="font-brand font-bold uppercase text-white text-4xl min-[420px]:text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight"
          >
            Everything
            <br />
            but the swing.
          </h1>
          <p
            ref={subRef}
            className="mt-4 text-white text-base md:text-base tracking-wide [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]"
          >
            The multi-tool that earns its place in the bag.
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
    </section>
  );
}
