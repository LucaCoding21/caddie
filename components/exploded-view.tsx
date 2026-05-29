"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// The illustration sliced into four layers by connected-component analysis, so
// each is a full-canvas transparent PNG that stacks back into the original. The
// `from` offsets below converge the layers toward the centre; scrolling tweens
// them back to 0 (their drawn positions) — i.e. the parts fly apart.
const LAYERS = [
  { src: "/exploded-top.png", from: { yPercent: 24, xPercent: 7 } },
  { src: "/exploded-upper.png", from: { yPercent: 13, xPercent: 3 } },
  { src: "/exploded-center.png", from: { yPercent: 1, xPercent: 0 } },
  { src: "/exploded-bottom.png", from: { yPercent: -24, xPercent: -7 } },
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

      // Scrub the explode to scroll: layers start converged toward the centre
      // and spread out to their drawn positions as the section reaches centre.
      // Reverses on scroll-up, so it reads as an assemble/explode you can drive.
      const q = gsap.utils.selector(figureRef);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: figureRef.current,
          start: "top 50%",
          end: "center 52%",
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
      className="relative z-20 w-full bg-[#fafaf7] px-6 md:px-12 py-24 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p
            ref={eyebrowRef}
            className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400"
          >
            Exploded view
          </p>
          <h2
            ref={titleRef}
            className="mx-auto mt-5 max-w-2xl font-inter font-medium text-black text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.05] tracking-tight"
          >
            Every part, by design.
          </h2>
          <p className="mx-auto mt-6 max-w-xl font-inter text-zinc-500 text-base md:text-lg leading-[1.5]">
            From the pivot screw to the brass brush, each piece is machined to
            fold into one frame.
          </p>
        </div>

        {/* Stacked layers reconstruct the full illustration; each is animated
            independently for the explode. */}
        <div ref={figureRef} className="relative mt-14 md:mt-20 aspect-[1999/1545] w-full">
          {LAYERS.map(({ src }) => (
            <div key={src} className="ev-layer absolute inset-0 will-change-transform">
              <Image
                src={src}
                alt=""
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1024px"
              />
            </div>
          ))}
          {/* One layer carries the alt text for the whole diagram (a11y). */}
          <span className="sr-only">
            Exploded view of the Caddie Companion: handle scales, pivot screw and
            pin, divot repair tool, knife blade, bottle opener, and brass brush.
          </span>
        </div>
      </div>
    </section>
  );
}
