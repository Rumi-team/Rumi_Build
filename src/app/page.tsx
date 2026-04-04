import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { StatsBar } from "@/components/stats-bar";
import { ServicesPreview } from "@/components/services-preview";
import { CaseStudy } from "@/components/case-study";
import { IndustriesPreview } from "@/components/industries-preview";
import { HowItWorks } from "@/components/how-it-works";
import { Pricing } from "@/components/pricing";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <StatsBar />
        <ServicesPreview />
        <CaseStudy />
        <IndustriesPreview />
        <HowItWorks />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
