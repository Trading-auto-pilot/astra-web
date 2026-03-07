import { useCallback, useEffect, useMemo, useState } from "react";
import MicroserviceGeneralTab from "../../molecules/microservice/MicroserviceGeneralTab";
import AccountCapacityBar from "../../molecules/AccountCapacityBar";
import AppIcon from "../../atoms/icon/AppIcon";
import { env } from "../../../config/env";
import { countryToArea } from "../../../utils/geoUtils";

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
};

type ConcentrationDimension = {
  name?: string | null;
  limit?: number | null;
  invested?: number;
  residual?: number | null;
};

type QuoteDecision = {
  symbol?: string;
  market?: string;
  maxInvestable?: number;
  reservedCashPct?: number;
  reservedCash?: number;
  riskRegime?: string;
  liquidityScore?: number | null;
  confidence?: number;
  volatility?: number | string;
  constraints?: {
    cashAvailable?: number;
    openOrdersReserved?: number;
    reservationsReserved?: number;
  };
  reasons?: string[];
  usedFallback?: boolean;
  limitedBy?: string | null;
  concentrationReasons?: string[];
  reasoning?: string[];
  tickerInfo?: { sector?: string | null; industry?: string | null; area?: string | null };
  concentrationDetail?: {
    ticker:   ConcentrationDimension;
    sector:   ConcentrationDimension;
    industry: ConcentrationDimension;
    area:     ConcentrationDimension;
  };
  ts?: string;
};

type QuoteResult = {
  ok: boolean;
  decision?: QuoteDecision;
  error?: { code?: string; message?: string; details?: Record<string, unknown> };
};

type IbkrSummaryField = { amount?: number; currency?: string; isNull?: boolean } | number | null | undefined;

type IbkrAccountSummary = Record<string, IbkrSummaryField>;

type IbkrAccountData = {
  accountId?: string;
  summary?: IbkrAccountSummary;
  performance?: Record<string, unknown> | null;
  performanceError?: Record<string, unknown> | null;
};

type IbkrOrder = {
  orderId?: string;
  broker?: string;
  status?: string;
  symbol?: string;
  side?: string;
  type?: string;
  quantity?: number;
  limitPrice?: number;
  parentOrderId?: string;
  bracketRole?: string;
  [key: string]: unknown;
};

type IbkrPosition = {
  broker?: string;
  accountId?: string;
  conid?: string;
  symbol?: string;
  quantity?: number;
  avgPrice?: number;
  marketPrice?: number;
  marketValue?: number;
  currency?: string;
  [key: string]: unknown;
};

type Reservation = {
  reservationId?: string;
  userId?: number | string;
  symbol?: string;
  market?: string;
  currency?: string;
  amount?: number;
  clientRequestId?: string;
  expiresAt?: string;
};

type ExposureSnapshot = {
  ticker:   Record<string, number>;
  sector:   Record<string, number>;
  industry: Record<string, number>;
  area:     Record<string, number>;
  computedAt?:    string;
  positionCount?: number;
  orderCount?:    number;
};

type AllocationConfig = {
  CONFIDENCE_THRESHOLD?: number;
  FALLBACK_RESERVED_CASH_PCT?: number;
  SCORE_RESERVED_MIN?: number;
  SCORE_RESERVED_MAX?: number;
  RISK_OFF_ADD_PCT?: number;
  VOL_ADD_MAX_PCT?: number;
  VOL_SCALE?: number;
  MIN_ORDER_NOTIONAL?: number;
  RESERVATION_TTL_SEC?: number;
  MAX_PERC_TICKER?: number;
  MAX_PERC_SECTOR?: number;
  MAX_PERC_INDUSTRY?: number;
  MAX_PERC_AREA?: number;
};

