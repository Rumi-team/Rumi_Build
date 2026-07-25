import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PageHeader } from "@/components/page-header";
import { SectionCTA } from "@/components/section-cta";
import { ServiceCard } from "@/components/service-card";
import { SavingBadge, WorkloadPill } from "@/components/price-badges";
import {
  AI_EMPLOYEES,
  getAIEmployeeBySlug,
  PRICING_NOTE,
  WHITE_LABEL_NOTE,
  ONBOARDING_NOTE,
  SAVING_LABEL,
} from "@/lib/data";

export function generateStaticParams() {
  return AI_EMPLOYEES.map((role) => ({ slug: role.slug }));
}

// AI_EMPLOYEES is the complete set of roles, so there is nothing to resolve on
// demand. Turning off dynamicParams makes an unknown slug 404 at the routing
// layer, which serves the fully server-rendered not-found page — calling
// notFound() from inside the segment instead returns a 404 whose body only
// arrives via the RSC payload, so the first paint is blank.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const role = getAIEmployeeBySlug(slug);
  if (!role) return {};
  const title = `${role.name} — from ${role.priceFrom} — Rumi AI`;
  const description = `${role.tagline} Covers ${role.workload}, from ${role.priceFrom} — about a tenth of what that work costs today. Live in 1-3 weeks, trained on your business, managed by the Rumi team.`;
  return {
    title,
    description,
    // openGraph is inherited wholesale from the root layout, so without this a
    // share of this page resolves and attributes to the homepage (the layout
    // pins og:url to "/"). Restating it means restating images/type/siteName
    // too, or the social preview image is lost. `url` is relative on purpose:
    // it resolves against metadataBase, so it follows the canonical host
    // whatever that is set to rather than hardcoding one here.
    openGraph: {
      title,
      description,
      url: `/services/${role.slug}`,
      siteName: "Rumi AI",
      type: "website",
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
  };
}

