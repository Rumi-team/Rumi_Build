import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { AI_EMPLOYEES, VERTICALS } from "@/lib/data";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { LLMS_FULL_TXT, LLMS_TXT } from "@/lib/llms-content";

// ── Why this file exists ──────────────────────────────────────────────────────
// Three surfaces TELL something else where to go, and none of them was checked
// against the routes that exist: robots.txt, the two llms.txt files, and the 404
// page's recovery links. tests/unit/routing.test.ts does exactly this job for
// vercel.json and the sitemap; these three were outside its walk.
//
// Each one names URLs as hand-written literal strings, and this diff moved a lot
// of URLs: three routes retired into 308 stubs, /api/evaluate deleted, and
// /services turned from a catch-all redirect into five fixed slugs that hard-404
// on anything else. A stale link in any of the three is silent — the build
// passes, the pages render, and only the crawler (or the person who just hit a
// 404) finds out.
//
// The other half is the host. robots.ts hardcodes it in its `sitemap` field,
// sitemap.ts hardcodes it again in BASE, layout.tsx a third time in
// metadataBase, and llms-content.ts a fourth in every link it writes. Nothing
// here picks which host is right — it only requires the four to agree, so moving
// the site stays one decision instead of three silent disagreements.

const ROOT = process.cwd();
const APP = join(ROOT, "src", "app");

const LAYOUT = readFileSync(join(APP, "layout.tsx"), "utf8");
const BASE = LAYOUT.match(/metadataBase:\s*new URL\("([^"]+)"\)/)![1].replace(
  /\/$/,
  ""
);

type Redirect = { source: string; destination: string };
const REDIRECTS: Redirect[] = JSON.parse(
  readFileSync(join(ROOT, "vercel.json"), "utf8")
).redirects;
const REDIRECTED = new Set(REDIRECTS.map((r) => r.source));

/** The page file behind a path, with `[slug]` resolved from the data. */
function pageFile(path: string): string | null {
  const direct = join(APP, path, "page.tsx");
  if (existsSync(direct)) return direct;
  for (const [prefix, slugs] of [
    ["/services/", AI_EMPLOYEES.map((r) => r.slug)],
    ["/industries/", VERTICALS.map((v) => v.slug)],
  ] as const) {
    if (path.startsWith(prefix) && slugs.includes(path.slice(prefix.length))) {
      return join(APP, prefix, "[slug]", "page.tsx");
    }
  }
  return null;
}

/**
 * How a path answers: a page a visitor lands on, a redirect stub that resolves
 * but renders nothing, a route handler (/llms.txt has no page.tsx), or nothing.
 */
