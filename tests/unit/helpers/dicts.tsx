import { act, render } from "@testing-library/react";
import { LANGUAGES, LanguageProvider, useT, type Dict, type Lang } from "@/lib/i18n";

/**
 * The EN and FA dictionaries are module-private in src/lib/i18n.tsx — the only
 * legitimate way to reach them is the way the site does: through the provider.
 * So we mount a probe inside LanguageProvider and switch languages the way the
 * dropdown does. No production export exists just for tests.
 */
export function loadDicts(): Record<Lang, Dict> {
  let ctx: ReturnType<typeof useT> | undefined;

  function Probe() {
    ctx = useT();
    return null;
  }

  const { unmount } = render(
    <LanguageProvider>
      <Probe />
    </LanguageProvider>
  );

  const out = {} as Record<Lang, Dict>;
  for (const language of LANGUAGES) {
    act(() => ctx!.setLang(language.code));
    out[language.code] = ctx!.t;
  }

  unmount();
  return out;
}
