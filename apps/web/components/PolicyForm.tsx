"use client";

import type { SimulateRequest } from "@/lib/types";

type Props = {
  value: SimulateRequest;
  onChange: (next: SimulateRequest) => void;
  disabled?: boolean;
};

const defaultRequest: SimulateRequest = {
  top_marginal_rate_ppt: 0,
  corporate_rate_ppt: 0,
  payroll_combined_ppt: 0,
  discretionary_spending_pct_gdp_ppt: 0,
  regulatory_cost_index: 1,
  tcja_sunset_year: null,
  tcja_sunset_depth: "none",
  luxury_consumption_fee_ppt: 0,
  tariff_proxy_ppt: 0,
};

function FieldLabel({
  id,
  children,
  hint,
}: {
  id: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label htmlFor={id} className="block text-sm font-medium text-slate-200">
      {children}
      {hint ? (
        <span className="block text-xs font-normal text-slate-400">{hint}</span>
      ) : null}
    </label>
  );
}

export function defaultSimulateRequest(): SimulateRequest {
  return { ...defaultRequest };
}

export function PolicyForm({ value, onChange, disabled }: Props) {
  const patch = (partial: Partial<SimulateRequest>) => {
    onChange({ ...value, ...partial });
  };

  return (
    <fieldset
      disabled={disabled}
      className="space-y-6 rounded-xl border border-slate-700/80 bg-slate-900/40 p-6"
    >
      <legend className="px-1 text-lg font-semibold text-slate-100">
        Policy levers
      </legend>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <FieldLabel
            id="top_marginal_rate_ppt"
            hint="Percentage points vs stylized baseline."
          >
            Top marginal rate (ppt)
          </FieldLabel>
          <div className="mt-2 flex items-center gap-3">
            <input
              id="top_marginal_rate_ppt"
              type="range"
              min={-5}
              max={5}
              step={0.1}
              aria-valuemin={-5}
              aria-valuemax={5}
              aria-valuenow={value.top_marginal_rate_ppt}
              aria-valuetext={`${value.top_marginal_rate_ppt.toFixed(1)} percentage points`}
              className="h-2 w-full accent-sky-400"
              value={value.top_marginal_rate_ppt}
              onChange={(e) =>
                patch({ top_marginal_rate_ppt: Number(e.target.value) })
              }
            />
            <output
              className="w-14 tabular-nums text-right text-sm text-slate-200"
              htmlFor="top_marginal_rate_ppt"
            >
              {value.top_marginal_rate_ppt.toFixed(1)}
            </output>
          </div>
        </div>

        <div>
          <FieldLabel id="corporate_rate_ppt" hint="Corporate income tax (ppt).">
            Corporate rate (ppt)
          </FieldLabel>
          <div className="mt-2 flex items-center gap-3">
            <input
              id="corporate_rate_ppt"
              type="range"
              min={-10}
              max={10}
              step={0.1}
              aria-valuemin={-10}
              aria-valuemax={10}
              aria-valuenow={value.corporate_rate_ppt}
              className="h-2 w-full accent-sky-400"
              value={value.corporate_rate_ppt}
              onChange={(e) =>
                patch({ corporate_rate_ppt: Number(e.target.value) })
              }
            />
            <output
              className="w-14 tabular-nums text-right text-sm text-slate-200"
              htmlFor="corporate_rate_ppt"
            >
              {value.corporate_rate_ppt.toFixed(1)}
            </output>
          </div>
        </div>

        <div>
          <FieldLabel
            id="payroll_combined_ppt"
            hint="Employer + employee combined (ppt)."
          >
            Payroll (ppt)
          </FieldLabel>
          <div className="mt-2 flex items-center gap-3">
            <input
              id="payroll_combined_ppt"
              type="range"
              min={-2}
              max={2}
              step={0.05}
              aria-valuemin={-2}
              aria-valuemax={2}
              aria-valuenow={value.payroll_combined_ppt}
              className="h-2 w-full accent-sky-400"
              value={value.payroll_combined_ppt}
              onChange={(e) =>
                patch({ payroll_combined_ppt: Number(e.target.value) })
              }
            />
            <output
              className="w-14 tabular-nums text-right text-sm text-slate-200"
              htmlFor="payroll_combined_ppt"
            >
              {value.payroll_combined_ppt.toFixed(2)}
            </output>
          </div>
        </div>

        <div>
          <FieldLabel
            id="discretionary_spending_pct_gdp_ppt"
            hint="Primary discretionary outlays vs GDP."
          >
            Discretionary spending (% GDP, ppt)
          </FieldLabel>
          <div className="mt-2 flex items-center gap-3">
            <input
              id="discretionary_spending_pct_gdp_ppt"
              type="range"
              min={-3}
              max={3}
              step={0.05}
              aria-valuemin={-3}
              aria-valuemax={3}
              aria-valuenow={value.discretionary_spending_pct_gdp_ppt}
              className="h-2 w-full accent-sky-400"
              value={value.discretionary_spending_pct_gdp_ppt}
              onChange={(e) =>
                patch({
                  discretionary_spending_pct_gdp_ppt: Number(e.target.value),
                })
              }
            />
            <output
              className="w-14 tabular-nums text-right text-sm text-slate-200"
              htmlFor="discretionary_spending_pct_gdp_ppt"
            >
              {value.discretionary_spending_pct_gdp_ppt.toFixed(2)}
            </output>
          </div>
        </div>

        <div>
          <FieldLabel
            id="regulatory_cost_index"
            hint="1 = baseline compliance cost level."
          >
            Regulatory cost index
          </FieldLabel>
          <div className="mt-2 flex items-center gap-3">
            <input
              id="regulatory_cost_index"
              type="range"
              min={0.5}
              max={1.5}
              step={0.01}
              aria-valuemin={0.5}
              aria-valuemax={1.5}
              aria-valuenow={value.regulatory_cost_index}
              className="h-2 w-full accent-sky-400"
              value={value.regulatory_cost_index}
              onChange={(e) =>
                patch({ regulatory_cost_index: Number(e.target.value) })
              }
            />
            <output
              className="w-14 tabular-nums text-right text-sm text-slate-200"
              htmlFor="regulatory_cost_index"
            >
              {value.regulatory_cost_index.toFixed(2)}
            </output>
          </div>
        </div>

        <div>
          <FieldLabel id="luxury_consumption_fee_ppt" hint="Illustrative fee.">
            Luxury consumption fee (ppt)
          </FieldLabel>
          <div className="mt-2 flex items-center gap-3">
            <input
              id="luxury_consumption_fee_ppt"
              type="range"
              min={0}
              max={10}
              step={0.1}
              aria-valuemin={0}
              aria-valuemax={10}
              aria-valuenow={value.luxury_consumption_fee_ppt}
              className="h-2 w-full accent-sky-400"
              value={value.luxury_consumption_fee_ppt}
              onChange={(e) =>
                patch({ luxury_consumption_fee_ppt: Number(e.target.value) })
              }
            />
            <output
              className="w-14 tabular-nums text-right text-sm text-slate-200"
              htmlFor="luxury_consumption_fee_ppt"
            >
              {value.luxury_consumption_fee_ppt.toFixed(1)}
            </output>
          </div>
        </div>

        <div>
          <FieldLabel id="tariff_proxy_ppt" hint="Average effective proxy.">
            Tariff proxy (ppt)
          </FieldLabel>
          <div className="mt-2 flex items-center gap-3">
            <input
              id="tariff_proxy_ppt"
              type="range"
              min={-5}
              max={15}
              step={0.1}
              aria-valuemin={-5}
              aria-valuemax={15}
              aria-valuenow={value.tariff_proxy_ppt}
              className="h-2 w-full accent-sky-400"
              value={value.tariff_proxy_ppt}
              onChange={(e) =>
                patch({ tariff_proxy_ppt: Number(e.target.value) })
              }
            />
            <output
              className="w-14 tabular-nums text-right text-sm text-slate-200"
              htmlFor="tariff_proxy_ppt"
            >
              {value.tariff_proxy_ppt.toFixed(1)}
            </output>
          </div>
        </div>
      </div>

      <div className="grid gap-4 border-t border-slate-700/80 pt-6 md:grid-cols-2">
        <div>
          <FieldLabel id="tcja_sunset_year" hint="Optional; 2025–2035.">
            TCJA sunset year
          </FieldLabel>
          <select
            id="tcja_sunset_year"
            className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100"
            value={value.tcja_sunset_year ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              patch({
                tcja_sunset_year: v === "" ? null : Number(v),
                tcja_sunset_depth:
                  v === "" ? "none" : value.tcja_sunset_depth === "none"
                    ? "full"
                    : value.tcja_sunset_depth,
              });
            }}
          >
            <option value="">None</option>
            {Array.from({ length: 11 }, (_, i) => 2025 + i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div>
          <FieldLabel id="tcja_sunset_depth" hint="Depth of individual provision sunset.">
            TCJA sunset depth
          </FieldLabel>
          <select
            id="tcja_sunset_depth"
            className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100"
            value={
              value.tcja_sunset_year === null
                ? "none"
                : value.tcja_sunset_depth === "none"
                  ? "full"
                  : value.tcja_sunset_depth
            }
            disabled={value.tcja_sunset_year === null}
            onChange={(e) =>
              patch({
                tcja_sunset_depth: e.target.value as Exclude<
                  SimulateRequest["tcja_sunset_depth"],
                  "none"
                >,
              })
            }
          >
            {value.tcja_sunset_year === null ? (
              <option value="none">No sunset</option>
            ) : null}
            <option value="partial">Partial</option>
            <option value="full">Full</option>
          </select>
        </div>
      </div>
    </fieldset>
  );
}
