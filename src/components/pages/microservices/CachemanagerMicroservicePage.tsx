import React, { useCallback, useEffect, useMemo, useState } from "react";
import MicroserviceGeneralTab from "../../molecules/microservice/MicroserviceGeneralTab";
import BaseButton from "../../atoms/base/buttons/BaseButton";
import AppIcon from "../../atoms/icon/AppIcon";
import ReactApexChart from "react-apexcharts";
import { env } from "../../../config/env";
import { redisWsBridgeClient } from "../../../services/ws/redisWsBridgeClient";

// Tipi per lo stato dei componenti
type Status = "idle" | "loading" | "error";

// Tipo per i target di cancellazione cache
type L3Target =
  | { type: "all" }
  | { type: "symbol"; symbol: string }
  | { type: "file"; symbol: string; tf: string };

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

// Tipo per le props dell'Alert component
type AlertProps = {
  message: string;
  tone?: "error" | "warn" | "success";
  onClose?: () => void;
};

/**
 * Componente Alert per mostrare messaggi di errore/warning/successo
 */
const Alert = ({ message, tone = "error", onClose }: AlertProps) => {
  const palette =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "warn"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-red-200 bg-red-50 text-red-700";
  return (
    <div className={`relative rounded-md border ${palette} px-3 py-2 text-xs pr-8`}>
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

/**
 * Formatta i bytes in una stringa leggibile (KB, MB, GB, ecc.)
 */
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

/**
 * Determina il colore della barra di progresso in base alla percentuale
 */
const progressColor = (percent: number) => {
  if (percent >= 85) return "bg-red-500";
  if (percent >= 75) return "bg-amber-600";
  if (percent >= 65) return "bg-amber-400";
  if (percent >= 50) return "bg-yellow-400";
  return "bg-emerald-500";
};

/**
 * Calcola ricorsivamente i bytes totali di un nodo (file o directory)
 */
const getNodeBytes = (node: any): number => {
  if (!node) return 0;
  const directBytes = typeof node.size === "number" ? node.size : 0;
  if (!Array.isArray(node.files)) return directBytes;
  const childBytes = node.files.reduce((sum: number, child: any) => sum + getNodeBytes(child), 0);
  return directBytes + childBytes;
};

/**
 * Formatta una data/ora in formato leggibile italiano
 */
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

const parseQualityRowDetails = (row: any) => {
  if (!row) return null;
  if (row._details && typeof row._details === "object") return row._details;
  if (typeof row.details_json === "string") {
    try {
      return JSON.parse(row.details_json);
    } catch {
      return null;
    }
  }
  if (row.details_json && typeof row.details_json === "object") return row.details_json;
  return null;
};

const qualityRowMatchesFileMonth = (row: any, year?: string, month?: string) => {
  if (!year || !month) return true;
  const targetMonth = `${year}-${month}`;
  const rangeFromMonth = typeof row?.range_from === "string" ? row.range_from.slice(0, 7) : "";
  const rangeToMonth = typeof row?.range_to === "string" ? row.range_to.slice(0, 7) : "";
  if (rangeFromMonth === targetMonth || rangeToMonth === targetMonth) return true;

  const details = parseQualityRowDetails(row);
  const missingMonths: string[] = details?.details?.missing_months ?? [];
  if (missingMonths.includes(targetMonth)) return true;

  const gapMonths: { month?: string }[] = details?.details?.gap_months ?? [];
  if (gapMonths.some((item) => item?.month === targetMonth)) return true;

  return false;
};

const parseCandleTimestamp = (row: any): Date | null => {
  const raw = row?.t ?? row?.time ?? row?.date;
  if (raw == null) return null;
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) return raw;
  if (typeof raw === "number") {
    const ms = raw > 1e12 ? raw : raw * 1000;
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(String(raw));
  return Number.isNaN(d.getTime()) ? null : d;
};

const toUtcDateKey = (date: Date) => {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const diffUtcDays = (left: Date, right: Date) =>
  Math.round((right.getTime() - left.getTime()) / (24 * 60 * 60 * 1000));

const addUtcDays = (date: Date, days: number) => new Date(date.getTime() + days * 24 * 60 * 60 * 1000);

const round1 = (value: number) => Math.round(value * 10) / 10;

/** Numero atteso di barre per giorno di trading per ogni TF (NYSE 9:30-16:00 = 6.5h) */
const barsPerDayForTf = (tf: string): number => {
  const t = tf.toLowerCase();
  if (t === "1min")  return 390;
  if (t === "5min")  return 78;
  if (t === "15min") return 26;
  if (t === "30min") return 13;
  if (t === "1h" || t === "1hour") return 7;
  if (t === "2h" || t === "2hour") return 4;
  if (t === "4h" || t === "4hour") return 2;
  return 1; // 1day, 1week, 1month
};

const computeWeeklyFileQuality = (rows: any[], year?: string, month?: string) => {
  if (!year || !month || !Array.isArray(rows)) return null;
  const targetMonth = `${year}-${month}`;
  const dateMap = new Map<string, Date>();
  for (const row of rows) {
    const ts = parseCandleTimestamp(row);
    if (!ts) continue;
    const key = toUtcDateKey(ts);
    if (!dateMap.has(key)) dateMap.set(key, ts);
  }

  const dates = Array.from(dateMap.values()).sort((a, b) => a.getTime() - b.getTime());
  const inMonth = dates.filter((date) => toUtcDateKey(date).slice(0, 7) === targetMonth);
  const outOfMonth = dates.filter((date) => toUtcDateKey(date).slice(0, 7) !== targetMonth);

  const gapDates: string[] = [];
  for (let i = 1; i < inMonth.length; i += 1) {
    const prev = inMonth[i - 1];
    const curr = inMonth[i];
    const days = diffUtcDays(prev, curr);
    if (days <= 10) continue;
    let probe = addUtcDays(prev, 7);
    while (probe.getTime() < curr.getTime()) {
      const key = toUtcDateKey(probe);
      if (key.slice(0, 7) === targetMonth) gapDates.push(key);
      probe = addUtcDays(probe, 7);
    }
  }

  const countPenalty = inMonth.length < 4 ? 4 - inMonth.length : inMonth.length > 5 ? inMonth.length - 5 : 0;
  const outsidePenalty = outOfMonth.length;
  const gapsFound = gapDates.length + countPenalty + outsidePenalty;
  const expected = Math.max(4, Math.min(5, inMonth.length + gapDates.length + countPenalty));
  const completeness = expected > 0 ? Math.min(100, (inMonth.length / expected) * 100) : 0;
  const gapScore = gapsFound === 0 ? 100 : Math.max(0, 100 - (gapsFound / expected) * 100);
  const qualityScore = gapsFound === 0 ? 100 : round1(completeness * 0.6 + gapScore * 0.4);
  const missingMonths = inMonth.length === 0 ? [targetMonth] : [];

  return {
    source: "local_file",
    tf: "1week",
    quality_score: qualityScore,
    quality_score_post_heal: qualityScore,
    completeness: round1(completeness),
    gap_score: round1(gapScore),
    months_ok: gapsFound === 0 ? 1 : 0,
    months_checked: 1,
    trading_days_present: inMonth.length,
    trading_days_expected: expected,
    gaps_found: gapsFound,
    gaps_healed: 0,
    gaps_unhealed: gapsFound,
    check_date: new Date().toISOString(),
    range_from: inMonth[0] ? toUtcDateKey(inMonth[0]) : `${targetMonth}-01`,
    range_to: inMonth[inMonth.length - 1] ? toUtcDateKey(inMonth[inMonth.length - 1]) : `${targetMonth}-31`,
    _details: {
      details: {
        gap_months: gapDates.length > 0 ? [{ month: targetMonth, gaps: gapDates }] : [],
        missing_months: missingMonths,
      },
    },
    _localNote:
      gapsFound === 0
        ? "Score calcolato localmente sul file weekly aperto."
        : "Score calcolato localmente sul file weekly aperto; il backend sta ancora fornendo un aggregato symbol/tf.",
  };
};

/**
 * Componente per la gestione della pagina del microservizio Cachemanager
 *
 * Questo componente gestisce 5 tabs:
 * - Tab "General Settings": impostazioni comuni (DB Logger, Log Level, Data Provider, Communication Channels, Logs)
 * - Tab "Specific": strumenti specifici per recuperare candles dai vari provider
 * - Tab "Cache (L3)": gestione della cache Redis con visualizzazione keys e cancellazione
 * - Tab "L2": gestione della cache su file system con tree view e audit
 * - Tab "L2-hygiene": risultati dell'audit di hygiene della cache L2
 */
export default function CachemanagerMicroservicePage({
  onReleaseChange,
  onHealthChange,
  onOpenReleaseModal,
}: Props) {
  // Gestione tab attivo
  const [activeTab, setActiveTab] = useState<"general" | "specific" | "cache" | "l2" | "l2-hygiene">("general");

  // ========== STATO PER TAB "SPECIFIC" (Get Candle) ==========

  // Campi del form per recuperare le candles
  const [candleSymbol, setCandleSymbol] = useState("");
  const [candleExchange, setCandleExchange] = useState("");
  const [candleStart, setCandleStart] = useState("");
  const [candleEnd, setCandleEnd] = useState("");
  const [candleTf, setCandleTf] = useState("1d");

  // Stato della richiesta candles
  const [candleStatus, setCandleStatus] = useState<Status>("idle");
  const [candleError, setCandleError] = useState<string | null>(null);
  const [candleRows, setCandleRows] = useState<any[]>([]);
  const [candleTab, setCandleTab] = useState<"table" | "chart">("table");

  // Stato del provider di dati (gestito anche nel tab General tramite MicroserviceGeneralTab)
  const [provider, setProvider] = useState<"FMP" | "ALPACA" | "IBKR" | "">("");
  const [providerStatus, setProviderStatus] = useState<Status>("idle");
  const [providerError, setProviderError] = useState<string | null>(null);

  // ========== STATO PER TAB "CACHE" (L3 - Redis) ==========

  const [l3Size, setL3Size] = useState<any>(null);
  const [l3Status, setL3Status] = useState<Status>("idle");
  const [l3Error, setL3Error] = useState<string | null>(null);
  const [showL3Confirm, setShowL3Confirm] = useState(false);
  const [l3DeleteTarget, setL3DeleteTarget] = useState<L3Target | null>(null);
  const [l3Expanded, setL3Expanded] = useState<Record<string, boolean>>({});

  // ========== STATO PER TAB "L2" (File System Cache) ==========

  const [l2Size, setL2Size] = useState<any>(null);
  const [l2Status, setL2Status] = useState<Status>("idle");
  const [l2Error, setL2Error] = useState<string | null>(null);
  const [l2Expanded, setL2Expanded] = useState<Record<string, boolean>>({});
  const [l2TfExpanded, setL2TfExpanded] = useState<Record<string, boolean>>({});
  const [l2Letter, setL2Letter] = useState<string | null>(null);
  const [l2Search, setL2Search] = useState<string>("");
  const [showL2Confirm, setShowL2Confirm] = useState(false);
  const [l2DeleteTarget, setL2DeleteTarget] = useState<L3Target | null>(null);

  // Stato per l'audit L2
  const [l2AuditStatus, setL2AuditStatus] = useState<Status>("idle");
  const [l2AuditError, setL2AuditError] = useState<string | null>(null);
  const [l2AuditResult, setL2AuditResult] = useState<any>(null);
  const [l2AuditTarget, setL2AuditTarget] = useState<string | null>(null);
  const [l2AuditLastRunAt, setL2AuditLastRunAt] = useState<string | null>(null);
  const [, setShowL2AuditModal] = useState(false);

  // ========== STATO PER TAB "L2-HYGIENE" — Heal ==========
  const [healSymbol, setHealSymbol] = useState<string>("");
  const [healTf, setHealTf] = useState<string>("1day");
  const [healDaysBack, setHealDaysBack] = useState<string>("60");
  const [healDryRun, setHealDryRun] = useState<boolean>(false);
  const [healStatus, setHealStatus] = useState<Status>("idle");
  const [healError, setHealError] = useState<string | null>(null);
  const [healJobs, setHealJobs] = useState<any[]>([]);
  const [healJobsStatus, setHealJobsStatus] = useState<Status>("idle");
  const [healPolling, setHealPolling] = useState<string | null>(null);

  // Accordion gap days nella modal qualità
  const [l2GapYearsExp, setL2GapYearsExp] = useState<Record<string, boolean>>({});
  const [l2GapMonthsExp, setL2GapMonthsExp] = useState<Record<string, boolean>>({});
  // Stato fetch per singola candela mancante
  const [l2GapFetchStatus, setL2GapFetchStatus] = useState<Record<string, "loading" | "ok" | "error">>({});
  const [l2GapFetchError, setL2GapFetchError] = useState<Record<string, string>>({});
  // Ultimo run aggregato da cache_quality_runs
  const [l2QualityRun, setL2QualityRun] = useState<any | null>(null);
  // Filtro: mostra solo symbol con score < 100
  const [l2FilterBelowMax, setL2FilterBelowMax] = useState(false);
  const [l2EtfSymbols, setL2EtfSymbols] = useState<Set<string>>(new Set());

  // Score per symbol da GET /l2/quality?level=symbols (dato autorevole dal backend)
  const [l2QualitySymbols, setL2QualitySymbols] = useState<Record<string, { min_score: number; avg_score: number; total_missing: number; files_count: number }>>({});
  // Score per file da GET /l2/quality?level=files&symbol=X (caricato lazy all'apertura del symbol)
  const [l2QualityFiles, setL2QualityFiles] = useState<Record<string, any[]>>({});
  const [l2QualityFilesLoading, setL2QualityFilesLoading] = useState<Record<string, boolean>>({});
  // Full scan
  const [scanDaysBack, setScanDaysBack] = useState<Record<string, string>>({ "1day": "365", "1h": "60", "4h": "90", "30min": "30", "15min": "30", "5min": "14", "1min": "7" });
  const [scanDryRun, setScanDryRun] = useState<boolean>(false);
  const [scanStatus, setScanStatus] = useState<Status>("idle");
  const [scanError, setScanError] = useState<string | null>(null);

  // ── Storico run da DB ──────────────────────────────────
  const [dbRuns, setDbRuns] = useState<any[]>([]);
  const [dbRunsStatus, setDbRunsStatus] = useState<Status>("idle");
  const [dbRunsExpanded, setDbRunsExpanded] = useState<Record<string, boolean>>({});
  const [dbRunScores, setDbRunScores] = useState<Record<string, any[]>>({});
  const [dbRunScoresStatus, setDbRunScoresStatus] = useState<Record<string, Status>>({});

  const [showL2FileModal, setShowL2FileModal] = useState(false);
  const [l2FileName, setL2FileName] = useState<string | null>(null);
  const [l2FileStatus, setL2FileStatus] = useState<Status>("idle");
  const [l2FileError, setL2FileError] = useState<string | null>(null);
  const [l2FileData, setL2FileData] = useState<any>(null);
  const [l2FileMeta, setL2FileMeta] = useState<any>(null);
  const [l2FileRequest, setL2FileRequest] = useState<Record<string, string> | null>(null);
  const [l2FileTab, setL2FileTab] = useState<"json" | "table">("json");
  const [l2FileTimeFilter, setL2FileTimeFilter] = useState<string>("");
  const [l2FileQuality, setL2FileQuality] = useState<any | null>(null);
  const [l2FileQualityStatus, setL2FileQualityStatus] = useState<Status>("idle");
  const [l2FileQualityNote, setL2FileQualityNote] = useState<string | null>(null);

  // ========== USE EFFECTS ==========

  // Carica L3 size all'avvio del componente
  useEffect(() => {
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
  }, []);

  // Carica L2 size quando si apre il tab L2
  useEffect(() => {
    if (activeTab !== "l2") return;
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
  }, [activeTab]);

  // ========== HANDLERS ==========

  /**
   * Handler per eseguire l'audit L2 (hygiene check)
   */
  const runL2Audit = useCallback(async ({ symbol, tf }: { symbol?: string; tf?: string } = {}) => {
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
  }, []);

  const fetchHealJobs = useCallback(async () => {
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    setHealJobsStatus("loading");
    try {
      const res = await fetch(`${env.apiBaseUrl}/cachemanager/l2/heal/jobs`, {
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) throw new Error(data?.error || "Errore lista job");
      setHealJobs(data?.data ?? []);
      setHealJobsStatus("idle");
    } catch {
      setHealJobsStatus("idle");
    }
  }, []);

  const startHeal = useCallback(async () => {
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    setHealStatus("loading");
    setHealError(null);
    try {
      const body: Record<string, any> = {
        tf: healTf,
        from_days_back: parseInt(healDaysBack, 10) || 60,
        heal: true,
        dry_run: healDryRun,
      };
      if (healSymbol.trim()) body.symbol = healSymbol.trim().toUpperCase();
      const res = await fetch(`${env.apiBaseUrl}/cachemanager/l2/heal`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) throw new Error(data?.error || "Errore avvio heal");
      setHealStatus("idle");
      await fetchHealJobs();
      if (data.jobId) setHealPolling(data.jobId);
    } catch (err: any) {
      setHealStatus("error");
      setHealError(err?.message || "Errore avvio heal");
    }
  }, [healSymbol, healTf, healDaysBack, healDryRun, fetchHealJobs]);

  const pollHealJob = useCallback(async (jobId: string) => {
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    try {
      const res = await fetch(`${env.apiBaseUrl}/cachemanager/l2/heal/${jobId}`, {
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) return;
      setHealJobs((prev) => prev.map((j) => (j.jobId === jobId ? { ...j, ...data.data } : j)));
      if (data.data?.status === "running") {
        setTimeout(() => pollHealJob(jobId), 3000);
      } else {
        setHealPolling(null);
      }
    } catch {
      // Errore di rete: riprova dopo 5s invece di fermarsi
      setTimeout(() => pollHealJob(jobId), 5000);
    }
  }, []);

  // Avvia polling automatico quando cambia healPolling (per stato finale)
  useEffect(() => {
    if (healPolling) pollHealJob(healPolling);
  }, [healPolling, pollHealJob]);

  // Sottoscrizione WebSocket per aggiornamenti progress in tempo reale
  useEffect(() => {
    const unsub = redisWsBridgeClient.subscribe({
      filter: (msg) => {
        if (!msg || typeof msg !== "object") return false;
        if (msg.type !== "heal_progress" && msg.type !== "heal_complete") return false;
        const ch = typeof msg.__channel === "string" ? msg.__channel : "";
        return ch.startsWith(`${env.appEnv}.cachemanager`);
      },
      onMessage: (msg) => {
        const { jobId } = msg;
        if (!jobId) return;
        if (msg.type === "heal_complete") {
          // Fetch finale per avere scores, summary e status aggiornati
          pollHealJob(jobId);
          return;
        }
        const { type: _t, __channel: _c, ...progress } = msg;
        setHealJobs((prev) =>
          prev.map((j) => (j.jobId === jobId ? { ...j, progress } : j))
        );
      },
    });
    return () => unsub();
  }, []);

  const startScan = useCallback(async () => {
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    setScanStatus("loading");
    setScanError(null);
    try {
      const days_back_per_tf: Record<string, number> = {};
      for (const [tf, v] of Object.entries(scanDaysBack)) {
        const n = parseInt(v, 10);
        if (n > 0) days_back_per_tf[tf] = n;
      }
      const res = await fetch(`${env.apiBaseUrl}/cachemanager/l2/heal/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ heal: true, dry_run: scanDryRun, days_back_per_tf }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) throw new Error(data?.error || "Errore avvio scan");
      setScanStatus("idle");
      await fetchHealJobs();
      if (data.jobId) setHealPolling(data.jobId);
    } catch (err: any) {
      setScanStatus("error");
      setScanError(err?.message || "Errore avvio scan");
    }
  }, [scanDaysBack, scanDryRun, fetchHealJobs]);

  const cancelHealJob = useCallback(async (jobId: string) => {
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    try {
      await fetch(`${env.apiBaseUrl}/cachemanager/l2/heal/${jobId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setHealPolling(null);
      await fetchHealJobs();
    } catch { /* ignora */ }
  }, [fetchHealJobs]);

  // Carica job list quando si apre il tab L2-hygiene
  useEffect(() => {
    if (activeTab !== "l2-hygiene") return;
    fetchHealJobs();
  }, [activeTab, fetchHealJobs]);

  const fetchDbRuns = useCallback(async () => {
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    setDbRunsStatus("loading");
    try {
      const params = new URLSearchParams({ sort_by: "started_at", sort_dir: "desc", limit: "20" });
      const res = await fetch(`${env.apiBaseUrl}/datahub/api/table/cache_quality_runs?${params}`, { headers });
      const d = await res.json().catch(() => ({}));
      setDbRuns(d?.data ?? []);
      setDbRunsStatus("idle");
    } catch { setDbRunsStatus("error"); }
  }, []);

  const fetchDbRunScores = useCallback(async (runId: string) => {
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    setDbRunScoresStatus((p) => ({ ...p, [runId]: "loading" }));
    try {
      const params = new URLSearchParams({ run_id: runId, sort_by: "quality_score_post_heal", sort_dir: "asc", limit: "500" });
      const res = await fetch(`${env.apiBaseUrl}/datahub/api/table/cache_quality_scores?${params}`, { headers });
      const d = await res.json().catch(() => ({}));
      setDbRunScores((p) => ({ ...p, [runId]: d?.data ?? [] }));
      setDbRunScoresStatus((p) => ({ ...p, [runId]: "idle" }));
    } catch { setDbRunScoresStatus((p) => ({ ...p, [runId]: "error" })); }
  }, []);

  useEffect(() => {
    if (activeTab !== "l2-hygiene") return;
    fetchDbRuns();
  }, [activeTab, fetchDbRuns]);

  const fetchMissingCandle = useCallback(async (symbol: string, tf: string, date: string) => {
    const key = `${symbol}|${tf}|${date}`;
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    setL2GapFetchStatus((p) => ({ ...p, [key]: "loading" }));
    setL2GapFetchError((p) => { const n = { ...p }; delete n[key]; return n; });
    try {
      // Avvia heal per il singolo giorno
      const res = await fetch(`${env.apiBaseUrl}/cachemanager/l2/heal`, {
        method: "POST",
        headers,
        body: JSON.stringify({ symbol, tf, from: date, to: date, heal: true, dry_run: false }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || d?.ok === false) throw new Error(d?.error || "Errore avvio heal");
      const jobId: string = d.jobId;
      // Poll fino a completamento (max 30s)
      let attempts = 0;
      const poll = async (): Promise<void> => {
        attempts++;
        const r2 = await fetch(`${env.apiBaseUrl}/cachemanager/l2/heal/${jobId}`, { headers });
        const d2 = await r2.json().catch(() => ({}));
        const job = d2?.data;
        if (!job || job.status === "running") {
          if (attempts < 30) return new Promise((res) => setTimeout(() => res(poll()), 1000));
          throw new Error("Timeout: job non completato in 30s");
        }
        if (job.status === "error" || job.status === "cancelled") throw new Error(job.error || "Job fallito");
        // Controlla se il gap è stato riparato
        const unhealed = [...(job.unhealed?.missing_files ?? []), ...(job.unhealed?.internal_gaps ?? [])];
        if (unhealed.length > 0) {
          const reason = unhealed[0]?.reason || "Tutti i provider hanno fallito";
          throw new Error(reason);
        }
      };
      await poll();
      setL2GapFetchStatus((p) => ({ ...p, [key]: "ok" }));
    } catch (err: any) {
      setL2GapFetchStatus((p) => ({ ...p, [key]: "error" }));
      setL2GapFetchError((p) => ({ ...p, [key]: err?.message || "Errore sconosciuto" }));
    }
  }, []);

  // Carica score qualità aggregati per symbol quando si apre il tab L2
  useEffect(() => {
    if (activeTab !== "l2") return;
    setL2FilterBelowMax(false);
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    // Fetch ultimo run aggregato
    const runParams = new URLSearchParams({ sort_by: "started_at", sort_dir: "desc", limit: "20" });
    fetch(`${env.apiBaseUrl}/datahub/api/table/cache_quality_runs?${runParams}`, { headers })
      .then((r) => r.json())
      .then((d) => {
        const rows: any[] = d?.data ?? [];
        const isFullScan = (v: unknown) => ["full_scan", "scan", "fullscan"].includes(String(v ?? "").toLowerCase());
        setL2QualityRun(rows.find((row) => isFullScan(row?.mode)) ?? rows[0] ?? null);
      })
      .catch(() => {});

    // Fetch score per symbol dal nuovo endpoint atomico
    fetch(`${env.apiBaseUrl}/cachemanager/l2/quality?level=symbols`, { headers })
      .then((r) => r.json())
      .then((d) => {
        const rows: any[] = d?.data ?? [];
        const map: Record<string, { min_score: number; avg_score: number; total_missing: number; files_count: number }> = {};
        for (const row of rows) {
          if (row.symbol) map[row.symbol] = {
            min_score:     Number(row.min_score ?? 0),
            avg_score:     Number(row.avg_score ?? 0),
            total_missing: Number(row.total_missing ?? 0),
            files_count:   Number(row.files_count ?? 0),
          };
        }
        setL2QualitySymbols(map);
      })
      .catch(() => {});

    // Fetch lista ETF dalla tabella universe
    fetch(`${env.apiBaseUrl}/datahub/api/table/universe?limit=500&is_etf=1`, { headers })
      .then((r) => r.json())
      .then((d) => {
        const etfs = new Set<string>((d?.data ?? []).map((r: any) => String(r.symbol)));
        setL2EtfSymbols(etfs);
      })
      .catch(() => {});
  }, [activeTab]);

  // Fetch quality score dal datahub quando la modal file L2 si apre
  useEffect(() => {
    if (!showL2FileModal || !l2FileRequest?.symbol || !l2FileRequest?.tf) {
      setL2FileQuality(null);
      return;
    }
    setL2GapYearsExp({});
    setL2GapMonthsExp({});
    setL2GapFetchStatus({});
    setL2GapFetchError({});
    const symbol = l2FileRequest.symbol;
    const tf = l2FileRequest.tf.toLowerCase();
    const year = l2FileRequest.year;
    const month = l2FileRequest.month;
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    setL2FileQualityStatus("loading");
    setL2FileQuality(null);
    setL2FileQualityNote(null);
    const params = new URLSearchParams({ symbol, tf, sort_by: "check_date", sort_dir: "desc", limit: "200" });
    fetch(`${env.apiBaseUrl}/datahub/api/table/cache_quality_scores?${params}`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    })
      .then((r) => r.json())
      .then((d) => {
        const rows: any[] = d?.data ?? [];
        const row = rows.find((item) => qualityRowMatchesFileMonth(item, year, month)) ?? null;
        if (row) {
          row._details = parseQualityRowDetails(row);
        } else if (year && month) {
          setL2FileQualityNote(`Nessun record qualità coerente con il file ${year}-${month} (${symbol} ${tf}).`);
        }
        setL2FileQuality(row);
        setL2FileQualityStatus("idle");
      })
      .catch(() => setL2FileQualityStatus("error"));
  }, [showL2FileModal, l2FileRequest]);

  const l2FileLocalQuality = useMemo(() => {
    if (!Array.isArray(l2FileData) || !l2FileRequest?.year || !l2FileRequest?.month) return null;
    const tf = String(l2FileRequest.tf ?? "").toLowerCase();
    if (tf !== "1week") return null;
    return computeWeeklyFileQuality(l2FileData, l2FileRequest.year, l2FileRequest.month);
  }, [l2FileData, l2FileRequest]);


  // Carica score per-file di un symbol dal backend (lazy, alla prima espansione)
  const fetchSymbolFileScores = useCallback(async (symbol: string) => {
    if (l2QualityFiles[symbol] !== undefined || l2QualityFilesLoading[symbol]) return;
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    setL2QualityFilesLoading((prev) => ({ ...prev, [symbol]: true }));
    try {
      const params = new URLSearchParams({ level: "files", symbol });
      const res = await fetch(`${env.apiBaseUrl}/cachemanager/l2/quality?${params}`, {
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      const data = await res.json().catch(() => ({}));
      setL2QualityFiles((prev) => ({ ...prev, [symbol]: Array.isArray(data?.data) ? data.data : [] }));
    } catch {
      setL2QualityFiles((prev) => ({ ...prev, [symbol]: [] }));
    } finally {
      setL2QualityFilesLoading((prev) => ({ ...prev, [symbol]: false }));
    }
  }, [l2QualityFiles, l2QualityFilesLoading]);

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      {/* BARRA DEI TAB */}
      <div className="flex gap-6 border-b border-slate-200">
        {/* Tab General Settings */}
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "general" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
          }`}
          onClick={() => setActiveTab("general")}
        >
          General Settings
        </button>

        {/* Tab Specific (Get Candle) */}
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "specific" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
          }`}
          onClick={() => setActiveTab("specific")}
        >
          Specific
        </button>

        {/* Tab Cache (L3 - Redis) */}
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "cache" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
          }`}
          onClick={() => setActiveTab("cache")}
        >
          Cache
        </button>

        {/* Tab L2 (File system cache) */}
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "l2" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
          }`}
          onClick={() => setActiveTab("l2")}
        >
          L2
        </button>

        {/* Tab L2-hygiene (Audit results) */}
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "l2-hygiene" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
          }`}
          onClick={() => setActiveTab("l2-hygiene")}
        >
          L2-hygiene
        </button>
      </div>

      {/* CONTENUTO DEI TAB */}

      {/* Tab General: Usa il componente condiviso con il layout speciale a 2 colonne per cachemanager */}
      {activeTab === "general" && (
        <div className="flex-1 min-h-0 flex flex-col">
          <MicroserviceGeneralTab
            microservice="cachemanager"
            onReleaseChange={onReleaseChange}
            onHealthChange={onHealthChange}
            onOpenReleaseModal={onOpenReleaseModal}
          />
        </div>
      )}

      {/* Tab Specific: Form per recuperare candles dai vari provider */}
      {activeTab === "specific" && (
        <div className="flex-1 min-h-0 overflow-y-auto mt-4 rounded-lg border border-slate-200 bg-white/70 px-3 py-3 text-[11px] text-slate-700 pb-[5px]">
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
                {/* Radio buttons per selezionare il provider */}
                {["FMP", "ALPACA", "IBKR"].map((prov) => (
                  <label key={prov} className="inline-flex items-center gap-1">
                    <input
                      type="radio"
                      name="provider"
                      value={prov}
                      checked={provider === prov}
                      onChange={async () => {
                        setProviderError(null);
                        setProviderStatus("loading");
                        try {
                          const token =
                            typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
                          const res = await fetch(`${env.apiBaseUrl}/cachemanager/provider/${prov}`, {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              ...(token ? { Authorization: `Bearer ${token}` } : {}),
                            },
                          });
                          const data = await res.json().catch(() => ({}));
                          if (!res.ok || data?.ok === false)
                            throw new Error(data?.error || data?.message || "Errore set provider");
                          setProvider(prov as any);
                          setProviderStatus("idle");
                        } catch (err: any) {
                          setProviderStatus("error");
                          setProviderError(err?.message || "Errore cambio provider");
                        }
                      }}
                      className="h-3 w-3"
                    />
                    <span>{prov === "ALPACA" ? "Alpaca" : prov}</span>
                  </label>
                ))}
                {providerStatus === "loading" && <span className="text-slate-500">Aggiornamento...</span>}
              </div>
            </div>
            {providerError && <div className="mb-2 text-[11px] text-red-600">{providerError}</div>}

            {/* Form per recuperare le candles */}
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

            {/* Visualizzazione risultati: tabella o chart */}
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

      {/* Tab Cache (L3 - Redis): Gestione cache Redis */}
      {activeTab === "cache" && (
        <div className="flex-1 min-h-0 overflow-y-auto mt-4 rounded-lg border border-slate-200 bg-white/70 px-3 py-3 text-[11px] text-slate-700 pb-[5px]">
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

      {/* Tab L2: Gestione cache file system */}
      {activeTab === "l2" && (
        <div className="flex-1 min-h-0 overflow-y-auto mt-4 rounded-lg border border-slate-200 bg-white/70 px-3 py-3 text-[11px] text-slate-700 pb-[5px]">
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
          {/* ── Metriche qualità aggregate ──────────────────── */}
          {(l2QualityRun || Object.keys(l2QualitySymbols).length > 0) && (() => {
            const r = l2QualityRun;
            const scores = Object.values(l2QualitySymbols).map((s) => s.min_score);
            const nTotal   = scores.length;
            const nGreen   = scores.filter((s) => s >= 90).length;
            const nAmber   = scores.filter((s) => s >= 70 && s < 90).length;
            const nRed     = scores.filter((s) => s < 70).length;
            const sysScore = r ? Number(r.system_score ?? 0) : null;
            const uniScore = r ? Number(r.universe_score ?? 0) : null;
            const sysColor = sysScore == null ? "" : sysScore >= 90 ? "text-green-700" : sysScore >= 70 ? "text-amber-600" : "text-red-600";
            return (
              <div className="mb-2 rounded-md border border-slate-200 bg-white px-3 py-2.5">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  {/* Score globali */}
                  {sysScore != null && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">System score</span>
                      <span className={`text-base font-bold ${sysColor}`}>{sysScore.toFixed(1)}</span>
                      {uniScore != null && (
                        <span className="text-[11px] text-slate-400">· Universe {uniScore.toFixed(1)}</span>
                      )}
                    </div>
                  )}
                  {/* Semafori simboli */}
                  {nTotal > 0 && (
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wide">Symbols</span>
                      <span className="flex items-center gap-1">
                        <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                        <span className="font-semibold text-green-700">{nGreen}</span>
                        <span className="text-slate-400 text-[10px]">≥90</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                        <span className="font-semibold text-amber-600">{nAmber}</span>
                        <span className="text-slate-400 text-[10px]">70–89</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                        <span className="font-semibold text-red-600">{nRed}</span>
                        <span className="text-slate-400 text-[10px]">&lt;70</span>
                      </span>
                      <span className="text-slate-400">/ {nTotal}</span>
                    </div>
                  )}
                  {/* Metriche run */}
                  {r && (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 ml-auto">
                      <span>Gap trovati: <strong className="text-slate-700">{Number(r.total_gaps_found ?? 0).toLocaleString()}</strong></span>
                      <span>Healed: <strong className="text-green-700">{Number(r.total_gaps_healed ?? 0).toLocaleString()}</strong></span>
                      <span>Non riparati: <strong className={Number(r.total_gaps_found ?? 0) - Number(r.total_gaps_healed ?? 0) > 0 ? "text-red-600" : "text-slate-700"}>{(Number(r.total_gaps_found ?? 0) - Number(r.total_gaps_healed ?? 0)).toLocaleString()}</strong></span>
                      <span>+Candele: <strong className="text-slate-700">{Number(r.total_candles_added ?? 0).toLocaleString()}</strong></span>
                      {r.symbols_below_50 > 0 && <span className="text-red-600 font-medium">⚠ {Number(r.symbols_below_50)} sotto 50</span>}
                    </div>
                  )}
                </div>
                {r?.started_at && (
                  <div className="mt-1.5 text-[10px] text-slate-400">
                    {["full_scan", "scan", "fullscan"].includes(String(r.mode ?? "").toLowerCase()) ? "Ultimo full scan" : "Ultimo run"}: {new Date(r.started_at).toLocaleString()} · {r.mode ?? "—"} · {Number(r.symbols_checked ?? 0)} symbols
                  </div>
                )}
                {/* Switch filtro symbol non perfetti */}
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={l2FilterBelowMax}
                    onClick={() => setL2FilterBelowMax((v) => !v)}
                    className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${l2FilterBelowMax ? "bg-amber-500" : "bg-slate-200"}`}
                  >
                    <span className={`inline-block h-3 w-3 rounded-full bg-white shadow transform transition-transform duration-200 ${l2FilterBelowMax ? "translate-x-3" : "translate-x-0"}`} />
                  </button>
                  <span className="text-[11px] text-slate-600">
                    Mostra solo symbol con score &lt; 90
                    {l2FilterBelowMax
                      ? <span className="ml-1 font-semibold text-amber-600">ON{Object.keys(l2QualitySymbols).length > 0 && ` · ${Object.values(l2QualitySymbols).filter((s) => s.min_score < 90).length} symbol`}</span>
                      : <span className="ml-1 text-slate-400">OFF</span>
                    }
                  </span>
                </div>
              </div>
            );
          })()}

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

                // Applica filtro score prima di tutto il resto
                const scoreFiltered = l2FilterBelowMax
                  ? entries.filter((e: { name: string }) => {
                      const s = l2QualitySymbols[e.name]?.min_score;
                      return s === undefined || s < 90;
                    })
                  : entries;

                const letters: string[] = Array.from(
                  new Set(scoreFiltered.map((e: { name: string }) => (e.name[0] ? e.name[0].toUpperCase() : "")).filter(Boolean))
                ).sort();
                const useFilter = scoreFiltered.length > 20;
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
                    ? scoreFiltered.filter(
                        (e: { name: string }) =>
                          e.name.toUpperCase().startsWith(activeLetter) &&
                          (!normalizedSearch || e.name.toUpperCase().includes(normalizedSearch))
                      )
                    : scoreFiltered.filter(
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
                                onClick={() => {
                                  const nextExpanded = !expanded;
                                  setL2Expanded((prev) => ({
                                    ...prev,
                                    [name]: nextExpanded,
                                  }));
                                  if (nextExpanded) {
                                    void fetchSymbolFileScores(name);
                                  }
                                }}
                              >
                                <td className="px-3 py-2 font-semibold text-slate-800">
                                  <span className="inline-flex items-center gap-1.5">
                                    {l2QualitySymbols[name] !== undefined && (
                                      <span
                                        className={`inline-block h-2 w-2 rounded-full flex-shrink-0 ${
                                          l2QualitySymbols[name].min_score >= 90 ? "bg-green-500" :
                                          l2QualitySymbols[name].min_score >= 70 ? "bg-amber-400" :
                                          "bg-red-500"
                                        }`}
                                        title={`Quality score: ${l2QualitySymbols[name].min_score.toFixed(1)}`}
                                      />
                                    )}
                                    {name}
                                    {l2EtfSymbols.has(name) && (
                                      <span className="rounded px-1 py-0 text-[9px] font-semibold uppercase tracking-wide bg-indigo-100 text-indigo-600">ETF</span>
                                    )}
                                  </span>
                                </td>
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
                              {expanded && (() => {
                                // Group children by tf
                                const tfGroups: Record<string, Array<{ child: any; childName: string; childYear: number; childMonth: number }>> = {};
                                for (const [cIdx, child] of children.entries()) {
                                  const childName =
                                    typeof child?.path === "string"
                                      ? child.path.split(/[/\\]/).filter(Boolean).pop() || child.path
                                      : `child-${cIdx}`;
                                  const childTfMatch = /^(\d{4})-(\d{2})_(.+)\.json$/i.exec(childName);
                                  const childTf = childTfMatch ? childTfMatch[3].toLowerCase() : "_unknown";
                                  const childYear = childTfMatch ? Number(childTfMatch[1]) : 0;
                                  const childMonth = childTfMatch ? Number(childTfMatch[2]) : 0;
                                  if (!tfGroups[childTf]) tfGroups[childTf] = [];
                                  tfGroups[childTf].push({ child, childName, childYear, childMonth });
                                }
                                return Object.entries(tfGroups).map(([tf, files]) => {
                                  const tfKey = `${name}|||${tf}`;
                                  const tfExpanded = !!l2TfExpanded[tfKey];
                                  // Considera solo i record DB che corrispondono a file fisicamente presenti in cache
                                  const tfScores = files
                                    .map(({ childYear, childMonth }) =>
                                      l2QualityFiles[name]?.find(
                                        (f) => f.tf === tf && Number(f.year) === childYear && Number(f.month) === childMonth
                                      )?.quality_score
                                    )
                                    .filter((s): s is number => s !== undefined)
                                    .map(Number);
                                  const tfMinScore = tfScores.length > 0 ? Math.min(...tfScores) : undefined;
                                  const tfLoading = l2QualityFilesLoading[name] ?? false;
                                  return (
                                    <React.Fragment key={tfKey}>
                                      {/* TF header row */}
                                      <tr
                                        className="bg-slate-100/80 hover:bg-slate-100 cursor-pointer"
                                        onClick={() => setL2TfExpanded((prev) => ({ ...prev, [tfKey]: !tfExpanded }))}
                                      >
                                        <td className="px-8 py-1.5 font-medium text-slate-700">
                                          <span className="inline-flex items-center gap-1.5">
                                            <AppIcon
                                              icon={tfExpanded ? "mdi:chevron-down" : "mdi:chevron-right"}
                                              width={12} height={12}
                                            />
                                            {tfLoading ? (
                                              <span className="h-1.5 w-1.5 rounded-full flex-shrink-0 bg-slate-300 animate-pulse" title="Caricamento score..." />
                                            ) : tfMinScore !== undefined ? (
                                              <span
                                                className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${tfMinScore >= 90 ? "bg-green-500" : tfMinScore >= 70 ? "bg-amber-400" : "bg-red-500"}`}
                                                title={`Min quality score: ${tfMinScore.toFixed(1)}`}
                                              />
                                            ) : l2QualityFiles[name] !== undefined ? (
                                              <span className="h-1.5 w-1.5 rounded-full flex-shrink-0 bg-slate-400" title="Non scansionato" />
                                            ) : null}
                                            <span className="uppercase">{tf}</span>
                                            <span className="text-slate-400 text-[10px]">({files.length} file)</span>
                                          </span>
                                        </td>
                                        <td className="px-3 py-1.5" colSpan={3} />
                                      </tr>
                                      {/* File rows under this TF */}
                                      {tfExpanded && files.map(({ child, childName, childYear, childMonth }) => {
                                        const childBytes = getNodeBytes(child);
                                        const pctChild = entryBytes > 0 ? (childBytes / entryBytes) * 100 : 0;
                                        // Prima cerca match esatto per year+month (dati atomici)
                                        // Se non trovato (dati legacy senza year/month), usa il dato TF-level come fallback
                                        const childFileEntry = l2QualityFiles[name]?.find(
                                          (f) => f.tf === tf && Number(f.year) === childYear && Number(f.month) === childMonth
                                        ) ?? l2QualityFiles[name]?.find(
                                          (f) => f.tf === tf && f.year == null
                                        );
                                        const childScore: number | undefined = childFileEntry?.quality_score !== undefined ? Number(childFileEntry.quality_score) : undefined;
                                        const computedChildScoreLoading = l2QualityFilesLoading[name] ?? false;
                                        return (
                                          <tr key={`${name}-${childName}`} className="bg-slate-50">
                                            <td className="px-12 py-1 text-slate-700">
                                              <span className="inline-flex items-center gap-2">
                                                {computedChildScoreLoading ? (
                                                  <span className="h-1.5 w-1.5 rounded-full flex-shrink-0 bg-slate-300 animate-pulse" title="Caricamento score..." />
                                                ) : childScore !== undefined ? (
                                                  <span
                                                    className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${childScore >= 90 ? "bg-green-500" : childScore >= 70 ? "bg-amber-400" : "bg-red-500"}`}
                                                    title={`Quality score: ${childScore.toFixed(1)}`}
                                                  />
                                                ) : l2QualityFiles[name] !== undefined ? (
                                                  <span className="h-1.5 w-1.5 rounded-full flex-shrink-0 bg-slate-400" title="Non scansionato" />
                                                ) : null}
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
                                                    const fileTf = match?.[3];
                                                    const token =
                                                      typeof localStorage !== "undefined"
                                                        ? localStorage.getItem("astraai:auth:token")
                                                        : null;
                                                    setL2FileName(childName);
                                                    setL2FileError(null);
                                                    setL2FileData(null);
                                                    setL2FileMeta(null);
                                                    setL2FileTab("json");
                                                    setL2FileTimeFilter("");
                                                    setL2FileStatus("loading");
                                                    setShowL2FileModal(true);
                                                    try {
                                                      const params = new URLSearchParams();
                                                      const requestParams: Record<string, string> = {};
                                                      if (year && month && fileTf) {
                                                        params.set("symbol", name);
                                                        params.set("year", year);
                                                        params.set("month", month);
                                                        params.set("tf", fileTf);
                                                        requestParams.symbol = name;
                                                        requestParams.year = year;
                                                        requestParams.month = month;
                                                        requestParams.tf = fileTf;
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
                                });
                              })()}
                            </React.Fragment>
                          );
                        })}
                        {filtered.length === 0 && (
                          <tr>
                            <td className="px-3 py-2 text-slate-500" colSpan={4}>
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

      {/* Tab L2-hygiene: Risultati audit L2 */}
      {activeTab === "l2-hygiene" && (
        <div className="flex-1 min-h-0 overflow-y-auto mt-4 rounded-lg border border-slate-200 bg-white/70 px-3 py-3 text-[11px] text-slate-700 pb-[5px]">
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

          {/* ── SEZIONE HEAL ─────────────────────────────────── */}
          <div className="mt-5 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-700">Cache Heal</div>
                <div className="text-[11px] text-slate-500">
                  Identifica file mancanti e gap interni, tenta riparazione automatica.
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BaseButton
                  variant="outline"
                  color="neutral"
                  size="sm"
                  startIcon={<AppIcon icon="mdi:refresh" />}
                  onClick={fetchHealJobs}
                  disabled={healJobsStatus === "loading"}
                >
                  Aggiorna
                </BaseButton>
                <BaseButton
                  variant="solid"
                  color="primary"
                  size="sm"
                  startIcon={<AppIcon icon="mdi:wrench" />}
                  onClick={startHeal}
                  disabled={healStatus === "loading"}
                >
                  {healStatus === "loading" ? "Avvio..." : "Run Heal"}
                </BaseButton>
              </div>
            </div>

            {/* Form parametri */}
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Symbol</label>
                <input
                  type="text"
                  placeholder="es. AAPL (vuoto = tutti)"
                  value={healSymbol}
                  onChange={(e) => setHealSymbol(e.target.value)}
                  className="w-40 rounded border border-slate-200 px-2 py-1 text-[11px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">TF</label>
                <select
                  value={healTf}
                  onChange={(e) => setHealTf(e.target.value)}
                  className="rounded border border-slate-200 px-2 py-1 text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
                >
                  {["1day", "1week", "1h", "4h", "30min", "15min", "5min", "1min"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Giorni indietro</label>
                <input
                  type="number"
                  min={1}
                  max={730}
                  value={healDaysBack}
                  onChange={(e) => setHealDaysBack(e.target.value)}
                  className="w-20 rounded border border-slate-200 px-2 py-1 text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
              <label className="flex items-center gap-1 text-[11px] text-slate-600 cursor-pointer pb-1">
                <input
                  type="checkbox"
                  checked={healDryRun}
                  onChange={(e) => setHealDryRun(e.target.checked)}
                  className="accent-blue-600"
                />
                Dry run
              </label>
            </div>

            {healStatus === "error" && healError && (
              <div className="mt-2 text-[11px] text-red-600">{healError}</div>
            )}

            {/* Jobs list */}
            {healJobs.length > 0 && (
              <div className="mt-4 space-y-2">
                {healJobs.map((job) => {
                  const isRunning = job.status === "running";
                  const statusColor =
                    job.status === "completed" ? "text-green-700" :
                    job.status === "error"     ? "text-red-600" :
                    job.status === "cancelled" ? "text-slate-400" :
                    "text-blue-600";
                  return (
                    <div key={job.jobId} className="rounded-md border border-slate-200 bg-white px-3 py-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[11px] font-semibold ${statusColor}`}>
                              {isRunning && <AppIcon icon="mdi:loading" width={12} height={12} className="inline mr-1 animate-spin" />}
                              {job.status.toUpperCase()}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{job.jobId}</span>
                            {job.params?.dry_run && (
                              <span className="rounded bg-amber-100 px-1 text-[10px] font-medium text-amber-700">DRY RUN</span>
                            )}
                          </div>
                          <div className="mt-0.5 text-[10px] text-slate-500">
                            {job.params?.symbol || "ALL"} · {job.params?.tf} · {job.params?.from} → {job.params?.to}
                            {" · "}Avviato: {job.startedAt ? new Date(job.startedAt).toLocaleTimeString() : "—"}
                            {job.finishedAt && ` · Fine: ${new Date(job.finishedAt).toLocaleTimeString()}`}
                          </div>
                          {isRunning && job.progress && (
                            <div className="mt-1.5 space-y-1">
                              <div className="flex items-center justify-between text-[10px] text-slate-500">
                                <span className="font-medium text-blue-600">
                                  {job.progress.currentSymbol} <span className="text-slate-400">· {job.progress.tf}</span>
                                </span>
                                <span>
                                  {job.progress.done}/{job.progress.total}
                                  {job.progress.eta_seconds != null && job.progress.eta_seconds > 0 && (
                                    <span className="ml-2 text-slate-400">
                                      ETA {job.progress.eta_seconds >= 60
                                        ? `${Math.floor(job.progress.eta_seconds / 60)}m ${job.progress.eta_seconds % 60}s`
                                        : `${job.progress.eta_seconds}s`}
                                    </span>
                                  )}
                                </span>
                              </div>
                              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className="h-full rounded-full bg-blue-500 transition-all duration-500"
                                  style={{ width: `${job.progress.pct}%` }}
                                />
                              </div>
                            </div>
                          )}
                          {job.summary && (
                            <div className="mt-1 text-[10px] text-slate-600">
                              Symbols: {job.summary.symbolsChecked} ·
                              File mancanti: {job.summary.missingFiles} (riparati: {job.summary.missingFilesHealed}) ·
                              Gap: {job.summary.internalGapsFound} (riparati: {job.summary.internalGapsHealed}) ·
                              Candele aggiunte: {job.summary.totalCandlesAdded}
                            </div>
                          )}
                          {job.scores && job.scores.length > 0 && (
                            <div className="mt-2 overflow-auto">
                              <table className="min-w-full text-[10px]">
                                <thead>
                                  <tr className="bg-slate-50 text-left text-[10px] uppercase tracking-wide text-slate-500">
                                    <th className="px-2 py-1">Symbol</th>
                                    <th className="px-2 py-1">Score pre</th>
                                    <th className="px-2 py-1">Score post</th>
                                    <th className="px-2 py-1">Completeness</th>
                                    <th className="px-2 py-1">Gap score</th>
                                    <th className="px-2 py-1">Freshness</th>
                                    <th className="px-2 py-1">Mesi ok/tot</th>
                                    <th className="px-2 py-1">TD exp/pres</th>
                                    <th className="px-2 py-1">Gap h/u</th>
                                    <th className="px-2 py-1">+Candele</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {job.scores.map((sc: any) => {
                                    const postScore = sc.quality_score_post_heal ?? 0;
                                    const scoreColor = postScore >= 90 ? "text-green-700 font-semibold"
                                      : postScore >= 70 ? "text-amber-600 font-semibold"
                                      : "text-red-600 font-semibold";
                                    return (
                                      <tr key={sc.symbol} className="hover:bg-slate-50">
                                        <td className="px-2 py-1 font-medium text-slate-700">{sc.symbol}</td>
                                        <td className="px-2 py-1 text-slate-500">{sc.quality_score_pre_heal?.toFixed(1) ?? "—"}</td>
                                        <td className={`px-2 py-1 ${scoreColor}`}>{postScore.toFixed(1)}</td>
                                        <td className="px-2 py-1 text-slate-600">{sc.completeness_pre?.toFixed(1) ?? "—"}%</td>
                                        <td className="px-2 py-1 text-slate-600">{sc.gap_score_pre?.toFixed(1) ?? "—"}%</td>
                                        <td className="px-2 py-1 text-slate-600">{sc.freshness ?? "—"}</td>
                                        <td className="px-2 py-1 text-slate-600">{sc.months_ok}/{sc.months_checked}</td>
                                        <td className="px-2 py-1 text-slate-600">{sc.trading_days_expected}/{sc.trading_days_present}</td>
                                        <td className="px-2 py-1 text-slate-600">{sc.gaps_healed}/{sc.gaps_unhealed}</td>
                                        <td className="px-2 py-1 text-slate-600">{sc.candles_added > 0 ? `+${sc.candles_added}` : "—"}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          {isRunning && (
                            <>
                              <button
                                type="button"
                                className="rounded p-1 text-[10px] text-blue-600 hover:bg-blue-50"
                                onClick={() => pollHealJob(job.jobId)}
                                title="Aggiorna stato"
                              >
                                <AppIcon icon="mdi:refresh" width={14} height={14} />
                              </button>
                              <button
                                type="button"
                                className="rounded p-1 text-[10px] text-red-500 hover:bg-red-50"
                                onClick={() => cancelHealJob(job.jobId)}
                                title="Termina job"
                              >
                                <AppIcon icon="mdi:stop-circle-outline" width={14} height={14} />
                              </button>
                            </>
                          )}
                          {job.status === "completed" && (
                            <a
                              href={`${env.apiBaseUrl}/cachemanager/l2/heal/${job.jobId}/report.md`}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded p-1 text-[10px] text-slate-600 hover:bg-slate-100"
                              title="Scarica report Markdown"
                            >
                              <AppIcon icon="mdi:file-download-outline" width={14} height={14} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {healJobs.length === 0 && healJobsStatus === "idle" && (
              <div className="mt-3 text-[11px] text-slate-400">Nessun job heal recente.</div>
            )}
          </div>

          {/* ── STORICO RUN DA DB ───────────────────────────── */}
          <div className="mt-5 border-t border-slate-200 pt-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-700">Storico Run</div>
              <button
                type="button"
                className="rounded p-1 text-slate-400 hover:bg-slate-100"
                onClick={fetchDbRuns}
                title="Aggiorna"
              >
                <AppIcon icon="mdi:refresh" width={14} height={14} className={dbRunsStatus === "loading" ? "animate-spin" : ""} />
              </button>
            </div>

            {dbRunsStatus === "loading" && dbRuns.length === 0 && (
              <div className="text-[11px] text-slate-400">Caricamento...</div>
            )}
            {dbRunsStatus === "error" && (
              <div className="text-[11px] text-red-500">Errore caricamento run.</div>
            )}
            {dbRuns.length > 0 && (
              <div className="overflow-auto rounded-md border border-slate-200 bg-white">
                <table className="min-w-full text-[11px]">
                  <thead className="bg-slate-50 text-left text-[10px] uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="w-6 px-2 py-2" />
                      <th className="px-2 py-2">Data</th>
                      <th className="px-2 py-2">Mode</th>
                      <th className="px-2 py-2 text-right">Symbols</th>
                      <th className="px-2 py-2 text-right">System score</th>
                      <th className="px-2 py-2 text-right">Universe</th>
                      <th className="px-2 py-2 text-right">Gap trovati</th>
                      <th className="px-2 py-2 text-right">Healed</th>
                      <th className="px-2 py-2 text-right">+Candele</th>
                      <th className="px-2 py-2 text-right">&lt;50</th>
                      <th className="px-2 py-2 text-right">&lt;80</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dbRuns.map((run) => {
                      const isExpanded = !!dbRunsExpanded[run.run_id];
                      const scores = dbRunScores[run.run_id] ?? [];
                      const scoresStatus = dbRunScoresStatus[run.run_id] ?? "idle";
                      const sysScore = Number(run.system_score ?? 0);
                      const sysColor = sysScore >= 90 ? "text-green-700" : sysScore >= 70 ? "text-amber-600" : "text-red-600";
                      return (
                        <React.Fragment key={run.run_id}>
                          <tr
                            className="cursor-pointer hover:bg-slate-50"
                            onClick={() => {
                              const next = !isExpanded;
                              setDbRunsExpanded((p) => ({ ...p, [run.run_id]: next }));
                              if (next && !dbRunScores[run.run_id]) fetchDbRunScores(run.run_id);
                            }}
                          >
                            <td className="px-2 py-2 text-slate-400">
                              <AppIcon icon={isExpanded ? "mdi:chevron-down" : "mdi:chevron-right"} width={14} height={14} />
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap text-slate-600">
                              {run.started_at ? new Date(run.started_at).toLocaleString() : "—"}
                            </td>
                            <td className="px-2 py-2">
                              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                                {run.mode ?? "—"}
                              </span>
                            </td>
                            <td className="px-2 py-2 text-right text-slate-600">{Number(run.symbols_checked ?? 0)}</td>
                            <td className={`px-2 py-2 text-right font-semibold ${sysColor}`}>{sysScore.toFixed(1)}</td>
                            <td className="px-2 py-2 text-right text-slate-600">{Number(run.universe_score ?? 0).toFixed(1)}</td>
                            <td className="px-2 py-2 text-right text-slate-600">{Number(run.total_gaps_found ?? 0).toLocaleString()}</td>
                            <td className="px-2 py-2 text-right text-green-700">{Number(run.total_gaps_healed ?? 0).toLocaleString()}</td>
                            <td className="px-2 py-2 text-right text-slate-600">{Number(run.total_candles_added ?? 0).toLocaleString()}</td>
                            <td className={`px-2 py-2 text-right font-medium ${Number(run.symbols_below_50) > 0 ? "text-red-600" : "text-slate-400"}`}>{Number(run.symbols_below_50 ?? 0)}</td>
                            <td className={`px-2 py-2 text-right font-medium ${Number(run.symbols_below_80) > 0 ? "text-amber-600" : "text-slate-400"}`}>{Number(run.symbols_below_80 ?? 0)}</td>
                          </tr>
                          {isExpanded && (
                            <tr>
                              <td colSpan={11} className="bg-slate-50 px-4 pb-3 pt-1">
                                {scoresStatus === "loading" && (
                                  <div className="py-2 text-[11px] text-slate-400">Caricamento scores...</div>
                                )}
                                {scoresStatus === "error" && (
                                  <div className="py-2 text-[11px] text-red-500">Errore caricamento scores.</div>
                                )}
                                {scoresStatus === "idle" && scores.length > 0 && (
                                  <div className="overflow-auto">
                                    <table className="min-w-full text-[10px]">
                                      <thead>
                                        <tr className="text-left text-[10px] uppercase tracking-wide text-slate-400">
                                          <th className="px-2 py-1">Symbol</th>
                                          <th className="px-2 py-1">TF</th>
                                          <th className="px-2 py-1 text-right">Score pre</th>
                                          <th className="px-2 py-1 text-right">Score post</th>
                                          <th className="px-2 py-1 text-right">Complet.</th>
                                          <th className="px-2 py-1 text-right">Gap score</th>
                                          <th className="px-2 py-1 text-right">TD exp/pres</th>
                                          <th className="px-2 py-1 text-right">Gap h/u</th>
                                          <th className="px-2 py-1 text-right">+Candele</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-100">
                                        {scores.map((sc: any) => {
                                          const post = Number(sc.quality_score_post_heal ?? 0);
                                          const scoreColor = post >= 90 ? "text-green-700 font-semibold" : post >= 70 ? "text-amber-600 font-semibold" : "text-red-600 font-semibold";
                                          return (
                                            <tr key={`${sc.symbol}-${sc.tf}`} className="hover:bg-white">
                                              <td className="px-2 py-1 font-medium text-slate-700">
                                                <span className="inline-flex items-center gap-1">
                                                  <span className={`inline-block h-1.5 w-1.5 rounded-full ${post >= 90 ? "bg-green-500" : post >= 70 ? "bg-amber-400" : "bg-red-500"}`} />
                                                  {sc.symbol}
                                                </span>
                                              </td>
                                              <td className="px-2 py-1 text-slate-500">{sc.tf}</td>
                                              <td className="px-2 py-1 text-right text-slate-400">{Number(sc.quality_score ?? 0).toFixed(1)}</td>
                                              <td className={`px-2 py-1 text-right ${scoreColor}`}>{post.toFixed(1)}</td>
                                              <td className="px-2 py-1 text-right text-slate-500">{Number(sc.completeness ?? 0).toFixed(1)}%</td>
                                              <td className="px-2 py-1 text-right text-slate-500">{Number(sc.gap_score ?? 0).toFixed(1)}%</td>
                                              <td className="px-2 py-1 text-right text-slate-500">{Number(sc.trading_days_expected ?? 0)}/{Number(sc.trading_days_present ?? 0)}</td>
                                              <td className="px-2 py-1 text-right text-slate-500">{Number(sc.gaps_healed ?? 0)}/{Number(sc.gaps_unhealed ?? 0)}</td>
                                              <td className="px-2 py-1 text-right text-slate-500">{Number(sc.candles_added ?? 0) > 0 ? `+${Number(sc.candles_added)}` : "—"}</td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                                {scoresStatus === "idle" && scores.length === 0 && (
                                  <div className="py-2 text-[11px] text-slate-400">Nessun score per questo run.</div>
                                )}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {dbRunsStatus === "idle" && dbRuns.length === 0 && (
              <div className="text-[11px] text-slate-400">Nessun run in tabella.</div>
            )}
          </div>

          {/* ── SEZIONE FULL SCAN ────────────────────────────── */}
          <div className="mt-5 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-700">Full Cache Scan</div>
                <div className="text-[11px] text-slate-500">
                  Scansiona tutti i TF/symbol presenti in cache L2 e calcola lo score complessivo del sistema.
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1 text-[11px] text-slate-600 cursor-pointer">
                  <input type="checkbox" checked={scanDryRun} onChange={(e) => setScanDryRun(e.target.checked)} className="accent-blue-600" />
                  Dry run
                </label>
                <BaseButton
                  variant="solid"
                  color="primary"
                  size="sm"
                  startIcon={<AppIcon icon="mdi:magnify-scan" />}
                  onClick={startScan}
                  disabled={scanStatus === "loading"}
                >
                  {scanStatus === "loading" ? "Avvio..." : "Run Full Scan"}
                </BaseButton>
              </div>
            </div>

            {/* Giorni indietro per TF */}
            <div className="mt-3 flex flex-wrap gap-3">
              {Object.entries(scanDaysBack).map(([tf, days]) => (
                <div key={tf} className="flex flex-col gap-1">
                  <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">{tf}</label>
                  <input
                    type="number"
                    min={1}
                    max={730}
                    value={days}
                    onChange={(e) => setScanDaysBack((prev) => ({ ...prev, [tf]: e.target.value }))}
                    className="w-16 rounded border border-slate-200 px-2 py-1 text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
              ))}
            </div>

            {scanStatus === "error" && scanError && (
              <div className="mt-2 text-[11px] text-red-600">{scanError}</div>
            )}
          </div>
        </div>
      )}

      {/* Modal conferma cancellazione L3 */}
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

      {/* Modal visualizzazione file L2 */}
      {showL2FileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex w-full max-w-4xl flex-col rounded-xl bg-white shadow-xl" style={{ maxHeight: "85vh" }}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
              <div className="text-base font-semibold text-slate-900">
                {l2FileName ?? "File L2"}
                {l2FileMeta && (
                  <span className="ml-2 text-xs font-normal text-slate-500">
                    {l2FileMeta.count != null && `${l2FileMeta.count} candele`}
                    {l2FileMeta.from && l2FileMeta.to && ` · ${l2FileMeta.from} → ${l2FileMeta.to}`}
                  </span>
                )}
              </div>
              <button
                type="button"
                className="rounded p-1 text-slate-400 hover:bg-slate-100"
                onClick={() => setShowL2FileModal(false)}
              >
                <AppIcon icon="mdi:close" width={18} height={18} />
              </button>
            </div>

            {/* Quality panel */}
            {(l2FileQualityStatus === "loading" || l2FileQuality || l2FileQualityNote) && (
              <div className="border-b border-slate-100 px-5 py-3 bg-slate-50/60">
                {l2FileQualityStatus === "loading" && (
                  <div className="text-[11px] text-slate-400">Caricamento qualità...</div>
                )}
                {!l2FileQuality && l2FileQualityNote && (
                  <div className="text-[11px] text-amber-700">{l2FileQualityNote}</div>
                )}
                {(l2FileLocalQuality || l2FileQuality) && (() => {
                  const q = l2FileLocalQuality ?? l2FileQuality;
                  const n = (v: any) => Number(v ?? 0);

                  // Usa i missing_dates atomici per-file (da l2QualityFiles) — solo per questo file
                  const atomicEntry = l2FileRequest?.symbol && l2FileRequest?.tf && l2FileRequest?.year && l2FileRequest?.month
                    ? (l2QualityFiles[l2FileRequest.symbol] ?? []).find(
                        (f) => f.tf === String(l2FileRequest.tf).toLowerCase() &&
                               Number(f.year) === Number(l2FileRequest.year) &&
                               Number(f.month) === Number(l2FileRequest.month)
                      )
                    : undefined;
                  // Score: priorità al dato atomico per-file, poi legacy
                  const score = atomicEntry?.quality_score !== undefined
                    ? Number(atomicEntry.quality_score)
                    : Number(q.quality_score_post_heal ?? q.quality_score ?? 0);
                  const dotColor = score >= 90 ? "bg-green-500" : score >= 70 ? "bg-amber-400" : "bg-red-500";
                  const scoreColor = score >= 90 ? "text-green-700" : score >= 70 ? "text-amber-600" : "text-red-600";

                  // Metriche candele per intraday
                  const fileTf = String(l2FileRequest?.tf ?? "").toLowerCase();
                  const isIntraday = barsPerDayForTf(fileTf) > 1;
                  // Numero di candele fisicamente presenti nel file (informativo)
                  const actualCandles = Array.isArray(l2FileData) ? l2FileData.length : 0;
                  // Completezza day-level: giorni con ≥1 candela / giorni di trading attesi
                  // heal.js salva già questo in trading_days_present / trading_days_expected
                  const tradingDaysPresent = atomicEntry?.actual_count !== undefined
                    ? Number(atomicEntry.actual_count)
                    : n(q.trading_days_present);
                  const tradingDaysExpected = atomicEntry?.expected_count !== undefined
                    ? Number(atomicEntry.expected_count)
                    : n(q.trading_days_expected);
                  const dayCoverage = tradingDaysExpected > 0
                    ? Math.min(100, (tradingDaysPresent / tradingDaysExpected) * 100)
                    : 100;

                  const todayStr = new Date().toISOString().slice(0, 10);
                  const atomicMissingDates: string[] = (Array.isArray(atomicEntry?.missing_dates) ? atomicEntry.missing_dates : [])
                    .filter((d: string) => d < todayStr);
                  // Raggruppa le date atomiche per anno-mese per il render accordion
                  const atomicGapMonths: { month: string; gaps: string[] }[] = (() => {
                    const byMonth: Record<string, string[]> = {};
                    for (const d of atomicMissingDates) {
                      const mk = d.slice(0, 7);
                      if (!byMonth[mk]) byMonth[mk] = [];
                      byMonth[mk].push(d);
                    }
                    return Object.entries(byMonth).map(([month, gaps]) => ({ month, gaps }));
                  })();

                  // Fallback ai dati legacy (solo se non abbiamo dati atomici)
                  const details = q._details;
                  const legacyGapMonths: { month: string; gaps: string[] }[] = details?.details?.gap_months ?? [];
                  const legacyMissingMonths: string[] = details?.details?.missing_months ?? [];
                  // Filtra i legacy al solo mese del file aperto
                  const fileMonth = l2FileRequest?.year && l2FileRequest?.month
                    ? `${l2FileRequest.year}-${String(l2FileRequest.month).padStart(2, "0")}`
                    : null;
                  const gapMonths = atomicEntry !== undefined
                    ? atomicGapMonths
                    : legacyGapMonths.filter((gm) => !fileMonth || gm.month === fileMonth);
                  const missingMonths = atomicEntry !== undefined
                    ? (atomicMissingDates.length === 0 && atomicEntry.missing_count > 0 ? [fileMonth ?? ""] : []).filter(Boolean)
                    : legacyMissingMonths.filter((m) => !fileMonth || m === fileMonth);
                  const allGapDates = gapMonths.flatMap((gm) => gm.gaps ?? []);
                  return (
                    <div className="space-y-2">
                      {/* Score + metriche principali */}
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-block h-2.5 w-2.5 rounded-full flex-shrink-0 ${dotColor}`} />
                          <span className={`text-sm font-bold ${scoreColor}`}>{score.toFixed(1)}</span>
                          <span className="text-[11px] text-slate-400">score</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex flex-wrap gap-3">
                          {isIntraday ? (
                            <>
                              <span title="Candele fisicamente presenti nel file">Candele: <strong>{actualCandles}</strong></span>
                              <span title="Giorni di trading coperti (almeno 1 candela) su giorni attesi">
                                Giorni:{" "}
                                <strong className={dayCoverage < 70 ? "text-red-600" : dayCoverage < 90 ? "text-amber-600" : ""}>
                                  {tradingDaysPresent}/{tradingDaysExpected}
                                </strong>
                              </span>
                              <span title="Completezza day-level: giorni coperti / giorni attesi">
                                Completezza:{" "}
                                <strong className={dayCoverage < 70 ? "text-red-600" : dayCoverage < 90 ? "text-amber-600" : ""}>
                                  {dayCoverage.toFixed(1)}%
                                </strong>
                              </span>
                            </>
                          ) : (
                            <>
                              <span>Completezza: <strong>{n(q.completeness).toFixed(1)}%</strong></span>
                              <span>TD: <strong>{n(q.trading_days_present)}/{n(q.trading_days_expected)}</strong></span>
                            </>
                          )}
                          <span>Gap score: <strong>{n(q.gap_score).toFixed(1)}%</strong></span>
                          <span>Mesi: <strong>{n(q.months_ok)}/{n(q.months_checked)}</strong></span>
                          <span>Gap trovati: <strong>{n(q.gaps_found)}</strong></span>
                          <span>Healed: <strong>{n(q.gaps_healed)}</strong></span>
                          <span>Non riparati: <strong className={n(q.gaps_unhealed) > 0 ? "text-red-600" : ""}>{n(q.gaps_unhealed)}</strong></span>
                        </div>
                        <span className="ml-auto text-[10px] text-slate-400">
                          Check: {q.check_date ?? "—"} · range {q.range_from ?? "—"} → {q.range_to ?? "—"}
                        </span>
                      </div>
                      {q._localNote && (
                        <div className="text-[11px] text-blue-700">{q._localNote}</div>
                      )}
                      {/* Missing months */}
                      {missingMonths.length > 0 && (
                        <div className="text-[11px]">
                          <span className="font-semibold text-red-600">Mesi mancanti: </span>
                          <span className="text-slate-600">{missingMonths.join(", ")}</span>
                        </div>
                      )}
                      {/* Gap dates — accordion anno → mese → giorni */}
                      {allGapDates.length > 0 && (() => {
                        // Raggruppa per anno → mese
                        const byYear: Record<string, Record<string, string[]>> = {};
                        for (const gm of gapMonths) {
                          const year = gm.month.slice(0, 4);
                          if (!byYear[year]) byYear[year] = {};
                          byYear[year][gm.month] = gm.gaps ?? [];
                        }
                        return (
                          <div className="text-[11px]">
                            <div className="mb-1 font-semibold text-amber-600">
                              Giorni mancanti ({allGapDates.length})
                            </div>
                            <div className="space-y-0.5">
                              {Object.entries(byYear).sort().map(([year, months]) => {
                                const yearTotal = Object.values(months).reduce((s, g) => s + g.length, 0);
                                const yKey = `y-${year}`;
                                const yOpen = !!l2GapYearsExp[yKey];
                                return (
                                  <div key={year} className="rounded border border-slate-100 overflow-hidden">
                                    <button
                                      type="button"
                                      className="flex w-full items-center gap-1.5 bg-slate-50 px-2 py-1 text-left hover:bg-slate-100"
                                      onClick={() => setL2GapYearsExp((p) => ({ ...p, [yKey]: !yOpen }))}
                                    >
                                      <AppIcon icon={yOpen ? "mdi:chevron-down" : "mdi:chevron-right"} width={12} height={12} className="text-slate-400 flex-shrink-0" />
                                      <span className="font-semibold text-slate-700">{year}</span>
                                      <span className="ml-auto text-[10px] text-slate-400">{yearTotal} giorni</span>
                                    </button>
                                    {yOpen && (
                                      <div className="divide-y divide-slate-100 bg-white">
                                        {Object.entries(months).sort().map(([month, days]) => {
                                          const mKey = `m-${month}`;
                                          const mOpen = !!l2GapMonthsExp[mKey];
                                          return (
                                            <div key={month}>
                                              <button
                                                type="button"
                                                className="flex w-full items-center gap-1.5 px-4 py-1 text-left hover:bg-slate-50"
                                                onClick={() => setL2GapMonthsExp((p) => ({ ...p, [mKey]: !mOpen }))}
                                              >
                                                <AppIcon icon={mOpen ? "mdi:chevron-down" : "mdi:chevron-right"} width={11} height={11} className="text-slate-400 flex-shrink-0" />
                                                <span className="text-slate-600">{month}</span>
                                                <span className="ml-auto text-[10px] text-slate-400">{days.length} giorni</span>
                                              </button>
                                              {mOpen && (
                                                <div className="flex flex-wrap gap-1 px-8 pb-2 pt-1">
                                                  {days.sort().map((d) => {
                                                    const fKey = `${l2FileRequest?.symbol}|${l2FileRequest?.tf?.toLowerCase()}|${d}`;
                                                    const fSt = l2GapFetchStatus[fKey];
                                                    const fErr = l2GapFetchError[fKey];
                                                    return (
                                                      <button
                                                        key={d}
                                                        title={fErr ?? "Clicca per recuperare questa candela"}
                                                        disabled={fSt === "loading"}
                                                        onClick={() => fetchMissingCandle(l2FileRequest!.symbol, l2FileRequest!.tf.toLowerCase(), d)}
                                                        className={[
                                                          "rounded px-1.5 py-0.5 text-[10px] font-mono border transition-colors",
                                                          fSt === "ok"
                                                            ? "bg-green-50 text-green-700 border-green-200 cursor-default"
                                                            : fSt === "error"
                                                            ? "bg-red-50 text-red-700 border-red-200 cursor-pointer hover:bg-red-100"
                                                            : fSt === "loading"
                                                            ? "bg-amber-50 text-amber-400 border-amber-100 cursor-wait"
                                                            : "bg-amber-50 text-amber-700 border-amber-100 cursor-pointer hover:bg-amber-100",
                                                        ].join(" ")}
                                                      >
                                                        {fSt === "loading" ? (
                                                          <span className="inline-flex items-center gap-0.5">
                                                            <AppIcon icon="mdi:loading" width={10} height={10} className="animate-spin" />
                                                            {d.slice(8)}
                                                          </span>
                                                        ) : fSt === "ok" ? (
                                                          <span className="inline-flex items-center gap-0.5">
                                                            <AppIcon icon="mdi:check" width={10} height={10} />
                                                            {d.slice(8)}
                                                          </span>
                                                        ) : fSt === "error" ? (
                                                          <span className="inline-flex items-center gap-0.5">
                                                            <AppIcon icon="mdi:close" width={10} height={10} />
                                                            {d.slice(8)}
                                                          </span>
                                                        ) : (
                                                          d.slice(8)
                                                        )}
                                                      </button>
                                                    );
                                                  })}
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}
                      {allGapDates.length === 0 && missingMonths.length === 0 && q.gaps_unhealed === 0 && (
                        <div className="text-[11px] text-green-600">Nessun buco rilevato nell'ultimo check.</div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Toolbar */}
            {l2FileStatus !== "loading" && !l2FileError && (
              <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-2">
                <div className="flex rounded-lg border border-slate-200 text-xs">
                  {(["json", "table"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`px-3 py-1 font-medium transition-colors first:rounded-l-lg last:rounded-r-lg ${
                        l2FileTab === t ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"
                      }`}
                      onClick={() => setL2FileTab(t)}
                    >
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>
                {l2FileTab === "table" && Array.isArray(l2FileData) && (
                  <input
                    type="text"
                    className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    placeholder="Filtra per data (es. 2026-01)"
                    value={l2FileTimeFilter}
                    onChange={(e) => setL2FileTimeFilter(e.target.value)}
                  />
                )}
                <span className="ml-auto text-xs text-slate-400">
                  {Array.isArray(l2FileData) ? `${l2FileData.length} righe` : ""}
                </span>
              </div>
            )}

            {/* Body */}
            <div className="min-h-0 flex-1 overflow-auto">
              {l2FileStatus === "loading" && (
                <div className="flex items-center justify-center py-16 text-sm text-slate-500">
                  <AppIcon icon="mdi:loading" width={20} height={20} className="mr-2 animate-spin" />
                  Caricamento...
                </div>
              )}
              {l2FileStatus === "error" && (
                <div className="px-5 py-6 text-sm text-red-600">{l2FileError}</div>
              )}
              {l2FileStatus === "idle" && l2FileTab === "json" && (
                <pre className="px-5 py-4 text-xs text-slate-700 whitespace-pre-wrap break-all">
                  {JSON.stringify(l2FileData, null, 2)}
                </pre>
              )}
              {l2FileStatus === "idle" && l2FileTab === "table" && Array.isArray(l2FileData) && (() => {
                const rows = l2FileTimeFilter
                  ? l2FileData.filter((r: any) => String(r.t ?? r.time ?? r.date ?? "").includes(l2FileTimeFilter))
                  : l2FileData;
                const cols = rows.length > 0 ? Object.keys(rows[0]) : [];
                return (
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-slate-50">
                      <tr>
                        {cols.map((c) => (
                          <th key={c} className="px-3 py-2 text-left font-semibold text-slate-600">{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row: any, i: number) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                          {cols.map((c) => (
                            <td key={c} className="px-3 py-1 text-slate-700">{String(row[c] ?? "")}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()}
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-slate-200 px-5 py-3">
              <BaseButton variant="outline" color="neutral" size="sm" onClick={() => setShowL2FileModal(false)}>
                Chiudi
              </BaseButton>
            </div>
          </div>
        </div>
      )}

      {/* Modal conferma cancellazione L2 */}
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
                    // refresh size
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
                    setL2Error(err?.message || "Errore nello svuotare la cache");
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
