import { useCallback, useEffect, useMemo, useState } from "react";
import MicroserviceGeneralTab from "../../molecules/microservice/MicroserviceGeneralTab";
import AppIcon from "../../atoms/icon/AppIcon";
import { env } from "../../../config/env";
import { IBKR_MARKET_DATA_FIELDS } from "../../../config/ibkrMarketDataFields";

type Status = "idle" | "loading" | "error";

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

const splitFieldLabel = (value: string) => {
  const text = String(value || "").trim();
  if (!text) return { name: "-", description: "" };
  const idx = text.indexOf(".");
  if (idx === -1) return { name: text, description: "" };
  const name = text.slice(0, idx + 1).trim();
  const description = text.slice(idx + 1).trim();
  return { name, description };
};

export default function MarketDataServiceMicroservicePage({
  onReleaseChange,
  onHealthChange,
  onOpenReleaseModal,
}: Props) {
  const [activeTab, setActiveTab] = useState<"general" | "subscription">("subscription");

  // Stati per subscription
  const [subscriptionStatus, setSubscriptionStatus] = useState<Status>("idle");
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
  const [subscriptionTickers, setSubscriptionTickers] = useState<string[]>([]);
  const [subscriptionInput, setSubscriptionInput] = useState<string>("");
  const [subscriptionSaveStatus, setSubscriptionSaveStatus] = useState<Status>("idle");
  const [subscriptionSaveError, setSubscriptionSaveError] = useState<string | null>(null);
  const [subscriptionDeleteMode, setSubscriptionDeleteMode] = useState(false);

  // Stati per snapshot interval
  const [snapshotIntervalMin, setSnapshotIntervalMin] = useState<number>(1);
  const [snapshotIntervalStatus, setSnapshotIntervalStatus] = useState<Status>("idle");
  const [snapshotIntervalError, setSnapshotIntervalError] = useState<string | null>(null);

  // Stati per market fields
  const [, setMarketFieldsStatus] = useState<Status>("idle");
  const [marketFieldsError, setMarketFieldsError] = useState<string | null>(null);
  const [, setMarketFields] = useState<string[]>([]);
  const [marketFieldsSelected, setMarketFieldsSelected] = useState<string[]>([]);
  const [marketFieldsSearch, setMarketFieldsSearch] = useState("");
  const [marketFieldsModal, setMarketFieldsModal] = useState(false);
  const [marketFieldsSaveStatus, setMarketFieldsSaveStatus] = useState<Status>("idle");
  const [marketFieldsSaveError, setMarketFieldsSaveError] = useState<string | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    setSubscriptionStatus("loading");
    setSubscriptionError(null);
    try {
      const res = await fetch(`${env.apiBaseUrl}/market-data-service/subscriptions`, {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.status === 304) {
        setSubscriptionStatus("idle");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || data?.message || "Errore get subscriptions");
      }
      const rawList =
        (Array.isArray(data) && data) ||
        (Array.isArray(data?.subscribed) && data.subscribed) ||
        (Array.isArray(data?.tickers) && data.tickers) ||
        (Array.isArray(data?.subscriptions) && data.subscriptions) ||
        (Array.isArray(data?.items) && data.items) ||
        (Array.isArray(data?.data) && data.data) ||
        (Array.isArray(data?.result) && data.result) ||
        (Array.isArray(data?.data?.subscribed) && data.data.subscribed) ||
        (Array.isArray(data?.data?.tickers) && data.data.tickers) ||
        [];
      const normalized = rawList
        .map((item: any) => {
          if (typeof item === "string") return item;
          if (item && typeof item === "object") {
            return item.ticker || item.symbol || item.code || "";
          }
          return "";
        })
        .map((item: string) => item.trim())
        .filter(Boolean);
      setSubscriptionTickers(normalized);
      setSubscriptionStatus("idle");
    } catch (err: any) {
      setSubscriptionStatus("error");
      setSubscriptionError(err?.message || "Errore get subscriptions");
    }
  }, []);

  // Carica subscriptions all'avvio e quando si entra nel tab
  useEffect(() => {
    if (activeTab === "subscription") {
      fetchSubscriptions();
    }
  }, [activeTab, fetchSubscriptions]);

  // Carica market fields all'avvio
  useEffect(() => {
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    setMarketFieldsStatus("loading");
    fetch(`${env.apiBaseUrl}/market-data-service/fields`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data?.ok === false) throw new Error(data?.error || data?.message || "Errore get fields");
        const list = Array.isArray(data?.fields) ? data.fields : [];
        setMarketFields(list);
        setMarketFieldsSelected(list);
        setMarketFieldsStatus("idle");
      })
      .catch((err) => {
        setMarketFieldsStatus("error");
        setMarketFieldsError(err?.message || "Errore get fields");
      });
  }, []);

  const handleSubscriptionSave = useCallback(async () => {
    const raw = subscriptionInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const normalized = Array.from(new Set(raw.map((item) => item.toUpperCase())));
    if (normalized.length === 0) {
      setSubscriptionSaveError("Inserisci almeno un ticker valido.");
      return;
    }
    const merged = Array.from(
      new Set([...subscriptionTickers.map((t) => String(t).toUpperCase()), ...normalized])
    );
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    setSubscriptionSaveStatus("loading");
    setSubscriptionSaveError(null);
    try {
      const res = await fetch(`${env.apiBaseUrl}/market-data-service/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ tickers: merged }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || data?.message || "Errore salvataggio subscriptions");
      }
      const next = Array.isArray(data?.subscribed)
        ? data.subscribed
        : Array.isArray(data?.tickers)
          ? data.tickers
          : merged;
      setSubscriptionTickers(next);
      setSubscriptionInput("");
      setSubscriptionSaveStatus("idle");
    } catch (err: any) {
      setSubscriptionSaveStatus("error");
      setSubscriptionSaveError(err?.message || "Errore salvataggio subscriptions");
    } finally {
      setSubscriptionSaveStatus("idle");
    }
  }, [fetchSubscriptions, subscriptionInput, subscriptionTickers]);

  const handleSubscriptionDelete = useCallback(
    async (ticker: string) => {
      if (!ticker) return;
      const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
      setSubscriptionSaveStatus("loading");
      setSubscriptionSaveError(null);
      try {
        const res = await fetch(
          `${env.apiBaseUrl}/market-data-service/subscriptions/${encodeURIComponent(ticker)}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data?.ok === false) {
          throw new Error(data?.error || data?.message || "Errore cancellazione subscriptions");
        }
        const next = Array.isArray(data?.subscribed)
          ? data.subscribed
          : subscriptionTickers.filter((t) => t !== ticker);
        setSubscriptionTickers(next);
      } catch (err: any) {
        setSubscriptionSaveError(err?.message || "Errore cancellazione subscriptions");
      } finally {
        setSubscriptionSaveStatus("idle");
      }
    },
    [subscriptionTickers]
  );

  const handleSnapshotIntervalSave = useCallback(async () => {
    const next = Math.max(1, Number(snapshotIntervalMin || 1));
    const intervalMs = Math.round(next * 60000);
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    setSnapshotIntervalStatus("loading");
    setSnapshotIntervalError(null);
    try {
      const res = await fetch(`${env.apiBaseUrl}/market-data-service/snapshot/interval`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ intervalMs }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || data?.message || "Errore aggiornando snapshot");
      }
      setSnapshotIntervalStatus("idle");
    } catch (err: any) {
      setSnapshotIntervalStatus("error");
      setSnapshotIntervalError(err?.message || "Errore aggiornando snapshot");
    }
  }, [snapshotIntervalMin]);

  const handleSubscriptionResubscribe = useCallback(async () => {
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    setSubscriptionSaveStatus("loading");
    setSubscriptionSaveError(null);
    try {
      const res = await fetch(`${env.apiBaseUrl}/market-data-service/subscriptions/resubscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || data?.message || "Errore resubscribe");
      }
      await fetchSubscriptions();
      setSubscriptionSaveStatus("idle");
    } catch (err: any) {
      setSubscriptionSaveStatus("error");
      setSubscriptionSaveError(err?.message || "Errore resubscribe");
    } finally {
      setSubscriptionSaveStatus("idle");
    }
  }, [fetchSubscriptions]);

  const handleMarketFieldsSave = useCallback(async () => {
    if (!marketFieldsSelected.length) {
      setMarketFieldsSaveError("Seleziona almeno un campo.");
      return;
    }
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    setMarketFieldsSaveStatus("loading");
    setMarketFieldsSaveError(null);
    try {
      const res = await fetch(`${env.apiBaseUrl}/market-data-service/fields`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ fields: marketFieldsSelected }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || data?.message || "Errore salvataggio fields");
      }
      const next = Array.isArray(data?.fields) ? data.fields : marketFieldsSelected;
      setMarketFields(next);
      setMarketFieldsSelected(next);
      setMarketFieldsModal(false);
    } catch (err: any) {
      setMarketFieldsSaveError(err?.message || "Errore salvataggio fields");
    } finally {
      setMarketFieldsSaveStatus("idle");
    }
  }, [marketFieldsSelected]);

  const marketFieldEntries = useMemo(() => {
    const term = marketFieldsSearch.trim().toLowerCase();
    const entries = Object.entries(IBKR_MARKET_DATA_FIELDS)
      .map(([code, label]) => ({
        code,
        label,
        meta: splitFieldLabel(label),
      }))
      .sort((a, b) => {
        const na = Number(a.code);
        const nb = Number(b.code);
        if (Number.isFinite(na) && Number.isFinite(nb) && na !== nb) return na - nb;
        return a.code.localeCompare(b.code);
      });
    if (!term) return entries;
    return entries.filter((item) => {
      const haystack = `${item.code} ${item.meta.name} ${item.meta.description}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [marketFieldsSearch]);

  const marketFieldsSelectedSet = useMemo(
    () => new Set(marketFieldsSelected.map((val) => String(val))),
    [marketFieldsSelected]
  );

  return (
    <div>
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
            activeTab === "subscription" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
          }`}
          onClick={() => setActiveTab("subscription")}
        >
          Subscription
        </button>
      </div>

      {activeTab === "general" && (
        <MicroserviceGeneralTab
          microservice="market-data-service"
          onReleaseChange={onReleaseChange}
          onHealthChange={onHealthChange}
          onOpenReleaseModal={onOpenReleaseModal}
        />
      )}

      {activeTab === "subscription" && (
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">Sottoscrizioni attive</div>
              <div className="text-[11px] text-slate-500">
                Elenco ticker recuperati da /market-data-service/subscriptions.
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                Se vuoi vedere i messaggi in arrivo, apri{" "}
                <a
                  className="font-semibold text-slate-700 underline-offset-2 hover:underline"
                  href="#/admin/microservice/redisWsBridge"
                >
                  admin/microservice/redisWsBridge
                </a>{" "}
                e vai sul tab Websocket.
              </div>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
              <span>
                {subscriptionStatus === "loading" ? "Caricamento..." : `${subscriptionTickers.length} ticker`}
              </span>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                onClick={fetchSubscriptions}
                disabled={subscriptionStatus === "loading"}
              >
                Aggiorna
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
            <div className="text-[11px] font-semibold text-slate-700">Aggiungi ticker</div>
            <div className="mt-1 text-[11px] text-slate-500">
              Inserisci i simboli separati da virgola. Verranno aggiunti alle sottoscrizioni esistenti.
            </div>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-blue-400 focus:outline-none"
                placeholder="AAPL, NVDA, MSFT"
                value={subscriptionInput}
                onChange={(event) => setSubscriptionInput(event.target.value)}
              />
              <div className="grid w-full grid-cols-2 gap-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                  onClick={handleSubscriptionSave}
                  disabled={subscriptionSaveStatus === "loading"}
                >
                  {subscriptionSaveStatus === "loading" ? "Salvo..." : "Subscribe"}
                </button>
                <button
                  type="button"
                  className={`inline-flex items-center justify-center rounded-md border px-4 py-2 text-[11px] font-semibold ${
                    subscriptionDeleteMode
                      ? "border-rose-200 bg-rose-50 text-rose-700"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                  onClick={() => setSubscriptionDeleteMode((prev) => !prev)}
                >
                  Unsubscribe
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() => {
                    setMarketFieldsModal(true);
                    setMarketFieldsSearch("");
                    setMarketFieldsSaveError(null);
                  }}
                >
                  Richiedi Campi
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={handleSubscriptionResubscribe}
                  disabled={subscriptionSaveStatus === "loading"}
                >
                  Resubscribe
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
              <label className="flex items-center gap-2">
                <span className="font-semibold">Snapshot (min)</span>
                <input
                  type="number"
                  min={1}
                  className="w-16 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 focus:border-blue-400 focus:outline-none"
                  value={snapshotIntervalMin}
                  onChange={(event) => {
                    const next = parseInt(event.target.value, 10);
                    setSnapshotIntervalMin(Number.isFinite(next) && next > 0 ? next : 1);
                  }}
                />
              </label>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                onClick={handleSnapshotIntervalSave}
                disabled={snapshotIntervalStatus === "loading"}
              >
                {snapshotIntervalStatus === "loading" ? "Aggiorno..." : "Aggiorna"}
              </button>
              {snapshotIntervalError && (
                <span className="text-[11px] text-rose-600">{snapshotIntervalError}</span>
              )}
            </div>

            {subscriptionSaveError && (
              <div className="mt-2 text-[11px] text-rose-600">{subscriptionSaveError}</div>
            )}
          </div>

          {subscriptionError && (
            <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">
              {subscriptionError}
            </div>
          )}

          {!subscriptionError && subscriptionStatus !== "loading" && subscriptionTickers.length === 0 && (
            <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
              Nessun ticker sottoscritto.
            </div>
          )}

          {subscriptionTickers.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {subscriptionTickers.map((ticker) => (
                <div
                  key={ticker}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700"
                >
                  <span>{ticker}</span>
                  {subscriptionDeleteMode && (
                    <button
                      type="button"
                      className="text-rose-600 hover:text-rose-700"
                      onClick={() => handleSubscriptionDelete(ticker)}
                      aria-label={`Unsubscribe ${ticker}`}
                    >
                      <AppIcon icon="mdi:trash-can-outline" className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modale Market Fields */}
      {marketFieldsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex w-full max-w-4xl flex-col rounded-xl bg-white p-5 shadow-xl max-h-[85vh]">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <div className="text-base font-semibold text-slate-900">Richiedi campi</div>
                <div className="text-[11px] text-slate-500">
                  Seleziona i campi da richiedere per tutte le sottoscrizioni.
                </div>
              </div>
              <button
                type="button"
                className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => setMarketFieldsModal(false)}
              >
                Chiudi
              </button>
            </div>

            <div className="mb-3 flex flex-wrap items-center gap-3">
              <input
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-700 focus:border-blue-400 focus:outline-none md:w-80"
                placeholder="Cerca per codice, nome o descrizione"
                value={marketFieldsSearch}
                onChange={(event) => setMarketFieldsSearch(event.target.value)}
              />
              <div className="text-[11px] text-slate-500">
                Selezionati: {marketFieldsSelected.length}
              </div>
            </div>

            {marketFieldsError && (
              <div className="mb-2 text-[11px] text-rose-600">{marketFieldsError}</div>
            )}

            <div className="flex-1 overflow-y-auto rounded-md border border-slate-200 bg-slate-50">
              <table className="min-w-full text-left text-[11px] text-slate-700">
                <thead className="bg-slate-100 text-[10px] uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Select</th>
                    <th className="px-3 py-2 font-semibold">Code</th>
                    <th className="px-3 py-2 font-semibold">Name</th>
                    <th className="px-3 py-2 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {marketFieldEntries.map((field) => {
                    const checked = marketFieldsSelectedSet.has(field.code);
                    return (
                      <tr key={field.code} className="hover:bg-white">
                        <td className="px-3 py-2">
                          <input
                            type="checkbox"
                            className="h-3 w-3 rounded border-slate-300"
                            checked={checked}
                            onChange={(event) => {
                              const next = new Set(marketFieldsSelectedSet);
                              if (event.target.checked) {
                                next.add(field.code);
                              } else {
                                next.delete(field.code);
                              }
                              setMarketFieldsSelected(Array.from(next));
                            }}
                          />
                        </td>
                        <td className="px-3 py-2 font-semibold text-slate-800">{field.code}</td>
                        <td className="px-3 py-2">{field.meta.name}</td>
                        <td className="px-3 py-2 text-slate-500">{field.meta.description || "-"}</td>
                      </tr>
                    );
                  })}
                  {marketFieldEntries.length === 0 && (
                    <tr>
                      <td className="px-3 py-3 text-slate-500" colSpan={4}>
                        Nessun campo trovato.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {marketFieldsSaveError && (
              <div className="mt-2 text-[11px] text-rose-600">{marketFieldsSaveError}</div>
            )}

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                className="rounded-md border border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => setMarketFieldsModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-md bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                onClick={handleMarketFieldsSave}
                disabled={marketFieldsSaveStatus === "loading"}
              >
                {marketFieldsSaveStatus === "loading" ? "Richiedo..." : "Richiedi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
