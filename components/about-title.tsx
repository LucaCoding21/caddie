"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, SplitText);

/**
 * The oversized "About" wordmark in the hero. Server-rendered text lives in
 * the page; this client wrapper just owns the load animation so the page can
 * keep exporting metadata. Each letter drops in from above on initial load.
 */
export function AboutTitle() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Split into characters, masked per char so each letter rises into view
      // from below rather than spilling over the letters around it.
      const split = SplitText.create(titleRef.current, {
        type: "chars",
        mask: "chars",
        onSplit: (self) =>
          gsap.from(self.chars, {
            yPercent: 120,
            opacity: 0,
            duration: 1,
            ease: "power4.out",
            stagger: 0.12,
          }),
      });

      return () => split.revert();
    },
    { scope: titleRef }
  );

  return (
    <h1
      ref={titleRef}
      className="select-none whitespace-nowrap text-center font-inter font-semibold uppercase leading-[0.85] tracking-[-0.04em] text-zinc-200 text-[24vw] xl:text-[22rem]"
    >
      About
    </h1>
  );
}
