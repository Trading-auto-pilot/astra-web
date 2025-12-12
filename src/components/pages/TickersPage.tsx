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
  type FundamentalRecord,
} from "../../api/fundamentals";
import SectionHeader from "../molecules/content/SectionHeader";
import ReactApexChart from "react-apexcharts";
import ReactCountryFlag from "react-country-flag";
import TickerDetailTab from "./tickers/TickerDetailTab";
import TickerStatementTab from "./tickers/TickerStatementTab";
import TickerRatiosTab from "./tickers/TickerRatiosTab";
import TickerAnalysisTab from "./tickers/TickerAnalysisTab";
import TickerFinancialReportTab from "./tickers/TickerFinancialReportTab";
import TickerSegmentationTab from "./tickers/TickerSegmentationTab";
import { env } from "../../config/env";

type SortKey = "momentum" | "quality" | "risk" | "valuation" | "total";
type StatementStatus = "idle" | "loading" | "error" | "no-key";

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

export function TickersPage() {
  const [records, setRecords] = useState<FundamentalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("total");
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(() => getHashSymbol());
  const [selectedRecord, setSelectedRecord] = useState<FundamentalRecord | null>(null);
  const [fmpInfo, setFmpInfo] = useState<any | null>(null);
  const [fmpStatus, setFmpStatus] = useState<"idle" | "loading" | "error" | "no-key">("idle");
  const [infoTab, setInfoTab] = useState<"detail" | "statement" | "ratios" | "score" | "financialReport" | "segmentation">("detail");
  const [statementTab, setStatementTab] = useState<"income" | "balance" | "cash">("income");
  const [statementData, setStatementData] = useState<Record<string, { docs: any[]; status: StatementStatus }>>({
    income: { docs: [], status: "idle" },
    balance: { docs: [], status: "idle" },
    cash: { docs: [], status: "idle" },
  });
  const [ratiosTab, setRatiosTab] = useState<"keyMetrics" | "ratios" | "keyMetricsTtm" | "ratiosTtm">("keyMetrics");
  const [ratiosData, setRatiosData] = useState<Record<string, { docs: any[]; status: StatementStatus }>>({
    keyMetrics: { docs: [], status: "idle" },
    ratios: { docs: [], status: "idle" },
    keyMetricsTtm: { docs: [], status: "idle" },
    ratiosTtm: { docs: [], status: "idle" },
  });
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
    let active = true;
    setLoading(true);
    setError(null);

    fetchFundamentals()
      .then((data) => {
        if (!active) return;
        setRecords(Array.isArray(data) ? data : []);
      })
      .catch((err: any) => {
        if (!active) return;
        const message =
          err?.message && typeof err.message === "string"
            ? err.message
            : "Errore durante il caricamento dei ticker";
        setError(message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const syncSymbol = () => {
      setSelectedSymbol(getHashSymbol());
    };
    window.addEventListener("hashchange", syncSymbol);
    return () => window.removeEventListener("hashchange", syncSymbol);
  }, []);

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
    const found = records.find((item) => {
      const symbol = (item as any).ticker || (item as any).symbol;
      return typeof symbol === "string" && symbol.toUpperCase() === selectedSymbol.toUpperCase();
    });
    setSelectedRecord(found ?? null);
  }, [records, selectedSymbol]);

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

  const topRows = useMemo(() => {
    const scoreKeyMap: Record<SortKey, string[]> = {
      momentum: ["momentum_score"],
      quality: ["quality_score"],
      risk: ["risk_score"],
      valuation: ["valuation_score", "valuation_scores"],
      total: ["total_score", "score", "totalScore"],
    };

    const keys = scoreKeyMap[sortKey];

    const getScore = (item: FundamentalRecord, keyList: string[]) => {
      for (const key of keyList) {
        const value = (item as any)[key];
        const parsed = parseScore(value);
        if (parsed !== null) return parsed;
      }
      return null;
    };

    const sorted = [...records].sort((a, b) => {
      const aScore = getScore(a, keys);
      const bScore = getScore(b, keys);
      if (aScore === null && bScore === null) return 0;
      if (aScore === null) return 1;
      if (bScore === null) return -1;
      return bScore - aScore;
    });

    return sorted.slice(0, 50);
  }, [records, sortKey]);

  const detailRows = useMemo(() => {
    if (!selectedRecord) return [];
    const rows: { key: string; value: string }[] = [];

    Object.entries(selectedRecord).forEach(([key, value]) => {
      if (key === "momentum_json") {
        let parsed: any = null;
        if (typeof value === "string") {
          try {
            parsed = JSON.parse(value);
          } catch {
            parsed = value;
          }
        } else {
          parsed = value;
        }

        if (parsed && typeof parsed === "object") {
          Object.entries(parsed as Record<string, unknown>).forEach(([k, v]) => {
            let display = "-";
            if (v === null || v === undefined) display = "-";
            else if (typeof v === "number" || typeof v === "boolean") display = String(v);
            else if (typeof v === "string") display = v;
            else if (Array.isArray(v)) display = v.length ? JSON.stringify(v) : "[]";
            else if (typeof v === "object") display = JSON.stringify(v);
            rows.push({ key: `momentum_json.${k}`, value: display });
          });
          return;
        }
      }

      let display = "-";
      if (value === null || value === undefined) {
        display = "-";
      } else if (typeof value === "number" || typeof value === "boolean") {
        display = String(value);
      } else if (typeof value === "string") {
        display = value;
      } else if (Array.isArray(value)) {
        display = value.length ? JSON.stringify(value) : "[]";
      } else if (typeof value === "object") {
        display = JSON.stringify(value);
      }
      rows.push({ key, value: display });
    });

    return rows;
  }, [selectedRecord]);

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

    const metrics: { label: string; value: number | null }[] = [
      { label: "Momentum", value: get(["momentum_score", "momentumScore"]) },
      { label: "Quality", value: get(["quality_score", "qualityScore"]) },
      { label: "Risk", value: get(["risk_score", "riskScore"]) },
      { label: "Valuation", value: get(["valuation_score", "valuation_scores", "valuationScore"]) },
      { label: "Total", value: get(["total_score", "score", "totalScore"]) },
    ];

    const filtered = metrics.filter((m) => m.value !== null);
    if (!filtered.length) return null;

    return {
      categories: filtered.map((m) => m.label),
      values: filtered.map((m) => m.value as number),
      items: filtered,
    };
  }, [scoreSources]);

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
                  height={260}
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
                    markers: { size: 3 },
                    xaxis: { categories: radarData.categories },
                    yaxis: { show: true, min: 0, max: 100 },
                    fill: { opacity: 0.25 },
                    colors: ["#0ea5e9"],
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
                    : "Financial Report"
                }
                subTitle="Tutti i campi disponibili per il ticker"
              />
              <div className="flex gap-2">
                {[
                  { id: "detail" as const, label: "Dettaglio" },
                  { id: "statement" as const, label: "Statement" },
                  { id: "ratios" as const, label: "Ratios" },
                  { id: "score" as const, label: "Analysis" },
                  { id: "financialReport" as const, label: "Financial Report" },
                  { id: "segmentation" as const, label: "Segmentation" },
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
            {infoTab === "detail" && <TickerDetailTab detailRows={detailRows} />}

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
                  <TickerStatementTab metrics={incomeMetrics} status={statementData.income?.status ?? "idle"} />
                )}
                {statementTab === "balance" && (
                  <TickerStatementTab metrics={balanceMetrics} status={statementData.balance?.status ?? "idle"} />
                )}
                {statementTab === "cash" && (
                  <TickerStatementTab metrics={cashMetrics} status={statementData.cash?.status ?? "idle"} />
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

                <TickerRatiosTab metrics={ratioMetrics[ratiosTab]} status={ratiosData[ratiosTab]?.status ?? "idle"} />
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
                ownerMetrics={ownerMetrics}
                ownerStatus={ownerData.status}
                enterpriseMetrics={enterpriseMetrics}
                enterpriseStatus={enterpriseData.status}
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
          <div className="flex flex-wrap gap-2">
            {[
              { key: "momentum", label: "Best Momentum" },
              { key: "quality", label: "Best Quality" },
              { key: "risk", label: "Best Risk" },
              { key: "valuation", label: "Best Value" },
              { key: "total", label: "Best General" },
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
                  <th className="px-4 py-3 font-semibold">Scores</th>
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

                  const scoreBadges = [
                    { label: "Valuation", value: getScore("valuation_score", "valuation_scores") },
                    { label: "Quality", value: getScore("quality_score") },
                    { label: "Risk", value: getScore("risk_score") },
                    { label: "Momentum", value: getScore("momentum_score") },
                    { label: "Total", value: getScore("total_score", "score", "totalScore") },
                  ];

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
                        <div className="flex flex-wrap gap-3">
                          {scoreBadges.map((score) => {
                            const scoreValue = parseScore(score.value);
                            const displayValue =
                              scoreValue !== null ? `${scoreValue.toFixed(1)}%` : "-";
                            const color = scoreValue !== null ? getScoreColor(scoreValue) : null;

                            return (
                              <div key={score.label} className="w-48 min-w-[10rem] space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-slate-500">{score.label}</span>
                                  <span className={`tabular-nums font-semibold ${color?.text ?? "text-slate-700"}`}>
                                    {displayValue}
                                  </span>
                                </div>
                                <div className="h-2 rounded-full bg-slate-100">
                                  <div
                                    className={`h-full rounded-full transition-all duration-200 ${color?.bar ?? "bg-slate-300"}`}
                                    style={{ width: `${scoreValue ?? 0}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
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
