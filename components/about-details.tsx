"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/**
 * The editorial "Caddie Companion Details" gallery. The image frames reveal with a soft
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
      className="mx-auto max-w-[112rem] px-6 py-24 md:px-20 md:py-32"
    >
      {/* Two columns (copy 1 : photos 2) with a single gap between them — a
          12-col grid with gap-16 puts 11 gaps (704px) between tracks, which
          alone overflows a 768px viewport. */}
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:items-center md:gap-16">
        {/* Copy — quiet column on the left, vertically centred against the
            cluster so the empty space around it does the work. */}
        <div>
          <p
            ref={eyebrowRef}
            className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-400"
          >
            Caddie Companion
          </p>
          <h2
            ref={titleRef}
            className="mt-6 font-brand text-3xl font-light tracking-tight text-black md:text-[2.5rem] md:leading-[1.15]"
          >
            Caddie Companion Details
          </h2>
          <p
            ref={bodyRef}
            className="mt-6 max-w-sm font-inter text-base font-light leading-[1.9] text-zinc-500"
          >
            Every fold earns its place. The divot tool, groove brush, ball
            marker, and driver key nest into one machined frame, so the thing
            that lives in your pocket does the work of six.
          </p>
        </div>

        {/* Photo cluster — two vertical columns, the second dropped down so
            empty space (ma) opens at the top-right and bottom-left corners.
            One composition, read at a glance, with a clear focal frame. */}
        <div className="min-w-0">
          {/* Grid (not flex) so the column split accounts for the gap and the
              cluster can't spill past the container edge. */}
          <div className="grid grid-cols-[minmax(0,56fr)_minmax(0,44fr)] gap-6 md:gap-10">
            {/* Left column — the larger, leading frames. */}
            <div className="flex min-w-0 flex-col gap-6 md:gap-10">
              <figure className="about-detail-frame relative aspect-[4/3] w-full overflow-hidden bg-[#efeeea]">
                <Image
                  src="/caddie-about-golfers.png"
                  alt="A smiling golfer in a cart holding up the black Caddie Companion multi-tool, playing partner beside him"
                  title="Made for the people who actually play the course"
                  fill
                  className="about-detail-img object-cover"
                  sizes="(max-width: 768px) 52vw, 420px"
                />
              </figure>
              <figure className="about-detail-frame relative aspect-square w-full overflow-hidden bg-[#efeeea]">
                <Image
                  src="/red-caddie-companion.png"
                  alt="The red Caddie Companion multi-tool resting against a range basket of golf balls"
                  title="Six tools, one machined frame"
                  fill
                  className="about-detail-img object-cover"
                  sizes="(max-width: 768px) 52vw, 420px"
                />
              </figure>
            </div>

            {/* Right column — narrower accents, dropped down to leave a void
                above and below. */}
            <div className="flex min-w-0 flex-col gap-6 md:mt-28 md:gap-10">
              <figure className="about-detail-frame relative aspect-[3/4] w-full overflow-hidden bg-[#efeeea]">
                <Image
                  src="/caddie-companion-pocket-draw.png"
                  alt="A gloved golfer drawing the black Caddie Companion multi-tool from a trouser pocket on the course"
                  title="Pocket-sized and always within reach on the course"
                  fill
                  className="about-detail-img object-cover"
                  sizes="(max-width: 768px) 40vw, 320px"
                />
              </figure>
              <figure className="about-detail-frame relative aspect-[4/3] w-full overflow-hidden bg-[#efeeea]">
                <Image
                  src="/caddie-companion-golf-balls.png"
                  alt="The black Caddie Companion multi-tool laid across a bed of golf balls"
                  title="Built to live in the bag"
                  fill
                  className="about-detail-img object-cover"
                  sizes="(max-width: 768px) 40vw, 320px"
                />
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
