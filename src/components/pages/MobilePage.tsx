import { useCallback, useEffect, useRef, useState } from "react";
import { env } from "../../config/env";
import { fetchSchedulerJobs } from "../../api/scheduler";
import { redisWsBridgeClient } from "../../services/ws/redisWsBridgeClient";
import AppIcon from "../atoms/icon/AppIcon";
import Logo from "../atoms/media/Logo";

type IbkrStatus = "READY" | "NEED_AUTH" | "DOWN" | "UNKNOWN";

type LiquidityData = {
  score: number;
  riskRegime: string;
  volatility: number | string;
  confidence: number;
  ts?: string;
};

type WsEvent = {
  ts?: string;
  channel?: string;
  source?: string;
  event?: string;
  [k: string]: any;
};

const getAuthToken = () =>
  typeof localStorage === "undefined" ? null : localStorage.getItem("astraai:auth:token");

const authHeaders = (): Record<string, string> => {
  const t = getAuthToken();
  return t ? { Authorization: `Bearer ` } : {};
};

const fetchWithTimeout = (url: string, options: RequestInit, ms = 10_000) => {
  const ac = new AbortController();
  const tid = setTimeout(() => ac.abort(), ms);
  return fetch(url, { ...options, signal: ac.signal }).finally(() => clearTimeout(tid));
};

function riskColor(regime: string) {
  if (regime === "RISK_ON") return "bg-emerald-50 text-emerald-700";
  if (regime === "RISK_OFF") return "bg-rose-50 text-rose-700";
  return "bg-amber-50 text-amber-700";
}

function WsStatusDot({ status }: { status: string }) {
  const cls =
    status === "open"
      ? "bg-emerald-500"
      : status === "connecting"
        ? "bg-amber-400 animate-pulse"
        : "bg-rose-400";
  return <span className={`inline-flex h-2.5 w-2.5 rounded-full ${cls}`} />;
}

