import type { Vertical } from "@/lib/data";

export function VerticalCard({
  vertical,
  linked = true,
}: {
  vertical: Vertical;
  linked?: boolean;
}) {
  const inner = (
    <>
      <h3 className="text-base font-semibold mb-1">{vertical.name}</h3>
      <p className="font-mono text-xs text-amber-400 mb-3">{vertical.stat}</p>
      <p className="text-sm text-zinc-400 leading-relaxed">
        {vertical.tagline}
      </p>
    </>
  );

  const className =
    "flex flex-col rounded-xl border border-zinc-700 bg-zinc-800/30 p-6 transition hover:border-zinc-600";

  if (linked) {
    return (
      <a href={`/industries/${vertical.slug}`} className={className}>
        {inner}
      </a>
    );
  }

  return <div className={className}>{inner}</div>;
}
