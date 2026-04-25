import type { MetadataRoute } from "next";
import { SERVICES, VERTICALS } from "@/lib/data";

// rumi.build uses `output: "export"` (static HTML export). Metadata routes
// like sitemap.ts need to be force-static, otherwise Next.js treats them as
// dynamic at build time and the export step errors out.
export const dynamic = "force-static";

const BASE = "https://rumi.build";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Static top-level routes.
  const staticRoutes = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/services", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/industries", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/pricing", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/team", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/audit", priority: 0.6, changeFrequency: "monthly" as const },
    // Featured: Chief of Staff has its own rich landing page.
    { path: "/chief-of-staff", priority: 0.95, changeFrequency: "weekly" as const },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Dynamic /services/[slug] routes from SERVICES. Skip chief-of-staff —
  // the rich landing page at /chief-of-staff is the canonical URL, and
  // /services/chief-of-staff redirects to it via vercel.json.
  const serviceEntries: MetadataRoute.Sitemap = SERVICES.filter(
    (s) => s.slug !== "chief-of-staff"
  ).map((s) => ({
    url: `${BASE}/services/${s.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  // Dynamic /industries/[slug] routes from VERTICALS.
  const industryEntries: MetadataRoute.Sitemap = VERTICALS.map((v) => ({
    url: `${BASE}/industries/${v.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...serviceEntries, ...industryEntries];
}
