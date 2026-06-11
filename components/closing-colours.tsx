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

// Price shown beside the finish name. priceCents is whole dollars here, so
// keep the formatting light rather than pulling in Intl for one number.
const PRICE = `$${PRODUCT.priceCents / 100}`;

// Trust line — replaces the old feature tiles. New, de-risking info at the buy
// moment, not a restatement of the product. SAMPLE COPY — confirm before ship.
const TRUST = ["Free shipping", "30-day returns", "1-yr guarantee"];

// Swatch dot colour + a line of copy per finish, keyed by colour id. Drives the
// finish list. SAMPLE COPY — confirm before ship.
const FINISH: Record<string, { hex: string; blurb: string }> = {
  black: {
    hex: "#1c1c1c",
    blurb: "Matte black that disappears into any bag and shrugs off scuffs.",
  },
  blue: {
    hex: "#2f5dd0",
    blurb: "A deep cobalt blue with a cool, understated shine on the course.",
  },
  green: {
    hex: "#2f6b40",
    blurb: "Fairway green, a muted, classic finish that nods to the course.",
  },
  red: {
    hex: "#c23a2f",
    blurb: "Bold signal red, easy to spot the moment you reach for it.",
  },
};

export default function ClosingColours() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeColor = PRODUCT.colors[activeIdx];

  // TEST: real studio shots in as they're shot; finishes without one yet fall back
  // to the old cut-outs. Fold these into products.ts once all four are in.
  const STUDIO_SHOTS: Record<string, string> = {
    black: "/black-product-v2.png",
    blue: "/blue-product-v2.png",
    green: "/green-product-v2.png",
    red: "/red-product-v2.png",
  };
  const heroSrc = STUDIO_SHOTS[activeColor.id] ?? activeColor.image;

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
      <div className="mx-auto grid max-w-[1100px] items-center gap-12 lg:grid-cols-[1.55fr_1fr] lg:gap-36">
        {/* Decision panel — content on the right; image is the payoff on the left. */}
        <div className="order-2 lg:order-2">
          <p
            ref={eyebrowRef}
            className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400"
          >
            Four ways to carry
          </p>
          <h2
            ref={titleRef}
            className="mt-5 sm:whitespace-nowrap font-inter font-medium text-black text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.05] tracking-tight"
          >
            {PRODUCT.title}
          </h2>
          <p className="mt-6 max-w-md font-inter text-zinc-600 text-base md:text-lg leading-[1.5]">
            The all-in-one golf multi-tool. Clean clubs, fix divots, and be
            ready for anything, in the finish that suits your bag.
          </p>

          {/* Finish list — name on the left, swatch dot on the right, one row each.
              The active row's dot sits in a black ring and drives the hero. */}
          <div className="mt-10 max-w-md">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
              Finish
            </p>
            <ul className="mt-4">
              {PRODUCT.colors.map((c, idx) => {
                const selected = idx === activeIdx;
                return (
                  <li key={c.id} className="border-t border-black/10 last:border-b">
                    <button
                      type="button"
                      onClick={() => setActiveIdx(idx)}
                      aria-pressed={selected}
                      className="flex w-full cursor-pointer items-center justify-between py-3.5 text-left"
                    >
                      <span
                        className={`font-inter text-sm transition-colors ${
                          selected
                            ? "font-semibold text-black"
                            : "font-medium text-zinc-600 hover:text-black"
                        }`}
                      >
                        {c.name}
                      </span>
                      <span
                        aria-hidden
                        className={`h-4 w-4 rounded-full transition-all ${
                          selected
                            ? "ring-2 ring-accent ring-offset-2 ring-offset-[#fafaf7]"
                            : ""
                        }`}
                        style={{ backgroundColor: FINISH[c.id]?.hex }}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Blurb for the selected finish. */}
            <p className="mt-4 font-inter text-sm leading-[1.5] text-zinc-500">
              {FINISH[activeColor.id]?.blurb}
            </p>
          </div>

          {/* Price. */}
          <div className="mt-9 flex items-baseline gap-3">
            <span className="font-inter text-lg font-medium text-black">
              {PRICE} {PRODUCT.currency}
            </span>
          </div>

          <Link
            href="/select-color"
            className="mt-5 inline-flex items-center bg-black px-9 py-3.5 font-inter text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Buy Caddie Companion
          </Link>

          {/* Trust line — de-risks the click at the exact moment it matters. */}
          <ul className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 font-inter text-sm text-zinc-500">
            {TRUST.map((item, idx) => (
              <li key={item} className="flex items-center gap-3">
                {idx > 0 && <span aria-hidden className="text-zinc-300">·</span>}
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Hero — swaps to the selected finish, so "four ways to carry" is shown, not told.
            Landscape product shots: the frame ratio matches the source (2000×1545) and
            object-contain shows the whole tool, uncropped and at native resolution. */}
        <div className="order-1 lg:order-1">
          <div className="relative aspect-[2000/1545] w-full rounded-lg">
            <Image
              key={activeColor.id}
              src={heroSrc}
              alt={`Caddie Companion multi-tool in ${activeColor.name}`}
              fill
              sizes="(max-width: 1024px) 92vw, 720px"
              className="scale-[1.08] object-contain"
              preload
            />
          </div>
        </div>
      </div>
    </section>
  );
}
