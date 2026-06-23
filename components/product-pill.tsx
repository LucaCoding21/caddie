import Link from "next/link";

/**
 * The floating product pill (name · price · Order now). Lifted out of
 * SiteHeader so the About and Contact pages can carry the same persistent
 * buy affordance the home page has.
 */
/**
 * `light` paints the Order button white instead of cobalt — used over the dark
 * hero on mobile, where it flips back to the accent once the page scrolls. It's
 * mobile-only: on desktop the button sits inside the white pill, so it must
 * stay blue for contrast regardless.
 */
export function ProductPill({ light = false }: { light?: boolean }) {
  return (
    <div className="pointer-events-auto flex items-center rounded-full sm:gap-5 sm:bg-white/95 sm:py-2 sm:pl-8 sm:pr-2.5 sm:shadow-[0_3px_16px_-4px_rgba(0,0,0,0.2)] sm:backdrop-blur">
      {/* Name + price (top line) with the free-shipping nudge tucked under it,
          inside the pill. Collapses away on narrow screens so the pill never
          collides with the wordmark + links on the left of the nav. On mobile
          the whole span is dropped (not just its contents) so it doesn't leave
          a phantom flex gap that pushes the Order button off-center. */}
      <span className="hidden flex-col leading-tight sm:flex">
        <span className="hidden text-base font-medium text-black md:inline">
          Caddie Companion
        </span>
        <span className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Buy 2, get free shipping
        </span>
      </span>

      <Link
        href="/select-color"
        className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors sm:ml-1 sm:bg-accent sm:px-5 sm:py-2.5 sm:text-white sm:hover:bg-accent-hover ${
          light
            ? "bg-white text-accent"
            : "bg-accent text-white hover:bg-accent-hover"
        }`}
      >
        Order<span className="hidden sm:inline">&nbsp;now</span>
        <span className="mx-2 hidden text-white/40 sm:inline" aria-hidden>
          ·
        </span>
        {/* Price tucked inside the button, to the right of the label. */}
        <span className="hidden tabular-nums font-semibold text-white sm:inline">
          $29
        </span>
      </Link>
    </div>
  );
}
