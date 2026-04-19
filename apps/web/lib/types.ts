export type QuintileImpact = {
  quintile: string;
  income_share: number;
  tax_change_share: number;
  avg_tax_change_pct_income: number;
};

export type SimulateResponse = {
  revenue_change_10yr_bn: number;
  outlay_change_10yr_bn: number;
  deficit_change_10yr_bn: number;
  gdp_level_year5_pct: number;
  median_household_income_change_pct: number;
  distributional: QuintileImpact[];
  model_version: string;
  data_vintage: string;
  disclaimer: string;
};

export type SimulateRequest = {
  top_marginal_rate_ppt: number;
  corporate_rate_ppt: number;
  payroll_combined_ppt: number;
  discretionary_spending_pct_gdp_ppt: number;
  regulatory_cost_index: number;
  tcja_sunset_year: number | null;
  tcja_sunset_depth: "none" | "partial" | "full";
  luxury_consumption_fee_ppt: number;
  tariff_proxy_ppt: number;
};

export type ScenarioMeta = {
  id: string;
  title: string;
  summary: string;
  assumptions: string[];
};

export type ScenariosFile = {
  version: string;
  scenarios: ScenarioMeta[];
};
