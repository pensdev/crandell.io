import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology & limitations | Policy Impact Simulator",
  description:
    "How the illustrative scoring model works, data vintage, and what this demo is not.",
};

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 px-6 py-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-wide text-sky-400">
            Policy Impact Simulator
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-50">
            Methodology &amp; limitations
          </h1>
          <p className="mt-4 text-sm">
            <Link
              href="/"
              className="text-sky-400 underline hover:text-sky-300"
            >
              Back to simulator
            </Link>
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-8 px-6 py-10 text-slate-300">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-50">Purpose</h2>
          <p>
            This project is an <strong>educational portfolio demo</strong>. It
            combines a small FastAPI service with a static Next.js UI to show
            how policy levers can be translated into stylized fiscal and
            distributional outputs. It does{" "}
            <strong>not</strong> replicate official Congressional Budget Office,
            Joint Committee on Taxation, or Treasury revenue estimates.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-50">Model structure</h2>
          <p>
            The engine uses versioned baseline magnitudes (receipt shares, GDP
            scale, stylized quintile tables) loaded from CSVs on the API side.
            Each request applies your lever deltas to those baselines using
            transparent formulas implemented in Python (see{" "}
            <code className="rounded bg-slate-900 px-1 py-0.5 text-sky-200">
              apps/api/model/scoring.py
            </code>
            ). Outputs include undiscounted 10-year-style aggregates, a simple
            GDP level path proxy, and illustrative shares across income
            quintiles.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-50">Data &amp; vintage</h2>
          <p>
            Baseline figures are rounded illustrations informed by public
            BEA, BLS, and CBO-style ranges. The authoritative notes and intent
            for each table live in the API repository at{" "}
            <code className="rounded bg-slate-900 px-1 py-0.5 text-sky-200">
              apps/api/data/SOURCES.md
            </code>
            . Refresh the CSVs when you change coefficients or magnitudes, and
            bump the model/data version strings so results stay traceable.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-50">Presets</h2>
          <p>
            Named presets (TCJA sunset, &quot;Platinum Card&quot; scenario, etc.)
            are JSON bundles of lever defaults with copy in{" "}
            <code className="rounded bg-slate-900 px-1 py-0.5 text-sky-200">
              apps/web/public/presets/scenarios.json
            </code>{" "}
            and matching bodies from{" "}
            <code className="rounded bg-slate-900 px-1 py-0.5 text-sky-200">
              GET /simulate/presets
            </code>
            . They are for transparency and UX—not endorsements of any policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-50">Known limitations</h2>
          <ul className="list-inside list-disc space-y-2 text-slate-400">
            <li>No microsimulation tax calculator or full behavioral response.</li>
            <li>
              Distributional splits scale off static shares; they are
              illustrative, not microdata-based.
            </li>
            <li>
              Regulatory impacts use a single index lever, not rule-level
              analysis.
            </li>
            <li>
              Tariff and luxury levers are stylized proxies for exploration.
            </li>
          </ul>
        </section>
      </main>

      <footer className="border-t border-slate-800 px-6 py-8 text-center text-xs text-slate-500">
        <Link className="text-sky-500 underline" href="/">
          Home
        </Link>
      </footer>
    </div>
  );
}
