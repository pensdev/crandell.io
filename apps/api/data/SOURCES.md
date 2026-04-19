# Data sources and methodology notes

Figures in `baselines/*.csv` are **illustrative magnitudes** for a portfolio demo, rounded to match public ballpark ranges from:

- **BEA**: [National Income and Product Accounts](https://www.bea.gov/data/gdp/gross-domestic-product) — nominal GDP scale.
- **CBO / Treasury**: budget totals and receipt composition — order-of-magnitude FY receipts/outlays (see CBO *Budget and Economic Outlook* and Monthly Treasury Statements).
- **BLS**: income distribution discussions — quintile shares are **stylized** and not a direct pull from CPS microdata in this repo.

**Vintage**: values tagged conceptually as “2024-style” for the demo; refresh CSVs when you update the model.

**Federal Register**: not ingested automatically; the UI links to [federalregister.gov](https://www.federalregister.gov/) for regulatory context. The `regulatory_cost_index` lever is a scalar proxy, not an econometric estimate of rulemaking costs.

This simulator does **not** reproduce official Joint Committee on Taxation, Treasury, or CBO scores.
