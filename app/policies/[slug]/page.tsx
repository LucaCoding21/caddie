import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { getPolicy, isPolicySlug, POLICY_SLUGS } from "@/lib/policies";

// Pre-render all four policy routes at build time; unknown slugs fall through
// to notFound() below.
export function generateStaticParams() {
  return POLICY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isPolicySlug(slug)) return {};

  const policy = await getPolicy(slug);
  if (!policy) return {};

  return {
    title: `${policy.title} | Caddie Companion`,
    description: `${policy.title} for Caddie Companion.`,
  };
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isPolicySlug(slug)) notFound();

  const policy = await getPolicy(slug);
  if (!policy) notFound();

  return (
    <>
      {/* Same persistent nav as every other page. Solid (dark logo) since this
          page has no dark hero. */}
      <SiteHeader solid />

      {/* Opaque content layer that scrolls over the fixed footer; the bottom
          margin reserves exactly the footer's height so it reveals on scroll. */}
      <main
        className="relative z-10 min-h-screen bg-[#fafaf7] text-black"
        style={{ marginBottom: "var(--footer-h)" }}
      >
        <article className="mx-auto max-w-3xl px-6 pt-32 pb-24 md:pt-40">
          <h1 className="font-brand text-3xl font-medium tracking-tight md:text-4xl">
            {policy.title}
          </h1>

          {/* The owner's approved policy text, rendered with on-brand
              typography. Links stay black (the cobalt accent is reserved for the
              buy action), body copy in Inter. */}
          <div
            className="mt-10 font-inter text-[15px] leading-7 text-black/80 [&_a]:font-medium [&_a]:text-black [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-10 [&_h2]:font-brand [&_h2]:text-xl [&_h2]:font-medium [&_h2]:text-black [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-black [&_h4]:mt-6 [&_h4]:font-medium [&_h4]:text-black [&_li]:mt-1 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-4 [&_strong]:font-semibold [&_strong]:text-black [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6"
            dangerouslySetInnerHTML={{ __html: policy.body }}
          />
        </article>
      </main>

      {/* Footer — pinned behind the content, revealed on scroll. */}
      <SiteFooter />
    </>
  );
}
