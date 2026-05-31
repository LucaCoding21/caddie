"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// Lifestyle proof — the tool out in the world, not on a studio sweep. Two
// portrait shots: open at the pin, and stowed in a pocket between shots.
const SHOTS = [
  {
    src: "/on-course.jpg",
    alt: "A hand holding the Caddie Companion open in front of the flagstick",
    title: "At the pin",
    desc: "Flip it open one-handed, fix your mark, and keep walking.",
  },
  {
    src: "/pocket-carry.jpg",
    alt: "The Caddie Companion tucked into a golfer's trouser pocket beside a gloved hand",
    title: "In your pocket",
    desc: "Slim enough to forget you're carrying it, until you need it.",
  },
];

export default function OnCourse() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);

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

      // Heading rises out of a line mask, same idiom as the Anatomy section.
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
            // leading-[1.05] makes the line mask crop descenders (the "g" in
            // "goes"/"go"); release the clip once the line has settled.
            onComplete: () =>
              gsap.set(
                self.lines.map((l) => l.parentNode),
                { overflow: "visible" }
              ),
          }),
      });

      // Each photo + its caption eases up as its frame enters view.
      const q = gsap.utils.selector(sectionRef);
      q(".shot").forEach((figure) => {
        gsap.from(figure, {
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: figure, start: "top 88%", once: true },
        });
      });

      // Gentle scroll-linked parallax on the "In your pocket" photo — it drifts
      // up a touch as the section scrolls past. Kept on the inner frame so it
      // doesn't collide with the figure's one-time fade-up transform.
      const pocket = q(".pocket-parallax");
      if (pocket.length) {
        gsap.fromTo(
          pocket,
          { yPercent: 6 },
          {
            yPercent: -6,
            ease: "none",
            scrollTrigger: {
              trigger: pocket[0],
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      return () => split.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative z-20 w-full bg-[#fafaf7] px-6 md:px-12 py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="max-w-3xl ml-auto text-right">
          <p
            ref={eyebrowRef}
            className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400"
          >
            From tee to green
          </p>
          <h2
            ref={titleRef}
            className="mt-5 font-inter font-medium text-black text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.05] tracking-tight"
          >
            It goes where you go.
          </h2>
          <p className="mt-6 ml-auto max-w-xl font-inter text-zinc-500 text-base md:text-lg leading-[1.5]">
            Caddie started with a pocket full of single-use gadgets and one
            simple idea: fold the six tools every golfer actually reaches for
            into one frame, machined to last a lifetime of rounds.
          </p>
          <Link
            href="/about"
            className="mt-7 inline-flex items-center bg-black px-6 py-3 font-inter text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Learn more about Caddie
          </Link>
        </div>

        {/* Two portraits, the second dropped a beat on desktop for editorial
            rhythm. 3:4 frames match the source photos so object-cover barely
            crops. */}
        <div className="mt-14 md:mt-20 grid gap-8 md:gap-10 sm:grid-cols-2">
          {SHOTS.map(({ src, alt, title, desc }, i) => (
            <figure
              key={src}
              className={`shot ${i === 1 ? "sm:mt-20 lg:mt-28" : ""}`}
            >
              <div
                className={`relative aspect-[3/4] w-full overflow-hidden rounded-md bg-[#efeeea] ring-1 ring-black/5 ${
                  i === 1 ? "pocket-parallax will-change-transform" : ""
                }`}
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 90vw, (max-width: 1280px) 45vw, 600px"
                />
              </div>
              <figcaption className="mt-5 max-w-sm">
                <span className="block font-inter text-lg md:text-xl font-medium text-black tracking-tight">
                  {title}
                </span>
                <span className="mt-1 block font-inter text-zinc-500 text-sm md:text-base leading-[1.5]">
                  {desc}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
