/**
 * Agent detection — classifies an incoming request by its User-Agent string.
 *
 * Two tiers:
 *  - "declared": the UA matches a known crawler/agent from the allowlist
 *    (GPTBot, ClaudeBot, PerplexityBot, Googlebot, ...).
 *  - "heuristic": the UA looks bot-like but does not self-identify via a
 *    known name (matches words like "bot", "crawl", "spider", "agent",
 *    "gpt", "claude", "codex", "llm").
 *
 * Everything else is "unknown" (treated as a human browser).
 *
 * Keep this list short and conservative. The goal is ~zero false positives
 * for real humans. If in doubt, classify as "unknown".
 */

const DECLARED_AGENTS: Record<string, string> = {
  // OpenAI / ChatGPT
  gptbot: "gptbot",
  "chatgpt-user": "chatgpt-user",
  "oai-searchbot": "oai-searchbot",
  // Anthropic / Claude
  claudebot: "claudebot",
  "claude-web": "claude-web",
  "anthropic-ai": "anthropic-ai",
  // Perplexity
  perplexitybot: "perplexitybot",
  "perplexity-user": "perplexity-user",
  // Google
  googlebot: "googlebot",
  "google-extended": "google-extended",
  // Microsoft
  bingbot: "bingbot",
  // Apple
  "applebot-extended": "applebot-extended",
  // Common Crawl / ByteDance / Meta / Amazon / DuckDuckGo
  ccbot: "ccbot",
  bytespider: "bytespider",
  "meta-externalagent": "meta-externalagent",
  facebookbot: "facebookbot",
  amazonbot: "amazonbot",
  duckduckbot: "duckduckbot",
};

const HEURISTIC_PATTERN =
  /\b(bot|crawl|spider|agent|gpt|claude|codex|llm|ai-crawler)\b/i;

export type AgentSource = "declared" | "heuristic" | "unknown";

export interface AgentInfo {
  isAgent: boolean;
  source: AgentSource;
  agentId: string;
  userAgentRaw: string;
}

export function detectAgent(
  userAgent: string | null | undefined
): AgentInfo {
  const ua = (userAgent ?? "").trim();
  if (!ua) {
    return {
      isAgent: false,
      source: "unknown",
      agentId: "unknown",
      userAgentRaw: "",
    };
  }

  const uaLower = ua.toLowerCase();

  for (const key of Object.keys(DECLARED_AGENTS)) {
    if (uaLower.includes(key)) {
      return {
        isAgent: true,
        source: "declared",
        agentId: DECLARED_AGENTS[key],
        userAgentRaw: ua,
      };
    }
  }

  if (HEURISTIC_PATTERN.test(ua)) {
    return {
      isAgent: true,
      source: "heuristic",
      agentId: "heuristic-unknown",
      userAgentRaw: ua,
    };
  }

  return {
    isAgent: false,
    source: "unknown",
    agentId: "unknown",
    userAgentRaw: ua,
  };
}
