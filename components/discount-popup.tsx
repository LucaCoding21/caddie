"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";

/* ---------------------------------------------------------------------------
 * Weighted prize table. The pick-a-ball choice is cosmetic — the outcome is
 * decided here the moment the visitor taps. Tune the `weight` values to change
 * how often each tier lands (weights are relative, they don't need to sum to
 * 100). Everyone wins something; there is no losing tier.
 * ------------------------------------------------------------------------- */
type Prize = { amount: string; code: string; weight: number };

const PRIZES: Prize[] = [
  { amount: "10% off", code: "SHOP10", weight: 55 }, // most common
  { amount: "15% off", code: "SHOP15", weight: 35 },
  { amount: "20% off", code: "SHOP20", weight: 10 }, // rare
];

// Where "Shop now" sends them — the finish picker / buy page.
const SHOP_HREF = "/select-color";

// Once-per-visitor gate + trigger timing.
const STORAGE_KEY = "caddie_discount_popup_seen";
const OPEN_DELAY_MS = 6000; // fire this long after load, if no exit-intent first

/** Pick a prize by weighted random. */
function drawPrize(): Prize {
  const total = PRIZES.reduce((sum, p) => sum + p.weight, 0);
  let roll = Math.random() * total;
  for (const prize of PRIZES) {
    roll -= prize.weight;
    if (roll < 0) return prize;
  }
  return PRIZES[PRIZES.length - 1]; // float-safety fallback
}

/**
 * On-load "pick one of three" discount reveal. Three ball-marker discs sit side
 * by side; tapping one flips it to reveal a discount, then shows the code to
 * copy and a shop-now CTA. Drops in site-wide via the root layout.
 */
