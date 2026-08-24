import { readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { SUPPORT_EMAIL } from "@/lib/data";
import { sourceFiles } from "./helpers/source-files";

// ── Why this file exists ──────────────────────────────────────────────────────
// This deployment answers on FOUR hosts. rumiai.ai, www.rumiai.ai, rumi.build
// and www.rumi.build are all aliases of one Vercel project (`rumi-ai`), both
// apexes 308 to their `www`, and on 2026-08-05 both `www` hosts returned
// byte-identical HTML. The twin repo ../Frontend_Rumi_AIEmployees owns a Vercel
// project NAMED `rumi-build` which does not serve rumi.build.
//
// That is the whole reason this check is needed. Because every alias works,
// naming the wrong one is invisible: the page loads, the link resolves, the
// email arrives, nothing 404s and no test goes red. The only symptom is that
// search engines are told the canonical copy lives somewhere other than where
// the sitemap advertises it, and the site quietly competes with itself.
//
// It has already happened twice. v1.2.0.1 changed /team's meta description to
// name rumiai.ai while its own canonical still said rumi.build — one page
// disagreeing with the entire rest of the site, shipped green. Before that, an
// empty NEXT_PUBLIC_SITE_URL let a `|| "https://rumi.build"` fallback aim
// Stripe's success_url at a host nobody had chosen (see src/lib/stripe.ts).
//
// crawler-surfaces.test.ts already requires the four KNOWN host literals —
// layout's metadataBase, sitemap's BASE, robots' sitemap field and every URL in
// llms-content — to agree with each other. This file is the other half: it
// walks ALL of src/ so a domain written into somewhere nobody thought of (a
// meta description, a legal page, an error string) is caught too.
//
// One deliberate divergence is declared below and explained there: the support
// mailbox. Everything else must agree with metadataBase.

const ROOT = process.cwd();
const SRC = join(ROOT, "src");

/** The canonical host, read out of the source exactly as crawler-surfaces.test.ts
 *  reads it — importing layout.tsx would drag in globals.css and next/font. */
// Captures the whole URL and lets `new URL` find the host, rather than pattern-
// matching the host out directly: `("https://host/")` with a trailing slash is
// a legal thing to write there, and a host-shaped sub-pattern does not match it
// at all — the `!` would throw a bare TypeError at import, before any case runs.
const CANONICAL_HOST = new URL(
  readFileSync(join(SRC, "app", "layout.tsx"), "utf8").match(
    /metadataBase:\s*new URL\("([^"]+)"\)/
  )![1]
).hostname.replace(/^www\./, "");

/** Where support mail actually lands, derived from the one exported constant so
 *  changing it here forces every literal below to follow. */
const MAILBOX_DOMAIN = SUPPORT_EMAIL.split("@")[1];

// The hosts that are aliases of THIS deployment. This is a fact about DNS and
// the Vercel project, not something src/ can be asked, so it is stated — and
// the "no undeclared domain" case below is what stops it going stale silently.
const OUR_HOSTS = ["rumiai.ai", "rumi.build"];

// Sibling PRODUCTS. Separate companies' worth of separate deployments that
// happen to share the brand prefix, linked on purpose from /team and from
// llms-content's company list. They are not aliases of this site, so none of
// the agreement rules below apply to them — but they are listed rather than
// pattern-matched away, so a NEW rumi-something domain appearing in src/ fails
// until somebody says which kind it is.
const SIBLING_PRODUCTS = ["rumi.team", "rumiagent.com"];

// `source: "rumi.build"` in the checkout route is not a URL and not a host this
// code ever resolves — it is the literal `source` value stamped on every lead
// row and Stripe session since launch, and the retention endpoint it posts to
// is itself /api/v1/rumi-build/customers/upsert. Renaming it would split that
// dataset in two at an arbitrary date and buy nothing, so it is frozen and
// named here rather than quietly skipped.
const FROZEN_IDENTIFIERS = [
  { file: "src/app/api/checkout/route.ts", domain: "rumi.build" },
];

// Filenames, not hosts: `rumi-logo-on-navy.png` matches the domain shape. The
// extension list is exhaustive for what the pattern can actually hit, and an
// unknown extension falls through to the undeclared-domain case rather than
// being dropped.
const FILE_EXTENSIONS = new Set([
  "png",
  "jpg",
  "jpeg",
  "svg",
  "webp",
  "avif",
  "gif",
  "ico",
]);

type Kind = "url" | "mail" | "bare";
type Mention = { file: string; domain: string; kind: Kind };

