import { existsSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { inflateSync } from "node:zlib";
import { describe, expect, it, vi } from "vitest";
import tailwindConfig from "../../tailwind.config";
import { sourceFiles } from "./helpers/source-files";

// ── Why this file exists ──────────────────────────────────────────────────────
// Every image on this site is a bare string path into `public/`: the two logos
// in the chrome, the OG card every page's metadata points at, the three team
// photos. Nothing type-checks them and nothing renders them in the unit suite —
// nav-footer.test.tsx explicitly drops the logo anchor, because its only child
// is an <img> and so it carries no text. Playwright asserts text and hrefs and
// never waits on an image, so a 404 on one of these is green everywhere:
//
//   - a mistyped or deleted logo is a broken image in the fixed bar on EVERY
//     page of the site, which is the most visible defect this repo can ship;
//   - a missing /og-image.png is a blank card on every share of every page,
//     and routing.test.ts checks only that the metadata still NAMES it.
//
// The brand v2 relock is exactly the edit that puts this one wrong keystroke
// away: all three binaries were replaced, and nav.tsx switched from the
// on-navy logo to the on-white one for the new white bar. Since the pre-landing
// pass the binaries are also RESAMPLED — downscaled to three times their render
// size — which is the other way a logo goes wrong without a single source edit:
// a resize that rings on the flat background bakes an off-brand fringe into the
// one image that sits on every page. The colour is therefore read out of the
// files themselves below, not just their names.

// The layout's metadata is imported (rather than regexed out of the source) so
// the OG card's declared dimensions can be compared with the file's real ones.
// next/font/google is a build-time transform that does not exist at runtime, so
// the two loaders are stubbed; nothing else in layout.tsx needs faking, and the
// metadata object is untouched by the stub.
vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "--font-inter", className: "font-inter" }),
  Vazirmatn: () => ({ variable: "--font-vazirmatn", className: "font-vazirmatn" }),
}));

const { metadata } = await import("@/app/layout");

const ROOT = process.cwd();
const SRC = join(ROOT, "src");
const PUBLIC = join(ROOT, "public");

/**
 * Root-relative image paths written as string literals: "/og-image.png", and
 * "/og-image.png?v=2" — the query is a scraper cache bust, not part of the
 * filename, so it is captured separately and stripped before the path is
 * resolved against public/.
 */
const ASSET =
  /"(\/[A-Za-z0-9._/-]+\.(?:png|jpe?g|svg|webp|avif|gif|ico))(\?[A-Za-z0-9._~%&=+-]*)?"/g;

type Reference = { file: string; path: string; query: string };

const REFERENCES: Reference[] = sourceFiles(SRC, [".ts", ".tsx"]).flatMap(
  (file) => {
    const text = readFileSync(file, "utf8");
    return [...text.matchAll(ASSET)].map((m) => ({
      file: relative(ROOT, file),
      path: m[1],
      query: m[2] ?? "",
    }));
  }
);

/** The one <img> a component renders, e.g. nav.tsx -> "/rumi-logo-on-white.png". */
function loneImage(component: string): string {
  const text = readFileSync(join(SRC, "components", component), "utf8");
  const found = [...text.matchAll(/<img[^>]*\ssrc="([^"]+)"/g)].map((m) => m[1]);
  expect(found, `${component} no longer renders exactly one <img>`).toHaveLength(1);
  return found[0];
}

// ── Reading a PNG without a decoder ──────────────────────────────────────────
// No new dependency for this: `sharp` is a transitive build-time dependency of
// Next, not something this suite should reach into, and the two facts these
// tests need — the declared dimensions and the colour of the very first pixel —
// are both readable straight out of the container.

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/**
 * Samples per pixel for each PNG colour type. Type 3 (palette) is deliberately
 * ABSENT: its sample bytes are indices into PLTE rather than colours, so the
 * shortcut below would compare an index to a hex and pass or fail at random.
 * A palettised file fails the guard instead.
 */
const CHANNELS: Record<number, number> = { 0: 1, 2: 3, 4: 2, 6: 4 };

type Header = {
  width: number;
  height: number;
  bitDepth: number;
  colorType: number;
  interlace: number;
};

/** IHDR is fixed as the first chunk after the 8-byte signature. */
function header(file: string): Header {
  const bytes = readFileSync(file);
  expect(bytes.subarray(0, 8).equals(SIGNATURE), `${file} is not a PNG`).toBe(true);
  expect(
    bytes.toString("ascii", 12, 16),
    `${file}'s first chunk is not IHDR`
  ).toBe("IHDR");
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
    bitDepth: bytes[24],
    colorType: bytes[25],
    interlace: bytes[28],
  };
}

