import type { Metadata } from "next";
import { ContactContent } from "@/components/contact-content";
import { AboutNav } from "@/components/about-nav";
import { FloatingPill } from "@/components/floating-pill";

export const metadata: Metadata = {
  title: "Contact | Caddie Companion",
  description:
    "Questions about an order, wholesale, or press? Reach the people who machined your Caddie Companion.",
};

export default function ContactPage() {
  return (
    <main className="flex min-h-svh flex-col bg-[#fafaf7] text-black">
      {/* Nav bar, fixed at the top; both halves reappear whenever you scroll
          back up. Left: wordmark + links. Right: the product pill. Same as the
          home and About pages. */}
      <AboutNav />
      <FloatingPill />

      {/* Body. The oversized wordmark sits above a two-column split: intro +
          direct lines on the left, form on the right. The whole block reveals
          on load via GSAP (see ContactContent). Top padding clears the fixed
          nav. */}
      <section className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-6 pt-28 pb-20 md:px-12">
        <ContactContent />
      </section>
    </main>
  );
}
