import Link from "next/link";

/**
 * The floating product pill (name · price · Order now). Lifted out of
 * SiteHeader so the About and Contact pages can carry the same persistent
 * buy affordance the home page has.
 */
export function ProductPill() {
  return (
    <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-white/95 py-1.5 pl-3 pr-1.5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.25)] backdrop-blur sm:gap-4 sm:py-2 sm:pl-5 sm:pr-2">
      {/* Name + price collapse away on narrow screens so the pill never
          collides with the wordmark + links on the left of the nav. */}
      <span className="flex items-center gap-1.5">
        <span className="hidden text-base font-medium text-black md:inline">
          Caddie Companion
        </span>
        <span className="hidden text-zinc-300 md:inline" aria-hidden>
          ·
        </span>
        <span className="hidden text-sm tabular-nums text-zinc-600 sm:inline sm:text-base">
          $29
        </span>
      </span>
      <Link
        href="/select-color"
        className="inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover sm:ml-1 sm:px-5 sm:py-2.5"
      >
        Order<span className="hidden sm:inline">&nbsp;now</span>
      </Link>
    </div>
  );
}
