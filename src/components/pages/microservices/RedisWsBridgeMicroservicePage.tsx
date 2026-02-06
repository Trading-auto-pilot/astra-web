import { useState, useCallback, useEffect, useRef } from "react";
import MicroserviceGeneralTab from "../../molecules/microservice/MicroserviceGeneralTab";
import { redisWsBridgeClient } from "../../../services/ws/redisWsBridgeClient";

type Status = "idle" | "loading" | "error";

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

/**
 * Componente per la gestione della pagina del microservizio Redis WS Bridge
 *
 * Questo componente gestisce 2 tabs:
 * - Tab "General Settings": impostazioni comuni (DB Logger, Log Level, Communication Channels, Logs)
 * - Tab "Websocket": visualizzazione messaggi WebSocket in tempo reale con filtri per canali
 */
export default function RedisWsBridgeMicroservicePage({
  onReleaseChange,
  onHealthChange,
  onOpenReleaseModal,
}: Props) {
  // Gestione tab attivo
  const [activeTab, setActiveTab] = useState<"general" | "websocket">("general");

  // State per WebSocket Bridge
  const [wsBridgeClients, setWsBridgeClients] = useState<any>(null);
  const [wsBridgeMetrics, setWsBridgeMetrics] = useState<any>(null);
  const [wsBridgeBus, setWsBridgeBus] = useState<any>(null);
  const [wsBridgeStatus, setWsBridgeStatus] = useState<Status>("idle");
  const [wsBridgeError, setWsBridgeError] = useState<string | null>(null);
  const [wsBridgeChannels, setWsBridgeChannels] = useState<Record<string, boolean>>({
    telemetry: true,
    metrics: true,
    data: true,
    logs: true,
  });
  const [wsBridgeMessages, setWsBridgeMessages] = useState<any[]>([]);
  const [wsBridgeSocketStatus, setWsBridgeSocketStatus] = useState<Status>("idle");
  const [wsBridgeSocketError, setWsBridgeSocketError] = useState<string | null>(null);
  const wsBridgeUnsubRef = useRef<null | (() => void)>(null);

  // Cleanup quando si cambia tab o si smonta il componente
  useEffect(() => {
    if (activeTab !== "websocket" && wsBridgeUnsubRef.current) {
      wsBridgeUnsubRef.current();
      wsBridgeUnsubRef.current = null;
    }
    return () => {
      if (wsBridgeUnsubRef.current) {
        wsBridgeUnsubRef.current();
        wsBridgeUnsubRef.current = null;
      }
    };
  }, [activeTab]);

  // Handler per aprire la connessione WebSocket
  const handleOpenWsBridge = useCallback(() => {
    setWsBridgeSocketStatus("loading");
    setWsBridgeSocketError(null);
    setWsBridgeMessages([]);
    if (wsBridgeUnsubRef.current) {
      wsBridgeUnsubRef.current();
      wsBridgeUnsubRef.current = null;
    }

    wsBridgeUnsubRef.current = redisWsBridgeClient.subscribe({
      filter: (payload) => {
        const selected = Object.entries(wsBridgeChannels)
          .filter(([, on]) => on)
          .map(([key]) => key);
        if (!selected.length) return false;
        const rawChannel =
          typeof payload?.__channel === "string"
            ? payload.__channel
            : typeof payload?.channel === "string"
              ? payload.channel
              : null;
        const channelKey = rawChannel
          ? String(rawChannel).split(".").slice(-1)[0]
          : payload?.type === "marketData"
            ? "data"
            : payload?.type === "log"
              ? "logs"
              : payload?.type;
        return channelKey ? selected.includes(String(channelKey)) : false;
      },
      onMessage: (payload) => {
        setWsBridgeMessages((prev) => {
          const next = [...prev, { ts: new Date().toISOString(), payload }];
          return next.slice(-200);
        });
      },
      onStatus: (status, detail) => {
        if (status === "open") {
          setWsBridgeSocketStatus("idle");
          return;
        }
        if (status === "connecting") {
          setWsBridgeSocketStatus("loading");
          return;
        }
        if (status === "error" || status === "closed") {
          setWsBridgeSocketStatus("error");
          setWsBridgeSocketError(detail || "Errore connessione websocket");
        }
      },
    });
  }, [wsBridgeChannels]);

  // Handler per chiudere la connessione WebSocket
  const handleCloseWsBridge = useCallback(() => {
    if (wsBridgeUnsubRef.current) {
      wsBridgeUnsubRef.current();
      wsBridgeUnsubRef.current = null;
    }
    setWsBridgeSocketStatus("idle");
  }, []);

  return (
    <div>
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

        {/* Tab Websocket */}
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "websocket" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
          }`}
          onClick={() => setActiveTab("websocket")}
        >
          Websocket
        </button>
      </div>

      {/* CONTENUTO DEI TAB */}

      {/* Tab General: Usa il componente condiviso */}
      {activeTab === "general" && (
        <MicroserviceGeneralTab
          microservice="redisWsBridge"
          onReleaseChange={onReleaseChange}
          onHealthChange={onHealthChange}
          onOpenReleaseModal={onOpenReleaseModal}
        />
      )}

      {/* Tab Websocket: Visualizzazione messaggi WebSocket in tempo reale */}
      {activeTab === "websocket" && (
        <div className="grid gap-3 md:grid-cols-3">
          {/* Card WebSocket Status */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:col-span-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">Websocket status</div>
                <div className="text-[11px] text-slate-500">
                  Stato del bridge redis-ws-bridge (clients, metrics, bus).
                </div>
              </div>
              <div className="text-[11px] font-semibold text-slate-500">
                {wsBridgeStatus === "loading" ? "Caricamento..." : "OK"}
              </div>
            </div>

            {/* Selezione canali */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-slate-700">
              {(["telemetry", "metrics", "data", "logs"] as const).map((key) => (
                <label key={key} className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-3 w-3 rounded border-slate-300"
                    checked={!!wsBridgeChannels[key]}
                    onChange={(event) =>
                      setWsBridgeChannels((prev) => ({ ...prev, [key]: event.target.checked }))
                    }
                  />
                  <span className="font-semibold">{key}</span>
                </label>
              ))}

              {/* Pulsante per aprire socket */}
              <button
                type="button"
                className="ml-auto inline-flex items-center justify-center rounded-md bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                onClick={handleOpenWsBridge}
                disabled={wsBridgeSocketStatus === "loading"}
              >
                {wsBridgeSocketStatus === "loading" ? "Apro..." : "Open Socket"}
              </button>

              {/* Pulsante per chiudere socket */}
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                onClick={handleCloseWsBridge}
              >
                Close Socket
              </button>
            </div>

            {/* Errori */}
            {wsBridgeError && (
              <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">
                {wsBridgeError}
              </div>
            )}
            {wsBridgeSocketError && (
              <div className="mt-2 text-[11px] text-rose-600">{wsBridgeSocketError}</div>
            )}
          </div>

          {/* Card Messaggi Socket */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:col-span-3">
            <div className="text-[11px] font-semibold text-slate-700">Messaggi socket</div>
            <div className="mt-2 max-h-64 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 p-2 text-[10px] text-slate-600">
              {wsBridgeMessages.length === 0
                ? "Nessun messaggio ricevuto."
                : wsBridgeMessages.map((item, idx) => (
                    <div key={`${item.ts}-${idx}`} className="border-b border-slate-200 py-1 last:border-b-0">
                      <div className="text-[9px] text-slate-400">{item.ts}</div>
                      <pre className="whitespace-pre-wrap break-words">
                        {JSON.stringify(item.payload, null, 2)}
                      </pre>
                    </div>
                  ))}
            </div>
          </div>

          {/* Card Clients */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-[11px] font-semibold text-slate-700">Clients</div>
            <pre className="mt-2 max-h-56 overflow-y-auto text-[10px] text-slate-600">
              {JSON.stringify(wsBridgeClients ?? {}, null, 2)}
            </pre>
          </div>

          {/* Card Metrics */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-[11px] font-semibold text-slate-700">Metrics</div>
            <pre className="mt-2 max-h-56 overflow-y-auto text-[10px] text-slate-600">
              {JSON.stringify(wsBridgeMetrics ?? {}, null, 2)}
            </pre>
          </div>

          {/* Card Bus */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-[11px] font-semibold text-slate-700">Bus</div>
            <pre className="mt-2 max-h-56 overflow-y-auto text-[10px] text-slate-600">
              {JSON.stringify(wsBridgeBus ?? {}, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
