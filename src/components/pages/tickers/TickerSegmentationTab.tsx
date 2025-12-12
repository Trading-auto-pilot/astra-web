import { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";

export type SegmentationStatus = "idle" | "loading" | "error" | "no-key";

type Props = {
  segmentationTab: "product" | "geographic";
  onChangeTab: (tab: "product" | "geographic") => void;
  productDocs?: any[];
  productStatus: SegmentationStatus;
  geographicDocs?: any[];
  geographicStatus: SegmentationStatus;
};

/**
 * Renders raw segmentation data. We only care about productDocs and their `data` field.
 * Builds a list of unique products (keys under `data`) and shows JSON rows per date.
 */
export function TickerSegmentationTab({
  segmentationTab,
  onChangeTab,
  productDocs = [],
  productStatus,
  geographicDocs = [],
  geographicStatus,
}: Props) {
  const currentDocs = segmentationTab === "product" ? productDocs : geographicDocs;
  const currentStatus = segmentationTab === "product" ? productStatus : geographicStatus;

  const productEntries = useMemo(() => {
    const map = new Map<string, { date: string; raw: any }[]>();
    (currentDocs || []).forEach((doc: any, docIdx: number) => {
      const date =
        doc?.calendarYear || doc?.date || doc?.fiscalYear || doc?.period || `Doc ${currentDocs.length - docIdx}`;
      if (doc && doc.data && typeof doc.data === "object") {
        Object.entries(doc.data as Record<string, any>).forEach(([product, value]) => {
          if (!map.has(product)) map.set(product, []);
          map.get(product)!.push({ date: String(date), raw: value });
        });
      }
    });
    return map;
  }, [currentDocs]);

  const uniqueProducts = useMemo(() => Array.from(productEntries.keys()), [productEntries]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  useEffect(() => {
    const first = uniqueProducts[0] ?? null;
    setSelectedProduct(first);
  }, [uniqueProducts, segmentationTab]);

  const currentRows = selectedProduct ? productEntries.get(selectedProduct) ?? [] : [];
  const tableRows = useMemo(() => {
    const parsed = currentRows
      .map((row) => {
        const ts = new Date(row.date).getTime();
        const rawVal =
          typeof row.raw === "number"
            ? row.raw
            : row?.raw?.revenue ??
              row?.raw?.value ??
              row?.raw?.amount ??
              row?.raw?.sales ??
              row?.raw?.figure ??
              row?.raw;
        const num = typeof rawVal === "number" ? rawVal : Number(rawVal);
        return { ...row, ts: Number.isFinite(ts) ? ts : 0, value: Number.isFinite(num) ? num : null };
      })
      .sort((a, b) => b.ts - a.ts);

    return parsed.map((row, idx) => {
      const prev = parsed[idx + 1];
      const prevVal = prev?.value ?? null;
      const diff = prevVal !== null && row.value !== null ? row.value - prevVal : null;
      const pct = prevVal !== null && row.value !== null && prevVal !== 0 ? ((row.value - prevVal) / prevVal) * 100 : null;

      const valueLabel = row.value !== null ? row.value.toLocaleString("en-US") : "-";
      const deltaLabel =
        diff !== null ? `${diff >= 0 ? "+" : ""}${Math.abs(diff).toLocaleString("en-US")}` : "-";
      const pctLabel = pct !== null ? `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%` : "-";

      return {
        label: row.date,
        valueLabel,
        deltaLabel,
        pctLabel,
        positive: diff !== null ? diff >= 0 : false,
        rawValue: row.value,
      };
    });
  }, [currentRows]);

  const latestDonut = useMemo(() => {
    const latestDoc = currentDocs?.[0];
    if (!latestDoc || !latestDoc.data || typeof latestDoc.data !== "object") return { labels: [], values: [], hasSelected: true };

    const entries = Object.entries(latestDoc.data as Record<string, any>)
      .map(([key, val]) => {
        const num = typeof val === "number" ? val : Number(val);
        return { key, value: Number.isFinite(num) ? num : 0 };
      })
      .filter((e) => Number.isFinite(e.value));

    const hasSelected =
      !selectedProduct || entries.some((e) => e.key === selectedProduct);

    return {
      labels: entries.map((e) => e.key),
      values: entries.map((e) => e.value),
      hasSelected,
      colors: entries.map((e) => (selectedProduct && e.key === selectedProduct ? "#0ea5e9" : "#cbd5e1")),
    };
  }, [currentDocs, selectedProduct]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {[
          { id: "product" as const, label: "Product" },
          { id: "geographic" as const, label: "Geographics" },
        ].map((tab) => {
          const active = segmentationTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                active
                  ? "border-slate-800 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {currentStatus === "no-key" && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Imposta la variabile VITE_FMP_API_KEY per mostrare la segmentation.
        </div>
      )}
      {currentStatus === "error" && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          Impossibile recuperare la segmentation.
        </div>
      )}
      {currentStatus === "loading" && <div className="text-sm text-slate-600">Caricamento segmentation...</div>}

      {currentStatus === "idle" && (!uniqueProducts || uniqueProducts.length === 0) && (
        <div className="rounded-md border border-dashed border-slate-200 bg-white/60 px-3 py-2 text-sm text-slate-600">
          Nessuna segmentation disponibile.
        </div>
      )}

      {currentStatus === "idle" && uniqueProducts.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="h-full rounded-lg border border-slate-200 bg-white/70 p-3 text-sm text-slate-700">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Prodotti</div>
            <ul className="mt-2 space-y-1">
              {uniqueProducts.map((prod) => {
                const active = selectedProduct === prod;
                return (
                  <li key={prod}>
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(prod)}
                      className={`w-full rounded-md px-3 py-2 text-left text-sm font-semibold ${
                        active ? "bg-slate-900 text-white" : "bg-white text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {prod || "Product"}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-3">
            {currentRows && currentRows.length > 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white/80 p-4">
                <div className="text-sm font-semibold text-slate-800">{selectedProduct}</div>
                <div className="mt-2 overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-3 py-2 font-semibold">Year</th>
                        <th className="px-3 py-2 font-semibold">Value</th>
                        <th className="px-3 py-2 font-semibold">Δ YoY</th>
                        <th className="px-3 py-2 font-semibold">Δ %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tableRows.map((row) => (
                        <tr
                          key={`${row.label}-${row.valueLabel}`}
                          className={row.deltaLabel === "-" ? "" : row.positive ? "bg-emerald-50" : "bg-red-50"}
                        >
                          <td className="px-3 py-2 text-slate-800">{row.label}</td>
                          <td className="px-3 py-2 font-semibold text-slate-900">{row.valueLabel}</td>
                          <td className="px-3 py-2 text-slate-900">
                            {row.deltaLabel} {row.deltaLabel !== "-" ? (row.positive ? "↑" : "↓") : ""}
                          </td>
                          <td className={`px-3 py-2 font-semibold ${row.positive ? "text-emerald-700" : "text-red-700"}`}>
                            {row.pctLabel}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Trend</div>
                    <ReactApexChart
                      type="bar"
                      height={220}
                      series={[
                        {
                          name: "Value",
                          data: tableRows.map((row) => row.rawValue ?? 0).reverse(),
                        },
                      ]}
                      options={{
                        chart: { toolbar: { show: false } },
                        plotOptions: {
                          bar: {
                            borderRadius: 4,
                            distributed: true,
                          },
                        },
                        colors: tableRows
                          .map((row) => (row.rawValue ?? 0) >= 0 ? "#0ea5e9" : "#ef4444")
                          .reverse(),
                        dataLabels: { enabled: false },
                        xaxis: {
                          categories: tableRows.map((row) => row.label).reverse(),
                          labels: { style: { colors: "#475569", fontSize: "12px" } },
                        },
                        yaxis: {
                          labels: {
                            style: { colors: "#475569", fontSize: "12px" },
                            formatter: (val: any) => (typeof val === "number" ? val.toLocaleString("en-US") : val),
                          },
                        },
                        grid: { borderColor: "#e2e8f0" },
                      }}
                    />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Split ultimo anno</div>
                    {latestDonut.values.length ? (
                      <ReactApexChart
                        type="donut"
                        height={220}
                        series={latestDonut.values}
                        options={{
                          chart: {
                            toolbar: { show: false },
                            events: {
                              dataPointSelection: (_event, _ctx, config) => {
                                const idx = config?.dataPointIndex;
                                if (idx === undefined || idx === null) return;
                                const label = latestDonut.labels[idx];
                                if (label) setSelectedProduct(label);
                              },
                            },
                          },
                          labels: latestDonut.labels,
                          colors: latestDonut.colors,
                          legend: { position: "bottom" },
                          plotOptions: {
                            pie: {
                              donut: { size: "55%" },
                              expandOnClick: true,
                            },
                          },
                          stroke: { width: 1, colors: ["#fff"] },
                        }}
                      />
                    ) : (
                      <div className="rounded-md border border-dashed border-slate-200 bg-white/60 p-2 text-[11px] text-slate-600">
                        Nessun dato disponibile per l&apos;ultimo anno.
                      </div>
                    )}
                    {!latestDonut.hasSelected && (
                      <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                        Questo prodotto non è presente nell&apos;ultimo anno (non più commercializzato).
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-600">Nessun dato disponibile per il prodotto selezionato.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TickerSegmentationTab;
