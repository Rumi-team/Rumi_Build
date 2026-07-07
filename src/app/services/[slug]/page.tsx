import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PageHeader } from "@/components/page-header";
import { SectionCTA } from "@/components/section-cta";
import {
  SERVICES,
  VERTICALS,
  getServiceBySlug,
  VOICE_AI_LANGUAGES,
  VOICE_AI_MULTILINGUAL,
} from "@/lib/data";

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
  const title = `${service.name} — Rumi Build`;
  const description = service.tagline + " " + service.description;
  const url = `https://rumi.build/services/${service.slug}`;
  // Restate openGraph + twitter — Next.js metadata REPLACES (not merges) these
  // when set on a page, so we'd lose the layout's images/type otherwise.
  return {
    title,
    description,
    openGraph: {
      title,
      description: service.tagline,
      url,
      siteName: "Rumi Build",
      type: "website",
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: service.tagline,
      images: ["/og-image.png"],
    },
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
              overline="Open role"
              title={service.name}
              description={service.tagline}
            />

            <div
              className="icon-badge h-14 w-14 rounded-xl text-2xl mb-8"
              aria-hidden="true"
            >
              {service.icon}
            </div>

            <p className="text-base text-muted leading-relaxed mb-10">
              {service.description}
            </p>

            {/* Features */}
            <h2 className="text-xl font-semibold text-ink mb-4">What&apos;s included</h2>
            <ul className="space-y-3 mb-10">
              {service.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-muted"
                >
                  <span className="text-accent mt-0.5 shrink-0">
                    &#10003;
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            {/* Use cases */}
            <h2 className="text-xl font-semibold text-ink mb-4">Use cases</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {service.useCases.map((useCase) => (
                <div key={useCase} className="card p-4">
                  <p className="text-sm text-muted">{useCase}</p>
                </div>
              ))}
            </div>

            {/* Multilingual section (Chief of Customer Service only) */}
            {slug === "chief-of-customer-service" && (
              <div className="border-t border-line pt-8 mt-8 mb-10">
                <h2 className="text-xl font-semibold text-ink mb-4">
                  {VOICE_AI_MULTILINGUAL.heading}
                </h2>
                <p className="text-sm text-muted leading-relaxed mb-6">
                  {VOICE_AI_MULTILINGUAL.autoDetect}
                </p>

                {/* Stat callout */}
                <div className="rounded-lg border border-line bg-surface p-6 mb-6">
                  <p className="text-3xl font-black text-accent">
                    {VOICE_AI_MULTILINGUAL.stat}
                  </p>
                  <p className="text-sm text-muted">
                    {VOICE_AI_MULTILINGUAL.statLabel}
                  </p>
                  <p className="text-xs text-muted mt-1">
                    Source: {VOICE_AI_MULTILINGUAL.source}
                  </p>
                </div>

                <p className="text-sm text-muted leading-relaxed mb-6">
                  {VOICE_AI_MULTILINGUAL.supporting}
                </p>

                {/* Language grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {VOICE_AI_LANGUAGES.map((lang) => (
                    <span
                      key={lang}
                      className="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm text-ink text-center"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related industries */}
            {related.length > 0 && (
              <>
                <h2 className="text-xl font-semibold text-ink mb-4">
                  Industries we serve with {service.name.toLowerCase()}
                </h2>
                <div className="flex flex-wrap gap-3 mb-10">
                  {related.map(
                    (v) =>
                      v && (
                        <a
                          key={v.slug}
                          href={`/industries/${v.slug}`}
                          className="rounded-lg border border-line bg-white px-4 py-2 text-sm text-muted transition hover:border-accent hover:text-accent"
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
