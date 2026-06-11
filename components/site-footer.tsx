import Image from "next/image";

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
      {/* Full-bleed backdrop: golf clubs against the sky. */}
      <Image
        src="/footer-clubs-v2.jpg"
        alt="Golf clubs against a blue sky"
        fill
        preload
        sizes="100vw"
        className="select-none object-cover object-[center_15%]"
      />

      {/* Wordmark, centered over the photo. Steps with the viewport so the
          two words stay on one line from tablet up without overflowing. */}
      <h2 className="relative z-10 select-none px-6 text-center font-brand text-4xl font-bold uppercase tracking-tight text-white sm:text-6xl md:text-7xl xl:text-[6.5rem]">
        Caddie Companion
      </h2>

      <p className="absolute bottom-6 z-10 px-6 text-center font-inter text-xs text-white/80">
        © 2026 Caddie Companion. Designed for the walk from tee to green.
      </p>
    </footer>
  );
}
