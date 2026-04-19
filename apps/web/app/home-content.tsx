"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter } from "next/navigation";

import {
  defaultSimulateRequest,
  PolicyForm,
} from "@/components/PolicyForm";
import { ComparePanel } from "@/components/ComparePanel";
import { ExportButtons } from "@/components/ExportButtons";
import { ResultsPanel } from "@/components/ResultsPanel";
import { fetchPresetBodies, getApiBase, simulatePolicy } from "@/lib/api";
import { normalizeRequest } from "@/lib/policy";
import type {
  ScenariosFile,
  SimulateRequest,
  SimulateResponse,
} from "@/lib/types";
import {
  isPresetId,
  parseQueryToState,
  requestToQuery,
  type PresetId,
} from "@/lib/urlState";

const PRESET_LABELS: Record<PresetId, string> = {
  baseline: "Baseline",
  tcja_sunset_2026: "TCJA sunset 2026 (full)",
  tcja_sunset_2026_partial: "TCJA sunset 2026 (partial)",
  trump_platinum_card: "Trump Platinum Card",
};

const DistributionChart = dynamic(
  () =>
    import("@/components/DistributionChart").then((m) => m.DistributionChart),
  {
    ssr: false,
    loading: () => (
      <p className="text-sm text-slate-400" role="status">
        Loading chart…
      </p>
    ),
  },
);

