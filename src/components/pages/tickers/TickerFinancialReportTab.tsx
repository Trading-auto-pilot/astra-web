export type FinancialReportStatus = "idle" | "loading" | "error" | "no-key";

type Props = {
  status: FinancialReportStatus;
  html: string | null;
};

export function TickerFinancialReportTab({ status, html }: Props) {
  if (status === "no-key") {
    return (
      <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
        Imposta la variabile VITE_FMP_API_KEY per mostrare il financial report.
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        Impossibile recuperare il financial report.
      </div>
    );
  }
  if (status === "loading") {
    return <div className="text-sm text-slate-600">Caricamento financial report...</div>;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-4">
      {html ? (
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <div className="text-sm text-slate-600">Nessun financial report disponibile.</div>
      )}
    </div>
  );
}

export default TickerFinancialReportTab;
