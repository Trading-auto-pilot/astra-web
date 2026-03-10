import React, { useEffect, useMemo, useRef, useState } from "react";
import SectionHeader from "../../molecules/content/SectionHeader";
import BaseButton from "../../atoms/base/buttons/BaseButton";
import AppIcon from "../../atoms/icon/AppIcon";
import MicroserviceGeneralTab from "../../molecules/microservice/MicroserviceGeneralTab";
import { env } from "../../../config/env";
import { IBKR_MARKET_DATA_FIELDS } from "../../../config/ibkrMarketDataFields";
import { redisWsBridgeClient } from "../../../services/ws/redisWsBridgeClient";
import { readStorageJson, writeStorageJson } from "../../../utils/storage";

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

type InfoLabelProps = {
  label: string;
  tip: string;
  required?: boolean;
};

type InfoRowProps = {
  name: string;
  value: React.ReactNode;
  description: string;
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

const splitFieldLabel = (value: string) => {
  const text = String(value || "").trim();
  if (!text) return { name: "-", description: "" };
  const idx = text.indexOf(".");
  if (idx === -1) return { name: text, description: "" };
  const name = text.slice(0, idx + 1).trim();
  const description = text.slice(idx + 1).trim();
  return { name, description };
};

const InfoLabel = ({ label, tip, required }: InfoLabelProps) => (
  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700">
    <span>
      {label}
      {required ? <span className="text-red-500"> *</span> : null}
    </span>
    <span className="cursor-help text-slate-400" title={tip} aria-label={tip}>
      <AppIcon icon="mdi:information-outline" />
    </span>
  </span>
);

const InfoRow = ({ name, value, description }: InfoRowProps) => (
  <div className="flex flex-col gap-1 border-b border-slate-100 py-2 last:border-b-0">
    <div className="text-[11px] font-semibold text-slate-700">
      {name}: <span className="font-normal text-slate-900">{value}</span>
    </div>
    <div className="text-[10px] text-slate-500">{description}</div>
  </div>
);

export default function DecisionEngineMicroservicePage({
  onReleaseChange,
  onHealthChange,
  onOpenReleaseModal,
}: Props) {
  const liveNavStorageKey = "astraai:decision-engine:live-nav";
  const pipeNavStorageKey = "astraai:decision-engine:pipe-exec";
  const readLiveNav = () => {
    return readStorageJson<any | null>(liveNavStorageKey, null);
  };
  const readPipeNav = () => {
    return readStorageJson<any | null>(pipeNavStorageKey, null);
  };

  const [activeTab, setActiveTab] = useState<"general" | "spot" | "pipe" | "live">("general");
  const [release, setRelease] = useState<ReleaseInfo | null>(null);
  const [health, setHealth] = useState<Record<string, any> | null>(null);

  // Live states
  const [liveStatus, setLiveStatus] = useState<Status>("idle");
  const [liveError, setLiveError] = useState<string | null>(null);
  const [liveActive, setLiveActive] = useState<boolean>(false);
  const [liveTickers, setLiveTickers] = useState<string[]>([]);
  const [liveCandles, setLiveCandles] = useState<any[]>([]);
  const [liveMaxRows, setLiveMaxRows] = useState<number>(() => {
    const stored = readLiveNav();
    const val = Number(stored?.maxRows);
    return Number.isFinite(val) && val > 0 ? val : 5;
  });
  const [liveSortBy, setLiveSortBy] = useState<"time" | "ticker">(() => {
    const stored = readLiveNav();
    return stored?.sortBy === "ticker" ? "ticker" : "time";
  });
  const liveUnsubRef = useRef<null | (() => void)>(null);
  const [liveDetailRow, setLiveDetailRow] = useState<any>(null);

  // Spot states
  const [spotSymbol, setSpotSymbol] = useState("");
  const [spotParams, setSpotParams] = useState<Record<string, string>>({
    exchange: "",
    lookbackDays: "",
    lookbackBars: "",
    tf: "",
    confirm: "",
    confirmLookbackDays: "",
    confirmLookbackBars: "",
    confirmTf: "",
    swingWindow: "",
    atrPeriod: "",
    clusterMultiplier: "",
    reactionLookahead: "",
    minTouches: "",
    minScore: "",
    minRecentBars: "",
    recencyRecent: "",
    recencyMid: "",
    weightRecent: "",
    weightMid: "",
    weightOld: "",
    zoneFillK: "",
    breakoutK: "",
    structuralK: "",
    volatilityK: "",
    tpAtrK: "",
  });
  const [spotStatus, setSpotStatus] = useState<Status>("idle");
  const [spotError, setSpotError] = useState<string | null>(null);
  const [spotResult, setSpotResult] = useState<any>(null);
  const [spotPrice, setSpotPrice] = useState<number | null>(null);
  const [spotPriceStatus, setSpotPriceStatus] = useState<Status>("idle");
  const [selectionDebugOpen, setSelectionDebugOpen] = useState(true);

  // Pipe states
  const [pipeList, setPipeList] = useState<any[]>([]);
  const [pipeListStatus, setPipeListStatus] = useState<Status>("idle");
  const [pipeListError, setPipeListError] = useState<string | null>(null);
  const [pipeSelectedId, setPipeSelectedId] = useState<number | null>(() => {
    const stored = readPipeNav();
    const val = Number(stored?.pipeId);
    return Number.isFinite(val) ? val : null;
  });
  const [pipeSelectedDate, setPipeSelectedDate] = useState<string>(() => {
    const stored = readPipeNav();
    if (stored?.date && typeof stored.date === "string") return stored.date;
    const now = new Date();
    return now.toISOString().slice(0, 10);
  });
  const [pipeLimit, setPipeLimit] = useState<number>(() => {
    const stored = readPipeNav();
    const val = Number(stored?.limit);
    return Number.isFinite(val) && val > 0 ? val : 50;
  });
  const [pipeMaxDistanceAtr, setPipeMaxDistanceAtr] = useState<number>(() => {
    if (typeof localStorage === "undefined") return 3;
    const stored = readPipeNav();
    const val = Number(stored?.maxDistanceAtr);
    if (Number.isFinite(val) && val > 0) return val;
    const legacy = Number(localStorage.getItem("astraai:pipe:maxDistanceAtr"));
    return Number.isFinite(legacy) ? legacy : 3;
  });
  const pipeDateRef = useRef<HTMLInputElement | null>(null);
  const [pipeJobId, setPipeJobId] = useState<string | null>(null);
  const [pipeStats, setPipeStats] = useState<any>(null);
  const [pipeResults, setPipeResults] = useState<any[]>([]);
  const [pipeErrors, setPipeErrors] = useState<any[]>([]);
  const [pipeRunStatus, setPipeRunStatus] = useState<Status>("idle");
  const [pipePollStatus, setPipePollStatus] = useState<Status>("idle");
  const [pipePollError, setPipePollError] = useState<string | null>(null);
  const [pipeLatestStatus, setPipeLatestStatus] = useState<Status>("idle");
  const [pipeLatestNote, setPipeLatestNote] = useState<string | null>(null);
  const [pipeShowErrors, setPipeShowErrors] = useState(false);
  const [pipeDetailRow, setPipeDetailRow] = useState<any>(null);

  useEffect(() => {
    const payload = {
      maxRows: liveMaxRows,
      sortBy: liveSortBy,
      date: pipeSelectedDate,
    };
    writeStorageJson(liveNavStorageKey, payload);
  }, [liveMaxRows, liveSortBy, pipeSelectedDate]);

  useEffect(() => {
    const payload = {
      pipeId: pipeSelectedId,
      date: pipeSelectedDate,
      limit: pipeLimit,
      maxDistanceAtr: pipeMaxDistanceAtr,
    };
    writeStorageJson(pipeNavStorageKey, payload);
  }, [pipeSelectedId, pipeSelectedDate, pipeLimit, pipeMaxDistanceAtr]);

  const formatNumber = (value: any, digits = 4) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return value ?? "-";
    return num.toFixed(digits);
  };

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

  const formatPercent = (value: number | null) => {
    if (value === null || !Number.isFinite(value)) return "-";
    return `${value.toFixed(2)}%`;
  };

  const pctDelta = (a: number | null, b: number | null) => {
    if (a === null || b === null || !Number.isFinite(a) || !Number.isFinite(b) || b === 0) return null;
    return ((a - b) / b) * 100;
  };

  useEffect(() => {
    if (!spotResult || !spotSymbol.trim()) {
      setSpotPrice(null);
      setSpotPriceStatus("idle");
      return;
    }

    const symbol = spotSymbol.trim().toUpperCase();
    setSpotPriceStatus("loading");
    fetch(
      `https://financialmodelingprep.com/stable/quote?symbol=${encodeURIComponent(
        symbol
      )}&apikey=${env.fmpApiKey}`
    )
      .then(async (res) => {
        const data = await res.json().catch(() => []);
        if (!res.ok) throw new Error("Price request failed");
        const item = Array.isArray(data) ? data[0] : null;
        const price = Number(item?.price ?? item?.last ?? item?.close);
        if (!Number.isFinite(price)) throw new Error("Price not available");
        setSpotPrice(price);
        setSpotPriceStatus("idle");
      })
      .catch(() => {
        setSpotPrice(null);
        setSpotPriceStatus("error");
      });
  }, [spotResult, spotSymbol]);

  useEffect(() => {
    if (activeTab !== "pipe" && activeTab !== "live") return;
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    setPipeListStatus("loading");
    setPipeListError(null);
    fetch(`${env.apiBaseUrl}/tickerscanner/fundamentals/users/pipes`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then((res) => res.json().catch(() => ({})))
      .then((data) => {
        const rows = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        const enabled = rows.filter((p: any) => p?.enabled === true || p?.enabled === 1 || p?.enabled === "1");
        setPipeList(enabled);
        if (enabled.length && pipeSelectedId === null) {
          setPipeSelectedId(enabled[0]?.id !== undefined ? Number(enabled[0].id) : null);
        }
        setPipeListStatus("idle");
      })
      .catch((err: any) => {
        setPipeListStatus("error");
        setPipeListError(err?.message || "Errore caricamento pipes");
      });
  }, [activeTab, pipeSelectedId]);

  useEffect(() => {
    if (!pipeJobId) return;
    let active = true;
    setPipePollStatus("loading");
    setPipePollError(null);
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;

    let timerId: ReturnType<typeof setInterval> | null = null;
    const poll = async () => {
      try {
        const res = await fetch(
          `${env.apiBaseUrl}/decision-engine/spot-finder/jobs/${encodeURIComponent(pipeJobId)}?limit=${encodeURIComponent(
            pipeLimit
          )}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data?.ok === false) {
          throw new Error(data?.error || data?.message || "Errore poll");
        }
        if (!active) return;
        setPipeStats(data?.stats || null);
        setPipeResults(Array.isArray(data?.results) ? data.results : []);
        setPipeErrors(Array.isArray(data?.errors) ? data.errors : []);
        setPipePollStatus("idle");
        if (
          data?.stats?.status === "completed" ||
          data?.stats?.status === "error" ||
          data?.stats?.status === "canceled"
        ) {
          if (timerId) clearInterval(timerId);
        }
      } catch (err: any) {
        if (!active) return;
        setPipePollStatus("error");
        setPipePollError(err?.message || "Errore polling");
      }
    };

    poll();
    timerId = setInterval(poll, 5000);
    return () => {
      active = false;
      if (timerId) clearInterval(timerId);
    };
  }, [pipeJobId, pipeLimit]);

  useEffect(() => {
    setPipeJobId(null);
    setPipeStats(null);
    setPipeResults([]);
    setPipeErrors([]);
    setPipeRunStatus("idle");
    setPipePollStatus("idle");
    setPipePollError(null);
  }, [pipeSelectedId, pipeSelectedDate]);

  const refreshPipeLatest = async () => {
    if (pipeSelectedId === null || activeTab !== "pipe") return;
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    const dateValue = pipeDateRef.current?.value || pipeSelectedDate;
    const qs = dateValue ? `?date=${encodeURIComponent(dateValue)}` : "";
    setPipeLatestStatus("loading");
    setPipeLatestNote(null);
    try {
      const res = await fetch(
        `${env.apiBaseUrl}/decision-engine/spot-finder/latest/${encodeURIComponent(pipeSelectedId)}${qs}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false || !data?.data) {
        setPipeLatestStatus("error");
        setPipeLatestNote("Non ci sono dati recenti, riesegui l'elaborazione.");
        return;
      }
      setPipeLatestStatus("idle");
      setPipeLatestNote(null);
      const snapshot = data.data;
      setPipeStats(snapshot.stats || null);
      setPipeResults(Array.isArray(snapshot.results) ? snapshot.results : []);
      setPipeErrors(Array.isArray(snapshot.errors) ? snapshot.errors : []);
    } catch {
      setPipeLatestStatus("error");
      setPipeLatestNote("Non ci sono dati recenti, riesegui l'elaborazione.");
    }
  };

  useEffect(() => {
    refreshPipeLatest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pipeSelectedId, pipeSelectedDate, activeTab]);

  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem("astraai:pipe:maxDistanceAtr", String(pipeMaxDistanceAtr));
  }, [pipeMaxDistanceAtr]);

  useEffect(() => {
    if (activeTab !== "live") return;
    if (pipeSelectedId === null) return;
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    setLiveStatus("loading");
    setLiveError(null);
    const qs = pipeSelectedDate ? `?date=${encodeURIComponent(pipeSelectedDate)}` : "";
    fetch(
      `${env.apiBaseUrl}/decision-engine/spot-finder/live/${encodeURIComponent(pipeSelectedId)}/status${qs}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    )
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data?.ok === false) {
          throw new Error(data?.error || data?.message || "Errore live status");
        }
        setLiveActive(Boolean(data?.active));
        setLiveTickers(Array.isArray(data?.tickers) ? data.tickers : []);
        setLiveStatus("idle");
      })
      .catch((err) => {
        setLiveStatus("error");
        setLiveError(err?.message || "Errore nel recupero live status");
      });
  }, [activeTab, pipeSelectedId, pipeSelectedDate]);

  useEffect(() => {
    if (activeTab !== "live") return;
    if (!liveActive) {
      if (liveUnsubRef.current) {
        liveUnsubRef.current();
        liveUnsubRef.current = null;
      }
      setLiveCandles([]);
      return;
    }

    if (liveUnsubRef.current) return;

    liveUnsubRef.current = redisWsBridgeClient.subscribe({
      filter: (payload) => payload && typeof payload === "object" && payload?.type === "marketData",
      onMessage: (payload) => {
        setLiveCandles((prev) => {
          const next = [...prev];
          const key = String(payload?.ticker || payload?.symbol || "");
          const mode = String(payload?.dataMode || "live");
          const idx = key
            ? next.findIndex((item) => {
                const itemKey = String(item?.ticker || item?.symbol || "");
                const itemMode = String(item?.dataMode || "live");
                return itemKey === key && itemMode === mode;
              })
            : -1;
          if (idx >= 0) {
            next[idx] = payload;
          } else {
            next.push(payload);
          }
          return next.slice(-200);
        });
      },
    });

    return () => {
      if (liveUnsubRef.current) {
        liveUnsubRef.current();
        liveUnsubRef.current = null;
      }
    };
  }, [activeTab, liveActive]);

  useEffect(() => {
    if (onReleaseChange) onReleaseChange(release);
  }, [release, onReleaseChange]);

  useEffect(() => {
    if (onHealthChange) onHealthChange(health);
  }, [health, onHealthChange]);

  const pipeDisplayRows = useMemo(() => {
    const base = pipeResults.map((row) => ({ ...row, _type: "result" }));
    if (!pipeShowErrors) return base;
    const errors = pipeErrors.map((row) => ({
      ...row,
      _type: "error",
      exchange: row?.exchange ?? null,
      currentPrice: null,
      levels: row?.levels ?? null,
    }));
    return [...base, ...errors];
  }, [pipeResults, pipeErrors, pipeShowErrors]);

  return (
    <div className="flex flex-1 min-h-0 flex-col gap-4">
      <SectionHeader
        title={
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900">Decision Engine</span>
          </div>
        }
        subTitle=""
        actionComponent={
          onOpenReleaseModal && (
            <BaseButton
              size="sm"
              variant="outline"
              color="neutral"
              startIcon={<AppIcon icon="mdi:information-outline" />}
              onClick={onOpenReleaseModal}
            >
              Release info
            </BaseButton>
          )
        }
      />

      <div className="flex gap-2 border-b border-slate-200">
        <button
          className={`px-3 py-2 text-[11px] font-semibold ${
            activeTab === "general" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
          }`}
          onClick={() => setActiveTab("general")}
        >
          General settings
        </button>
        <button
          className={`px-3 py-2 text-[11px] font-semibold ${
            activeTab === "spot" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
          }`}
          onClick={() => setActiveTab("spot")}
        >
          Swit Spot
        </button>
        <button
          className={`px-3 py-2 text-[11px] font-semibold ${
            activeTab === "pipe" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
          }`}
          onClick={() => setActiveTab("pipe")}
        >
          Pipe Execution
        </button>
        <button
          className={`px-3 py-2 text-[11px] font-semibold ${
            activeTab === "live" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
          }`}
          onClick={() => setActiveTab("live")}
        >
          Live Daily update
        </button>
      </div>

      {activeTab === "general" && (
        <div className="flex-1 min-h-0 flex flex-col">
          <MicroserviceGeneralTab
            microservice="decision-engine"
            onReleaseChange={setRelease}
            onHealthChange={setHealth}
            onOpenReleaseModal={onOpenReleaseModal}
          />
        </div>
      )}

      {activeTab === "live" && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">Live Daily update</div>
              <div className="text-[11px] text-slate-500">
                Avvia il calcolo live sui ticker con trend attivo per la data selezionata.
              </div>
            </div>
            <div className="text-[11px] font-semibold text-slate-500">
              {liveStatus === "loading" ? "Caricamento..." : liveActive ? "Attivo" : "Disattivo"}
            </div>
          </div>

          {pipeSelectedId === null && (
            <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-700">
              Seleziona una pipe per gestire il live.
            </div>
          )}

          {pipeSelectedId !== null && (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <label className="text-[11px] font-semibold text-slate-700">
                Date
                <input
                  type="date"
                  className="mt-1 block rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700"
                  value={pipeSelectedDate || ""}
                  onChange={(event) => setPipeSelectedDate(event.target.value)}
                />
              </label>
              {!liveActive && (
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                  onClick={async () => {
                    const token =
                      typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
                    setLiveStatus("loading");
                    setLiveError(null);
                    const qs = pipeSelectedDate ? `?date=${encodeURIComponent(pipeSelectedDate)}` : "";
                    try {
                      // 1. Avvia live su decision-engine
                      const res = await fetch(
                        `${env.apiBaseUrl}/decision-engine/spot-finder/live/${encodeURIComponent(
                          pipeSelectedId
                        )}${qs}`,
                        {
                          method: "GET",
                          headers: {
                            ...(token ? { Authorization: `Bearer ${token}` } : {}),
                          },
                        }
                      );
                      const data = await res.json().catch(() => ({}));
                      if (!res.ok || data?.ok === false) {
                        throw new Error(data?.error || data?.message || "Errore avvio live");
                      }
                      const tickers = Array.isArray(data?.subscribed) ? data.subscribed : [];

                      // 2. Sottoscrivi i ticker su market-data-service
                      if (tickers.length > 0) {
                        const subscribeRes = await fetch(`${env.apiBaseUrl}/market-data-service/subscriptions`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            ...(token ? { Authorization: `Bearer ${token}` } : {}),
                          },
                          body: JSON.stringify({ tickers }),
                        });
                        const subscribeData = await subscribeRes.json().catch(() => ({}));
                        if (!subscribeRes.ok || subscribeData?.ok === false) {
                          throw new Error(subscribeData?.error || subscribeData?.message || "Errore sottoscrizione ticker");
                        }
                      }

                      setLiveActive(true);
                      setLiveTickers(tickers);
                      setLiveStatus("idle");
                    } catch (err: any) {
                      setLiveStatus("error");
                      setLiveError(err?.message || "Errore avvio live");
                    }
                  }}
                >
                  Start live
                </button>
              )}
              {liveActive && (
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-700 hover:bg-rose-100"
                  onClick={async () => {
                    const token =
                      typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
                    setLiveStatus("loading");
                    setLiveError(null);
                    const qs = pipeSelectedDate ? `?date=${encodeURIComponent(pipeSelectedDate)}` : "";
                    try {
                      // 1. Unsubscribe dai ticker su market-data-service
                      if (liveTickers.length > 0) {
                        await Promise.all(
                          liveTickers.map((ticker) =>
                            fetch(
                              `${env.apiBaseUrl}/market-data-service/subscriptions/${encodeURIComponent(ticker)}`,
                              {
                                method: "DELETE",
                                headers: {
                                  "Content-Type": "application/json",
                                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                                },
                              }
                            )
                          )
                        );
                      }

                      // 2. Ferma live su decision-engine
                      const res = await fetch(
                        `${env.apiBaseUrl}/decision-engine/spot-finder/live/${encodeURIComponent(
                          pipeSelectedId
                        )}${qs}`,
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
                        throw new Error(data?.error || data?.message || "Errore stop live");
                      }
                      setLiveActive(false);
                      setLiveTickers([]);
                      setLiveStatus("idle");
                    } catch (err: any) {
                      setLiveStatus("error");
                      setLiveError(err?.message || "Errore stop live");
                    }
                  }}
                >
                  Stop live
                </button>
              )}
            </div>
          )}

          {liveError && (
            <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">
              {liveError}
            </div>
          )}

          {liveTickers.length > 0 && (
            <div className="mt-4">
              <div className="text-[11px] font-semibold text-slate-700">
                Sottoscrizione attiva per:
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {liveTickers.map((ticker) => (
                  <span
                    key={ticker}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700"
                  >
                    {ticker}
                  </span>
                ))}
              </div>
            </div>
          )}
          {liveActive && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-[11px] font-semibold text-slate-700">
                  Ultime candele (live)
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
                  <label className="flex items-center gap-2">
                    <span className="font-semibold">Max righe</span>
                    <input
                      type="number"
                      min={1}
                      max={200}
                      className="w-16 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 focus:border-blue-400 focus:outline-none"
                      value={liveMaxRows}
                      onChange={(event) => {
                        const next = parseInt(event.target.value, 10);
                        setLiveMaxRows(Number.isFinite(next) && next > 0 ? next : 1);
                      }}
                    />
                  </label>
                  <label className="flex items-center gap-2">
                    <span className="font-semibold">Ordina</span>
                    <select
                      className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 focus:border-blue-400 focus:outline-none"
                      value={liveSortBy}
                      onChange={(event) => setLiveSortBy(event.target.value as "time" | "ticker")}
                    >
                      <option value="time">Time</option>
                      <option value="ticker">Ticker</option>
                    </select>
                  </label>
                </div>
              </div>
              <div className="mt-2 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-[10px] text-slate-700">
                  <thead className="bg-slate-50 text-left uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-2 py-1 font-semibold">Time</th>
                      <th className="px-2 py-1 font-semibold">Ticker</th>
                      <th className="px-2 py-1 font-semibold">Type</th>
                      <th className="px-2 py-1 font-semibold">Price</th>
                      <th className="px-2 py-1 font-semibold">Volume</th>
                      <th className="px-2 py-1 font-semibold">Source</th>
                      <th className="px-2 py-1 font-semibold">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {liveCandles.length === 0 && (
                      <tr>
                        <td className="px-2 py-2 text-slate-500" colSpan={7}>
                          Nessuna candela ricevuta.
                        </td>
                      </tr>
                    )}
                    {liveCandles
                      .slice()
                      .sort((a, b) => {
                        if (liveSortBy === "ticker") {
                          const at = String(a?.ticker || a?.symbol || "");
                          const bt = String(b?.ticker || b?.symbol || "");
                          return at.localeCompare(bt);
                        }
                        const at = Number(a?.ts || 0);
                        const bt = Number(b?.ts || 0);
                        return bt - at;
                      })
                      .slice(0, Math.max(1, liveMaxRows))
                      .map((row, idx) => {
                        const payload = row?.payload || {};
                        const lastPrice = payload?.["31"];
                        const bidPrice = payload?.["84"];
                        const askPrice = payload?.["86"];
                        const lastSize = payload?.["88"];
                        const bidSize = payload?.["85"];
                        const askSize = payload?.["87"];
                        const volume = payload?.["87"] ?? payload?.["72"];
                        let type = "-";
                        let price = "-";
                        let size = "-";
                        if (lastPrice != null) {
                          type = "last";
                          price = lastPrice;
                          size = lastSize ?? "-";
                        } else if (bidPrice != null) {
                          type = "bid";
                          price = bidPrice;
                          size = bidSize ?? "-";
                        } else if (askPrice != null) {
                          type = "ask";
                          price = askPrice;
                          size = askSize ?? "-";
                        }

                        const isSnapshot = row?.dataMode === "snapshot";
                        return (
                          <tr
                            key={`${row?.ts || "row"}-${idx}`}
                            className={isSnapshot ? "bg-amber-50" : ""}
                          >
                            <td className="px-2 py-1 text-slate-600">
                              {row?.ts ? new Date(row.ts).toLocaleTimeString("it-IT") : "-"}
                            </td>
                            <td className="px-2 py-1 font-semibold text-slate-800">
                              {row?.ticker || row?.symbol || "-"}
                            </td>
                            <td className="px-2 py-1">{type}</td>
                            <td className="px-2 py-1">{price}</td>
                            <td className="px-2 py-1">{volume ?? size}</td>
                            <td className="px-2 py-1">
                              {row?.dataMode ? String(row.dataMode) : "-"}
                            </td>
                            <td className="px-2 py-1">
                              <button
                                type="button"
                                className="text-slate-500 hover:text-slate-700"
                                onClick={() => setLiveDetailRow(row)}
                                aria-label="Dettaglio payload"
                              >
                                <AppIcon icon="mdi:eye-outline" className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "spot" && (
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-[11px] text-slate-700">
          <div className="text-xs font-semibold text-slate-700">Swit Spot</div>
          <div className="mt-1 text-[11px] text-slate-500">
            Richiama <span className="font-semibold">/decision-engine/spot-finder</span>.
          </div>
          <form
            className="mt-4 grid gap-3 md:grid-cols-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setSpotStatus("loading");
              setSpotError(null);
              setSpotResult(null);
              const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
              const params = new URLSearchParams();
              params.set("ticker", spotSymbol.trim().toUpperCase());
              Object.entries(spotParams).forEach(([key, value]) => {
                if (value !== undefined && value !== null && String(value).trim() !== "") {
                  params.set(key, String(value).trim());
                }
              });
              try {
                const res = await fetch(`${env.apiBaseUrl}/decision-engine/spot-finder?${params.toString()}`, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                  },
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok || data?.ok === false) {
                  throw new Error(data?.error || data?.message || "Errore spot-finder");
                }
                setSpotResult(data);
                setSpotStatus("idle");
              } catch (err: any) {
                setSpotStatus("error");
                setSpotError(err?.message || "Errore durante la richiesta");
              }
            }}
          >
            <div className="md:col-span-2">
              <label>
                <InfoLabel
                  label="Symbol"
                  required
                  tip="Ticker del titolo da analizzare (obbligatorio)."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotSymbol}
                onChange={(e) => setSpotSymbol(e.target.value)}
                placeholder="NEM"
                required
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Exchange"
                  tip="Borsa di quotazione per risolvere il conid (es. NYSE, NASDAQ, ASX)."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.exchange}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, exchange: e.target.value }))}
                placeholder="NYSE"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Timeframe"
                  tip="Timeframe operativo delle candele (default 1day)."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.tf}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, tf: e.target.value }))}
                placeholder="1day"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Lookback days"
                  tip="Numero giorni di storico da usare per l'analisi."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.lookbackDays}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, lookbackDays: e.target.value }))}
                placeholder="120"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Lookback bars"
                  tip="Numero massimo di barre analizzate."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.lookbackBars}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, lookbackBars: e.target.value }))}
                placeholder="90"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Confirm"
                  tip="Abilita la conferma multi-timeframe (true/false)."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.confirm}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, confirm: e.target.value }))}
                placeholder="true"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Confirm TF"
                  tip="Timeframe di conferma (default 1week)."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.confirmTf}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, confirmTf: e.target.value }))}
                placeholder="1week"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Confirm lookback days"
                  tip="Storico in giorni per la conferma."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.confirmLookbackDays}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, confirmLookbackDays: e.target.value }))}
                placeholder="365"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Confirm lookback bars"
                  tip="Numero barre usate nella conferma."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.confirmLookbackBars}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, confirmLookbackBars: e.target.value }))}
                placeholder="52"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Swing window"
                  tip="Finestra per identificare swing high/low."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.swingWindow}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, swingWindow: e.target.value }))}
                placeholder="3"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="ATR period"
                  tip="Periodo ATR per normalizzare distanze e cluster."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.atrPeriod}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, atrPeriod: e.target.value }))}
                placeholder="20"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Cluster multiplier"
                  tip="Moltiplicatore ATR per unire i livelli vicini."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.clusterMultiplier}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, clusterMultiplier: e.target.value }))}
                placeholder="0.4"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Reaction lookahead"
                  tip="Barre future per misurare la reazione del prezzo."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.reactionLookahead}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, reactionLookahead: e.target.value }))}
                placeholder="15"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Min touches"
                  tip="Minimo numero di tocchi per validare un livello."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.minTouches}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, minTouches: e.target.value }))}
                placeholder="2"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Min score"
                  tip="Soglia minima di score per includere una zona."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.minScore}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, minScore: e.target.value }))}
                placeholder="1"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Min recent bars"
                  tip="Richiede almeno un tocco entro queste barre recenti."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.minRecentBars}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, minRecentBars: e.target.value }))}
                placeholder="60"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Recency recent"
                  tip="Soglia barre per peso 'recent'."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.recencyRecent}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, recencyRecent: e.target.value }))}
                placeholder="30"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Recency mid"
                  tip="Soglia barre per peso 'mid'."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.recencyMid}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, recencyMid: e.target.value }))}
                placeholder="90"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Weight recent"
                  tip="Peso assegnato alle zone recenti."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.weightRecent}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, weightRecent: e.target.value }))}
                placeholder="1"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Weight mid"
                  tip="Peso assegnato alle zone intermedie."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.weightMid}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, weightMid: e.target.value }))}
                placeholder="0.6"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Weight old"
                  tip="Peso assegnato alle zone vecchie."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.weightOld}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, weightOld: e.target.value }))}
                placeholder="0.3"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Zone fill K"
                  tip="Posizione di entry dentro la zona (0-1)."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.zoneFillK}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, zoneFillK: e.target.value }))}
                placeholder="0.55"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Breakout K"
                  tip="Buffer ATR sopra la resistenza per l'ingresso breakout."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.breakoutK}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, breakoutK: e.target.value }))}
                placeholder="0.25"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Structural K"
                  tip="Buffer ATR sotto il supporto per lo stop strutturale."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.structuralK}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, structuralK: e.target.value }))}
                placeholder="0.2"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="Volatility K"
                  tip="Moltiplicatore ATR per stop loss basato su volatilita."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.volatilityK}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, volatilityK: e.target.value }))}
                placeholder="1.2"
              />
            </div>
            <div>
              <label>
                <InfoLabel
                  label="TP ATR K"
                  tip="Moltiplicatore ATR per il take profit di trend."
                />
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={spotParams.tpAtrK}
                onChange={(e) => setSpotParams((prev) => ({ ...prev, tpAtrK: e.target.value }))}
                placeholder="5"
              />
            </div>
            <div className="md:col-span-4 flex justify-end gap-2">
              <BaseButton
                type="button"
                variant="outline"
                color="neutral"
                size="sm"
                onClick={() => {
                  setSpotSymbol("");
                  setSpotParams({
                    exchange: "",
                    lookbackDays: "",
                    lookbackBars: "",
                    tf: "",
                    confirm: "",
                    confirmLookbackDays: "",
                    confirmLookbackBars: "",
                    confirmTf: "",
                    swingWindow: "",
                    atrPeriod: "",
                    clusterMultiplier: "",
                    reactionLookahead: "",
                    minTouches: "",
                    minScore: "",
                    minRecentBars: "",
                    recencyRecent: "",
                    recencyMid: "",
                    weightRecent: "",
                    weightMid: "",
                    weightOld: "",
                    zoneFillK: "",
                    breakoutK: "",
                    structuralK: "",
                    volatilityK: "",
                    tpAtrK: "",
                  });
                  setSpotResult(null);
                  setSpotError(null);
                  setSpotStatus("idle");
                }}
              >
                Cancel
              </BaseButton>
              <BaseButton
                type="submit"
                variant="solid"
                color="primary"
                size="sm"
                disabled={spotStatus === "loading"}
              >
                Submit
              </BaseButton>
            </div>
          </form>
          {spotError && <div className="mt-2 text-[11px] text-red-600">{spotError}</div>}
          {spotStatus === "loading" && <div className="mt-2 text-[11px] text-slate-500">Caricamento...</div>}
          {spotResult && (
            <div className="mt-4 space-y-3">
              <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                <div className="text-xs font-semibold text-slate-700">Summary</div>
                <div className="mt-2">
                  <InfoRow
                    name="atr20"
                    value={formatNumber(spotResult.atr20, 4)}
                    description="Volatilita media (ATR 20) sul timeframe operativo."
                  />
                  <InfoRow
                    name="eps"
                    value={formatNumber(spotResult.eps, 4)}
                    description="Distanza massima per aggregare swing nello stesso livello."
                  />
                  <InfoRow
                    name="window.startDate"
                    value={formatDate(spotResult.window?.startDate)}
                    description="Inizio dello storico analizzato."
                  />
                  <InfoRow
                    name="window.endDate"
                    value={formatDate(spotResult.window?.endDate)}
                    description="Fine dello storico analizzato."
                  />
                  <InfoRow
                    name="priceRef"
                    value={formatNumber(spotResult.priceRef, 4)}
                    description="Prezzo di riferimento usato per supporti/resistenze."
                  />
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                <div className="text-xs font-semibold text-slate-700">Zones</div>
                <div className="mt-2 text-[11px] text-slate-500">
                  Livelli operativi aggregati in zone di prezzo.
                </div>
                {spotResult.mergedZones && (
                  <div className="mt-2 text-[11px] text-slate-500">
                    Zone combinate (daily + recent + intraday): {spotResult.mergedZones?.length ?? 0}
                  </div>
                )}
                <div className="mt-2 overflow-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-xs">
                    <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-3 py-2 font-semibold">Type</th>
                        <th className="px-3 py-2 font-semibold">Struct</th>
                        <th className="px-3 py-2 font-semibold">Relative</th>
                        <th className="px-3 py-2 font-semibold">Mid</th>
                        <th className="px-3 py-2 font-semibold">Low</th>
                        <th className="px-3 py-2 font-semibold">High</th>
                        <th className="px-3 py-2 font-semibold">Width</th>
                        <th className="px-3 py-2 font-semibold">Score</th>
                        <th className="px-3 py-2 font-semibold">Touches</th>
                        <th className="px-3 py-2 font-semibold">Recency</th>
                        <th className="px-3 py-2 font-semibold">Source</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(spotResult.mergedZones || spotResult.zones || []).map((zone: any, idx: number) => (
                        <tr key={`${zone.type}-${idx}`} className="hover:bg-slate-50">
                          <td className="px-3 py-2 font-semibold text-slate-800">{zone.type}</td>
                          <td className="px-3 py-2 text-slate-700">{zone.structType ?? "-"}</td>
                          <td className="px-3 py-2 text-slate-700">{zone.relativeType ?? "-"}</td>
                          <td className="px-3 py-2 text-slate-700">{formatNumber(zone.midPrice, 4)}</td>
                          <td className="px-3 py-2 text-slate-700">{formatNumber(zone.low, 4)}</td>
                          <td className="px-3 py-2 text-slate-700">{formatNumber(zone.high, 4)}</td>
                          <td className="px-3 py-2 text-slate-700">{formatNumber(zone.width, 4)}</td>
                          <td className="px-3 py-2 text-slate-700">{formatNumber(zone.score, 3)}</td>
                          <td className="px-3 py-2 text-slate-700">{zone.touches ?? "-"}</td>
                          <td className="px-3 py-2 text-slate-700">{zone.recencyBars ?? "-"}</td>
                          <td className="px-3 py-2 text-slate-700">{zone.source || "-"}</td>
                        </tr>
                      ))}
                      {(!spotResult.mergedZones && (!spotResult.zones || spotResult.zones.length === 0)) && (
                        <tr>
                          <td className="px-3 py-2 text-slate-500" colSpan={11}>
                            Nessuna zona disponibile.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                <div className="text-xs font-semibold text-slate-700">Levels</div>
                <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="text-[11px] font-semibold text-slate-700">Current price</div>
                  <div className="mt-1 text-[11px] text-slate-700">
                    {spotPriceStatus === "loading"
                      ? "Loading..."
                      : spotPriceStatus === "error"
                        ? "-"
                        : formatNumber(spotPrice, 4)}
                  </div>
                  <div className="text-[10px] text-slate-500">Prezzo attuale del titolo (FMP quote).</div>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {[
                    { key: "retracement", label: "Ritracciamento", description: "Entry vicina al supporto." },
                    { key: "breakout", label: "Breakout", description: "Entry sopra la resistenza." },
                  ].map((block) => {
                    const data = spotResult.levels?.[block.key];
                    const entry = data?.entryLimit ?? null;
                    return (
                      <div key={block.key} className="rounded-md border border-slate-200 bg-white px-3 py-2">
                        <div className="text-[11px] font-semibold text-slate-700">{block.label}</div>
                        <div className="text-[10px] text-slate-500">{block.description}</div>
                        <div className="mt-1 text-[11px] text-slate-700">
                          {block.key === "breakout"
                            ? `Actionable: ${spotResult.levels?.actionableBreakout ? "YES" : "NO"}`
                            : `Actionable: ${spotResult.levels?.actionablePullback ? "YES" : "NO"}`}
                        </div>
                        {block.key === "breakout" && !spotResult.levels?.actionableBreakout && data?.reason && (
                          <div className="text-[10px] text-slate-500">Reason: {data.reason}</div>
                        )}
                        {block.key === "retracement" && !spotResult.levels?.actionablePullback && data?.reason && (
                          <div className="text-[10px] text-slate-500">Reason: {data.reason}</div>
                        )}
                        <div className="mt-2">
                          <InfoRow
                            name="entryLimit"
                            value={
                              spotPriceStatus === "loading"
                                ? `${formatNumber(entry, 4)} (Loading...)`
                                : `${formatNumber(entry, 4)} (${formatPercent(
                                    pctDelta(entry, spotPrice)
                                  )})`
                            }
                            description="Prezzo di ingresso suggerito."
                          />
                          <InfoRow
                            name="stopLoss"
                            value={`${formatNumber(data?.stopLoss, 4)} (${formatPercent(
                              pctDelta(data?.stopLoss, entry)
                            )})`}
                            description="Stop loss rispetto all'entry."
                          />
                          <InfoRow
                            name="takeProfit1"
                            value={
                              data?.takeProfit1
                                ? `${formatNumber(data?.takeProfit1, 4)} (${formatPercent(
                                    pctDelta(data?.takeProfit1, entry)
                                  )})`
                                : "-"
                            }
                            description="TP tecnico sulla prossima resistenza."
                          />
                          <InfoRow
                            name="takeProfit2"
                            value={`${formatNumber(data?.takeProfit2, 4)} (${formatPercent(
                              pctDelta(data?.takeProfit2, entry)
                            )})`}
                            description="TP di trend basato su ATR."
                          />
                          <InfoRow
                            name="risk"
                            value={formatNumber(data?.risk, 4)}
                            description="Rischio per azione (entry - stop)."
                          />
                        </div>
                        <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                          <div className="text-[11px] font-semibold text-slate-700">Rule</div>
                          <div className="mt-1 grid gap-2 md:grid-cols-2">
                            {block.key === "retracement" && (
                              <InfoRow
                                name="zoneFillK"
                                value={data?.rule?.zoneFillK ?? "-"}
                                description="Posizione percentuale dentro la zona."
                              />
                            )}
                            {block.key === "breakout" && (
                              <InfoRow
                                name="breakoutK"
                                value={data?.rule?.breakoutK ?? "-"}
                                description="Buffer ATR sopra la resistenza."
                              />
                            )}
                            <InfoRow
                              name="structuralK"
                              value={data?.rule?.structuralK ?? "-"}
                              description="Buffer ATR per lo stop strutturale."
                            />
                            <InfoRow
                              name="volatilityK"
                              value={data?.rule?.volatilityK ?? "-"}
                              description="Moltiplicatore ATR per stop loss."
                            />
                            <InfoRow
                              name="tpAtrK"
                              value={data?.rule?.tpAtrK ?? "-"}
                              description="Moltiplicatore ATR per TP trend."
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                <div className="text-xs font-semibold text-slate-700">Signal</div>
                {spotResult.signal ? (
                  <>
                    <div className="mt-2">
                      <InfoRow
                        name="timeframe"
                        value={spotResult.signal.timeframe || "-"}
                        description="Timeframe usato per il pattern detection."
                      />
                      <InfoRow
                        name="lookbackDays"
                        value={spotResult.signal.lookbackDays ?? "-"}
                        description="Periodo storico per il segnale."
                      />
                      <InfoRow
                        name="lookbackBars"
                        value={spotResult.signal.lookbackBars ?? "-"}
                        description="Numero barre analizzate per il segnale."
                      />
                      <InfoRow
                        name="atr20"
                        value={formatNumber(spotResult.signal.atr20, 4)}
                        description="ATR calcolato sul timeframe di segnale."
                      />
                      <InfoRow
                        name="stats.rawCandles"
                        value={spotResult.signal.stats?.rawCandles ?? "-"}
                        description="Candele ricevute dal provider (signal)."
                      />
                      <InfoRow
                        name="stats.filteredCandles"
                        value={spotResult.signal.stats?.filteredCandles ?? "-"}
                        description="Candele valide dopo filtro (signal)."
                      />
                      <InfoRow
                        name="window.startDate"
                        value={formatDate(spotResult.signal.window?.startDate)}
                        description="Inizio finestra segnale."
                      />
                      <InfoRow
                        name="window.endDate"
                        value={formatDate(spotResult.signal.window?.endDate)}
                        description="Fine finestra segnale."
                      />
                    </div>
                    <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                      <div className="text-[11px] font-semibold text-slate-700">Pattern</div>
                      <div className="mt-1 grid gap-2 md:grid-cols-2">
                        <InfoRow
                          name="trendOk"
                          value={
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                spotResult.signal.pattern?.trendOk
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {spotResult.signal.pattern?.trendOk ? "YES" : "NO"}
                            </span>
                          }
                          description="Trend positivo su EMA20/EMA50."
                        />
                        <InfoRow
                          name="flagOk"
                          value={
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                spotResult.signal.pattern?.flagOk
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {spotResult.signal.pattern?.flagOk ? "YES" : "NO"}
                            </span>
                          }
                          description="Flag valido con compressione range/volume."
                        />
                        <InfoRow
                          name="breakoutOk"
                          value={
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                spotResult.signal.pattern?.breakoutOk
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {spotResult.signal.pattern?.breakoutOk ? "YES" : "NO"}
                            </span>
                          }
                          description="Breakout confermato da close+volume."
                        />
                      <InfoRow
                        name="pullbackOk"
                        value={
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              spotResult.signal.pattern?.pullbackOk
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {spotResult.signal.pattern?.pullbackOk ? "YES" : "NO"}
                          </span>
                        }
                        description="Pullback valido con re-test del livello."
                      />
                      <InfoRow
                        name="ema20Last"
                        value={formatNumber(spotResult.signal.pattern?.debug?.ema20Last, 4)}
                        description="Ultimo valore EMA20 sul timeframe segnale."
                      />
                      <InfoRow
                        name="ema50Last"
                        value={formatNumber(spotResult.signal.pattern?.debug?.ema50Last, 4)}
                        description="Ultimo valore EMA50 sul timeframe segnale."
                      />
                      <InfoRow
                        name="lastClose"
                        value={formatNumber(spotResult.signal.pattern?.debug?.lastClose, 4)}
                        description="Ultimo close del timeframe segnale."
                      />
                      <InfoRow
                        name="volLast"
                        value={formatNumber(spotResult.signal.pattern?.debug?.volLast, 4)}
                        description="Volume dell'ultima candela."
                      />
                      <InfoRow
                        name="volMA20"
                        value={formatNumber(spotResult.signal.pattern?.debug?.volMA20, 4)}
                        description="Media volume 20 periodi."
                      />
                      <InfoRow
                        name="flagRange"
                        value={formatNumber(spotResult.signal.pattern?.debug?.flagRange, 4)}
                        description="Ampiezza del flag."
                      />
                      <InfoRow
                        name="atrLast"
                        value={formatNumber(spotResult.signal.pattern?.debug?.atrLast, 4)}
                        description="ATR dell'ultima candela segnale."
                      />
                        <InfoRow
                          name="breakLevel"
                          value={formatNumber(spotResult.signal.pattern?.breakLevel, 4)}
                          description="Livello di breakout del flag."
                        />
                        <InfoRow
                          name="flagHigh"
                          value={formatNumber(spotResult.signal.pattern?.flagHigh, 4)}
                          description="Massimo del flag."
                        />
                        <InfoRow
                          name="flagLow"
                          value={formatNumber(spotResult.signal.pattern?.flagLow, 4)}
                          description="Minimo del flag."
                        />
                        <InfoRow
                          name="entryBreakout"
                          value={formatNumber(spotResult.signal.pattern?.entryBreakout, 4)}
                          description="Entry breakout suggerita dal pattern."
                        />
                        <InfoRow
                          name="entryPullback"
                          value={formatNumber(spotResult.signal.pattern?.entryPullback, 4)}
                          description="Entry pullback suggerita dal pattern."
                        />
                        <InfoRow
                          name="stopLoss"
                          value={formatNumber(spotResult.signal.pattern?.stopLoss, 4)}
                          description="Stop loss da pattern."
                        />
                        <InfoRow
                          name="tp1"
                          value={formatNumber(spotResult.signal.pattern?.targets?.tp1, 4)}
                          description="Target 1 da pattern."
                        />
                        <InfoRow
                          name="tp2"
                          value={formatNumber(spotResult.signal.pattern?.targets?.tp2, 4)}
                          description="Target 2 da pattern."
                        />
                        <InfoRow
                          name="confidence"
                          value={spotResult.signal.pattern?.confidence ?? "-"}
                          description="Confidenza pattern (0-100)."
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="mt-2 text-[11px] text-slate-500">Segnale non disponibile.</div>
                )}
              </div>

              <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                <div className="text-xs font-semibold text-slate-700">Confirm</div>
                {spotResult.confirm ? (
                  <>
                    <div className="mt-2">
                      <InfoRow
                        name="timeframe"
                        value={spotResult.confirm.timeframe || "-"}
                        description="Timeframe usato per la conferma."
                      />
                      <InfoRow
                        name="lookbackDays"
                        value={spotResult.confirm.lookbackDays ?? "-"}
                        description="Periodo storico della conferma."
                      />
                      <InfoRow
                        name="lookbackBars"
                        value={spotResult.confirm.lookbackBars ?? "-"}
                        description="Numero barre usate nella conferma."
                      />
                      <InfoRow
                        name="atr20"
                        value={formatNumber(spotResult.confirm.atr20, 4)}
                        description="ATR calcolato sul timeframe di conferma."
                      />
                      <InfoRow
                        name="eps"
                        value={formatNumber(spotResult.confirm.eps, 4)}
                        description="Eps usato per clustering sul timeframe di conferma."
                      />
                      <InfoRow
                        name="window.startDate"
                        value={formatDate(spotResult.confirm.window?.startDate)}
                        description="Inizio dello storico di conferma."
                      />
                      <InfoRow
                        name="window.endDate"
                        value={formatDate(spotResult.confirm.window?.endDate)}
                        description="Fine dello storico di conferma."
                      />
                    </div>
                    <div className="mt-3 text-[11px] text-slate-500">
                      Zone di conferma disponibili: {spotResult.confirm.zones?.length ?? 0}
                    </div>
                  </>
                ) : (
                  <div className="mt-2 text-[11px] text-slate-500">Conferma non disponibile.</div>
                )}
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                  <div className="text-xs font-semibold text-slate-700">Recent (1h)</div>
                  {spotResult.recent ? (
                    <>
                      <div className="mt-2">
                        <InfoRow
                          name="timeframe"
                          value={spotResult.recent.timeframe || "-"}
                          description="Timeframe recente per livelli operativi."
                        />
                        <InfoRow
                          name="lookbackDays"
                          value={spotResult.recent.lookbackDays ?? "-"}
                          description="Periodo recente analizzato."
                        />
                        <InfoRow
                          name="lookbackBars"
                          value={spotResult.recent.lookbackBars ?? "-"}
                          description="Numero barre recenti."
                        />
                        <InfoRow
                          name="atr20"
                          value={formatNumber(spotResult.recent.atr20, 4)}
                          description="ATR calcolato su timeframe recente."
                        />
                        <InfoRow
                          name="eps"
                          value={formatNumber(spotResult.recent.eps, 4)}
                          description="Eps usato per clustering recente."
                        />
                        <InfoRow
                          name="window.startDate"
                          value={formatDate(spotResult.recent.window?.startDate)}
                          description="Inizio dello storico recente."
                        />
                        <InfoRow
                          name="window.endDate"
                          value={formatDate(spotResult.recent.window?.endDate)}
                          description="Fine dello storico recente."
                        />
                      </div>
                      <div className="mt-3 text-[11px] text-slate-500">
                        Zone recenti disponibili: {spotResult.recent.zones?.length ?? 0}
                      </div>
                    </>
                  ) : (
                    <div className="mt-2 text-[11px] text-slate-500">Dati recenti non disponibili.</div>
                  )}
                </div>

                <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                  <div className="text-xs font-semibold text-slate-700">Intraday (1m)</div>
                  {spotResult.intraday ? (
                    <>
                      <div className="mt-2">
                        <InfoRow
                          name="timeframe"
                          value={spotResult.intraday.timeframe || "-"}
                          description="Timeframe intraday per livelli rapidi."
                        />
                        <InfoRow
                          name="lookbackDays"
                          value={spotResult.intraday.lookbackDays ?? "-"}
                          description="Periodo intraday analizzato."
                        />
                        <InfoRow
                          name="lookbackBars"
                          value={spotResult.intraday.lookbackBars ?? "-"}
                          description="Numero barre intraday."
                        />
                        <InfoRow
                          name="atr20"
                          value={formatNumber(spotResult.intraday.atr20, 4)}
                          description="ATR calcolato su timeframe intraday."
                        />
                        <InfoRow
                          name="eps"
                          value={formatNumber(spotResult.intraday.eps, 4)}
                          description="Eps usato per clustering intraday."
                        />
                        <InfoRow
                          name="window.startDate"
                          value={formatDate(spotResult.intraday.window?.startDate)}
                          description="Inizio dello storico intraday."
                        />
                        <InfoRow
                          name="window.endDate"
                          value={formatDate(spotResult.intraday.window?.endDate)}
                          description="Fine dello storico intraday."
                        />
                      </div>
                      <div className="mt-3 text-[11px] text-slate-500">
                        Zone intraday disponibili: {spotResult.intraday.zones?.length ?? 0}
                      </div>
                    </>
                  ) : (
                    <div className="mt-2 text-[11px] text-slate-500">Dati intraday non disponibili.</div>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                <div className="text-xs font-semibold text-slate-700">Debug</div>
                <div className="mt-2 grid gap-3 md:grid-cols-2">
                  <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    <div className="text-[11px] font-semibold text-slate-700">Price Debug</div>
                    <InfoRow
                      name="priceRef"
                      value={formatNumber(spotResult.priceDebug?.priceRef, 4)}
                      description="Prezzo di riferimento usato."
                    />
                    <InfoRow
                      name="dailyLastClose"
                      value={formatNumber(spotResult.priceDebug?.dailyLastClose, 4)}
                      description="Ultimo close daily."
                    />
                    <InfoRow
                      name="recentLastClose"
                      value={formatNumber(spotResult.priceDebug?.recentLastClose, 4)}
                      description="Ultimo close 1h."
                    />
                    <InfoRow
                      name="signalLastClose"
                      value={formatNumber(spotResult.priceDebug?.signalLastClose, 4)}
                      description="Ultimo close timeframe segnale."
                    />
                    <InfoRow
                      name="providerSymbol"
                      value={spotResult.priceDebug?.providerSymbol ?? "-"}
                      description="Symbol usato per richieste candles."
                    />
                  </div>

                  <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    <div className="text-[11px] font-semibold text-slate-700">ATR Debug</div>
                    <InfoRow
                      name="avgHL"
                      value={formatNumber(spotResult.atrDebug?.avgHL, 6)}
                      description="Media high-low (ultime 200 barre)."
                    />
                    <InfoRow
                      name="medianHL"
                      value={formatNumber(spotResult.atrDebug?.medianHL, 6)}
                      description="Mediana high-low (ultime 200 barre)."
                    />
                    <InfoRow
                      name="minHL"
                      value={formatNumber(spotResult.atrDebug?.minHL, 6)}
                      description="Minimo high-low (ultime 200 barre)."
                    />
                    <InfoRow
                      name="maxHL"
                      value={formatNumber(spotResult.atrDebug?.maxHL, 6)}
                      description="Massimo high-low (ultime 200 barre)."
                    />
                    <InfoRow
                      name="avgTR"
                      value={formatNumber(spotResult.atrDebug?.avgTR, 6)}
                      description="Media TR (ultime 200 barre)."
                    />
                    <InfoRow
                      name="atrLast"
                      value={formatNumber(spotResult.atrDebug?.atrLast, 6)}
                      description="Ultimo ATR (timeframe segnale)."
                    />
                    <InfoRow
                      name="atrTail"
                      value={(spotResult.atrDebug?.atrTail || []).map((v: number) => formatNumber(v, 6)).join(", ") || "-"}
                      description="Ultimi 5 ATR."
                    />
                  </div>
                </div>

                <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-semibold text-slate-700">Selection Debug</div>
                    <button
                      type="button"
                      className="rounded-full border border-slate-200 bg-white p-1 text-slate-500 hover:text-slate-700"
                      onClick={() => setSelectionDebugOpen((prev) => !prev)}
                      aria-label={selectionDebugOpen ? "Collapse selection debug" : "Expand selection debug"}
                    >
                      <AppIcon icon={selectionDebugOpen ? "mdi:chevron-up" : "mdi:chevron-down"} width={14} height={14} />
                    </button>
                  </div>
                  {selectionDebugOpen && (
                    <div className="mt-2">
                      <InfoRow
                        name="usedAtrForTrading"
                        value={
                          spotResult.selectionDebug?.usedAtrForTrading
                            ? `${formatNumber(spotResult.selectionDebug.usedAtrForTrading.value, 6)} (${spotResult.selectionDebug.usedAtrForTrading.source}/${spotResult.selectionDebug.usedAtrForTrading.timeframe})`
                            : "-"
                        }
                        description="ATR usato per entry/SL/TP."
                      />
                      <InfoRow
                        name="usedTimeframeForLevels"
                        value={spotResult.selectionDebug?.usedTimeframeForLevels ?? "-"}
                        description="Timeframe usato per livelli."
                      />
                      <InfoRow
                        name="maxLevelDistanceAtr"
                        value={formatNumber(spotResult.selectionDebug?.maxLevelDistanceAtr, 2)}
                        description="Soglia massima distanza in ATR per i supporti."
                      />
                      <InfoRow
                        name="supportsWithinAtrCount"
                        value={spotResult.selectionDebug?.supportsWithinAtrCount ?? "-"}
                        description="Numero supporti entro la soglia ATR."
                      />
                      <InfoRow
                        name="supportHigherScoreWithinAtr"
                        value={spotResult.selectionDebug?.supportHigherScoreWithinAtr ? "YES" : "NO"}
                        description="Esiste un supporto con score maggiore dentro soglia."
                      />
                      <InfoRow
                        name="selectedSupport.midPrice"
                        value={formatNumber(spotResult.selectionDebug?.selectedSupport?.midPrice, 4)}
                        description="Supporto selezionato."
                      />
                      <InfoRow
                        name="selectedResistance.midPrice"
                        value={formatNumber(spotResult.selectionDebug?.selectedResistance?.midPrice, 4)}
                        description="Resistenza selezionata."
                      />
                      <InfoRow
                        name="distancePct"
                        value={formatPercent(spotResult.selectionDebug?.distancePct)}
                        description="Distanza % dal supporto selezionato."
                      />
                      <InfoRow
                        name="distanceAtr"
                        value={formatNumber(spotResult.selectionDebug?.distanceAtr, 4)}
                        description="Distanza in ATR dal supporto selezionato."
                      />
                    </div>
                  )}
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    <div className="text-[11px] font-semibold text-slate-700">Supports Top 5</div>
                    <div className="mt-2 overflow-auto">
                      <table className="min-w-full divide-y divide-slate-200 text-[10px]">
                        <thead className="bg-white text-left text-[10px] uppercase tracking-wide text-slate-500">
                          <tr>
                            <th className="px-2 py-1">Mid</th>
                            <th className="px-2 py-1">Low</th>
                            <th className="px-2 py-1">High</th>
                            <th className="px-2 py-1">Score</th>
                            <th className="px-2 py-1">Touches</th>
                            <th className="px-2 py-1">Recency</th>
                            <th className="px-2 py-1">Source</th>
                            <th className="px-2 py-1">TF</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {(spotResult.selectionDebug?.supportsTop5 || []).map((zone: any, idx: number) => (
                            <tr key={`support-${idx}`} className="hover:bg-white/50">
                              <td className="px-2 py-1">{formatNumber(zone.midPrice, 4)}</td>
                              <td className="px-2 py-1">{formatNumber(zone.low, 4)}</td>
                              <td className="px-2 py-1">{formatNumber(zone.high, 4)}</td>
                              <td className="px-2 py-1">{formatNumber(zone.score, 3)}</td>
                              <td className="px-2 py-1">{zone.touches ?? "-"}</td>
                              <td className="px-2 py-1">{zone.recencyBars ?? "-"}</td>
                              <td className="px-2 py-1">{zone.source ?? "-"}</td>
                              <td className="px-2 py-1">{zone.timeframe ?? "-"}</td>
                            </tr>
                          ))}
                          {(!spotResult.selectionDebug?.supportsTop5 || spotResult.selectionDebug.supportsTop5.length === 0) && (
                            <tr>
                              <td className="px-2 py-1 text-slate-500" colSpan={8}>
                                Nessun supporto.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    <div className="text-[11px] font-semibold text-slate-700">Resistances Top 5</div>
                    <div className="mt-2 overflow-auto">
                      <table className="min-w-full divide-y divide-slate-200 text-[10px]">
                        <thead className="bg-white text-left text-[10px] uppercase tracking-wide text-slate-500">
                          <tr>
                            <th className="px-2 py-1">Mid</th>
                            <th className="px-2 py-1">Low</th>
                            <th className="px-2 py-1">High</th>
                            <th className="px-2 py-1">Score</th>
                            <th className="px-2 py-1">Touches</th>
                            <th className="px-2 py-1">Recency</th>
                            <th className="px-2 py-1">Source</th>
                            <th className="px-2 py-1">TF</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {(spotResult.selectionDebug?.resistancesTop5 || []).map((zone: any, idx: number) => (
                            <tr key={`res-${idx}`} className="hover:bg-white/50">
                              <td className="px-2 py-1">{formatNumber(zone.midPrice, 4)}</td>
                              <td className="px-2 py-1">{formatNumber(zone.low, 4)}</td>
                              <td className="px-2 py-1">{formatNumber(zone.high, 4)}</td>
                              <td className="px-2 py-1">{formatNumber(zone.score, 3)}</td>
                              <td className="px-2 py-1">{zone.touches ?? "-"}</td>
                              <td className="px-2 py-1">{zone.recencyBars ?? "-"}</td>
                              <td className="px-2 py-1">{zone.source ?? "-"}</td>
                              <td className="px-2 py-1">{zone.timeframe ?? "-"}</td>
                            </tr>
                          ))}
                          {(!spotResult.selectionDebug?.resistancesTop5 || spotResult.selectionDebug.resistancesTop5.length === 0) && (
                            <tr>
                              <td className="px-2 py-1 text-slate-500" colSpan={8}>
                                Nessuna resistenza.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="text-[11px] font-semibold text-slate-700">Resistance Debug</div>
                  <InfoRow
                    name="countResistancesAbovePrice"
                    value={spotResult.resistanceDebug?.countResistancesAbovePrice ?? "-"}
                    description="Numero resistenze sopra priceRef."
                  />
                  <div className="mt-2 overflow-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-[10px]">
                      <thead className="bg-white text-left text-[10px] uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="px-2 py-1">Mid</th>
                          <th className="px-2 py-1">Source</th>
                          <th className="px-2 py-1">Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(spotResult.resistanceDebug?.top5 || []).map((zone: any, idx: number) => (
                          <tr key={`res-top-${idx}`} className="hover:bg-white/50">
                            <td className="px-2 py-1">{formatNumber(zone.midPrice, 4)}</td>
                            <td className="px-2 py-1">{zone.source ?? "-"}</td>
                            <td className="px-2 py-1">{formatNumber(zone.score, 3)}</td>
                          </tr>
                        ))}
                        {(!spotResult.resistanceDebug?.top5 || spotResult.resistanceDebug.top5.length === 0) && (
                          <tr>
                            <td className="px-2 py-1 text-slate-500" colSpan={3}>
                              Nessuna resistenza sopra priceRef.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="text-[11px] font-semibold text-slate-700">Pattern Trend Debug</div>
                  <InfoRow
                    name="ema20Last"
                    value={formatNumber(spotResult.signal?.pattern?.debug?.trend?.ema20Last, 4)}
                    description="EMA20 ultimo valore."
                  />
                  <InfoRow
                    name="ema50Last"
                    value={formatNumber(spotResult.signal?.pattern?.debug?.trend?.ema50Last, 4)}
                    description="EMA50 ultimo valore."
                  />
                  <InfoRow
                    name="emaSpreadPct"
                    value={formatPercent(spotResult.signal?.pattern?.debug?.trend?.emaSpreadPct)}
                    description="Differenza EMA20/EMA50 in %."
                  />
                  <InfoRow
                    name="aboveEma20Count"
                    value={spotResult.signal?.pattern?.debug?.trend?.aboveEma20Count ?? "-"}
                    description="Barre sopra EMA20 (ultime 12)."
                  />
                  <InfoRow
                    name="consideredBars"
                    value={spotResult.signal?.pattern?.debug?.trend?.consideredBars ?? "-"}
                    description="Barre valide considerate."
                  />
                  {spotResult.signal?.pattern?.debug?.last12 && (
                    <div className="mt-2 overflow-auto">
                      <table className="min-w-full divide-y divide-slate-200 text-[10px]">
                        <thead className="bg-white text-left text-[10px] uppercase tracking-wide text-slate-500">
                          <tr>
                            <th className="px-2 py-1">Time</th>
                            <th className="px-2 py-1">Close</th>
                            <th className="px-2 py-1">EMA20</th>
                            <th className="px-2 py-1">Above</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {spotResult.signal.pattern.debug.last12.map((row: any, idx: number) => (
                            <tr key={`last12-${idx}`} className="hover:bg-white/50">
                              <td className="px-2 py-1">{formatDate(row.t)}</td>
                              <td className="px-2 py-1">{formatNumber(row.close, 4)}</td>
                              <td className="px-2 py-1">{formatNumber(row.ema20, 4)}</td>
                              <td className="px-2 py-1">{row.above === null ? "-" : row.above ? "YES" : "NO"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "pipe" && (
        <div className="flex-1 min-h-0 overflow-y-auto rounded-lg border border-slate-200 bg-white px-3 py-3 pb-[5px] text-[11px] text-slate-700">
          <div className="text-xs font-semibold text-slate-700">Pipe Execution</div>
          <div className="mt-1 text-[11px] text-slate-500">
            Avvia <span className="font-semibold">/decision-engine/spot-finder/:pipeId</span> in async e mostra i risultati parziali.
          </div>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <div className="min-w-[220px]">
              <label className="text-[11px] font-semibold text-slate-700">Pipe</label>
              <select
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={pipeSelectedId ?? ""}
                onChange={(e) => setPipeSelectedId(e.target.value === "" ? null : Number(e.target.value))}
              >
                <option value="">Seleziona pipe</option>
                {pipeList.map((pipe: any) => (
                  <option key={pipe.id} value={pipe.id}>
                    {pipe.name || `Pipe ${pipe.id}`}
                  </option>
                ))}
              </select>
              {pipeListStatus === "loading" && <div className="mt-1 text-[10px] text-slate-500">Caricamento...</div>}
              {pipeListStatus === "error" && pipeListError && (
                <div className="mt-1 text-[10px] text-red-600">{pipeListError}</div>
              )}
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-700">Date</label>
              <input
                type="date"
                className="mt-1 w-full min-w-[160px] rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={pipeSelectedDate}
                onChange={(e) => setPipeSelectedDate(e.target.value)}
                ref={pipeDateRef}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-700">Limit</label>
              <input
                type="number"
                min={1}
                max={500}
                className="mt-1 w-full min-w-[120px] rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={pipeLimit}
                onChange={(e) => setPipeLimit(Number(e.target.value) || 1)}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-700">Max distance ATR</label>
              <input
                type="number"
                min={0.5}
                step={0.1}
                className="mt-1 w-full min-w-[140px] rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={pipeMaxDistanceAtr}
                onChange={(e) => setPipeMaxDistanceAtr(Number(e.target.value) || 0.5)}
              />
            </div>
            <button
              className="rounded-md bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              disabled={pipeSelectedId === null || pipeRunStatus === "loading"}
              onClick={async () => {
                const cacheValue = "true";
                const dateValue = pipeDateRef.current?.value || pipeSelectedDate;
                const maxDistanceValue = Number.isFinite(pipeMaxDistanceAtr) ? pipeMaxDistanceAtr : 3;
                if (pipeSelectedId === null) return;
                setPipeRunStatus("loading");
                setPipePollError(null);
                setPipeStats(null);
                setPipeResults([]);
                setPipeErrors([]);
                const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
                try {
                  const res = await fetch(
                    `${env.apiBaseUrl}/decision-engine/spot-finder/${encodeURIComponent(
                      pipeSelectedId
                    )}?cache=${cacheValue}&date=${encodeURIComponent(
                      dateValue
                    )}&maxLevelDistanceAtr=${encodeURIComponent(maxDistanceValue)}`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                      },
                    }
                  );
                  const data = await res.json().catch(() => ({}));
                  if (!res.ok || data?.ok === false) {
                    throw new Error(data?.error || data?.message || "Errore avvio pipe");
                  }
                  setPipeJobId(data?.jobId || null);
                  setPipeStats(data?.stats || null);
                  setPipeRunStatus("idle");
                } catch (err: any) {
                  setPipeRunStatus("error");
                  setPipePollError(err?.message || "Errore avvio pipe");
                }
              }}
            >
              {pipeRunStatus === "loading" ? "Running..." : "Run"}
            </button>
            <button
              className="rounded-md border border-slate-300 px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
              disabled={pipeSelectedId === null || pipeLatestStatus === "loading"}
              onClick={refreshPipeLatest}
            >
              Refresh
            </button>
            <button
              className="rounded-md border border-slate-300 px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
              disabled={pipeSelectedId === null || pipeRunStatus === "loading"}
              onClick={async () => {
                const cacheValue = "false";
                const dateValue = pipeDateRef.current?.value || pipeSelectedDate;
                const maxDistanceValue = Number.isFinite(pipeMaxDistanceAtr) ? pipeMaxDistanceAtr : 3;
                if (pipeSelectedId === null) return;
                setPipeRunStatus("loading");
                setPipePollError(null);
                setPipeStats(null);
                setPipeResults([]);
                setPipeErrors([]);
                const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
                try {
                  const res = await fetch(
                    `${env.apiBaseUrl}/decision-engine/spot-finder/${encodeURIComponent(
                      pipeSelectedId
                    )}?cache=${cacheValue}&date=${encodeURIComponent(
                      dateValue
                    )}&maxLevelDistanceAtr=${encodeURIComponent(maxDistanceValue)}`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                      },
                    }
                  );
                  const data = await res.json().catch(() => ({}));
                  if (!res.ok || data?.ok === false) {
                    throw new Error(data?.error || data?.message || "Errore avvio pipe");
                  }
                  setPipeJobId(data?.jobId || null);
                  setPipeStats(data?.stats || null);
                  setPipeRunStatus("idle");
                } catch (err: any) {
                  setPipeRunStatus("error");
                  setPipePollError(err?.message || "Errore avvio pipe");
                }
              }}
            >
              Force reload
            </button>
            <button
              className="rounded-md border border-rose-200 bg-rose-600 px-4 py-2 text-[12px] font-semibold text-white hover:bg-rose-500 disabled:opacity-50"
              disabled={!pipeJobId || pipeStats?.status !== "running"}
              onClick={async () => {
                if (!pipeJobId) return;
                const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
                try {
                  const res = await fetch(
                    `${env.apiBaseUrl}/decision-engine/spot-finder/jobs/${encodeURIComponent(pipeJobId)}/stop`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                      },
                    }
                  );
                  const data = await res.json().catch(() => ({}));
                  if (!res.ok || data?.ok === false) {
                    throw new Error(data?.error || data?.message || "Errore stop job");
                  }
                  setPipeStats((prev: any) => ({
                    ...(prev || {}),
                    status: data?.status || "canceled",
                    finishedAt: data?.finishedAt || new Date().toISOString(),
                  }));
                } catch (err: any) {
                  setPipePollError(err?.message || "Errore stop job");
                }
              }}
            >
              Stop
            </button>
          </div>

          <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
            <div className="flex flex-wrap items-center gap-3">
              <div className="font-semibold">Status:</div>
              <div>{pipeStats?.status || "-"}</div>
              <div className="font-semibold">Processed:</div>
              <div>
                {pipeStats?.processed ?? 0}/{pipeStats?.total ?? 0}
              </div>
              <div className="font-semibold">Remaining:</div>
              <div>{pipeStats?.remaining ?? "-"}</div>
              <div className="font-semibold">OK:</div>
              <div>{pipeStats?.ok ?? "-"}</div>
              <div className="font-semibold">Errors:</div>
              <div>{pipeStats?.errorCount ?? "-"}</div>
              <div className="font-semibold">Cache used:</div>
              <div>{pipeStats?.cachedUsed ? "YES" : "NO"}</div>
              <div className="font-semibold">Cached:</div>
              <div>{pipeStats?.cachedCount ?? "-"}</div>
              {pipeJobId && (
                <>
                  <div className="font-semibold">Job:</div>
                  <div className="text-slate-900">{pipeJobId}</div>
                </>
              )}
            </div>
            {pipeStats?.status === "running" && (
              <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-emerald-500"
                  style={{
                    width: `${
                      pipeStats?.total ? Math.min(100, Math.max(0, (pipeStats.processed / pipeStats.total) * 100)) : 0
                    }%`,
                  }}
                />
              </div>
            )}
          </div>

          {pipeLatestStatus === "error" && pipeLatestNote && (
            <div className="mt-2 text-[11px] text-amber-700">{pipeLatestNote}</div>
          )}

          {pipePollStatus === "loading" && <div className="mt-2 text-[11px] text-slate-500">Aggiornamento...</div>}
          {pipePollStatus === "error" && pipePollError && <div className="mt-2 text-[11px] text-red-600">{pipePollError}</div>}

          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-700">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                checked={pipeShowErrors}
                onChange={(e) => setPipeShowErrors(e.target.checked)}
              />
              Mostra anche errori
            </label>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-[11px]">
              <thead className="bg-slate-50 text-left text-[10px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2 font-semibold">#</th>
                  <th className="px-3 py-2 font-semibold">Symbol</th>
                  <th className="px-3 py-2 font-semibold">Type</th>
                  <th className="px-3 py-2 font-semibold">Exchange</th>
                  <th className="px-3 py-2 font-semibold">Current</th>
                  <th className="px-3 py-2 font-semibold">Retracement</th>
                  <th className="px-3 py-2 font-semibold">Breakout</th>
                  <th className="px-3 py-2 font-semibold">Trend</th>
                  <th className="px-3 py-2 font-semibold">Flag</th>
                  <th className="px-3 py-2 font-semibold">Breakout OK</th>
                  <th className="px-3 py-2 font-semibold">Pullback OK</th>
                  <th className="px-3 py-2 font-semibold">ATR Fit</th>
                  <th className="px-3 py-2 font-semibold">Last touch</th>
                  <th className="px-3 py-2 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pipeDisplayRows.map((row: any, idx: number) => {
                  const retracement = row?.levels?.retracement;
                  const breakout = row?.levels?.breakout;
                  const pattern = row?.fullResult?.signal?.pattern;
                  const atrFit = row?.fullResult?.selectionDebug?.supportsWithinAtrCount > 0;
                  const retrEntry = Number(retracement?.entryLimit);
                  const brkEntry = Number(breakout?.entryLimit);
                  const isError = row?._type === "error" || Boolean(row?.error);
                  return (
                    <tr key={`${row.ticker}-${idx}`} className="hover:bg-slate-50">
                      <td className="px-3 py-2 text-slate-500">{idx + 1}</td>
                      <td className="px-3 py-2 font-semibold text-slate-900">
                        {row.ticker ? (
                          <a
                            className="text-slate-900 underline-offset-2 hover:underline"
                            href={`#/dashboard/tickers/${encodeURIComponent(String(row.ticker))}`}
                          >
                            {row.ticker}
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {row.asset_type === "ETF" ? (
                          <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold bg-violet-100 text-violet-700">ETF</span>
                        ) : row.asset_type === "EQUITY" ? (
                          <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold bg-sky-100 text-sky-700">EQ</span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-slate-700">{row.exchange || "-"}</td>
                      <td className="px-3 py-2 text-slate-700">{formatNumber(row.currentPrice, 4)}</td>
                      <td className="px-3 py-2 text-slate-700">
                        {isError ? (
                          <span className="text-[10px] text-rose-600">{row?.error || "Errore"}</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex h-2.5 w-2.5 rounded-full ${
                                retracement?.actionable ? "bg-emerald-500" : "bg-rose-500"
                              }`}
                            />
                            <span className="font-semibold">{formatNumber(retrEntry, 4)}</span>
                            <span className="text-[10px] text-slate-500">
                              {formatPercent(pctDelta(retrEntry, row.currentPrice))}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 text-slate-700">
                        {isError ? (
                          <span className="text-[10px] text-rose-600">{row?.error || "Errore"}</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex h-2.5 w-2.5 rounded-full ${
                                breakout?.actionable ? "bg-emerald-500" : "bg-rose-500"
                              }`}
                            />
                            <span className="font-semibold">{formatNumber(brkEntry, 4)}</span>
                            <span className="text-[10px] text-slate-500">
                              {formatPercent(pctDelta(brkEntry, row.currentPrice))}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 text-slate-700">
                        {isError ? (
                          <span className="text-[10px] text-rose-600">Errore</span>
                        ) : (
                          <span
                            className={`inline-flex h-2.5 w-2.5 rounded-full ${
                              pattern?.trendOk ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                            title={pattern?.trendOk ? "YES" : "NO"}
                          />
                        )}
                      </td>
                      <td className="px-3 py-2 text-slate-700">
                        {isError ? (
                          <span className="text-[10px] text-rose-600">Errore</span>
                        ) : (
                          <span
                            className={`inline-flex h-2.5 w-2.5 rounded-full ${
                              pattern?.flagOk ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                            title={pattern?.flagOk ? "YES" : "NO"}
                          />
                        )}
                      </td>
                      <td className="px-3 py-2 text-slate-700">
                        {isError ? (
                          <span className="text-[10px] text-rose-600">Errore</span>
                        ) : (
                          <span
                            className={`inline-flex h-2.5 w-2.5 rounded-full ${
                              pattern?.breakoutOk ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                            title={pattern?.breakoutOk ? "YES" : "NO"}
                          />
                        )}
                      </td>
                      <td className="px-3 py-2 text-slate-700">
                        {isError ? (
                          <span className="text-[10px] text-rose-600">Errore</span>
                        ) : (
                          <span
                            className={`inline-flex h-2.5 w-2.5 rounded-full ${
                              pattern?.pullbackOk ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                            title={pattern?.pullbackOk ? "YES" : "NO"}
                          />
                        )}
                      </td>
                      <td className="px-3 py-2 text-slate-700">
                        {isError ? (
                          <span className="text-[10px] text-rose-600">Errore</span>
                        ) : (
                          <span
                            className={`inline-flex h-2.5 w-2.5 rounded-full ${
                              atrFit ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                            title={atrFit ? "Supporto entro ATR" : "Nessun supporto entro ATR"}
                          />
                        )}
                      </td>
                      <td className="px-3 py-2 text-slate-700">
                        {row?.lastTouchAt ? formatDateTime(row.lastTouchAt) : "-"}
                      </td>
                      <td className="px-3 py-2 text-slate-700">
                        <button
                          type="button"
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100"
                          onClick={() => setPipeDetailRow(row)}
                          aria-label="Dettagli"
                        >
                          <AppIcon icon="mdi:eye-outline" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {pipeDisplayRows.length === 0 && (
                  <tr>
                    <td className="px-3 py-3 text-slate-500" colSpan={13}>
                      Nessun risultato disponibile.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {liveDetailRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex w-full max-w-2xl flex-col rounded-xl bg-white p-5 shadow-xl max-h-[80vh]">
            {(() => {
              const payload = liveDetailRow?.payload || {};
              const ticker = liveDetailRow?.ticker || liveDetailRow?.symbol || "-";
              const mappedPayload = Object.fromEntries(
                Object.entries(payload || {}).map(([key, value]) => {
                  const label = IBKR_MARKET_DATA_FIELDS[key];
                  if (!label) return [key, value];
                  const { name } = splitFieldLabel(label);
                  const fieldName = name.replace(/\.$/, "");
                  return [fieldName || key, value];
                })
              );
              return (
                <>
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <div className="text-base font-semibold text-slate-900">{ticker}</div>
                      <div className="text-[11px] text-slate-500">Dettaglio messaggio websocket</div>
                    </div>
                    <button
                      type="button"
                      className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      onClick={() => setLiveDetailRow(null)}
                    >
                      Chiudi
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto pr-1">
                    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
                      <div className="text-xs font-semibold text-slate-800">Message</div>
                      <div className="mt-2 grid gap-2 text-[11px] text-slate-700">
                        <div>
                          <span className="font-semibold">Type:</span> {liveDetailRow?.type || "-"}
                        </div>
                        <div>
                          <span className="font-semibold">Conid:</span> {liveDetailRow?.conid || "-"}
                        </div>
                        <div>
                          <span className="font-semibold">Channel:</span> {liveDetailRow?.__channel || "-"}
                        </div>
                        <div>
                          <span className="font-semibold">Source:</span> {liveDetailRow?.__source || "-"}
                        </div>
                        <div>
                          <span className="font-semibold">Timestamp:</span>{" "}
                          {liveDetailRow?.ts ? new Date(liveDetailRow.ts).toLocaleString("it-IT") : "-"}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
                      <div className="text-xs font-semibold text-slate-800">Payload</div>
                      <pre className="mt-2 max-h-64 overflow-y-auto whitespace-pre-wrap break-words text-[10px] text-slate-600">
                        {JSON.stringify(mappedPayload, null, 2)}
                      </pre>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {pipeDetailRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex w-full max-w-3xl flex-col rounded-xl bg-white p-5 shadow-xl max-h-[85vh]">
            {(() => {
              const detail = pipeDetailRow.fullResult || pipeDetailRow;
              const current = Number.isFinite(detail?.priceRef)
                ? detail.priceRef
                : pipeDetailRow.currentPrice;
              const retracement = detail?.levels?.retracement;
              const breakout = detail?.levels?.breakout;
              const params = detail?.params || pipeDetailRow?.params || null;
              return (
                <>
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <div className="text-base font-semibold text-slate-900">
                        {pipeDetailRow.ticker || detail?.ticker || "Ticker"}
                      </div>
                      <div className="text-[11px] text-slate-500">Dettaglio esecuzione spot-finder</div>
                    </div>
                    <button
                      type="button"
                      className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      onClick={() => setPipeDetailRow(null)}
                    >
                      Chiudi
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto pr-1">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-700">
                        <div className="text-xs font-semibold text-slate-800">Overview</div>
                        <div className="mt-2 space-y-1">
                          <div>
                            <span className="font-semibold">Symbol:</span>{" "}
                            {pipeDetailRow.ticker || detail?.ticker || "-"}
                          </div>
                          <div>
                            <span className="font-semibold">Exchange:</span> {pipeDetailRow.exchange || "-"}
                          </div>
                          <div>
                            <span className="font-semibold">Current price:</span> {formatNumber(current, 4)}
                          </div>
                        </div>
                      </div>
                      <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-700">
                        <div className="text-xs font-semibold text-slate-800">Status</div>
                        <div className="mt-2 space-y-1">
                          <div>
                            <span className="font-semibold">Retracement actionable:</span>{" "}
                            {retracement?.actionable ? "YES" : "NO"}
                          </div>
                          <div>
                            <span className="font-semibold">Breakout actionable:</span>{" "}
                            {breakout?.actionable ? "YES" : "NO"}
                          </div>
                          {pipeDetailRow?.error && (
                            <div className="text-rose-600">
                              <span className="font-semibold">Error:</span> {pipeDetailRow.error}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="rounded-md border border-slate-200 bg-white p-3 text-[11px] text-slate-700">
                        <div className="text-xs font-semibold text-slate-800">Retracement</div>
                        <div className="mt-2 space-y-1">
                          <div>
                            <span className="font-semibold">Entry limit:</span> {formatNumber(retracement?.entryLimit, 4)}{" "}
                            <span className="text-slate-500">
                              ({formatPercent(pctDelta(retracement?.entryLimit, current))})
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold">Stop loss:</span> {formatNumber(retracement?.stopLoss, 4)}
                          </div>
                          <div>
                            <span className="font-semibold">TP1:</span> {formatNumber(retracement?.takeProfit1, 4)}
                          </div>
                          <div>
                            <span className="font-semibold">TP2:</span> {formatNumber(retracement?.takeProfit2, 4)}
                          </div>
                          <div>
                            <span className="font-semibold">Risk:</span> {formatNumber(retracement?.risk, 4)}
                          </div>
                        </div>
                      </div>
                      <div className="rounded-md border border-slate-200 bg-white p-3 text-[11px] text-slate-700">
                        <div className="text-xs font-semibold text-slate-800">Breakout</div>
                        <div className="mt-2 space-y-1">
                          <div>
                            <span className="font-semibold">Entry limit:</span> {formatNumber(breakout?.entryLimit, 4)}{" "}
                            <span className="text-slate-500">
                              ({formatPercent(pctDelta(breakout?.entryLimit, current))})
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold">Stop loss:</span> {formatNumber(breakout?.stopLoss, 4)}
                          </div>
                          <div>
                            <span className="font-semibold">TP1:</span> {formatNumber(breakout?.takeProfit1, 4)}
                          </div>
                          <div>
                            <span className="font-semibold">TP2:</span> {formatNumber(breakout?.takeProfit2, 4)}
                          </div>
                          <div>
                            <span className="font-semibold">Risk:</span> {formatNumber(breakout?.risk, 4)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 space-y-3">
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                        <div className="text-xs font-semibold text-slate-700">Summary</div>
                        <div className="mt-2">
                          <InfoRow
                            name="atr20"
                            value={formatNumber(detail?.atr20, 4)}
                            description="Volatilita media (ATR 20) sul timeframe operativo."
                          />
                          <InfoRow
                            name="eps"
                            value={formatNumber(detail?.eps, 4)}
                            description="Distanza massima per aggregare swing nello stesso livello."
                          />
                          <InfoRow
                            name="window.startDate"
                            value={formatDate(detail?.window?.startDate)}
                            description="Inizio dello storico analizzato."
                          />
                          <InfoRow
                            name="window.endDate"
                            value={formatDate(detail?.window?.endDate)}
                            description="Fine dello storico analizzato."
                          />
                          <InfoRow
                            name="priceRef"
                            value={formatNumber(detail?.priceRef, 4)}
                            description="Prezzo di riferimento usato per supporti/resistenze."
                          />
                        </div>
                      </div>
                      {params && (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                          <div className="text-xs font-semibold text-slate-700">Params</div>
                          <div className="mt-2 grid gap-2 md:grid-cols-2">
                            {[
                              { key: "lookbackDays", label: "lookbackDays" },
                              { key: "lookbackBars", label: "lookbackBars" },
                              { key: "tf", label: "tf" },
                              { key: "confirm", label: "confirm" },
                              { key: "confirmLookbackDays", label: "confirmLookbackDays" },
                              { key: "confirmLookbackBars", label: "confirmLookbackBars" },
                              { key: "confirmTf", label: "confirmTf" },
                              { key: "recentLookbackDays", label: "recentLookbackDays" },
                              { key: "recentLookbackBars", label: "recentLookbackBars" },
                              { key: "recentTf", label: "recentTf" },
                              { key: "intradayLookbackDays", label: "intradayLookbackDays" },
                              { key: "intradayLookbackBars", label: "intradayLookbackBars" },
                              { key: "intradayTf", label: "intradayTf" },
                              { key: "signalLookbackDays", label: "signalLookbackDays" },
                              { key: "signalLookbackBars", label: "signalLookbackBars" },
                              { key: "signalTf", label: "signalTf" },
                              { key: "swingWindow", label: "swingWindow" },
                              { key: "atrPeriod", label: "atrPeriod" },
                              { key: "clusterMultiplier", label: "clusterMultiplier" },
                              { key: "reactionLookahead", label: "reactionLookahead" },
                              { key: "minTouches", label: "minTouches" },
                              { key: "minScore", label: "minScore" },
                              { key: "minRecentBars", label: "minRecentBars" },
                              { key: "recencyRecent", label: "recencyRecent" },
                              { key: "recencyMid", label: "recencyMid" },
                              { key: "weightRecent", label: "weightRecent" },
                              { key: "weightMid", label: "weightMid" },
                              { key: "weightOld", label: "weightOld" },
                              { key: "zoneFillK", label: "zoneFillK" },
                              { key: "breakoutK", label: "breakoutK" },
                              { key: "structuralK", label: "structuralK" },
                              { key: "volatilityK", label: "volatilityK" },
                              { key: "tpAtrK", label: "tpAtrK" },
                              { key: "flagAtrK", label: "flagAtrK" },
                              { key: "flagPctK", label: "flagPctK" },
                              { key: "volMult", label: "volMult" },
                              { key: "minStopAtrK", label: "minStopAtrK" },
                              { key: "minTp2AtrK", label: "minTp2AtrK" },
                            ].map((item) => (
                              <InfoRow
                                key={item.key}
                                name={item.label}
                                value={
                                  Number.isFinite(Number(params[item.key]))
                                    ? formatNumber(Number(params[item.key]), 4)
                                    : params[item.key] ?? "-"
                                }
                                description="Parametro usato per il calcolo."
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                        <div className="text-xs font-semibold text-slate-700">Zones</div>
                        <div className="mt-2 text-[11px] text-slate-500">
                          Livelli operativi aggregati in zone di prezzo.
                        </div>
                        {detail?.mergedZones && (
                          <div className="mt-2 text-[11px] text-slate-500">
                            Zone combinate (daily + recent + intraday): {detail?.mergedZones?.length ?? 0}
                          </div>
                        )}
                        <div className="mt-2 overflow-auto">
                          <table className="min-w-full divide-y divide-slate-200 text-xs">
                            <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
                              <tr>
                                <th className="px-3 py-2 font-semibold">Type</th>
                                <th className="px-3 py-2 font-semibold">Struct</th>
                                <th className="px-3 py-2 font-semibold">Relative</th>
                                <th className="px-3 py-2 font-semibold">Mid</th>
                                <th className="px-3 py-2 font-semibold">Low</th>
                                <th className="px-3 py-2 font-semibold">High</th>
                                <th className="px-3 py-2 font-semibold">Width</th>
                                <th className="px-3 py-2 font-semibold">Score</th>
                                <th className="px-3 py-2 font-semibold">Touches</th>
                                <th className="px-3 py-2 font-semibold">Recency</th>
                                <th className="px-3 py-2 font-semibold">Source</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {(detail?.mergedZones || detail?.zones || []).map((zone: any, idx: number) => (
                                <tr key={`${zone.type}-${idx}`} className="hover:bg-slate-50">
                                  <td className="px-3 py-2 font-semibold text-slate-800">{zone.type}</td>
                                  <td className="px-3 py-2 text-slate-700">{zone.structType ?? "-"}</td>
                                  <td className="px-3 py-2 text-slate-700">{zone.relativeType ?? "-"}</td>
                                  <td className="px-3 py-2 text-slate-700">{formatNumber(zone.midPrice, 4)}</td>
                                  <td className="px-3 py-2 text-slate-700">{formatNumber(zone.low, 4)}</td>
                                  <td className="px-3 py-2 text-slate-700">{formatNumber(zone.high, 4)}</td>
                                  <td className="px-3 py-2 text-slate-700">{formatNumber(zone.width, 4)}</td>
                                  <td className="px-3 py-2 text-slate-700">{formatNumber(zone.score, 3)}</td>
                                  <td className="px-3 py-2 text-slate-700">{zone.touches ?? "-"}</td>
                                  <td className="px-3 py-2 text-slate-700">{zone.recencyBars ?? "-"}</td>
                                  <td className="px-3 py-2 text-slate-700">{zone.source || "-"}</td>
                                </tr>
                              ))}
                              {(!detail?.mergedZones && (!detail?.zones || detail?.zones.length === 0)) && (
                                <tr>
                                  <td className="px-3 py-2 text-slate-500" colSpan={11}>
                                    Nessuna zona disponibile.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                        <div className="text-xs font-semibold text-slate-700">Levels</div>
                        <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                          <div className="text-[11px] font-semibold text-slate-700">Current price</div>
                          <div className="mt-1 text-[11px] text-slate-700">{formatNumber(current, 4)}</div>
                          <div className="text-[10px] text-slate-500">Prezzo attuale del titolo.</div>
                        </div>
                        <div className="mt-3 grid gap-3 md:grid-cols-2">
                          {[
                            { key: "retracement", label: "Ritracciamento", description: "Entry vicina al supporto." },
                            { key: "breakout", label: "Breakout", description: "Entry sopra la resistenza." },
                          ].map((block) => {
                            const data = detail?.levels?.[block.key];
                            const entry = data?.entryLimit ?? null;
                            return (
                              <div key={block.key} className="rounded-md border border-slate-200 bg-white px-3 py-2">
                                <div className="text-[11px] font-semibold text-slate-700">{block.label}</div>
                                <div className="text-[10px] text-slate-500">{block.description}</div>
                                <div className="mt-1 text-[11px] text-slate-700">
                                  {block.key === "breakout"
                                    ? `Actionable: ${detail?.levels?.actionableBreakout ? "YES" : "NO"}`
                                    : `Actionable: ${detail?.levels?.actionablePullback ? "YES" : "NO"}`}
                                </div>
                                {block.key === "breakout" && !detail?.levels?.actionableBreakout && data?.reason && (
                                  <div className="text-[10px] text-slate-500">Reason: {data.reason}</div>
                                )}
                                {block.key === "retracement" && !detail?.levels?.actionablePullback && data?.reason && (
                                  <div className="text-[10px] text-slate-500">Reason: {data.reason}</div>
                                )}
                                <div className="mt-2">
                                  <InfoRow
                                    name="entryLimit"
                                    value={`${formatNumber(entry, 4)} (${formatPercent(pctDelta(entry, current))})`}
                                    description="Prezzo di ingresso suggerito."
                                  />
                                  <InfoRow
                                    name="stopLoss"
                                    value={`${formatNumber(data?.stopLoss, 4)} (${formatPercent(
                                      pctDelta(data?.stopLoss, entry)
                                    )})`}
                                    description="Stop loss rispetto all'entry."
                                  />
                                  <InfoRow
                                    name="takeProfit1"
                                    value={
                                      data?.takeProfit1
                                        ? `${formatNumber(data?.takeProfit1, 4)} (${formatPercent(
                                            pctDelta(data?.takeProfit1, entry)
                                          )})`
                                        : "-"
                                    }
                                    description="TP tecnico sulla prossima resistenza."
                                  />
                                  <InfoRow
                                    name="takeProfit2"
                                    value={`${formatNumber(data?.takeProfit2, 4)} (${formatPercent(
                                      pctDelta(data?.takeProfit2, entry)
                                    )})`}
                                    description="TP di trend basato su ATR."
                                  />
                                  <InfoRow
                                    name="risk"
                                    value={formatNumber(data?.risk, 4)}
                                    description="Rischio per azione (entry - stop)."
                                  />
                                </div>
                                <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                                  <div className="text-[11px] font-semibold text-slate-700">Rule</div>
                                  <div className="mt-1 grid gap-2 md:grid-cols-2">
                                    {block.key === "retracement" && (
                                      <InfoRow
                                        name="zoneFillK"
                                        value={data?.rule?.zoneFillK ?? "-"}
                                        description="Posizione percentuale dentro la zona."
                                      />
                                    )}
                                    {block.key === "breakout" && (
                                      <InfoRow
                                        name="breakoutK"
                                        value={data?.rule?.breakoutK ?? "-"}
                                        description="Buffer ATR sopra la resistenza."
                                      />
                                    )}
                                    <InfoRow
                                      name="structuralK"
                                      value={data?.rule?.structuralK ?? "-"}
                                      description="Buffer ATR per lo stop strutturale."
                                    />
                                    <InfoRow
                                      name="volatilityK"
                                      value={data?.rule?.volatilityK ?? "-"}
                                      description="Moltiplicatore ATR per stop loss."
                                    />
                                    <InfoRow
                                      name="tpAtrK"
                                      value={data?.rule?.tpAtrK ?? "-"}
                                      description="Moltiplicatore ATR per TP trend."
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                        <div className="text-xs font-semibold text-slate-700">Signal</div>
                        {detail?.signal ? (
                          <>
                            <div className="mt-2">
                              <InfoRow
                                name="timeframe"
                                value={detail?.signal?.timeframe || "-"}
                                description="Timeframe usato per il pattern detection."
                              />
                              <InfoRow
                                name="lookbackDays"
                                value={detail?.signal?.lookbackDays ?? "-"}
                                description="Periodo storico per il segnale."
                              />
                              <InfoRow
                                name="lookbackBars"
                                value={detail?.signal?.lookbackBars ?? "-"}
                                description="Numero barre analizzate per il segnale."
                              />
                              <InfoRow
                                name="atr20"
                                value={formatNumber(detail?.signal?.atr20, 4)}
                                description="ATR calcolato sul timeframe di segnale."
                              />
                              <InfoRow
                                name="stats.rawCandles"
                                value={detail?.signal?.stats?.rawCandles ?? "-"}
                                description="Candele ricevute dal provider (signal)."
                              />
                              <InfoRow
                                name="stats.filteredCandles"
                                value={detail?.signal?.stats?.filteredCandles ?? "-"}
                                description="Candele valide dopo filtro (signal)."
                              />
                              <InfoRow
                                name="window.startDate"
                                value={formatDate(detail?.signal?.window?.startDate)}
                                description="Inizio finestra segnale."
                              />
                              <InfoRow
                                name="window.endDate"
                                value={formatDate(detail?.signal?.window?.endDate)}
                                description="Fine finestra segnale."
                              />
                            </div>
                            <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                              <div className="text-[11px] font-semibold text-slate-700">Pattern</div>
                              <div className="mt-1 grid gap-2 md:grid-cols-2">
                                <InfoRow
                                  name="trendOk"
                                  value={
                                    <span
                                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                        detail?.signal?.pattern?.trendOk
                                          ? "bg-emerald-100 text-emerald-700"
                                          : "bg-red-100 text-red-700"
                                      }`}
                                    >
                                      {detail?.signal?.pattern?.trendOk ? "YES" : "NO"}
                                    </span>
                                  }
                                  description="Trend positivo su EMA20/EMA50."
                                />
                                <InfoRow
                                  name="flagOk"
                                  value={
                                    <span
                                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                        detail?.signal?.pattern?.flagOk
                                          ? "bg-emerald-100 text-emerald-700"
                                          : "bg-red-100 text-red-700"
                                      }`}
                                    >
                                      {detail?.signal?.pattern?.flagOk ? "YES" : "NO"}
                                    </span>
                                  }
                                  description="Flag valido con compressione range/volume."
                                />
                                <InfoRow
                                  name="breakoutOk"
                                  value={
                                    <span
                                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                        detail?.signal?.pattern?.breakoutOk
                                          ? "bg-emerald-100 text-emerald-700"
                                          : "bg-red-100 text-red-700"
                                      }`}
                                    >
                                      {detail?.signal?.pattern?.breakoutOk ? "YES" : "NO"}
                                    </span>
                                  }
                                  description="Breakout confermato da close+volume."
                                />
                                <InfoRow
                                  name="pullbackOk"
                                  value={
                                    <span
                                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                        detail?.signal?.pattern?.pullbackOk
                                          ? "bg-emerald-100 text-emerald-700"
                                          : "bg-red-100 text-red-700"
                                      }`}
                                    >
                                      {detail?.signal?.pattern?.pullbackOk ? "YES" : "NO"}
                                    </span>
                                  }
                                  description="Pullback valido con re-test del livello."
                                />
                                <InfoRow
                                  name="ema20Last"
                                  value={formatNumber(detail?.signal?.pattern?.debug?.ema20Last, 4)}
                                  description="Ultimo valore EMA20 sul timeframe segnale."
                                />
                                <InfoRow
                                  name="ema50Last"
                                  value={formatNumber(detail?.signal?.pattern?.debug?.ema50Last, 4)}
                                  description="Ultimo valore EMA50 sul timeframe segnale."
                                />
                                <InfoRow
                                  name="lastClose"
                                  value={formatNumber(detail?.signal?.pattern?.debug?.lastClose, 4)}
                                  description="Ultimo close del timeframe segnale."
                                />
                                <InfoRow
                                  name="volLast"
                                  value={formatNumber(detail?.signal?.pattern?.debug?.volLast, 4)}
                                  description="Volume dell'ultima candela."
                                />
                                <InfoRow
                                  name="volMA20"
                                  value={formatNumber(detail?.signal?.pattern?.debug?.volMA20, 4)}
                                  description="Media volume 20 periodi."
                                />
                                <InfoRow
                                  name="flagRange"
                                  value={formatNumber(detail?.signal?.pattern?.debug?.flagRange, 4)}
                                  description="Ampiezza del flag."
                                />
                                <InfoRow
                                  name="atrLast"
                                  value={formatNumber(detail?.signal?.pattern?.debug?.atrLast, 4)}
                                  description="ATR dell'ultima candela segnale."
                                />
                                <InfoRow
                                  name="breakLevel"
                                  value={formatNumber(detail?.signal?.pattern?.breakLevel, 4)}
                                  description="Livello di breakout del flag."
                                />
                                <InfoRow
                                  name="flagHigh"
                                  value={formatNumber(detail?.signal?.pattern?.flagHigh, 4)}
                                  description="Massimo del flag."
                                />
                                <InfoRow
                                  name="flagLow"
                                  value={formatNumber(detail?.signal?.pattern?.flagLow, 4)}
                                  description="Minimo del flag."
                                />
                                <InfoRow
                                  name="entryBreakout"
                                  value={formatNumber(detail?.signal?.pattern?.entryBreakout, 4)}
                                  description="Entry breakout suggerita."
                                />
                                <InfoRow
                                  name="entryPullback"
                                  value={formatNumber(detail?.signal?.pattern?.entryPullback, 4)}
                                  description="Entry pullback suggerita."
                                />
                                <InfoRow
                                  name="stopLoss"
                                  value={formatNumber(detail?.signal?.pattern?.stopLoss, 4)}
                                  description="Stop loss pattern-based."
                                />
                                <InfoRow
                                  name="tp1"
                                  value={formatNumber(detail?.signal?.pattern?.targets?.tp1, 4)}
                                  description="Target tecnico."
                                />
                                <InfoRow
                                  name="tp2"
                                  value={formatNumber(detail?.signal?.pattern?.targets?.tp2, 4)}
                                  description="Target di trend."
                                />
                                <InfoRow
                                  name="confidence"
                                  value={detail?.signal?.pattern?.confidence ?? "-"}
                                  description="Score di confidenza pattern."
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="mt-2 text-[11px] text-slate-500">Segnale non disponibile.</div>
                        )}
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                        <div className="text-xs font-semibold text-slate-700">Confirm</div>
                        {detail?.confirm ? (
                          <>
                            <div className="mt-2">
                              <InfoRow
                                name="timeframe"
                                value={detail?.confirm?.timeframe || "-"}
                                description="Timeframe di conferma."
                              />
                              <InfoRow
                                name="lookbackDays"
                                value={detail?.confirm?.lookbackDays ?? "-"}
                                description="Periodo storico per la conferma."
                              />
                              <InfoRow
                                name="lookbackBars"
                                value={detail?.confirm?.lookbackBars ?? "-"}
                                description="Numero barre di conferma."
                              />
                              <InfoRow
                                name="atr20"
                                value={formatNumber(detail?.confirm?.atr20, 4)}
                                description="ATR calcolato su timeframe di conferma."
                              />
                              <InfoRow
                                name="eps"
                                value={formatNumber(detail?.confirm?.eps, 4)}
                                description="Eps usato per clustering conferma."
                              />
                              <InfoRow
                                name="window.startDate"
                                value={formatDate(detail?.confirm?.window?.startDate)}
                                description="Inizio dello storico di conferma."
                              />
                              <InfoRow
                                name="window.endDate"
                                value={formatDate(detail?.confirm?.window?.endDate)}
                                description="Fine dello storico di conferma."
                              />
                            </div>
                            <div className="mt-3 text-[11px] text-slate-500">
                              Zone di conferma disponibili: {detail?.confirm?.zones?.length ?? 0}
                            </div>
                          </>
                        ) : (
                          <div className="mt-2 text-[11px] text-slate-500">Conferma non disponibile.</div>
                        )}
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                          <div className="text-xs font-semibold text-slate-700">Recent (1h)</div>
                          {detail?.recent ? (
                            <>
                              <div className="mt-2">
                                <InfoRow
                                  name="timeframe"
                                  value={detail?.recent?.timeframe || "-"}
                                  description="Timeframe recente per livelli operativi."
                                />
                                <InfoRow
                                  name="lookbackDays"
                                  value={detail?.recent?.lookbackDays ?? "-"}
                                  description="Periodo recente analizzato."
                                />
                                <InfoRow
                                  name="lookbackBars"
                                  value={detail?.recent?.lookbackBars ?? "-"}
                                  description="Numero barre recenti."
                                />
                                <InfoRow
                                  name="atr20"
                                  value={formatNumber(detail?.recent?.atr20, 4)}
                                  description="ATR calcolato su timeframe recente."
                                />
                                <InfoRow
                                  name="eps"
                                  value={formatNumber(detail?.recent?.eps, 4)}
                                  description="Eps usato per clustering recente."
                                />
                                <InfoRow
                                  name="window.startDate"
                                  value={formatDate(detail?.recent?.window?.startDate)}
                                  description="Inizio dello storico recente."
                                />
                                <InfoRow
                                  name="window.endDate"
                                  value={formatDate(detail?.recent?.window?.endDate)}
                                  description="Fine dello storico recente."
                                />
                              </div>
                              <div className="mt-3 text-[11px] text-slate-500">
                                Zone recenti disponibili: {detail?.recent?.zones?.length ?? 0}
                              </div>
                            </>
                          ) : (
                            <div className="mt-2 text-[11px] text-slate-500">Dati recenti non disponibili.</div>
                          )}
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                          <div className="text-xs font-semibold text-slate-700">Intraday (1m)</div>
                          {detail?.intraday ? (
                            <>
                              <div className="mt-2">
                                <InfoRow
                                  name="timeframe"
                                  value={detail?.intraday?.timeframe || "-"}
                                  description="Timeframe intraday per livelli rapidi."
                                />
                                <InfoRow
                                  name="lookbackDays"
                                  value={detail?.intraday?.lookbackDays ?? "-"}
                                  description="Periodo intraday analizzato."
                                />
                                <InfoRow
                                  name="lookbackBars"
                                  value={detail?.intraday?.lookbackBars ?? "-"}
                                  description="Numero barre intraday."
                                />
                                <InfoRow
                                  name="atr20"
                                  value={formatNumber(detail?.intraday?.atr20, 4)}
                                  description="ATR calcolato su timeframe intraday."
                                />
                                <InfoRow
                                  name="eps"
                                  value={formatNumber(detail?.intraday?.eps, 4)}
                                  description="Eps usato per clustering intraday."
                                />
                                <InfoRow
                                  name="window.startDate"
                                  value={formatDate(detail?.intraday?.window?.startDate)}
                                  description="Inizio dello storico intraday."
                                />
                                <InfoRow
                                  name="window.endDate"
                                  value={formatDate(detail?.intraday?.window?.endDate)}
                                  description="Fine dello storico intraday."
                                />
                              </div>
                              <div className="mt-3 text-[11px] text-slate-500">
                                Zone intraday disponibili: {detail?.intraday?.zones?.length ?? 0}
                              </div>
                            </>
                          ) : (
                            <div className="mt-2 text-[11px] text-slate-500">Dati intraday non disponibili.</div>
                          )}
                        </div>
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
                        <div className="text-xs font-semibold text-slate-700">Debug</div>
                        <div className="mt-2 grid gap-3 md:grid-cols-2">
                          <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                            <div className="text-[11px] font-semibold text-slate-700">Price Debug</div>
                            <InfoRow
                              name="priceRef"
                              value={formatNumber(detail?.priceDebug?.priceRef, 4)}
                              description="Prezzo di riferimento usato."
                            />
                            <InfoRow
                              name="dailyLastClose"
                              value={formatNumber(detail?.priceDebug?.dailyLastClose, 4)}
                              description="Ultimo close daily."
                            />
                            <InfoRow
                              name="recentLastClose"
                              value={formatNumber(detail?.priceDebug?.recentLastClose, 4)}
                              description="Ultimo close 1h."
                            />
                            <InfoRow
                              name="signalLastClose"
                              value={formatNumber(detail?.priceDebug?.signalLastClose, 4)}
                              description="Ultimo close timeframe segnale."
                            />
                            <InfoRow
                              name="providerSymbol"
                              value={detail?.priceDebug?.providerSymbol ?? "-"}
                              description="Symbol usato per richieste candles."
                            />
                          </div>

                          <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                            <div className="text-[11px] font-semibold text-slate-700">ATR Debug</div>
                            <InfoRow
                              name="avgHL"
                              value={formatNumber(detail?.atrDebug?.avgHL, 6)}
                              description="Media high-low (ultime 200 barre)."
                            />
                            <InfoRow
                              name="medianHL"
                              value={formatNumber(detail?.atrDebug?.medianHL, 6)}
                              description="Mediana high-low (ultime 200 barre)."
                            />
                            <InfoRow
                              name="minHL"
                              value={formatNumber(detail?.atrDebug?.minHL, 6)}
                              description="Minimo high-low (ultime 200 barre)."
                            />
                            <InfoRow
                              name="maxHL"
                              value={formatNumber(detail?.atrDebug?.maxHL, 6)}
                              description="Massimo high-low (ultime 200 barre)."
                            />
                            <InfoRow
                              name="avgTR"
                              value={formatNumber(detail?.atrDebug?.avgTR, 6)}
                              description="Media TR (ultime 200 barre)."
                            />
                            <InfoRow
                              name="atrLast"
                              value={formatNumber(detail?.atrDebug?.atrLast, 6)}
                              description="Ultimo ATR (timeframe segnale)."
                            />
                            <InfoRow
                              name="atrTail"
                              value={(detail?.atrDebug?.atrTail || []).map((v: number) => formatNumber(v, 6)).join(", ") || "-"}
                              description="Ultimi 5 ATR."
                            />
                          </div>
                        </div>

                        <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                          <div className="flex items-center justify-between">
                            <div className="text-[11px] font-semibold text-slate-700">Selection Debug</div>
                            <button
                              type="button"
                              className="rounded-full border border-slate-200 bg-white p-1 text-slate-500 hover:text-slate-700"
                              onClick={() => setSelectionDebugOpen((prev) => !prev)}
                              aria-label={selectionDebugOpen ? "Collapse selection debug" : "Expand selection debug"}
                            >
                              <AppIcon
                                icon={selectionDebugOpen ? "mdi:chevron-up" : "mdi:chevron-down"}
                                width={14}
                                height={14}
                              />
                            </button>
                          </div>
                          {selectionDebugOpen && (
                            <div className="mt-2">
                              <InfoRow
                                name="usedAtrForTrading"
                                value={
                                  detail?.selectionDebug?.usedAtrForTrading
                                    ? `${formatNumber(detail?.selectionDebug?.usedAtrForTrading?.value, 6)} (${detail?.selectionDebug?.usedAtrForTrading?.source}/${detail?.selectionDebug?.usedAtrForTrading?.timeframe})`
                                    : "-"
                                }
                                description="ATR usato per entry/SL/TP."
                              />
                              <InfoRow
                                name="usedTimeframeForLevels"
                                value={detail?.selectionDebug?.usedTimeframeForLevels ?? "-"}
                                description="Timeframe usato per livelli."
                              />
                              <InfoRow
                                name="maxLevelDistanceAtr"
                                value={formatNumber(detail?.selectionDebug?.maxLevelDistanceAtr, 2)}
                                description="Soglia massima distanza in ATR per i supporti."
                              />
                              <InfoRow
                                name="supportsWithinAtrCount"
                                value={detail?.selectionDebug?.supportsWithinAtrCount ?? "-"}
                                description="Numero supporti entro la soglia ATR."
                              />
                              <InfoRow
                                name="supportHigherScoreWithinAtr"
                                value={detail?.selectionDebug?.supportHigherScoreWithinAtr ? "YES" : "NO"}
                                description="Esiste un supporto con score maggiore dentro soglia."
                              />
                              <InfoRow
                                name="selectedSupport.midPrice"
                                value={formatNumber(detail?.selectionDebug?.selectedSupport?.midPrice, 4)}
                                description="Supporto selezionato."
                              />
                              <InfoRow
                                name="selectedResistance.midPrice"
                                value={formatNumber(detail?.selectionDebug?.selectedResistance?.midPrice, 4)}
                                description="Resistenza selezionata."
                              />
                              <InfoRow
                                name="distancePct"
                                value={formatPercent(detail?.selectionDebug?.distancePct)}
                                description="Distanza % dal supporto selezionato."
                              />
                              <InfoRow
                                name="distanceAtr"
                                value={formatNumber(detail?.selectionDebug?.distanceAtr, 4)}
                                description="Distanza in ATR dal supporto selezionato."
                              />
                            </div>
                          )}
                        </div>

                        <div className="mt-3 grid gap-3 md:grid-cols-2">
                          <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                            <div className="text-[11px] font-semibold text-slate-700">Supports Top 5</div>
                            <div className="mt-2 overflow-auto">
                              <table className="min-w-full divide-y divide-slate-200 text-[10px]">
                                <thead className="bg-white text-left text-[10px] uppercase tracking-wide text-slate-500">
                                  <tr>
                                    <th className="px-2 py-1">Mid</th>
                                    <th className="px-2 py-1">Low</th>
                                    <th className="px-2 py-1">High</th>
                                    <th className="px-2 py-1">Score</th>
                                    <th className="px-2 py-1">Touches</th>
                                    <th className="px-2 py-1">Recency</th>
                                    <th className="px-2 py-1">Source</th>
                                    <th className="px-2 py-1">TF</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {(detail?.selectionDebug?.supportsTop5 || []).map((zone: any, idx: number) => (
                                    <tr key={`support-${idx}`} className="hover:bg-white/50">
                                      <td className="px-2 py-1">{formatNumber(zone.midPrice, 4)}</td>
                                      <td className="px-2 py-1">{formatNumber(zone.low, 4)}</td>
                                      <td className="px-2 py-1">{formatNumber(zone.high, 4)}</td>
                                      <td className="px-2 py-1">{formatNumber(zone.score, 3)}</td>
                                      <td className="px-2 py-1">{zone.touches ?? "-"}</td>
                                      <td className="px-2 py-1">{zone.recencyBars ?? "-"}</td>
                                      <td className="px-2 py-1">{zone.source ?? "-"}</td>
                                      <td className="px-2 py-1">{zone.timeframe ?? "-"}</td>
                                    </tr>
                                  ))}
                                  {(!detail?.selectionDebug?.supportsTop5 || detail?.selectionDebug?.supportsTop5?.length === 0) && (
                                    <tr>
                                      <td className="px-2 py-1 text-slate-500" colSpan={8}>
                                        Nessun supporto.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                            <div className="text-[11px] font-semibold text-slate-700">Resistances Top 5</div>
                            <div className="mt-2 overflow-auto">
                              <table className="min-w-full divide-y divide-slate-200 text-[10px]">
                                <thead className="bg-white text-left text-[10px] uppercase tracking-wide text-slate-500">
                                  <tr>
                                    <th className="px-2 py-1">Mid</th>
                                    <th className="px-2 py-1">Low</th>
                                    <th className="px-2 py-1">High</th>
                                    <th className="px-2 py-1">Score</th>
                                    <th className="px-2 py-1">Touches</th>
                                    <th className="px-2 py-1">Recency</th>
                                    <th className="px-2 py-1">Source</th>
                                    <th className="px-2 py-1">TF</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {(detail?.selectionDebug?.resistancesTop5 || []).map((zone: any, idx: number) => (
                                    <tr key={`res-${idx}`} className="hover:bg-white/50">
                                      <td className="px-2 py-1">{formatNumber(zone.midPrice, 4)}</td>
                                      <td className="px-2 py-1">{formatNumber(zone.low, 4)}</td>
                                      <td className="px-2 py-1">{formatNumber(zone.high, 4)}</td>
                                      <td className="px-2 py-1">{formatNumber(zone.score, 3)}</td>
                                      <td className="px-2 py-1">{zone.touches ?? "-"}</td>
                                      <td className="px-2 py-1">{zone.recencyBars ?? "-"}</td>
                                      <td className="px-2 py-1">{zone.source ?? "-"}</td>
                                      <td className="px-2 py-1">{zone.timeframe ?? "-"}</td>
                                    </tr>
                                  ))}
                                  {(!detail?.selectionDebug?.resistancesTop5 || detail?.selectionDebug?.resistancesTop5?.length === 0) && (
                                    <tr>
                                      <td className="px-2 py-1 text-slate-500" colSpan={8}>
                                        Nessuna resistenza.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                          <div className="text-[11px] font-semibold text-slate-700">Resistance Debug</div>
                          <InfoRow
                            name="countResistancesAbovePrice"
                            value={detail?.resistanceDebug?.countResistancesAbovePrice ?? "-"}
                            description="Numero resistenze sopra priceRef."
                          />
                          <div className="mt-2 overflow-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-[10px]">
                              <thead className="bg-white text-left text-[10px] uppercase tracking-wide text-slate-500">
                                <tr>
                                  <th className="px-2 py-1">Mid</th>
                                  <th className="px-2 py-1">Source</th>
                                  <th className="px-2 py-1">Score</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {(detail?.resistanceDebug?.top5 || []).map((zone: any, idx: number) => (
                                  <tr key={`res-top-${idx}`} className="hover:bg-white/50">
                                    <td className="px-2 py-1">{formatNumber(zone.midPrice, 4)}</td>
                                    <td className="px-2 py-1">{zone.source ?? "-"}</td>
                                    <td className="px-2 py-1">{formatNumber(zone.score, 3)}</td>
                                  </tr>
                                ))}
                                {(!detail?.resistanceDebug?.top5 || detail?.resistanceDebug?.top5?.length === 0) && (
                                  <tr>
                                    <td className="px-2 py-1 text-slate-500" colSpan={3}>
                                      Nessuna resistenza sopra priceRef.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                          <div className="text-[11px] font-semibold text-slate-700">Pattern Trend Debug</div>
                          <InfoRow
                            name="ema20Last"
                            value={formatNumber(detail?.signal?.pattern?.debug?.trend?.ema20Last, 4)}
                            description="EMA20 ultimo valore."
                          />
                          <InfoRow
                            name="ema50Last"
                            value={formatNumber(detail?.signal?.pattern?.debug?.trend?.ema50Last, 4)}
                            description="EMA50 ultimo valore."
                          />
                          <InfoRow
                            name="emaSpreadPct"
                            value={formatPercent(detail?.signal?.pattern?.debug?.trend?.emaSpreadPct)}
                            description="Differenza % EMA20/EMA50."
                          />
                          <InfoRow
                            name="aboveEma20Count"
                            value={detail?.signal?.pattern?.debug?.trend?.aboveEma20Count ?? "-"}
                            description="Numero barre sopra EMA20."
                          />
                          <InfoRow
                            name="consideredBars"
                            value={detail?.signal?.pattern?.debug?.trend?.consideredBars ?? "-"}
                            description="Barre considerate nel trend filter."
                          />
                          {detail?.signal?.pattern?.debug?.last12 && (
                            <div className="mt-2">
                              <div className="text-[11px] font-semibold text-slate-700">Last 12 bars</div>
                              <div className="mt-2 overflow-auto">
                                <table className="min-w-full divide-y divide-slate-200 text-[10px]">
                                  <thead className="bg-white text-left text-[10px] uppercase tracking-wide text-slate-500">
                                    <tr>
                                      <th className="px-2 py-1">Time</th>
                                      <th className="px-2 py-1">Close</th>
                                      <th className="px-2 py-1">EMA20</th>
                                      <th className="px-2 py-1">Above</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {detail.signal.pattern.debug.last12.map((row: any, idx: number) => (
                                      <tr key={`last12-${idx}`} className="hover:bg-white/50">
                                        <td className="px-2 py-1">{formatDateTime(row?.t)}</td>
                                        <td className="px-2 py-1">{formatNumber(row?.close, 4)}</td>
                                        <td className="px-2 py-1">{formatNumber(row?.ema20, 4)}</td>
                                        <td className="px-2 py-1">{row?.above ? "YES" : "NO"}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
