import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PageHeader } from "@/components/page-header";
import { ServiceCard } from "@/components/service-card";
import { SectionCTA } from "@/components/section-cta";
import { SERVICES } from "@/lib/data";

export const metadata: Metadata = {
  title: "AI Services — Rumi Build",
  description:
    "Voice AI agents, web and mobile apps, and workflow automation. Focused AI services with measurable cost savings for LA businesses.",
};

export default function ServicesPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="py-20 px-6">
          <div className="mx-auto max-w-5xl">
            <PageHeader
              overline="Services"
              title="What We Build"
              description="Three focused services for LA businesses. Each one pays for itself."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {SERVICES.map((service) => (
                <ServiceCard key={service.slug} service={service} />
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
