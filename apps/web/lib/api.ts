import type { SimulateRequest, SimulateResponse } from "./types";

const DEFAULT_DEV_API = "http://127.0.0.1:8000";

function envApiBase(): string {
  return (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
}

/**
 * Base URL for FastAPI. In production on the same host as the static site (nginx
 * proxies `/simulate` to uvicorn), use same-origin relative URLs so a build
 * without `NEXT_PUBLIC_API_URL` still works. Local dev continues to call
 * `DEFAULT_DEV_API` unless `NEXT_PUBLIC_API_URL` is set.
 */
export function getApiBase(): string {
  const fromEnv = envApiBase();

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const isLocal =
      host === "localhost" || host === "127.0.0.1" || host === "[::1]";
    if (isLocal) {
      return fromEnv || DEFAULT_DEV_API;
    }
    // Deployed: explicit split-frontend/API URL wins (e.g. Vercel → Fly).
    if (fromEnv) {
      return fromEnv;
    }
    return "";
  }

  return fromEnv || DEFAULT_DEV_API;
}

export async function simulatePolicy(
  body: SimulateRequest,
): Promise<SimulateResponse> {
  const res = await fetch(`${getApiBase()}/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<SimulateResponse>;
}

export async function fetchPresetBodies(): Promise<
  Record<string, Record<string, unknown>>
> {
  const res = await fetch(`${getApiBase()}/simulate/presets`);
  if (!res.ok) throw new Error("Failed to load presets");
  const data = (await res.json()) as { presets: Record<string, unknown> };
  return data.presets as Record<string, Record<string, unknown>>;
}
