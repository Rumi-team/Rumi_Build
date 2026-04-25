import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PageHeader } from "@/components/page-header";
import { ServiceCard } from "@/components/service-card";
import { SectionCTA } from "@/components/section-cta";
import { SERVICES } from "@/lib/data";

export const metadata: Metadata = {
  title: "Hire Your Next Employee — Rumi Build",
  description:
    "Four AI specialists ready to work. Chief of Staff, Chief of Operations, Chief of Marketing, Chief of Customer Service. Fraction of the cost, 24/7 availability, deployed in days.",
};

export default function ServicesPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="py-20 px-6">
          <div className="mx-auto max-w-5xl">
            <PageHeader
              overline="Hire your next employee"
              title="Need a new employee?"
              description="Pick one of ours. Fraction of the cost, 24/7 availability, deployed in days. Four AI specialists trained on your context."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5">
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
