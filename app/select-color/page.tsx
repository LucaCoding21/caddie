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

// Studio photos, one per finish. Normalized so the tool sits at the same
// size and position in every frame (see public/product-colours/).
const STUDIO_SHOTS: Record<string, string> = {
  black: "/product-colours/black.jpg",
  blue: "/product-colours/blue.jpg",
  green: "/product-colours/green.jpg",
  red: "/product-colours/red.jpg",
};

// Trust line — same de-risking copy as the home buy moment.
const TRUST = ["Free shipping", "30-day returns", "1-yr guarantee"];

export default function SelectColorPage() {
  const [activeColorId, setActiveColorId] = useState("black");
  const [quantity, setQuantity] = useState(1);
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeIdx = Math.max(
    0,
    PRODUCT.colors.findIndex((c) => c.id === activeColorId)
  );
  const activeColor = PRODUCT.colors[activeIdx];
  const unavailable = !activeColor.variantId;
  const selectedAddons = PRODUCT.addons.filter((a) => addonIds.includes(a.id));
  const totalCents =
    quantity * PRODUCT.priceCents +
    selectedAddons.reduce((sum, a) => sum + a.priceCents, 0);
  const heroSrc = STUDIO_SHOTS[activeColor.id] ?? activeColor.image;

  function selectColor(id: string) {
    setActiveColorId(id);
    setError(null);
  }

  function toggleAddon(id: string) {
    setAddonIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
    );
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
          lines: [
            { variantId: activeColor.variantId, quantity },
            ...selectedAddons
              .filter((a) => a.variantId)
              .map((a) => ({ variantId: a.variantId, quantity: 1 })),
          ],
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
    <div className="flex min-h-svh flex-col bg-white text-black lg:h-dvh">
      <header className="flex items-center justify-between border-b border-black/10 px-5 py-3.5 sm:px-8">
        <Link href="/" aria-label="Caddie Companion" className="flex items-center">
          <Image
            src="/caddie-logo.png"
            alt="Caddie Companion"
            width={160}
            height={50}
            loading="eager"
            className="h-8 w-auto"
          />
        </Link>
        <p className="hidden font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400 sm:block">
          We ship worldwide
        </p>
        <Link
          href="/"
          aria-label="Close"
          className="flex h-9 w-9 items-center justify-center text-zinc-500 transition-colors hover:text-black"
        >
          ✕
        </Link>
      </header>

      <div className="flex flex-1 flex-col lg:min-h-0 lg:flex-row">
        {/* Gallery — the selected finish on the warm editorial surface, framed
            by the mono spec annotations the brand uses everywhere else. */}
        {/* Panel bg matches the colour the photos' edges are feathered to, so
            each shot blends in borderless (see public/product-colours/). */}
        <div className="relative flex min-h-[46svh] items-center justify-center overflow-hidden bg-[#f6f6f6] p-5 sm:p-8 lg:min-h-0 lg:w-[55%]">
          <div className="relative aspect-[1200/896] w-full max-w-[840px]">
            <Image
              key={activeColor.id}
              src={heroSrc}
              alt={`Caddie Companion multi-tool in ${activeColor.name}`}
              fill
              sizes="(max-width: 1024px) 92vw, 840px"
              className="hero-rise object-cover"
              preload
            />
          </div>
          <p className="absolute bottom-6 left-6 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400 sm:bottom-8 sm:left-8">
            Six tools · One frame
          </p>
        </div>

        {/* Configurator — same voice as the home closing section: mono eyebrow,
            big Inter heading, finish rows with dividers, accent on the buy. */}
        <div className="flex flex-1 flex-col border-t border-black/10 lg:w-[45%] lg:overflow-y-auto lg:border-l lg:border-t-0">
          <div className="flex flex-1 flex-col px-6 py-9 sm:px-10 lg:px-14 lg:py-5">
            <div className="mx-auto my-auto w-full max-w-md">
              {/* Title block — the product, said the way the home page says it. */}
              <div className="pb-6">
                <h1 className="font-inter text-3xl font-medium leading-[1.05] tracking-tight text-black sm:text-4xl">
                  {PRODUCT.title}
                </h1>
                <p className="mt-2 font-inter text-lg font-medium tabular-nums text-black">
                  ${(PRODUCT.priceCents / 100).toFixed(0)}{" "}
                  <span className="text-zinc-400">{PRODUCT.currency}</span>
                </p>
              </div>
              <p className="mt-3 font-inter text-base leading-[1.5] text-zinc-500">
                The all-in-one golf multi-tool. Clean clubs, fix divots, and be
                ready for anything, in the finish that suits your bag.
              </p>

              {/* Finish — divider rows, name left, swatch dot right. Same list
                  the home page closes on, so the flow reads as one brand. */}
              <section className="mt-7">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
                  Finish
                </p>
                <ul className="mt-3">
                  {PRODUCT.colors.map((c) => {
                    const selected = activeColorId === c.id;
                    const soon = !c.variantId;
                    return (
                      <li key={c.id} className="border-t border-black/8 last:border-b">
                        <button
                          type="button"
                          onClick={() => selectColor(c.id)}
                          aria-pressed={selected}
                          className="flex w-full cursor-pointer items-center gap-3 py-4 text-left"
                        >
                          <span
                            aria-hidden
                            className={`h-4 w-4 shrink-0 rounded-full transition-all ${
                              selected
                                ? "ring-2 ring-accent ring-offset-2 ring-offset-white"
                                : ""
                            }`}
                            style={{ backgroundColor: FINISH[c.id]?.hex }}
                          />
                          <span
                            className={`font-inter text-sm transition-colors ${
                              selected
                                ? "font-semibold text-black"
                                : "font-medium text-zinc-600 hover:text-black"
                            }`}
                          >
                            {c.name}
                            {soon && (
                              <span className="ml-2 font-normal text-zinc-400">
                                Coming soon
                              </span>
                            )}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>

              {/* Add-ons — same divider-row idiom, square check on the left. */}
              <section className="mt-7">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
                  Add-ons
                </p>
                <ul className="mt-3">
                  {PRODUCT.addons.map((a) => {
                    const selected = addonIds.includes(a.id);
                    const soon = !a.variantId;
                    return (
                      <li key={a.id} className="border-t border-black/8 first:border-t-0">
                        <button
                          type="button"
                          onClick={() => toggleAddon(a.id)}
                          disabled={soon}
                          aria-pressed={selected}
                          className={`flex w-full items-center justify-between gap-4 py-3 text-left ${
                            soon ? "cursor-not-allowed opacity-40" : "cursor-pointer"
                          }`}
                        >
                          <span className="flex items-start gap-3">
                            <span
                              aria-hidden
                              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border transition-colors ${
                                selected
                                  ? "border-black bg-black"
                                  : "border-black/25"
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
                            <span>
                              <span
                                className={`block font-inter text-sm transition-colors ${
                                  selected
                                    ? "font-semibold text-black"
                                    : "font-medium text-zinc-600"
                                }`}
                              >
                                {a.name}
                              </span>
                              <span className="mt-0.5 block font-inter text-xs leading-[1.5] text-zinc-400">
                                {soon ? "Coming soon" : a.description}
                              </span>
                            </span>
                          </span>
                          <span className="shrink-0 font-inter text-sm tabular-nums text-zinc-600">
                            +${(a.priceCents / 100).toFixed(0)}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>

              {/* Materials & specs — collapsed accordion under the add-ons so
                  it's there when wanted without pushing the buy flow off one
                  screen. Native <details> keeps it keyboard-accessible. */}
              <details className="group mt-7 border-t border-black/8">
                <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 [&::-webkit-details-marker]:hidden">
                  <span className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
                    Materials &amp; specs
                  </span>
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
                    className="text-zinc-400 transition-transform group-open:rotate-180"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </summary>
                <ul className="pb-1">
                  {PRODUCT.materials.map((m) => (
                    <li
                      key={m}
                      className="border-t border-black/8 py-2.5 font-inter text-sm text-zinc-600"
                    >
                      {m}
                    </li>
                  ))}
                  <li className="border-t border-black/8 py-2.5 font-inter text-sm tabular-nums text-zinc-600">
                    {PRODUCT.specs.map((s) => s.value).join(" — ")}
                  </li>
                </ul>
              </details>

              {/* Buy row — accent is reserved sitewide for exactly this moment. */}
              <section className="mt-7">
                <div className="flex items-stretch gap-3">
                  <div className="flex shrink-0 items-center border border-black/15">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="flex h-11 w-9 items-center justify-center text-lg text-zinc-500 transition-colors hover:text-black disabled:opacity-25 sm:w-10"
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
                      className="flex h-11 w-9 items-center justify-center text-lg text-zinc-500 transition-colors hover:text-black sm:w-10"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={checkout}
                    disabled={loading || unavailable}
                    className="flex min-w-0 flex-1 items-center justify-center gap-2 bg-accent px-3 font-inter text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-40 disabled:hover:bg-accent sm:gap-2.5 sm:px-6"
                  >
                    {loading ? (
                      "Loading…"
                    ) : unavailable ? (
                      `${activeColor.name} — coming soon`
                    ) : (
                      <>
                        <span>Add to cart</span>
                        <span aria-hidden className="text-white/50">
                          —
                        </span>
                        <span className="tabular-nums">
                          ${(totalCents / 100).toFixed(2)}
                        </span>
                      </>
                    )}
                  </button>
                </div>

                {error && (
                  <p className="mt-3 break-words font-inter text-sm text-red-600">
                    {error}
                  </p>
                )}

                {/* Trust line — de-risks the click, same copy as the home page. */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
                  <ul className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-inter text-xs text-zinc-500">
                    {TRUST.map((item, idx) => (
                      <li key={item} className="flex items-center gap-2.5">
                        {idx > 0 && (
                          <span aria-hidden className="text-zinc-300">
                            ·
                          </span>
                        )}
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className="font-inter text-xs text-zinc-500 underline underline-offset-4 transition-colors hover:text-black"
                  >
                    Questions?
                  </Link>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
