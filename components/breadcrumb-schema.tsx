const siteUrl = "https://www.caddiecompanion.com";

export type Crumb = { name: string; path: string };

// BreadcrumbList structured data (schema.org/BreadcrumbList). Describes a page's
// place in the site hierarchy so Google can show a breadcrumb trail in the
// listing instead of the bare URL. Pass the trail from the site root, e.g.
// [{ name: "Home", path: "/" }, { name: "Buy", path: "/select-color" }].
export default function BreadcrumbSchema({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${siteUrl}${crumb.path}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
