import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PageHeader } from "@/components/page-header";
import { SectionCTA } from "@/components/section-cta";
import { SERVICES, VERTICALS, getServiceBySlug } from "@/lib/data";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: `${service.name} — Rumi Build`,
    description: service.tagline + ". " + service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const related = service.relatedVerticals
    .map((slug) => VERTICALS.find((v) => v.slug === slug))
    .filter(Boolean);

  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="py-20 px-6">
          <div className="mx-auto max-w-3xl">
            <PageHeader
              overline={service.priceRange}
              title={service.name}
              description={service.tagline}
            />

            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-400/10 text-2xl mb-8">
              {service.icon}
            </div>

            <p className="text-base text-zinc-400 leading-relaxed mb-10">
              {service.description}
            </p>

            {/* Features */}
            <h2 className="text-xl font-semibold mb-4">What&apos;s included</h2>
            <ul className="space-y-3 mb-10">
              {service.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-zinc-400"
                >
                  <span className="text-green-400 mt-0.5 shrink-0">
                    &#10003;
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            {/* Use cases */}
            <h2 className="text-xl font-semibold mb-4">Use cases</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {service.useCases.map((useCase) => (
                <div
                  key={useCase}
                  className="rounded-lg border border-zinc-700 bg-zinc-800/30 p-4"
                >
                  <p className="text-sm text-zinc-400">{useCase}</p>
                </div>
              ))}
            </div>

            {/* Related industries */}
            {related.length > 0 && (
              <>
                <h2 className="text-xl font-semibold mb-4">
                  Industries we serve with {service.name.toLowerCase()}
                </h2>
                <div className="flex flex-wrap gap-3 mb-10">
                  {related.map(
                    (v) =>
                      v && (
                        <a
                          key={v.slug}
                          href={`/industries/${v.slug}`}
                          className="rounded-lg border border-zinc-700 bg-zinc-800/30 px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-amber-400"
                        >
                          {v.name}
                        </a>
                      )
                  )}
                </div>
              </>
            )}
          </div>
        </section>
        <SectionCTA />
      </main>
      <Footer />
    </>
  );
}
