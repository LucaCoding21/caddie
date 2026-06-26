"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { FAQS, type Faq } from "@/lib/faqs";

gsap.registerPlugin(useGSAP);

// Closing FAQ. A controlled accordion (one open at a time) with the open/close
// height driven by GSAP so it animates smoothly and consistently across
// browsers. Content lives in lib/faqs.ts so the FAQPage structured data stays
// in sync with what's shown here.

function AccordionItem({
  q,
  a,
  link,
  isOpen,
  onToggle,
}: Faq & {
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
        <p className="max-w-2xl font-inter text-base leading-[1.6] text-zinc-500">
          {a}
        </p>
        {link && (
          <Link
            href={link.href}
            className="mt-3 inline-block font-inter text-base font-medium text-accent underline underline-offset-4 transition-colors hover:text-accent-hover"
          >
            {link.text}
          </Link>
        )}
        <div className="pb-6" />
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
          {FAQS.map(({ q, a, link }, i) => (
            <AccordionItem
              key={q}
              q={q}
              a={a}
              link={link}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </dl>
      </div>
    </section>
  );
}
