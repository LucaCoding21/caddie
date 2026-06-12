import type { Metadata } from "next";
import Image from "next/image";
import { AboutTitle } from "@/components/about-title";
import { AboutIntro } from "@/components/about-intro";
import AboutDetails from "@/components/about-details";
import AboutCta from "@/components/about-cta";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata: Metadata = {
  title: "About | Caddie Companion",
  description:
    "Why we machined the six tools every golfer carries into one pocket-sized frame.",
};

export default function AboutPage() {
  return (
    <>
      {/* Same persistent nav as every other page: logo + links + order pill,
          with the fullscreen menu on mobile. Solid (dark logo) since this page
          has no dark hero. */}
      <SiteHeader solid />

      {/* Opaque content layer that scrolls over the fixed footer; the bottom
          margin reserves exactly the footer's height so it reveals on scroll. */}
      <main
        className="relative z-10 min-h-screen bg-[#fafaf7] text-black"
        style={{ marginBottom: "var(--footer-h)" }}
      >
      {/* Hero — oversized wordmark with the tool laid flat across it, editorial
          product-poster style. Letters are kept light so the near-black tool
          reads clearly in front of them; the tool is matted onto pure white
          (no shadow), so mix-blend-multiply drops the background out against
          the page. */}
      <section className="relative overflow-hidden px-6 pt-60 pb-16 md:pt-60 md:pb-24">
        <div className="relative mx-auto flex max-w-6xl items-center justify-center">
          <AboutTitle />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Image
              src="/about-hero-v4.png"
              alt="The Caddie Companion multi-tool, folded"
              width={1376}
              height={768}
              preload
              className="w-[115%] max-w-none translate-y-[28%] mix-blend-multiply"
            />
          </div>
        </div>

        <AboutIntro />
      </section>

      {/* Editorial details gallery — a captioned feature shot with the section
          copy, a tall hero frame, and a stacked pair of detail crops. */}
      <AboutDetails />

      {/* CTA banner — light grey panel, copy on the left, the fanned colour
          lineup enlarged and spilling past the top-right of the container. */}
      <AboutCta />
      </main>

      {/* Footer — pinned behind the content, revealed on scroll. */}
      <SiteFooter />
    </>
  );
}
