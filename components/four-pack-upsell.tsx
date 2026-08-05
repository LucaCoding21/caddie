"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { FOUR_PACK } from "@/lib/products";

gsap.registerPlugin(useGSAP);

/**
 * The deal slot under the buy CTA, tier-aware on the unit count:
 *
 *   0-1 units  — the quiet free-shipping line (the baseline nudge).
 *   2-3 units  — the four-pack upsell: progress bars, savings, and an
 *                "Add N more" shortcut that tops the cart up to 4.
 *   4+  units  — the applied state confirming the checkout price, so the
 *                shopper trusts the number before Shopify shows it.
 *
 * Motion (all skipped under prefers-reduced-motion): the card pops in with a
 * small back-ease overshoot when a tier appears, each progress bar snaps in as
 * it fills, stepper taps inside the upsell tier give the copy a short recoil,
 * and reaching 4 draws the check.
 */
export default function FourPackUpsell({
  totalUnits,
  onAdd,
}: {
  totalUnits: number;
  onAdd: (count: number) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tier =
    totalUnits >= FOUR_PACK.units
      ? "applied"
      : totalUnits >= 2
        ? "upsell"
        : "quiet";
  const remaining = FOUR_PACK.units - totalUnits;
  const filled = Math.min(totalUnits, FOUR_PACK.units);
  // Previous render's tier + count, so the effect can tell "tier appeared"
  // (entrance pop) apart from "count changed within a tier" (bar pop + recoil).
  const prevRef = useRef({ tier, filled });

  const price = `$${(FOUR_PACK.priceCents / 100).toFixed(0)}`;
  const full = `$${((FOUR_PACK.priceCents + FOUR_PACK.savingsCents) / 100).toFixed(0)}`;
  const savings = `$${(FOUR_PACK.savingsCents / 100).toFixed(0)}`;

  useGSAP(
    () => {
      const prev = prevRef.current;
      prevRef.current = { tier, filled };
      if (tier === "quiet") return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const q = gsap.utils.selector(rootRef);
      const entered = tier !== prev.tier;

      if (entered) {
        gsap.fromTo(
          q(".fp-card"),
          { autoAlpha: 0, y: 10, scale: 0.96 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
        if (tier === "applied") {
          gsap.fromTo(
            q(".fp-check-path"),
            { strokeDashoffset: 1 },
            {
              strokeDashoffset: 0,
              duration: 0.45,
              delay: 0.2,
              ease: "power2.out",
            }
          );
        }
      } else if (filled !== prev.filled && tier === "upsell") {
        // A stepper tap while the upsell is showing: recoil the copy row.
        gsap.fromTo(
          q(".fp-body"),
          { y: 4, scale: 0.99 },
          { y: 0, scale: 1, duration: 0.4, ease: "back.out(3)" }
        );
      }

      // Snap in each bar that just filled (all of them on entrance).
      const from = entered ? 0 : prev.filled;
      if (filled > from) {
        gsap.fromTo(
          q(".fp-bar-filled").slice(from),
          { scale: 0, transformOrigin: "50% 50%" },
          {
            scale: 1,
            duration: 0.45,
            ease: "back.out(2.5)",
            stagger: 0.07,
            delay: entered ? 0.1 : 0,
          }
        );
      }
    },
    { dependencies: [tier, filled], scope: rootRef }
  );

  return (
    <div ref={rootRef} className="mt-4">
      {tier === "quiet" ? (
        // Baseline nudge, unchanged from before the four-pack existed. Larger
        // on mobile where it's the main nudge; desktop stays quiet.
        <p className="text-center font-inter text-base font-semibold text-zinc-900 sm:text-xs sm:text-zinc-700">
          Buy 2, get FREE shipping
        </p>
      ) : (
        <div className="fp-card border border-black/10 bg-zinc-50 px-4 py-3.5 sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
              Four-pack deal
            </p>
            {/* Progress to 4, in the same spec-annotation register as the
                mono eyebrows. Filled bars take the accent: live buy state. */}
            <div aria-hidden className="flex items-center gap-1">
              {Array.from({ length: FOUR_PACK.units }, (_, i) => (
                <span
                  key={i}
                  className={
                    i < filled
                      ? "fp-bar-filled h-1.5 w-4 bg-accent"
                      : "h-1.5 w-4 bg-black/10"
                  }
                />
              ))}
            </div>
          </div>

          {tier === "upsell" ? (
            <div className="fp-body mt-2.5 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-inter text-sm font-semibold text-black">
                  Make it 4 for {price}
                </p>
                <p className="mt-0.5 font-inter text-xs leading-[1.5] text-zinc-500">
                  Add {remaining} more, save {savings} at checkout.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onAdd(remaining)}
                className="shrink-0 border border-black/80 px-3.5 py-2 font-inter text-xs font-medium text-black transition-colors hover:bg-black hover:text-white"
              >
                Add {remaining} more
              </button>
            </div>
          ) : (
            <div className="fp-body mt-2.5 flex items-center gap-2.5">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className="shrink-0 text-accent"
              >
                <path
                  className="fp-check-path"
                  d="M4.5 12.5l5 5 10-11"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                  strokeDasharray={1}
                />
              </svg>
              <div className="min-w-0">
                <p className="font-inter text-sm font-semibold text-black">
                  4 for {price}{" "}
                  <s className="ml-1 font-normal tabular-nums text-zinc-400">
                    {full}
                  </s>
                </p>
                <p className="mt-0.5 font-inter text-xs leading-[1.5] text-zinc-500">
                  You save {savings}, applied automatically at checkout.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
