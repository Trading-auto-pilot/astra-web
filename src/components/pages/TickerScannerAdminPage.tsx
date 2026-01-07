import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchTickerScanJobs,
  fetchMarketDailyJobs,
  cancelMarketDailyJob,
  cancelTickerScanJob,
  fetchUserDailyJobs,
  cancelUserDailyJob,
  startUserDailyJob,
  startTickerScan,
  startTickerScanForce,
  updateMarketDaily,
  type TickerScanJob,
  type MarketDailyJob,
  type UserDailyJob,
  type UserPipe,
  fetchUserPipes,
} from "../../api/tickerScanner";
import SectionHeader from "../molecules/content/SectionHeader";
import BaseButton from "../atoms/base/buttons/BaseButton";
import AppIcon from "../atoms/icon/AppIcon";

type Status = "idle" | "loading" | "error";

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("it-IT", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const STATUS_COLOR: Record<string, string> = {
  queued: "bg-amber-100 text-amber-700 ring-amber-200",
  running: "bg-blue-100 text-blue-700 ring-blue-200",
  completed: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  error: "bg-red-100 text-red-700 ring-red-200",
};

const statusPill = (status?: string) => {
  if (!status) return null;
  const normalized = status.toLowerCase();
  const cls = STATUS_COLOR[normalized] || "bg-slate-100 text-slate-700 ring-slate-200";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${cls}`}>
      {normalized}
    </span>
  );
};

export default function TickerScannerAdminPage() {
  const [jobs, setJobs] = useState<TickerScanJob[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [marketJobs, setMarketJobs] = useState<MarketDailyJob[]>([]);
  const [marketStatus, setMarketStatus] = useState<Status>("idle");
  const [userDailyJobs, setUserDailyJobs] = useState<UserDailyJob[]>([]);
  const [userDailyStatus, setUserDailyStatus] = useState<Status>("idle");
  const [showUserDailyModal, setShowUserDailyModal] = useState(false);
  const [userDailyDate, setUserDailyDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [userDailyNote, setUserDailyNote] = useState<string>("Manual update");
  const [userDailyPipe, setUserDailyPipe] = useState<string>("");
  const [pipes, setPipes] = useState<UserPipe[]>([]);
  const [userDailyVersion, setUserDailyVersion] = useState<string>("1.0");

  const loadJobs = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const items = await fetchTickerScanJobs();
      setJobs(items);
      setStatus("idle");
    } catch (err: any) {
      setError(err?.message || "Errore durante il caricamento dei job");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    loadJobs();
    const interval = setInterval(loadJobs, 15000);
    return () => clearInterval(interval);
  }, [loadJobs]);

  const loadMarketJobs = useCallback(async () => {
    setMarketStatus("loading");
    try {
      const jobs = await fetchMarketDailyJobs();
      setMarketJobs(jobs);
      setMarketStatus("idle");
    } catch (err) {
      setMarketStatus("error");
    }
  }, []);

  useEffect(() => {
    loadMarketJobs();
    const interval = setInterval(loadMarketJobs, 10000);
    return () => clearInterval(interval);
  }, [loadMarketJobs]);

  const loadUserDaily = useCallback(async () => {
    setUserDailyStatus("loading");
    try {
      const jobs = await fetchUserDailyJobs();
      setUserDailyJobs(jobs);
      setUserDailyStatus("idle");
    } catch (err) {
      setUserDailyStatus("error");
    }
  }, []);

  useEffect(() => {
    loadUserDaily();
    const interval = setInterval(loadUserDaily, 8000);
    return () => clearInterval(interval);
  }, [loadUserDaily]);

  useEffect(() => {
    fetchUserPipes()
      .then((list) => setPipes(list))
      .catch(() => setPipes([]));
  }, []);

  const rows = useMemo(() => jobs, [jobs]);

  const handleAction = useCallback(
    async (action: "scan" | "scanForce" | "updateMarketDaily") => {
      setActionLoading(action);
      setActionStatus(null);
      try {
        if (action === "scan") await startTickerScan();
        if (action === "scanForce") await startTickerScanForce();
        if (action === "updateMarketDaily") await updateMarketDaily();
        setActionStatus("OK");
        // reload jobs shortly after triggering actions
        setTimeout(loadJobs, 500);
        if (action === "updateMarketDaily") setTimeout(loadMarketJobs, 500);
      } catch (err: any) {
        setActionStatus(err?.message || "Errore");
      } finally {
        setActionLoading(null);
      }
    },
    [loadJobs, loadMarketJobs]
  );

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Tickers Scanner"
        subTitle="Job di scan in esecuzione o in coda"
        actionComponent={
          <div className="flex flex-wrap gap-2">
            <BaseButton
              variant="outline"
              color="neutral"
              size="sm"
              startIcon={<AppIcon icon="mdi:refresh" />}
              onClick={loadJobs}
              disabled={status === "loading" || actionLoading !== null}
            >
              Aggiorna
            </BaseButton>
            <BaseButton
              variant="solid"
              color="primary"
              size="sm"
              startIcon={<AppIcon icon="mdi:play-circle-outline" />}
              onClick={() => handleAction("scan")}
              disabled={actionLoading !== null}
            >
              Scan
            </BaseButton>
            <BaseButton
              variant="outline"
              color="warning"
              size="sm"
              startIcon={<AppIcon icon="mdi:flash-outline" />}
              onClick={() => handleAction("scanForce")}
              disabled={actionLoading !== null}
            >
              Scan (force)
            </BaseButton>
            <BaseButton
              variant="outline"
              color="neutral"
              size="sm"
              startIcon={<AppIcon icon="mdi:calendar-plus" />}
              onClick={() => setShowUserDailyModal(true)}
              disabled={actionLoading !== null}
            >
              Update daily scores
            </BaseButton>
            <BaseButton
              variant="outline"
              color="neutral"
              size="sm"
              startIcon={<AppIcon icon="mdi:database-refresh" />}
              onClick={() => handleAction("updateMarketDaily")}
              disabled={actionLoading !== null}
            >
              Update Market Daily
            </BaseButton>
          </div>
        }
      />

      {actionStatus && (
        <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm">
          Azione: {actionStatus}
        </div>
      )}

      {status === "loading" && rows.length === 0 && (
        <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
          Caricamento...
        </div>
      )}

      {status === "error" && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      {rows.length === 0 && status !== "loading" && (
        <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
          Nessun job attivo al momento.
        </div>
      )}

      {rows.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 font-semibold">Job ID</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Created</th>
                <th className="px-3 py-2 font-semibold">Updated</th>
                <th className="px-3 py-2 font-semibold text-right">Total</th>
                <th className="px-3 py-2 font-semibold text-right">Processed</th>
                <th className="px-3 py-2 font-semibold text-right">DB hits</th>
                <th className="px-3 py-2 font-semibold text-right">New calc</th>
                <th className="px-3 py-2 font-semibold">Error</th>
                <th className="px-3 py-2 font-semibold text-right">Azione</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-semibold text-slate-900">{job.id}</td>
                  <td className="px-3 py-2 text-slate-700">{statusPill(job.status)}</td>
                  <td className="px-3 py-2 text-slate-700">{formatDateTime(job.createdAt)}</td>
                  <td className="px-3 py-2 text-slate-700">{formatDateTime(job.updatedAt)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{job.totalRawTickers ?? "-"}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{job.totalProcessed ?? "-"}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{job.dbHits ?? "-"}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{job.newCalculated ?? "-"}</td>
                  <td className="px-3 py-2 text-slate-700">
                    {job.error ? <span className="text-red-600">{job.error}</span> : "-"}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {(job.status === "queued" || job.status === "running") && (
                      <BaseButton
                        variant="outline"
                        color="danger"
                        size="sm"
                        startIcon={<AppIcon icon="mdi:close-circle-outline" />}
                        onClick={async () => {
                          try {
                            await cancelTickerScanJob(job.id);
                            loadJobs();
                          } catch (err: any) {
                            setActionStatus(err?.message || "Errore cancellazione job");
                          }
                        }}
                      >
                        Cancel task
                      </BaseButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Market daily jobs */}
      <SectionHeader title="Market Daily update" subTitle="Processi attivi per l'update dei dati EOD" />
      {marketStatus === "loading" && (
        <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
          Caricamento job...
        </div>
      )}
      {marketJobs.length === 0 && marketStatus !== "loading" && (
        <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
          Nessun job attivo.
        </div>
      )}
      {marketJobs.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 font-semibold">Job ID</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Created</th>
                <th className="px-3 py-2 font-semibold">Updated</th>
                <th className="px-3 py-2 font-semibold text-right">Symbols</th>
                <th className="px-3 py-2 font-semibold text-right">Processed</th>
                <th className="px-3 py-2 font-semibold text-right">Inserted</th>
                <th className="px-3 py-2 font-semibold text-right">Updated</th>
                <th className="px-3 py-2 font-semibold text-right">Errors</th>
                <th className="px-3 py-2 font-semibold text-right">Azione</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {marketJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-semibold text-slate-900">{job.id}</td>
                  <td className="px-3 py-2 text-slate-700">{statusPill(job.status)}</td>
                  <td className="px-3 py-2 text-slate-700">{formatDateTime(job.createdAt)}</td>
                  <td className="px-3 py-2 text-slate-700">{formatDateTime(job.updatedAt)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{job.totalSymbols ?? "-"}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{job.processed ?? "-"}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{job.inserted ?? "-"}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{job.updated ?? "-"}</td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {Array.isArray(job.errors) && job.errors.length > 0 ? job.errors.length : "-"}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {(job.status === "queued" || job.status === "running") && (
                      <BaseButton
                        variant="outline"
                        color="danger"
                        size="sm"
                        startIcon={<AppIcon icon="mdi:close-circle-outline" />}
                        onClick={async () => {
                          try {
                            await cancelMarketDailyJob(job.id);
                            loadMarketJobs();
                          } catch (err: any) {
                            setActionStatus(err?.message || "Errore cancellazione job");
                          }
                        }}
                      >
                        Cancel task
                      </BaseButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* User daily scores jobs */}
      <SectionHeader title="User Daily Scores" subTitle="Processi di calcolo score giornalieri utente" />
      {userDailyStatus === "loading" && (
        <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
          Caricamento job...
        </div>
      )}
      {userDailyJobs.length === 0 && userDailyStatus !== "loading" && (
        <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
          Nessun job attivo.
        </div>
      )}
      {userDailyJobs.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 font-semibold">Job ID</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Date</th>
                <th className="px-3 py-2 font-semibold">Pipe</th>
                <th className="px-3 py-2 font-semibold text-right">Saved</th>
                <th className="px-3 py-2 font-semibold text-right">Total</th>
                <th className="px-3 py-2 font-semibold text-right">Errors</th>
                <th className="px-3 py-2 font-semibold text-right">Azione</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userDailyJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-semibold text-slate-900">{job.id}</td>
                  <td className="px-3 py-2 text-slate-700">{statusPill(job.status)}</td>
                  <td className="px-3 py-2 text-slate-700">{job.date || "-"}</td>
                  <td className="px-3 py-2 text-slate-700">{job.pipeId ?? "-"}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{job.saved ?? "-"}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{job.total ?? "-"}</td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {Array.isArray(job.errors) && job.errors.length > 0 ? job.errors.length : "-"}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {(job.status === "queued" || job.status === "running") && (
                      <BaseButton
                        variant="outline"
                        color="danger"
                        size="sm"
                        startIcon={<AppIcon icon="mdi:close-circle-outline" />}
                        onClick={async () => {
                          try {
                            await cancelUserDailyJob(job.id);
                            loadUserDaily();
                          } catch (err: any) {
                            setActionStatus(err?.message || "Errore cancellazione job");
                          }
                        }}
                      >
                        Cancella processo
                      </BaseButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal per avvio user daily */}
      {showUserDailyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-xl">
            <div className="text-sm font-semibold text-slate-900">Calcola daily scores</div>
            <div className="mt-2 text-xs text-slate-600">Seleziona la data per cui calcolare gli score.</div>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <label className="text-xs font-semibold text-slate-700">Data</label>
              <input
                type="date"
                className="w-full rounded border border-slate-300 px-2 py-1 text-sm"
                value={userDailyDate}
                onChange={(e) => setUserDailyDate(e.target.value)}
              />
              <label className="text-xs font-semibold text-slate-700">Note</label>
              <input
                type="text"
                className="w-full rounded border border-slate-300 px-2 py-1 text-sm"
                value={userDailyNote}
                onChange={(e) => setUserDailyNote(e.target.value)}
              />
              <label className="text-xs font-semibold text-slate-700">Pipe</label>
              <select
                className="w-full rounded border border-slate-300 px-2 py-1 text-sm"
                value={userDailyPipe}
                onChange={(e) => setUserDailyPipe(e.target.value)}
              >
                <option value="">Tutti</option>
                {pipes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name || `Pipe ${p.id}`} {p.enabled === false ? "(disabled)" : ""}
                  </option>
                ))}
              </select>
              <label className="text-xs font-semibold text-slate-700">Versione (x.y)</label>
              <input
                type="text"
                className="w-full rounded border border-slate-300 px-2 py-1 text-sm"
                value={userDailyVersion}
                onChange={(e) => setUserDailyVersion(e.target.value)}
                placeholder="1.0"
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <BaseButton variant="outline" color="neutral" size="sm" onClick={() => setShowUserDailyModal(false)}>
                Cancel
              </BaseButton>
              <BaseButton
                variant="solid"
                color="primary"
                size="sm"
                onClick={async () => {
                  try {
                    const pipeIdNum = userDailyPipe ? Number(userDailyPipe) : undefined;
                    await startUserDailyJob(userDailyDate, pipeIdNum, userDailyVersion, userDailyNote);
                    setShowUserDailyModal(false);
                    setTimeout(loadUserDaily, 500);
                  } catch (err: any) {
                    setActionStatus(err?.message || "Errore avvio daily scores");
                  }
                }}
              >
                Calcola
              </BaseButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
