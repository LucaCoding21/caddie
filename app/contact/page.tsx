import type { Metadata } from "next";
import Link from "next/link";
import { ContactContent } from "@/components/contact-content";
import { ProductPill } from "@/components/product-pill";

export const metadata: Metadata = {
  title: "Contact | Caddie",
  description:
    "Questions about an order, wholesale, or press? Reach the people who machined your Caddie.",
};

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#fafaf7] text-black">
      {/* Slim header, matches the About page. */}
      <header className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-6 text-black">
          <Link
            href="/"
            className="font-brand text-2xl font-bold uppercase tracking-tight"
          >
            Caddie
          </Link>
          <nav className="ml-4 flex items-center gap-6 text-sm font-semibold uppercase tracking-wide">
            <Link href="/about" className="hover:underline underline-offset-4">
              About
            </Link>
            <Link href="/contact" className="hover:underline underline-offset-4">
              Contact
            </Link>
          </nav>
        </div>
        <ProductPill />
      </header>

      {/* Body. The oversized wordmark sits above a two-column split: intro +
          direct lines on the left, form on the right. The whole block reveals
          on load via GSAP (see ContactContent). */}
      <section className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-6 pt-6 pb-20 md:px-12">
        <ContactContent />
      </section>
    </main>
  );
}
