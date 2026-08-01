import type { MetadataRoute } from "next";

// Metadata routes are pinned force-static so they resolve at build time rather
// than being treated as dynamic. (next.config.ts no longer sets
// output: "export" — that was dropped for the Stripe/API routes — but a static
// robots.txt is still what we want. Same rationale as src/app/sitemap.ts.)
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/llms.txt", "/llms-full.txt"],
    },
    sitemap: "https://rumi.build/sitemap.xml",
  };
}
