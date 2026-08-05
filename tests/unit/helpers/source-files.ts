import { readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Every file under `dir`, recursively, whose name ends in one of `exts`.
 *
 * Two tests walk `src/` off the filesystem rather than through an import graph
 * — design-tokens.test.ts (which needs `.css` as well, because `globals.css` is
 * where the locked component classes live) and brand-assets.test.ts (which
 * wants only the `.ts`/`.tsx` that can carry a string path). They had a copy of
 * this each, differing by the extension list and by nothing else, so a fix to
 * one walker reached one caller. Both guard their own result being non-empty:
 * a walker that silently returns nothing passes every scan built on it.
 */
export function sourceFiles(dir: string, exts: string[]): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full, exts);
    return exts.some((e) => entry.name.endsWith(e)) ? [full] : [];
  });
}
