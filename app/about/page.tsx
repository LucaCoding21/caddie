import type { Metadata } from "next";
import Image from "next/image";
import { AboutTitle } from "@/components/about-title";
import { AboutIntro } from "@/components/about-intro";
import AboutDetails from "@/components/about-details";
import AboutCta from "@/components/about-cta";
import { FloatingPill } from "@/components/floating-pill";
import { AboutNav } from "@/components/about-nav";
import SiteFooter from "@/components/site-footer";

export const metadata: Metadata = {
  title: "About | Caddie",
  description:
    "Why we machined the six tools every golfer carries into one pocket-sized frame.",
};

export default function AboutPage() {
  return (
    <>
      {/* Nav bar, fixed at the top; both halves reappear whenever you scroll
          back up. Left: wordmark + links. Right: the product pill. */}
      <AboutNav />
      <FloatingPill />

      {/* Opaque content layer that scrolls over the fixed footer; the bottom
          margin reserves exactly the footer's height so it reveals on scroll. */}
      <main
        className="relative z-10 min-h-screen bg-[#fafaf7] text-black"
        style={{ marginBottom: "var(--footer-h)" }}
      >
      {/* Hero — oversized wordmark with the tool laid flat across it, editorial
          product-poster style. Letters are kept light so the near-black tool
          reads clearly in front of them; multiply drops the product shot's
          white background out against the page while keeping its baked-in
          shadow. */}
      <section className="relative overflow-hidden px-6 pt-32 pb-16 md:pt-44 md:pb-24">
        <div className="relative mx-auto flex max-w-6xl items-center justify-center">
          <AboutTitle />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Image
              src="/about-hero.jpeg"
              alt="The Caddie multi-tool, folded"
              width={1400}
              height={756}
              priority
              className="w-[60%] max-w-2xl translate-y-[28%] mix-blend-multiply"
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
