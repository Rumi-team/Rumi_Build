import { describe, expect, it } from "vitest";
import { CAL_LINK, CALENDLY_URL, CAL_LINK_60MIN, CALENDLY_URL_60MIN } from "@/lib/data";

// ── Why this file exists ──────────────────────────────────────────────────────
// On 2026-08-05 the Cal.com profile username was renamed from `rumi-app` to
// `rumi-ai` in the Cal.com dashboard. Cal.com does not redirect the old handle,
// so https://cal.com/rumi-app/30-min-meeting started answering 404 the instant
// it changed — and CAL_LINK, a string in this repo, still said `rumi-app`.
//
// The page that broke is /book/success: the one a customer sees AFTER their
// card has been charged. They paid, landed on "One last step — pick your time",
// and the calendar had nothing to render.
//
// NOTHING HERE CAN CATCH THAT, and it is worth being honest about why: the
// username half of this slug lives in someone else's dashboard, and no offline
// assertion can know it was renamed. Only a live request to cal.com can, and
// this suite does not make network calls.
//
// What these cases DO catch is the class of mistake that made the rename worse
// than it had to be: two independent literals holding the same slug, so a fix
// applied to one and missed on the other sends the inline embed and the
// open-in-a-new-tab link to different calendars. CALENDLY_URL is derived from
// CAL_LINK now, and the first case is what stops anyone un-deriving it.

const CAL_HOST = "https://cal.com/";

describe("the Cal.com slug has one source", () => {
  it("derives the full URL from the slug rather than restating it", async () => {
    // Pins the derivation itself. Written as a composition rather than a
    // literal so it keeps holding through the next rename: the point is that
    // the two agree, not what today's slug happens to be.
    expect(CALENDLY_URL).toBe(`${CAL_HOST}${CAL_LINK}`);
  });

  it("derives the 60-minute URL the same way, or leaves both empty together", async () => {
    // Both branches are asserted even though only the non-empty one executes
    // today: CAL_LINK_60MIN is a hardcoded slug now, not env-sourced, so ""
    // is a state the code still supports but no configuration reaches. Kept
    // because half-empty is what would actually hurt — a link to
    // "https://cal.com/" is a live URL pointing at nothing in particular.
    if (CAL_LINK_60MIN === "") {
      expect(CALENDLY_URL_60MIN).toBe("");
    } else {
      expect(CALENDLY_URL_60MIN).toBe(`${CAL_HOST}${CAL_LINK_60MIN}`);
    }
  });
});

describe("the Cal.com slug is shaped like a slug", () => {
  it("is a bare username/event pair, not a URL", async () => {
    // CalEmbed interpolates this into https://cal.com/<CAL_LINK>. A value that
    // already carried the scheme would build "https://cal.com/https://cal.com/…"
    // — which is a 404 that looks like a typo in the calendar, not in the code.
    expect(CAL_LINK).not.toMatch(/^https?:\/\//);
    expect(CAL_LINK.startsWith("/")).toBe(false);
    expect(CAL_LINK.endsWith("/")).toBe(false);
  });

  it("names exactly one username and one event type", async () => {
    const parts = CAL_LINK.split("/");
    expect(parts, `CAL_LINK is "${CAL_LINK}" — expected "<username>/<event>"`).toHaveLength(2);
    const [username, event] = parts;
    expect(username.length).toBeGreaterThan(0);
    expect(event.length).toBeGreaterThan(0);
    // Cal.com handles and event slugs are lowercase kebab. An uppercase or
    // space-carrying value survives every check above and still 404s.
    expect(username).toMatch(/^[a-z0-9-]+$/);
    expect(event).toMatch(/^[a-z0-9-]+$/);
  });

  it("does not point at anything Cal.com has already 404'd", async () => {
    // The one place that names literals, deliberately. These are not stale
    // values we might reasonably return to — they are URLs Cal.com now answers
    // 404 for, and re-introducing either takes the post-payment calendar down.
    // Both were verified dead by hand on 2026-08-05, the day each was replaced.
    const DEAD = [
      "rumi-app", // the account handle, renamed to rumi-ai
      "30-min-meeting", // the event type, replaced by call-30min
    ];
    const slugs = [CAL_LINK, CAL_LINK_60MIN].filter(Boolean);
    // Guard the walker (TESTING.md): this case filters before it asserts, so an
    // edit that emptied both constants would leave the loop body unentered and
    // this regression check passing on zero assertions.
    expect(
      slugs.length,
      "both slugs are empty — the dead-handle check asserted nothing"
    ).toBeGreaterThan(0);
    for (const slug of slugs) {
      for (const dead of DEAD) {
        expect(
          slug.split("/"),
          `"${slug}" contains "${dead}", which Cal.com no longer resolves`
        ).not.toContain(dead);
      }
    }
  });

  it("gives the two lengths different event types", async () => {
    // A 30-minute slot booked against a 60-minute purchase looks like it
    // worked and is discovered by the customer, on the call. price-copy.test.ts
    // checks this off CALL_OPTIONS; this checks the constants those read from,
    // so a copy-paste while wiring a new event type fails here first.
    if (CAL_LINK_60MIN !== "") {
      expect(CAL_LINK_60MIN).not.toBe(CAL_LINK);
      expect(CALENDLY_URL_60MIN).not.toBe(CALENDLY_URL);
    }
  });
});
