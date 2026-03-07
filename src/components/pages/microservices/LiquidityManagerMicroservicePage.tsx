import { useCallback, useEffect, useMemo, useState } from "react";
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
  const [activeTab, setActiveTab] = useState<"general" | "checkLiquidity">("general");
  const [scoreStatus, setScoreStatus] = useState<Status>("idle");
  const [scoreError, setScoreError] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<LiquidityScoreSnapshot | null>(null);
  const [taskInfo, setTaskInfo] = useState<LiquidityTask | null>(null);
  const [runningTasks, setRunningTasks] = useState<LiquidityTask[]>([]);

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

  useEffect(() => {
    if (activeTab === "checkLiquidity") {
      loadLiquidityScore();
      loadRunningTasks();
    }
  }, [activeTab, loadLiquidityScore, loadRunningTasks]);

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
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Liquidity Score</div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              onClick={runLiquidity}
              disabled={scoreStatus === "loading"}
            >
              {scoreStatus === "loading" ? "Running..." : "Run liquidity"}
            </button>
          </div>

          {scoreError && (
            <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">
              {scoreError}
            </div>
          )}
          {taskInfo && (
            <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
              Task <span className="font-semibold">{taskInfo.taskId}</span> - Stato:{" "}
              <span className="font-semibold">{taskInfo.status}</span>
              {taskInfo.durationMs != null && ` - Duration: ${taskInfo.durationMs} ms`}
              {taskInfo.error ? ` - Error: ${taskInfo.error}` : ""}
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
    </div>
  );
}
