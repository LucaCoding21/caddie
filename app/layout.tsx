import type { Metadata } from "next";
import Script from "next/script";
import { geistSans, geistMono, brandSans, inter } from "@/lib/fonts";
import DiscountPopup from "@/components/discount-popup";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-6XVN8BMLK0";

const META_PIXEL_ID = "1545900283576580";

// Microsoft Clarity (heatmaps + session recordings). Set in .env.local /
// Vercel env; when unset the script is skipped entirely, so local dev and
// preview builds don't record sessions unless opted in.
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

const siteUrl = "https://www.caddiecompanion.com";

const description =
  "Six golf tools in one machined frame. Divot repair, groove brush, ball markers, and more. Built to last, small enough to forget in your pocket. $49.";

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
        <DiscountPopup />
        {/* Meta Pixel runs afterInteractive, NOT lazyOnload like GA/Clarity:
            Meta only counts a "landing page view" if the PageView event fires
            before the visitor bounces, and ad-click traffic bounces fast. An
            idle-time load would undercount the very metric the pixel exists
            to report (and starve Meta's ad delivery optimization of signal). */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
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
        {/* Clarity rides the same idle lane as GA: it costs ~30 KB and records
            sessions, so it must never contend with the hero image for
            first-paint bandwidth. */}
        {CLARITY_PROJECT_ID && (
          <Script id="microsoft-clarity" strategy="lazyOnload">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
            `}
          </Script>
        )}
      </body>
    </html>
  );
}
