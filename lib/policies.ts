// Legal/policy pages. The owner writes and approves these in Shopify; we pull
// the exact, current text through the Storefront API and render it inside our
// own on-brand pages (see app/policies/[slug]) instead of linking off to the
// raw myshopify.com store. Edits made in Shopify propagate on the next
// revalidate, with no redeploy.

export type PolicySlug =
  | "privacy-policy"
  | "refund-policy"
  | "terms-of-service"
  | "shipping-policy";

// Our URL slug → the field name on the Storefront API's `shop` object.
const POLICY_FIELDS: Record<PolicySlug, string> = {
  "privacy-policy": "privacyPolicy",
  "refund-policy": "refundPolicy",
  "terms-of-service": "termsOfService",
  "shipping-policy": "shippingPolicy",
};

export const POLICY_SLUGS = Object.keys(POLICY_FIELDS) as PolicySlug[];

export type Policy = { title: string; body: string };

export function isPolicySlug(value: string): value is PolicySlug {
  return value in POLICY_FIELDS;
}

export async function getPolicy(slug: PolicySlug): Promise<Policy | null> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_TOKEN;
  const apiVersion = process.env.SHOPIFY_API_VERSION ?? "2025-10";

  if (!domain || !token) return null;

  // `field` is from the fixed map above, never user input, so it's safe to
  // splice straight into the query. `body` comes back as sanitized HTML.
  const field = POLICY_FIELDS[slug];

  const res = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({
      query: `{ shop { ${field} { title body } } }`,
    }),
    // Legal text changes rarely; refresh once a day so the owner's Shopify
    // edits show up without a deploy.
    next: { revalidate: 86400 },
  });

  if (!res.ok) return null;

  const json = await res.json();
  const policy = json?.data?.shop?.[field];
  if (!policy?.body) return null;

  return { title: policy.title as string, body: policy.body as string };
}