/**
 * The top-left pixel's colour samples.
 *
 * Valid because of the guards, and only because of them: for a NON-INTERLACED
 * 8-bit truecolour PNG the inflated IDAT stream starts with the first
 * scanline's filter byte, and the first pixel of the first scanline
 * reconstructs from all-zero priors under every filter type PNG defines —
 * None, Sub (left = 0), Up (above = 0), Average (both = 0) and Paeth (all
 * three = 0) — so whichever filter the encoder chose, the bytes after that
 * first byte ARE the pixel. Interlacing or a sub-8-bit depth breaks that, so
 * both are asserted rather than assumed.
 */
function topLeftPixel(file: string): number[] {
  const head = header(file);
  expect(head.interlace, `${file} is interlaced — this reader cannot index it`).toBe(0);
  expect(head.bitDepth, `${file} is not 8 bits per sample`).toBe(8);
  const channels = CHANNELS[head.colorType];
  expect(
    channels,
    `${file} uses PNG colour type ${head.colorType}, whose samples are not colours`
  ).toBeTypeOf("number");

  const bytes = readFileSync(file);
  const idat: Buffer[] = [];
  let offset = 8;
  while (offset + 8 <= bytes.length) {
    const length = bytes.readUInt32BE(offset);
    const type = bytes.toString("ascii", offset + 4, offset + 8);
    if (type === "IDAT") idat.push(bytes.subarray(offset + 8, offset + 8 + length));
    if (type === "IEND") break;
    offset += 12 + length;
  }
  expect(idat, `${file} carries no IDAT chunk`).not.toEqual([]);

  // Split IDAT chunks are one zlib stream, so they concatenate before inflating.
  const raw = inflateSync(Buffer.concat(idat));
  expect(raw.length, `${file} inflated to nothing`).toBeGreaterThan(channels);
  return [...raw.subarray(1, 1 + channels)];
}