export default function DiscountPopup() {
  const [open, setOpen] = useState(false);
  // null = nothing picked yet; otherwise the index of the flipped disc.
  const [pickedIndex, setPickedIndex] = useState<number | null>(null);
  const [prize, setPrize] = useState<Prize | null>(null);
  const [copied, setCopied] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const headingId = useId();
  const descId = useId();

  /* --- Once-per-visitor show logic ---------------------------------------
   * TODO(show-logic): This is a lightweight localStorage gate. Harden as needed
   * for production — e.g. a cookie with an explicit TTL so the offer can return
   * after N days, syncing the flag with your consent/analytics layer, and
   * suppressing on the checkout/thank-you routes. */
  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // Private mode / storage disabled — fail open, just show once per load.
    }
    if (seen) return;

    let done = false;
    const trigger = () => {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      document.removeEventListener("mouseout", onExitIntent);
      setOpen(true);
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
    };

    // Exit intent: pointer leaves through the top of the viewport (desktop).
    const onExitIntent = (e: MouseEvent) => {
      if (e.relatedTarget === null && e.clientY <= 0) trigger();
    };

    // Fallback so touch users (no exit intent) still see it after a short beat.
    const timer = window.setTimeout(trigger, OPEN_DELAY_MS);
    document.addEventListener("mouseout", onExitIntent);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mouseout", onExitIntent);
    };
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    restoreFocusRef.current?.focus?.();
  }, []);

  // Lock scroll, remember/restore focus, and move focus into the dialog on open.
  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Focus the dialog itself so Esc + the trap work immediately.
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Esc to close + a simple focus trap so Tab stays inside the dialog.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
      return;
    }
    if (e.key !== "Tab") return;
    const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables || focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  function handlePick(index: number) {
    if (pickedIndex !== null) return; // one pick only
    setPrize(drawPrize());
    setPickedIndex(index);
  }

  async function copyCode() {
    if (!prize) return;
    try {
      await navigator.clipboard.writeText(prize.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }

    /* TODO(record-claim): fire-and-forget the claimed code to your backend /
     * email platform here if you want to track redemptions or attach the code
     * to a visitor. No email is collected — this is purely optional analytics.
     *   fetch("/api/discount/claim", {
     *     method: "POST",
     *     headers: { "Content-Type": "application/json" },
     *     body: JSON.stringify({ code: prize.code, amount: prize.amount }),
     *   }).catch(() => {});
     */
  }

  if (!open) return null;

  const revealed = pickedIndex !== null;

  return (
    <div
      // Backdrop — click outside to dismiss.
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-6 py-8 backdrop-blur-[2px] motion-safe:animate-[fadeIn_.25s_ease]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-describedby={descId}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className="relative w-full max-w-md rounded-2xl border border-black/10 bg-white px-7 py-9 text-center shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)] outline-none sm:px-9 sm:py-10 motion-safe:animate-[popIn_.35s_cubic-bezier(0.16,1,0.3,1)]"
      >
        {/* Close (X) */}
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-black/5 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
            <path
              d="M1 1l13 13M14 1L1 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Eyebrow */}
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
          {revealed ? "You're in" : "One tap, one prize"}
        </p>

        {/* Heading */}
        <h2
          id={headingId}
          className="mt-3 font-brand text-2xl font-medium tracking-[-0.02em] text-black sm:text-[1.75rem]"
        >
          {revealed ? "Here's your discount" : "Pick your marker"}
        </h2>

        {/* Sub-copy */}
        <p
          id={descId}
          className="mx-auto mt-2.5 max-w-xs font-inter text-sm leading-[1.6] text-zinc-600"
        >
          {revealed
            ? "Use this code at checkout. It's yours to keep."
            : "Three markers, one hidden discount. Choose one to reveal what's underneath."}
        </p>

        {/* --- The three discs -------------------------------------------- */}
        <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4">
          {[0, 1, 2].map((i) => {
            const isPicked = pickedIndex === i;
            const dimmed = revealed && !isPicked;
            return (
              <div key={i} className="[perspective:800px]">
                <button
                  type="button"
                  onClick={() => handlePick(i)}
                  disabled={revealed}
                  aria-label={
                    isPicked && prize
                      ? `Revealed ${prize.amount}`
                      : `Marker ${i + 1}, reveal discount`
                  }
                  className={`group relative block size-[76px] rounded-full transition-[transform,opacity] duration-500 [transform-style:preserve-3d] sm:size-[84px] ${
                    isPicked ? "[transform:rotateY(180deg)]" : ""
                  } ${
                    dimmed ? "scale-90 opacity-40" : ""
                  } ${
                    !revealed
                      ? "cursor-pointer hover:-translate-y-1 focus-visible:outline-none"
                      : "cursor-default"
                  }`}
                >
                  {/* Front — golf-ball / marker face */}
                  <span
                    className="absolute inset-0 flex items-center justify-center rounded-full border border-black/10 bg-white shadow-[0_8px_20px_-8px_rgba(0,0,0,0.4),inset_0_-6px_14px_-8px_rgba(0,0,0,0.25)] [backface-visibility:hidden] transition-shadow group-hover:shadow-[0_14px_28px_-10px_rgba(0,0,0,0.45),inset_0_-6px_14px_-8px_rgba(0,0,0,0.25)] group-focus-visible:ring-2 group-focus-visible:ring-accent group-focus-visible:ring-offset-2"
                    style={{
                      backgroundImage:
                        "radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1.4px)",
                      backgroundSize: "9px 9px",
                    }}
                  >
                    {/* Centre pip — reads as a ball marker */}
                    <span className="size-2.5 rounded-full bg-accent/80" />
                  </span>

                  {/* Back — the revealed discount, cobalt (the live moment) */}
                  <span className="absolute inset-0 flex items-center justify-center rounded-full bg-accent text-white shadow-[0_10px_24px_-8px_rgba(26,65,158,0.6)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <span className="px-1 text-center font-brand text-[15px] font-medium leading-tight sm:text-base">
                      {prize?.amount}
                    </span>
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* --- Post-reveal: code + copy + CTA ----------------------------- */}
        {revealed && prize && (
          <div className="mt-8 motion-safe:animate-[fadeUp_.5s_.2s_both_cubic-bezier(0.16,1,0.3,1)]">
            {/* Code chip with copy */}
            <div className="mx-auto flex max-w-xs items-stretch overflow-hidden rounded-full border border-black/15">
              <span className="flex flex-1 items-center justify-center py-3 pl-5 font-mono text-base font-medium tracking-[0.14em] text-black">
                {prize.code}
              </span>
              <button
                type="button"
                onClick={copyCode}
                className="flex items-center gap-1.5 border-l border-black/15 bg-black px-5 py-3 font-inter text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            {/* Shop now — the buy action, so it carries the cobalt accent. */}
            <Link
              href={SHOP_HREF}
              onClick={close}
              className="mt-5 inline-flex w-full max-w-xs items-center justify-center rounded-full bg-accent px-8 py-3.5 font-inter text-sm font-medium text-white transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Shop now
            </Link>

            <button
              type="button"
              onClick={close}
              className="mt-4 font-inter text-sm text-zinc-400 underline-offset-4 transition-colors hover:text-zinc-600 hover:underline"
            >
              No thanks
            </button>
          </div>
        )}
      </div>

      {/* Component-scoped keyframes. Every entrance is gated behind motion-safe
          above, so prefers-reduced-motion users get an instant, static popup. */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn {
          from { opacity: 0; transform: translateY(12px) scale(.97) }
          to   { opacity: 1; transform: none }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px) }
          to   { opacity: 1; transform: none }
        }
      `}</style>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * TODO(generate-code): The codes above (SHOP10 / 15 / 20) are static
 * placeholders. Swap PRIZES[].code for real, single-use codes — either
 * pre-generated in Shopify and mapped by tier, or minted on demand from a route
 * (e.g. GET /api/discount/mint?tier=15 -> { code }) called inside handlePick /
 * drawPrize once a prize is drawn.
 * ------------------------------------------------------------------------- */
