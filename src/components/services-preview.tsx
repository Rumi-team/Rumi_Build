import { SERVICES } from "@/lib/data";

export function ServicesPreview() {
  const product = SERVICES[0];
  if (!product) return null;

  return (
    <section className="py-20 px-6 section-alt section-divider">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
          What you get
        </p>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          {product.name}
        </h2>
        <p className="text-zinc-400 mb-10 max-w-xl text-lg">
          {product.tagline}
        </p>

        <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-8">
          <p className="text-base text-zinc-300 leading-relaxed mb-6">
            {product.description}
          </p>

          <ul className="space-y-3 mb-8">
            {product.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-sm text-zinc-300 leading-relaxed"
              >
                <span className="text-amber-400 mt-1 shrink-0" aria-hidden>
                  ✓
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/evaluate"
              className="rounded-lg bg-amber-400 px-6 py-3 text-base font-semibold text-zinc-900 transition hover:bg-amber-300 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
            >
              Request a free evaluation
            </a>
            <a
              href="/schedule"
              className="rounded-lg border border-zinc-700 px-6 py-3 text-base text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800/50"
            >
              Book a free 15-min call
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
