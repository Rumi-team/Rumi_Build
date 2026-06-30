import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { EvaluateContent } from "./evaluate-content";

export const metadata: Metadata = {
  title: "Free evaluation | Rumi Build",
  description:
    "Tell us about your business and your current website. We'll show you where local customers are slipping past you — and what we'd build to catch them. Free, no commitment, in your own language.",
};

export default function EvaluatePage() {
  return (
    <>
      <Nav />
      <EvaluateContent />
      <Footer />
    </>
  );
}
