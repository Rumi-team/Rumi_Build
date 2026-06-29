// Accepts the structural subset of `Service` the card actually renders, so it
// can also render lighter shapes like `Pillar` (icon/name/tagline). `footer`
// is the small mono line at the bottom; pass `null` to hide it.
type CardItem = {
  icon: string;
  name: string;
  tagline: string;
  slug?: string;
  href?: string;
};

export function ServiceCard({
  service,
  linked = true,
  footer = "Talk to us about hiring →",
}: {
  service: CardItem;
  linked?: boolean;
  footer?: string | null;
}) {
  const inner = (
    <>
      {/* Decorative icon — hidden from assistive tech, the heading
          carries the actual service name. */}
      <div
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400/10 text-lg mb-4"
        aria-hidden="true"
      >
        {service.icon}
      </div>
      <h3 className="text-base font-semibold mb-1">{service.name}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed mb-3">
        {service.tagline}
      </p>
      {footer !== null && (
        <p className="font-mono text-xs text-amber-400/70 mt-auto">{footer}</p>
      )}
    </>
  );

  // Linked variant gets an explicit focus-visible ring so keyboard users see
  // a clear focus indicator on the full-card link, plus a subtle hover lift.
  const linkedClassName =
    "flex flex-col rounded-xl p-6 card-glass transition hover:border-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900";
  const staticClassName = "flex flex-col rounded-xl p-6 card-glass";

  if (linked) {
    const href = service.href ?? `/services/${service.slug}`;
    return (
      <a
        href={href}
        className={linkedClassName}
        aria-label={`${service.name}: ${service.tagline}`}
      >
        {inner}
      </a>
    );
  }

  return <div className={staticClassName}>{inner}</div>;
}
