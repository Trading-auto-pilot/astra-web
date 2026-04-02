import DashboardLayout from "../../layouts/DashboardLayout";
import SectionHeader from "../molecules/content/SectionHeader";
import AccountCapacityBar from "../molecules/AccountCapacityBar";
import TickersPage from "./TickersPage";
import UserTickersPage from "./UserTickersPage";
import UsersPage from "./UsersPage";
import SchedulerPage from "./SchedulerPage";
import ApiKeysPage from "./ApiKeysPage";
import LogsPage from "./LogsPage";
import AlertsPage from "./AlertsPage";
import AdminMicroservicePage from "./AdminMicroservicePage";
import AdminMicroserviceDetailPage from "./AdminMicroserviceDetailPage";
import UserSettingsPage from "./UserSettingsPage";
import CapitalAllocationPage from "./CapitalAllocationPage";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { env } from "../../config/env";
import { redisWsBridgeClient } from "../../services/ws/redisWsBridgeClient";

const getAuthToken = () =>
  typeof localStorage === "undefined" ? null : localStorage.getItem("astraai:auth:token");

export type DashboardPageProps = {
  userName?: string;
  navEntries?: any[];
  extraContent?: ReactNode;
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

type AppSection =
  | "overview"
  | "tickers"
  | "userTickers"
  | "users"
  | "scheduler"
  | "apiKeys"
  | "logs"
  | "alerts"
  | "microservice"
  | "capitalAllocation"
  | "userSettings";

const getAppSection = (): AppSection => {
  if (typeof window === "undefined") return "overview";
  const cleaned = window.location.hash.replace(/^#\/?/, "");
  const parts = cleaned.split(/[/?]/).filter(Boolean);

  if (parts[0] === "overview") return "overview";

  if (parts[0] === "dashboard") {
    if (parts[1] === "tickers") return "tickers";
    if (parts[1] === "user_tickers" || parts[1] === "user-tickers") return "userTickers";
    if (parts[1] === "user-settings") return "userSettings";
    return "overview";
  }

  if (parts[0] === "admin") {
    if (parts[1] === "users") return "users";
    if (parts[1] === "scheduler") return "scheduler";
    if (parts[1] === "api_key") return "apiKeys";
    if (parts[1] === "logs") return "logs";
    if (parts[1] === "alerts") return "alerts";
    if (parts[1] === "microservice") return "microservice";
    if (parts[1] === "capital-allocation") return "capitalAllocation";
    return "overview";
  }

  return "overview";
};

export function DashboardPage({ extraContent, userName, navEntries }: DashboardPageProps) {
  const [section, setSection] = useState<AppSection>(() => getAppSection());
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [accounts, setAccounts] = useState<Array<Record<string, unknown> | string>>([]);
  const [accountsError, setAccountsError] = useState<string | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [accountDetails, setAccountDetails] = useState<Record<string, any> | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [wsHealth, setWsHealth] = useState(() => redisWsBridgeClient.getHealth());
  const [wsLogs, setWsLogs] = useState(() => redisWsBridgeClient.getLogs());
  const [openOrders, setOpenOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [capitalLimits, setCapitalLimits] = useState<Record<string, number | null> | null>(null);
  const [capitalConfig, setCapitalConfig] = useState<Record<string, number> | null>(null);
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
  const [liquidityStatus, setLiquidityStatus] = useState<"idle" | "loading" | "error">("idle");
  const [liquidityError, setLiquidityError] = useState<string | null>(null);
  const [liquidityDetailOpen, setLiquidityDetailOpen] = useState(false);
  const [liquidityDetailRow, setLiquidityDetailRow] = useState<Record<string, unknown> | null>(null);
  const [liquidityDetailLoading, setLiquidityDetailLoading] = useState(false);

  useEffect(() => {
    const syncSection = () => setSection(getAppSection());
    window.addEventListener("hashchange", syncSection);
    syncSection();
    return () => window.removeEventListener("hashchange", syncSection);
  }, []);

  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    const accountId = localStorage.getItem("astraai:ibkr:accountId");
    setSelectedAccountId(accountId);
  }, []);

  useEffect(() => {
    if (section !== "overview") return;
    let isActive = true;
    const loadAccounts = async () => {
      setLoadingAccounts(true);
      setAccountsError(null);
      try {
        const token = getAuthToken();
        const response = await fetch(`${env.apiBaseUrl}/ibkr-bridge/mirror/portfolio/accounts`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const text = await response.text();
        let payload: any = null;
        try {
          payload = text ? JSON.parse(text) : null;
        } catch {
          payload = null;
        }

        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.accounts)
            ? payload.accounts
            : [];

        if (list.length) {
          setAccountsError(null);
          setAccounts(list);
          return;
        }

        if (!response.ok) {
          if (payload?.error === "IBKR request failed" && payload?.status === 401) {
            setAccountsError(
              "Devi effettuare il login su IBKR cliccando sulla barra di stato in basso."
            );
          } else {
            setAccountsError("Impossibile caricare gli account IBKR.");
          }
          setAccounts([]);
          return;
        }

        setAccounts([]);
      } catch {
        setAccounts([]);
        setAccountsError("Impossibile caricare gli account IBKR.");
      } finally {
        if (isActive) {
          setLoadingAccounts(false);
        }
      }
    };

    loadAccounts();
    return () => {
      isActive = false;
    };
  }, [section]);

  const fetchAccountDetails = async (accountId: string) => {
    setLoadingDetails(true);
    setDetailsError(null);
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${env.apiBaseUrl}/ibkr-bridge/account?accountId=${encodeURIComponent(accountId)}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const text = await response.text();
      let payload: any = null;
      try {
        payload = text ? JSON.parse(text) : null;
      } catch {
        payload = null;
      }

      if (!response.ok) {
        setAccountDetails(null);
        setDetailsError("Impossibile caricare i dettagli account.");
        return;
      }

      setAccountDetails(payload);
    } catch {
      setAccountDetails(null);
      setDetailsError("Impossibile caricare i dettagli account.");
    } finally {
      setLoadingDetails(false);
    }
  };

  const fetchOpenOrders = async () => {
    setLoadingOrders(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`${env.apiBaseUrl}/broker-executor-ibkr/orders`, {
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      const data = await res.json().catch(() => ({}));
      const orders = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
      setOpenOrders(orders);
    } catch {
      setOpenOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchCapitalData = async () => {
    const token = getAuthToken();
    const h = { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
    const [limitsRes, configRes] = await Promise.allSettled([
      fetch(`${env.apiBaseUrl}/capital-manager/allocation/limits`, { headers: h }),
      fetch(`${env.apiBaseUrl}/capital-manager/allocation/config`, { headers: h }),
    ]);
    if (limitsRes.status === "fulfilled" && limitsRes.value.ok) {
      const d = await limitsRes.value.json().catch(() => ({}));
      setCapitalLimits(d?.data ?? d);
    }
    if (configRes.status === "fulfilled" && configRes.value.ok) {
      const d = await configRes.value.json().catch(() => ({}));
      setCapitalConfig(d?.config ?? d);
    }
  };

  const loadLiquidityData = async () => {
    setLiquidityStatus("loading");
    setLiquidityError(null);
    try {
      const token = getAuthToken();
      const res = await fetch(`${env.apiBaseUrl}/liquidity-manager/liquidity-score`, {
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error?.message || data?.error || "Errore caricamento liquidità");
      const payload = data?.score != null ? data : (data?.data ?? data);
      // Prefer EMA-smoothed score over raw score (same logic as backend decisionEngine)
      if (Number.isFinite(payload.score_ema)) payload.score = payload.score_ema;
      // volatilityRegime (LOW/MEDIUM/HIGH) is always present; use it as fallback when volatility is absent
      if (payload.volatility == null && payload.volatilityRegime != null) {
        payload.volatility = payload.volatilityRegime;
      }
      setLiquidityData(payload);
      setLiquidityStatus("idle");
      // Refresh capitalLimits so cashToSave is recomputed server-side with the new score
      fetchCapitalData();
    } catch (err: any) {
      setLiquidityStatus("error");
      setLiquidityError(err?.message || "Errore caricamento liquidità");
    }
  };

  const [liquidityDetailError, setLiquidityDetailError] = useState<string | null>(null);

  const openLiquidityDetail = async () => {
    setLiquidityDetailOpen(true);
    if (liquidityDetailRow) return; // already loaded
    setLiquidityDetailLoading(true);
    setLiquidityDetailError(null);
    try {
      const token = getAuthToken();
      const h = { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
      const res = await fetch(`${env.apiBaseUrl}/datahub/api/table/liquidity_daily_scores?limit=1&sort_by=calculated_at&sort_dir=desc`, { headers: h });
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
  };

  useEffect(() => {
    if (!selectedAccountId || section !== "overview") return;
    fetchAccountDetails(selectedAccountId);
    fetchOpenOrders();
  }, [selectedAccountId, section]);

  useEffect(() => {
    if (section !== "overview") return;
    fetchCapitalData();
    loadLiquidityData();
  }, [section]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    redisWsBridgeClient.start();
    const unsub = redisWsBridgeClient.onStatus(() => {
      setWsHealth(redisWsBridgeClient.getHealth());
      setWsLogs(redisWsBridgeClient.getLogs());
    });
    return () => {
      unsub();
    };
  }, []);

  if (section === "tickers") {
    return (
      <DashboardLayout userName={userName} navEntries={navEntries}>
        <TickersPage />
      </DashboardLayout>
    );
  }

  if (section === "userTickers") {
    return (
      <DashboardLayout userName={userName} navEntries={navEntries}>
        <UserTickersPage />
      </DashboardLayout>
    );
  }

  if (section === "users") {
    return (
      <DashboardLayout userName={userName} navEntries={navEntries}>
        <UsersPage />
      </DashboardLayout>
    );
  }

  if (section === "userSettings") {
    return (
      <DashboardLayout userName={userName} navEntries={navEntries}>
        <UserSettingsPage />
      </DashboardLayout>
    );
  }

  if (section === "apiKeys") {
    return (
      <DashboardLayout userName={userName} navEntries={navEntries}>
        <ApiKeysPage />
      </DashboardLayout>
    );
  }

  if (section === "logs") {
    return (
      <DashboardLayout userName={userName} navEntries={navEntries}>
        <LogsPage />
      </DashboardLayout>
    );
  }

  if (section === "alerts") {
    return (
      <DashboardLayout userName={userName} navEntries={navEntries}>
        <AlertsPage />
      </DashboardLayout>
    );
  }

  if (section === "scheduler") {
    return (
      <DashboardLayout userName={userName} navEntries={navEntries}>
        <SchedulerPage />
      </DashboardLayout>
    );
  }


  if (section === "capitalAllocation") {
    return (
      <DashboardLayout userName={userName} navEntries={navEntries}>
        <CapitalAllocationPage />
      </DashboardLayout>
    );
  }

  if (section === "microservice") {
    return (
      <DashboardLayout userName={userName} navEntries={navEntries}>
        {typeof window !== "undefined" && window.location.hash.includes("/admin/microservice/") ? (
          <AdminMicroserviceDetailPage />
        ) : (
          <AdminMicroservicePage />
        )}
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userName={userName} navEntries={navEntries}>
      <div className="space-y-6">
        <SectionHeader title="Overview" subTitle="Account IBKR disponibili" />

        {extraContent}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          {loadingAccounts ? (
            <div className="text-sm text-slate-500">Caricamento account...</div>
          ) : accountsError ? (
            <div className="text-sm text-amber-600">{accountsError}</div>
          ) : accounts.length ? (
            <div className="space-y-3">
              <div className="text-xs uppercase tracking-wide text-slate-400">Account</div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {accounts.map((account, index) => {
                  const item = (typeof account === "string"
                    ? { accountId: account }
                    : account) as Record<string, any>;
                  const title = `${item.accountTitle ?? "Account"} - ${item.acctCustType ?? "-"}`;
                  const accountId = item.accountId ?? item.id ?? "-";
                  const subtitle = accountId;
                  const accountType =
                    item.type ?? item.accountType ?? item.acctType ?? item.acctCustType ?? "-";
                  const typeTone =
                    accountType === "DEMO"
                      ? "text-red-600"
                      : accountType === "INDIVIDUAL"
                        ? "text-emerald-600"
                        : "text-slate-600";
                  return (
                    <div
                      key={`${String(subtitle)}-${index}`}
                      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{title}</div>
                          <div className="mt-1 text-xs text-slate-500">{subtitle}</div>
                        </div>
                        <div className="text-right text-[11px]">
                          <div className="text-slate-400">Type</div>
                          <div className={`font-semibold ${typeTone}`}>{String(accountType)}</div>
                        </div>
                      </div>
                      <div className="pt-3">
                        <table className="min-w-[200px] text-[11px] text-slate-700">
                          <tbody>
                            <tr>
                              <td className="pr-2 font-semibold text-slate-600">accountStatus</td>
                              <td>{item.accountStatus ?? "-"}</td>
                            </tr>
                            <tr>
                              <td className="pr-2 font-semibold text-slate-600">businessType</td>
                              <td>{item.businessType ?? "-"}</td>
                            </tr>
                            <tr>
                              <td className="pr-2 font-semibold text-slate-600">ibEntity</td>
                              <td>{item.ibEntity ?? "-"}</td>
                            </tr>
                            <tr>
                              <td className="pr-2 font-semibold text-slate-600">tradingType</td>
                              <td>{item.tradingType ?? "-"}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="pt-3">
                        <button
                          type="button"
                          className="w-full rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300"
                          disabled={!accountId || accountId === "-"}
                          onClick={() => {
                            const accountIdValue = String(accountId);
                            const accountTypeValue = String(accountType);
                            setSelectedAccountId(accountIdValue);
                            if (typeof localStorage !== "undefined") {
                              localStorage.setItem("astraai:ibkr:accountId", accountIdValue);
                              localStorage.setItem("astraai:ibkr:accountType", accountTypeValue);
                            }
                            window.dispatchEvent(new Event("ibkr-account-change"));
                            fetchAccountDetails(accountIdValue);
                          }}
                        >
                          Connect
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-500">Nessun account disponibile.</div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">Websocket logs</div>
              <div className="text-xs text-slate-500">redis-ws-bridge status e attività</div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex h-2.5 w-2.5 rounded-full ${
                  wsHealth.status === "open"
                    ? "bg-emerald-500"
                    : wsHealth.status === "connecting"
                      ? "bg-amber-400"
                      : "bg-rose-500"
                }`}
              />
              <span className="text-[11px] font-semibold text-slate-700">
                {wsHealth.status.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
              <div className="flex flex-wrap gap-3">
                <span>
                  Last connected: <span className="font-semibold">{wsHealth.lastConnectedAt || "-"}</span>
                </span>
                <span>
                  Last message: <span className="font-semibold">{wsHealth.lastMessageAt || "-"}</span>
                </span>
                <span>
                  Last close: <span className="font-semibold">{wsHealth.lastCloseAt || "-"}</span>
                </span>
                <span>
                  Subscriptions: <span className="font-semibold">{wsHealth.subscriptions}</span>
                </span>
              </div>
              {wsHealth.lastError && (
                <div className="mt-2 rounded-md border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] text-rose-700">
                  {wsHealth.lastError}
                </div>
              )}
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-600">
              <div className="text-[11px] font-semibold text-slate-700">Log connessione</div>
              <div className="mt-2 max-h-40 overflow-y-auto">
                {wsLogs.length === 0 && <div>Nessun evento websocket</div>}
                {wsLogs.map((log, idx) => (
                  <div key={`${log.ts}-${idx}`} className="flex items-start gap-2 py-0.5">
                    <span
                      className={`mt-0.5 inline-flex h-2 w-2 rounded-full ${
                        log.level === "error"
                          ? "bg-rose-500"
                          : log.level === "warning"
                            ? "bg-amber-400"
                            : "bg-emerald-500"
                      }`}
                    />
                    <div>
                      <div className="text-[10px] text-slate-400">{log.ts}</div>
                      <div>{log.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Account Summary ─────────────────────────────────────────────── */}
        {(() => {
          const getAmt = (field: any): number => {
            if (field == null) return 0;
            if (typeof field === "number") return field;
            return typeof field?.amount === "number" ? field.amount : 0;
          };
          const fmtUSD = (v: number) =>
            v.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

          const summary = accountDetails?.summary ?? null;

          const netLiquidation     = summary ? (getAmt(summary.equitywithloanvalue) || getAmt(summary.netliquidation)) : 0;
          const totalCashValue     = summary ? getAmt(summary.totalcashvalue) : 0;
          const grossPositionValue = summary ? (getAmt(summary.grosspositionvalue) || undefined) : undefined;
          const availableFunds     = summary ? getAmt(summary.availablefunds) : 0;
          const activeOrdersCash   = openOrders.reduce((sum: number, o: any) =>
            sum + Number(o.limitPrice ?? 0) * Number(o.quantity ?? 0), 0);
          const residualCash       = Math.max(totalCashValue - activeOrdersCash, 0);

          const maxInv = capitalLimits?.maxInvestment ?? null;
          const statCards = [
            {
              label: "Liquidità netta",
              sublabel: "equityWithLoanValue",
              value: netLiquidation > 0 ? fmtUSD(netLiquidation) : null,
              desc: "Valore totale se tutte le posizioni venissero liquidate oggi",
              color: "text-blue-600",
            },
            {
              label: "Liquidità",
              sublabel: "totalCashValue",
              value: totalCashValue > 0 ? fmtUSD(totalCashValue) : null,
              desc: "Cache disponibile per investimenti (esclude posizioni aperte)",
              color: "text-blue-500",
            },
            {
              label: "Ordini attivi",
              sublabel: `${openOrders.length} ordini`,
              value: activeOrdersCash > 0 ? fmtUSD(activeOrdersCash) : openOrders.length > 0 ? String(openOrders.length) : null,
              desc: "Notional riservato dagli ordini attivi correnti",
              color: "text-violet-600",
            },
            {
              label: "Cash rimanente",
              sublabel: "totalCashValue − ordini attivi",
              value: totalCashValue > 0 ? fmtUSD(residualCash) : null,
              desc: "Liquidità disponibile per nuovi ordini",
              color: "text-emerald-600",
            },
            {
              label: "Max Investment",
              sublabel: "capital-manager",
              value: maxInv != null ? fmtUSD(maxInv) : null,
              desc: "Capitale massimo configurato per investimenti (capital-manager)",
              color: "text-amber-600",
            },
          ];

          return (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Account Summary</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {selectedAccountId ?? "Seleziona un account per vedere i dettagli"}
                  </div>
                </div>
                {selectedAccountId && (
                  <button
                    type="button"
                    onClick={() => { fetchAccountDetails(selectedAccountId); fetchOpenOrders(); }}
                    disabled={loadingDetails || loadingOrders}
                    className="inline-flex items-center justify-center rounded-md bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                  >
                    {loadingDetails || loadingOrders ? "Loading..." : "Refresh"}
                  </button>
                )}
              </div>

              {detailsError && (
                <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-700">{detailsError}</div>
              )}

              {loadingDetails ? (
                <div className="text-[11px] text-slate-400">Caricamento dettagli...</div>
              ) : !accountDetails ? (
                <div className="text-[11px] text-slate-400">Seleziona un account dalla lista sopra per vedere i dettagli.</div>
              ) : (
                <>
                  {/* Stats cards */}
                  <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {statCards.map(({ label, sublabel, value, desc, color }) => (
                      <div key={label} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-3">
                        <div className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">{label}</div>
                        <div className={`mt-1 text-[15px] font-bold tabular-nums ${value ? color : "text-slate-300"}`}>
                          {value ?? "–"}
                        </div>
                        <div className="mt-0.5 text-[9px] text-slate-400">{sublabel}</div>
                        <div className="mt-1 text-[8px] leading-relaxed text-slate-300">{desc}</div>
                      </div>
                    ))}
                  </div>

                  {/* Capacity bar */}
                  {netLiquidation > 0 && (
                    <AccountCapacityBar
                      netLiquidation={netLiquidation}
                      totalCashValue={totalCashValue}
                      grossPositionValue={grossPositionValue}
                      availableFunds={availableFunds}
                      activeOrdersCash={activeOrdersCash}
                      maxInvestment={capitalLimits?.maxInvestment ?? undefined}
                    />
                  )}
                </>
              )}
            </div>
          );
        })()}

        {/* ── Liquidity Manager ─────────────────────────────────────────── */}
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
                    Ultimo calcolo: {formatDateTime(ld?.timestamp ?? ld?.ts ?? ld?.cacheMeta?.cachedAt)}
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
                        ? `Aggiunge +${capitalConfig?.RISK_OFF_ADD_PCT != null ? (capitalConfig.RISK_OFF_ADD_PCT * 100).toFixed(0) : "?"}% alla riserva`
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
                        ? `vol / ${capitalConfig?.VOL_SCALE ?? "?"} → cash adj`
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
                      soglia: {capitalConfig?.CONFIDENCE_THRESHOLD ?? "–"} · {
                        ld.confidence >= (capitalConfig?.CONFIDENCE_THRESHOLD ?? 0.69)
                          ? "usa score"
                          : `usa fallback ${capitalConfig?.FALLBACK_RESERVED_CASH_PCT != null ? (capitalConfig.FALLBACK_RESERVED_CASH_PCT * 100).toFixed(0) + "%" : ""}`
                      }
                    </div>
                  </div>

                  {/* Cash to save */}
                  <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-3">
                    <div className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">Cash da tenere</div>
                    <div className="mt-1 text-[15px] font-bold tabular-nums text-rose-600">
                      {(() => {
                        const fromLimits = Number(capitalLimits?.cashToSave);
                        if (Number.isFinite(fromLimits)) {
                          return fromLimits.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 2,
                          });
                        }
                        const maxInv = Number(capitalLimits?.maxInvestment);
                        const score = Number(ld?.score);
                        if (Number.isFinite(maxInv) && Number.isFinite(score)) {
                          const scorePct = Math.max(0, Math.min(100, score)) / 100;
                          const computed = Math.max(0, maxInv - maxInv * scorePct);
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
      </div>

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
    </DashboardLayout>
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

export default DashboardPage;
