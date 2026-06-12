"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// Numbered like the anatomy callouts — same mono voice, same accent blue.
const ITEMS = [
  { n: "01", label: "Home", href: "/" },
  { n: "02", label: "About", href: "/about" },
  { n: "03", label: "Contact", href: "/contact" },
  { n: "04", label: "FAQ", href: "/#faq" },
];

/**
 * Mobile-only fullscreen menu. The trigger is a hamburger that morphs into an
 * X; the panel wipes down over the page and the links rise in masked and
 * staggered, echoing the hero/anatomy line reveals.
 *
 * `light` mirrors the header logo's color logic: white over the dark hero and
 * [data-nav-dark] sections, dark over light ones.
 */
export function MobileMenu({ light }: { light: boolean }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const reduced = useRef(false);

  useGSAP(
    () => {
      reduced.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Panel starts fully clipped (and invisible, so it can't catch taps);
      // the timeline is built once, then played/reversed as the menu toggles.
      gsap.set(panelRef.current, { clipPath: "inset(0% 0% 100% 0%)" });
      tl.current = gsap
        .timeline({ paused: true })
        .set(panelRef.current, { visibility: "visible" })
        .to(panelRef.current, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.55,
          ease: "power4.inOut",
        })
        .from(
          ".menu-link",
          {
            yPercent: 110,
            duration: 0.7,
            ease: "power4.out",
            stagger: 0.07,
          },
          "-=0.2"
        )
        .from(
          ".menu-meta",
          {
            autoAlpha: 0,
            y: 14,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.08,
          },
          "<0.15"
        );
    },
    { scope: rootRef }
  );

  // Drive the timeline from state; close runs a touch faster than open.
  // Lock page scroll behind the open panel.
  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    t.timeScale(reduced.current ? 100 : open ? 1 : 1.4);
    if (open) t.play();
    else t.reverse();
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div ref={rootRef} className="sm:hidden">
      {/* Fullscreen panel. Sits before the button in the DOM so the X stays
          on top and tappable while the panel covers the rest of the header. */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="pointer-events-auto invisible fixed inset-0 flex flex-col bg-[#fafaf7]"
      >
        <nav className="flex flex-1 flex-col justify-center gap-3 px-8">
          {ITEMS.map((item) => (
            <div key={item.n} className="overflow-hidden py-1">
              <Link
                href={item.href}
                onClick={close}
                className="menu-link flex items-baseline gap-4 font-brand text-5xl font-bold uppercase tracking-tight text-zinc-900 transition-colors active:text-[#768dc5] min-[420px]:text-6xl"
              >
                <span className="font-mono text-sm font-medium text-[#768dc5]">
                  {item.n}
                </span>
                {item.label}
              </Link>
            </div>
          ))}

          {/* Buy action, promoted out of the footer row: a full-width accent
              block right under the links, in easy thumb reach. Rides the same
              masked rise as the links above it. */}
          <div className="overflow-hidden py-1 mt-6">
            <Link
              href="/select-color"
              onClick={close}
              className="menu-link flex w-full items-center justify-center gap-3 rounded-full bg-accent py-4 font-inter text-lg font-semibold text-white transition-colors active:bg-accent-hover"
            >
              Order now
              <span className="font-normal text-white/70">·</span>
              <span className="tabular-nums font-medium text-white/90">$29</span>
            </Link>
          </div>
        </nav>

        <div className="px-8 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
          <div className="menu-meta h-px w-full bg-zinc-900/10" />
          <div className="menu-meta mt-6">
            <div className="font-inter text-base font-medium text-zinc-900">
              Caddie Companion
            </div>
            <div className="mt-1 font-mono text-xs uppercase tracking-wide text-zinc-500">
              Everything but the swing.
            </div>
          </div>
        </div>
      </div>

      {/* Hamburger → X. Color follows the header logo's dark/light logic, but
          is always dark while the light panel is open. */}
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen(!open)}
        className={`pointer-events-auto relative flex h-10 w-10 items-center justify-center transition-colors duration-300 ${
          !open && light ? "text-white" : "text-zinc-900"
        }`}
      >
        <span className="relative block h-3.5 w-5">
          <span
            className={`absolute left-0 top-0 h-[2px] w-full bg-current transition-transform duration-300 ${
              open ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`absolute bottom-0 left-0 h-[2px] w-full bg-current transition-transform duration-300 ${
              open ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </span>
      </button>
    </div>
  );
}
