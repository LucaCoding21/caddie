// Closing FAQ — drafted, editable placeholders in the brand voice. Uses native
// <details>/<summary> so it's accessible and needs no client JS.
const FAQS: { q: string; a: string }[] = [
  {
    q: "What are the six tools?",
    a: "A divot repair tool, a brass groove brush, a magnetic ball marker, a T25 Torx driver for your clubheads, a pocket knife, and a bottle opener — folded into one frame.",
  },
  {
    q: "Is it allowed on the course?",
    a: "Yes. Every tool is course-legal and built for the things golfers actually do between shots — fixing pitch marks, cleaning grooves, marking your line.",
  },
  {
    q: "What's it made of?",
    a: "A machined 6061 aluminium frame, a stainless steel pivot and pin, and a brass brush. It's anodised in four colours and finished to shrug off a season in your bag.",
  },
  {
    q: "How big is it, and how much does it weigh?",
    a: "It folds down to 92 mm and weighs 62 grams — slim enough to forget you're carrying it until you reach for it.",
  },
  {
    q: "What about shipping and returns?",
    a: "Orders ship within two business days with tracking. If it isn't right for you, send it back within 30 days for a full refund.",
  },
  {
    q: "Is there a warranty?",
    a: "Every Caddie Companion is covered by a lifetime warranty against manufacturing defects. If the hardware ever fails, we'll repair or replace it.",
  },
];

export default function Faq() {
  return (
    <section
      id="faq"
      className="relative z-20 w-full scroll-mt-24 bg-[#fafaf7] px-6 md:px-12 py-24 md:py-32"
    >
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
        <div>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
            Good to know
          </p>
          <h2 className="mt-5 max-w-xs font-inter font-medium text-black text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.05] tracking-tight">
            Questions, answered.
          </h2>
        </div>

        <dl className="border-t border-black/10">
          {FAQS.map(({ q, a }) => (
            <details
              key={q}
              className="group border-b border-black/10 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 list-none">
                <dt className="font-inter text-lg font-medium text-black md:text-xl">
                  {q}
                </dt>
                <span
                  aria-hidden
                  className="shrink-0 text-2xl font-light leading-none text-zinc-400 transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <dd className="max-w-2xl pb-6 font-inter text-base leading-[1.6] text-zinc-500">
                {a}
              </dd>
            </details>
          ))}
        </dl>
      </div>
    </section>
  );
}
