import { useEffect, useMemo, useState } from "react";
import {
  fetchFundamentals,
  fetchFmpVariant,
  fetchFmpIncomeStatement,
  fetchFmpBalanceSheet,
  fetchFmpCashFlow,
  fetchFmpFinancialScores,
  fetchFmpOwnerEarnings,
  fetchFmpEnterpriseValues,
  fetchFmpFinancialReports,
  fetchFmpRevenueProductSegmentation,
  fetchFmpRevenueGeographicSegmentation,
  fetchFmpKeyMetrics,
  fetchFmpKeyMetricsTtm,
  fetchFmpRatios,
  fetchFmpRatiosTtm,
  fetchGlossary,
  type FundamentalRecord,
  fetchFundamentalsHistory,
  fetchUserFundamentalsView,
} from "../../api/fundamentals";
import SectionHeader from "../molecules/content/SectionHeader";
import ReactApexChart from "react-apexcharts";
import ReactCountryFlag from "react-country-flag";
import TickerDetailTab, { type MomentumComponents } from "./tickers/TickerDetailTab";
import TickerStatementTab, { type GlossaryDoc } from "./tickers/TickerStatementTab";
import TickerRatiosTab from "./tickers/TickerRatiosTab";
import TickerAnalysisTab from "./tickers/TickerAnalysisTab";
import TickerFinancialReportTab from "./tickers/TickerFinancialReportTab";
import TickerSegmentationTab from "./tickers/TickerSegmentationTab";
import TickerNewsTab from "./tickers/TickerNewsTab";
import TickerChartTab from "./tickers/TickerChartTab";
import { env } from "../../config/env";
import { useState as useStateReact } from "react";

type SortKey = "momentum" | "quality" | "risk" | "valuation" | "total" | "doubleTop" | "growthProbability";
type StatementStatus = "idle" | "loading" | "error" | "no-key";

const UI_STATE_KEY = "astraai:tickers:ui";
const SCORE_VISIBILITY_KEY = "astraai:tickers:scores";

const getHashSymbol = () => {
  if (typeof window === "undefined") return null;
  const cleaned = window.location.hash.replace(/^#\/?/, "");
  const parts = cleaned.split("/");
  if (parts[0] === "dashboard" && parts[1] === "tickers" && parts[2]) {
    return decodeURIComponent(parts[2]);
  }
  return null;
};

const clampScore = (value: number) => Math.max(0, Math.min(100, value));

const parseScore = (value: unknown): number | null => {
  if (value === null || value === undefined) return null;
  const parsed = typeof value === "string" ? Number(value) : (value as number);
  if (!Number.isFinite(parsed)) return null;
  return clampScore(parsed);
};

const getScoreColor = (value: number) => {
  if (value < 20) return { bar: "bg-red-500", text: "text-red-600" };
  if (value < 40) return { bar: "bg-orange-500", text: "text-orange-600" };
  if (value < 60) return { bar: "bg-amber-400", text: "text-amber-600" };
  if (value < 80) return { bar: "bg-blue-500", text: "text-blue-600" };
  return { bar: "bg-green-500", text: "text-green-600" };
};

const formatNumber = (value: number | null) => {
  if (value === null || Number.isNaN(value)) return "-";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
};

const getUpdateDeltaHours = (value: unknown) => {
  if (!value) return "-";
  const date = new Date(value as any);
  if (Number.isNaN(date.getTime())) return "-";
  const diffMs = Date.now() - date.getTime();
  if (!Number.isFinite(diffMs)) return "-";
  const totalHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
  return totalHours;
};

const formatUpdateDelta = (totalHours: number | "-") => {
  if (totalHours === "-") return "-";
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
};

const getUpdateStatusClass = (totalHours: number | "-") => {
  if (totalHours === "-") return "bg-slate-300";
  if (totalHours < 1) return "bg-emerald-500";
  if (totalHours < 3) return "bg-yellow-400";
  if (totalHours < 8) return "bg-amber-500";
  return "bg-red-500";
};

const formatCurrency = (value: number | null, currency?: string) => {
  if (value === null || Number.isNaN(value)) return "-";
  if (currency) {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(value);
    } catch {
      // fallback
    }
  }
  return `${formatNumber(value)} ${currency ?? ""}`.trim();
};

const formatDetailValue = (value: unknown) => {
  if (value === null || value === undefined) return "-";
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.length ? JSON.stringify(value) : "[]";
  if (typeof value === "object") return JSON.stringify(value);
  return "-";
};

type ParsedMomentum = MomentumComponents & { raw: Record<string, unknown> | null };

const parseMomentumJson = (value: unknown): ParsedMomentum | null => {
  if (value === null || value === undefined) return null;
  let parsed: any = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      return null;
    }
  }
  if (!parsed || typeof parsed !== "object") return null;

  const scoreNum = typeof parsed.score === "number" ? parsed.score : Number(parsed.score);
  const doubleTopScoreNum =
    typeof parsed.doubleTopScore === "number" ? parsed.doubleTopScore : Number(parsed.doubleTopScore);
  const components =
    parsed.components && typeof parsed.components === "object" ? (parsed.components as Record<string, unknown>) : null;

  return {
    raw: parsed as Record<string, unknown>,
    score: Number.isFinite(scoreNum) ? scoreNum : null,
    doubleTopScore: Number.isFinite(doubleTopScoreNum) ? doubleTopScoreNum : null,
    components,
  };
};

const getDoubleTopScore = (record: FundamentalRecord): number | null => {
  const parsed = parseMomentumJson((record as any).momentum_json);
  return parsed?.doubleTopScore ?? null;
};

type UserFilter = { name: string; value?: number | null; comparator?: string; enabled?: boolean };

const FILTER_FIELD_MAP: Record<string, string[]> = {
  growthProbability: [
    "user_grow_score",
    "grow_score",
    "growth_probability",
    "growthProbability",
    "user_growth_probability",
  ],
  growthMomentum: ["user_momentum_score", "momentum_score", "momentumScore", "user_momentum"],
  growthRisk: ["user_risk_score", "risk_score", "riskScore", "short_risk_score"],
  growthMarket: [
    "user_market_score",
    "market_score",
    "marketScore",
    "momentum_json.components.marketRisk.score",
    "momentum.components.marketRisk.score",
  ],
  mom1m: [
    "user_mom1m_score",
    "mom_1m",
    "mom1m",
    "momentum_1m",
    "mom1mScore",
    "momentum.components.mom1mScore",
    "momentum_json.components.mom1mScore",
  ],
  mom3m: [
    "user_mom3m_score",
    "mom_3m",
    "mom3m",
    "momentum_3m",
    "mom3mScore",
    "momentum.components.mom3mScore",
    "momentum_json.components.mom3mScore",
  ],
  mom6m: [
    "user_mom6m_score",
    "mom_6m",
    "mom6m",
    "momentum_6m",
    "mom6mScore",
    "momentum.components.mom6mScore",
    "momentum_json.components.mom6mScore",
  ],
  mom12m: [
    "user_mom12m_score",
    "mom_12m",
    "mom12m",
    "momentum_12m",
    "mom12mScore",
    "momentum.components.mom12mScore",
    "momentum_json.components.mom12mScore",
  ],
  doubletopScore: [
    "user_double_top_score",
    "double_top_score",
    "doubletopScore",
    "momentum.components.doubleTop.score",
    "momentum_json.components.doubleTop.score",
  ],
};

const ORDER_FIELD_MAP: Record<string, string[]> = {
  growth_probability: ["user_grow_score", "grow_score", "growth_probability"],
  momentum_score: ["user_momentum_score", "momentum_score"],
  risk_score: ["user_risk_score", "risk_score"],
  market_score: [
    "user_market_score",
    "market_score",
    "momentum_json.components.marketRisk.score",
    "momentum.components.marketRisk.score",
  ],
  mom1mScore: [
    "user_mom1m_score",
    "mom_1m",
    "mom1m",
    "momentum.components.mom1mScore",
    "momentum_json.components.mom1mScore",
  ],
  mom3mScore: [
    "user_mom3m_score",
    "mom_3m",
    "mom3m",
    "momentum.components.mom3mScore",
    "momentum_json.components.mom3mScore",
  ],
  mom6mScore: [
    "user_mom6m_score",
    "mom_6m",
    "mom6m",
    "momentum.components.mom6mScore",
    "momentum_json.components.mom6mScore",
  ],
  mom12mScore: [
    "user_mom12m_score",
    "mom_12m",
    "mom12m",
    "momentum.components.mom12mScore",
    "momentum_json.components.mom12mScore",
  ],
  double_top_score: [
    "user_double_top_score",
    "double_top_score",
    "momentum.components.doubleTop.score",
    "momentum_json.components.doubleTop.score",
  ],
};

const getNumericField = (record: any, keys: string[]): number | null => {
  const getByPath = (obj: any, path: string) => {
    if (!obj || typeof obj !== "object") return undefined;
    const parts = path.split(".");
    let cur = obj;
    for (const p of parts) {
      if (cur && typeof cur === "object" && p in cur) {
        cur = cur[p];
      } else {
        return undefined;
      }
    }
    return cur;
  };

  for (const k of keys) {
    let v: any;
    if (k.includes(".")) {
      v = getByPath(record, k);
    } else if (k in record) {
      v = record[k];
    }
    if (v === undefined) continue;
    const num = typeof v === "string" ? Number(v) : (v as number);
    if (Number.isFinite(num)) return num;
  }
  return null;
};

const applyUserFilters = (records: FundamentalRecord[], filters: UserFilter[]) => {
  if (!Array.isArray(filters) || !filters.length) return records;
  return records.filter((rec) => {
    for (const f of filters) {
      if (!f?.enabled) continue;
      const targetKeys = FILTER_FIELD_MAP[f.name] || [];
      if (!targetKeys.length) continue;
      const recVal = getNumericField(rec as any, targetKeys);
      // se il valore non è disponibile, il filtro non è soddisfatto
      if (recVal === null) return false;
      const filterVal = Number(f.value);
      if (!Number.isFinite(filterVal)) continue;
      const cmp = (f.comparator || "GT").toUpperCase() === "LT" ? "LT" : "GT";
      if (cmp === "GT" && !(recVal >= filterVal)) return false;
      if (cmp === "LT" && !(recVal <= filterVal)) return false;
    }
    return true;
  });
};

export type TickersPageProps = {
  useUserFundamentals?: boolean;
};

