import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      <Image
        src="/herov1.png"
        alt="Caddie Companion in the grass"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Subtle bottom gradient for text legibility */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
      />

      <div className="relative z-10 flex min-h-screen items-end justify-end px-6 pb-12 md:px-16 md:pb-16">
        <div className="text-right">
          <h1
            className="font-brand font-medium uppercase text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight"
          >
            A new species
            <br />
            of caddie.
          </h1>
          <p className="mt-4 text-white/80 text-sm md:text-base tracking-wide">
            The multi-tool every golfer keeps in their bag.
          </p>
        </div>
      </div>
    </section>
  );
}
