import Link from "next/link";

/**
 * The floating product pill (name · price · Order now). Lifted out of
 * SiteHeader so the About and Contact pages can carry the same persistent
 * buy affordance the home page has.
 */
export function ProductPill() {
  return (
    <div className="pointer-events-auto flex items-center gap-4 rounded-full bg-white/95 py-2 pl-5 pr-2 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.25)] backdrop-blur">
      <span className="flex items-center gap-1.5">
        <span className="text-base font-medium text-black">Caddie Companion</span>
        <span className="text-zinc-300" aria-hidden>
          ·
        </span>
        <span className="text-base tabular-nums text-zinc-600">$29</span>
      </span>
      <Link
        href="/select-color"
        className="ml-1 inline-flex items-center rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
      >
        Order now
      </Link>
    </div>
  );
}
