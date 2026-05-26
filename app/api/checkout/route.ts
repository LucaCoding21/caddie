import { NextResponse } from "next/server";

const CART_CREATE = /* GraphQL */ `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

type Line = { variantId: string; quantity: number };

export async function POST(req: Request) {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_TOKEN;
  const defaultVariantId = process.env.SHOPIFY_VARIANT_ID;
  const apiVersion = process.env.SHOPIFY_API_VERSION ?? "2025-10";

  if (!domain || !token) {
    return NextResponse.json(
      { error: "Missing Shopify env vars" },
      { status: 500 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as {
    lines?: Array<{ variantId?: unknown; quantity?: unknown }>;
  };

  let lines: Line[];
  if (Array.isArray(body.lines) && body.lines.length > 0) {
    lines = body.lines
      .map((l) => ({
        variantId: String(l.variantId ?? ""),
        quantity: Math.max(1, Number(l.quantity ?? 1)),
      }))
      .filter((l) => l.variantId);
    if (lines.length === 0) {
      return NextResponse.json(
        { error: "No valid lines provided" },
        { status: 400 }
      );
    }
  } else if (defaultVariantId) {
    lines = [{ variantId: defaultVariantId, quantity: 1 }];
  } else {
    return NextResponse.json({ error: "No lines provided" }, { status: 400 });
  }

  const res = await fetch(
    `https://${domain}/api/${apiVersion}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({
        query: CART_CREATE,
        variables: {
          input: {
            lines: lines.map((l) => ({
              merchandiseId: l.variantId,
              quantity: l.quantity,
            })),
          },
        },
      }),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: `Shopify ${res.status}: ${text}` },
      { status: 502 }
    );
  }

  const json = await res.json();

  if (json.errors?.length) {
    return NextResponse.json({ error: json.errors }, { status: 400 });
  }

  const userErrors = json.data?.cartCreate?.userErrors;
  if (userErrors?.length) {
    return NextResponse.json({ error: userErrors }, { status: 400 });
  }

  const checkoutUrl = json.data?.cartCreate?.cart?.checkoutUrl;
  if (!checkoutUrl) {
    return NextResponse.json(
      { error: "No checkoutUrl in response" },
      { status: 500 }
    );
  }

  return NextResponse.json({ checkoutUrl });
}
