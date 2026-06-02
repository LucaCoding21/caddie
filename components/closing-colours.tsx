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

export default function ClosingColours() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeColor = PRODUCT.colors[activeIdx];

  // TEST: real studio shots in as they're shot; finishes without one yet fall back
  // to the old cut-outs. Fold these into products.ts once all four are in.
  const STUDIO_SHOTS: Record<string, string> = {
    black: "/productshot-black.png",
    blue: "/blueprod.png",
    green: "/greenprod.png",
    red: "/redprod.png",
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
      <div className="mx-auto grid max-w-[1100px] items-center gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        {/* Decision panel — leads on the left; image is the payoff on the right. */}
        <div className="order-2 lg:order-1">
          <p
            ref={eyebrowRef}
            className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400"
          >
            Four ways to carry
          </p>
          <h2
            ref={titleRef}
            className="mt-5 font-inter font-medium text-black text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.0] tracking-tight"
          >
            {PRODUCT.title}
          </h2>
          <p className="mt-6 max-w-md font-inter text-zinc-600 text-base md:text-lg leading-[1.5]">
            The all-in-one golf multi-tool. Clean clubs, fix divots, and be
            ready for anything, in the finish that suits your bag.
          </p>

          {/* Finish name + price. */}
          <div className="mt-10 flex items-baseline gap-3">
            <span className="font-inter text-lg font-medium text-black">
              {activeColor.name}
            </span>
            <span className="text-zinc-300">·</span>
            <span className="font-inter text-lg text-zinc-500">
              {PRICE} {PRODUCT.currency}
            </span>
          </div>

          {/* A swatch per finish; the active one drives the hero and sits in a black ring. */}
          <div className="mt-5 flex gap-3">
            {PRODUCT.colors.map((c, idx) => {
              const selected = idx === activeIdx;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  aria-pressed={selected}
                  aria-label={c.name}
                  className={`relative h-14 w-14 cursor-pointer overflow-hidden rounded-sm bg-black/[0.04] transition-all ${
                    selected
                      ? "ring-2 ring-black"
                      : "ring-1 ring-black/10 hover:ring-black/30"
                  }`}
                >
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="56px"
                    className="scale-[1.4] object-contain"
                  />
                </button>
              );
            })}
          </div>

          <Link
            href="/select-color"
            className="mt-9 inline-flex items-center bg-black px-9 py-3.5 font-inter text-sm font-medium text-white transition-colors hover:bg-zinc-800"
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
            Studio shots carry their own surface, so the photo fills a portrait block and
            the baked-in stage does the work the empty grey box used to fail at. */}
        <div className="order-1 lg:order-2">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg">
            <Image
              key={activeColor.id}
              src={heroSrc}
              alt={`Caddie Companion multi-tool in ${activeColor.name}`}
              fill
              sizes="(max-width: 1024px) 92vw, 620px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
