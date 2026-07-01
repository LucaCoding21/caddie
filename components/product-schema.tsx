import { PRODUCT } from "@/lib/products";
import { REVIEWS, REVIEW_COUNT, AVERAGE_RATING } from "@/lib/reviews";

const siteUrl = "https://www.caddiecompanion.com";

// Product structured data (schema.org/Product) for Google rich results:
// surfaces price + availability under the search listing, and — when reviews are
// shown on the page — star ratings too.
//
// review[] + aggregateRating are gated behind `includeReviews` because Google
// requires the marked-up reviews to be VISIBLE on the same page. Only the home
// page renders the on-page Reviews section (components/reviews.tsx), so only it
// passes includeReviews. The buy page shows no reviews, so its schema must not
// claim any. Both the schema and the visible section read from lib/reviews.ts,
// so the marked-up text always matches the page.
export default function ProductSchema({
  includeReviews = false,
}: {
  includeReviews?: boolean;
}) {
  const price = (PRODUCT.priceCents / 100).toFixed(2);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: PRODUCT.title,
    description:
      "A patent-pending 6-in-1 folding golf multi-tool: divot repair fork, " +
      "groove brush, two magnetic ball markers, T25 Torx driver, knife, and " +
      "bottle opener. Machined from stainless steel and anodized aluminum.",
    image: PRODUCT.colors.map((c) => `${siteUrl}${c.image}`),
    brand: {
      "@type": "Brand",
      name: "Caddie Companion",
    },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/select-color`,
      priceCurrency: PRODUCT.currency,
      price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  if (includeReviews) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: AVERAGE_RATING.toFixed(1),
      reviewCount: REVIEW_COUNT,
      bestRating: 5,
      worstRating: 1,
    };
    jsonLd.review = REVIEWS.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      name: r.title,
      reviewBody: r.body,
    }));
  }

  return (
    <script
      type="application/ld+json"
      // Scrub `<` to its unicode escape so free-text review bodies can't break
      // out of the script tag (per Next's JSON-LD guidance).
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
