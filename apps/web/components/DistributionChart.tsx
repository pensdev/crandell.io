"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { QuintileImpact } from "@/lib/types";

type Props = {
  rows: QuintileImpact[];
};

export function DistributionChart({ rows }: Props) {
  const data = rows.map((r) => ({
    name: r.quintile,
    share: Math.round(r.tax_change_share * 1000) / 10,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 8, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #334155",
            }}
            formatter={(v) => [
              `${Number(v ?? 0)}%`,
              "Share of tax change",
            ]}
          />
          <Bar
            dataKey="share"
            fill="#38bdf8"
            name="Share of tax change (%)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
