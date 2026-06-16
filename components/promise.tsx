"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const BAG = "/red-caddie-companion-bag.png";
const TORX = "/usefulphotos/ChatGPT%20Image%20May%2025%2C%202026%2C%2001_23_27%20PM.png";
const GRASS = "/caddie-divot-grass.png";
const OPENER = "/bottle-opener-caddie.png";

// Scattered desktop photos. Two big (top-left, bottom-right) and two small
// (bottom-left, top-right) on a diagonal for depth.
const PHOTOS = [
  { src: BAG, pos: "top-[5%] left-[4%]", size: "w-80 xl:w-96", sizes: "(max-width: 1280px) 20rem, 24rem" },
  { src: TORX, pos: "bottom-[10%] left-[13%]", size: "w-64 xl:w-72", sizes: "(max-width: 1280px) 16rem, 18rem" },
  { src: GRASS, pos: "top-[10%] right-[11%]", size: "w-64 xl:w-72", sizes: "(max-width: 1280px) 16rem, 18rem" },
  { src: OPENER, pos: "bottom-[6%] right-[6%]", size: "w-80 xl:w-96", sizes: "(max-width: 1280px) 20rem, 24rem", square: true },
];

export default function Promise() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

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

      // CTA eases up a beat after the paragraph resolves, so it reads as the
      // last thing to land rather than competing with the line for attention.
      gsap.from(ctaRef.current, {
        opacity: 0,
        y: 16,
        duration: 0.9,
        ease: "power2.out",
        delay: 0.35,
        scrollTrigger: trigger,
      });

      // Photos simply fade in as they enter view — no movement, scale, or
      // blur. Mobile fades each frame on its own trigger; desktop fades the
      // scattered cluster in together with a slight stagger.
      const mm = gsap.matchMedia();
      mm.add("(max-width: 1023px)", () => {
        const q = gsap.utils.selector(sectionRef);
        q(".promise-photo").forEach((photo) => {
          gsap.from(photo, {
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: photo, start: "top 85%", once: true },
          });
        });
      });

      mm.add("(min-width: 1024px)", () => {
        const q = gsap.utils.selector(sectionRef);
        q(".promise-photo-desktop").forEach((photo, i) => {
          gsap.from(photo, {
            opacity: 0,
            duration: 1.1,
            ease: "power2.out",
            delay: i * 0.12,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              once: true,
            },
          });
        });
      });

      return () => {
        split.revert();
        mm.revert();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative z-20 rounded-t-[2rem] lg:rounded-t-[2.5rem] shadow-[0_-24px_48px_-24px_rgba(0,0,0,0.5)] lg:min-h-[135vh] w-full overflow-hidden bg-[#fafaf7] px-6 pt-24 pb-16 lg:py-0 flex flex-col items-center justify-center"
    >
      {/* Scattered photos — desktop only, positioned around the centered text.
          The inner `.promise-photo-desktop` element carries the GSAP fade. */}
      <div aria-hidden className="hidden lg:block">
        {PHOTOS.map(({ src, pos, size, sizes, square }) => (
          <div
            key={src}
            className={`absolute ${pos} ${size}`}
          >
            {square ? (
              <div className="promise-photo-desktop aspect-[4/5] w-full overflow-hidden rounded-sm">
                <Image src={src} alt="" fill className="object-cover" sizes={sizes} />
              </div>
            ) : (
              <Image
                src={src}
                alt=""
                width={1122}
                height={1402}
                className="promise-photo-desktop h-auto w-full rounded-sm"
                sizes={sizes}
              />
            )}
          </div>
        ))}
      </div>

      {/* Center text */}
      <div ref={textRef} className="relative z-10 text-center">
        <p
          ref={eyebrowRef}
          className="font-inter font-medium text-xs uppercase tracking-[0.12em] text-zinc-500 mb-6"
        >
          What it is
        </p>
        <p
          ref={paraRef}
          className="font-inter font-medium text-black text-2xl sm:text-3xl lg:text-[1.95rem] leading-[1.5] tracking-[-0.04em] max-w-xl mx-auto"
        >
          The Caddie Companion is a six-in-one golf tool. Small enough to
          forget in your pocket, built to handle everything around your
          swing.
        </p>
        <Link
          ref={ctaRef}
          href="/select-color"
          className="mt-10 inline-flex items-center border-[0.75px] border-black px-7 py-3 font-inter text-base font-medium text-black transition-colors hover:bg-black hover:text-white"
        >
          Order now
        </Link>
      </div>

      {/* Photos — mobile / tablet, stacked one at a time. Each frame rises and
          fades in on scroll (see the matchMedia block in useGSAP). Desktop
          shows the scattered parallax cluster above instead. */}
      <div className="lg:hidden flex flex-col items-center gap-6 w-full max-w-sm mt-14">
        {PHOTOS.slice(0, 2).map(({ src }) => (
          <Image
            key={src}
            src={src}
            alt=""
            width={1122}
            height={1402}
            className="promise-photo w-full aspect-[4/5] object-cover rounded-sm"
            sizes="(max-width: 1024px) 90vw, 24rem"
          />
        ))}
      </div>
    </section>
  );
}
