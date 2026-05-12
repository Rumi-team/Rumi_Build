"use client";

import { useState } from "react";

type Band = { id: string; label: string; value: number; ltvMultiplier: number };

// ltvMultiplier captures the true value of one new customer beyond the first sale:
// - low-ticket (salons, casual restaurants): customers come back 4–8x/year + refer ~1.5 friends + leave reviews → 6x
// - mid-ticket (beauty clinics, specialty retail): 2–3 repeat visits + referrals → 4x
// - premium (custom curtains, rugs, med spas): rare repeat but high $ + strong referrals in tight communities → 2.5x
// - high-ticket (real estate, jewelry): mostly one-time but each customer's network is high-value → 2x
const VALUE_BANDS: Band[] = [
  { id: "low", label: "Under $150", value: 100, ltvMultiplier: 6 },
  { id: "mid", label: "$150–$750", value: 400, ltvMultiplier: 4 },
  { id: "high", label: "$750–$5,000", value: 2000, ltvMultiplier: 2.5 },
  { id: "diamond", label: "$5,000+", value: 10000, ltvMultiplier: 2 },
];

const MARGIN_BANDS: Band[] = [
  { id: "thin", label: "Under 25%", value: 0.2, ltvMultiplier: 1 },
  { id: "med", label: "25–50%", value: 0.35, ltvMultiplier: 1 },
  { id: "good", label: "50–75%", value: 0.6, ltvMultiplier: 1 },
  { id: "fat", label: "75%+", value: 0.85, ltvMultiplier: 1 },
];

const VOLUME_BANDS: Band[] = [
  { id: "tiny", label: "5 / month", value: 5, ltvMultiplier: 1 },
  { id: "small", label: "10 / month", value: 10, ltvMultiplier: 1 },
  { id: "mid", label: "20 / month", value: 20, ltvMultiplier: 1 },
  { id: "large", label: "30+ / month", value: 40, ltvMultiplier: 1 },
];

type Tier = {
  name: "Local" | "Growth" | "Premium" | "High-Ticket";
  anchor: string;
  monthlyPrice: number; // for ratio display
  blurb: string;
};

const TIER_INFO: Record<Tier["name"], Tier> = {
  Local: {
    name: "Local",
    anchor: "#tier-local",
    monthlyPrice: 199,
    blurb: "Self-serve monthly plan. Best for salons, casual restaurants, small retail.",
  },
  Growth: {
    name: "Growth",
    anchor: "#tier-growth",
    monthlyPrice: 299,
    blurb: "Self-serve monthly plan. Best for beauty clinics, specialty retail, repair services.",
  },
  Premium: {
    name: "Premium",
    anchor: "#tier-premium",
    monthlyPrice: 499,
    blurb: "Self-serve monthly plan. Best for custom curtains, rugs, med spas, mid-ticket home services.",
  },
  "High-Ticket": {
    name: "High-Ticket",
    anchor: "#tier-high-ticket",
    monthlyPrice: 1500,
    blurb: "Visible minimum + success-fee structure. Built for real estate, jewelry, luxury home services.",
  },
};

function recommendTier(value: number, margin: number, volume: number): Tier["name"] {
  const gpPerCustomer = value * margin;
  // Volume cap: 30+/month always needs Premium minimum
  if (gpPerCustomer >= 1500 || (value >= 5000 && margin >= 0.2)) return "High-Ticket";
  if (gpPerCustomer >= 300 || volume >= 30) return "Premium";
  if (gpPerCustomer >= 50 || volume >= 20) return "Growth";
  return "Local";
}

function dollars(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}

