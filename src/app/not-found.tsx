import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Page not found — Rumi AI",
};

// Before the AI-Employee pages existed, /services/<anything> redirected to the
// Industries hub, so nothing under /services could 404. Now that the segment
// resolves a fixed set of five role slugs, an unknown slug calls notFound() —
// which would otherwise render Next's bare, unbranded default page.
export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="pt-16">
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
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
