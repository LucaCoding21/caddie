"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCT } from "@/lib/products";

// Swatch dot colour + a one-line finish blurb, keyed by colour id. Mirrors the
// FINISH map in closing-colours.tsx so the buy flow reads as one brand.
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

// Real studio shots for the big hero, same source set the home page closes on.
const STUDIO_SHOTS: Record<string, string> = {
  black: "/black-product-v2.png",
  blue: "/blue-product-v2.png",
  green: "/green-product-v2.png",
  red: "/red-product-v2.png",
};

export default function SelectColorPage() {
  const [activeColorId, setActiveColorId] = useState("black");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeColor =
    PRODUCT.colors.find((c) => c.id === activeColorId) ?? PRODUCT.colors[0];
  const unavailable = !activeColor.variantId;
  const totalCents = quantity * PRODUCT.priceCents;
  const heroSrc = STUDIO_SHOTS[activeColor.id] ?? activeColor.image;

  function selectColor(id: string) {
    setActiveColorId(id);
    setError(null);
  }

  async function checkout() {
    setLoading(true);
    setError(null);
    try {
      if (!activeColor.variantId) {
        throw new Error(`${activeColor.name} isn't available yet`);
      }
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: [{ variantId: activeColor.variantId, quantity }],
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.checkoutUrl) {
        throw new Error(
          typeof json.error === "string"
            ? json.error
            : JSON.stringify(json.error ?? "Checkout failed")
        );
      }
      window.location.href = json.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <header className="flex items-center justify-between border-b border-black/10 px-5 py-6 sm:px-8">
        <Link href="/" aria-label="Caddie" className="flex items-center">
          <Image
            src="/caddie-logo.png"
            alt="Caddie Companion"
            width={160}
            height={50}
            priority
            className="h-8 w-auto"
          />
        </Link>
        <p className="hidden font-mono text-[11px] font-medium uppercase text-zinc-400 sm:block">
          We ship worldwide
        </p>
        <Link
          href="/"
          aria-label="Close"
          className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-black/5 hover:text-black"
        >
          ✕
        </Link>
      </header>

      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Gallery — the selected finish, large, on the warm editorial surface. */}
        <div className="relative flex min-h-[42vh] items-center justify-center overflow-hidden bg-[#fafaf7] p-8 lg:min-h-0 lg:w-[55%]">
          <div className="relative aspect-[2000/1545] w-full max-w-[640px]">
            <Image
              key={activeColor.id}
              src={heroSrc}
              alt={`Caddie Companion multi-tool in ${activeColor.name}`}
              fill
              sizes="(max-width: 1024px) 92vw, 640px"
              className="scale-[1.06] object-contain"
              priority
            />
          </div>
        </div>

        {/* Configurator — compact product rail. */}
        <div className="relative flex flex-1 flex-col justify-center px-6 py-12 sm:px-10 lg:w-[45%] lg:px-14">
          <Link
            href="/"
            aria-label="Back to home"
            className="group absolute left-3 top-6 flex items-center gap-2 font-inter text-xs font-medium uppercase tracking-[0.08em] text-zinc-500 transition-colors hover:text-black sm:left-4 sm:top-8 lg:left-5"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className="transition-transform group-hover:-translate-x-0.5"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Home
          </Link>
          <div className="mx-auto flex w-full max-w-md flex-col">
            {/* Title + price. */}
            <div className="flex items-start justify-between gap-6">
              <div>
                <h1 className="font-inter text-base font-semibold uppercase tracking-[0.08em] text-black">
                  {PRODUCT.title}
                </h1>
                <p className="mt-1.5 font-inter text-lg tabular-nums text-zinc-700">
                  ${(PRODUCT.priceCents / 100).toFixed(2)}{" "}
                  <span className="text-sm text-zinc-400">
                    {PRODUCT.currency}
                  </span>
                </p>
              </div>
              <p className="max-w-[12rem] pt-1 text-right font-inter text-xs leading-[1.5] text-zinc-400">
                The golf multi-tool every player keeps in their bag.
              </p>
            </div>

            {/* Finish — single-select swatches. The active one drives the gallery. */}
            <section className="mt-10">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
                {activeColor.name}
              </p>
              <div className="mt-3 flex items-center gap-3">
                {PRODUCT.colors.map((c) => {
                  const selected = activeColorId === c.id;
                  const soon = !c.variantId;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => selectColor(c.id)}
                      aria-pressed={selected}
                      aria-label={`${c.name}${soon ? " (coming soon)" : ""}`}
                      title={soon ? `${c.name} — coming soon` : c.name}
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                        selected
                          ? "ring-2 ring-accent ring-offset-2 ring-offset-white"
                          : "ring-1 ring-black/15 ring-offset-2 ring-offset-white hover:ring-black/40"
                      } ${soon ? "opacity-40" : ""}`}
                    >
                      <span
                        aria-hidden
                        className="h-7 w-7 rounded-full"
                        style={{ backgroundColor: FINISH[c.id]?.hex }}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 font-inter text-sm leading-[1.5] text-zinc-500">
                {FINISH[activeColor.id]?.blurb}
              </p>
            </section>

            {/* Buy row — quantity + add to cart, inline like a product rail. */}
            <section className="mt-9">
              <div className="flex items-stretch gap-3">
                <div className="flex items-center gap-1 rounded-md border border-black/15 px-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="flex h-11 w-9 items-center justify-center text-lg text-zinc-600 transition-colors hover:text-black disabled:opacity-25"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-7 text-center font-inter text-sm font-medium tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-11 w-9 items-center justify-center text-lg text-zinc-600 transition-colors hover:text-black"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={checkout}
                  disabled={loading || unavailable}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md bg-black px-6 font-inter text-sm font-medium uppercase tracking-[0.08em] text-white transition-colors hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-black"
                >
                  {loading ? (
                    "Loading…"
                  ) : unavailable ? (
                    `${activeColor.name} — coming soon`
                  ) : (
                    <>
                      <span>Add to cart</span>
                      <span className="tabular-nums text-white/70">
                        ${(totalCents / 100).toFixed(2)}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {error && (
                <p className="mt-3 font-inter text-sm text-red-600 break-words">
                  {error}
                </p>
              )}

              <div className="mt-4 flex items-center justify-between font-inter text-xs text-zinc-400">
                <span>Free shipping · 30-day returns</span>
                <Link
                  href="/contact"
                  className="underline underline-offset-4 transition-colors hover:text-black"
                >
                  Questions?
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
