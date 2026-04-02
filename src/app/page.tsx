import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { CaseStudy } from "@/components/case-study";
import { HowItWorks } from "@/components/how-it-works";
import { Pricing } from "@/components/pricing";
import { Team } from "@/components/team";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <CaseStudy />
        <HowItWorks />
        <Pricing />
        <Team />
      </main>
      <Footer />
    </>
  );
}
