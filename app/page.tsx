import SiteHeader from "@/components/site-header";
import Hero from "@/components/hero";
import Promise from "@/components/promise";
import Anatomy from "@/components/anatomy";
import OnCourse from "@/components/on-course";
import ExplodedView from "@/components/exploded-view";
import ClosingColours from "@/components/closing-colours";
import Faq from "@/components/faq";
import SiteFooter from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* 1. Hero — moody product photo + one-line headline */}
        <Hero />

        {/* 2. One-line promise — names the core value */}
        <Promise />

        {/* 3. Anatomy — full fanned-open photo, tool callouts to come */}
        <Anatomy />

        {/* 4. Exploded view — technical illustration that irises open on scroll */}
        <ExplodedView />

        {/* 5. On the course — lifestyle proof: open at the pin, stowed in a pocket */}
        <OnCourse />

        {/* 6. Colour picker — choose a finish, then buy */}
        <ClosingColours />

        {/* 7. FAQ */}
        <Faq />
      </main>

      {/* 8. Footer */}
      <SiteFooter />
    </>
  );
}