export default async function AIEmployeeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const role = getAIEmployeeBySlug(slug);
  if (!role) notFound();

  // Bundles list the roles they are made of; every page lists the others.
  const included = (role.includes ?? [])
    .map((s) => getAIEmployeeBySlug(s))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  const others = AI_EMPLOYEES.filter((r) => r.slug !== role.slug);

  return (
    <>
      <Nav />
      <main className="pt-16">
        {/* Who you're hiring, what it costs, what it covers */}
        <section className="bg-white py-20 px-6 md:px-12">
          <div className="mx-auto max-w-3xl">
            <PageHeader
              overline="AI Employee"
              title={role.name}
              description={role.tagline}
            />

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-6">
              <span className="text-3xl font-bold tracking-h2 text-ink">
                from {role.priceFrom}
              </span>
              <SavingBadge label={SAVING_LABEL} size="md" />
              <WorkloadPill workload={role.workload} />
            </div>

            <p className="text-base text-muted leading-relaxed mb-8">
              {role.description}
            </p>

            <a href="/book" className="btn-primary px-7 py-3.5 text-base">
              Book a Call &rarr;
            </a>
          </div>
        </section>

        {/* What they handle */}
        <section
          aria-labelledby="handles-heading"
          className="bg-surface py-20 px-6 md:px-12"
        >
          <div className="mx-auto max-w-3xl">
            <p className="eyebrow mb-3">The job</p>
            <h2
              id="handles-heading"
              className="text-2xl md:text-3xl font-bold tracking-h2 text-ink mb-6"
            >
              What they handle
            </h2>
            <ul className="space-y-3 mb-12">
              {role.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-muted"
                >
                  <span className="text-accent mt-0.5 shrink-0">&#10003;</span>
                  {feature}
                </li>
              ))}
            </ul>

            <p className="eyebrow mb-3">In practice</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-h2 text-ink mb-6">
              What it looks like on the job
            </h2>
            <ul className="space-y-3">
              {role.useCases.map((useCase) => (
                <li
                  key={useCase}
                  className="flex items-start gap-3 text-sm text-muted"
                >
                  <span className="text-accent mt-0.5 shrink-0">&rarr;</span>
                  {useCase}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Bundles: the roles inside this hire */}
        {included.length > 0 && (
          <section
            aria-labelledby="included-heading"
            className="bg-white py-20 px-6 md:px-12"
          >
            <div className="mx-auto max-w-5xl">
              <p className="eyebrow mb-3">Included</p>
              <h2
                id="included-heading"
                className="text-2xl md:text-3xl font-bold tracking-h2 text-ink mb-3"
              >
                Who you&apos;re hiring
              </h2>
              <p className="text-muted mb-8 max-w-xl">
                {included.length} roles in one hire, sharing a calendar, a
                customer record, and a single approval queue.
              </p>
              {/* No workload pills here on purpose. The component workloads sum
                  to more than the bundle's own headline figure (the Chief of
                  Staff covers ~$9,000+/mo while its three roles list
                  3,000 + 5,000 + 4,000), so showing both a screen apart reads
                  as an arithmetic error. The hero carries the price story. */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {included.map((r) => (
                  <ServiceCard
                    key={r.slug}
                    service={{
                      icon: r.icon,
                      name: r.name,
                      tagline: r.tagline,
                      slug: r.slug,
                    }}
                    linked
                    footer="See the role →"
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Onboarding, pricing, white-label */}
        <section
          aria-labelledby="onboarding-heading"
          className={`${
            included.length > 0 ? "bg-surface" : "bg-white"
          } py-20 px-6 md:px-12`}
        >
          <div className="mx-auto max-w-5xl">
            <p className="eyebrow mb-3">Hiring them</p>
            <h2
              id="onboarding-heading"
              className="text-2xl md:text-3xl font-bold tracking-h2 text-ink mb-8"
            >
              From the call to their first day
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div
                className={`rounded-xl border border-line p-6 ${
                  included.length > 0 ? "bg-white" : "bg-surface"
                }`}
              >
                <h3 className="text-base font-semibold text-ink mb-2">
                  Onboarding
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {ONBOARDING_NOTE}
                </p>
              </div>
              <div
                className={`rounded-xl border border-line p-6 ${
                  included.length > 0 ? "bg-white" : "bg-surface"
                }`}
              >
                <h3 className="text-base font-semibold text-ink mb-2">
                  What you pay
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {PRICING_NOTE}
                </p>
              </div>
              <div
                className={`rounded-xl border border-line p-6 ${
                  included.length > 0 ? "bg-white" : "bg-surface"
                }`}
              >
                <h3 className="text-base font-semibold text-ink mb-2">
                  Under your own brand
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {WHITE_LABEL_NOTE}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The other roles */}
        <section
          aria-labelledby="others-heading"
          className={`${
            included.length > 0 ? "bg-white" : "bg-surface"
          } py-20 px-6 md:px-12`}
        >
          <div className="mx-auto max-w-5xl">
            <p className="eyebrow mb-3">The rest of the team</p>
            <h2
              id="others-heading"
              className="text-2xl md:text-3xl font-bold tracking-h2 text-ink mb-8"
            >
              Other roles you can hire
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {others.map((r) => (
                <ServiceCard
                  key={r.slug}
                  service={{
                    icon: r.icon,
                    name: r.name,
                    tagline: r.tagline,
                    // `workload` travels with `savingLabel` everywhere on the
                    // site: "90% off" is 90% off THIS much work. Drop the pill
                    // and the badge reads as a discount off our own price.
                    workload: r.workload,
                    price: `from ${r.priceFrom}`,
                    slug: r.slug,
                  }}
                  linked
                  footer="See the role →"
                  savingLabel={SAVING_LABEL}
                />
              ))}
            </div>
            <div className="mt-8">
              <a href="/services" className="btn-secondary-white px-6 py-2.5 text-sm">
                All five roles and pricing &rarr;
              </a>
            </div>
          </div>
        </section>

        <SectionCTA
          title={`Would the ${role.name} earn its cost in your first month?`}
          description="Book a call. We will look at the volume this role would actually take on for you, tell you plainly whether it pays for itself, and say so if a different role would do more."
          cta="Book a Call"
          sub="A real conversation, not a sales pitch. In English or Farsi."
          href="/book"
        />
      </main>
      <Footer />
    </>
  );
}
