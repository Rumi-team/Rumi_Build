import { defineConfig, devices } from "@playwright/test";

// E2E runs against the real production build on port 3311 (not `next dev`), so
// what the specs assert is what Vercel serves: static role pages, real 404
// routing, real metadata.
const PORT = 3311;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `pnpm build && pnpm start --port ${PORT}`,
    url: BASE_URL,
    // The Next build is slow (fonts are fetched, five role pages prerendered),
    // so give it room before Playwright gives up on the port.
    timeout: 300_000,
    // Opt-in only. The point of this suite is asserting the real production
    // build, so a forgotten `next start` from an earlier session must not
    // silently satisfy it — an implicit local reuse reports green against stale
    // HTML. Set PW_REUSE_SERVER=1 to skip the rebuild deliberately.
    reuseExistingServer: !process.env.CI && !!process.env.PW_REUSE_SERVER,
    stdout: "pipe",
    stderr: "pipe",
  },
});
