import { LLMS_TXT } from "@/lib/llms-content";

// rumi.build ships as a fully static HTML export (next.config.ts:
// `output: "export"`). There is no server runtime, so this route
// handler runs ONCE at build time and its output is baked into a
// static file that Vercel's CDN serves directly.
//
// That means:
//  - We cannot read request headers (no request).
//  - We cannot fire server-side analytics per hit.
//  - Cache lifetime is controlled at the CDN edge, not by `revalidate`.
//
// Per-hit agent detection lives in the rumi.team and rumiagent.com
// variants where we do have a runtime.
export const dynamic = "force-static";

export async function GET() {
  return new Response(LLMS_TXT, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
