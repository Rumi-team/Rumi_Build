import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";
import { installMatchMedia, resetViewport } from "./unit/helpers/viewport";

// Vitest runs with `globals: false`, so React Testing Library cannot register
// its own auto-cleanup hook — without this, every render stays in the document
// and the next test queries five role cards on top of the previous five.
//
// Guarded on `document`, because setupFiles run for EVERY test file and the
// default environment is now `node` (vitest.config.ts): only the files that
// render opt into jsdom. In a node worker there is nothing to clean and
// `document.documentElement` is a TypeError thrown from a hook, which surfaces
// as an unrelated failure in a test that never touched the DOM.
// jsdom does not implement window.matchMedia, so a component that asks the
// browser its width throws on mount. Installed per test (and reset after) so a
// width one case dialled up cannot leak into the next — see
// tests/unit/helpers/viewport.ts for why the shim refuses queries it does not
// understand instead of answering `false`.
beforeEach(() => {
  if (typeof window === "undefined") return;
  installMatchMedia();
});

afterEach(() => {
  if (typeof document === "undefined") return;
  cleanup();
  resetViewport();
  document.documentElement.removeAttribute("dir");
  document.documentElement.removeAttribute("lang");
});
