export type ProductColor = {
  id: string;
  name: string;
  image: string;
  variantId: string | null;
};

export type ProductAddon = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  variantId: string | null;
  image: string;
};

export const PRODUCT = {
  title: "Caddie Companion",
  priceCents: 4900,
  currency: "USD",
  materials: [
    "Stainless steel inner shell",
    "Stainless steel tools",
    "Anodized aluminum exterior",
  ],
  specs: [
    { label: "Dimensions", value: '1" × 1" × 5"' },
    { label: "Weight", value: "12 oz" },
  ],
  addons: [
    {
      id: "wire-brush-head",
      name: "Replaceable wire brush head",
      description: "A spare brush head that twists on when the original wears down.",
      priceCents: 400,
      variantId: "gid://shopify/ProductVariant/51347757400370",
      image: "/golf-club-groove-cleaner-brush-head.png",
    },
  ] as ProductAddon[],
  colors: [
    {
      id: "black",
      name: "Black",
      image: "/colors/caddie-companion-black.png",
      variantId: "gid://shopify/ProductVariant/51347746914610",
    },
    {
      id: "blue",
      name: "Blue",
      image: "/colors/caddie-companion-blue.png",
      variantId: "gid://shopify/ProductVariant/51347746947378",
    },
    {
      id: "green",
      name: "Green",
      image: "/colors/caddie-companion-green.png",
      variantId: "gid://shopify/ProductVariant/51347746980146",
    },
    {
      id: "red",
      name: "Red",
      image: "/colors/caddie-companion-red.png",
      variantId: "gid://shopify/ProductVariant/51347747012914",
    },
  ] as ProductColor[],
};
