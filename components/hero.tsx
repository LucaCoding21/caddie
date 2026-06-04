"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, SplitText);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);

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

      return () => split.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="sticky top-0 h-screen w-full overflow-hidden bg-black"
    >
      {/* Hero video — poster is the video's own first frame so there's no
          shot mismatch while it loads. */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.jpg"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Subtle bottom gradient for text legibility */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
      />

      <div className="relative z-10 flex min-h-screen items-end justify-end px-6 pb-12 md:px-16 md:pb-16">
        <div className="text-right">
          <h1
            ref={headingRef}
            className="font-brand font-medium uppercase text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight"
          >
            Everything
            <br />
            but the swing.
          </h1>
          <p
            ref={subRef}
            className="mt-4 text-white text-sm md:text-base tracking-wide [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]"
          >
            The multi-tool that earns its place in the bag.
          </p>
        </div>
      </div>
    </section>
  );
}
