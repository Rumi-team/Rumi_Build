import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PageHeader } from "@/components/page-header";
import { SectionCTA } from "@/components/section-cta";
import { VERTICALS, SERVICES, getVerticalBySlug } from "@/lib/data";

export function generateStaticParams() {
  return VERTICALS.map((v) => ({ slug: v.slug }));
}

// VERTICALS is the complete set of industry pages, so there is nothing to
// resolve on demand. Without this, an unknown slug reaches notFound() from
// inside the segment and returns a 404 whose body arrives only in the RSC
// payload — first paint is blank. Turning dynamicParams off 404s at the routing
// layer instead, which serves the fully server-rendered not-found page.
// Matches services/[slug]/page.tsx.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vertical = getVerticalBySlug(slug);
  if (!vertical) return {};
  return {
    title: `AI for ${vertical.name} — Rumi AI`,
    description: vertical.tagline + ". " + vertical.description,
  };
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vertical = getVerticalBySlug(slug);
  if (!vertical) notFound();

  const related = vertical.relatedServices
    .map((slug) => SERVICES.find((s) => s.slug === slug))
    .filter(Boolean);

  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="py-20 px-6">
          <div className="mx-auto max-w-3xl">
            <PageHeader
              overline={vertical.stat}
              title={`AI for ${vertical.name}`}
              description={vertical.tagline}
            />

            <p className="text-base text-muted leading-relaxed mb-10">
              {vertical.description}
            </p>

            {/* Pain points */}
            <h2 className="text-xl font-semibold text-ink mb-4">
              The problems we solve
            </h2>
            <ul className="space-y-3 mb-10">
              {vertical.painPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-sm text-muted"
                >
                  <span className="text-accent mt-0.5 shrink-0">
                    &times;
                  </span>
                  {point}
                </li>
              ))}
            </ul>

            {/* Solutions */}
            <h2 className="text-xl font-semibold text-ink mb-4">What we deliver</h2>
            <ul className="space-y-3 mb-10">
              {vertical.solutions.map((solution) => (
                <li
                  key={solution}
                  className="flex items-start gap-3 text-sm text-muted"
                >
                  <span className="text-accent mt-0.5 shrink-0">
                    &#10003;
                  </span>
                  {solution}
                </li>
              ))}
            </ul>

            {/* ROI */}
            <div className="rounded-xl border border-line bg-surface p-6 mb-10">
              <p className="eyebrow mb-2">ROI</p>
              <p className="text-sm text-ink">{vertical.roiData}</p>
            </div>

            {/* Related services */}
            {related.length > 0 && (
              <>
                <h2 className="text-xl font-semibold text-ink mb-4">
                  Services for {vertical.name.toLowerCase()}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {related.map(
                    (s) =>
                      s && (
                        <a
                          key={s.slug}
                          href={s.href ?? `/services/${s.slug}`}
                          className="card p-4"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="icon-badge text-lg" aria-hidden="true">
                              {s.icon}
                            </div>
                            <h3 className="text-sm font-semibold text-ink">{s.name}</h3>
                          </div>
                          <p className="text-xs text-muted">{s.tagline}</p>
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
