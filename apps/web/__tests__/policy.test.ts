import { normalizeRequest } from "@/lib/policy";

describe("normalizeRequest", () => {
  it("maps API preset fields", () => {
    const r = normalizeRequest({
      top_marginal_rate_ppt: 1.2,
      tcja_sunset_year: 2026,
      tcja_sunset_depth: "full",
    });
    expect(r.top_marginal_rate_ppt).toBe(1.2);
    expect(r.tcja_sunset_year).toBe(2026);
    expect(r.tcja_sunset_depth).toBe("full");
  });

  it("defaults missing numeric fields", () => {
    const r = normalizeRequest({});
    expect(r.top_marginal_rate_ppt).toBe(0);
    expect(r.regulatory_cost_index).toBe(1);
    expect(r.tcja_sunset_year).toBeNull();
  });
});
