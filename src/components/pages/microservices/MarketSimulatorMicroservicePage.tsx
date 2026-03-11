import { useCallback, useEffect, useMemo, useState } from "react";
import MicroserviceGeneralTab from "../../molecules/microservice/MicroserviceGeneralTab";
import BaseButton from "../../atoms/base/buttons/BaseButton";
import TextInput from "../../atoms/form/TextInput";
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

type SessionState = {
  active: boolean;
  startDate?: string | null;
  endDate?: string | null;
  currentDate?: string | null;
  tf?: string | null;
  dataSource?: string | null;
  tickers?: string[];
  tickCount?: number;
  lastTickAt?: string | null;
  hasMore?: boolean;
  mode?: "passive" | "inject";
  intervalMs?: number;
};

type Candle = {
  t?: string;
  o?: number;
  h?: number;
  l?: number;
  c?: number;
  v?: number;
};

const TF_OPTIONS = ["1Day", "1Hour", "30Min", "15Min", "5Min", "1Min"];

function fmtDate(iso?: string | null) {
  if (!iso) return "—";
  return iso.slice(0, 10);
}

export default function MarketSimulatorMicroservicePage({
  onReleaseChange,
  onHealthChange,
  onOpenReleaseModal,
}: Props) {
  const [activeTab, setActiveTab] = useState<"general" | "simulator">("general");

  const token = useMemo(() => localStorage?.getItem("astraai:auth:token"), []);
  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }),
    [token]
  );

  // ── Session ──────────────────────────────────────────────────────────────
  const [session, setSession] = useState<SessionState | null>(null);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tf, setTf] = useState("1Day");
  const [mode, setMode] = useState<"passive" | "inject">("passive");
  const [intervalMs, setIntervalMs] = useState("1000");

  const loadSession = useCallback(async () => {
    try {
      const res = await fetch(`${env.apiBaseUrl}/market-simulator/session`, { headers });
      const data = await res.json().catch(() => ({ ok: false }));
      if (data?.ok) setSession(data.session ?? null);
    } catch {
      // ignore on background load
    }
  }, [headers]);

  useEffect(() => {
    if (activeTab === "simulator") loadSession();
  }, [activeTab, loadSession]);

  const handleStartSession = useCallback(async () => {
    if (!startDate || !endDate) {
      setSessionError("Start date e End date sono obbligatorie.");
      return;
    }
    setSessionLoading(true);
    setSessionError(null);
    try {
      const body: Record<string, any> = {
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        tf,
        mode,
      };
      if (mode === "inject") {
        body.intervalMs = parseInt(intervalMs, 10) || 1000;
      }
      const res = await fetch(`${env.apiBaseUrl}/market-simulator/session`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (data?.ok) {
        setSession(data.session ?? null);
      } else {
        setSessionError(data?.error || "Errore nella configurazione della sessione.");
      }
    } catch (err: any) {
      setSessionError(err?.message || "Errore di rete.");
    } finally {
      setSessionLoading(false);
    }
  }, [startDate, endDate, tf, mode, intervalMs, headers]);

  const handleStopSession = useCallback(async () => {
    setSessionLoading(true);
    setSessionError(null);
    try {
      const res = await fetch(`${env.apiBaseUrl}/market-simulator/session`, {
        method: "DELETE",
        headers,
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (data?.ok) setSession(null);
      else setSessionError(data?.error || "Errore nel fermare la sessione.");
    } catch (err: any) {
      setSessionError(err?.message || "Errore di rete.");
    } finally {
      setSessionLoading(false);
    }
  }, [headers]);

  const [tickLoading, setTickLoading] = useState(false);
  const [tickResult, setTickResult] = useState<string | null>(null);

  const handleTick = useCallback(async () => {
    setTickLoading(true);
    setTickResult(null);
    try {
      const res = await fetch(`${env.apiBaseUrl}/market-simulator/session/tick`, {
        method: "POST",
        headers,
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (data?.ok) {
        setSession((prev) =>
          prev
            ? {
                ...prev,
                currentDate: data.nextDate ?? data.date ?? prev.currentDate,
                tickCount: data.tickCount ?? (prev.tickCount ?? 0) + 1,
                hasMore: data.hasMore,
              }
            : prev
        );
        setTickResult(
          `Tick ${data.tickCount ?? ""}: ${fmtDate(data.publishedDate ?? data.date)}${
            !data.hasMore ? " — FINE SESSIONE" : ""
          }`
        );
      } else {
        setTickResult(`Errore: ${data?.error || "tick fallito"}`);
      }
    } catch (err: any) {
      setTickResult(`Errore: ${err?.message || "Errore di rete."}`);
    } finally {
      setTickLoading(false);
    }
  }, [headers]);

  // ── Candle fetch & edit ───────────────────────────────────────────────────
  const [candleSymbol, setCandleSymbol] = useState("");
  const [candleDate, setCandleDate] = useState("");
  const [candleTf, setCandleTf] = useState("1Day");
  const [candleLoading, setCandleLoading] = useState(false);
  const [candleError, setCandleError] = useState<string | null>(null);
  const [editCandle, setEditCandle] = useState<Candle | null>(null);
  const [editSymbol, setEditSymbol] = useState("");

  const handleFetchCandle = useCallback(async () => {
    if (!candleSymbol || !candleDate) {
      setCandleError("Symbol e Date sono obbligatori.");
      return;
    }
    setCandleLoading(true);
    setCandleError(null);
    setEditCandle(null);
    try {
      const dateIso = new Date(candleDate).toISOString();
      const url = `${env.apiBaseUrl}/market-simulator/candle?symbol=${encodeURIComponent(
        candleSymbol.toUpperCase()
      )}&date=${encodeURIComponent(dateIso)}&tf=${encodeURIComponent(candleTf)}`;
      const res = await fetch(url, { headers });
      const data = await res.json().catch(() => ({ ok: false }));
      if (data?.ok && data.candle) {
        setEditCandle(data.candle);
        setEditSymbol(candleSymbol.toUpperCase());
      } else {
        setCandleError(data?.error || "Candela non trovata.");
      }
    } catch (err: any) {
      setCandleError(err?.message || "Errore di rete.");
    } finally {
      setCandleLoading(false);
    }
  }, [candleSymbol, candleDate, candleTf, headers]);

  const [pushLoading, setPushLoading] = useState(false);
  const [pushResult, setPushResult] = useState<string | null>(null);

  const handlePushCandle = useCallback(
    async (target: "snapshot" | "pending") => {
      if (!editCandle || !editSymbol) return;
      setPushLoading(true);
      setPushResult(null);
      try {
        const res = await fetch(`${env.apiBaseUrl}/market-simulator/candle/push`, {
          method: "POST",
          headers,
          body: JSON.stringify({ symbol: editSymbol, candle: editCandle, target }),
        });
        const data = await res.json().catch(() => ({ ok: false }));
        if (data?.ok) {
          const label =
            target === "pending"
              ? `Candela impostata come pending per ${editSymbol}`
              : `Snapshot iniettato su Redis per ${editSymbol} — close=${editCandle.c}`;
          setPushResult(label);
        } else {
          setPushResult(`Errore: ${data?.error || "push fallito"}`);
        }
      } catch (err: any) {
        setPushResult(`Errore: ${err?.message || "Errore di rete."}`);
      } finally {
        setPushLoading(false);
      }
    },
    [editCandle, editSymbol, headers]
  );

  const updateCandleField = (field: keyof Candle, value: string) => {
    setEditCandle((prev) =>
      prev
        ? { ...prev, [field]: field === "t" ? value : parseFloat(value) || 0 }
        : prev
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-1 min-h-0 flex-col">
      {/* Tab bar */}
      <div className="flex gap-6 border-b border-slate-200">
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "general"
              ? "border-b-2 border-slate-900 text-slate-900"
              : "text-slate-500"
          }`}
          onClick={() => setActiveTab("general")}
        >
          General Settings
        </button>
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "simulator"
              ? "border-b-2 border-slate-900 text-slate-900"
              : "text-slate-500"
          }`}
          onClick={() => setActiveTab("simulator")}
        >
          Simulator
        </button>
      </div>

      {/* General Settings tab */}
      {activeTab === "general" && (
        <div className="flex-1 min-h-0 flex flex-col">
          <MicroserviceGeneralTab
            microservice="market-simulator"
            onReleaseChange={onReleaseChange}
            onHealthChange={onHealthChange}
            onOpenReleaseModal={onOpenReleaseModal}
          />
        </div>
      )}

      {/* Simulator tab */}
      {activeTab === "simulator" && (
        <div className="mt-4 flex-1 min-h-0 overflow-y-auto space-y-6 pb-4">

          {/* ── Session status ── */}
          {session?.active && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs font-semibold text-emerald-700">Sessione attiva</p>
                {session.mode === "inject" && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                    Inject — {session.intervalMs}ms/tick
                  </span>
                )}
                {session.mode === "passive" && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                    Passiva — pull da decision-engine
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-600 sm:grid-cols-4">
                <span className="text-slate-400">Start</span>
                <span>{fmtDate(session.startDate)}</span>
                <span className="text-slate-400">End</span>
                <span>{fmtDate(session.endDate)}</span>
                <span className="text-slate-400">Current</span>
                <span className="font-medium text-emerald-700">{fmtDate(session.currentDate)}</span>
                <span className="text-slate-400">TF</span>
                <span>{session.tf ?? "—"}</span>
                <span className="text-slate-400">Tick count</span>
                <span>{session.tickCount ?? 0}</span>
                <span className="text-slate-400">Has more</span>
                <span>{session.hasMore ? "Sì" : "No"}</span>
              </div>
            </div>
          )}

          {/* ── Configure session ── */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
            <p className="text-xs font-semibold text-slate-700">Configura sessione</p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <TextInput
                type="date"
                label="Start date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={sessionLoading}
              />
              <TextInput
                type="date"
                label="End date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={sessionLoading}
              />
            </div>

            {/* TF + Mode row */}
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Timeframe</label>
                <select
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={tf}
                  onChange={(e) => setTf(e.target.value)}
                  disabled={sessionLoading}
                >
                  {TF_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Modalità</label>
                <select
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={mode}
                  onChange={(e) => setMode(e.target.value as "passive" | "inject")}
                  disabled={sessionLoading}
                >
                  <option value="passive">Passiva (pull da decision-engine)</option>
                  <option value="inject">Inject su Redis bus</option>
                </select>
              </div>

              {mode === "inject" && (
                <div className="w-32">
                  <TextInput
                    type="number"
                    label="Velocità (ms/tick)"
                    value={intervalMs}
                    onChange={(e) => setIntervalMs(e.target.value)}
                    disabled={sessionLoading}
                    min="100"
                    step="100"
                  />
                </div>
              )}
            </div>

            {/* Mode description */}
            <p className="text-xs text-slate-500">
              {mode === "passive"
                ? "Modalità passiva: la sessione rimane in ascolto delle richieste GET dal decision-engine. Ad ogni richiesta, la candela viene prelevata dal cachemanager e restituita al decision-engine, che la pubblica sul bus Redis."
                : "Modalità inject: le candele vengono prelevate dal cachemanager e iniettate direttamente sul bus Redis alla velocità indicata, esattamente come farebbe il decision-engine."}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <BaseButton
                variant="solid"
                color="primary"
                size="md"
                loading={sessionLoading}
                onClick={handleStartSession}
              >
                {session?.active ? "Riconfigura" : "Avvia sessione"}
              </BaseButton>

              {session?.active && (
                <BaseButton
                  variant="outline"
                  color="danger"
                  size="md"
                  loading={sessionLoading}
                  onClick={handleStopSession}
                >
                  Ferma sessione
                </BaseButton>
              )}
            </div>

            {sessionError && (
              <p className="text-xs text-red-600">{sessionError}</p>
            )}
          </div>

          {/* ── Tick (visible only in passive mode) ── */}
          {session?.active && session.mode !== "inject" && (
            <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-2">
              <p className="text-xs font-semibold text-slate-700">Avanza tick</p>
              <div className="flex flex-wrap items-center gap-3">
                <BaseButton
                  variant="solid"
                  color="secondary"
                  size="md"
                  loading={tickLoading}
                  disabled={!session.hasMore}
                  onClick={handleTick}
                >
                  {session.hasMore ? "Tick →" : "Fine sessione"}
                </BaseButton>
                {tickResult && (
                  <span
                    className={`text-xs ${
                      tickResult.startsWith("Errore") ? "text-red-600" : "text-slate-600"
                    }`}
                  >
                    {tickResult}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ── Inject loop running banner ── */}
          {session?.active && session.mode === "inject" && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex items-center gap-3">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
              <p className="text-xs text-amber-700">
                Loop inject attivo — candele inviate ogni{" "}
                <span className="font-semibold">{session.intervalMs}ms</span> sul bus Redis.
                Ferma la sessione per interromperlo.
              </p>
            </div>
          )}

          {/* ── Fetch candle ── */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
            <p className="text-xs font-semibold text-slate-700">Preleva candela</p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <TextInput
                label="Symbol"
                placeholder="es. AAPL"
                value={candleSymbol}
                onChange={(e) => setCandleSymbol(e.target.value)}
                disabled={candleLoading}
              />
              <TextInput
                type="date"
                label="Data"
                value={candleDate}
                onChange={(e) => setCandleDate(e.target.value)}
                disabled={candleLoading}
              />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Timeframe</label>
                <select
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={candleTf}
                  onChange={(e) => setCandleTf(e.target.value)}
                  disabled={candleLoading}
                >
                  {TF_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <BaseButton
              variant="outline"
              color="primary"
              size="md"
              loading={candleLoading}
              onClick={handleFetchCandle}
            >
              Preleva candela
            </BaseButton>

            {candleError && <p className="text-xs text-red-600">{candleError}</p>}
          </div>

          {/* ── Edit candle & push ── */}
          {editCandle && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 space-y-4">
              <p className="text-xs font-semibold text-blue-700">
                Modifica candela —{" "}
                <span className="font-bold">{editSymbol}</span>
                {editCandle.t ? ` (${fmtDate(editCandle.t)})` : ""}
              </p>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                <TextInput
                  type="number"
                  label="Open"
                  value={editCandle.o?.toString() ?? ""}
                  onChange={(e) => updateCandleField("o", e.target.value)}
                  step="0.01"
                />
                <TextInput
                  type="number"
                  label="High"
                  value={editCandle.h?.toString() ?? ""}
                  onChange={(e) => updateCandleField("h", e.target.value)}
                  step="0.01"
                />
                <TextInput
                  type="number"
                  label="Low"
                  value={editCandle.l?.toString() ?? ""}
                  onChange={(e) => updateCandleField("l", e.target.value)}
                  step="0.01"
                />
                <TextInput
                  type="number"
                  label="Close"
                  value={editCandle.c?.toString() ?? ""}
                  onChange={(e) => updateCandleField("c", e.target.value)}
                  step="0.01"
                />
                <TextInput
                  type="number"
                  label="Volume"
                  value={editCandle.v?.toString() ?? ""}
                  onChange={(e) => updateCandleField("v", e.target.value)}
                  step="1"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Mode 1: store as pending for next GET */}
                <BaseButton
                  variant="solid"
                  color="secondary"
                  size="md"
                  loading={pushLoading}
                  onClick={() => handlePushCandle("pending")}
                  title="Rende la candela disponibile per la prossima richiesta GET del decision-engine (Modalità passiva)"
                >
                  Disponibile per GET
                </BaseButton>

                {/* Mode 2: inject directly onto Redis bus */}
                <BaseButton
                  variant="solid"
                  color="warning"
                  size="md"
                  loading={pushLoading}
                  onClick={() => handlePushCandle("snapshot")}
                  title="Inietta la candela direttamente sul bus Redis come snapshot"
                >
                  Inietta su Redis
                </BaseButton>

                <BaseButton
                  variant="ghost"
                  color="neutral"
                  size="md"
                  onClick={() => { setEditCandle(null); setPushResult(null); }}
                >
                  Annulla
                </BaseButton>

                {pushResult && (
                  <span
                    className={`text-xs ${
                      pushResult.startsWith("Errore") ? "text-red-600" : "text-emerald-600"
                    }`}
                  >
                    {pushResult}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
