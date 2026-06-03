"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ContactForm } from "@/components/contact-form";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// Direct lines, kept short and factual, the same engineered, quiet voice as
// the rest of the site. SAMPLE COPY, confirm before ship.
const DETAILS: { label: string; value: string; href?: string }[] = [
  { label: "Email", value: "hello@caddie.golf", href: "mailto:hello@caddie.golf" },
  { label: "Orders", value: "Track or change at the link in your receipt." },
  { label: "Hours", value: "Mon-Fri · 9-5 PT" },
  { label: "Workshop", value: "Vancouver, BC" },
];

/**
 * The body of the Contact page — the oversized wordmark, the intro + direct
 * lines on the left, and the form on the right. Server metadata stays in the
 * page; this client wrapper owns the GSAP load reveal so the route can keep
 * exporting metadata. The same house idioms as the About page: the heading
 * rises per-character out of a mask, the intro lines mask-rise, the detail
 * lines stagger up, and the form panel fades up last.
 */
export function ContactContent() {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const detailsRef = useRef<HTMLDListElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Oversized wordmark — each letter rises into view from below out of a
      // per-char mask, matching the About hero.
      const titleSplit = SplitText.create(titleRef.current, {
        type: "chars",
        mask: "chars",
        onSplit: (self) =>
          gsap.from(self.chars, {
            yPercent: 120,
            opacity: 0,
            duration: 1,
            ease: "power4.out",
            stagger: 0.08,
          }),
      });

      // Intro copy — lines rise out of a mask, lightly staggered.
      const introSplit = SplitText.create(introRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1,
            ease: "power4.out",
            stagger: 0.08,
            delay: 0.2,
            // Release the mask so line-height stops cropping descenders.
            onComplete: () =>
              gsap.set(
                self.lines.map((l) => l.parentNode),
                { overflow: "visible" }
              ),
          }),
      });

      // Direct lines — stagger up under the intro.
      gsap.from(detailsRef.current!.children, {
        opacity: 0,
        y: 16,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1,
        delay: 0.4,
      });

      // The form panel settles up last.
      gsap.from(formRef.current, {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.5,
      });

      return () => {
        titleSplit.revert();
        introSplit.revert();
      };
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef}>
      <h1
        ref={titleRef}
        className="mt-20 select-none text-left font-inter text-6xl font-semibold uppercase leading-[0.85] tracking-[-0.04em] text-zinc-200 sm:text-7xl lg:mt-28 lg:text-8xl"
      >
        Contact
      </h1>

      <div className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-[1fr_1.5fr] lg:gap-24">
        {/* Left rail, intro + details. */}
        <div className="lg:pt-2">
          <p
            ref={introRef}
            className="max-w-sm font-inter text-base leading-[1.6] text-zinc-600 md:text-lg"
          >
            A question about your order, a wholesale enquiry, or just a thought
            on the tool? Send it over and a real person reads every message and
            replies within one business day.
          </p>

          <dl ref={detailsRef} className="mt-8 space-y-4">
            {DETAILS.map(({ label, value, href }) => (
              <div key={label}>
                <dt className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
                  {label}
                </dt>
                <dd className="mt-1.5 font-inter text-sm leading-[1.6] text-zinc-600">
                  {href ? (
                    <a
                      href={href}
                      className="border-b border-black/20 pb-0.5 text-black transition-colors hover:border-black"
                    >
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right column, the form. */}
        <div ref={formRef}>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
