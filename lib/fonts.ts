import { Geist, Geist_Mono, Montserrat, Inter } from "next/font/google";

// Body / UI — neutral, quiet. Reads as "engineered," not salesy.
export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Technical / annotation — Geist Mono. The "engineered" voice: spec
// readouts, tool callouts. Pairs with Geist Sans.
// preload: false — only appears below the fold (spec strips, callouts), so it
// shouldn't compete with the hero image for bandwidth on first paint. It still
// loads via font-display: swap the moment those sections render.
export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

// Brand / display — Montserrat. 500 for headlines (per brand rule).
// 400 stays because `font-brand font-light` (about-details) has no 300 cut and
// resolves to 400. 900 was never used in markup (the logo mark is an image),
// so it's not loaded.
export const brandSans = Montserrat({
  weight: ["400", "500", "700"],
  variable: "--font-brand-sans",
  subsets: ["latin"],
});

// Content below the hero — Inter. Quieter, narrower letterforms than the
// Montserrat brand display, used for section copy and headings.
// preload: false — as the name says, it's below the hero, so keep it out of the
// first-paint bandwidth race. Loads via font-display: swap on demand.
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  preload: false,
});
