import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Switched from `output: "export"` to default (server) mode to support
  // Stripe Checkout API routes + webhook (/api/checkout, /api/stripe/webhook)
  // and the dynamic /book/success verification page.
  images: { unoptimized: true },

  // The client lead console lives at /agent, served by a SEPARATE Vercel
  // project (rumi-ai/lead-console, built from rumi-inc/Assitant_Rumi_Hermes
  // under lead-console/ with NEXT_PUBLIC_BASE_PATH=/agent). This site only
  // proxies the path to it — no console code, env or data lives here. The
  // destination is the console project's stable production alias, so console
  // deploys never require touching this site; both path shapes are needed
  // because ":path*" alone does not match the bare "/agent".
  async rewrites() {
    return [
      { source: "/agent", destination: "https://lead-console-rumi-ai.vercel.app/agent" },
      {
        source: "/agent/:path*",
        destination: "https://lead-console-rumi-ai.vercel.app/agent/:path*",
      },
    ];
  },
};

export default nextConfig;
