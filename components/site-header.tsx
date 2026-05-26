import Image from "next/image";
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 flex items-center justify-between gap-4 pointer-events-none">
      <Link
        href="/"
        className="font-brand text-white text-xl font-medium uppercase tracking-tight pointer-events-auto"
      >
        Caddie
      </Link>

      <div className="pointer-events-auto flex items-center gap-3 bg-white/95 backdrop-blur rounded-full pl-1.5 pr-1.5 py-1.5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.25)]">
        <Image
          src="/colors/black.png"
          alt=""
          width={56}
          height={56}
          className="h-8 w-8 object-contain rounded-full bg-zinc-100"
        />
        <span className="text-sm font-medium text-black">
          Caddie Companion
        </span>
        <span className="text-zinc-300" aria-hidden>
          ·
        </span>
        <span className="text-sm text-zinc-600 tabular-nums">$29</span>
        <Link
          href="/select-color"
          className="ml-1 inline-flex items-center gap-1 bg-black text-white rounded-full px-4 py-2 text-xs font-medium hover:bg-zinc-800 transition-colors"
        >
          Order now
          <span aria-hidden>→</span>
        </Link>
      </div>
    </header>
  );
}
