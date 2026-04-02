type Status = "idle" | "loading" | "error";

type Props = {
  provider: string | null;
  providerStatus: Status;
  providerError: string | null;
  onProviderChange: (provider: string) => Promise<void>;
};

/**
 * Card per la gestione del Data Provider del CacheManager
 *
 * Permette di selezionare tra AUTO, ALPACA, POLYGON, FMP e IBKR come provider di dati storici
 */
export default function MicroserviceDataProviderCard({
  provider,
  providerStatus,
  providerError,
  onProviderChange,
}: Props) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-[11px] text-slate-700">
      <div className="text-xs font-semibold text-slate-700 mb-3">Data Provider</div>
      <table className="min-w-[200px] text-[11px] text-slate-700">
        <tbody>
          <tr>
            <td className="pr-3 font-semibold text-slate-600">Provider</td>
            <td className="py-1">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Radio buttons per la selezione del provider */}
                  {["AUTO", "ALPACA", "POLYGON", "FMP", "IBKR"].map((opt) => (
                    <label key={opt} className="inline-flex items-center gap-2 text-xs text-slate-700">
                      <input
                        type="radio"
                        name="data-provider"
                        value={opt}
                        checked={provider === opt}
                        disabled={providerStatus === "loading"}
                        onChange={async () => {
                          await onProviderChange(opt);
                        }}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                  {providerStatus === "loading" && (
                    <span className="text-[11px] text-slate-500">Aggiornamento...</span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500">
                  <span className="font-medium">AUTO</span> = routing Alpaca → Polygon → IBKR → FMP (default).
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      {providerError && <div className="mt-2 text-[11px] text-amber-700">{providerError}</div>}
    </div>
  );
}
