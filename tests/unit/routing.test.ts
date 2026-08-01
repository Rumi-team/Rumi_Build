import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
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
    // A redirect stub is a route that resolves but never renders. It is a
    // legitimate redirect source and an illegitimate redirect destination.
    // Both spellings count as a stub on purpose: a stub that downgraded to the
    // temporary `redirect()` has to stay in this list so the check below can
    // name the problem, rather than dropping out and being reclassified as a
    // live page (which would fail somewhere unrelated and unhelpful).
    // Comments stripped so a page that only DISCUSSES redirects (these stubs
    // all explain themselves at length) is classified on its code alone.
    const code = readFileSync(file, "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "");
    const stub = /\b(?:permanentRedirect|redirect)\(/.test(code);
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

const SRC = join(ROOT, "src");

/**
 * Every `id="…"` in src/, mapped to the files that declare it.
 *
 * The files matter. Asking only "does this anchor exist anywhere under src/"
 * answers a question nobody has: `/services/web-mobile-apps -> /#extras` is
 * correct only if `id="extras"` is rendered BY THE HOMEPAGE. An id that lives in
 * a component the homepage does not render still satisfies a set membership
 * test, and the visitor still lands at the top of an unscrolled page — which is
 * the whole failure this check exists to catch. So the destination route's own
 * import graph is what gets searched, below.
 */
const ANCHOR_FILES = (() => {
  const out = new Map<string, string[]>();
  const scan = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(full);
        continue;
      }
      if (!/\.tsx?$/.test(entry.name)) continue;
      for (const m of readFileSync(full, "utf8").matchAll(/\bid="([^"{}]+)"/g)) {
        out.set(m[1], [...(out.get(m[1]) ?? []), full]);
      }
    }
  };
  scan(SRC);
  return out;
})();

