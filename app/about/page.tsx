import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Caddie",
  description:
    "Why we machined the six tools every golfer carries into one pocket-sized frame.",
};

const VALUES: { heading: string; body: string }[] = [
  {
    heading: "Six, not sixty",
    body: "We cut the list to the tools you actually reach for on a round — divot tool, brush, marker, driver, knife, opener — and left the gimmicks at home.",
  },
  {
    heading: "Machined to last",
    body: "One billet of 6061 aluminium, a stainless pivot, and a brass brush. No plastic clips to snap, nothing to rattle loose in your bag.",
  },
  {
    heading: "Pocket-first",
    body: "At 62 grams and 92 millimetres folded, it disappears until the moment you need it — then opens one-handed between shots.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fafaf7] text-black">
      {/* Slim header — wordmark home, link back to the product. */}
      <header className="flex items-center justify-between px-6 py-5 md:px-12">
        <Link
          href="/"
          className="font-brand text-2xl font-bold uppercase tracking-tight text-black"
        >
          Caddie
        </Link>
        <Link
          href="/select-color"
          className="inline-flex items-center gap-1 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Order now
          <span aria-hidden>→</span>
        </Link>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-20 md:px-12 md:py-28">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
          About Caddie
        </p>
        <h1 className="mt-5 font-inter font-medium text-black text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.05] tracking-tight">
          One tool, for the whole round.
        </h1>
        <div className="mt-8 space-y-5 font-inter text-zinc-600 text-lg leading-[1.6]">
          <p>
            Caddie started with a pocket full of single-use gadgets and one
            simple idea: fold the six tools every golfer actually reaches for
            into one frame, machined to last a lifetime of rounds.
          </p>
          <p>
            We obsess over the parts you never think about — the pivot screw,
            the spring of the brush, the way it sits flat in your pocket — so
            that out on the course it just works, and then gets out of the way.
          </p>
        </div>

        <div className="mt-16 grid gap-10 border-t border-black/10 pt-12 sm:grid-cols-3">
          {VALUES.map(({ heading, body }) => (
            <div key={heading}>
              <h2 className="font-inter text-lg font-medium tracking-tight text-black">
                {heading}
              </h2>
              <p className="mt-3 font-inter text-sm leading-[1.6] text-zinc-500">
                {body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href="/select-color"
            className="inline-flex items-center gap-1.5 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Get your Caddie
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 font-inter text-sm font-medium text-black"
          >
            <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
            <span className="border-b border-black/20 pb-0.5 transition-colors group-hover:border-black">
              Back home
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
