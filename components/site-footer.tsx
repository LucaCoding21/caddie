import Image from "next/image";
import Link from "next/link";

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
  return (
    <footer
      className="fixed inset-x-0 bottom-0 z-0 flex flex-col items-center justify-center overflow-hidden bg-white"
      style={{ height: "var(--footer-h)" }}
    >
      {/* Full-bleed backdrop: the four Caddie tools on a bed of golf balls. */}
      {/* No preload: this footer is pinned at the very bottom and revealed only
          after scrolling the whole page, so it must never compete with the hero
          for first-paint bandwidth. Default lazy loading is correct here. */}
      <Image
        src="/golf-multi-tool-colors-on-golf-balls.png"
        alt="Caddie Companion tools in green, black, blue, and red resting on golf balls"
        fill
        sizes="100vw"
        className="select-none object-cover object-[center_30%]"
      />

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
