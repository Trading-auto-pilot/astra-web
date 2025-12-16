import { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { fetchFmpEodLight } from "../../../api/fundamentals";

type Props = {
  symbol: string | null;
};

type ChartStatus = "idle" | "loading" | "error" | "no-key";

type CandlePoint = {
  dateLabel: string;
  close: number;
  volume: number;
};

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
    .slice(-180)
    .map((item) => ({
      dateLabel: item!.dateLabel,
      close: item!.close,
      volume: item!.volume,
    }));
}

export default function TickerChartTab({ symbol }: Props) {
  const [status, setStatus] = useState<ChartStatus>("idle");
  const [seriesData, setSeriesData] = useState<any[]>([]);

  useEffect(() => {
    if (!symbol) {
      setSeriesData([]);
      setStatus("idle");
      return;
    }

    let active = true;
    const controller = new AbortController();
    setStatus("loading");
    fetchFmpEodLight(symbol, controller.signal)
      .then((docs) => {
        if (!active) return;
        setSeriesData(Array.isArray(docs) ? docs : []);
        setStatus("idle");
      })
      .catch((err) => {
        if (!active || err.name === "AbortError") return;
        console.error("EOD light fetch error", err);
        setSeriesData([]);
        setStatus(err.message === "Missing FMP API key" ? "no-key" : "error");
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [symbol]);

  const points = useMemo(() => normalizeData(seriesData), [seriesData]);

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

  if (!points.length) {
    return (
      <div className="rounded-md border border-dashed border-slate-200 bg-white/60 px-3 py-2 text-sm text-slate-600">
        Nessun dato disponibile per questo ticker.
      </div>
    );
  }

  const categories = points.map((item) => item.dateLabel);
  const priceSeries = points.map((item) => Number(item.close.toFixed(2)));
  const volumeSeries = points.map((item) => Math.round(item.volume));

  return (
    <div className="space-y-3">
      <ReactApexChart
        type="line"
        height={360}
        series={[
          { name: "Prezzo (Close)", type: "area", data: priceSeries },
          { name: "Volume", type: "column", data: volumeSeries },
        ]}
        options={{
          chart: { stacked: false, toolbar: { show: false } },
          stroke: { width: [0, 2], curve: "smooth" },
          dataLabels: { enabled: false },
          colors: ["#94a3b8", "#0ea5e9"],
          fill: {
            type: ["solid", "gradient"],
            opacity: [0.6, 0.2],
            gradient: {
              shadeIntensity: 0.6,
              opacityFrom: 0.4,
              opacityTo: 0.05,
              stops: [0, 70, 100],
            },
          },
          xaxis: { categories, labels: { rotate: -30 } },
          yaxis: [
            {
              seriesName: "Volume",
              opposite: true,
              labels: { formatter: (val) => (Number.isFinite(val) ? formatNumber(val) : "-") },
              title: { text: "Volume" },
            },
            {
              seriesName: "Prezzo (Close)",
              labels: { formatter: (val) => (Number.isFinite(val) ? val.toFixed(2) : "-") },
              title: { text: "Prezzo" },
            },
          ],
          legend: { position: "top", horizontalAlign: "left" },
          tooltip: {
            shared: true,
            intersect: false,
            y: {
              formatter: (val, opts) => {
                const seriesName = opts?.seriesIndex === 0 ? "vol" : "px";
                return seriesName === "vol" ? formatNumber(val) : Number(val).toFixed(2);
              },
            },
          },
        }}
      />
    </div>
  );
}
