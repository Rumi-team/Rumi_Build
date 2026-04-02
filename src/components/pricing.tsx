const CALENDLY_URL = "https://cal.com/rumi.team/30min";

const TIERS = [
  {
    name: "AI Workflow Sprint",
    price: "$500",
    stripe: "https://buy.stripe.com/aFa5kwgeR8ae5AL7KA0RG00",
    description: "5-day focused build sprint. One AI automation workflow delivered as working software.",
    features: [
      "1 AI workflow delivered",
      "5-day build sprint",
      "Daily progress updates",
      "30 days post-launch support",
    ],
    cta: "Start Sprint",
    featured: false,
  },
  {
    name: "AI Automation Package",
    price: "$1,500",
    stripe: "https://buy.stripe.com/14AaEQ6EhgGK6EP0i80RG01",
    description: "Multi-workflow automation build. Up to 3 connected AI workflows in 2 weeks.",
    features: [
      "Up to 3 connected workflows",
      "2-week build timeline",
      "Daily progress updates",
      "60 days support + team training",
    ],
    cta: "Get Started",
    featured: true,
  },
  {
    name: "Full AI Integration",
    price: "From $5,000",
    stripe: "https://buy.stripe.com/cNi6oAe6J8ae4wHaWM0RG02",
    description: "End-to-end AI automation for your business. Custom-scoped, delivered in 4 weeks.",
    features: [
      "Custom-scoped project",
      "4-week build timeline",
      "Dedicated Slack channel",
      "90 days support + docs + training",
    ],
    cta: "Deposit",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section aria-labelledby="pricing-heading" className="py-20 px-6">
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
                  ? "border border-amber-400 bg-zinc-800/50"
                  : "border border-zinc-700 bg-zinc-800/30"
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
                className={`font-mono text-4xl font-bold mb-6 ${
                  tier.featured ? "text-amber-400" : "text-zinc-200"
                }`}
              >
                {tier.price}
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((item) => (
                  <li
                    key={item}
                    className={`text-sm border-b pb-3 ${
                      tier.featured
                        ? "text-zinc-300 border-zinc-700"
                        : "text-zinc-400 border-zinc-800"
                    }`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={tier.stripe}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full rounded-lg py-3.5 text-center text-base font-semibold transition focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 ${
                  tier.featured
                    ? "bg-amber-400 text-zinc-900 hover:bg-amber-300"
                    : "border border-zinc-700 text-zinc-300 hover:border-zinc-500"
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
