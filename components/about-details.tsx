"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/**
 * The editorial "Caddie Details" gallery. The image frames reveal with a soft
 * rise + scale-settle (the photo over-scales inside a clipped frame, then eases
 * back), staggered left-to-right; the eyebrow fades, the heading rises out of a
 * line mask, and the body trails. Same GSAP idioms as the home-page sections.
 */
export default function AboutDetails() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const trigger = {
        trigger: sectionRef.current,
        start: "top 75%",
        once: true,
      };

      const q = gsap.utils.selector(sectionRef);

      // Clip-path reveal — each frame is wiped open from the bottom up, while
      // the photo inside eases back from a slight over-scale so it resolves into
      // focus as it's uncovered. Staggered left-to-right.
      gsap.fromTo(
        q(".about-detail-frame"),
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.1,
          ease: "power3.inOut",
          stagger: 0.12,
          scrollTrigger: trigger,
        }
      );
      gsap.from(q(".about-detail-img"), {
        scale: 1.15,
        duration: 1.4,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: trigger,
      });

      gsap.from(eyebrowRef.current, {
        opacity: 0,
        y: 14,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: trigger,
      });
      gsap.from(bodyRef.current, {
        opacity: 0,
        y: 18,
        duration: 0.9,
        ease: "power2.out",
        delay: 0.25,
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
      className="mx-auto max-w-[1440px] px-6 pt-16 pb-20 md:px-12 md:pt-32 md:pb-28"
    >
      <div className="grid gap-6 md:grid-cols-12 md:gap-8">
        {/* Left — feature shot, caption, then heading + body. */}
        <div className="flex flex-col md:col-span-4">
          <div className="about-detail-frame relative aspect-square w-full overflow-hidden bg-[#efeeea]">
            <Image
              src="/productshot-black.png"
              alt=""
              fill
              className="about-detail-img object-cover"
              sizes="(max-width: 768px) 90vw, 460px"
            />
          </div>
          <p
            ref={eyebrowRef}
            className="mt-4 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400"
          >
            Caddie Companion
          </p>
          <h2
            ref={titleRef}
            className="mt-6 font-brand text-2xl font-medium tracking-tight text-black"
          >
            Caddie Details
          </h2>
          <p
            ref={bodyRef}
            className="mt-3 max-w-sm font-inter text-sm leading-[1.6] text-zinc-500"
          >
            Every fold earns its place. The divot tool, groove brush, ball
            marker, and driver key nest into one machined frame, so the thing
            that lives in your pocket does the work of six, and never gets in the
            way.
          </p>
        </div>

        {/* Center — tall hero frame. */}
        <div className="about-detail-frame relative aspect-[3/4] w-full overflow-hidden bg-[#efeeea] md:col-span-5 md:aspect-auto">
          <Image
            src="/pocket-carry.jpg"
            alt=""
            fill
            className="about-detail-img object-cover"
            sizes="(max-width: 768px) 90vw, 600px"
          />
        </div>

        {/* Right — stacked detail crops. */}
        <div className="flex flex-col gap-6 md:col-span-3 md:gap-8">
          <div className="about-detail-frame relative aspect-[4/3] w-full overflow-hidden bg-[#efeeea]">
            <Image
              src="/cad-technical.jpeg"
              alt=""
              fill
              className="about-detail-img object-cover"
              sizes="(max-width: 768px) 90vw, 360px"
            />
          </div>
          <div className="about-detail-frame relative aspect-[4/3] w-full flex-1 overflow-hidden bg-[#efeeea]">
            <Image
              src="/on-course.jpg"
              alt=""
              fill
              className="about-detail-img object-cover"
              sizes="(max-width: 768px) 90vw, 360px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
