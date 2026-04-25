import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PageHeader } from "@/components/page-header";
import { ServiceCard } from "@/components/service-card";
import { SectionCTA } from "@/components/section-cta";
import { SERVICES } from "@/lib/data";

export const metadata: Metadata = {
  title: "Open Roles — Rumi Build",
  description:
    "Three AI specialists ready to hire. Chief of Staff, Chief of Marketing, Chief of Customer Service. Trained on your context, working 24/7, deployed in days.",
};

export default function ServicesPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="py-20 px-6">
          <div className="mx-auto max-w-5xl">
            <PageHeader
              overline="Open roles"
              title="Need a new employee?"
              description="Pick one of ours. Trained on your context, working 24/7, fraction of a human salary. Three AI specialists, deployed in days."
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
