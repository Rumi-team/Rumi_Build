// @vitest-environment jsdom
// Renders a page component, so it needs a DOM. The suite defaults to `node`
// (vitest.config.ts); only the files that render opt in.
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CALL_OPTIONS } from "@/lib/stripe";

// ── Why this file exists ──────────────────────────────────────────────────────
// /book is the only page on this site that takes money, and everything it
// promises is derived from CALL_OPTIONS at import time — which means it is all
// decided by two environment variables that are NOT set at build time in CI and
// were, at the time this was written, not both set in production either.
//
// Two ways that goes wrong, both of which look fine in a screenshot:
//
//  1. SELLING WHAT CANNOT BE BOUGHT. An option whose Stripe price id is unset
//     is one /api/checkout answers with a 503. Rendered anyway, it takes a
//     buyer through the length choice, four fields, a consent tick and the
//     submit button before failing — and the failure gives them no reason to
//     try the other length.
//  2. PROMISING A CALENDAR THAT DOES NOT EXIST. The line under the form used to
//     say, flatly, that payment gets you a link to pick your time. There is no
//     60-minute Cal.com event type, so /book/success tells that same buyer the
//     opposite one screen later. The page that takes the money is the one that
//     must not overpromise.
//
// The catalog is stubbed per case because the page reads it at module load:
// "configured" and "not configured" are two different module loads.

const THIRTY = CALL_OPTIONS.find((o) => o.id === "30min")!;
const SIXTY = CALL_OPTIONS.find((o) => o.id === "60min")!;

const PRICE_30 = "price_thirty_minute_call";
const PRICE_60 = "price_sixty_minute_call";

/**
 * Render /book with each option's price id and Cal.com event chosen here.
 * Built from the real catalog so no price, length or label is retyped.
 */
async function renderBook({
  priceId30 = PRICE_30,
  priceId60 = PRICE_60,
  calLink30 = THIRTY.calLink,
  calLink60 = "",
}: {
  priceId30?: string;
  priceId60?: string;
  calLink30?: string;
  calLink60?: string;
} = {}) {
  vi.resetModules();
  vi.doMock("@/lib/stripe", async (importOriginal) => {
    const real = await importOriginal<typeof import("@/lib/stripe")>();
    return {
      ...real,
      CALL_OPTIONS: real.CALL_OPTIONS.map((o) =>
        o.id === "30min"
          ? { ...o, priceId: priceId30, calLink: calLink30 }
          : { ...o, priceId: priceId60, calLink: calLink60 },
      ),
    };
  });
  const { default: BookPage } = await import("@/app/book/page");
  const element = await BookPage({ searchParams: Promise.resolve({}) });
  return render(element);
}

/** The length chooser, read through the accessibility tree. */
const offeredLengths = () =>
  screen.queryAllByRole("radio").map((r) => r.getAttribute("value"));

afterEach(() => {
  vi.restoreAllMocks();
  vi.doUnmock("@/lib/stripe");
});

describe("/book only offers what can actually be bought", () => {
  it("offers both lengths when both price ids are set", async () => {
    // The success state every assertion below is the absence of.
    const { container } = await renderBook();

    expect(offeredLengths()).toEqual(CALL_OPTIONS.map((o) => o.id));
    expect(container.textContent).toContain(THIRTY.price);
    expect(container.textContent).toContain(SIXTY.price);
  });

  it("hides the option whose price id is unset, and stops quoting its price", async () => {
    // The shipping configuration: STRIPE_PRICE_ID_60MIN not yet set in Vercel.
    const { container } = await renderBook({ priceId60: "" });

    expect(
      offeredLengths(),
      "a length that cannot be checked out was offered for sale",
    ).toEqual([THIRTY.id]);
    expect(
      container.textContent,
      "the intro copy still advertises the price of a call nobody can buy",
    ).not.toContain(SIXTY.price);
    expect(container.textContent).toContain(THIRTY.price);
    // …and the default lands on something that survived the filter, or the
    // form pre-selects a card that /api/checkout would refuse.
    expect(screen.getByRole("radio", { checked: true })).toHaveAttribute(
      "value",
      THIRTY.id,
    );
  });

  it("falls back to the whole catalog when NOTHING is configured", async () => {
    // The other branch. With neither id set there is no other length to steer
    // anyone toward, and CI builds this page exactly this way — filtering to
    // nothing would render a chooser with no options and a button with no
    // price. The 503 in /api/checkout owns this case instead.
    await renderBook({ priceId30: "", priceId60: "" });

    expect(
      offeredLengths(),
      "an unconfigured build renders a form with nothing to pick",
    ).toEqual(CALL_OPTIONS.map((o) => o.id));
  });

  it("promises a calendar only for the lengths that have one", async () => {
    // Production today: a 30-minute event type exists, a 60-minute one does
    // not. A flat "you'll get a link to pick your time" is false for half the
    // buyers, and /book/success retracts it one screen later.
    const { container } = await renderBook({ calLink60: "" });

    expect(container.textContent).toMatch(
      new RegExp(`${THIRTY.label}[^.]*calendar`, "i"),
    );
    expect(container.textContent, "the no-calendar length is not accounted for")
      .toMatch(/email you times/i);
  });

  it("keeps the flat calendar promise when every length has a calendar", async () => {
    const { container } = await renderBook({ calLink60: "rumi-app/60-min-meeting" });

    expect(container.textContent).toMatch(
      /get a link to pick your time on our calendar/i,
    );
    expect(
      container.textContent,
      "a page where every length self-books still offers to email times",
    ).not.toMatch(/email you times/i);
  });

  it("promises no calendar at all when no length has one", async () => {
    const { container } = await renderBook({ calLink30: "", calLink60: "" });

    expect(container.textContent).toMatch(/email you times/i);
    expect(
      container.textContent,
      "a page with no bookable calendar still promises a link to one",
    ).not.toMatch(/pick your time on our calendar/i);
  });
});
