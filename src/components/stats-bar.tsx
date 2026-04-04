import { STATS } from "@/lib/data";

export function StatsBar() {
  return (
    <section className="border-y border-zinc-800 bg-zinc-800/40 py-12 px-6">
      <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {STATS.map((stat) => (
          <div key={stat.label}>
            <p className="font-mono text-3xl font-bold text-amber-400">
              {stat.value}
            </p>
            <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
