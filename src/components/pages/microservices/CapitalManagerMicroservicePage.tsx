import { useCallback, useMemo, useState } from "react";
import MicroserviceGeneralTab from "../../molecules/microservice/MicroserviceGeneralTab";
import AllocationSettingPanel from "./AllocationSettingPanel";
import { env } from "../../../config/env";

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

  const loadIbkrAccount = useCallback(async () => {
    setIbkrStatus("loading");
    setIbkrError(null);
    try {
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
    } catch (err: any) {
      setIbkrStatus("error");
      setIbkrError(err?.message || "Errore caricamento dati IBKR");
    }
  }, [headers]);

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
        <AllocationSettingPanel />
      )}
    </div>
  );
}
