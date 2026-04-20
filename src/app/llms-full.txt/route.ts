import { LLMS_FULL_TXT } from "@/lib/llms-content";

// See llms.txt/route.ts for why this route has no agent detection or
// analytics (static export, no runtime).
export const dynamic = "force-static";

export async function GET() {
  return new Response(LLMS_FULL_TXT, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
