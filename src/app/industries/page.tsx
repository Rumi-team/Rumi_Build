import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PageHeader } from "@/components/page-header";
import { VerticalCard } from "@/components/vertical-card";
import { SectionCTA } from "@/components/section-cta";
import { VERTICALS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Industries — Rumi Build",
  description:
    "AI solutions for home services, healthcare, restaurants, legal, accounting, and construction. Built for industries where AI pays for itself.",
};

export default function IndustriesPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="py-20 px-6">
          <div className="mx-auto max-w-5xl">
            <PageHeader
              overline="Industries"
              title="Built for industries where AI pays for itself"
              description="We go deep in verticals where the ROI narrative is clear and the market is massive."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {VERTICALS.map((vertical) => (
                <VerticalCard key={vertical.slug} vertical={vertical} />
              ))}
            </div>
          </div>
        </section>
        <SectionCTA />
      </main>
      <Footer />
    </>
  );
}
