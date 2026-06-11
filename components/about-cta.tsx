"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import CaddieFan from "@/components/caddie-fan";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/**
 * The closing CTA banner ("Ready to clean up your carry?"). Heading rises out of
 * a line mask; the copy and button fade up just after; the fanned colour lineup
 * slides in from the right with a slight unrotate, so the spilled product shot
 * feels like it's being laid down. Mirrors the site's reveal idioms.
 */
export default function AboutCta() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const trigger = {
        trigger: sectionRef.current,
        start: "top 75%",
        once: true,
      };

      gsap.from([copyRef.current, ctaRef.current], {
        opacity: 0,
        y: 18,
        duration: 0.9,
        ease: "power2.out",
        stagger: 0.12,
        delay: 0.3,
        scrollTrigger: trigger,
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
            scrollTrigger: trigger,
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
      className="mx-auto max-w-[1440px] px-6 pt-16 pb-28 md:px-12 md:pt-32 md:pb-36"
    >
      <div className="relative mx-auto max-w-6xl rounded-md bg-[#EAEAEA]">
        <div className="grid items-center gap-8 md:grid-cols-2">
          {/* Copy side. */}
          <div className="px-8 py-10 md:px-12 md:py-12">
            <h2
              ref={titleRef}
              className="max-w-md font-brand text-3xl font-medium tracking-[-0.02em] text-black md:text-[2.5rem] md:leading-[1.1]"
            >
              Ready to clean up
              <br />
              your carry?
            </h2>
            <p
              ref={copyRef}
              className="mt-4 max-w-xs font-inter text-base leading-[1.6] text-zinc-600"
            >
              Six tools machined into one pocket-sized frame. Pick your finish
              and trade the gadget drawer for something built to last.
            </p>
            <Link
              ref={ctaRef}
              href="/select-color"
              className="mt-8 inline-flex items-center rounded-md bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Get your Caddie Companion
            </Link>
          </div>

          {/* Image side — the animated fan. Its own two containers crop the
              bottom and let the splayed tops spill up past the panel edge. */}
          <div className="relative h-[190px] md:h-full md:min-h-[240px]">
            <CaddieFan />
          </div>
        </div>
      </div>
    </section>
  );
}
