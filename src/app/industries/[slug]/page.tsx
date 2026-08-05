import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { EnglishMain } from "@/components/english-main";
import { PageHeader } from "@/components/page-header";
import { SectionCTA } from "@/components/section-cta";
import { VERTICALS, getVerticalBySlug } from "@/lib/data";
// Server-only: the body copy for these five pages. Deliberately NOT re-exported
// through @/lib/data — the footer is a client component that imports VERTICALS,
// so anything data.ts touches ships to every page in the browser.
import { VERTICAL_DETAILS } from "@/lib/vertical-details";

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
  const detail = VERTICAL_DETAILS[vertical.slug];
  const title = `AI for ${vertical.name} — Rumi AI`;
  const description = vertical.tagline + ". " + detail.description;
  return {
    title,
    description,
    // Without this every industry page inherits the root layout's canonical
    // ("/") and declares itself the homepage. Relative, so it resolves through
    // metadataBase and follows the canonical host rather than pinning one.
    alternates: { canonical: `/industries/${vertical.slug}` },
    // `openGraph` is inherited wholesale as well, and pins og:url to the
    // homepage — so without this every industry share attributed to "/" while
    // the canonical beside it said otherwise. Restating openGraph replaces the
    // layout's object rather than merging, so images/type/siteName have to be
    // restated too or the social preview image is lost. `url` is relative for
    // the same reason the canonical is.
    openGraph: {
      title,
      description,
      url: `/industries/${vertical.slug}`,
      siteName: "Rumi AI",
      type: "website",
      images: [{ url: "/og-image.png?v=2", width: 1200, height: 630 }],
    },
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
  const detail = VERTICAL_DETAILS[vertical.slug];

  return (
    <>
      <Nav />
      <EnglishMain className="pt-16">
        <section className="py-20 px-6">
          <div className="mx-auto max-w-3xl">
            <PageHeader
              overline={vertical.stat}
              title={`AI for ${vertical.name}`}
              description={vertical.tagline}
            />

            <p className="text-base text-muted leading-relaxed mb-10">
              {detail.description}
            </p>

            {/* Pain points */}
            <h2 className="text-xl font-semibold text-ink mb-4">
              The problems we solve
            </h2>
            <ul className="space-y-3 mb-10">
              {detail.painPoints.map((point) => (
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
              {detail.solutions.map((solution) => (
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
              <p className="text-sm text-ink">{detail.roiData}</p>
            </div>

            {/* A "Services for <industry>" block used to sit here, driven by
                `Vertical.relatedServices`. It never rendered — all five
                verticals carried `relatedServices: []` since the productized
                SERVICES offer was retired — and it could not have rendered
                correctly if filled: the only entry left in SERVICES was
                `persian-leads`, so the block would have emitted
                /services/persian-leads, which vercel.json 308s away on Vercel
                and which /services/[slug] hard-404s locally (dynamicParams is
                false and the slug is not one of the five roles). Deleted with
                the field and with SERVICES itself. The rest of the offer is
                reached through SectionCTA below and the nav. */}
          </div>
        </section>
        <SectionCTA />
      </EnglishMain>
      <Footer />
    </>
  );
}
