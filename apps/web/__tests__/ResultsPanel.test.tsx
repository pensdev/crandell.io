import { render, screen } from "@testing-library/react";

import { ResultsPanel } from "@/components/ResultsPanel";
import type { SimulateResponse } from "@/lib/types";

const sample: SimulateResponse = {
  revenue_change_10yr_bn: 120.5,
  outlay_change_10yr_bn: 40,
  deficit_change_10yr_bn: -80.5,
  gdp_level_year5_pct: 0.3,
  median_household_income_change_pct: -0.1,
  distributional: [],
  model_version: "0.1.0",
  data_vintage: "2024-illustrative",
  disclaimer: "Test disclaimer",
};

describe("ResultsPanel", () => {
  it("renders headline metrics", () => {
    render(<ResultsPanel result={sample} />);
    expect(screen.getByText("120.5")).toBeInTheDocument();
    expect(screen.getByText(/GDP level, year 5/)).toBeInTheDocument();
  });
});
