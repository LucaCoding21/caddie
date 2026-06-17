import type { Metadata } from "next";
import { geistSans, geistMono, brandSans, inter } from "@/lib/fonts";
import "./globals.css";

const siteUrl = "https://caddie-pink.vercel.app";

const description =
  "The six-in-one golf multi-tool that earns its place in the bag.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Caddie Companion",
  description,
  openGraph: {
    title: "Caddie Companion",
    description,
    siteName: "Caddie Companion",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Caddie Companion",
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
