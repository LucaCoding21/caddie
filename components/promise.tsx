"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const BAG = "/usefulphotos/ChatGPT%20Image%20May%2025%2C%202026%2C%2001_09_21%20PM.png";
const TORX = "/usefulphotos/ChatGPT%20Image%20May%2025%2C%202026%2C%2001_23_27%20PM.png";
const GRASS = "/usefulphotos/ChatGPT%20Image%20May%2025%2C%202026%2C%2001_56_38%20PM.png";
const OPENER = "/usefulphotos/ChatGPT%20Image%20May%2025%2C%202026%2C%2002_30_32%20PM.png";

// Scattered desktop photos. Two big (top-left, bottom-right) and two small
// (bottom-left, top-right) on a diagonal for depth. `speed` is the parallax
// factor: how many px the photo shifts per px the section moves off center.
// Mixed signs make the cluster drift apart as you scroll.
const PHOTOS = [
  { src: BAG, pos: "top-[5%] left-[4%]", size: "w-72 xl:w-80", sizes: "(max-width: 1280px) 18rem, 20rem", speed: 0 },
  { src: TORX, pos: "bottom-[10%] left-[13%]", size: "w-48 xl:w-56", sizes: "(max-width: 1280px) 12rem, 14rem", speed: -0.06 },
  { src: GRASS, pos: "top-[10%] right-[11%]", size: "w-48 xl:w-56", sizes: "(max-width: 1280px) 12rem, 14rem", speed: 0.07 },
  { src: OPENER, pos: "bottom-[6%] right-[6%]", size: "w-72 xl:w-80", sizes: "(max-width: 1280px) 18rem, 20rem", speed: 0 },
];

export default function Promise() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  // Signed distance (px) between the section's center and the viewport
  // center. 0 when the section is centered; grows as it scrolls past.
  const [offset, setOffset] = useState(0);

  // Scroll reveal: eyebrow rises in, then the paragraph resolves word by
  // word out of a blur. Triggered once when the text scrolls into view.
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Slow cover: the hero is sticky (pinned), so this panel scrolls up over
      // it. Sticky tracks the wheel 1:1, which feels abrupt — so hold the panel
      // back and ease it up with a scrubbed tween. It settles flush (y:0) right
      // as it reaches the top, so no gap opens above the next section. Bump the
      // start multiplier / scrub for a slower, lazier glide.
      gsap.fromTo(
        sectionRef.current,
        { y: () => window.innerHeight * 0.3 },
        {
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "top top",
            scrub: 1,
          },
        }
      );

      const trigger = { trigger: textRef.current, start: "top 95%", once: true };

      gsap.from(eyebrowRef.current, {
        opacity: 0,
        y: 14,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: trigger,
      });

      const split = SplitText.create(paraRef.current, {
        type: "words",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.words, {
            opacity: 0,
            y: 12,
            filter: "blur(6px)",
            duration: 0.95,
            ease: "power2.out",
            stagger: 0.028,
            scrollTrigger: trigger,
          }),
      });

      return () => split.revert();
    },
    { scope: sectionRef }
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setOffset(window.innerHeight / 2 - (rect.top + rect.height / 2));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-20 rounded-t-[2rem] lg:rounded-t-[2.5rem] shadow-[0_-24px_48px_-24px_rgba(0,0,0,0.5)] min-h-[115vh] w-full overflow-hidden bg-[#fafaf7] px-6 py-24 lg:py-0 flex flex-col items-center justify-center"
    >
      {/* Scattered photos — desktop only, positioned around the centered text */}
      <div aria-hidden className="hidden lg:block">
        {PHOTOS.map(({ src, pos, size, sizes, speed }) => (
          <Image
            key={src}
            src={src}
            alt=""
            width={1122}
            height={1402}
            className={`absolute ${pos} ${size} h-auto rounded-sm will-change-transform`}
            style={{ transform: `translate3d(0, ${offset * speed}px, 0)` }}
            sizes={sizes}
          />
        ))}
      </div>

      {/* Photos — mobile / tablet fallback row above the text */}
      <div className="lg:hidden grid grid-cols-2 gap-3 w-full max-w-xs mb-14">
        {PHOTOS.map(({ src }) => (
          <Image
            key={src}
            src={src}
            alt=""
            width={1122}
            height={1402}
            className="w-full aspect-[4/5] object-cover rounded-sm"
            sizes="30vw"
          />
        ))}
      </div>

      {/* Center text */}
      <div ref={textRef} className="relative z-10 text-center">
        <p
          ref={eyebrowRef}
          className="font-inter font-medium text-xs uppercase tracking-[0.12em] text-zinc-500 mb-6"
        >
          The Caddie Companion
        </p>
        <p
          ref={paraRef}
          className="font-inter font-medium text-black text-xl sm:text-2xl lg:text-[1.7rem] leading-[1.5] tracking-[-0.04em] max-w-xl mx-auto"
        >
          One tool that does it all. Fix divots, clean grooves, and dial
          in your driver, so you spend less time fumbling and more time
          playing.
        </p>
      </div>
    </section>
  );
}
