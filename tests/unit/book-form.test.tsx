// @vitest-environment jsdom
// Renders the checkout form, so it needs a DOM. The suite defaults to `node`
// (vitest.config.ts); only the files that render opt in.
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BookForm } from "@/app/book/book-form";
import { CALL_OPTIONS, DEFAULT_CALL_OPTION_ID } from "@/lib/stripe";

// ── Why this file exists ──────────────────────────────────────────────────────
// The form is one half of a contract whose other half is a zod schema in
// /api/checkout, and the seam between them fails SILENTLY in one specific way:
// `Body` there is a plain `z.object()`, which STRIPS unknown keys rather than
// rejecting them. So if this form stops sending `duration` — a rename, a
// refactor that rebuilds the POST body field by field, a `duration` moved out
// of the state object into a ref — the request still succeeds, Stripe still
// charges, and every buyer gets whichever price the server defaults to. No
// error, no log, nothing on the page. checkout-route.test.ts proves the server
// refuses a body with no duration; this file proves the browser sends one.
//
// The second half is the button. It is the last thing a buyer reads before they
// are sent to Stripe, and it is the only place the amount about to be charged
// appears once the cards scroll off. A chooser that changes state without
// changing that label is a page that shows one price and charges another.

/** The props /book hands the form: the catalog minus the Stripe price ids. */
const OPTIONS = CALL_OPTIONS.map(({ id, minutes, price, label, blurb }) => ({
  id,
  minutes,
  price,
  label,
  blurb,
}));

const DEFAULT_OPTION = CALL_OPTIONS.find((o) => o.id === DEFAULT_CALL_OPTION_ID)!;
const OTHER_OPTION = CALL_OPTIONS.find((o) => o.id !== DEFAULT_CALL_OPTION_ID)!;

let posted: { url: string; body: Record<string, unknown> }[] = [];

function renderForm() {
  return render(<BookForm options={OPTIONS} defaultId={DEFAULT_CALL_OPTION_ID} />);
}

/** Fill the required fields and submit. Returns the body that reached fetch. */
function submitForm(container: HTMLElement) {
  fireEvent.change(screen.getByLabelText(/full name/i), {
    target: { value: "Dana Okafor" },
  });
  fireEvent.change(screen.getByLabelText(/^email/i), {
    target: { value: "dana@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/what do you want to discuss/i), {
    target: { value: "Calls going to voicemail every afternoon." },
  });
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.submit(container.querySelector("form")!);
}

beforeEach(() => {
  posted = [];
  // Resolves with no `url`, so the component takes its error path and never
  // assigns window.location — jsdom cannot navigate, and the POST body is the
  // only thing under test here.
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init: RequestInit) => {
      posted.push({ url, body: JSON.parse(String(init.body)) });
      return { ok: false, json: async () => ({ error: "stubbed" }) } as Response;
    })
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("the /book checkout form", () => {
  it("offers every call length as a real radio, with the default pre-checked", async () => {
    const { container } = renderForm();

    const radios = container.querySelectorAll<HTMLInputElement>(
      'input[type="radio"][name="duration"]'
    );
    expect(radios.length, "the two lengths are not offered as a choice").toBe(
      CALL_OPTIONS.length
    );
    // BY ROLE AND NAME, deliberately, not by CSS selector. Every other query in
    // this file goes around the accessibility tree: replacing the wrapping
    // <label> with a <div> leaves the input, the group, the value, the checked
    // state and all the visible text exactly as they are — so both radios
    // announce as "radio, blank", the card stops being a hit target, and a
    // selector-based suite stays green. `getByRole` fails on that, because an
    // accessible name is what the wrapping label is FOR.
    for (const option of CALL_OPTIONS) {
      const radio = screen.getByRole<HTMLInputElement>("radio", {
        name: new RegExp(option.label, "i"),
      });
      expect(radio.getAttribute("value")).toBe(option.id);
      expect(radio.checked).toBe(option.id === DEFAULT_CALL_OPTION_ID);
      // Each card has to state what it costs before it is picked, and the price
      // has to be part of what the radio announces — not text sitting nearby.
      expect(
        radio.getAttribute("aria-label") ??
          radio.closest("label")?.textContent ??
          "",
        `the ${option.label} card's price is not part of the radio's name`
      ).toContain(option.price);
    }
  });

  it("shows the price of whichever length is selected on the submit button", () => {
    renderForm();
    const submit = screen.getByRole("button", { name: /book call/i });

    expect(submit.textContent).toContain(DEFAULT_OPTION.price);

    fireEvent.click(
      screen.getByRole("radio", { name: new RegExp(OTHER_OPTION.label, "i") })
    );
    expect(
      submit.textContent,
      "the button still quotes the price of the option that is no longer selected"
    ).toContain(OTHER_OPTION.price);
    expect(submit.textContent).not.toContain(DEFAULT_OPTION.price);
  });

  it("sends the selected duration to /api/checkout", async () => {
    // THE SEAM. /api/checkout's zod schema strips keys it does not declare, so
    // a body missing this field is accepted and charged at the default price
    // with nothing to notice.
    const { container } = renderForm();
    fireEvent.click(
      screen.getByRole("radio", { name: new RegExp(OTHER_OPTION.label, "i") })
    );
    submitForm(container);

    expect(posted.length, "the form never posted to the checkout API").toBe(1);
    expect(posted[0].url).toBe("/api/checkout");
    expect(
      posted[0].body.duration,
      "the chosen call length never reached the server — every buyer gets the default price"
    ).toBe(OTHER_OPTION.id);
    // The rest of the body still has to arrive with it.
    expect(posted[0].body).toMatchObject({
      email: "dana@example.com",
      consentChecked: true,
    });
  });

  it("sends the default duration when the buyer changes nothing", async () => {
    const { container } = renderForm();
    submitForm(container);

    expect(posted.length).toBe(1);
    expect(
      posted[0].body.duration,
      "an untouched form posts no length at all, or the wrong one"
    ).toBe(DEFAULT_CALL_OPTION_ID);
  });

  it("refuses to post at all without consent", async () => {
    // Unchanged behaviour, asserted because the duration field was added to the
    // same state object the consent flag lives in.
    const { container } = renderForm();
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Dana Okafor" },
    });
    fireEvent.submit(container.querySelector("form")!);

    expect(posted).toEqual([]);
    expect(container.textContent).toMatch(/please confirm/i);
  });
});
