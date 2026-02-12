import React, { useCallback, useEffect, useState } from "react";
import MicroserviceGeneralTab from "../../molecules/microservice/MicroserviceGeneralTab";
import BaseButton from "../../atoms/base/buttons/BaseButton";
import AppIcon from "../../atoms/icon/AppIcon";
import ReactApexChart from "react-apexcharts";
import { env } from "../../../config/env";

// Tipi per lo stato dei componenti
type Status = "idle" | "loading" | "error";

// Tipo per i target di cancellazione cache
type L3Target =
  | { type: "all" }
  | { type: "symbol"; symbol: string }
  | { type: "file"; symbol: string; tf: string };

// Tipo per le informazioni di release del microservizio
type ReleaseInfo = {
  version?: string | null;
  lastUpdate?: string | null;
  microservice?: string | null;
  note?: string[] | null;
};

// Props ricevute dal componente padre (AdminMicroserviceDetailPage)
type Props = {
  onReleaseChange?: (rel: ReleaseInfo | null) => void; // Callback quando cambiano le info di release
  onHealthChange?: (health: Record<string, any> | null) => void; // Callback quando cambia lo stato di health
  onOpenReleaseModal?: () => void; // Callback per aprire il modale con le note di release
};

// Tipo per le props dell'Alert component
type AlertProps = {
  message: string;
  tone?: "error" | "warn" | "success";
  onClose?: () => void;
};

/**
 * Componente Alert per mostrare messaggi di errore/warning/successo
 */
const Alert = ({ message, tone = "error", onClose }: AlertProps) => {
  const palette =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "warn"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-red-200 bg-red-50 text-red-700";
  return (
    <div className={`relative rounded-md border ${palette} px-3 py-2 text-xs pr-8`}>
      {message}
      {onClose && (
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-1 text-[11px] text-slate-500 hover:bg-slate-100"
          onClick={onClose}
          aria-label="Chiudi"
        >
          ×
        </button>
      )}
    </div>
  );
};

/**
 * Formatta i bytes in una stringa leggibile (KB, MB, GB, ecc.)
 */
