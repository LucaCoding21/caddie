import Link from "next/link";
import { Stars } from "@/components/reviews";
import { AVERAGE_RATING, REVIEW_COUNT } from "@/lib/reviews";

// The hero copy. Two layouts from one markup tree (so the H1 exists once):
// desktop overlays the bottom-right of the full-bleed footage in white; mobile
// is a solid panel under the 45svh media frame — dark type, stars, and the buy
// CTA all in the first viewport, never fighting the video for contrast.
//
// Deliberately a server component with NO JavaScript: the H1 is the page's LCP
// element on mobile, and the previous GSAP SplitText reveal kept it masked
// until the client bundle downloaded, hydrated, and ran the animation —
// pushing LCP past 3s on throttled mobile. Now the headline is painted in the
// initial HTML, and the tagline/CTA entrances are pure CSS (they start at
// first paint, no hydration required) so the flourish survives without
// touching the LCP.
export default function HeroCopy() {
  return (
    <div className="relative z-10 flex flex-1 flex-col justify-center bg-[#fafaf7] px-6 sm:min-h-svh sm:flex-row sm:items-end sm:justify-end sm:bg-transparent sm:px-16 sm:pb-16">
      <div className="w-full text-center sm:w-auto sm:text-right">
        {/* No entrance animation on the H1 — it must paint with first HTML.
            Anything that hides or masks it (opacity 0, clip, translate behind a
            mask) delays LCP by the full animation + JS download time. */}
        <h1 className="font-brand font-bold uppercase text-zinc-900 sm:text-white text-4xl min-[420px]:text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight">
          6-in-1 Golf Multi-Tool
        </h1>
        <p className="hero-rise hero-rise-tagline mt-4 text-zinc-600 sm:text-white text-xl md:text-2xl font-normal tracking-wide sm:[text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
          Everything but the swing.
        </p>

        {/* Star summary — mobile only, so social proof lands in the first
            viewport. Desktop keeps the overlay minimal; its stars live at the
            buy moments. */}
        <div className="hero-rise hero-rise-tagline mt-4 flex items-center justify-center gap-2 sm:hidden">
          <Stars rating={AVERAGE_RATING} className="h-4 w-4" />
          <span className="font-inter text-sm text-zinc-500">
            {AVERAGE_RATING.toFixed(1)} · {REVIEW_COUNT} verified reviews
          </span>
        </div>

        {/* Mobile-only buy CTA. On desktop the persistent header pill carries
            the order action, so this is hidden at sm+. */}
        <div className="hero-rise hero-rise-cta mt-6 sm:hidden">
          <Link
            href="/select-color"
            className="flex w-full flex-col items-center gap-0.5 rounded-xl bg-accent px-5 py-3 text-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] transition-colors active:bg-accent-hover"
          >
            <span className="flex items-center gap-2 text-base font-medium">
              Order now
              <span className="text-white/40" aria-hidden>
                ·
              </span>
              <span className="tabular-nums">$49</span>
            </span>
            {/* Free-shipping nudge — desktop carries this inside the header
                pill, which is hidden on mobile, so tuck it into the CTA. */}
            <span className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-white/70">
              Buy 2, get free shipping
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
