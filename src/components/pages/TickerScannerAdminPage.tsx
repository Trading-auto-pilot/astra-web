import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchTickerScanJobs,
  fetchMarketDailyJobs,
  cancelMarketDailyJob,
  cancelTickerScanJob,
  fetchUserDailyJobs,
  cancelUserDailyJob,
  startUserDailyJob,
  fetchMarketDailyJobHistory,
  deleteMarketDailyJobHistory,
  fetchUserDailyScoreJobs,
  deleteUserDailyScoreJob,
  startTickerScan,
  startTickerScanForce,
  updateMarketDaily,
  buildDailyRanking,
  fetchDailyRanking,
  type TickerScanJob,
  type TickerScanJobHistory,
  type MarketDailyJob,
  type MarketDailyJobHistory,
  type UserDailyJob,
  type UserDailyScoreJob,
  type UserPipe,
  type RankingDailyRow,
  fetchUserPipes,
  fetchTickerScanJobHistory,
  deleteTickerScanJobHistory,
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

const formatDuration = (ms?: number | null) => {
  if (!ms || ms <= 0 || !Number.isFinite(ms)) return "-";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
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
  const [scanTab, setScanTab] = useState<"current" | "ended">("current");
  const [endedScanJobs, setEndedScanJobs] = useState<TickerScanJobHistory[]>([]);
  const [endedScanStatus, setEndedScanStatus] = useState<Status>("idle");
  const [scanDetailJob, setScanDetailJob] = useState<TickerScanJobHistory | null>(null);
  const [scanDeleteJob, setScanDeleteJob] = useState<TickerScanJobHistory | null>(null);
  const [actionStatus, setActionStatus] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [marketJobs, setMarketJobs] = useState<MarketDailyJob[]>([]);
  const [marketStatus, setMarketStatus] = useState<Status>("idle");
  const [marketTab, setMarketTab] = useState<"current" | "ended">("current");
  const [endedMarketJobs, setEndedMarketJobs] = useState<MarketDailyJobHistory[]>([]);
  const [endedMarketStatus, setEndedMarketStatus] = useState<Status>("idle");
  const [marketDetailJob, setMarketDetailJob] = useState<MarketDailyJobHistory | null>(null);
  const [marketDeleteJob, setMarketDeleteJob] = useState<MarketDailyJobHistory | null>(null);
  const [userDailyJobs, setUserDailyJobs] = useState<UserDailyJob[]>([]);
  const [userDailyStatus, setUserDailyStatus] = useState<Status>("idle");
  const [userDailyTab, setUserDailyTab] = useState<"current" | "ended">("current");
  const [endedUserDailyJobs, setEndedUserDailyJobs] = useState<UserDailyScoreJob[]>([]);
  const [endedUserDailyStatus, setEndedUserDailyStatus] = useState<Status>("idle");
  const [detailJob, setDetailJob] = useState<UserDailyScoreJob | null>(null);
  const [deleteJob, setDeleteJob] = useState<UserDailyScoreJob | null>(null);
  const [showUserDailyModal, setShowUserDailyModal] = useState(false);
  const [userDailyDate, setUserDailyDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [userDailyNote, setUserDailyNote] = useState<string>("Manual update");
  const [userDailyPipe, setUserDailyPipe] = useState<string>("");
  const [pipes, setPipes] = useState<UserPipe[]>([]);
  const [userDailyVersion, setUserDailyVersion] = useState<string>("1.0");

  // Market Daily state
  const [showMarketDailyModal, setShowMarketDailyModal] = useState(false);
  const [marketDailyDate, setMarketDailyDate] = useState<string>(() => new Date().toISOString().slice(0, 10));

  // Ranking Daily state
  const [showRankingModal, setShowRankingModal] = useState(false);
  const [rankingDate, setRankingDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [rankingMode, setRankingMode] = useState<"normal" | "force">("normal");
  const [rankingViewDate, setRankingViewDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [rankingRows, setRankingRows] = useState<RankingDailyRow[]>([]);
  const [rankingStatus, setRankingStatus] = useState<Status>("idle");

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

  const loadEndedScanJobs = useCallback(async () => {
    setEndedScanStatus("loading");
    try {
      const items = await fetchTickerScanJobHistory(20);
      setEndedScanJobs(items);
      setEndedScanStatus("idle");
    } catch {
      setEndedScanStatus("error");
    }
  }, []);

  useEffect(() => {
    loadJobs();
    const interval = setInterval(loadJobs, 15000);
    return () => clearInterval(interval);
  }, [loadJobs]);

  useEffect(() => {
    loadEndedScanJobs();
    const interval = setInterval(loadEndedScanJobs, 15000);
    return () => clearInterval(interval);
  }, [loadEndedScanJobs, scanTab]);

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

  const loadEndedMarketJobs = useCallback(async () => {
    setEndedMarketStatus("loading");
    try {
      const jobs = await fetchMarketDailyJobHistory(20);
      setEndedMarketJobs(jobs);
      setEndedMarketStatus("idle");
    } catch (err) {
      setEndedMarketStatus("error");
    }
  }, []);

  useEffect(() => {
    if (marketTab !== "ended") return;
    loadEndedMarketJobs();
    const interval = setInterval(loadEndedMarketJobs, 15000);
    return () => clearInterval(interval);
  }, [loadEndedMarketJobs, marketTab]);

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

  const loadEndedUserDaily = useCallback(async () => {
    setEndedUserDailyStatus("loading");
    try {
      const jobs = await fetchUserDailyScoreJobs(20);
      setEndedUserDailyJobs(jobs);
      setEndedUserDailyStatus("idle");
    } catch (err) {
      setEndedUserDailyStatus("error");
    }
  }, []);

  useEffect(() => {
    if (userDailyTab !== "ended") return;
    loadEndedUserDaily();
    const interval = setInterval(loadEndedUserDaily, 15000);
    return () => clearInterval(interval);
  }, [loadEndedUserDaily, userDailyTab]);

  const loadRanking = useCallback(async (date: string) => {
    setRankingStatus("loading");
    try {
      const rows = await fetchDailyRanking(date);
      setRankingRows(rows);
      setRankingStatus("idle");
    } catch {
      setRankingStatus("error");
    }
  }, []);

  useEffect(() => {
    fetchUserPipes()
      .then((list) => setPipes(list))
      .catch(() => setPipes([]));
  }, []);

  const rows = useMemo(() => jobs, [jobs]);

  const handleAction = useCallback(
    async (action: "scan" | "scanForce") => {
      setActionLoading(action);
      setActionStatus(null);
      try {
        if (action === "scan") await startTickerScan();
        if (action === "scanForce") await startTickerScanForce();
        setActionStatus("OK");
        setTimeout(loadJobs, 500);
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
              onClick={() => setShowMarketDailyModal(true)}
              disabled={actionLoading !== null}
            >
              Update Market Daily
            </BaseButton>
            <BaseButton
              variant="outline"
              color="primary"
              size="sm"
              startIcon={<AppIcon icon="mdi:podium-gold" />}
              onClick={() => setShowRankingModal(true)}
              disabled={actionLoading !== null}
            >
              Ranking
            </BaseButton>
          </div>
        }
      />

      {actionStatus && (
        <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm">
          Azione: {actionStatus}
        </div>
      )}

      <div className="flex items-center gap-2 border-b border-slate-200">
        {[
          { key: "current" as const, label: "In esecuzione" },
          { key: "ended" as const, label: "Storico" },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`px-3 py-2 text-[11px] font-semibold ${
              scanTab === tab.key ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
            }`}
            onClick={() => setScanTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {scanTab === "current" && (
        <>
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
                    <th className="px-3 py-2 font-semibold">Progress</th>
                    <th className="px-3 py-2 font-semibold text-right">Azione</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((job) => {
                    const total = Number(job.totalRawTickers || 0);
                    const processed = Number(job.totalProcessed || 0);
                    const progress = total > 0 ? Math.min(100, Math.round((processed / total) * 100)) : 0;
                    const startedAt = job.createdAt;
                    const elapsedMs = startedAt ? Date.now() - new Date(startedAt).getTime() : null;
                    const etaMs =
                      elapsedMs && processed > 0 && total > processed
                        ? (elapsedMs / processed) * (total - processed)
                        : null;

                    return (
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
                      <td className="px-3 py-2">
                        <div className="flex min-w-[140px] flex-col gap-1">
                          <div className="h-2 w-full rounded-full bg-slate-100">
                            <div
                              className="h-2 rounded-full bg-emerald-500 transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span>{progress}%</span>
                            <span>ETA {formatDuration(etaMs)}</span>
                          </div>
                        </div>
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {scanTab === "ended" && (
        <div className="rounded-lg border border-slate-200 bg-white/70 shadow-sm">
          <div className="flex items-center justify-between px-3 py-2">
            <div>
              <div className="text-xs font-semibold text-slate-700">Storico processi</div>
              <div className="text-[11px] text-slate-500">Ultimi job completati o falliti</div>
            </div>
            <BaseButton
              variant="outline"
              color="neutral"
              size="sm"
              startIcon={<AppIcon icon="mdi:refresh" />}
              onClick={loadEndedScanJobs}
              disabled={endedScanStatus === "loading"}
            >
              Aggiorna
            </BaseButton>
          </div>
          {endedScanStatus === "error" && (
            <div className="mx-3 mb-2 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] text-amber-700">
              Errore nel recupero dei job
            </div>
          )}
          <div className="overflow-x-auto">
            <div className="max-h-72 overflow-y-auto">
              <table className="min-w-full table-fixed divide-y divide-slate-200 text-[11px] text-slate-700">
                <colgroup>
                  <col style={{ width: "7rem" }} />
                  <col style={{ width: "6rem" }} />
                  <col style={{ width: "5rem" }} />
                  <col style={{ width: "5rem" }} />
                  <col style={{ width: "5rem" }} />
                  <col style={{ width: "5rem" }} />
                  <col style={{ width: "7rem" }} />
                  <col style={{ width: "7rem" }} />
                  <col style={{ width: "6rem" }} />
                </colgroup>
                <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Date</th>
                    <th className="px-3 py-2 font-semibold">Status</th>
                    <th className="px-3 py-2 font-semibold text-right">Total</th>
                    <th className="px-3 py-2 font-semibold text-right">Processed</th>
                    <th className="px-3 py-2 font-semibold text-right">DB Hits</th>
                    <th className="px-3 py-2 font-semibold text-right">New</th>
                    <th className="px-3 py-2 font-semibold">Started</th>
                    <th className="px-3 py-2 font-semibold">Finished</th>
                    <th className="px-3 py-2 font-semibold text-right">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {endedScanStatus === "loading" && (
                    <tr>
                      <td className="px-3 py-3 text-[11px] text-slate-500" colSpan={9}>
                        Caricamento...
                      </td>
                    </tr>
                  )}
                  {endedScanStatus !== "loading" && endedScanJobs.length === 0 && (
                    <tr>
                      <td className="px-3 py-3 text-[11px] text-slate-500" colSpan={9}>
                        Nessun job disponibile
                      </td>
                    </tr>
                  )}
                  {endedScanJobs.map((job) => (
                    <tr key={job.id ?? job.job_id} className="hover:bg-slate-50">
                      <td className="px-3 py-2">{formatDateTime(job.created_at)}</td>
                      <td className="px-3 py-2">{statusPill(job.status)}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{job.total_raw_tickers ?? "-"}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{job.total_processed ?? "-"}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{job.db_hits ?? "-"}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{job.new_calculated ?? "-"}</td>
                      <td className="px-3 py-2">{formatDateTime(job.started_at)}</td>
                      <td className="px-3 py-2">{formatDateTime(job.finished_at)}</td>
                      <td className="px-3 py-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            className="rounded-full p-1 text-slate-600 hover:bg-slate-100"
                            onClick={() => setScanDetailJob(job)}
                            aria-label="Dettagli job"
                          >
                            <AppIcon icon="mdi:eye-outline" />
                          </button>
                          <button
                            type="button"
                            className="rounded-full p-1 text-red-600 hover:bg-red-50"
                            onClick={() => setScanDeleteJob(job)}
                            aria-label="Elimina job"
                          >
                            <AppIcon icon="mdi:delete-outline" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Market daily jobs */}
      <SectionHeader title="Market Daily update" subTitle="Processi attivi per l'update dei dati EOD" />
      <div className="flex items-center gap-2 border-b border-slate-200">
        {[
          { key: "current" as const, label: "In esecuzione" },
          { key: "ended" as const, label: "Storico" },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`px-3 py-2 text-[11px] font-semibold ${
              marketTab === tab.key ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
            }`}
            onClick={() => setMarketTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {marketTab === "current" && (
        <>
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
                    <th className="px-3 py-2 font-semibold">Progress</th>
                    <th className="px-3 py-2 font-semibold text-right">Azione</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {marketJobs.map((job) => {
                    const total = Number(job.totalSymbols || 0);
                    const processed = Number(job.processed || 0);
                    const progress = total > 0 ? Math.min(100, Math.round((processed / total) * 100)) : 0;
                    const startedAt = job.startedAt || job.createdAt;
                    const elapsedMs = startedAt ? Date.now() - new Date(startedAt).getTime() : null;
                    const etaMs =
                      elapsedMs && processed > 0 && total > processed
                        ? (elapsedMs / processed) * (total - processed)
                        : null;

                    return (
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
                      <td className="px-3 py-2">
                        <div className="flex min-w-[140px] flex-col gap-1">
                          <div className="h-2 w-full rounded-full bg-slate-100">
                            <div
                              className="h-2 rounded-full bg-emerald-500 transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span>{progress}%</span>
                            <span>ETA {formatDuration(etaMs)}</span>
                          </div>
                        </div>
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
                  )})}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {marketTab === "ended" && (
        <div className="rounded-lg border border-slate-200 bg-white/70 shadow-sm">
          <div className="flex items-center justify-between px-3 py-2">
            <div>
              <div className="text-xs font-semibold text-slate-700">Storico processi</div>
              <div className="text-[11px] text-slate-500">Ultimi job completati o falliti</div>
            </div>
            <BaseButton
              variant="outline"
              color="neutral"
              size="sm"
              startIcon={<AppIcon icon="mdi:refresh" />}
              onClick={loadEndedMarketJobs}
              disabled={endedMarketStatus === "loading"}
            >
              Aggiorna
            </BaseButton>
          </div>
          {endedMarketStatus === "error" && (
            <div className="mx-3 mb-2 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] text-amber-700">
              Errore nel recupero dei job
            </div>
          )}
          <div className="overflow-x-auto">
            <div className="max-h-72 overflow-y-auto">
              <table className="min-w-full table-fixed divide-y divide-slate-200 text-[11px] text-slate-700">
                <colgroup>
                  <col style={{ width: "7rem" }} />
                  <col style={{ width: "6rem" }} />
                  <col style={{ width: "6rem" }} />
                  <col style={{ width: "6rem" }} />
                  <col style={{ width: "6rem" }} />
                  <col style={{ width: "6rem" }} />
                  <col style={{ width: "6rem" }} />
                  <col style={{ width: "8rem" }} />
                  <col style={{ width: "8rem" }} />
                  <col style={{ width: "6rem" }} />
                </colgroup>
                <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Date</th>
                    <th className="px-3 py-2 font-semibold">Status</th>
                    <th className="px-3 py-2 font-semibold text-right">Symbols</th>
                    <th className="px-3 py-2 font-semibold text-right">Processed</th>
                    <th className="px-3 py-2 font-semibold text-right">Inserted</th>
                    <th className="px-3 py-2 font-semibold text-right">Updated</th>
                    <th className="px-3 py-2 font-semibold text-right">Errors</th>
                    <th className="px-3 py-2 font-semibold">Started</th>
                    <th className="px-3 py-2 font-semibold">Finished</th>
                    <th className="px-3 py-2 font-semibold text-right">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {endedMarketStatus === "loading" && (
                    <tr>
                      <td className="px-3 py-3 text-[11px] text-slate-500" colSpan={10}>
                        Caricamento...
                      </td>
                    </tr>
                  )}
                  {endedMarketStatus !== "loading" && endedMarketJobs.length === 0 && (
                    <tr>
                      <td className="px-3 py-3 text-[11px] text-slate-500" colSpan={10}>
                        Nessun job disponibile
                      </td>
                    </tr>
                  )}
                  {endedMarketJobs.map((job) => (
                    <tr key={job.id ?? job.job_id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 text-slate-700">{formatDateTime(job.created_at)}</td>
                      <td className="px-3 py-2 text-slate-700">{statusPill(job.status)}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{job.total_symbols ?? "-"}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{job.processed ?? "-"}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{job.inserted ?? "-"}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{job.updated ?? "-"}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{job.error_count ?? "-"}</td>
                      <td className="px-3 py-2 text-slate-700">{formatDateTime(job.started_at)}</td>
                      <td className="px-3 py-2 text-slate-700">{formatDateTime(job.finished_at)}</td>
                      <td className="px-3 py-2 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            className="rounded border border-slate-200 p-1 text-slate-600 hover:bg-slate-100"
                            title="Dettagli"
                            onClick={() => setMarketDetailJob(job)}
                          >
                            <AppIcon icon="mdi:eye-outline" />
                          </button>
                          <button
                            type="button"
                            className="rounded border border-rose-200 p-1 text-rose-600 hover:bg-rose-50"
                            title="Elimina"
                            onClick={() => setMarketDeleteJob(job)}
                          >
                            <AppIcon icon="mdi:trash-can-outline" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* User daily scores jobs */}
      <SectionHeader title="User Daily Scores" subTitle="Processi di calcolo score giornalieri utente" />
      <div className="flex items-center gap-2 border-b border-slate-200">
        {[
          { key: "current" as const, label: "In esecuzione" },
          { key: "ended" as const, label: "Storico" },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`px-3 py-2 text-[11px] font-semibold ${
              userDailyTab === tab.key ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
            }`}
            onClick={() => setUserDailyTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {userDailyTab === "current" && (
        <>
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
                <th className="px-3 py-2 font-semibold">Progress</th>
                <th className="px-3 py-2 font-semibold text-right">Azione</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userDailyJobs.map((job) => {
                const total = Number(job.total || 0);
                const processed = Number(job.saved ?? job.processed ?? 0);
                const progress = total > 0 ? Math.min(100, Math.round((processed / total) * 100)) : 0;
                const startedAt = job.startedAt || job.createdAt;
                const elapsedMs = startedAt ? Date.now() - new Date(startedAt).getTime() : null;
                const etaMs =
                  elapsedMs && processed > 0 && total > processed
                    ? (elapsedMs / processed) * (total - processed)
                    : null;

                return (
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
                  <td className="px-3 py-2">
                    <div className="flex min-w-[140px] flex-col gap-1">
                      <div className="h-2 w-full rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-emerald-500 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>{progress}%</span>
                        <span>ETA {formatDuration(etaMs)}</span>
                      </div>
                    </div>
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}
        </>
      )}

      {userDailyTab === "ended" && (
        <div className="rounded-lg border border-slate-200 bg-white/70 shadow-sm">
          <div className="flex items-center justify-between px-3 py-2">
            <div>
              <div className="text-xs font-semibold text-slate-700">Storico processi</div>
              <div className="text-[11px] text-slate-500">Ultimi job completati o falliti</div>
            </div>
            <BaseButton
              variant="outline"
              color="neutral"
              size="sm"
              startIcon={<AppIcon icon="mdi:refresh" />}
              onClick={loadEndedUserDaily}
              disabled={endedUserDailyStatus === "loading"}
            >
              Aggiorna
            </BaseButton>
          </div>
          {endedUserDailyStatus === "error" && (
            <div className="mx-3 mb-2 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] text-amber-700">
              Errore nel recupero dei job
            </div>
          )}
          <div className="overflow-x-auto">
            <div className="max-h-72 overflow-y-auto">
              <table className="min-w-full table-fixed divide-y divide-slate-200 text-[11px] text-slate-700">
                <colgroup>
                  <col style={{ width: "7rem" }} />
                  <col style={{ width: "6rem" }} />
                  <col style={{ width: "7rem" }} />
                  <col style={{ width: "4rem" }} />
                  <col style={{ width: "5rem" }} />
                  <col style={{ width: "5rem" }} />
                  <col style={{ width: "5rem" }} />
                  <col style={{ width: "8rem" }} />
                  <col style={{ width: "8rem" }} />
                  <col style={{ width: "6rem" }} />
                  <col style={{ width: "4.5rem" }} />
                </colgroup>
                <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Date</th>
                    <th className="px-3 py-2 font-semibold">Status</th>
                    <th className="px-3 py-2 font-semibold">Pipe</th>
                    <th className="px-3 py-2 font-semibold text-right">Saved</th>
                    <th className="px-3 py-2 font-semibold text-right">Total</th>
                    <th className="px-3 py-2 font-semibold text-right">Errors</th>
                    <th className="px-3 py-2 font-semibold">Started</th>
                    <th className="px-3 py-2 font-semibold">Finished</th>
                    <th className="px-3 py-2 font-semibold">Model</th>
                    <th className="px-3 py-2 font-semibold text-right">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {endedUserDailyStatus === "loading" && (
                    <tr>
                      <td className="px-3 py-3 text-[11px] text-slate-500" colSpan={12}>
                        Caricamento...
                      </td>
                    </tr>
                  )}
                  {endedUserDailyStatus !== "loading" && endedUserDailyJobs.length === 0 && (
                    <tr>
                      <td className="px-3 py-3 text-[11px] text-slate-500" colSpan={12}>
                        Nessun job disponibile
                      </td>
                    </tr>
                  )}
                  {endedUserDailyJobs.map((job) => (
                    <tr key={job.id ?? job.job_id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 text-slate-700">{formatDateTime(job.target_date)}</td>
                      <td className="px-3 py-2 text-slate-700">{statusPill(job.status)}</td>
                      <td className="px-3 py-2 text-slate-700">{job.pipe_id ?? "-"}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{job.saved_items ?? "-"}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{job.total_items ?? "-"}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{job.error_count ?? "-"}</td>
                      <td className="px-3 py-2 text-slate-700">{formatDateTime(job.started_at)}</td>
                      <td className="px-3 py-2 text-slate-700">{formatDateTime(job.finished_at)}</td>
                      <td className="px-3 py-2 text-slate-700">{job.model_name ?? "-"}</td>
                      <td className="px-3 py-2 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            className="rounded border border-slate-200 p-1 text-slate-600 hover:bg-slate-100"
                            title="Dettagli"
                            onClick={() => setDetailJob(job)}
                          >
                            <AppIcon icon="mdi:eye-outline" />
                          </button>
                          <button
                            type="button"
                            className="rounded border border-rose-200 p-1 text-rose-600 hover:bg-rose-50"
                            title="Elimina"
                            onClick={() => setDeleteJob(job)}
                          >
                            <AppIcon icon="mdi:trash-can-outline" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Ranking Daily */}
      <SectionHeader title="Ranking Daily" subTitle="Snapshot di ranking giornaliero per bucket (LARGECAP, MIDCAP, SMALLCAP, ETF)" />
      <div className="flex items-center gap-2">
        <input
          type="date"
          className="rounded border border-slate-300 px-2 py-1 text-sm"
          value={rankingViewDate}
          onChange={(e) => setRankingViewDate(e.target.value)}
        />
        <BaseButton
          variant="outline"
          color="neutral"
          size="sm"
          startIcon={<AppIcon icon="mdi:magnify" />}
          onClick={() => loadRanking(rankingViewDate)}
          disabled={rankingStatus === "loading"}
        >
          Carica
        </BaseButton>
      </div>

      {rankingStatus === "loading" && (
        <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
          Caricamento ranking...
        </div>
      )}
      {rankingStatus === "error" && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          Errore nel caricamento del ranking
        </div>
      )}
      {rankingStatus === "idle" && rankingRows.length === 0 && (
        <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
          Nessun dato. Seleziona una data e premi Carica, oppure calcola un ranking con il tasto Ranking.
        </div>
      )}
      {rankingRows.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
            <div className="text-xs font-semibold text-slate-700">
              Ranking {rankingViewDate} — {rankingRows.length} simboli
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="sticky top-0 bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2 font-semibold">Bucket</th>
                  <th className="px-3 py-2 font-semibold text-right">#</th>
                  <th className="px-3 py-2 font-semibold">Symbol</th>
                  <th className="px-3 py-2 font-semibold">Type</th>
                  <th className="px-3 py-2 font-semibold text-right">Score</th>
                  <th className="px-3 py-2 font-semibold text-right">Quality</th>
                  <th className="px-3 py-2 font-semibold text-right">Risk</th>
                  <th className="px-3 py-2 font-semibold text-right">Momentum</th>
                  <th className="px-3 py-2 font-semibold text-right">Price</th>
                  <th className="px-3 py-2 font-semibold text-right">ATR%</th>
                  <th className="px-3 py-2 font-semibold text-right">Vol$20d</th>
                  <th className="px-3 py-2 font-semibold">SMA50</th>
                  <th className="px-3 py-2 font-semibold">SMA200</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rankingRows.map((row) => {
                  const reason = row.reason_json;
                  const sma50ok = reason?.trend?.price_gt_sma50;
                  const sma200ok = reason?.trend?.sma50_gt_sma200;
                  const volM = reason?.dollar_vol_20d != null
                    ? (Number(reason.dollar_vol_20d) / 1_000_000).toFixed(1) + "M"
                    : "-";
                  return (
                    <tr key={row.id ?? `${row.symbol}-${row.bucket}-${row.rank_position}`} className="hover:bg-slate-50">
                      <td className="px-3 py-2 font-semibold text-slate-700">{row.bucket ?? "-"}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-slate-500">{row.rank_position ?? "-"}</td>
                      <td className="px-3 py-2 font-semibold text-slate-900">{row.symbol ?? "-"}</td>
                      <td className="px-3 py-2 text-slate-600">{row.asset_type ?? "-"}</td>
                      <td className="px-3 py-2 text-right tabular-nums font-semibold">{row.rank_score ?? "-"}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{reason?.quality_score ?? "-"}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{reason?.risk_score ?? "-"}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{reason?.momentum_score ?? "-"}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{reason?.price != null ? Number(reason.price).toFixed(2) : "-"}</td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {reason?.atr_14_pct != null ? (Number(reason.atr_14_pct) * 100).toFixed(2) + "%" : "-"}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">{volM}</td>
                      <td className="px-3 py-2 text-center">
                        {sma50ok == null ? "-" : sma50ok
                          ? <span className="text-emerald-600 font-semibold">↑</span>
                          : <span className="text-red-500">↓</span>}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {sma200ok == null ? "-" : sma200ok
                          ? <span className="text-emerald-600 font-semibold">↑</span>
                          : <span className="text-red-500">↓</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal calcolo ranking */}
      {showMarketDailyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-xl">
            <div className="text-sm font-semibold text-slate-900">Update Market Daily</div>
            <div className="mt-2 text-xs text-slate-600">
              Aggiorna i dati EOD di mercato per la data selezionata. Default: oggi.
            </div>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <label className="text-xs font-semibold text-slate-700">Data</label>
              <input
                type="date"
                className="w-full rounded border border-slate-300 px-2 py-1 text-sm"
                value={marketDailyDate}
                onChange={(e) => setMarketDailyDate(e.target.value)}
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <BaseButton variant="outline" color="neutral" size="sm" onClick={() => setShowMarketDailyModal(false)}>
                Annulla
              </BaseButton>
              <BaseButton
                variant="solid"
                color="primary"
                size="sm"
                onClick={async () => {
                  try {
                    await updateMarketDaily(marketDailyDate);
                    setShowMarketDailyModal(false);
                    setTimeout(loadMarketJobs, 500);
                    setActionStatus("Market Daily avviato");
                  } catch (err: any) {
                    setActionStatus(err?.message || "Errore avvio Market Daily");
                  }
                }}
              >
                Avvia
              </BaseButton>
            </div>
          </div>
        </div>
      )}

      {showRankingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-xl">
            <div className="text-sm font-semibold text-slate-900">Calcola Ranking Daily</div>
            <div className="mt-2 text-xs text-slate-600">
              Genera lo snapshot di ranking giornaliero dalla tabella <code>daily_scores</code>.
            </div>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <label className="text-xs font-semibold text-slate-700">Data</label>
              <input
                type="date"
                className="w-full rounded border border-slate-300 px-2 py-1 text-sm"
                value={rankingDate}
                onChange={(e) => setRankingDate(e.target.value)}
              />
              <label className="text-xs font-semibold text-slate-700">Mode</label>
              <select
                className="w-full rounded border border-slate-300 px-2 py-1 text-sm"
                value={rankingMode}
                onChange={(e) => setRankingMode(e.target.value as "normal" | "force")}
              >
                <option value="normal">Normal — salta se già calcolato</option>
                <option value="force">Force — ricalcola anche se esiste</option>
              </select>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <BaseButton variant="outline" color="neutral" size="sm" onClick={() => setShowRankingModal(false)}>
                Annulla
              </BaseButton>
              <BaseButton
                variant="solid"
                color="primary"
                size="sm"
                onClick={async () => {
                  try {
                    await buildDailyRanking(rankingDate, rankingMode);
                    setShowRankingModal(false);
                    setRankingViewDate(rankingDate);
                    setTimeout(() => loadRanking(rankingDate), 600);
                    setActionStatus("Ranking calcolato");
                  } catch (err: any) {
                    setActionStatus(err?.message || "Errore calcolo ranking");
                  }
                }}
              >
                Calcola
              </BaseButton>
            </div>
          </div>
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

      {detailJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900">
                Job {detailJob.job_id ?? detailJob.id ?? "-"}
              </div>
              <button
                className="rounded p-1 text-slate-500 hover:bg-slate-100"
                aria-label="Chiudi"
                onClick={() => setDetailJob(null)}
              >
                ×
              </button>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2 text-[12px] text-slate-700">
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-600">Status</div>
                <div className="mt-1">{statusPill(detailJob.status)}</div>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-600">Date</div>
                <div className="mt-1">{formatDateTime(detailJob.target_date)}</div>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-600">Pipe</div>
                <div className="mt-1">{detailJob.pipe_id ?? "-"}</div>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-600">Model</div>
                <div className="mt-1">{detailJob.model_name ?? "-"}</div>
                <div className="text-[11px] text-slate-500">Version {detailJob.model_version ?? "-"}</div>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-600">Saved</div>
                <div className="mt-1">{detailJob.saved_items ?? "-"}</div>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-600">Total</div>
                <div className="mt-1">{detailJob.total_items ?? "-"}</div>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-600">Errors</div>
                <div className="mt-1">{detailJob.error_count ?? "-"}</div>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-600">Started</div>
                <div className="mt-1">{formatDateTime(detailJob.started_at)}</div>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-600">Finished</div>
                <div className="mt-1">{formatDateTime(detailJob.finished_at)}</div>
              </div>
            </div>
            <div className="mt-3 rounded border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
              <div className="font-semibold text-slate-600">Errors JSON</div>
              <pre className="mt-1 max-h-32 overflow-auto whitespace-pre-wrap">
{JSON.stringify(detailJob.errors_json ?? [], null, 2)}
              </pre>
            </div>
            <div className="mt-3 rounded border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
              <div className="font-semibold text-slate-600">Params JSON</div>
              <pre className="mt-1 max-h-32 overflow-auto whitespace-pre-wrap">
{JSON.stringify(detailJob.params_json ?? {}, null, 2)}
              </pre>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <BaseButton variant="outline" color="neutral" size="sm" onClick={() => setDetailJob(null)}>
                Chiudi
              </BaseButton>
            </div>
          </div>
        </div>
      )}

      {deleteJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-xl">
            <div className="text-sm font-semibold text-slate-900">Elimina record</div>
            <div className="mt-2 text-xs text-slate-600">
              Confermi l&apos;eliminazione del job {deleteJob.job_id ?? deleteJob.id ?? "-"}?
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <BaseButton variant="outline" color="neutral" size="sm" onClick={() => setDeleteJob(null)}>
                Annulla
              </BaseButton>
              <BaseButton
                variant="solid"
                color="danger"
                size="sm"
                onClick={async () => {
                  if (!deleteJob.id) {
                    setActionStatus("ID record mancante");
                    return;
                  }
                  try {
                    await deleteUserDailyScoreJob(deleteJob.id);
                    setEndedUserDailyJobs((prev) => prev.filter((row) => row.id !== deleteJob.id));
                    setDeleteJob(null);
                  } catch (err) {
                    setActionStatus("Errore eliminazione record");
                  }
                }}
              >
                Elimina
              </BaseButton>
            </div>
          </div>
        </div>
      )}

      {scanDetailJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-5 shadow-xl">
            <div className="text-sm font-semibold text-slate-900">
              Job {scanDetailJob.job_id ?? scanDetailJob.id ?? "-"}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-600">Status</div>
                <div className="mt-1">{statusPill(scanDetailJob.status)}</div>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-600">Created</div>
                <div className="mt-1">{formatDateTime(scanDetailJob.created_at)}</div>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-600">Total</div>
                <div className="mt-1">{scanDetailJob.total_raw_tickers ?? "-"}</div>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-600">Processed</div>
                <div className="mt-1">{scanDetailJob.total_processed ?? "-"}</div>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-600">DB Hits</div>
                <div className="mt-1">{scanDetailJob.db_hits ?? "-"}</div>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-600">New calc</div>
                <div className="mt-1">{scanDetailJob.new_calculated ?? "-"}</div>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-600">Started</div>
                <div className="mt-1">{formatDateTime(scanDetailJob.started_at)}</div>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-600">Finished</div>
                <div className="mt-1">{formatDateTime(scanDetailJob.finished_at)}</div>
              </div>
            </div>
            <div className="mt-3 rounded border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
              <div className="font-semibold text-slate-600">Errors JSON</div>
              <pre className="mt-1 max-h-32 overflow-auto whitespace-pre-wrap">
{JSON.stringify(scanDetailJob.errors_json ?? [], null, 2)}
              </pre>
            </div>
            <div className="mt-3 rounded border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
              <div className="font-semibold text-slate-600">Params JSON</div>
              <pre className="mt-1 max-h-32 overflow-auto whitespace-pre-wrap">
{JSON.stringify(scanDetailJob.params_json ?? {}, null, 2)}
              </pre>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <BaseButton variant="outline" color="neutral" size="sm" onClick={() => setScanDetailJob(null)}>
                Chiudi
              </BaseButton>
            </div>
          </div>
        </div>
      )}

      {scanDeleteJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-xl">
            <div className="text-sm font-semibold text-slate-900">Elimina record</div>
            <div className="mt-2 text-xs text-slate-600">
              Confermi l&apos;eliminazione del job {scanDeleteJob.job_id ?? scanDeleteJob.id ?? "-"}?
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <BaseButton variant="outline" color="neutral" size="sm" onClick={() => setScanDeleteJob(null)}>
                Annulla
              </BaseButton>
              <BaseButton
                variant="solid"
                color="danger"
                size="sm"
                onClick={async () => {
                  if (!scanDeleteJob.id) {
                    setActionStatus("ID record mancante");
                    return;
                  }
                  try {
                    await deleteTickerScanJobHistory(scanDeleteJob.id);
                    setEndedScanJobs((prev) => prev.filter((row) => row.id !== scanDeleteJob.id));
                    setScanDeleteJob(null);
                  } catch (err) {
                    setActionStatus("Errore eliminazione record");
                  }
                }}
              >
                Elimina
              </BaseButton>
            </div>
          </div>
        </div>
      )}

      {marketDetailJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900">
                Job {marketDetailJob.job_id ?? marketDetailJob.id ?? "-"}
              </div>
              <button
                className="rounded p-1 text-slate-500 hover:bg-slate-100"
                aria-label="Chiudi"
                onClick={() => setMarketDetailJob(null)}
              >
                ×
              </button>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2 text-[12px] text-slate-700">
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-600">Status</div>
                <div className="mt-1">{statusPill(marketDetailJob.status)}</div>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-600">Date</div>
                <div className="mt-1">{formatDateTime(marketDetailJob.created_at)}</div>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-600">Symbols</div>
                <div className="mt-1">{marketDetailJob.total_symbols ?? "-"}</div>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-600">Processed</div>
                <div className="mt-1">{marketDetailJob.processed ?? "-"}</div>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-600">Inserted</div>
                <div className="mt-1">{marketDetailJob.inserted ?? "-"}</div>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-600">Updated</div>
                <div className="mt-1">{marketDetailJob.updated ?? "-"}</div>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-600">Errors</div>
                <div className="mt-1">{marketDetailJob.error_count ?? "-"}</div>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-600">Started</div>
                <div className="mt-1">{formatDateTime(marketDetailJob.started_at)}</div>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-600">Finished</div>
                <div className="mt-1">{formatDateTime(marketDetailJob.finished_at)}</div>
              </div>
            </div>
            <div className="mt-3 rounded border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
              <div className="font-semibold text-slate-600">Errors JSON</div>
              <pre className="mt-1 max-h-32 overflow-auto whitespace-pre-wrap">
{JSON.stringify(marketDetailJob.errors_json ?? [], null, 2)}
              </pre>
            </div>
            <div className="mt-3 rounded border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
              <div className="font-semibold text-slate-600">Params JSON</div>
              <pre className="mt-1 max-h-32 overflow-auto whitespace-pre-wrap">
{JSON.stringify(marketDetailJob.params_json ?? {}, null, 2)}
              </pre>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <BaseButton variant="outline" color="neutral" size="sm" onClick={() => setMarketDetailJob(null)}>
                Chiudi
              </BaseButton>
            </div>
          </div>
        </div>
      )}

      {marketDeleteJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-xl">
            <div className="text-sm font-semibold text-slate-900">Elimina record</div>
            <div className="mt-2 text-xs text-slate-600">
              Confermi l&apos;eliminazione del job {marketDeleteJob.job_id ?? marketDeleteJob.id ?? "-"}?
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <BaseButton variant="outline" color="neutral" size="sm" onClick={() => setMarketDeleteJob(null)}>
                Annulla
              </BaseButton>
              <BaseButton
                variant="solid"
                color="danger"
                size="sm"
                onClick={async () => {
                  if (!marketDeleteJob.id) {
                    setActionStatus("ID record mancante");
                    return;
                  }
                  try {
                    await deleteMarketDailyJobHistory(marketDeleteJob.id);
                    setEndedMarketJobs((prev) => prev.filter((row) => row.id !== marketDeleteJob.id));
                    setMarketDeleteJob(null);
                  } catch (err) {
                    setActionStatus("Errore eliminazione record");
                  }
                }}
              >
                Elimina
              </BaseButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
