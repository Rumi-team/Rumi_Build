import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { configDefaults, defineConfig } from "vitest/config";

// Unit/component layer only. tests/e2e is EXCLUDED rather than the include being
// pinned to tests/unit: those specs import `@playwright/test`, which throws the
// moment Vitest tries to collect it — but a narrow include doubles as a silent
// skip list, so a unit test named `foo.spec.ts`, or one placed beside the code
// it covers, would never run and CI would stay green without it.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    // `node`, not `jsdom`. Most of this suite never touches a DOM — it reads
    // data.ts, walks src/ off the filesystem, and parses vercel.json — but
    // every file was paying for a jsdom instance anyway, and jsdom setup was
    // the single largest line in the timing breakdown. The files that DO render
    // opt in with a `// @vitest-environment jsdom` docblock on line 1 (the four
    // component tests, plus the four that reach the dictionaries through
    // tests/unit/helpers/dicts.tsx, which mounts LanguageProvider).
    //
    // A docblock rather than a config glob on purpose: `environmentMatchGlobs`
    // was removed in Vitest 4, and a `tests/**/*.tsx` glob would not have
    // covered the four `.ts` files that need a DOM anyway. The requirement is a
    // property of the file, so it is declared in the file — a new test that
    // renders fails loudly on `document is not defined` rather than quietly
    // matching or missing a pattern in another file.
    environment: "node",
    globals: false,
    setupFiles: ["./tests/setup.ts"],
    include: [
      "tests/**/*.{test,spec}.{ts,tsx}",
      "src/**/*.{test,spec}.{ts,tsx}",
    ],
    exclude: [...configDefaults.exclude, "tests/e2e/**"],
  },
});
