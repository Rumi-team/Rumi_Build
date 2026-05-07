import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SectionCTA } from "@/components/section-cta";

export const metadata: Metadata = {
  title: "Pricing — Rumi Build",
  description:
    "Fixed monthly subscription tiers from $499/mo, or a one-time 7-day sprint at $1,200. Money-back guarantee if we under-deliver. We charge per lead, not per campaign.",
};

const TIERS = [
  {
    name: "Starter",
    price: "$499",
    cadence: "/mo",
    leads: "Up to 5 qualified leads/month",
    description: "Best for new merchants getting their first systematic lead flow.",
    recommended: true,
  },
  {
    name: "Growth",
    price: "$799",
    cadence: "/mo",
    leads: "Up to 12 qualified leads/month",
    description: "For established stores ready to scale local demand without scaling staff.",
    recommended: false,
  },
  {
    name: "Scale",
    price: "$999",
    cadence: "/mo",
    leads: "Up to 20 qualified leads/month",
    description: "For operators serving multiple verticals or metros.",
    recommended: false,
  },
];

const SPRINT = {
  name: "7-day Sprint",
  price: "$1,200",
  cadence: "flat, one-time",
  leads: "5 qualified leads in 7 days",
  description: "No commitment. Or split it: $750 setup + $750 after the first 5 qualified leads land.",
};

const QUALIFIED_LEAD_DEFINITION = [
  "Real person, verified phone, in your local service area.",
  "Actively shopping for what you sell — not a tire-kicker, not a survey-filler.",
  "Approximate budget range or service-type captured up front.",
  "Booked an appointment, requested a quote, or asked to visit your store.",
];

const OBJECTIONS = [
  {
    q: "What if the leads don't show up?",
    a: "Money-back guarantee. If we deliver fewer than 60% of promised leads in your first month, you get a pro-rated refund of the unfulfilled portion. Stated upfront on every contract.",
  },
  {
    q: "What if I'm not on Instagram?",
    a: "We set you up. Bilingual landing page, branded posts, and your inventory photos. You don't need an existing social presence to start.",
  },
  {
    q: "Do I need a website?",
    a: "We build the landing page for you as part of every plan. Your domain or ours, your call.",
  },
  {
    q: "I tried Yelp ads and they didn't work. Why is this different?",
    a: "Yelp charges per click and floods your inbox with junk. We charge per qualified lead. You only pay when a real local customer — Persian, English, or Spanish — in your area asks to talk to you.",
  },
  {
    q: "Is ad spend included or extra?",
    a: "Ad spend is included in monthly subscriptions up to the lead-volume cap. For sprint pricing, the $1,200 covers everything.",
  },
];

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="py-20 px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
              Pricing
            </p>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
              Fixed price. <span className="text-amber-400">Per lead, not per campaign.</span>
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed mb-2">
              Pick a monthly subscription or a one-time 7-day sprint. Money-back guarantee on every plan.
            </p>
            <p className="text-sm text-zinc-500">
              No commitment to start. Cancel anytime after month one.
            </p>
          </div>
        </section>

        {/* Qualified lead definition — buyer's first objection answered */}
        <section className="py-10 px-6 border-t border-zinc-800">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-xl font-bold tracking-tight mb-4">
              What counts as a qualified lead
            </h2>
            <ul className="space-y-2">
              {QUALIFIED_LEAD_DEFINITION.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-base text-zinc-300 leading-relaxed"
                >
                  <span className="text-amber-400 mt-1 shrink-0" aria-hidden>
                    ✓
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-zinc-500">
              Spam, duplicates, and unreachable contacts are not counted toward your monthly cap.
            </p>
          </div>
        </section>

        {/* Tier table */}
        <section className="py-16 px-6 border-t border-zinc-800">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8 text-center">
              Monthly subscription
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {TIERS.map((tier) => (
                <div
                  key={tier.name}
                  className={`rounded-xl border p-6 ${
                    tier.recommended
                      ? "border-amber-400 bg-zinc-800/70"
                      : "border-zinc-700 bg-zinc-800/40"
                  }`}
                >
                  {tier.recommended && (
                    <span className="inline-block rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-zinc-900 mb-3">
                      Recommended for new merchants
                    </span>
                  )}
                  <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                  <p className="text-3xl font-bold mb-1">
                    {tier.price}
                    <span className="text-base font-normal text-zinc-400">
                      {tier.cadence}
                    </span>
                  </p>
                  <p className="text-sm text-amber-400 mb-3">{tier.leads}</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {tier.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sprint option */}
        <section className="py-12 px-6">
          <div className="mx-auto max-w-3xl rounded-xl border border-zinc-700 bg-zinc-800/50 p-6">
            <h3 className="text-xl font-semibold mb-1">{SPRINT.name}</h3>
            <p className="text-2xl font-bold mb-1">
              {SPRINT.price}
              <span className="text-sm font-normal text-zinc-400 ml-2">
                ({SPRINT.cadence})
              </span>
            </p>
            <p className="text-sm text-amber-400 mb-3">{SPRINT.leads}</p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {SPRINT.description}
            </p>
          </div>
        </section>

        {/* Refund / SLA */}
        <section className="py-10 px-6 border-t border-zinc-800">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-xl font-bold tracking-tight mb-3">
              Money-back guarantee
            </h2>
            <p className="text-base text-zinc-300 leading-relaxed">
              If we deliver fewer than 60% of promised leads in your first month,
              you get a pro-rated refund of the unfulfilled portion. From month two
              onward, under-delivered leads roll over to the next month, capped at
              one month of rollover.
            </p>
          </div>
        </section>

        {/* Buyer-objection block */}
        <section className="py-16 px-6 border-t border-zinc-800">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">
              Common questions
            </h2>
            <ul className="space-y-6">
              {OBJECTIONS.map((o) => (
                <li key={o.q}>
                  <h3 className="text-lg font-semibold mb-2">{o.q}</h3>
                  <p className="text-base text-zinc-400 leading-relaxed">{o.a}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <SectionCTA
          title="Not sure which tier? Book a free 15-min call."
          description="We'll quote based on your industry, city, and current customer flow. English or Farsi, your call."
        />
      </main>
      <Footer />
    </>
  );
}
