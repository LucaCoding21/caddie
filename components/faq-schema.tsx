import { FAQS } from "@/lib/faqs";

// FAQPage structured data (schema.org/FAQPage) for Google's FAQ rich result.
// Mirrors the visible accordion (components/faq.tsx) from the same source in
// lib/faqs.ts — Google requires the marked-up Q&A to match what's on the page.
export default function FaqSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
