import Link from "next/link";

// Scorecard-style nav — golf-themed column headers, each link numbered like a
// hole on the card.
const CARD: { tee: string; holes: { label: string; href: string }[] }[] = [
  {
    tee: "Front nine",
    holes: [
      { label: "Overview", href: "/" },
      { label: "The six tools", href: "/" },
      { label: "Colours", href: "/select-color" },
      { label: "Buy now", href: "/select-color" },
    ],
  },
  {
    tee: "Back nine",
    holes: [
      { label: "About", href: "/about" },
      { label: "On the course", href: "/" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    tee: "Clubhouse",
    holes: [
      { label: "Contact", href: "mailto:hello@caddie.golf" },
      { label: "Shipping & returns", href: "/#faq" },
      { label: "Warranty", href: "/#faq" },
    ],
  },
];

const MARQUEE = [
  "From tee to green",
  "Six tools, one frame",
  "It goes where you go",
  "Machined to last",
];

export default function SiteFooter() {
  return (
    <footer
      data-nav-dark
      className="relative z-20 w-full overflow-hidden bg-[#0b0b0d] text-white"
    >
      {/* Scrolling marquee strip. */}
      <div className="border-y border-white/10 py-4">
        <div className="footer-marquee flex w-max whitespace-nowrap will-change-transform">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
              {MARQUEE.map((phrase) => (
                <span key={phrase} className="flex items-center">
                  <span className="font-inter text-2xl font-medium tracking-tight text-white/80 md:text-3xl">
                    {phrase}
                  </span>
                  <span className="mx-6 text-2xl md:text-3xl">⛳</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        {/* The 19th hole — closing statement + ball flight, and a sign-up. */}
        <div className="grid gap-14 pt-20 md:pt-28 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-500">
              The 19th hole
            </p>
            <h2 className="mt-5 max-w-md font-inter font-medium text-white text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.02] tracking-tight">
              See you on the course.
            </h2>

            {/* Ball-flight arc to the pin. */}
            <svg
              viewBox="0 0 400 140"
              className="mt-10 w-full max-w-md text-white/30"
              fill="none"
              aria-hidden
            >
              <path
                d="M10 122 Q 200 -18 358 98"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="1 9"
                strokeLinecap="round"
              />
              <circle cx="10" cy="122" r="5.5" fill="currentColor" />
              <path
                d="M326 124 Q 358 112 390 124"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="358"
                y1="98"
                x2="358"
                y2="44"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path d="M358 44 L390 54 L358 66 Z" fill="#b23a3a" />
            </svg>
          </div>

          <div className="lg:pt-2">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-500">
              From the pro shop
            </p>
            <p className="mt-5 max-w-sm font-inter text-lg leading-[1.5] text-zinc-300">
              Restocks, new colourways, and the occasional birdie. No spam,
              we&apos;re walking the course too.
            </p>

            <div className="mt-7 flex max-w-sm items-center gap-3 border-b border-white/20 pb-3">
              <input
                type="email"
                placeholder="you@email.com"
                aria-label="Email address"
                className="w-full bg-transparent font-inter text-base text-white placeholder:text-zinc-600 focus:outline-none"
              />
              <button
                type="button"
                className="shrink-0 font-inter text-sm font-medium text-white transition-colors hover:text-zinc-300"
              >
                Join
              </button>
            </div>

            <Link
              href="/select-color"
              className="mt-8 inline-flex items-center bg-white px-7 py-3.5 font-inter text-sm font-medium text-black transition-colors hover:bg-zinc-200"
            >
              Shop the Companion
            </Link>
          </div>
        </div>

        {/* Scorecard nav. */}
        <nav className="mt-20 grid grid-cols-2 gap-10 border-t border-white/10 pt-12 sm:grid-cols-3 md:mt-28">
          {CARD.map(({ tee, holes }) => (
            <div key={tee}>
              <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
                {tee}
              </h3>
              <ul className="mt-5 space-y-3.5">
                {holes.map(({ label, href }, idx) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="group flex items-baseline gap-3 font-inter text-base text-zinc-300 transition-colors hover:text-white"
                    >
                      <span className="font-mono text-[11px] tabular-nums text-zinc-600 transition-colors group-hover:text-zinc-400">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom bar. */}
        <div className="mt-20 flex flex-col gap-3 border-t border-white/10 py-8 sm:flex-row sm:items-center sm:justify-between md:mt-28">
          <p className="font-inter text-xs text-zinc-500">
            © 2026 Caddie. Designed for the walk from tee to green.
          </p>
          <div className="flex items-center gap-6">
            {["Instagram", "TikTok", "YouTube"].map((s) => (
              <a
                key={s}
                href="#"
                className="font-inter text-xs text-zinc-500 transition-colors hover:text-white"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Oversized wordmark, outlined and clipped at the baseline. */}
      <div className="select-none px-6 md:px-12" aria-hidden>
        <span
          className="block translate-y-[0.12em] font-brand text-[22vw] font-bold uppercase leading-[0.78] tracking-tight text-transparent"
          style={{ WebkitTextStroke: "1px rgba(255,255,255,0.22)" }}
        >
          Caddie
        </span>
      </div>
    </footer>
  );
}
