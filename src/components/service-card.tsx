import type { Service } from "@/lib/data";

export function ServiceCard({
  service,
  linked = true,
}: {
  service: Service;
  linked?: boolean;
}) {
  const inner = (
    <>
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400/10 text-lg mb-4">
        {service.icon}
      </div>
      <h3 className="text-base font-semibold mb-1">{service.name}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed mb-3">
        {service.tagline}
      </p>
      <p className="font-mono text-xs text-amber-400/70 mt-auto">
        {service.priceRange}
      </p>
    </>
  );

  const className =
    "flex flex-col rounded-xl border border-zinc-700 bg-zinc-800/30 p-6 transition hover:border-zinc-600";

  if (linked) {
    return (
      <a href={`/services/${service.slug}`} className={className}>
        {inner}
      </a>
    );
  }

  return <div className={className}>{inner}</div>;
}
