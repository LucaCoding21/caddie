"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { PRODUCT } from "@/lib/products";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const HERO = "/caddie-buy-section.jpeg";

// Price shown beside the finish selector. priceCents is whole dollars here, so
// keep the formatting light rather than pulling in Intl for one number.
const PRICE = `$${PRODUCT.priceCents / 100}`;

// Three selling points, shown as an airy three-up spec row beneath the hero —
// plain line icons, no heavy tiles, in keeping with the gallery feel.
const FEATURES = [
  {
    title: "Golf Essential",
    desc: "Brush, divot tool, groove cleaner & more.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        className="h-6 w-6"
      >
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    title: "Premium Build",
    desc: "Durable aluminum body. Built to last.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Pocket Friendly",
    desc: "Compact design that goes wherever you go.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        className="h-6 w-6"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function ClosingColours() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeColor = PRODUCT.colors[activeIdx];

  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

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

      // Heading rises out of a line mask, same idiom as the On Course /
      // Anatomy sections.
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
      className="relative z-20 w-full bg-[#fafaf7] px-6 md:px-12 py-32 md:py-44"
    >
      <div className="mx-auto max-w-[1100px]">
        {/* Centered editorial intro — gallery-style close. */}
        <div className="mx-auto max-w-3xl text-center">
          <p
            ref={eyebrowRef}
            className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400"
          >
            Four ways to carry
          </p>
          <h2
            ref={titleRef}
            className="mt-5 font-inter font-medium text-black text-5xl sm:text-6xl lg:text-[4rem] leading-[1.0] tracking-tight"
          >
            {PRODUCT.title}
          </h2>
          <p className="mx-auto mt-6 max-w-xl font-inter text-zinc-600 text-base md:text-lg leading-[1.5]">
            The all-in-one golf multi-tool. Clean clubs, fix divots, and be
            ready for anything — in the finish that suits your bag.
          </p>
        </div>

        {/* Hero — the multi-tool laid across a half-grass, half-stone sweep. */}
        <div className="relative mt-14 md:mt-20 aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#f1f0ec] ring-1 ring-black/5">
          <Image
            src={HERO}
            alt="Caddie Companion multi-tool, fanned open on the green"
            fill
            sizes="(max-width: 1024px) 92vw, 1100px"
            className="object-contain"
            priority
          />
        </div>

        {/* Three-up spec row — hairline-divided, no boxes. */}
        <div className="mt-16 grid border-y border-zinc-900/10 divide-y divide-zinc-900/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {FEATURES.map(({ title, desc, icon }) => (
            <div key={title} className="px-2 py-8 sm:px-8 text-center sm:text-left">
              <span className="inline-flex text-zinc-700">{icon}</span>
              <p className="mt-4 font-inter text-base font-medium text-black">
                {title}
              </p>
              <p className="mt-1 font-inter text-sm text-zinc-500 leading-[1.5]">
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* Finish selector + buy — the calm, decisive close. */}
        <div className="mt-16 flex flex-col items-center">
          <div className="flex items-baseline gap-3">
            <span className="font-inter text-lg font-medium text-black">
              {activeColor.name}
            </span>
            <span className="text-zinc-300">·</span>
            <span className="font-inter text-lg text-zinc-500">
              {PRICE} {PRODUCT.currency}
            </span>
          </div>

          {/* A swatch per finish; the active one sits in a black ring. */}
          <div className="mt-6 flex gap-3">
            {PRODUCT.colors.map((c, idx) => {
              const selected = idx === activeIdx;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  aria-pressed={selected}
                  aria-label={c.name}
                  className={`relative h-16 w-16 cursor-pointer overflow-hidden rounded-xl bg-[#f1f0ec] transition-all ${
                    selected
                      ? "ring-2 ring-black"
                      : "ring-1 ring-black/10 hover:ring-black/30"
                  }`}
                >
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="64px"
                    className="object-contain p-2"
                  />
                </button>
              );
            })}
          </div>

          <Link
            href="/select-color"
            className="mt-10 inline-flex items-center bg-black px-9 py-3.5 font-inter text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Buy Caddie Companion
          </Link>
        </div>
      </div>
    </section>
  );
}
