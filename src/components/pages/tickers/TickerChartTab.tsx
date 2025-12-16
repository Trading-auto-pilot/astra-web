import { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { fetchFmpEodFull, fetchFmpEodLight, fetchFmpHistoricalChart } from "../../../api/fundamentals";

type Props = {
  symbol: string | null;
};

type ChartStatus = "idle" | "loading" | "error" | "no-key";
type RangeKey = "1D" | "1W" | "1M" | "6M" | "12M" | "2Y" | "5Y";
type ChartMode = "area" | "candle";
type CandleInterval = "5Min" | "15Min" | "30Min" | "1hour" | "4Hour";

type CandlePoint = {
  dateLabel: string;
  close: number;
  volume: number;
};

type CandleStickPoint = {
  x: number;
  y: [number, number, number, number];
};

type CandleSeriesPoint = CandleStickPoint & { volume: number };

const formatNumber = (value: number) => {
  if (!Number.isFinite(value)) return "-";
  if (Math.abs(value) >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toFixed(0);
};

function normalizeData(raw: any[]): CandlePoint[] {
  return (Array.isArray(raw) ? raw : [])
    .map((item) => {
      const date = item?.date || item?.formattedDate || item?.label;
      const close = Number(item?.close ?? item?.price ?? item?.adjustedClose);
      const volume = Number(item?.volume ?? item?.vol);
      const ts = date ? new Date(date).getTime() : NaN;
      if (Number.isNaN(ts) || !Number.isFinite(close) || !Number.isFinite(volume)) return null;
      return {
        ts,
        dateLabel: new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "short", year: "2-digit" }).format(ts),
        close,
        volume,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a!.ts - b!.ts)
    .map((item) => ({
      dateLabel: item!.dateLabel,
      close: item!.close,
      volume: item!.volume,
    }));
}

export default function TickerChartTab({ symbol }: Props) {
  const [status, setStatus] = useState<ChartStatus>("idle");
  const [seriesData, setSeriesData] = useState<any[]>([]);
  const [range, setRange] = useState<RangeKey>("6M");
  const [mode, setMode] = useState<ChartMode>("area");
  const [candleInterval, setCandleInterval] = useState<CandleInterval | null>(null);

  useEffect(() => {
    setRange("6M");
    setMode("area");
    setCandleInterval(null);
  }, [symbol]);

  useEffect(() => {
    const computeRange = (key: RangeKey) => {
      const end = new Date();
      const start = new Date(end);
      switch (key) {
        case "1D":
          start.setDate(end.getDate() - 1);
          break;
        case "1W":
          start.setDate(end.getDate() - 7);
          break;
        case "1M":
          start.setMonth(end.getMonth() - 1);
          break;
        case "6M":
          start.setMonth(end.getMonth() - 6);
          break;
        case "12M":
          start.setFullYear(end.getFullYear() - 1);
          break;
        case "2Y":
          start.setFullYear(end.getFullYear() - 2);
          break;
        case "5Y":
          start.setFullYear(end.getFullYear() - 5);
          break;
        default:
          break;
      }
      const format = (d: Date) => d.toISOString().slice(0, 10);
      return { from: format(start), to: format(end) };
    };

    if (!symbol) {
      setSeriesData([]);
      setStatus("idle");
      return;
    }

    let active = true;
    const controller = new AbortController();
    setStatus("loading");
    const { from, to } = computeRange(range);
    const fetchPromise =
      mode === "candle" && candleInterval
        ? fetchFmpHistoricalChart(symbol, candleInterval, controller.signal)
        : mode === "candle"
        ? fetchFmpEodFull(symbol, { from, to }, controller.signal)
        : fetchFmpEodLight(symbol, { from, to }, controller.signal);

    fetchPromise
      .then((docs) => {
        if (!active) return;
        setSeriesData(Array.isArray(docs) ? docs : []);
        setStatus("idle");
      })
      .catch((err) => {
        if (!active || err.name === "AbortError") return;
        console.error("Chart fetch error", err);
        setSeriesData([]);
        setStatus(err.message === "Missing FMP API key" ? "no-key" : "error");
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [symbol, range, mode, candleInterval]);

  const points = useMemo(() => (mode === "area" ? normalizeData(seriesData) : []), [seriesData, mode]);
  const candleData = useMemo(() => {
    if (mode !== "candle") return [];
    return (Array.isArray(seriesData) ? seriesData : [])
      .map((item) => {
        const date = item?.date || item?.formattedDate || item?.label;
        const open = Number(item?.open);
        const high = Number(item?.high);
        const low = Number(item?.low);
        const close = Number(item?.close ?? item?.price ?? item?.adjustedClose);
        const volume = Number(item?.volume ?? item?.vol);
        const ts = date ? new Date(date).getTime() : NaN;
        if (
          Number.isNaN(ts) ||
          !Number.isFinite(open) ||
          !Number.isFinite(high) ||
          !Number.isFinite(low) ||
          !Number.isFinite(close) ||
          !Number.isFinite(volume)
        )
          return null;
        return {
          ts,
          x: ts,
          y: [open, high, low, close] as [number, number, number, number],
          volume: Math.round(volume),
        };
      })
      .filter(Boolean)
      .sort((a, b) => a!.ts - b!.ts)
      .map((item) => ({ x: item!.x, y: item!.y, volume: item!.volume })) as CandleSeriesPoint[];
  }, [seriesData, mode]);
  const candlePoints: CandleStickPoint[] = useMemo(
    () => (mode === "candle" ? candleData.map((item) => ({ x: item.x, y: item.y })) : []),
    [candleData, mode]
  );
  const candleVolumes = useMemo(
    () =>
      mode === "candle"
        ? candleData.map((item) => ({
            x: item.x,
            y: item.volume,
            fillColor: item.y[3] >= item.y[0] ? "#10b981" : "#ef4444",
          }))
        : [],
    [candleData, mode]
  );

  if (!symbol) {
    return <div className="text-sm text-slate-600">Seleziona un ticker per vedere il grafico.</div>;
  }

  if (status === "no-key") {
    return (
      <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
        Imposta la variabile VITE_FMP_API_KEY per mostrare il grafico.
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        Impossibile recuperare i dati per il grafico.
      </div>
    );
  }

  if (status === "loading") {
    return <div className="text-sm text-slate-600">Caricamento grafico...</div>;
  }

  const hasData = mode === "area" ? points.length > 0 : candlePoints.length > 0;

  if (!hasData) {
    return (
      <div className="rounded-md border border-dashed border-slate-200 bg-white/60 px-3 py-2 text-sm text-slate-600">
        Nessun dato disponibile per questo ticker.
      </div>
    );
  }

  const categories = points.map((item) => item.dateLabel);
  const priceSeries = points.map((item) => Number(item.close.toFixed(2)));
  const volumeSeries = points.map((item) => Math.round(item.volume));
  const volumeMax = volumeSeries.length ? Math.max(...volumeSeries) : 0;
  const priceMin = priceSeries.length ? Math.min(...priceSeries) : 0;
  const priceMax = priceSeries.length ? Math.max(...priceSeries) : 0;
  const candleVolumeMax = candleVolumes.length ? Math.max(...candleVolumes.map((v) => v.y)) : 0;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {(["area", "candle"] as ChartMode[]).map((key) => {
          const active = mode === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                setMode(key);
                if (key === "candle") {
                  setCandleInterval(null);
                }
              }}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                active
                  ? "border-slate-800 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {key === "area" ? "Area" : "Candle"}
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {(["1D", "1W", "1M", "6M", "12M", "2Y", "5Y"] as RangeKey[]).map((key) => {
            const active = range === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setRange(key)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  active
                    ? "border-slate-800 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {key}
              </button>
            );
          })}
        </div>
        {mode === "candle" && (
          <div className="flex flex-wrap items-center gap-2">
            {(["5Min", "15Min", "30Min", "1hour", "4Hour"] as CandleInterval[]).map((key) => {
              const active = candleInterval === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCandleInterval(active ? null : key)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    active
                      ? "border-slate-800 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {key}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {mode === "area" ? (
        <ReactApexChart
          type="line"
          height={420}
          series={[
            { name: "Prezzo (Close)", type: "area", data: priceSeries },
            { name: "Volume", type: "column", data: volumeSeries },
          ]}
          options={{
            chart: { stacked: false, toolbar: { show: false } },
            grid: { padding: { top: 8, bottom: 48 } },
            plotOptions: { bar: { columnWidth: "55%", borderRadius: 4 } },
            stroke: { width: [2, 0], curve: "smooth" },
            dataLabels: { enabled: false },
            colors: ["#38bdf8", "#94a3b8"],
            fill: {
              type: ["gradient", "solid"],
              opacity: [0.9, 0.35],
              gradient: {
                shade: "light",
                type: "vertical",
                shadeIntensity: 0.6,
                opacityFrom: 0.35,
                opacityTo: 0.05,
                stops: [0, 70, 100],
              },
            },
            xaxis: { categories, labels: { rotate: -30 } },
            yaxis: [
              {
                seriesName: "Prezzo (Close)",
                min: priceMin ? priceMin * 0.97 : undefined,
                max: priceMax ? priceMax * 1.03 : undefined,
                labels: { formatter: (val) => (Number.isFinite(val) ? val.toFixed(2) : "-") },
                title: { text: "Prezzo" },
              },
              {
                seriesName: "Volume",
                opposite: true,
                min: 0,
                max: volumeMax ? volumeMax * 4 : undefined,
                labels: { formatter: (val) => (Number.isFinite(val) ? formatNumber(val) : "-"), offsetY: 10 },
                title: { text: "Volume", offsetY: 12 },
              },
            ],
            legend: { position: "top", horizontalAlign: "left" },
            tooltip: {
              shared: true,
              intersect: false,
              y: {
                formatter: (val, opts) => {
                  const isPrice = opts?.seriesIndex === 0;
                  return isPrice ? Number(val).toFixed(2) : formatNumber(val);
                },
              },
            },
          }}
        />
      ) : (
        <ReactApexChart
          type="line"
          height={420}
          series={[
            { name: "OHLC", type: "candlestick", data: candlePoints },
            { name: "Volume", type: "column", data: candleVolumes },
          ]}
          options={{
            chart: { type: "line", toolbar: { show: false } },
            grid: { padding: { top: 8, bottom: 48 } },
            stroke: { width: [1, 0] },
            xaxis: { type: "datetime" },
            yaxis: [
              {
                tooltip: { enabled: true },
                title: { text: "Prezzo" },
              },
              {
                seriesName: "Volume",
                opposite: true,
                min: 0,
                max: candleVolumeMax ? candleVolumeMax * 1.6 : undefined,
                labels: { formatter: (val) => (Number.isFinite(val) ? formatNumber(val) : "-"), offsetY: 10 },
                title: { text: "Volume", offsetY: 12 },
              },
            ],
            plotOptions: {
              candlestick: {
                colors: {
                  upward: "#10b981",
                  downward: "#ef4444",
                },
              },
              bar: {
                columnWidth: "55%",
              },
            },
            tooltip: {
              shared: true,
              followCursor: true,
            },
            colors: ["#0f172a", "#94a3b8"],
          }}
        />
      )}
    </div>
  );
}
