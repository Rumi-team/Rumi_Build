// Accepts the structural subset of a role/extra the card actually renders, so
// the same card serves the AI-Employee grids (icon + price + workload + tagline)
// and the lighter "extra services" grid (icon + name + tagline only).
// `footer` is the small accent line at the bottom; pass `null` to hide it.
//
// `workload` is the volume of WORK the role covers — never a person being
// removed. Say "~$3,000/mo of front-desk work", never "a ~$3,000/mo
// receptionist".
//
// `price` is what Rumi charges: about a tenth of what that work costs today. It
// must always arrive already prefixed with "from"/"starting at" — a bare fixed
// price is not how this site quotes.
import { SavingBadge, WorkloadPill } from "@/components/price-badges";

type CardItem = {
  icon: string;
  name: string;
  tagline: string;
  workload?: string;
  price?: string;
  slug?: string;
  href?: string;
};

export function ServiceCard({
  service,
  linked = true,
  footer = "Talk to us about hiring →",
  workloadLabel = "Covers",
  savingLabel,
}: {
  service: CardItem;
  linked?: boolean;
  footer?: string | null;
  /** Prefix on the workload pill, e.g. "Covers". Translatable. */
  workloadLabel?: string;
  /**
   * e.g. "90% off" — only pass alongside BOTH a price and a workload. The
   * saving is measured against the workload, so a badge without the "Covers …"
   * pill on the same card has no referent and reads as a discount off Rumi's
   * own list price.
   */
  savingLabel?: string;
}) {
  const inner = (
    <>
      {/* Decorative icon — hidden from assistive tech, the heading
          carries the actual service name. */}
      <div
        className="icon-badge text-lg mb-4"
        aria-hidden="true"
      >
        {service.icon}
      </div>
      <h3 className="text-base font-semibold text-ink mb-2">{service.name}</h3>

      {/* items-center, matching the same price+badge lockup in
          src/app/services/[slug]/page.tsx. On a baseline the badge's own
          padding drops it below the price it belongs to. */}
      {service.price && (
        <p className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-xl font-bold tracking-h2 text-ink">
            {service.price}
          </span>
          {savingLabel && <SavingBadge label={savingLabel} />}
        </p>
      )}

      {service.workload && (
        <p className="mb-3">
          <WorkloadPill label={workloadLabel} workload={service.workload} />
        </p>
      )}

      <p className="text-sm text-muted leading-relaxed mb-3">
        {service.tagline}
      </p>
      {footer !== null && (
        <p className="text-sm text-accent-hover mt-auto">{footer}</p>
      )}
    </>
  );

  // Linked variant gets an explicit focus-visible ring so keyboard users see
  // a clear focus indicator on the full-card link, plus a subtle hover lift.
  const linkedClassName =
    "card flex flex-col p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2";
  const staticClassName = "card flex flex-col p-6";

  if (linked) {
    const href = service.href ?? `/services/${service.slug}`;
    // No aria-label. An aria-label REPLACES the accessible name rather than
    // adding to it, so `"${name}: ${tagline}"` was hiding the price, the
    // "90% off" badge and the "Covers …" pill from screen readers — the three
    // things the card exists to say. Letting the name compute from the content
    // reads all of it; the icon is already aria-hidden.
    return (
      <a href={href} className={linkedClassName}>
        {inner}
      </a>
    );
  }

  return <div className={staticClassName}>{inner}</div>;
}
