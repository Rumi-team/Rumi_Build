// @vitest-environment jsdom
// This file renders a component, so it needs a DOM. The suite defaults to the
// `node` environment (vitest.config.ts); only the files that render opt in.
import { act, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HowItWorks } from "@/components/how-it-works";
import { LanguageProvider, useT } from "@/lib/i18n";

// ── Why this file exists ──────────────────────────────────────────────────────
// The four step numerals are the only numbers on the homepage that are COMPUTED
// (`i + 1`) rather than written into the dictionary. Every other figure the
// Farsi homepage shows — the five prices, the workloads, the "یک تا سه هفته"
// timeline — is typed in Persian numerals by the translator, and
// i18n-parity.test.ts pins that. These four fell through that gap and rendered
// "1 2 3 4" in Latin digits on the Farsi page, in the largest type any numeral
// on it gets.
//
// The numerals are asserted as the DIGITS THE LOCALE PRODUCES rather than as
// pasted Persian characters, so this cannot drift into agreeing with a typo, and
// it stays correct if a third language is ever added.

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
      <HowItWorks />
    </LanguageProvider>
  );
  return { ...utils, setLang: (l: "en" | "fa") => act(() => setLang(l)) };
}

/** The step numerals, in DOM order. */
function numerals(): string[] {
  return Array.from(document.querySelectorAll("ol > li > span")).map((el) =>
    el.textContent!.trim()
  );
}

describe("the how-it-works step numerals follow the language", () => {
  it("renders Latin digits in English and Persian digits in Farsi", () => {
    const { setLang } = renderSection();

    const latin = [1, 2, 3, 4].map((n) => n.toLocaleString("en-US"));
    const persian = [1, 2, 3, 4].map((n) => n.toLocaleString("fa-IR"));
    // Guards the expectation itself: if the test runtime ever lacks the fa-IR
    // locale data, `toLocaleString` silently falls back to Latin digits and both
    // halves of this test would assert the same thing and pass.
    expect(persian, "no fa-IR locale data in this runtime").not.toEqual(latin);
    expect(persian).toEqual(["۱", "۲", "۳", "۴"]);

    expect(numerals()).toEqual(latin);
    setLang("fa");
    expect(numerals(), "Latin digits on the Farsi homepage").toEqual(persian);
    setLang("en");
    expect(numerals()).toEqual(latin);
  });
});
