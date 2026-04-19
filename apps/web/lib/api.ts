import type { SimulateRequest, SimulateResponse } from "./types";

const DEFAULT_API = "http://127.0.0.1:8000";

export function getApiBase(): string {
  return (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API).replace(/\/$/, "");
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
