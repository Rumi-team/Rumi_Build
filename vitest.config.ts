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
    environment: "jsdom",
    globals: false,
    setupFiles: ["./tests/setup.ts"],
    include: [
      "tests/**/*.{test,spec}.{ts,tsx}",
      "src/**/*.{test,spec}.{ts,tsx}",
    ],
    exclude: [...configDefaults.exclude, "tests/e2e/**"],
  },
});
