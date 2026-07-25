import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { AIEmployees } from "@/components/ai-employees";
import { PlatformPillars } from "@/components/platform-pillars";
import { HowItWorks } from "@/components/how-it-works";
import { TeamTeaser } from "@/components/team-teaser";
import { MissionVision } from "@/components/mission-vision";
import { HomeSectionCTA } from "@/components/home-section-cta";
import { Footer } from "@/components/footer";

// Section order leads with the AI Employees offer; everything Rumi also builds
// and runs (website, app, content, visibility) follows as "extra services".
// Background rhythm: navy hero -> white -> surface -> white -> surface -> white
// -> navy CTA -> navy footer.
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        {/* The offer: five roles you can hire */}
        <AIEmployees />
        {/* Secondary: what else we build and run for a business */}
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
