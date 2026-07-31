// @vitest-environment jsdom
// This file renders a component, so it needs a DOM. The suite defaults to the
// `node` environment (vitest.config.ts); only the files that render opt in.
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ServiceCard } from "@/components/service-card";

// ── Why this file exists ──────────────────────────────────────────────────────
// ServiceCard is the most-rendered component on the site — five cards on the
// homepage, five on /services, four on every role page, four in the extras grid
// — and this diff gave it four new optional branches: `price`, the `savingLabel`
// nested inside it, `workload`, and the `workloadLabel` prefix.
//
// Production only ever exercises two of the sixteen combinations: everything at
// once (the role grids) and nothing at all (the extras grid). The partial states
// are what the component's own comments legislate, and they are exactly the ones
// nothing reaches:
//   - a `savingLabel` with no price must render NO badge. "90% off" beside a
//     name and no number reads as a discount off Rumi's own list price, which is
//     not the claim — the referent is the workload.
//   - a `workload` with no price must still render its pill, because the pill is
//     what the saving is measured against.
// The href fallback is the other untested branch: `service.href ?? /services/
// ${service.slug}`. The homepage passes `href`, the role pages pass `slug`, and
// a card built with neither silently links to "/services/undefined".

const BASE = {
  icon: "📞",
  name: "AI Receptionist",
  tagline: "Answers every call, day or night.",
};

describe("ServiceCard price, saving and workload", () => {
  it("renders the price, the saving badge and the workload pill together", () => {
    // The full state, which every absence below is measured against: without
    // this case a card that rendered none of the three would satisfy them all.
    render(
      <ServiceCard
        service={{
          ...BASE,
          price: "from $300/mo",
          workload: "~$3,000/mo of front-desk work",
          slug: "ai-receptionist",
        }}
        savingLabel="90% off"
      />
    );
    const card = screen.getByRole("link");
    expect(within(card).getByText("from $300/mo")).toBeInTheDocument();
    expect(within(card).getByText("90% off")).toBeInTheDocument();
    expect(
      within(card).getByText("Covers ~$3,000/mo of front-desk work")
    ).toBeInTheDocument();
  });

  it("suppresses the saving badge on a card with no price", () => {
    // The badge lives inside the `service.price &&` block, so a caller that
    // passes a saving with no number gets nothing rather than an unanchored
    // percentage. Nothing in the app does this today, which is precisely why the
    // branch needs pinning — the guard is invisible at every call site.
    render(
      <ServiceCard
        service={{ ...BASE, workload: "~$3,000/mo of front-desk work" }}
        savingLabel="90% off"
        linked={false}
      />
    );
    expect(
      screen.queryByText("90% off"),
      'a "90% off" badge rendered with no price beside it — it reads as a discount off our own list price'
    ).toBeNull();
    // The workload pill is independent of the price and must survive.
    expect(
      screen.getByText("Covers ~$3,000/mo of front-desk work")
    ).toBeInTheDocument();
  });

  it("strips to name and tagline for the extras grid: no pills, no footer, no link", () => {
    // The other combination production actually renders — the four "extra
    // services" cards, which pass linked={false} and footer={null} and carry
    // neither a price nor a workload. Every optional branch off at once.
    const { container } = render(
      <ServiceCard service={{ ...BASE, slug: "ai-receptionist" }} linked={false} footer={null} />
    );
    expect(container.textContent).not.toMatch(/\$\d/);
    expect(container.textContent).not.toContain("Covers");
    expect(
      container.textContent,
      "a footer of null still rendered a footer line"
    ).not.toContain("Talk to us about hiring");
    expect(
      screen.queryByRole("link"),
      "an unlinked card is still an anchor — the four extras cards become dead links"
    ).toBeNull();
    expect(screen.getByRole("heading", { name: BASE.name })).toBeInTheDocument();
  });

  it("takes the workload prefix from its caller, so Farsi cards do not say 'Covers'", () => {
    // `workloadLabel` defaults to the English "Covers"; the homepage passes
    // t.roles.workloadLabel. A pill that ignored the prop would put one English
    // word in the middle of every Persian card.
    render(
      <ServiceCard
        service={{
          ...BASE,
          price: "از ۳۰۰ دلار در ماه",
          workload: "حدود ۳٬۰۰۰ دلار در ماه کار پذیرش",
        }}
        workloadLabel="پوشش می‌دهد"
        linked={false}
      />
    );
    expect(
      screen.getByText("پوشش می‌دهد حدود ۳٬۰۰۰ دلار در ماه کار پذیرش")
    ).toBeInTheDocument();
    expect(screen.queryByText(/Covers/)).toBeNull();
  });
});

describe("ServiceCard linking", () => {
  it("builds the role URL from the slug when no href is given", () => {
    // What /services/[slug] passes for the bundle contents and the other-roles
    // grid. A card built with neither href nor slug links to
    // "/services/undefined" — a hard 404, since dynamicParams is false.
    render(
      <ServiceCard service={{ ...BASE, slug: "ai-office-manager" }} />
    );
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/services/ai-office-manager"
    );
  });

  it("keeps the price and the saving inside the link's accessible name", () => {
    // The card carried an aria-label once, which REPLACES the computed name
    // rather than adding to it, and hid the price and the badge from screen
    // readers. ai-employees-section.test.tsx pins this for the homepage grid;
    // this pins it on the component, so a label reintroduced here fails whether
    // or not the homepage happens to be the call site.
    render(
      <ServiceCard
        service={{
          ...BASE,
          price: "from $300/mo",
          workload: "~$3,000/mo of front-desk work",
          slug: "ai-receptionist",
        }}
        savingLabel="90% off"
      />
    );
    const named = screen.getByRole("link", {
      name: (accessibleName: string) =>
        accessibleName.includes(BASE.name) &&
        accessibleName.includes("from $300/mo") &&
        accessibleName.includes("90% off") &&
        accessibleName.includes("~$3,000/mo of front-desk work"),
    });
    expect(named).toHaveAttribute("href", "/services/ai-receptionist");
    // The icon is decorative and must stay out of that name.
    expect(named.textContent).toContain(BASE.icon);
    expect(
      named.querySelector('[aria-hidden="true"]')!.textContent,
      "the icon is no longer hidden from assistive tech"
    ).toBe(BASE.icon);
  });
});
