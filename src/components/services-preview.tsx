import { SERVICES } from "@/lib/data";
import { ServiceCard } from "./service-card";

export function ServicesPreview() {
  return (
    <section className="py-20 px-6 section-alt section-divider">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
          Hire your next employee
        </p>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Need a new employee?
        </h2>
        <p className="text-zinc-400 mb-10 max-w-xl">
          Pick one of ours. Fraction of the cost, 24/7 availability, ready in
          days. Three AI specialists trained on your context.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
