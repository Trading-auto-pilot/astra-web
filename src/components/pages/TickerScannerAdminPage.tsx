import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchTickerScanJobs,
  refreshTickerMomentum,
  startTickerScan,
  startTickerScanForce,
  type TickerScanJob,
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

  const rows = useMemo(() => jobs, [jobs]);

  const handleAction = useCallback(
    async (action: "scan" | "scanForce" | "refreshMomentum") => {
      setActionLoading(action);
      setActionStatus(null);
      try {
        if (action === "scan") await startTickerScan();
        if (action === "scanForce") await startTickerScanForce();
        if (action === "refreshMomentum") await refreshTickerMomentum();
        setActionStatus("OK");
        // reload jobs shortly after triggering actions
        setTimeout(loadJobs, 500);
      } catch (err: any) {
        setActionStatus(err?.message || "Errore");
      } finally {
        setActionLoading(null);
      }
    },
    [loadJobs]
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
              startIcon={<AppIcon icon="mdi:lightning-bolt-outline" />}
              onClick={() => handleAction("refreshMomentum")}
              disabled={actionLoading !== null}
            >
              Refresh momentum
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
