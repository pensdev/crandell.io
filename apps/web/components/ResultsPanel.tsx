import type { SimulateResponse } from "@/lib/types";

type Props = {
  result: SimulateResponse | null;
  loading?: boolean;
  error?: string | null;
};

function fmtBn(n: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(n);
}

export function ResultsPanel({ result, loading, error }: Props) {
  return (
    <section
      aria-labelledby="results-heading"
      className="rounded-xl border border-slate-700/80 bg-slate-900/40 p-6"
    >
      <h2 id="results-heading" className="text-lg font-semibold text-slate-100">
        Results
      </h2>
      {error ? (
        <p className="mt-4 text-sm text-rose-400" role="alert">
          {error}
        </p>
      ) : null}
      {loading ? (
        <p className="mt-4 text-sm text-slate-400" aria-live="polite">
          Running simulation…
        </p>
      ) : null}
      {result && !loading ? (
        <div
          className="mt-4 grid gap-4 md:grid-cols-2"
          aria-live="polite"
        >
          <Metric
            label="Receipts (10-yr, $bn)"
            value={`${fmtBn(result.revenue_change_10yr_bn)}`}
          />
          <Metric
            label="Outlays (10-yr, $bn)"
            value={`${fmtBn(result.outlay_change_10yr_bn)}`}
          />
          <Metric
            label="Deficit (10-yr, $bn)"
            value={`${fmtBn(result.deficit_change_10yr_bn)}`}
          />
          <Metric
            label="GDP level, year 5 (%)"
            value={`${result.gdp_level_year5_pct.toFixed(2)}%`}
          />
          <Metric
            label="Median HH income (%)"
            value={`${result.median_household_income_change_pct.toFixed(2)}%`}
          />
          <Metric label="Model" value={result.model_version} />
          <p className="md:col-span-2 text-xs text-slate-400">
            Data vintage: {result.data_vintage}. {result.disclaimer}
          </p>
        </div>
      ) : null}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-700/60 bg-slate-950/60 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums text-slate-50">
        {value}
      </p>
    </div>
  );
}
