import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CalEmbed } from "@/components/cal-embed";
import { CAL_LINK } from "@/lib/data";

export const metadata: Metadata = {
  title: "Book a free 15-min call | Rumi Build",
  description:
    "Free 15-minute call. English or Farsi. Built for Iranian-diaspora retail businesses in North America.",
};

export default function SchedulePage() {
  return (
    <>
      <Nav />
      <div className="min-h-screen bg-zinc-900 text-zinc-200 pt-16">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
          <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
            Schedule
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Free 15-min call. English or Farsi.
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 mb-2">
            Built for Iranian-diaspora retail businesses in North America. We
            map your store, your current lead flow, and quote a tier or a sprint
            on the call. No commitment.
          </p>
          <p
            lang="fa"
            dir="rtl"
            className="font-vazirmatn text-base text-zinc-500 mb-6 sm:mb-8"
          >
            تماس رایگان ۱۵ دقیقه‌ای — به فارسی یا انگلیسی.
          </p>

          <CalEmbed calLink={CAL_LINK} />

          <p className="mt-4 text-xs text-zinc-500">
            Trouble with the calendar?{" "}
            <a
              href="https://cal.com/rumi.build/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-zinc-300"
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
