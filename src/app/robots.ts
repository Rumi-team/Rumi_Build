import type { MetadataRoute } from "next";

// rumi.build uses `output: "export"` (static HTML export). Metadata routes
// like robots.ts need to be explicitly force-static, otherwise Next.js treats
// them as dynamic at build time and the export step errors out.
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
