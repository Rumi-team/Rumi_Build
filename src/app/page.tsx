import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { PlatformPillars } from "@/components/platform-pillars";
import { HowItWorks } from "@/components/how-it-works";
import { TeamTeaser } from "@/components/team-teaser";
import { MissionVision } from "@/components/mission-vision";
import { HomeSectionCTA } from "@/components/home-section-cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <PlatformPillars />
        <HowItWorks />
        {/* Trust beat: founders who've done it at scale */}
        <TeamTeaser />
        <MissionVision />
        <HomeSectionCTA />
      </main>
      <Footer />
    </>
  );
}
