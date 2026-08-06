"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import Faq from "@/components/faq";
import { Stars } from "@/components/reviews";
import { FOUR_PACK, FOURSOME, PRODUCT } from "@/lib/products";
import FourPackUpsell from "@/components/four-pack-upsell";
import { AVERAGE_RATING } from "@/lib/reviews";
import { trackMetaEvent } from "@/lib/meta-pixel";

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
  black: "/product-colours/caddie-companion-divot-tool-black.jpg",
  blue: "/product-colours/caddie-companion-divot-tool-blue.jpg",
  green: "/product-colours/caddie-companion-divot-tool-green.jpg",
  red: "/product-colours/caddie-companion-divot-tool-red.jpg",
};

// Trust line — same de-risking copy as the home buy moment. Shipping is no
// longer listed here: it's free only on 2-packs, surfaced as the buy-2 deal.
const TRUST = ["30-day returns", "1-yr guarantee"];

function SelectColorConfigurator() {
  const searchParams = useSearchParams();

  // Open pre-configured when arriving from the home buy moment, which passes
  // the chosen finish + add-ons as query params. Fall back to defaults.
  const initialColorId = PRODUCT.colors.some(
    (c) => c.id === searchParams.get("color")
  )
    ? (searchParams.get("color") as string)
    : "black";
  const initialAddonIds = (searchParams.get("addons") ?? "")
    .split(",")
    .filter((id) => PRODUCT.addons.some((a) => a.id === id));
  // Arriving from a Foursome link (home page card) opens with the Foursome
  // already in the order and previewed in the gallery.
  const initialFoursome = searchParams.get("foursome") === "1";

  // Per-colour quantities, keyed by colour id (a colour absent from the map is
  // simply 0). Seed the colour we arrived on at 1 if it's actually orderable.
  const initialColor = PRODUCT.colors.find((c) => c.id === initialColorId);
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    // A Foursome arrival starts with just the Foursome — no loose tool seeded.
    initialFoursome || !initialColor?.variantId ? {} : { [initialColorId]: 1 }
  );
  // The Foursome line: one of each colour as a single $139 item.
  const [foursomeQty, setFoursomeQty] = useState(initialFoursome ? 1 : 0);
  // When true, the gallery previews the Foursome group shot.
  const [previewFoursome, setPreviewFoursome] = useState(initialFoursome);
  // The finish the gallery is previewing — whichever row was last touched.
  const [activeColorId, setActiveColorId] = useState(initialColorId);
  // Add-on quantities, keyed by add-on id (absent = 0). Seed any add-on passed
  // in the query at 1.
  const [addonQty, setAddonQty] = useState<Record<string, number>>(() => {
    const seed: Record<string, number> = {};
    for (const id of initialAddonIds) seed[id] = 1;
    return seed;
  });
  // When set, the gallery previews this add-on instead of the active finish.
  // Touching any finish clears it back to the colour preview.
  const [previewAddonId, setPreviewAddonId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Optional promo code. `codeOpen` reveals the field so it stays out of the way
  // until a shopper actually has a code to enter.
  const [codeOpen, setCodeOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState("");

  const activeIdx = Math.max(
    0,
    PRODUCT.colors.findIndex((c) => c.id === activeColorId)
  );
  const activeColor = PRODUCT.colors[activeIdx];
  const totalUnits = PRODUCT.colors.reduce(
    (sum, c) => sum + (quantities[c.id] ?? 0),
    0
  );
  const addonsCents = PRODUCT.addons.reduce(
    (sum, a) => sum + (addonQty[a.id] ?? 0) * a.priceCents,
    0
  );
  const totalCents =
    totalUnits * PRODUCT.priceCents +
    foursomeQty * FOURSOME.priceCents +
    addonsCents;
  const anythingSelected = totalUnits + foursomeQty > 0;
  // Shopify's automatic four-pack discount, mirrored here so the CTA shows the
  // price checkout will actually charge once 4 tools are in the cart.
  const dealCents = totalUnits >= FOUR_PACK.units ? FOUR_PACK.savingsCents : 0;

  // Gallery preview: the Foursome group shot or an add-on if one is selected
  // for preview, else the active finish's studio shot.
  const previewAddon = previewAddonId
    ? PRODUCT.addons.find((a) => a.id === previewAddonId)
    : null;
  const heroSrc = previewFoursome
    ? FOURSOME.image
    : previewAddon
      ? previewAddon.image
      : STUDIO_SHOTS[activeColor.id] ?? activeColor.image;
  const heroAlt = previewFoursome
    ? "Caddie Companion golf multi-tool in all four colors"
    : previewAddon
      ? previewAddon.name
      : `Caddie Companion golf multi-tool in ${activeColor.name}`;
  const heroKey = previewFoursome
    ? "foursome"
    : previewAddon
      ? `addon-${previewAddon.id}`
      : activeColor.id;

  // Tap a row to preview that finish in the gallery, without changing its qty.
  function previewColor(id: string) {
    setActiveColorId(id);
    setPreviewAddonId(null);
    setPreviewFoursome(false);
    setError(null);
  }

  // Preview an add-on's image in the gallery, without changing its qty.
  function previewAddonImage(id: string) {
    setPreviewAddonId(id);
    setPreviewFoursome(false);
    setError(null);
  }

  // Preview the Foursome group shot in the gallery, without changing its qty.
  function previewFoursomeImage() {
    setPreviewFoursome(true);
    setPreviewAddonId(null);
    setError(null);
  }

  // Adjust one colour's quantity; clamp at 0 and drop the key when it hits 0 so
  // the map only ever holds colours actually in the cart. Also previews it.
  function changeQty(id: string, delta: number) {
    setQuantities((q) => {
      const next = Math.max(0, (q[id] ?? 0) + delta);
      const copy = { ...q };
      if (next === 0) delete copy[id];
      else copy[id] = next;
      return copy;
    });
    setActiveColorId(id);
    setPreviewAddonId(null);
    setPreviewFoursome(false);
    setError(null);
  }

  // "Add N more" from the four-pack nudge: top up the finish being previewed,
  // falling back to the first orderable finish if that one is coming-soon.
  function addUnits(count: number) {
    const target = activeColor?.variantId
      ? activeColor
      : PRODUCT.colors.find((c) => c.variantId);
    if (target) changeQty(target.id, count);
  }

  // Adjust the Foursome quantity; clamp at 0. Also previews the group shot.
  function changeFoursomeQty(delta: number) {
    setFoursomeQty((q) => Math.max(0, q + delta));
    setPreviewFoursome(true);
    setPreviewAddonId(null);
    setError(null);
  }

  // Same clamp-and-drop pattern as the colours, for add-on quantities. Also
  // previews the add-on in the gallery.
  function changeAddonQty(id: string, delta: number) {
    setAddonQty((q) => {
      const next = Math.max(0, (q[id] ?? 0) + delta);
      const copy = { ...q };
      if (next === 0) delete copy[id];
      else copy[id] = next;
      return copy;
    });
    setPreviewAddonId(id);
    setPreviewFoursome(false);
    setError(null);
  }

  async function checkout() {
    if (!anythingSelected) return;
    setLoading(true);
    setError(null);

    // This one click is both cart-add and checkout-start (there's no separate
    // cart page — the button builds a Shopify cart and redirects straight to
    // its checkout), so it sends both Meta standard events. Fired before the
    // fetch: the redirect at the end of this function unloads the page.
    const contents = [
      ...(foursomeQty > 0
        ? [
            {
              id: FOURSOME.variantId,
              quantity: foursomeQty,
              item_price: FOURSOME.priceCents / 100,
            },
          ]
        : []),
      ...PRODUCT.colors
        .filter((c) => c.variantId && (quantities[c.id] ?? 0) > 0)
        .map((c) => ({
          id: c.variantId as string,
          quantity: quantities[c.id],
          item_price: PRODUCT.priceCents / 100,
        })),
      ...PRODUCT.addons
        .filter((a) => a.variantId && (addonQty[a.id] ?? 0) > 0)
        .map((a) => ({
          id: a.variantId as string,
          quantity: addonQty[a.id],
          item_price: a.priceCents / 100,
        })),
    ];
    // Report what checkout will actually charge, net of the four-pack discount.
    const value = (totalCents - dealCents) / 100;
    trackMetaEvent("AddToCart", {
      content_type: "product",
      contents,
      value,
      currency: PRODUCT.currency,
    });
    trackMetaEvent("InitiateCheckout", {
      content_type: "product",
      contents,
      value,
      currency: PRODUCT.currency,
      num_items: totalUnits + foursomeQty * FOURSOME.units,
    });

    try {
      const colorLines = PRODUCT.colors
        .filter((c) => c.variantId && (quantities[c.id] ?? 0) > 0)
        .map((c) => ({ variantId: c.variantId, quantity: quantities[c.id] }));
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: [
            ...(foursomeQty > 0
              ? [{ variantId: FOURSOME.variantId, quantity: foursomeQty }]
              : []),
            ...colorLines,
            ...PRODUCT.addons
              .filter((a) => a.variantId && (addonQty[a.id] ?? 0) > 0)
              .map((a) => ({ variantId: a.variantId, quantity: addonQty[a.id] })),
          ],
          discountCode: discountCode.trim() || undefined,
        }),
      });
      const json = await res.json();
      // A bad promo code comes back 422 — keep the shopper here to fix it rather
      // than sending them to checkout at full price.
      if (res.status === 422 && json.error === "invalid_discount") {
        setError("That code isn't valid. Check it and try again.");
        setLoading(false);
        return;
      }
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
    <>
    <div className="flex min-h-svh flex-col bg-white text-black lg:h-dvh">
      {/* Same persistent nav as every other page (solid: dark logo over the
          light buy flow). The logo and menu carry the way back home. */}
      <SiteHeader solid />

      <div className="flex flex-1 flex-col lg:min-h-0 lg:flex-row">
        {/* Gallery — the selected finish on the warm editorial surface, framed
            by the mono spec annotations the brand uses everywhere else. */}
        {/* Panel bg matches the colour the photos' edges are feathered to, so
            each shot blends in borderless (see public/product-colours/). */}
        <div className="relative flex min-h-[46svh] items-center justify-center overflow-hidden bg-[#f6f6f6] p-5 sm:p-8 lg:min-h-0 lg:w-[55%]">
          <div className="relative aspect-[1200/896] w-full max-w-[840px]">
            <Image
              key={heroKey}
              src={heroSrc}
              alt={heroAlt}
              fill
              sizes="(max-width: 1024px) 92vw, 840px"
              // The Foursome group shot is a 2:1 landscape — contain it so all
              // four tools stay in frame; the studio shots fill as before.
              className={`hero-rise ${
                previewFoursome ? "object-contain" : "object-cover"
              }`}
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
          <div className="flex flex-1 flex-col px-6 py-9 sm:px-10 lg:px-14 lg:pb-5 lg:pt-20">
            <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
              {/* Title block — the product, said the way the home page says it. */}
              <div className="pb-6">
                <h1 className="font-inter text-3xl font-medium leading-[1.05] tracking-tight text-black sm:text-4xl">
                  {PRODUCT.title}
                </h1>
                <p className="mt-2 font-inter text-lg font-medium tabular-nums text-black">
                  ${(PRODUCT.priceCents / 100).toFixed(0)}{" "}
                  <span className="text-zinc-400">{PRODUCT.currency}</span>
                </p>
                {/* The buy page's only social proof — same source of truth as
                    the home reviews section and the Product JSON-LD. */}
                <div className="mt-2.5 flex items-center gap-2">
                  <Stars rating={AVERAGE_RATING} className="h-3.5 w-3.5" />
                  <span className="font-inter text-xs text-zinc-500">
                    {AVERAGE_RATING.toFixed(1)} · Amazon-verified reviews
                  </span>
                </div>
              </div>
              <p className="mt-3 font-inter text-base leading-[1.5] text-zinc-500">
                The all-in-one golf multi-tool. Clean clubs, fix divots, and be
                ready for anything, in the finish that suits your bag.
              </p>

              {/* Finish — divider rows: swatch + name on the left (tap to
                  preview in the gallery), a per-colour quantity stepper on the
                  right so a single order can mix finishes. */}
              <section className="mt-7">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
                  Finish
                </p>
                <ul className="mt-3">
                  {PRODUCT.colors.map((c) => {
                    const active = activeColorId === c.id;
                    const qty = quantities[c.id] ?? 0;
                    const soon = !c.variantId;
                    return (
                      <li
                        key={c.id}
                        className="flex items-center gap-3 border-t border-black/8 py-2.5 last:border-b"
                      >
                        <button
                          type="button"
                          onClick={() => previewColor(c.id)}
                          aria-pressed={active}
                          className="flex flex-1 cursor-pointer items-center gap-3 py-1.5 text-left"
                        >
                          <span
                            aria-hidden
                            className={`h-4 w-4 shrink-0 rounded-full transition-all ${
                              active
                                ? "ring-2 ring-accent ring-offset-2 ring-offset-white"
                                : ""
                            }`}
                            style={{ backgroundColor: FINISH[c.id]?.hex }}
                          />
                          <span
                            className={`font-inter text-sm transition-colors ${
                              qty > 0 || active
                                ? "font-semibold text-black"
                                : "font-medium text-zinc-600 hover:text-black"
                            }`}
                          >
                            {c.name}
                          </span>
                        </button>
                        {soon ? (
                          <span className="font-inter text-xs text-zinc-400">
                            Coming soon
                          </span>
                        ) : (
                          <div className="flex shrink-0 items-center">
                            <button
                              type="button"
                              onClick={() => changeQty(c.id, -1)}
                              disabled={qty <= 0}
                              aria-label={`Decrease ${c.name} quantity`}
                              className="flex h-9 w-8 items-center justify-center text-base text-zinc-500 transition-colors hover:text-black disabled:opacity-25"
                            >
                              −
                            </button>
                            <span className="w-7 text-center font-inter text-sm font-medium tabular-nums">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => changeQty(c.id, 1)}
                              aria-label={`Increase ${c.name} quantity`}
                              className="flex h-9 w-8 items-center justify-center text-base text-zinc-500 transition-colors hover:text-black"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>

                {/* The Foursome — one of each finish as a single line item.
                    Leads with the colours (the four dots), not the savings.
                    A real Shopify product, so its revenue reads on its own
                    in analytics — the point of the experiment. */}
                <div className="mt-4 border border-black/10 bg-zinc-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={previewFoursomeImage}
                      aria-pressed={previewFoursome}
                      className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 py-1 text-left"
                    >
                      <span aria-hidden className="flex shrink-0 -space-x-1.5">
                        {PRODUCT.colors.map((c) => (
                          <span
                            key={c.id}
                            className="h-4 w-4 rounded-full ring-2 ring-zinc-50"
                            style={{ backgroundColor: FINISH[c.id]?.hex }}
                          />
                        ))}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block font-inter text-sm transition-colors ${
                            foursomeQty > 0 || previewFoursome
                              ? "font-semibold text-black"
                              : "font-medium text-zinc-600 hover:text-black"
                          }`}
                        >
                          {FOURSOME.title}
                          <span className="ml-1.5 font-normal tabular-nums text-zinc-400">
                            ${(FOURSOME.priceCents / 100).toFixed(0)}
                          </span>
                        </span>
                        <span className="mt-0.5 block font-inter text-xs leading-[1.5] text-zinc-500">
                          {FOURSOME.blurb}
                        </span>
                      </span>
                    </button>
                    <div className="flex shrink-0 items-center">
                      <button
                        type="button"
                        onClick={() => changeFoursomeQty(-1)}
                        disabled={foursomeQty <= 0}
                        aria-label="Decrease Foursome quantity"
                        className="flex h-9 w-8 items-center justify-center text-base text-zinc-500 transition-colors hover:text-black disabled:opacity-25"
                      >
                        −
                      </button>
                      <span className="w-7 text-center font-inter text-sm font-medium tabular-nums">
                        {foursomeQty}
                      </span>
                      <button
                        type="button"
                        onClick={() => changeFoursomeQty(1)}
                        aria-label="Increase Foursome quantity"
                        className="flex h-9 w-8 items-center justify-center text-base text-zinc-500 transition-colors hover:text-black"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Add-ons — same divider-row idiom as the finishes: thumbnail +
                  name/price/blurb on the left, a quantity stepper on the right
                  so spares can be ordered in multiples. */}
              <section className="mt-7">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
                  Add-ons
                </p>
                <ul className="mt-3">
                  {PRODUCT.addons.map((a) => {
                    const qty = addonQty[a.id] ?? 0;
                    const soon = !a.variantId;
                    return (
                      <li
                        key={a.id}
                        className="flex items-center gap-3 border-t border-black/8 py-3 first:border-t-0"
                      >
                        <button
                          type="button"
                          onClick={() => previewAddonImage(a.id)}
                          aria-pressed={previewAddonId === a.id}
                          className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
                        >
                          <Image
                            src={a.image}
                            alt={a.name}
                            width={112}
                            height={84}
                            className="h-12 w-14 shrink-0 object-contain"
                          />
                          <span className="min-w-0 flex-1">
                            <span
                              className={`block font-inter text-sm transition-colors ${
                                qty > 0 || previewAddonId === a.id
                                  ? "font-semibold text-black"
                                  : "font-medium text-zinc-600 hover:text-black"
                              }`}
                            >
                              {a.name}
                              <span className="ml-1.5 font-normal tabular-nums text-zinc-400">
                                +${(a.priceCents / 100).toFixed(0)}
                              </span>
                            </span>
                            <span className="mt-0.5 block font-inter text-xs leading-[1.5] text-zinc-400">
                              {soon ? "Coming soon" : a.description}
                            </span>
                          </span>
                        </button>
                        {soon ? null : (
                          <div className="flex shrink-0 items-center self-center">
                            <button
                              type="button"
                              onClick={() => changeAddonQty(a.id, -1)}
                              disabled={qty <= 0}
                              aria-label={`Decrease ${a.name} quantity`}
                              className="flex h-9 w-8 items-center justify-center text-base text-zinc-500 transition-colors hover:text-black disabled:opacity-25"
                            >
                              −
                            </button>
                            <span className="w-7 text-center font-inter text-sm font-medium tabular-nums">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => changeAddonQty(a.id, 1)}
                              aria-label={`Increase ${a.name} quantity`}
                              className="flex h-9 w-8 items-center justify-center text-base text-zinc-500 transition-colors hover:text-black"
                            >
                              +
                            </button>
                          </div>
                        )}
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
                <ul className="list-disc space-y-1.5 pb-2 pl-5 marker:text-zinc-300">
                  {PRODUCT.materials.map((m) => (
                    <li key={m} className="font-inter text-sm text-zinc-600">
                      {m}
                    </li>
                  ))}
                  <li className="font-inter text-sm tabular-nums text-zinc-600">
                    {PRODUCT.specs.map((s) => s.value).join(" — ")}
                  </li>
                </ul>
              </details>

              {/* Buy row — accent is reserved sitewide for exactly this moment.
                  Quantity now lives per-colour in the finish rows, so this is
                  just the full-width CTA summing every finish + add-ons. */}
              <section className="mt-7">
                {/* Promo code — hidden behind a link so it doesn't clutter the
                    buy moment for the shopper who doesn't have one. Shopify
                    validates the code; an invalid one surfaces below the CTA. */}
                {codeOpen ? (
                  <div className="mb-3 flex items-center gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => {
                        setDiscountCode(e.target.value);
                        setError(null);
                      }}
                      placeholder="Discount code"
                      autoCapitalize="characters"
                      autoComplete="off"
                      spellCheck={false}
                      // text-base (16px): anything smaller makes iOS Safari
                      // zoom the page when the field is focused on mobile.
                      className="min-w-0 flex-1 border border-zinc-300 bg-white px-3.5 py-3 font-inter text-base uppercase tracking-wide text-black placeholder:normal-case placeholder:tracking-normal placeholder:text-zinc-400 focus:border-black focus:outline-none sm:py-2.5 sm:text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && totalUnits > 0 && !loading)
                          checkout();
                      }}
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCodeOpen(true)}
                    className="mb-3 inline-flex items-center gap-1.5 py-1 font-inter text-sm font-medium text-zinc-600 underline underline-offset-4 transition-colors hover:text-black sm:text-[13px]"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                      className="text-zinc-400"
                    >
                      <path
                        d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="7" cy="7" r="1.4" fill="currentColor" />
                    </svg>
                    Have a discount code?
                  </button>
                )}

                <button
                  onClick={checkout}
                  disabled={loading || !anythingSelected}
                  className="flex w-full min-w-0 items-center justify-center gap-2 bg-accent px-3 py-3 font-inter text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-40 disabled:hover:bg-accent sm:gap-2.5 sm:px-6"
                >
                  {loading ? (
                    "Loading…"
                  ) : !anythingSelected ? (
                    "Add to cart"
                  ) : (
                    <>
                      <span>Add to cart</span>
                      <span aria-hidden className="text-white/50">
                        —
                      </span>
                      {/* At 4+ tools show the four-pack price checkout will
                          charge, with the full total struck through. */}
                      {dealCents > 0 && (
                        <s className="tabular-nums font-normal text-white/50">
                          ${(totalCents / 100).toFixed(2)}
                        </s>
                      )}
                      <span className="tabular-nums">
                        ${((totalCents - dealCents) / 100).toFixed(2)}
                      </span>
                    </>
                  )}
                </button>

                {error && (
                  <p className="mt-3 break-words font-inter text-sm text-red-600">
                    {error}
                  </p>
                )}

                {/* Deal slot under the CTA — the free-shipping line at 0-1
                    units, the four-pack upsell at 2-3, and the applied
                    confirmation at 4+ (units counted across finishes). */}
                <FourPackUpsell
                  totalUnits={totalUnits}
                  foursomeInCart={foursomeQty > 0}
                  onAdd={addUnits}
                />
              </section>

            </div>

            {/* Trust line — anchored to the bottom of the configurator column
                and pushed out to its left/right corners (full width, no max-w
                clamp), de-risking the buy without crowding the deal + CTA. */}
            <div className="mt-12 flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-1 sm:mt-8 sm:justify-between">
              <ul className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 font-inter text-xs text-zinc-500 sm:justify-start">
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
                <li className="flex items-center gap-2.5">
                  <span aria-hidden className="text-zinc-300">
                    ·
                  </span>
                  <a
                    href="https://www.amazon.com/Caddie-Companion-Golf-Multi-Tool-6/dp/B0GSS94XCD?th=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 transition-colors hover:text-black"
                  >
                    Also available on Amazon
                  </a>
                </li>
              </ul>
              <Link
                href="/contact"
                className="font-inter text-xs text-zinc-500 underline underline-offset-4 transition-colors hover:text-black"
              >
                Questions?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* FAQ below the viewport-locked configurator — same answers as the home
        page (shared from lib/faqs.ts), so buyers can settle questions without
        leaving the buy flow. */}
    <Faq />
    </>
  );
}

export default function SelectColorPage() {
  // useSearchParams requires a Suspense boundary so the rest of the route can
  // still be prerendered; the configurator is light enough that no visible
  // fallback is needed.
  return (
    <Suspense>
      <SelectColorConfigurator />
    </Suspense>
  );
}
