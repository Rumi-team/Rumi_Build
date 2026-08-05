// jsdom 29 ships no `window.matchMedia` at all — not a stub that answers
// `false`, the property is simply absent — so the moment a component asks the
// browser how wide it is, every jsdom test that mounts it dies on
// "window.matchMedia is not a function". mobile-menu.tsx asks, because the
// overlay it owns is a phone-only element that has to close itself when the
// viewport crosses into the desktop breakpoint.
//
// This is a DOM the environment failed to provide, not production code written
// for the tests: the shim answers the same question a browser would, off the
// same `window.innerWidth` a browser resizes, and `setViewportWidth` is how a
// test performs the resize.
//
// It refuses queries it does not understand rather than answering `false`.
// A shim that quietly said "no" to `(min-width: 768px)` because the syntax
// drifted would make the auto-close case below pass while testing nothing —
// exactly the vacuous green TESTING.md's "guard the walkers" rule exists to
// prevent.

/** A phone. jsdom's own default is 1024, which is the desktop side of every
 *  breakpoint this site has — so the chrome tests that open the mobile overlay
 *  would be opening it at a width where it does not exist. */
export const DEFAULT_WIDTH = 375;

type ChangeListener = (event: { matches: boolean; media: string }) => void;

const MIN_WIDTH = /^\(\s*min-width:\s*(\d+)px\s*\)$/;
const MAX_WIDTH = /^\(\s*max-width:\s*(\d+)px\s*\)$/;

let width = DEFAULT_WIDTH;

function evaluate(media: string): boolean {
  const min = media.match(MIN_WIDTH);
  if (min) return width >= Number(min[1]);
  const max = media.match(MAX_WIDTH);
  if (max) return width <= Number(max[1]);
  throw new Error(
    `viewport shim cannot evaluate "${media}" — teach it that query rather than letting it answer false`
  );
}

class MediaQueryListShim {
  readonly media: string;
  matches: boolean;
  onchange: ChangeListener | null = null;
  private readonly listeners = new Set<ChangeListener>();

  constructor(media: string) {
    this.media = media;
    this.matches = evaluate(media);
  }

  addEventListener(type: string, listener: ChangeListener): void {
    if (type === "change") this.listeners.add(listener);
  }

  removeEventListener(type: string, listener: ChangeListener): void {
    if (type === "change") this.listeners.delete(listener);
  }

  /** Re-reads the width and notifies, the way a browser does on resize. */
  reevaluate(): void {
    const next = evaluate(this.media);
    if (next === this.matches) return;
    this.matches = next;
    const event = { matches: next, media: this.media };
    this.onchange?.(event);
    // Copied before iterating: a listener that unsubscribes itself (the
    // component's cleanup does, once the state change lands) must not mutate
    // the set mid-walk.
    for (const listener of [...this.listeners]) listener(event);
  }
}

const live = new Set<MediaQueryListShim>();

/** Installs the shim on the current jsdom window. Idempotent. */
export function installMatchMedia(): void {
  window.innerWidth = width;
  // Double cast on purpose: the shim implements the part of MediaQueryList the
  // site uses (`matches` + change subscription) and none of the legacy
  // addListener/dispatchEvent surface, so it is deliberately not the full type.
  window.matchMedia = ((media: string) => {
    const list = new MediaQueryListShim(media);
    live.add(list);
    return list;
  }) as unknown as typeof window.matchMedia;
}

/** Resize the window. Every live MediaQueryList re-evaluates and fires. */
export function setViewportWidth(next: number): void {
  width = next;
  window.innerWidth = next;
  for (const list of [...live]) list.reevaluate();
}

/** Back to a phone, with no listeners carried into the next test. */
export function resetViewport(): void {
  width = DEFAULT_WIDTH;
  live.clear();
  if (typeof window !== "undefined") window.innerWidth = DEFAULT_WIDTH;
}
