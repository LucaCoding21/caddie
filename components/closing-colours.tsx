"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PRODUCT } from "@/lib/products";

export default function ClosingColours() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = PRODUCT.colors[activeIdx] ?? PRODUCT.colors[0];
  const count = PRODUCT.colors.length;
  const price = `$${(PRODUCT.priceCents / 100).toFixed(0)}`;

  const step = (dir: number) =>
    setActiveIdx((i) => (i + dir + count) % count);

  return (
    <section className="relative z-20 w-full bg-[#fafaf7] px-6 md:px-12 py-24 md:py-32">
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
        {/* Left — large product image with name + price overlaid, crossfading
            between the colour variants. */}
        <div className="relative order-2 aspect-[4/3] w-full lg:order-1">
          {PRODUCT.colors.map((c, idx) => (
            <Image
              key={c.id}
              src={c.image}
              alt={`Caddie Companion in ${c.name}`}
              fill
              priority={idx === 0}
              sizes="(max-width: 1024px) 92vw, 640px"
              className={`object-contain transition-opacity duration-500 ${
                idx === activeIdx ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
            <p className="font-inter text-base font-medium tracking-tight text-zinc-500 md:text-lg">
              Caddie Companion
            </p>
            <p className="mt-1 font-inter text-3xl font-bold tracking-tight text-black md:text-4xl">
              {price}
            </p>
          </div>
        </div>

        {/* Right — label + arrows, copy, colour thumbnails, buy. */}
        <div className="order-1 lg:order-2">
          <div className="flex items-center justify-between gap-6">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400">
              Four ways to carry
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous colour"
                className="flex h-8 w-8 items-center justify-center border border-black/15 text-zinc-500 transition-colors hover:border-black hover:text-black"
              >
                &lt;
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next colour"
                className="flex h-8 w-8 items-center justify-center border border-black/15 text-zinc-500 transition-colors hover:border-black hover:text-black"
              >
                &gt;
              </button>
            </div>
          </div>

          <h2 className="mt-5 max-w-md font-inter font-medium text-black text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.05] tracking-tight">
            Pick your Caddie.
          </h2>
          <p className="mt-6 max-w-md font-inter text-zinc-500 text-base md:text-lg leading-[1.5]">
            Same six tools, four anodised finishes — black, red, blue and green.
            Each frame is machined from a single billet of aluminium and
            colour-anodised through, so the finish is part of the metal, not a
            coat that chips. Choose the one that suits your bag.
          </p>

          {/* Finish label + colour thumbnail row. */}
          <div className="mt-10">
            <div className="flex items-baseline justify-between border-b border-black/10 pb-3">
              <span className="font-inter text-sm font-medium text-black">
                {active.name}
              </span>
              <span className="font-mono text-[11px] tabular-nums text-zinc-400">
                {String(activeIdx + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
            </div>
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
                    className={`relative aspect-[4/3] flex-1 overflow-hidden transition-all ${
                      selected
                        ? "ring-1 ring-black opacity-100"
                        : "opacity-40 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={c.image}
                      alt={c.name}
                      fill
                      sizes="140px"
                      className="object-contain"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Close & buy. */}
          <Link
            href="/select-color"
            className="mt-10 inline-flex items-center bg-black px-8 py-4 font-inter text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Buy the Caddie Companion {price}
          </Link>
        </div>
      </div>
    </section>
  );
}
