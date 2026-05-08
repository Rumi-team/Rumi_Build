import type { MetadataRoute } from "next";
import { VERTICALS } from "@/lib/data";

// rumi.build uses `output: "export"` (static HTML export). Metadata routes
// like sitemap.ts need to be force-static, otherwise Next.js treats them as
// dynamic at build time and the export step errors out.
export const dynamic = "force-static";

const BASE = "https://rumi.build";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Static top-level routes (post-pivot: only the new core routes are indexed).
  // Legacy routes (/services, /chief-of-staff, /workplace, /audit) still exist
  // as files but are no longer linked from nav and are dropped from the sitemap.
  const staticRoutes = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/pricing", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/team", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/schedule", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/industries", priority: 0.7, changeFrequency: "monthly" as const },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Dynamic /industries/[slug] routes from VERTICALS (local retail focus).
  const industryEntries: MetadataRoute.Sitemap = VERTICALS.map((v) => ({
    url: `${BASE}/industries/${v.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...industryEntries];
}
