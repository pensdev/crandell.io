from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd

from model.schemas import QuintileImpact, SimulateRequest, SimulateResponse

DATA_DIR = Path(__file__).resolve().parent.parent / "data" / "baselines"
MODEL_VERSION = "0.1.0"
DATA_VINTAGE = "2024-illustrative"
DISCLAIMER = (
    "Illustrative educational model only. Not an official government score. "
    "Assumptions are simplified and rounded."
)


def _load_baselines() -> tuple[pd.Series, pd.DataFrame]:
    fb = pd.read_csv(DATA_DIR / "federal_baselines.csv")
    series = fb.set_index("metric")["value"].astype(float)
    q = pd.read_csv(DATA_DIR / "quintile_shares.csv")
    return series, q


def _tcja_sunset_effect(req: SimulateRequest) -> float:
    """Incremental receipt change (trillions, 10-year-style aggregate) from TCJA sunset."""
    if req.tcja_sunset_depth == "none" or req.tcja_sunset_year is None:
        return 0.0
    depth_map = {"partial": 0.45, "full": 1.0}
    d = depth_map.get(req.tcja_sunset_depth, 0.0)
    year_weight = max(0.0, min(1.0, (2032 - req.tcja_sunset_year) / 7.0))
    s, _ = _load_baselines()
    gdp = float(s["gdp_nominal_trillions_2024"])
    incremental_annual = 0.012 * gdp * d * (0.5 + 0.5 * year_weight)
    return incremental_annual * 10 * 0.85 * 0.48


def fiscal_gdp_effect(
    primary_surplus_delta_frac_gdp: float,
    reg_hit: float,
    revenue_delta_t: float,
    gdp: float,
    rev_fb: float,
) -> float:
    """Illustrative year-5 GDP level percent change."""
    primary_pct = primary_surplus_delta_frac_gdp * 100.0
    demand = 0.35 * (-primary_pct)
    supply_drag = -reg_hit * 100.0
    rev_feed = rev_fb * (revenue_delta_t / gdp) * 100.0 * -0.15
    return float(np.clip(demand + supply_drag + rev_feed, -5.0, 5.0))


def run_simulation(req: SimulateRequest) -> SimulateResponse:
    s, qdf = _load_baselines()

    receipts = float(s["federal_receipts_trillions_fy2024"])
    gdp = float(s["gdp_nominal_trillions_2024"])
    inc_share = float(s["income_tax_share_of_receipts"])
    corp_share = float(s["corp_tax_share_of_receipts"])
    pay_share = float(s["payroll_tax_share_of_receipts"])
    e_top = float(s["elasticity_revenue_to_top_rate"])
    rev_fb = float(s["revenue_feedback_income_tax"])
    import_share = float(s["tariff_revenue_share_import_base"])

    d_income = receipts * inc_share * (e_top * req.top_marginal_rate_ppt / 100.0)
    d_corp = receipts * corp_share * (0.9 * req.corporate_rate_ppt / 100.0)
    d_pay = receipts * pay_share * (0.85 * req.payroll_combined_ppt / 100.0)
    d_luxury = gdp * 0.08 * (req.luxury_consumption_fee_ppt / 100.0)
    d_tariff = gdp * import_share * (req.tariff_proxy_ppt / 100.0)
    tcja = _tcja_sunset_effect(req)

    revenue_delta_t = d_income + d_corp + d_pay + d_luxury + d_tariff + tcja
    spend_delta_t = gdp * (req.discretionary_spending_pct_gdp_ppt / 100.0)

    reg_gdp_hit = (req.regulatory_cost_index - 1.0) * 0.35

    primary_surplus_delta_frac_gdp = (revenue_delta_t - spend_delta_t) / gdp

    gdp_level_y5 = fiscal_gdp_effect(
        primary_surplus_delta_frac_gdp,
        reg_gdp_hit,
        revenue_delta_t,
        gdp,
        rev_fb,
    )

    revenue_10yr_bn = revenue_delta_t * 1000.0 * 10.0
    outlay_10yr_bn = spend_delta_t * 1000.0 * 10.0
    deficit_10yr_bn = outlay_10yr_bn - revenue_10yr_bn

    total_exposure = float(qdf["marginal_exposure_to_top_rate"].sum())
    rate_like = d_income + d_luxury * 0.85
    other = d_corp + d_pay + d_tariff * 0.55
    allocations: list[float] = []
    for _, r in qdf.iterrows():
        q_exp = float(r["marginal_exposure_to_top_rate"]) / total_exposure
        q_b = float(r["tax_burden_share"])
        alloc = q_exp * rate_like + q_b * other
        allocations.append(alloc)

    total_alloc = sum(allocations) or 1.0
    rows: list[QuintileImpact] = []
    for alloc, (_, r) in zip(allocations, qdf.iterrows(), strict=True):
        inc_sh = float(r["income_share"])
        t_share = alloc / total_alloc if revenue_delta_t != 0 else 0.2
        hh_income = inc_sh * gdp * 1000.0
        avg_pct = (alloc * 1000.0 * 100.0 / hh_income) if hh_income > 0 else 0.0
        rows.append(
            QuintileImpact(
                quintile=str(r["quintile"]),
                income_share=inc_sh,
                tax_change_share=float(np.clip(t_share, -2.0, 2.0)),
                avg_tax_change_pct_income=float(np.clip(avg_pct, -25.0, 25.0)),
            )
        )

    median_hh = gdp_level_y5 * 0.45 + (primary_surplus_delta_frac_gdp * 100.0) * -0.08

    return SimulateResponse(
        revenue_change_10yr_bn=float(revenue_10yr_bn),
        outlay_change_10yr_bn=float(outlay_10yr_bn),
        deficit_change_10yr_bn=float(deficit_10yr_bn),
        gdp_level_year5_pct=float(gdp_level_y5),
        median_household_income_change_pct=float(median_hh),
        distributional=rows,
        model_version=MODEL_VERSION,
        data_vintage=DATA_VINTAGE,
        disclaimer=DISCLAIMER,
    )
