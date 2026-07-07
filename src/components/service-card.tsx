// Accepts the structural subset of `Service` the card actually renders, so it
// can also render lighter shapes like `Pillar` (icon/name/tagline). `footer`
// is the small line at the bottom; pass `null` to hide it.
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
      <div className="icon-badge text-lg mb-4" aria-hidden="true">
        {service.icon}
      </div>
      <h3 className="text-base font-semibold text-ink mb-1">{service.name}</h3>
      <p className="text-sm text-muted leading-relaxed mb-3">
        {service.tagline}
      </p>
      {footer !== null && (
        <p className="text-xs text-accent/80 mt-auto">{footer}</p>
      )}
    </>
  );

  // Linked variant gets an explicit focus-visible ring so keyboard users see
  // a clear focus indicator on the full-card link, plus the card hover lift.
  const linkedClassName =
    "card flex flex-col p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2";
  const staticClassName = "card flex flex-col p-6";

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
