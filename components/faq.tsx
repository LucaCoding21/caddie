"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// Closing FAQ. A controlled accordion (one open at a time) with the open/close
// height driven by GSAP so it animates smoothly and consistently across
// browsers.
const FAQS: { q: string; a: string }[] = [
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
    q: "Is there a warranty?",
    a: "Yes. Every Caddie Companion comes with a one-year warranty.",
  },
];

function AccordionItem({
  q,
  a,
  isOpen,
  onToggle,
}: {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Animate the panel height to/from `auto` whenever this item opens or closes.
  // useGSAP re-runs on the isOpen change; reduced-motion users just snap.
  useGSAP(
    () => {
      const el = panelRef.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(el, { height: isOpen ? "auto" : 0 });
        return;
      }
      gsap.to(el, {
        height: isOpen ? "auto" : 0,
        duration: 0.4,
        ease: "power2.inOut",
      });
    },
    { dependencies: [isOpen] }
  );

  return (
    <div className="group border-b border-black/10">
      <dt>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left"
        >
          <span className="font-inter text-lg font-medium text-black md:text-xl">
            {q}
          </span>
          <span
            aria-hidden
            className={`shrink-0 text-2xl font-light leading-none text-zinc-400 transition-transform duration-300 ${
              isOpen ? "rotate-45" : ""
            }`}
          >
            +
          </span>
        </button>
      </dt>
      <dd ref={panelRef} className="h-0 overflow-hidden">
        <p className="max-w-2xl pb-6 font-inter text-base leading-[1.6] text-zinc-500">
          {a}
        </p>
      </dd>
    </div>
  );
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="relative z-20 -mt-px w-full scroll-mt-24 bg-[#fafaf7] px-6 md:px-12 py-24 md:py-32"
    >
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
        <div>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
            Good to know
          </p>
          <h2 className="mt-5 max-w-xs font-inter font-medium text-black text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.05] tracking-tight">
            Questions, answered.
          </h2>
        </div>

        <dl className="border-t border-black/10">
          {FAQS.map(({ q, a }, i) => (
            <AccordionItem
              key={q}
              q={q}
              a={a}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </dl>
      </div>
    </section>
  );
}
