import type { MetadataRoute } from "next";
import { AI_EMPLOYEES, VERTICALS } from "@/lib/data";

// Metadata routes are pinned force-static so they resolve at build time rather
// than being treated as dynamic. (next.config.ts no longer sets
// output: "export" — that was dropped for the Stripe/API routes — but a static
// sitemap is still what we want.)
export const dynamic = "force-static";

// Must stay the host in layout.tsx's metadataBase: a sitemap that advertises a
// different alias of this deployment than the canonical each page emits is
// asking Google to index one copy and rank another.
// tests/unit/self-reference.test.ts fails if the two drift apart.
const BASE = "https://www.rumiai.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Static top-level routes. /services is the AI Employees hub and now ranks
  // just under the homepage — it carries the offer and the pricing.
  // Retired routes (/chief-of-staff, /audit, /evaluate) are redirects and stay
  // out; /workplace is deliberately unindexed.
  //
  // /schedule is also out: it renders the same Cal.com embed as /book with a
  // near-identical title, and listing both made the sitemap advertise two
  // competing booking pages for the same query while /book took every internal
  // link. Nothing on the site links to it any more — the two hrefs that did
  // (the retired COPY block in src/lib/data.ts and the secondary CTA in
  // src/components/services-preview.tsx) were both deleted with the dead code.
  // The route still resolves, because the URL may have been handed out by email
  // or DM; it just isn't linked and isn't submitted for indexing. Omission
  // alone does not deindex it, which is why the page declares robots.index =
  // false (pinned in tests/unit/routing.test.ts).
  const staticRoutes = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/services", priority: 0.95, changeFrequency: "weekly" as const },
    { path: "/book", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/industries", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/team", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/faq", priority: 0.7, changeFrequency: "monthly" as const },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // One /services/<slug> entry per AI employee, derived from the same array the
  // pages and generateStaticParams read — so the sitemap cannot drift from the
  // routes that actually exist.
  const roleEntries: MetadataRoute.Sitemap = AI_EMPLOYEES.map((role) => ({
    url: `${BASE}/services/${role.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  // Dynamic /industries/[slug] routes from VERTICALS (local retail focus).
  const industryEntries: MetadataRoute.Sitemap = VERTICALS.map((v) => ({
    url: `${BASE}/industries/${v.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...roleEntries, ...industryEntries];
}
