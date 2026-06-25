import type { Metadata } from "next";
import ProductSchema from "@/components/product-schema";

export const metadata: Metadata = {
  title: "Buy the Caddie Companion Golf Multi-Tool in 4 Colors | $29",
  description:
    "Order the Caddie Companion 6-in-1 golf tool. Divot repair, groove brush, ball markers, knife, and more. 4 colors, $29, free shipping on two.",
  alternates: {
    canonical: "/select-color",
  },
};

export default function SelectColorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ProductSchema />
      {children}
    </>
  );
}
