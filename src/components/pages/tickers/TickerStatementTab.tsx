import { useState } from "react";
import ReactApexChart from "react-apexcharts";

export type StatementMetricRow = {
  label: string;
  value: string;
  delta: string;
  pct: string;
  positive: boolean;
  rawValue: number | null;
};

export type StatementMetric = {
  key: string;
  label: string;
  heading: string;
  rowsView: StatementMetricRow[];
};

export type GlossaryEntry = {
  description?: string;
  valuation?: string;
};

export type GlossaryDoc = Record<string, GlossaryEntry>;

export type TickerStatementTabProps = {
  metrics: StatementMetric[];
  status?: "idle" | "loading" | "error" | "no-key";
  glossary?: GlossaryDoc | null;
};

type RevenueChartProps = {
  categories: string[];
  revenues: number[];
};

function RevenueChart({ categories, revenues }: RevenueChartProps) {
  const colors = revenues.map((val) => (val >= 0 ? "#0ea5e9" : "#ef4444"));

  return (
    <ReactApexChart
      type="bar"
      height={260}
      series={[
        {
          name: "Value",
          data: revenues,
        },
      ]}
      options={{
        chart: { toolbar: { show: false } },
        plotOptions: {
          bar: {
            borderRadius: 4,
            dataLabels: { position: "top" },
            distributed: true,
          },
        },
        dataLabels: {
          enabled: true,
          formatter: (val: any) => (typeof val === "number" ? val.toLocaleString("en-US") : val),
          offsetY: -10,
          style: { fontSize: "12px", colors: ["#475569"] },
        },
        xaxis: {
          categories,
          position: "bottom",
          labels: { style: { colors: "#475569", fontSize: "12px" } },
          axisBorder: { show: false },
          axisTicks: { show: false },
        },
        yaxis: {
          labels: {
            style: { colors: "#475569", fontSize: "12px" },
            formatter: (val: any) => (typeof val === "number" ? val.toLocaleString("en-US") : val),
          },
        },
        colors,
        grid: { borderColor: "#e2e8f0" },
      }}
    />
  );
}

export function TickerStatementTab({ metrics, status = "idle", glossary }: TickerStatementTabProps) {
  if (status === "no-key") {
    return (
      <div className="text-sm text-amber-700">
        Imposta la variabile VITE_FMP_API_KEY per mostrare lo statement.
      </div>
    );
  }
  if (status === "loading") {
    return <div className="text-sm text-slate-600">Caricamento statement...</div>;
  }
  if (status === "error") {
    return <div className="text-sm text-red-600">Impossibile caricare lo statement.</div>;
  }
  if (!metrics.length) {
    return <div className="text-sm text-slate-700">Nessun dato di statement disponibile.</div>;
  }

  const [metricKey, setMetricKey] = useState<string>(metrics[0].key);
  const currentMetric = metrics.find((m) => m.key === metricKey) ?? metrics[0];
  const categoriesMetric = currentMetric.rowsView.map((r) => r.label).reverse();
  const seriesMetric = currentMetric.rowsView.map((r) => r.rawValue ?? 0).reverse();

  return (
    <div className="space-y-4">
      {(() => {
        const entry =
          (glossary && (glossary as any)[currentMetric.key]) ||
          (glossary && (glossary as any)[currentMetric.label]) ||
          null;

        if (!entry || (!entry.description && !entry.valuation)) return null;

        return (
          <div className="rounded-lg border border-slate-200 bg-white/80 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Glossary</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{currentMetric.heading}</div>
            {entry.description && <div className="mt-2 text-sm text-slate-700">{entry.description}</div>}
            {entry.valuation && (
              <div className="mt-2 text-xs text-slate-600">
                <span className="font-semibold">Valuation:</span> {entry.valuation}
              </div>
            )}
          </div>
        );
      })()}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 items-start">
        <div className="h-[520px] rounded-lg border border-slate-200 bg-white/70 p-3 text-sm text-slate-700 flex flex-col">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Metriche</div>
          <ul className="mt-2 space-y-1 flex-1 overflow-auto">
            {metrics.map((metric) => {
              const active = metricKey === metric.key;
              return (
                <li key={metric.key}>
                  <button
                    type="button"
                    onClick={() => setMetricKey(metric.key)}
                    className={`w-full rounded-md px-3 py-2 text-left text-sm font-semibold ${
                      active ? "bg-slate-900 text-white" : "bg-white text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {metric.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="lg:col-span-3 h-[520px] flex flex-col space-y-4">
          <div className="flex-1 overflow-auto rounded-lg border border-slate-200 bg-white/70 p-0">
            <div className="min-w-full">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Year</th>
                    <th className="px-3 py-2 font-semibold">{currentMetric.heading}</th>
                    <th className="px-3 py-2 font-semibold">Δ YoY</th>
                    <th className="px-3 py-2 font-semibold">Δ %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentMetric.rowsView.map((row) => (
                    <tr
                      key={`${row.label}-${row.value}`}
                      className={row.delta === "-" ? "" : row.positive ? "bg-emerald-50" : "bg-red-50"}
                    >
                      <td className="px-3 py-2 text-slate-800">{row.label}</td>
                      <td className="px-3 py-2 font-semibold text-slate-900">{row.value}</td>
                      <td className="px-3 py-2 text-slate-900">
                        {row.delta} {row.delta !== "-" ? (row.positive ? "↑" : "↓") : ""}
                      </td>
                      <td
                        className={`px-3 py-2 font-semibold ${row.positive ? "text-emerald-700" : "text-red-700"}`}
                      >
                        {row.pct}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex-shrink-0 rounded-lg border border-slate-200 bg-white/70 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">{currentMetric.heading} trend</div>
            <div className="mt-2">
              <RevenueChart categories={categoriesMetric} revenues={seriesMetric} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TickerStatementTab;
