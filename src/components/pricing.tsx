import { CALENDLY_URL, TIERS } from "@/lib/data";

export function Pricing() {
  return (
    <section aria-labelledby="pricing-heading" className="py-20 px-6 section-alt section-divider">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
          Pricing
        </p>
        <h2
          id="pricing-heading"
          className="text-3xl font-bold tracking-tight mb-4"
        >
          Simple, transparent pricing
        </h2>
        <p className="text-zinc-400 mb-10 max-w-2xl">
          Every engagement starts with a{" "}
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 underline underline-offset-2 hover:text-amber-300"
          >
            free 30-minute discovery call
          </a>{" "}
          to make sure we&apos;re the right fit.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-xl p-8 relative flex flex-col ${
                tier.featured
                  ? "card-glass card-featured"
                  : "card-glass"
              }`}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-6 rounded-full bg-amber-400 px-3 py-0.5 text-xs font-semibold text-zinc-900">
                  MOST POPULAR
                </span>
              )}
              <h3 className="text-xl font-semibold mb-1">{tier.name}</h3>
              <p className="text-sm text-zinc-400 mb-4">{tier.description}</p>
              <p
                className={`font-mono text-4xl font-bold mb-2 ${
                  tier.featured ? "price-highlight" : "text-zinc-200"
                }`}
              >
                {tier.price}
              </p>
              <p className="text-xs text-zinc-500 mb-6">{tier.roi}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((item) => (
                  <li
                    key={item}
                    className={`text-sm border-b pb-3 ${
                      tier.featured
                        ? "text-zinc-300 border-zinc-700/50"
                        : "text-zinc-400 border-zinc-800/50"
                    }`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={tier.href}
                className={`block w-full rounded-lg py-3.5 text-center text-base font-semibold transition focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 ${
                  tier.featured
                    ? "bg-amber-400 text-zinc-900 hover:bg-amber-300 hover:shadow-[0_0_24px_rgba(251,191,36,0.25)]"
                    : "border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800/50"
                }`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
