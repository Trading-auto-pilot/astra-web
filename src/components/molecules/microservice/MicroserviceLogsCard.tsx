import { useEffect, useMemo, useState } from "react";
import BaseButton from "../../atoms/base/buttons/BaseButton";
import AppIcon from "../../atoms/icon/AppIcon";
import { env } from "../../../config/env";

type LogRow = {
  id?: number | string;
  timestamp?: string;
  level?: string;
  microservice?: string;
  module?: string;
  moduleName?: string;
  functionName?: string;
  message?: string;
  meta?: any;
  [key: string]: any;
};

type Props = {
  microservice?: string | null;
  limit?: number;
};

const getToken = () => {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem("astraai:auth:token");
};

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("it-IT", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const levelColor: Record<string, string> = {
  trace: "text-fuchsia-700 bg-fuchsia-50 border-fuchsia-200", // magenta
  debug: "text-fuchsia-700 bg-fuchsia-50 border-fuchsia-200",
  log: "text-cyan-700 bg-cyan-50 border-cyan-200", // cyan
  info: "text-emerald-700 bg-emerald-50 border-emerald-200", // green
  warning: "text-amber-700 bg-amber-50 border-amber-200", // yellow
  error: "text-red-700 bg-red-50 border-red-200", // red
};

export default function MicroserviceLogsCard({ microservice, limit = 15 }: Props) {
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [pageSize, setPageSize] = useState<number>(limit || 15);
  const [onlyThisService, setOnlyThisService] = useState(false);

  const token = useMemo(() => getToken(), []);

  const fetchLogs = async (pageIndex = 0, sizeArg?: number) => {
    setLoading(true);
    setError(null);
    try {
      const size = Number.isFinite(sizeArg) && sizeArg ? sizeArg : pageSize || 15;
      const safeSize = Math.max(1, Math.min(size, 1000));
      const params = new URLSearchParams();
      if (safeSize) params.set("limit", String(safeSize));
      const offset = pageIndex * safeSize;
      if (offset > 0) params.set("offset", String(offset));
      const msParam = microservice ? String(microservice).trim() : "";
      if (onlyThisService && msParam) params.set("microservice", msParam);
      const url = `${env.apiBaseUrl}/cachemanager/Log${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Errore nel recupero log");
      }
      const items = Array.isArray(data)
        ? data
        : Array.isArray(data?.logs)
          ? data.logs
          : Array.isArray(data?.items)
            ? data.items
            : [];
      setRows(items);
      const metaPage =
        typeof data?.page === "number"
          ? data.page
          : typeof data?.offset === "number"
            ? Math.floor(data.offset / safeSize)
            : pageIndex;
      setPage(metaPage);
      const metaHasMore =
        typeof data?.count === "number"
          ? data.count >= safeSize
          : items.length >= safeSize;
      setHasMore(metaHasMore);
    } catch (e: any) {
      setError(e?.message || "Errore nel recupero log");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(0, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microservice, pageSize, onlyThisService]);

  const applyPageSize = (value: number) => {
    const next = Number.isFinite(value) && value > 0 ? Math.min(Math.floor(value), 1000) : 15;
    setPageSize(next);
    fetchLogs(0, next);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white/70 shadow-sm">
      <div className="flex items-center justify-between px-3 py-2">
        <div>
          <div className="text-xs font-semibold text-slate-700">Logs</div>
          <div className="text-[11px] text-slate-500">
            {microservice ? `Microservice: ${microservice}` : "Ultimi log"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 text-[11px] text-slate-600">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={onlyThisService}
              onChange={(e) => setOnlyThisService(e.target.checked)}
              disabled={loading}
            />
            <span
              className={`relative inline-flex h-5 w-9 items-center rounded-full border transition ${
                onlyThisService ? "border-emerald-300 bg-emerald-500" : "border-slate-300 bg-slate-200"
              } ${loading ? "opacity-70" : ""}`}
            >
              <span
                className={`h-4 w-4 rounded-full bg-white shadow transition ${
                  onlyThisService ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </span>
            <span className="text-[11px] font-semibold text-slate-700">Mostra solo questo servizio</span>
          </label>
          <BaseButton
            variant="outline"
            color="neutral"
            size="sm"
            startIcon={<AppIcon icon="mdi:refresh" />}
            onClick={() => fetchLogs(page, pageSize)}
            disabled={loading}
          >
            Aggiorna
          </BaseButton>
        </div>
      </div>
      {error && (
        <div className="mx-3 mb-2 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] text-amber-700">
          {error}
        </div>
      )}
      <div className="overflow-x-auto">
        <div className="max-h-64 overflow-y-auto">
          <table className="min-w-full table-fixed divide-y divide-slate-200 text-[11px] text-slate-700">
            <colgroup>
              <col style={{ width: "5.5rem" }} />
              <col style={{ width: "9rem" }} />
              <col style={{ width: "6rem" }} />
              <col style={{ width: "8rem" }} />
              <col style={{ width: "8rem" }} />
              <col style={{ width: "8rem" }} />
              <col />
            </colgroup>
            <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500 sticky top-0">
              <tr>
                <th className="px-3 py-2 font-semibold">ID</th>
                <th className="px-3 py-2 font-semibold">Time</th>
                <th className="px-3 py-2 font-semibold">Level</th>
                <th className="px-3 py-2 font-semibold">Service</th>
                <th className="px-3 py-2 font-semibold">Module</th>
                <th className="px-3 py-2 font-semibold">Function</th>
                <th className="px-3 py-2 font-semibold">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td className="px-3 py-3 text-[11px] text-slate-500" colSpan={7}>
                    Caricamento...
                  </td>
                </tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td className="px-3 py-3 text-[11px] text-slate-500" colSpan={7}>
                    Nessun log disponibile
                  </td>
                </tr>
              )}
              {!loading &&
                rows.map((row, idx) => {
                  const lvl = String(row.level || "").toLowerCase();
                  const pill = levelColor[lvl] || levelColor.log;
                  const isOwnService =
                    microservice && row.microservice
                      ? String(row.microservice).toLowerCase() === String(microservice).toLowerCase()
                      : true;
                  return (
                    <tr key={row.id || idx} className="hover:bg-slate-50">
                      <td className={`px-3 py-2 whitespace-nowrap ${!isOwnService ? "text-slate-400" : ""}`}>
                        {row.id ?? "-"}
                      </td>
                      <td className={`px-3 py-2 whitespace-nowrap ${!isOwnService ? "text-slate-400" : ""}`}>
                        {formatDateTime(row.timestamp as string)}
                      </td>
                      <td className={`px-3 py-2 ${!isOwnService ? "text-slate-400" : ""}`}>
                        <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${pill}`}>
                          {row.level || "-"}
                        </span>
                      </td>
                      <td className={`px-3 py-2 whitespace-nowrap ${!isOwnService ? "text-slate-400" : ""}`}>
                        {row.microservice || microservice || "-"}
                      </td>
                      <td className={`px-3 py-2 whitespace-nowrap ${!isOwnService ? "text-slate-400" : ""}`}>
                        {row.module || row.moduleName || "-"}
                      </td>
                      <td className={`px-3 py-2 whitespace-nowrap ${!isOwnService ? "text-slate-400" : ""}`}>
                        {row.functionName || "-"}
                      </td>
                      <td className={`px-3 py-2 ${!isOwnService ? "text-slate-400" : ""}`}>
                        <div className="line-clamp-3 whitespace-pre-wrap break-words text-[11px]">
                          {row.message || "-"}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 px-3 py-2 text-[11px] text-slate-600">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-600">Page {page + 1}</span>
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-500">Limit</span>
              <input
                type="number"
                min={1}
                max={1000}
                className="w-16 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-800 focus:border-blue-400 focus:outline-none"
                value={pageSize}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setPageSize(Number.isFinite(val) && val > 0 ? val : 1);
                }}
                onBlur={() => applyPageSize(pageSize)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applyPageSize(pageSize);
                  }
                }}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <BaseButton
              variant="outline"
              color="neutral"
              size="sm"
              disabled={loading || page === 0}
              onClick={() => fetchLogs(Math.max(0, page - 1), pageSize)}
            >
              Prev
            </BaseButton>
            <BaseButton
              variant="outline"
              color="neutral"
              size="sm"
              disabled={loading || !hasMore}
              onClick={() => fetchLogs(page + 1, pageSize)}
            >
              Next
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  );
}
