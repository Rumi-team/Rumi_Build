import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { AI_EMPLOYEES, VERTICALS } from "@/lib/data";
import sitemap from "@/app/sitemap";

// ── Why this file exists ──────────────────────────────────────────────────────
// /services and /services/<slug> used to be `redirect()` stubs that swallowed
// every URL under them; they are real pages now, and `dynamicParams = false`
// means anything outside the five role slugs 404s at the routing layer. That
// moves three failure modes from "impossible" to "one edit away", and none of
// them shows up as a failing build:
//   1. A vercel.json redirect whose destination is a page that no longer exists,
//      or that is itself a redirect (a 308 chain, or a loop).
//   2. A redirect SOURCE that shadows a real page — the edge answers first, so
//      the page is unreachable in production but perfect in `next start`.
//   3. A sitemap that advertises a URL which redirects, 404s, or was never
//      supposed to be indexed.
// Everything below is walked out of the filesystem, the data, and vercel.json
// rather than restated, so a new page or a renamed role keeps it honest.

const ROOT = process.cwd();
const APP = join(ROOT, "src", "app");

// The only dynamic segments in the app. Anything else appearing under src/app
// fails the guard below rather than being silently skipped by the walk.
const DYNAMIC_SEGMENTS: Record<string, string[]> = {
  "/services/[slug]": AI_EMPLOYEES.map((r) => r.slug),
  "/industries/[slug]": VERTICALS.map((v) => v.slug),
};

type Route = { path: string; file: string; stub: boolean };

/** Every route with a page.tsx, `[slug]` expanded from the data that fills it. */
function walk(dir: string, prefix = ""): Route[] {
  const out: Route[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      out.push(...walk(join(dir, entry.name), `${prefix}/${entry.name}`));
      continue;
    }
    if (entry.name !== "page.tsx") continue;
    const file = join(dir, entry.name);
    // A `redirect()` stub is a route that resolves but never renders. It is a
    // legitimate redirect source and an illegitimate redirect destination.
    const stub = /\bredirect\(/.test(readFileSync(file, "utf8"));
    const template = prefix || "/";
    const expansion = DYNAMIC_SEGMENTS[template];
    if (expansion) {
      for (const slug of expansion) {
        out.push({ path: template.replace("[slug]", slug), file, stub });
      }
    } else {
      out.push({ path: template, file, stub });
    }
  }
  return out;
}

const ROUTES = walk(APP);
const BY_PATH = new Map(ROUTES.map((r) => [r.path, r]));
/** Routes that actually render something a visitor can land on. */
const LIVE = ROUTES.filter((r) => !r.stub).map((r) => r.path);
const STUBS = ROUTES.filter((r) => r.stub).map((r) => r.path);

type Redirect = { source: string; destination: string; permanent?: boolean };
const REDIRECTS: Redirect[] = JSON.parse(
  readFileSync(join(ROOT, "vercel.json"), "utf8")
).redirects;

const LAYOUT = readFileSync(join(APP, "layout.tsx"), "utf8");

/** Every `id="…"` in src/ — the anchors a `/#fragment` destination can land on. */
const ANCHORS = (() => {
  const out = new Set<string>();
  const scan = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(full);
        continue;
      }
      if (!/\.tsx?$/.test(entry.name)) continue;
      for (const m of readFileSync(full, "utf8").matchAll(/\bid="([^"{}]+)"/g)) {
        out.add(m[1]);
      }
    }
  };
  scan(join(ROOT, "src"));
  return out;
})();

