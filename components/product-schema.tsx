import { PRODUCT } from "@/lib/products";

const siteUrl = "https://www.caddiecompanion.com";

// Product structured data (schema.org/Product) for Google rich results:
// surfaces price + availability under the search listing. Intentionally NO
// aggregateRating/review fields — those require real, on-page customer reviews
// per Google's structured-data policy, and faking them risks a manual penalty.
export default function ProductSchema() {
  const price = (PRODUCT.priceCents / 100).toFixed(2);

  const jsonLd = {
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
