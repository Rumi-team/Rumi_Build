import { SERVICES } from "@/lib/data";
import { ServiceCard } from "./service-card";

export function ServicesPreview() {
  return (
    <section className="py-20 px-6 section-alt section-divider">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
          Services
        </p>
        <h2 className="text-3xl font-bold tracking-tight mb-3">
          What We Build
        </h2>
        <p className="text-zinc-400 mb-10 max-w-xl">
          Three focused services. Specific cost savings. Working software in
          days.
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
