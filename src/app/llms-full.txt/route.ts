import { NextRequest } from "next/server";
import { track } from "@vercel/analytics/server";
import { LLMS_FULL_TXT } from "@/lib/llms-content";
import { detectAgent } from "@/lib/agent-detect";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const agent = detectAgent(request.headers.get("user-agent"));

  track("llms_txt_fetched", {
    site: "rumi.build",
    variant: "full",
    agent_id: agent.agentId,
    agent_source: agent.source,
    is_agent: agent.isAgent,
    user_agent: agent.userAgentRaw.slice(0, 500),
  }).catch(() => {});

  return new Response(LLMS_FULL_TXT, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