describe("the route table the walk is built from", () => {
  it("found every page and classified the redirect stubs correctly", () => {
    // Guards the walker: every assertion in this file reads "nothing wrong"
    // if this comes back empty or misclassified.
    expect(ROUTES.length).toBeGreaterThan(15);
    for (const path of ["/", "/services", "/industries", "/book", "/faq"]) {
      expect(LIVE, `${path} is a real page`).toContain(path);
    }
    for (const role of AI_EMPLOYEES) {
      expect(LIVE, `${role.slug} has no page`).toContain(`/services/${role.slug}`);
    }
    for (const vertical of VERTICALS) {
      expect(LIVE).toContain(`/industries/${vertical.slug}`);
    }
    // This diff retired all three of these into `redirect()` one-liners.
    expect(STUBS.slice().sort()).toEqual(["/audit", "/chief-of-staff", "/evaluate"]);

    // A retired page is redirected TWICE: once at the edge by vercel.json and
    // once by the Next stub, which the comments call the backstop for the day
    // the edge rule is removed. Two layers means two chances to disagree, and a
    // visitor only ever sees one of them — so the backstop can rot unnoticed.
    const edge = new Map(REDIRECTS.map((r) => [r.source, r.destination]));
    for (const stub of STUBS) {
      const source = readFileSync(BY_PATH.get(stub)!.file, "utf8");
      const target = source.match(/\bredirect\("([^"]+)"\)/)?.[1];
      expect(target, `${stub} calls redirect() with no literal target`).toBeTypeOf(
        "string"
      );
      expect(LIVE, `${stub} redirects to ${target}, which does not render`).toContain(
        target
      );
      if (edge.has(stub)) {
        expect(
          target,
          `${stub}: the Next stub and the vercel.json rule disagree`
        ).toBe(edge.get(stub));
      }
    }
    // No route group, parallel route, or private folder the walk would mangle.
    for (const route of ROUTES) {
      expect(route.path, "unexpanded or grouped segment").not.toMatch(/[[(@]/);
    }
    expect(ANCHORS.size).toBeGreaterThan(3);
  });
});

describe("vercel.json redirects", () => {
  it("declares each source once, root-relative and permanent", () => {
    const sources = REDIRECTS.map((r) => r.source);
    expect(sources.length).toBeGreaterThan(20);
    const duplicated = sources.filter((s, i) => sources.indexOf(s) !== i);
    expect(duplicated, "a later rule shadows an earlier one").toEqual([]);
    for (const rule of REDIRECTS) {
      expect(rule.source, `${rule.source} is not root-relative`).toMatch(/^\//);
      expect(
        rule.permanent,
        `${rule.source} is a temporary redirect — retired URLs are 308s`
      ).toBe(true);
    }
  });

  it("sends every redirect to a page that actually renders", () => {
    const dangling = REDIRECTS.filter((rule) => {
      const [path, fragment] = rule.destination.split("#");
      const target = path === "" ? "/" : path;
      if (!LIVE.includes(target)) return true;
      return fragment !== undefined && !ANCHORS.has(fragment);
    }).map((rule) => `${rule.source} -> ${rule.destination}`);
    expect(
      dangling,
      "redirect destination is a 404, a redirect stub, or a missing anchor"
    ).toEqual([]);
  });

  it("never chains one redirect into another", () => {
    // Two hops cost a round trip and lose link equity; a cycle is a redirect
    // loop the edge answers with an error. Both shipped here before: on the
    // previous revision /services/document-processing pointed at
    // /chief-of-staff, which was itself redirected away.
    const sources = new Set(REDIRECTS.map((r) => r.source));
    const chained = REDIRECTS.filter((rule) =>
      sources.has(rule.destination.split("#")[0])
    ).map((rule) => `${rule.source} -> ${rule.destination}`);
    expect(chained, "redirect destination is itself redirected").toEqual([]);
  });

  it("never shadows a page a visitor is supposed to reach", () => {
    // The edge answers before Next does, so a source that matches a live route
    // makes that page unreachable in production while `next start` and the e2e
    // suite both serve it happily. The three retired stubs are deliberate: they
    // resolve to the same destination as the edge rule, as a backstop.
    const shadowed = REDIRECTS.map((r) => r.source)
      .filter((source) => LIVE.includes(source))
      .map((source) => `${source} (renders ${BY_PATH.get(source)!.file})`);
    expect(shadowed, "a redirect makes a real page unreachable").toEqual([]);
  });

  it("keeps every legacy URL that used to resolve still resolving", () => {
    // Pinned from the previous revision of vercel.json plus the /services/<x>
    // catch-all that `redirect()` stub used to provide. Each of these was a
    // working URL before /services became a real segment with
    // `dynamicParams = false`; without a rule here each one now 404s.
    const WAS_REACHABLE = [
      "/pricing",
      "/sprint",
      "/deposit",
      "/automation",
      "/chief-of-staff",
      "/services/rag-knowledge-systems",
      "/services/agentic-ai",
      "/services/document-processing",
      "/services/ai-analytics",
      "/services/ai-strategy",
      "/services/ai-marketing",
      "/services/voice-ai",
      "/services/web-mobile-apps",
      "/services/workflow-automation",
      "/services/chief-of-operations",
      "/services/chief-of-staff",
      // Destinations of the old rules above, so they were reachable too.
      "/services/chief-of-customer-service",
      "/services/chief-of-marketing",
      // The retired lead-gen service page, which the old stub sent to
      // /industries. It is still a SERVICES slug, so the URL is still in the
      // wild, and /services/[slug] only knows the five role slugs.
      "/services/persian-leads",
    ];
    const sources = new Set(REDIRECTS.map((r) => r.source));
    const lost = WAS_REACHABLE.filter(
      (path) => !sources.has(path) && !LIVE.includes(path)
    );
    expect(lost, "URL that used to resolve now 404s with no redirect").toEqual([]);
  });
});

describe("sitemap.xml", () => {
  const ENTRIES = sitemap();
  const BASE = LAYOUT.match(/metadataBase:\s*new URL\("([^"]+)"\)/)![1].replace(
    /\/$/,
    ""
  );
  const paths = ENTRIES.map((e) => e.url.replace(BASE, ""));

  it("submits every URL on the canonical host, once", () => {
    expect(ENTRIES.length).toBeGreaterThan(10);
    for (const entry of ENTRIES) {
      expect(
        entry.url.startsWith(`${BASE}/`),
        `${entry.url} is not on the metadataBase host (${BASE})`
      ).toBe(true);
    }
    const duplicated = paths.filter((p, i) => paths.indexOf(p) !== i);
    expect(duplicated, "the same URL is submitted twice").toEqual([]);
  });

  it("derives the role and industry URLs from the data that builds the pages", () => {
    // generateStaticParams reads the same two arrays, so deriving here is what
    // stops the sitemap from advertising a role page that was never prerendered.
    for (const role of AI_EMPLOYEES) {
      expect(paths, `${role.slug} is missing from the sitemap`).toContain(
        `/services/${role.slug}`
      );
    }
    for (const vertical of VERTICALS) {
      expect(paths).toContain(`/industries/${vertical.slug}`);
    }
    expect(paths.filter((p) => p.startsWith("/services/"))).toHaveLength(
      AI_EMPLOYEES.length
    );
    expect(paths.filter((p) => p.startsWith("/industries/"))).toHaveLength(
      VERTICALS.length
    );
  });

  it("submits only URLs that render, and never one that redirects", () => {
    const bad = paths.filter((p) => !LIVE.includes(p));
    expect(bad, "sitemap URL 404s or is a redirect stub").toEqual([]);

    const redirected = new Set(REDIRECTS.map((r) => r.source));
    const advertised = paths.filter((p) => redirected.has(p));
    expect(
      advertised,
      "sitemap submits a URL the edge answers with a 308"
    ).toEqual([]);
  });

  it("leaves out every page deliberately kept out of the index", () => {
    // Each exclusion is a decision, and each one has to stay a real route or
    // the list is rotting: /schedule duplicates /book's Cal.com embed,
    // /workplace is unindexed hiring copy, /book/success is post-payment,
    // /terms and /privacy are boilerplate.
    const EXCLUDED = [
      "/schedule",
      "/workplace",
      "/book/success",
      "/terms",
      "/privacy",
    ];
    for (const path of EXCLUDED) {
      expect(LIVE, `${path} is gone — prune the exclusion list`).toContain(path);
      expect(paths, `${path} is not supposed to be indexed`).not.toContain(path);
    }
    // Every live route is either submitted or deliberately excluded. A new page
    // added without a sitemap decision fails here instead of going uncrawled.
    const undecided = LIVE.filter(
      (p) => !paths.includes(p) && !EXCLUDED.includes(p)
    );
    expect(undecided, "live page is neither in the sitemap nor excluded").toEqual(
      []
    );

    // sitemap.ts says the hub "now ranks just under the homepage", which
    // nothing enforced.
    const priority = new Map(paths.map((p, i) => [p, ENTRIES[i].priority!]));
    for (const entry of ENTRIES) {
      expect(entry.priority, `${entry.url} priority`).toBeGreaterThan(0);
      expect(entry.priority).toBeLessThanOrEqual(1);
    }
    expect(priority.get("/")).toBe(1);
    const top = Math.max(
      ...paths.filter((p) => p !== "/").map((p) => priority.get(p)!)
    );
    expect(priority.get("/services"), "the hub is not the highest-ranked page").toBe(
      top
    );
  });
});