// A `rumi…`-prefixed domain, capturing how it is being used: behind a scheme it
// is a link, behind an `@` it is an address, and bare it is prose or an
// identifier. `www.` is consumed so www and apex normalise to one domain.
const MENTION = /(https?:\/\/|@)?(?:www\.)?(rumi[a-z0-9-]*)\.([a-z]{2,})/gi;

/** Comments are stripped first, on purpose and for the same reason
 *  helpers/strings.ts walks values rather than file text: layout.tsx,
 *  stripe.ts, not-found.tsx and llms.txt/route.ts all DISCUSS the other hosts
 *  at length — that prose is why the rule exists and must not be read as a
 *  violation of it. Only code and user-facing copy are policed.
 *
 *  The line-comment pattern refuses a `//` preceded by a colon or a quote.
 *  Without the colon it matches the `//` inside `https://` and deletes the rest
 *  of the line, which silently removed EVERY url-kind mention in src/ —
 *  including the metadataBase this whole file compares against — and left the
 *  link cases below passing over an empty set. The parser case above caught it.
 *  The quotes close the same hole one step further out: a protocol-relative
 *  `"//www.rumiai.ai/x"` has no scheme for the colon rule to catch, so it would
 *  be eaten the same way and the mention would vanish silently.
 *
 *  The trade is deliberate. A comment jammed directly against a closing quote
 *  (`"a"// note`) now survives stripping and could be read as copy — but that
 *  fails LOUDLY, naming the file, whereas a swallowed URL fails by finding
 *  nothing and agreeing with everything. Prefer the noisy direction. */
