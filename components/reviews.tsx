import type { Review } from "@/lib/reviews";
import { REVIEWS, REVIEW_COUNT, AVERAGE_RATING } from "@/lib/reviews";

// Row of five stars, filled up to `rating`. Decorative — the numeric rating and
// review text carry the meaning for screen readers, so this is aria-hidden.
function Stars({
  rating,
  className = "h-4 w-4",
}: {
  rating: number;
  className?: string;
}) {
  const filled = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-400" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={className}
          fill={i < filled ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.25"
        >
          <path d="M10 1.6l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.2l-4.95 2.6.94-5.5-4-3.9 5.53-.8z" />
        </svg>
      ))}
    </span>
  );
}

// A single fixed-size review card. Body is clamped so every card is the same
// height in the marquee; the long review truncates to a teaser.
function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex h-64 w-80 shrink-0 flex-col rounded-xl border border-black/10 bg-white p-6">
      <Stars rating={review.rating} />
      <p className="mt-3 font-inter text-sm font-semibold text-black">
        {review.title}
      </p>
      <p className="mt-1 font-inter text-xs text-zinc-500">
        {review.author}
        {review.verified ? " · Verified Purchase" : ""}
      </p>
      <p className="mt-3 flex-1 overflow-hidden whitespace-pre-line font-inter text-sm leading-[1.55] text-zinc-600 [-webkit-box-orient:vertical] [-webkit-line-clamp:5] [display:-webkit-box]">
        {review.body}
      </p>
    </article>
  );
}

// On-page customer reviews as an auto-scrolling marquee (right→left). Renders
// the visible counterpart to the Product review + aggregateRating JSON-LD
// (components/product-schema.tsx) — both read from lib/reviews.ts so the markup
// always matches what's shown. The track holds two copies of the list so the
// slide loops seamlessly (see .reviews-marquee in globals.css).
export default function Reviews() {
  return (
    <section
      aria-labelledby="reviews-heading"
      className="mt-12 w-full min-w-0 max-w-full xl:mt-16"
    >
      <p
        id="reviews-heading"
        className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400"
      >
        What golfers are saying
      </p>

      {/* Aggregate summary — the visible number the AggregateRating schema needs. */}
      <div className="mt-4 flex items-center gap-3">
        <span className="font-inter text-2xl font-medium tabular-nums text-black">
          {AVERAGE_RATING.toFixed(1)}
        </span>
        <Stars rating={AVERAGE_RATING} className="h-5 w-5" />
        <span className="font-inter text-sm text-zinc-500">
          {REVIEW_COUNT} reviews
        </span>
      </div>

      {/* Marquee: overflow-clipped viewport with faded edges; the track slides. */}
      <div className="reviews-marquee mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <ul className="reviews-marquee-track flex w-max gap-5">
          {[...REVIEWS, ...REVIEWS].map((review, i) => (
            <li key={i} aria-hidden={i >= REVIEW_COUNT ? true : undefined}>
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
