import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { LanguageBar } from "@/components/language-bar";
import { ServicesPreview } from "@/components/services-preview";
import { IndustriesPreview } from "@/components/industries-preview";
import { HowItWorks } from "@/components/how-it-works";
import { SectionCTA } from "@/components/section-cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <LanguageBar />
        <ServicesPreview />
        {/* CaseStudy hidden in v1 — bring back as "Pilot in progress: Persian curtain retailer" once founding-customer story consents */}
        <IndustriesPreview />
        <HowItWorks />
        <SectionCTA />
      </main>
      <Footer />
    </>
  );
}
