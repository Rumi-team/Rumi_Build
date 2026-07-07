import { SERVICES } from "@/lib/data";

export function ServicesPreview() {
  const product = SERVICES[0];
  if (!product) return null;

  return (
    <section className="bg-surface py-20 px-6 md:px-12 border-t border-line">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow mb-3">What you get</p>
        <h2 className="text-3xl md:text-4xl font-bold tracking-h2 text-ink mb-3">
          {product.name}
        </h2>
        <p className="text-muted mb-10 max-w-xl text-lg">
          {product.tagline}
        </p>

        <div className="card p-8">
          <p className="text-base text-muted leading-relaxed mb-6">
            {product.description}
          </p>

          <ul className="space-y-3 mb-8">
            {product.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-sm text-muted leading-relaxed"
              >
                <span className="text-accent mt-1 shrink-0" aria-hidden>
                  ✓
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-3">
            <a href="/evaluate" className="btn-primary px-6 py-3 text-base">
              Request a free evaluation
            </a>
            <a
              href="/schedule"
              className="btn-secondary-white px-6 py-3 text-base"
            >
              Book a free 15-min call
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
