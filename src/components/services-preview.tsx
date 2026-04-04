import { SERVICES } from "@/lib/data";
import { ServiceCard } from "./service-card";

const TOP_SERVICES = SERVICES.slice(0, 3);

export function ServicesPreview() {
  return (
    <section className="py-20 px-6 section-alt section-divider">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
          Services
        </p>
        <h2 className="text-3xl font-bold tracking-tight mb-3">
          AI that pays for itself
        </h2>
        <p className="text-zinc-400 mb-10 max-w-xl">
          High-margin AI services delivered in weeks, not months.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {TOP_SERVICES.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
        <a
          href="/services"
          className="inline-block text-sm text-amber-400 hover:text-amber-300 transition"
        >
          See all 9 services &rarr;
        </a>
      </div>
    </section>
  );
}
