import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { EnglishMain } from "@/components/english-main";
import { PageHeader } from "@/components/page-header";
import { SectionCTA } from "@/components/section-cta";
import { ServiceCard } from "@/components/service-card";
import { PolicyNotes } from "@/components/policy-notes";
import { SavingBadge, WorkloadPill } from "@/components/price-badges";
import { AI_EMPLOYEES, getAIEmployeeBySlug, SAVING_LABEL } from "@/lib/data";
// Server-only: the description, feature list and use cases for the five roles.
// Deliberately NOT re-exported through @/lib/data — the footer is a client
// component that imports AI_EMPLOYEES, so anything data.ts touches is compiled
// into the browser bundle on every page of the site. This is the only file that
// may import it.
import { AI_EMPLOYEE_DETAILS } from "@/lib/ai-employee-details";

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
    // Without this every role page inherits the root layout's canonical ("/")
    // and declares itself the homepage. Relative, so it resolves through
    // metadataBase — the sibling site ships the same role slugs, so a hardcoded
    // host here is exactly the wrong thing.
    alternates: { canonical: `/services/${role.slug}` },
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
  const detail = AI_EMPLOYEE_DETAILS[role.slug];

  // Bundles list the roles they are made of; every page lists the others.
  const included = (role.includes ?? [])
    .map((s) => getAIEmployeeBySlug(s))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  const others = AI_EMPLOYEES.filter((r) => r.slug !== role.slug);

  // The page alternates white and surface all the way down, and the bundle
  // section — always white, and rendered only for a bundle — shifts everything
  // below it by one. So every fill under it flips on this single condition,
  // which used to be re-derived by an inline ternary at five separate sites.
  const hasBundle = included.length > 0;
  const sectionBg = hasBundle ? "bg-surface" : "bg-white";
  // The alternate fill: cards sitting inside `sectionBg`, and the next section
  // down, are both the opposite of it.
  const cardBg = hasBundle ? "bg-white" : "bg-surface";

  return (
    <>
      <Nav />
      {/* English-only server page, pinned to LTR/en — see
          src/components/english-main.tsx for why. */}
      <EnglishMain className="pt-16">
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
              {detail.description}
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
              {detail.features.map((feature) => (
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
              {detail.useCases.map((useCase) => (
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
        {hasBundle && (
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
              {/* No workload pills here on purpose. A bundle's workload IS the
                  sum of its roles' workloads (the Chief of Staff covers
                  ~$12,000/mo = 3,000 + 5,000 + 4,000), so a pill on each card
                  would restate the hero's figure in parts, a screen below it,
                  and invite the reader to add up three numbers to check our
                  arithmetic. The hero carries the price story. */}
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
          className={`${sectionBg} py-20 px-6 md:px-12`}
        >
          <div className="mx-auto max-w-5xl">
            <p className="eyebrow mb-3">Hiring them</p>
            <h2
              id="onboarding-heading"
              className="text-2xl md:text-3xl font-bold tracking-h2 text-ink mb-8"
            >
              From the call to their first day
            </h2>
            {/* Onboarding-first here: this section is about getting the role
                working. /services shows the same three pricing-first. */}
            <PolicyNotes
              cardBg={cardBg}
              notes={[
                { note: "onboarding", heading: "Onboarding" },
                { note: "pricing", heading: "What you pay" },
                { note: "whiteLabel", heading: "Under your own brand" },
              ]}
            />
          </div>
        </section>

        {/* The other roles */}
        {/* `cardBg` is the alternate fill, which is what this section takes:
            it sits directly under `sectionBg`. */}
        <section
          aria-labelledby="others-heading"
          className={`${cardBg} py-20 px-6 md:px-12`}
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
      </EnglishMain>
      <Footer />
    </>
  );
}
