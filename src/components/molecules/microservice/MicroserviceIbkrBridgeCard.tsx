type Status = "idle" | "loading" | "error";

type Props = {
  ibkrStatus: Record<string, any> | null;
  ibkrStatusState: Status;
  ibkrStatusError: string | null;
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

/**
 * Card per la visualizzazione dello stato dell'IBKR Bridge
 *
 * Mostra:
 * - Stato connessione WebSocket
 * - Stato autenticazione
 * - Stato Bridge (HMDS)
 * - Last tickle timestamp
 */
export default function MicroserviceIbkrBridgeCard({
  ibkrStatus,
  ibkrStatusState,
  ibkrStatusError,
}: Props) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-[11px] text-slate-700">
      <div className="text-xs font-semibold text-slate-700 mb-3">IBKR Bridge</div>

      {ibkrStatusState === "loading" && (
        <div className="text-[11px] text-slate-500">Caricamento status...</div>
      )}

      {ibkrStatusError && (
        <div className="text-[11px] text-rose-600">{ibkrStatusError}</div>
      )}

      {!ibkrStatusError && ibkrStatusState !== "loading" && (
        <div className="space-y-1 text-[11px] text-slate-700">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                ibkrStatus?.wsConnected ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />
            <span className="font-semibold">
              WS {ibkrStatus?.wsConnected ? "connesso" : "disconnesso"}
            </span>
          </div>
          <div>
            Auth:{" "}
            <span className="font-semibold">
              {ibkrStatus?.lastAuthStatus?.authenticated ? "OK" : "NO"}
            </span>
          </div>
          <div>
            Bridge:{" "}
            <span
              className={`font-semibold ${
                ibkrStatus?.lastHmdsInitOk === false ? "text-rose-600" : "text-slate-700"
              }`}
            >
              {ibkrStatus?.lastHmdsInitOk === false
                ? "DOWN"
                : ibkrStatus?.lastHmdsError
                  ? ibkrStatus.lastHmdsError
                  : "OK"}
            </span>
          </div>
          {ibkrStatus?.lastHmdsInitOk === false && (
            <div className="text-[10px] text-rose-600">HMDS init non riuscito</div>
          )}
          <div className="text-[10px] text-slate-500">
            Last tickle: {formatDateTime(ibkrStatus?.lastTickleAt)}
          </div>
        </div>
      )}
    </div>
  );
}