function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(?<![:"'`])\/\/.*$/gm, "");
}

function mentions(file: string): Mention[] {
  const code = stripComments(readFileSync(file, "utf8"));

  const rel = relative(ROOT, file);
  const out: Mention[] = [];
  for (const [, prefix, name, tld] of code.matchAll(MENTION)) {
    if (FILE_EXTENSIONS.has(tld.toLowerCase())) continue;
    out.push({
      file: rel,
      domain: `${name}.${tld}`.toLowerCase(),
      kind: prefix ? (prefix === "@" ? "mail" : "url") : "bare",
    });
  }
  return out;
}

const FILES = sourceFiles(SRC, [".ts", ".tsx"]);
const MENTIONS = FILES.flatMap(mentions);
const OURS = MENTIONS.filter((m) => OUR_HOSTS.includes(m.domain));

describe("the site names one and the same host everywhere it names itself", () => {
  it("classifies a mention by how it is written, and skips asset filenames", () => {
    // Guards the parser. Every assertion below reads "no disagreement" when
    // this silently stops matching, so the shapes it must catch — and the two
    // it must not — are pinned here rather than assumed.
    const parse = (text: string) => {
      MENTION.lastIndex = 0;
      return [...text.matchAll(MENTION)].map(([, p, n, t]) =>
        FILE_EXTENSIONS.has(t.toLowerCase())
          ? "skipped"
          : `${p ? (p === "@" ? "mail" : "url") : "bare"}:${n}.${t}`
      );
    };

    expect(parse('new URL("https://www.rumiai.ai")')).toEqual(["url:rumiai.ai"]);
    expect(parse('href="mailto:support@rumi.build"')).toEqual([
      "mail:rumi.build",
    ]);
    expect(parse('source: "rumi.build",')).toEqual(["bare:rumi.build"]);
    expect(parse("Meet the team behind rumiai.ai.")).toEqual(["bare:rumiai.ai"]);
    // www and apex are the same site, not two.
    expect(parse("https://rumiai.ai and https://www.rumiai.ai")).toEqual([
      "url:rumiai.ai",
      "url:rumiai.ai",
    ]);
    // An asset path is not a host.
    expect(parse('"/rumi-logo-on-navy.png"')).toEqual(["skipped"]);
  });

  it("strips comments without swallowing the URLs it is looking for", () => {
    // The half that actually broke. Both keep-cases are silent failures when
    // wrong — the scan finds nothing and agrees with everything — so they are
    // pinned separately from the walk that consumes them.
    expect(stripComments('const u = "https://www.rumiai.ai"; // note')).toContain(
      "www.rumiai.ai"
    );
    // Protocol-relative: no scheme, so the colon rule alone would not save it.
    expect(stripComments('const cdn = "//www.rumiai.ai/x";')).toContain(
      "www.rumiai.ai"
    );
    // And it must still do its actual job, in both comment syntaxes.
    expect(stripComments("// rumi.build is only discussed here")).not.toContain(
      "rumi.build"
    );
    expect(stripComments("/* rumi.build, at length */")).not.toContain(
      "rumi.build"
    );
  });

  it("finds the mentions it exists to police", () => {
    // A walker that silently returns nothing passes every case below. These
    // numbers are floors, not counts — they only have to be high enough that an
    // empty or half-broken scan cannot slip past.
    expect(FILES.length).toBeGreaterThan(20);
    expect(OURS.length).toBeGreaterThan(10);
    expect(new Set(OURS.map((m) => m.file)).size).toBeGreaterThan(4);
    // The one mention that must always exist, since it is the source of truth
    // every other case is compared against.
    expect(
      MENTIONS.some(
        (m) => m.file === "src/app/layout.tsx" && m.kind === "url"
      )
    ).toBe(true);
  });

  it("writes no brand domain that is neither this site nor a declared sibling", () => {
    // The case that keeps the two lists above honest. A newly registered
    // rumi-anything domain pasted into src/ lands here until somebody decides
    // whether it is another alias of this site (and therefore has to obey every
    // rule below) or a separate product (and therefore does not).
    const declared = new Set([...OUR_HOSTS, ...SIBLING_PRODUCTS]);
    const undeclared = MENTIONS.filter((m) => !declared.has(m.domain)).map(
      (m) => `${m.file}: ${m.domain}`
    );

    expect(undeclared).toEqual([]);
  });

  it("points every link at this site at the canonical host", () => {
    // The SEO failure this file is named for. Every alias serves the same
    // build, so a link on the wrong one resolves perfectly and still tells
    // Google the canonical copy is somewhere the sitemap never mentions.
    const offenders = OURS.filter(
      (m) => m.kind === "url" && m.domain !== CANONICAL_HOST
    ).map((m) => `${m.file}: https://${m.domain} (canonical is ${CANONICAL_HOST})`);

    expect(offenders).toEqual([]);
  });

  it("states the support mailbox as one address on every surface", () => {
    // SUPPORT_EMAIL in src/lib/data.ts is the source of truth, but the footer,
    // Terms, Privacy, the SMS clause, /book/success and llms-content each spell
    // the address out as a literal instead of importing it. This is what makes
    // those literals follow the constant: change data.ts alone and this fails
    // with every file still on the old domain.
    const offenders = OURS.filter(
      (m) => m.kind === "mail" && m.domain !== MAILBOX_DOMAIN
    ).map((m) => `${m.file}: @${m.domain} (SUPPORT_EMAIL is @${MAILBOX_DOMAIN})`);

    expect(offenders).toEqual([]);
  });

  // NEXT_PUBLIC_SITE_URL is the FOURTH place this site's identity is authored —
  // the three source literals above, plus the Vercel env var getSiteUrl() reads
  // to build Stripe's success_url. The literals are pinned to each other and to
  // metadataBase, but nothing tied them to the variable, so moving one alone is
  // silent: a buyer gets returned to the new host while every canonical still
  // names the old one, and both hosts answer 200 either way.
  //
  // SKIPPED, not passed, when the variable is absent. CI builds with no
  // environment at all, and a case that quietly goes green on a missing value
  // is the vacuous pass this file was already bitten by once.
  it.skipIf(!process.env.NEXT_PUBLIC_SITE_URL?.trim())(
    "agrees with NEXT_PUBLIC_SITE_URL wherever the environment sets one",
    () => {
      const configured = new URL(process.env.NEXT_PUBLIC_SITE_URL!.trim());
      expect(configured.hostname.replace(/^www\./, "")).toBe(CANONICAL_HOST);
    }
  );

  it("keeps bare prose on the canonical host, except frozen identifiers", () => {
    // Prose that names the site — /team's meta description is the live example
    // — is a branding surface and follows the canonical host. The `source` key
    // is not prose and is pinned to its file, so freezing it in one place does
    // not license the old domain anywhere else.
    const offenders = OURS.filter(
      (m) =>
        m.kind === "bare" &&
        m.domain !== CANONICAL_HOST &&
        !FROZEN_IDENTIFIERS.some(
          (f) => f.file === m.file && f.domain === m.domain
        )
    ).map((m) => `${m.file}: ${m.domain}`);

    expect(offenders).toEqual([]);
  });

  it("keeps every frozen identifier in use, so the exemption cannot outlive it", () => {
    // A declared exemption for a string nobody writes any more is a licence to
    // reintroduce the old domain in that file for free. If the `source` key is
    // renamed or the route deleted, this goes red and the entry comes out.
    const unused = FROZEN_IDENTIFIERS.filter(
      (f) =>
        !MENTIONS.some(
          (m) => m.file === f.file && m.domain === f.domain && m.kind === "bare"
        )
    ).map((f) => `${f.file}: ${f.domain}`);

    expect(unused).toEqual([]);
  });
});