/** `#0b1c36` -> [11, 28, 54], so a token can be compared with decoded samples. */
function rgb(hex: string): number[] {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

/** A locked colour token, read out of the config rather than restated here. */
function token(name: string): string {
  const colours = tailwindConfig.theme?.extend?.colors as Record<string, unknown>;
  const value = colours[name];
  if (typeof value !== "string") throw new Error(`no such colour token: ${name}`);
  return value.toLowerCase();
}

describe("static assets referenced from src/", () => {
  it("found references to check, on the surfaces that carry them", () => {
    // Guards the walk. Every assertion below passes on an empty list, and the
    // three anchors are the three places an image is load-bearing rather than
    // decorative — named by the FILE that references them, so a renamed asset
    // does not have to be restated here to keep this honest.
    expect(REFERENCES.length).toBeGreaterThan(3);
    for (const source of [
      join("src", "components", "nav.tsx"),
      join("src", "components", "footer.tsx"),
      join("src", "app", "layout.tsx"),
    ]) {
      expect(
        REFERENCES.filter((r) => r.file === source),
        `${source} references no image — re-anchor this test`
      ).not.toEqual([]);
    }
  });

  it("resolves every one of them to a file in public/", () => {
    const missing = REFERENCES.filter(
      (r) => !existsSync(join(PUBLIC, r.path))
    ).map((r) => `${r.file} -> public${r.path}`);
    expect(
      missing,
      "an image path with no file behind it: a broken image wherever it renders"
    ).toEqual([]);
  });

  it("reads a cache-busting query as a query, not as part of the filename", () => {
    // Guards the regex change that made the assertion above survive `?v=2`. A
    // reader that swallowed the query into the path would report every busted
    // URL as a missing file; one that ignored the suffix entirely would let
    // `/og-image.png?v=2` resolve while `/does-not-exist.png?v=2` resolved too.
    const busted = REFERENCES.filter((r) => r.query !== "");
    expect(
      busted,
      "no image URL carries a cache-busting query any more — re-anchor this test"
    ).not.toEqual([]);
    for (const reference of busted) {
      expect(reference.path, `${reference.file} kept the query in the path`).not.toContain(
        "?"
      );
      expect(reference.query).toMatch(/^\?/);
    }
  });
});

describe("the two logos are drawn for the fills they sit on", () => {
  // There are two logo files whose names differ by one word, and each is drawn
  // for one background: the nav is a white bar since brand v2, the footer has
  // always been navy. Swapping them renders a navy-on-navy logo — invisible,
  // and invisible to every other test in this suite too, since neither logo
  // carries text and no assertion anywhere reads their src. This branch is the
  // one that changed which file the nav points at.
  const FILL = /-on-(white|navy)\.[a-z]+$/;

  it.each([
    ["nav.tsx", "white"],
    ["footer.tsx", "navy"],
  ] as const)("%s renders the on-%s logo", (component, fill) => {
    const src = loneImage(component);
    const drawnFor = src.match(FILL)?.[1];
    expect(
      drawnFor,
      `${src} does not say which fill it is drawn for — re-anchor this test`
    ).toBeTypeOf("string");
    expect(
      drawnFor,
      `${component} renders a logo drawn for a ${drawnFor} background`
    ).toBe(fill);
  });

  it("gives the two bars different logos, on the backgrounds they claim", () => {
    // The other half: both could be "on-white" and each assertion above would
    // still be checking only its own half. The bar colours are read out of the
    // components so this fails if a section is repainted without its logo.
    expect(loneImage("nav.tsx")).not.toBe(loneImage("footer.tsx"));
    const bg = (component: string) =>
      readFileSync(join(SRC, "components", component), "utf8");
    expect(bg("nav.tsx"), "the nav bar is no longer white").toMatch(/\bbg-white\b/);
    expect(bg("footer.tsx"), "the footer is no longer navy").toMatch(/\bbg-navy\b/);
  });

  it("bakes the exact bar colour into each logo's own pixels", () => {
    // The filename says which fill a logo is drawn for; this says the pixels
    // agree. Both files were downscaled to three times their render height in
    // the pre-landing pass, and a resample that rings on the flat surround
    // leaves a fringe a shade off the bar it sits in — invisible in review,
    // permanent on every page. The navy is read out of the locked config, so a
    // relock that moves the token fails here until the asset is re-exported.
    const navy = rgb(token("navy"));
    expect(
      topLeftPixel(join(PUBLIC, "rumi-logo-on-navy.png")).slice(0, 3),
      "the on-navy logo's surround is no longer the navy token — it will not blend into the footer"
    ).toEqual(navy);
    expect(
      topLeftPixel(join(PUBLIC, "rumi-logo-on-white.png")).slice(0, 3),
      "the on-white logo's surround is no longer pure white — it will show as a box in the nav bar"
    ).toEqual([255, 255, 255]);
    // Guards the comparison itself: the two fills must not be the same colour,
    // or "equals the surround" would hold for a swapped pair.
    expect(navy).not.toEqual([255, 255, 255]);
  });
});

describe("the OG card and the file-convention icons", () => {
  it("declares the OG image at the size the file actually is", () => {
    // width/height in the metadata are a promise to the scraper: a card whose
    // declared aspect ratio does not match the bitmap is letterboxed or
    // cropped by every platform that trusts the declaration. Both numbers are
    // read — one from the layout's own metadata object, one out of the PNG's
    // IHDR — so neither is restated here and a regenerated card at a different
    // size fails until the metadata catches up.
    const images = metadata.openGraph?.images;
    expect(Array.isArray(images), "the layout declares no openGraph images array").toBe(
      true
    );
    const declared = (images as { url: string; width?: number; height?: number }[])[0];
    expect(declared.width, "the OG image declares no width").toBeTypeOf("number");
    expect(declared.height, "the OG image declares no height").toBeTypeOf("number");

    const file = join(PUBLIC, declared.url.split("?")[0]);
    expect(existsSync(file), `${declared.url} has no file behind it`).toBe(true);
    const { width, height } = header(file);
    expect(
      [width, height],
      `${declared.url} is ${width}x${height} but the metadata claims ${declared.width}x${declared.height}`
    ).toEqual([declared.width, declared.height]);
  });

  it("ships both file-convention icons, square and on the navy token", () => {
    // src/app/icon.png and src/app/apple-icon.png are picked up by filename —
    // no import, no reference anywhere in src/, so the REFERENCES walk above
    // cannot see them and a deleted or mis-sized one is silent. Non-square is
    // the specific defect: iOS and every browser tab scale these to a square
    // box, so a stray aspect ratio ships a stretched sun mark.
    const navy = rgb(token("navy"));
    for (const name of ["icon.png", "apple-icon.png"]) {
      const file = join(SRC, "app", name);
      expect(existsSync(file), `src/app/${name} is missing`).toBe(true);
      const { width, height } = header(file);
      expect(width, `src/app/${name} has no width`).toBeGreaterThan(0);
      expect([width, height], `src/app/${name} is not square`).toEqual([width, width]);
      expect(
        topLeftPixel(file).slice(0, 3),
        `src/app/${name} is no longer on the navy token`
      ).toEqual(navy);
    }
  });
});
