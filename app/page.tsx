import SiteHeader from "@/components/site-header";
import Hero from "@/components/hero";
import Promise from "@/components/promise";
import SixIntoOne from "@/components/six-into-one";
import Anatomy from "@/components/anatomy";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* 1. Hero — moody product photo + one-line headline */}
        <Hero />

        {/* 2. One-line promise — names the core value */}
        <Promise />

        {/* 3. Six tools fold into one — the consolidation story */}
        <SixIntoOne />

        {/* 4. Anatomy — full fanned-open photo, tool callouts to come */}
        <Anatomy />

        {/* Add sections below as you build them:
            <Features />
            <HowItWorks />
            <Reviews />
        */}
      </main>
    </>
  );
}
