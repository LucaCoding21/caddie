"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { PRODUCT } from "@/lib/products";
import { AVERAGE_RATING, REVIEW_COUNT } from "@/lib/reviews";
import Reviews, { Stars } from "@/components/reviews";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// Price shown beside the finish name. priceCents is whole dollars here, so
// keep the formatting light rather than pulling in Intl for one number.
const PRICE = `$${PRODUCT.priceCents / 100}`;

// Trust line — replaces the old feature tiles. New, de-risking info at the buy
// moment, not a restatement of the product. No shipping claim here: shipping is
// only free on 2+, and the bundle nudge carries that message instead.
const TRUST = ["30-day returns", "1-yr guarantee"];

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
  const [addonIds, setAddonIds] = useState<string[]>([]);
  // Which image the big frame is previewing — null means the active finish,
  // otherwise an add-on id. Independent of what's checked/added (addonIds).
  const [previewAddonId, setPreviewAddonId] = useState<string | null>(null);
  const activeColor = PRODUCT.colors[activeIdx];

  // Checking the box adds/removes the add-on; it does not change the preview.
  function toggleAddon(id: string) {
    setAddonIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
    );
  }

  // Clicking a finish or an add-on name only changes what's previewed.
  function previewColor(idx: number) {
    setActiveIdx(idx);
    setPreviewAddonId(null);
  }
  function previewAddon(id: string) {
    setPreviewAddonId((prev) => (prev === id ? null : id));
  }

  // Carry the colour + any add-ons into the configurator so the buy page opens
  // pre-configured to match what was chosen here.
  const buyHref = {
    pathname: "/select-color",
    query: {
      color: activeColor.id,
      ...(addonIds.length ? { addons: addonIds.join(",") } : {}),
    },
  };

  // TEST: real studio shots in as they're shot; finishes without one yet fall back
  // to the old cut-outs. Fold these into products.ts once all four are in.
  const STUDIO_SHOTS: Record<string, string> = {
    black: "/product-colours/caddie-companion-multi-tool-black.png",
    blue: "/product-colours/caddie-companion-multi-tool-blue.png",
    green: "/product-colours/caddie-companion-multi-tool-green.png",
    red: "/product-colours/caddie-companion-multi-tool-red.png",
  };
  // The big frame previews whatever's selected for preview: an add-on if one
  // is being previewed, otherwise the active finish.
  const previewedAddon = PRODUCT.addons.find((a) => a.id === previewAddonId);
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
      className="relative z-20 -mt-px w-full bg-[#f6f6f6] px-6 md:px-12 py-32 md:py-44"
    >
      <div className="mx-auto grid max-w-[1340px] items-center gap-12 xl:grid-cols-[1.85fr_1fr] xl:gap-x-48 xl:gap-y-10">
        {/* Header — sits above the photo on mobile; on desktop it rejoins the
            top of the right column. */}
        <div className="order-1 lg:order-2 lg:mx-auto lg:w-full lg:max-w-2xl xl:max-w-none xl:col-start-2 xl:row-start-1">
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
          <p className="mt-6 max-w-md lg:max-w-2xl xl:max-w-md font-inter text-zinc-600 text-base md:text-lg leading-[1.5]">
            The all-in-one golf multi-tool. Clean clubs, fix divots, and be
            ready for anything, in the finish that suits your bag.
          </p>
        </div>

        {/* Decision panel — finish picker, price, and buy. Below the photo on
            mobile; under the header in the right column on desktop. */}
        <div className="order-3 lg:order-3 lg:mx-auto lg:w-full lg:max-w-2xl xl:max-w-none xl:col-start-2 xl:row-start-2">
          {/* Finish list — name on the left, swatch dot on the right, one row each.
              The active row's dot sits in a black ring and drives the hero. */}
          <div className="max-w-md lg:max-w-2xl xl:max-w-md">
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
                      onClick={() => previewColor(idx)}
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
                            ? "ring-2 ring-accent ring-offset-2 ring-offset-[#f6f6f6]"
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

            {/* Add-ons — same row idiom as the finish list, with a thumbnail of
                the part. Selection carries through to the buy page. */}
            <p className="mt-8 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
              Add-ons
            </p>
            <ul className="mt-4">
              {PRODUCT.addons.map((a) => {
                const selected = addonIds.includes(a.id);
                return (
                  <li key={a.id} className="border-t border-black/10 last:border-b">
                    <div className="flex items-center gap-3 py-3.5">
                      {/* The box is the only thing that adds/removes the add-on. */}
                      <button
                        type="button"
                        onClick={() => toggleAddon(a.id)}
                        aria-pressed={selected}
                        aria-label={`Add ${a.name}`}
                        className="shrink-0 cursor-pointer"
                      >
                        <span
                          aria-hidden
                          className={`flex h-4 w-4 items-center justify-center border transition-colors ${
                            selected ? "border-black bg-black" : "border-black/25"
                          }`}
                        >
                          {selected && (
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          )}
                        </span>
                      </button>
                      {/* The name only previews the add-on image, no checking. */}
                      <button
                        type="button"
                        onClick={() => previewAddon(a.id)}
                        className="flex min-w-0 flex-1 cursor-pointer items-center justify-between gap-3 text-left"
                      >
                        <span className="min-w-0 flex-1 font-inter text-sm font-medium text-zinc-600 transition-colors hover:text-black">
                          {a.name}
                        </span>
                        <span className="shrink-0 font-inter text-sm tabular-nums text-zinc-400">
                          +${(a.priceCents / 100).toFixed(0)}
                        </span>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Price. */}
          <div className="mt-9 flex items-baseline gap-3">
            <span className="font-inter text-lg font-medium text-black">
              {PRICE} {PRODUCT.currency}
            </span>
          </div>

          {/* Star summary at the buy moment — the marquee of full reviews these
              stars summarize scrolls just below this section. */}
          <div className="mt-3 flex items-center gap-2">
            <Stars rating={AVERAGE_RATING} className="h-4 w-4" />
            <span className="font-inter text-sm text-zinc-500">
              {AVERAGE_RATING.toFixed(1)} · {REVIEW_COUNT} verified reviews
            </span>
          </div>

          <Link
            href={buyHref}
            className="mt-5 inline-flex items-center bg-accent px-9 py-3.5 font-inter text-sm font-medium text-white transition-colors hover:bg-accent-hover"
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
        <div className="order-2 min-w-0 lg:order-1 lg:mx-auto lg:w-full lg:max-w-2xl xl:max-w-none xl:col-start-1 xl:row-start-1 xl:row-span-2">
          {/* Single frame: shows the active finish, or swaps to an add-on while
              it's being previewed so it shows fully and on its own. */}
          <div className="relative mx-auto aspect-[4/3] w-full rounded-lg lg:w-full">
            {previewedAddon ? (
              <Image
                key={previewedAddon.id}
                src={previewedAddon.image}
                alt={previewedAddon.name}
                fill
                sizes="(max-width: 1024px) 92vw, 720px"
                className="object-contain"
              />
            ) : (
              <Image
                key={activeColor.id}
                src={heroSrc}
                alt={`Caddie Companion golf multi-tool in ${activeColor.name}`}
                fill
                sizes="(max-width: 1024px) 92vw, 720px"
                className={`object-contain ${
                  activeColor.id === "red" ? "xl:scale-[0.97] xl:-translate-x-[10px] xl:-translate-y-[10px]" : ""
                } ${activeColor.id === "green" ? "scale-[0.95] xl:scale-[0.97]" : ""}`}
              />
            )}
          </div>

          {/* Real customer reviews fill the left column below the product shot.
              Their star ratings + aggregate are also emitted as Product JSON-LD
              on this page (see ProductSchema includeReviews in app/page.tsx). */}
          <Reviews />
        </div>
      </div>
    </section>
  );
}
