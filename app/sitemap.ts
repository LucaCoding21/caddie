import type { MetadataRoute } from "next";
import { POLICY_SLUGS } from "@/lib/policies";

const siteUrl = "https://www.caddiecompanion.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/select-color", "/about", "/contact"].map(
    (path) => ({
      url: `${siteUrl}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );

  const policyRoutes = POLICY_SLUGS.map((slug) => ({
    url: `${siteUrl}/policies/${slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  return [...staticRoutes, ...policyRoutes];
}
