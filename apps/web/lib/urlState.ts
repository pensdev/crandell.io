import type { SimulateRequest } from "./types";

export const PRESET_IDS = [
  "baseline",
  "tcja_sunset_2026",
  "tcja_sunset_2026_partial",
  "trump_platinum_card",
] as const;

export type PresetId = (typeof PRESET_IDS)[number];

export function isPresetId(s: string): s is PresetId {
  return (PRESET_IDS as readonly string[]).includes(s);
}

/** Compact query keys to keep share URLs short. */
const Q = {
  preset: "p",
  top: "tm",
  corp: "cr",
  pay: "py",
  disc: "ds",
  reg: "rg",
  sy: "sy",
  sd: "sd",
  lux: "lx",
  tar: "tf",
  ca: "ca",
  cb: "cb",
} as const;

export function requestToQuery(
  request: SimulateRequest,
  presetId: string,
  compare?: { a: string; b: string } | null,
): string {
  const sp = new URLSearchParams();
  sp.set(Q.preset, presetId);
  sp.set(Q.top, String(request.top_marginal_rate_ppt));
  sp.set(Q.corp, String(request.corporate_rate_ppt));
  sp.set(Q.pay, String(request.payroll_combined_ppt));
  sp.set(Q.disc, String(request.discretionary_spending_pct_gdp_ppt));
  sp.set(Q.reg, String(request.regulatory_cost_index));
  if (request.tcja_sunset_year != null) {
    sp.set(Q.sy, String(request.tcja_sunset_year));
  }
  sp.set(Q.sd, request.tcja_sunset_depth);
  sp.set(Q.lux, String(request.luxury_consumption_fee_ppt));
  sp.set(Q.tar, String(request.tariff_proxy_ppt));
  if (compare?.a && compare?.b) {
    sp.set(Q.ca, compare.a);
    sp.set(Q.cb, compare.b);
  }
  const q = sp.toString();
  return q ? `?${q}` : "";
}

export function parseQueryToState(search: string): {
  presetId: string;
  request: SimulateRequest;
  compare: { a: PresetId; b: PresetId } | null;
} | null {
  const sp = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search,
  );
  if (!sp.has(Q.preset) && !sp.has(Q.top)) {
    return null;
  }
  const presetRaw = sp.get(Q.preset) ?? "baseline";
  const presetId = isPresetId(presetRaw) ? presetRaw : "baseline";

  const num = (key: string, fallback: number) => {
    const v = sp.get(key);
    if (v === null || v === "") return fallback;
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  const syRaw = sp.get(Q.sy);
  const tcja_sunset_year =
    syRaw === null || syRaw === ""
      ? null
      : Number.isFinite(Number(syRaw))
        ? Number(syRaw)
        : null;

  const sd = sp.get(Q.sd);
  const tcja_sunset_depth =
    sd === "partial" || sd === "full" || sd === "none"
      ? sd
      : tcja_sunset_year === null
        ? "none"
        : "full";

  const request: SimulateRequest = {
    top_marginal_rate_ppt: num(Q.top, 0),
    corporate_rate_ppt: num(Q.corp, 0),
    payroll_combined_ppt: num(Q.pay, 0),
    discretionary_spending_pct_gdp_ppt: num(Q.disc, 0),
    regulatory_cost_index: num(Q.reg, 1),
    tcja_sunset_year,
    tcja_sunset_depth,
    luxury_consumption_fee_ppt: num(Q.lux, 0),
    tariff_proxy_ppt: num(Q.tar, 0),
  };

  const ca = sp.get(Q.ca);
  const cb = sp.get(Q.cb);
  const compare: { a: PresetId; b: PresetId } | null =
    ca && cb && isPresetId(ca) && isPresetId(cb) ? { a: ca, b: cb } : null;

  return { presetId, request, compare };
}
