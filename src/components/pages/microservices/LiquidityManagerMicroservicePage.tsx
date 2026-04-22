import { useCallback, useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import MicroserviceGeneralTab from "../../molecules/microservice/MicroserviceGeneralTab";
import { env } from "../../../config/env";
import { redisWsBridgeClient } from "../../../services/ws/redisWsBridgeClient";

// Tipo per le informazioni di release del microservizio
type ReleaseInfo = {
  version?: string | null;
  lastUpdate?: string | null;
  microservice?: string | null;
  note?: string[] | null;
};

// Props ricevute dal componente padre (AdminMicroserviceDetailPage)
type Props = {
  onReleaseChange?: (rel: ReleaseInfo | null) => void; // Callback quando cambiano le info di release
  onHealthChange?: (health: Record<string, any> | null) => void; // Callback quando cambia lo stato di health
  onOpenReleaseModal?: () => void; // Callback per aprire il modale con le note di release
};

type LiquidityScoreSnapshot = {
  ok: boolean;
  timestamp?: string;
  score?: number;
  riskRegime?: string;
  volatilityRegime?: string;
  confidence?: number;
  components?: Record<
    string,
    {
      raw?: number | null;
      normalized?: number | null;
      weight?: number | null;
      timestamp?: string;
      source?: string;
      details?: Record<string, any>;
    }
  >;
  weights?: Record<string, number>;
  notes?: string[];
};

type Status = "idle" | "loading" | "error";
type TabKey = "general" | "checkLiquidity" | "history";
type BackfillResult = {
  ok: boolean;
  fromDate?: string;
  toDate?: string;
  processed?: number;
  inserted?: number;
  skipped?: number;
  errors?: number;
  days?: string[];
};
type LiquidityTask = {
  taskId: string;
  status: "RUNNING" | "SUCCESS" | "FAILED" | string;
  reason?: string;
  trigger?: string;
  createdAt?: string;
  startedAt?: string;
  endedAt?: string | null;
  durationMs?: number | null;
  error?: string | null;
  currentStep?: string;
  progress?: Array<{ ts?: string; step?: string; detail?: string }>;
};

type LiquidityTaskWsMessage = {
  type?: string;
  event?: string;
  task?: LiquidityTask;
  __channel?: string;
  channel?: string;
};

type LiquidityHistoryPoint = {
  x: number;
  label: string;
  scoreRaw: number | null;
  scoreEma: number | null;
  vixValue: number | null;
  dxyValue: number | null;
  spyReturn1d: number | null;
  spySma50: number | null;
  spySma200: number | null;
  confidence: number | null;
  riskRegime: string | null;
  volatilityRegime: string | null;
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("it-IT", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const formatValue = (value: unknown) => {
  if (value == null) return "-";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "-";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "string") return value || "-";
  return JSON.stringify(value);
};

const toFiniteNumber = (value: unknown) => {
  const num = typeof value === "string" ? Number(value) : (value as number);
  return Number.isFinite(num) ? num : null;
};

const normalizeHistoryRows = (rows: any[]): LiquidityHistoryPoint[] => {
  return (Array.isArray(rows) ? rows : [])
    .map((row) => {
      const timestampRaw = row?.calculated_at || row?.timestamp || row?.created_at || row?.date;
      const confidence = toFiniteNumber(row?.confidence);
      const ts = timestampRaw ? new Date(timestampRaw).getTime() : NaN;
      if (!Number.isFinite(ts)) return null;
      const scoreRaw = toFiniteNumber(row?.score_raw) ?? toFiniteNumber(row?.score);
      const scoreEma =
        toFiniteNumber(row?.score_ema) ??
        toFiniteNumber(row?.liquidity_score) ??
        toFiniteNumber(row?.value);
      return {
        x: ts,
        label: new Date(ts).toLocaleDateString("it-IT", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        scoreRaw: scoreRaw != null ? Number(scoreRaw.toFixed(2)) : null,
        scoreEma: scoreEma != null ? Number(scoreEma.toFixed(2)) : null,
        vixValue: toFiniteNumber(row?.vix_value),
        dxyValue: toFiniteNumber(row?.dxy_value),
        spyReturn1d: toFiniteNumber(row?.spy_return_1d),
        spySma50: toFiniteNumber(row?.spy_sma50),
        spySma200: toFiniteNumber(row?.spy_sma200),
        confidence,
        riskRegime: row?.risk_regime || row?.riskRegime || null,
        volatilityRegime: row?.volatility_regime || row?.volatilityRegime || null,
      };
    })
    .filter(
      (row) =>
        Boolean(row) &&
        [
          row?.scoreRaw,
          row?.scoreEma,
          row?.vixValue,
          row?.dxyValue,
          row?.spyReturn1d,
          row?.spySma50,
          row?.spySma200,
        ].some((value) => value != null)
    )
    .sort((a, b) => a!.x - b!.x) as LiquidityHistoryPoint[];
};

/**
 * Componente per la gestione della pagina del microservizio liquidity-manager
 *
 * Questo componente gestisce solo il tab "General Settings" con le impostazioni comuni:
 * - DB Logger, Log Level
 * - Communication Channels
 * - Logs
 */
export default function LiquidityManagerMicroservicePage({
  onReleaseChange,
  onHealthChange,
  onOpenReleaseModal,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [scoreStatus, setScoreStatus] = useState<Status>("idle");
  const [scoreError, setScoreError] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<LiquidityScoreSnapshot | null>(null);
  const [taskInfo, setTaskInfo] = useState<LiquidityTask | null>(null);
  const [runningTasks, setRunningTasks] = useState<LiquidityTask[]>([]);
  const [backfillMode, setBackfillMode] = useState(false);
  const [backfillFrom, setBackfillFrom] = useState("");
  const [backfillTo, setBackfillTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [backfillResult, setBackfillResult] = useState<BackfillResult | null>(null);
  const [historyStatus, setHistoryStatus] = useState<Status>("idle");
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [historyRows, setHistoryRows] = useState<LiquidityHistoryPoint[]>([]);

  const token = useMemo(
    () => (typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null),
    []
  );

  const loadLiquidityScore = useCallback(async () => {
    setScoreStatus("loading");
    setScoreError(null);
    try {
      const res = await fetch(`${env.apiBaseUrl}/liquidity-manager/liquidity-score`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || data?.message || "Errore caricamento Liquidity Score");
      }
      setSnapshot(data);
      setScoreStatus("idle");
    } catch (err: any) {
      setScoreStatus("error");
      setScoreError(err?.message || "Errore caricamento Liquidity Score");
    }
  }, [token]);

  const runLiquidity = useCallback(async () => {
    setScoreStatus("loading");
    setScoreError(null);
    try {
      const res = await fetch(`${env.apiBaseUrl}/liquidity-manager/liquidity-score/recompute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Errore recompute Liquidity Score");
      }

      const taskId = String(data?.taskId || "");
      if (!taskId) {
        if (data?.score != null) {
          setSnapshot(data);
          setScoreStatus("idle");
          return;
        }
        throw new Error("Task ID mancante dalla risposta di recompute");
      }
      setTaskInfo({
        taskId,
        status: data?.status || (data?.started ? "RUNNING" : "RUNNING"),
      });
      setScoreStatus("idle");
    } catch (err: any) {
      setScoreStatus("error");
      setScoreError(err?.message || "Errore recompute Liquidity Score");
    }
  }, [token]);

  const loadRunningTasks = useCallback(async () => {
    try {
      const res = await fetch(`${env.apiBaseUrl}/liquidity-manager/liquidity-score/tasks?status=RUNNING&limit=20`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) return;
      const items = Array.isArray(data?.items) ? (data.items as LiquidityTask[]) : [];
      setRunningTasks(items);
    } catch {
      // ignore background polling errors
    }
  }, [token]);

  const runBackfill = useCallback(async () => {
    if (!backfillFrom || !backfillTo) {
      setScoreError("Inserisci entrambe le date (from e to) per il backfill.");
      return;
    }
    if (backfillFrom > backfillTo) {
      setScoreError("La data 'from' deve essere precedente o uguale alla data 'to'.");
      return;
    }
    setScoreStatus("loading");
    setScoreError(null);
    setBackfillResult(null);
    try {
      const res = await fetch(
        `${env.apiBaseUrl}/liquidity-manager/admin/backfill?from=${backfillFrom}&to=${backfillTo}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || data?.message || "Errore durante il backfill");
      }
      setBackfillResult(data as BackfillResult);
      setScoreStatus("idle");
    } catch (err: any) {
      setScoreStatus("error");
      setScoreError(err?.message || "Errore durante il backfill");
    }
  }, [token, backfillFrom, backfillTo]);

  const loadHistory = useCallback(async () => {
    setHistoryStatus("loading");
    setHistoryError(null);
    try {
      const res = await fetch(
        `${env.apiBaseUrl}/datahub/api/table/liquidity_daily_scores?limit=500&sort_by=calculated_at&sort_dir=asc`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error?.message || data?.error || `HTTP ${res.status}`);
      }
      const rows = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      setHistoryRows(normalizeHistoryRows(rows));
      setHistoryStatus("idle");
    } catch (err: any) {
      setHistoryStatus("error");
      setHistoryError(err?.message || "Errore caricamento storico liquidità");
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === "checkLiquidity") {
      loadLiquidityScore();
      loadRunningTasks();
    }
    if (activeTab === "history") {
      loadHistory();
    }
  }, [activeTab, loadLiquidityScore, loadRunningTasks, loadHistory]);

  useEffect(() => {
    if (activeTab !== "checkLiquidity") return;
    redisWsBridgeClient.start();
    const unsubscribe = redisWsBridgeClient.subscribe({
      filter: (msg) => {
        if (!msg || typeof msg !== "object") return false;
        const payload = msg as LiquidityTaskWsMessage;
        if (payload.type !== "liquidityTaskUpdate") return false;
        const channel =
          typeof payload.__channel === "string"
            ? payload.__channel
            : typeof payload.channel === "string"
              ? payload.channel
              : "";
        if (channel && !channel.startsWith(`${env.appEnv}.liquidity-manager.`)) return false;
        return true;
      },
      onMessage: (msg) => {
        const payload = msg as LiquidityTaskWsMessage;
        const task = payload?.task;
        if (!task?.taskId) return;

        setTaskInfo((prev) => {
          if (prev?.taskId === task.taskId || task.status === "RUNNING") return task;
          return prev;
        });

        setRunningTasks((prev) => {
          const map = new Map(prev.map((item) => [item.taskId, item]));
          if (task.status === "RUNNING") {
            map.set(task.taskId, task);
          } else {
            map.delete(task.taskId);
          }
          return Array.from(map.values());
        });

        if (task.status === "SUCCESS") {
          setScoreError(null);
          setScoreStatus("idle");
          loadLiquidityScore();
          return;
        }
        if (task.status === "FAILED") {
          setScoreStatus("error");
          setScoreError(task.error || "Task di recompute fallito");
        }
      },
      onStatus: (status, detail) => {
        if (status === "error") {
          setScoreError(detail || "Errore connessione websocket");
        }
      },
    });

    return () => {
      unsubscribe();
    };
  }, [activeTab, loadLiquidityScore]);

  const historySummary = useMemo(() => {
    if (!historyRows.length) return null;
    const scores = historyRows
      .map((row) => row.scoreEma ?? row.scoreRaw)
      .filter((value): value is number => value != null);
    if (!scores.length) return null;
    const latest = historyRows[historyRows.length - 1];
    const first = historyRows[0];
    const latestScore = latest.scoreEma ?? latest.scoreRaw ?? 0;
    const firstScore = first.scoreEma ?? first.scoreRaw ?? 0;
    return {
      latest,
      first,
      min: Math.min(...scores),
      max: Math.max(...scores),
      delta: Number((latestScore - firstScore).toFixed(2)),
    };
  }, [historyRows]);

  const baseHistoryChartOptions = useMemo(
    () => ({
      chart: {
        toolbar: { show: false },
        zoom: { enabled: false },
        foreColor: "#475569",
      },
      stroke: {
        curve: "smooth" as const,
        width: 3,
      },
      dataLabels: { enabled: false },
      legend: {
        show: true,
        position: "top" as const,
        horizontalAlign: "left" as const,
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 3,
        },
      },
      grid: {
        borderColor: "#e2e8f0",
        strokeDashArray: 4,
      },
      xaxis: {
        type: "datetime" as const,
        labels: {
          datetimeUTC: false,
        },
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 5,
        labels: {
          formatter: (value: number) => `${value.toFixed(0)}`,
        },
      },
      tooltip: {
        x: {
          format: "dd MMM yyyy",
        },
        custom: ({ series, seriesIndex, dataPointIndex, w }: any) => {
          const point = w?.config?.series?.[seriesIndex]?.data?.[dataPointIndex] as LiquidityHistoryPoint | undefined;
          const value = series?.[seriesIndex]?.[dataPointIndex];
          if (!point) return "";
          return `
            <div class="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow">
              <div class="font-semibold text-slate-900">${point.label}</div>
              <div>Liquidity: ${Number(value).toFixed(2)}</div>
              <div>Confidence: ${point.confidence != null ? point.confidence.toFixed(2) : "-"}</div>
              <div>Risk: ${point.riskRegime || "-"}</div>
              <div>Volatility: ${point.volatilityRegime || "-"}</div>
            </div>
          `;
        },
      },
    }),
    []
  );

  const mainHistoryChartOptions = useMemo(
    () => ({
      ...baseHistoryChartOptions,
      chart: {
        ...baseHistoryChartOptions.chart,
        id: "liquidity-history-main",
      },
      colors: ["#0f766e", "#0f172a", "#dc2626"],
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 5,
        labels: {
          formatter: (value: number) => `${value.toFixed(0)}`,
        },
      },
    }),
    [baseHistoryChartOptions]
  );

  const spyHistoryChartOptions = useMemo(
    () => ({
      ...baseHistoryChartOptions,
      chart: {
        ...baseHistoryChartOptions.chart,
        id: "liquidity-history-spy",
      },
      colors: ["#2563eb", "#7c3aed", "#f59e0b", "#dc2626"],
      yaxis: [
        {
          seriesName: "SPY Return 1d",
          labels: {
            formatter: (value: number) => value.toFixed(2),
          },
          title: {
            text: "SPY",
          },
        },
        {
          seriesName: "SPY SMA 50",
          show: false,
          labels: {
            formatter: (value: number) => value.toFixed(2),
          },
        },
        {
          seriesName: "SPY SMA 200",
          show: false,
          labels: {
            formatter: (value: number) => value.toFixed(2),
          },
        },
        {
          seriesName: "DXY Value",
          opposite: true,
          show: true,
          labels: {
            formatter: (value: number) => value.toFixed(2),
          },
          title: {
            text: "DXY",
          },
        },
      ],
    }),
    [baseHistoryChartOptions]
  );

  const mainHistorySeries = useMemo(
    () => [
      {
        name: "Score Raw",
        data: historyRows
          .filter((row) => row.scoreRaw != null)
          .map((row) => ({ ...row, y: row.scoreRaw as number })),
      },
      {
        name: "Score EMA",
        data: historyRows
          .filter((row) => row.scoreEma != null)
          .map((row) => ({ ...row, y: row.scoreEma as number })),
      },
      {
        name: "VIX Value",
        data: historyRows
          .filter((row) => row.vixValue != null)
          .map((row) => ({ ...row, y: row.vixValue as number })),
      },
    ],
    [historyRows]
  );

  const spyHistorySeries = useMemo(
    () => [
      {
        name: "SPY Return 1d",
        data: historyRows
          .filter((row) => row.spyReturn1d != null)
          .map((row) => ({ ...row, y: row.spyReturn1d as number })),
      },
      {
        name: "SPY SMA 50",
        data: historyRows
          .filter((row) => row.spySma50 != null)
          .map((row) => ({ ...row, y: row.spySma50 as number })),
      },
      {
        name: "SPY SMA 200",
        data: historyRows
          .filter((row) => row.spySma200 != null)
          .map((row) => ({ ...row, y: row.spySma200 as number })),
      },
      {
        name: "DXY Value",
        data: historyRows
          .filter((row) => row.dxyValue != null)
          .map((row) => ({ ...row, y: row.dxyValue as number })),
      },
    ],
    [historyRows]
  );

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      <div className="flex gap-6 border-b border-slate-200">
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "general" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
          }`}
          onClick={() => setActiveTab("general")}
        >
          General Settings
        </button>
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "checkLiquidity" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
          }`}
          onClick={() => setActiveTab("checkLiquidity")}
        >
          Check Liquidity
        </button>
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "history" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
          }`}
          onClick={() => setActiveTab("history")}
        >
          Liquidity History
        </button>
      </div>

      {activeTab === "general" && (
        <div className="flex-1 min-h-0 flex flex-col">
          <MicroserviceGeneralTab
            microservice="liquidity-manager"
            onReleaseChange={onReleaseChange}
            onHealthChange={onHealthChange}
            onOpenReleaseModal={onOpenReleaseModal}
          />
        </div>
      )}

      {activeTab === "checkLiquidity" && (
        <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pt-4 pb-[5px]">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900">Liquidity Score</div>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                onClick={backfillMode ? runBackfill : runLiquidity}
                disabled={scoreStatus === "loading" || (backfillMode && (!backfillFrom || !backfillTo))}
              >
                {scoreStatus === "loading"
                  ? backfillMode ? "Backfilling..." : "Running..."
                  : backfillMode ? "Run backfill" : "Run liquidity"}
              </button>
            </div>

            {/* Backfill toggle + date range */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
              <label className="flex cursor-pointer items-center gap-2.5 select-none">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded accent-slate-800"
                  checked={backfillMode}
                  onChange={(e) => {
                    setBackfillMode(e.target.checked);
                    setBackfillResult(null);
                    setScoreError(null);
                  }}
                />
                <span className="text-[11px] font-semibold text-slate-700">Backfill storico</span>
                <span className="text-[10px] text-slate-400">
                  — ricalcola e salva i punteggi per un intervallo di date passate
                </span>
              </label>

              {backfillMode && (
                <div className="mt-2.5 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <label className="text-[10px] font-semibold text-slate-500">Da</label>
                    <input
                      type="date"
                      className="rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                      value={backfillFrom}
                      max={backfillTo || undefined}
                      onChange={(e) => setBackfillFrom(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <label className="text-[10px] font-semibold text-slate-500">A</label>
                    <input
                      type="date"
                      className="rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                      value={backfillTo}
                      min={backfillFrom || undefined}
                      onChange={(e) => setBackfillTo(e.target.value)}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Warm-up automatico di 250 gg preposto per stabilizzare SMA(200) ed EMA
                  </span>
                </div>
              )}
            </div>
          </div>

          {scoreError && (
            <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">
              {scoreError}
            </div>
          )}
          {taskInfo && !backfillMode && (
            <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
              Task <span className="font-semibold">{taskInfo.taskId}</span> - Stato:{" "}
              <span className="font-semibold">{taskInfo.status}</span>
              {taskInfo.durationMs != null && ` - Duration: ${taskInfo.durationMs} ms`}
              {taskInfo.error ? ` - Error: ${taskInfo.error}` : ""}
            </div>
          )}

          {backfillResult && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="mb-2 text-[11px] font-semibold text-emerald-800">
                Backfill completato — {backfillResult.fromDate} → {backfillResult.toDate}
              </div>
              <div className="flex flex-wrap gap-4">
                {[
                  { label: "Elaborati", value: backfillResult.processed },
                  { label: "Inseriti", value: backfillResult.inserted },
                  { label: "Saltati (già presenti)", value: backfillResult.skipped },
                  { label: "Errori", value: backfillResult.errors },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col items-center rounded-md border border-emerald-200 bg-white px-4 py-2 min-w-[80px]">
                    <span className="text-lg font-bold text-emerald-700">{value ?? "-"}</span>
                    <span className="text-[10px] text-slate-500">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-2 text-sm font-semibold text-slate-900">Task in esecuzione</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] text-slate-600">
                <thead className="bg-slate-50 text-[10px] uppercase text-slate-400">
                  <tr>
                    <th className="px-3 py-2">Task ID</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Current Step</th>
                    <th className="px-3 py-2">Detail</th>
                    <th className="px-3 py-2">Started</th>
                    <th className="px-3 py-2">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {runningTasks.map((task) => {
                    const lastProgress = Array.isArray(task.progress) && task.progress.length
                      ? task.progress[task.progress.length - 1]
                      : null;
                    const startedTs = task.startedAt ? new Date(task.startedAt).getTime() : null;
                    const durationMs = startedTs ? Math.max(0, Date.now() - startedTs) : null;
                    return (
                      <tr key={task.taskId} className="border-t border-slate-100">
                        <td className="px-3 py-2 text-slate-700">{task.taskId}</td>
                        <td className="px-3 py-2">{task.status || "-"}</td>
                        <td className="px-3 py-2">{task.currentStep || "-"}</td>
                        <td className="px-3 py-2">{lastProgress?.detail || "-"}</td>
                        <td className="px-3 py-2">{formatDate(task.startedAt)}</td>
                        <td className="px-3 py-2">{durationMs != null ? `${durationMs} ms` : "-"}</td>
                      </tr>
                    );
                  })}
                  {runningTasks.length === 0 && (
                    <tr>
                      <td className="px-3 py-3 text-center text-[11px] text-slate-400" colSpan={6}>
                        Nessun task in esecuzione.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            {snapshot ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-slate-200">
                  <div className="border-b border-slate-100 px-3 py-2 text-[11px] font-semibold text-slate-700">
                    Summary
                  </div>
                  <table className="w-full text-[11px]">
                    <tbody>
                      <tr className="border-t border-slate-100">
                        <td className="px-3 py-2 font-semibold text-slate-600">Timestamp</td>
                        <td className="px-3 py-2 text-slate-800">{formatDate(snapshot.timestamp)}</td>
                      </tr>
                      <tr className="border-t border-slate-100">
                        <td className="px-3 py-2 font-semibold text-slate-600">Score</td>
                        <td className="px-3 py-2 text-slate-800">{formatValue(snapshot.score)}</td>
                      </tr>
                      <tr className="border-t border-slate-100">
                        <td className="px-3 py-2 font-semibold text-slate-600">Risk Regime</td>
                        <td className="px-3 py-2 text-slate-800">{formatValue(snapshot.riskRegime)}</td>
                      </tr>
                      <tr className="border-t border-slate-100">
                        <td className="px-3 py-2 font-semibold text-slate-600">Volatility Regime</td>
                        <td className="px-3 py-2 text-slate-800">{formatValue(snapshot.volatilityRegime)}</td>
                      </tr>
                      <tr className="border-t border-slate-100">
                        <td className="px-3 py-2 font-semibold text-slate-600">Confidence</td>
                        <td className="px-3 py-2 text-slate-800">{formatValue(snapshot.confidence)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="rounded-lg border border-slate-200">
                  <div className="border-b border-slate-100 px-3 py-2 text-[11px] font-semibold text-slate-700">
                    Components
                  </div>
                  <div className="space-y-3 px-3 py-2">
                    {Object.entries(snapshot.components || {}).map(([key, component]) => (
                      <div key={key} className="rounded-md border border-slate-200 bg-slate-50 p-2">
                        <div className="mb-1 text-[10px] font-semibold uppercase text-slate-600">{key}</div>
                        <table className="w-full text-[10px]">
                          <tbody>
                            <tr>
                              <td className="py-1 font-semibold text-slate-500">Raw</td>
                              <td className="py-1 text-slate-700">{formatValue(component?.raw)}</td>
                            </tr>
                            <tr>
                              <td className="py-1 font-semibold text-slate-500">Normalized</td>
                              <td className="py-1 text-slate-700">{formatValue(component?.normalized)}</td>
                            </tr>
                            <tr>
                              <td className="py-1 font-semibold text-slate-500">Weight</td>
                              <td className="py-1 text-slate-700">{formatValue(component?.weight)}</td>
                            </tr>
                            <tr>
                              <td className="py-1 font-semibold text-slate-500">Timestamp</td>
                              <td className="py-1 text-slate-700">{formatDate(component?.timestamp)}</td>
                            </tr>
                            <tr>
                              <td className="py-1 font-semibold text-slate-500">Source</td>
                              <td className="py-1 text-slate-700">{formatValue(component?.source)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 md:col-span-2">
                  <div className="border-b border-slate-100 px-3 py-2 text-[11px] font-semibold text-slate-700">
                    Weights & Notes
                  </div>
                  <div className="grid gap-3 p-3 md:grid-cols-2">
                    <div className="rounded-md border border-slate-200 bg-slate-50 p-2">
                      <div className="mb-1 text-[10px] font-semibold uppercase text-slate-600">Weights</div>
                      <table className="w-full text-[10px]">
                        <tbody>
                          {Object.entries(snapshot.weights || {}).map(([key, value]) => (
                            <tr key={key}>
                              <td className="py-1 font-semibold text-slate-500">{key}</td>
                              <td className="py-1 text-slate-700">{formatValue(value)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="rounded-md border border-slate-200 bg-slate-50 p-2">
                      <div className="mb-1 text-[10px] font-semibold uppercase text-slate-600">Notes</div>
                      {Array.isArray(snapshot.notes) && snapshot.notes.length > 0 ? (
                        <ul className="space-y-1 text-[10px] text-slate-700">
                          {snapshot.notes.map((note, idx) => (
                            <li key={`${note}-${idx}`}>- {note}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-[10px] text-slate-500">No notes</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-slate-500">
                {scoreStatus === "loading"
                  ? "Caricamento Liquidity Score..."
                  : "Nessun dato disponibile. Premi Run liquidity o ricarica la scheda."}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pt-4 pb-[5px]">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">Liquidity History</div>
              <div className="text-[11px] text-slate-500">
                Serie storica dei punteggi salvati in `liquidity_daily_scores`
              </div>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
              onClick={loadHistory}
              disabled={historyStatus === "loading"}
            >
              {historyStatus === "loading" ? "Loading..." : "Refresh"}
            </button>
          </div>

          {historyError && (
            <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">
              {historyError}
            </div>
          )}

          {historySummary && (
            <div className="grid gap-3 md:grid-cols-4">
              {[
                {
                  label: "Latest",
                  value: (historySummary.latest.scoreEma ?? historySummary.latest.scoreRaw ?? 0).toFixed(2),
                },
                { label: "Min", value: historySummary.min.toFixed(2) },
                { label: "Max", value: historySummary.max.toFixed(2) },
                {
                  label: "Delta",
                  value: `${historySummary.delta > 0 ? "+" : ""}${historySummary.delta.toFixed(2)}`,
                },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{item.label}</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-900">{item.value}</div>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            {historyStatus === "loading" ? (
              <div className="text-sm text-slate-600">Caricamento storico liquidità...</div>
            ) : historyRows.length === 0 ? (
              <div className="rounded-md border border-dashed border-slate-200 bg-white/60 px-3 py-6 text-sm text-slate-600">
                Nessun dato disponibile per lo storico liquidità.
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Score e VIX
                  </div>
                  <ReactApexChart
                    type="line"
                    height={320}
                    options={mainHistoryChartOptions}
                    series={mainHistorySeries}
                  />
                </div>
                <div className="border-t border-slate-100 pt-5">
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    SPY
                  </div>
                  <ReactApexChart
                    type="line"
                    height={280}
                    options={spyHistoryChartOptions}
                    series={spyHistorySeries}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
