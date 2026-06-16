"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/**
 * The hero intro copy ("Caddie Companion started with a pocket full…"), now in a
 * two-column layout: the montage film on the left, the copy on the right.
 * Server text lives here in a client wrapper so the page can stay a server
 * component and keep exporting metadata. The eyebrow fades up, then each
 * paragraph's lines rise out of a mask, the house idiom used across the site.
 */
export function AboutIntro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const trigger = { trigger: rootRef.current, start: "top 80%", once: true };

      // Eyebrow fades up first, then the paragraphs rise out of the mask.
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
    <div ref={rootRef} className="mx-auto mt-64 max-w-[100rem] px-6 md:mt-80">
      <div className="grid items-center gap-10 md:grid-cols-[2.7fr_1fr] md:gap-14">
        {/* Montage — self-hosted muted loop, like a background film: no player
            chrome, no controls, no flash. The clip is already trimmed to the
            chosen segment, so it just loops the whole file. */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-zinc-100 ring-1 ring-black/5">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Caddie Companion montage"
          >
            <source src="/videos/caddie-montage.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Copy — on the right, left-aligned beside the film. */}
        <div className="text-left">
          <p
            ref={eyebrowRef}
            className="mb-6 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400"
          >
            Caddie Companion
          </p>
          <div
            ref={copyRef}
            className="space-y-5 font-inter text-zinc-600 text-base leading-[1.6] md:text-lg"
          >
            <p>
              Caddie Companion started with a pocket full of single-use gadgets
              and one simple idea: fold the six tools every golfer actually
              reaches for into one frame, machined to last a lifetime of rounds.
            </p>
            <p>
              We obsess over the parts you never think about, like the pivot
              screw, the spring of the brush, and the way it sits flat in your
              pocket, so that out on the course it just works, and then gets out
              of the way.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
