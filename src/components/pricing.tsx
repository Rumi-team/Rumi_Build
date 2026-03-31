const CALENDLY_URL = "https://calendly.com/ali-rumi/discovery";
const STRIPE_URL = "https://buy.stripe.com/rumi-sprint";

export function Pricing() {
  return (
    <section aria-labelledby="pricing-heading" className="py-20 px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
          Pricing
        </p>
        <h2
          id="pricing-heading"
          className="text-3xl font-bold tracking-tight mb-10"
        >
          Simple, transparent pricing
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Featured card first on mobile (order-first), second on desktop (md:order-last) */}
          <div className="order-first md:order-last rounded-xl border border-amber-400 bg-zinc-800/50 p-8 relative">
            <span className="absolute -top-3 left-6 rounded-full bg-amber-400 px-3 py-0.5 text-xs font-semibold text-zinc-900">
              MOST POPULAR
            </span>
            <h3 className="text-xl font-semibold mb-1">AI Workflow Sprint</h3>
            <p className="text-sm text-zinc-400 mb-4">
              Working automation in 5 business days
            </p>
            <p className="font-mono text-4xl font-bold text-amber-400 mb-6">
              From $500
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "5-day focused build sprint",
                "Daily progress updates",
                "Working software delivered",
                "30 days post-launch support",
              ].map((item) => (
                <li
                  key={item}
                  className="text-sm text-zinc-300 border-b border-zinc-700 pb-3"
                >
                  {item}
                </li>
              ))}
            </ul>
            <a
              href={STRIPE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-lg bg-amber-400 py-3.5 text-center text-base font-semibold text-zinc-900 transition hover:bg-amber-300 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
            >
              Start Sprint
            </a>
          </div>

          {/* Free card — visually subordinate */}
          <div className="order-last md:order-first rounded-xl bg-zinc-800/30 p-8">
            <h3 className="text-xl font-semibold mb-1">Discovery Call</h3>
            <p className="text-sm text-zinc-400 mb-4">
              Find out if AI can help your business
            </p>
            <p className="font-mono text-4xl font-bold text-green-500 mb-6">
              Free
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "15-minute video call",
                "Business process review",
                "AI opportunity assessment",
                "No commitment required",
              ].map((item) => (
                <li
                  key={item}
                  className="text-sm text-zinc-400 border-b border-zinc-800 pb-3"
                >
                  {item}
                </li>
              ))}
            </ul>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-lg border border-zinc-700 py-3.5 text-center text-base text-zinc-300 transition hover:border-zinc-500 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
            >
              Book Free Call
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
