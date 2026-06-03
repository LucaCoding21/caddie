// Closing FAQ — drafted, editable placeholders in the brand voice. Uses native
// <details>/<summary> so it's accessible and needs no client JS.
const FAQS: { q: string; a: string }[] = [
  {
    q: "What are the six tools?",
    a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
  },
  {
    q: "Is it allowed on the course?",
    a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis nostrud exercitation ullamco laboris.",
  },
  {
    q: "What's it made of?",
    a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat.",
  },
  {
    q: "How big is it, and how much does it weigh?",
    a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.",
  },
  {
    q: "What about shipping and returns?",
    a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.",
  },
  {
    q: "Is there a warranty?",
    a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua duis aute irure dolor in reprehenderit.",
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