export default function MobilePage() {
  const [ibkrStatus, setIbkrStatus] = useState<IbkrStatus>("UNKNOWN");
  const [liquidity, setLiquidity] = useState<LiquidityData | null>(null);
  const [liquidityError, setLiquidityError] = useState(false);
  const [schedulerEnabled, setSchedulerEnabled] = useState<number | null>(null);
  const [schedulerTotal, setSchedulerTotal] = useState(0);
  const [wsStatus, setWsStatus] = useState("idle");
  const [liveEvents, setLiveEvents] = useState<WsEvent[]>([]);
  const isActive = useRef(true);

  const pushEvent = useCallback((msg: WsEvent) => {
    setLiveEvents((prev) => [{ ...msg, _receivedAt: new Date().toISOString() }, ...prev].slice(0, 30));
  }, []);

  // IBKR status
  useEffect(() => {
    fetchWithTimeout(`${env.apiBaseUrl}/ibkr-bridge/mirror/portfolio/accounts`, { headers: authHeaders() })
      .then(async (r) => {
        const text = await r.text().catch(() => "");
        let data: any = null;
        try { data = text ? JSON.parse(text) : null; } catch { /* ignore */ }
        if (!isActive.current) return;
        const list = Array.isArray(data) ? data : Array.isArray(data?.accounts) ? data.accounts : [];
        if (list.length > 0) { setIbkrStatus("READY"); return; }
        if (!r.ok && data?.error === "IBKR request failed" && data?.status === 401) { setIbkrStatus("NEED_AUTH"); return; }
        setIbkrStatus("DOWN");
      })
      .catch(() => {
        if (isActive.current) setIbkrStatus("DOWN");
      });
  }, []);

  // Liquidity score
  useEffect(() => {
    fetchWithTimeout(`${env.apiBaseUrl}/liquidity-manager/liquidity-score`, { headers: authHeaders() })
      .then(async (r) => {
        const text = await r.text().catch(() => "");
        let data: any = null;
        try { data = text ? JSON.parse(text) : null; } catch { /* ignore */ }
        if (!isActive.current) return;
        if (!r.ok || data == null) { setLiquidityError(true); return; }
        const payload = data?.score != null ? data : data?.data ?? null;
        if (payload?.score != null) setLiquidity({ ...payload, volatility: payload.volatilityRegime ?? payload.volatility });
        else setLiquidityError(true);
      })
      .catch(() => {
        if (isActive.current) setLiquidityError(true);
      });
  }, []);

  // Scheduler jobs
  useEffect(() => {
    const ac = new AbortController();
    const tid = setTimeout(() => ac.abort(), 10_000);
    fetchSchedulerJobs(ac.signal)
      .then((jobs) => {
        if (!isActive.current) return;
        setSchedulerEnabled(jobs.filter((j) => !!j.enabled).length);
        setSchedulerTotal(jobs.length);
      })
      .catch(() => {
        if (isActive.current) setSchedulerEnabled(-1);
      })
      .finally(() => clearTimeout(tid));
  }, []);

  // WebSocket live events
  useEffect(() => {
    redisWsBridgeClient.start();
    const unsubStatus = redisWsBridgeClient.onStatus((s) => setWsStatus(s));
    const unsubMsg = redisWsBridgeClient.subscribe({ onMessage: pushEvent });
    return () => {
      isActive.current = false;
      unsubStatus();
      unsubMsg();
      redisWsBridgeClient.stop();
    };
  }, [pushEvent]);

  const ibkrBadge = {
    READY: { label: "CONNESSO", cls: "bg-emerald-100 text-emerald-700" },
    NEED_AUTH: { label: "AUTH RICHIESTA", cls: "bg-amber-100 text-amber-800" },
    DOWN: { label: "DOWN", cls: "bg-rose-100 text-rose-700" },
    UNKNOWN: { label: "—", cls: "bg-slate-100 text-slate-500" },
  }[ibkrStatus];

  const vncBase = env.apiBaseUrl.replace("//api.", "//");
  const vncUrl = `${vncBase}/ibkr-login/vnc.html?autoconnect=1&path=ibkr-login/websockify`;

  const handleLogout = () => {
    localStorage.removeItem("astraai:auth:token");
    window.location.hash = "/login";
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <Logo href="#/mobile" className="h-7" />
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 active:bg-slate-200"
        >
          Logout
        </button>
      </header>

      <div className="flex flex-col gap-4 p-4 pb-10">

        {/* IBKR Gateway */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AppIcon icon="mdi:bank-outline" className="h-5 w-5 text-slate-500" />
              <span className="text-sm font-semibold text-slate-900">IBKR Gateway</span>
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${ibkrBadge.cls}`}>
              {ibkrBadge.label}
            </span>
          </div>
          {(ibkrStatus === "NEED_AUTH" || ibkrStatus === "DOWN") && (
            <button
              type="button"
              onClick={() => window.open(vncUrl, "_blank", "noopener,noreferrer")}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white active:bg-slate-700"
            >
              <AppIcon icon="mdi:remote-desktop" className="h-5 w-5" />
              Apri Desktop IBKR
            </button>
          )}
          {ibkrStatus === "READY" && (
            <p className="mt-2 text-xs text-slate-500">
              Gateway attivo — sessione autenticata.
            </p>
          )}
        </section>

        {/* Liquidity */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <AppIcon icon="mdi:water-outline" className="h-5 w-5 text-slate-500" />
            <span className="text-sm font-semibold text-slate-900">Liquidità di Mercato</span>
          </div>
          {liquidityError ? (
            <div className="text-xs text-slate-400">Dati non disponibili</div>
          ) : !liquidity ? (
            <div className="text-xs text-slate-400">Caricamento...</div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 px-3 py-3 text-center">
                <div className="text-[11px] text-slate-400">Score</div>
                <div className="text-2xl font-bold text-slate-900">{Number(liquidity.score).toFixed(2)}</div>
              </div>
              <div className={`rounded-xl px-3 py-3 text-center ${riskColor(liquidity.riskRegime)}`}>
                <div className="text-[11px] opacity-60">Regime</div>
                <div className="text-base font-bold">{liquidity.riskRegime}</div>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-3 text-center">
                <div className="text-[11px] text-slate-400">Volatilità</div>
                <div className="text-lg font-semibold text-slate-800">{Number(liquidity.volatility).toFixed(4)}</div>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-3 text-center">
                <div className="text-[11px] text-slate-400">Confidenza</div>
                <div className="text-lg font-semibold text-slate-800">{Number(liquidity.confidence).toFixed(2)}</div>
              </div>
            </div>
          )}
        </section>

        {/* Scheduler */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AppIcon icon="mdi:clock-outline" className="h-5 w-5 text-slate-500" />
              <span className="text-sm font-semibold text-slate-900">Scheduler</span>
            </div>
            {schedulerEnabled !== null && schedulerEnabled !== -1 && (
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                schedulerEnabled > 0 ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
              }`}>
                {schedulerEnabled} / {schedulerTotal} attivi
              </span>
            )}
          </div>
          {schedulerEnabled === null && (
            <div className="mt-2 text-xs text-slate-400">Caricamento...</div>
          )}
          {schedulerEnabled === -1 && (
            <div className="mt-2 text-xs text-slate-400">Non disponibile</div>
          )}
        </section>

        {/* Decision Engine / Live Events */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AppIcon icon="mdi:broadcast" className="h-5 w-5 text-slate-500" />
              <span className="text-sm font-semibold text-slate-900">Live Events</span>
            </div>
            <div className="flex items-center gap-2">
              <WsStatusDot status={wsStatus} />
              <span className="text-[11px] text-slate-500">{wsStatus.toUpperCase()}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto">
            {liveEvents.length === 0 ? (
              <div className="text-xs text-slate-400">In attesa di eventi Redis...</div>
            ) : (
              liveEvents.map((ev, i) => (
                <div key={i} className="rounded-xl bg-slate-50 px-3 py-2 text-[11px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-700 truncate">
                      {ev.channel ?? ev.source ?? ev.event ?? ev.type ?? "event"}
                    </span>
                    <span className="shrink-0 text-[10px] text-slate-400">
                      {ev._receivedAt
                        ? new Date(ev._receivedAt).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
                        : ""}
                    </span>
                  </div>
                  {(ev.data?.symbol || ev.symbol) && (
                    <div className="mt-0.5 text-slate-500">
                      {ev.data?.symbol ?? ev.symbol}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Switch to desktop */}
        <div className="text-center">
          <a
            href="#/overview"
            className="text-xs text-slate-400 underline underline-offset-2"
          >
            Passa alla versione desktop
          </a>
        </div>
      </div>
    </div>
  );
}
