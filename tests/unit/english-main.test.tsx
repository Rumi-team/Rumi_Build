// @vitest-environment jsdom
// This file renders a component, so it needs a DOM. The suite defaults to the
// `node` environment (vitest.config.ts); only the files that render opt in.
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EnglishMain } from "@/components/english-main";

// ── Why this file exists ──────────────────────────────────────────────────────
// tests/unit/english-pin.test.ts proves every English page WRAPS itself in
// EnglishMain, and it checks the wrapper itself by grepping the file for
// `dir="ltr"`, `lang="en"` and `font-sans`. That is a source-text check, so it
// is satisfied by a component that merely contains those three strings —
// including one that renders them on an inner element, drops its children, or
// puts them behind a condition. Sixteen pages delegate their direction pin to
// this component, and nothing rendered it.
//
// The className handling is the other half. `font-sans` is PREPENDED to whatever
// the page passes, never replaced, and the prepend is a real two-branch
// conditional (`className ? … : "font-sans"`) with only the first branch reached
// in production — every caller passes `pt-16` or similar. A refactor that made
// the caller's classes win would take the Inter re-declaration off every English
// page, and the direction would still be right, so the failure would look like
// nothing more than the wrong typeface under a stored Farsi preference.

const mainOf = (container: HTMLElement) => container.querySelector("main")!;

describe("EnglishMain", () => {
  it("pins direction, language and typeface on the <main> it renders", () => {
    const { container } = render(
      <EnglishMain>
        <p>English copy</p>
      </EnglishMain>
    );
    const main = mainOf(container);

    expect(main, "EnglishMain no longer renders a <main>").not.toBeNull();
    expect(main).toHaveAttribute("dir", "ltr");
    expect(main).toHaveAttribute("lang", "en");
    // Not redundant with lang="en": the Vazirmatn swap in globals.css matches
    // `html[lang="fa"] body`, so a lang attribute on a descendant cannot undo a
    // rule applied to <body>. Only re-declaring the family here does.
    expect(
      main.className.split(/\s+/),
      "the Persian face survives on English pages — lang alone does not undo the html[lang=fa] body swap"
    ).toContain("font-sans");
    expect(main.textContent, "the wrapper swallowed its children").toBe(
      "English copy"
    );
  });

  it("prepends font-sans to the page's own classes instead of replacing them", () => {
    // The branch every page in src/app takes.
    const { container } = render(
      <EnglishMain className="min-h-screen bg-white text-ink pt-16">
        <p>English copy</p>
      </EnglishMain>
    );
    const classes = mainOf(container).className.split(/\s+/);

    expect(
      classes,
      "the caller's classes replaced font-sans — every English page loses the Inter re-declaration"
    ).toContain("font-sans");
    for (const own of ["min-h-screen", "bg-white", "text-ink", "pt-16"]) {
      expect(classes, `font-sans replaced the page's own ${own}`).toContain(own);
    }
    // Order matters only in that the page's own utilities must be able to win a
    // tie, so they come last.
    expect(classes.indexOf("font-sans")).toBeLessThan(classes.indexOf("pt-16"));
  });

  it("still pins the typeface when a page passes no classes of its own", () => {
    // The other branch of the ternary, which no caller in src/app reaches — so
    // it could return "" and every page would keep working right up until the
    // first page that omitted a className.
    const { container } = render(<EnglishMain>bare</EnglishMain>);
    expect(mainOf(container).className.trim()).toBe("font-sans");
    expect(mainOf(container)).toHaveAttribute("dir", "ltr");
  });
});
