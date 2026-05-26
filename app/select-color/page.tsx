"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCT } from "@/lib/products";

export default function SelectColorPage() {
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(
      PRODUCT.colors.map((c) => [c.id, c.id === "black" ? 1 : 0])
    )
  );
  const [activeColorId, setActiveColorId] = useState("black");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeColor =
    PRODUCT.colors.find((c) => c.id === activeColorId) ?? PRODUCT.colors[0];
  const totalQty = Object.values(quantities).reduce((a, b) => a + b, 0);
  const totalCents = totalQty * PRODUCT.priceCents;

  function setQty(id: string, qty: number) {
    setQuantities((q) => ({ ...q, [id]: Math.max(0, qty) }));
    setActiveColorId(id);
  }

  async function checkout() {
    setLoading(true);
    setError(null);
    try {
      const lines: { variantId: string; quantity: number }[] = [];
      for (const c of PRODUCT.colors) {
        const qty = quantities[c.id] ?? 0;
        if (qty <= 0) continue;
        if (!c.variantId) {
          throw new Error(`${c.name} isn't available yet`);
        }
        lines.push({ variantId: c.variantId, quantity: qty });
      }
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines }),
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
    <div className="min-h-screen bg-white text-black flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
        <Link href="/" className="font-semibold tracking-tight">
          Caddie
        </Link>
        <p className="hidden sm:block text-sm text-zinc-500">
          We ship worldwide.
        </p>
        <Link
          href="/"
          aria-label="Close"
          className="h-8 w-8 flex items-center justify-center text-zinc-600 hover:text-black"
        >
          ✕
        </Link>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-zinc-100 flex items-center justify-center p-8 min-h-[40vh]">
          <Image
            src={activeColor.image}
            alt={activeColor.name}
            width={800}
            height={800}
            className="max-h-[60vh] w-auto object-contain"
            priority
          />
        </div>

        <div className="md:w-1/2 flex flex-col p-8 md:p-12 gap-8">
          <h1 className="text-3xl md:text-5xl font-light leading-tight md:text-right">
            Purchase your
            <br />
            <span className="font-semibold">{PRODUCT.title}</span>
          </h1>

          <section>
            <h2 className="text-sm font-semibold mb-3">Choose your color.</h2>
            <ul className="divide-y divide-zinc-200 border-y border-zinc-200">
              {PRODUCT.colors.map((c) => {
                const qty = quantities[c.id] ?? 0;
                const unavailable = !c.variantId;
                return (
                  <li
                    key={c.id}
                    onClick={() => setActiveColorId(c.id)}
                    className={`flex items-center gap-4 py-4 cursor-pointer transition-colors ${
                      activeColorId === c.id ? "bg-zinc-50" : ""
                    }`}
                  >
                    <span className="flex-1 text-sm">
                      {c.name}
                      {unavailable && (
                        <span className="ml-2 text-xs text-zinc-400">
                          (coming soon)
                        </span>
                      )}
                    </span>
                    <Image
                      src={c.image}
                      alt={c.name}
                      width={56}
                      height={56}
                      className="h-12 w-12 object-contain"
                    />
                    <div className="flex items-center gap-2 select-none">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setQty(c.id, qty - 1);
                        }}
                        disabled={qty <= 0}
                        className="h-7 w-7 rounded-full border border-zinc-300 text-zinc-600 disabled:opacity-30 leading-none"
                        aria-label={`Decrease ${c.name}`}
                      >
                        −
                      </button>
                      <span className="w-6 text-center tabular-nums text-sm">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setQty(c.id, qty + 1);
                        }}
                        disabled={unavailable}
                        title={unavailable ? "Coming soon" : undefined}
                        className="h-7 w-7 rounded-full border border-zinc-300 text-zinc-600 disabled:opacity-30 leading-none"
                        aria-label={`Increase ${c.name}`}
                      >
                        +
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {error && (
            <p className="text-sm text-red-600 break-words">{error}</p>
          )}
        </div>
      </div>

      <footer className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 bg-white sticky bottom-0">
        <p className="text-2xl font-semibold tabular-nums">
          ${(totalCents / 100).toFixed(2)}
        </p>
        <button
          onClick={checkout}
          disabled={loading || totalQty === 0}
          className="bg-black text-white px-8 py-3 rounded-md disabled:opacity-40"
        >
          {loading ? "Loading…" : "Checkout"}
        </button>
      </footer>
    </div>
  );
}
