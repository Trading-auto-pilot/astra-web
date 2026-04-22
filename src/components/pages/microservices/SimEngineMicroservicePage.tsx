import { useCallback, useEffect, useRef, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import MicroserviceGeneralTab from "../../molecules/microservice/MicroserviceGeneralTab";
import BaseButton from "../../atoms/base/buttons/BaseButton";
import TextInput from "../../atoms/form/TextInput";
import AppIcon from "../../atoms/icon/AppIcon";
import { env } from "../../../config/env";
import { fetchAdminUsers, type AdminUser } from "../../../api/users";

type ReleaseInfo = {
  version?: string | null;
  lastUpdate?: string | null;
  microservice?: string | null;
  note?: string[] | null;
};

type Props = {
  onReleaseChange?: (rel: ReleaseInfo | null) => void;
  onHealthChange?: (health: Record<string, any> | null) => void;
  onOpenReleaseModal?: () => void;
  initialTab?: "general" | "simulation" | "flag-analysis";
  lockToTab?: "general" | "simulation" | "flag-analysis" | null;
};

type AccountSnapshot = {
  cash: number;
  nav: number;
  initialCash: number;
  drawdownPct: number;
  highWaterMark: number;
  realizedPnl: number;
  unrealizedPnl: number;
  positions: Record<string, { qty: number; avgCost: number }>;
};

type SimStatus = {
  ok: boolean;
  runId: string | null;
  active: boolean;
  progressPct: number;
  session: {
    startDate: string;
    endDate: string;
    currentDate: string;
    tf: string;
    tickers: string[];
    tickCount: number;
    hasMore: boolean;
  } | null;
  account: AccountSnapshot | null;
  pendingOrders: number;
};

type SimResult = {
  ok: boolean;
  runId: string;
  fromDate: string;
  toDate: string;
  tickers: string[];
  tickCount: number;
  account: AccountSnapshot;
  orders: { total: number; filled: number; cancelled: number; pending: number };
  completedAt: string;
};

const TF_OPTIONS = ["1Day", "1Hour", "30min", "15min", "5min", "1min"];

function fmt(n?: number | null, decimals = 2) {
  if (n == null || !Number.isFinite(n)) return "—";
  return n.toLocaleString("it-IT", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function fmtDate(iso?: string | null) {
  if (!iso) return "—";
  return iso.slice(0, 10);
}

function pnlColor(n?: number | null) {
  if (n == null) return "text-slate-600";
  return n >= 0 ? "text-emerald-600" : "text-red-600";
}

export default function SimEngineMicroservicePage({
  onReleaseChange,
  onHealthChange,
  onOpenReleaseModal,
  initialTab = "general",
  lockToTab = null,
}: Props) {
  const [activeTab, setActiveTab] = useState<"general" | "simulation" | "flag-analysis">(initialTab);

  const token = useMemo(() => localStorage?.getItem("astraai:auth:token"), []);
  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }),
    [token]
  );

  const base = `${env.apiBaseUrl}/sim-engine`;

  // ── Simulation config ──────────────────────────────────────────────────────
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [tf, setTf] = useState("1Day");
  const [initialCapital, setInitialCapital] = useState("100000");
  const [slippagePct, setSlippagePct] = useState("0.001");
  const [commissionPerShare, setCommissionPerShare] = useState("0.005");
  const [dataSourceMode, setDataSourceMode] = useState<"cachemanager" | "library">("cachemanager");
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);

  // ── Sim state ──────────────────────────────────────────────────────────────
  const [status, setStatus] = useState<SimStatus | null>(null);
  const [result, setResult] = useState<SimResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tickMsg, setTickMsg] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<string[]>([]);

  // Running loop control
  const runningRef = useRef(false);
  const [isRunning, setIsRunning] = useState(false);

  // ── Full Run (multi-day orchestrated simulation) ──────────────────────────
  type DaySummary = {
    date: string;
    tickers: string[];
    ordersTotal: number;
    ordersFilled: number;
    ordersCancelled: number;
    ordersPending: number;
  };
  type FullRunStatus = {
    active: boolean;
    runId: string | null;
    fromDate: string | null;
    toDate: string | null;
    pipeId: string | null;
    currentDay: string | null;
    currentPhase: string | null;
    dayIndex: number;
    totalDays: number;
    progressPct: number;
    tickCount: number;
    log: string[];
    error: string | null;
    startedAt: string | null;
    finishedAt: string | null;
    daySummaries: DaySummary[];
    totals: {
      ordersTotal: number;
      ordersFilled: number;
      ordersCancelled: number;
      ordersPending: number;
      tickersFound: number;
    };
  };
  const [frFromDate, setFrFromDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [frToDate, setFrToDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [frPipeId, setFrPipeId] = useState("1");
  const [frUserId, setFrUserId] = useState("");
  const [frUsers, setFrUsers] = useState<AdminUser[]>([]);
  const [frTf, setFrTf] = useState("1min");
  const [frStatus, setFrStatus] = useState<FullRunStatus | null>(null);
  const [frLoading, setFrLoading] = useState(false);
  const [frError, setFrError] = useState<string | null>(null);
  const frPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Candle files ───────────────────────────────────────────────────────────
  type CandleFile = {
    id: number;
    filename: string;
    stored_path: string;
    ticker: string | null;
    tf: string | null;
    description: string;
    notes: string | null;
    candle_count: number;
    date_from: string | null;
    date_to: string | null;
    size_bytes: number;
    created_at: string;
  };
  const [candleFiles, setCandleFiles] = useState<CandleFile[]>([]);
  const [candleFilesLoading, setCandleFilesLoading] = useState(false);
  const [candleFilesError, setCandleFilesError] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTicker, setUploadTicker] = useState("");
  const [uploadTf, setUploadTf] = useState("1Day");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadNotes, setUploadNotes] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // ── Flag Analysis ─────────────────────────────────────────────────────────
  type FlagRun = {
    id: number; run_id: string; started_at: string | null; finished_at: string | null;
    tickers: string | null; tf: string; date_from: string | null; date_to: string | null;
    flag_bars: number; flag_atr_k: number; flag_pct_k: number; vol_mult: number | null;
    lookahead_bars: number; stride: number; spike_pct: number | null;
    impulse_bars: number | null; atr_period: number | null; swing_window: number | null;
    total_windows: number; flag_ok_count: number; status: string;
    [key: string]: any;
  };
  type FlagEvent = {
    id: number; run_id: string; symbol: string; candle_ts: string; tf: string;
    flag_ok: number; trend_ok: number; breakout_ok: number;
    price_at_signal: number | null; break_level: number | null;
    flag_high: number | null; flag_low: number | null;
    flag_range: number | null; flag_threshold: number | null;
    atr_last: number | null; slope: number | null;
    avg_vol_flag: number | null; avg_vol_impulse: number | null;
    fail_reason: string | null;
    spike_detected: number; spike_pct: number | null; spike_candle_ts: string | null;
    breakout_confirmed: number; max_drawdown_pct: number | null;
  };

  const [faTickerSearch, setFaTickerSearch] = useState("");
  const [faTickerSuggestions, setFaTickerSuggestions] = useState<string[]>([]);
  const [faSelectedTickers, setFaSelectedTickers] = useState<string[]>([]);
  const [faBrowseOpen, setFaBrowseOpen] = useState(false);
  const [faBrowseLoading, setFaBrowseLoading] = useState(false);
  const [faBrowseError, setFaBrowseError] = useState<string | null>(null);
  const [faBrowseQuery, setFaBrowseQuery] = useState("");
  const [faBrowseSymbols, setFaBrowseSymbols] = useState<string[]>([]);
  const [faBrowseSelected, setFaBrowseSelected] = useState<string[]>([]);
  const [faBrowsePage, setFaBrowsePage] = useState(1);
  const [faAddAllCacheLoading, setFaAddAllCacheLoading] = useState(false);
  const [faDateFrom, setFaDateFrom] = useState(() => {
    const d = new Date(); d.setMonth(d.getMonth() - 3); return d.toISOString().slice(0, 10);
  });
  const [faDateTo, setFaDateTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [faTf, setFaTf] = useState("1Hour");
  const [faFlagBars, setFaFlagBars] = useState("60");
  const [faFlagAtrK, setFaFlagAtrK] = useState("1.3");
  const [faLookahead, setFaLookahead] = useState("20");
  const [faStride, setFaStride] = useState("60");
  const [faSpikePct, setFaSpikePct] = useState("1.0");
  const [faRunning, setFaRunning] = useState(false);
  const [faRunError, setFaRunError] = useState<string | null>(null);
  const [faLastRunId, setFaLastRunId] = useState<string | null>(null);

  const [faRuns, setFaRuns] = useState<FlagRun[]>([]);
  const [faRunsLoading, setFaRunsLoading] = useState(false);
  const [faSelectedRunId, setFaSelectedRunId] = useState<string | null>(null);
  const [faDeleteTarget, setFaDeleteTarget] = useState<FlagRun | null>(null);
  const [faDeleteLoading, setFaDeleteLoading] = useState(false);
  const [faDeleteError, setFaDeleteError] = useState<string | null>(null);

  const [faModalOpen, setFaModalOpen] = useState(false);
  const [faModalRun, setFaModalRun] = useState<FlagRun | null>(null);
  const [faModalAllEvents, setFaModalAllEvents] = useState<FlagEvent[]>([]);
  const [faModalLoading, setFaModalLoading] = useState(false);
  const [faModalTickerFilter, setFaModalTickerFilter] = useState<string[]>([]);
  const [faModalEventTypeFilter, setFaModalEventTypeFilter] = useState<"all" | "flag_ok" | "missed">("all");
  // Stats server-side (aggregated on all events, not limited by table fetch)
  const [faModalServerStats, setFaModalServerStats] = useState<Record<string, any> | null>(null);
  const [faModalTotalCount, setFaModalTotalCount] = useState<number>(0);
  const [faModalView, setFaModalView] = useState<"table" | "chart">("table");
  const [faModalParamsOpen, setFaModalParamsOpen] = useState(false);
  const [faChartTicker, setFaChartTicker] = useState<string | null>(null);
  const [faChartCandles, setFaChartCandles] = useState<any[]>([]);
  const [faChartEvents, setFaChartEvents] = useState<any[]>([]);
  const [faChartLoading, setFaChartLoading] = useState(false);

  const searchFaTickers = useCallback(async (q: string) => {
    if (q.length < 1) { setFaTickerSuggestions([]); return; }
    try {
      const res = await fetch(
        `${env.apiBaseUrl}/cachemanager/candles/symbols?q=${encodeURIComponent(q)}&limit=15`,
        { headers }
      );
      const data = await res.json().catch(() => null);
      const symbols: string[] = Array.isArray(data?.symbols) ? data.symbols
        : Array.isArray(data) ? data : [];
      setFaTickerSuggestions(symbols);
    } catch { setFaTickerSuggestions([]); }
  }, [headers]);

  const loadFaBrowseSymbols = useCallback(async () => {
    setFaBrowseLoading(true);
    setFaBrowseError(null);
    try {
      const pageSize = 1000;
      let offset = 0;
      let allSymbols: string[] = [];

      while (true) {
        const res = await fetch(
          `${env.apiBaseUrl}/datahub/api/table/universe?is_etf=1&limit=${pageSize}&offset=${offset}`,
          { headers }
        );
        const data = await res.json().catch(() => null);
        const rows = Array.isArray(data?.rows)
          ? data.rows
          : Array.isArray(data?.data)
            ? data.data
            : [];
        const symbols = rows
          .map((row: any) => String(row?.symbol || "").toUpperCase())
          .filter(Boolean);

        allSymbols = allSymbols.concat(symbols);

        if (rows.length < pageSize) break;
        offset += pageSize;
      }

      setFaBrowseSymbols(Array.from(new Set(allSymbols)).sort());
    } catch (e: any) {
      setFaBrowseSymbols([]);
      setFaBrowseError(e?.message || "Errore caricamento ticker");
    } finally {
      setFaBrowseLoading(false);
    }
  }, [headers]);

  const loadAllCachemanagerTickers = useCallback(async (): Promise<string[]> => {
    const res = await fetch(`${env.apiBaseUrl}/cachemanager/l2/quality?level=symbols`, { headers });
    const data = await res.json().catch(() => null);
    const rows = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.rows)
        ? data.rows
        : [];

    return Array.from<string>(
      new Set(
        rows
          .map((row: any) => String(row?.symbol || "").toUpperCase().trim())
          .filter((symbol: string) => symbol && !symbol.endsWith(".DS_STORE"))
      )
    ).sort();
  }, [headers]);

  const handleAddAllCacheTickers = useCallback(async () => {
    setFaAddAllCacheLoading(true);
    setFaBrowseError(null);
    try {
      const symbols = await loadAllCachemanagerTickers();
      setFaBrowseSelected((prev) => Array.from(new Set([...prev, ...symbols])).sort());
    } catch (e: any) {
      setFaBrowseError(e?.message || "Errore caricamento ticker dal cachemanager");
    } finally {
      setFaAddAllCacheLoading(false);
    }
  }, [loadAllCachemanagerTickers]);

  const openFaBrowseModal = useCallback(async () => {
    setFaBrowseOpen(true);
    setFaBrowseQuery("");
    setFaBrowsePage(1);
    setFaBrowseSelected(faSelectedTickers);
    await loadFaBrowseSymbols();
  }, [faSelectedTickers, loadFaBrowseSymbols]);

  const filteredFaBrowseSymbols = useMemo(() => {
    const query = faBrowseQuery.trim().toUpperCase();
    if (!query) return faBrowseSymbols;
    return faBrowseSymbols.filter((symbol) => symbol.includes(query));
  }, [faBrowseQuery, faBrowseSymbols]);

  const FA_BROWSE_PAGE_SIZE = 60;

  const faBrowseTotalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredFaBrowseSymbols.length / FA_BROWSE_PAGE_SIZE)),
    [filteredFaBrowseSymbols.length]
  );

  const pagedFaBrowseSymbols = useMemo(() => {
    const safePage = Math.min(faBrowsePage, faBrowseTotalPages);
    const start = (safePage - 1) * FA_BROWSE_PAGE_SIZE;
    return filteredFaBrowseSymbols.slice(start, start + FA_BROWSE_PAGE_SIZE);
  }, [faBrowsePage, faBrowseTotalPages, filteredFaBrowseSymbols]);

  const loadFaRuns = useCallback(async () => {
    setFaRunsLoading(true);
    try {
      const res = await fetch(`${base}/flag-analysis/runs?limit=20`, { headers });
      const data = await res.json().catch(() => null);
      setFaRuns(Array.isArray(data?.runs) ? data.runs : []);
    } catch { setFaRuns([]); }
    finally { setFaRunsLoading(false); }
  }, [base, headers]);

  const deleteFlagAnalysisRun = useCallback(async (run: FlagRun) => {
    const pageSize = 500;
    let offset = 0;
    let eventIds: number[] = [];

    while (true) {
      const res = await fetch(
        `${env.apiBaseUrl}/datahub/api/table/flag_analysis_events?run_id=${encodeURIComponent(run.run_id)}&limit=${pageSize}&offset=${offset}`,
        { headers }
      );
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Errore lettura flag_analysis_events");
      }

      const rows = Array.isArray(data?.rows)
        ? data.rows
        : Array.isArray(data?.data)
          ? data.data
          : [];

      eventIds = eventIds.concat(
        rows
          .map((row: any) => Number(row?.id))
          .filter((id: number) => Number.isFinite(id))
      );

      if (rows.length < pageSize) break;
      offset += pageSize;
    }

    for (let i = 0; i < eventIds.length; i += 25) {
      const batch = eventIds.slice(i, i + 25);
      await Promise.all(
        batch.map(async (id) => {
          const res = await fetch(`${env.apiBaseUrl}/datahub/api/table/flag_analysis_events/${id}`, {
            method: "DELETE",
            headers,
          });
          const data = await res.json().catch(() => null);
          if (!res.ok) {
            throw new Error(data?.error || data?.message || `Errore delete flag_analysis_events/${id}`);
          }
        })
      );
    }

    const runRes = await fetch(`${env.apiBaseUrl}/datahub/api/table/flag_analysis_runs/${run.id}`, {
      method: "DELETE",
      headers,
    });
    const runData = await runRes.json().catch(() => null);
    if (!runRes.ok) {
      throw new Error(runData?.error || runData?.message || `Errore delete flag_analysis_runs/${run.id}`);
    }
  }, [headers]);

  const handleConfirmDeleteRun = useCallback(async () => {
    if (!faDeleteTarget) return;
    setFaDeleteLoading(true);
    setFaDeleteError(null);
    try {
      await deleteFlagAnalysisRun(faDeleteTarget);
      if (faSelectedRunId === faDeleteTarget.run_id) {
        setFaSelectedRunId(null);
        setFaModalOpen(false);
        setFaModalRun(null);
        setFaModalAllEvents([]);
      }
      setFaDeleteTarget(null);
      await loadFaRuns();
    } catch (e: any) {
      setFaDeleteError(e?.message || "Errore eliminazione run");
    } finally {
      setFaDeleteLoading(false);
    }
  }, [deleteFlagAnalysisRun, faDeleteTarget, faSelectedRunId, loadFaRuns]);

  const fetchFaEvents = useCallback(async (runId: string, eventType: "all" | "flag_ok" | "missed") => {
    const params = new URLSearchParams({ runId, limit: "1000" });
    if (eventType === "flag_ok") params.set("flagOk", "1");
    if (eventType === "missed")  { params.set("flagOk", "0"); params.set("spikeDetected", "1"); }
    const r = await fetch(`${base}/flag-analysis/events?${params}`, { headers });
    return r.json().catch(() => null);
  }, [base, headers]);

  const openFaModal = useCallback(async (run: FlagRun) => {
    setFaModalRun(run);
    setFaModalOpen(true);
    setFaModalAllEvents([]);
    setFaModalServerStats(null);
    setFaModalTotalCount(0);
    setFaModalLoading(true);
    setFaModalTickerFilter([]);
    setFaModalEventTypeFilter("all");
    setFaSelectedRunId(run.run_id);
    try {
      const [evResult, statsResult] = await Promise.allSettled([
        fetchFaEvents(run.run_id, "all"),
        fetch(`${base}/flag-analysis/stats/${encodeURIComponent(run.run_id)}`, { headers })
          .then((r) => r.json()).catch(() => null),
      ]);
      const evData    = evResult.status    === "fulfilled" ? evResult.value    : null;
      const statsData = statsResult.status === "fulfilled" ? statsResult.value : null;
      setFaModalAllEvents(Array.isArray(evData?.items) ? evData.items : []);
      setFaModalTotalCount(evData?.count ?? 0);
      if (statsData?.ok) setFaModalServerStats(statsData.stats);
    } catch { setFaModalAllEvents([]); }
    finally { setFaModalLoading(false); }
  }, [base, headers, fetchFaEvents]);

  // ── Modal derived state (computed client-side from loaded events) ──────────
  const faModalTickers = useMemo(
    () => Array.from(new Set(faModalAllEvents.map((e) => e.symbol))).sort(),
    [faModalAllEvents]
  );

  const faModalFilteredEvents = useMemo(() => {
    // Il filtro event-type è già applicato server-side (re-fetch al click).
    // Qui filtriamo solo per ticker (client-side, non richiede re-fetch).
    if (faModalTickerFilter.length === 0) return faModalAllEvents;
    return faModalAllEvents.filter((e) => faModalTickerFilter.includes(e.symbol));
  }, [faModalAllEvents, faModalTickerFilter]);

  const faModalKpis = useMemo(() => {
    const ss = faModalServerStats;
    const filtered = faModalTickerFilter.length > 0;

    // When ticker filter is active: sum by_symbol for selected tickers (server data = complete)
    if (filtered && ss?.by_symbol) {
      const syms: Record<string, any> = ss.by_symbol;
      const keys = faModalTickerFilter.filter((t) => syms[t]);
      const sum = (field: string) => keys.reduce((acc, t) => acc + (Number(syms[t]?.[field]) || 0), 0);
      const trendOk      = sum("trendOk");
      const flagOk       = sum("flagOk");
      const missed       = sum("missed");
      const allSpikes    = sum("allSpikes");
      const trendOkSpike    = sum("trendOkSpike");
      const flagOkSpike     = sum("flagOkSpike");
      const flagOkConfirmed = sum("flagOkConfirmed");
      const confirmed       = sum("confirmed");
      const failReasons: Record<string, number> = {};
      faModalFilteredEvents.filter((e) => Number(e.flag_ok) === 0).forEach((e) => {
        const r = e.fail_reason || "unknown";
        failReasons[r] = (failReasons[r] || 0) + 1;
      });
      return { total: faModalFilteredEvents.length, totalTrendOkWindows: 0, tickersWithData: 0, tickersWithSpikes: 0, tickersWithTrendOk: 0, tickersWithFlagOk: 0, actualDateFrom: null, actualDateTo: null, actualMonths: 0, trendOk, flagOk, missed, allSpikes, trendOkSpike, flagOkSpike, flagOkConfirmed, confirmed, failReasons };
    }

    // No ticker filter: use server stats for accurate counts (not limited by table fetch)
    if (ss) {
      const failReasons: Record<string, number> = ss.fail_reasons || {};
      const bySymbolVals2 = Object.values((ss.by_symbol || {}) as Record<string, any>);
      // Se by_symbol è vuoto (run vecchi), conta dai dati caricati in memoria
      const tickersWithTrendOk = bySymbolVals2.length > 0
        ? bySymbolVals2.filter((s: any) => (s.trendOk || 0) > 0).length
        : new Set(faModalAllEvents.filter((e) => Number(e.trend_ok) === 1).map((e) => e.symbol)).size;
      const tickersWithFlagOk = bySymbolVals2.length > 0
        ? bySymbolVals2.filter((s: any) => (s.flagOk || 0) > 0).length
        : new Set(faModalAllEvents.filter((e) => Number(e.flag_ok) === 1).map((e) => e.symbol)).size;
      // Mesi effettivi: differenza tra actualDateFrom e actualDateTo
      const actualMonths = (() => {
        if (!ss.actual_date_from || !ss.actual_date_to) return 0;
        const f = new Date(ss.actual_date_from), t = new Date(ss.actual_date_to);
        return (t.getFullYear() - f.getFullYear()) * 12 + (t.getMonth() - f.getMonth()) + 1;
      })();
      return {
        total:                   Number(ss.total_events),
        totalTrendOkWindows:     Number(ss.total_trend_ok_windows || 0),
        tickersWithData:         Number(ss.tickers_with_data    || 0),
        tickersWithSpikes:       Number(ss.tickers_with_spikes  || 0),
        tickersWithTrendOk,
        tickersWithFlagOk,
        actualDateFrom:          ss.actual_date_from || null,
        actualDateTo:            ss.actual_date_to   || null,
        actualMonths,
        trendOk:                 Number(ss.trend_ok_count),
        flagOk:                  Number(ss.flag_ok_count),
        missed:                  Number(ss.missed_count),
        allSpikes:               Number(ss.all_spikes_count),
        trendOkSpike:            Number(ss.trend_ok_spike),
        flagOkSpike:             Number(ss.flag_ok_spike),
        flagOkConfirmed:         Number(ss.flag_ok_confirmed),
        confirmed:               Number(ss.all_spikes_confirmed),
        failReasons,
      };
    }

    // Fallback: client-side from loaded events
    const ev = faModalFilteredEvents;
    const trendOk         = ev.filter((e) => Number(e.trend_ok) === 1).length;
    const flagOk          = ev.filter((e) => Number(e.flag_ok) === 1).length;
    const missed          = ev.filter((e) => Number(e.flag_ok) === 0 && Number(e.spike_detected) === 1).length;
    const allSpikes       = ev.filter((e) => Number(e.spike_detected) === 1).length;
    const trendOkSpike    = ev.filter((e) => Number(e.trend_ok) === 1 && Number(e.spike_detected) === 1).length;
    const flagOkSpike     = ev.filter((e) => Number(e.flag_ok)  === 1 && Number(e.spike_detected) === 1).length;
    const flagOkConfirmed = ev.filter((e) => Number(e.flag_ok)  === 1 && Number(e.spike_detected) === 1 && Number(e.breakout_confirmed) === 1).length;
    const confirmed       = ev.filter((e) => Number(e.spike_detected) === 1 && Number(e.breakout_confirmed) === 1).length;
    const failReasons: Record<string, number> = {};
    ev.filter((e) => Number(e.flag_ok) === 0).forEach((e) => {
      const r = e.fail_reason || "unknown";
      failReasons[r] = (failReasons[r] || 0) + 1;
    });
    return { total: ev.length, totalTrendOkWindows: 0, tickersWithData: 0, tickersWithSpikes: 0, tickersWithTrendOk: 0, tickersWithFlagOk: 0, actualDateFrom: null, actualDateTo: null, actualMonths: 0, trendOk, flagOk, missed, allSpikes, trendOkSpike, flagOkSpike, flagOkConfirmed, confirmed, failReasons };
  }, [faModalServerStats, faModalTickerFilter, faModalFilteredEvents, faModalAllEvents]);

  const handleFaRun = useCallback(async () => {
    if (faSelectedTickers.length === 0) { setFaRunError("Seleziona almeno un ticker."); return; }
    if (!faDateFrom) { setFaRunError("dateFrom obbligatorio."); return; }
    setFaRunning(true); setFaRunError(null);
    try {
      const res = await fetch(`${base}/flag-analysis/run`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          tickers: faSelectedTickers,
          tf: faTf,
          dateFrom: faDateFrom,
          dateTo: faDateTo,
          flagBars: parseInt(faFlagBars) || 60,
          flagAtrK: parseFloat(faFlagAtrK) || 1.3,
          lookaheadBars: parseInt(faLookahead) || 20,
          stride: parseInt(faStride) || 1,
          spikePct: parseFloat(faSpikePct) / 100 || 0.01,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!data?.ok) throw new Error(data?.error || "Errore avvio analisi");
      setFaLastRunId(data.runId);
      setTimeout(() => loadFaRuns(), 1500);
    } catch (e: any) {
      setFaRunError(e?.message || "Errore di rete");
    } finally {
      setFaRunning(false);
    }
  }, [base, headers, faSelectedTickers, faDateFrom, faDateTo, faTf, faFlagBars, faFlagAtrK, faLookahead, faStride, faSpikePct, loadFaRuns]);

  // Candle preview / override
  const [candlePreview, setCandlePreview] = useState<string>("");
  const [candlePreviewError, setCandlePreviewError] = useState<string | null>(null);

  const loadCandleFiles = useCallback(async () => {
    setCandleFilesLoading(true);
    setCandleFilesError(null);
    try {
      const res = await fetch(`${base}/sim/library`, { headers });
      const data = await res.json().catch(() => null);
      if (Array.isArray(data?.files)) setCandleFiles(data.files);
      else setCandleFilesError("Risposta inattesa dal server.");
    } catch (e: any) {
      setCandleFilesError(e?.message || "Errore di rete.");
    } finally {
      setCandleFilesLoading(false);
    }
  }, [base, headers]);

  const handleUpload = useCallback(async () => {
    if (!uploadFile) { setUploadError("Seleziona un file."); return; }
    setUploadLoading(true);
    setUploadError(null);
    setUploadSuccess(null);
    try {
      const fd = new FormData();
      fd.append("file", uploadFile);
      if (uploadTicker) fd.append("ticker", uploadTicker);
      fd.append("tf", uploadTf);
      if (uploadDescription) fd.append("description", uploadDescription);
      if (uploadNotes) fd.append("notes", uploadNotes);
      const authHeader: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${base}/sim/library/upload`, {
        method: "POST",
        headers: authHeader,
        body: fd,
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (data?.ok || res.ok) {
        setUploadSuccess(`File "${uploadFile.name}" caricato con successo.`);
        setUploadFile(null);
        setUploadTicker("");
        setUploadDescription("");
        setUploadNotes("");
        await loadCandleFiles();
      } else {
        setUploadError(data?.error || "Errore durante l'upload.");
      }
    } catch (e: any) {
      setUploadError(e?.message || "Errore di rete.");
    } finally {
      setUploadLoading(false);
    }
  }, [uploadFile, uploadTicker, uploadTf, uploadDescription, uploadNotes, base, token, loadCandleFiles]);

  const handleDeleteCandleFile = useCallback(async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`${base}/sim/library/${id}`, { method: "DELETE", headers });
      const data = await res.json().catch(() => ({ ok: false }));
      if (data?.ok || res.ok) {
        await loadCandleFiles();
      } else {
        setCandleFilesError(data?.error || "Errore durante l'eliminazione.");
      }
    } catch (e: any) {
      setCandleFilesError(e?.message || "Errore di rete.");
    } finally {
      setDeletingId(null);
    }
  }, [base, headers, loadCandleFiles]);

  const loadStatus = useCallback(async () => {
    try {
      const res = await fetch(`${base}/sim/status`, { headers });
      const data = await res.json().catch(() => null);
      if (data?.ok) setStatus(data);
    } catch {
      // ignore background errors
    }
  }, [base, headers]);

  const loadPreview = useCallback(async () => {
    try {
      const res = await fetch(`${base}/sim/preview`, { headers });
      const data = await res.json().catch(() => null);
      if (data?.ok && data.candles) {
        setCandlePreview(JSON.stringify(data.candles, null, 2));
        setCandlePreviewError(null);
      }
    } catch {
      // ignore background errors
    }
  }, [base, headers]);

  const loadSubscriptions = useCallback(async () => {
    try {
      const res = await fetch(`${base}/subscriptions`, { headers });
      const data = await res.json().catch(() => null);
      if (Array.isArray(data?.subscribed)) setSubscriptions(data.subscribed);
    } catch {
      // ignore
    }
  }, [base, headers]);

  useEffect(() => {
    if (activeTab === "simulation") {
      loadStatus();
      loadSubscriptions();
      const id = setInterval(() => { loadStatus(); loadSubscriptions(); }, 3000);
      return () => clearInterval(id);
    }
  }, [activeTab, loadStatus, loadSubscriptions]);

  useEffect(() => {
    if (activeTab === "simulation") {
      loadCandleFiles();
    }
  }, [activeTab, loadCandleFiles]);

  useEffect(() => {
    if (lockToTab && activeTab !== lockToTab) {
      setActiveTab(lockToTab);
    }
  }, [activeTab, lockToTab]);

  useEffect(() => {
    setFaBrowsePage(1);
  }, [faBrowseQuery]);

  // ── Start run ──────────────────────────────────────────────────────────────
  const handleStart = useCallback(async () => {
    const isLibrary = dataSourceMode === "library";

    if (!isLibrary) {
      if (!fromDate || !toDate) {
        setError("From date e To date sono obbligatorie.");
        return;
      }
      if (fromDate > toDate) {
        setError("La data di fine non può essere precedente alla data di inizio.");
        return;
      }
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setTickMsg(null);
    try {
      const selectedFile = isLibrary ? candleFiles.find((f) => f.id === selectedFileId) : null;

      // In library mode dates come from the file; in cachemanager mode use the form values.
      const resolvedFrom = isLibrary ? (selectedFile?.date_from?.slice(0, 10) ?? "") : fromDate;
      const resolvedTo   = isLibrary ? (selectedFile?.date_to?.slice(0, 10)   ?? "") : toDate;

      // When fromDate === toDate, add 1 day so the session covers the full trading day.
      const effectiveToDate = !isLibrary && resolvedTo === resolvedFrom
        ? new Date(new Date(resolvedTo).getTime() + 86400000).toISOString().slice(0, 10)
        : resolvedTo;

      const dataSourceConfig = isLibrary && selectedFileId != null
        ? Object.fromEntries(subscriptions.map((sym) => [sym, selectedFileId]))
        : {};

      const res = await fetch(`${base}/sim/start`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          fromDate: resolvedFrom,
          toDate: effectiveToDate,
          tf,
          initialCapital: parseFloat(initialCapital) || 100000,
          slippagePct: parseFloat(slippagePct) || 0.001,
          commissionPerShare: parseFloat(commissionPerShare) || 0.005,
          dataSource: dataSourceMode,
          dataSourceConfig,
        }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (data?.ok) {
        await loadStatus();
        await loadPreview();
      } else {
        setError(data?.error || "Errore nell'avvio della simulazione.");
      }
    } catch (err: any) {
      setError(err?.message || "Errore di rete.");
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, tf, initialCapital, slippagePct, commissionPerShare, base, headers, loadStatus, loadPreview]);

  // ── Single tick ────────────────────────────────────────────────────────────
  const doTick = useCallback(async (useOverride = false, loadPreviewAfter = true): Promise<boolean> => {
    let candleOverrides: Record<string, any> = {};
    if (useOverride && candlePreview.trim()) {
      try {
        candleOverrides = JSON.parse(candlePreview);
        setCandlePreviewError(null);
      } catch {
        setCandlePreviewError("JSON non valido — verifica la sintassi prima di inviare.");
        throw new Error("JSON override non valido");
      }
    }
    const res = await fetch(`${base}/sim/tick`, {
      method: "POST",
      headers,
      body: JSON.stringify({ candleOverrides }),
    });
    const data = await res.json().catch(() => ({ ok: false }));
    if (!data?.ok) throw new Error(data?.error || "Tick fallito");
    setTickMsg(
      `Tick ${data.tickCount ?? ""}: ${fmtDate(data.date)}${!data.hasMore ? " — FINE RUN" : ""}`
    );
    if (data?.account) setStatus((prev) => prev ? { ...prev, account: data.account } : prev);
    // Load preview for next tick (skip in Run all loop to avoid extra requests)
    if (loadPreviewAfter) {
      if (data.hasMore) {
        try {
          const pr = await fetch(`${base}/sim/preview`, { headers });
          const pd = await pr.json().catch(() => null);
          if (pd?.ok && pd.candles) setCandlePreview(JSON.stringify(pd.candles, null, 2));
        } catch { /* ignore */ }
      } else {
        setCandlePreview("");
      }
    }
    return data.hasMore === true;
  }, [base, headers, candlePreview]);

  const handleTick = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await doTick(true, true); // override from textarea + reload preview
      await loadStatus();
    } catch (err: any) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  }, [doTick, loadStatus]);

  // ── Run all (loop until end) ───────────────────────────────────────────────
  const handleRunAll = useCallback(async () => {
    runningRef.current = true;
    setIsRunning(true);
    setError(null);
    setTickMsg(null);
    try {
      let hasMore = true;
      let localCount = 0;
      while (hasMore && runningRef.current) {
        hasMore = await doTick(false, false); // no override, no preview in loop
        localCount++;
        // Yield to React every 20 ticks so progress bar and preview update
        if (localCount % 20 === 0) {
          await loadStatus();
          await new Promise((r) => setTimeout(r, 0));
        }
      }
      await loadStatus();
      await loadPreview();
    } catch (err: any) {
      setError(err?.message);
    } finally {
      runningRef.current = false;
      setIsRunning(false);
    }
  }, [doTick, loadStatus, loadPreview]);

  const handlePause = useCallback(() => {
    runningRef.current = false;
  }, []);

  // ── Stop run ───────────────────────────────────────────────────────────────
  const handleStop = useCallback(async () => {
    runningRef.current = false;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${base}/sim/stop`, { method: "POST", headers });
      const data = await res.json().catch(() => ({ ok: false }));
      if (data?.ok) {
        setResult(data);
        setStatus(null);
      } else {
        setError(data?.error || "Errore nel fermare la simulazione.");
      }
    } catch (err: any) {
      setError(err?.message || "Errore di rete.");
    } finally {
      setLoading(false);
    }
  }, [base, headers]);

  const active = status?.active === true;
  const hasMore = status?.session?.hasMore === true;
  const account = status?.account;
  const positionEntries = Object.entries(account?.positions ?? {});

  // ── Full Run handlers ──────────────────────────────────────────────────────
  useEffect(() => {
    fetchAdminUsers()
      .then((list) => {
        setFrUsers(list);
        if (list.length > 0 && !frUserId) setFrUserId(String(list[0].id ?? ""));
      })
      .catch(() => setFrUsers([]));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startFrPoll = useCallback(() => {
    if (frPollRef.current) return;
    frPollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${base}/sim/fullrun/status`, { headers });
        const data = await res.json().catch(() => null);
        if (data?.ok) setFrStatus(data);
        if (!data?.active) {
          clearInterval(frPollRef.current!);
          frPollRef.current = null;
        }
      } catch { /* ignore */ }
    }, 3000);
  }, [base, headers]);

  const handleFullRunStart = useCallback(async () => {
    setFrLoading(true);
    setFrError(null);
    try {
      const res = await fetch(`${base}/sim/fullrun/start`, {
        method: "POST",
        headers,
        body: JSON.stringify({ fromDate: frFromDate, toDate: frToDate, pipeId: frPipeId, userId: frUserId, tf: frTf }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!data?.ok) throw new Error(data?.error || "Errore avvio full run");
      setFrStatus(null);
      startFrPoll();
    } catch (err: any) {
      setFrError(err?.message || "Errore di rete");
    } finally {
      setFrLoading(false);
    }
  }, [base, headers, frFromDate, frToDate, frPipeId, frUserId, frTf, startFrPoll]);

  const handleFullRunStop = useCallback(async () => {
    try {
      await fetch(`${base}/sim/fullrun/stop`, { method: "POST", headers });
      clearInterval(frPollRef.current!);
      frPollRef.current = null;
      const res = await fetch(`${base}/sim/fullrun/status`, { headers });
      const data = await res.json().catch(() => null);
      if (data?.ok) setFrStatus(data);
    } catch (err: any) {
      setFrError(err?.message || "Errore stop");
    }
  }, [base, headers]);

  return (
    <div className="flex flex-1 min-h-0 flex-col">

      {/* Tab bar */}
      {!lockToTab && <div className="flex gap-6 border-b border-slate-200">
        {(["general", "simulation", "flag-analysis"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            className={`pb-2 text-xs font-semibold transition ${
              activeTab === tab
                ? "border-b-2 border-slate-900 text-slate-900"
                : "text-slate-500 hover:text-slate-700"
            }`}
            onClick={() => {
              setActiveTab(tab);
              if (tab === "flag-analysis") loadFaRuns();
            }}
          >
            {tab === "general" ? "General Settings" : tab === "simulation" ? "Simulazione" : "Flag Pattern Lab"}
          </button>
        ))}
      </div>}

      {/* ── General Settings ── */}
      {activeTab === "general" && (
        <div className="flex-1 min-h-0 flex flex-col">
          <MicroserviceGeneralTab
            microservice="sim-engine"
            onReleaseChange={onReleaseChange}
            onHealthChange={onHealthChange}
            onOpenReleaseModal={onOpenReleaseModal}
          />
        </div>
      )}

      {/* ── Simulazione ── */}
      {activeTab === "simulation" && (
        <div className="mt-4 flex-1 min-h-0 overflow-y-auto space-y-5 pb-6">

          {/* Status banner */}
          {active && status?.session && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-emerald-700">
                  Run attivo — {status.runId}
                </p>
                <span className="text-xs font-semibold text-emerald-700">
                  {status.progressPct}%
                </span>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 w-full rounded-full bg-emerald-200 mb-3">
                <div
                  className="h-1.5 rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${Math.min(status.progressPct, 100)}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-600 sm:grid-cols-4">
                <span className="text-slate-400">From</span>
                <span>{fmtDate(status.session.startDate)}</span>
                <span className="text-slate-400">To</span>
                <span>{fmtDate(status.session.endDate)}</span>
                <span className="text-slate-400">Current</span>
                <span className="font-medium text-emerald-700">{fmtDate(status.session.currentDate)}</span>
                <span className="text-slate-400">TF</span>
                <span>{status.session.tf ?? "—"}</span>
                <span className="text-slate-400">Tickers</span>
                <span>{status.session.tickers?.join(", ") ?? "—"}</span>
                <span className="text-slate-400">Tick count</span>
                <span>{status.session.tickCount ?? 0}</span>
                <span className="text-slate-400">Pending orders</span>
                <span>{status.pendingOrders ?? 0}</span>
              </div>
            </div>
          )}

          {/* Account snapshot */}
          {active && account && (
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold text-slate-700 mb-3">Portafoglio</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs sm:grid-cols-4">
                <span className="text-slate-400">NAV</span>
                <span className="font-semibold">${fmt(account.nav)}</span>
                <span className="text-slate-400">Cash</span>
                <span>${fmt(account.cash)}</span>
                <span className="text-slate-400">P&L realizzato</span>
                <span className={pnlColor(account.realizedPnl)}>${fmt(account.realizedPnl)}</span>
                <span className="text-slate-400">P&L non realizzato</span>
                <span className={pnlColor(account.unrealizedPnl)}>${fmt(account.unrealizedPnl)}</span>
                <span className="text-slate-400">Drawdown</span>
                <span className={account.drawdownPct < -5 ? "text-red-600 font-semibold" : "text-slate-600"}>
                  {fmt(account.drawdownPct)}%
                </span>
                <span className="text-slate-400">Capital iniziale</span>
                <span>${fmt(account.initialCash)}</span>
              </div>
              {positionEntries.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 mb-2">Posizioni aperte</p>
                  <div className="space-y-1">
                    {positionEntries.map(([sym, pos]) => (
                      <div key={sym} className="flex items-center gap-3 text-xs">
                        <span className="font-medium w-12">{sym}</span>
                        <span className="text-slate-500">{pos.qty} azioni</span>
                        <span className="text-slate-400">avg ${fmt(pos.avgCost)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Controls */}
          {active && (
            <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
              <p className="text-xs font-semibold text-slate-700">Controlli</p>

              {/* Range exhausted — session active but no more ticks possible */}
              {!hasMore && !isRunning && (
                <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 flex items-center justify-between gap-3">
                  <p className="text-xs text-amber-700">
                    Range esaurito — premi <span className="font-semibold">Stop & risultati</span> per chiudere e avviare una nuova simulazione.
                  </p>
                  <BaseButton variant="solid" color="warning" size="md" loading={loading} onClick={handleStop}>
                    Stop & risultati
                  </BaseButton>
                </div>
              )}

              {hasMore && (
                <div className="flex flex-wrap items-center gap-3">
                  {!isRunning ? (
                    <>
                      <BaseButton
                        variant="solid"
                        color="primary"
                        size="md"
                        loading={loading}
                        onClick={handleRunAll}
                      >
                        Run all →→
                      </BaseButton>
                      <BaseButton
                        variant="outline"
                        color="secondary"
                        size="md"
                        loading={loading}
                        onClick={handleTick}
                      >
                        Tick →
                      </BaseButton>
                    </>
                  ) : (
                    <BaseButton
                      variant="solid"
                      color="warning"
                      size="md"
                      onClick={handlePause}
                    >
                      Pausa
                    </BaseButton>
                  )}
                  <BaseButton
                    variant="outline"
                    color="danger"
                    size="md"
                    loading={loading && !isRunning}
                    onClick={handleStop}
                  >
                    Stop & risultati
                  </BaseButton>
                </div>
              )}

              {tickMsg && (
                <p className={`text-xs ${tickMsg.includes("FINE") ? "text-amber-600 font-semibold" : "text-slate-500"}`}>
                  {tickMsg}
                </p>
              )}
              {isRunning && (
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-xs text-emerald-700">Esecuzione in corso…</p>
                </div>
              )}

              {/* Next candle preview / override */}
              {candlePreview && !isRunning && (
                <div className="pt-3 border-t border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-700">
                      Prossima candela <span className="font-normal text-slate-400">(modificabile prima del Tick)</span>
                    </p>
                    <button
                      type="button"
                      className="text-xs text-slate-400 hover:text-slate-600"
                      onClick={loadPreview}
                    >
                      ↺ reset
                    </button>
                  </div>
                  <textarea
                    className={`w-full rounded-md border font-mono text-xs leading-relaxed p-2 resize-y bg-slate-50 focus:outline-none focus:ring-1 ${
                      candlePreviewError
                        ? "border-red-300 focus:ring-red-400"
                        : "border-slate-200 focus:ring-blue-400"
                    }`}
                    rows={Math.min(Math.max(candlePreview.split("\n").length, 4), 20)}
                    value={candlePreview}
                    onChange={(e) => {
                      setCandlePreview(e.target.value);
                      setCandlePreviewError(null);
                    }}
                    spellCheck={false}
                  />
                  {candlePreviewError && (
                    <p className="text-xs text-red-500">{candlePreviewError}</p>
                  )}
                  <p className="text-xs text-slate-400">
                    Modifica i valori e premi <span className="font-semibold text-slate-600">Tick →</span> per inviare la candela modificata al decision-engine.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Results card */}
          {result && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-blue-700">Risultati — {result.runId}</p>
                <span className="text-xs text-slate-400">{fmtDate(result.completedAt)}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs sm:grid-cols-4">
                <span className="text-slate-400">Periodo</span>
                <span>{fmtDate(result.fromDate)} → {fmtDate(result.toDate)}</span>
                <span className="text-slate-400">Tickers</span>
                <span>{result.tickers?.join(", ")}</span>
                <span className="text-slate-400">Tick totali</span>
                <span>{result.tickCount}</span>
                <span className="text-slate-400">NAV finale</span>
                <span className="font-semibold">${fmt(result.account?.nav)}</span>
                <span className="text-slate-400">Capital iniziale</span>
                <span>${fmt(result.account?.initialCash)}</span>
                <span className="text-slate-400">P&L totale</span>
                <span className={pnlColor((result.account?.nav ?? 0) - (result.account?.initialCash ?? 0))}>
                  ${fmt((result.account?.nav ?? 0) - (result.account?.initialCash ?? 0))}
                  {" "}
                  ({fmt(((result.account?.nav ?? 0) / (result.account?.initialCash ?? 1) - 1) * 100)}%)
                </span>
                <span className="text-slate-400">Max drawdown</span>
                <span className="text-red-600">{fmt(result.account?.drawdownPct)}%</span>
                <span className="text-slate-400">Ordini totali</span>
                <span>{result.orders?.total ?? 0}</span>
                <span className="text-slate-400">Filled / Cancelled</span>
                <span>{result.orders?.filled ?? 0} / {result.orders?.cancelled ?? 0}</span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </p>
          )}

          {/* Subscriptions — always visible */}
          {subscriptions.length > 0 ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-slate-700">
                    {subscriptions.length} ticker sottoscritti dal decision-engine
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {subscriptions.map((sym) => (
                  <span
                    key={sym}
                    className="inline-flex items-center gap-1 rounded-full bg-white border border-slate-200 px-2.5 py-0.5 text-xs font-mono font-medium text-slate-700 shadow-sm"
                  >
                    {sym}
                    <button
                      type="button"
                      title={`Rimuovi ${sym}`}
                      className="ml-0.5 text-slate-400 hover:text-red-500 transition-colors leading-none"
                      onClick={async () => {
                        try {
                          await fetch(`${base}/subscriptions/${sym}`, { method: "DELETE", headers });
                          await loadSubscriptions();
                        } catch {
                          // ignore
                        }
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <p className="text-xs text-amber-700">
                Nessun ticker sottoscritto — in attesa che il decision-engine si connetta a sim-engine.
              </p>
            </div>
          )}

          {/* ── File Candele Custom ─────────────────────────────────────────── */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
            <p className="text-xs font-semibold text-slate-700">File Candele Custom</p>

            {/* Upload form */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex flex-col gap-1 flex-1 min-w-48">
                  <label className="text-sm font-medium text-slate-700">File CSV / JSON</label>
                  <input
                    type="file"
                    accept=".json,application/json"
                    disabled={uploadLoading}
                    onChange={(e) => {
                      setUploadFile(e.target.files?.[0] ?? null);
                      setUploadError(null);
                      setUploadSuccess(null);
                    }}
                    className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 file:mr-3 file:rounded file:border-0 file:bg-slate-100 file:px-2 file:py-1 file:text-xs file:font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-28">
                  <TextInput
                    label="Ticker"
                    value={uploadTicker}
                    onChange={(e) => setUploadTicker(e.target.value)}
                    disabled={uploadLoading}
                    placeholder="es. AAPL"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-slate-700">Timeframe</label>
                  <select
                    className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={uploadTf}
                    onChange={(e) => setUploadTf(e.target.value)}
                    disabled={uploadLoading}
                  >
                    {TF_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-48">
                  <TextInput
                    label="Descrizione"
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    disabled={uploadLoading}
                    placeholder="Breve descrizione del file"
                  />
                </div>
                <div className="flex-1 min-w-48">
                  <TextInput
                    label="Note"
                    value={uploadNotes}
                    onChange={(e) => setUploadNotes(e.target.value)}
                    disabled={uploadLoading}
                    placeholder="Note aggiuntive (opzionale)"
                  />
                </div>
              </div>
              <BaseButton
                variant="solid"
                color="primary"
                size="md"
                loading={uploadLoading}
                disabled={!uploadFile}
                onClick={handleUpload}
              >
                Carica file
              </BaseButton>
              {uploadError && (
                <p className="text-xs text-red-500">{uploadError}</p>
              )}
              {uploadSuccess && (
                <p className="text-xs text-emerald-600 font-medium">{uploadSuccess}</p>
              )}
            </div>

            {/* File list */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-slate-500">
                  {candleFiles.length > 0 ? `${candleFiles.length} file presenti` : "Nessun file caricato"}
                </p>
                <button
                  type="button"
                  className="text-xs text-slate-400 hover:text-slate-600"
                  onClick={loadCandleFiles}
                  disabled={candleFilesLoading}
                >
                  ↺ aggiorna
                </button>
              </div>

              {candleFilesError && (
                <p className="text-xs text-red-500 mb-2">{candleFilesError}</p>
              )}

              {candleFiles.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-slate-500">
                        <th className="pb-1.5 pr-3 font-medium">File</th>
                        <th className="pb-1.5 pr-3 font-medium">Ticker</th>
                        <th className="pb-1.5 pr-3 font-medium">TF</th>
                        <th className="pb-1.5 pr-3 font-medium">Candele</th>
                        <th className="pb-1.5 pr-3 font-medium">Da</th>
                        <th className="pb-1.5 pr-3 font-medium">A</th>
                        <th className="pb-1.5 pr-3 font-medium">Dimensione</th>
                        <th className="pb-1.5 font-medium">Descrizione</th>
                        <th className="pb-1.5" />
                      </tr>
                    </thead>
                    <tbody>
                      {candleFiles.map((f) => (
                        <tr key={f.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-1.5 pr-3 font-mono text-slate-700 max-w-32 truncate" title={f.filename}>
                            {f.filename}
                          </td>
                          <td className="py-1.5 pr-3 text-slate-600">{f.ticker ?? "—"}</td>
                          <td className="py-1.5 pr-3 text-slate-600">{f.tf ?? "—"}</td>
                          <td className="py-1.5 pr-3 text-slate-600">{f.candle_count ?? 0}</td>
                          <td className="py-1.5 pr-3 text-slate-600">{fmtDate(f.date_from)}</td>
                          <td className="py-1.5 pr-3 text-slate-600">{fmtDate(f.date_to)}</td>
                          <td className="py-1.5 pr-3 text-slate-500">
                            {f.size_bytes ? `${(f.size_bytes / 1024).toFixed(1)} KB` : "—"}
                          </td>
                          <td className="py-1.5 pr-3 text-slate-500 max-w-40 truncate" title={f.description}>
                            {f.description || "—"}
                          </td>
                          <td className="py-1.5 text-right">
                            <button
                              type="button"
                              disabled={deletingId === f.id}
                              className="text-red-400 hover:text-red-600 disabled:opacity-40 transition-colors font-medium"
                              onClick={() => handleDeleteCandleFile(f.id)}
                              title="Elimina file (tabella + filesystem)"
                            >
                              {deletingId === f.id ? "…" : "Elimina"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Config form — shown when no active run and no result */}
          {/* ── Full Run (simulazione orchestrata multi-giorno) ────────────── */}
          <div className="rounded-lg border border-violet-200 bg-violet-50 p-4 space-y-3">
            <p className="text-xs font-semibold text-violet-800">Simulazione Completa (Full Run)</p>
            <p className="text-xs text-violet-600">
              Per ogni giorno lavorativo: update-market-daily → daily scores → ranking → pipe execution → intraday candles.
            </p>

            {frStatus?.active ? (
              /* Status attivo */
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-violet-700">
                    Giorno {frStatus.dayIndex + 1}/{frStatus.totalDays} — {frStatus.currentDay ?? "—"}
                  </span>
                  <span className="text-xs font-semibold text-violet-700">{frStatus.progressPct}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-violet-200">
                  <div className="h-1.5 rounded-full bg-violet-500 transition-all" style={{ width: `${frStatus.progressPct}%` }} />
                </div>
                <div className="text-xs text-violet-600">
                  Fase: <span className="font-medium">{frStatus.currentPhase ?? "—"}</span>
                  {" · "}Tick totali: <span className="font-medium">{frStatus.tickCount}</span>
                </div>
                {frStatus.log.length > 0 && (
                  <div className="max-h-28 overflow-y-auto rounded bg-white border border-violet-100 p-2 font-mono text-[10px] text-slate-500 space-y-0.5">
                    {frStatus.log.slice(-20).map((line, i) => <div key={i}>{line}</div>)}
                  </div>
                )}
                <BaseButton variant="outline" color="danger" size="sm" onClick={handleFullRunStop}>
                  Interrompi
                </BaseButton>
              </div>
            ) : frStatus && !frStatus.active ? (
              /* Completato / errore */
              <div className="space-y-3">
                {frStatus.error ? (
                  <p className="text-xs text-red-600 font-medium">Errore: {frStatus.error}</p>
                ) : (
                  <>
                    <p className="text-xs text-emerald-700 font-medium">
                      {(() => {
                        const secs = frStatus.startedAt && frStatus.finishedAt
                          ? Math.round((new Date(frStatus.finishedAt).getTime() - new Date(frStatus.startedAt).getTime()) / 1000)
                          : null;
                        const duration = secs != null
                          ? secs >= 60 ? `${Math.floor(secs / 60)}m ${secs % 60}s` : `${secs}s`
                          : null;
                        return `Completato — ${frStatus.totalDays} giorni · ${frStatus.tickCount} tick${duration ? ` · ${duration}` : ""}`;
                      })()}
                    </p>
                    {/* Totals row */}
                    {frStatus.totals && (
                      <div className="grid grid-cols-4 gap-2 text-center">
                        {[
                          { label: "Tickers trovati", value: frStatus.totals.tickersFound },
                          { label: "Ordini totali", value: frStatus.totals.ordersTotal },
                          { label: "Filled", value: frStatus.totals.ordersFilled },
                          { label: "Pending", value: frStatus.totals.ordersPending },
                        ].map(({ label, value }) => (
                          <div key={label} className="rounded border border-violet-100 bg-violet-50 p-2">
                            <div className="text-lg font-bold text-violet-700">{value}</div>
                            <div className="text-[10px] text-slate-500">{label}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Per-day table */}
                    {frStatus.daySummaries && frStatus.daySummaries.length > 0 && (
                      <div className="overflow-x-auto rounded border border-slate-100">
                        <table className="w-full text-[11px]">
                          <thead>
                            <tr className="bg-violet-50 text-violet-700">
                              <th className="px-2 py-1 text-left font-medium">Data</th>
                              <th className="px-2 py-1 text-left font-medium">Tickers</th>
                              <th className="px-2 py-1 text-right font-medium">Ordini</th>
                              <th className="px-2 py-1 text-right font-medium">Filled</th>
                              <th className="px-2 py-1 text-right font-medium">Canc.</th>
                              <th className="px-2 py-1 text-right font-medium">Pending</th>
                            </tr>
                          </thead>
                          <tbody>
                            {frStatus.daySummaries.map((s) => (
                              <tr key={s.date} className="border-t border-slate-100 hover:bg-slate-50">
                                <td className="px-2 py-1 font-mono">{s.date}</td>
                                <td className="px-2 py-1 max-w-[140px] truncate" title={s.tickers?.join(", ")}>
                                  {s.tickers?.length ? s.tickers.join(", ") : <span className="text-slate-400">—</span>}
                                </td>
                                <td className="px-2 py-1 text-right">{s.ordersTotal}</td>
                                <td className="px-2 py-1 text-right text-emerald-600">{s.ordersFilled}</td>
                                <td className="px-2 py-1 text-right text-slate-400">{s.ordersCancelled}</td>
                                <td className="px-2 py-1 text-right text-amber-600">{s.ordersPending}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
                {frStatus.log.length > 0 && (
                  <div className="max-h-28 overflow-y-auto rounded bg-white border border-slate-100 p-2 font-mono text-[10px] text-slate-500 space-y-0.5">
                    {frStatus.log.slice(-20).map((line, i) => <div key={i}>{line}</div>)}
                  </div>
                )}
              </div>
            ) : null}

            {!frStatus?.active && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-1">
                <div className="flex flex-col gap-1 col-span-1">
                  <label className="text-xs font-medium text-violet-700">From date</label>
                  <input
                    type="date"
                    className="rounded border border-violet-200 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-violet-400"
                    value={frFromDate}
                    onChange={(e) => setFrFromDate(e.target.value)}
                    disabled={frLoading}
                  />
                </div>
                <div className="flex flex-col gap-1 col-span-1">
                  <label className="text-xs font-medium text-violet-700">To date</label>
                  <input
                    type="date"
                    className="rounded border border-violet-200 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-violet-400"
                    value={frToDate}
                    onChange={(e) => setFrToDate(e.target.value)}
                    disabled={frLoading}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-violet-700">Pipe ID</label>
                  <input
                    type="text"
                    className="rounded border border-violet-200 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-violet-400"
                    value={frPipeId}
                    onChange={(e) => setFrPipeId(e.target.value)}
                    disabled={frLoading}
                    placeholder="es. 1"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-violet-700">Utente</label>
                  <select
                    className="rounded border border-violet-200 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-violet-400"
                    value={frUserId}
                    onChange={(e) => setFrUserId(e.target.value)}
                    disabled={frLoading || frUsers.length === 0}
                  >
                    {frUsers.length === 0 && <option value="">Caricamento…</option>}
                    {frUsers.map((u) => (
                      <option key={u.id} value={String(u.id)}>
                        {u.username ?? u.email ?? `#${u.id}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-violet-700">Timeframe intraday</label>
                  <select
                    className="rounded border border-violet-200 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-violet-400"
                    value={frTf}
                    onChange={(e) => setFrTf(e.target.value)}
                    disabled={frLoading}
                  >
                    {TF_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            )}

            {frError && <p className="text-xs text-red-600">{frError}</p>}

            {!frStatus?.active && (
              <BaseButton
                variant="solid"
                color="primary"
                size="sm"
                loading={frLoading}
                onClick={handleFullRunStart}
              >
                Avvia Full Run
              </BaseButton>
            )}
          </div>

          {!active && (
            <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
              <p className="text-xs font-semibold text-slate-700">
                {result ? "Nuova simulazione" : "Configura simulazione (Sync Mode)"}
              </p>

              {dataSourceMode !== "library" && (
                <>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <TextInput
                      type="date"
                      label="From date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      disabled={loading}
                    />
                    <TextInput
                      type="date"
                      label="To date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-slate-500 -mt-1">
                    I ticker vengono letti automaticamente dalle sottoscrizioni del decision-engine.
                    Se le date coincidono la simulazione copre l'intera giornata di trading.
                  </p>
                </>
              )}
              {dataSourceMode === "library" && selectedFileId != null && (() => {
                const f = candleFiles.find((x) => x.id === selectedFileId);
                if (!f) return null;
                return (
                  <p className="text-xs text-slate-500">
                    Range dal file: <span className="font-medium text-slate-700">{fmtDate(f.date_from)}</span> → <span className="font-medium text-slate-700">{fmtDate(f.date_to)}</span>
                    {f.candle_count ? ` · ${f.candle_count} candele` : ""}
                  </p>
                );
              })()}

              <div className="flex flex-wrap items-end gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-slate-700">Timeframe</label>
                  <select
                    className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={tf}
                    onChange={(e) => setTf(e.target.value)}
                    disabled={loading}
                  >
                    {TF_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="w-36">
                  <TextInput
                    type="number"
                    label="Capital iniziale ($)"
                    value={initialCapital}
                    onChange={(e) => setInitialCapital(e.target.value)}
                    disabled={loading}
                    step="10000"
                    min="1000"
                  />
                </div>
                <div className="w-28">
                  <TextInput
                    type="number"
                    label="Slippage %"
                    value={slippagePct}
                    onChange={(e) => setSlippagePct(e.target.value)}
                    disabled={loading}
                    step="0.0005"
                    min="0"
                  />
                </div>
                <div className="w-32">
                  <TextInput
                    type="number"
                    label="Commission/share ($)"
                    value={commissionPerShare}
                    onChange={(e) => setCommissionPerShare(e.target.value)}
                    disabled={loading}
                    step="0.001"
                    min="0"
                  />
                </div>
              </div>

              {/* Data source */}
              <div className="flex flex-wrap items-end gap-3 pt-1 border-t border-slate-100">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-slate-700">Fonte dati candele</label>
                  <select
                    className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={dataSourceMode}
                    onChange={(e) => {
                      setDataSourceMode(e.target.value as "cachemanager" | "library");
                      setSelectedFileId(null);
                      setError(null);
                    }}
                    disabled={loading}
                  >
                    <option value="cachemanager">CacheManager</option>
                    <option value="library">File library</option>
                  </select>
                </div>
                {dataSourceMode === "library" && (
                  <div className="flex flex-col gap-1 flex-1 min-w-48">
                    <label className="text-sm font-medium text-slate-700">File candele</label>
                    <select
                      className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedFileId ?? ""}
                      onChange={(e) => setSelectedFileId(e.target.value ? Number(e.target.value) : null)}
                      disabled={loading}
                    >
                      <option value="">— seleziona un file —</option>
                      {candleFiles.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.filename}{f.ticker ? ` · ${f.ticker}` : ""}{f.tf ? ` · ${f.tf}` : ""}{f.candle_count ? ` (${f.candle_count} candele)` : ""}
                        </option>
                      ))}
                    </select>
                    {candleFiles.length === 0 && (
                      <p className="text-xs text-amber-600">Nessun file caricato — usa la sezione "File Candele Custom" qui sopra.</p>
                    )}
                  </div>
                )}
              </div>

              <BaseButton
                variant="solid"
                color="primary"
                size="md"
                loading={loading}
                disabled={subscriptions.length === 0 || (dataSourceMode === "library" && selectedFileId == null)}
                onClick={handleStart}
                title={
                  subscriptions.length === 0
                    ? "Attendi che il decision-engine si sottoscriva"
                    : dataSourceMode === "library" && selectedFileId == null
                      ? "Seleziona un file dalla library"
                      : undefined
                }
              >
                Avvia simulazione
              </BaseButton>
              {subscriptions.length === 0 && (
                <p className="text-xs text-amber-600">Il decision-engine non ha ancora sottoscritto alcun ticker.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Flag Pattern Lab ── */}
      {activeTab === "flag-analysis" && (
        <div className="flex flex-1 min-h-0 flex-col gap-4 overflow-auto p-4">

          {/* ── Config analisi ── */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Nuova Analisi</h3>

            {/* Ticker search */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Ticker (cerca dal cachemanager)</label>
              <div className="relative">
                <div className="flex items-center gap-2">
                  <input
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                    placeholder="es. PBR, AAPL, AEM… (Enter per aggiungere)"
                    value={faTickerSearch}
                    onChange={(e) => {
                      setFaTickerSearch(e.target.value);
                      searchFaTickers(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const t = faTickerSearch.trim().toUpperCase();
                        if (t && !faSelectedTickers.includes(t)) setFaSelectedTickers((p) => [...p, t]);
                        setFaTickerSearch("");
                        setFaTickerSuggestions([]);
                      }
                    }}
                  />
                  <BaseButton
                    type="button"
                    variant="outline"
                    color="neutral"
                    size="sm"
                    onClick={openFaBrowseModal}
                  >
                    Browse
                  </BaseButton>
                </div>
                {faTickerSuggestions.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full rounded border border-slate-200 bg-white shadow-md max-h-40 overflow-auto">
                    {faTickerSuggestions.map((s) => (
                      <li
                        key={s}
                        className="cursor-pointer px-3 py-1.5 text-xs hover:bg-slate-50"
                        onClick={() => {
                          if (!faSelectedTickers.includes(s)) setFaSelectedTickers((p) => [...p, s]);
                          setFaTickerSearch("");
                          setFaTickerSuggestions([]);
                        }}
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* Selected tickers */}
              {faSelectedTickers.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {faSelectedTickers.map((t) => (
                    <span key={t} className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {t}
                      <button
                        type="button"
                        className="text-slate-400 hover:text-red-500"
                        onClick={() => setFaSelectedTickers((p) => p.filter((x) => x !== t))}
                      >×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Parametri */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600">Da data</label>
                <input type="date" className="rounded border border-slate-300 px-2 py-1 text-xs" value={faDateFrom} onChange={(e) => setFaDateFrom(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600">A data</label>
                <input type="date" className="rounded border border-slate-300 px-2 py-1 text-xs" value={faDateTo} onChange={(e) => setFaDateTo(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600">Timeframe</label>
                <select className="rounded border border-slate-300 px-2 py-1 text-xs" value={faTf} onChange={(e) => setFaTf(e.target.value)}>
                  {TF_OPTIONS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600">Lookahead bars</label>
                <input type="number" min={1} max={100} className="rounded border border-slate-300 px-2 py-1 text-xs" value={faLookahead} onChange={(e) => setFaLookahead(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600">Flag bars</label>
                <input type="number" min={5} max={60} className="rounded border border-slate-300 px-2 py-1 text-xs" value={faFlagBars} onChange={(e) => setFaFlagBars(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600">Flag ATR-K</label>
                <input type="number" min={0.5} max={5} step={0.1} className="rounded border border-slate-300 px-2 py-1 text-xs" value={faFlagAtrK} onChange={(e) => setFaFlagAtrK(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600" title="Finestre non sovrapposte: usa stride=flagBars per eventi indipendenti">Stride</label>
                <input type="number" min={1} max={200} className="rounded border border-slate-300 px-2 py-1 text-xs" value={faStride} onChange={(e) => setFaStride(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600" title="Movimento minimo % per considerare uno spike (es. 1 = +1%)">Spike min %</label>
                <input type="number" min={0.1} max={10} step={0.1} className="rounded border border-slate-300 px-2 py-1 text-xs" value={faSpikePct} onChange={(e) => setFaSpikePct(e.target.value)} />
              </div>
            </div>

            {faRunError && <p className="text-xs text-red-600">{faRunError}</p>}
            {faLastRunId && <p className="text-xs text-emerald-600">Run avviata: <span className="font-mono">{faLastRunId}</span> — elaborazione in background</p>}

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={faRunning || faSelectedTickers.length === 0}
                onClick={handleFaRun}
                className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
              >
                {faRunning ? "Avvio…" : "Avvia analisi"}
              </button>
              <button
                type="button"
                onClick={loadFaRuns}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                {faRunsLoading ? "Caricamento…" : "Aggiorna runs"}
              </button>
            </div>
          </div>

          {faBrowseOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="flex max-h-[80vh] w-full max-w-3xl flex-col rounded-xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Browse Tickers</div>
                    <div className="text-xs text-slate-500">
                      Ticker ETF da `universe`. Selezione multipla supportata.
                    </div>
                  </div>
                  <button
                    type="button"
                    className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    onClick={() => setFaBrowseOpen(false)}
                  >
                    Chiudi
                  </button>
                </div>

                <div className="flex flex-col gap-3 overflow-hidden px-4 py-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      className="w-full rounded border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                      placeholder="Filtra la lista ticker"
                      value={faBrowseQuery}
                      onChange={(e) => setFaBrowseQuery(e.target.value)}
                    />
                    <BaseButton
                      type="button"
                      variant="outline"
                      color="neutral"
                      size="sm"
                      onClick={loadFaBrowseSymbols}
                      disabled={faBrowseLoading}
                    >
                      {faBrowseLoading ? "Loading..." : "Refresh"}
                    </BaseButton>
                    <BaseButton
                      type="button"
                      variant="outline"
                      color="neutral"
                      size="sm"
                      onClick={handleAddAllCacheTickers}
                      disabled={faAddAllCacheLoading}
                    >
                      {faAddAllCacheLoading ? "Loading..." : "Add all cache tickers"}
                    </BaseButton>
                  </div>

                  <div className="text-xs text-slate-500">
                    {faBrowseSelected.length} selezionati · {filteredFaBrowseSymbols.length} risultati · pagina {Math.min(faBrowsePage, faBrowseTotalPages)} di {faBrowseTotalPages}
                  </div>

                  {faBrowseError && <div className="text-xs text-red-600">{faBrowseError}</div>}

                  <div className="grid max-h-[48vh] grid-cols-2 gap-2 overflow-auto rounded-lg border border-slate-200 p-3 lg:grid-cols-3">
                    {faBrowseLoading && <div className="col-span-full text-xs text-slate-500">Caricamento ticker…</div>}
                    {!faBrowseLoading && filteredFaBrowseSymbols.length === 0 && (
                      <div className="col-span-full text-xs text-slate-500">Nessun ticker trovato.</div>
                    )}
                    {!faBrowseLoading && pagedFaBrowseSymbols.map((symbol) => {
                      const checked = faBrowseSelected.includes(symbol);
                      return (
                        <label
                          key={symbol}
                          className={`flex cursor-pointer items-center gap-2 rounded border px-2 py-1.5 text-xs ${
                            checked
                              ? "border-slate-800 bg-slate-50 text-slate-900"
                              : "border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              setFaBrowseSelected((prev) =>
                                e.target.checked
                                  ? Array.from(new Set([...prev, symbol]))
                                  : prev.filter((item) => item !== symbol)
                              );
                            }}
                          />
                          <span className="font-medium">{symbol}</span>
                        </label>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      Mostrati {pagedFaBrowseSymbols.length} ticker
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                        onClick={() => setFaBrowsePage((p) => Math.max(1, p - 1))}
                        disabled={faBrowsePage <= 1}
                      >
                        Prev
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                        onClick={() => setFaBrowsePage((p) => Math.min(faBrowseTotalPages, p + 1))}
                        disabled={faBrowsePage >= faBrowseTotalPages}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    onClick={() => setFaBrowseSelected([])}
                    disabled={faBrowseSelected.length === 0}
                  >
                    Pulisci selezione
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                      onClick={() => setFaBrowseOpen(false)}
                    >
                      Annulla
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
                      onClick={() => {
                        setFaSelectedTickers(Array.from(new Set(faBrowseSelected)).sort());
                        setFaBrowseOpen(false);
                        setFaTickerSearch("");
                        setFaTickerSuggestions([]);
                      }}
                    >
                      Inserisci nel campo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Lista runs ── */}
          {faRuns.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Runs recenti</h3>
              </div>
              <div className="overflow-auto">
                <table className="w-full text-xs border-collapse">
                  <thead className="bg-slate-50 text-[11px] text-slate-500">
                    <tr>
                      {["Run ID","Stato","Tickers","TF","Da","A","Finestre","Flag OK",""].map((h) => (
                        <th key={h} className="px-3 py-2 text-left font-semibold whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {faRuns.map((r) => (
                      <tr
                        key={r.run_id}
                        className={`hover:bg-slate-50 cursor-pointer ${faSelectedRunId === r.run_id ? "bg-slate-50 ring-1 ring-inset ring-slate-300" : ""}`}
                        onClick={() => openFaModal(r)}
                      >
                        <td className="px-3 py-2 font-mono text-[10px] text-slate-500">{r.run_id.slice(0, 22)}…</td>
                        <td className="px-3 py-2">
                          <span className={`rounded-full px-2 py-0.5 font-semibold ${
                            r.status === "completed" ? "bg-emerald-50 text-emerald-700"
                            : r.status === "running"   ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                          }`}>{r.status}</span>
                        </td>
                        <td className="px-3 py-2 max-w-[120px] truncate">
                          {(() => { try { return (JSON.parse(r.tickers || "[]") as string[]).join(", "); } catch { return r.tickers || "—"; } })()}
                        </td>
                        <td className="px-3 py-2 font-mono">{r.tf}</td>
                        <td className="px-3 py-2">{r.date_from || "—"}</td>
                        <td className="px-3 py-2">{r.date_to || "—"}</td>
                        <td className="px-3 py-2 text-right">{r.total_windows.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right font-semibold text-emerald-700">{r.flag_ok_count.toLocaleString()}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="rounded border border-slate-200 px-2 py-0.5 text-[10px] hover:bg-slate-100"
                              onClick={(e) => { e.stopPropagation(); openFaModal(r); }}
                            >
                              Vedi eventi →
                            </button>
                            <button
                              type="button"
                              className="rounded border border-red-200 p-1 text-red-600 hover:bg-red-50"
                              title="Elimina run"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFaDeleteError(null);
                                setFaDeleteTarget(r);
                              }}
                            >
                              <AppIcon icon="mdi:trash-can-outline" width={14} height={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {faDeleteTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
                <div className="border-b border-slate-200 px-4 py-3">
                  <div className="text-sm font-semibold text-slate-900">Conferma eliminazione run</div>
                  <div className="mt-1 text-xs text-slate-500">
                    Verranno eliminati il record della run e tutti gli eventi collegati.
                  </div>
                </div>
                <div className="space-y-2 px-4 py-3 text-xs text-slate-700">
                  <div><span className="font-semibold text-slate-900">Run ID:</span> <span className="font-mono">{faDeleteTarget.run_id}</span></div>
                  <div><span className="font-semibold text-slate-900">Stato:</span> {faDeleteTarget.status}</div>
                  <div><span className="font-semibold text-slate-900">Tickers:</span> {(() => { try { return (JSON.parse(faDeleteTarget.tickers || "[]") as string[]).join(", "); } catch { return faDeleteTarget.tickers || "—"; } })()}</div>
                  <div><span className="font-semibold text-slate-900">Timeframe:</span> {faDeleteTarget.tf}</div>
                  <div><span className="font-semibold text-slate-900">Intervallo:</span> {faDeleteTarget.date_from || "—"} → {faDeleteTarget.date_to || "—"}</div>
                  <div><span className="font-semibold text-slate-900">Finestre:</span> {Number(faDeleteTarget.total_windows || 0).toLocaleString()} · <span className="font-semibold text-slate-900">Flag OK:</span> {Number(faDeleteTarget.flag_ok_count || 0).toLocaleString()}</div>
                  {faDeleteError && <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-red-700">{faDeleteError}</div>}
                </div>
                <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-3">
                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    onClick={() => {
                      if (faDeleteLoading) return;
                      setFaDeleteTarget(null);
                      setFaDeleteError(null);
                    }}
                  >
                    Annulla
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                    onClick={handleConfirmDeleteRun}
                    disabled={faDeleteLoading}
                  >
                    {faDeleteLoading ? "Eliminazione..." : "Elimina run"}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── Flag Analysis Modal ──────────────────────────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {faModalOpen && faModalRun && (() => {
        const run = faModalRun;
        const kpi = faModalKpis;
        const nf  = (v: number | null, d = 1) => v != null && isFinite(v) ? v.toFixed(d) : "—";
        const runTickers: string[] = (() => { try { return JSON.parse(run.tickers || "[]"); } catch { return []; } })();

        const statBox = (label: string, value: string, sub: string, color: string) => (
          <div className="flex flex-col items-center gap-0.5 px-3 py-2.5 border-r border-slate-100 last:border-r-0 min-w-[90px]">
            <span className={`text-base font-bold ${color}`}>{value}</span>
            <span className="text-[10px] text-slate-500 text-center leading-tight">{label}</span>
            {sub && <span className="text-[9px] text-slate-400">{sub}</span>}
          </div>
        );

        return (
          <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 pt-6 pb-[44px] px-4 overflow-auto">
            <div className={`${faChartTicker ? "w-[95vw]" : "w-[75vw]"} max-w-none bg-white rounded-2xl shadow-2xl flex flex-col max-h-[calc(100vh-48px-44px)] overflow-hidden transition-all duration-200`}>

              {/* ── Header ── */}
              <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <h2 className="text-sm font-bold text-slate-800">Analisi eventi — Flag Pattern Lab</h2>
                  <div className="flex flex-wrap gap-3 text-[11px] text-slate-500">
                    <span><span className="font-semibold text-slate-700">TF</span> {run.tf}</span>
                    <span><span className="font-semibold text-slate-700">Da</span> {run.date_from || "—"}</span>
                    <span><span className="font-semibold text-slate-700">A</span> {run.date_to || "—"}</span>
                    <span><span className="font-semibold text-slate-700">Finestre</span> {Number(run.total_windows).toLocaleString()}</span>
                    <span><span className="font-semibold text-emerald-700">Flag OK</span> {Number(run.flag_ok_count).toLocaleString()}</span>
                    <span><span className="font-semibold text-slate-700">Ticker</span> {runTickers.length > 0 ? runTickers.length : "—"}</span>
                    <span><span className="font-semibold text-slate-700">Stride</span> {Number(run.stride) || 1}</span>
                    <span><span className="font-semibold text-slate-700">Spike min</span> {run.spike_pct != null ? `${(Number(run.spike_pct) * 100).toFixed(1)}%` : "—"}</span>
                    <span className="font-mono text-slate-400">{run.run_id.slice(0, 28)}…</span>
                  </div>
                  {/* Parametri completi (collassabili) */}
                  {faModalParamsOpen && (
                    <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px]">
                      <div className="grid grid-cols-3 gap-x-6 gap-y-1 text-slate-600">
                        {([
                          ["Flag Bars",      run.flag_bars       ?? "—"],
                          ["Flag ATR-K",     run.flag_atr_k      ?? "—"],
                          ["Flag PCT-K",     run.flag_pct_k      ?? "—"],
                          ["Vol Mult",       run.vol_mult        ?? "—"],
                          ["Lookahead",      run.lookahead_bars  ?? "—"],
                          ["Stride",         run.stride          ?? "—"],
                          ["Spike min %",    run.spike_pct != null ? `${(Number(run.spike_pct)*100).toFixed(2)}%` : "—"],
                          ["Impulse Bars",   (run as any).impulse_bars  ?? "—"],
                          ["ATR Period",     (run as any).atr_period    ?? "—"],
                          ["Swing Window",   (run as any).swing_window  ?? "—"],
                          ["TF",             run.tf              ?? "—"],
                          ["Periodo",        `${run.date_from || "—"} → ${run.date_to || "—"}`],
                        ] as [string, any][]).map(([label, value]) => (
                          <div key={label} className="flex gap-1">
                            <span className="font-semibold text-slate-500 shrink-0">{label}:</span>
                            <span className="font-mono text-slate-800">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="ml-4 flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setFaModalParamsOpen((v) => !v)}
                    title="Parametri di esecuzione"
                    className={`rounded-lg p-1.5 transition hover:bg-slate-100 ${faModalParamsOpen ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-700"}`}
                  >⚙</button>
                  <button
                    type="button"
                    onClick={() => setFaModalOpen(false)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >✕</button>
                </div>
              </div>

              {/* ── KPI bar ── */}
              <div className="flex flex-wrap border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
                {statBox("Finestre", kpi.total.toLocaleString(), faModalTickerFilter.length > 0 ? "filtrate" : "totali", "text-slate-600")}
                {kpi.tickersWithData > 0 && statBox(
                  "Ticker con spike",
                  `${kpi.tickersWithSpikes}/${kpi.tickersWithData}`,
                  `su ${kpi.tickersWithData} ticker con dati`,
                  kpi.tickersWithSpikes / Math.max(kpi.tickersWithData, 1) >= 0.5 ? "text-emerald-700" : kpi.tickersWithSpikes / Math.max(kpi.tickersWithData, 1) >= 0.2 ? "text-amber-700" : "text-red-600"
                )}
                {kpi.actualDateFrom && kpi.actualDateTo && statBox(
                  "Periodo effettivo",
                  kpi.actualMonths > 0 ? `${kpi.actualMonths} mes${kpi.actualMonths === 1 ? "e" : "i"}` : `${kpi.actualDateFrom.slice(0, 7)} → ${kpi.actualDateTo.slice(0, 7)}`,
                  `${kpi.actualDateFrom.slice(0, 7)} → ${kpi.actualDateTo.slice(0, 7)}`,
                  kpi.actualMonths >= 6 ? "text-emerald-700" : kpi.actualMonths >= 2 ? "text-amber-700" : "text-red-600"
                )}
                {statBox(
                  "Trend OK",
                  kpi.trendOk.toLocaleString(),
                  kpi.tickersWithTrendOk > 0 ? `su ${kpi.tickersWithTrendOk} ticker` : "con trend",
                  "text-blue-700"
                )}
                {statBox(
                  "Flag OK",
                  kpi.flagOk.toLocaleString(),
                  kpi.tickersWithFlagOk > 0 ? `su ${kpi.tickersWithFlagOk} ticker` : "pattern completo",
                  "text-emerald-700"
                )}
                {statBox("Spike persi", kpi.missed.toLocaleString(), "no flagOk + spike", "text-amber-700")}
                {statBox("Spike totali", kpi.allSpikes.toLocaleString(), "flagOk + persi", "text-orange-600")}
                {statBox(
                  "TrendOK → Spike",
                  kpi.totalTrendOkWindows > 0
                    ? `${nf((kpi.trendOkSpike / kpi.totalTrendOkWindows) * 100)}%`
                    : kpi.trendOk > 0 ? `${nf((kpi.trendOkSpike / kpi.trendOk) * 100)}%` : "—",
                  kpi.totalTrendOkWindows > 0
                    ? `${kpi.trendOkSpike} spike su ${kpi.totalTrendOkWindows.toLocaleString()} window trend ok`
                    : `su ${kpi.trendOk} trend ok, ${kpi.trendOkSpike} con spike`,
                  "text-violet-700"
                )}
                {statBox(
                  "Flag OK / Spike totali",
                  kpi.allSpikes > 0 ? `${nf((kpi.flagOk / kpi.allSpikes) * 100)}%` : "—",
                  `${kpi.flagOk} flagOk su ${kpi.allSpikes} spike rilevati`,
                  "text-teal-700"
                )}
                {statBox(
                  "Flag OK → Spike",
                  kpi.flagOk > 0 ? `${nf((kpi.flagOkSpike / kpi.flagOk) * 100)}%` : "—",
                  `su ${kpi.flagOk} flagOk, ${kpi.flagOkSpike} con spike dopo`,
                  "text-emerald-700"
                )}
                {statBox(
                  "Flag OK → confermato",
                  kpi.flagOk > 0 ? `${nf((kpi.flagOkConfirmed / kpi.flagOk) * 100)}%` : "—",
                  `su ${kpi.flagOk} flagOk, ${kpi.flagOkConfirmed} con spike+vol`,
                  "text-indigo-700"
                )}
                {(() => {
                  const condFail = (kpi.failReasons as any)?._condFail as Record<string,number> | undefined;
                  const trendOkWin = kpi.totalTrendOkWindows || 1;
                  const conds: [string, number][] = condFail
                    ? [
                        ["range_too_wide",        condFail.range_too_wide        || 0],
                        ["slope_negative",        condFail.slope_negative        || 0],
                        ["volume_not_contracted", condFail.volume_not_contracted || 0],
                      ]
                    : [];
                  const otherFails = Object.entries(kpi.failReasons)
                    .filter(([r]) => r !== "_condFail")
                    .sort((a, b) => (b[1] as number) - (a[1] as number))
                    .slice(0, 3);
                  const hasConds = conds.some(([,v]) => v > 0);
                  const hasOther = otherFails.length > 0;
                  if (!hasConds && !hasOther) return null;
                  return (
                    <div className="flex flex-col gap-1.5 px-3 py-2.5 flex-1 min-w-[220px]">
                      {hasConds && (
                        <>
                          <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide">
                            Condizioni che bloccano Flag OK (su {trendOkWin.toLocaleString()} finestre TrendOK)
                          </span>
                          <div className="space-y-1">
                            {conds.map(([label, count]) => {
                              const pct = trendOkWin > 0 ? (count / trendOkWin * 100) : 0;
                              const colors: Record<string, string> = {
                                range_too_wide:        "bg-orange-400",
                                slope_negative:        "bg-red-400",
                                volume_not_contracted: "bg-blue-400",
                              };
                              return (
                                <div key={label} className="flex items-center gap-1.5 text-[9px]">
                                  <span className="w-32 shrink-0 text-slate-600 font-mono">{label}</span>
                                  <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                                    <div className={`h-full rounded-full ${colors[label] || "bg-slate-400"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                                  </div>
                                  <span className="w-10 text-right font-semibold text-slate-700">{pct.toFixed(0)}%</span>
                                  <span className="text-slate-400">({count.toLocaleString()})</span>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}
                      {hasOther && (
                        <>
                          <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide mt-1">Combinazioni fail (missed opp.)</span>
                          <div className="flex flex-wrap gap-1">
                            {otherFails.map(([r, c]) => (
                              <span key={r} className="rounded bg-red-50 px-1.5 py-0.5 text-[9px] text-red-600 font-mono">{r} <strong>{c as number}</strong></span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* ── Filtri ticker ── */}
              {faModalTickers.length > 1 && (
                <div className="flex items-center gap-2 px-6 py-2 border-b border-slate-100 bg-white flex-shrink-0">
                  <span className="text-[10px] font-semibold text-slate-500 shrink-0">Ticker:</span>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Filtra ticker…"
                      value={faModalTickerFilter[0] ?? ""}
                      onChange={(e) => {
                        const v = e.target.value.toUpperCase();
                        setFaModalTickerFilter(v ? [v] : []);
                      }}
                      className="w-36 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-700 placeholder-slate-400 focus:border-violet-400 focus:outline-none"
                    />
                    {faModalTickerFilter.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setFaModalTickerFilter([])}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-[11px]"
                      >✕</button>
                    )}
                  </div>
                  {faModalTickerFilter.length > 0 && faModalTickers.filter(t => t.startsWith(faModalTickerFilter[0] ?? "")).slice(0, 8).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFaModalTickerFilter([t])}
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition ${faModalTickerFilter[0] === t ? "bg-slate-800 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                    >{t}</button>
                  ))}
                  {faModalTickerFilter.length === 0 && (
                    <span className="text-[10px] text-slate-400">{faModalTickers.length} ticker</span>
                  )}
                </div>
              )}

              {/* ── Filtri tipo evento ── */}
              <div className="flex items-center gap-2 px-6 py-2.5 border-b border-slate-100 flex-shrink-0">
                <span className="text-[10px] font-semibold text-slate-500 mr-1">Mostra:</span>
                {(["all","flag_ok","missed"] as const).map((f) => {
                  const ss = faModalServerStats;
                  const count = f === "all"
                    ? (ss ? Number(ss.total_events) : faModalAllEvents.length)
                    : f === "flag_ok"
                      ? (ss ? Number(ss.flag_ok_count) : faModalAllEvents.filter(e => Number(e.flag_ok)===1).length)
                      : (ss ? Number(ss.missed_count) : faModalAllEvents.filter(e => Number(e.flag_ok)===0 && Number(e.spike_detected)===1).length);
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={async () => {
                        if (faModalEventTypeFilter === f) return;
                        setFaModalEventTypeFilter(f);
                        if (!faModalRun) return;
                        setFaModalLoading(true);
                        try {
                          const evData = await fetchFaEvents(faModalRun.run_id, f);
                          setFaModalAllEvents(Array.isArray(evData?.items) ? evData.items : []);
                          setFaModalTotalCount(evData?.count ?? 0);
                        } finally { setFaModalLoading(false); }
                      }}
                      className={`rounded-full px-3 py-1 text-[11px] font-medium transition ${
                        faModalEventTypeFilter === f ? "bg-slate-800 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >{f === "all" ? `Tutti (${count.toLocaleString()})` : f === "flag_ok" ? `Flag OK (${count.toLocaleString()})` : `Spike persi (${count.toLocaleString()})`}</button>
                  );
                })}
                <span className="ml-auto flex items-center gap-3 text-[10px] text-slate-400">
                  {faModalView === "table" && (
                    <span>
                      {faModalFilteredEvents.length} righe mostrate
                      {faModalTotalCount > faModalAllEvents.length && (
                        <span className="ml-1 text-amber-600 font-semibold">
                          — tabella {faModalAllEvents.length}/{faModalTotalCount} (KPI da stats completi ✓)
                        </span>
                      )}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setFaModalView((v) => v === "table" ? "chart" : "table")}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50 transition"
                  >
                    {faModalView === "table" ? "📊 View Chart" : "☰ View Table"}
                  </button>
                </span>
              </div>

              {/* ── Chart ── */}
              {faModalView === "chart" && (() => {
                // ── Line chart per ticker selezionato ──
                if (faChartTicker && faModalRun) {
                  const atrPeriod = Number((faModalRun as any).atr_period ?? 20);
                  // Durata approssimativa di una candela in ms per il tf del run
                  const tfMs: Record<string, number> = {
                    "1min": 60_000, "5min": 300_000, "15min": 900_000, "30min": 1_800_000,
                    "1Hour": 3_600_000, "1h": 3_600_000,
                    "4Hour": 14_400_000, "1Day": 86_400_000,
                  };
                  const candleMs = tfMs[faModalRun.tf] ?? 3_600_000;
                  const windowMs = atrPeriod * candleMs;

                  const lineData = faChartCandles
                    .map((c: any) => ({ x: new Date(c.t).getTime(), y: Number(c.c ?? c.close) }))
                    .filter((c) => Number.isFinite(c.x) && Number.isFinite(c.y))
                    .sort((a, b) => a.x - b.x);

                  // Usa eventi fetchati specificamente per questo ticker (senza limite 1000)
                  const tickerEvents = faChartEvents.length > 0
                    ? faChartEvents
                    : faModalAllEvents.filter((e) => e.symbol === faChartTicker);

                  // Aree colorate: ogni evento copre [candle_ts - windowMs, candle_ts]
                  // Prima le TrendOK (viola), poi le FlagOK sopra (verde) così il verde vince
                  const trendOnlyEvents = tickerEvents.filter((e) => Number(e.trend_ok) === 1 && Number(e.flag_ok) === 0);
                  const flagOkEvents    = tickerEvents.filter((e) => Number(e.flag_ok) === 1);

                  const areas: any[] = [];
                  trendOnlyEvents.forEach((e) => {
                    const ts = new Date(e.candle_ts || "").getTime();
                    if (!ts) return;
                    areas.push({
                      x:          ts - windowMs,
                      x2:         ts,
                      fillColor:  "#8b5cf6",
                      opacity:    0.25,
                      borderColor:"#8b5cf6",
                      borderWidth: 0,
                    });
                  });
                  flagOkEvents.forEach((e) => {
                    const ts = new Date(e.candle_ts || "").getTime();
                    if (!ts) return;
                    areas.push({
                      x:          ts - windowMs,
                      x2:         ts,
                      fillColor:  "#10b981",
                      opacity:    0.40,
                      borderColor:"#10b981",
                      borderWidth: 1,
                      label: {
                        text: "F",
                        style: { background: "#10b981", color: "#fff", fontSize: "9px", padding: { top: 1, bottom: 1, left: 3, right: 3 } },
                        position: "top",
                        offsetY: 4,
                      },
                    });
                  });

                  return (
                    <div className="flex-1 flex flex-col min-h-0 px-4 py-3">
                      <div className="flex items-center gap-3 mb-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => { setFaChartTicker(null); setFaChartCandles([]); setFaChartEvents([]); }}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] text-slate-600 hover:bg-slate-50"
                        >← Tutti i ticker</button>
                        <span className="text-sm font-bold text-slate-800">{faChartTicker}</span>
                        <span className="text-[10px] text-slate-400">{lineData.length} candele · atrPeriod={atrPeriod}</span>
                        <span className="flex items-center gap-1.5 text-[10px] text-violet-600">
                          <span className="inline-block w-3 h-3 rounded-sm bg-violet-500 opacity-40"/>TrendOK
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] text-emerald-600">
                          <span className="inline-block w-3 h-3 rounded-sm bg-emerald-500 opacity-60"/>FlagOK
                        </span>
                        {faChartLoading && <span className="text-[10px] text-slate-400 animate-pulse">Caricamento…</span>}
                      </div>
                      {lineData.length === 0 && !faChartLoading ? (
                        <div className="flex items-center justify-center flex-1 text-sm text-slate-400">Nessuna candela disponibile per {faChartTicker}</div>
                      ) : (
                        <div className="flex-1 min-h-0" style={{ minHeight: 400 }}>
                          <ReactApexChart
                            key={faChartTicker}
                            type="line"
                            height="100%"
                            series={[{ name: faChartTicker, data: lineData }]}
                            options={{
                              chart: {
                                type: "line",
                                toolbar: { show: true, tools: { zoom: true, pan: true, reset: true, download: false } },
                                animations: { enabled: false },
                                zoom: { enabled: true, type: "x" },
                              },
                              stroke: { curve: "smooth", width: 1.5, colors: ["#1e293b"] },
                              xaxis: { type: "datetime", labels: { datetimeUTC: false, format: "MMM yy" } },
                              yaxis: { labels: { formatter: (v: number) => v.toFixed(2) }, tooltip: { enabled: true } },
                              annotations: { xaxis: areas },
                              tooltip: { x: { format: "dd MMM yyyy HH:mm" }, y: { formatter: (v: number) => v.toFixed(2) } },
                              grid: { borderColor: "#f1f5f9", strokeDashArray: 3 },
                              markers: { size: 0 },
                              colors: ["#1e293b"],
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                }

                // ── Bar chart per tutti i ticker ──
                const bySymbol = (faModalServerStats?.by_symbol || {}) as Record<string, any>;
                const rows = Object.entries(bySymbol)
                  .map(([sym, s]: [string, any]) => {
                    const trendOkWin   = Number(s.totalTrendOkWindows ?? 0);
                    const flagOkCount  = Number(s.flagOk ?? 0);
                    const trendSpikes  = Number(s.trendOkSpike ?? 0);
                    const flagSpikes   = Number(s.flagOkSpike ?? 0);
                    const flagConf     = Number(s.flagOkConfirmed ?? 0);
                    const pctTrend     = trendOkWin  > 0 ? (trendSpikes / trendOkWin)  * 100 : 0;
                    const pctFlag      = flagOkCount > 0 ? (flagSpikes  / flagOkCount)  * 100 : 0;
                    const pctConf      = flagOkCount > 0 ? (flagConf    / flagOkCount)  * 100 : 0;
                    return { sym, pctTrend, pctFlag, pctConf, trendSpikes, trendOkWin, flagSpikes, flagOkCount, flagConf };
                  })
                  .filter((r) => r.trendOkWin > 0)
                  .sort((a, b) => b.pctTrend - a.pctTrend);

                if (rows.length === 0) {
                  return (
                    <div className="flex items-center justify-center h-32 text-sm text-slate-400">
                      Nessun dato by_symbol disponibile per questo run.
                    </div>
                  );
                }

                const maxPct = Math.max(...rows.map((r) => Math.max(r.pctTrend, r.pctFlag, r.pctConf)), 1);

                const handleTickerClick = async (sym: string) => {
                  if (!faModalRun) return;
                  setFaChartTicker(sym);
                  setFaChartCandles([]);
                  setFaChartEvents([]);
                  setFaChartLoading(true);
                  try {
                    const headers: Record<string, string> = {};
                    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
                    if (token) headers["Authorization"] = `Bearer ${token}`;
                    // Fetch candele e eventi in parallelo
                    const [candleRes, eventsRes] = await Promise.all([
                      fetch(
                        `${env.apiBaseUrl}/cachemanager/candles?symbol=${encodeURIComponent(sym)}&startDate=${faModalRun.date_from}&endDate=${faModalRun.date_to}&tf=${faModalRun.tf}`,
                        { headers }
                      ),
                      fetch(
                        `${env.apiBaseUrl}/datahub/api/table/flag_analysis_events?run_id=${encodeURIComponent(faModalRun.run_id)}&symbol=${encodeURIComponent(sym)}&limit=5000`,
                        { headers }
                      ),
                    ]);
                    const candleData = await candleRes.json();
                    const eventsData = await eventsRes.json();
                    setFaChartCandles(Array.isArray(candleData) ? candleData : []);
                    setFaChartEvents(Array.isArray(eventsData?.items) ? eventsData.items : []);
                  } catch { setFaChartCandles([]); setFaChartEvents([]); }
                  finally { setFaChartLoading(false); }
                };

                return (
                  <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                        Per Symbol — clicca un ticker per il chart ({rows.length} ticker)
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-violet-600"><span className="inline-block w-3 h-2 rounded bg-violet-500"/> TrendOK→Spike</span>
                      <span className="flex items-center gap-1 text-[10px] text-emerald-600"><span className="inline-block w-3 h-2 rounded bg-emerald-500"/> FlagOK→Spike</span>
                      <span className="flex items-center gap-1 text-[10px] text-indigo-600"><span className="inline-block w-3 h-2 rounded bg-indigo-500"/> FlagOK→Confermato</span>
                    </div>
                    <div className="space-y-2">
                      {rows.map(({ sym, pctTrend, pctFlag, pctConf, trendSpikes, trendOkWin, flagSpikes, flagOkCount, flagConf }) => (
                        <div key={sym} className="flex items-center gap-2 text-[11px]">
                          <button
                            type="button"
                            onClick={() => handleTickerClick(sym)}
                            className="w-12 shrink-0 font-semibold text-slate-700 text-right hover:text-violet-700 hover:underline transition"
                          >{sym}</button>
                          <div className="flex-1 flex flex-col gap-0.5">
                            <div className="flex items-center gap-1">
                              <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                <div className="h-full rounded-full bg-violet-500" style={{ width: `${(pctTrend / maxPct) * 100}%` }} />
                              </div>
                              <span className="w-12 text-right font-mono text-violet-700 text-[10px]">{pctTrend.toFixed(1)}%</span>
                              <span className="w-16 text-right text-slate-400 text-[10px]">{trendSpikes}/{trendOkWin}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(pctFlag / maxPct) * 100}%` }} />
                              </div>
                              <span className="w-12 text-right font-mono text-emerald-700 text-[10px]">{flagOkCount > 0 ? `${pctFlag.toFixed(1)}%` : "—"}</span>
                              <span className="w-16 text-right text-slate-400 text-[10px]">{flagOkCount > 0 ? `${flagSpikes}/${flagOkCount}` : "—"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                <div className="h-full rounded-full bg-indigo-500" style={{ width: `${(pctConf / maxPct) * 100}%` }} />
                              </div>
                              <span className="w-12 text-right font-mono text-indigo-700 text-[10px]">{flagOkCount > 0 ? `${pctConf.toFixed(1)}%` : "—"}</span>
                              <span className="w-16 text-right text-slate-400 text-[10px]">{flagOkCount > 0 ? `${flagConf}/${flagOkCount}` : "—"}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* ── Tabella ── */}
              {faModalView === "table" && <div className="flex-1 overflow-auto min-h-0">
                {faModalLoading ? (
                  <div className="flex items-center justify-center h-32 text-sm text-slate-500">Caricamento eventi…</div>
                ) : faModalFilteredEvents.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-sm text-slate-400">Nessun evento con il filtro selezionato.</div>
                ) : (
                  <table className="w-full text-xs border-collapse">
                    <thead className="bg-slate-50 text-[11px] text-slate-500 sticky top-0 z-10">
                      <tr>
                        {["Ticker","Timestamp","Flag OK","Trend OK","Prezzo","BreakLevel","FlagRange","Soglia","ATR","Slope","VolFlag/Impl","Motivo fail","Spike","Spike%","Spike TS","Conf.","Drawdown%"].map((h) => (
                          <th key={h} className="px-2 py-2 text-left font-semibold whitespace-nowrap border-b border-slate-200">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {faModalFilteredEvents.map((e) => {
                        const n  = (v: any) => (v != null && v !== "" ? Number(v) : null);
                        const nfd = (v: any, d: number) => { const x = n(v); return x != null && isFinite(x) ? x.toFixed(d) : "—"; };
                        const flagOk          = Number(e.flag_ok) === 1;
                        const trendOk         = Number(e.trend_ok) === 1;
                        const spikeDetected   = Number(e.spike_detected) === 1;
                        const breakoutConf    = Number(e.breakout_confirmed) === 1;
                        const spikePct        = n(e.spike_pct);
                        const drawdown        = n(e.max_drawdown_pct);
                        return (
                          <tr key={e.id} className={`hover:bg-slate-50 ${flagOk ? "bg-emerald-50/30" : spikeDetected ? "bg-amber-50/30" : ""}`}>
                            <td className="px-2 py-1.5 font-semibold">{e.symbol}</td>
                            <td className="px-2 py-1.5 font-mono text-[10px] whitespace-nowrap">{e.candle_ts?.slice(0, 16) || "—"}</td>
                            <td className="px-2 py-1.5 text-center">
                              <span className={`rounded-full px-2 py-0.5 font-bold text-[10px] ${flagOk ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>{flagOk ? "✓" : "✗"}</span>
                            </td>
                            <td className="px-2 py-1.5 text-center">{trendOk ? <span className="text-emerald-600">✓</span> : <span className="text-slate-300">—</span>}</td>
                            <td className="px-2 py-1.5 text-right font-mono">{nfd(e.price_at_signal, 2)}</td>
                            <td className="px-2 py-1.5 text-right font-mono">{nfd(e.break_level, 2)}</td>
                            <td className="px-2 py-1.5 text-right font-mono">{nfd(e.flag_range, 4)}</td>
                            <td className="px-2 py-1.5 text-right font-mono">{nfd(e.flag_threshold, 4)}</td>
                            <td className="px-2 py-1.5 text-right font-mono">{nfd(e.atr_last, 4)}</td>
                            <td className="px-2 py-1.5 text-right font-mono">{nfd(e.slope, 4)}</td>
                            <td className="px-2 py-1.5 text-right font-mono text-[10px]">
                              {n(e.avg_vol_flag) != null ? Math.round(n(e.avg_vol_flag)!).toLocaleString() : "—"}
                              {" / "}
                              {n(e.avg_vol_impulse) != null ? Math.round(n(e.avg_vol_impulse)!).toLocaleString() : "—"}
                            </td>
                            <td className="px-2 py-1.5">
                              {e.fail_reason ? <span className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] text-red-600">{e.fail_reason}</span> : <span className="text-slate-300">—</span>}
                            </td>
                            <td className="px-2 py-1.5 text-center">
                              {spikeDetected ? <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">spike</span> : <span className="text-slate-300">—</span>}
                            </td>
                            <td className={`px-2 py-1.5 text-right font-mono font-semibold ${spikePct != null && spikePct > 0 ? "text-emerald-600" : "text-slate-400"}`}>
                              {spikePct != null ? `+${spikePct.toFixed(2)}%` : "—"}
                            </td>
                            <td className="px-2 py-1.5 font-mono text-[10px] whitespace-nowrap">{e.spike_candle_ts?.slice(0, 16) || "—"}</td>
                            <td className="px-2 py-1.5 text-center">
                              {breakoutConf ? <span className="text-emerald-600 font-bold">✓</span> : <span className="text-slate-300">—</span>}
                            </td>
                            <td className={`px-2 py-1.5 text-right font-mono ${drawdown != null && drawdown < 0 ? "text-red-500" : "text-slate-400"}`}>
                              {drawdown != null ? `${drawdown.toFixed(2)}%` : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>}

            </div>
          </div>
        );
      })()}
    </div>
  );
}
