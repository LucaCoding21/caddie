"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProductPill } from "@/components/product-pill";

export default function SiteHeader() {
  // Hero is full-viewport and dark; the logo is white to read against it.
  // Once scrolled past the hero, the header sits over light sections, so
  // flip the logo to a dark color to keep it legible.
  const [pastHero, setPastHero] = useState(false);
  // Some later sections are dark too (e.g. the exploded view). Track whether a
  // section marked [data-nav-dark] currently sits under the logo, so it can
  // stay white there instead of flipping to the dark, light-section color.
  const [overDark, setOverDark] = useState(false);
  // Hide the logo while scrolling down, reveal it on scroll up (and always
  // near the top). lastY tracks the previous position to infer direction.
  const [showLogo, setShowLogo] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setPastHero(y > window.innerHeight - 80);

      // Probe a point near the logo's vertical center; if a dark-marked section
      // spans it, the logo is over dark.
      const probe = 36;
      let dark = false;
      document.querySelectorAll<HTMLElement>("[data-nav-dark]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom >= probe) dark = true;
      });
      setOverDark(dark);

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
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 flex items-center justify-between gap-4 pointer-events-none">
      <div
        className={`flex items-center gap-6 transition-all duration-300 ${
          pastHero && !overDark ? "text-zinc-900" : "text-white"
        } ${
          showLogo
            ? "-translate-y-1 opacity-100 pointer-events-auto"
            : "-translate-y-6 opacity-0 pointer-events-none"
        }`}
      >
        <Link href="/" aria-label="Caddie Companion home" className="block">
          {/* Logo art is cobalt; over the dark hero / dark sections it's flipped
              to white so the dark-blue mark doesn't disappear. */}
          <Image
            src="/caddie-logo.png"
            alt="Caddie Companion"
            width={305}
            height={103}
            priority
            className={`h-10 md:h-11 w-auto transition-[filter] duration-300 ${
              pastHero && !overDark ? "" : "brightness-0 invert"
            }`}
          />
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
  );
}