function resolves(path: string): "page" | "stub" | "handler" | null {
  if (existsSync(join(APP, path, "route.ts"))) return "handler";
  const file = pageFile(path);
  if (file === null) return null;
  // Comments stripped for the same reason routing.test.ts strips them: each of
  // these stubs explains at length why it is a redirect, and the prose would be
  // read as the code.
  const code = readFileSync(file, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");
  return /\b(?:permanentRedirect|redirect)\(/.test(code) ? "stub" : "page";
}

describe("the resolver these checks are built on", () => {
  it("tells a page, a stub, a route handler and a 404 apart", () => {
    // Guards `resolves`: a resolver that answered "page" for everything would
    // make all three checks below pass on any input, and one that answered null
    // for everything would fail them for the wrong reason.
    expect(resolves("/"), "the homepage").toBe("page");
    expect(resolves("/services"), "the AI Employees hub").toBe("page");
    expect(resolves(`/services/${AI_EMPLOYEES[0].slug}`)).toBe("page");
    expect(resolves(`/industries/${VERTICALS[0].slug}`)).toBe("page");
    // The three routes this diff retired: they resolve, but they render nothing.
    for (const retired of ["/audit", "/evaluate", "/chief-of-staff"]) {
      expect(resolves(retired), `${retired} is no longer a redirect stub`).toBe(
        "stub"
      );
    }
    // No page.tsx, but a real URL — the case a page-only walk cannot see.
    expect(resolves("/llms.txt"), "/llms.txt has no route handler").toBe("handler");
    expect(resolves("/services/not-a-real-role")).toBeNull();
    expect(resolves("/api/evaluate"), "the deleted API route is back").toBeNull();
  });
});

describe("robots.txt", () => {
  const ROBOTS = robots();

  it("advertises the sitemap on the same host the sitemap is built on", () => {
    expect(ROBOTS.sitemap, "robots.txt advertises no sitemap").toBeTypeOf("string");
    expect(
      ROBOTS.sitemap,
      `robots.txt advertises a sitemap on a host metadataBase does not use (${BASE})`
    ).toBe(`${BASE}/sitemap.xml`);

    // And the file it names is the one this build emits, entry for entry.
    const entries = sitemap();
    expect(entries.length).toBeGreaterThan(10);
    const offHost = entries
      .map((e) => e.url)
      .filter((url) => !url.startsWith(`${BASE}/`));
    expect(
      offHost,
      "robots.txt and the sitemap entries disagree about the host"
    ).toEqual([]);
  });

  it("only invites crawlers to paths that answer", () => {
    // `allow` names /llms.txt and /llms-full.txt directly. Both are route
    // handlers with no page.tsx, so the route walk in routing.test.ts cannot see
    // them — a renamed or deleted handler leaves robots.txt pointing the exact
    // crawlers this site is written for at a 404.
    const rules = Array.isArray(ROBOTS.rules) ? ROBOTS.rules : [ROBOTS.rules];
    const allowed = rules
      .flatMap((rule) => (Array.isArray(rule.allow) ? rule.allow : [rule.allow]))
      .filter((path): path is string => typeof path === "string");

    expect(allowed, "robots.txt allows nothing — re-anchor this test").not.toEqual(
      []
    );
    expect(allowed, "the llms.txt surfaces are no longer advertised").toContain(
      "/llms.txt"
    );

    for (const path of allowed) {
      if (path.endsWith("*")) continue;
      const answer = resolves(path);
      expect(
        answer,
        `robots.txt allows ${path}, which has no page and no route handler`
      ).not.toBeNull();
      expect(
        answer,
        `robots.txt allows ${path}, which renders nothing — it is a redirect stub`
      ).not.toBe("stub");
      expect(
        REDIRECTED.has(path),
        `robots.txt allows ${path}, which the edge answers with a 308`
      ).toBe(false);
    }
  });
});

describe("llms.txt and llms-full.txt", () => {
  // Every absolute URL in the two files, trailing sentence punctuation trimmed.
  const urls = [
    ...`${LLMS_TXT}\n${LLMS_FULL_TXT}`.matchAll(/https:\/\/[^\s)\]]+/g),
  ].map((m) => m[0].replace(/[.,]+$/, ""));
  const internal = urls.filter(
    (url) => url === BASE || url.startsWith(`${BASE}/`)
  );

  it("links enough of this site for the check below to mean something", () => {
    // Guards the extraction: a regex that stopped matching, or a host that moved
    // in llms-content but not in metadataBase, empties `internal` and every
    // assertion in the next case passes vacuously.
    expect(
      internal.length,
      "no links to this site found in llms-content — re-anchor this test"
    ).toBeGreaterThan(8);
    for (const role of AI_EMPLOYEES) {
      expect(internal, `llms.txt no longer links ${role.slug}`).toContain(
        `${BASE}/services/${role.slug}`
      );
    }
    // The nav-level destinations, which nothing else in the suite reads.
    for (const path of ["/services", "/industries", "/book", "/team", "/faq"]) {
      expect(internal, `llms.txt no longer links ${path}`).toContain(
        `${BASE}${path}`
      );
    }
  });

  it("keeps every one of those links on a URL that still resolves", () => {
    // llms-content.ts calls itself the source of truth for AI agents and writes
    // its links as absolute literals derived from nothing. A link to
    // /chief-of-staff or /audit would send every citing engine through a 308,
    // and one to /evaluate through a 308 to a page that never mentions it.
    const broken: string[] = [];
    for (const url of new Set(internal)) {
      const path = url === BASE ? "/" : url.slice(BASE.length);
      const answer = resolves(path);
      if (REDIRECTED.has(path)) {
        broken.push(`${path} — the edge answers this with a 308`);
      } else if (answer === null) {
        broken.push(`${path} — 404s: no page and no route handler`);
      } else if (answer === "stub") {
        broken.push(`${path} — a retired route that renders nothing`);
      }
    }
    expect(
      broken,
      "llms-content links a URL that redirects or 404s, and AI engines cite this file verbatim"
    ).toEqual([]);
  });
});

describe("the 404 page's recovery links", () => {
  it("sends people somewhere that renders", () => {
    // not-found.tsx has no page.tsx, so routing.test.ts's walk never sees it,
    // and it is served for every unmatched URL on the site. Its four
    // hand-written hrefs are the only way out of a dead link — a stale one turns
    // one recoverable 404 into two. /services is the pointed case: it was a
    // redirect stub before this diff and is the page the 404 leads with now.
    const source = readFileSync(join(APP, "not-found.tsx"), "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "");
    const hrefs = [...source.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);

    expect(
      hrefs.length,
      "the 404 page offers no way out — re-anchor this test"
    ).toBeGreaterThanOrEqual(4);

    for (const href of hrefs) {
      expect(href, `${href} is not a root-relative path`).toMatch(/^\//);
      expect(
        resolves(href),
        `the 404 page sends people to ${href}, which does not render`
      ).toBe("page");
      expect(
        REDIRECTED.has(href),
        `the 404 page sends people to ${href}, which the edge answers with a 308`
      ).toBe(false);
    }
    // The two destinations the page exists to offer: the hub the whole site now
    // leads with, and the only page that converts.
    expect(hrefs, "the 404 page no longer offers the AI Employees hub").toContain(
      "/services"
    );
    expect(hrefs, "the 404 page no longer offers the booking path").toContain(
      "/book"
    );
  });
});
