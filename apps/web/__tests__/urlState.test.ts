import {
  parseQueryToState,
  requestToQuery,
  type PresetId,
} from "@/lib/urlState";
import type { SimulateRequest } from "@/lib/types";

describe("urlState", () => {
  it("round-trips request and preset via query string", () => {
    const request: SimulateRequest = {
      top_marginal_rate_ppt: 1.2,
      corporate_rate_ppt: -0.5,
      payroll_combined_ppt: 0,
      discretionary_spending_pct_gdp_ppt: 0.25,
      regulatory_cost_index: 1.05,
      tcja_sunset_year: 2026,
      tcja_sunset_depth: "full",
      luxury_consumption_fee_ppt: 0.1,
      tariff_proxy_ppt: 2,
    };
    const presetId = "tcja_sunset_2026";
    const compare = { a: "baseline" as PresetId, b: "trump_platinum_card" as PresetId };
    const q = requestToQuery(request, presetId, compare);
    const parsed = parseQueryToState(q);
    expect(parsed).not.toBeNull();
    expect(parsed!.presetId).toBe(presetId);
    expect(parsed!.request.top_marginal_rate_ppt).toBeCloseTo(1.2);
    expect(parsed!.request.tcja_sunset_year).toBe(2026);
    expect(parsed!.request.tcja_sunset_depth).toBe("full");
    expect(parsed!.compare).toEqual(compare);
  });

  it("returns null for empty query", () => {
    expect(parseQueryToState("")).toBeNull();
  });
});
