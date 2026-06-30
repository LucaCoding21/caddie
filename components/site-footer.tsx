"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const legalLinks = [
  { label: "Privacy Policy", slug: "privacy-policy" },
  { label: "Refund Policy", slug: "refund-policy" },
  { label: "Terms of Service", slug: "terms-of-service" },
  { label: "Shipping Policy", slug: "shipping-policy" },
];

// Reveal footer: pinned to the bottom of the viewport at a low z-index. The
// page content scrolls over it on an opaque layer; the last section sliding up
// uncovers this. Height is driven by --footer-h (see globals.css), which also
// reserves the matching scroll space in page.tsx.
export default function SiteFooter() {
  // The backdrop photo is mounted lazily, not on first paint. Reason: this
  // footer is position:fixed, so even though it's hidden behind the opaque
  // content at the top of the page, the browser still PAINTS it — and Chrome's
  // LCP algorithm ignores occlusion, so this large photo was being picked as the
  // Largest Contentful Paint instead of the hero, capping the LCP score on an
  // image the user can't even see yet. Deferring the mount removes it as a paint
  // candidate at load.
  //
  // But we mustn't wait until the footer is nearly in view: at --footer-h: 60vh
  // the trigger and the reveal are almost simultaneous, so a fast scroll reaches
  // the footer before the image finishes loading and it flashes blank white. So
  // instead we preload the moment the hero is behind us. The first scroll also
  // finalizes the browser's LCP measurement, so from that point the footer photo
  // can no longer masquerade as the LCP — giving us several screens of lead time
  // to load it before the reveal.
  const [showBackdrop, setShowBackdrop] = useState(false);

  useEffect(() => {
    const mount = () => setShowBackdrop(true);
    // Load during idle so it never competes with the active scroll's paint work;
    // the timeout guarantees it still fires on a busy main thread.
    const idleMount = () =>
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(mount, { timeout: 2000 })
        : mount();

    const check = () => {
      const heroBehind = window.scrollY > window.innerHeight;
      // Fallback for pages too short to ever scroll past one full viewport.
      const nearBottom =
        window.scrollY + window.innerHeight * 1.5 >=
        document.documentElement.scrollHeight;
      if (heroBehind || nearBottom) {
        window.removeEventListener("scroll", check);
        idleMount();
      }
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  return (
    <footer
      className="fixed inset-x-0 bottom-0 z-0 flex flex-col items-center justify-center overflow-hidden bg-white"
      style={{ height: "var(--footer-h)" }}
    >
      {/* Full-bleed backdrop: the four Caddie tools on a bed of golf balls.
          Mounted lazily (see note above) so it never competes with — or
          masquerades as — the hero's LCP. */}
      {showBackdrop && (
        <Image
          src="/golf-multi-tool-colors-on-golf-balls.png"
          alt="Caddie Companion tools in green, black, blue, and red resting on golf balls"
          fill
          sizes="100vw"
          className="select-none object-cover object-[center_30%]"
        />
      )}

      {/* Bottom-up white scrim: fades the busy golf-ball photo to solid white
          at the base so the black legal links and copyright read cleanly,
          while leaving the tools visible higher up. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-1/3 bg-gradient-to-t from-white/40 to-transparent" />

      <div className="absolute bottom-6 z-10 flex flex-col items-center gap-2 px-6 text-center">
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-inter text-xs text-black">
          {legalLinks.map((link) => (
            <Link
              key={link.slug}
              href={`/policies/${link.slug}`}
              className="underline-offset-4 hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="font-inter text-xs text-black">
          © 2026 Caddie Companion. Designed for the walk from tee to green.
        </p>
      </div>
    </footer>
  );
}
