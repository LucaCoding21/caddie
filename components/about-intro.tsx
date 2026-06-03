"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/**
 * The hero intro copy ("Caddie started with a pocket full…"). Server text lives
 * here in a client wrapper so the page can stay a server component and keep
 * exporting metadata — same split as AboutTitle. The eyebrow fades up, then each
 * paragraph's lines rise out of a mask, the house idiom used across the site.
 */
export function AboutIntro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const trigger = { trigger: rootRef.current, start: "top 80%", once: true };

      gsap.from(eyebrowRef.current, {
        opacity: 0,
        y: 14,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: trigger,
      });

      // Line-mask rise across both paragraphs together, lightly staggered.
      const split = SplitText.create(copyRef.current!.querySelectorAll("p"), {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1,
            ease: "power4.out",
            stagger: 0.08,
            delay: 0.15,
            scrollTrigger: trigger,
            // Release the mask so line-height stops cropping descenders.
            onComplete: () =>
              gsap.set(
                self.lines.map((l) => l.parentNode),
                { overflow: "visible" }
              ),
          }),
      });

      return () => split.revert();
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="mx-auto mt-10 max-w-2xl text-center md:mt-14">
      <p
        ref={eyebrowRef}
        className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400"
      >
        Caddie Companion
      </p>
      <div
        ref={copyRef}
        className="mt-5 space-y-5 font-inter text-zinc-600 text-base leading-[1.6] md:text-lg"
      >
        <p>
          Caddie started with a pocket full of single-use gadgets and one simple
          idea: fold the six tools every golfer actually reaches for into one
          frame, machined to last a lifetime of rounds.
        </p>
        <p>
          We obsess over the parts you never think about, like the pivot screw,
          the spring of the brush, and the way it sits flat in your pocket, so
          that out on the course it just works, and then gets out of the way.
        </p>
      </div>
    </div>
  );
}
