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
      <h3 className="text-base font-semibold text-ink mb-1">{vertical.name}</h3>
      <p className="text-xs text-accent mb-3">{vertical.stat}</p>
      <p className="text-sm text-muted leading-relaxed">
        {vertical.tagline}
      </p>
    </>
  );

  const className = "card flex flex-col p-6";

  if (linked) {
    return (
      <a
        href={`/industries/${vertical.slug}`}
        className={`${className} focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2`}
      >
        {inner}
      </a>
    );
  }

  return <div className={className}>{inner}</div>;
}
