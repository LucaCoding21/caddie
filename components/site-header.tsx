"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProductPill } from "@/components/product-pill";
import { MobileMenu } from "@/components/mobile-menu";

/**
 * `solid` is for pages without the dark full-viewport hero (About, Contact,
 * the buy page). There the logo must stay dark from the top and there are no
 * [data-nav-dark] sections to track — so we pin pastHero on and skip the
 * scroll-driven colour flip, keeping only the hide-on-scroll-down behaviour.
 */
export default function SiteHeader({ solid = false }: { solid?: boolean }) {
  // Hero is full-viewport and dark; the logo is white to read against it.
  // Once scrolled past the hero, the header sits over light sections, so
  // flip the logo to a dark color to keep it legible. On solid pages it starts
  // (and stays) past-hero, so the logo is dark immediately.
  const [pastHero, setPastHero] = useState(solid);
  // Some later sections are dark too (e.g. the exploded view). Track whether a
  // section marked [data-nav-dark] currently sits under the logo, so it can
  // stay white there instead of flipping to the dark, light-section color.
  const [overDark, setOverDark] = useState(false);
  // Hide the logo while scrolling down, reveal it on scroll up (and always
  // near the top). lastY tracks the previous position to infer direction.
  const [showLogo, setShowLogo] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    // Coalesce scroll work into one rAF per frame. Scroll events can fire many
    // times per frame, and each run reads layout (getBoundingClientRect), which
    // forces a synchronous reflow — doing that per-event makes scrolling janky.
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;

      // Solid pages have no dark hero / dark sections — the logo is dark from
      // the top, so skip the colour-flip probing entirely.
      if (!solid) {
        setPastHero(y > window.innerHeight - 80);

        // Probe a point near the logo's vertical center; if a dark-marked
        // section spans it, the logo is over dark.
        const probe = 36;
        let dark = false;
        document.querySelectorAll<HTMLElement>("[data-nav-dark]").forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.top <= probe && r.bottom >= probe) dark = true;
        });
        setOverDark(dark);
      }

      // Near the top: always show. Otherwise compare against the last position
      // (with a small dead zone) so tiny jitters don't flicker the logo.
      if (y < 80) {
        setShowLogo(true);
      } else if (y > lastY.current + 4) {
        setShowLogo(false);
      } else if (y < lastY.current - 4) {
        setShowLogo(true);
      }
      lastY.current = y;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [solid]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-3 px-4 py-5 pointer-events-none transition-transform duration-300 sm:gap-4 sm:px-8 sm:py-6 ${
        // Whole nav slides away on scroll-down and returns on scroll-up. The
        // transform is applied ONLY in the hidden state: a transform on the
        // header would make the menu's fixed panel resolve against the header
        // box instead of the viewport — but the nav is never hidden while the
        // menu is open (scroll is locked and the hamburger is offscreen).
        showLogo ? "" : "-translate-y-full"
      }`}
    >
      {/* Mobile white bar, on its own layer rather than the header itself: a
          backdrop-filter on the header would clip the fixed menu panel to the
          nav bar. Fades in once past the hero, over light sections. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 -z-10 bg-white/95 shadow-[0_1px_12px_-4px_rgba(0,0,0,0.2)] backdrop-blur transition-opacity duration-300 sm:hidden ${
          pastHero && !overDark ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Left zone: logo (+ desktop nav links). */}
      <div
        className={`pointer-events-auto flex items-center gap-3 transition-colors duration-300 sm:gap-6 ${
          pastHero && !overDark ? "text-zinc-900" : "text-white"
        }`}
      >
        <Link href="/" aria-label="Caddie Companion home" className="block">
          {/* Logo art is cobalt; over the dark hero / dark sections it's
              flipped to white so the dark-blue mark doesn't disappear. */}
          <Image
            src="/caddie-logo.png"
            alt="Caddie Companion"
            width={305}
            height={103}
            preload
            // Serve the original PNG untouched. The default optimizer re-encodes
            // to WebP at quality 75, which softens the tiny "COMPANION" subtext.
            unoptimized
            className={`h-8 w-auto transition-[filter] duration-300 ${
              pastHero && !overDark ? "" : "brightness-0 invert"
            }`}
          />
        </Link>

        {/* Inline links are desktop-only; on mobile the fullscreen menu
            (hamburger on the right) carries them instead. */}
        <nav className="hidden items-center gap-3 text-xs font-semibold uppercase tracking-wide sm:ml-4 sm:flex sm:gap-6 sm:text-sm">
          <Link href="/about" className="hover:underline underline-offset-4">
            About
          </Link>
          <Link href="/contact" className="hover:underline underline-offset-4">
            Contact
          </Link>
        </nav>
      </div>

      {/* Right zone: Order pill + (mobile) hamburger. */}
      <div className="flex items-center gap-1.5">
        {/* The order pill is desktop-only now; on mobile the buy CTA lives in
            the hero (and the menu carries it on inner pages). */}
        <div className="hidden sm:block">
          <ProductPill />
        </div>
        <MobileMenu light={!pastHero || overDark} />
      </div>
    </header>
  );
}
