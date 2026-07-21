import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CalEmbed } from "@/components/cal-embed";
import { CAL_LINK, CALENDLY_URL } from "@/lib/data";

export const metadata: Metadata = {
  title: "Book a call | Rumi AI",
  description:
    "Book a 30-minute call. English or Farsi. We map your business, walk through pricing, and quote on the call.",
};

export default function SchedulePage() {
  return (
    <>
      <Nav />
      <div className="min-h-screen bg-white text-ink pt-16">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
          <p className="eyebrow mb-3">
            Schedule
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-h1 text-ink mb-3">
            Book a 30-min call. English or Farsi.
          </h1>
          <p className="text-base sm:text-lg text-muted mb-2">
            We map your business, your current lead flow, and quote a tier on
            the call. Multilingual marketing in every language your customers
            speak. No commitment.
          </p>
          <p
            lang="fa"
            dir="rtl"
            className="font-vazirmatn text-base text-muted mb-6 sm:mb-8"
          >
            تماس ۳۰ دقیقه‌ای — به فارسی یا انگلیسی.
          </p>

          <CalEmbed calLink={CAL_LINK} />

          <p className="mt-4 text-xs text-muted">
            Trouble with the calendar?{" "}
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-accent hover:text-accent-hover"
            >
              Open it in a new tab
            </a>
            .
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
