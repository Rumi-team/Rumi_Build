import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Switched from `output: "export"` to default (server) mode to support
  // Stripe Checkout API routes + webhook (/api/checkout, /api/stripe/webhook)
  // and the dynamic /book/success verification page.
  images: { unoptimized: true },
};

export default nextConfig;