function PillRow({
  legend,
  bands,
  selected,
  onSelect,
}: {
  legend: string;
  bands: Band[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-zinc-300 mb-3">{legend}</legend>
      <div role="radiogroup" className="flex flex-wrap gap-2">
        {bands.map((band) => {
          const isActive = selected === band.id;
          return (
            <button
              key={band.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onSelect(band.id)}
              className={[
                "rounded-lg border px-4 py-2 text-sm transition",
                isActive
                  ? "border-amber-400 bg-amber-400/10 text-amber-200"
                  : "border-zinc-700 bg-zinc-800/40 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 focus-visible:outline-offset-2",
              ].join(" ")}
            >
              {band.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function LeadPriceCalculator() {
  const [value, setValue] = useState("");
  const [margin, setMargin] = useState("");
  const [volume, setVolume] = useState("");

  const valueBand = VALUE_BANDS.find((b) => b.id === value);
  const marginBand = MARGIN_BANDS.find((b) => b.id === margin);
  const volumeBand = VOLUME_BANDS.find((b) => b.id === volume);

  const ready = !!(valueBand && marginBand && volumeBand);
  const tierName = ready
    ? recommendTier(valueBand!.value, marginBand!.value, volumeBand!.value)
    : null;
  const tier = tierName ? TIER_INFO[tierName] : null;

  // Value math — three drivers, transparently shown:
  // 1. First-sale gross profit:   customerValue * margin
  // 2. LTV uplift:                first-sale * (ltvMultiplier - 1)   (repeat purchases + referrals + brand recall + multilingual community trust)
  // 3. Monthly total:             (first-sale + LTV uplift) * volume
  const firstSaleGP = ready ? valueBand!.value * marginBand!.value : 0;
  const ltvMultiplier = ready ? valueBand!.ltvMultiplier : 1;
  const ltvUplift = ready ? firstSaleGP * (ltvMultiplier - 1) : 0;
  const totalPerCustomer = firstSaleGP + ltvUplift;
  const monthlyTotal = ready ? totalPerCustomer * volumeBand!.value : 0;

  const ratioToTier =
    ready && tier ? monthlyTotal / tier.monthlyPrice : 0;
  const ratioLabel =
    ratioToTier >= 10
      ? `${Math.round(ratioToTier)}×`
      : `${ratioToTier.toFixed(1)}×`;

  return (
    <section
      aria-labelledby="calculator-heading"
      className="py-16 px-6 border-t border-zinc-800"
    >
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
          Find your fit
        </p>
        <h2
          id="calculator-heading"
          className="text-2xl md:text-3xl font-bold tracking-tight mb-3"
        >
          See your tier in 3 questions.
        </h2>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          No login, no email. Your pricing depends on what a new customer is worth
          to your business, not on a one-size-fits-all package.
        </p>

        <div className="space-y-6 rounded-xl border border-zinc-700 bg-zinc-800/40 p-6">
          <PillRow
            legend="Average price per customer (one sale or one visit)"
            bands={VALUE_BANDS}
            selected={value}
            onSelect={setValue}
          />
          <PillRow
            legend="Gross margin (or commission, if you sell on behalf)"
            bands={MARGIN_BANDS}
            selected={margin}
            onSelect={setMargin}
          />
          <PillRow
            legend="New customers you want each month"
            bands={VOLUME_BANDS}
            selected={volume}
            onSelect={setVolume}
          />

          {ready && tier && (
            <div
              role="status"
              aria-live="polite"
              className="rounded-lg border border-amber-400/40 bg-amber-400/5 p-5"
            >
              <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-2">
                Your fit
              </p>
              <p className="text-2xl font-bold text-zinc-100 mb-2">
                {tier.name}
              </p>
              <p className="text-sm text-zinc-300 leading-relaxed mb-5">
                {tier.blurb}
              </p>

              {/* True-value breakdown — Codex's gross-profit framing, made transparent */}
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-3">
                What each new customer is actually worth to you
              </p>
              <dl className="text-sm space-y-1.5 mb-4">
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-400">First-sale gross profit</dt>
                  <dd className="text-zinc-200 font-mono tabular-nums">
                    {dollars(firstSaleGP)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-400">
                    + Repeat business, referrals, brand recall, multilingual
                    community trust
                  </dt>
                  <dd className="text-zinc-200 font-mono tabular-nums">
                    {dollars(ltvUplift)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-zinc-700 pt-2 mt-2">
                  <dt className="font-semibold text-zinc-100">
                    True value per customer
                  </dt>
                  <dd className="font-semibold text-zinc-100 font-mono tabular-nums">
                    {dollars(totalPerCustomer)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-400">
                    × {volumeBand!.value} new customers / month
                  </dt>
                  <dd className="text-zinc-400 font-mono tabular-nums">
                    × {volumeBand!.value}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-amber-400/40 pt-2 mt-1">
                  <dt className="font-semibold text-amber-200">
                    Monthly revenue lift
                  </dt>
                  <dd className="font-bold text-amber-300 text-base font-mono tabular-nums">
                    {dollars(monthlyTotal)}/mo
                  </dd>
                </div>
              </dl>

              <p className="text-sm text-zinc-300 mb-4">
                That&apos;s about{" "}
                <span className="font-semibold text-amber-300">{ratioLabel}</span>{" "}
                what the {tier.name} plan costs{" "}
                {tier.name === "High-Ticket" ? "(starting price)" : `(${dollars(tier.monthlyPrice)}/mo)`}
                .
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={tier.anchor}
                  className="rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-zinc-900 text-center transition hover:bg-amber-300"
                >
                  See {tier.name} pricing &darr;
                </a>
                <a
                  href="/schedule"
                  className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm text-zinc-200 text-center transition hover:border-zinc-500 hover:bg-zinc-800/50"
                >
                  Book a free 15-min call
                </a>
              </div>
            </div>
          )}

          {!ready && (
            <p className="text-xs text-zinc-500">
              Answer all three to see your tier and the real revenue math.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
