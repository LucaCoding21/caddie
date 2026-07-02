import type { Metadata } from "next";
import Script from "next/script";
import { geistSans, geistMono, brandSans, inter } from "@/lib/fonts";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-6XVN8BMLK0";

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
  // Let Google use large image previews in Search & Discover. Without this,
  // Google may fall back to a small thumbnail (or none). It does NOT choose
  // WHICH image — Google still picks a prominent on-page image itself.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Caddie Companion | Golf Divot Tool & 6-in-1 Multi-Tool",
    description,
    siteName: "Caddie Companion",
    type: "website",
    url: "/",
    images: [
      {
        // Static asset in /public — served at a clean, hash-free URL.
        // (The app/opengraph-image.png file convention appends a ?<hash>
        // cache-buster to the URL, which we don't want here.)
        // JPEG at 1200x630: WhatsApp and some crawlers skip previews for
        // images much over ~600 KB, and the old PNG was 1.9 MB.
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Caddie Companion 6-in-1 golf multi-tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caddie Companion | Golf Divot Tool & 6-in-1 Multi-Tool",
    description,
    images: ["/opengraph-image.jpg"],
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
        {/* lazyOnload (not afterInteractive): GA's ~160 KB script was loading at
            high priority during the hero's first paint, starving the LCP image
            of bandwidth on mobile. lazyOnload defers it to browser idle after
            load — pageviews are still tracked, just a beat later. */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
