import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { EnglishMain } from "@/components/english-main";
import { PageHeader } from "@/components/page-header";
import { SectionCTA } from "@/components/section-cta";
import { ServiceCard } from "@/components/service-card";
import { PolicyNotes } from "@/components/policy-notes";
import { CORE_ROLES, BUNDLE_ROLES, SAVING_LABEL } from "@/lib/data";

const TITLE = "AI Employees — hire from $300/mo — Rumi AI";
const DESCRIPTION =
  "Five AI employees you can hire: Receptionist from $300/mo, Executive Assistant from $500/mo, Social Media Manager from $400/mo, Office Manager from $800/mo, Chief of Staff from $900/mo. Roughly a tenth of what that work costs today. Live in 1-3 weeks, trained on your business, managed by our team.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  // Without this the root layout's canonical ("/") is inherited and this page
  // tells Google it is the homepage. Relative, so it resolves through
  // metadataBase and follows the canonical host.
  alternates: { canonical: "/services" },
  // Restated because the root layout's openGraph is inherited wholesale and
  // pins og:url to the homepage — without this, sharing /services attributes
  // to "/". Relative `url` resolves against metadataBase, so it follows the
  // canonical host rather than hardcoding one here.
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/services",
    siteName: "Rumi AI",
    type: "website",
    images: [{ url: "/og-image.png?v=2", width: 1200, height: 630 }],
  },
};

// LOCALE SCOPE — KNOWN GAP, DELIBERATE FOR NOW.
// This page and the five /services/<slug> pages are server components with
// English copy. Translation on this site is client-side (LanguageProvider +
// useT, localStorage-backed), so a visitor who has switched the homepage to
// Farsi lands here in English. That is the same treatment /industries, /team
// and /faq already get, but it matters more here because this page carries the
// offer and the pricing, and because the FA nav's first item and the FA
// homepage's pricing CTA both point at it.
//
// It is accepted rather than fixed because the alternative — rendering the
// offer and the pricing through a client component — gives up static
// server-rendered HTML on the pages that most need to be crawled and cited.
// The FA destination is still correct: there is nowhere better to send a
// Persian visitor who wants all five roles and the prices. Translating these
// pages properly means locale-routed pages (/fa/services), not a client
// dictionary. Do not "fix" this by wrapping the page in useT.

export default function ServicesPage() {
  return (
    <>
      <Nav />
      {/* English-only (see the LOCALE SCOPE note above), pinned to LTR/en —
          see src/components/english-main.tsx for why. */}
      <EnglishMain className="pt-16">
        {/* The five roles */}
        <section className="bg-white py-20 px-6 md:px-12">
          <div className="mx-auto max-w-5xl">
            <PageHeader
              overline="AI Employees"
              title="Hire an AI employee for the work that repeats"
              description="Five roles, each recruited for one job and trained on your business. They pick up the calls, the inbox, and the posting that eat a week — so the people you already have stay on the work that needs a person. Every role starts at roughly a tenth of what that work costs today."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {CORE_ROLES.map((role) => (
                <ServiceCard
                  key={role.slug}
                  service={{
                    icon: role.icon,
                    name: role.name,
                    tagline: role.tagline,
                    workload: role.workload,
                    price: `from ${role.priceFrom}`,
                    slug: role.slug,
                  }}
                  linked
                  footer="See the role →"
                  savingLabel={SAVING_LABEL}
                />
              ))}
            </div>

            <div className="mt-14">
              <h2 className="text-xl font-semibold text-ink mb-2">
                Or hire more than one
              </h2>
              <p className="text-muted mb-6 max-w-xl text-sm">
                Two bundles, for owners who would rather hire one thing than
                several. The roles inside a bundle share one calendar, one
                customer record, and one approval queue.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {BUNDLE_ROLES.map((role) => (
                  <ServiceCard
                    key={role.slug}
                    service={{
                      icon: role.icon,
                      name: role.name,
                      tagline: role.tagline,
                      workload: role.workload,
                      price: `from ${role.priceFrom}`,
                      slug: role.slug,
                    }}
                    linked
                    footer="See the role →"
                    savingLabel={SAVING_LABEL}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How the pricing works, and what happens after you hire */}
        <section
          aria-labelledby="pricing-heading"
          className="bg-surface py-20 px-6 md:px-12"
        >
          <div className="mx-auto max-w-5xl">
            <p className="eyebrow mb-3">Pricing</p>
            <h2
              id="pricing-heading"
              className="text-3xl font-bold tracking-h2 text-ink mb-3"
            >
              About a tenth of what that work costs today
            </h2>
            <p className="text-muted mb-10 max-w-2xl text-lg">
              Same work handled, about 90% less spent handling it. That is the
              whole idea, and it is why every number on this page is a starting
              point rather than a fixed tag.
            </p>

            {/* Pricing-first here: this section is the pricing explainer. The
                role pages show the same three onboarding-first. */}
            <PolicyNotes
              cardBg="bg-white"
              notes={[
                { note: "pricing", heading: "What you pay" },
                { note: "onboarding", heading: "Getting them working" },
                { note: "whiteLabel", heading: "Under your own brand" },
              ]}
            />
          </div>
        </section>

        {/* Where the rest of the offer lives */}
        <section className="bg-white py-20 px-6 md:px-12">
          <div className="mx-auto max-w-5xl">
            <p className="eyebrow mb-3">Beyond the roles</p>
            <h2 className="text-3xl font-bold tracking-h2 text-ink mb-3">
              We also build the rest of it
            </h2>
            <p className="text-muted mb-8 max-w-2xl text-lg">
              A website, a mobile app, a content plan, and the work of being
              found — by Google and by ChatGPT, Claude, and Perplexity. Available
              on their own or alongside any role.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="/#extras" className="btn-secondary-white px-6 py-2.5 text-sm">
                See the extra services &rarr;
              </a>
              <a href="/industries" className="btn-secondary-white px-6 py-2.5 text-sm">
                Industries we work in &rarr;
              </a>
            </div>
          </div>
        </section>

        <SectionCTA
          title="Which role would take the most off your plate?"
          description="Book a call. We will look at your call volume, your inbox, and what your week actually goes on, then tell you plainly which role earns its cost first — and which ones you do not need yet."
          cta="Book a Call"
          sub="A real conversation, not a sales pitch. In English or Farsi."
          href="/book"
        />
      </EnglishMain>
      <Footer />
    </>
  );
}
