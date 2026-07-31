import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { EnglishMain } from "@/components/english-main";

// `metadata` IS honoured on not-found.tsx (the title below renders into
// .next/server/app/_not-found.html), and so is everything else here — which is
// why the two lines under the title matter.
//
// The root layout's `alternates` is inherited wholesale, exactly like `title`,
// so before this every 404 on the site served
// `<link rel="canonical" href="https://rumi.build">`. Every stale link, every
// typo, every bot probing for /wp-admin got a page that told Google it WAS the
// homepage — while Next simultaneously stamps its own `noindex` on this route.
// A noindex page canonicalising to a different URL is the pairing Google warns
// can bleed the noindex across to the target, and the target here is the
// homepage. `canonical: null` is Next's supported way to suppress an inherited
// alternate (Metadata's `alternates.canonical` is typed `null | string | URL |
// URLDescriptor`); it emits no <link rel="canonical"> at all.
//
// `robots` is declared explicitly rather than left to Next's built-in default:
// the default is `noindex` alone, which still invites crawling every link on
// the page. `follow: false` is right for a 404 — nothing here is a discovery
// path, the three CTAs are recovery affordances for a human.
//
// KNOWN AND ACCEPTED: this makes the response carry TWO robots tags —
// `<meta name="robots" content="noindex">` (Next's own, which it injects for
// this route and which no metadata export removes) followed by
// `<meta name="robots" content="noindex, nofollow">`. Verified in both the
// prerendered _not-found.html and a live 404. Google combines multiple robots
// tags for the same user-agent by taking the most restrictive union, so the
// effective directive is noindex+nofollow — the pair is redundant, not
// contradictory. Dropping ours to avoid the duplicate would silently give the
// `follow` back.
export const metadata: Metadata = {
  title: "Page not found — Rumi AI",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

// Before the AI-Employee pages existed, /services/<anything> redirected to the
// Industries hub, so nothing under /services could 404. Now that the segment
// resolves a fixed set of five role slugs, an unknown slug calls notFound() —
// which would otherwise render Next's bare, unbranded default page.
export default function NotFound() {
  return (
    <>
      <Nav />
      {/* English-only recovery copy, pinned to LTR/en — see
          src/components/english-main.tsx for why. */}
      <EnglishMain className="pt-16">
        <section className="bg-white py-24 px-6 md:px-12">
          <div className="mx-auto max-w-2xl">
            <p className="eyebrow mb-3">404</p>
            <h1 className="text-4xl md:text-5xl font-black tracking-h1 text-ink leading-[1.1] mb-4">
              We couldn&apos;t find that page
            </h1>
            <p className="text-lg text-muted mb-8">
              The link may be out of date. Here is where everything lives now.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="/services" className="btn-primary px-6 py-3 text-base">
                AI Employees &rarr;
              </a>
              <a href="/" className="btn-secondary-white px-6 py-3 text-base">
                Home
              </a>
              <a href="/book" className="btn-secondary-white px-6 py-3 text-base">
                Book a Call
              </a>
            </div>
            {/* /industries is a real hub and a plausible landing spot for a
                stale link, but it is not a fourth destination worth a button —
                a plain text link keeps the three CTAs above as the hierarchy. */}
            <p className="mt-6 text-sm text-muted">
              Looking for your line of work?{" "}
              <a href="/industries" className="text-accent-hover font-medium hover:underline">
                Industries we work in &rarr;
              </a>
            </p>
          </div>
        </section>
      </EnglishMain>
      <Footer />
    </>
  );
}
