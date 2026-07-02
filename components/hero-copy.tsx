import Link from "next/link";

// The hero copy overlay. Deliberately a server component with NO JavaScript:
// the H1 is the page's LCP element on mobile, and the previous GSAP SplitText
// reveal kept it masked until the client bundle downloaded, hydrated, and ran
// the animation — pushing LCP past 3s on throttled mobile. Now the headline is
// painted in the initial HTML, and the tagline/CTA entrances are pure CSS
// (they start at first paint, no hydration required) so the flourish survives
// without touching the LCP.
export default function HeroCopy() {
  return (
    <div className="relative z-10 flex min-h-svh items-end justify-end px-6 pb-12 md:px-16 md:pb-16">
      <div className="text-right">
        {/* No entrance animation on the H1 — it must paint with first HTML.
            Anything that hides or masks it (opacity 0, clip, translate behind a
            mask) delays LCP by the full animation + JS download time. */}
        <h1 className="font-brand font-bold uppercase text-white text-4xl min-[420px]:text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight">
          6-in-1 Golf Multi-Tool
        </h1>
        <p className="hero-rise hero-rise-tagline mt-4 text-white text-xl md:text-2xl font-normal tracking-wide [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
          Everything but the swing.
        </p>

        {/* Mobile-only buy CTA. On desktop the persistent header pill carries
            the order action, so this is hidden at sm+. */}
        <div className="hero-rise hero-rise-cta mt-6 sm:hidden">
          <Link
            href="/select-color"
            className="inline-flex flex-col items-start gap-0.5 rounded-3xl bg-white py-2.5 pl-5 pr-7 text-accent shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] transition-colors active:bg-white/90"
          >
            <span className="flex items-center gap-2 text-base font-medium">
              Order now
              <span className="text-accent/40" aria-hidden>
                ·
              </span>
              <span className="tabular-nums">$29</span>
            </span>
            {/* Free-shipping nudge — desktop carries this inside the header
                pill, which is hidden on mobile, so tuck it into the CTA. */}
            <span className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Buy 2, get free shipping
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
