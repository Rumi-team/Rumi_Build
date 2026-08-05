import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { EnglishMain } from "@/components/english-main";
import { PageHeader } from "@/components/page-header";
import { VerticalCard } from "@/components/vertical-card";
import { SectionCTA } from "@/components/section-cta";
import { VERTICALS } from "@/lib/data";

const TITLE = "Industries — Rumi AI";
const DESCRIPTION =
  "We work with local, trust-based businesses: real estate, home design and décor, beauty and salon, and home services. Don't see yours? Ask, and we'll give you an honest answer on whether we're a fit.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  // The root layout's canonical is "/" and is inherited wholesale, so a page
  // without its own declares itself the homepage. Relative, so it resolves
  // through metadataBase and follows the canonical host.
  alternates: { canonical: "/industries" },
  // `openGraph` is inherited wholesale for the same reason, so without this the
  // page shipped its own canonical beside the homepage's og:url and og:title.
  // Restating it replaces the layout's object, so images/type/siteName have to
  // be restated too or the social preview image is lost.
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/industries",
    siteName: "Rumi AI",
    type: "website",
    images: [{ url: "/og-image.png?v=2", width: 1200, height: 630 }],
  },
};

export default function IndustriesPage() {
  return (
    <>
      <Nav />
      <EnglishMain className="pt-16">
        <section className="py-20 px-6">
          <div className="mx-auto max-w-5xl">
            <PageHeader
              overline="Industries"
              title="Built for local, trust-based businesses"
              description="Businesses where customers hire on referrals and reputation, not just search ranking. Here's where we have real, proven experience today — and the list grows as our track record does."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {VERTICALS.map((vertical) => (
                <VerticalCard key={vertical.slug} vertical={vertical} />
              ))}

              {/* Catch-all — required (guide §4): keeps the page from implying a
                  hard limit on who Rumi works with. */}
              <a
                href="/book"
                className="flex flex-col justify-center rounded-xl border border-dashed border-line p-6 transition hover:border-accent"
              >
                <h3 className="text-base font-semibold text-ink mb-1">
                  Don&apos;t see your business?
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  Tell us what you do, we&apos;ll give you an honest answer on
                  whether we&apos;re a fit.
                </p>
              </a>
            </div>
          </div>
        </section>
        <SectionCTA href="/book" />
      </EnglishMain>
      <Footer />
    </>
  );
}
