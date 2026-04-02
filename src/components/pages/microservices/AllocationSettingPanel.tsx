import { useCallback, useEffect, useMemo, useState } from "react";
import AccountCapacityBar from "../../molecules/AccountCapacityBar";
import AppIcon from "../../atoms/icon/AppIcon";
import { env } from "../../../config/env";
import { countryToArea } from "../../../utils/geoUtils";

type IbkrSummaryField = { amount?: number; currency?: string; isNull?: boolean } | number | null | undefined;

type IbkrAccountData = {
  accountId?: string;
  summary?: Record<string, IbkrSummaryField>;
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
  [key: string]: unknown;
};

type IbkrPosition = {
  broker?: string;
  accountId?: string;
  symbol?: string;
  quantity?: number;
  marketValue?: number;
  [key: string]: unknown;
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

export default function AllocationSettingPanel() {
  const allocationHelpUrl = `${env.helpBase}/docs/utente/servizi-a-supporto/capital-manager-allocazione`;

  // --- Allocation Setting section ---
  const [configStatus, setConfigStatus] = useState<Status>("idle");
  const [configError, setConfigError] = useState<string | null>(null);
  const [allocationConfig, setAllocationConfig] = useState<AllocationConfig | null>(null);
  const [draftValues, setDraftValues] = useState<Record<string, number>>({});
  const [saveStatus, setSaveStatus] = useState<Record<string, "saving" | "ok" | "error">>({});
  const [maxInvestment, setMaxInvestment] = useState<number | null>(null);
  const [cashToSaveFromLimits, setCashToSaveFromLimits] = useState<number | null>(null);
  const [maxInvestmentLoaded, setMaxInvestmentLoaded] = useState(false);

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
  const [liquidityDetailOpen, setLiquidityDetailOpen] = useState(false);
  const [liquidityDetailRow, setLiquidityDetailRow] = useState<Record<string, unknown> | null>(null);
  const [liquidityDetailLoading, setLiquidityDetailLoading] = useState(false);
  const [liquidityDetailError, setLiquidityDetailError] = useState<string | null>(null);

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
    timestamp?: string;
    cacheMeta?: { cachedAt?: string };
  } | null>(null);

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

  // Effective max investment
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

  // Debounced save of MAX_INVESTMENT when user changes it via slider.
  // Only persists the user-chosen ceiling — cashToSave is computed server-side.
  useEffect(() => {
    if (!maxInvestmentLoaded || maxInvestment == null) return;
    const t = setTimeout(() => {
      fetch(`${env.apiBaseUrl}/capital-manager/allocation/limits`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ maxInvestment }),
      }).catch(() => {});
    }, 1500);
    return () => clearTimeout(t);
  }, [maxInvestmentLoaded, maxInvestment, headers]);

  // Load MAX_INVESTMENT and server-computed cashToSave on mount.
  useEffect(() => {
    fetch(`${env.apiBaseUrl}/capital-manager/allocation/limits`, { headers })
      .then((r) => r.json())
      .then((data) => {
        const d = data?.data ?? data;
        if (d?.maxInvestment != null) setMaxInvestment(Number(d.maxInvestment));
        else if (d?.MAX_INVESTMENT != null) setMaxInvestment(Number(d.MAX_INVESTMENT));
        if (d?.cashToSave != null) setCashToSaveFromLimits(Number(d.cashToSave));
      })
      .catch(() => {})
      .finally(() => setMaxInvestmentLoaded(true));
  }, [headers]);

  // Push fundamentalsMap to capital-manager Redis whenever it updates.
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

  const loadIbkrAccount = useCallback(async () => {
    setIbkrStatus("loading");
    setIbkrError(null);
    try {
      // Auto-load allocationConfig if not already available
      if (!allocationConfig) {
        try {
          const cfgRes = await fetch(`${env.apiBaseUrl}/capital-manager/allocation/config`, { headers });
          const cfgData = await cfgRes.json().catch(() => ({}));
          if (cfgRes.ok && cfgData?.ok !== false) {
            setAllocationConfig(cfgData?.config ?? cfgData);
            setConfigStatus("idle");
          }
        } catch { /* best-effort */ }
      }

      const accountsRes = await fetch(`${env.apiBaseUrl}/ibkr-bridge/mirror/portfolio/accounts`, { headers });
      const accountsData = await accountsRes.json().catch(() => []);
      const accounts = Array.isArray(accountsData) ? accountsData : (Array.isArray(accountsData?.data) ? accountsData.data : []);
      if (!accounts.length) throw new Error("Nessun account IBKR trovato");
      const accountId = String(accounts[0]?.accountId ?? accounts[0]?.id ?? accounts[0]?.acctId ?? "");
      if (!accountId) throw new Error("accountId mancante dalla risposta di IBKR");
      setIbkrAccountId(accountId);

      const accountRes = await fetch(
        `${env.apiBaseUrl}/ibkr-bridge/account?accountId=${encodeURIComponent(accountId)}`,
        { headers }
      );
      const accountData = await accountRes.json().catch(() => ({}));
      if (!accountRes.ok) throw new Error(accountData?.error || "Errore caricamento account");
      setIbkrAccount(accountData as IbkrAccountData);

      const ordersRes = await fetch(`${env.apiBaseUrl}/broker-executor-ibkr/orders`, { headers });
      const ordersData = await ordersRes.json().catch(() => ({}));
      const orders: IbkrOrder[] = Array.isArray(ordersData?.items)
        ? ordersData.items
        : Array.isArray(ordersData)
          ? ordersData
          : [];
      setIbkrOrders(orders);

      const posRes = await fetch(`${env.apiBaseUrl}/broker-executor-ibkr/positions`, { headers });
      const posData = await posRes.json().catch(() => ({}));
      const positions: IbkrPosition[] = Array.isArray(posData?.items)
        ? posData.items
        : Array.isArray(posData)
          ? posData
          : [];
      setIbkrPositions(positions);
      setIbkrStatus("idle");

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
      const payload = data?.score != null ? data : data?.data ?? data;
      // Prefer EMA-smoothed score over raw score (same logic as backend decisionEngine)
      if (Number.isFinite(payload.score_ema)) payload.score = payload.score_ema;
      // volatilityRegime (LOW/MEDIUM/HIGH) is always present; use it as fallback when volatility is absent
      if (payload.volatility == null && payload.volatilityRegime != null) {
        payload.volatility = payload.volatilityRegime;
      }
      setLiquidityData(payload);
      setLiquidityStatus("idle");
    } catch (err: any) {
      setLiquidityStatus("error");
      setLiquidityError(err?.message || "Errore caricamento liquidità");
    }
  }, [headers]);

  const openLiquidityDetail = useCallback(async () => {
    setLiquidityDetailOpen(true);
    if (liquidityDetailRow) return;
    setLiquidityDetailLoading(true);
    setLiquidityDetailError(null);
    try {
      const res = await fetch(`${env.apiBaseUrl}/datahub/api/table/liquidity_daily_scores?limit=1&sort_by=calculated_at&sort_dir=desc`, { headers });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error?.message || data?.error || `HTTP ${res.status}`);
      const rows = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
      if (!rows.length) throw new Error("Nessun record trovato in liquidity_daily_scores");
      setLiquidityDetailRow(rows[0]);
    } catch (err: any) {
      setLiquidityDetailError(err?.message || String(err));
    } finally {
      setLiquidityDetailLoading(false);
    }
  }, [headers, liquidityDetailRow]);

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

  // Auto-load on mount
  useEffect(() => {
    if (!liquidityData && liquidityStatus === "idle") loadLiquidityData();
    if (!ibkrAccount && ibkrStatus === "idle") loadIbkrAccount();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
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

        const regimeColor =
          ld?.riskRegime === "OFF" || ld?.riskRegime === "RISK_OFF"
            ? "text-rose-600"
            : ld?.riskRegime === "ON" || ld?.riskRegime === "RISK_ON"
              ? "text-emerald-600"
              : "text-amber-500";

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
                <div className="mt-0.5 text-[10px] text-slate-400">
                  Ultimo calcolo: {formatDate(ld?.timestamp ?? ld?.ts ?? ld?.cacheMeta?.cachedAt)}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={openLiquidityDetail}
                  title="Dettagli ultimo run"
                  className="inline-flex items-center justify-center rounded-full w-7 h-7 border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 text-[13px] font-bold"
                >
                  i
                </button>
                <button
                  type="button"
                  onClick={loadLiquidityData}
                  disabled={liquidityStatus === "loading"}
                  className="inline-flex shrink-0 items-center justify-center rounded-md bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {liquidityStatus === "loading" ? "Loading..." : "Load"}
                </button>
              </div>
            </div>

            {liquidityError && (
              <div className="mb-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">{liquidityError}</div>
            )}

            {!ld && liquidityStatus === "idle" && (
              <div className="text-[11px] text-slate-400">Premi "Load" per recuperare i dati dal Liquidity Manager.</div>
            )}

            {ld && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {/* Score */}
                <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-3">
                  <div className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">Score</div>
                  <div className={`mt-1 text-[22px] font-bold tabular-nums leading-none ${scoreTone}`}>
                    {ld.score?.toFixed(1) ?? "–"}
                  </div>
                  <div className="mt-1 text-[9px] text-slate-400">0 = pessimo · 100 = ottimo</div>
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

                {/* Cash da tenere */}
                <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-3">
                  <div className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">Cash da tenere</div>
                  <div className="mt-1 text-[15px] font-bold tabular-nums text-rose-600">
                    {(() => {
                      if (typeof cashToSaveFromLimits === "number" && Number.isFinite(cashToSaveFromLimits)) {
                        return cashToSaveFromLimits.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 2,
                        });
                      }
                      const effMax = Number(effectiveMaxInvestment);
                      const score = Number(ld?.score);
                      if (Number.isFinite(effMax) && Number.isFinite(score)) {
                        const scorePct = Math.max(0, Math.min(100, score)) / 100;
                        const computed = Math.max(0, effMax - effMax * scorePct);
                        return computed.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 2,
                        });
                      }
                      return "–";
                    })()}
                  </div>
                  <div className="mt-1 text-[9px] text-slate-400">
                    CASH_TO_SAVE (Redis) o fallback da MAX_INVESTMENT
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

              const scorePct    = liquidityData ? Math.max(0, Math.min(100, liquidityData.score)) / 100 : 0;
              const cashToInvest = Math.round(effectiveMaxInv * scorePct * 100) / 100;
              const cashToSave   = Math.round((effectiveMaxInv - cashToInvest) * 100) / 100;

              const residualCashToInvestLocal = cashToInvest - openPositions - activeOrdersCash;

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
                { label: "RESIDUAL_CASH_TO_INVEST",  value: residualCashToInvestLocal, color: residualCashToInvestLocal >= 0 ? "text-green-700" : "text-rose-600", sublabel: "Capitale residuo per investimenti" },
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

        const hasSnap = (m?: Record<string, number>) => m != null && Object.keys(m).length > 0;
        const bySector   = hasSnap(exposureSnapshot?.sector)   ? exposureSnapshot!.sector   : localBySector;
        const byIndustry = hasSnap(exposureSnapshot?.industry) ? exposureSnapshot!.industry : localByIndustry;
        const byArea     = hasSnap(exposureSnapshot?.area)     ? exposureSnapshot!.area     : localByArea;
        const sortedEntries = (map: Record<string, number>) =>
          Object.entries(map).sort(([, a], [, b]) => b - a);

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

      {/* ── Liquidity Detail Modal ── */}
      {liquidityDetailOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setLiquidityDetailOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900">Liquidity Score — Ultimo run</div>
              <button
                type="button"
                onClick={() => setLiquidityDetailOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>
            {liquidityDetailLoading && (
              <div className="py-8 text-center text-[11px] text-slate-400">Caricamento...</div>
            )}
            {!liquidityDetailLoading && liquidityDetailError && (
              <div className="py-4 rounded-md border border-rose-200 bg-rose-50 px-3 text-[11px] text-rose-700">{liquidityDetailError}</div>
            )}
            {!liquidityDetailLoading && !liquidityDetailError && !liquidityDetailRow && (
              <div className="py-8 text-center text-[11px] text-slate-400">Nessun dato disponibile.</div>
            )}
            {!liquidityDetailLoading && liquidityDetailRow && (
              <LiquidityDetailTable row={liquidityDetailRow} />
            )}
          </div>
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

function LiquidityDetailTable({ row }: { row: Record<string, unknown> }) {
  const fmt = (v: unknown): string => {
    if (v == null) return "–";
    if (typeof v === "number") return Number.isFinite(v) ? String(v) : "–";
    if (typeof v === "boolean") return v ? "true" : "false";
    return String(v);
  };
  const sections: { label: string; fields: [string, string][] }[] = [
    {
      label: "Generale",
      fields: [
        ["score_date", "Data"],
        ["calculated_at", "Calcolato il"],
        ["source", "Sorgente"],
        ["confidence", "Confidence"],
        ["components_available", "Componenti disponibili (bitmask)"],
      ],
    },
    {
      label: "Score",
      fields: [
        ["score_raw", "Score raw"],
        ["score_ema", "Score EMA"],
        ["score_rate_limited", "Score EMA rate-limited"],
        ["alpha_effective", "Alpha effettivo"],
        ["decay_applied", "Decay applicato"],
        ["ema_staleness_days", "EMA staleness (giorni)"],
      ],
    },
    {
      label: "Regime",
      fields: [
        ["risk_regime", "Risk Regime"],
        ["previous_risk_regime", "Risk Regime precedente"],
        ["regime_changed", "Regime cambiato"],
        ["volatility_regime", "Volatility Regime"],
      ],
    },
    {
      label: "VIX",
      fields: [
        ["vix_value", "Valore"],
        ["vix_score", "Score normalizzato"],
        ["vix_weight_used", "Peso usato"],
      ],
    },
    {
      label: "SPY",
      fields: [
        ["spy_return_1d", "Return 1d"],
        ["spy_sma50", "SMA 50"],
        ["spy_sma200", "SMA 200"],
        ["spy_score", "Score normalizzato"],
        ["spy_weight_used", "Peso usato"],
      ],
    },
    {
      label: "DXY",
      fields: [
        ["dxy_value", "Valore"],
        ["dxy_score", "Score normalizzato"],
        ["dxy_weight_used", "Peso usato"],
      ],
    },
    {
      label: "Credit Spread",
      fields: [
        ["credit_spread_value", "Valore"],
        ["credit_score", "Score normalizzato"],
        ["credit_weight_used", "Peso usato"],
      ],
    },
    {
      label: "Note",
      fields: [["notes", "Note"]],
    },
  ];
  return (
    <div className="space-y-4">
      {sections.map((s) => (
        <div key={s.label} className="rounded-lg border border-slate-200">
          <div className="border-b border-slate-100 bg-slate-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            {s.label}
          </div>
          <table className="w-full text-[11px]">
            <tbody>
              {s.fields.map(([key, label]) => (
                <tr key={key} className="border-t border-slate-100 first:border-t-0">
                  <td className="px-3 py-1.5 font-medium text-slate-500 w-48">{label}</td>
                  <td className="px-3 py-1.5 text-slate-800 font-mono">{fmt(row[key])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
