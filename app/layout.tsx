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
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
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