type Status = "idle" | "loading" | "error";

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("it-IT", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const formatMoney = (value?: number | null) => {
  if (value == null) return "-";
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
};

const formatPct = (value?: number | null) => {
  if (value == null) return "-";
  return `${(value * 100).toFixed(1)}%`;
};


export default function CapitalManagerMicroservicePage({
  onReleaseChange,
  onHealthChange,
  onOpenReleaseModal,
}: Props) {
  const [activeTab, setActiveTab] = useState<"general" | "quotation" | "allocationSetting">("general");
  const allocationHelpUrl = `${env.helpBase}/docs/utente/servizi-a-supporto/capital-manager-allocazione`;

  // --- Allocation Setting section ---
  const [configStatus, setConfigStatus] = useState<Status>("idle");
  const [configError, setConfigError] = useState<string | null>(null);
  const [allocationConfig, setAllocationConfig] = useState<AllocationConfig | null>(null);
  const [draftValues, setDraftValues] = useState<Record<string, number>>({});
  const [saveStatus, setSaveStatus] = useState<Record<string, "saving" | "ok" | "error">>({});
  const [maxInvestment, setMaxInvestment] = useState<number | null>(null);
  const [maxInvestmentLoaded, setMaxInvestmentLoaded] = useState(false);

  // --- Quote section ---
  const [quoteUserId, setQuoteUserId] = useState("7");
  const [quoteSymbol, setQuoteSymbol] = useState("AAPL");
  const [quotePriceHint, setQuotePriceHint] = useState("");
  const [quoteClientRequestId, setQuoteClientRequestId] = useState(`test-${Date.now()}`);
  const [quoteStatus, setQuoteStatus] = useState<Status>("idle");
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null);
  const [reserveStatus, setReserveStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [reserveError, setReserveError] = useState<string | null>(null);
  const [reserveResult, setReserveResult] = useState<{ reservationId: string; expiresAt: string; amount: number; reused: boolean } | null>(null);

  // --- IBKR Account section ---
  const [ibkrStatus, setIbkrStatus] = useState<Status>("idle");
  const [ibkrError, setIbkrError] = useState<string | null>(null);
  const [ibkrAccountId, setIbkrAccountId] = useState<string | null>(null);
  const [ibkrAccount, setIbkrAccount] = useState<IbkrAccountData | null>(null);
  const [ibkrOrders, setIbkrOrders] = useState<IbkrOrder[]>([]);
  const [ibkrPositions, setIbkrPositions] = useState<IbkrPosition[]>([]);
  const [fundamentalsMap, setFundamentalsMap] = useState<Record<string, { sector?: string; industry?: string; country?: string }>>({});
  const [fundamentalsLoading, setFundamentalsLoading] = useState(false);
  const [allocationModalOpen, setAllocationModalOpen] = useState(false);
  const [exposureSnapshot, setExposureSnapshot] = useState<ExposureSnapshot | null>(null);
  const [exposureRefreshing, setExposureRefreshing] = useState(false);

  // --- Liquidity section ---
  const [liquidityStatus, setLiquidityStatus] = useState<Status>("idle");
  const [liquidityError, setLiquidityError] = useState<string | null>(null);
  const [liquidityData, setLiquidityData] = useState<{
    score: number;
    riskRegime: string;
    volatility: number | string;
    confidence: number;
    market?: string;
    ts?: string;
  } | null>(null);

  // --- Reservations section ---
  const [resUserId, setResUserId] = useState("7");
  const [resStatus, setResStatus] = useState<Status>("idle");
  const [resError, setResError] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [releaseStatus, setReleaseStatus] = useState<Record<string, "loading" | "done" | "error">>({});

  const token = useMemo(
    () => (typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null),
    []
  );

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }),
    [token]
  );

  // Derived: residualCashToInvest — mirrors the Cash Allocation table computation.
  // Used by the useEffect that persists MAX_TICKER/SECTOR/INDUSTRY/AREA to Redis.
  const residualCashToInvest = useMemo<number | null>(() => {
    if (!ibkrAccount) return null;
    const s = ibkrAccount.summary as Record<string, IbkrSummaryField> | undefined;
    const getAmt = (field: IbkrSummaryField): number => {
      if (field == null) return 0;
      if (typeof field === "number") return field;
      return typeof (field as any)?.amount === "number" ? (field as any).amount : 0;
    };
    const netLiquidation     = s ? getAmt(s.netliquidation ?? s.NetLiquidation) : 0;
    const totalCashValue     = s ? getAmt(s.totalcashvalue ?? s.TotalCashValue) : 0;
    const grossPositionValue = s ? getAmt(s.grosspositionvalue ?? s.GrossPositionValue) || undefined : undefined;
    const activeOrdersCash   = ibkrOrders
      .filter(o => o.status === "WORKING")
      .reduce((sum, o) => sum + Number(o.limitPrice ?? 0) * Number(o.quantity ?? 0), 0);
    const openPositions  = grossPositionValue != null ? grossPositionValue : Math.max(netLiquidation - totalCashValue, 0);
    const effectiveMaxInv = maxInvestment ?? netLiquidation;
    const scorePct        = liquidityData ? Math.max(0, Math.min(100, liquidityData.score)) / 100 : 0;
    const cashToInvest    = Math.round(effectiveMaxInv * scorePct * 100) / 100;
    return cashToInvest - openPositions - activeOrdersCash;
  }, [ibkrAccount, ibkrOrders, liquidityData, maxInvestment]);

  // Effective max investment: user-set value OR net liquidation from IBKR.
  // This is the correct base for concentration limit calculations (MAX_TICKER/SECTOR/INDUSTRY/AREA).
  const effectiveMaxInvestment = useMemo<number | null>(() => {
    if (!ibkrAccount) return maxInvestment;
    const s = ibkrAccount.summary as Record<string, IbkrSummaryField> | undefined;
    const getAmt = (field: IbkrSummaryField): number => {
      if (field == null) return 0;
      if (typeof field === "number") return field;
      return typeof (field as any)?.amount === "number" ? (field as any).amount : 0;
    };
    const netLiq = s ? getAmt(s.netliquidation ?? s.NetLiquidation) : 0;
    const base = maxInvestment ?? netLiq;
    return base > 0 ? base : null;
  }, [ibkrAccount, maxInvestment]);

  // Persist derived limits to Redis whenever residualCashToInvest or effectiveMaxInvestment changes.
  // Always send maxInvestment = effectiveMaxInvestment so the backend uses the correct base
  // (MAX_INVESTMENT, not residualCashToInvest) when computing MAX_TICKER/SECTOR/INDUSTRY/AREA.
  // Guard with maxInvestmentLoaded to prevent overwriting the persisted value before it is fetched.
  useEffect(() => {
    if (!maxInvestmentLoaded || residualCashToInvest == null || !allocationConfig || !effectiveMaxInvestment) return;
    fetch(`${env.apiBaseUrl}/capital-manager/allocation/limits`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ residualCashToInvest, maxInvestment: effectiveMaxInvestment }),
    }).catch(() => {});
  }, [maxInvestmentLoaded, residualCashToInvest, effectiveMaxInvestment, allocationConfig, headers]);

  const runQuote = useCallback(async () => {
    setQuoteStatus("loading");
    setQuoteError(null);
    setQuoteResult(null);
    setReserveStatus("idle");
    setReserveError(null);
    setReserveResult(null);
    try {
      const res = await fetch(`${env.apiBaseUrl}/capital-manager/allocation/quote`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          userId: Number(quoteUserId) || quoteUserId,
          symbol: quoteSymbol.trim().toUpperCase(),
          market: "US",
          clientRequestId: quoteClientRequestId || `test-${Date.now()}`,
          ...(quotePriceHint ? { priceHint: parseFloat(quotePriceHint) } : {}),
        }),
      });
      const data: QuoteResult = await res.json().catch(() => ({ ok: false }));
      setQuoteResult(data);
      if (!res.ok && data?.ok !== false) throw new Error("Errore risposta server");
      setQuoteStatus("idle");
    } catch (err: any) {
      setQuoteStatus("error");
      setQuoteError(err?.message || "Errore chiamata quote");
    }
  }, [headers, quoteUserId, quoteSymbol, quoteClientRequestId, quotePriceHint]);

  const runReserve = useCallback(async () => {
    if (!quoteResult?.ok || quoteResult.decision?.maxInvestable == null) return;
    setReserveStatus("loading");
    setReserveError(null);
    setReserveResult(null);
    try {
      const res = await fetch(`${env.apiBaseUrl}/capital-manager/allocation/reserve`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          userId: Number(quoteUserId) || quoteUserId,
          symbol: quoteSymbol.trim().toUpperCase(),
          market: "US",
          currency: "USD",
          amount: quoteResult.decision.maxInvestable,
          clientRequestId: quoteClientRequestId,
        }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || data?.ok === false) throw new Error(data?.error?.message || "Errore reservation");
      setReserveResult({ reservationId: data.reservationId, expiresAt: data.expiresAt, amount: data.amount, reused: data.reused ?? false });
      setReserveStatus("ok");
    } catch (err: any) {
      setReserveStatus("error");
      setReserveError(err?.message || "Errore chiamata reserve");
    }
  }, [headers, quoteUserId, quoteSymbol, quoteClientRequestId, quoteResult]);

  const loadReservations = useCallback(async () => {
    setResStatus("loading");
    setResError(null);
    try {
      const res = await fetch(
        `${env.apiBaseUrl}/capital-manager/allocation/reservations?userId=${resUserId}`,
        { headers }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) throw new Error(data?.error?.message || "Errore caricamento prenotazioni");
      setReservations(Array.isArray(data?.data) ? data.data : []);
      setResStatus("idle");
    } catch (err: any) {
      setResStatus("error");
      setResError(err?.message || "Errore caricamento prenotazioni");
    }
  }, [headers, resUserId]);

  const releaseReservation = useCallback(
    async (reservationId: string) => {
      setReleaseStatus((prev) => ({ ...prev, [reservationId]: "loading" }));
      try {
        const res = await fetch(`${env.apiBaseUrl}/capital-manager/allocation/release`, {
          method: "POST",
          headers,
          body: JSON.stringify({ reservationId, userId: Number(resUserId) || resUserId, reason: "manual_release" }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data?.ok === false) throw new Error(data?.error?.message || "Errore release");
        setReleaseStatus((prev) => ({ ...prev, [reservationId]: "done" }));
        setReservations((prev) => prev.filter((r) => r.reservationId !== reservationId));
      } catch {
        setReleaseStatus((prev) => ({ ...prev, [reservationId]: "error" }));
      }
    },
    [headers, resUserId]
  );

  const loadAllocationConfig = useCallback(async () => {
    setConfigStatus("loading");
    setConfigError(null);
    try {
      const res = await fetch(`${env.apiBaseUrl}/capital-manager/allocation/config`, { headers });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) throw new Error(data?.error?.message || "Errore caricamento configurazione");
      setAllocationConfig(data?.config ?? data);
      setConfigStatus("idle");
    } catch (err: any) {
      setConfigStatus("error");
      setConfigError(err?.message || "Errore caricamento configurazione");
    }
  }, [headers]);

  const saveAllocationSetting = useCallback(async (key: string, value: number) => {
    if (isNaN(value)) return;
    setSaveStatus((prev) => ({ ...prev, [key]: "saving" }));
    try {
      const res = await fetch(`${env.apiBaseUrl}/capital-manager/allocation/config`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ key, value }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) throw new Error(data?.error?.message || "Errore salvataggio");
      setAllocationConfig(data?.config ?? allocationConfig);
      setDraftValues((prev) => { const n = { ...prev }; delete n[key]; return n; });
      setSaveStatus((prev) => ({ ...prev, [key]: "ok" }));
      setTimeout(() => setSaveStatus((prev) => { const n = { ...prev }; delete n[key]; return n; }), 2000);
    } catch {
      setSaveStatus((prev) => ({ ...prev, [key]: "error" }));
    }
  }, [headers, allocationConfig]);

  const loadIbkrAccount = useCallback(async () => {
    setIbkrStatus("loading");
    setIbkrError(null);
    try {
      // Step 0: auto-load allocationConfig if not already available
      // (needed so MAX_TICKER/SECTOR/INDUSTRY/AREA show correctly in Cash Allocation table)
      if (!allocationConfig) {
        try {
          const cfgRes = await fetch(`${env.apiBaseUrl}/capital-manager/allocation/config`, { headers });
          const cfgData = await cfgRes.json().catch(() => ({}));
          if (cfgRes.ok && cfgData?.ok !== false) {
            setAllocationConfig(cfgData?.config ?? cfgData);
            setConfigStatus("idle");
          }
        } catch { /* best-effort — not critical for IBKR load */ }
      }

      // Step 1: get accounts list → first accountId
      const accountsRes = await fetch(`${env.apiBaseUrl}/ibkr-bridge/mirror/portfolio/accounts`, { headers });
      const accountsData = await accountsRes.json().catch(() => []);
      const accounts = Array.isArray(accountsData) ? accountsData : (Array.isArray(accountsData?.data) ? accountsData.data : []);
      if (!accounts.length) throw new Error("Nessun account IBKR trovato");
      const accountId = String(accounts[0]?.accountId ?? accounts[0]?.id ?? accounts[0]?.acctId ?? "");
      if (!accountId) throw new Error("accountId mancante dalla risposta di IBKR");
      setIbkrAccountId(accountId);

      // Step 2: get account details (summary + performance)
      const accountRes = await fetch(
        `${env.apiBaseUrl}/ibkr-bridge/account?accountId=${encodeURIComponent(accountId)}`,
        { headers }
      );
      const accountData = await accountRes.json().catch(() => ({}));
      if (!accountRes.ok) throw new Error(accountData?.error || "Errore caricamento account");
      setIbkrAccount(accountData as IbkrAccountData);

      // Step 3: get open orders
      const ordersRes = await fetch(`${env.apiBaseUrl}/broker-executor-ibkr/orders`, { headers });
      const ordersData = await ordersRes.json().catch(() => ({}));
      const orders: IbkrOrder[] = Array.isArray(ordersData?.items)
        ? ordersData.items
        : Array.isArray(ordersData)
          ? ordersData
          : [];
      setIbkrOrders(orders);

      // Step 4: get open positions (via broker-executor-ibkr which primes the IBKR portfolio model)
      const posRes = await fetch(`${env.apiBaseUrl}/broker-executor-ibkr/positions`, { headers });
      const posData = await posRes.json().catch(() => ({}));
      const positions: IbkrPosition[] = Array.isArray(posData?.items)
        ? posData.items
        : Array.isArray(posData)
          ? posData
          : [];
      setIbkrPositions(positions);
      setIbkrStatus("idle");

      // Step 5: load fundamentals for all tickers (positions + BUY orders) in background
      loadPositionFundamentals(positions, orders);
    } catch (err: any) {
      setIbkrStatus("error");
      setIbkrError(err?.message || "Errore caricamento dati IBKR");
    }
  }, [headers, allocationConfig]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadLiquidityData = useCallback(async () => {
    setLiquidityStatus("loading");
    setLiquidityError(null);
    try {
      const res = await fetch(`${env.apiBaseUrl}/liquidity-manager/liquidity-score`, { headers });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error?.message || data?.error || "Errore caricamento liquidità");
      // Response may be { score, riskRegime, volatility, confidence, market, ts } or wrapped in { data: ... }
      const payload = data?.score != null ? data : data?.data ?? data;
      setLiquidityData(payload);
      setLiquidityStatus("idle");
    } catch (err: any) {
      setLiquidityStatus("error");
      setLiquidityError(err?.message || "Errore caricamento liquidità");
    }
  }, [headers]);

  const loadPositionFundamentals = useCallback(async (positions: IbkrPosition[], orders: IbkrOrder[]) => {
    const posSymbols = positions.map(p => (p.symbol ?? "").toUpperCase()).filter(Boolean);
    const ordSymbols = orders
      .filter(o => (o.side ?? "").toUpperCase() === "BUY")
      .map(o => (o.symbol ?? "").toUpperCase())
      .filter(Boolean);
    const symbols = [...new Set([...posSymbols, ...ordSymbols])];
    if (!symbols.length) return;

    setFundamentalsLoading(true);
    setFundamentalsMap({});

    const results: Record<string, { sector?: string; industry?: string; country?: string }> = {};
    await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const res = await fetch(
            `${env.apiBaseUrl}/datahub/api/table/fundamentals/${encodeURIComponent(symbol)}`,
            { headers }
          );
          const raw = await res.json().catch(() => null);
          if (!res.ok || !raw) return;
          // Handle both flat { sector, ... } and wrapped { data: { sector, ... } } responses
          const d = (raw?.data != null && typeof raw.data === "object") ? raw.data : raw;
          const pick = (...keys: string[]): string | undefined => {
            for (const k of keys) {
              const v = d[k];
              if (v != null && String(v).trim()) return String(v).trim();
            }
            return undefined;
          };
          results[symbol] = {
            sector:   pick("sector", "Sector", "SECTOR", "gics_sector", "sectorName"),
            industry: pick("industry", "Industry", "INDUSTRY", "industryName"),
            country:  pick("country", "Country", "COUNTRY", "countryCode", "countryISO"),
          };
        } catch { /* ignore individual failures */ }
      })
    );
    setFundamentalsMap(results);
    setFundamentalsLoading(false);
  }, [headers]);

  // Push fundamentalsMap to capital-manager Redis whenever it updates,
  // then trigger a server-side exposure snapshot refresh.
  useEffect(() => {
    const entries = Object.entries(fundamentalsMap);
    if (!entries.length) return;
    const map: Record<string, { sector?: string; industry?: string; area?: string; country?: string }> = {};
    for (const [sym, data] of entries) {
      map[sym] = {
        sector:   data.sector,
        industry: data.industry,
        country:  data.country,
        area:     data.country ? countryToArea(data.country) : undefined,
      };
    }
    fetch(`${env.apiBaseUrl}/capital-manager/allocation/fundamentals`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ map }),
    })
      .then((r) =>
        r.ok
          ? fetch(`${env.apiBaseUrl}/capital-manager/allocation/exposure/refresh`, { method: "POST", headers })
          : null
      )
      .then((r) => (r ? r.json().catch(() => null) : null))
      .then((data) => { if (data?.ok && data?.data) setExposureSnapshot(data.data); })
      .catch(() => {});
  }, [fundamentalsMap, headers]);

  const refreshExposure = useCallback(async () => {
    setExposureRefreshing(true);
    try {
      const res = await fetch(`${env.apiBaseUrl}/capital-manager/allocation/exposure/refresh`, {
        method: "POST",
        headers,
      });
      const data = await res.json().catch(() => ({}));
      if (data?.ok && data?.data) setExposureSnapshot(data.data);
    } catch { /* best-effort */ }
    setExposureRefreshing(false);
  }, [headers]);

  // Load persisted MAX_INVESTMENT from Redis on mount.
  useEffect(() => {
    fetch(`${env.apiBaseUrl}/capital-manager/allocation/limits`, { headers })
      .then((r) => r.json())
      .then((data) => {
        const v = data?.data?.MAX_INVESTMENT;
        if (typeof v === "number" && v > 0) setMaxInvestment(v);
      })
      .catch(() => {})
      .finally(() => setMaxInvestmentLoaded(true));
  }, [headers]);

  // Debounced save of MAX_INVESTMENT to Redis — fires ~1.5 s after the user changes the value.
  useEffect(() => {
    if (!maxInvestmentLoaded || maxInvestment == null || effectiveMaxInvestment == null) return;
    const t = setTimeout(() => {
      fetch(`${env.apiBaseUrl}/capital-manager/allocation/limits`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ residualCashToInvest: residualCashToInvest ?? 0, maxInvestment: effectiveMaxInvestment }),
      }).catch(() => {});
    }, 1500);
    return () => clearTimeout(t);
  }, [maxInvestmentLoaded, maxInvestment, effectiveMaxInvestment, headers, residualCashToInvest]);

  // Auto-load when switching to Allocation Setting tab
  useEffect(() => {
    if (activeTab !== "allocationSetting") return;
    if (!liquidityData && liquidityStatus === "idle") loadLiquidityData();
    if (!ibkrAccount && ibkrStatus === "idle") loadIbkrAccount();
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      <div className="flex gap-6 border-b border-slate-200">
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "general" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
          }`}
          onClick={() => setActiveTab("general")}
        >
          General Settings
        </button>
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "quotation" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
          }`}
          onClick={() => setActiveTab("quotation")}
        >
          Quotation
        </button>
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "allocationSetting" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
          }`}
          onClick={() => setActiveTab("allocationSetting")}
        >
          Allocation Setting
        </button>
      </div>

      {activeTab === "general" && (
        <div className="flex-1 min-h-0 flex flex-col">
          <MicroserviceGeneralTab
            microservice="capital-manager"
            onReleaseChange={onReleaseChange}
            onHealthChange={onHealthChange}
            onOpenReleaseModal={onOpenReleaseModal}
          />
        </div>
      )}

      {activeTab === "quotation" && (
        <div className="mt-4 flex-1 min-h-0 overflow-y-auto space-y-6 pb-[5px]">

          {/* ── Test Quote ── */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 text-sm font-semibold text-slate-900">Test Quote</div>

            <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold uppercase text-slate-500">User ID</label>
                <input
                  type="text"
                  value={quoteUserId}
                  onChange={(e) => setQuoteUserId(e.target.value)}
                  className="rounded-md border border-slate-200 px-2 py-1.5 text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold uppercase text-slate-500">Symbol</label>
                <input
                  type="text"
                  value={quoteSymbol}
                  onChange={(e) => setQuoteSymbol(e.target.value)}
                  className="rounded-md border border-slate-200 px-2 py-1.5 text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  placeholder="AAPL"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold uppercase text-slate-500">Price Hint</label>
                <input
                  type="number"
                  value={quotePriceHint}
                  onChange={(e) => setQuotePriceHint(e.target.value)}
                  className="rounded-md border border-slate-200 px-2 py-1.5 text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  placeholder="optional"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold uppercase text-slate-500">Client Request ID</label>
                <input
                  type="text"
                  value={quoteClientRequestId}
                  onChange={(e) => setQuoteClientRequestId(e.target.value)}
                  className="rounded-md border border-slate-200 px-2 py-1.5 text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={runQuote}
                disabled={quoteStatus === "loading"}
                className="inline-flex items-center justify-center rounded-md bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {quoteStatus === "loading" ? "Running..." : "Run Quote"}
              </button>
              <button
                type="button"
                onClick={runReserve}
                disabled={!quoteResult?.ok || reserveStatus === "loading"}
                className="inline-flex items-center justify-center rounded-md bg-emerald-700 px-3 py-2 text-[11px] font-semibold text-white hover:bg-emerald-600 disabled:opacity-40"
                title={!quoteResult?.ok ? "Esegui prima una Run Quote valida" : `Prenota ${formatMoney(quoteResult?.decision?.maxInvestable)}`}
              >
                {reserveStatus === "loading" ? "Reserving..." : "Reserve"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuoteClientRequestId(`test-${Date.now()}`);
                  setReserveStatus("idle");
                  setReserveResult(null);
                  setReserveError(null);
                }}
                className="text-[10px] text-slate-400 hover:text-slate-600 underline"
              >
                Reset request ID
              </button>
            </div>

            {reserveStatus === "ok" && reserveResult && (
              <div className="mt-2 flex items-center gap-3 flex-wrap rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] text-emerald-800">
                <span className="font-semibold">Reservation attiva</span>
                <span className="font-mono text-[10px] text-emerald-700">{reserveResult.reservationId}</span>
                <span className="font-semibold">{formatMoney(reserveResult.amount)}</span>
                <span className="text-emerald-600">scade {formatDate(reserveResult.expiresAt)}</span>
                {reserveResult.reused && (
                  <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">reused</span>
                )}
              </div>
            )}
            {reserveStatus === "error" && reserveError && (
              <div className="mt-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">
                {reserveError}
              </div>
            )}

            {quoteError && (
              <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">
                {quoteError}
              </div>
            )}

            {quoteResult && (
              <div className="mt-3 space-y-3">
                {/* Status + error */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      quoteResult.ok
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {quoteResult.ok ? "OK" : `KO — ${quoteResult.error?.code ?? "ERROR"}`}
                  </span>
                  {!quoteResult.ok && quoteResult.error?.message && (
                    <span className="text-[11px] text-rose-600">{quoteResult.error.message}</span>
                  )}
                  {quoteResult.decision?.limitedBy && (
                    <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                      limited by {quoteResult.decision.limitedBy}
                    </span>
                  )}
                </div>

                {quoteResult.decision && (
                  <div className="grid gap-3 md:grid-cols-2">
                    {/* Decision summary */}
                    <div className="rounded-lg border border-slate-200">
                      <div className="border-b border-slate-100 px-3 py-2 text-[11px] font-semibold text-slate-700">Decision</div>
                      <table className="w-full text-[11px]">
                        <tbody>
                          {([
                            ["Symbol", quoteResult.decision.symbol],
                            ["Market", quoteResult.decision.market],
                            ["Max Investable", formatMoney(quoteResult.decision.maxInvestable)],
                            ["Reserved Cash %", formatPct(quoteResult.decision.reservedCashPct)],
                            ["Reserved Cash", formatMoney(quoteResult.decision.reservedCash)],
                            ["Risk Regime", quoteResult.decision.riskRegime],
                            ["Liquidity Score", quoteResult.decision.liquidityScore != null ? String(quoteResult.decision.liquidityScore) : "—"],
                            ["Confidence", quoteResult.decision.confidence != null ? `${quoteResult.decision.confidence}` : "—"],
                            ["Volatility", quoteResult.decision.volatility != null ? String(quoteResult.decision.volatility) : "—"],
                            ["Used Fallback", quoteResult.decision.usedFallback ? "Yes" : "No"],
                            ["Timestamp", formatDate(quoteResult.decision.ts)],
                          ] as [string, string | undefined][]).map(([label, value]) => (
                            <tr key={label} className="border-t border-slate-100">
                              <td className="px-3 py-1.5 font-semibold text-slate-500">{label}</td>
                              <td className="px-3 py-1.5 text-slate-800">{value ?? "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Constraints */}
                    <div className="rounded-lg border border-slate-200">
                      <div className="border-b border-slate-100 px-3 py-2 text-[11px] font-semibold text-slate-700">Constraints</div>
                      <table className="w-full text-[11px]">
                        <tbody>
                          {([
                            ["Cash Available", formatMoney(quoteResult.decision.constraints?.cashAvailable)],
                            ["Open Orders Reserved", formatMoney(quoteResult.decision.constraints?.openOrdersReserved)],
                            ["Reservations Reserved", formatMoney(quoteResult.decision.constraints?.reservationsReserved)],
                          ] as [string, string][]).map(([label, value]) => (
                            <tr key={label} className="border-t border-slate-100">
                              <td className="px-3 py-1.5 font-semibold text-slate-500">{label}</td>
                              <td className="px-3 py-1.5 text-slate-800">{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Concentration Detail */}
                    {quoteResult.decision.concentrationDetail && (() => {
                      const cd  = quoteResult.decision.concentrationDetail!;
                      const ti  = quoteResult.decision.tickerInfo;
                      const sym = quoteResult.decision.symbol ?? "—";

                      const rows: { dim: string; name: string; limit: number | null | undefined; invested: number; residual: number | null | undefined }[] = [
                        { dim: "Ticker",   name: sym ?? "—",                   limit: cd.ticker.limit,   invested: cd.ticker.invested ?? 0,   residual: cd.ticker.residual },
                        { dim: "Sector",   name: cd.sector.name   ?? "–",      limit: cd.sector.limit,   invested: cd.sector.invested ?? 0,   residual: cd.sector.residual },
                        { dim: "Industry", name: cd.industry.name ?? "–",      limit: cd.industry.limit, invested: cd.industry.invested ?? 0, residual: cd.industry.residual },
                        { dim: "Area",     name: cd.area.name     ?? "–",      limit: cd.area.limit,     invested: cd.area.invested ?? 0,     residual: cd.area.residual },
                      ];

                      return (
                        <div className="md:col-span-2 rounded-lg border border-slate-200">
                          <div className="border-b border-slate-100 px-3 py-2 flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-slate-700">Concentration Detail</span>
                            {ti && (
                              <span className="text-[10px] text-slate-400">
                                {[ti.sector, ti.industry, ti.area].filter(Boolean).join(" · ")}
                              </span>
                            )}
                          </div>
                          <table className="w-full text-[11px]">
                            <thead className="bg-slate-50 text-[10px] uppercase text-slate-400">
                              <tr>
                                <th className="px-3 py-1.5 text-left">Dimensione</th>
                                <th className="px-3 py-1.5 text-left">Nome</th>
                                <th className="px-3 py-1.5 text-right">Limite</th>
                                <th className="px-3 py-1.5 text-right">Già investito</th>
                                <th className="px-3 py-1.5 text-right">Residuo</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rows.map(({ dim, name, limit, invested, residual }) => {
                                const isOver = limit != null && invested > limit;
                                const isLow  = residual != null && limit != null && residual < limit * 0.1;
                                return (
                                  <tr key={dim} className="border-t border-slate-100">
                                    <td className="px-3 py-1.5 font-semibold text-slate-500">{dim}</td>
                                    <td className="px-3 py-1.5 font-semibold text-slate-800">{name}</td>
                                    <td className="px-3 py-1.5 text-right tabular-nums text-slate-600">
                                      {limit != null ? formatMoney(limit) : "—"}
                                    </td>
                                    <td className={`px-3 py-1.5 text-right tabular-nums font-semibold ${isOver ? "text-rose-600" : "text-slate-700"}`}>
                                      {formatMoney(invested)}
                                    </td>
                                    <td className={`px-3 py-1.5 text-right tabular-nums font-semibold ${
                                      residual == null ? "text-slate-400"
                                      : residual <= 0  ? "text-rose-600"
                                      : isLow          ? "text-amber-600"
                                      : "text-emerald-600"
                                    }`}>
                                      {residual != null ? formatMoney(residual) : "—"}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      );
                    })()}

                    {/* Full Reasoning */}
                    {Array.isArray(quoteResult.decision.reasoning) && quoteResult.decision.reasoning.length > 0 && (
                      <div className="md:col-span-2 rounded-lg border border-slate-200">
                        <div className="border-b border-slate-100 px-3 py-2 text-[11px] font-semibold text-slate-700">
                          Reasoning
                        </div>
                        <ul className="divide-y divide-slate-50 px-3 py-1">
                          {quoteResult.decision.reasoning.map((line, i) => {
                            const isBinding = line.includes("⚠ BINDING");
                            const isOk      = line.includes("✓ ok");
                            const isSkipped = line.includes("skipped");
                            const isFinal   = line.startsWith("→");
                            return (
                              <li
                                key={i}
                                className={`py-1 font-mono text-[10px] ${
                                  isBinding ? "text-amber-700 font-semibold"
                                  : isOk      ? "text-emerald-700"
                                  : isSkipped ? "text-slate-400"
                                  : isFinal   ? "text-slate-900 font-semibold"
                                  : "text-slate-600"
                                }`}
                              >
                                {line}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Active Reservations ── */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900">Active Reservations</div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={resUserId}
                  onChange={(e) => setResUserId(e.target.value)}
                  className="w-20 rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  placeholder="userId"
                />
                <button
                  type="button"
                  onClick={loadReservations}
                  disabled={resStatus === "loading"}
                  className="inline-flex items-center justify-center rounded-md bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {resStatus === "loading" ? "Loading..." : "Load"}
                </button>
              </div>
            </div>

            {resError && (
              <div className="mb-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">
                {resError}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] text-slate-600">
                <thead className="bg-slate-50 text-[10px] uppercase text-slate-400">
                  <tr>
                    <th className="px-3 py-2">Reservation ID</th>
                    <th className="px-3 py-2">Symbol</th>
                    <th className="px-3 py-2">Market</th>
                    <th className="px-3 py-2">Amount</th>
                    <th className="px-3 py-2">Expires At</th>
                    <th className="px-3 py-2">Client Request ID</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((r) => (
                    <tr key={r.reservationId} className="border-t border-slate-100">
                      <td className="px-3 py-2 font-mono text-[10px] text-slate-700">{r.reservationId}</td>
                      <td className="px-3 py-2 font-semibold text-slate-800">{r.symbol ?? "-"}</td>
                      <td className="px-3 py-2">{r.market ?? "-"}</td>
                      <td className="px-3 py-2">{formatMoney(r.amount)}</td>
                      <td className="px-3 py-2">{formatDate(r.expiresAt)}</td>
                      <td className="px-3 py-2 font-mono text-[10px] text-slate-500">{r.clientRequestId ?? "-"}</td>
                      <td className="px-3 py-2">
                        {releaseStatus[r.reservationId ?? ""] === "done" ? (
                          <span className="text-[10px] text-emerald-600 font-semibold">Released</span>
                        ) : releaseStatus[r.reservationId ?? ""] === "error" ? (
                          <span className="text-[10px] text-rose-600 font-semibold">Error</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => releaseReservation(r.reservationId ?? "")}
                            disabled={releaseStatus[r.reservationId ?? ""] === "loading"}
                            className="rounded bg-rose-50 px-2 py-1 text-[10px] font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                          >
                            {releaseStatus[r.reservationId ?? ""] === "loading" ? "..." : "Release"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {reservations.length === 0 && (
                    <tr>
                      <td className="px-3 py-3 text-center text-[11px] text-slate-400" colSpan={7}>
                        {resStatus === "idle"
                          ? 'Inserisci un userId e premi "Load" per caricare le prenotazioni attive.'
                          : resStatus === "loading"
                            ? "Caricamento..."
                            : "Nessuna prenotazione attiva."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── IBKR Account ── */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900">IBKR Account</div>
              <button
                type="button"
                onClick={loadIbkrAccount}
                disabled={ibkrStatus === "loading"}
                className="inline-flex items-center justify-center rounded-md bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {ibkrStatus === "loading" ? "Loading..." : "Load"}
              </button>
            </div>

            {ibkrError && (
              <div className="mb-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">
                {ibkrError}
              </div>
            )}

            {ibkrAccountId && (
              <div className="mb-3 text-[10px] text-slate-500">
                Account: <span className="font-mono font-semibold text-slate-700">{ibkrAccountId}</span>
              </div>
            )}

            {ibkrAccount?.summary && (() => {
              const s = ibkrAccount.summary!;
              const getAmt = (field: IbkrSummaryField) => {
                if (field == null) return null;
                if (typeof field === "number") return field;
                if (typeof (field as any)?.amount === "number") return (field as any).amount as number;
                return null;
              };
              const getCcy = (field: IbkrSummaryField) => {
                if (field == null || typeof field === "number") return "";
                return (field as any)?.currency ?? "";
              };

              const netLiq = getAmt(s.netliquidation ?? s.NetLiquidation);
              const settledCash = getAmt(s.settledcash ?? s.SettledCash);
              const totalCash = getAmt(s.totalcashvalue ?? s.TotalCashValue);
              const buyingPower = getAmt(s.buyingpower ?? s.BuyingPower);
              const currency = getCcy(s.netliquidation ?? s.settledcash ?? s.buyingpower) || "USD";

              const workingOrders = ibkrOrders.filter(o => o.status === "WORKING");
              const openOrdersNotional = workingOrders
                .reduce((sum, o) => sum + Number(o.limitPrice ?? 0) * Number(o.quantity ?? 0), 0);

              const openPositionsValue = ibkrPositions.reduce((sum, p) => {
                return sum + Number(p.marketValue ?? 0);
              }, 0);

              const rows: { label: string; value: string; note?: string }[] = [
                {
                  label: "Liquidità complessiva",
                  value: netLiq != null ? formatMoney(netLiq) : "-",
                  note: `Net Liquidation${currency ? ` (${currency})` : ""}`,
                },
                {
                  label: "Liquidità regolata",
                  value: settledCash != null ? formatMoney(settledCash) : (totalCash != null ? formatMoney(totalCash) : "-"),
                  note: settledCash != null ? "Settled Cash" : "Total Cash Value",
                },
                {
                  label: "Potere d'acquisto",
                  value: buyingPower != null ? formatMoney(buyingPower) : "-",
                  note: "Buying Power",
                },
                {
                  label: "Totale ordini aperti",
                  value: workingOrders.length === 0 && ibkrStatus === "idle" && ibkrAccount
                    ? "0"
                    : `${workingOrders.length} ordini${openOrdersNotional > 0 ? ` — ${formatMoney(openOrdersNotional)}` : ""}`,
                  note: "Solo ordini WORKING — conteggio + notional stimato",
                },
                {
                  label: "Totale posizioni aperte",
                  value: ibkrPositions.length === 0 && ibkrStatus === "idle" && ibkrAccount
                    ? "0"
                    : `${ibkrPositions.length} posizioni${openPositionsValue > 0 ? ` — ${formatMoney(openPositionsValue)}` : ""}`,
                  note: "Conteggio + market value",
                },
              ];

              return (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] text-slate-700">
                    <thead className="bg-slate-50 text-[10px] uppercase text-slate-400">
                      <tr>
                        <th className="px-3 py-2">Campo</th>
                        <th className="px-3 py-2">Valore</th>
                        <th className="px-3 py-2">Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr key={row.label} className="border-t border-slate-100">
                          <td className="px-3 py-2 font-semibold text-slate-600">{row.label}</td>
                          <td className="px-3 py-2 font-semibold text-slate-900">{row.value}</td>
                          <td className="px-3 py-2 text-slate-400">{row.note ?? ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })()}

            {!ibkrAccount && ibkrStatus === "idle" && (
              <div className="text-[11px] text-slate-400">
                Premi "Load" per recuperare i dati dall'account IBKR.
              </div>
            )}
          </div>

        </div>
      )}
      {activeTab === "allocationSetting" && (
        <div className="mt-4 flex-1 min-h-0 overflow-y-auto space-y-4 pb-[5px]">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Allocation Formula Variables</div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                title="Apri guida allocation"
                aria-label="Apri guida allocation"
                onClick={() => window.open(allocationHelpUrl, "_blank", "noopener,noreferrer")}
              >
                <AppIcon icon="mdi:help-circle-outline" className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!allocationConfig) await loadAllocationConfig();
                  setAllocationModalOpen(true);
                }}
                disabled={configStatus === "loading"}
                className="inline-flex items-center justify-center rounded-md bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {configStatus === "loading" ? "Loading..." : "Allocation Settings"}
              </button>
            </div>
          </div>

          {/* ── Liquidity Manager ── */}
          {(() => {
            const ld = liquidityData;

            // Risk regime color
            const regimeColor =
              ld?.riskRegime === "OFF" || ld?.riskRegime === "RISK_OFF"
                ? "text-rose-600"
                : ld?.riskRegime === "ON" || ld?.riskRegime === "RISK_ON"
                  ? "text-emerald-600"
                  : "text-amber-500";

            // Score interpretation: 0=bad (invest little), 100=good (invest more)
            const scoreTone =
              !ld ? "text-slate-300"
              : ld.score >= 70 ? "text-emerald-600"
              : ld.score >= 40 ? "text-amber-500"
              : "text-rose-600";

            return (
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Liquidity Manager</div>
                    <div className="mt-0.5 text-[10px] text-slate-400">
                      Score alto = più investimento · Score basso = più cash riservata
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={loadLiquidityData}
                    disabled={liquidityStatus === "loading"}
                    className="inline-flex shrink-0 items-center justify-center rounded-md bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                  >
                    {liquidityStatus === "loading" ? "Loading..." : "Load"}
                  </button>
                </div>

                {liquidityError && (
                  <div className="mb-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">{liquidityError}</div>
                )}

                {!ld && liquidityStatus === "idle" && (
                  <div className="text-[11px] text-slate-400">Premi "Load" per recuperare i dati dal Liquidity Manager.</div>
                )}

                {ld && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {/* Score */}
                    <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-3">
                      <div className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">Score</div>
                      <div className={`mt-1 text-[22px] font-bold tabular-nums leading-none ${scoreTone}`}>
                        {ld.score?.toFixed(1) ?? "–"}
                      </div>
                      <div className="mt-1 text-[9px] text-slate-400">0 = pessimo · 100 = ottimo</div>
                      {/* Score bar */}
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            ld.score >= 70 ? "bg-emerald-500" : ld.score >= 40 ? "bg-amber-400" : "bg-rose-500"
                          }`}
                          style={{ width: `${Math.max(0, Math.min(100, ld.score ?? 0))}%` }}
                        />
                      </div>
                    </div>

                    {/* Risk Regime */}
                    <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-3">
                      <div className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">Risk Regime</div>
                      <div className={`mt-1 text-[15px] font-bold leading-tight ${regimeColor}`}>
                        {ld.riskRegime ?? "–"}
                      </div>
                      <div className="mt-1 text-[9px] text-slate-400">
                        {ld.riskRegime === "OFF" || ld.riskRegime === "RISK_OFF"
                          ? `Aggiunge +${allocationConfig?.RISK_OFF_ADD_PCT != null ? (allocationConfig.RISK_OFF_ADD_PCT * 100).toFixed(0) : "?"}% alla riserva`
                          : "Nessun aggiustamento risk-off"}
                      </div>
                    </div>

                    {/* Volatility */}
                    <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-3">
                      <div className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">Volatility</div>
                      <div className="mt-1 text-[15px] font-bold tabular-nums text-slate-800">
                        {ld.volatility == null
                          ? "–"
                          : typeof ld.volatility === "number"
                            ? ld.volatility.toFixed(2)
                            : String(ld.volatility)}
                      </div>
                      <div className="mt-1 text-[9px] text-slate-400">
                        {typeof ld.volatility === "number"
                          ? `vol / ${allocationConfig?.VOL_SCALE ?? "?"} → cash adj`
                          : "regime qualitativo"}
                      </div>
                    </div>

                    {/* Confidence */}
                    <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-3">
                      <div className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">Confidence</div>
                      <div className={`mt-1 text-[15px] font-bold tabular-nums ${
                        ld.confidence >= 0.75 ? "text-emerald-600"
                        : ld.confidence >= 0.50 ? "text-amber-500"
                        : ld.confidence >= 0.25 ? "text-orange-500"
                        : "text-rose-600"
                      }`}>
                        {ld.confidence?.toFixed(2) ?? "–"}
                      </div>
                      <div className="mt-1 text-[9px] text-slate-400">
                        soglia: {allocationConfig?.CONFIDENCE_THRESHOLD ?? "–"} · {
                          ld.confidence >= (allocationConfig?.CONFIDENCE_THRESHOLD ?? 0.69)
                            ? "usa score"
                            : `usa fallback ${allocationConfig?.FALLBACK_RESERVED_CASH_PCT != null ? (allocationConfig.FALLBACK_RESERVED_CASH_PCT * 100).toFixed(0) + "%" : ""}`
                        }
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ── Cash Allocation Bar ── */}
          {(() => {
            const s = ibkrAccount?.summary as Record<string, IbkrSummaryField> | undefined;
            const getAmt = (field: IbkrSummaryField): number => {
              if (field == null) return 0;
              if (typeof field === "number") return field;
              return typeof (field as any)?.amount === "number" ? (field as any).amount : 0;
            };

            const netLiquidation     = s ? getAmt(s.netliquidation ?? s.NetLiquidation) : 0;
            const totalCashValue     = s ? getAmt(s.totalcashvalue ?? s.TotalCashValue) : 0;
            const grossPositionValue = s ? getAmt(s.grosspositionvalue ?? s.GrossPositionValue) || undefined : undefined;
            const availableFunds     = s ? getAmt(s.availablefunds ?? s.AvailableFunds) : 0;
            const activeOrdersCash   = ibkrOrders
              .filter(o => o.status === "WORKING")
              .reduce((sum, o) => sum + Number(o.limitPrice ?? 0) * Number(o.quantity ?? 0), 0);

            return (
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Cash Allocation</div>
                    <div className="mt-0.5 text-[10px] text-slate-400">
                      {ibkrAccount ? `Account: ${ibkrAccountId ?? "–"}` : "Carica i dati IBKR per visualizzare la barra"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {netLiquidation > 0 && (
                      <button
                        type="button"
                        onClick={() => setMaxInvestment(netLiquidation)}
                        className="inline-flex shrink-0 items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-[11px] font-semibold text-white hover:bg-blue-700"
                      >
                        Set MAX Equity
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={loadIbkrAccount}
                      disabled={ibkrStatus === "loading"}
                      className="inline-flex shrink-0 items-center justify-center rounded-md bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                    >
                      {ibkrStatus === "loading" ? "Loading..." : "Load IBKR"}
                    </button>
                  </div>
                </div>

                {ibkrError && (
                  <div className="mb-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">{ibkrError}</div>
                )}

                {!ibkrAccount && ibkrStatus === "idle" && (
                  <div className="text-[11px] text-slate-400">
                    Premi "Load IBKR" per visualizzare la barra di allocazione.
                  </div>
                )}

                {ibkrAccount && netLiquidation > 0 && (() => {
                  const ibkrMarginTop   = Math.max(availableFunds - totalCashValue, 0);
                  const openPositions   = grossPositionValue != null
                    ? grossPositionValue
                    : Math.max(netLiquidation - totalCashValue, 0);
                  const reservedCash    = Math.min(Math.max(activeOrdersCash, 0), totalCashValue);
                  const residualCash    = Math.max(totalCashValue - reservedCash, 0);
                  const totalCapacity   = netLiquidation + ibkrMarginTop;
                  const effectiveMaxInv = maxInvestment ?? netLiquidation;

                  // ── CASH_TO_INVEST / CASH_TO_SAVE ───────────────────────────
                  // Simple direct mapping: score% of MAX_INVESTMENT → invest, rest → save.
                  // score=71.6 → invest 71.6%, save 28.4%. No liquidity data → 0% invest.
                  const scorePct    = liquidityData ? Math.max(0, Math.min(100, liquidityData.score)) / 100 : 0;
                  const cashToInvest = Math.round(effectiveMaxInv * scorePct * 100) / 100;
                  const cashToSave   = Math.round((effectiveMaxInv - cashToInvest) * 100) / 100;

                  const residualCashToInvest = cashToInvest - openPositions - activeOrdersCash;

                  const rows: { label: string; value: number; color: string; sublabel?: string }[] = [
                    { label: "Equity",                   value: netLiquidation,      color: "text-blue-600",   sublabel: "netLiquidation" },
                    { label: "Total Capacity",           value: totalCapacity,       color: "text-slate-800",  sublabel: "equity + IBKR margin" },
                    { label: "Open Positions",           value: openPositions,       color: "text-blue-500",   sublabel: "grossPositionValue" },
                    { label: "Active Orders",            value: reservedCash,        color: "text-violet-600", sublabel: "reserved cash for orders" },
                    { label: "Residual Cash",            value: residualCash,        color: "text-emerald-600",sublabel: "free cash" },
                    { label: "IBKR Margin",              value: ibkrMarginTop,       color: "text-violet-500", sublabel: "margin on top" },
                    { label: "MAX_INVESTMENT",           value: effectiveMaxInv,     color: "text-amber-600",  sublabel: "Capitale massimo per investimento" },
                    { label: "CASH_TO_INVEST",           value: cashToInvest,        color: "text-green-600",  sublabel: "Capitale massimo da investire tenuto conto della liquidità di mercato" },
                    { label: "CASH_TO_SAVE",             value: cashToSave,          color: "text-rose-500",   sublabel: "Capitale da tenere liquido" },
                    { label: "RESIDUAL_CASH_TO_INVEST",  value: residualCashToInvest,color: residualCashToInvest >= 0 ? "text-green-700" : "text-rose-600", sublabel: "Capitale residuo per investimenti" },
                    { label: "MAX_TICKER",   value: (allocationConfig?.MAX_PERC_TICKER   ?? 0) * effectiveMaxInv, color: "text-slate-500", sublabel: allocationConfig?.MAX_PERC_TICKER   != null ? `${(allocationConfig.MAX_PERC_TICKER   * 100).toFixed(0)}% di MAX_INV` : "—" },
                    { label: "MAX_SECTOR",   value: (allocationConfig?.MAX_PERC_SECTOR   ?? 0) * effectiveMaxInv, color: "text-slate-500", sublabel: allocationConfig?.MAX_PERC_SECTOR   != null ? `${(allocationConfig.MAX_PERC_SECTOR   * 100).toFixed(0)}% di MAX_INV` : "—" },
                    { label: "MAX_INDUSTRY", value: (allocationConfig?.MAX_PERC_INDUSTRY ?? 0) * effectiveMaxInv, color: "text-slate-500", sublabel: allocationConfig?.MAX_PERC_INDUSTRY != null ? `${(allocationConfig.MAX_PERC_INDUSTRY * 100).toFixed(0)}% di MAX_INV` : "—" },
                    { label: "MAX_AREA",     value: (allocationConfig?.MAX_PERC_AREA     ?? 0) * effectiveMaxInv, color: "text-slate-500", sublabel: allocationConfig?.MAX_PERC_AREA     != null ? `${(allocationConfig.MAX_PERC_AREA     * 100).toFixed(0)}% di MAX_INV` : "—" },
                  ];

                  return (
                    <>
                      <AccountCapacityBar
                        netLiquidation={netLiquidation}
                        totalCashValue={totalCashValue}
                        grossPositionValue={grossPositionValue}
                        availableFunds={availableFunds}
                        activeOrdersCash={activeOrdersCash}
                        maxInvestment={effectiveMaxInv}
                        onMaxInvestmentChange={setMaxInvestment}
                      />
                      <table className="mt-4 w-full text-left text-[11px]">
                        <thead>
                          <tr className="border-b border-slate-100">
                            <th className="pb-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Campo</th>
                            <th className="pb-1.5 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-400">Valore</th>
                            <th className="pb-1.5 pl-3 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Note</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map(({ label, value, color, sublabel }) => (
                            <tr key={label} className="border-b border-slate-50">
                              <td className="py-1.5 font-semibold text-slate-700">{label}</td>
                              <td className={`py-1.5 text-right tabular-nums font-semibold ${color}`}>
                                {value.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}
                              </td>
                              <td className="py-1.5 pl-3 text-slate-400">{sublabel}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  );
                })()}
              </div>
            );
          })()}

          {/* ── Positions by Category ── */}
          {(ibkrPositions.length > 0 || ibkrOrders.some(o => (o.side ?? "").toUpperCase() === "BUY")) && (() => {
            // Per-ticker aggregation: open positions + active BUY orders
            const tickerData: Record<string, { posValue: number; orderValue: number }> = {};
            for (const pos of ibkrPositions) {
              const t = (pos.symbol ?? "").toUpperCase();
              if (!t) continue;
              if (!tickerData[t]) tickerData[t] = { posValue: 0, orderValue: 0 };
              tickerData[t].posValue += Number(pos.marketValue ?? 0);
            }
            for (const ord of ibkrOrders) {
              if ((ord.side ?? "").toUpperCase() !== "BUY") continue;
              const t = (ord.symbol ?? "").toUpperCase();
              if (!t) continue;
              if (!tickerData[t]) tickerData[t] = { posValue: 0, orderValue: 0 };
              tickerData[t].orderValue += Number(ord.limitPrice ?? 0) * Number(ord.quantity ?? 0);
            }
            const grandTotal = Object.values(tickerData).reduce((s, v) => s + v.posValue + v.orderValue, 0);

            // Group by SECTOR, INDUSTRY, AREA — local fallback when no backend snapshot
            const localBySector:   Record<string, number> = {};
            const localByIndustry: Record<string, number> = {};
            const localByArea:     Record<string, number> = {};
            for (const [ticker, { posValue, orderValue }] of Object.entries(tickerData)) {
              const fund  = fundamentalsMap[ticker];
              const total = posValue + orderValue;
              const sector   = fund?.sector   || "–";
              const industry = fund?.industry || "–";
              const area     = fund?.country  ? countryToArea(fund.country) : "–";
              localBySector[sector]     = (localBySector[sector]   ?? 0) + total;
              localByIndustry[industry] = (localByIndustry[industry] ?? 0) + total;
              localByArea[area]         = (localByArea[area]         ?? 0) + total;
            }
            // Prefer server-side snapshot (includes open BUY orders via ibkr-bridge).
            // Fall back to local computation if the snapshot is absent or has no entries
            // (empty object {} is truthy — must check length explicitly).
            const hasSnap = (m?: Record<string, number>) => m != null && Object.keys(m).length > 0;
            const bySector   = hasSnap(exposureSnapshot?.sector)   ? exposureSnapshot!.sector   : localBySector;
            const byIndustry = hasSnap(exposureSnapshot?.industry) ? exposureSnapshot!.industry : localByIndustry;
            const byArea     = hasSnap(exposureSnapshot?.area)     ? exposureSnapshot!.area     : localByArea;
            const sortedEntries = (map: Record<string, number>) =>
              Object.entries(map).sort(([, a], [, b]) => b - a);

            // Residual for limit comparison (same formula as cash allocation section)
            const s2 = ibkrAccount?.summary as Record<string, IbkrSummaryField> | undefined;
            const ga = (f: IbkrSummaryField): number => {
              if (f == null) return 0;
              if (typeof f === "number") return f;
              return typeof (f as any)?.amount === "number" ? (f as any).amount : 0;
            };
            const netLiq2   = s2 ? ga(s2.netliquidation ?? s2.NetLiquidation) : 0;
            const cash2     = s2 ? ga(s2.totalcashvalue ?? s2.TotalCashValue) : 0;
            const gross2    = s2 ? ga(s2.grosspositionvalue ?? s2.GrossPositionValue) || undefined : undefined;
            const ordCash2  = ibkrOrders.reduce((sum, o) => sum + Number(o.limitPrice ?? 0) * Number(o.quantity ?? 0), 0);
            const openPos2  = gross2 != null ? gross2 : Math.max(netLiq2 - cash2, 0);
            const resCash2  = Math.min(Math.max(ordCash2, 0), cash2);
            const effMax2   = maxInvestment ?? netLiq2;
            const score2    = liquidityData ? Math.max(0, Math.min(100, liquidityData.score)) / 100 : 0;
            const cti2      = Math.round(effMax2 * score2 * 100) / 100;
            const residual2 = Math.max(0, cti2 - openPos2 - resCash2);

            const renderGroupTable = (
              entries: [string, number][],
              maxPct: number | undefined,
              label: string
            ) => (
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</div>
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-1.5 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">Nome</th>
                      <th className="pb-1.5 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-400">Valore</th>
                      <th className="pb-1.5 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-400">% Tot</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map(([name, value]) => {
                      const pct           = grandTotal > 0 ? value / grandTotal : 0;
                      const pctOfResidual = residual2 > 0 ? value / residual2 : 0;
                      const isOver        = maxPct != null && pctOfResidual > maxPct;
                      return (
                        <tr key={name} className="border-b border-slate-50">
                          <td className={`py-1.5 font-semibold ${isOver ? "text-rose-600" : "text-slate-700"}`}>
                            {name}
                            {isOver && maxPct != null && (
                              <span className="ml-1 text-[9px] font-normal text-rose-400">⚠ max {(maxPct * 100).toFixed(0)}%</span>
                            )}
                          </td>
                          <td className={`py-1.5 text-right tabular-nums ${isOver ? "text-rose-600" : "text-slate-700"}`}>{formatMoney(value)}</td>
                          <td className="py-1.5 text-right tabular-nums text-slate-500">{(pct * 100).toFixed(1)}%</td>
                        </tr>
                      );
                    })}
                    <tr className="border-t border-slate-200">
                      <td className="pt-1.5 font-bold text-slate-600">Totale</td>
                      <td className="pt-1.5 text-right tabular-nums font-bold text-slate-600">{formatMoney(grandTotal)}</td>
                      <td className="pt-1.5 text-right tabular-nums text-slate-400">100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );

            const tickerEntries = Object.entries(tickerData)
              .sort(([, a], [, b]) => (b.posValue + b.orderValue) - (a.posValue + a.orderValue));
            const buyOrderCount = ibkrOrders.filter(o => (o.side ?? "").toUpperCase() === "BUY").length;

            return (
              <div className="space-y-4">
                {/* TICKER table — full width */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Positions by Category</div>
                      <div className="mt-0.5 text-[10px] text-slate-400">
                        {fundamentalsLoading
                          ? "Caricamento fondamentali…"
                          : `${ibkrPositions.length} posizioni · ${buyOrderCount} ordini BUY · ${Object.keys(fundamentalsMap).length} fondamentali · ${formatMoney(grandTotal)} totale`}
                      </div>
                      {exposureSnapshot?.computedAt && (
                        <div className="mt-0.5 text-[10px] text-emerald-600">
                          Exposure snapshot: {formatDate(exposureSnapshot.computedAt)}
                          {exposureSnapshot.positionCount != null && ` · ${exposureSnapshot.positionCount} pos · ${exposureSnapshot.orderCount} orders`}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={refreshExposure}
                        disabled={exposureRefreshing}
                        className="inline-flex shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                      >
                        {exposureRefreshing ? "..." : "Refresh Exposure"}
                      </button>
                      <button
                        type="button"
                        onClick={() => loadPositionFundamentals(ibkrPositions, ibkrOrders)}
                        disabled={fundamentalsLoading}
                        className="inline-flex shrink-0 items-center justify-center rounded-md bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                      >
                        {fundamentalsLoading ? "Loading..." : "Refresh"}
                      </button>
                    </div>
                  </div>
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="pb-1.5 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">Ticker</th>
                        <th className="pb-1.5 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-400">Posizione</th>
                        <th className="pb-1.5 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-400">Ordini BUY</th>
                        <th className="pb-1.5 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-400">Totale</th>
                        <th className="pb-1.5 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-400">% Tot</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickerEntries.map(([ticker, { posValue, orderValue }]) => {
                        const total         = posValue + orderValue;
                        const pct           = grandTotal > 0 ? total / grandTotal : 0;
                        const pctOfResidual = residual2 > 0 ? total / residual2 : 0;
                        const maxPct        = allocationConfig?.MAX_PERC_TICKER;
                        const isOver        = maxPct != null && pctOfResidual > maxPct;
                        return (
                          <tr key={ticker} className="border-b border-slate-50">
                            <td className={`py-1.5 font-mono font-bold ${isOver ? "text-rose-600" : "text-slate-800"}`}>
                              {ticker}
                              {isOver && maxPct != null && (
                                <span className="ml-1 text-[9px] font-normal text-rose-400">⚠ max {(maxPct * 100).toFixed(0)}%</span>
                              )}
                            </td>
                            <td className="py-1.5 text-right tabular-nums text-slate-600">{posValue > 0 ? formatMoney(posValue) : "—"}</td>
                            <td className="py-1.5 text-right tabular-nums text-violet-600">{orderValue > 0 ? formatMoney(orderValue) : "—"}</td>
                            <td className={`py-1.5 text-right tabular-nums font-semibold ${isOver ? "text-rose-600" : "text-slate-700"}`}>{formatMoney(total)}</td>
                            <td className="py-1.5 text-right tabular-nums text-slate-500">{(pct * 100).toFixed(1)}%</td>
                          </tr>
                        );
                      })}
                      <tr className="border-t border-slate-200">
                        <td className="pt-1.5 font-bold text-slate-600" colSpan={3}>Totale</td>
                        <td className="pt-1.5 text-right tabular-nums font-bold text-slate-600">{formatMoney(grandTotal)}</td>
                        <td className="pt-1.5 text-right tabular-nums text-slate-400">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* SECTOR · INDUSTRY · AREA — 3-column grid */}
                <div className="grid gap-4 sm:grid-cols-3">
                  {renderGroupTable(sortedEntries(bySector),   allocationConfig?.MAX_PERC_SECTOR,   "Settore")}
                  {renderGroupTable(sortedEntries(byIndustry), allocationConfig?.MAX_PERC_INDUSTRY, "Industry")}
                  {renderGroupTable(sortedEntries(byArea),     allocationConfig?.MAX_PERC_AREA,     "Area")}
                </div>
              </div>
            );
          })()}

        </div>
      )}

      {/* ── Allocation Settings Modal ── */}
      {allocationModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setAllocationModalOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-50 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-base font-semibold text-slate-900">Allocation Settings</div>
                <div className="mt-0.5 text-[11px] text-slate-400">Configura le variabili di allocazione del Capital Manager</div>
              </div>
              <button
                type="button"
                onClick={() => setAllocationModalOpen(false)}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {configError && (
              <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">
                {configError}
              </div>
            )}

            {!allocationConfig && configStatus !== "loading" && (
              <div className="text-[11px] text-slate-400">
                Caricamento configurazione in corso…
              </div>
            )}

            {allocationConfig && (() => {
              type SliderCfg = { min: number; max: number; step: number; fmt: (v: number) => string; default_: string };
              const ITEMS: { name: keyof AllocationConfig; description: string; cfg: SliderCfg }[] = [
                { name: "CONFIDENCE_THRESHOLD",       description: "Soglia minima di confidence (0–100). Sotto questa soglia si usa il fallback.",                    cfg: { min: 0,  max: 100,  step: 1,    fmt: (v) => String(v),        default_: "69"   } },
                { name: "FALLBACK_RESERVED_CASH_PCT", description: "Percentuale di cash riservata quando confidence < soglia (fallback conservativo).",               cfg: { min: 0,  max: 1,    step: 0.01, fmt: (v) => formatPct(v),     default_: "60%"  } },
                { name: "SCORE_RESERVED_MIN",         description: "Percentuale di cash riservata minima (score = 100, condizioni ottimali).",                        cfg: { min: 0,  max: 1,    step: 0.01, fmt: (v) => formatPct(v),     default_: "20%"  } },
                { name: "SCORE_RESERVED_MAX",         description: "Percentuale di cash riservata massima (score = 0, condizioni pessime).",                          cfg: { min: 0,  max: 1,    step: 0.01, fmt: (v) => formatPct(v),     default_: "70%"  } },
                { name: "RISK_OFF_ADD_PCT",           description: "Aggiustamento addizionale al reserved cash quando il regime è RISK_OFF.",                        cfg: { min: 0,  max: 0.5,  step: 0.01, fmt: (v) => formatPct(v),     default_: "10%"  } },
                { name: "VOL_ADD_MAX_PCT",            description: "Aggiustamento massimo addizionale legato alla volatilità.",                                       cfg: { min: 0,  max: 0.5,  step: 0.01, fmt: (v) => formatPct(v),     default_: "10%"  } },
                { name: "VOL_SCALE",                  description: "Fattore di scala per la volatilità (volatility / VOL_SCALE, clamped a VOL_ADD_MAX_PCT).",        cfg: { min: 1,  max: 500,  step: 1,    fmt: (v) => String(v),        default_: "100"  } },
                { name: "MIN_ORDER_NOTIONAL",         description: "Notional minimo per un ordine. Quote inferiori restituiscono INSUFFICIENT_CAPITAL.",              cfg: { min: 10, max: 5000, step: 10,   fmt: (v) => formatMoney(v),   default_: "$50"  } },
                { name: "RESERVATION_TTL_SEC",        description: "TTL delle prenotazioni in Redis. Scadute automaticamente dopo N secondi.",                       cfg: { min: 30, max: 3600, step: 30,   fmt: (v) => `${v}s`,          default_: "180s" } },
                { name: "MAX_PERC_TICKER",            description: "Percentuale massima da investire su un singolo ticker.",                                           cfg: { min: 0,  max: 1,    step: 0.01, fmt: (v) => formatPct(v),     default_: "10%"  } },
                { name: "MAX_PERC_SECTOR",            description: "Percentuale massima da investire in un singolo settore.",                                          cfg: { min: 0,  max: 1,    step: 0.01, fmt: (v) => formatPct(v),     default_: "40%"  } },
                { name: "MAX_PERC_INDUSTRY",          description: "Percentuale massima da investire in una singola industry.",                                        cfg: { min: 0,  max: 1,    step: 0.01, fmt: (v) => formatPct(v),     default_: "30%"  } },
                { name: "MAX_PERC_AREA",              description: "Percentuale massima da investire in una singola area geografica.",                                 cfg: { min: 0,  max: 1,    step: 0.01, fmt: (v) => formatPct(v),     default_: "50%"  } },
              ];

              return (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {ITEMS.map(({ name, description, cfg }) => {
                    const saved = allocationConfig[name] ?? cfg.min;
                    const draft = draftValues[name] ?? (saved as number);
                    const pct = Math.max(0, Math.min(100, ((draft - cfg.min) / (cfg.max - cfg.min)) * 100));
                    const isDirty = name in draftValues && draft !== saved;
                    const status = saveStatus[name];

                    return (
                      <div key={name} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="mb-0.5 flex items-start justify-between gap-2">
                          <span className="font-mono text-[10px] font-bold text-slate-700 leading-tight">{name}</span>
                          <span className="text-[13px] font-bold text-slate-900 tabular-nums shrink-0">{cfg.fmt(draft)}</span>
                        </div>
                        <p className="mb-3 text-[9px] leading-relaxed text-slate-400">{description}</p>

                        <div className="relative mb-1 h-5 flex items-center">
                          <div className="h-1.5 w-full rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-slate-800 transition-all duration-75"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <input
                            type="range"
                            min={cfg.min}
                            max={cfg.max}
                            step={cfg.step}
                            value={draft}
                            onChange={(e) =>
                              setDraftValues((prev) => ({ ...prev, [name]: parseFloat(e.target.value) }))
                            }
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                          />
                        </div>

                        <div className="mb-3 flex justify-between text-[9px] text-slate-300">
                          <span>{cfg.fmt(cfg.min)}</span>
                          <span className="text-[9px] text-slate-400">default: {cfg.default_}</span>
                          <span>{cfg.fmt(cfg.max)}</span>
                        </div>

                        <div className="flex items-center justify-end gap-2 min-h-[24px]">
                          {status === "ok" && !isDirty && (
                            <span className="text-[10px] font-semibold text-emerald-600">Saved ✓</span>
                          )}
                          {status === "error" && (
                            <span className="text-[10px] font-semibold text-rose-600">Error</span>
                          )}
                          {isDirty && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  setDraftValues((prev) => { const n = { ...prev }; delete n[name]; return n; })
                                }
                                className="rounded bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500 hover:bg-slate-200"
                              >
                                Reset
                              </button>
                              <button
                                type="button"
                                onClick={() => saveAllocationSetting(name, draft)}
                                disabled={status === "saving"}
                                className="rounded bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
                              >
                                {status === "saving" ? "Saving..." : "Save"}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* Modal footer */}
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setAllocationModalOpen(false)}
                className="rounded-md bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white hover:bg-slate-700"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
