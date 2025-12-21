import React, { useCallback, useEffect, useMemo, useState } from "react";
import { fetchServiceFlags, updateServiceFlag, type ServiceFlag } from "../../api/serviceFlags";
import SectionHeader from "../molecules/content/SectionHeader";
import BaseButton from "../atoms/base/buttons/BaseButton";
import AppIcon from "../atoms/icon/AppIcon";
import MicroserviceGeneralTab from "../molecules/microservice/MicroserviceGeneralTab";
import TickerScannerAdminPage from "./TickerScannerAdminPage";
import ReactApexChart from "react-apexcharts";
import { env } from "../../config/env";

type Status = "idle" | "loading" | "error";
type L3Target =
  | { type: "all" }
  | { type: "symbol"; symbol: string }
  | { type: "file"; symbol: string; tf: string };

type ReleaseInfo = {
  version?: string | null;
  lastUpdate?: string | null;
  microservice?: string | null;
  note?: string[] | null;
};

const getSlugFromHash = (): string | null => {
  if (typeof window === "undefined") return null;
  const cleaned = window.location.hash.replace(/^#\/?/, "");
  const parts = cleaned.split("/").filter(Boolean);
  if (parts[0] === "admin" && parts[1] === "microservice" && parts[2]) {
    try {
      return decodeURIComponent(parts[2]);
    } catch {
      return parts[2];
    }
  }
  return null;
};

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

const formatUptime = (value?: number | string) => {
  if (value === undefined || value === null) return "";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (!Number.isFinite(num)) return String(value);
  const totalSeconds = Math.max(0, Math.floor(num));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const parts = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (parts.length === 0) parts.push(`${totalSeconds}s`);
  return parts.join(" ");
};

const formatBytes = (bytes?: number) => {
  if (!bytes || bytes < 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let idx = 0;
  let val = bytes;
  while (val >= 1024 && idx < units.length - 1) {
    val /= 1024;
    idx += 1;
  }
  return `${val.toFixed(val >= 10 ? 0 : 1)} ${units[idx]}`;
};

const progressColor = (percent: number) => {
  if (percent >= 85) return "bg-red-500";
  if (percent >= 75) return "bg-amber-600";
  if (percent >= 65) return "bg-amber-400";
  if (percent >= 50) return "bg-yellow-400";
  return "bg-emerald-500";
};

const getNodeBytes = (node: any): number => {
  if (!node) return 0;
  if (typeof node.size === "number") return node.size;
  if (typeof node.totalBytes === "number") return node.totalBytes;
  if (Array.isArray(node.files)) return node.files.reduce((sum, f) => sum + getNodeBytes(f), 0);
  return 0;
};

type AlertProps = {
  message: string;
  tone?: "error" | "warn" | "success";
  onClose?: () => void;
};

const Alert = ({ message, tone = "error", onClose }: AlertProps) => {
  const palette =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "warn"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-red-200 bg-red-50 text-red-700";
  return (
    <div
      className={`relative rounded-md border ${palette} px-3 py-2 text-xs pr-8`}
    >
      {message}
      {onClose && (
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-1 text-[11px] text-slate-500 hover:bg-slate-100"
          onClick={onClose}
          aria-label="Chiudi"
        >
          ×
        </button>
      )}
    </div>
  );
};

type HealthInfo = {
  status?: string;
  uptime?: number | string;
  [key: string]: any;
};

export default function AdminMicroserviceDetailPage() {
  const [rows, setRows] = useState<ServiceFlag[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [release, setRelease] = useState<ReleaseInfo | null>(null);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [health, setHealth] = useState<HealthInfo | null>(null);
  const [microserviceName, setMicroserviceName] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "specific" | "cache" | "l2">("general");
  const [candleSymbol, setCandleSymbol] = useState("");
  const [candleStart, setCandleStart] = useState("");
  const [candleEnd, setCandleEnd] = useState("");
  const [candleTf, setCandleTf] = useState("1d");
  const [candleStatus, setCandleStatus] = useState<Status>("idle");
  const [candleError, setCandleError] = useState<string | null>(null);
  const [candleRows, setCandleRows] = useState<any[]>([]);
  const [candleTab, setCandleTab] = useState<"table" | "chart">("table");
  const [provider, setProvider] = useState<"FMP" | "ALPACA" | "">("");
  const [providerStatus, setProviderStatus] = useState<Status>("idle");
  const [providerError, setProviderError] = useState<string | null>(null);
  const [l3Size, setL3Size] = useState<any>(null);
  const [l3Status, setL3Status] = useState<Status>("idle");
  const [l3Error, setL3Error] = useState<string | null>(null);
  const [showL3Confirm, setShowL3Confirm] = useState(false);
  const [l3DeleteTarget, setL3DeleteTarget] = useState<L3Target | null>(null);
  const [l3Expanded, setL3Expanded] = useState<Record<string, boolean>>({});
  const [l2Size, setL2Size] = useState<any>(null);
  const [l2Status, setL2Status] = useState<Status>("idle");
  const [l2Error, setL2Error] = useState<string | null>(null);
  const [l2Expanded, setL2Expanded] = useState<Record<string, boolean>>({});
  const [l2Letter, setL2Letter] = useState<string | null>(null);
  const [l2Search, setL2Search] = useState<string>("");
  const [showL2Confirm, setShowL2Confirm] = useState(false);
  const [l2DeleteTarget, setL2DeleteTarget] = useState<L3Target | null>(null);

  const slug = useMemo(() => getSlugFromHash(), []);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const items = await fetchServiceFlags();
      setRows(items);
      setStatus("idle");
    } catch (err: any) {
      setError(err?.message || "Errore durante il caricamento");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!slug) return;
    setMicroserviceName(slug.toLowerCase());
    setActiveTab("general");
  }, [slug]);

  const filtered = useMemo(() => {
    if (!slug) return [];
    return rows.filter((row) => row.microservice?.toLowerCase() === slug.toLowerCase());
  }, [rows, slug]);

  const toggleEnabled = useCallback(
    async (row: ServiceFlag) => {
      const nextEnabled = !Boolean(row.enabled);
      setUpdateError(null);
      setUpdatingId(row.id);

      const prevRows = rows;
      setRows((current) =>
        current.map((item) => (item.id === row.id ? { ...item, enabled: nextEnabled } : item))
      );

      try {
        await updateServiceFlag(row.id, {
          env: row.env,
          microservice: row.microservice,
          enabled: nextEnabled,
          note: row.note ?? null,
        });
      } catch (err: any) {
        setRows(prevRows);
        setUpdateError(err?.message || "Errore durante l'aggiornamento");
      } finally {
        setUpdatingId(null);
      }
    },
    [rows]
  );

  const heading = slug || microserviceName || "Microservice";
  const subtitle = filtered[0]?.note || "";
  const isCachemanager = slug?.toLowerCase() === "cachemanager";
  const isScheduler = slug?.toLowerCase() === "scheduler";
  const isTickerScanner = slug?.toLowerCase() === "tickerscanner";
  const releaseTitle = release?.microservice || heading;
  const healthStatus = health?.status ? `Status: ${health.status}` : "";
  const healthUptime = health?.uptime !== undefined ? `Uptime: ${formatUptime(health.uptime)}` : "";
  const healthMeta =
    healthStatus || healthUptime ? [healthStatus, healthUptime].filter(Boolean).join(" · ") : "";
  const releaseMetaParts = [];
  if (release?.version) releaseMetaParts.push(`v${release.version}`);
  if (release?.lastUpdate) releaseMetaParts.push(release.lastUpdate);
  if (healthMeta) releaseMetaParts.push(healthMeta);
  const releaseMeta = releaseMetaParts.join(" · ");

  // load provider on cachemanager tab
  useEffect(() => {
    if (!isCachemanager) return;
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    setProviderStatus("loading");
    fetch(`${env.apiBaseUrl}/cachemanager/provider`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data?.ok === false) throw new Error(data?.error || data?.message || "Errore provider");
        const p = (data?.provider || "").toUpperCase();
        if (p === "FMP" || p === "ALPACA") setProvider(p);
        setProviderStatus("idle");
      })
      .catch((err) => {
        setProviderStatus("error");
        setProviderError(err?.message || "Errore nel recupero provider");
      });
  }, [isCachemanager]);

  // reset tab to general when microservice changes
  useEffect(() => {
    setActiveTab("general");
  }, [microserviceName]);

  // load L3 size on landing (cachemanager only)
  useEffect(() => {
    if (!isCachemanager) return;
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    setL3Status("loading");
    fetch(`${env.apiBaseUrl}/cachemanager/status/L3/size`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data?.ok === false) throw new Error(data?.error || data?.message || "Errore L3 size");
        setL3Size(data.data || data);
        setL3Status("idle");
      })
      .catch((err) => {
        setL3Status("error");
        setL3Error(err?.message || "Errore nel recupero L3 size");
      });
  }, [isCachemanager]);

  // load L2 size when the tab is opened (only cachemanager)
  useEffect(() => {
    if (!isCachemanager || activeTab !== "l2") return;
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    setL2Status("loading");
    fetch(`${env.apiBaseUrl}/cachemanager/status/L2/size`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data?.ok === false) throw new Error(data?.error || data?.message || "Errore L2 size");
        setL2Size(data.data || data);
        setL2Status("idle");
      })
      .catch((err) => {
        setL2Status("error");
        setL2Error(err?.message || "Errore nel recupero L2 size");
      });
  }, [activeTab, isCachemanager]);

  // mantiene la lettera selezionata coerente con le entry disponibili
  useEffect(() => {
    const rawEntries = Array.isArray(l2Size?.tree?.files) ? l2Size.tree.files : [];
    const entries = rawEntries.filter((e: any) => {
      const p = String(e?.path || "").toLowerCase();
      return p && !p.endsWith(".ds_store");
    });
    const letters = Array.from(
      new Set(
        entries
          .map((e: any) => {
            const name =
              typeof e?.path === "string" ? e.path.split(/[/\\]/).filter(Boolean).pop() || e.path : "";
            return name ? name[0]?.toUpperCase() : "";
          })
          .filter(Boolean)
      )
    ).sort();
    if (!letters.length) {
      setL2Letter(null);
      return;
    }
    if (!l2Letter || !letters.includes(l2Letter)) {
      setL2Letter(letters[0]);
    }
  }, [l2Size, l2Letter]);

  return (
    <div className="space-y-4">
      <SectionHeader
        title={
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900">{releaseTitle}</span>
            {releaseMeta ? <span className="text-[11px] text-slate-500">{releaseMeta}</span> : null}
          </div>
        }
        subTitle={subtitle}
        actionComponent={
          <div className="flex gap-2">
            <BaseButton
              variant="outline"
              color="neutral"
              size="sm"
              startIcon={<AppIcon icon="mdi:chevron-left" />}
              onClick={() => {
                window.location.hash = "#/admin/microservice";
              }}
            >
              Back
            </BaseButton>
          </div>
        }
      />

      {status === "error" && error && (
        <Alert message={error} tone="error" onClose={() => setError(null)} />
      )}

      {updateError && (
        <Alert message={updateError} tone="warn" onClose={() => setUpdateError(null)} />
      )}

      {!slug && (
        <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
          Microservizio non specificato.
        </div>
      )}

      {slug && status === "loading" && filtered.length === 0 && (
        <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
          Caricamento...
        </div>
      )}

      {slug && filtered.length === 0 && status !== "loading" && (
        <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
          Nessun flag trovato per {slug}.
        </div>
      )}

      {filtered.length > 0 && !isCachemanager && !isScheduler && !isTickerScanner && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 font-semibold">Env</th>
                <th className="px-3 py-2 font-semibold">Enabled</th>
                <th className="px-3 py-2 font-semibold">Note</th>
                <th className="px-3 py-2 font-semibold">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-semibold text-slate-900">{row.env}</td>
                  <td className="px-3 py-2">
                    <label className="inline-flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={!!row.enabled}
                        disabled={updatingId === row.id}
                        onChange={() => toggleEnabled(row)}
                      />
                      <span
                        className={`relative inline-flex h-5 w-9 items-center rounded-full border transition ${
                          row.enabled ? "border-emerald-300 bg-emerald-500" : "border-slate-300 bg-slate-200"
                        } ${updatingId === row.id ? "opacity-70" : ""}`}
                      >
                        <span
                          className={`h-4 w-4 rounded-full bg-white shadow transition ${
                            row.enabled ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </span>
                      <span className="text-[11px] font-semibold text-slate-700">
                        {row.enabled ? "On" : "Off"}
                      </span>
                    </label>
                  </td>
                  <td className="px-3 py-2 text-slate-700">{row.note || "-"}</td>
                  <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{formatDateTime(row.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length > 0 && (isCachemanager || isScheduler || isTickerScanner) && (
        <div className="flex items-center gap-2 border-b border-slate-200">
          <button
            className={`px-3 py-2 text-[11px] font-semibold ${
              activeTab === "general" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
            }`}
            onClick={() => setActiveTab("general")}
          >
            General settings
          </button>
          {isCachemanager && (
            <button
              className={`px-3 py-2 text-[11px] font-semibold ${
                activeTab === "specific" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
              }`}
              onClick={() => setActiveTab("specific")}
            >
              Candles
            </button>
          )}
          {isCachemanager && (
            <button
              className={`px-3 py-2 text-[11px] font-semibold ${
                activeTab === "cache" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
              }`}
              onClick={() => setActiveTab("cache")}
            >
              L3 Cache (REDIS)
            </button>
          )}
          {isCachemanager && (
            <button
              className={`px-3 py-2 text-[11px] font-semibold ${
                activeTab === "l2" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
              }`}
              onClick={() => setActiveTab("l2")}
            >
              L2 Cache (File system)
            </button>
          )}
          {isTickerScanner && (
            <button
              className={`px-3 py-2 text-[11px] font-semibold ${
                activeTab === "specific" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
              }`}
              onClick={() => setActiveTab("specific")}
            >
              Specific settings
            </button>
          )}
        </div>
      )}

      {filtered.length > 0 && activeTab === "general" && (
        <MicroserviceGeneralTab
          microservice={microserviceName || slug || ""}
          onReleaseChange={setRelease}
          onHealthChange={setHealth}
          onOpenReleaseModal={() => setShowReleaseModal(true)}
        />
      )}

      {filtered.length > 0 && activeTab === "specific" && isCachemanager && (
        <div className="rounded-lg border border-slate-200 bg-white/70 px-3 py-3 text-[11px] text-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-700">Candles</div>
              <div className="mt-1 text-[11px] text-slate-600">
                Strumenti dedicati al microservizio cachemanager.
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-3">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-800">Get candle</div>
                <div className="text-[11px] text-slate-500">Recupera candele dal provider selezionato.</div>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-700">
                <span className="font-semibold">Provider</span>
                <label className="inline-flex items-center gap-1">
                  <input
                    type="radio"
                    name="provider"
                    value="FMP"
                    checked={provider === "FMP"}
                    onChange={async () => {
                      setProviderError(null);
                      setProviderStatus("loading");
                      try {
                        const token =
                          typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
                        const res = await fetch(`${env.apiBaseUrl}/cachemanager/provider/FMP`, {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                            ...(token ? { Authorization: `Bearer ${token}` } : {}),
                          },
                        });
                        const data = await res.json().catch(() => ({}));
                        if (!res.ok || data?.ok === false)
                          throw new Error(data?.error || data?.message || "Errore set provider");
                        setProvider("FMP");
                        setProviderStatus("idle");
                      } catch (err: any) {
                        setProviderStatus("error");
                        setProviderError(err?.message || "Errore cambio provider");
                      }
                    }}
                    className="h-3 w-3"
                  />
                  <span>FMP</span>
                </label>
                <label className="inline-flex items-center gap-1">
                  <input
                    type="radio"
                    name="provider"
                    value="ALPACA"
                    checked={provider === "ALPACA"}
                    onChange={async () => {
                      setProviderError(null);
                      setProviderStatus("loading");
                      try {
                        const token =
                          typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
                        const res = await fetch(`${env.apiBaseUrl}/cachemanager/provider/ALPACA`, {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                            ...(token ? { Authorization: `Bearer ${token}` } : {}),
                          },
                        });
                        const data = await res.json().catch(() => ({}));
                        if (!res.ok || data?.ok === false)
                          throw new Error(data?.error || data?.message || "Errore set provider");
                        setProvider("ALPACA");
                        setProviderStatus("idle");
                      } catch (err: any) {
                        setProviderStatus("error");
                        setProviderError(err?.message || "Errore cambio provider");
                      }
                    }}
                    className="h-3 w-3"
                  />
                  <span>Alpaca</span>
                </label>
                {providerStatus === "loading" && <span className="text-slate-500">Aggiornamento...</span>}
              </div>
            </div>
            {providerError && <div className="mb-2 text-[11px] text-red-600">{providerError}</div>}
            <form
              className="grid gap-3 md:grid-cols-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setCandleStatus("loading");
                setCandleError(null);
                setCandleRows([]);
                const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
                const base = `${env.apiBaseUrl}/cachemanager/candles`;
                const params = new URLSearchParams();
                if (candleSymbol) params.set("symbol", candleSymbol);
                if (candleStart) params.set("startDate", candleStart);
                if (candleEnd) params.set("endDate", candleEnd);
                if (candleTf) params.set("tf", candleTf);
                try {
                  const res = await fetch(`${base}?${params.toString()}`, {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                  });
                  const data = await res.json().catch(() => ({}));
                  if (!res.ok) {
                    throw new Error(data?.error || data?.message || "Errore richiesta");
                  }
                  const rows = Array.isArray(data) ? data : data?.data || data?.candles || [];
                  setCandleRows(Array.isArray(rows) ? rows : []);
                  setCandleStatus("idle");
                } catch (err: any) {
                  setCandleError(err?.message || "Errore nel recupero candele");
                  setCandleStatus("error");
                }
              }}
            >
              <div>
                <label className="text-[11px] font-semibold text-slate-700">Symbol</label>
                <input
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                  value={candleSymbol}
                  onChange={(e) => setCandleSymbol(e.target.value)}
                  placeholder="AAPL"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-700">Start date</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                  value={candleStart}
                  onChange={(e) => setCandleStart(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-700">End date</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                  value={candleEnd}
                  onChange={(e) => setCandleEnd(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-700">TF</label>
                <select
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                  value={candleTf}
                  onChange={(e) => setCandleTf(e.target.value)}
                >
                  {["1m", "5m", "15m", "30m", "1h", "2h", "6h", "12h", "1d", "1w", "1M"].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-4 flex justify-end">
                <BaseButton
                  type="submit"
                  variant="solid"
                  color="primary"
                  size="sm"
                  startIcon={<AppIcon icon="mdi:candle" />}
                  disabled={candleStatus === "loading"}
                >
                  Get candle
                </BaseButton>
              </div>
            </form>
            {candleError && <div className="mt-2 text-[11px] text-red-600">{candleError}</div>}
            {candleStatus === "loading" && <div className="mt-2 text-[11px] text-slate-500">Caricamento...</div>}
            {candleRows.length > 0 && (
              <div className="mt-3">
                <div className="mb-2 flex items-center gap-2 text-[11px]">
                  <button
                    className={`rounded-md px-3 py-1 text-xs font-semibold ${
                      candleTab === "table"
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                    onClick={() => setCandleTab("table")}
                  >
                    Table
                  </button>
                  <button
                    className={`rounded-md px-3 py-1 text-xs font-semibold ${
                      candleTab === "chart"
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                    onClick={() => setCandleTab("chart")}
                  >
                    Chart
                  </button>
                </div>
                {candleTab === "table" && (
                  <div className="overflow-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-xs">
                      <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="px-3 py-2 font-semibold">Time</th>
                          <th className="px-3 py-2 font-semibold">Open</th>
                          <th className="px-3 py-2 font-semibold">High</th>
                          <th className="px-3 py-2 font-semibold">Low</th>
                          <th className="px-3 py-2 font-semibold">Close</th>
                          <th className="px-3 py-2 font-semibold">Volume</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {candleRows.map((candle, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="px-3 py-2 text-slate-800">
                              {candle.t || candle.time || candle.date || "-"}
                            </td>
                            <td className="px-3 py-2 text-slate-800">{candle.o ?? candle.open ?? "-"}</td>
                            <td className="px-3 py-2 text-slate-800">{candle.h ?? candle.high ?? "-"}</td>
                            <td className="px-3 py-2 text-slate-800">{candle.l ?? candle.low ?? "-"}</td>
                            <td className="px-3 py-2 text-slate-800">{candle.c ?? candle.close ?? "-"}</td>
                            <td className="px-3 py-2 text-slate-800">{candle.v ?? candle.volume ?? "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {candleTab === "chart" && (
                  <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 p-2">
                    {candleRows.length > 0 ? (
                      <ReactApexChart
                        type="candlestick"
                        height={360}
                        options={{
                          chart: { toolbar: { show: false } },
                          xaxis: {
                            type: "datetime",
                            labels: { style: { fontSize: "10px" } },
                          },
                          yaxis: [
                            {
                              tooltip: { enabled: true },
                              labels: { style: { fontSize: "10px" } },
                            },
                            {
                              opposite: true,
                              seriesName: "Volume",
                              labels: { style: { fontSize: "10px" } },
                              show: true,
                            },
                          ],
                          tooltip: { shared: true },
                          plotOptions: {
                            candlestick: {
                              colors: { upward: "#10b981", downward: "#ef4444" },
                            },
                          },
                        }}
                        series={[
                          {
                            name: "Candle",
                            type: "candlestick",
                            data: candleRows.map((c) => ({
                              x: new Date(c.t || c.time || c.date || "").getTime(),
                              y: [
                                Number(c.o ?? c.open ?? 0),
                                Number(c.h ?? c.high ?? 0),
                                Number(c.l ?? c.low ?? 0),
                                Number(c.c ?? c.close ?? 0),
                              ],
                            })),
                          },
                          {
                            name: "Volume",
                            type: "column",
                            data: candleRows.map((c) => ({
                              x: new Date(c.t || c.time || c.date || "").getTime(),
                              y: Number(c.v ?? c.volume ?? 0),
                            })),
                          },
                        ]}
                      />
                    ) : (
                      <div className="text-[11px] text-slate-600">Nessun dato da mostrare.</div>
                    )}
                  </div>
                )}
              </div>
            )}
            {candleStatus === "idle" && candleRows.length === 0 && !candleError && (
              <div className="mt-2 text-[11px] text-slate-500">Nessun risultato.</div>
            )}
          </div>
        </div>
      )}

      {filtered.length > 0 && activeTab === "specific" && isTickerScanner && (
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-[11px] text-slate-700">
          <TickerScannerAdminPage />
        </div>
      )}

      {filtered.length > 0 && activeTab === "cache" && isCachemanager && (
        <div className="rounded-lg border border-slate-200 bg-white/70 px-3 py-3 text-[11px] text-slate-700">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-semibold text-slate-700">L3 Cache (Redis)</div>
            <div className="flex items-center gap-2">
              <BaseButton
                variant="outline"
                color="neutral"
                size="sm"
                startIcon={<AppIcon icon="mdi:refresh" />}
                onClick={() => {
                  const token =
                    typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
                  setL3Status("loading");
                  fetch(`${env.apiBaseUrl}/cachemanager/status/L3/size`, {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                  })
                    .then(async (res) => {
                      const data = await res.json().catch(() => ({}));
                      if (!res.ok || data?.ok === false)
                        throw new Error(data?.error || data?.message || "Errore L3 size");
                      setL3Size(data.data || data);
                      setL3Status("idle");
                    })
                    .catch((err) => {
                      setL3Status("error");
                      setL3Error(err?.message || "Errore nel recupero L3 size");
                    });
                }}
              >
                Reload
              </BaseButton>
              <BaseButton
                variant="solid"
                color="danger"
                size="sm"
                onClick={() => {
                  setL3DeleteTarget({ type: "all" });
                  setShowL3Confirm(true);
                }}
              >
                Svuota cache
              </BaseButton>
            </div>
          </div>
          {l3Status === "error" && l3Error && (
            <div className="mt-1 text-[11px] text-red-600">{l3Error}</div>
          )}
          {l3Status === "loading" && <div className="mt-1 text-[11px] text-slate-500">Caricamento...</div>}
          {l3Size && l3Status !== "loading" && (
            <div className="mt-3 space-y-3">
              {(() => {
                const total = Number(l3Size.totalBytes || 0);
                const max = Number(l3Size.maxmemory || 0);
                const pct = max > 0 ? Math.min(100, (total / max) * 100) : 0;
                let color = "bg-emerald-500";
                if (pct >= 85) color = "bg-red-500";
                else if (pct >= 75) color = "bg-amber-500";
                else if (pct >= 50) color = "bg-yellow-500";
                return (
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-700">
                      <span>Utilizzo: {total.toLocaleString()} bytes</span>
                      <span>Max: {max ? max.toLocaleString() : "-"} bytes</span>
                    </div>
                    {max ? (
                      <div className="mt-1 h-3 w-full overflow-hidden rounded bg-slate-200">
                        <div className={`h-3 ${color}`} style={{ width: `${pct}%` }} />
                      </div>
                    ) : (
                      <div className="mt-1 text-[11px] text-slate-500">Max memory non disponibile</div>
                    )}
                  </div>
                );
              })()}

              <div className="rounded-lg border border-slate-200 bg-white">
                <div className="border-b border-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
                  Keys (raggruppate per symbol)
                </div>
                <div className="max-h-64 overflow-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-xs">
                    <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-3 py-2 font-semibold">Symbol</th>
                        <th className="px-3 py-2 font-semibold">Bytes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(() => {
                        const groups: Record<string, { total: number; items: any[] }> = {};
                        (l3Size.keys || []).forEach((k: any) => {
                          const parts = String(k.key || "").split(":");
                          const symbol = parts[1] || k.key || "unknown";
                          if (!groups[symbol]) groups[symbol] = { total: 0, items: [] };
                          groups[symbol].total += Number(k.bytes || 0);
                          groups[symbol].items.push(k);
                        });
                        const totalBytes = Number(l3Size.totalBytes || 0) || 1;
                        const symbols = Object.entries(groups);
                        if (!symbols.length) {
                          return (
                            <tr>
                              <td colSpan={2} className="px-3 py-2 text-slate-600">
                                Nessuna chiave trovata.
                              </td>
                            </tr>
                          );
                        }
                        return symbols.map(([symbol, info]) => {
                          const pct = Math.min(100, (info.total / totalBytes) * 100);
                          const expanded = !!l3Expanded[symbol];
                          return (
                            <React.Fragment key={symbol}>
                              <tr className="hover:bg-slate-50">
                                <td
                                  className="px-3 py-2 text-slate-800 cursor-pointer"
                                  onClick={() =>
                                    setL3Expanded((prev) => ({ ...prev, [symbol]: !prev[symbol] }))
                                  }
                                >
                                  <span className="mr-2 text-[10px] text-slate-500">
                                    {expanded ? "▼" : "▶"}
                                  </span>
                                  {symbol}
                                </td>
                                <td className="px-3 py-2 text-slate-800">
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-24 rounded bg-slate-200">
                                      <div className="h-2 rounded bg-blue-500" style={{ width: `${pct}%` }} />
                                    </div>
                                    <span>{info.total.toLocaleString()} B</span>
                                    <button
                                      type="button"
                                      className="ml-auto text-red-600 hover:text-red-700"
                                      title="Svuota simbolo"
                                      onClick={() => {
                                        setL3DeleteTarget({ type: "symbol", symbol });
                                        setShowL3Confirm(true);
                                      }}
                                    >
                                      <AppIcon icon="mdi:trash-can-outline" width={16} height={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              {expanded &&
                                info.items.map((k, idx) => {
                                  const subPct = Math.min(100, (Number(k.bytes || 0) / info.total) * 100);
                                  return (
                                    <tr key={`${symbol}-${idx}`} className="bg-slate-50">
                                      <td className="px-6 py-1 text-slate-700 break-all text-[11px]">{k.key}</td>
                                      <td className="px-3 py-1 text-slate-700">
                                        <div className="flex items-center gap-2">
                                          <div className="h-2 w-16 rounded bg-slate-200">
                                            <div className="h-2 rounded bg-emerald-500" style={{ width: `${subPct}%` }} />
                                          </div>
                                          <span>{Number(k.bytes || 0).toLocaleString()} B</span>
                                          <button
                                            type="button"
                                            className="ml-auto text-red-600 hover:text-red-700"
                                          title="Cancella file"
                                          onClick={() => {
                                            const parts = String(k.key || "").split(":");
                                            const sym = parts[1] || symbol;
                                            const tfPart = parts[2] || "";
                                            setL3DeleteTarget({ type: "file", symbol: sym, tf: tfPart });
                                            setShowL3Confirm(true);
                                          }}
                                        >
                                            <AppIcon icon="mdi:trash-can-outline" width={14} height={14} />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                            </React.Fragment>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {filtered.length > 0 && activeTab === "l2" && isCachemanager && (
        <div className="rounded-lg border border-slate-200 bg-white/70 px-3 py-3 text-[11px] text-slate-700">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-700">L2 Cache (File system)</div>
              {l2Size?.totalBytes !== undefined && (
                <div className="text-[11px] text-slate-500">
                  {(() => {
                    const symbols = Array.isArray(l2Size?.tree?.files)
                      ? l2Size.tree.files.filter(
                          (e: any) => !String(e?.path || "").toLowerCase().endsWith(".ds_store")
                        ).length
                      : 0;
                    const files = l2Size.fileCount ?? l2Size?.tree?.fileCount ?? 0;
                    const dirs = l2Size.dirCount ?? l2Size?.tree?.dirCount ?? symbols;
                    return (
                      <>
                        Total: {formatBytes(l2Size.totalBytes)} · File: {files} · Symbol: {symbols} · Dir: {dirs}
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
            {l2Status === "loading" && <span className="text-[11px] text-slate-500">Caricamento...</span>}
            <div className="ml-auto flex items-center gap-2">
              <BaseButton
                variant="outline"
                color="neutral"
                size="sm"
                startIcon={<AppIcon icon="mdi:refresh" />}
                onClick={() => {
                  const token =
                    typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
                  setL2Status("loading");
                  fetch(`${env.apiBaseUrl}/cachemanager/status/L2/size`, {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                  })
                    .then(async (res) => {
                      const data = await res.json().catch(() => ({}));
                      if (!res.ok || data?.ok === false)
                        throw new Error(data?.error || data?.message || "Errore L2 size");
                      setL2Size(data.data || data);
                      setL2Status("idle");
                    })
                    .catch((err) => {
                      setL2Status("error");
                      setL2Error(err?.message || "Errore nel recupero L2 size");
                    });
                }}
              >
                Reload
              </BaseButton>
              <BaseButton
                variant="outline"
                color="danger"
                size="sm"
                startIcon={<AppIcon icon="mdi:delete" />}
                onClick={() => {
                  setL2DeleteTarget({ type: "all" });
                  setShowL2Confirm(true);
                }}
              >
                Svuota cache
              </BaseButton>
            </div>
          </div>
          {(() => {
            const total = Number(l2Size?.totalBytes || 0);
            const maxMb = Number((l2Size?.maxSizeCache ?? l2Size?.maxSizecache ?? l2Size?.maxsizecache) || 0);
            const maxBytes = Number.isFinite(maxMb) && maxMb > 0 ? maxMb * 1024 * 1024 : 0;
            if (!maxBytes) return null;
            const pct = Math.min(100, (total / maxBytes) * 100);
            let color = "bg-emerald-500";
            if (pct >= 85) color = "bg-red-500";
            else if (pct >= 75) color = "bg-amber-500";
            else if (pct >= 50) color = "bg-yellow-500";
            return (
              <div className="mb-2 rounded-md border border-slate-200 bg-white px-3 py-2">
                <div className="flex items-center justify-between text-[11px] text-slate-700">
                  <span>Utilizzo: {formatBytes(total)}</span>
                  <span>Max: {maxBytes ? formatBytes(maxBytes) : "-"}</span>
                </div>
                <div className="mt-1 h-3 w-full overflow-hidden rounded bg-slate-200">
                  <div className={`h-3 ${color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })()}
          {l2Error && (
            <div className="mb-2">
              <Alert message={l2Error} tone="warn" onClose={() => setL2Error(null)} />
            </div>
          )}
          {!l2Error && l2Size && l2Size.exists === false && (
            <div className="text-[11px] text-slate-500">Directory cache non trovata.</div>
          )}
          {!l2Error && l2Size && l2Size.exists !== false && (
            <div className="rounded-md border border-slate-200 bg-white">
              {(() => {
                const rawEntries = Array.isArray(l2Size?.tree?.files) ? l2Size.tree.files : [];
                const entries = rawEntries
                  .filter((e: any) => {
                    const p = String(e?.path || "").toLowerCase();
                    return p && !p.endsWith(".ds_store");
                  })
                  .map((entry: any, idx: number) => {
                    const name =
                      typeof entry?.path === "string"
                        ? entry.path.split(/[/\\]/).filter(Boolean).pop() || entry.path
                        : `item-${idx}`;
                    return { name, data: entry };
                  })
                  .sort((a, b) => a.name.localeCompare(b.name));

                const letters = Array.from(
                  new Set(entries.map((e) => (e.name[0] ? e.name[0].toUpperCase() : "")).filter(Boolean))
                ).sort();
                const useFilter = entries.length > 20;
                const activeLetter =
                  letters.length === 0
                    ? null
                    : l2Letter && letters.includes(l2Letter)
                      ? l2Letter
                      : useFilter
                        ? letters[0] || null
                        : null;

                const normalizedSearch = (l2Search || "").trim().toUpperCase();
                const filtered =
                  useFilter && activeLetter
                    ? entries.filter(
                        (e) =>
                          e.name.toUpperCase().startsWith(activeLetter) &&
                          (!normalizedSearch || e.name.toUpperCase().includes(normalizedSearch))
                      )
                    : entries.filter((e) => !normalizedSearch || e.name.toUpperCase().includes(normalizedSearch));

                const totalFromRoot = typeof l2Size?.totalBytes === "number" ? l2Size.totalBytes : 0;
                const sumChildren =
                  totalFromRoot > 0
                    ? totalFromRoot
                    : entries.reduce((sum: number, e: any) => sum + getNodeBytes(e.data), 0);

                return (
                  <>
                    {entries.length > 20 && (
                      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-3 py-2 text-[11px]">
                        <div className="flex flex-wrap gap-1">
                          {letters.map((ltr) => (
                            <button
                              key={ltr}
                              type="button"
                              className={`rounded px-2 py-1 font-semibold ${
                                ltr === activeLetter
                                  ? "bg-slate-900 text-white"
                                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                              }`}
                              onClick={() => setL2Letter(ltr)}
                            >
                              {ltr}
                            </button>
                          ))}
                        </div>
                        <div className="ml-auto flex items-center gap-1">
                          <input
                            type="text"
                            list="l2-symbols"
                            placeholder="Cerca symbol"
                            className="w-40 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                            value={l2Search}
                            onChange={(e) => setL2Search(e.target.value)}
                          />
                          <datalist id="l2-symbols">
                            {entries.map((e) => (
                              <option key={e.name} value={e.name} />
                            ))}
                          </datalist>
                        </div>
                      </div>
                    )}
                    <table className="min-w-full text-[11px] text-slate-700">
                      <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="px-3 py-2 font-semibold">Path</th>
                          <th className="px-3 py-2 font-semibold w-48">Size</th>
                          <th className="px-3 py-2 font-semibold text-right w-24">Bytes</th>
                          <th className="px-2 py-2 font-semibold text-right w-12"> </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filtered.map(({ name, data }, idx: number) => {
                          const total = sumChildren || 0;
                          const entryBytes = getNodeBytes(data);
                          const pct = total > 0 ? (entryBytes / total) * 100 : 0;
                          const expanded = !!l2Expanded[name];
                          const children = Array.isArray(data?.files)
                            ? data.files.filter(
                                (c: any) => !String(c?.path || "").toLowerCase().endsWith(".ds_store")
                              )
                            : [];
                          return (
                            <React.Fragment key={`${name}-${idx}`}>
                              <tr
                                className="hover:bg-slate-50 cursor-pointer"
                                onClick={() =>
                                  setL2Expanded((prev) => ({
                                    ...prev,
                                    [name]: !expanded,
                                  }))
                                }
                              >
                                <td className="px-3 py-2 font-semibold text-slate-800">{name}</td>
                                <td className="px-3 py-2">
                                  <div className="flex items-center gap-2">
                                    <div className="relative h-2 w-full rounded-full bg-slate-100">
                                      <div
                                        className={`absolute left-0 top-0 h-2 rounded-full ${progressColor(pct)}`}
                                        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                                      />
                                    </div>
                                    <span className="whitespace-nowrap text-[11px] text-slate-600">
                                      {pct.toFixed(1)}%
                                    </span>
                                  </div>
                                </td>
                                <td className="px-3 py-2 text-right whitespace-nowrap">{formatBytes(entryBytes)}</td>
                                <td className="px-2 py-2 text-right">
                                  <button
                                    type="button"
                                    className="rounded-full p-1 text-red-500 hover:bg-red-50"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setL2DeleteTarget({ type: "symbol", symbol: name });
                                      setShowL2Confirm(true);
                                    }}
                                    aria-label={`Cancella ${name}`}
                                  >
                                    <AppIcon icon="mdi:trash-can-outline" width={16} height={16} />
                                  </button>
                                </td>
                              </tr>
                              {expanded &&
                                children.map((child: any, cIdx: number) => {
                                  const childName =
                                    typeof child?.path === "string"
                                      ? child.path.split(/[/\\]/).filter(Boolean).pop() || child.path
                                      : `child-${cIdx}`;
                                  const childBytes = getNodeBytes(child);
                                  const pctChild = entryBytes > 0 ? (childBytes / entryBytes) * 100 : 0;
                                  return (
                                    <tr key={`${name}-${childName}`} className="bg-slate-50">
                                      <td className="px-6 py-1 text-slate-700">{childName}</td>
                                      <td className="px-3 py-1">
                                        <div className="flex items-center gap-2">
                                          <div className="relative h-2 w-full rounded-full bg-slate-100">
                                            <div
                                              className={`absolute left-0 top-0 h-2 rounded-full ${progressColor(pctChild)}`}
                                              style={{ width: `${Math.min(100, Math.max(0, pctChild))}%` }}
                                            />
                                          </div>
                                          <span className="whitespace-nowrap text-[11px] text-slate-600">
                                            {pctChild.toFixed(1)}%
                                          </span>
                                        </div>
                                      </td>
                                      <td className="px-3 py-1 text-right whitespace-nowrap">
                                        {formatBytes(childBytes)}
                                      </td>
                                      <td className="px-2 py-1 text-right">
                                        <button
                                          type="button"
                                          className="rounded-full p-1 text-red-500 hover:bg-red-50"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setL2DeleteTarget({ type: "file", symbol: name, tf: childName });
                                            setShowL2Confirm(true);
                                          }}
                                          aria-label={`Cancella ${childName}`}
                                        >
                                          <AppIcon icon="mdi:trash-can-outline" width={14} height={14} />
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                            </React.Fragment>
                          );
                        })}
                        {filtered.length === 0 && (
                          <tr>
                            <td className="px-3 py-2 text-slate-500" colSpan={3}>
                              Nessun file presente nella cache.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {showReleaseModal && release && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <div className="text-base font-semibold text-slate-900">{release.microservice || heading}</div>
                <div className="text-[11px] text-slate-500">
                  {release.version ? `v${release.version}` : "versione non disponibile"}
                  {release.lastUpdate ? ` · ${release.lastUpdate}` : ""}
                </div>
              </div>
              <button
                type="button"
                className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => setShowReleaseModal(false)}
              >
                Chiudi
              </button>
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
              <table className="w-full text-left">
                <tbody>
                  <tr>
                    <td className="pr-2 font-semibold text-slate-600">Versione</td>
                    <td className="text-slate-800">{release.version ?? "-"}</td>
                  </tr>
                  <tr>
                    <td className="pr-2 font-semibold text-slate-600">Last update</td>
                    <td className="text-slate-800">{release.lastUpdate ?? "-"}</td>
                  </tr>
                  <tr>
                    <td className="pr-2 font-semibold text-slate-600 align-top">Note</td>
                    <td className="text-slate-800">
                      {Array.isArray(release.note) && release.note.length ? (
                        <ul className="list-disc pl-4 space-y-1">
                          {release.note.map((n, idx) => (
                            <li key={idx}>{n}</li>
                          ))}
                        </ul>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showL3Confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <div className="mb-3 text-base font-semibold text-slate-900">Conferma cancellazione cache</div>
            <div className="text-sm text-slate-700">
              {l3DeleteTarget?.type === "all" && "Questa operazione cancellerà tutti i dati dalla cache L3 (Redis)."}
              {l3DeleteTarget?.type === "symbol" &&
                `Verranno cancellati tutti i dati del symbol ${l3DeleteTarget.symbol || "(sconosciuto)"}.`}
              {l3DeleteTarget?.type === "file" &&
                `Verranno cancellati i dati del symbol ${l3DeleteTarget.symbol || "(sconosciuto)"} per ${
                  l3DeleteTarget.tf || "(tf)"
                }.`}
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <BaseButton
                variant="outline"
                color="neutral"
                size="sm"
                onClick={() => setShowL3Confirm(false)}
              >
                Cancella
              </BaseButton>
              <BaseButton
                variant="solid"
                color="danger"
                size="sm"
                onClick={async () => {
                  const token =
                    typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
                  try {
                    let url = `${env.apiBaseUrl}/cachemanager/status/L3/size`;
                    if (l3DeleteTarget?.type === "symbol" && l3DeleteTarget.symbol) {
                      url = `${url}/${encodeURIComponent(l3DeleteTarget.symbol)}`;
                    } else if (l3DeleteTarget?.type === "file" && l3DeleteTarget.symbol) {
                      url = `${url}/${encodeURIComponent(l3DeleteTarget.symbol)}/${encodeURIComponent(
                        l3DeleteTarget.tf || ""
                      )}`;
                    }

                    const res = await fetch(url, {
                      method: "DELETE",
                      headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                      },
                    });
                    const data = await res.json().catch(() => ({}));
                    if (!res.ok || data?.ok === false) throw new Error(data?.error || data?.message || "Errore DELETE");
                    setShowL3Confirm(false);
                    setL3DeleteTarget(null);
                    // refresh size
                    setL3Status("loading");
                    const resSize = await fetch(`${env.apiBaseUrl}/cachemanager/status/L3/size`, {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                      },
                    });
                    const sizeData = await resSize.json().catch(() => ({}));
                    if (resSize.ok && sizeData?.data) setL3Size(sizeData.data);
                    setL3Status("idle");
                  } catch (err: any) {
                    setL3Status("error");
                    setL3Error(err?.message || "Errore nello svuotare la cache");
                    setShowL3Confirm(false);
                    setL3DeleteTarget(null);
                  }
                }}
              >
                OK
              </BaseButton>
            </div>
          </div>
        </div>
      )}

      {showL2Confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <div className="mb-3 text-base font-semibold text-slate-900">Conferma cancellazione cache L2</div>
            <div className="text-sm text-slate-700">
              {l2DeleteTarget?.type === "all" && "Questa operazione cancellerà tutti i file nella cache L2."}
              {l2DeleteTarget?.type === "symbol" &&
                `Verranno cancellati tutti i dati del symbol ${l2DeleteTarget.symbol || "(sconosciuto)"}.`}
              {l2DeleteTarget?.type === "file" &&
                `Verranno cancellati i dati del symbol ${l2DeleteTarget.symbol || "(sconosciuto)"} per ${
                  l2DeleteTarget.tf || "(file)"
                }.`}
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <BaseButton variant="outline" color="neutral" size="sm" onClick={() => setShowL2Confirm(false)}>
                Cancella
              </BaseButton>
              <BaseButton
                variant="solid"
                color="danger"
                size="sm"
                onClick={async () => {
                  const token =
                    typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
                  try {
                    let url = `${env.apiBaseUrl}/cachemanager/status/L2/size`;
                    if (l2DeleteTarget?.type === "symbol" && l2DeleteTarget.symbol) {
                      url = `${url}/${encodeURIComponent(l2DeleteTarget.symbol)}`;
                    } else if (l2DeleteTarget?.type === "file" && l2DeleteTarget.symbol) {
                      url = `${url}/${encodeURIComponent(l2DeleteTarget.symbol)}/${encodeURIComponent(
                        l2DeleteTarget.tf || ""
                      )}`;
                    }

                    const res = await fetch(url, {
                      method: "DELETE",
                      headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                      },
                    });
                    const data = await res.json().catch(() => ({}));
                    if (!res.ok || data?.ok === false) throw new Error(data?.error || data?.message || "Errore DELETE");
                    setShowL2Confirm(false);
                    setL2DeleteTarget(null);
                    // refresh L2 size
                    setL2Status("loading");
                    const resSize = await fetch(`${env.apiBaseUrl}/cachemanager/status/L2/size`, {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                      },
                    });
                    const sizeData = await resSize.json().catch(() => ({}));
                    if (resSize.ok && sizeData?.data) setL2Size(sizeData.data);
                    setL2Status("idle");
                  } catch (err: any) {
                    setL2Status("error");
                    setL2Error(err?.message || "Errore nello svuotare la cache L2");
                    setShowL2Confirm(false);
                    setL2DeleteTarget(null);
                  }
                }}
              >
                OK
              </BaseButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