export function TickersPage({ useUserFundamentals = false }: TickersPageProps) {
  const [records, setRecords] = useState<FundamentalRecord[]>([]);
  const [historyCache, setHistoryCache] = useState<Record<string, FundamentalRecord[]>>({});
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("today");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [sortKey, setSortKey] = useState<SortKey>("total");
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(() => getHashSymbol());
  const [selectedRecord, setSelectedRecord] = useState<FundamentalRecord | null>(null);
  const [fmpInfo, setFmpInfo] = useState<any | null>(null);
  const [fmpStatus, setFmpStatus] = useState<"idle" | "loading" | "error" | "no-key">("idle");
  const [infoTab, setInfoTab] = useState<
    "chart" | "detail" | "statement" | "ratios" | "score" | "financialReport" | "segmentation" | "news"
  >("chart");
  const [statementTab, setStatementTab] = useState<"income" | "balance" | "cash">("income");
  const [statementData, setStatementData] = useState<Record<string, { docs: any[]; status: StatementStatus }>>({
    income: { docs: [], status: "idle" },
    balance: { docs: [], status: "idle" },
    cash: { docs: [], status: "idle" },
  });
  const [glossaryState, setGlossaryState] = useState<Record<
    string,
    { doc: GlossaryDoc | null; status: "idle" | "loading" | "error"; error?: string }
  >>({
    income: { doc: null, status: "idle" },
    balance: { doc: null, status: "idle" },
    cash: { doc: null, status: "idle" },
    keyMetrics: { doc: null, status: "idle" },
    ratios: { doc: null, status: "idle" },
    keyMetricsTtm: { doc: null, status: "idle" },
    ratiosTtm: { doc: null, status: "idle" },
    financial: { doc: null, status: "idle" },
    ownerEarnings: { doc: null, status: "idle" },
    enterpriseValues: { doc: null, status: "idle" },
  });

  const [ratiosTab, setRatiosTab] = useState<"keyMetrics" | "ratios" | "keyMetricsTtm" | "ratiosTtm">("keyMetrics");
  const [ratiosData, setRatiosData] = useState<Record<string, { docs: any[]; status: StatementStatus }>>({
    keyMetrics: { docs: [], status: "idle" },
    ratios: { docs: [], status: "idle" },
    keyMetricsTtm: { docs: [], status: "idle" },
    ratiosTtm: { docs: [], status: "idle" },
  });
  const [uiRestored, setUiRestored] = useState(false);
  const [userFilters, setUserFilters] = useState<UserFilter[]>([]);
  const [userOrder, setUserOrder] = useState<{ field: string; direction: "ASC" | "DESC"; order_id?: number }[]>([]);
  const [showRadar, setShowRadar] = useState(true);
  const [showGrow, setShowGrow] = useState(true);
  const [showMomentum, setShowMomentum] = useState(true);
  const [showRisk, setShowRisk] = useState(true);
  const [showMarket, setShowMarket] = useState(true);
  const [showMom1, setShowMom1] = useState(true);
  const [showMom3, setShowMom3] = useState(true);
  const [showMom6, setShowMom6] = useState(true);
  const [showMom12, setShowMom12] = useState(true);
  const [showDoubleTop, setShowDoubleTop] = useState(true);
  const [scoreMenuOpen, setScoreMenuOpen] = useStateReact(false);
  const [scoreMenuAnchor, setScoreMenuAnchor] = useStateReact<{ x: number; y: number } | null>(null);
  const [orderMenuOpen, setOrderMenuOpen] = useStateReact(false);
  const [orderMenuAnchor, setOrderMenuAnchor] = useStateReact<{ x: number; y: number } | null>(null);
  const [scoresLoaded, setScoresLoaded] = useState(false);
  const buildScoreVisibility = () => ({
    radar: showRadar,
    grow: showGrow,
    momentum: showMomentum,
    risk: showRisk,
    market: showMarket,
    mom1: showMom1,
    mom3: showMom3,
    mom6: showMom6,
    mom12: showMom12,
    doubleTop: showDoubleTop,
  });
  const persistScoreVisibility = (state: ReturnType<typeof buildScoreVisibility>) => {
    if (typeof localStorage === "undefined") return;
    try {
      localStorage.setItem(SCORE_VISIBILITY_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  };

  // Ripristina l'UI (filtro/ordinamento) se salvata in precedenza.
  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    try {
      const raw = localStorage.getItem(UI_STATE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<{
          selectedDate: string;
          searchTerm: string;
          selectedIndustry: string;
          selectedCountry: string;
          sortKey: SortKey;
        }>;
        if (parsed.selectedDate) setSelectedDate(parsed.selectedDate);
        if (parsed.searchTerm !== undefined) setSearchTerm(parsed.searchTerm);
        if (parsed.selectedIndustry !== undefined) setSelectedIndustry(parsed.selectedIndustry);
        if (parsed.selectedCountry !== undefined) setSelectedCountry(parsed.selectedCountry);
        if (parsed.sortKey) setSortKey(parsed.sortKey);
      }
    } catch {
      // ignora errori di parsing
    } finally {
      setUiRestored(true);
    }
  }, []);

  // Carica preferenze visibilità score
  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    try {
      const raw = localStorage.getItem(SCORE_VISIBILITY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<{
          radar: boolean;
          grow: boolean;
          momentum: boolean;
          risk: boolean;
          market: boolean;
          mom1: boolean;
          mom3: boolean;
          mom6: boolean;
          mom12: boolean;
        }>;
        if (typeof parsed.radar === "boolean") setShowRadar(parsed.radar);
        if (typeof parsed.grow === "boolean") setShowGrow(parsed.grow);
        if (typeof parsed.momentum === "boolean") setShowMomentum(parsed.momentum);
        if (typeof parsed.risk === "boolean") setShowRisk(parsed.risk);
        if (typeof parsed.market === "boolean") setShowMarket(parsed.market);
        if (typeof parsed.mom1 === "boolean") setShowMom1(parsed.mom1);
        if (typeof parsed.mom3 === "boolean") setShowMom3(parsed.mom3);
        if (typeof parsed.mom6 === "boolean") setShowMom6(parsed.mom6);
        if (typeof parsed.mom12 === "boolean") setShowMom12(parsed.mom12);
        if (typeof parsed.doubleTop === "boolean") setShowDoubleTop(parsed.doubleTop);
      }
    } catch {
      // ignore
    } finally {
      setScoresLoaded(true);
    }
  }, []);

  // Salva preferenze visibilità score
  useEffect(() => {
    if (!scoresLoaded || typeof localStorage === "undefined") return;
    persistScoreVisibility(buildScoreVisibility());
  }, [
    scoresLoaded,
    showRadar,
    showGrow,
    showMomentum,
    showRisk,
    showMarket,
    showMom1,
    showMom3,
    showMom6,
    showMom12,
    showDoubleTop,
  ]);

  // Persiste le preferenze di vista per tornare alla lista con gli stessi filtri.
  useEffect(() => {
    if (typeof localStorage === "undefined" || !uiRestored) return;
    const payload = {
      selectedDate,
      searchTerm,
      selectedIndustry,
      selectedCountry,
      sortKey,
    };
    try {
      localStorage.setItem(UI_STATE_KEY, JSON.stringify(payload));
    } catch {
      // best-effort
    }
  }, [selectedDate, searchTerm, selectedIndustry, selectedCountry, sortKey, uiRestored]);
  const [scoreData, setScoreData] = useState<{ doc: any | null; status: StatementStatus }>({
    doc: null,
    status: "idle",
  });
  const [scoreTab, setScoreTab] = useState<"financial" | "ownerEarnings" | "enterpriseValues">("financial");
  const [ownerData, setOwnerData] = useState<{ docs: any[]; status: StatementStatus }>({
    docs: [],
    status: "idle",
  });
  const [enterpriseData, setEnterpriseData] = useState<{ docs: any[]; status: StatementStatus }>({
    docs: [],
    status: "idle",
  });
  const [financialReportData, setFinancialReportData] = useState<{ doc: any | null; status: StatementStatus }>({
    doc: null,
    status: "idle",
  });
  const [segmentationTab, setSegmentationTab] = useState<"product" | "geographic">("product");
  const [segmentationData, setSegmentationData] = useState<{
    product: { docs: any[]; status: StatementStatus };
    geographic: { docs: any[]; status: StatementStatus };
  }>({
    product: { docs: [], status: "idle" },
    geographic: { docs: [], status: "idle" },
  });

  useEffect(() => {
    if (useUserFundamentals) {
      setAvailableDates(["today"]);
      return;
    }
    let active = true;
    fetchFundamentalsHistory({ days: 120 })
      .then(({ records: histRecords, dates }) => {
        if (!active) return;
        if (Array.isArray(dates)) setAvailableDates(dates);
        if (Array.isArray(histRecords)) {
          const grouped: Record<string, FundamentalRecord[]> = {};
          histRecords.forEach((r: any) => {
            const d = (r as any)?.as_of_date || (r as any)?.asOfDate;
            if (d) {
              grouped[d] = grouped[d] || [];
              grouped[d].push(r);
            }
          });
          setHistoryCache(grouped);
        }
      })
      .catch(() => {
        /* opzionale: silenzio, si usa solo per le date */
      });
    return () => {
      active = false;
    };
  }, [useUserFundamentals]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        if (useUserFundamentals) {
          const data = await fetchUserFundamentalsView();
          if (!active) return;
          setRecords(Array.isArray(data) ? data : []);
          return;
        }

        if (selectedDate === "today") {
          const data = await fetchFundamentals();
          if (!active) return;
          setRecords(Array.isArray(data) ? data : []);
          return;
        }

        // prova cache
        const cached = historyCache[selectedDate];
        if (cached) {
          if (!active) return;
          setRecords(cached);
          return;
        }

        const { records: histRecords } = await fetchFundamentalsHistory({ days: 120 });
        if (!active) return;
        const grouped: Record<string, FundamentalRecord[]> = {};
        histRecords.forEach((r: any) => {
          const d = (r as any)?.as_of_date || (r as any)?.asOfDate;
          if (d) {
            grouped[d] = grouped[d] || [];
            grouped[d].push(r);
          }
        });
        setHistoryCache((prev) => ({ ...prev, ...grouped }));
        setRecords(grouped[selectedDate] || []);
      } catch (err: any) {
        if (!active) return;
        const message =
          err?.message && typeof err.message === "string"
            ? err.message
            : "Errore durante il caricamento dei ticker";
        setError(message);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [selectedDate, useUserFundamentals, historyCache]);

  useEffect(() => {
    const syncSymbol = () => {
      setSelectedSymbol(getHashSymbol());
    };
    window.addEventListener("hashchange", syncSymbol);
    return () => window.removeEventListener("hashchange", syncSymbol);
  }, []);

  useEffect(() => {
    if (!useUserFundamentals) return;
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    if (!token) {
      setUserFilters([]);
      setUserOrder([]);
      return;
    }
    let active = true;
    fetch(`${env.apiBaseUrl}/tickerscanner/fundamentals/user-filters`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (!active) return;
        const rows = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        // Usa solo i filtri implementati al momento
        const allowed = new Set([
          "growthProbability",
          "growthMomentum",
          "growthRisk",
          "growthMarket",
          "mom1m",
          "mom3m",
          "mom6m",
          "mom12m",
          "doubletopScore",
        ]);
        const filtered = rows.filter((r: any) => allowed.has(r.filter_name || r.name));
        setUserFilters(
          filtered.map((r: any) => ({
            name: r.filter_name || r.name,
            value: Number(r.value),
            comparator: r.comparator || r.comp,
            enabled: r.enabled === 1 || r.enabled === true || r.enabled === "1",
          }))
        );
      })
      .catch(() => {
        if (active) {
          setUserFilters([]);
          setUserOrder([]);
        }
      });

    fetch(`${env.apiBaseUrl}/tickerscanner/fundamentals/user-order`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (!active) return;
        const rows = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        const parsed = rows
          .map((r: any) => ({
            field: r.field || r.order_field || r.name,
            direction: (r.direction || r.dir || "DESC").toUpperCase() === "ASC" ? "ASC" : "DESC",
            order_id: Number.isFinite(Number(r.order_id)) ? Number(r.order_id) : 1,
          }))
          .filter((r) => r.field)
          .sort((a, b) => (a.order_id || 0) - (b.order_id || 0));
        setUserOrder(parsed);
      })
      .catch(() => {
        if (active) setUserOrder([]);
      });
    return () => {
      active = false;
    };
  }, [useUserFundamentals]);

  const viewRecords = useMemo(
    () => (useUserFundamentals ? applyUserFilters(records, userFilters) : records),
    [records, useUserFundamentals, userFilters]
  );

  useEffect(() => {
    if (!selectedSymbol) {
      setSelectedRecord(null);
      setFmpInfo(null);
      setFmpStatus("idle");
      setStatementData({
        income: { docs: [], status: "idle" },
        balance: { docs: [], status: "idle" },
        cash: { docs: [], status: "idle" },
      });
      setRatiosData({
        keyMetrics: { docs: [], status: "idle" },
        ratios: { docs: [], status: "idle" },
        keyMetricsTtm: { docs: [], status: "idle" },
        ratiosTtm: { docs: [], status: "idle" },
      });
      setScoreData({ doc: null, status: "idle" });
      setOwnerData({ docs: [], status: "idle" });
      setEnterpriseData({ docs: [], status: "idle" });
      setFinancialReportData({ doc: null, status: "idle" });
      setSegmentationData({
        product: { docs: [], status: "idle" },
        geographic: { docs: [], status: "idle" },
      });
      return;
    }
    const found = viewRecords.find((item) => {
      const symbol = (item as any).ticker || (item as any).symbol;
      return typeof symbol === "string" && symbol.toUpperCase() === selectedSymbol.toUpperCase();
    });
    setSelectedRecord(found ?? null);
  }, [viewRecords, selectedSymbol]);

  useEffect(() => {
    if (!selectedSymbol) return;
    let active = true;
    const controller = new AbortController();
    setFmpStatus("loading");

    fetchFmpVariant(selectedSymbol, controller.signal)
      .then((doc) => {
        if (!active) return;
        if (doc) {
          console.log("FMP selected document", doc);
        }
        setFmpInfo(doc);
        setFmpStatus("idle");
      })
      .catch((err) => {
        if (!active || err.name === "AbortError") return;
        console.error("FMP fetch error", err);
        setFmpInfo(null);
        if (err.message === "Missing FMP API key") {
          setFmpStatus("no-key");
        } else {
          setFmpStatus("error");
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [selectedSymbol, env.fmpApiKey]);

  useEffect(() => {
    if (!selectedSymbol) return;
    const configs = [
      { key: "income", fetcher: fetchFmpIncomeStatement },
      { key: "balance", fetcher: fetchFmpBalanceSheet },
      { key: "cash", fetcher: fetchFmpCashFlow },
    ];

    configs.forEach((cfg) => {
      if (!env.fmpApiKey) {
        setStatementData((prev) => ({
          ...prev,
          [cfg.key]: { docs: [], status: "no-key" },
        }));
        return;
      }
      let active = true;
      const controller = new AbortController();
      setStatementData((prev) => ({
        ...prev,
        [cfg.key]: { ...(prev[cfg.key] || {}), status: "loading" },
      }));
      cfg
        .fetcher(selectedSymbol, controller.signal)
        .then((data) => {
          if (!active) return;
          setStatementData((prev) => ({
            ...prev,
            [cfg.key]: { docs: Array.isArray(data) ? data : [], status: "idle" },
          }));
        })
        .catch((err) => {
          if (!active || err.name === "AbortError") return;
          console.error("FMP statement error", cfg.key, err);
          setStatementData((prev) => ({
            ...prev,
            [cfg.key]: { docs: [], status: err.message === "Missing FMP API key" ? "no-key" : "error" },
          }));
        });

      return () => {
        active = false;
        controller.abort();
      };
    });
  }, [selectedSymbol, env.fmpApiKey]);

  useEffect(() => {
    if (!selectedSymbol) return;
    const configs = [
      { key: "keyMetrics", fetcher: fetchFmpKeyMetrics },
      { key: "ratios", fetcher: fetchFmpRatios },
      { key: "keyMetricsTtm", fetcher: fetchFmpKeyMetricsTtm },
      { key: "ratiosTtm", fetcher: fetchFmpRatiosTtm },
    ];

    configs.forEach((cfg) => {
      if (!env.fmpApiKey) {
        setRatiosData((prev) => ({
          ...prev,
          [cfg.key]: { docs: [], status: "no-key" },
        }));
        return;
      }
      let active = true;
      const controller = new AbortController();
      setRatiosData((prev) => ({
        ...prev,
        [cfg.key]: { ...(prev[cfg.key] || {}), status: "loading" },
      }));

      cfg
        .fetcher(selectedSymbol, controller.signal)
        .then((data) => {
          if (!active) return;
          setRatiosData((prev) => ({
            ...prev,
            [cfg.key]: { docs: Array.isArray(data) ? data : [], status: "idle" },
          }));
        })
        .catch((err) => {
          if (!active || err.name === "AbortError") return;
          console.error("FMP ratios error", cfg.key, err);
          setRatiosData((prev) => ({
            ...prev,
            [cfg.key]: { docs: [], status: err.message === "Missing FMP API key" ? "no-key" : "error" },
          }));
        });

      return () => {
        active = false;
        controller.abort();
      };
    });
  }, [selectedSymbol, env.fmpApiKey]);

  useEffect(() => {
    if (!selectedSymbol) return;
    if (!env.fmpApiKey) {
      setScoreData({ doc: null, status: "no-key" });
      return;
    }
    let active = true;
    const controller = new AbortController();
    setScoreData((prev) => ({ ...prev, status: "loading" }));

    fetchFmpFinancialScores(selectedSymbol, controller.signal)
      .then((docs) => {
        if (!active) return;
        const doc = Array.isArray(docs) && docs.length ? docs[0] : null;
        setScoreData({ doc, status: "idle" });
      })
      .catch((err) => {
        if (!active || err.name === "AbortError") return;
        console.error("FMP financial scores error", err);
        setScoreData({ doc: null, status: err.message === "Missing FMP API key" ? "no-key" : "error" });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [selectedSymbol, env.fmpApiKey]);

  useEffect(() => {
    if (!selectedSymbol) return;
    if (!env.fmpApiKey) {
      setOwnerData({ docs: [], status: "no-key" });
      return;
    }
    let active = true;
    const controller = new AbortController();
    setOwnerData((prev) => ({ ...prev, status: "loading" }));

    fetchFmpOwnerEarnings(selectedSymbol, controller.signal)
      .then((docs) => {
        if (!active) return;
        setOwnerData({ docs: Array.isArray(docs) ? docs : [], status: "idle" });
      })
      .catch((err) => {
        if (!active || err.name === "AbortError") return;
        console.error("FMP owner earnings error", err);
        setOwnerData({ docs: [], status: err.message === "Missing FMP API key" ? "no-key" : "error" });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [selectedSymbol, env.fmpApiKey]);

  useEffect(() => {
    if (!selectedSymbol) return;
    if (!env.fmpApiKey) {
      setEnterpriseData({ docs: [], status: "no-key" });
      return;
    }
    let active = true;
    const controller = new AbortController();
    setEnterpriseData((prev) => ({ ...prev, status: "loading" }));

    fetchFmpEnterpriseValues(selectedSymbol, controller.signal)
      .then((docs) => {
        if (!active) return;
        setEnterpriseData({ docs: Array.isArray(docs) ? docs : [], status: "idle" });
      })
      .catch((err) => {
        if (!active || err.name === "AbortError") return;
        console.error("FMP enterprise values error", err);
        setEnterpriseData({ docs: [], status: err.message === "Missing FMP API key" ? "no-key" : "error" });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [selectedSymbol, env.fmpApiKey]);

  useEffect(() => {
    if (!selectedSymbol) return;
    if (!env.fmpApiKey) {
      setFinancialReportData({ doc: null, status: "no-key" });
      return;
    }
    let active = true;
    const controller = new AbortController();
    setFinancialReportData((prev) => ({ ...prev, status: "loading" }));

    fetchFmpFinancialReports(selectedSymbol, controller.signal)
      .then((docs) => {
        if (!active) return;
        const doc = Array.isArray(docs) && docs.length ? docs[0] : null;
        setFinancialReportData({ doc, status: "idle" });
      })
      .catch((err) => {
        if (!active || err.name === "AbortError") return;
        console.error("FMP financial report error", err);
        setFinancialReportData({ doc: null, status: err.message === "Missing FMP API key" ? "no-key" : "error" });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [selectedSymbol, env.fmpApiKey]);

  useEffect(() => {
    if (!selectedSymbol) return;
    const configs = [
      { key: "product", fetcher: fetchFmpRevenueProductSegmentation },
      { key: "geographic", fetcher: fetchFmpRevenueGeographicSegmentation },
    ] as const;

    configs.forEach((cfg) => {
      if (!env.fmpApiKey) {
        setSegmentationData((prev) => ({
          ...prev,
          [cfg.key]: { docs: [], status: "no-key" },
        }));
        return;
      }
      let active = true;
      const controller = new AbortController();
      setSegmentationData((prev) => ({
        ...prev,
        [cfg.key]: { ...(prev[cfg.key] || {}), status: "loading" },
      }));

      cfg
        .fetcher(selectedSymbol, controller.signal)
        .then((docs) => {
          if (!active) return;
          setSegmentationData((prev) => ({
            ...prev,
            [cfg.key]: { docs: Array.isArray(docs) ? docs : [], status: "idle" },
          }));
        })
        .catch((err) => {
          if (!active || err.name === "AbortError") return;
          console.error("FMP segmentation error", cfg.key, err);
          setSegmentationData((prev) => ({
            ...prev,
            [cfg.key]: { docs: [], status: err.message === "Missing FMP API key" ? "no-key" : "error" },
          }));
        });

      return () => {
        active = false;
        controller.abort();
      };
    });
  }, [selectedSymbol, env.fmpApiKey]);

  const ensureGlossary = (key: string, fileName: string) => {
    setGlossaryState((prev) => {
      const current = prev[key];
      if (current && current.status === "loading") return prev;
      if (current && current.status === "idle" && current.doc) return prev;
      if (current && current.status === "error" && current.doc) return prev;
      return {
        ...prev,
        [key]: { ...(current || {}), status: "loading", error: undefined },
      };
    });

    const controller = new AbortController();
    fetchGlossary(fileName, controller.signal)
      .then((doc) => {
        setGlossaryState((prev) => ({
          ...prev,
          [key]: { doc, status: "idle" },
        }));
      })
      .catch((err: any) => {
        setGlossaryState((prev) => ({
          ...prev,
          [key]: { doc: null, status: "error", error: err?.message || "Unable to load glossary" },
        }));
      });

    return () => controller.abort();
  };

  useEffect(() => {
    if (!selectedSymbol) return;

    const mapStatement: Record<string, string> = {
      income: "income-statement.json",
      balance: "balance-sheet-statement.json",
      cash: "cash-flow-statement.json",
    };

    const mapRatios: Record<string, string> = {
      keyMetrics: "key-metrics.json",
      ratios: "ratios.json",
      keyMetricsTtm: "key-metrics-ttm.json",
      ratiosTtm: "ratios-ttm.json",
    };

    const mapScore: Record<string, string> = {
      financial: "financial-scores.json",
      ownerEarnings: "owner-earnings.json",
      enterpriseValues: "enterprise-values.json",
    };

    const tasks: Array<() => void> = [];

    if (infoTab === "statement") {
      const file = mapStatement[statementTab];
      if (file) {
        const cleanup = ensureGlossary(statementTab, file);
        if (cleanup) tasks.push(cleanup);
      }
    }

    if (infoTab === "ratios") {
      const file = mapRatios[ratiosTab];
      if (file) {
        const cleanup = ensureGlossary(ratiosTab, file);
        if (cleanup) tasks.push(cleanup);
      }
    }

    if (infoTab === "score") {
      const file = mapScore[scoreTab];
      if (file) {
        const cleanup = ensureGlossary(scoreTab, file);
        if (cleanup) tasks.push(cleanup);
      }
    }

    return () => {
      tasks.forEach((fn) => {
        try {
          fn();
        } catch {
          // ignore
        }
      });
    };
  }, [infoTab, statementTab, ratiosTab, scoreTab, selectedSymbol]);

  const industryOptions = useMemo(() => {
    const set = new Set<string>();
    viewRecords.forEach((item) => {
      const value = (item as any).industry;
      if (value && typeof value === "string") {
        set.add(value);
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [viewRecords]);

  const countryOptions = useMemo(() => {
    const agg = ["Europe", "Asia", "Latam"];
    const set = new Set<string>(agg);
    viewRecords.forEach((item) => {
      const value = (item as any).country;
      if (value && typeof value === "string") {
        set.add(value);
      }
    });
    const sorted = Array.from(set).sort((a, b) => a.localeCompare(b));
    const base = sorted.filter((val) => !agg.includes(val));
    return [...agg, ...base];
  }, [viewRecords]);

  const topRows = useMemo(() => {
    const scoreKeyMap: Record<SortKey, string[]> = {
      momentum: ["momentum_score"],
      quality: ["quality_score"],
      risk: ["risk_score"],
      valuation: ["valuation_score", "valuation_scores"],
      total: ["total_score", "score", "totalScore"],
      growthProbability: ["growth_probability"],
      doubleTop: [],
    };

    const keys = scoreKeyMap[sortKey];
    const term = searchTerm.trim().toLowerCase();

    const filteredRecords = term
      ? viewRecords.filter((item) => {
          const symbol = ((item as any).ticker ?? (item as any).symbol ?? "").toString().toLowerCase();
          return symbol.includes(term);
        })
      : viewRecords;

    const normalizeCountry = (value: string) => value.trim().toUpperCase();
    const regionGroups: Record<string, Set<string>> = {
      Europe: new Set(
        [
          "AL", "ANDORRA", "AUSTRIA", "BE", "BELGIUM", "BG", "BULGARIA", "CH", "SWITZERLAND", "CY", "CYPRUS", "CZ",
          "CZECH REPUBLIC", "DE", "GERMANY", "DK", "DENMARK", "EE", "ESTONIA", "ES", "SPAIN", "FI", "FINLAND", "FR",
          "FRANCE", "GB", "UK", "UNITED KINGDOM", "GR", "GREECE", "HR", "CROATIA", "HU", "HUNGARY", "IE", "IRELAND",
          "IS", "ICELAND", "IT", "ITALY", "LI", "LIECHTENSTEIN", "LT", "LITHUANIA", "LU", "LUXEMBOURG", "LV",
          "LATVIA", "MC", "MONACO", "MT", "MALTA", "NL", "NETHERLANDS", "NO", "NORWAY", "PL", "POLAND", "PT",
          "PORTUGAL", "RO", "ROMANIA", "SE", "SWEDEN", "SI", "SLOVENIA", "SK", "SLOVAKIA", "SM", "SAN MARINO",
          "VA", "VATICAN"
        ].map(normalizeCountry)
      ),
      Asia: new Set(
        [
          "AE", "UAE", "UNITED ARAB EMIRATES", "AF", "AFGHANISTAN", "AM", "ARMENIA", "AZ", "AZERBAIJAN", "BD",
          "BANGLADESH", "BH", "BAHRAIN", "BN", "BRUNEI", "BT", "BHUTAN", "CN", "CHINA", "CY", "CYPRUS", "GE",
          "GEORGIA", "HK", "HONG KONG", "ID", "INDONESIA", "IN", "INDIA", "IL", "ISRAEL", "IQ", "IRAQ", "IR",
          "IRAN", "JO", "JORDAN", "JP", "JAPAN", "KG", "KYRGYZSTAN", "KH", "CAMBODIA", "KP", "NORTH KOREA", "KR",
          "SOUTH KOREA", "KW", "KUWAIT", "KZ", "KAZAKHSTAN", "LA", "LAOS", "LB", "LEBANON", "LK", "SRI LANKA",
          "MM", "MYANMAR", "MN", "MONGOLIA", "MO", "MACAU", "MV", "MALDIVES", "MY", "MALAYSIA", "NP", "NEPAL",
          "OM", "OMAN", "PH", "PHILIPPINES", "PK", "PAKISTAN", "PS", "PALESTINE", "QA", "QATAR", "SA", "SAUDI ARABIA",
          "SG", "SINGAPORE", "SY", "SYRIA", "TH", "THAILAND", "TJ", "TAJIKISTAN", "TL", "TIMOR-LESTE", "TM",
          "TURKMENISTAN", "TR", "TURKEY", "TW", "TAIWAN", "UZ", "UZBEKISTAN", "VN", "VIETNAM", "YE", "YEMEN"
        ].map(normalizeCountry)
      ),
      Latam: new Set(
        [
          "AR", "ARGENTINA", "BO", "BOLIVIA", "BR", "BRAZIL", "BZ", "BELIZE", "CL", "CHILE", "CO", "COLOMBIA",
          "CR", "COSTA RICA", "CU", "CUBA", "DO", "DOMINICAN REPUBLIC", "EC", "ECUADOR", "SV", "EL SALVADOR", "GF",
          "FRENCH GUIANA", "GT", "GUATEMALA", "GY", "GUYANA", "HN", "HONDURAS", "JM", "JAMAICA", "MX", "MEXICO",
          "NI", "NICARAGUA", "PA", "PANAMA", "PE", "PERU", "PR", "PUERTO RICO", "PY", "PARAGUAY", "SR", "SURINAME",
          "UY", "URUGUAY", "VE", "VENEZUELA"
        ].map(normalizeCountry)
      ),
    };

    const industryFiltered = selectedIndustry
      ? filteredRecords.filter((item) => ((item as any).industry ?? "").toString() === selectedIndustry)
      : filteredRecords;

    const countryFiltered = selectedCountry
      ? industryFiltered.filter((item) => {
          const countryRaw = ((item as any).country ?? "").toString();
          const norm = normalizeCountry(countryRaw);
          const group = regionGroups[selectedCountry as keyof typeof regionGroups];
          if (group) return group.has(norm);
          return countryRaw === selectedCountry;
        })
      : industryFiltered;

    const getScore = (item: FundamentalRecord, keyList: string[]) => {
      for (const key of keyList) {
        const value = (item as any)[key];
        const parsed = parseScore(value);
        if (parsed !== null) return parsed;
      }
      return null;
    };

    const sorted = [...countryFiltered];

    if (useUserFundamentals && userOrder.length) {
      sorted.sort((a, b) => {
        for (const ord of userOrder) {
          const mappedKeys = ORDER_FIELD_MAP[ord.field] || [ord.field];
          const valA = getNumericField(a as any, mappedKeys);
          const valB = getNumericField(b as any, mappedKeys);
          const dir = ord.direction === "ASC" ? 1 : -1;
          if (valA === null && valB === null) continue;
          if (valA === null) return 1; // nulls last
          if (valB === null) return -1;
          if (valA !== valB) return (valA - valB) * dir;
        }
        return 0;
      });
    } else {
      sorted.sort((a, b) => {
        if (sortKey === "doubleTop") {
          const aScore = getDoubleTopScore(a);
          const bScore = getDoubleTopScore(b);
          if (aScore === null && bScore === null) return 0;
          if (aScore === null) return 1;
          if (bScore === null) return -1;
          return bScore - aScore;
        }

        const aScore = getScore(a, keys);
        const bScore = getScore(b, keys);
        if (aScore === null && bScore === null) return 0;
        if (aScore === null) return 1;
        if (bScore === null) return -1;
        return bScore - aScore;
      });
    }

    return sorted.slice(0, 50);
  }, [viewRecords, sortKey, searchTerm, selectedIndustry, selectedCountry, useUserFundamentals, userOrder]);

  const recordsCount = useMemo(() => viewRecords.length, [viewRecords]);

  const renderScoreBar = (val: number | null) => {
    if (val === null || val === undefined || Number.isNaN(val)) return <span className="text-slate-400">-</span>;
    const color =
      val < 20
        ? "bg-red-500"
        : val < 40
          ? "bg-orange-500"
          : val < 60
            ? "bg-yellow-400"
            : val < 80
              ? "bg-lime-400"
              : "bg-green-500";
    const width = `${Math.max(0, Math.min(100, val))}%`;
    return (
      <>
        <div className="h-2 w-28 rounded-full bg-slate-200">
          <div className={`h-2 rounded-full ${color}`} style={{ width }} />
        </div>
        <span className="text-slate-900">{val}</span>
      </>
    );
  };

  const parsedMomentum = useMemo<ParsedMomentum | null>(() => {
    if (!selectedRecord) return null;
    return parseMomentumJson((selectedRecord as any).momentum_json);
  }, [selectedRecord]);

  const rawLastUpdate =
    (selectedRecord as any)?.updated_at ??
    (selectedRecord as any)?.updatedAt ??
    (fmpInfo as any)?.updated_at ??
    (fmpInfo as any)?.updatedAt;

  const lastUpdateHours = useMemo(() => getUpdateDeltaHours(rawLastUpdate), [rawLastUpdate]);

  const detailRows = useMemo(() => {
    if (!selectedRecord) return [];
    const rows: { key: string; value: string }[] = [];

    Object.entries(selectedRecord).forEach(([key, value]) => {
      if (key === "momentum_json") {
        if (parsedMomentum?.raw) {
          Object.entries(parsedMomentum.raw).forEach(([k, v]) => {
            if (k === "components") return;
            rows.push({ key: `momentum_json.${k}`, value: formatDetailValue(v) });
          });
          return;
        }
      }

      rows.push({ key, value: formatDetailValue(value) });
    });

    return rows;
  }, [selectedRecord, parsedMomentum]);

  const momentumComponents = useMemo<MomentumComponents | null>(() => {
    if (!parsedMomentum) return null;
    return {
      score: parsedMomentum.score,
      doubleTopScore: parsedMomentum.doubleTopScore,
      components: parsedMomentum.components,
    };
  }, [parsedMomentum]);

  const momentumSummary = useMemo(() => {
    const firstNum = (...vals: unknown[]) => {
      for (const v of vals) {
        const n = typeof v === "number" ? v : Number(v);
        if (Number.isFinite(n)) return n;
      }
      return null;
    };
    const momentumShort = firstNum(
      (selectedRecord as any)?.momentum_short_score,
      parsedMomentum?.components?.momentumShort && (parsedMomentum.components as any).momentumShort?.score
    );
    const volumeScore = firstNum(
      (selectedRecord as any)?.volume_score,
      (selectedRecord as any)?.momentum_volume_score,
      parsedMomentum?.components && (parsedMomentum.components as any).volume?.score
    );
    const shortRisk = firstNum((selectedRecord as any)?.short_risk_score);
    const marketScore = firstNum(
      (selectedRecord as any)?.market_score,
      parsedMomentum?.components && (parsedMomentum.components as any).marketScore?.score
    );
    const growthProbability = firstNum((selectedRecord as any)?.growth_probability);

    return [
      { label: "Momentum short", value: momentumShort },
      { label: "Volume score", value: volumeScore },
      { label: "Risk score (short)", value: shortRisk },
      { label: "Market score", value: marketScore },
      { label: "Growth probability", value: growthProbability },
    ];
  }, [parsedMomentum, selectedRecord]);

  const scoreSources = useMemo(
    () => [scoreData.doc, selectedRecord].filter(Boolean),
    [scoreData.doc, selectedRecord]
  );

  const radarData = useMemo(() => {
    const get = (keyList: string[]) => {
      if (!scoreSources.length) return null;
      for (const source of scoreSources) {
        for (const key of keyList) {
          const value = (source as any)[key];
          const parsed = parseScore(value);
          if (parsed !== null) return parsed;
        }
      }
      return null;
    };

    const doubleTopValue = parsedMomentum?.doubleTopScore ?? null;

    const metrics: { label: string; value: number | null }[] = [
      { label: "Momentum", value: get(["momentum_score", "momentumScore"]) },
      { label: "Quality", value: get(["quality_score", "qualityScore"]) },
      { label: "Risk", value: get(["risk_score", "riskScore"]) },
      { label: "Valuation", value: get(["valuation_score", "valuation_scores", "valuationScore"]) },
      { label: "Growth probability", value: get(["growth_probability"]) },
      { label: "Double top", value: doubleTopValue },
    ];

    const filtered = metrics.filter((m) => m.value !== null);
    if (!filtered.length) return null;

    return {
      categories: filtered.map((m) => m.label),
      values: filtered.map((m) => m.value as number),
      items: filtered,
    };
  }, [scoreSources, parsedMomentum]);

  const altmanValue = useMemo(() => {
    const raw =
      (scoreData.doc as any)?.altmanZScore ??
      (scoreSources[0] as any)?.altmanZScore ??
      (scoreSources[1] as any)?.altmanZScore;
    const num = typeof raw === "number" ? raw : Number(raw);
    return Number.isFinite(num) ? num : null;
  }, [scoreData, scoreSources]);

  const piotroskiValue = useMemo(() => {
    const raw =
      (scoreData.doc as any)?.piotroskiScore ??
      (scoreSources[0] as any)?.piotroskiScore ??
      (scoreSources[1] as any)?.piotroskiScore;
    const num = typeof raw === "number" ? raw : Number(raw);
    return Number.isFinite(num) ? num : null;
  }, [scoreData, scoreSources]);

  const scoreCurrency = useMemo(() => {
    const cur =
      (scoreData.doc as any)?.reportedCurrency ||
      (scoreSources[0] as any)?.reportedCurrency ||
      (scoreSources[0] as any)?.currency ||
      (scoreSources[1] as any)?.reportedCurrency ||
      (scoreSources[1] as any)?.currency;
    return typeof cur === "string" ? cur : undefined;
  }, [scoreData, scoreSources]);

  const buildStatementMetrics = (statements: any[], currencyFallback?: string) => {
    if (!statements.length) return [];
    const currency = (statements[0] as any)?.currency || currencyFallback;

    const sorted = [...statements].sort((a: any, b: any) => {
      const da = new Date(a?.date || `${a?.calendarYear || ""}`).getTime();
      const db = new Date(b?.date || `${b?.calendarYear || ""}`).getTime();
      return db - da;
    });

    const metaKeys = new Set([
      "date",
      "calendarYear",
      "period",
      "symbol",
      "filingDate",
      "acceptedDate",
      "reportedCurrency",
      "currency",
      "cik",
      "fiscalYear",
      "fillingDate",
      "link",
      "finalLink",
    ]);

    const first = sorted[0] || {};
    const usedDefs = Object.keys(first)
      .filter((key) => !metaKeys.has(key))
      .filter((key) => {
        const val = first[key];
        if (typeof val === "number") return true;
        if (val === null || val === undefined) return false;
        const num = Number(val);
        return Number.isFinite(num);
      })
      .map((key) => ({
        key,
        label: key
          .replace(/_/g, " ")
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .replace(/\s+/g, " ")
          .replace(/^\w/, (c) => c.toUpperCase()),
      }));

    return usedDefs.map((def) => {
      const rowsView = sorted.slice(0, 6).map((item: any, idx) => {
        const label = item?.calendarYear || item?.date || item?.period || "-";
        const valueRaw = item ? item[def.key] : null;
        const valueNum =
          typeof valueRaw === "number" ? valueRaw : valueRaw !== undefined ? Number(valueRaw) : null;
        const value = Number.isFinite(valueNum) ? valueNum : null;

        const prev = sorted[idx + 1];
        const prevRaw = prev ? prev[def.key] : null;
        const prevNum =
          prev && typeof prevRaw === "number" ? prevRaw : prevRaw !== undefined ? Number(prevRaw) : null;
        const prevValue = prev && Number.isFinite(prevNum) ? prevNum : null;

        const diff = prevValue !== null && value !== null ? value - prevValue : null;
        const pct =
          prevValue !== null && value !== null && prevValue !== 0 ? ((value - prevValue) / prevValue) * 100 : null;

        let deltaLabel = "-";
        let pctLabel = "-";
        const positive = diff !== null ? diff >= 0 : false;
        if (diff !== null) {
          const sign = diff >= 0 ? "+" : "";
          deltaLabel = `${sign}${formatCurrency(Math.abs(diff), currency)}`;
        }
        if (pct !== null) {
          const sign = pct >= 0 ? "+" : "";
          pctLabel = `${sign}${pct.toFixed(1)}% ${pct >= 0 ? "↑" : "↓"}`;
        }

        return {
          label: String(label),
          value: formatCurrency(value, currency),
          delta: deltaLabel,
          pct: pctLabel,
          positive,
          rawValue: value,
        };
      });

      return {
        key: def.key,
        label: def.label,
        heading: def.label,
        rowsView,
      };
    });
  };

  const scoreTableRows = useMemo(() => {
    if (!scoreData.doc) return [];
    const skip = new Set([
      "symbol",
      "date",
      "period",
      "calendarYear",
      "reportedCurrency",
      "piotroskiScore",
      "altmanZScore",
    ]);
    return Object.entries(scoreData.doc)
      .filter(([key]) => !skip.has(key))
      .map(([key, value]) => {
        const label = key
          .replace(/_/g, " ")
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .replace(/\s+/g, " ")
          .replace(/^\w/, (c) => c.toUpperCase());
        const num = typeof value === "number" ? value : value !== undefined ? Number(value) : NaN;
        const formatted = Number.isFinite(num)
          ? formatCurrency(num, scoreCurrency)
          : value === null || value === undefined
          ? "-"
          : String(value);
        return { label, value: formatted };
      });
  }, [scoreData, scoreCurrency]);

  const ownerMetrics = useMemo(() => {
    const docs = ownerData.docs || [];
    const currency =
      (docs[0] as any)?.reportedCurrency ||
      (docs[0] as any)?.currency ||
      (fmpInfo as any)?.currency ||
      (selectedRecord as any)?.currency;
    return buildStatementMetrics(docs, currency);
  }, [ownerData, fmpInfo, selectedRecord]);

  const enterpriseMetrics = useMemo(() => {
    const docs = enterpriseData.docs || [];
    const currency =
      (docs[0] as any)?.reportedCurrency ||
      (docs[0] as any)?.currency ||
      (fmpInfo as any)?.currency ||
      (selectedRecord as any)?.currency;
    return buildStatementMetrics(docs, currency);
  }, [enterpriseData, fmpInfo, selectedRecord]);

  const descriptionInfo = useMemo(() => {
    const raw = (fmpInfo as any)?.description;
    if (!raw || typeof raw !== "string") return null;
    const words = raw.trim().split(/\s+/);
    if (words.length <= 50) {
      return { preview: raw, remainder: "" };
    }
    const previewWords = words.slice(0, 50).join(" ");
    const remainder = words.slice(50).join(" ");
    return { preview: `${previewWords}...`, full: raw, remainder };
  }, [fmpInfo]);

  const financialReportHtml = useMemo(() => {
    const doc = financialReportData.doc;
    if (!doc) return null;
    const candidates: string[] = [];
    Object.entries(doc).forEach(([key, val]) => {
      if (typeof val === "string" && val.toLowerCase().includes("<html")) {
        candidates.push(val);
      }
      if (typeof val === "string" && (key.toLowerCase().includes("html") || key.toLowerCase().includes("content"))) {
        candidates.push(val);
      }
    });
    if (candidates.length) return candidates[0];
    return null;
  }, [financialReportData]);


  const incomeMetrics = useMemo(() => {
    const incomeDocs = statementData.income?.docs || [];
    const currency = (incomeDocs[0] as any)?.currency || (fmpInfo as any)?.currency || (selectedRecord as any)?.currency;
    return buildStatementMetrics(incomeDocs, currency);
  }, [statementData, fmpInfo, selectedRecord]);

  const balanceMetrics = useMemo(() => {
    const balanceDocs = statementData.balance?.docs || [];
    const currency = (balanceDocs[0] as any)?.currency || (fmpInfo as any)?.currency || (selectedRecord as any)?.currency;
    return buildStatementMetrics(balanceDocs, currency);
  }, [statementData, fmpInfo, selectedRecord]);

  const cashMetrics = useMemo(() => {
    const cashDocs = statementData.cash?.docs || [];
    const currency = (cashDocs[0] as any)?.currency || (fmpInfo as any)?.currency || (selectedRecord as any)?.currency;
    return buildStatementMetrics(cashDocs, currency);
  }, [statementData, fmpInfo, selectedRecord]);

  const ratioMetrics = useMemo(() => {
    const build = (key: string) => {
      const docs = ratiosData[key]?.docs || [];
      const currency = (docs[0] as any)?.currency || (fmpInfo as any)?.currency || (selectedRecord as any)?.currency;
      return buildStatementMetrics(docs, currency);
    };

    return {
      keyMetrics: build("keyMetrics"),
      ratios: build("ratios"),
      keyMetricsTtm: build("keyMetricsTtm"),
      ratiosTtm: build("ratiosTtm"),
    };
  }, [ratiosData, fmpInfo, selectedRecord]);

  const priceInfo = useMemo(() => {
    const rawPrice = (fmpInfo as any)?.price;
    const price = typeof rawPrice === "number" ? rawPrice : Number(rawPrice);
    const rangeStr = typeof (fmpInfo as any)?.range === "string" ? (fmpInfo as any).range : "";
    let min = Number.NaN;
    let max = Number.NaN;
    if (rangeStr.includes("-")) {
      const [l, h] = rangeStr.split("-").map((p: string) => parseFloat(p.trim()));
      if (Number.isFinite(l) && Number.isFinite(h)) {
        min = l;
        max = h;
      }
    }
    if ((!Number.isFinite(min) || !Number.isFinite(max)) && Number.isFinite(price)) {
      min = Math.max(price * 0.9, 0);
      max = price * 1.1;
    }
    return { price: Number.isFinite(price) ? price : null, min: Number.isFinite(min) ? min : null, max: Number.isFinite(max) ? max : null };
  }, [fmpInfo]);

  if (selectedSymbol) {
    const name =
      (fmpInfo as any)?.companyName ||
      (fmpInfo as any)?.name ||
      (selectedRecord as any)?.companyName ||
      (selectedRecord as any)?.name ||
      (selectedRecord as any)?.company ||
      selectedSymbol;

    return (
      <div className="space-y-4">
        <SectionHeader
          title="Ticker detail"
          subTitle="Visualizza le informazioni del singolo ticker"
          actionComponent={
            <button
              onClick={() => {
                window.location.hash = "/dashboard/tickers";
                setSelectedSymbol(null);
              }}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              ← Torna alla lista
            </button>
          }
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-4">
                {selectedSymbol && (
                  <div className="flex min-w-[90px] flex-col items-center gap-2">
                    <img
                      src={`https://financialmodelingprep.com/image-stock/${selectedSymbol}.png`}
                      alt={`${selectedSymbol} logo`}
                      className="h-14 w-14 rounded-lg border border-slate-200 bg-white object-contain"
                      onError={(e) => {
                        e.currentTarget.style.visibility = "hidden";
                      }}
                    />
                    <div className="text-lg">
                      {(fmpInfo as any)?.country && (
                        <ReactCountryFlag
                          countryCode={(fmpInfo as any)?.country}
                          svg
                          aria-label={(fmpInfo as any)?.country}
                          style={{ width: "1.5em", height: "1.5em" }}
                        />
                      )}
                    </div>
                  </div>
                )}
                <div>
                  <div className="mt-1 text-3xl font-bold text-slate-900">{name}</div>
                  <div className="mt-2 text-sm text-slate-600">
                    Ticker: {selectedSymbol}
                    {((fmpInfo as any)?.exchange && ` (${(fmpInfo as any)?.exchange})`) || ""}
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-wide text-slate-500">Price</div>
                  {priceInfo.price !== null ? (
                    <div className="mt-1">
                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <span>{priceInfo.min !== null ? formatNumber(priceInfo.min) : "-"}</span>
                        <span className="font-semibold text-slate-900">
                          {formatNumber(priceInfo.price)}
                        </span>
                        <span>{priceInfo.max !== null ? formatNumber(priceInfo.max) : "-"}</span>
                      </div>
                      <div className="relative mt-1 h-2 rounded-full bg-slate-100">
                        {priceInfo.min !== null &&
                        priceInfo.max !== null &&
                        priceInfo.price !== null ? (
                          <div
                            className="absolute top-0 h-2 w-1.5 rounded-full bg-blue-500"
                            style={{
                              left: `${Math.min(
                                100,
                                Math.max(
                                  0,
                                  ((priceInfo.price - priceInfo.min) /
                                    (priceInfo.max - priceInfo.min || 1)) *
                                    100
                                )
                              )}%`,
                              transform: "translateX(-50%)",
                            }}
                          />
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1 text-sm text-slate-500">-</div>
                  )}
                </div>
              </div>

              <div className="mt-1 max-w-md rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-[11px] text-slate-700">
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  <div className="font-semibold text-slate-600">Industry</div>
                  <div>{(fmpInfo as any)?.industry ?? (selectedRecord as any)?.industry ?? "-"}</div>
                  <div className="font-semibold text-slate-600">Sector</div>
                  <div>{(fmpInfo as any)?.sector ?? (selectedRecord as any)?.sector ?? "-"}</div>
                  <div className="font-semibold text-slate-600">Full Time Employees</div>
                  <div>
                    {formatNumber(
                      typeof (fmpInfo as any)?.fullTimeEmployees === "number"
                        ? (fmpInfo as any)?.fullTimeEmployees
                        : Number((fmpInfo as any)?.fullTimeEmployees)
                    )}
                  </div>
                  <div className="font-semibold text-slate-600">Market Cap</div>
                  <div>
                    {formatCurrency(
                      typeof (fmpInfo as any)?.mktCap === "number"
                        ? (fmpInfo as any)?.mktCap
                        : Number((fmpInfo as any)?.mktCap),
                      (fmpInfo as any)?.currency
                    )}{" "}
                    {(fmpInfo as any)?.currency ?? ""}
                  </div>
                  <div className="font-semibold text-slate-600">Last Dividend</div>
                  <div>
                    {formatCurrency(
                      typeof (fmpInfo as any)?.lastDiv === "number"
                        ? (fmpInfo as any)?.lastDiv
                        : Number((fmpInfo as any)?.lastDiv),
                      (fmpInfo as any)?.currency
                    )}{" "}
                    {(fmpInfo as any)?.currency ?? ""}
                  </div>
                  <div className="font-semibold text-slate-600">Last update</div>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${getUpdateStatusClass(lastUpdateHours)}`}
                    />
                    {formatUpdateDelta(lastUpdateHours)}
                  </div>
                </div>
              </div>

              {descriptionInfo && (
                <div className="mt-3 text-[10px] text-slate-700">
                  {descriptionInfo.preview}{" "}
                  {descriptionInfo.remainder && (
                    <button
                      className="text-blue-600 hover:text-blue-700 underline underline-offset-2"
                      onClick={() => {
                        window.alert(descriptionInfo.full ?? "");
                      }}
                    >
                      more..
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="text-right text-xs text-slate-600 leading-snug space-y-1">
              <div>{(fmpInfo as any)?.address ?? "-"}</div>
              <div>
                {(fmpInfo as any)?.city ?? "-"}
                {((fmpInfo as any)?.state && `, ${(fmpInfo as any)?.state}`) || ""}
                {((fmpInfo as any)?.zip && ` ${String((fmpInfo as any)?.zip)}`) || ""}
              </div>
              <div>
                <a
                  href={(fmpInfo as any)?.website ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline underline-offset-2"
                >
                  {(fmpInfo as any)?.website ?? "-"}
                </a>
              </div>
              <div>
                <span className="font-semibold text-slate-800">
                  {(fmpInfo as any)?.CEO || (fmpInfo as any)?.ceo || "-"}
                </span>
              </div>
              <div className="flex items-center justify-end gap-1 text-[11px]">
                <span className="text-slate-500">📞</span>
                <span>{(fmpInfo as any)?.phone ?? "-"}</span>
              </div>
              <div className="pt-2">
                <table className="min-w-[160px] text-[11px] text-slate-700 ml-auto">
                  <tbody>
                    <tr>
                      <td className="pr-2 font-semibold text-slate-600">CUSIP</td>
                      <td>{(fmpInfo as any)?.cusip ?? (selectedRecord as any)?.cusip ?? "-"}</td>
                    </tr>
                    <tr>
                      <td className="pr-2 font-semibold text-slate-600">ISIN</td>
                      <td>{(fmpInfo as any)?.isin ?? (selectedRecord as any)?.isin ?? "-"}</td>
                    </tr>
                    <tr>
                      <td className="pr-2 font-semibold text-slate-600">CIK</td>
                      <td>{(fmpInfo as any)?.cik ?? (selectedRecord as any)?.cik ?? "-"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="pt-2 text-[11px] text-slate-700 space-y-1">
                <div>
                  <span className="font-semibold text-slate-600">Beta:</span>{" "}
                  {(fmpInfo as any)?.beta ?? "-"}
                </div>
                <div>
                  <span className="font-semibold text-slate-600">Average volume:</span>{" "}
                  {formatNumber(
                    typeof (fmpInfo as any)?.volAvg === "number"
                      ? (fmpInfo as any)?.volAvg
                      : Number((fmpInfo as any)?.volAvg)
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start justify-center">
              {radarData ? (
                <ReactApexChart
                  type="radar"
                  height={320}
                  series={[
                    {
                      name: "Score",
                      data: radarData.values,
                    },
                  ]}
                  options={{
                    chart: { toolbar: { show: false } },
                    dataLabels: { enabled: false },
                    stroke: { width: 2 },
                    markers: { size: 4 },
                    xaxis: { categories: radarData.categories },
                    yaxis: { show: true, min: 0, max: 100 },
                    colors: ["#0ea5e9"],
                    fill: {
                      opacity: 0.45,
                      colors: ["rgba(14,165,233,0.45)"],
                    },
                    plotOptions: {
                      radar: {
                        polygons: {
                          strokeColors: "#e2e8f0",
                          fill: {
                            colors: ["#f8fafc", "#e2e8f0"],
                          },
                        },
                      },
                    },
                  }}
                />
              ) : (
                <div className="rounded-md border border-dashed border-slate-200 bg-white/60 p-2 text-[11px] text-slate-600">
                  Nessun punteggio disponibile per il radar.
                </div>
              )}
            </div>
          </div>

          {fmpStatus === "no-key" && (
            <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              Imposta la variabile VITE_FMP_API_KEY per mostrare i dettagli dal provider.
            </div>
          )}
          {fmpStatus === "error" && (
            <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              Impossibile recuperare i dettagli dal provider.
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <SectionHeader
                title={
                  infoTab === "detail"
                    ? "Dettaglio"
                    : infoTab === "statement"
                    ? "Statement"
                    : infoTab === "ratios"
                  ? "Ratios"
                  : infoTab === "score"
                  ? "Analysis"
                  : infoTab === "segmentation"
                  ? "Segmentation"
                  : infoTab === "news"
                  ? "News"
                  : infoTab === "chart"
                  ? "Chart"
                  : "Financial Report"
                }
                subTitle="Tutti i campi disponibili per il ticker"
              />
              <div className="flex gap-2">
                {[
                  { id: "chart" as const, label: "Chart" },
                  { id: "detail" as const, label: "Dettaglio" },
                  { id: "statement" as const, label: "Statement" },
                  { id: "ratios" as const, label: "Ratios" },
                  { id: "score" as const, label: "Analysis" },
                  { id: "financialReport" as const, label: "Financial Report" },
                  { id: "segmentation" as const, label: "Segmentation" },
                  { id: "news" as const, label: "News" },
                ].map((tab) => {
                  const active = infoTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setInfoTab(tab.id)}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                        active
                          ? "border-slate-800 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-white/80 p-4">
            {infoTab === "chart" && <TickerChartTab symbol={selectedSymbol} />}

            {infoTab === "detail" && (
              <TickerDetailTab
                detailRows={detailRows}
                momentumComponents={momentumComponents}
                summaryScores={momentumSummary}
              />
            )}

            {infoTab === "statement" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {[
                    { id: "income" as const, label: "Income Statement" },
                    { id: "balance" as const, label: "Balance Sheet Statement" },
                    { id: "cash" as const, label: "Cash Flow Statement" },
                  ].map((tab) => {
                    const active = statementTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setStatementTab(tab.id)}
                        className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                          active
                            ? "border-slate-800 bg-slate-900 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {statementTab === "income" && (
                  <TickerStatementTab metrics={incomeMetrics} status={statementData.income?.status ?? "idle"} glossary={glossaryState.income?.doc} />
                )}
                {statementTab === "balance" && (
                  <TickerStatementTab metrics={balanceMetrics} status={statementData.balance?.status ?? "idle"} glossary={glossaryState.balance?.doc} />
                )}
                {statementTab === "cash" && (
                  <TickerStatementTab metrics={cashMetrics} status={statementData.cash?.status ?? "idle"} glossary={glossaryState.cash?.doc} />
                )}
              </div>
            )}

            {infoTab === "ratios" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {[
                    { id: "keyMetrics" as const, label: "Key Metrics" },
                    { id: "ratios" as const, label: "Ratios" },
                    { id: "keyMetricsTtm" as const, label: "Key Metrics TTM" },
                    { id: "ratiosTtm" as const, label: "Ratios TTM" },
                  ].map((tab) => {
                    const active = ratiosTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setRatiosTab(tab.id)}
                        className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                          active
                            ? "border-slate-800 bg-slate-900 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <TickerRatiosTab metrics={ratioMetrics[ratiosTab]} status={ratiosData[ratiosTab]?.status ?? "idle"} glossary={glossaryState[ratiosTab]?.doc} />
              </div>
            )}

            {infoTab === "score" && (
              <TickerAnalysisTab
                scoreStatus={scoreData.status}
                scoreTab={scoreTab}
                onChangeScoreTab={setScoreTab}
                altmanValue={altmanValue}
                piotroskiValue={piotroskiValue}
                scoreCurrency={scoreCurrency}
                scoreTableRows={scoreTableRows}
                financialGlossary={glossaryState.financial?.doc}
                ownerMetrics={ownerMetrics}
                ownerStatus={ownerData.status}
                ownerGlossary={glossaryState.ownerEarnings?.doc}
                enterpriseMetrics={enterpriseMetrics}
                enterpriseStatus={enterpriseData.status}
                enterpriseGlossary={glossaryState.enterpriseValues?.doc}
              />
            )}

            {infoTab === "financialReport" && (
              <TickerFinancialReportTab status={financialReportData.status} html={financialReportHtml} />
            )}

            {infoTab === "segmentation" && (
              <TickerSegmentationTab
                segmentationTab={segmentationTab}
                onChangeTab={setSegmentationTab}
                productDocs={segmentationData.product?.docs || []}
                productStatus={segmentationData.product?.status ?? "idle"}
                geographicDocs={segmentationData.geographic?.docs || []}
                geographicStatus={segmentationData.geographic?.status ?? "idle"}
              />
            )}

            {infoTab === "news" && <TickerNewsTab symbol={selectedSymbol} />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SectionHeader title="Ticker Scanner" subTitle="Top 50 fundamentals" />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
          <div className="text-sm text-slate-600">
            Osserva i principali ticker con le metriche fondamentali aggiornate.
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <label className="sr-only" htmlFor="ticker-search">
                Cerca ticker
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-inner">
                <input
                  id="ticker-search"
                  type="search"
                  inputMode="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cerca ticker (es. AAPL)"
                  className="min-w-[14rem] bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="text-xs font-semibold text-slate-500 transition hover:text-slate-700"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "momentum", label: "Best Momentum" },
                  { key: "quality", label: "Best Quality" },
                  { key: "risk", label: "Best Risk" },
                  { key: "valuation", label: "Best Value" },
                  { key: "growthProbability", label: "Growth Probability" },
                  { key: "total", label: "Best General" },
                  { key: "doubleTop", label: "Best double top score" },
                ].map((option) => {
                  const active = sortKey === option.key;
                  return (
                      <button
                        key={option.key}
                      onClick={() => setSortKey(option.key as SortKey)}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                        active
                          ? "border-slate-800 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <label className="sr-only" htmlFor="asof-filter">
                Seleziona giornata
              </label>
              <select
                id="asof-filter"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-slate-300 focus:outline-none"
              >
                <option value="today">Today (live)</option>
                {availableDates.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <label className="sr-only" htmlFor="industry-filter">
                Filtra per industria
              </label>
              <select
                id="industry-filter"
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-slate-300 focus:outline-none"
              >
                <option value="">Tutte le industrie</option>
                {industryOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <label className="sr-only" htmlFor="country-filter">
                Filtra per paese
              </label>
              <select
                id="country-filter"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-slate-300 focus:outline-none"
              >
              
                <option value="">Tutti i paesi</option>

                {countryOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <div className="flex items-center text-sm text-slate-600">
                {useUserFundamentals ? "User tickers" : "Tickers"}: {recordsCount}
              </div>
            </div>
          </div>
        </div>
        {useUserFundamentals && (
          <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
            Sono attivi gli User Filters. Puoi modificarli in{" "}
            <a href="#/dashboard/user-settings?tab=filters" className="font-semibold underline">
              Dashboard / User Settings / Filters
            </a>
            .
          </div>
        )}
        {loading ? (
          <div className="flex items-center justify-center px-6 py-10 text-sm text-slate-500">
            Caricamento in corso...
          </div>
        ) : error ? (
          <div className="px-6 py-4 text-sm text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
              <th className="px-4 py-3 font-semibold">Ticker</th>
              <th className="px-4 py-3 font-semibold">Settore</th>
              <th className="px-4 py-3 font-semibold">Industria</th>
              <th className="px-4 py-3 font-semibold">Paese</th>
              <th className="px-4 py-3 font-semibold">
                <div className="flex items-center justify-between gap-2">
                  <span>Scores</span>
                  <div className="flex items-center gap-2">
                    {useUserFundamentals && userOrder.length > 0 && (
                      <div className="relative inline-block">
                        <button
                          type="button"
                          className="rounded-full p-2 text-slate-600 hover:bg-slate-100"
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setOrderMenuAnchor({ x: rect.right, y: rect.bottom });
                            setOrderMenuOpen((v) => !v);
                          }}
                          aria-label="Visualizza ordinamento"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M3 4a1 1 0 011-1h10a1 1 0 110 2H4a1 1 0 01-1-1zM3 9a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 14a1 1 0 011-1h3a1 1 0 110 2H4a1 1 0 01-1-1z" />
                          </svg>
                        </button>
                        {orderMenuOpen && (
                          <div
                            className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                            onMouseLeave={() => setOrderMenuOpen(false)}
                          >
                            <div className="p-2 text-xs text-slate-700 space-y-1">
                              {userOrder.map((o, i) => (
                                <div key={`${o.field}-${i}`} className="flex items-center gap-2">
                                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300">
                                    {o.direction === "DESC" ? "↓" : "↑"}
                                  </span>
                                  <span className="truncate">{o.field}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="relative inline-block text-left">
                      <button
                        type="button"
                        className="rounded-full p-2 text-slate-600 hover:bg-slate-100"
                        onClick={(e) => {
                          setScoreMenuOpen((v) => !v);
                          const rect = e.currentTarget.getBoundingClientRect();
                          setScoreMenuAnchor({ x: rect.right, y: rect.bottom });
                        }}
                        aria-label="Seleziona colonne scores"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </button>
                      {scoreMenuOpen && (
                        <div
                          className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                          style={scoreMenuAnchor ? { left: "auto", right: 0 } : undefined}
                          onMouseLeave={() => setScoreMenuOpen(false)}
                        >
                          <div className="p-2 text-xs text-slate-700 space-y-1">
                            <label className="flex cursor-pointer items-center gap-2 px-1 py-1 hover:bg-slate-50">
                              <input
                                type="checkbox"
                                checked={showRadar}
                                onChange={(e) => {
                                  setShowRadar(e.target.checked);
                                  persistScoreVisibility({ ...buildScoreVisibility(), radar: e.target.checked });
                                }}
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span>Radar</span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-2 px-1 py-1 hover:bg-slate-50">
                              <input
                                type="checkbox"
                                checked={showGrow}
                                onChange={(e) => {
                                  setShowGrow(e.target.checked);
                                  persistScoreVisibility({ ...buildScoreVisibility(), grow: e.target.checked });
                                }}
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span>Growth Probability</span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-2 px-1 py-1 hover:bg-slate-50">
                              <input
                                type="checkbox"
                                checked={showMomentum}
                                onChange={(e) => {
                                  setShowMomentum(e.target.checked);
                                  persistScoreVisibility({ ...buildScoreVisibility(), momentum: e.target.checked });
                                }}
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span>Growth Momentum</span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-2 px-1 py-1 hover:bg-slate-50">
                              <input
                                type="checkbox"
                                checked={showRisk}
                                onChange={(e) => {
                                  setShowRisk(e.target.checked);
                                  persistScoreVisibility({ ...buildScoreVisibility(), risk: e.target.checked });
                                }}
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span>Growth Risk</span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-2 px-1 py-1 hover:bg-slate-50">
                              <input
                                type="checkbox"
                                checked={showMarket}
                                onChange={(e) => {
                                  setShowMarket(e.target.checked);
                                  persistScoreVisibility({ ...buildScoreVisibility(), market: e.target.checked });
                                }}
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span>Growth Market</span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-2 px-1 py-1 hover:bg-slate-50">
                              <input
                                type="checkbox"
                                checked={showMom1}
                                onChange={(e) => {
                                  setShowMom1(e.target.checked);
                                  persistScoreVisibility({ ...buildScoreVisibility(), mom1: e.target.checked });
                                }}
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span>Mom 1M</span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-2 px-1 py-1 hover:bg-slate-50">
                              <input
                                type="checkbox"
                                checked={showMom3}
                                onChange={(e) => {
                                  setShowMom3(e.target.checked);
                                  persistScoreVisibility({ ...buildScoreVisibility(), mom3: e.target.checked });
                                }}
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span>Mom 3M</span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-2 px-1 py-1 hover:bg-slate-50">
                              <input
                                type="checkbox"
                                checked={showMom6}
                                onChange={(e) => {
                                  setShowMom6(e.target.checked);
                                  persistScoreVisibility({ ...buildScoreVisibility(), mom6: e.target.checked });
                                }}
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span>Mom 6M</span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-2 px-1 py-1 hover:bg-slate-50">
                              <input
                                type="checkbox"
                                checked={showMom12}
                                onChange={(e) => {
                                  setShowMom12(e.target.checked);
                                  persistScoreVisibility({ ...buildScoreVisibility(), mom12: e.target.checked });
                                }}
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span>Mom 12M</span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-2 px-1 py-1 hover:bg-slate-50">
                              <input
                                type="checkbox"
                                checked={showDoubleTop}
                                onChange={(e) => {
                                  setShowDoubleTop(e.target.checked);
                                  persistScoreVisibility({ ...buildScoreVisibility(), doubleTop: e.target.checked });
                                }}
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span>Double Top</span>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {topRows.map((item, idx) => {
                  const symbol = item.ticker || item.symbol || "-";

                  const getScore = (...keys: string[]) => {
                    for (const key of keys) {
                      const value = (item as any)[key];
                      if (value !== undefined && value !== null) return value;
                    }
                    return null;
                  };

                  const rowRadar = (() => {
                    const entries = [
                      { label: "Momentum", value: getScore("user_momentum_score", "momentum_score") },
                      { label: "Quality", value: getScore("user_quality_score", "quality_score") },
                      { label: "Risk", value: getScore("user_risk_score", "risk_score") },
                      { label: "Valuation", value: getScore("user_valuation_score", "valuation_score", "valuation_scores") },
                      { label: "Growth probability", value: getScore("user_grow_score", "growth_probability") },
                      { label: "Double top", value: getScore("user_double_top_score") ?? getDoubleTopScore(item) },
                    ]
                      .map((m) => ({ ...m, value: parseScore(m.value) }))
                      .filter((m) => m.value !== null) as { label: string; value: number }[];

                    if (!entries.length) return null;
                    return {
                      categories: entries.map((m) => m.label),
                      values: entries.map((m) => m.value),
                    };
                  })();

                  return (
                    <tr
                      key={`${symbol}-${idx}`}
                      className="cursor-pointer hover:bg-slate-50"
                      onClick={() => {
                        if (symbol && symbol !== "-") {
                          window.location.hash = `#/dashboard/tickers/${encodeURIComponent(symbol)}`;
                          setSelectedSymbol(symbol);
                        }
                      }}
                    >
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        <div className="flex items-center gap-3">
                          {symbol && (
                            <img
                              src={`https://financialmodelingprep.com/image-stock/${symbol}.png`}
                              alt={`${symbol} logo`}
                              className="h-8 w-8 rounded-md border border-slate-200 bg-white object-contain"
                              onError={(e) => {
                                // Hide broken logos without breaking layout.
                                e.currentTarget.style.visibility = "hidden";
                              }}
                            />
                          )}
                          <span>{symbol}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{item.sector || "-"}</td>
                      <td className="px-4 py-3">{item.industry || "-"}</td>
                      <td className="px-4 py-3">{(item as any).country || "-"}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-4">
                          {showRadar && rowRadar ? (
                            <div className="min-w-[200px] max-w-[220px]">
                              <ReactApexChart
                                type="radar"
                                height={160}
                                series={[
                                  {
                                    name: "Score",
                                    data: rowRadar.values,
                                  },
                                ]}
                                options={{
                                  chart: { toolbar: { show: false }, sparkline: { enabled: true } },
                                  dataLabels: { enabled: false },
                                  stroke: { width: 2 },
                                  markers: { size: 2 },
                                  xaxis: {
                                    categories: rowRadar.categories,
                                    labels: {
                                      style: {
                                        colors: rowRadar.categories.map(() => "#475569"),
                                        fontSize: "10px",
                                      },
                                    },
                                  },
                                  yaxis: { show: false, min: 0, max: 100 },
                                  colors: ["#0ea5e9"],
                                  fill: { opacity: 0.35, colors: ["rgba(14,165,233,0.35)"] },
                                  plotOptions: {
                                    radar: {
                                      polygons: {
                                        strokeColors: "#e2e8f0",
                                        fill: { colors: ["#f8fafc", "#e2e8f0"] },
                                      },
                                    },
                                  },
                                  legend: { show: false },
                                  grid: { show: false },
                                }}
                              />
                            </div>
                          ) : null}
                          <div className="flex flex-col gap-2 text-xs text-slate-700">
                          {showGrow && (
                            <div>
                              <span className="font-semibold">Growth Probability</span>
                              <div className="mt-1 flex items-center gap-2">
                                {renderScoreBar(
                                  parseScore(
                                    (item as any).user_grow_score ??
                                      (item as any).grow_score ??
                                      (item as any).growth_probability
                                  )
                                )}
                              </div>
                            </div>
                          )}
                          {showMomentum && (
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-700">Momentum</span>
                              {renderScoreBar(
                                parseScore(
                                  (item as any).user_momentum_score ??
                                    (item as any).momentum_score ??
                                    (item as any).momentumShortScore
                                )
                              )}
                            </div>
                          )}
                          {showRisk && (
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-700">Risk</span>
                              {renderScoreBar(
                                parseScore(
                                  (item as any).user_risk_score ??
                                    (item as any).risk_score ??
                                    (item as any).short_risk_score
                                )
                              )}
                            </div>
                          )}
                          {showMarket && (
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-700">Market</span>
                              {renderScoreBar(
                                (() => {
                                const fromMomentum =
                                    parseScore(
                                      (item as any)?.momentum_json?.components?.marketRisk?.score ??
                                        (item as any)?.momentum?.components?.marketRisk?.score
                                    ) ?? null;
                                  const val =
                                    parseScore((item as any).user_market_score ?? (item as any).market_score) ??
                                    fromMomentum;
                                  return val;
                                })()
                              )}
                            </div>
                          )}
                          {showMom1 && (
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-700">Mom 1M</span>
                              {renderScoreBar(
                                parseScore(
                                  (item as any).user_mom1m_score ??
                                      (item as any).mom_1m ??
                                      (item as any).mom1m ??
                                      (item as any)?.momentum_json?.components?.mom1mScore ??
                                      (item as any)?.momentum?.components?.mom1mScore
                                  )
                                )}
                              </div>
                          )}
                          {showMom3 && (
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-700">Mom 3M</span>
                              {renderScoreBar(
                                parseScore(
                                  (item as any).user_mom3m_score ??
                                    (item as any).mom_3m ??
                                    (item as any).mom3m ??
                                    (item as any)?.momentum_json?.components?.mom3mScore ??
                                    (item as any)?.momentum?.components?.mom3mScore
                                )
                                )}
                              </div>
                          )}
                          {showMom6 && (
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-700">Mom 6M</span>
                              {renderScoreBar(
                                parseScore(
                                  (item as any).user_mom6m_score ??
                                    (item as any).mom_6m ??
                                    (item as any).mom6m ??
                                    (item as any)?.momentum_json?.components?.mom6mScore ??
                                    (item as any)?.momentum?.components?.mom6mScore
                                )
                                )}
                              </div>
                          )}
                          {showMom12 && (
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-700">Mom 12M</span>
                              {renderScoreBar(
                                parseScore(
                                  (item as any).user_mom12m_score ??
                                    (item as any).mom_12m ??
                                    (item as any).mom12m ??
                                    (item as any)?.momentum_json?.components?.mom12mScore ??
                                    (item as any)?.momentum?.components?.mom12mScore
                                )
                                )}
                              </div>
                          )}
                          {showDoubleTop && (
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-700">Double Top</span>
                              {renderScoreBar(
                                parseScore(
                                  (item as any).user_double_top_score ??
                                    (item as any).double_top_score ??
                                    (item as any)?.momentum_json?.components?.doubleTop?.score ??
                                    (item as any)?.momentum?.components?.doubleTop?.score
                                )
                              )}
                            </div>
                          )}
                          {!showRadar &&
                            !showGrow &&
                            !showMomentum &&
                            !showRisk &&
                            !showMarket &&
                            !showMom1 &&
                            !showMom3 &&
                            !showMom6 &&
                            !showMom12 &&
                            !showDoubleTop && <span className="text-xs text-slate-500">-</span>}
                        </div>
                      </div>
                    </td>
                    </tr>
                  );
                })}
                {!topRows.length && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-500">
                      Nessun dato disponibile.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default TickersPage;
