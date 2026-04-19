import type { SimulateRequest } from "./types";

export function normalizeRequest(
  raw: Record<string, unknown>,
): SimulateRequest {
  return {
    top_marginal_rate_ppt: Number(raw.top_marginal_rate_ppt ?? 0),
    corporate_rate_ppt: Number(raw.corporate_rate_ppt ?? 0),
    payroll_combined_ppt: Number(raw.payroll_combined_ppt ?? 0),
    discretionary_spending_pct_gdp_ppt: Number(
      raw.discretionary_spending_pct_gdp_ppt ?? 0,
    ),
    regulatory_cost_index: Number(raw.regulatory_cost_index ?? 1),
    tcja_sunset_year:
      raw.tcja_sunset_year === null || raw.tcja_sunset_year === undefined
        ? null
        : Number(raw.tcja_sunset_year),
    tcja_sunset_depth: (raw.tcja_sunset_depth ??
      "none") as SimulateRequest["tcja_sunset_depth"],
    luxury_consumption_fee_ppt: Number(raw.luxury_consumption_fee_ppt ?? 0),
    tariff_proxy_ppt: Number(raw.tariff_proxy_ppt ?? 0),
  };
}
