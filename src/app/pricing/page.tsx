import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SectionCTA } from "@/components/section-cta";
import { LeadPriceCalculator } from "@/components/lead-price-calculator";

export const metadata: Metadata = {
  title: "Pricing — Rumi Build",
  description:
    "Pricing matched to what a new customer is worth to you. Launch tiers from $199/mo. Money-back guarantee. We charge per lead, not per campaign.",
};

// Launch pricing — change this string once to extend the offer everywhere.
const LAUNCH_PRICING_ENDS = "August 31, 2026";

// Derive savings from the strikethrough "$X" + discounted "$Y" strings.
// Returns null when there's no discount (e.g. High-Ticket has no originalPrice).
function savings(
  original: string | null,
  current: string,
): { dollars: number; pct: number } | null {
  if (!original) return null;
  const orig = Number(original.replace(/[^\d]/g, ""));
  const cur = Number(current.replace(/[^\d]/g, ""));
  if (!orig || !cur || cur >= orig) return null;
  return { dollars: orig - cur, pct: Math.round(((orig - cur) / orig) * 100) };
}

type Tier = {
  slug: string;
  name: string;
  originalPrice: string | null;
  price: string;
  cadence: string;
  leads: string;
  extraLead: string;
  description: string;
  valueBand: string;
  recommended: boolean;
  customPricing: boolean;
  ctaHref: string;
  ctaLabel: string;
};

const TIERS: Tier[] = [
  {
    slug: "tier-local",
    name: "Local",
    originalPrice: "$499",
    price: "$199",
    cadence: "/mo",
    leads: "Up to 5 qualified leads/month",
    extraLead: "+$50 per extra lead",
    description:
      "For salons, casual restaurants, small retail. Self-serve monthly plan, cancel anytime.",
    valueBand: "Avg customer under $150",
    recommended: false,
    customPricing: false,
    ctaHref: "/schedule",
    ctaLabel: "Book a free call",
  },
  {
    slug: "tier-growth",
    name: "Growth",
    originalPrice: "$799",
    price: "$299",
    cadence: "/mo",
    leads: "Up to 10 qualified leads/month",
    extraLead: "+$50 per extra lead",
    description:
      "For beauty clinics, specialty retail, repair services. Self-serve monthly plan, cancel anytime.",
    valueBand: "Avg customer $150–$750",
    recommended: false,
    customPricing: false,
    ctaHref: "/schedule",
    ctaLabel: "Book a free call",
  },
  {
    slug: "tier-premium",
    name: "Premium",
    originalPrice: "$999",
    price: "$499",
    cadence: "/mo",
    leads: "Up to 20 qualified leads/month",
    extraLead: "+$50 per extra lead",
    description:
      "For custom curtains, rugs, med spas, mid-ticket home services. Self-serve monthly plan.",
    valueBand: "Avg customer $750–$5,000",
    recommended: true,
    customPricing: false,
    ctaHref: "/schedule",
    ctaLabel: "Book a free call",
  },
  {
    slug: "tier-high-ticket",
    name: "High-Ticket",
    originalPrice: null,
    price: "From $1,500",
    cadence: "/mo",
    leads: "Custom lead volume",
    extraLead: "+ 5–15% success fee on closed deals",
    description:
      "For real estate, jewelry, luxury home services. Visible floor, success-fee structure, attribution included.",
    valueBand: "Avg customer $5,000+",
    recommended: false,
    customPricing: true,
    ctaHref: "/schedule",
    ctaLabel: "Talk to us",
  },
];

const QUALIFIED_LEAD_DEFINITION = [
  "Real person, verified phone, in your local service area.",
  "Actively shopping for what you sell — not a tire-kicker, not a survey-filler.",
  "Approximate budget range or service-type captured up front.",
  "Booked an appointment, requested a quote, or asked to visit your store.",
];