/** `@/x` and `./x` to a file on disk; bare specifiers (node_modules) to null. */
function resolveImport(spec: string, fromFile: string): string | null {
  let base: string;
  if (spec.startsWith("@/")) base = join(SRC, spec.slice(2));
  else if (spec.startsWith(".")) base = join(dirname(fromFile), spec);
  else return null;
  for (const candidate of [
    base,
    `${base}.tsx`,
    `${base}.ts`,
    join(base, "index.tsx"),
    join(base, "index.ts"),
  ]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

/** Every file reachable from `entry` through static imports, entry included. */
function importClosure(entry: string): Set<string> {
  const seen = new Set<string>();
  const queue = [entry];
  while (queue.length > 0) {
    const file = queue.pop()!;
    if (seen.has(file)) continue;
    seen.add(file);
    for (const [, spec] of readFileSync(file, "utf8").matchAll(
      /\bfrom\s+["']([^"']+)["']/g
    )) {
      const resolved = resolveImport(spec, file);
      if (resolved !== null) queue.push(resolved);
    }
  }
  return seen;
}

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
      // Comments stripped: every one of these stubs explains in prose why it
      // is not a plain `redirect()`, and the negative check below would read
      // that explanation as the thing it forbids.
      const source = readFileSync(BY_PATH.get(stub)!.file, "utf8")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/.*$/gm, "");
      // `redirect()` from next/navigation is a 307 TEMPORARY — it tells search
      // engines to keep the old URL indexed and to keep the link equity there.
      // A retired route is a 308, which is `permanentRedirect()`. The two
      // differ by one identifier and behave identically in a browser, so
      // nothing but this notices a downgrade. The vercel.json rule beside each
      // of these already says `"permanent": true`; this keeps the Next backstop
      // from silently disagreeing with it.
      expect(
        source,
        `${stub} uses redirect() — a 307 Temporary. Retired URLs are 308s: use permanentRedirect().`
      ).toMatch(/\bpermanentRedirect\(/);
      expect(
        source,
        `${stub} still calls the temporary redirect() somewhere`
      ).not.toMatch(/\bredirect\(/);

      const target = source.match(/\bpermanentRedirect\("([^"]+)"\)/)?.[1];
      expect(
        target,
        `${stub} calls permanentRedirect() with no literal target`
      ).toBeTypeOf("string");
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
    expect(ANCHOR_FILES.size).toBeGreaterThan(3);
  });

  it("resolves a page's import graph, so the anchor check is not vacuous", () => {
    // Guards importClosure: if it ever returns just the entry file (a broken
    // alias resolution, say), the fragment assertion below starts failing for
    // the wrong reason — or, if it over-collects, stops failing at all.
    const home = importClosure(BY_PATH.get("/")!.file);
    expect(home, "the homepage does not reach its own sections").toContain(
      join(SRC, "components", "extras.tsx")
    );
    expect(home).toContain(join(SRC, "components", "hero.tsx"));
    // Transitive, not just direct: page.tsx imports extras.tsx, which imports
    // service-card.tsx.
    expect(home, "the walk stops at direct imports").toContain(
      join(SRC, "components", "service-card.tsx")
    );
    // And bounded — it is a page's graph, not "every file in src/".
    expect(home).not.toContain(join(SRC, "app", "faq", "page.tsx"));
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
      if (fragment === undefined) return false;
      // Scoped to the destination page's own import graph: an `id` that exists
      // somewhere in src/ but is not rendered by THIS route drops the visitor
      // at the top of a page with nothing to scroll to, which is the same
      // broken landing as a missing anchor. /services/web-mobile-apps ->
      // /#extras is the live case, and #extras moved file (and component name)
      // in this diff.
      const declaredIn = ANCHOR_FILES.get(fragment);
      if (declaredIn === undefined) return true;
      const rendered = importClosure(BY_PATH.get(target)!.file);
      return !declaredIn.some((file) => rendered.has(file));
    }).map((rule) => `${rule.source} -> ${rule.destination}`);
    expect(
      dangling,
      "redirect destination is a 404, a redirect stub, or an anchor the destination page never renders"
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
    // A PINNED SAMPLE, not the complete set. Each of these was a working URL
    // before /services became a real segment with `dynamicParams = false`, and
    // without a rule here each one now 404s — so the list is worth keeping. But
    // what it stands in for was an OPEN catch-all: the old `redirect()` stub
    // swallowed /services/<anything>, so the URLs that were reachable are
    // whatever was ever linked, indexed, emailed, or typed, which no closed list
    // can enumerate. These are the ones recoverable from the previous revision
    // of vercel.json and its destinations.
    //
    // Treat 404s in production analytics and Search Console as the real source:
    // when one turns up, add the path here along with its redirect rule, rather
    // than assuming the absence of an entry means the URL never existed.
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

describe("canonical URLs", () => {
  // `alternates` is inherited from the root layout wholesale, exactly like
  // `title` and `openGraph`. The layout declares canonical "/", so a page that
  // does not declare its own tells Google it IS the homepage and gets
  // consolidated away — which is strictly worse than the no-canonical-anywhere
  // state this replaced. The layout's default and the per-page overrides are
  // one change, and this is what keeps them one change.
  const CANONICAL = /alternates:\s*\{[^}]*\bcanonical:/;
  const FILES = [join(APP, "layout.tsx"), ...new Set(ROUTES.map((r) => r.file))];

  /**
   * A page file with its comments stripped, for the same reason the redirect
   * walk above strips them: these metadata blocks explain themselves at length
   * and quote the very syntax the checks below look for. /schedule's comment
   * records that it USED to declare `canonical: "/book"` and why that was
   * removed — read as code, that comment reintroduces the exact defect it
   * documents.
   */
  const codeOf = (file: string) =>
    readFileSync(file, "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "");

  /**
   * Routes whose page declares `robots: { index: false … }`.
   *
   * The canonical and og rules below split on this, so it is derived from the
   * source rather than listed: a page flipped to noindex changes which rule
   * applies to it, and a hand-written list would keep applying the old one.
   */
  const NOINDEX = new Set(
    LIVE.filter((path) =>
      /robots:\s*\{[^}]*\bindex:\s*false\b/.test(
        codeOf(BY_PATH.get(path)!.file)
      )
    )
  );

  /** The `<key>: { … }` object literal of a metadata export, brace-matched. */
  function metadataBlock(source: string, key: "openGraph" | "twitter"): string | null {
    const at = source.search(new RegExp(`\\b${key}:\\s*\\{`));
    if (at === -1) return null;
    const open = source.indexOf("{", at);
    let depth = 0;
    for (let i = open; i < source.length; i++) {
      if (source[i] === "{") depth++;
      else if (source[i] === "}" && --depth === 0) return source.slice(open, i + 1);
    }
    return null;
  }
  const openGraphBlock = (source: string) => metadataBlock(source, "openGraph");

  it("found the noindex pages the two rules below split on", () => {
    // Guards NOINDEX: an empty set makes the canonical rule apply to every page
    // (which would fail loudly) but makes the noindex-canonical rule below pass
    // vacuously, which would not.
    expect([...NOINDEX].sort()).toEqual(["/book/success", "/schedule", "/workplace"]);
  });

  it("declares one on the root layout, relative so metadataBase resolves it", () => {
    expect(LAYOUT, "the root layout declares no canonical").toMatch(CANONICAL);

    // A sibling site ships the same role slugs under the same hardcoded host,
    // and nothing in this checkout settles which domain it deploys to — so a
    // canonical that names a domain is a canonical pointing at the other site
    // the day this one moves.
    //
    // `openGraph.url` is checked here for the same reason and against the same
    // files. The per-page og check further down walks LIVE routes only, and the
    // root layout has no page.tsx — so the layout's og:url, which EVERY page
    // without its own openGraph block inherits, was the one place a literal
    // host could sit unguarded. It did: `url: "https://rumi.build"` outlived
    // every other hardcoded host on the branch.
    let found = 0;
    let ogFound = 0;
    for (const file of FILES) {
      const code = codeOf(file);
      for (const [, url] of code.matchAll(/canonical:\s*[`"']([^`"']*)/g)) {
        found++;
        expect(url, `${file} hardcodes a host in its canonical`).toMatch(/^\//);
      }
      // Scoped to the openGraph object: `url:` is a common key (the `images`
      // entries carry one too, and /book has Stripe URLs elsewhere in the
      // file), so a file-wide search for it would fail on values that are
      // supposed to be absolute.
      const block = openGraphBlock(code);
      if (block === null) continue;
      const og = block.match(/\burl:\s*[`"']([^`"']*)/)?.[1];
      expect(og, `${file} declares openGraph with no url`).toBeTypeOf("string");
      ogFound++;
      expect(og, `${file} hardcodes a host in its openGraph url`).toMatch(/^\//);
    }
    expect(found, "no canonical anywhere — re-anchor this test").toBeGreaterThan(5);
    expect(
      ogFound,
      "no openGraph url anywhere — re-anchor this test"
    ).toBeGreaterThan(5);
    // The layout specifically, since it is the file the loop above exists for
    // and the only one not covered by the LIVE-route walk below.
    expect(
      openGraphBlock(codeOf(join(APP, "layout.tsx")))?.match(
        /\burl:\s*[`"']([^`"']*)/
      )?.[1],
      "the root layout declares no openGraph url"
    ).toMatch(/^\//);
  });

  it("gives every INDEXABLE page that renders its own, so none inherits the homepage's", () => {
    // "/" is the homepage and correctly takes the layout's. Redirect stubs
    // never render, so they never emit a <head>. Noindex pages are handled by
    // the case below — a page that asks not to be indexed has nothing to
    // consolidate, and declaring a canonical on one is the defect, not the fix.
    const inheriting = LIVE.filter((path) => path !== "/")
      .filter((path) => !NOINDEX.has(path))
      .filter((path) => !CANONICAL.test(codeOf(BY_PATH.get(path)!.file)));
    expect(
      inheriting,
      "page declares no canonical, so it inherits the layout's '/' and tells Google it is the homepage"
    ).toEqual([]);
  });

  it("never points a noindex page's canonical at a different URL", () => {
    // Google Search Central warns that noindex and rel=canonical are
    // contradictory signals on the same page, and that Google may treat the
    // noindex as the stronger one and carry it across to the canonical TARGET.
    // /schedule shipped exactly that pairing — `robots: { index: false }` beside
    // `canonical: "/book"` — which put the site's only page that takes money one
    // Google heuristic away from being deindexed, in order to tidy up a
    // duplicate nothing links to. A self-canonical is harmless (it names no
    // other URL), so /workplace keeping its own is fine; anything else is not.
    const offenders: string[] = [];
    for (const path of LIVE) {
      if (!NOINDEX.has(path)) continue;
      const source = codeOf(BY_PATH.get(path)!.file);
      for (const [, url] of source.matchAll(/canonical:\s*[`"']([^`"']*)/g)) {
        if (url !== path) offenders.push(`${path} -> ${url}`);
      }
      // Deleting `alternates` is NOT how you remove a canonical, and this is
      // the half that is invisible in the source. Verified in the built HTML:
      // a page with no `alternates` key INHERITS the root layout's, so
      // /schedule went from claiming to be /book to claiming to be the
      // homepage — a worse lie, shipped as a cleanup. `canonical: null` is the
      // supported suppression and is what actually emits no <link>.
      expect(
        /\balternates:\s*\{[^}]*\bcanonical:/.test(source),
        `${path} declares no canonical at all, so it inherits the layout's "/" — use alternates: { canonical: null }`
      ).toBe(true);
    }
    expect(
      offenders,
      "a noindex page canonicalises to a DIFFERENT URL — the noindex can bleed onto that target"
    ).toEqual([]);
  });

  it("keeps the 404 page off the index and off the homepage's canonical", () => {
    // not-found.tsx has no `page.tsx`, so the route walk above never sees it —
    // and it is served for EVERY unmatched URL on the site. It inherits the root
    // layout's metadata like any other page, which meant every 404 shipped
    // `<link rel="canonical" href="https://rumi.build">`: a page Next also
    // stamps `noindex` on, canonicalising to the homepage. Same bleed risk as
    // /schedule, on unboundedly many URLs.
    const source = codeOf(join(APP, "not-found.tsx"));
    expect(
      source,
      "not-found.tsx no longer suppresses the inherited canonical"
    ).toMatch(/alternates:\s*\{\s*canonical:\s*null\s*\}/);
    expect(source, "not-found.tsx no longer declares its own robots").toMatch(
      /robots:\s*\{[^}]*\bindex:\s*false\b/
    );
    expect(source).toMatch(/robots:\s*\{[^}]*\bfollow:\s*false\b/);
  });

  it("gives every indexable page an og:url matching its own canonical", () => {
    // `openGraph` is inherited from the root layout wholesale, exactly like
    // `alternates` and `title` — and the layout pins og:url to the homepage. So
    // the fix above (a per-page canonical) left the other half of the same
    // defect in place on fourteen routes: verified in the built HTML,
    // .next/server/app/faq.html carried `canonical: /faq` beside
    // `og:url: https://rumi.build` and the homepage's og:title. Every share of
    // those pages resolved and attributed to "/", and the two tags contradicted
    // each other in the same <head>.
    //
    // Read out of the source rather than by importing each page's metadata: the
    // dynamic routes build both values from the same template literal, so
    // comparing the declared text catches a template that drifts on one side
    // only, and it needs no module loading for fourteen files.
    const ogUrl = (source: string) =>
      openGraphBlock(source)?.match(/\burl:\s*[`"']([^`"']*)/)?.[1];

    const mismatched: string[] = [];
    for (const path of LIVE) {
      if (path === "/" || NOINDEX.has(path)) continue;
      const source = codeOf(BY_PATH.get(path)!.file);
      const canonical = source.match(/canonical:\s*[`"']([^`"']*)/)?.[1];
      const og = ogUrl(source);
      if (og === undefined) {
        mismatched.push(`${path}: no openGraph.url — inherits the homepage's`);
      } else if (og !== canonical) {
        mismatched.push(`${path}: og:url ${og} != canonical ${canonical}`);
      }
    }
    expect(
      mismatched,
      "page's og:url disagrees with its canonical, so shares attribute to the wrong URL"
    ).toEqual([]);

    // Guard: the reader has to be finding real values, or the loop reports
    // "no openGraph.url" for everything or nothing for everything. Anchored on
    // the hub, which has had its own openGraph block the longest.
    expect(
      ogUrl(codeOf(BY_PATH.get("/services")!.file)),
      "the og:url reader stopped matching"
    ).toBe("/services");
  });

  it("keeps every og:url and canonical relative, and the preview image on each", () => {
    // Same reason the canonical check above pins `^/`: a sibling site ships the
    // same role slugs under the same hardcoded host, and nothing in this
    // checkout settles which domain it deploys to. Relative values resolve
    // through metadataBase and follow whatever host is configured.
    //
    // The image is the other thing restating openGraph costs you: Next replaces
    // the layout's object rather than merging into it, so a page that declares
    // openGraph without `images` silently ships a preview card with no picture.
    let found = 0;
    for (const path of LIVE) {
      const block = openGraphBlock(codeOf(BY_PATH.get(path)!.file));
      if (block === null) continue;
      found++;
      const og = block.match(/\burl:\s*[`"']([^`"']*)/)?.[1];
      expect(og, `${path} declares openGraph with no url`).toBeTypeOf("string");
      expect(og, `${path} hardcodes a host in its og:url`).toMatch(/^\//);
      // Scoped to the openGraph block itself, not the whole file: /workplace
      // also ships a `twitter` card carrying the same image, and a file-wide
      // search would let openGraph lose its own and still pass.
      expect(
        block,
        `${path} restates openGraph but drops the social preview image`
      ).toContain("/og-image.png");
      expect(block, `${path} restates openGraph but drops siteName`).toContain(
        'siteName: "Rumi AI"'
      );
    }
    expect(found, "no page declares openGraph — re-anchor this test").toBeGreaterThan(
      8
    );
  });

  it("keeps title and description out of the layout's twitter block", () => {
    // `twitter` is inherited from the root layout wholesale, exactly like
    // `openGraph` and `alternates` — but unlike openGraph, no page restates a
    // twitter block (/workplace is the one exception), so a title or
    // description declared on the layout is what X shows for EVERY page on the
    // site: X prefers twitter:* over og:*, and the built HTML confirmed faq,
    // services and schedule all shipped the homepage's twitter:title beside
    // their own, correct og:title. With only the card (and image) declared, X
    // falls back to each page's og:title/og:description, which the checks
    // above already keep per-page.
    const twitter = metadataBlock(codeOf(join(APP, "layout.tsx")), "twitter");
    expect(twitter, "the layout no longer declares a twitter card").toBeTypeOf(
      "string"
    );
    expect(twitter).toContain('card: "summary_large_image"');
    expect(
      twitter,
      "a layout-level twitter title becomes the whole site's title on X"
    ).not.toMatch(/\btitle:/);
    expect(
      twitter,
      "a layout-level twitter description becomes the whole site's description on X"
    ).not.toMatch(/\bdescription:/);
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
    //
    // Leaving a URL out of the sitemap does NOT deindex it — the sitemap only
    // advertises, and Google keeps crawling and ranking whatever it already
    // knows about. So each exclusion also carries the crawl stance the page has
    // to declare in `metadata.robots`, and a page that is kept out of the index
    // has to actually say so:
    //   "noindex"   — must declare robots.index === false. /schedule was in the
    //                 previous sitemap and still renders a near-duplicate of
    //                 /book; /workplace calls itself unindexed while shipping
    //                 full OG/Twitter cards. Neither is deindexed by omission.
    //                 /book/success MOVED here from "indexable": it sits behind
    //                 a Stripe session id, so the only version of it a crawler
    //                 can ever reach is the failure state — an indexable,
    //                 self-canonical page whose entire content reads "Could not
    //                 verify payment / Something looks off". That is not a page
    //                 worth having in the index under the brand name.
    //   "indexable" — deliberately still crawlable, just not advertised. The two
    //                 legal pages are fetched by carriers during A2P/SMS
    //                 campaign vetting. Flipping either to noindex is a
    //                 decision, not a cleanup — change the table when you do.
    const EXCLUDED: Record<string, "noindex" | "indexable"> = {
      "/schedule": "noindex",
      "/workplace": "noindex",
      "/book/success": "noindex",
      "/terms": "indexable",
      "/privacy": "indexable",
    };

    /** Does this page's exported metadata tell crawlers not to index it? */
    const declaresNoindex = (file: string) =>
      /robots:\s*\{[^}]*\bindex:\s*false\b/.test(readFileSync(file, "utf8"));

    for (const [path, stance] of Object.entries(EXCLUDED)) {
      expect(LIVE, `${path} is gone — prune the exclusion list`).toContain(path);
      expect(paths, `${path} is not supposed to be indexed`).not.toContain(path);
      expect(
        declaresNoindex(BY_PATH.get(path)!.file),
        stance === "noindex"
          ? `${path} is kept out of the sitemap but never declares robots.index = false — omission does not deindex anything`
          : `${path} declares noindex but the table above calls it indexable — update the table`
      ).toBe(stance === "noindex");
    }
    // Every live route is either submitted or deliberately excluded. A new page
    // added without a sitemap decision fails here instead of going uncrawled.
    const undecided = LIVE.filter(
      (p) => !paths.includes(p) && !(p in EXCLUDED)
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
