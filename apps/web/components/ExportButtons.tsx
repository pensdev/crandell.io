"use client";

import { jsPDF } from "jspdf";

import type { SimulateRequest, SimulateResponse } from "@/lib/types";

type Props = {
  request: SimulateRequest;
  result: SimulateResponse | null;
};

function toCsv(request: SimulateRequest, result: SimulateResponse): string {
  const lines = [
    "field,value",
    ...Object.entries(request).map(([k, v]) => `${k},${v}`),
    "",
    "metric,value",
    `revenue_change_10yr_bn,${result.revenue_change_10yr_bn}`,
    `outlay_change_10yr_bn,${result.outlay_change_10yr_bn}`,
    `deficit_change_10yr_bn,${result.deficit_change_10yr_bn}`,
    `gdp_level_year5_pct,${result.gdp_level_year5_pct}`,
    `median_household_income_change_pct,${result.median_household_income_change_pct}`,
    "",
    "quintile,income_share,tax_change_share,avg_tax_change_pct_income",
    ...result.distributional.map(
      (d) =>
        `${d.quintile},${d.income_share},${d.tax_change_share},${d.avg_tax_change_pct_income}`,
    ),
  ];
  return lines.join("\n");
}

export function ExportButtons({ request, result }: Props) {
  const disabled = !result;

  const onCsv = () => {
    if (!result) return;
    const blob = new Blob([toCsv(request, result)], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "policy-sim-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onPdf = async () => {
    if (!result) return;
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const margin = 48;
    let y = margin;
    doc.setFontSize(14);
    doc.text("Policy Impact Simulator — summary", margin, y);
    y += 28;
    doc.setFontSize(10);
    const lines = [
      `Receipts (10-yr, $bn): ${result.revenue_change_10yr_bn.toFixed(1)}`,
      `Outlays (10-yr, $bn): ${result.outlay_change_10yr_bn.toFixed(1)}`,
      `Deficit (10-yr, $bn): ${result.deficit_change_10yr_bn.toFixed(1)}`,
      `GDP level year 5 (%): ${result.gdp_level_year5_pct.toFixed(2)}`,
      `Median HH income (%): ${result.median_household_income_change_pct.toFixed(2)}`,
      "",
      result.disclaimer,
    ];
    for (const line of lines) {
      doc.text(line, margin, y, { maxWidth: 520 });
      y += 16;
      if (y > 720) {
        doc.addPage();
        y = margin;
      }
    }
    doc.save("policy-sim-summary.pdf");
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={onCsv}
        disabled={disabled}
        className="rounded-lg border border-slate-600 bg-slate-950 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Download CSV
      </button>
      <button
        type="button"
        onClick={() => void onPdf()}
        disabled={disabled}
        className="rounded-lg border border-slate-600 bg-slate-950 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Download PDF
      </button>
    </div>
  );
}
