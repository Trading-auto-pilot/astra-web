import DashboardLayout from "../../layouts/DashboardLayout";
import SectionHeader from "../molecules/content/SectionHeader";
import TickersPage from "./TickersPage";
import UserTickersPage from "./UserTickersPage";
import UsersPage from "./UsersPage";
import SchedulerPage from "./SchedulerPage";
import ApiKeysPage from "./ApiKeysPage";
import LogsPage from "./LogsPage";
import AdminMicroservicePage from "./AdminMicroservicePage";
import AdminMicroserviceDetailPage from "./AdminMicroserviceDetailPage";
import UserSettingsPage from "./UserSettingsPage";
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

type AppSection =
  | "overview"
  | "tickers"
  | "userTickers"
  | "users"
  | "scheduler"
  | "apiKeys"
  | "logs"
  | "microservice"
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
    if (parts[1] === "microservice") return "microservice";
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

  useEffect(() => {
    if (!selectedAccountId || section !== "overview") return;
    fetchAccountDetails(selectedAccountId);
  }, [selectedAccountId, section]);

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

  if (section === "scheduler") {
    return (
      <DashboardLayout userName={userName} navEntries={navEntries}>
        <SchedulerPage />
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

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionHeader title="Dettagli account" subTitle="Summary e performance" />
          {loadingDetails ? (
            <div className="text-sm text-slate-500">Caricamento dettagli...</div>
          ) : detailsError ? (
            <div className="text-sm text-amber-600">{detailsError}</div>
          ) : accountDetails ? (
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="text-sm font-semibold text-slate-900">Summary</div>
              <table className="mt-3 w-full text-[11px] text-slate-700">
                <tbody>
                  {(() => {
                    const summary = accountDetails?.summary ?? {};
                    const accruedCash = summary.accruedcash ?? {};
                    const availableFunds = accruedCash?.availablefunds ?? summary?.availablefunds ?? {};
                    const netLiquidation = summary?.netliquidation ?? accruedCash?.netliquidation ?? {};
                    const formatAmount = (value: unknown) => {
                      const numeric = typeof value === "number" ? value : Number(value);
                      if (!Number.isFinite(numeric)) return "-";
                      return numeric.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      });
                    };
                    const rows = [
                      {
                        label: "Cash",
                        amount: accruedCash?.amount,
                        currency: accruedCash?.currency,
                      },
                      {
                        label: "Available funds",
                        amount: availableFunds?.amount,
                        currency: availableFunds?.currency ?? accruedCash?.currency,
                      },
                      {
                        label: "Net liquidation",
                        amount: netLiquidation?.amount,
                        currency: netLiquidation?.currency ?? accruedCash?.currency,
                      },
                    ];

                    return rows.map((row) => (
                      <tr key={row.label}>
                        <td className="pr-2 font-semibold text-slate-600">{row.label}</td>
                        <td className="text-right text-slate-800">
                          {row.amount === null || row.amount === undefined || row.amount === ""
                            ? "-"
                            : formatAmount(row.amount)}
                        </td>
                        <td className="pl-3 text-right text-slate-500">
                          {row.currency === null || row.currency === undefined || row.currency === ""
                            ? "-"
                            : String(row.currency)}
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-sm text-slate-500">Seleziona un account per vedere i dettagli.</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;
