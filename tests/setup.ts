import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Vitest runs with `globals: false`, so React Testing Library cannot register
// its own auto-cleanup hook — without this, every render stays in the document
// and the next test queries five role cards on top of the previous five.
afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute("dir");
  document.documentElement.removeAttribute("lang");
});