export function HomeContent() {
  const router = useRouter();
  const pathname = usePathname();

  const [request, setRequest] = useState<SimulateRequest>(() =>
    defaultSimulateRequest(),
  );
  const [result, setResult] = useState<SimulateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [presetId, setPresetId] = useState<string>("baseline");
  const [presetBodies, setPresetBodies] = useState<
    Record<string, Record<string, unknown>> | null
  >(null);
  const [scenariosFile, setScenariosFile] = useState<ScenariosFile | null>(
    null,
  );

  const [compareA, setCompareA] = useState<PresetId>("baseline");
  const [compareB, setCompareB] = useState<PresetId>("tcja_sunset_2026");
  const [compareResultA, setCompareResultA] =
    useState<SimulateResponse | null>(null);
  const [compareResultB, setCompareResultB] =
    useState<SimulateResponse | null>(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);

  const skipPresetHydrateOnce = useRef(false);
  const [urlReady, setUrlReady] = useState(false);

  useEffect(() => {
    const parsed = parseQueryToState(
      typeof window !== "undefined" ? window.location.search : "",
    );
    if (parsed) {
      setPresetId(parsed.presetId);
      setRequest(parsed.request);
      if (parsed.compare) {
        setCompareA(parsed.compare.a);
        setCompareB(parsed.compare.b);
      }
      skipPresetHydrateOnce.current = true;
    }
    setUrlReady(true);
  }, []);

  useEffect(() => {
    fetch("/presets/scenarios.json")
      .then((r) => r.json() as Promise<ScenariosFile>)
      .then(setScenariosFile)
      .catch(() => setScenariosFile(null));
  }, []);

  useEffect(() => {
    fetchPresetBodies()
      .then(setPresetBodies)
      .catch(() => setPresetBodies(null));
  }, []);

  useEffect(() => {
    if (!presetBodies) return;
    if (skipPresetHydrateOnce.current) {
      skipPresetHydrateOnce.current = false;
      return;
    }
    const raw = presetBodies[presetId];
    if (raw) setRequest(normalizeRequest(raw));
  }, [presetBodies, presetId]);

  const runSim = useCallback(async (body: SimulateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await simulatePolicy(body);
      setResult(res);
    } catch (e) {
      setResult(null);
      setError(
        e instanceof Error
          ? e.message
          : "Unable to reach the API. Is it running?",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedRun = useDebouncedCallback(runSim, 400);
  const initial = useRef(true);

  useEffect(() => {
    if (initial.current) {
      initial.current = false;
      void runSim(request);
      return;
    }
    debouncedRun(request);
  }, [request, debouncedRun, runSim]);

  useEffect(() => {
    if (!presetBodies) return;
    const bodies = presetBodies;
    let cancelled = false;
    async function compare() {
      setCompareLoading(true);
      setCompareError(null);
      try {
        const rawA = bodies[compareA];
        const rawB = bodies[compareB];
        if (!rawA || !rawB) {
          setCompareResultA(null);
          setCompareResultB(null);
          return;
        }
        const [a, b] = await Promise.all([
          simulatePolicy(normalizeRequest(rawA)),
          simulatePolicy(normalizeRequest(rawB)),
        ]);
        if (!cancelled) {
          setCompareResultA(a);
          setCompareResultB(b);
        }
      } catch (e) {
        if (!cancelled) {
          setCompareResultA(null);
          setCompareResultB(null);
          setCompareError(
            e instanceof Error ? e.message : "Compare request failed.",
          );
        }
      } finally {
        if (!cancelled) setCompareLoading(false);
      }
    }
    void compare();
    return () => {
      cancelled = true;
    };
  }, [compareA, compareB, presetBodies]);

  const syncUrl = useDebouncedCallback(() => {
    const compare =
      compareA && compareB
        ? { a: compareA, b: compareB }
        : null;
    const q = requestToQuery(request, presetId, compare);
    const next = `${pathname}${q}`;
    router.replace(next, { scroll: false });
  }, 500);

  useEffect(() => {
    if (!urlReady) return;
    syncUrl();
  }, [urlReady, request, presetId, compareA, compareB, syncUrl]);

  const scenarioMeta = useMemo(() => {
    if (!scenariosFile) return null;
    return scenariosFile.scenarios.find((s) => s.id === presetId) ?? null;
  }, [scenariosFile, presetId]);

  const onPresetChange = (id: string) => {
    setPresetId(id);
  };

  const missingPublicApiUrl =
    process.env.NODE_ENV === "production" &&
    !process.env.NEXT_PUBLIC_API_URL?.trim();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {missingPublicApiUrl ? (
        <div
          className="border-b border-amber-600/50 bg-amber-950/40 px-6 py-3 text-center text-sm text-amber-100"
          role="status"
        >
          <strong className="font-semibold">Backend URL not set.</strong> Build
          the site with{" "}
          <code className="rounded bg-black/30 px-1">NEXT_PUBLIC_API_URL</code>{" "}
          set to your public API origin (for crandell.io on the same server, use{" "}
          <code className="rounded bg-black/30 px-1">https://crandell.io</code>
          ), then copy the static export to your nginx docroot again.
        </div>
      ) : null}
      <header className="border-b border-slate-800 bg-slate-950/80 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-medium uppercase tracking-wide text-sky-400">
            Policy Impact Simulator
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-50">
            Illustrative fiscal &amp; regulatory impacts
          </h1>
          <p className="mt-3 max-w-3xl text-slate-400">
            Adjust levers to explore stylized revenue, deficit, GDP, and
            distributional effects. Results are educational only—not official
            government scores. API:{" "}
            <code className="rounded bg-slate-900 px-1 py-0.5 text-sky-300">
              {getApiBase()}
            </code>
          </p>
          <p className="mt-4 text-sm">
            <Link
              className="text-sky-400 underline hover:text-sky-300"
              href="/methodology"
            >
              Methodology &amp; limitations
            </Link>
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <section aria-labelledby="preset-heading" className="space-y-3">
          <h2 id="preset-heading" className="text-lg font-semibold text-slate-100">
            Scenarios
          </h2>
          <div className="flex flex-wrap gap-4">
            <label className="text-sm text-slate-300" htmlFor="preset-select">
              Preset
            </label>
            <select
              id="preset-select"
              className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
              value={presetId}
              onChange={(e) => onPresetChange(e.target.value)}
            >
              <option value="baseline">Baseline</option>
              <option value="tcja_sunset_2026">TCJA sunset 2026 (full)</option>
              <option value="tcja_sunset_2026_partial">
                TCJA sunset 2026 (partial)
              </option>
              <option value="trump_platinum_card">Trump Platinum Card</option>
            </select>
          </div>
          {scenarioMeta ? (
            <div className="rounded-lg border border-slate-700/80 bg-slate-900/30 p-4 text-sm text-slate-300">
              <p className="font-medium text-slate-100">{scenarioMeta.title}</p>
              <p className="mt-1">{scenarioMeta.summary}</p>
              <ul className="mt-2 list-inside list-disc text-slate-400">
                {scenarioMeta.assumptions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-slate-500">
                See also{" "}
                <a
                  className="text-sky-400 underline"
                  href="https://www.federalregister.gov/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Federal Register
                </a>{" "}
                for regulatory context.
              </p>
            </div>
          ) : null}
        </section>

        <PolicyForm
          value={request}
          onChange={setRequest}
          disabled={loading}
        />

        <ResultsPanel result={result} loading={loading} error={error} />

        <ExportButtons request={request} result={result} />

        <section aria-labelledby="compare-select-heading" className="space-y-3">
          <h2
            id="compare-select-heading"
            className="text-lg font-semibold text-slate-100"
          >
            Compare presets
          </h2>
          <div className="flex flex-wrap gap-6">
            <div>
              <label className="text-sm text-slate-300" htmlFor="compare-a">
                Scenario A
              </label>
              <select
                id="compare-a"
                className="mt-2 block rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
                value={compareA}
                onChange={(e) => {
                  const v = e.target.value;
                  if (isPresetId(v)) setCompareA(v);
                }}
              >
                {Object.entries(PRESET_LABELS).map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-300" htmlFor="compare-b">
                Scenario B
              </label>
              <select
                id="compare-b"
                className="mt-2 block rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
                value={compareB}
                onChange={(e) => {
                  const v = e.target.value;
                  if (isPresetId(v)) setCompareB(v);
                }}
              >
                {Object.entries(PRESET_LABELS).map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <ComparePanel
          labelA={PRESET_LABELS[compareA]}
          labelB={PRESET_LABELS[compareB]}
          resultA={compareResultA}
          resultB={compareResultB}
          loading={compareLoading}
          error={compareError}
        />

        <section aria-labelledby="dist-heading" className="space-y-3">
          <h2 id="dist-heading" className="text-lg font-semibold text-slate-100">
            Distributional split (illustrative)
          </h2>
          {result && !error ? (
            <DistributionChart rows={result.distributional} />
          ) : (
            <p className="text-sm text-slate-500">
              Run a simulation to see the chart.
            </p>
          )}
        </section>
      </main>

      <footer className="border-t border-slate-800 px-6 py-8 text-center text-xs text-slate-500">
        BLS / BEA / CBO-style magnitudes are rounded illustrations—see API{" "}
        <code className="rounded bg-slate-900 px-1">data/SOURCES.md</code>.{" "}
        <Link className="text-sky-500 underline" href="/methodology">
          Methodology
        </Link>
      </footer>
    </div>
  );
}
