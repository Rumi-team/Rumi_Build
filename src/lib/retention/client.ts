import { GoogleAuth } from "google-auth-library";

const RETENTION_API_URL = process.env.RETENTION_API_URL || "";
const RETENTION_API_KEY = process.env.RETENTION_API_KEY || "";
const RETENTION_SA_KEY_B64 = process.env.RETENTION_SA_KEY || "";

let cachedAuth: GoogleAuth | null = null;

async function getOidcToken(): Promise<string | null> {
  if (!RETENTION_SA_KEY_B64 || !RETENTION_API_URL) return null;
  try {
    if (!cachedAuth) {
      const keyJson = JSON.parse(
        Buffer.from(RETENTION_SA_KEY_B64, "base64").toString("utf-8"),
      );
      cachedAuth = new GoogleAuth({ credentials: keyJson });
    }
    const client = await cachedAuth.getIdTokenClient(RETENTION_API_URL);
    const hdrs = await client.getRequestHeaders();
    const authHeader = hdrs.get("Authorization");
    return authHeader?.replace("Bearer ", "") || null;
  } catch {
    return null;
  }
}

async function getHeaders(): Promise<Record<string, string>> {
  const h: Record<string, string> = {
    "Content-Type": "application/json",
    "X-API-Key": RETENTION_API_KEY,
  };
  const oidc = await getOidcToken();
  if (oidc) h["Authorization"] = `Bearer ${oidc}`;
  return h;
}

export async function retentionPost(
  path: string,
  body: Record<string, unknown>,
): Promise<{ ok: boolean; status: number; data?: unknown; error?: string }> {
  if (!RETENTION_API_URL) {
    return { ok: false, status: 0, error: "RETENTION_API_URL not configured" };
  }
  try {
    const resp = await fetch(`${RETENTION_API_URL}${path}`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(body),
      // 5s budget; webhook caller retries on Stripe-side if we 5xx
      signal: AbortSignal.timeout(5000),
    });
    const text = await resp.text();
    let data: unknown = undefined;
    try {
      data = text ? JSON.parse(text) : undefined;
    } catch {
      data = text;
    }
    return { ok: resp.ok, status: resp.status, data };
  } catch (e) {
    return { ok: false, status: 0, error: e instanceof Error ? e.message : String(e) };
  }
}
