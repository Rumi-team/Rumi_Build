"use client";

import { useEffect, useRef, useState } from "react";

type CalApi = ((...args: unknown[]) => void) & {
  loaded?: boolean;
  ns?: Record<string, CalApi>;
  q?: unknown[][];
};

declare global {
  interface Window {
    Cal?: CalApi;
  }
}

interface CalEmbedProps {
  calLink: string;
  email?: string | null;
  name?: string | null;
  /**
   * Mobile fallback height. The Cal embed auto-resizes to its content via
   * postMessage once it loads — this only prevents layout shift before that.
   */
  minHeight?: number;
}

const EMBED_SCRIPT_SRC = "https://app.cal.com/embed/embed.js";

export function CalEmbed({
  calLink,
  email,
  name,
  minHeight = 1100,
}: CalEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Cal.com's official snippet (https://cal.com/docs/embed) — installs
    // window.Cal and queues calls until embed.js loads.
    (function (C, A, L) {
      const w = C as Window & { Cal?: CalApi };
      const d = w.document;
      const p = (a: CalApi, ar: unknown[]) => {
        a.q = a.q || [];
        a.q.push(ar);
      };
      w.Cal =
        w.Cal ||
        (function () {
          const cal = w.Cal as CalApi;
          // eslint-disable-next-line prefer-rest-params
          const ar = arguments as unknown as unknown[];
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            const s = d.createElement("script");
            s.src = A;
            s.onload = () => setReady(true);
            d.head.appendChild(s);
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api = function (this: unknown) {
              // eslint-disable-next-line prefer-rest-params
              p(api as CalApi, arguments as unknown as unknown[]);
            } as CalApi;
            const namespace = ar[1];
            api.q = api.q || [];
            if (typeof namespace === "string") {
              cal.ns = cal.ns || {};
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ar);
            } else {
              p(cal, ar);
            }
            return;
          }
          p(cal, ar);
        } as unknown as CalApi);
    })(window, EMBED_SCRIPT_SRC, "init");

    // If the script is already cached from an earlier mount, mark ready.
    if (window.Cal?.loaded) setReady(true);

    const prefill: Record<string, string> = {};
    if (name) prefill.name = name;
    if (email) prefill.email = email;

    window.Cal!("init", { origin: "https://app.cal.com" });

    window.Cal!("inline", {
      elementOrSelector: "#cal-embed-target",
      calLink,
      config: Object.keys(prefill).length ? prefill : undefined,
    });

    window.Cal!("ui", {
      theme: "light",
      cssVarsPerTheme: {
        light: { "cal-brand": "#059669" },
        dark: { "cal-brand": "#059669" },
      },
      hideEventTypeDetails: false,
      layout: "month_view",
    });
  }, [calLink, email, name]);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-visible rounded-xl border border-line bg-white"
      style={{ minHeight }}
    >
      {!ready && (
        <div
          className="flex w-full items-center justify-center text-sm text-muted"
          style={{ minHeight }}
        >
          Loading calendar…
        </div>
      )}
      <div
        id="cal-embed-target"
        className="cal-embed-target w-full"
        style={{ minHeight: ready ? minHeight : 0 }}
      />
    </div>
  );
}
