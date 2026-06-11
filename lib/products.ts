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
};

export const PRODUCT = {
  title: "Caddie Companion",
  priceCents: 2900,
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
      priceCents: 900,
      variantId: null,
    },
  ] as ProductAddon[],
  colors: [
    {
      id: "black",
      name: "Black",
      image: "/colors/black-fit.png",
      variantId: "gid://shopify/ProductVariant/53821333045614",
    },
    {
      id: "blue",
      name: "Blue",
      image: "/colors/blue-fit.png",
      variantId: "gid://shopify/ProductVariant/53821333111150",
    },
    {
      id: "green",
      name: "Green",
      image: "/colors/green-fit.png",
      variantId: "gid://shopify/ProductVariant/53821333143918",
    },
    {
      id: "red",
      name: "Red",
      image: "/colors/red-fit.png",
      variantId: "gid://shopify/ProductVariant/53821333078382",
    },
  ] as ProductColor[],
};
