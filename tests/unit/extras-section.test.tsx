// @vitest-environment jsdom
// This file renders components, so it needs a DOM. The suite defaults to the
// `node` environment (vitest.config.ts); only the files that render opt in.
import { act, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Extras } from "@/components/extras";
import { LanguageProvider, useT } from "@/lib/i18n";
import { loadDicts } from "./helpers/dicts";

// ── Why this file exists ──────────────────────────────────────────────────────
// The "Extra services" section joins two lists that live in different files and
// are related by nothing but position: the icons are hardcoded in
// src/components/extras.tsx (they are not translatable) and zipped BY INDEX with
// the translated copy in the dictionary's `extras.items`.
//
// The zip degrades silently. `ICONS[i] ?? "•"` means a dictionary that grows an
// item past the end of ICONS renders a bullet where an icon belongs — a live
// card that looks half-built, with no failing build and no failing test. The
// component's own comment asks the next editor to "keep the length in step with
// extras.items"; this is what makes that a check rather than a request.

function Switcher({ onReady }: { onReady: (set: (l: "en" | "fa") => void) => void }) {
  const { setLang } = useT();
  onReady(setLang);
  return null;
}

function renderSection() {
  let setLang!: (l: "en" | "fa") => void;
  const utils = render(
    <LanguageProvider>
      <Switcher onReady={(s) => (setLang = s)} />
      <Extras />
    </LanguageProvider>
  );
  return { ...utils, setLang: (l: "en" | "fa") => act(() => setLang(l)) };
}

/** The decorative icon element ServiceCard renders on each card, in DOM order. */
function icons(): string[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>("#extras .icon-badge")
  ).map((el) => el.textContent!.trim());
}

afterEach(() => {
  localStorage.clear();
});

describe("extra services section", () => {
  it("renders one card per dictionary item", () => {
    renderSection();
    const { en } = loadDicts();
    const section = screen.getByRole("region", { name: en.extras.heading });
    for (const item of en.extras.items) {
      expect(
        within(section).getByRole("heading", { name: item.name }),
        `${item.name} has no card`
      ).toBeInTheDocument();
    }
    expect(
      within(section).getAllByRole("heading", { level: 3 }),
      "card count has drifted from extras.items"
    ).toHaveLength(en.extras.items.length);
  });

  it("gives every card its own icon, with none falling back to the bullet", () => {
    renderSection();
    const { en } = loadDicts();

    // One icon per item: a dictionary that outgrew ICONS renders "•" here.
    expect(
      icons(),
      "an extras card fell back to the '•' placeholder — ICONS is shorter than extras.items"
    ).not.toContain("•");
    expect(
      icons().length,
      "icon count disagrees with extras.items — the index zip in extras.tsx has drifted"
    ).toBe(en.extras.items.length);
    expect(icons().every((icon) => icon !== "")).toBe(true);

    // Distinct, because the failure this guards against (a short ICONS array,
    // or a copied entry) shows up as a repeated glyph just as readily as a
    // bullet.
    expect(new Set(icons()).size, "two extras cards share an icon").toBe(
      icons().length
    );
  });

  it("keeps the icons and the card count when the copy switches to Farsi", () => {
    // The zip is by index and the FA list is a separate array, so a Farsi
    // dictionary of a different length is the same defect in the other locale.
    const { setLang } = renderSection();
    const before = icons();
    setLang("fa");

    const { fa } = loadDicts();
    expect(icons(), "the icons changed with the language").toEqual(before);
    expect(icons()).not.toContain("•");
    expect(
      screen.getAllByRole("heading", { level: 3 }),
      "the FA extras list is a different length from the icon list"
    ).toHaveLength(fa.extras.items.length);
    expect(
      screen.getByRole("heading", { name: fa.extras.items[0].name })
    ).toBeInTheDocument();
  });
});
