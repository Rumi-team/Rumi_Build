import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { EnglishMain } from "@/components/english-main";
import { PageHeader } from "@/components/page-header";
import { SectionCTA } from "@/components/section-cta";
import { TEAM } from "@/lib/data";

const TITLE = "Team — Rumi AI";
const DESCRIPTION =
  "Meet the team behind rumi.build. Product and AI builders who've shipped at Business Insider, Spotter, UCLA, and Imperial College — now building websites, apps, and AI-era visibility for small businesses everywhere.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  // The root layout's canonical is "/" and is inherited wholesale, so a page
  // without its own declares itself the homepage. Relative, so it resolves
  // through metadataBase and follows the canonical host.
  alternates: { canonical: "/team" },
  // `openGraph` is inherited wholesale for the same reason, so without this the
  // page shipped its own canonical beside the homepage's og:url and og:title.
  // Restating it replaces the layout's object, so images/type/siteName have to
  // be restated too or the social preview image is lost.
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/team",
    siteName: "Rumi AI",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const PRODUCTS = [
  {
    name: "Rumi",
    href: "https://www.rumi.team",
    tagline:
      "Our consumer AI product — web and iOS. Where we prove the tech on ourselves before it touches a client.",
  },
  {
    name: "Rumi Agent",
    href: "https://www.rumiagent.com",
    tagline:
      "Our B2B retention platform. The customer engine we built for ourselves now runs the marketing for our clients' small businesses.",
  },
];

export default function TeamPage() {
  return (
    <>
      <Nav />
      <EnglishMain className="pt-16">
        {/* Hero */}
        <section className="py-20 px-6">
          <div className="mx-auto max-w-4xl">
            <PageHeader
              overline="Founded and based in Los Angeles"
              title="The team behind Rumi AI"
              description="A small, senior team that talks to you directly and does the work. We've built products for 100M+ users and now put that behind local businesses — websites, apps, social, and visibility in the AI era. All three co-founders speak Farsi."
            />
          </div>
        </section>

        {/* Individual profiles — each member gets a full, personal section */}
        <section className="pb-8 px-6">
          <div className="mx-auto max-w-4xl space-y-6">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="flex flex-col sm:flex-row gap-6 card rounded-xl p-6 sm:p-8"
              >
                <div className="flex flex-col items-center sm:items-start shrink-0 sm:w-44 text-center sm:text-left">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="h-24 w-24 rounded-full object-cover border-2 border-line"
                  />
                  <p className="text-base font-semibold text-ink mt-3">{member.name}</p>
                  {/* accent-hover, not accent: white on #059669 fails WCAG AA
                      at 12px. Buttons keep white-on-accent; micro-text does not. */}
                  <span className="inline-block mt-1.5 rounded-full bg-accent-hover px-3 py-0.5 text-xs font-semibold text-white">
                    {member.role}
                  </span>
                </div>

                <div className="flex-1">
                  <p className="text-base text-ink leading-relaxed mb-4">
                    {member.bio}
                  </p>
                  <ul className="space-y-2">
                    {member.experience.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-muted leading-relaxed"
                      >
                        <span className="text-accent mt-0.5 shrink-0">&#8226;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What we build — link the two products instead of project write-ups */}
        <section className="py-16 px-6">
          <div className="mx-auto max-w-4xl">
            <p className="eyebrow mb-3">
              What we build
            </p>
            <h2 className="text-2xl font-bold tracking-h2 text-ink mb-3">
              We ship our own AI products
            </h2>
            <p className="text-muted mb-8 max-w-xl">
              We don&apos;t just consult. We build and operate AI products
              ourselves — and the same engines run the work we do for clients.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {PRODUCTS.map((p) => (
                <a
                  key={p.href}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col card rounded-xl p-6 transition hover:border-accent/40"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-ink group-hover:text-accent transition">
                      {p.name}
                    </h3>
                    <span className="text-accent/70 transition group-hover:translate-x-0.5">
                      &rarr;
                    </span>
                  </div>
                  <p className="text-sm text-muted leading-relaxed mb-3">
                    {p.tagline}
                  </p>
                  <span className="mt-auto text-xs text-muted">
                    {p.href.replace("https://www.", "")}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <SectionCTA />
      </EnglishMain>
      <Footer />
    </>
  );
}