const OBJECTIONS = [
  {
    q: "Why do you need to know my average sale size?",
    a: "Your pricing is based on what a new customer is worth to your business, not on a one-size-fits-all package. A jeweler closing $4,000 sales rationally pays more per lead than a salon booking $80 appointments — and we don't price either out of the market.",
  },
  {
    q: "Are you charging me more just because my customers are worth more?",
    a: "We're charging proportional to the gross profit each lead generates for you. A high-ticket lead delivers ten to fifty times the profit of a low-ticket lead; our cut scales with that. You still keep the majority of the upside. The calculator above shows the math before you book.",
  },
  {
    q: "Do I pay for bad-fit leads?",
    a: "No. A lead only counts toward your monthly cap when it's a real person, in your service area, with budget/intent captured, who booked or requested a quote. Spam, duplicates, unreachable contacts, and out-of-area inquiries are not billed.",
  },
  {
    q: "Is this ad spend, software, or an agency fee?",
    a: "All of the above, bundled. Ad spend, multilingual landing page, multilingual phone agent, lead-routing tech, and a weekly check-in are included in your monthly plan up to your lead cap. No surprise line items. High-Ticket plans add a success fee on closed deals (paid only when you close).",
  },
  {
    q: "What if the leads don't show up?",
    a: "Money-back guarantee. If we deliver fewer than 60% of promised leads in your first month, you get a pro-rated refund. Under-delivered leads from later months roll over, capped at one month of rollover.",
  },
  {
    q: "I tried Yelp ads and they didn't work. Why is this different?",
    a: "Yelp charges per click and floods your inbox with junk. We charge per qualified lead in the languages your customers speak — Spanish, Mandarin, Tagalog, Vietnamese, Arabic, Korean, Russian, Haitian Creole, Persian, and 60+ more. You only pay when a real local customer in your area asks to talk to you.",
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
              Priced to{" "}
              <span className="text-amber-400">what a new customer is worth.</span>
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed mb-2">
              Self-serve monthly plans for Local, Growth, and Premium. Visible
              minimum + success fee for High-Ticket. Money-back guarantee on every
              plan.
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
              Spam, duplicates, unreachable contacts, and out-of-area inquiries
              are not counted toward your monthly cap.
            </p>
          </div>
        </section>

        {/* Calculator — answers "what do I pay" before showing tier cards */}
        <LeadPriceCalculator />

        {/* Tier table */}
        <section className="py-16 px-6 border-t border-zinc-800">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 text-center">
              Monthly plans
            </h2>

            {/* Launch pricing banner */}
            <div className="mx-auto mb-8 max-w-xl rounded-lg border border-amber-400/40 bg-amber-400/5 px-5 py-3 text-center">
              <p className="text-sm">
                <span className="font-semibold text-amber-400">
                  Limited-time launch pricing
                </span>
                <span className="text-zinc-300">
                  {" "}— Local, Growth, and Premium through {LAUNCH_PRICING_ENDS}. Up to 62% off.
                </span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {TIERS.map((tier) => (
                <div
                  key={tier.slug}
                  id={tier.slug}
                  className={`rounded-xl border p-6 scroll-mt-24 ${
                    tier.recommended
                      ? "border-amber-400 bg-zinc-800/70"
                      : tier.customPricing
                      ? "border-amber-400/40 bg-zinc-800/40"
                      : "border-zinc-700 bg-zinc-800/40"
                  }`}
                >
                  {tier.recommended && (
                    <span className="inline-block rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-zinc-900 mb-3">
                      Most popular
                    </span>
                  )}
                  {tier.customPricing && (
                    <span className="inline-block rounded-full border border-amber-400/40 px-3 py-1 text-xs font-medium text-amber-300 mb-3">
                      Tailored to your business
                    </span>
                  )}

                  <h3 className="text-xl font-semibold mb-1">{tier.name}</h3>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">
                    {tier.valueBand}
                  </p>

                  {/* Price block — strikethrough only when there's a launch discount */}
                  {tier.originalPrice && (
                    <p className="text-sm text-amber-500/60 line-through decoration-amber-500/60 mb-0.5">
                      <span className="sr-only">Was </span>
                      {tier.originalPrice}
                      {tier.cadence}
                    </p>
                  )}
                  <p className="text-3xl font-bold mb-1">
                    <span className="text-amber-400">{tier.price}</span>
                    <span className="text-base font-normal text-zinc-400">
                      {tier.cadence}
                    </span>
                  </p>

                  {/* Savings tag — explicit discount value */}
                  {(() => {
                    const s = savings(tier.originalPrice, tier.price);
                    return s ? (
                      <p className="mb-2">
                        <span className="inline-block rounded-md bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 text-xs font-semibold text-amber-200">
                          Save ${s.dollars}/mo · {s.pct}% off
                        </span>
                      </p>
                    ) : null;
                  })()}

                  <p className="text-sm text-amber-400 mb-1">{tier.leads}</p>
                  <p className="text-xs text-zinc-500 mb-4">{tier.extraLead}</p>

                  <p className="text-sm text-zinc-400 leading-relaxed mb-5">
                    {tier.description}
                  </p>

                  <a
                    href={tier.ctaHref}
                    className={`block w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-center transition ${
                      tier.recommended
                        ? "bg-amber-400 text-zinc-900 hover:bg-amber-300"
                        : "border border-zinc-700 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800/50"
                    }`}
                  >
                    {tier.ctaLabel}
                  </a>
                </div>
              ))}
            </div>
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
