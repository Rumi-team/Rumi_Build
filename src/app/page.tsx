import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { PlatformPillars } from "@/components/platform-pillars";
import { LanguageBar } from "@/components/language-bar";
import { HowItWorks } from "@/components/how-it-works";
import { TeamTeaser } from "@/components/team-teaser";
import { SectionCTA } from "@/components/section-cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <PlatformPillars />
        {/* LanguageBar reinforces the moat: 56% of LA County + the languages we deliver in */}
        <LanguageBar />
        <HowItWorks />
        {/* Trust beat: founders who've done it at scale (no customer logos yet) */}
        <TeamTeaser />
        <SectionCTA
          title="Find out what you're invisible to."
          description="A free evaluation: tell us about your business and your current site, and we'll show you where customers are slipping past — and exactly what we'd build to catch them."
          cta="Request a free evaluation"
          sub="No cost, no commitment. English, Farsi, or Spanish."
          href="/evaluate"
        />
      </main>
      <Footer />
    </>
  );
}
