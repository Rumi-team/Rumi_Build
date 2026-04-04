import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Pricing } from "@/components/pricing";
import { SectionCTA } from "@/components/section-cta";

export const metadata: Metadata = {
  title: "Pricing — Rumi Build",
  description:
    "Transparent AI automation pricing. From $500 sprint to full integration. Every engagement starts with a free 30-minute discovery call.",
};

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <Pricing />
        <SectionCTA
          title="Not sure which plan fits?"
          description="Book a free 30-minute call. We'll scope your project and recommend the right tier."
        />
      </main>
      <Footer />
    </>
  );
}