const formatBytes = (bytes?: number) => {
  if (!bytes || bytes < 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let idx = 0;
  let val = bytes;
  while (val >= 1024 && idx < units.length - 1) {
    val /= 1024;
    idx += 1;
  }
  return `${val.toFixed(val >= 10 ? 0 : 1)} ${units[idx]}`;
};

/**
 * Determina il colore della barra di progresso in base alla percentuale
 */
const progressColor = (percent: number) => {
  if (percent >= 85) return "bg-red-500";
  if (percent >= 75) return "bg-amber-600";
  if (percent >= 65) return "bg-amber-400";
  if (percent >= 50) return "bg-yellow-400";
  return "bg-emerald-500";
};

/**
 * Calcola ricorsivamente i bytes totali di un nodo (file o directory)
 */
const getNodeBytes = (node: any): number => {
  if (!node) return 0;
  const directBytes = typeof node.size === "number" ? node.size : 0;
  if (!Array.isArray(node.files)) return directBytes;
  const childBytes = node.files.reduce((sum: number, child: any) => sum + getNodeBytes(child), 0);
  return directBytes + childBytes;
};

/**
 * Formatta una data/ora in formato leggibile italiano
 */
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

/**
 * Componente per la gestione della pagina del microservizio Cachemanager
 *
 * Questo componente gestisce 5 tabs:
 * - Tab "General Settings": impostazioni comuni (DB Logger, Log Level, Data Provider, Communication Channels, Logs)
 * - Tab "Specific": strumenti specifici per recuperare candles dai vari provider
 * - Tab "Cache (L3)": gestione della cache Redis con visualizzazione keys e cancellazione
 * - Tab "L2": gestione della cache su file system con tree view e audit
 * - Tab "L2-hygiene": risultati dell'audit di hygiene della cache L2
 */
export default function CachemanagerMicroservicePage({
  onReleaseChange,
  onHealthChange,
  onOpenReleaseModal,
}: Props) {
  // Gestione tab attivo
  const [activeTab, setActiveTab] = useState<"general" | "specific" | "cache" | "l2" | "l2-hygiene">("general");

  // ========== STATO PER TAB "SPECIFIC" (Get Candle) ==========

  // Campi del form per recuperare le candles
  const [candleSymbol, setCandleSymbol] = useState("");
  const [candleExchange, setCandleExchange] = useState("");
  const [candleStart, setCandleStart] = useState("");
  const [candleEnd, setCandleEnd] = useState("");
  const [candleTf, setCandleTf] = useState("1d");

  // Stato della richiesta candles
  const [candleStatus, setCandleStatus] = useState<Status>("idle");
  const [candleError, setCandleError] = useState<string | null>(null);
  const [candleRows, setCandleRows] = useState<any[]>([]);
  const [candleTab, setCandleTab] = useState<"table" | "chart">("table");

  // Stato del provider di dati (gestito anche nel tab General tramite MicroserviceGeneralTab)
  const [provider, setProvider] = useState<"FMP" | "ALPACA" | "IBKR" | "">("");
  const [providerStatus, setProviderStatus] = useState<Status>("idle");
  const [providerError, setProviderError] = useState<string | null>(null);

  // ========== STATO PER TAB "CACHE" (L3 - Redis) ==========

  const [l3Size, setL3Size] = useState<any>(null);
  const [l3Status, setL3Status] = useState<Status>("idle");
  const [l3Error, setL3Error] = useState<string | null>(null);
  const [showL3Confirm, setShowL3Confirm] = useState(false);
  const [l3DeleteTarget, setL3DeleteTarget] = useState<L3Target | null>(null);
  const [l3Expanded, setL3Expanded] = useState<Record<string, boolean>>({});

  // ========== STATO PER TAB "L2" (File System Cache) ==========

  const [l2Size, setL2Size] = useState<any>(null);
  const [l2Status, setL2Status] = useState<Status>("idle");
  const [l2Error, setL2Error] = useState<string | null>(null);
  const [l2Expanded, setL2Expanded] = useState<Record<string, boolean>>({});
  const [l2Letter, setL2Letter] = useState<string | null>(null);
  const [l2Search, setL2Search] = useState<string>("");
  const [showL2Confirm, setShowL2Confirm] = useState(false);
  const [l2DeleteTarget, setL2DeleteTarget] = useState<L3Target | null>(null);

  // Stato per l'audit L2
  const [l2AuditStatus, setL2AuditStatus] = useState<Status>("idle");
  const [l2AuditError, setL2AuditError] = useState<string | null>(null);
  const [l2AuditResult, setL2AuditResult] = useState<any>(null);
  const [l2AuditTarget, setL2AuditTarget] = useState<string | null>(null);
  const [l2AuditLastRunAt, setL2AuditLastRunAt] = useState<string | null>(null);
  const [, setShowL2AuditModal] = useState(false);

  // Stato per la visualizzazione dei file L2 (modale) - preparato per futuri sviluppi
  const [, setShowL2FileModal] = useState(false);
  const [, setL2FileName] = useState<string | null>(null);
  const [, setL2FileStatus] = useState<Status>("idle");
  const [, setL2FileError] = useState<string | null>(null);
  const [, setL2FileData] = useState<any>(null);
  const [, setL2FileMeta] = useState<any>(null);
  const [, setL2FileEditing] = useState(false);
  const [, setL2FileDraft] = useState<string>("");
  const [, setL2FileRequest] = useState<Record<string, string> | null>(null);
  const [, setL2FileTab] = useState<"json" | "table">("json");
  const [, setL2FileTimeFilter] = useState<string>("");
  const [, setL2FileTableDraft] = useState<any[] | null>(null);

  // ========== USE EFFECTS ==========

  // Carica L3 size all'avvio del componente
  useEffect(() => {
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    setL3Status("loading");
    fetch(`${env.apiBaseUrl}/cachemanager/status/L3/size`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data?.ok === false) throw new Error(data?.error || data?.message || "Errore L3 size");
        setL3Size(data.data || data);
        setL3Status("idle");
      })
      .catch((err) => {
        setL3Status("error");
        setL3Error(err?.message || "Errore nel recupero L3 size");
      });
  }, []);

  // Carica L2 size quando si apre il tab L2
  useEffect(() => {
    if (activeTab !== "l2") return;
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    setL2Status("loading");
    fetch(`${env.apiBaseUrl}/cachemanager/status/L2/size`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data?.ok === false) throw new Error(data?.error || data?.message || "Errore L2 size");
        setL2Size(data.data || data);
        setL2Status("idle");
      })
      .catch((err) => {
        setL2Status("error");
        setL2Error(err?.message || "Errore nel recupero L2 size");
      });
  }, [activeTab]);

  // ========== HANDLERS ==========

  /**
   * Handler per eseguire l'audit L2 (hygiene check)
   */
  const runL2Audit = useCallback(async ({ symbol, tf }: { symbol?: string; tf?: string } = {}) => {
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    setL2AuditStatus("loading");
    setL2AuditError(null);
    setL2AuditResult(null);
    setL2AuditTarget(symbol ? `${symbol}${tf ? ` (${tf})` : ""}` : "ALL");
    try {
      const params = new URLSearchParams();
      if (symbol) params.set("symbol", symbol);
      if (tf) params.set("tf", tf);
      const res = await fetch(`${env.apiBaseUrl}/cachemanager/l2/audit?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || data?.message || "Errore audit L2");
      }
      setL2AuditResult(data?.data ?? data);
      setL2AuditStatus("idle");
      setL2AuditLastRunAt(new Date().toISOString());
      setShowL2AuditModal(true);
    } catch (err: any) {
      setL2AuditStatus("error");
      setL2AuditError(err?.message || "Errore audit L2");
    }
  }, []);

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      {/* BARRA DEI TAB */}
      <div className="flex gap-6 border-b border-slate-200">
        {/* Tab General Settings */}
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "general" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
          }`}
          onClick={() => setActiveTab("general")}
        >
          General Settings
        </button>

        {/* Tab Specific (Get Candle) */}
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "specific" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
          }`}
          onClick={() => setActiveTab("specific")}
        >
          Specific
        </button>

        {/* Tab Cache (L3 - Redis) */}
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "cache" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
          }`}
          onClick={() => setActiveTab("cache")}
        >
          Cache
        </button>

        {/* Tab L2 (File system cache) */}
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "l2" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
          }`}
          onClick={() => setActiveTab("l2")}
        >
          L2
        </button>

        {/* Tab L2-hygiene (Audit results) */}
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "l2-hygiene" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
          }`}
          onClick={() => setActiveTab("l2-hygiene")}
        >
          L2-hygiene
        </button>
      </div>

      {/* CONTENUTO DEI TAB */}

      {/* Tab General: Usa il componente condiviso con il layout speciale a 2 colonne per cachemanager */}
      {activeTab === "general" && (
        <div className="flex-1 min-h-0 flex flex-col">
          <MicroserviceGeneralTab
            microservice="cachemanager"
            onReleaseChange={onReleaseChange}
            onHealthChange={onHealthChange}
            onOpenReleaseModal={onOpenReleaseModal}
          />
        </div>
      )}

      {/* Tab Specific: Form per recuperare candles dai vari provider */}
      {activeTab === "specific" && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-white/70 px-3 py-3 text-[11px] text-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-700">Candles</div>
              <div className="mt-1 text-[11px] text-slate-600">
                Strumenti dedicati al microservizio cachemanager.
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-3">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-800">Get candle</div>
                <div className="text-[11px] text-slate-500">Recupera candele dal provider selezionato.</div>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-700">
                <span className="font-semibold">Provider</span>
                {/* Radio buttons per selezionare il provider */}
                {["FMP", "ALPACA", "IBKR"].map((prov) => (
                  <label key={prov} className="inline-flex items-center gap-1">
                    <input
                      type="radio"
                      name="provider"
                      value={prov}
                      checked={provider === prov}
                      onChange={async () => {
                        setProviderError(null);
                        setProviderStatus("loading");
                        try {
                          const token =
                            typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
                          const res = await fetch(`${env.apiBaseUrl}/cachemanager/provider/${prov}`, {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              ...(token ? { Authorization: `Bearer ${token}` } : {}),
                            },
                          });
                          const data = await res.json().catch(() => ({}));
                          if (!res.ok || data?.ok === false)
                            throw new Error(data?.error || data?.message || "Errore set provider");
                          setProvider(prov as any);
                          setProviderStatus("idle");
                        } catch (err: any) {
                          setProviderStatus("error");
                          setProviderError(err?.message || "Errore cambio provider");
                        }
                      }}
                      className="h-3 w-3"
                    />
                    <span>{prov === "ALPACA" ? "Alpaca" : prov}</span>
                  </label>
                ))}
                {providerStatus === "loading" && <span className="text-slate-500">Aggiornamento...</span>}
              </div>
            </div>
            {providerError && <div className="mb-2 text-[11px] text-red-600">{providerError}</div>}

            {/* Form per recuperare le candles */}
            <form
              className="grid gap-3 md:grid-cols-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setCandleStatus("loading");
                setCandleError(null);
                setCandleRows([]);
                const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
                const base = `${env.apiBaseUrl}/cachemanager/candles`;
                const params = new URLSearchParams();
                if (candleSymbol) params.set("symbol", candleSymbol);
                if (candleExchange) params.set("exchange", candleExchange);
                if (candleStart) params.set("startDate", candleStart);
                if (candleEnd) params.set("endDate", candleEnd);
                if (candleTf) params.set("tf", candleTf);
                try {
                  const res = await fetch(`${base}?${params.toString()}`, {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                  });
                  const data = await res.json().catch(() => ({}));
                  if (!res.ok) {
                    throw new Error(data?.error || data?.message || "Errore richiesta");
                  }
                  const rows = Array.isArray(data) ? data : data?.data || data?.candles || [];
                  setCandleRows(Array.isArray(rows) ? rows : []);
                  setCandleStatus("idle");
                } catch (err: any) {
                  setCandleError(err?.message || "Errore nel recupero candele");
                  setCandleStatus("error");
                }
              }}
            >
              <div>
                <label className="text-[11px] font-semibold text-slate-700">Symbol</label>
                <input
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                  value={candleSymbol}
                  onChange={(e) => setCandleSymbol(e.target.value)}
                  placeholder="AAPL"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-700">Exchange</label>
                <input
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                  value={candleExchange}
                  onChange={(e) => setCandleExchange(e.target.value)}
                  placeholder="NYSE"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-700">Start date</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                  value={candleStart}
                  onChange={(e) => setCandleStart(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-700">End date</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                  value={candleEnd}
                  onChange={(e) => setCandleEnd(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-700">TF</label>
                <select
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                  value={candleTf}
                  onChange={(e) => setCandleTf(e.target.value)}
                >
                  {["1m", "5m", "15m", "30m", "1h", "2h", "6h", "12h", "1d", "1w", "1M"].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-4 flex justify-end">
                <BaseButton
                  type="submit"
                  variant="solid"
                  color="primary"
                  size="sm"
                  startIcon={<AppIcon icon="mdi:candle" />}
                  disabled={candleStatus === "loading"}
                >
                  Get candle
                </BaseButton>
              </div>
            </form>

            {candleError && <div className="mt-2 text-[11px] text-red-600">{candleError}</div>}
            {candleStatus === "loading" && <div className="mt-2 text-[11px] text-slate-500">Caricamento...</div>}

            {/* Visualizzazione risultati: tabella o chart */}
            {candleRows.length > 0 && (
              <div className="mt-3">
                <div className="mb-2 flex items-center gap-2 text-[11px]">
                  <button
                    className={`rounded-md px-3 py-1 text-xs font-semibold ${
                      candleTab === "table"
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                    onClick={() => setCandleTab("table")}
                  >
                    Table
                  </button>
                  <button
                    className={`rounded-md px-3 py-1 text-xs font-semibold ${
                      candleTab === "chart"
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                    onClick={() => setCandleTab("chart")}
                  >
                    Chart
                  </button>
                </div>

                {candleTab === "table" && (
                  <div className="overflow-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-xs">
                      <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="px-3 py-2 font-semibold">Time</th>
                          <th className="px-3 py-2 font-semibold">Open</th>
                          <th className="px-3 py-2 font-semibold">High</th>
                          <th className="px-3 py-2 font-semibold">Low</th>
                          <th className="px-3 py-2 font-semibold">Close</th>
                          <th className="px-3 py-2 font-semibold">Volume</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {candleRows.map((candle, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="px-3 py-2 text-slate-800">
                              {candle.t || candle.time || candle.date || "-"}
                            </td>
                            <td className="px-3 py-2 text-slate-800">{candle.o ?? candle.open ?? "-"}</td>
                            <td className="px-3 py-2 text-slate-800">{candle.h ?? candle.high ?? "-"}</td>
                            <td className="px-3 py-2 text-slate-800">{candle.l ?? candle.low ?? "-"}</td>
                            <td className="px-3 py-2 text-slate-800">{candle.c ?? candle.close ?? "-"}</td>
                            <td className="px-3 py-2 text-slate-800">{candle.v ?? candle.volume ?? "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {candleTab === "chart" && (
                  <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 p-2">
                    {candleRows.length > 0 ? (
                      <ReactApexChart
                        type="candlestick"
                        height={360}
                        options={{
                          chart: { toolbar: { show: false } },
                          xaxis: {
                            type: "datetime",
                            labels: { style: { fontSize: "10px" } },
                          },
                          yaxis: [
                            {
                              tooltip: { enabled: true },
                              labels: { style: { fontSize: "10px" } },
                            },
                            {
                              opposite: true,
                              seriesName: "Volume",
                              labels: { style: { fontSize: "10px" } },
                              show: true,
                            },
                          ],
                          tooltip: { shared: true },
                          plotOptions: {
                            candlestick: {
                              colors: { upward: "#10b981", downward: "#ef4444" },
                            },
                          },
                        }}
                        series={[
                          {
                            name: "Candle",
                            type: "candlestick",
                            data: candleRows.map((c) => ({
                              x: new Date(c.t || c.time || c.date || "").getTime(),
                              y: [
                                Number(c.o ?? c.open ?? 0),
                                Number(c.h ?? c.high ?? 0),
                                Number(c.l ?? c.low ?? 0),
                                Number(c.c ?? c.close ?? 0),
                              ],
                            })),
                          },
                          {
                            name: "Volume",
                            type: "column",
                            data: candleRows.map((c) => ({
                              x: new Date(c.t || c.time || c.date || "").getTime(),
                              y: Number(c.v ?? c.volume ?? 0),
                            })),
                          },
                        ]}
                      />
                    ) : (
                      <div className="text-[11px] text-slate-600">Nessun dato da mostrare.</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {candleStatus === "idle" && candleRows.length === 0 && !candleError && (
              <div className="mt-2 text-[11px] text-slate-500">Nessun risultato.</div>
            )}
          </div>
        </div>
      )}

      {/* Tab Cache (L3 - Redis): Gestione cache Redis */}
      {activeTab === "cache" && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-white/70 px-3 py-3 text-[11px] text-slate-700">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-semibold text-slate-700">L3 Cache (Redis)</div>
            <div className="flex items-center gap-2">
              <BaseButton
                variant="outline"
                color="neutral"
                size="sm"
                startIcon={<AppIcon icon="mdi:refresh" />}
                onClick={() => {
                  const token =
                    typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
                  setL3Status("loading");
                  fetch(`${env.apiBaseUrl}/cachemanager/status/L3/size`, {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                  })
                    .then(async (res) => {
                      const data = await res.json().catch(() => ({}));
                      if (!res.ok || data?.ok === false)
                        throw new Error(data?.error || data?.message || "Errore L3 size");
                      setL3Size(data.data || data);
                      setL3Status("idle");
                    })
                    .catch((err) => {
                      setL3Status("error");
                      setL3Error(err?.message || "Errore nel recupero L3 size");
                    });
                }}
              >
                Reload
              </BaseButton>
              <BaseButton
                variant="outline"
                color="danger"
                size="sm"
                startIcon={<AppIcon icon="mdi:delete" />}
                onClick={() => {
                  setL3DeleteTarget({ type: "all" });
                  setShowL3Confirm(true);
                }}
              >
                Svuota cache
              </BaseButton>
            </div>
          </div>
          {l3Status === "error" && l3Error && (
            <div className="mt-1 text-[11px] text-red-600">{l3Error}</div>
          )}
          {l3Status === "loading" && <div className="mt-1 text-[11px] text-slate-500">Caricamento...</div>}
          {l3Size && l3Status !== "loading" && (
            <div className="mt-3 space-y-3">
              {(() => {
                const total = Number(l3Size.totalBytes || 0);
                const max = Number(l3Size.maxmemory || 0);
                const pct = max > 0 ? Math.min(100, (total / max) * 100) : 0;
                let color = "bg-emerald-500";
                if (pct >= 85) color = "bg-red-500";
                else if (pct >= 75) color = "bg-amber-500";
                else if (pct >= 50) color = "bg-yellow-500";
                return (
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-700">
                      <span>Utilizzo: {total.toLocaleString()} bytes</span>
                      <span>Max: {max ? max.toLocaleString() : "-"} bytes</span>
                    </div>
                    {max ? (
                      <div className="mt-1 h-3 w-full overflow-hidden rounded bg-slate-200">
                        <div className={`h-3 ${color}`} style={{ width: `${pct}%` }} />
                      </div>
                    ) : (
                      <div className="mt-1 text-[11px] text-slate-500">Max memory non disponibile</div>
                    )}
                  </div>
                );
              })()}

              <div className="w-full rounded-lg border border-slate-200 bg-white">
                <div className="border-b border-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
                  Keys (raggruppate per symbol)
                </div>
                <div className="overflow-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-xs">
                    <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-3 py-2 font-semibold">Symbol</th>
                        <th className="px-3 py-2 font-semibold">Bytes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(() => {
                        const groups: Record<string, { total: number; items: any[] }> = {};
                        (l3Size.keys || []).forEach((k: any) => {
                          const parts = String(k.key || "").split(":");
                          const symbol = parts[1] || k.key || "unknown";
                          if (!groups[symbol]) groups[symbol] = { total: 0, items: [] };
                          groups[symbol].total += Number(k.bytes || 0);
                          groups[symbol].items.push(k);
                        });
                        const totalBytes = Number(l3Size.totalBytes || 0) || 1;
                        const symbols = Object.entries(groups);
                        if (!symbols.length) {
                          return (
                            <tr>
                              <td colSpan={2} className="px-3 py-2 text-slate-600">
                                Nessuna chiave trovata.
                              </td>
                            </tr>
                          );
                        }
                        return symbols.map(([symbol, info]) => {
                          const pct = Math.min(100, (info.total / totalBytes) * 100);
                          const expanded = !!l3Expanded[symbol];
                          return (
                            <React.Fragment key={symbol}>
                              <tr className="hover:bg-slate-50">
                                <td
                                  className="px-3 py-2 text-slate-800 cursor-pointer"
                                  onClick={() =>
                                    setL3Expanded((prev) => ({ ...prev, [symbol]: !prev[symbol] }))
                                  }
                                >
                                  <span className="mr-2 text-[10px] text-slate-500">
                                    {expanded ? "▼" : "▶"}
                                  </span>
                                  {symbol}
                                </td>
                                <td className="px-3 py-2 text-slate-800">
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-24 rounded bg-slate-200">
                                      <div className="h-2 rounded bg-blue-500" style={{ width: `${pct}%` }} />
                                    </div>
                                    <span>{info.total.toLocaleString()} B</span>
                                    <button
                                      type="button"
                                      className="ml-auto text-red-600 hover:text-red-700"
                                      title="Svuota simbolo"
                                      onClick={() => {
                                        setL3DeleteTarget({ type: "symbol", symbol });
                                        setShowL3Confirm(true);
                                      }}
                                    >
                                      <AppIcon icon="mdi:trash-can-outline" width={16} height={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              {expanded &&
                                info.items.map((k, idx) => {
                                  const subPct = Math.min(100, (Number(k.bytes || 0) / info.total) * 100);
                                  return (
                                    <tr key={`${symbol}-${idx}`} className="bg-slate-50">
                                      <td className="px-6 py-1 text-slate-700 break-all text-[11px]">{k.key}</td>
                                      <td className="px-3 py-1 text-slate-700">
                                        <div className="flex items-center gap-2">
                                          <div className="h-2 w-16 rounded bg-slate-200">
                                            <div className="h-2 rounded bg-emerald-500" style={{ width: `${subPct}%` }} />
                                          </div>
                                          <span>{Number(k.bytes || 0).toLocaleString()} B</span>
                                          <button
                                            type="button"
                                            className="ml-auto text-red-600 hover:text-red-700"
                                            title="Cancella file"
                                            onClick={() => {
                                              const parts = String(k.key || "").split(":");
                                              const sym = parts[1] || symbol;
                                              const tfPart = parts[2] || "";
                                              setL3DeleteTarget({ type: "file", symbol: sym, tf: tfPart });
                                              setShowL3Confirm(true);
                                            }}
                                          >
                                            <AppIcon icon="mdi:trash-can-outline" width={14} height={14} />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                            </React.Fragment>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab L2: Gestione cache file system */}
      {activeTab === "l2" && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-white/70 px-3 py-3 text-[11px] text-slate-700">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-700">L2 Cache (File system)</div>
              {l2Size?.totalBytes !== undefined && (
                <div className="text-[11px] text-slate-500">
                  {(() => {
                    const symbols = Array.isArray(l2Size?.tree?.files)
                      ? l2Size.tree.files.filter(
                          (e: any) => !String(e?.path || "").toLowerCase().endsWith(".ds_store")
                        ).length
                      : 0;
                    const files = l2Size.fileCount ?? l2Size?.tree?.fileCount ?? 0;
                    const dirs = l2Size.dirCount ?? l2Size?.tree?.dirCount ?? symbols;
                    return (
                      <>
                        Total: {formatBytes(l2Size.totalBytes)} · File: {files} · Symbol: {symbols} · Dir: {dirs}
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
            {l2Status === "loading" && <span className="text-[11px] text-slate-500">Caricamento...</span>}
            <div className="ml-auto flex items-center gap-2">
              <BaseButton
                variant="outline"
                color="neutral"
                size="sm"
                startIcon={<AppIcon icon="mdi:refresh" />}
                onClick={() => {
                  const token =
                    typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
                  setL2Status("loading");
                  fetch(`${env.apiBaseUrl}/cachemanager/status/L2/size`, {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                  })
                    .then(async (res) => {
                      const data = await res.json().catch(() => ({}));
                      if (!res.ok || data?.ok === false)
                        throw new Error(data?.error || data?.message || "Errore L2 size");
                      setL2Size(data.data || data);
                      setL2Status("idle");
                    })
                    .catch((err) => {
                      setL2Status("error");
                      setL2Error(err?.message || "Errore nel recupero L2 size");
                    });
                }}
              >
                Reload
              </BaseButton>
              <BaseButton
                variant="outline"
                color="neutral"
                size="sm"
                startIcon={<AppIcon icon="mdi:broom" />}
                onClick={() => runL2Audit()}
                disabled={l2AuditStatus === "loading"}
              >
                Run hygiene
              </BaseButton>
              <BaseButton
                variant="outline"
                color="danger"
                size="sm"
                startIcon={<AppIcon icon="mdi:delete" />}
                onClick={() => {
                  setL2DeleteTarget({ type: "all" });
                  setShowL2Confirm(true);
                }}
              >
                Svuota cache
              </BaseButton>
            </div>
          </div>
          {l2AuditStatus === "loading" && (
            <div className="mb-2 text-[11px] text-slate-500">Hygiene in corso...</div>
          )}
          {l2AuditStatus === "error" && l2AuditError && (
            <div className="mb-2">
              <Alert message={l2AuditError} tone="warn" onClose={() => setL2AuditError(null)} />
            </div>
          )}
          {l2AuditResult?.summary && l2AuditStatus === "idle" && (
            <div className="mb-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-700">
              <div className="font-semibold text-slate-700">
                Hygiene result {l2AuditTarget ? `(${l2AuditTarget})` : ""}
              </div>
              <div className="mt-1 text-[11px] text-slate-600">
                Symbols: {l2AuditResult.summary.totalSymbols} · Files: {l2AuditResult.summary.totalFiles} ·
                Candles: {l2AuditResult.summary.totalCandles} · Valid: {l2AuditResult.summary.validCandles} ·
                Broken: {l2AuditResult.summary.brokenCandles}
              </div>
            </div>
          )}
          {(() => {
            const total = Number(l2Size?.totalBytes || 0);
            const maxMb = Number((l2Size?.maxSizeCache ?? l2Size?.maxSizecache ?? l2Size?.maxsizecache) || 0);
            const maxBytes = Number.isFinite(maxMb) && maxMb > 0 ? maxMb * 1024 * 1024 : 0;
            if (!maxBytes) return null;
            const pct = Math.min(100, (total / maxBytes) * 100);
            let color = "bg-emerald-500";
            if (pct >= 85) color = "bg-red-500";
            else if (pct >= 75) color = "bg-amber-500";
            else if (pct >= 50) color = "bg-yellow-500";
            return (
              <div className="mb-2 rounded-md border border-slate-200 bg-white px-3 py-2">
                <div className="flex items-center justify-between text-[11px] text-slate-700">
                  <span>Utilizzo: {formatBytes(total)}</span>
                  <span>Max: {maxBytes ? formatBytes(maxBytes) : "-"}</span>
                </div>
                <div className="mt-1 h-3 w-full overflow-hidden rounded bg-slate-200">
                  <div className={`h-3 ${color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })()}
          {l2Error && (
            <div className="mb-2">
              <Alert message={l2Error} tone="warn" onClose={() => setL2Error(null)} />
            </div>
          )}
          {!l2Error && l2Size && l2Size.exists === false && (
            <div className="text-[11px] text-slate-500">Directory cache non trovata.</div>
          )}
          {!l2Error && l2Size && l2Size.exists !== false && (
            <div className="rounded-md border border-slate-200 bg-white">
              {(() => {
                const rawEntries = Array.isArray(l2Size?.tree?.files) ? l2Size.tree.files : [];
                const entries: { name: string; data: any }[] = rawEntries
                  .filter((e: any) => {
                    const p = String(e?.path || "").toLowerCase();
                    return p && !p.endsWith(".ds_store");
                  })
                  .map((entry: any, idx: number) => {
                    const name =
                      typeof entry?.path === "string"
                        ? entry.path.split(/[/\\]/).filter(Boolean).pop() || entry.path
                        : `item-${idx}`;
                    return { name, data: entry };
                  })
                  .sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));

                const letters: string[] = Array.from(
                  new Set(entries.map((e: { name: string }) => (e.name[0] ? e.name[0].toUpperCase() : "")).filter(Boolean))
                ).sort();
                const useFilter = entries.length > 20;
                const activeLetter =
                  letters.length === 0
                    ? null
                    : l2Letter && letters.includes(l2Letter)
                      ? l2Letter
                      : useFilter
                        ? letters[0] || null
                        : null;

                const normalizedSearch = (l2Search || "").trim().toUpperCase();
                const filtered =
                  useFilter && activeLetter
                    ? entries.filter(
                        (e: { name: string }) =>
                          e.name.toUpperCase().startsWith(activeLetter) &&
                          (!normalizedSearch || e.name.toUpperCase().includes(normalizedSearch))
                      )
                    : entries.filter(
                        (e: { name: string }) => !normalizedSearch || e.name.toUpperCase().includes(normalizedSearch)
                      );

                const totalFromRoot = typeof l2Size?.totalBytes === "number" ? l2Size.totalBytes : 0;
                const sumChildren =
                  totalFromRoot > 0
                    ? totalFromRoot
                    : entries.reduce((sum: number, e: { data: any }) => sum + getNodeBytes(e.data), 0);

                return (
                  <>
                    {entries.length > 20 && (
                      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-3 py-2 text-[11px]">
                        <div className="flex flex-wrap gap-1">
                          {letters.map((ltr) => (
                            <button
                              key={ltr}
                              type="button"
                              className={`rounded px-2 py-1 font-semibold ${
                                ltr === activeLetter
                                  ? "bg-slate-900 text-white"
                                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                              }`}
                              onClick={() => setL2Letter(ltr)}
                            >
                              {ltr}
                            </button>
                          ))}
                        </div>
                        <div className="ml-auto flex items-center gap-1">
                          <input
                            type="text"
                            list="l2-symbols"
                            placeholder="Cerca symbol"
                            className="w-40 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                            value={l2Search}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setL2Search(e.target.value)}
                          />
                          <datalist id="l2-symbols">
                            {entries.map((e) => (
                              <option key={e.name} value={e.name} />
                            ))}
                          </datalist>
                        </div>
                      </div>
                    )}
                    <table className="min-w-full text-[11px] text-slate-700">
                      <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="px-3 py-2 font-semibold">Path</th>
                          <th className="px-3 py-2 font-semibold w-48">Size</th>
                          <th className="px-3 py-2 font-semibold text-right w-24">Bytes</th>
                          <th className="px-2 py-2 font-semibold text-right w-12"> </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filtered.map(({ name, data }, idx: number) => {
                          const total = sumChildren || 0;
                          const entryBytes = getNodeBytes(data);
                          const pct = total > 0 ? (entryBytes / total) * 100 : 0;
                          const expanded = !!l2Expanded[name];
                          const children = Array.isArray(data?.files)
                            ? data.files.filter(
                                (c: any) => !String(c?.path || "").toLowerCase().endsWith(".ds_store")
                              )
                            : [];
                          const firstTf = (() => {
                            const first = children[0];
                            const childName =
                              typeof first?.path === "string"
                                ? first.path.split(/[/\\]/).filter(Boolean).pop() || ""
                                : "";
                            const match = /^(\d{4})-(\d{2})_(.+)\.json$/i.exec(childName);
                            return match?.[3] || "";
                          })();
                          return (
                            <React.Fragment key={`${name}-${idx}`}>
                              <tr
                                className="hover:bg-slate-50 cursor-pointer"
                                onClick={() =>
                                  setL2Expanded((prev) => ({
                                    ...prev,
                                    [name]: !expanded,
                                  }))
                                }
                              >
                                <td className="px-3 py-2 font-semibold text-slate-800">{name}</td>
                                <td className="px-3 py-2">
                                  <div className="flex items-center gap-2">
                                    <div className="relative h-2 w-full rounded-full bg-slate-100">
                                      <div
                                        className={`absolute left-0 top-0 h-2 rounded-full ${progressColor(pct)}`}
                                        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                                      />
                                    </div>
                                    <span className="whitespace-nowrap text-[11px] text-slate-600">
                                      {pct.toFixed(1)}%
                                    </span>
                                  </div>
                                </td>
                                <td className="px-3 py-2 text-right whitespace-nowrap">{formatBytes(entryBytes)}</td>
                                <td className="px-2 py-2 text-right">
                                  <button
                                    type="button"
                                    className="rounded-full p-1 text-red-500 hover:bg-red-50"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setL2DeleteTarget({ type: "symbol", symbol: name });
                                      setShowL2Confirm(true);
                                    }}
                                    aria-label={`Cancella ${name}`}
                                  >
                                    <AppIcon icon="mdi:trash-can-outline" width={16} height={16} />
                                  </button>
                                  <button
                                    type="button"
                                    className="ml-1 rounded-full p-1 text-slate-500 hover:bg-slate-100"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      runL2Audit({ symbol: name, tf: firstTf || undefined });
                                    }}
                                    aria-label={`Audit ${name}`}
                                    title={firstTf ? `Audit ${name} (${firstTf})` : `Audit ${name}`}
                                  >
                                    <AppIcon icon="mdi:broom" width={16} height={16} />
                                  </button>
                                </td>
                              </tr>
                              {expanded &&
                                children.map((child: any, cIdx: number) => {
                                  const childName =
                                    typeof child?.path === "string"
                                      ? child.path.split(/[/\\]/).filter(Boolean).pop() || child.path
                                      : `child-${cIdx}`;
                                  const createdAt = child?.createdAt;
                                  const updatedAt = child?.updatedAt;
                                  const isUpdated =
                                    createdAt &&
                                    updatedAt &&
                                    new Date(createdAt).getTime() !== new Date(updatedAt).getTime();
                                  const childBytes = getNodeBytes(child);
                                  const pctChild = entryBytes > 0 ? (childBytes / entryBytes) * 100 : 0;
                                  return (
                                    <tr key={`${name}-${childName}`} className="bg-slate-50">
                                      <td className="px-6 py-1 text-slate-700">
                                        <span className="inline-flex items-center gap-2">
                                          {isUpdated && (
                                            <span
                                              className="h-1.5 w-1.5 rounded-full bg-red-500"
                                              title={
                                                updatedAt
                                                  ? `Updated ${formatDate(updatedAt)}`
                                                  : "File aggiornato"
                                              }
                                            />
                                          )}
                                          <span>{childName}</span>
                                        </span>
                                      </td>
                                      <td className="px-3 py-1">
                                        <div className="flex items-center gap-2">
                                          <div className="relative h-2 w-full rounded-full bg-slate-100">
                                            <div
                                              className={`absolute left-0 top-0 h-2 rounded-full ${progressColor(pctChild)}`}
                                              style={{ width: `${Math.min(100, Math.max(0, pctChild))}%` }}
                                            />
                                          </div>
                                          <span className="whitespace-nowrap text-[11px] text-slate-600">
                                            {pctChild.toFixed(1)}%
                                          </span>
                                        </div>
                                      </td>
                                      <td className="px-3 py-1 text-right whitespace-nowrap">
                                        {formatBytes(childBytes)}
                                      </td>
                                      <td className="px-2 py-1 text-right">
                                        <div className="inline-flex items-center gap-1">
                                          <button
                                            type="button"
                                            className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
                                            onClick={async (e) => {
                                              e.stopPropagation();
                                              const match = /^(\d{4})-(\d{2})_(.+)\.json$/i.exec(childName || "");
                                              const year = match?.[1];
                                              const month = match?.[2];
                                              const tf = match?.[3];
                                              const token =
                                                typeof localStorage !== "undefined"
                                                  ? localStorage.getItem("astraai:auth:token")
                                                  : null;
                                              setL2FileName(childName);
                                              setL2FileError(null);
                                              setL2FileData(null);
                                              setL2FileMeta(null);
                                              setL2FileEditing(false);
                                              setL2FileDraft("");
                                              setL2FileTab("json");
                                              setL2FileTimeFilter("");
                                              setL2FileTableDraft(null);
                                              setL2FileStatus("loading");
                                              setShowL2FileModal(true);
                                              try {
                                                const params = new URLSearchParams();
                                                const requestParams: Record<string, string> = {};
                                                if (year && month && tf) {
                                                  params.set("symbol", name);
                                                  params.set("year", year);
                                                  params.set("month", month);
                                                  params.set("tf", tf);
                                                  requestParams.symbol = name;
                                                  requestParams.year = year;
                                                  requestParams.month = month;
                                                  requestParams.tf = tf;
                                                } else {
                                                  params.set("fileName", `${name}/${childName}`);
                                                  requestParams.fileName = `${name}/${childName}`;
                                                }
                                                const res = await fetch(
                                                  `${env.apiBaseUrl}/cachemanager/l2/file?${params.toString()}`,
                                                  {
                                                    method: "GET",
                                                    headers: {
                                                      "Content-Type": "application/json",
                                                      ...(token ? { Authorization: `Bearer ${token}` } : {}),
                                                    },
                                                  }
                                                );
                                                const data = await res.json().catch(() => ({}));
                                                if (!res.ok || data?.ok === false) {
                                                  throw new Error(data?.error || data?.message || "Errore lettura file");
                                                }
                                                setL2FileData(data?.data ?? data);
                                                setL2FileMeta(data?.meta ?? null);
                                                setL2FileRequest(requestParams);
                                                setL2FileTableDraft(
                                                  Array.isArray(data?.data ?? data) ? [...(data?.data ?? data)] : null
                                                );
                                                setL2FileStatus("idle");
                                              } catch (err: any) {
                                                setL2FileStatus("error");
                                                setL2FileError(err?.message || "Errore lettura file");
                                              }
                                            }}
                                            aria-label={`Visualizza ${childName}`}
                                          >
                                            <AppIcon icon="mdi:eye-outline" width={14} height={14} />
                                          </button>
                                          <button
                                            type="button"
                                            className="rounded-full p-1 text-red-500 hover:bg-red-50"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setL2DeleteTarget({ type: "file", symbol: name, tf: childName });
                                              setShowL2Confirm(true);
                                            }}
                                            aria-label={`Cancella ${childName}`}
                                          >
                                            <AppIcon icon="mdi:trash-can-outline" width={14} height={14} />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                            </React.Fragment>
                          );
                        })}
                        {filtered.length === 0 && (
                          <tr>
                            <td className="px-3 py-2 text-slate-500" colSpan={4}>
                              Nessun file presente nella cache.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* Tab L2-hygiene: Risultati audit L2 */}
      {activeTab === "l2-hygiene" && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-white/70 px-3 py-3 text-[11px] text-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-700">L2 Hygiene</div>
              <div className="text-[11px] text-slate-500">
                Ultimo run: {l2AuditLastRunAt ? formatDate(l2AuditLastRunAt) : "non disponibile"}
              </div>
            </div>
            <BaseButton
              variant="outline"
              color="neutral"
              size="sm"
              startIcon={<AppIcon icon="mdi:broom" />}
              onClick={() => runL2Audit()}
              disabled={l2AuditStatus === "loading"}
            >
              Run hygiene
            </BaseButton>
          </div>

          {l2AuditStatus === "loading" && (
            <div className="mt-2 text-[11px] text-slate-500">Hygiene in corso...</div>
          )}
          {l2AuditStatus === "error" && l2AuditError && (
            <div className="mt-2">
              <Alert message={l2AuditError} tone="warn" onClose={() => setL2AuditError(null)} />
            </div>
          )}

          {l2AuditResult?.summary && l2AuditStatus === "idle" && (
            <div className="mt-3 space-y-3">
              <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-700">Summary</div>
                <div className="mt-1 text-[11px] text-slate-600">
                  Symbols: {l2AuditResult.summary.totalSymbols} · Files: {l2AuditResult.summary.totalFiles} ·
                  Candles: {l2AuditResult.summary.totalCandles} · Valid: {l2AuditResult.summary.validCandles} ·
                  Broken: {l2AuditResult.summary.brokenCandles}
                </div>
                <div className="mt-1 text-[11px] text-slate-600">
                  Range: {formatDate(l2AuditResult.summary.timeRange?.start)} →{" "}
                  {formatDate(l2AuditResult.summary.timeRange?.end)}
                </div>
              </div>

              <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-700">Broken reasons</div>
                <div className="mt-1 text-[11px] text-slate-600">
                  invalid_t: {l2AuditResult.summary.brokenReasons?.invalid_t ?? 0} · invalid_ohlc:{" "}
                  {l2AuditResult.summary.brokenReasons?.invalid_ohlc ?? 0} · invalid_json:{" "}
                  {l2AuditResult.summary.brokenReasons?.invalid_json ?? 0} · not_array:{" "}
                  {l2AuditResult.summary.brokenReasons?.not_array ?? 0}
                </div>
              </div>

              <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-700">Top broken files</div>
                <div className="mt-2 overflow-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-[10px]">
                    <thead className="bg-slate-50 text-left text-[10px] uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-2 py-1">File</th>
                        <th className="px-2 py-1">Symbol</th>
                        <th className="px-2 py-1">TF</th>
                        <th className="px-2 py-1">Broken</th>
                        <th className="px-2 py-1">Broken %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(l2AuditResult.summary.topBrokenFiles || []).map((row: any, idx: number) => (
                        <tr key={`broken-${idx}`} className="hover:bg-slate-50">
                          <td className="px-2 py-1 text-slate-700">{row.file}</td>
                          <td className="px-2 py-1 text-slate-700">{row.symbol}</td>
                          <td className="px-2 py-1 text-slate-700">{row.tf}</td>
                          <td className="px-2 py-1 text-slate-700">{row.broken}</td>
                          <td className="px-2 py-1 text-slate-700">{row.brokenPct?.toFixed?.(1) ?? "-"}</td>
                        </tr>
                      ))}
                      {(!l2AuditResult.summary.topBrokenFiles ||
                        l2AuditResult.summary.topBrokenFiles.length === 0) && (
                        <tr>
                          <td colSpan={5} className="px-2 py-1 text-slate-500">
                            Nessun file problematico.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal conferma cancellazione L3 */}
      {showL3Confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <div className="mb-3 text-base font-semibold text-slate-900">Conferma cancellazione cache</div>
            <div className="text-sm text-slate-700">
              {l3DeleteTarget?.type === "all" && "Questa operazione cancellerà tutti i dati dalla cache L3 (Redis)."}
              {l3DeleteTarget?.type === "symbol" &&
                `Verranno cancellati tutti i dati del symbol ${l3DeleteTarget.symbol || "(sconosciuto)"}.`}
              {l3DeleteTarget?.type === "file" &&
                `Verranno cancellati i dati del symbol ${l3DeleteTarget.symbol || "(sconosciuto)"} per ${
                  l3DeleteTarget.tf || "(tf)"
                }.`}
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <BaseButton
                variant="outline"
                color="neutral"
                size="sm"
                onClick={() => setShowL3Confirm(false)}
              >
                Cancella
              </BaseButton>
              <BaseButton
                variant="solid"
                color="danger"
                size="sm"
                onClick={async () => {
                  const token =
                    typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
                  try {
                    let url = `${env.apiBaseUrl}/cachemanager/status/L3/size`;
                    if (l3DeleteTarget?.type === "symbol" && l3DeleteTarget.symbol) {
                      url = `${url}/${encodeURIComponent(l3DeleteTarget.symbol)}`;
                    } else if (l3DeleteTarget?.type === "file" && l3DeleteTarget.symbol) {
                      url = `${url}/${encodeURIComponent(l3DeleteTarget.symbol)}/${encodeURIComponent(
                        l3DeleteTarget.tf || ""
                      )}`;
                    }

                    const res = await fetch(url, {
                      method: "DELETE",
                      headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                      },
                    });
                    const data = await res.json().catch(() => ({}));
                    if (!res.ok || data?.ok === false) throw new Error(data?.error || data?.message || "Errore DELETE");
                    setShowL3Confirm(false);
                    setL3DeleteTarget(null);
                    // refresh size
                    setL3Status("loading");
                    const resSize = await fetch(`${env.apiBaseUrl}/cachemanager/status/L3/size`, {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                      },
                    });
                    const sizeData = await resSize.json().catch(() => ({}));
                    if (resSize.ok && sizeData?.data) setL3Size(sizeData.data);
                    setL3Status("idle");
                  } catch (err: any) {
                    setL3Status("error");
                    setL3Error(err?.message || "Errore nello svuotare la cache");
                    setShowL3Confirm(false);
                    setL3DeleteTarget(null);
                  }
                }}
              >
                OK
              </BaseButton>
            </div>
          </div>
        </div>
      )}

      {/* Modal conferma cancellazione L2 */}
      {showL2Confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <div className="mb-3 text-base font-semibold text-slate-900">Conferma cancellazione cache L2</div>
            <div className="text-sm text-slate-700">
              {l2DeleteTarget?.type === "all" && "Questa operazione cancellerà tutti i file nella cache L2."}
              {l2DeleteTarget?.type === "symbol" &&
                `Verranno cancellati tutti i dati del symbol ${l2DeleteTarget.symbol || "(sconosciuto)"}.`}
              {l2DeleteTarget?.type === "file" &&
                `Verranno cancellati i dati del symbol ${l2DeleteTarget.symbol || "(sconosciuto)"} per ${
                  l2DeleteTarget.tf || "(file)"
                }.`}
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <BaseButton variant="outline" color="neutral" size="sm" onClick={() => setShowL2Confirm(false)}>
                Cancella
              </BaseButton>
              <BaseButton
                variant="solid"
                color="danger"
                size="sm"
                onClick={async () => {
                  const token =
                    typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
                  try {
                    let url = `${env.apiBaseUrl}/cachemanager/status/L2/size`;
                    if (l2DeleteTarget?.type === "symbol" && l2DeleteTarget.symbol) {
                      url = `${url}/${encodeURIComponent(l2DeleteTarget.symbol)}`;
                    } else if (l2DeleteTarget?.type === "file" && l2DeleteTarget.symbol) {
                      url = `${url}/${encodeURIComponent(l2DeleteTarget.symbol)}/${encodeURIComponent(
                        l2DeleteTarget.tf || ""
                      )}`;
                    }

                    const res = await fetch(url, {
                      method: "DELETE",
                      headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                      },
                    });
                    const data = await res.json().catch(() => ({}));
                    if (!res.ok || data?.ok === false) throw new Error(data?.error || data?.message || "Errore DELETE");
                    setShowL2Confirm(false);
                    setL2DeleteTarget(null);
                    // refresh size
                    setL2Status("loading");
                    const resSize = await fetch(`${env.apiBaseUrl}/cachemanager/status/L2/size`, {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                      },
                    });
                    const sizeData = await resSize.json().catch(() => ({}));
                    if (resSize.ok && sizeData?.data) setL2Size(sizeData.data);
                    setL2Status("idle");
                  } catch (err: any) {
                    setL2Status("error");
                    setL2Error(err?.message || "Errore nello svuotare la cache");
                    setShowL2Confirm(false);
                    setL2DeleteTarget(null);
                  }
                }}
              >
                OK
              </BaseButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
