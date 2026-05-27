import { Geist, Geist_Mono, Montserrat, Inter } from "next/font/google";

// Body / UI — neutral, quiet. Reads as "engineered," not salesy.
export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Technical / annotation — Geist Mono. The "engineered" voice: spec
// readouts, tool callouts. Pairs with Geist Sans.
export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Brand / display — Montserrat. 500 for headlines (per brand rule),
// 900 reserved for logo-equivalent marks only.
export const brandSans = Montserrat({
  weight: ["400", "500", "700", "900"],
  variable: "--font-brand-sans",
  subsets: ["latin"],
});

// Content below the hero — Inter. Quieter, narrower letterforms than the
// Montserrat brand display, used for section copy and headings.
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
