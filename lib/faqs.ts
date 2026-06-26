// Shared FAQ content, consumed by both the on-page accordion (components/faq.tsx)
// and the FAQPage structured data (components/faq-schema.tsx) so the visible
// answers and the JSON-LD Google reads never drift apart. The `a` text is the
// canonical answer used in the schema; `link` adds an optional on-page CTA
// (e.g. a contact link) that the schema doesn't need.
export type Faq = {
  q: string;
  a: string;
  link?: { href: string; text: string };
};

export const FAQS: Faq[] = [
  {
    q: "What are the six tools?",
    a: "Two magnetic ball markers, a T25 Torx driver for tuning adjustable clubs, a divot repair fork, a full-tang stainless knife, a bottle opener, and a brass wire brush for cleaning grooves. Every one folds out of a single milled frame.",
  },
  {
    q: "Is it allowed on the course?",
    a: "Yes. The Caddie Companion is built for exactly that. It clips to your bag by its carabiner and rides along every hole, ready the moment you are.",
  },
  {
    q: "What's it made of?",
    a: "A stainless steel inner shell and stainless steel tools, paired with a hand-finished anodized aluminum exterior. No castings, no stamped parts, just a build made to hold up season after season.",
  },
  {
    q: "How big is it, and how much does it weigh?",
    a: "It measures 1\" × 1\" × 5\" and weighs 12 oz, folding down to sit flat and unnoticed in your pocket.",
  },
  {
    q: "What about shipping and returns?",
    a: "Shipping is calculated based on where you live, and it's free when you order two or more. If you need to return it for any reason, we'll work with you to make it right.",
  },
  {
    q: "Do you ship internationally?",
    a: "Not yet. For now we only ship within the United States. If you're outside the US and want a Caddie Companion, reach out and we'll do our best to work something out.",
    link: { href: "/contact", text: "Contact us" },
  },
  {
    q: "Is there a warranty?",
    a: "Yes. Every Caddie Companion comes with a one-year warranty.",
  },
];
