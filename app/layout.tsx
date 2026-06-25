import type { Metadata } from "next";
import { geistSans, geistMono, brandSans, inter } from "@/lib/fonts";
import "./globals.css";

const siteUrl = "https://www.caddiecompanion.com";

const description =
  "Six golf tools in one machined frame. Divot repair, groove brush, ball markers, and more. Built to last, small enough to forget in your pocket. $29.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Caddie Companion | Golf Divot Tool & 6-in-1 Multi-Tool",
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Caddie Companion | Golf Divot Tool & 6-in-1 Multi-Tool",
    description,
    siteName: "Caddie Companion",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Caddie Companion | Golf Divot Tool & 6-in-1 Multi-Tool",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${brandSans.variable} ${inter.variable}`}
    >
      <body className="font-sans bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
