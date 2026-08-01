"use client";

import { CORE_ROLES, BUNDLE_ROLES, type AIEmployee } from "@/lib/data";
import { useT, type Dict } from "@/lib/i18n";
import { ServiceCard } from "@/components/service-card";

// The roles themselves — which ones exist, their order, their icons, and their
// detail-page slugs — are canonical in AI_EMPLOYEES (src/lib/data.ts). The
// dictionary supplies translated copy only, and is joined to a role BY SLUG
// rather than by array position: a reordered or missing translation then falls
// back to the English copy in data.ts instead of silently emitting a link to
// the wrong role page (or to /services/ with an empty slug).
type RoleCopy = Dict["roles"]["items"][number];

function cardFor(role: AIEmployee, copy: RoleCopy | undefined) {
  return {
    icon: role.icon,
    name: copy?.name ?? role.name,
    tagline: copy?.tagline ?? role.tagline,
    workload: copy?.workload ?? role.workload,
    price: copy?.price ?? `from ${role.priceFrom}`,
    href: `/services/${role.slug}`,
  };
}

export function AIEmployees() {
  const { t } = useT();

  const copyBySlug = new Map<string, RoleCopy>(
    [...t.roles.items, ...t.roles.bundles].map((r) => [r.slug, r])
  );

  return (
    <section
      id="ai-employees"
      aria-labelledby="ai-employees-heading"
      className="scroll-mt-20 bg-white py-20 px-6 md:px-12"
    >
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow mb-3">{t.roles.eyebrow}</p>
        <h2
          id="ai-employees-heading"
          className="text-3xl md:text-4xl font-bold tracking-h2 text-ink mb-3"
        >
          {t.roles.heading}
        </h2>
        <p className="text-muted mb-10 max-w-xl text-lg">{t.roles.sub}</p>

        {/* The three roles you can hire on their own */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CORE_ROLES.map((role) => (
            <ServiceCard
              key={role.slug}
              service={cardFor(role, copyBySlug.get(role.slug))}
              linked
              footer={`${t.roles.cta} ${t.arrow}`}
              workloadLabel={t.roles.workloadLabel}
              savingLabel={t.roles.savingLabel}
            />
          ))}
        </div>

        {/* Bundles — two or more roles hired together */}
        <div className="mt-14">
          <h3 className="text-xl font-semibold text-ink mb-2">
            {t.roles.bundlesLabel}
          </h3>
          <p className="text-muted mb-6 max-w-xl text-sm">
            {t.roles.bundlesSub}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {BUNDLE_ROLES.map((role) => (
              <ServiceCard
                key={role.slug}
                service={cardFor(role, copyBySlug.get(role.slug))}
                linked
                footer={`${t.roles.cta} ${t.arrow}`}
                workloadLabel={t.roles.workloadLabel}
                savingLabel={t.roles.savingLabel}
              />
            ))}
          </div>
        </div>

        {/* Through to the hub, where the 10% / 90% rule is spelled out */}
        <div className="mt-10">
          <a href="/services" className="btn-secondary-white px-6 py-2.5 text-sm">
            {t.roles.pricingLink} {t.arrow}
          </a>
        </div>

        {/* White-label note */}
        <p className="mt-10 rounded-xl border border-line bg-surface p-6 text-sm text-ink">
          {t.roles.whiteLabel}
        </p>
      </div>
    </section>
  );
}
