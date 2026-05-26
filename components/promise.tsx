import Image from "next/image";

const BAG = "/usefulphotos/ChatGPT%20Image%20May%2025%2C%202026%2C%2001_09_21%20PM.png";
const TORX = "/usefulphotos/ChatGPT%20Image%20May%2025%2C%202026%2C%2001_23_27%20PM.png";
const GRASS = "/usefulphotos/ChatGPT%20Image%20May%2025%2C%202026%2C%2001_56_38%20PM.png";
const OPENER = "/usefulphotos/ChatGPT%20Image%20May%2025%2C%202026%2C%2002_30_32%20PM.png";

export default function Promise() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#fafaf7] px-6 py-24 lg:py-0 flex flex-col items-center justify-center">
      {/* Scattered photos — desktop only, positioned around the centered text */}
      <div aria-hidden className="hidden lg:block">
        <Image
          src={BAG}
          alt=""
          width={1122}
          height={1402}
          className="absolute top-[9%] left-[5%] w-48 xl:w-56 h-auto rounded-lg"
          sizes="(max-width: 1280px) 12rem, 14rem"
        />
        <Image
          src={TORX}
          alt=""
          width={1122}
          height={1402}
          className="absolute bottom-[14%] left-[9%] w-44 xl:w-52 h-auto rounded-lg"
          sizes="(max-width: 1280px) 11rem, 13rem"
        />
        <Image
          src={GRASS}
          alt=""
          width={1122}
          height={1402}
          className="absolute top-[16%] right-[5%] w-52 xl:w-60 h-auto rounded-lg"
          sizes="(max-width: 1280px) 13rem, 15rem"
        />
        <Image
          src={OPENER}
          alt=""
          width={1122}
          height={1402}
          className="absolute bottom-[10%] right-[8%] w-44 xl:w-52 h-auto rounded-lg"
          sizes="(max-width: 1280px) 11rem, 13rem"
        />
      </div>

      {/* Photos — mobile / tablet fallback row above the text */}
      <div className="lg:hidden grid grid-cols-2 gap-3 w-full max-w-xs mb-14">
        {[BAG, TORX, GRASS, OPENER].map((src) => (
          <Image
            key={src}
            src={src}
            alt=""
            width={1122}
            height={1402}
            className="w-full aspect-[4/5] object-cover rounded-lg"
            sizes="30vw"
          />
        ))}
      </div>

      {/* Center text */}
      <div className="relative z-10 text-center">
        <p className="font-brand text-xs uppercase tracking-[0.22em] text-zinc-500 mb-6">
          The Caddie Companion
        </p>
        <p className="font-brand font-medium text-black text-xl sm:text-2xl lg:text-[1.7rem] leading-[1.5] tracking-tight max-w-md mx-auto">
          The one tool that does it all. From repairing divots and
          cleaning grooves to dialing in your driver. It handles whatever
          the round throws at you.
        </p>
      </div>
    </section>
  );
}
