"""Named scenario presets (defaults for SimulateRequest)."""

from model.schemas import SimulateRequest

PRESETS: dict[str, SimulateRequest] = {
    "baseline": SimulateRequest(),
    "tcja_sunset_2026": SimulateRequest(
        tcja_sunset_year=2026,
        tcja_sunset_depth="full",
        top_marginal_rate_ppt=2.6,
        corporate_rate_ppt=0.0,
    ),
    "tcja_sunset_2026_partial": SimulateRequest(
        tcja_sunset_year=2026,
        tcja_sunset_depth="partial",
        top_marginal_rate_ppt=1.2,
        corporate_rate_ppt=0.0,
    ),
    "trump_platinum_card": SimulateRequest(
        luxury_consumption_fee_ppt=3.0,
        tariff_proxy_ppt=4.0,
        regulatory_cost_index=0.92,
        top_marginal_rate_ppt=-0.5,
    ),
}
