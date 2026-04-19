"use client";

import type { SimulateResponse } from "@/lib/types";

type Props = {
  labelA: string;
  labelB: string;
  resultA: SimulateResponse | null;
  resultB: SimulateResponse | null;
  loading: boolean;
  error: string | null;
};

function fmtBn(n: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(n);
}

function Row({
  label,
  a,
  b,
  format,
}: {
  label: string;
  a: number;
  b: number;
  format: "bn" | "pct";
}) {
  const delta = b - a;
  const fmt = (n: number) =>
    format === "pct" ? `${n.toFixed(2)}%` : fmtBn(n);
  const fmtDelta = (n: number) =>
    format === "pct" ? `${n >= 0 ? "+" : ""}${n.toFixed(2)}%` : fmtBn(n);
  return (
    <tr className="border-b border-slate-800/80">
      <th
        scope="row"
        className="py-2 pr-4 text-left text-sm font-medium text-slate-300"
      >
        {label}
      </th>
      <td className="py-2 pr-4 text-right tabular-nums text-slate-100">
        {fmt(a)}
      </td>
      <td className="py-2 pr-4 text-right tabular-nums text-slate-100">
        {fmt(b)}
      </td>
      <td className="py-2 text-right tabular-nums text-sky-300">
        {format === "pct" ? fmtDelta(delta) : fmtBn(delta)}
      </td>
    </tr>
  );
}

export function ComparePanel({
  labelA,
  labelB,
  resultA,
  resultB,
  loading,
  error,
}: Props) {
  const ready = resultA && resultB && !loading;

  return (
    <section
      aria-labelledby="compare-heading"
      className="rounded-xl border border-slate-700/80 bg-slate-900/40 p-6"
    >
      <h2 id="compare-heading" className="text-lg font-semibold text-slate-100">
        Compare scenarios (A vs B)
      </h2>
      <p className="mt-2 text-sm text-slate-400">
        Uses each preset&apos;s default levers from the API. Delta = B − A.
      </p>
      {error ? (
        <p className="mt-4 text-sm text-rose-400" role="alert">
          {error}
        </p>
      ) : null}
      {loading ? (
        <p className="mt-4 text-sm text-slate-400" aria-live="polite">
          Comparing…
        </p>
      ) : null}
      {ready ? (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[28rem] text-sm">
            <caption className="sr-only">
              Side-by-side results for scenario A and scenario B
            </caption>
            <thead>
              <tr className="border-b border-slate-600 text-left text-xs uppercase tracking-wide text-slate-500">
                <th scope="col" className="pb-2 font-medium">
                  Metric
                </th>
                <th scope="col" className="pb-2 text-right font-medium">
                  {labelA}
                </th>
                <th scope="col" className="pb-2 text-right font-medium">
                  {labelB}
                </th>
                <th scope="col" className="pb-2 text-right font-medium">
                  Delta
                </th>
              </tr>
            </thead>
            <tbody>
              <Row
                label="Receipts (10-yr, $bn)"
                a={resultA.revenue_change_10yr_bn}
                b={resultB.revenue_change_10yr_bn}
                format="bn"
              />
              <Row
                label="Outlays (10-yr, $bn)"
                a={resultA.outlay_change_10yr_bn}
                b={resultB.outlay_change_10yr_bn}
                format="bn"
              />
              <Row
                label="Deficit (10-yr, $bn)"
                a={resultA.deficit_change_10yr_bn}
                b={resultB.deficit_change_10yr_bn}
                format="bn"
              />
              <Row
                label="GDP level, year 5 (%)"
                a={resultA.gdp_level_year5_pct}
                b={resultB.gdp_level_year5_pct}
                format="pct"
              />
              <Row
                label="Median HH income (%)"
                a={resultA.median_household_income_change_pct}
                b={resultB.median_household_income_change_pct}
                format="pct"
              />
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
