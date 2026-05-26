export type ProductColor = {
  id: string;
  name: string;
  image: string;
  variantId: string | null;
};

export const PRODUCT = {
  title: "Caddie Companion",
  priceCents: 2900,
  currency: "CAD",
  colors: [
    {
      id: "black",
      name: "Black",
      image: "/colors/black.png",
      variantId: "gid://shopify/ProductVariant/53821333045614",
    },
    {
      id: "red",
      name: "Red",
      image: "/colors/red.png",
      variantId: "gid://shopify/ProductVariant/53821333078382",
    },
    {
      id: "blue",
      name: "Blue",
      image: "/colors/blue.png",
      variantId: "gid://shopify/ProductVariant/53821333111150",
    },
    {
      id: "green",
      name: "Green",
      image: "/colors/green.png",
      variantId: "gid://shopify/ProductVariant/53821333143918",
    },
  ] as ProductColor[],
};
