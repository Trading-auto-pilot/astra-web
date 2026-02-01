import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  if (Array.isArray(node.files)) return node.files.reduce((sum: number, f: any) => sum + getNodeBytes(f), 0);
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

type InfoLabelProps = {
  label: string;
  tip: string;
  required?: boolean;
};

type InfoRowProps = {
  name: string;
  value: React.ReactNode;
  description: string;
};

const InfoLabel = ({ label, tip, required }: InfoLabelProps) => (
  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700">
    <span>
      {label}
      {required ? <span className="text-red-500"> *</span> : null}
    </span>
    <span className="cursor-help text-slate-400" title={tip} aria-label={tip}>
      <AppIcon icon="mdi:information-outline" />
    </span>
  </span>
);

const InfoRow = ({ name, value, description }: InfoRowProps) => (
  <div className="flex flex-col gap-1 border-b border-slate-100 py-2 last:border-b-0">
    <div className="text-[11px] font-semibold text-slate-700">
      {name}: <span className="font-normal text-slate-900">{value}</span>
    </div>
    <div className="text-[10px] text-slate-500">{description}</div>
  </div>
);

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
  const [activeTab, setActiveTab] = useState<
    "general" | "specific" | "cache" | "l2" | "l2-hygiene" | "spot" | "pipe"
  >("general");
  const [candleSymbol, setCandleSymbol] = useState("");
  const [candleExchange, setCandleExchange] = useState("");
  const [candleStart, setCandleStart] = useState("");
  const [candleEnd, setCandleEnd] = useState("");
  const [candleTf, setCandleTf] = useState("1d");
  const [candleStatus, setCandleStatus] = useState<Status>("idle");
  const [candleError, setCandleError] = useState<string | null>(null);
  const [candleRows, setCandleRows] = useState<any[]>([]);
  const [candleTab, setCandleTab] = useState<"table" | "chart">("table");
  const [provider, setProvider] = useState<"FMP" | "ALPACA" | "IBKR" | "">("");
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
  const [l2AuditStatus, setL2AuditStatus] = useState<Status>("idle");
  const [l2AuditError, setL2AuditError] = useState<string | null>(null);
  const [l2AuditResult, setL2AuditResult] = useState<any>(null);
  const [l2AuditTarget, setL2AuditTarget] = useState<string | null>(null);
  const [l2AuditLastRunAt, setL2AuditLastRunAt] = useState<string | null>(null);
  const [showL2AuditModal, setShowL2AuditModal] = useState(false);
  const [showL2FileModal, setShowL2FileModal] = useState(false);
  const [l2FileName, setL2FileName] = useState<string | null>(null);
  const [l2FileStatus, setL2FileStatus] = useState<Status>("idle");
  const [l2FileError, setL2FileError] = useState<string | null>(null);
  const [l2FileData, setL2FileData] = useState<any>(null);
  const [l2FileMeta, setL2FileMeta] = useState<any>(null);
  const [l2FileEditing, setL2FileEditing] = useState(false);
  const [l2FileDraft, setL2FileDraft] = useState<string>("");
  const [l2FileRequest, setL2FileRequest] = useState<Record<string, string> | null>(null);
  const [l2FileTab, setL2FileTab] = useState<"json" | "table">("json");
  const [l2FileTimeFilter, setL2FileTimeFilter] = useState<string>("");
  const [l2FileTableDraft, setL2FileTableDraft] = useState<any[] | null>(null);
  const [spotSymbol, setSpotSymbol] = useState("");
  const [spotParams, setSpotParams] = useState<Record<string, string>>({
    exchange: "",
    lookbackDays: "",
    lookbackBars: "",
    tf: "",
    confirm: "",
    confirmLookbackDays: "",
    confirmLookbackBars: "",
    confirmTf: "",
    swingWindow: "",
    atrPeriod: "",
    clusterMultiplier: "",
    reactionLookahead: "",
    minTouches: "",
    minScore: "",
    minRecentBars: "",
    recencyRecent: "",
    recencyMid: "",
    weightRecent: "",
    weightMid: "",
    weightOld: "",
    zoneFillK: "",
    breakoutK: "",
    structuralK: "",
    volatilityK: "",
    tpAtrK: "",
  });
  const [spotStatus, setSpotStatus] = useState<Status>("idle");
  const [spotError, setSpotError] = useState<string | null>(null);
  const [spotResult, setSpotResult] = useState<any>(null);
  const [spotPrice, setSpotPrice] = useState<number | null>(null);
  const [spotPriceStatus, setSpotPriceStatus] = useState<Status>("idle");
  const [selectionDebugOpen, setSelectionDebugOpen] = useState(true);
  const [pipeList, setPipeList] = useState<any[]>([]);
  const [pipeListStatus, setPipeListStatus] = useState<Status>("idle");
  const [pipeListError, setPipeListError] = useState<string | null>(null);
  const [pipeSelectedId, setPipeSelectedId] = useState<number | null>(null);
  const [pipeSelectedDate, setPipeSelectedDate] = useState<string>(() => {
    const now = new Date();
    return now.toISOString().slice(0, 10);
  });
  const [pipeLimit, setPipeLimit] = useState<number>(50);
  const [pipeMaxDistanceAtr, setPipeMaxDistanceAtr] = useState<number>(() => {
    if (typeof localStorage === "undefined") return 3;
    const stored = Number(localStorage.getItem("astraai:pipe:maxDistanceAtr"));
    return Number.isFinite(stored) ? stored : 3;
  });
  const pipeDateRef = useRef<HTMLInputElement | null>(null);
  const [pipeJobId, setPipeJobId] = useState<string | null>(null);
  const [pipeStats, setPipeStats] = useState<any>(null);
  const [pipeResults, setPipeResults] = useState<any[]>([]);
  const [pipeErrors, setPipeErrors] = useState<any[]>([]);
  const [pipeRunStatus, setPipeRunStatus] = useState<Status>("idle");
  const [pipePollStatus, setPipePollStatus] = useState<Status>("idle");
  const [pipePollError, setPipePollError] = useState<string | null>(null);
  const [pipeLatestStatus, setPipeLatestStatus] = useState<Status>("idle");
  const [pipeLatestNote, setPipeLatestNote] = useState<string | null>(null);
  const [pipeShowErrors, setPipeShowErrors] = useState(false);
  const [pipeDetailRow, setPipeDetailRow] = useState<any>(null);

  const formatNumber = (value: any, digits = 4) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return value ?? "-";
    return num.toFixed(digits);
  };

  const formatDate = (value: any) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString("it-IT", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPercent = (value: number | null) => {
    if (value === null || !Number.isFinite(value)) return "-";
    return `${value.toFixed(2)}%`;
  };

  const pctDelta = (a: number | null, b: number | null) => {
    if (a === null || b === null || !Number.isFinite(a) || !Number.isFinite(b) || b === 0) return null;
    return ((a - b) / b) * 100;
  };

  const runL2Audit = async ({ symbol, tf }: { symbol?: string; tf?: string } = {}) => {
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    setL2AuditStatus("loading");
    setL2AuditError(null);
    setL2AuditResult(null);
    setL2AuditTarget(symbol ? `${symbol}${tf ? ` (${tf})` : ""}` : "ALL");
    try {
      const params = new URLSearchParams();
      if (symbol) params.set("symbol", symbol);
      if (tf) params.set("tf", tf);
      const res = await fetch(`${env.apiBaseUrl}/cachemanager/l2/audit?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || data?.message || "Errore audit L2");
      }
      setL2AuditResult(data?.data ?? data);
    setL2AuditStatus("idle");
    setL2AuditLastRunAt(new Date().toISOString());
    setShowL2AuditModal(true);
  } catch (err: any) {
      setL2AuditStatus("error");
      setL2AuditError(err?.message || "Errore audit L2");
    }
  };

  useEffect(() => {
    if (!spotResult || !spotSymbol.trim()) {
      setSpotPrice(null);
      setSpotPriceStatus("idle");
      return;
    }

    const symbol = spotSymbol.trim().toUpperCase();
    setSpotPriceStatus("loading");
    fetch(
      `https://financialmodelingprep.com/stable/quote?symbol=${encodeURIComponent(
        symbol
      )}&apikey=4c69521fc50b653ed6e006f094a265f7`
    )
      .then(async (res) => {
        const data = await res.json().catch(() => []);
        if (!res.ok) throw new Error("Price request failed");
        const item = Array.isArray(data) ? data[0] : null;
        const price = Number(item?.price ?? item?.last ?? item?.close);
        if (!Number.isFinite(price)) throw new Error("Price not available");
        setSpotPrice(price);
        setSpotPriceStatus("idle");
      })
      .catch(() => {
        setSpotPrice(null);
        setSpotPriceStatus("error");
      });
  }, [spotResult, spotSymbol]);

  const slug = useMemo(() => getSlugFromHash(), []);

  useEffect(() => {
    const isDecisionEngineTab = slug?.toLowerCase() === "decision-engine";
    if (!isDecisionEngineTab || activeTab !== "pipe") return;
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    setPipeListStatus("loading");
    setPipeListError(null);
    fetch(`${env.apiBaseUrl}/tickerscanner/fundamentals/users/pipes`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then((res) => res.json().catch(() => ({})))
      .then((data) => {
        const rows = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        const enabled = rows.filter((p: any) => p?.enabled === true || p?.enabled === 1 || p?.enabled === "1");
        setPipeList(enabled);
        if (enabled.length && pipeSelectedId === null) {
          setPipeSelectedId(Number(enabled[0]?.id) || null);
        }
        setPipeListStatus("idle");
      })
      .catch((err: any) => {
        setPipeListStatus("error");
        setPipeListError(err?.message || "Errore caricamento pipes");
      });
  }, [activeTab, slug, pipeSelectedId]);

  useEffect(() => {
    if (!pipeJobId) return;
    let active = true;
    setPipePollStatus("loading");
    setPipePollError(null);
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;

    let timerId: ReturnType<typeof setInterval> | null = null;
    const poll = async () => {
      try {
        const res = await fetch(
          `${env.apiBaseUrl}/decision-engine/spot-finder/jobs/${encodeURIComponent(pipeJobId)}?limit=${encodeURIComponent(
            pipeLimit
          )}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data?.ok === false) {
          throw new Error(data?.error || data?.message || "Errore poll");
        }
        if (!active) return;
        setPipeStats(data?.stats || null);
        setPipeResults(Array.isArray(data?.results) ? data.results : []);
        setPipeErrors(Array.isArray(data?.errors) ? data.errors : []);
        setPipePollStatus("idle");
        if (
          data?.stats?.status === "completed" ||
          data?.stats?.status === "error" ||
          data?.stats?.status === "canceled"
        ) {
          if (timerId) clearInterval(timerId);
        }
      } catch (err: any) {
        if (!active) return;
        setPipePollStatus("error");
        setPipePollError(err?.message || "Errore polling");
      }
    };

    poll();
    timerId = setInterval(poll, 5000);
    return () => {
      active = false;
      if (timerId) clearInterval(timerId);
    };
  }, [pipeJobId, pipeLimit]);

  useEffect(() => {
    setPipeJobId(null);
    setPipeStats(null);
    setPipeResults([]);
    setPipeErrors([]);
    setPipeRunStatus("idle");
    setPipePollStatus("idle");
    setPipePollError(null);
  }, [pipeSelectedId, pipeSelectedDate]);

  useEffect(() => {
    if (!pipeSelectedId || activeTab !== "pipe") return;
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    const dateValue = pipeDateRef.current?.value || pipeSelectedDate;
    const qs = dateValue ? `?date=${encodeURIComponent(dateValue)}` : "";
    setPipeLatestStatus("loading");
    setPipeLatestNote(null);
    fetch(`${env.apiBaseUrl}/decision-engine/spot-finder/latest/${encodeURIComponent(pipeSelectedId)}${qs}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then((res) => res.json().catch(() => ({})))
      .then((data) => {
        if (data?.ok === false || !data?.data) {
          setPipeLatestStatus("error");
          setPipeLatestNote("Non ci sono dati recenti, riesegui l'elaborazione.");
          return;
        }
        setPipeLatestStatus("idle");
        setPipeLatestNote(null);
        const snapshot = data.data;
        setPipeStats(snapshot.stats || null);
        setPipeResults(Array.isArray(snapshot.results) ? snapshot.results : []);
        setPipeErrors(Array.isArray(snapshot.errors) ? snapshot.errors : []);
      })
      .catch(() => {
        setPipeLatestStatus("error");
        setPipeLatestNote("Non ci sono dati recenti, riesegui l'elaborazione.");
      });
  }, [pipeSelectedId, pipeSelectedDate, activeTab]);

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
    if (typeof localStorage === "undefined") return;
    localStorage.setItem("astraai:pipe:maxDistanceAtr", String(pipeMaxDistanceAtr));
  }, [pipeMaxDistanceAtr]);

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
  const isDecisionEngine = slug?.toLowerCase() === "decision-engine";
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
  const pipeDisplayRows = useMemo(() => {
    const base = pipeResults.map((row) => ({ ...row, _type: "result" }));
    if (!pipeShowErrors) return base;
    const errors = pipeErrors.map((row) => ({
      ...row,
      _type: "error",
      exchange: row?.exchange ?? null,
      currentPrice: null,
      levels: row?.levels ?? null,
    }));
    return [...base, ...errors];
  }, [pipeResults, pipeErrors, pipeShowErrors]);

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
        if (p === "FMP" || p === "ALPACA" || p === "IBKR") setProvider(p);
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
      setL2Letter((letters[0] as string) || null);
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

      {filtered.length > 0 && !isCachemanager && !isScheduler && !isTickerScanner && !isDecisionEngine && (
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

      {filtered.length > 0 && (isCachemanager || isScheduler || isTickerScanner || isDecisionEngine) && (
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
          {isCachemanager && (
            <button
              className={`px-3 py-2 text-[11px] font-semibold ${
                activeTab === "l2-hygiene" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
              }`}
              onClick={() => setActiveTab("l2-hygiene")}
            >
              L2 Hygiene
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
          {isDecisionEngine && (
            <button
              className={`px-3 py-2 text-[11px] font-semibold ${
                activeTab === "spot" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
              }`}
              onClick={() => setActiveTab("spot")}
            >
              Swit Spot
            </button>
          )}
          {isDecisionEngine && (
            <button
              className={`px-3 py-2 text-[11px] font-semibold ${
                activeTab === "pipe" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
              }`}
              onClick={() => setActiveTab("pipe")}
            >
              Pipe Execution
            </button>
          )}
        </div>
      )}

      {filtered.length > 0 && activeTab === "general" && (
        <>
          {isDecisionEngine && (
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
                      <td className="px-3 py-2 text-slate-700 whitespace-nowrap">
                        {formatDateTime(row.updated_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <MicroserviceGeneralTab
            microservice={microserviceName || slug || ""}
            onReleaseChange={setRelease}
            onHealthChange={setHealth}
            onOpenReleaseModal={() => setShowReleaseModal(true)}
          />
        </>
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
                <label className="inline-flex items-center gap-1">
                  <input
                    type="radio"
                    name="provider"
                    value="IBKR"
                    checked={provider === "IBKR"}
                    onChange={async () => {
                      setProviderError(null);
                      setProviderStatus("loading");
                      try {
                        const token =
                          typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
                        const res = await fetch(`${env.apiBaseUrl}/cachemanager/provider/IBKR`, {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                            ...(token ? { Authorization: `Bearer ${token}` } : {}),
                          },
                        });
                        const data = await res.json().catch(() => ({}));
                        if (!res.ok || data?.ok === false)
                          throw new Error(data?.error || data?.message || "Errore set provider");
                        setProvider("IBKR");
                        setProviderStatus("idle");
                      } catch (err: any) {
                        setProviderStatus("error");
                        setProviderError(err?.message || "Errore cambio provider");
                      }
                    }}
                    className="h-3 w-3"
                  />
                  <span>IBKR</span>
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
                if (candleExchange) params.set("exchange", candleExchange);
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
                <label className="text-[11px] font-semibold text-slate-700">Exchange</label>
                <input
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                  value={candleExchange}
                  onChange={(e) => setCandleExchange(e.target.value)}
                  placeholder="NYSE"
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

      {filtered.length > 0 && activeTab === "spot" && isDecisionEngine && (
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-[11px] text-slate-700">
          <div className="text-xs font-semibold text-slate-700">Swit Spot</div>
          <div className="mt-1 text-[11px] text-slate-500">
            Richiama <span className="font-semibold">/decision-engine/spot-finder</span>.
          </div>
          <form
            className="mt-4 grid gap-3 md:grid-cols-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setSpotStatus("loading");
              setSpotError(null);
              setSpotResult(null);
              const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
              const params = new URLSearchParams();
              params.set("ticker", spotSymbol.trim().toUpperCase());
              Object.entries(spotParams).forEach(([key, value]) => {
                if (value !== undefined && value !== null && String(value).trim() !== "") {
                  params.set(key, String(value).trim());
                }
              });
              try {
                const res = await fetch(`${env.apiBaseUrl}/decision-engine/spot-finder?${params.toString()}`, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                  },
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok || data?.ok === false) {
                  throw new Error(data?.error || data?.message || "Errore spot-finder");
                }
                setSpotResult(data);
                setSpotStatus("idle");
              } catch (err: any) {
                setSpotStatus("error");
                setSpotError(err?.message || "Errore durante la richiesta");
              }
            }}
          >
            <div className="md:col-span-2">
              <label>
                <InfoLabel
                  label="Symbol"
                  required
                  tip="Ticker del titolo da analizzare (obbligatorio)."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotSymbol}
                onChange={(e) => setSpotSymbol(e.target.value)}
                placeholder="NEM"
                required
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Exchange"
                  tip="Borsa di quotazione per risolvere il conid (es. NYSE, NASDAQ, ASX)."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.exchange}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, exchange: e.target.value }))}
                placeholder="NYSE"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Timeframe"
                  tip="Timeframe operativo delle candele (default 1day)."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.tf}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, tf: e.target.value }))}
                placeholder="1day"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Lookback days"
                  tip="Numero giorni di storico da usare per l'analisi."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.lookbackDays}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, lookbackDays: e.target.value }))}
                placeholder="120"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Lookback bars"
                  tip="Numero massimo di barre analizzate."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.lookbackBars}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, lookbackBars: e.target.value }))}
                placeholder="90"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Confirm"
                  tip="Abilita la conferma multi-timeframe (true/false)."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.confirm}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, confirm: e.target.value }))}
                placeholder="true"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Confirm TF"
                  tip="Timeframe di conferma (default 1week)."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.confirmTf}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, confirmTf: e.target.value }))}
                placeholder="1week"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Confirm lookback days"
                  tip="Storico in giorni per la conferma."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.confirmLookbackDays}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, confirmLookbackDays: e.target.value }))}
                placeholder="365"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Confirm lookback bars"
                  tip="Numero barre usate nella conferma."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.confirmLookbackBars}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, confirmLookbackBars: e.target.value }))}
                placeholder="52"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Swing window"
                  tip="Finestra per identificare swing high/low."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.swingWindow}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, swingWindow: e.target.value }))}
                placeholder="3"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="ATR period"
                  tip="Periodo ATR per normalizzare distanze e cluster."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.atrPeriod}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, atrPeriod: e.target.value }))}
                placeholder="20"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Cluster multiplier"
                  tip="Moltiplicatore ATR per unire i livelli vicini."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.clusterMultiplier}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, clusterMultiplier: e.target.value }))}
                placeholder="0.4"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Reaction lookahead"
                  tip="Barre future per misurare la reazione del prezzo."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.reactionLookahead}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, reactionLookahead: e.target.value }))}
                placeholder="15"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Min touches"
                  tip="Minimo numero di tocchi per validare un livello."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.minTouches}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, minTouches: e.target.value }))}
                placeholder="2"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Min score"
                  tip="Soglia minima di score per includere una zona."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.minScore}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, minScore: e.target.value }))}
                placeholder="1"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Min recent bars"
                  tip="Richiede almeno un tocco entro queste barre recenti."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.minRecentBars}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, minRecentBars: e.target.value }))}
                placeholder="60"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Recency recent"
                  tip="Soglia barre per peso 'recent'."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.recencyRecent}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, recencyRecent: e.target.value }))}
                placeholder="30"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Recency mid"
                  tip="Soglia barre per peso 'mid'."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.recencyMid}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, recencyMid: e.target.value }))}
                placeholder="90"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Weight recent"
                  tip="Peso assegnato alle zone recenti."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.weightRecent}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, weightRecent: e.target.value }))}
                placeholder="1"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Weight mid"
                  tip="Peso assegnato alle zone intermedie."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.weightMid}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, weightMid: e.target.value }))}
                placeholder="0.6"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Weight old"
                  tip="Peso assegnato alle zone vecchie."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.weightOld}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, weightOld: e.target.value }))}
                placeholder="0.3"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Zone fill K"
                  tip="Posizione di entry dentro la zona (0-1)."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.zoneFillK}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, zoneFillK: e.target.value }))}
                placeholder="0.55"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Breakout K"
                  tip="Buffer ATR sopra la resistenza per l'ingresso breakout."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.breakoutK}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, breakoutK: e.target.value }))}
                placeholder="0.25"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Structural K"
                  tip="Buffer ATR sotto il supporto per lo stop strutturale."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.structuralK}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, structuralK: e.target.value }))}
                placeholder="0.2"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Volatility K"
                  tip="Moltiplicatore ATR per stop loss basato su volatilita."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.volatilityK}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, volatilityK: e.target.value }))}
                placeholder="1.2"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="TP ATR K"
                  tip="Moltiplicatore ATR per il take profit di trend."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.tpAtrK}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, tpAtrK: e.target.value }))}
                placeholder="5"
              />
            </div>
            <div className="md:col-span-4 flex justify-end gap-2">
              <BaseButton
                type="button"
                variant="outline"
                color="neutral"
                size="sm"
                onClick={() => {
                  setSpotSymbol("");
                  setSpotParams({
                    exchange: "",
                    lookbackDays: "",
                    lookbackBars: "",
                    tf: "",
                    confirm: "",
                    confirmLookbackDays: "",
                    confirmLookbackBars: "",
                    confirmTf: "",
                    swingWindow: "",
                    atrPeriod: "",
                    clusterMultiplier: "",
                    reactionLookahead: "",
                    minTouches: "",
                    minScore: "",
                    minRecentBars: "",
                    recencyRecent: "",
                    recencyMid: "",
                    weightRecent: "",
                    weightMid: "",
                    weightOld: "",
                    zoneFillK: "",
                    breakoutK: "",
                    structuralK: "",
                    volatilityK: "",
                    tpAtrK: "",
                  });
                  setSpotResult(null);
                  setSpotError(null);
                  setSpotStatus("idle");
                }}
              >
                Cancel
              </BaseButton>
              <BaseButton
                type="submit"
                variant="solid"
                color="primary"
                size="sm"
                disabled={spotStatus === "loading"}
              >
                Submit
              </BaseButton>
            </div>
          </form>
          {spotError && <div className="mt-2 text-[11px] text-red-600">{spotError}</div>}
          {spotStatus === "loading" && <div className="mt-2 text-[11px] text-slate-500">Caricamento...</div>}
          {spotResult && (
            <div className="mt-4 space-y-3">
              <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                <div className="text-xs font-semibold text-slate-700">Summary</div>
                <div className="mt-2">
                  <InfoRow
                    name="atr20"
                    value={formatNumber(spotResult.atr20, 4)}
                    description="Volatilita media (ATR 20) sul timeframe operativo."
                  />
                  <InfoRow
                    name="eps"
                    value={formatNumber(spotResult.eps, 4)}
                    description="Distanza massima per aggregare swing nello stesso livello."
                  />
                  <InfoRow
                    name="window.startDate"
                    value={formatDate(spotResult.window?.startDate)}
                    description="Inizio dello storico analizzato."
                  />
                  <InfoRow
                    name="window.endDate"
                    value={formatDate(spotResult.window?.endDate)}
                    description="Fine dello storico analizzato."
                  />
                  <InfoRow
                    name="priceRef"
                    value={formatNumber(spotResult.priceRef, 4)}
                    description="Prezzo di riferimento usato per supporti/resistenze."
                  />
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                <div className="text-xs font-semibold text-slate-700">Zones</div>
                <div className="mt-2 text-[11px] text-slate-500">
                  Livelli operativi aggregati in zone di prezzo.
                </div>
                {spotResult.mergedZones && (
                  <div className="mt-2 text-[11px] text-slate-500">
                    Zone combinate (daily + recent + intraday): {spotResult.mergedZones?.length ?? 0}
                  </div>
                )}
                <div className="mt-2 overflow-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-xs">
                    <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-3 py-2 font-semibold">Type</th>
                        <th className="px-3 py-2 font-semibold">Struct</th>
                        <th className="px-3 py-2 font-semibold">Relative</th>
                        <th className="px-3 py-2 font-semibold">Mid</th>
                        <th className="px-3 py-2 font-semibold">Low</th>
                        <th className="px-3 py-2 font-semibold">High</th>
                        <th className="px-3 py-2 font-semibold">Width</th>
                        <th className="px-3 py-2 font-semibold">Score</th>
                        <th className="px-3 py-2 font-semibold">Touches</th>
                        <th className="px-3 py-2 font-semibold">Recency</th>
                        <th className="px-3 py-2 font-semibold">Source</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(spotResult.mergedZones || spotResult.zones || []).map((zone: any, idx: number) => (
                        <tr key={`${zone.type}-${idx}`} className="hover:bg-slate-50">
                          <td className="px-3 py-2 font-semibold text-slate-800">{zone.type}</td>
                          <td className="px-3 py-2 text-slate-700">{zone.structType ?? "-"}</td>
                          <td className="px-3 py-2 text-slate-700">{zone.relativeType ?? "-"}</td>
                          <td className="px-3 py-2 text-slate-700">{formatNumber(zone.midPrice, 4)}</td>
                          <td className="px-3 py-2 text-slate-700">{formatNumber(zone.low, 4)}</td>
                          <td className="px-3 py-2 text-slate-700">{formatNumber(zone.high, 4)}</td>
                          <td className="px-3 py-2 text-slate-700">{formatNumber(zone.width, 4)}</td>
                          <td className="px-3 py-2 text-slate-700">{formatNumber(zone.score, 3)}</td>
                          <td className="px-3 py-2 text-slate-700">{zone.touches ?? "-"}</td>
                          <td className="px-3 py-2 text-slate-700">{zone.recencyBars ?? "-"}</td>
                          <td className="px-3 py-2 text-slate-700">{zone.source || "-"}</td>
                        </tr>
                      ))}
                      {(!spotResult.mergedZones && (!spotResult.zones || spotResult.zones.length === 0)) && (
                        <tr>
                          <td className="px-3 py-2 text-slate-500" colSpan={11}>
                            Nessuna zona disponibile.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                <div className="text-xs font-semibold text-slate-700">Levels</div>
                <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="text-[11px] font-semibold text-slate-700">Current price</div>
                  <div className="mt-1 text-[11px] text-slate-700">
                    {spotPriceStatus === "loading"
                      ? "Loading..."
                      : spotPriceStatus === "error"
                        ? "-"
                        : formatNumber(spotPrice, 4)}
                  </div>
                  <div className="text-[10px] text-slate-500">Prezzo attuale del titolo (FMP quote).</div>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {[
                    { key: "retracement", label: "Ritracciamento", description: "Entry vicina al supporto." },
                    { key: "breakout", label: "Breakout", description: "Entry sopra la resistenza." },
                  ].map((block) => {
                    const data = spotResult.levels?.[block.key];
                    const entry = data?.entryLimit ?? null;
                    return (
                      <div key={block.key} className="rounded-md border border-slate-200 bg-white px-3 py-2">
                        <div className="text-[11px] font-semibold text-slate-700">{block.label}</div>
                        <div className="text-[10px] text-slate-500">{block.description}</div>
                        <div className="mt-1 text-[11px] text-slate-700">
                          {block.key === "breakout"
                            ? `Actionable: ${spotResult.levels?.actionableBreakout ? "YES" : "NO"}`
                            : `Actionable: ${spotResult.levels?.actionablePullback ? "YES" : "NO"}`}
                        </div>
                        {block.key === "breakout" && !spotResult.levels?.actionableBreakout && data?.reason && (
                          <div className="text-[10px] text-slate-500">Reason: {data.reason}</div>
                        )}
                        {block.key === "retracement" && !spotResult.levels?.actionablePullback && data?.reason && (
                          <div className="text-[10px] text-slate-500">Reason: {data.reason}</div>
                        )}
                        <div className="mt-2">
                          <InfoRow
                            name="entryLimit"
                            value={
                              spotPriceStatus === "loading"
                                ? `${formatNumber(entry, 4)} (Loading...)`
                                : `${formatNumber(entry, 4)} (${formatPercent(
                                    pctDelta(entry, spotPrice)
                                  )})`
                            }
                            description="Prezzo di ingresso suggerito."
                          />
                          <InfoRow
                            name="stopLoss"
                            value={`${formatNumber(data?.stopLoss, 4)} (${formatPercent(
                              pctDelta(data?.stopLoss, entry)
                            )})`}
                            description="Stop loss rispetto all'entry."
                          />
                          <InfoRow
                            name="takeProfit1"
                            value={
                              data?.takeProfit1
                                ? `${formatNumber(data?.takeProfit1, 4)} (${formatPercent(
                                    pctDelta(data?.takeProfit1, entry)
                                  )})`
                                : "-"
                            }
                            description="TP tecnico sulla prossima resistenza."
                          />
                          <InfoRow
                            name="takeProfit2"
                            value={`${formatNumber(data?.takeProfit2, 4)} (${formatPercent(
                              pctDelta(data?.takeProfit2, entry)
                            )})`}
                            description="TP di trend basato su ATR."
                          />
                          <InfoRow
                            name="risk"
                            value={formatNumber(data?.risk, 4)}
                            description="Rischio per azione (entry - stop)."
                          />
                        </div>
                        <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                          <div className="text-[11px] font-semibold text-slate-700">Rule</div>
                          <div className="mt-1 grid gap-2 md:grid-cols-2">
                            {block.key === "retracement" && (
                              <InfoRow
                                name="zoneFillK"
                                value={data?.rule?.zoneFillK ?? "-"}
                                description="Posizione percentuale dentro la zona."
                              />
                            )}
                            {block.key === "breakout" && (
                              <InfoRow
                                name="breakoutK"
                                value={data?.rule?.breakoutK ?? "-"}
                                description="Buffer ATR sopra la resistenza."
                              />
                            )}
                            <InfoRow
                              name="structuralK"
                              value={data?.rule?.structuralK ?? "-"}
                              description="Buffer ATR per lo stop strutturale."
                            />
                            <InfoRow
                              name="volatilityK"
                              value={data?.rule?.volatilityK ?? "-"}
                              description="Moltiplicatore ATR per stop loss."
                            />
                            <InfoRow
                              name="tpAtrK"
                              value={data?.rule?.tpAtrK ?? "-"}
                              description="Moltiplicatore ATR per TP trend."
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                <div className="text-xs font-semibold text-slate-700">Signal</div>
                {spotResult.signal ? (
                  <>
                    <div className="mt-2">
                      <InfoRow
                        name="timeframe"
                        value={spotResult.signal.timeframe || "-"}
                        description="Timeframe usato per il pattern detection."
                      />
                      <InfoRow
                        name="lookbackDays"
                        value={spotResult.signal.lookbackDays ?? "-"}
                        description="Periodo storico per il segnale."
                      />
                      <InfoRow
                        name="lookbackBars"
                        value={spotResult.signal.lookbackBars ?? "-"}
                        description="Numero barre analizzate per il segnale."
                      />
                      <InfoRow
                        name="atr20"
                        value={formatNumber(spotResult.signal.atr20, 4)}
                        description="ATR calcolato sul timeframe di segnale."
                      />
                      <InfoRow
                        name="stats.rawCandles"
                        value={spotResult.signal.stats?.rawCandles ?? "-"}
                        description="Candele ricevute dal provider (signal)."
                      />
                      <InfoRow
                        name="stats.filteredCandles"
                        value={spotResult.signal.stats?.filteredCandles ?? "-"}
                        description="Candele valide dopo filtro (signal)."
                      />
                      <InfoRow
                        name="window.startDate"
                        value={formatDate(spotResult.signal.window?.startDate)}
                        description="Inizio finestra segnale."
                      />
                      <InfoRow
                        name="window.endDate"
                        value={formatDate(spotResult.signal.window?.endDate)}
                        description="Fine finestra segnale."
                      />
                    </div>
                    <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                      <div className="text-[11px] font-semibold text-slate-700">Pattern</div>
                      <div className="mt-1 grid gap-2 md:grid-cols-2">
                        <InfoRow
                          name="trendOk"
                          value={
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                spotResult.signal.pattern?.trendOk
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {spotResult.signal.pattern?.trendOk ? "YES" : "NO"}
                            </span>
                          }
                          description="Trend positivo su EMA20/EMA50."
                        />
                        <InfoRow
                          name="flagOk"
                          value={
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                spotResult.signal.pattern?.flagOk
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {spotResult.signal.pattern?.flagOk ? "YES" : "NO"}
                            </span>
                          }
                          description="Flag valido con compressione range/volume."
                        />
                        <InfoRow
                          name="breakoutOk"
                          value={
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                spotResult.signal.pattern?.breakoutOk
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {spotResult.signal.pattern?.breakoutOk ? "YES" : "NO"}
                            </span>
                          }
                          description="Breakout confermato da close+volume."
                        />
                      <InfoRow
                        name="pullbackOk"
                        value={
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              spotResult.signal.pattern?.pullbackOk
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {spotResult.signal.pattern?.pullbackOk ? "YES" : "NO"}
                          </span>
                        }
                        description="Pullback valido con re-test del livello."
                      />
                      <InfoRow
                        name="ema20Last"
                        value={formatNumber(spotResult.signal.pattern?.debug?.ema20Last, 4)}
                        description="Ultimo valore EMA20 sul timeframe segnale."
                      />
                      <InfoRow
                        name="ema50Last"
                        value={formatNumber(spotResult.signal.pattern?.debug?.ema50Last, 4)}
                        description="Ultimo valore EMA50 sul timeframe segnale."
                      />
                      <InfoRow
                        name="lastClose"
                        value={formatNumber(spotResult.signal.pattern?.debug?.lastClose, 4)}
                        description="Ultimo close del timeframe segnale."
                      />
                      <InfoRow
                        name="volLast"
                        value={formatNumber(spotResult.signal.pattern?.debug?.volLast, 4)}
                        description="Volume dell'ultima candela."
                      />
                      <InfoRow
                        name="volMA20"
                        value={formatNumber(spotResult.signal.pattern?.debug?.volMA20, 4)}
                        description="Media volume 20 periodi."
                      />
                      <InfoRow
                        name="flagRange"
                        value={formatNumber(spotResult.signal.pattern?.debug?.flagRange, 4)}
                        description="Ampiezza del flag."
                      />
                      <InfoRow
                        name="atrLast"
                        value={formatNumber(spotResult.signal.pattern?.debug?.atrLast, 4)}
                        description="ATR dell'ultima candela segnale."
                      />
                        <InfoRow
                          name="breakLevel"
                          value={formatNumber(spotResult.signal.pattern?.breakLevel, 4)}
                          description="Livello di breakout del flag."
                        />
                        <InfoRow
                          name="flagHigh"
                          value={formatNumber(spotResult.signal.pattern?.flagHigh, 4)}
                          description="Massimo del flag."
                        />
                        <InfoRow
                          name="flagLow"
                          value={formatNumber(spotResult.signal.pattern?.flagLow, 4)}
                          description="Minimo del flag."
                        />
                        <InfoRow
                          name="entryBreakout"
                          value={formatNumber(spotResult.signal.pattern?.entryBreakout, 4)}
                          description="Entry breakout suggerita dal pattern."
                        />
                        <InfoRow
                          name="entryPullback"
                          value={formatNumber(spotResult.signal.pattern?.entryPullback, 4)}
                          description="Entry pullback suggerita dal pattern."
                        />
                        <InfoRow
                          name="stopLoss"
                          value={formatNumber(spotResult.signal.pattern?.stopLoss, 4)}
                          description="Stop loss da pattern."
                        />
                        <InfoRow
                          name="tp1"
                          value={formatNumber(spotResult.signal.pattern?.targets?.tp1, 4)}
                          description="Target 1 da pattern."
                        />
                        <InfoRow
                          name="tp2"
                          value={formatNumber(spotResult.signal.pattern?.targets?.tp2, 4)}
                          description="Target 2 da pattern."
                        />
                        <InfoRow
                          name="confidence"
                          value={spotResult.signal.pattern?.confidence ?? "-"}
                          description="Confidenza pattern (0-100)."
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="mt-2 text-[11px] text-slate-500">Segnale non disponibile.</div>
                )}
              </div>

              <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                <div className="text-xs font-semibold text-slate-700">Confirm</div>
                {spotResult.confirm ? (
                  <>
                    <div className="mt-2">
                      <InfoRow
                        name="timeframe"
                        value={spotResult.confirm.timeframe || "-"}
                        description="Timeframe usato per la conferma."
                      />
                      <InfoRow
                        name="lookbackDays"
                        value={spotResult.confirm.lookbackDays ?? "-"}
                        description="Periodo storico della conferma."
                      />
                      <InfoRow
                        name="lookbackBars"
                        value={spotResult.confirm.lookbackBars ?? "-"}
                        description="Numero barre usate nella conferma."
                      />
                      <InfoRow
                        name="atr20"
                        value={formatNumber(spotResult.confirm.atr20, 4)}
                        description="ATR calcolato sul timeframe di conferma."
                      />
                      <InfoRow
                        name="eps"
                        value={formatNumber(spotResult.confirm.eps, 4)}
                        description="Eps usato per clustering sul timeframe di conferma."
                      />
                      <InfoRow
                        name="window.startDate"
                        value={formatDate(spotResult.confirm.window?.startDate)}
                        description="Inizio dello storico di conferma."
                      />
                      <InfoRow
                        name="window.endDate"
                        value={formatDate(spotResult.confirm.window?.endDate)}
                        description="Fine dello storico di conferma."
                      />
                    </div>
                    <div className="mt-3 text-[11px] text-slate-500">
                      Zone di conferma disponibili: {spotResult.confirm.zones?.length ?? 0}
                    </div>
                  </>
                ) : (
                  <div className="mt-2 text-[11px] text-slate-500">Conferma non disponibile.</div>
                )}
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                  <div className="text-xs font-semibold text-slate-700">Recent (1h)</div>
                  {spotResult.recent ? (
                    <>
                      <div className="mt-2">
                        <InfoRow
                          name="timeframe"
                          value={spotResult.recent.timeframe || "-"}
                          description="Timeframe recente per livelli operativi."
                        />
                        <InfoRow
                          name="lookbackDays"
                          value={spotResult.recent.lookbackDays ?? "-"}
                          description="Periodo recente analizzato."
                        />
                        <InfoRow
                          name="lookbackBars"
                          value={spotResult.recent.lookbackBars ?? "-"}
                          description="Numero barre recenti."
                        />
                        <InfoRow
                          name="atr20"
                          value={formatNumber(spotResult.recent.atr20, 4)}
                          description="ATR calcolato su timeframe recente."
                        />
                        <InfoRow
                          name="eps"
                          value={formatNumber(spotResult.recent.eps, 4)}
                          description="Eps usato per clustering recente."
                        />
                        <InfoRow
                          name="window.startDate"
                          value={formatDate(spotResult.recent.window?.startDate)}
                          description="Inizio dello storico recente."
                        />
                        <InfoRow
                          name="window.endDate"
                          value={formatDate(spotResult.recent.window?.endDate)}
                          description="Fine dello storico recente."
                        />
                      </div>
                      <div className="mt-3 text-[11px] text-slate-500">
                        Zone recenti disponibili: {spotResult.recent.zones?.length ?? 0}
                      </div>
                    </>
                  ) : (
                    <div className="mt-2 text-[11px] text-slate-500">Dati recenti non disponibili.</div>
                  )}
                </div>

                <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                  <div className="text-xs font-semibold text-slate-700">Intraday (1m)</div>
                  {spotResult.intraday ? (
                    <>
                      <div className="mt-2">
                        <InfoRow
                          name="timeframe"
                          value={spotResult.intraday.timeframe || "-"}
                          description="Timeframe intraday per livelli rapidi."
                        />
                        <InfoRow
                          name="lookbackDays"
                          value={spotResult.intraday.lookbackDays ?? "-"}
                          description="Periodo intraday analizzato."
                        />
                        <InfoRow
                          name="lookbackBars"
                          value={spotResult.intraday.lookbackBars ?? "-"}
                          description="Numero barre intraday."
                        />
                        <InfoRow
                          name="atr20"
                          value={formatNumber(spotResult.intraday.atr20, 4)}
                          description="ATR calcolato su timeframe intraday."
                        />
                        <InfoRow
                          name="eps"
                          value={formatNumber(spotResult.intraday.eps, 4)}
                          description="Eps usato per clustering intraday."
                        />
                        <InfoRow
                          name="window.startDate"
                          value={formatDate(spotResult.intraday.window?.startDate)}
                          description="Inizio dello storico intraday."
                        />
                        <InfoRow
                          name="window.endDate"
                          value={formatDate(spotResult.intraday.window?.endDate)}
                          description="Fine dello storico intraday."
                        />
                      </div>
                      <div className="mt-3 text-[11px] text-slate-500">
                        Zone intraday disponibili: {spotResult.intraday.zones?.length ?? 0}
                      </div>
                    </>
                  ) : (
                    <div className="mt-2 text-[11px] text-slate-500">Dati intraday non disponibili.</div>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                <div className="text-xs font-semibold text-slate-700">Debug</div>
                <div className="mt-2 grid gap-3 md:grid-cols-2">
                  <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    <div className="text-[11px] font-semibold text-slate-700">Price Debug</div>
                    <InfoRow
                      name="priceRef"
                      value={formatNumber(spotResult.priceDebug?.priceRef, 4)}
                      description="Prezzo di riferimento usato."
                    />
                    <InfoRow
                      name="dailyLastClose"
                      value={formatNumber(spotResult.priceDebug?.dailyLastClose, 4)}
                      description="Ultimo close daily."
                    />
                    <InfoRow
                      name="recentLastClose"
                      value={formatNumber(spotResult.priceDebug?.recentLastClose, 4)}
                      description="Ultimo close 1h."
                    />
                    <InfoRow
                      name="signalLastClose"
                      value={formatNumber(spotResult.priceDebug?.signalLastClose, 4)}
                      description="Ultimo close timeframe segnale."
                    />
                    <InfoRow
                      name="providerSymbol"
                      value={spotResult.priceDebug?.providerSymbol ?? "-"}
                      description="Symbol usato per richieste candles."
                    />
                  </div>

                  <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    <div className="text-[11px] font-semibold text-slate-700">ATR Debug</div>
                    <InfoRow
                      name="avgHL"
                      value={formatNumber(spotResult.atrDebug?.avgHL, 6)}
                      description="Media high-low (ultime 200 barre)."
                    />
                    <InfoRow
                      name="medianHL"
                      value={formatNumber(spotResult.atrDebug?.medianHL, 6)}
                      description="Mediana high-low (ultime 200 barre)."
                    />
                    <InfoRow
                      name="minHL"
                      value={formatNumber(spotResult.atrDebug?.minHL, 6)}
                      description="Minimo high-low (ultime 200 barre)."
                    />
                    <InfoRow
                      name="maxHL"
                      value={formatNumber(spotResult.atrDebug?.maxHL, 6)}
                      description="Massimo high-low (ultime 200 barre)."
                    />
                    <InfoRow
                      name="avgTR"
                      value={formatNumber(spotResult.atrDebug?.avgTR, 6)}
                      description="Media TR (ultime 200 barre)."
                    />
                    <InfoRow
                      name="atrLast"
                      value={formatNumber(spotResult.atrDebug?.atrLast, 6)}
                      description="Ultimo ATR (timeframe segnale)."
                    />
                    <InfoRow
                      name="atrTail"
                      value={(spotResult.atrDebug?.atrTail || []).map((v: number) => formatNumber(v, 6)).join(", ") || "-"}
                      description="Ultimi 5 ATR."
                    />
                  </div>
                </div>

                <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-semibold text-slate-700">Selection Debug</div>
                    <button
                      type="button"
                      className="rounded-full border border-slate-200 bg-white p-1 text-slate-500 hover:text-slate-700"
                      onClick={() => setSelectionDebugOpen((prev) => !prev)}
                      aria-label={selectionDebugOpen ? "Collapse selection debug" : "Expand selection debug"}
                    >
                      <AppIcon icon={selectionDebugOpen ? "mdi:chevron-up" : "mdi:chevron-down"} width={14} height={14} />
                    </button>
                  </div>
                  {selectionDebugOpen && (
                    <div className="mt-2">
                      <InfoRow
                        name="usedAtrForTrading"
                        value={
                          spotResult.selectionDebug?.usedAtrForTrading
                            ? `${formatNumber(spotResult.selectionDebug.usedAtrForTrading.value, 6)} (${spotResult.selectionDebug.usedAtrForTrading.source}/${spotResult.selectionDebug.usedAtrForTrading.timeframe})`
                            : "-"
                        }
                        description="ATR usato per entry/SL/TP."
                      />
                      <InfoRow
                        name="usedTimeframeForLevels"
                        value={spotResult.selectionDebug?.usedTimeframeForLevels ?? "-"}
                        description="Timeframe usato per livelli."
                      />
                      <InfoRow
                        name="maxLevelDistanceAtr"
                        value={formatNumber(spotResult.selectionDebug?.maxLevelDistanceAtr, 2)}
                        description="Soglia massima distanza in ATR per i supporti."
                      />
                      <InfoRow
                        name="supportsWithinAtrCount"
                        value={spotResult.selectionDebug?.supportsWithinAtrCount ?? "-"}
                        description="Numero supporti entro la soglia ATR."
                      />
                      <InfoRow
                        name="supportHigherScoreWithinAtr"
                        value={spotResult.selectionDebug?.supportHigherScoreWithinAtr ? "YES" : "NO"}
                        description="Esiste un supporto con score maggiore dentro soglia."
                      />
                      <InfoRow
                        name="selectedSupport.midPrice"
                        value={formatNumber(spotResult.selectionDebug?.selectedSupport?.midPrice, 4)}
                        description="Supporto selezionato."
                      />
                      <InfoRow
                        name="selectedResistance.midPrice"
                        value={formatNumber(spotResult.selectionDebug?.selectedResistance?.midPrice, 4)}
                        description="Resistenza selezionata."
                      />
                      <InfoRow
                        name="distancePct"
                        value={formatPercent(spotResult.selectionDebug?.distancePct)}
                        description="Distanza % dal supporto selezionato."
                      />
                      <InfoRow
                        name="distanceAtr"
                        value={formatNumber(spotResult.selectionDebug?.distanceAtr, 4)}
                        description="Distanza in ATR dal supporto selezionato."
                      />
                    </div>
                  )}
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    <div className="text-[11px] font-semibold text-slate-700">Supports Top 5</div>
                    <div className="mt-2 overflow-auto">
                      <table className="min-w-full divide-y divide-slate-200 text-[10px]">
                        <thead className="bg-white text-left text-[10px] uppercase tracking-wide text-slate-500">
                          <tr>
                            <th className="px-2 py-1">Mid</th>
                            <th className="px-2 py-1">Low</th>
                            <th className="px-2 py-1">High</th>
                            <th className="px-2 py-1">Score</th>
                            <th className="px-2 py-1">Touches</th>
                            <th className="px-2 py-1">Recency</th>
                            <th className="px-2 py-1">Source</th>
                            <th className="px-2 py-1">TF</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {(spotResult.selectionDebug?.supportsTop5 || []).map((zone: any, idx: number) => (
                            <tr key={`support-${idx}`} className="hover:bg-white/50">
                              <td className="px-2 py-1">{formatNumber(zone.midPrice, 4)}</td>
                              <td className="px-2 py-1">{formatNumber(zone.low, 4)}</td>
                              <td className="px-2 py-1">{formatNumber(zone.high, 4)}</td>
                              <td className="px-2 py-1">{formatNumber(zone.score, 3)}</td>
                              <td className="px-2 py-1">{zone.touches ?? "-"}</td>
                              <td className="px-2 py-1">{zone.recencyBars ?? "-"}</td>
                              <td className="px-2 py-1">{zone.source ?? "-"}</td>
                              <td className="px-2 py-1">{zone.timeframe ?? "-"}</td>
                            </tr>
                          ))}
                          {(!spotResult.selectionDebug?.supportsTop5 || spotResult.selectionDebug.supportsTop5.length === 0) && (
                            <tr>
                              <td className="px-2 py-1 text-slate-500" colSpan={8}>
                                Nessun supporto.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    <div className="text-[11px] font-semibold text-slate-700">Resistances Top 5</div>
                    <div className="mt-2 overflow-auto">
                      <table className="min-w-full divide-y divide-slate-200 text-[10px]">
                        <thead className="bg-white text-left text-[10px] uppercase tracking-wide text-slate-500">
                          <tr>
                            <th className="px-2 py-1">Mid</th>
                            <th className="px-2 py-1">Low</th>
                            <th className="px-2 py-1">High</th>
                            <th className="px-2 py-1">Score</th>
                            <th className="px-2 py-1">Touches</th>
                            <th className="px-2 py-1">Recency</th>
                            <th className="px-2 py-1">Source</th>
                            <th className="px-2 py-1">TF</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {(spotResult.selectionDebug?.resistancesTop5 || []).map((zone: any, idx: number) => (
                            <tr key={`res-${idx}`} className="hover:bg-white/50">
                              <td className="px-2 py-1">{formatNumber(zone.midPrice, 4)}</td>
                              <td className="px-2 py-1">{formatNumber(zone.low, 4)}</td>
                              <td className="px-2 py-1">{formatNumber(zone.high, 4)}</td>
                              <td className="px-2 py-1">{formatNumber(zone.score, 3)}</td>
                              <td className="px-2 py-1">{zone.touches ?? "-"}</td>
                              <td className="px-2 py-1">{zone.recencyBars ?? "-"}</td>
                              <td className="px-2 py-1">{zone.source ?? "-"}</td>
                              <td className="px-2 py-1">{zone.timeframe ?? "-"}</td>
                            </tr>
                          ))}
                          {(!spotResult.selectionDebug?.resistancesTop5 || spotResult.selectionDebug.resistancesTop5.length === 0) && (
                            <tr>
                              <td className="px-2 py-1 text-slate-500" colSpan={8}>
                                Nessuna resistenza.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="text-[11px] font-semibold text-slate-700">Resistance Debug</div>
                  <InfoRow
                    name="countResistancesAbovePrice"
                    value={spotResult.resistanceDebug?.countResistancesAbovePrice ?? "-"}
                    description="Numero resistenze sopra priceRef."
                  />
                  <div className="mt-2 overflow-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-[10px]">
                      <thead className="bg-white text-left text-[10px] uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="px-2 py-1">Mid</th>
                          <th className="px-2 py-1">Source</th>
                          <th className="px-2 py-1">Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(spotResult.resistanceDebug?.top5 || []).map((zone: any, idx: number) => (
                          <tr key={`res-top-${idx}`} className="hover:bg-white/50">
                            <td className="px-2 py-1">{formatNumber(zone.midPrice, 4)}</td>
                            <td className="px-2 py-1">{zone.source ?? "-"}</td>
                            <td className="px-2 py-1">{formatNumber(zone.score, 3)}</td>
                          </tr>
                        ))}
                        {(!spotResult.resistanceDebug?.top5 || spotResult.resistanceDebug.top5.length === 0) && (
                          <tr>
                            <td className="px-2 py-1 text-slate-500" colSpan={3}>
                              Nessuna resistenza sopra priceRef.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="text-[11px] font-semibold text-slate-700">Pattern Trend Debug</div>
                  <InfoRow
                    name="ema20Last"
                    value={formatNumber(spotResult.signal?.pattern?.debug?.trend?.ema20Last, 4)}
                    description="EMA20 ultimo valore."
                  />
                  <InfoRow
                    name="ema50Last"
                    value={formatNumber(spotResult.signal?.pattern?.debug?.trend?.ema50Last, 4)}
                    description="EMA50 ultimo valore."
                  />
                  <InfoRow
                    name="emaSpreadPct"
                    value={formatPercent(spotResult.signal?.pattern?.debug?.trend?.emaSpreadPct)}
                    description="Differenza EMA20/EMA50 in %."
                  />
                  <InfoRow
                    name="aboveEma20Count"
                    value={spotResult.signal?.pattern?.debug?.trend?.aboveEma20Count ?? "-"}
                    description="Barre sopra EMA20 (ultime 12)."
                  />
                  <InfoRow
                    name="consideredBars"
                    value={spotResult.signal?.pattern?.debug?.trend?.consideredBars ?? "-"}
                    description="Barre valide considerate."
                  />
                  {spotResult.signal?.pattern?.debug?.last12 && (
                    <div className="mt-2 overflow-auto">
                      <table className="min-w-full divide-y divide-slate-200 text-[10px]">
                        <thead className="bg-white text-left text-[10px] uppercase tracking-wide text-slate-500">
                          <tr>
                            <th className="px-2 py-1">Time</th>
                            <th className="px-2 py-1">Close</th>
                            <th className="px-2 py-1">EMA20</th>
                            <th className="px-2 py-1">Above</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {spotResult.signal.pattern.debug.last12.map((row: any, idx: number) => (
                            <tr key={`last12-${idx}`} className="hover:bg-white/50">
                              <td className="px-2 py-1">{formatDate(row.t)}</td>
                              <td className="px-2 py-1">{formatNumber(row.close, 4)}</td>
                              <td className="px-2 py-1">{formatNumber(row.ema20, 4)}</td>
                              <td className="px-2 py-1">{row.above === null ? "-" : row.above ? "YES" : "NO"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {filtered.length > 0 && activeTab === "pipe" && isDecisionEngine && (
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-[11px] text-slate-700">
          <div className="text-xs font-semibold text-slate-700">Pipe Execution</div>
          <div className="mt-1 text-[11px] text-slate-500">
            Avvia <span className="font-semibold">/decision-engine/spot-finder/:pipeId</span> in async e mostra i risultati parziali.
          </div>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <div className="min-w-[220px]">
              <label className="text-[11px] font-semibold text-slate-700">Pipe</label>
              <select
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={pipeSelectedId ?? ""}
                onChange={(e) => setPipeSelectedId(Number(e.target.value) || null)}
              >
                <option value="">Seleziona pipe</option>
                {pipeList.map((pipe: any) => (
                  <option key={pipe.id} value={pipe.id}>
                    {pipe.name || `Pipe ${pipe.id}`}
                  </option>
                ))}
              </select>
              {pipeListStatus === "loading" && <div className="mt-1 text-[10px] text-slate-500">Caricamento...</div>}
              {pipeListStatus === "error" && pipeListError && (
                <div className="mt-1 text-[10px] text-red-600">{pipeListError}</div>
              )}
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-700">Date</label>
              <input
                type="date"
                className="mt-1 w-full min-w-[160px] rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={pipeSelectedDate}
                onChange={(e) => setPipeSelectedDate(e.target.value)}
                ref={pipeDateRef}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-700">Limit</label>
              <input
                type="number"
                min={1}
                max={500}
                className="mt-1 w-full min-w-[120px] rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={pipeLimit}
                onChange={(e) => setPipeLimit(Number(e.target.value) || 1)}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-700">Max distance ATR</label>
              <input
                type="number"
                min={0.5}
                step={0.1}
                className="mt-1 w-full min-w-[140px] rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={pipeMaxDistanceAtr}
                onChange={(e) => setPipeMaxDistanceAtr(Number(e.target.value) || 0.5)}
              />
            </div>
            <button
              className="rounded-md bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              disabled={!pipeSelectedId || pipeRunStatus === "loading"}
              onClick={async () => {
                const cacheValue = "true";
                const dateValue = pipeDateRef.current?.value || pipeSelectedDate;
                const maxDistanceValue = Number.isFinite(pipeMaxDistanceAtr) ? pipeMaxDistanceAtr : 3;
                if (!pipeSelectedId) return;
                setPipeRunStatus("loading");
                setPipePollError(null);
                setPipeStats(null);
                setPipeResults([]);
                setPipeErrors([]);
                const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
                try {
                  const res = await fetch(
                    `${env.apiBaseUrl}/decision-engine/spot-finder/${encodeURIComponent(
                      pipeSelectedId
                    )}?cache=${cacheValue}&date=${encodeURIComponent(
                      dateValue
                    )}&maxLevelDistanceAtr=${encodeURIComponent(maxDistanceValue)}`,
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
                    throw new Error(data?.error || data?.message || "Errore avvio pipe");
                  }
                  setPipeJobId(data?.jobId || null);
                  setPipeStats(data?.stats || null);
                  setPipeRunStatus("idle");
                } catch (err: any) {
                  setPipeRunStatus("error");
                  setPipePollError(err?.message || "Errore avvio pipe");
                }
              }}
            >
              {pipeRunStatus === "loading" ? "Running..." : "Run"}
            </button>
            <button
              className="rounded-md border border-slate-300 px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
              disabled={!pipeSelectedId || pipeRunStatus === "loading"}
              onClick={async () => {
                const cacheValue = "false";
                const dateValue = pipeDateRef.current?.value || pipeSelectedDate;
                const maxDistanceValue = Number.isFinite(pipeMaxDistanceAtr) ? pipeMaxDistanceAtr : 3;
                if (!pipeSelectedId) return;
                setPipeRunStatus("loading");
                setPipePollError(null);
                setPipeStats(null);
                setPipeResults([]);
                setPipeErrors([]);
                const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
                try {
                  const res = await fetch(
                    `${env.apiBaseUrl}/decision-engine/spot-finder/${encodeURIComponent(
                      pipeSelectedId
                    )}?cache=${cacheValue}&date=${encodeURIComponent(
                      dateValue
                    )}&maxLevelDistanceAtr=${encodeURIComponent(maxDistanceValue)}`,
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
                    throw new Error(data?.error || data?.message || "Errore avvio pipe");
                  }
                  setPipeJobId(data?.jobId || null);
                  setPipeStats(data?.stats || null);
                  setPipeRunStatus("idle");
                } catch (err: any) {
                  setPipeRunStatus("error");
                  setPipePollError(err?.message || "Errore avvio pipe");
                }
              }}
            >
              Force reload
            </button>
            <button
              className="rounded-md border border-rose-200 bg-rose-600 px-4 py-2 text-[12px] font-semibold text-white hover:bg-rose-500 disabled:opacity-50"
              disabled={!pipeJobId || pipeStats?.status !== "running"}
              onClick={async () => {
                if (!pipeJobId) return;
                const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
                try {
                  const res = await fetch(
                    `${env.apiBaseUrl}/decision-engine/spot-finder/jobs/${encodeURIComponent(pipeJobId)}/stop`,
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
                    throw new Error(data?.error || data?.message || "Errore stop job");
                  }
                  setPipeStats((prev: any) => ({
                    ...(prev || {}),
                    status: data?.status || "canceled",
                    finishedAt: data?.finishedAt || new Date().toISOString(),
                  }));
                } catch (err: any) {
                  setPipePollError(err?.message || "Errore stop job");
                }
              }}
            >
              Stop
            </button>
          </div>

          <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
            <div className="flex flex-wrap items-center gap-3">
              <div className="font-semibold">Status:</div>
              <div>{pipeStats?.status || "-"}</div>
              <div className="font-semibold">Processed:</div>
              <div>
                {pipeStats?.processed ?? 0}/{pipeStats?.total ?? 0}
              </div>
              <div className="font-semibold">Remaining:</div>
              <div>{pipeStats?.remaining ?? "-"}</div>
              <div className="font-semibold">OK:</div>
              <div>{pipeStats?.ok ?? "-"}</div>
              <div className="font-semibold">Errors:</div>
              <div>{pipeStats?.errorCount ?? "-"}</div>
              <div className="font-semibold">Cache used:</div>
              <div>{pipeStats?.cachedUsed ? "YES" : "NO"}</div>
              <div className="font-semibold">Cached:</div>
              <div>{pipeStats?.cachedCount ?? "-"}</div>
              {pipeJobId && (
                <>
                  <div className="font-semibold">Job:</div>
                  <div className="text-slate-900">{pipeJobId}</div>
                </>
              )}
            </div>
            {pipeStats?.status === "running" && (
              <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-emerald-500"
                  style={{
                    width: `${
                      pipeStats?.total ? Math.min(100, Math.max(0, (pipeStats.processed / pipeStats.total) * 100)) : 0
                    }%`,
                  }}
                />
              </div>
            )}
          </div>

          {pipeLatestStatus === "error" && pipeLatestNote && (
            <div className="mt-2 text-[11px] text-amber-700">{pipeLatestNote}</div>
          )}

          {pipePollStatus === "loading" && <div className="mt-2 text-[11px] text-slate-500">Aggiornamento...</div>}
          {pipePollStatus === "error" && pipePollError && <div className="mt-2 text-[11px] text-red-600">{pipePollError}</div>}

          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-700">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                checked={pipeShowErrors}
                onChange={(e) => setPipeShowErrors(e.target.checked)}
              />
              Mostra anche errori
            </label>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-[11px]">
              <thead className="bg-slate-50 text-left text-[10px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2 font-semibold">#</th>
                  <th className="px-3 py-2 font-semibold">Symbol</th>
                  <th className="px-3 py-2 font-semibold">Exchange</th>
                  <th className="px-3 py-2 font-semibold">Current</th>
                  <th className="px-3 py-2 font-semibold">Retracement</th>
                  <th className="px-3 py-2 font-semibold">Breakout</th>
                  <th className="px-3 py-2 font-semibold">Trend</th>
                  <th className="px-3 py-2 font-semibold">Flag</th>
                  <th className="px-3 py-2 font-semibold">Breakout OK</th>
                  <th className="px-3 py-2 font-semibold">Pullback OK</th>
                  <th className="px-3 py-2 font-semibold">ATR Fit</th>
                  <th className="px-3 py-2 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pipeDisplayRows.map((row: any, idx: number) => {
                  const retracement = row?.levels?.retracement;
                  const breakout = row?.levels?.breakout;
                  const pattern = row?.fullResult?.signal?.pattern;
                  const atrFit = row?.fullResult?.selectionDebug?.supportsWithinAtrCount > 0;
                  const retrEntry = Number(retracement?.entryLimit);
                  const brkEntry = Number(breakout?.entryLimit);
                  const isError = row?._type === "error" || Boolean(row?.error);
                  return (
                    <tr key={`${row.ticker}-${idx}`} className="hover:bg-slate-50">
                      <td className="px-3 py-2 text-slate-500">{idx + 1}</td>
                      <td className="px-3 py-2 font-semibold text-slate-900">{row.ticker}</td>
                      <td className="px-3 py-2 text-slate-700">{row.exchange || "-"}</td>
                      <td className="px-3 py-2 text-slate-700">{formatNumber(row.currentPrice, 4)}</td>
                      <td className="px-3 py-2 text-slate-700">
                        {isError ? (
                          <span className="text-[10px] text-rose-600">{row?.error || "Errore"}</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex h-2.5 w-2.5 rounded-full ${
                                retracement?.actionable ? "bg-emerald-500" : "bg-rose-500"
                              }`}
                            />
                            <span className="font-semibold">{formatNumber(retrEntry, 4)}</span>
                            <span className="text-[10px] text-slate-500">
                              {formatPercent(pctDelta(retrEntry, row.currentPrice))}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 text-slate-700">
                        {isError ? (
                          <span className="text-[10px] text-rose-600">{row?.error || "Errore"}</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex h-2.5 w-2.5 rounded-full ${
                                breakout?.actionable ? "bg-emerald-500" : "bg-rose-500"
                              }`}
                            />
                            <span className="font-semibold">{formatNumber(brkEntry, 4)}</span>
                            <span className="text-[10px] text-slate-500">
                              {formatPercent(pctDelta(brkEntry, row.currentPrice))}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 text-slate-700">
                        {isError ? (
                          <span className="text-[10px] text-rose-600">Errore</span>
                        ) : (
                          <span
                            className={`inline-flex h-2.5 w-2.5 rounded-full ${
                              pattern?.trendOk ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                            title={pattern?.trendOk ? "YES" : "NO"}
                          />
                        )}
                      </td>
                      <td className="px-3 py-2 text-slate-700">
                        {isError ? (
                          <span className="text-[10px] text-rose-600">Errore</span>
                        ) : (
                          <span
                            className={`inline-flex h-2.5 w-2.5 rounded-full ${
                              pattern?.flagOk ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                            title={pattern?.flagOk ? "YES" : "NO"}
                          />
                        )}
                      </td>
                      <td className="px-3 py-2 text-slate-700">
                        {isError ? (
                          <span className="text-[10px] text-rose-600">Errore</span>
                        ) : (
                          <span
                            className={`inline-flex h-2.5 w-2.5 rounded-full ${
                              pattern?.breakoutOk ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                            title={pattern?.breakoutOk ? "YES" : "NO"}
                          />
                        )}
                      </td>
                      <td className="px-3 py-2 text-slate-700">
                        {isError ? (
                          <span className="text-[10px] text-rose-600">Errore</span>
                        ) : (
                          <span
                            className={`inline-flex h-2.5 w-2.5 rounded-full ${
                              pattern?.pullbackOk ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                            title={pattern?.pullbackOk ? "YES" : "NO"}
                          />
                        )}
                      </td>
                      <td className="px-3 py-2 text-slate-700">
                        {isError ? (
                          <span className="text-[10px] text-rose-600">Errore</span>
                        ) : (
                          <span
                            className={`inline-flex h-2.5 w-2.5 rounded-full ${
                              atrFit ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                            title={atrFit ? "Supporto entro ATR" : "Nessun supporto entro ATR"}
                          />
                        )}
                      </td>
                      <td className="px-3 py-2 text-slate-700">
                        <button
                          type="button"
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100"
                          onClick={() => setPipeDetailRow(row)}
                          aria-label="Dettagli"
                        >
                          <AppIcon icon="mdi:eye-outline" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {pipeDisplayRows.length === 0 && (
                  <tr>
                    <td className="px-3 py-3 text-slate-500" colSpan={7}>
                      Nessun risultato disponibile.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
                variant="outline"
                color="danger"
                size="sm"
                startIcon={<AppIcon icon="mdi:delete" />}
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

              <div className="w-full rounded-lg border border-slate-200 bg-white">
                <div className="border-b border-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
                  Keys (raggruppate per symbol)
                </div>
                <div className="overflow-auto">
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
                color="neutral"
                size="sm"
                startIcon={<AppIcon icon="mdi:broom" />}
                onClick={() => runL2Audit()}
                disabled={l2AuditStatus === "loading"}
              >
                Run hygiene
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
          {l2AuditStatus === "loading" && (
            <div className="mb-2 text-[11px] text-slate-500">Hygiene in corso...</div>
          )}
          {l2AuditStatus === "error" && l2AuditError && (
            <div className="mb-2">
              <Alert message={l2AuditError} tone="warn" onClose={() => setL2AuditError(null)} />
            </div>
          )}
          {l2AuditResult?.summary && l2AuditStatus === "idle" && (
            <div className="mb-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-700">
              <div className="font-semibold text-slate-700">
                Hygiene result {l2AuditTarget ? `(${l2AuditTarget})` : ""}
              </div>
              <div className="mt-1 text-[11px] text-slate-600">
                Symbols: {l2AuditResult.summary.totalSymbols} · Files: {l2AuditResult.summary.totalFiles} ·
                Candles: {l2AuditResult.summary.totalCandles} · Valid: {l2AuditResult.summary.validCandles} ·
                Broken: {l2AuditResult.summary.brokenCandles}
              </div>
            </div>
          )}
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
                const entries: { name: string; data: any }[] = rawEntries
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
                  .sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));

                const letters: string[] = Array.from(
                  new Set(entries.map((e: { name: string }) => (e.name[0] ? e.name[0].toUpperCase() : "")).filter(Boolean))
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
                        (e: { name: string }) =>
                          e.name.toUpperCase().startsWith(activeLetter) &&
                          (!normalizedSearch || e.name.toUpperCase().includes(normalizedSearch))
                      )
                    : entries.filter(
                        (e: { name: string }) => !normalizedSearch || e.name.toUpperCase().includes(normalizedSearch)
                      );

                const totalFromRoot = typeof l2Size?.totalBytes === "number" ? l2Size.totalBytes : 0;
                const sumChildren =
                  totalFromRoot > 0
                    ? totalFromRoot
                    : entries.reduce((sum: number, e: { data: any }) => sum + getNodeBytes(e.data), 0);

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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setL2Search(e.target.value)}
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
                          const firstTf = (() => {
                            const first = children[0];
                            const childName =
                              typeof first?.path === "string"
                                ? first.path.split(/[/\\]/).filter(Boolean).pop() || ""
                                : "";
                            const match = /^(\d{4})-(\d{2})_(.+)\.json$/i.exec(childName);
                            return match?.[3] || "";
                          })();
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
                                  <button
                                    type="button"
                                    className="ml-1 rounded-full p-1 text-slate-500 hover:bg-slate-100"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      runL2Audit({ symbol: name, tf: firstTf || undefined });
                                    }}
                                    aria-label={`Audit ${name}`}
                                    title={firstTf ? `Audit ${name} (${firstTf})` : `Audit ${name}`}
                                  >
                                    <AppIcon icon="mdi:broom" width={16} height={16} />
                                  </button>
                                </td>
                              </tr>
                              {expanded &&
                                children.map((child: any, cIdx: number) => {
                                  const childName =
                                    typeof child?.path === "string"
                                      ? child.path.split(/[/\\]/).filter(Boolean).pop() || child.path
                                      : `child-${cIdx}`;
                                  const createdAt = child?.createdAt;
                                  const updatedAt = child?.updatedAt;
                                  const isUpdated =
                                    createdAt &&
                                    updatedAt &&
                                    new Date(createdAt).getTime() !== new Date(updatedAt).getTime();
                                  const childBytes = getNodeBytes(child);
                                  const pctChild = entryBytes > 0 ? (childBytes / entryBytes) * 100 : 0;
                                  return (
                                    <tr key={`${name}-${childName}`} className="bg-slate-50">
                                      <td className="px-6 py-1 text-slate-700">
                                        <span className="inline-flex items-center gap-2">
                                          {isUpdated && (
                                            <span
                                              className="h-1.5 w-1.5 rounded-full bg-red-500"
                                              title={
                                                updatedAt
                                                  ? `Updated ${formatDate(updatedAt)}`
                                                  : "File aggiornato"
                                              }
                                            />
                                          )}
                                          <span>{childName}</span>
                                        </span>
                                      </td>
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
                                        <div className="inline-flex items-center gap-1">
                                        <button
                                          type="button"
                                          className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
                                          onClick={async (e) => {
                                            e.stopPropagation();
                                            const match = /^(\d{4})-(\d{2})_(.+)\.json$/i.exec(childName || "");
                                            const year = match?.[1];
                                            const month = match?.[2];
                                            const tf = match?.[3];
                                            const token =
                                              typeof localStorage !== "undefined"
                                                ? localStorage.getItem("astraai:auth:token")
                                                : null;
                                            setL2FileName(childName);
                                            setL2FileError(null);
                                            setL2FileData(null);
                                            setL2FileMeta(null);
                                            setL2FileEditing(false);
                                            setL2FileDraft("");
                                            setL2FileTab("json");
                                            setL2FileTimeFilter("");
                                            setL2FileTableDraft(null);
                                            setL2FileStatus("loading");
                                            setShowL2FileModal(true);
                                            try {
                                              const params = new URLSearchParams();
                                              const requestParams: Record<string, string> = {};
                                              if (year && month && tf) {
                                                params.set("symbol", name);
                                                params.set("year", year);
                                                params.set("month", month);
                                                params.set("tf", tf);
                                                requestParams.symbol = name;
                                                requestParams.year = year;
                                                requestParams.month = month;
                                                requestParams.tf = tf;
                                              } else {
                                                params.set("fileName", `${name}/${childName}`);
                                                requestParams.fileName = `${name}/${childName}`;
                                              }
                                              const res = await fetch(
                                                `${env.apiBaseUrl}/cachemanager/l2/file?${params.toString()}`,
                                                {
                                                  method: "GET",
                                                  headers: {
                                                    "Content-Type": "application/json",
                                                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                                                  },
                                                }
                                              );
                                              const data = await res.json().catch(() => ({}));
                                              if (!res.ok || data?.ok === false) {
                                                throw new Error(data?.error || data?.message || "Errore lettura file");
                                              }
                                              setL2FileData(data?.data ?? data);
                                              setL2FileMeta(data?.meta ?? null);
                                              setL2FileRequest(requestParams);
                                              setL2FileTableDraft(
                                                Array.isArray(data?.data ?? data) ? [...(data?.data ?? data)] : null
                                              );
                                              setL2FileStatus("idle");
                                            } catch (err: any) {
                                              setL2FileStatus("error");
                                              setL2FileError(err?.message || "Errore lettura file");
                                            }
                                          }}
                                          aria-label={`Visualizza ${childName}`}
                                        >
                                          <AppIcon icon="mdi:eye-outline" width={14} height={14} />
                                        </button>
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
                                        </div>
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

      {filtered.length > 0 && activeTab === "l2-hygiene" && isCachemanager && (
        <div className="rounded-lg border border-slate-200 bg-white/70 px-3 py-3 text-[11px] text-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-700">L2 Hygiene</div>
              <div className="text-[11px] text-slate-500">
                Ultimo run: {l2AuditLastRunAt ? formatDate(l2AuditLastRunAt) : "non disponibile"}
              </div>
            </div>
            <BaseButton
              variant="outline"
              color="neutral"
              size="sm"
              startIcon={<AppIcon icon="mdi:broom" />}
              onClick={() => runL2Audit()}
              disabled={l2AuditStatus === "loading"}
            >
              Run hygiene
            </BaseButton>
          </div>

          {l2AuditStatus === "loading" && (
            <div className="mt-2 text-[11px] text-slate-500">Hygiene in corso...</div>
          )}
          {l2AuditStatus === "error" && l2AuditError && (
            <div className="mt-2">
              <Alert message={l2AuditError} tone="warn" onClose={() => setL2AuditError(null)} />
            </div>
          )}

          {l2AuditResult?.summary && l2AuditStatus === "idle" && (
            <div className="mt-3 space-y-3">
              <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-700">Summary</div>
                <div className="mt-1 text-[11px] text-slate-600">
                  Symbols: {l2AuditResult.summary.totalSymbols} · Files: {l2AuditResult.summary.totalFiles} ·
                  Candles: {l2AuditResult.summary.totalCandles} · Valid: {l2AuditResult.summary.validCandles} ·
                  Broken: {l2AuditResult.summary.brokenCandles}
                </div>
                <div className="mt-1 text-[11px] text-slate-600">
                  Range: {formatDate(l2AuditResult.summary.timeRange?.start)} →{" "}
                  {formatDate(l2AuditResult.summary.timeRange?.end)}
                </div>
              </div>

              <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-700">Broken reasons</div>
                <div className="mt-1 text-[11px] text-slate-600">
                  invalid_t: {l2AuditResult.summary.brokenReasons?.invalid_t ?? 0} · invalid_ohlc:{" "}
                  {l2AuditResult.summary.brokenReasons?.invalid_ohlc ?? 0} · invalid_json:{" "}
                  {l2AuditResult.summary.brokenReasons?.invalid_json ?? 0} · not_array:{" "}
                  {l2AuditResult.summary.brokenReasons?.not_array ?? 0}
                </div>
              </div>

              <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-700">Top broken files</div>
                <div className="mt-2 overflow-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-[10px]">
                    <thead className="bg-slate-50 text-left text-[10px] uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-2 py-1">File</th>
                        <th className="px-2 py-1">Symbol</th>
                        <th className="px-2 py-1">TF</th>
                        <th className="px-2 py-1">Broken</th>
                        <th className="px-2 py-1">Broken %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(l2AuditResult.summary.topBrokenFiles || []).map((row: any, idx: number) => (
                        <tr key={`broken-${idx}`} className="hover:bg-slate-50">
                          <td className="px-2 py-1 text-slate-700">{row.file}</td>
                          <td className="px-2 py-1 text-slate-700">{row.symbol}</td>
                          <td className="px-2 py-1 text-slate-700">{row.tf}</td>
                          <td className="px-2 py-1 text-slate-700">{row.broken}</td>
                          <td className="px-2 py-1 text-slate-700">{row.brokenPct?.toFixed?.(1) ?? "-"}</td>
                        </tr>
                      ))}
                      {(!l2AuditResult.summary.topBrokenFiles ||
                        l2AuditResult.summary.topBrokenFiles.length === 0) && (
                        <tr>
                          <td colSpan={5} className="px-2 py-1 text-slate-500">
                            Nessun file problematico.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
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

      {pipeDetailRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex w-full max-w-3xl flex-col rounded-xl bg-white p-5 shadow-xl max-h-[85vh]">
            {(() => {
              const detail = pipeDetailRow.fullResult || pipeDetailRow;
              const current = Number.isFinite(detail?.priceRef)
                ? detail.priceRef
                : pipeDetailRow.currentPrice;
              const retracement = detail?.levels?.retracement;
              const breakout = detail?.levels?.breakout;
              const params = detail?.params || pipeDetailRow?.params || null;
              return (
                <>
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <div className="text-base font-semibold text-slate-900">
                        {pipeDetailRow.ticker || detail?.ticker || "Ticker"}
                      </div>
                      <div className="text-[11px] text-slate-500">Dettaglio esecuzione spot-finder</div>
                    </div>
                    <button
                      type="button"
                      className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      onClick={() => setPipeDetailRow(null)}
                    >
                      Chiudi
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto pr-1">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-700">
                        <div className="text-xs font-semibold text-slate-800">Overview</div>
                        <div className="mt-2 space-y-1">
                          <div>
                            <span className="font-semibold">Symbol:</span>{" "}
                            {pipeDetailRow.ticker || detail?.ticker || "-"}
                          </div>
                          <div>
                            <span className="font-semibold">Exchange:</span> {pipeDetailRow.exchange || "-"}
                          </div>
                          <div>
                            <span className="font-semibold">Current price:</span> {formatNumber(current, 4)}
                          </div>
                        </div>
                      </div>
                      <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-700">
                        <div className="text-xs font-semibold text-slate-800">Status</div>
                        <div className="mt-2 space-y-1">
                          <div>
                            <span className="font-semibold">Retracement actionable:</span>{" "}
                            {retracement?.actionable ? "YES" : "NO"}
                          </div>
                          <div>
                            <span className="font-semibold">Breakout actionable:</span>{" "}
                            {breakout?.actionable ? "YES" : "NO"}
                          </div>
                          {pipeDetailRow?.error && (
                            <div className="text-rose-600">
                              <span className="font-semibold">Error:</span> {pipeDetailRow.error}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="rounded-md border border-slate-200 bg-white p-3 text-[11px] text-slate-700">
                        <div className="text-xs font-semibold text-slate-800">Retracement</div>
                        <div className="mt-2 space-y-1">
                          <div>
                            <span className="font-semibold">Entry limit:</span> {formatNumber(retracement?.entryLimit, 4)}{" "}
                            <span className="text-slate-500">
                              ({formatPercent(pctDelta(retracement?.entryLimit, current))})
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold">Stop loss:</span> {formatNumber(retracement?.stopLoss, 4)}
                          </div>
                          <div>
                            <span className="font-semibold">TP1:</span> {formatNumber(retracement?.takeProfit1, 4)}
                          </div>
                          <div>
                            <span className="font-semibold">TP2:</span> {formatNumber(retracement?.takeProfit2, 4)}
                          </div>
                          <div>
                            <span className="font-semibold">Risk:</span> {formatNumber(retracement?.risk, 4)}
                          </div>
                        </div>
                      </div>
                      <div className="rounded-md border border-slate-200 bg-white p-3 text-[11px] text-slate-700">
                        <div className="text-xs font-semibold text-slate-800">Breakout</div>
                        <div className="mt-2 space-y-1">
                          <div>
                            <span className="font-semibold">Entry limit:</span> {formatNumber(breakout?.entryLimit, 4)}{" "}
                            <span className="text-slate-500">
                              ({formatPercent(pctDelta(breakout?.entryLimit, current))})
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold">Stop loss:</span> {formatNumber(breakout?.stopLoss, 4)}
                          </div>
                          <div>
                            <span className="font-semibold">TP1:</span> {formatNumber(breakout?.takeProfit1, 4)}
                          </div>
                          <div>
                            <span className="font-semibold">TP2:</span> {formatNumber(breakout?.takeProfit2, 4)}
                          </div>
                          <div>
                            <span className="font-semibold">Risk:</span> {formatNumber(breakout?.risk, 4)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 space-y-3">
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                        <div className="text-xs font-semibold text-slate-700">Summary</div>
                        <div className="mt-2">
                          <InfoRow
                            name="atr20"
                            value={formatNumber(detail?.atr20, 4)}
                            description="Volatilita media (ATR 20) sul timeframe operativo."
                          />
                          <InfoRow
                            name="eps"
                            value={formatNumber(detail?.eps, 4)}
                            description="Distanza massima per aggregare swing nello stesso livello."
                          />
                          <InfoRow
                            name="window.startDate"
                            value={formatDate(detail?.window?.startDate)}
                            description="Inizio dello storico analizzato."
                          />
                          <InfoRow
                            name="window.endDate"
                            value={formatDate(detail?.window?.endDate)}
                            description="Fine dello storico analizzato."
                          />
                          <InfoRow
                            name="priceRef"
                            value={formatNumber(detail?.priceRef, 4)}
                            description="Prezzo di riferimento usato per supporti/resistenze."
                          />
                        </div>
                      </div>
                      {params && (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                          <div className="text-xs font-semibold text-slate-700">Params</div>
                          <div className="mt-2 grid gap-2 md:grid-cols-2">
                            {[
                              { key: "lookbackDays", label: "lookbackDays" },
                              { key: "lookbackBars", label: "lookbackBars" },
                              { key: "tf", label: "tf" },
                              { key: "confirm", label: "confirm" },
                              { key: "confirmLookbackDays", label: "confirmLookbackDays" },
                              { key: "confirmLookbackBars", label: "confirmLookbackBars" },
                              { key: "confirmTf", label: "confirmTf" },
                              { key: "recentLookbackDays", label: "recentLookbackDays" },
                              { key: "recentLookbackBars", label: "recentLookbackBars" },
                              { key: "recentTf", label: "recentTf" },
                              { key: "intradayLookbackDays", label: "intradayLookbackDays" },
                              { key: "intradayLookbackBars", label: "intradayLookbackBars" },
                              { key: "intradayTf", label: "intradayTf" },
                              { key: "signalLookbackDays", label: "signalLookbackDays" },
                              { key: "signalLookbackBars", label: "signalLookbackBars" },
                              { key: "signalTf", label: "signalTf" },
                              { key: "swingWindow", label: "swingWindow" },
                              { key: "atrPeriod", label: "atrPeriod" },
                              { key: "clusterMultiplier", label: "clusterMultiplier" },
                              { key: "reactionLookahead", label: "reactionLookahead" },
                              { key: "minTouches", label: "minTouches" },
                              { key: "minScore", label: "minScore" },
                              { key: "minRecentBars", label: "minRecentBars" },
                              { key: "recencyRecent", label: "recencyRecent" },
                              { key: "recencyMid", label: "recencyMid" },
                              { key: "weightRecent", label: "weightRecent" },
                              { key: "weightMid", label: "weightMid" },
                              { key: "weightOld", label: "weightOld" },
                              { key: "zoneFillK", label: "zoneFillK" },
                              { key: "breakoutK", label: "breakoutK" },
                              { key: "structuralK", label: "structuralK" },
                              { key: "volatilityK", label: "volatilityK" },
                              { key: "tpAtrK", label: "tpAtrK" },
                              { key: "flagAtrK", label: "flagAtrK" },
                              { key: "flagPctK", label: "flagPctK" },
                              { key: "volMult", label: "volMult" },
                              { key: "minStopAtrK", label: "minStopAtrK" },
                              { key: "minTp2AtrK", label: "minTp2AtrK" },
                            ].map((item) => (
                              <InfoRow
                                key={item.key}
                                name={item.label}
                                value={
                                  Number.isFinite(Number(params[item.key]))
                                    ? formatNumber(Number(params[item.key]), 4)
                                    : params[item.key] ?? "-"
                                }
                                description="Parametro usato per il calcolo."
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                        <div className="text-xs font-semibold text-slate-700">Zones</div>
                        <div className="mt-2 text-[11px] text-slate-500">
                          Livelli operativi aggregati in zone di prezzo.
                        </div>
                        {detail?.mergedZones && (
                          <div className="mt-2 text-[11px] text-slate-500">
                            Zone combinate (daily + recent + intraday): {detail?.mergedZones?.length ?? 0}
                          </div>
                        )}
                        <div className="mt-2 overflow-auto">
                          <table className="min-w-full divide-y divide-slate-200 text-xs">
                            <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
                              <tr>
                                <th className="px-3 py-2 font-semibold">Type</th>
                                <th className="px-3 py-2 font-semibold">Struct</th>
                                <th className="px-3 py-2 font-semibold">Relative</th>
                                <th className="px-3 py-2 font-semibold">Mid</th>
                                <th className="px-3 py-2 font-semibold">Low</th>
                                <th className="px-3 py-2 font-semibold">High</th>
                                <th className="px-3 py-2 font-semibold">Width</th>
                                <th className="px-3 py-2 font-semibold">Score</th>
                                <th className="px-3 py-2 font-semibold">Touches</th>
                                <th className="px-3 py-2 font-semibold">Recency</th>
                                <th className="px-3 py-2 font-semibold">Source</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {(detail?.mergedZones || detail?.zones || []).map((zone: any, idx: number) => (
                                <tr key={`${zone.type}-${idx}`} className="hover:bg-slate-50">
                                  <td className="px-3 py-2 font-semibold text-slate-800">{zone.type}</td>
                                  <td className="px-3 py-2 text-slate-700">{zone.structType ?? "-"}</td>
                                  <td className="px-3 py-2 text-slate-700">{zone.relativeType ?? "-"}</td>
                                  <td className="px-3 py-2 text-slate-700">{formatNumber(zone.midPrice, 4)}</td>
                                  <td className="px-3 py-2 text-slate-700">{formatNumber(zone.low, 4)}</td>
                                  <td className="px-3 py-2 text-slate-700">{formatNumber(zone.high, 4)}</td>
                                  <td className="px-3 py-2 text-slate-700">{formatNumber(zone.width, 4)}</td>
                                  <td className="px-3 py-2 text-slate-700">{formatNumber(zone.score, 3)}</td>
                                  <td className="px-3 py-2 text-slate-700">{zone.touches ?? "-"}</td>
                                  <td className="px-3 py-2 text-slate-700">{zone.recencyBars ?? "-"}</td>
                                  <td className="px-3 py-2 text-slate-700">{zone.source || "-"}</td>
                                </tr>
                              ))}
                              {(!detail?.mergedZones && (!detail?.zones || detail?.zones.length === 0)) && (
                                <tr>
                                  <td className="px-3 py-2 text-slate-500" colSpan={11}>
                                    Nessuna zona disponibile.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                        <div className="text-xs font-semibold text-slate-700">Levels</div>
                        <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                          <div className="text-[11px] font-semibold text-slate-700">Current price</div>
                          <div className="mt-1 text-[11px] text-slate-700">{formatNumber(current, 4)}</div>
                          <div className="text-[10px] text-slate-500">Prezzo attuale del titolo.</div>
                        </div>
                        <div className="mt-3 grid gap-3 md:grid-cols-2">
                          {[
                            { key: "retracement", label: "Ritracciamento", description: "Entry vicina al supporto." },
                            { key: "breakout", label: "Breakout", description: "Entry sopra la resistenza." },
                          ].map((block) => {
                            const data = detail?.levels?.[block.key];
                            const entry = data?.entryLimit ?? null;
                            return (
                              <div key={block.key} className="rounded-md border border-slate-200 bg-white px-3 py-2">
                                <div className="text-[11px] font-semibold text-slate-700">{block.label}</div>
                                <div className="text-[10px] text-slate-500">{block.description}</div>
                                <div className="mt-1 text-[11px] text-slate-700">
                                  {block.key === "breakout"
                                    ? `Actionable: ${detail?.levels?.actionableBreakout ? "YES" : "NO"}`
                                    : `Actionable: ${detail?.levels?.actionablePullback ? "YES" : "NO"}`}
                                </div>
                                {block.key === "breakout" && !detail?.levels?.actionableBreakout && data?.reason && (
                                  <div className="text-[10px] text-slate-500">Reason: {data.reason}</div>
                                )}
                                {block.key === "retracement" && !detail?.levels?.actionablePullback && data?.reason && (
                                  <div className="text-[10px] text-slate-500">Reason: {data.reason}</div>
                                )}
                                <div className="mt-2">
                                  <InfoRow
                                    name="entryLimit"
                                    value={`${formatNumber(entry, 4)} (${formatPercent(pctDelta(entry, current))})`}
                                    description="Prezzo di ingresso suggerito."
                                  />
                                  <InfoRow
                                    name="stopLoss"
                                    value={`${formatNumber(data?.stopLoss, 4)} (${formatPercent(
                                      pctDelta(data?.stopLoss, entry)
                                    )})`}
                                    description="Stop loss rispetto all'entry."
                                  />
                                  <InfoRow
                                    name="takeProfit1"
                                    value={
                                      data?.takeProfit1
                                        ? `${formatNumber(data?.takeProfit1, 4)} (${formatPercent(
                                            pctDelta(data?.takeProfit1, entry)
                                          )})`
                                        : "-"
                                    }
                                    description="TP tecnico sulla prossima resistenza."
                                  />
                                  <InfoRow
                                    name="takeProfit2"
                                    value={`${formatNumber(data?.takeProfit2, 4)} (${formatPercent(
                                      pctDelta(data?.takeProfit2, entry)
                                    )})`}
                                    description="TP di trend basato su ATR."
                                  />
                                  <InfoRow
                                    name="risk"
                                    value={formatNumber(data?.risk, 4)}
                                    description="Rischio per azione (entry - stop)."
                                  />
                                </div>
                                <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                                  <div className="text-[11px] font-semibold text-slate-700">Rule</div>
                                  <div className="mt-1 grid gap-2 md:grid-cols-2">
                                    {block.key === "retracement" && (
                                      <InfoRow
                                        name="zoneFillK"
                                        value={data?.rule?.zoneFillK ?? "-"}
                                        description="Posizione percentuale dentro la zona."
                                      />
                                    )}
                                    {block.key === "breakout" && (
                                      <InfoRow
                                        name="breakoutK"
                                        value={data?.rule?.breakoutK ?? "-"}
                                        description="Buffer ATR sopra la resistenza."
                                      />
                                    )}
                                    <InfoRow
                                      name="structuralK"
                                      value={data?.rule?.structuralK ?? "-"}
                                      description="Buffer ATR per lo stop strutturale."
                                    />
                                    <InfoRow
                                      name="volatilityK"
                                      value={data?.rule?.volatilityK ?? "-"}
                                      description="Moltiplicatore ATR per stop loss."
                                    />
                                    <InfoRow
                                      name="tpAtrK"
                                      value={data?.rule?.tpAtrK ?? "-"}
                                      description="Moltiplicatore ATR per TP trend."
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                        <div className="text-xs font-semibold text-slate-700">Signal</div>
                        {detail?.signal ? (
                          <>
                            <div className="mt-2">
                              <InfoRow
                                name="timeframe"
                                value={detail?.signal?.timeframe || "-"}
                                description="Timeframe usato per il pattern detection."
                              />
                              <InfoRow
                                name="lookbackDays"
                                value={detail?.signal?.lookbackDays ?? "-"}
                                description="Periodo storico per il segnale."
                              />
                              <InfoRow
                                name="lookbackBars"
                                value={detail?.signal?.lookbackBars ?? "-"}
                                description="Numero barre analizzate per il segnale."
                              />
                              <InfoRow
                                name="atr20"
                                value={formatNumber(detail?.signal?.atr20, 4)}
                                description="ATR calcolato sul timeframe di segnale."
                              />
                              <InfoRow
                                name="stats.rawCandles"
                                value={detail?.signal?.stats?.rawCandles ?? "-"}
                                description="Candele ricevute dal provider (signal)."
                              />
                              <InfoRow
                                name="stats.filteredCandles"
                                value={detail?.signal?.stats?.filteredCandles ?? "-"}
                                description="Candele valide dopo filtro (signal)."
                              />
                              <InfoRow
                                name="window.startDate"
                                value={formatDate(detail?.signal?.window?.startDate)}
                                description="Inizio finestra segnale."
                              />
                              <InfoRow
                                name="window.endDate"
                                value={formatDate(detail?.signal?.window?.endDate)}
                                description="Fine finestra segnale."
                              />
                            </div>
                            <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                              <div className="text-[11px] font-semibold text-slate-700">Pattern</div>
                              <div className="mt-1 grid gap-2 md:grid-cols-2">
                                <InfoRow
                                  name="trendOk"
                                  value={
                                    <span
                                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                        detail?.signal?.pattern?.trendOk
                                          ? "bg-emerald-100 text-emerald-700"
                                          : "bg-red-100 text-red-700"
                                      }`}
                                    >
                                      {detail?.signal?.pattern?.trendOk ? "YES" : "NO"}
                                    </span>
                                  }
                                  description="Trend positivo su EMA20/EMA50."
                                />
                                <InfoRow
                                  name="flagOk"
                                  value={
                                    <span
                                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                        detail?.signal?.pattern?.flagOk
                                          ? "bg-emerald-100 text-emerald-700"
                                          : "bg-red-100 text-red-700"
                                      }`}
                                    >
                                      {detail?.signal?.pattern?.flagOk ? "YES" : "NO"}
                                    </span>
                                  }
                                  description="Flag valido con compressione range/volume."
                                />
                                <InfoRow
                                  name="breakoutOk"
                                  value={
                                    <span
                                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                        detail?.signal?.pattern?.breakoutOk
                                          ? "bg-emerald-100 text-emerald-700"
                                          : "bg-red-100 text-red-700"
                                      }`}
                                    >
                                      {detail?.signal?.pattern?.breakoutOk ? "YES" : "NO"}
                                    </span>
                                  }
                                  description="Breakout confermato da close+volume."
                                />
                                <InfoRow
                                  name="pullbackOk"
                                  value={
                                    <span
                                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                        detail?.signal?.pattern?.pullbackOk
                                          ? "bg-emerald-100 text-emerald-700"
                                          : "bg-red-100 text-red-700"
                                      }`}
                                    >
                                      {detail?.signal?.pattern?.pullbackOk ? "YES" : "NO"}
                                    </span>
                                  }
                                  description="Pullback valido con re-test del livello."
                                />
                                <InfoRow
                                  name="ema20Last"
                                  value={formatNumber(detail?.signal?.pattern?.debug?.ema20Last, 4)}
                                  description="Ultimo valore EMA20 sul timeframe segnale."
                                />
                                <InfoRow
                                  name="ema50Last"
                                  value={formatNumber(detail?.signal?.pattern?.debug?.ema50Last, 4)}
                                  description="Ultimo valore EMA50 sul timeframe segnale."
                                />
                                <InfoRow
                                  name="lastClose"
                                  value={formatNumber(detail?.signal?.pattern?.debug?.lastClose, 4)}
                                  description="Ultimo close del timeframe segnale."
                                />
                                <InfoRow
                                  name="volLast"
                                  value={formatNumber(detail?.signal?.pattern?.debug?.volLast, 4)}
                                  description="Volume dell'ultima candela."
                                />
                                <InfoRow
                                  name="volMA20"
                                  value={formatNumber(detail?.signal?.pattern?.debug?.volMA20, 4)}
                                  description="Media volume 20 periodi."
                                />
                                <InfoRow
                                  name="flagRange"
                                  value={formatNumber(detail?.signal?.pattern?.debug?.flagRange, 4)}
                                  description="Ampiezza del flag."
                                />
                                <InfoRow
                                  name="atrLast"
                                  value={formatNumber(detail?.signal?.pattern?.debug?.atrLast, 4)}
                                  description="ATR dell'ultima candela segnale."
                                />
                                <InfoRow
                                  name="breakLevel"
                                  value={formatNumber(detail?.signal?.pattern?.breakLevel, 4)}
                                  description="Livello di breakout del flag."
                                />
                                <InfoRow
                                  name="flagHigh"
                                  value={formatNumber(detail?.signal?.pattern?.flagHigh, 4)}
                                  description="Massimo del flag."
                                />
                                <InfoRow
                                  name="flagLow"
                                  value={formatNumber(detail?.signal?.pattern?.flagLow, 4)}
                                  description="Minimo del flag."
                                />
                                <InfoRow
                                  name="entryBreakout"
                                  value={formatNumber(detail?.signal?.pattern?.entryBreakout, 4)}
                                  description="Entry breakout suggerita."
                                />
                                <InfoRow
                                  name="entryPullback"
                                  value={formatNumber(detail?.signal?.pattern?.entryPullback, 4)}
                                  description="Entry pullback suggerita."
                                />
                                <InfoRow
                                  name="stopLoss"
                                  value={formatNumber(detail?.signal?.pattern?.stopLoss, 4)}
                                  description="Stop loss pattern-based."
                                />
                                <InfoRow
                                  name="tp1"
                                  value={formatNumber(detail?.signal?.pattern?.targets?.tp1, 4)}
                                  description="Target tecnico."
                                />
                                <InfoRow
                                  name="tp2"
                                  value={formatNumber(detail?.signal?.pattern?.targets?.tp2, 4)}
                                  description="Target di trend."
                                />
                                <InfoRow
                                  name="confidence"
                                  value={detail?.signal?.pattern?.confidence ?? "-"}
                                  description="Score di confidenza pattern."
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="mt-2 text-[11px] text-slate-500">Segnale non disponibile.</div>
                        )}
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                        <div className="text-xs font-semibold text-slate-700">Confirm</div>
                        {detail?.confirm ? (
                          <>
                            <div className="mt-2">
                              <InfoRow
                                name="timeframe"
                                value={detail?.confirm?.timeframe || "-"}
                                description="Timeframe di conferma."
                              />
                              <InfoRow
                                name="lookbackDays"
                                value={detail?.confirm?.lookbackDays ?? "-"}
                                description="Periodo storico per la conferma."
                              />
                              <InfoRow
                                name="lookbackBars"
                                value={detail?.confirm?.lookbackBars ?? "-"}
                                description="Numero barre di conferma."
                              />
                              <InfoRow
                                name="atr20"
                                value={formatNumber(detail?.confirm?.atr20, 4)}
                                description="ATR calcolato su timeframe di conferma."
                              />
                              <InfoRow
                                name="eps"
                                value={formatNumber(detail?.confirm?.eps, 4)}
                                description="Eps usato per clustering conferma."
                              />
                              <InfoRow
                                name="window.startDate"
                                value={formatDate(detail?.confirm?.window?.startDate)}
                                description="Inizio dello storico di conferma."
                              />
                              <InfoRow
                                name="window.endDate"
                                value={formatDate(detail?.confirm?.window?.endDate)}
                                description="Fine dello storico di conferma."
                              />
                            </div>
                            <div className="mt-3 text-[11px] text-slate-500">
                              Zone di conferma disponibili: {detail?.confirm?.zones?.length ?? 0}
                            </div>
                          </>
                        ) : (
                          <div className="mt-2 text-[11px] text-slate-500">Conferma non disponibile.</div>
                        )}
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                          <div className="text-xs font-semibold text-slate-700">Recent (1h)</div>
                          {detail?.recent ? (
                            <>
                              <div className="mt-2">
                                <InfoRow
                                  name="timeframe"
                                  value={detail?.recent?.timeframe || "-"}
                                  description="Timeframe recente per livelli operativi."
                                />
                                <InfoRow
                                  name="lookbackDays"
                                  value={detail?.recent?.lookbackDays ?? "-"}
                                  description="Periodo recente analizzato."
                                />
                                <InfoRow
                                  name="lookbackBars"
                                  value={detail?.recent?.lookbackBars ?? "-"}
                                  description="Numero barre recenti."
                                />
                                <InfoRow
                                  name="atr20"
                                  value={formatNumber(detail?.recent?.atr20, 4)}
                                  description="ATR calcolato su timeframe recente."
                                />
                                <InfoRow
                                  name="eps"
                                  value={formatNumber(detail?.recent?.eps, 4)}
                                  description="Eps usato per clustering recente."
                                />
                                <InfoRow
                                  name="window.startDate"
                                  value={formatDate(detail?.recent?.window?.startDate)}
                                  description="Inizio dello storico recente."
                                />
                                <InfoRow
                                  name="window.endDate"
                                  value={formatDate(detail?.recent?.window?.endDate)}
                                  description="Fine dello storico recente."
                                />
                              </div>
                              <div className="mt-3 text-[11px] text-slate-500">
                                Zone recenti disponibili: {detail?.recent?.zones?.length ?? 0}
                              </div>
                            </>
                          ) : (
                            <div className="mt-2 text-[11px] text-slate-500">Dati recenti non disponibili.</div>
                          )}
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                          <div className="text-xs font-semibold text-slate-700">Intraday (1m)</div>
                          {detail?.intraday ? (
                            <>
                              <div className="mt-2">
                                <InfoRow
                                  name="timeframe"
                                  value={detail?.intraday?.timeframe || "-"}
                                  description="Timeframe intraday per livelli rapidi."
                                />
                                <InfoRow
                                  name="lookbackDays"
                                  value={detail?.intraday?.lookbackDays ?? "-"}
                                  description="Periodo intraday analizzato."
                                />
                                <InfoRow
                                  name="lookbackBars"
                                  value={detail?.intraday?.lookbackBars ?? "-"}
                                  description="Numero barre intraday."
                                />
                                <InfoRow
                                  name="atr20"
                                  value={formatNumber(detail?.intraday?.atr20, 4)}
                                  description="ATR calcolato su timeframe intraday."
                                />
                                <InfoRow
                                  name="eps"
                                  value={formatNumber(detail?.intraday?.eps, 4)}
                                  description="Eps usato per clustering intraday."
                                />
                                <InfoRow
                                  name="window.startDate"
                                  value={formatDate(detail?.intraday?.window?.startDate)}
                                  description="Inizio dello storico intraday."
                                />
                                <InfoRow
                                  name="window.endDate"
                                  value={formatDate(detail?.intraday?.window?.endDate)}
                                  description="Fine dello storico intraday."
                                />
                              </div>
                              <div className="mt-3 text-[11px] text-slate-500">
                                Zone intraday disponibili: {detail?.intraday?.zones?.length ?? 0}
                              </div>
                            </>
                          ) : (
                            <div className="mt-2 text-[11px] text-slate-500">Dati intraday non disponibili.</div>
                          )}
                        </div>
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                        <div className="text-xs font-semibold text-slate-700">Debug</div>
                        <div className="mt-2 grid gap-3 md:grid-cols-2">
                          <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                            <div className="text-[11px] font-semibold text-slate-700">Price Debug</div>
                            <InfoRow
                              name="priceRef"
                              value={formatNumber(detail?.priceDebug?.priceRef, 4)}
                              description="Prezzo di riferimento usato."
                            />
                            <InfoRow
                              name="dailyLastClose"
                              value={formatNumber(detail?.priceDebug?.dailyLastClose, 4)}
                              description="Ultimo close daily."
                            />
                            <InfoRow
                              name="recentLastClose"
                              value={formatNumber(detail?.priceDebug?.recentLastClose, 4)}
                              description="Ultimo close 1h."
                            />
                            <InfoRow
                              name="signalLastClose"
                              value={formatNumber(detail?.priceDebug?.signalLastClose, 4)}
                              description="Ultimo close timeframe segnale."
                            />
                            <InfoRow
                              name="providerSymbol"
                              value={detail?.priceDebug?.providerSymbol ?? "-"}
                              description="Symbol usato per richieste candles."
                            />
                          </div>

                          <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                            <div className="text-[11px] font-semibold text-slate-700">ATR Debug</div>
                            <InfoRow
                              name="avgHL"
                              value={formatNumber(detail?.atrDebug?.avgHL, 6)}
                              description="Media high-low (ultime 200 barre)."
                            />
                            <InfoRow
                              name="medianHL"
                              value={formatNumber(detail?.atrDebug?.medianHL, 6)}
                              description="Mediana high-low (ultime 200 barre)."
                            />
                            <InfoRow
                              name="minHL"
                              value={formatNumber(detail?.atrDebug?.minHL, 6)}
                              description="Minimo high-low (ultime 200 barre)."
                            />
                            <InfoRow
                              name="maxHL"
                              value={formatNumber(detail?.atrDebug?.maxHL, 6)}
                              description="Massimo high-low (ultime 200 barre)."
                            />
                            <InfoRow
                              name="avgTR"
                              value={formatNumber(detail?.atrDebug?.avgTR, 6)}
                              description="Media TR (ultime 200 barre)."
                            />
                            <InfoRow
                              name="atrLast"
                              value={formatNumber(detail?.atrDebug?.atrLast, 6)}
                              description="Ultimo ATR (timeframe segnale)."
                            />
                            <InfoRow
                              name="atrTail"
                              value={(detail?.atrDebug?.atrTail || []).map((v: number) => formatNumber(v, 6)).join(", ") || "-"}
                              description="Ultimi 5 ATR."
                            />
                          </div>
                        </div>

                        <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                          <div className="flex items-center justify-between">
                            <div className="text-[11px] font-semibold text-slate-700">Selection Debug</div>
                            <button
                              type="button"
                              className="rounded-full border border-slate-200 bg-white p-1 text-slate-500 hover:text-slate-700"
                              onClick={() => setSelectionDebugOpen((prev) => !prev)}
                              aria-label={selectionDebugOpen ? "Collapse selection debug" : "Expand selection debug"}
                            >
                              <AppIcon
                                icon={selectionDebugOpen ? "mdi:chevron-up" : "mdi:chevron-down"}
                                width={14}
                                height={14}
                              />
                            </button>
                          </div>
                          {selectionDebugOpen && (
                            <div className="mt-2">
                              <InfoRow
                                name="usedAtrForTrading"
                                value={
                                  detail?.selectionDebug?.usedAtrForTrading
                                    ? `${formatNumber(detail?.selectionDebug?.usedAtrForTrading?.value, 6)} (${detail?.selectionDebug?.usedAtrForTrading?.source}/${detail?.selectionDebug?.usedAtrForTrading?.timeframe})`
                                    : "-"
                                }
                                description="ATR usato per entry/SL/TP."
                              />
                              <InfoRow
                                name="usedTimeframeForLevels"
                                value={detail?.selectionDebug?.usedTimeframeForLevels ?? "-"}
                                description="Timeframe usato per livelli."
                              />
                              <InfoRow
                                name="maxLevelDistanceAtr"
                                value={formatNumber(detail?.selectionDebug?.maxLevelDistanceAtr, 2)}
                                description="Soglia massima distanza in ATR per i supporti."
                              />
                              <InfoRow
                                name="supportsWithinAtrCount"
                                value={detail?.selectionDebug?.supportsWithinAtrCount ?? "-"}
                                description="Numero supporti entro la soglia ATR."
                              />
                              <InfoRow
                                name="supportHigherScoreWithinAtr"
                                value={detail?.selectionDebug?.supportHigherScoreWithinAtr ? "YES" : "NO"}
                                description="Esiste un supporto con score maggiore dentro soglia."
                              />
                              <InfoRow
                                name="selectedSupport.midPrice"
                                value={formatNumber(detail?.selectionDebug?.selectedSupport?.midPrice, 4)}
                                description="Supporto selezionato."
                              />
                              <InfoRow
                                name="selectedResistance.midPrice"
                                value={formatNumber(detail?.selectionDebug?.selectedResistance?.midPrice, 4)}
                                description="Resistenza selezionata."
                              />
                              <InfoRow
                                name="distancePct"
                                value={formatPercent(detail?.selectionDebug?.distancePct)}
                                description="Distanza % dal supporto selezionato."
                              />
                              <InfoRow
                                name="distanceAtr"
                                value={formatNumber(detail?.selectionDebug?.distanceAtr, 4)}
                                description="Distanza in ATR dal supporto selezionato."
                              />
                            </div>
                          )}
                        </div>

                        <div className="mt-3 grid gap-3 md:grid-cols-2">
                          <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                            <div className="text-[11px] font-semibold text-slate-700">Supports Top 5</div>
                            <div className="mt-2 overflow-auto">
                              <table className="min-w-full divide-y divide-slate-200 text-[10px]">
                                <thead className="bg-white text-left text-[10px] uppercase tracking-wide text-slate-500">
                                  <tr>
                                    <th className="px-2 py-1">Mid</th>
                                    <th className="px-2 py-1">Low</th>
                                    <th className="px-2 py-1">High</th>
                                    <th className="px-2 py-1">Score</th>
                                    <th className="px-2 py-1">Touches</th>
                                    <th className="px-2 py-1">Recency</th>
                                    <th className="px-2 py-1">Source</th>
                                    <th className="px-2 py-1">TF</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {(detail?.selectionDebug?.supportsTop5 || []).map((zone: any, idx: number) => (
                                    <tr key={`support-${idx}`} className="hover:bg-white/50">
                                      <td className="px-2 py-1">{formatNumber(zone.midPrice, 4)}</td>
                                      <td className="px-2 py-1">{formatNumber(zone.low, 4)}</td>
                                      <td className="px-2 py-1">{formatNumber(zone.high, 4)}</td>
                                      <td className="px-2 py-1">{formatNumber(zone.score, 3)}</td>
                                      <td className="px-2 py-1">{zone.touches ?? "-"}</td>
                                      <td className="px-2 py-1">{zone.recencyBars ?? "-"}</td>
                                      <td className="px-2 py-1">{zone.source ?? "-"}</td>
                                      <td className="px-2 py-1">{zone.timeframe ?? "-"}</td>
                                    </tr>
                                  ))}
                                  {(!detail?.selectionDebug?.supportsTop5 || detail?.selectionDebug?.supportsTop5?.length === 0) && (
                                    <tr>
                                      <td className="px-2 py-1 text-slate-500" colSpan={8}>
                                        Nessun supporto.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                            <div className="text-[11px] font-semibold text-slate-700">Resistances Top 5</div>
                            <div className="mt-2 overflow-auto">
                              <table className="min-w-full divide-y divide-slate-200 text-[10px]">
                                <thead className="bg-white text-left text-[10px] uppercase tracking-wide text-slate-500">
                                  <tr>
                                    <th className="px-2 py-1">Mid</th>
                                    <th className="px-2 py-1">Low</th>
                                    <th className="px-2 py-1">High</th>
                                    <th className="px-2 py-1">Score</th>
                                    <th className="px-2 py-1">Touches</th>
                                    <th className="px-2 py-1">Recency</th>
                                    <th className="px-2 py-1">Source</th>
                                    <th className="px-2 py-1">TF</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {(detail?.selectionDebug?.resistancesTop5 || []).map((zone: any, idx: number) => (
                                    <tr key={`res-${idx}`} className="hover:bg-white/50">
                                      <td className="px-2 py-1">{formatNumber(zone.midPrice, 4)}</td>
                                      <td className="px-2 py-1">{formatNumber(zone.low, 4)}</td>
                                      <td className="px-2 py-1">{formatNumber(zone.high, 4)}</td>
                                      <td className="px-2 py-1">{formatNumber(zone.score, 3)}</td>
                                      <td className="px-2 py-1">{zone.touches ?? "-"}</td>
                                      <td className="px-2 py-1">{zone.recencyBars ?? "-"}</td>
                                      <td className="px-2 py-1">{zone.source ?? "-"}</td>
                                      <td className="px-2 py-1">{zone.timeframe ?? "-"}</td>
                                    </tr>
                                  ))}
                                  {(!detail?.selectionDebug?.resistancesTop5 || detail?.selectionDebug?.resistancesTop5?.length === 0) && (
                                    <tr>
                                      <td className="px-2 py-1 text-slate-500" colSpan={8}>
                                        Nessuna resistenza.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                          <div className="text-[11px] font-semibold text-slate-700">Resistance Debug</div>
                          <InfoRow
                            name="countResistancesAbovePrice"
                            value={detail?.resistanceDebug?.countResistancesAbovePrice ?? "-"}
                            description="Numero resistenze sopra priceRef."
                          />
                          <div className="mt-2 overflow-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-[10px]">
                              <thead className="bg-white text-left text-[10px] uppercase tracking-wide text-slate-500">
                                <tr>
                                  <th className="px-2 py-1">Mid</th>
                                  <th className="px-2 py-1">Source</th>
                                  <th className="px-2 py-1">Score</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {(detail?.resistanceDebug?.top5 || []).map((zone: any, idx: number) => (
                                  <tr key={`res-top-${idx}`} className="hover:bg-white/50">
                                    <td className="px-2 py-1">{formatNumber(zone.midPrice, 4)}</td>
                                    <td className="px-2 py-1">{zone.source ?? "-"}</td>
                                    <td className="px-2 py-1">{formatNumber(zone.score, 3)}</td>
                                  </tr>
                                ))}
                                {(!detail?.resistanceDebug?.top5 || detail?.resistanceDebug?.top5?.length === 0) && (
                                  <tr>
                                    <td className="px-2 py-1 text-slate-500" colSpan={3}>
                                      Nessuna resistenza sopra priceRef.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                          <div className="text-[11px] font-semibold text-slate-700">Pattern Trend Debug</div>
                          <InfoRow
                            name="ema20Last"
                            value={formatNumber(detail?.signal?.pattern?.debug?.trend?.ema20Last, 4)}
                            description="EMA20 ultimo valore."
                          />
                          <InfoRow
                            name="ema50Last"
                            value={formatNumber(detail?.signal?.pattern?.debug?.trend?.ema50Last, 4)}
                            description="EMA50 ultimo valore."
                          />
                          <InfoRow
                            name="emaSpreadPct"
                            value={formatPercent(detail?.signal?.pattern?.debug?.trend?.emaSpreadPct)}
                            description="Differenza % EMA20/EMA50."
                          />
                          <InfoRow
                            name="aboveEma20Count"
                            value={detail?.signal?.pattern?.debug?.trend?.aboveEma20Count ?? "-"}
                            description="Numero barre sopra EMA20."
                          />
                          <InfoRow
                            name="consideredBars"
                            value={detail?.signal?.pattern?.debug?.trend?.consideredBars ?? "-"}
                            description="Barre considerate nel trend filter."
                          />
                          {detail?.signal?.pattern?.debug?.last12 && (
                            <div className="mt-2">
                              <div className="text-[11px] font-semibold text-slate-700">Last 12 bars</div>
                              <div className="mt-2 overflow-auto">
                                <table className="min-w-full divide-y divide-slate-200 text-[10px]">
                                  <thead className="bg-white text-left text-[10px] uppercase tracking-wide text-slate-500">
                                    <tr>
                                      <th className="px-2 py-1">Time</th>
                                      <th className="px-2 py-1">Close</th>
                                      <th className="px-2 py-1">EMA20</th>
                                      <th className="px-2 py-1">Above</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {detail.signal.pattern.debug.last12.map((row: any, idx: number) => (
                                      <tr key={`last12-${idx}`} className="hover:bg-white/50">
                                        <td className="px-2 py-1">{formatDateTime(row?.t)}</td>
                                        <td className="px-2 py-1">{formatNumber(row?.close, 4)}</td>
                                        <td className="px-2 py-1">{formatNumber(row?.ema20, 4)}</td>
                                        <td className="px-2 py-1">{row?.above ? "YES" : "NO"}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
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
                    const params = new URLSearchParams();
                    if (l2DeleteTarget?.type === "symbol" && l2DeleteTarget.symbol) {
                      params.set("symbol", l2DeleteTarget.symbol);
                    } else if (l2DeleteTarget?.type === "file" && l2DeleteTarget.symbol) {
                      params.set("symbol", l2DeleteTarget.symbol);
                      if (l2DeleteTarget.tf) params.set("file", l2DeleteTarget.tf);
                    }
                    const url = `${env.apiBaseUrl}/cachemanager/l2/clear${
                      params.toString() ? `?${params.toString()}` : ""
                    }`;
                    const res = await fetch(url, {
                      method: "POST",
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

      {showL2FileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div>
                <div className="text-base font-semibold text-slate-900">{l2FileName || "L2 file"}</div>
                <div className="text-[11px] text-slate-500">
                  {l2FileMeta?.createdAt ? `Created ${formatDate(l2FileMeta.createdAt)}` : "Created -"}
                  {l2FileMeta?.updatedAt ? ` · Updated ${formatDate(l2FileMeta.updatedAt)}` : " · Updated -"}
                  {l2FileMeta?.createdAt &&
                  l2FileMeta?.updatedAt &&
                  new Date(l2FileMeta.createdAt).getTime() !== new Date(l2FileMeta.updatedAt).getTime() ? (
                    <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                      UPDATED
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-4 py-4 text-xs text-slate-700">
              {l2FileStatus === "loading" && <div className="text-[11px] text-slate-500">Caricamento...</div>}
              {l2FileStatus === "error" && l2FileError && (
                <Alert message={l2FileError} tone="error" onClose={() => setL2FileError(null)} />
              )}
              {l2FileStatus === "idle" && l2FileData && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[11px]">
                    <button
                      className={`rounded-md px-3 py-1 text-xs font-semibold ${
                        l2FileTab === "json"
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                      onClick={() => setL2FileTab("json")}
                    >
                      JSON
                    </button>
                    <button
                      className={`rounded-md px-3 py-1 text-xs font-semibold ${
                        l2FileTab === "table"
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                      onClick={() => setL2FileTab("table")}
                    >
                      Table
                    </button>
                  </div>
                  {l2FileTab === "json" && !l2FileEditing && (
                    <pre className="rounded-md bg-slate-50 px-3 py-2 text-[10px] text-slate-800">
                      {JSON.stringify(l2FileData, null, 2)}
                    </pre>
                  )}
                  {l2FileTab === "json" && l2FileEditing && (
                    <textarea
                      className="h-96 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-800 focus:border-blue-400 focus:outline-none"
                      value={l2FileDraft}
                      onChange={(e) => setL2FileDraft(e.target.value)}
                    />
                  )}
                  {l2FileTab === "table" && (
                    <div className="overflow-auto rounded-md border border-slate-200 bg-white">
                      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-3 py-2 text-[11px] text-slate-600">
                        <span>
                          <span className="font-semibold">Symbol:</span> {l2FileRequest?.symbol || "-"}
                        </span>
                        <span>
                          <span className="font-semibold">TF:</span> {l2FileRequest?.tf || "-"}
                        </span>
                        <span>
                          <span className="font-semibold">conid:</span>{" "}
                          {l2FileData?.conid || l2FileData?.[0]?.conid || "-"}
                        </span>
                      </div>
                      {Array.isArray(l2FileData) && l2FileData.length > 0 ? (
                        <table className="min-w-full divide-y divide-slate-200 text-xs">
                          <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
                            <tr>
                              <th className="px-3 py-2 font-semibold">
                                <div className="flex flex-col gap-1">
                                  <span>Time</span>
                                  <input
                                    type="text"
                                    className="w-32 rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 focus:border-blue-400 focus:outline-none"
                                    placeholder="Filter time"
                                    value={l2FileTimeFilter}
                                    onChange={(e) => setL2FileTimeFilter(e.target.value)}
                                  />
                                </div>
                              </th>
                              <th className="px-3 py-2 font-semibold">Open</th>
                              <th className="px-3 py-2 font-semibold">High</th>
                              <th className="px-3 py-2 font-semibold">Low</th>
                              <th className="px-3 py-2 font-semibold">Close</th>
                              <th className="px-3 py-2 font-semibold">Volume</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {(l2FileTableDraft || l2FileData)
                              .filter((row: any) => {
                                if (!l2FileTimeFilter.trim()) return true;
                                const raw = row.t || row.time || row.date || "";
                                return String(raw).includes(l2FileTimeFilter.trim());
                              })
                              .map((row: any, idx: number) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                  <td className="px-3 py-2 text-slate-800">
                                    {l2FileEditing ? (
                                      <input
                                        className="w-32 rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700"
                                        value={row.t ?? row.time ?? row.date ?? ""}
                                        onChange={(e) => {
                                          setL2FileTableDraft((prev) => {
                                            if (!Array.isArray(prev)) return prev;
                                            const next = [...prev];
                                            next[idx] = { ...next[idx], t: e.target.value };
                                            return next;
                                          });
                                        }}
                                      />
                                    ) : (
                                      row.t || row.time || row.date || "-"
                                    )}
                                  </td>
                                  <td className="px-3 py-2 text-slate-800">
                                    {l2FileEditing ? (
                                      <input
                                        className="w-20 rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700"
                                        value={row.o ?? row.open ?? ""}
                                        onChange={(e) => {
                                          setL2FileTableDraft((prev) => {
                                            if (!Array.isArray(prev)) return prev;
                                            const next = [...prev];
                                            next[idx] = { ...next[idx], o: e.target.value };
                                            return next;
                                          });
                                        }}
                                      />
                                    ) : (
                                      row.o ?? row.open ?? "-"
                                    )}
                                  </td>
                                  <td className="px-3 py-2 text-slate-800">
                                    {l2FileEditing ? (
                                      <input
                                        className="w-20 rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700"
                                        value={row.h ?? row.high ?? ""}
                                        onChange={(e) => {
                                          setL2FileTableDraft((prev) => {
                                            if (!Array.isArray(prev)) return prev;
                                            const next = [...prev];
                                            next[idx] = { ...next[idx], h: e.target.value };
                                            return next;
                                          });
                                        }}
                                      />
                                    ) : (
                                      row.h ?? row.high ?? "-"
                                    )}
                                  </td>
                                  <td className="px-3 py-2 text-slate-800">
                                    {l2FileEditing ? (
                                      <input
                                        className="w-20 rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700"
                                        value={row.l ?? row.low ?? ""}
                                        onChange={(e) => {
                                          setL2FileTableDraft((prev) => {
                                            if (!Array.isArray(prev)) return prev;
                                            const next = [...prev];
                                            next[idx] = { ...next[idx], l: e.target.value };
                                            return next;
                                          });
                                        }}
                                      />
                                    ) : (
                                      row.l ?? row.low ?? "-"
                                    )}
                                  </td>
                                  <td className="px-3 py-2 text-slate-800">
                                    {l2FileEditing ? (
                                      <input
                                        className="w-20 rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700"
                                        value={row.c ?? row.close ?? ""}
                                        onChange={(e) => {
                                          setL2FileTableDraft((prev) => {
                                            if (!Array.isArray(prev)) return prev;
                                            const next = [...prev];
                                            next[idx] = { ...next[idx], c: e.target.value };
                                            return next;
                                          });
                                        }}
                                      />
                                    ) : (
                                      row.c ?? row.close ?? "-"
                                    )}
                                  </td>
                                  <td className="px-3 py-2 text-slate-800">
                                    {l2FileEditing ? (
                                      <input
                                        className="w-20 rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700"
                                        value={row.v ?? row.volume ?? ""}
                                        onChange={(e) => {
                                          setL2FileTableDraft((prev) => {
                                            if (!Array.isArray(prev)) return prev;
                                            const next = [...prev];
                                            next[idx] = { ...next[idx], v: e.target.value };
                                            return next;
                                          });
                                        }}
                                      />
                                    ) : (
                                      row.v ?? row.volume ?? "-"
                                    )}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="px-3 py-2 text-[11px] text-slate-500">
                          Nessun dato tabellare disponibile.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-3">
              <BaseButton
                variant="solid"
                color="primary"
                disabled={l2FileStatus === "loading" || !l2FileData}
                onClick={async () => {
                  if (!l2FileEditing) {
                    setL2FileDraft(JSON.stringify(l2FileData, null, 2));
                    setL2FileTableDraft(Array.isArray(l2FileData) ? [...l2FileData] : null);
                    setL2FileEditing(true);
                    return;
                  }
                  if (!l2FileRequest) return;
                  try {
                    const payload = l2FileTab === "table" && Array.isArray(l2FileTableDraft)
                      ? l2FileTableDraft
                      : JSON.parse(l2FileDraft);
                    setL2FileStatus("loading");
                    const token =
                      typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
                    const params = new URLSearchParams(l2FileRequest).toString();
                    const putRes = await fetch(`${env.apiBaseUrl}/cachemanager/l2/file?${params}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                      },
                      body: JSON.stringify(payload),
                    });
                    const putData = await putRes.json().catch(() => ({}));
                    if (!putRes.ok || putData?.ok === false) {
                      throw new Error(putData?.error || putData?.message || "Errore salvataggio file");
                    }
                    const getRes = await fetch(`${env.apiBaseUrl}/cachemanager/l2/file?${params}`, {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                      },
                    });
                    const getData = await getRes.json().catch(() => ({}));
                    if (!getRes.ok || getData?.ok === false) {
                      throw new Error(getData?.error || getData?.message || "Errore ricarica file");
                    }
                    setL2FileData(getData?.data ?? getData);
                    setL2FileMeta(getData?.meta ?? null);
                    setL2FileEditing(false);
                    setL2FileStatus("idle");
                  } catch (err: any) {
                    setL2FileStatus("error");
                    setL2FileError(err?.message || "Errore salvataggio file");
                  }
                }}
              >
                {l2FileEditing ? "Save" : "Edit"}
              </BaseButton>
              <BaseButton
                variant="outline"
                color="neutral"
                onClick={() => {
                  setShowL2FileModal(false);
                  setL2FileData(null);
                  setL2FileError(null);
                  setL2FileStatus("idle");
                  setL2FileName(null);
                  setL2FileMeta(null);
                  setL2FileEditing(false);
                  setL2FileDraft("");
                  setL2FileRequest(null);
                  setL2FileTableDraft(null);
                }}
              >
                Close
              </BaseButton>
            </div>
          </div>
        </div>
      )}

      {showL2AuditModal && l2AuditResult?.summary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-xl bg-white p-5 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-base font-semibold text-slate-900">L2 Hygiene Result</div>
                <div className="text-[11px] text-slate-500">
                  {l2AuditTarget ? `Target: ${l2AuditTarget}` : "Target: ALL"} ·{" "}
                  {l2AuditLastRunAt ? formatDate(l2AuditLastRunAt) : "-"}
                </div>
              </div>
              <button
                type="button"
                className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => setShowL2AuditModal(false)}
              >
                Close
              </button>
            </div>
            <div className="space-y-3 text-[11px] text-slate-700">
              <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="font-semibold">Summary</div>
                <div className="mt-1 text-[11px] text-slate-600">
                  Symbols: {l2AuditResult.summary.totalSymbols} · Files: {l2AuditResult.summary.totalFiles} ·
                  Candles: {l2AuditResult.summary.totalCandles} · Valid: {l2AuditResult.summary.validCandles} ·
                  Broken: {l2AuditResult.summary.brokenCandles}
                </div>
                <div className="mt-1 text-[11px] text-slate-600">
                  Range: {formatDate(l2AuditResult.summary.timeRange?.start)} →{" "}
                  {formatDate(l2AuditResult.summary.timeRange?.end)}
                </div>
              </div>

              <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="font-semibold">Broken reasons</div>
                <div className="mt-1 text-[11px] text-slate-600">
                  invalid_t: {l2AuditResult.summary.brokenReasons?.invalid_t ?? 0} · invalid_ohlc:{" "}
                  {l2AuditResult.summary.brokenReasons?.invalid_ohlc ?? 0} · invalid_json:{" "}
                  {l2AuditResult.summary.brokenReasons?.invalid_json ?? 0} · not_array:{" "}
                  {l2AuditResult.summary.brokenReasons?.not_array ?? 0}
                </div>
              </div>

              <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="font-semibold">Top broken files</div>
                <div className="mt-2 overflow-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-[10px]">
                    <thead className="bg-white text-left text-[10px] uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-2 py-1">File</th>
                        <th className="px-2 py-1">Symbol</th>
                        <th className="px-2 py-1">TF</th>
                        <th className="px-2 py-1">Broken</th>
                        <th className="px-2 py-1">Broken %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(l2AuditResult.summary.topBrokenFiles || []).map((row: any, idx: number) => (
                        <tr key={`broken-modal-${idx}`} className="hover:bg-white/50">
                          <td className="px-2 py-1 text-slate-700">{row.file}</td>
                          <td className="px-2 py-1 text-slate-700">{row.symbol}</td>
                          <td className="px-2 py-1 text-slate-700">{row.tf}</td>
                          <td className="px-2 py-1 text-slate-700">{row.broken}</td>
                          <td className="px-2 py-1 text-slate-700">{row.brokenPct?.toFixed?.(1) ?? "-"}</td>
                        </tr>
                      ))}
                      {(!l2AuditResult.summary.topBrokenFiles ||
                        l2AuditResult.summary.topBrokenFiles.length === 0) && (
                        <tr>
                          <td colSpan={5} className="px-2 py-1 text-slate-500">
                            Nessun file problematico.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
