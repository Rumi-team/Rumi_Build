import { PILLARS } from "@/lib/data";
import { ServiceCard } from "@/components/service-card";

// "What we build and run" — the done-for-you capability strip. Cards are
// service-framed (we build / we run), rendered through the shared ServiceCard
// with its CTA footer hidden (one section CTA carries the action instead).
export function PlatformPillars() {
  return (
    <section
      aria-labelledby="pillars-heading"
      className="py-20 px-6 section-alt section-divider"
    >
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
          What we build and run
        </p>
        <h2
          id="pillars-heading"
          className="text-3xl md:text-4xl font-bold tracking-tight mb-3"
        >
          One team builds and runs your whole presence.
        </h2>
        <p className="text-zinc-400 mb-10 max-w-xl text-lg">
          You run your business. We build the website, the AI front desk, and
          the tools to capture and keep every customer — then we keep them
          running. One team accountable for all of it.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PILLARS.map((pillar) => (
            <ServiceCard
              key={pillar.name}
              service={pillar}
              linked={false}
              footer={null}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
