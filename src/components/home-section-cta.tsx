"use client";

import { SectionCTA } from "@/components/section-cta";
import { useT } from "@/lib/i18n";

// Translated homepage CTA. SectionCTA stays prop-driven (used on other pages
// with English defaults); this wrapper feeds it the current-language strings.
export function HomeSectionCTA() {
  const { t } = useT();
  return (
    <SectionCTA
      title={t.cta.title}
      description={t.cta.description}
      cta={t.cta.button}
      arrow={t.arrow}
      sub={t.cta.sub}
      href="/book"
    />
  );
}
