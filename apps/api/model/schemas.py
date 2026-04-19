from typing import Literal

from pydantic import BaseModel, Field, field_validator


class SimulateRequest(BaseModel):
    """Policy levers; values are deltas vs a stylized baseline unless noted."""

    top_marginal_rate_ppt: float = Field(
        0.0,
        ge=-5.0,
        le=5.0,
        description="Change in top statutory marginal rate (percentage points).",
    )
    corporate_rate_ppt: float = Field(
        0.0,
        ge=-10.0,
        le=10.0,
        description="Change in corporate income tax rate (percentage points).",
    )
    payroll_combined_ppt: float = Field(
        0.0,
        ge=-2.0,
        le=2.0,
        description="Combined employer+employee payroll tax change (percentage points).",
    )
    discretionary_spending_pct_gdp_ppt: float = Field(
        0.0,
        ge=-3.0,
        le=3.0,
        description="Change in primary discretionary outlays as share of GDP (percentage points).",
    )
    regulatory_cost_index: float = Field(
        1.0,
        ge=0.5,
        le=1.5,
        description="Index on economy-wide compliance cost (1 = baseline).",
    )
    tcja_sunset_year: int | None = Field(
        None,
        description="If set, models partial individual provisions expiring in that year (2025–2035).",
    )
    tcja_sunset_depth: Literal["none", "partial", "full"] = Field(
        "none",
        description="How much of TCJA individual provisions are assumed to sunset.",
    )
    luxury_consumption_fee_ppt: float = Field(
        0.0,
        ge=0.0,
        le=10.0,
        description="Illustrative fee on high-end consumption (percentage points), scenario use.",
    )
    tariff_proxy_ppt: float = Field(
        0.0,
        ge=-5.0,
        le=15.0,
        description="Illustrative average effective tariff proxy (percentage points).",
    )

    @field_validator("tcja_sunset_year")
    @classmethod
    def validate_sunset_year(cls, v: int | None) -> int | None:
        if v is None:
            return v
        if v < 2025 or v > 2035:
            raise ValueError("tcja_sunset_year must be between 2025 and 2035")
        return v


class QuintileImpact(BaseModel):
    quintile: str
    income_share: float
    tax_change_share: float
    avg_tax_change_pct_income: float


class SimulateResponse(BaseModel):
    revenue_change_10yr_bn: float = Field(
        ...,
        description="Illustrative 10-year change in federal receipts (billions USD, undiscounted sum).",
    )
    outlay_change_10yr_bn: float
    deficit_change_10yr_bn: float
    gdp_level_year5_pct: float = Field(
        ...,
        description="Illustrative GDP level effect in year 5 vs baseline (%).",
    )
    median_household_income_change_pct: float
    distributional: list[QuintileImpact]
    model_version: str
    data_vintage: str
    disclaimer: str
