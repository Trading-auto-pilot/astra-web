import ReactApexChart from "react-apexcharts";
import TickerStatementTab, { type GlossaryDoc, type StatementMetric } from "./TickerStatementTab";

export type AnalysisStatus = "idle" | "loading" | "error" | "no-key";

type FinancialCardProps = {
  altmanValue: number | null;
  piotroskiValue: number | null;
  scoreCurrency?: string;
  scoreTableRows: { label: string; value: string }[];
  glossary?: GlossaryDoc | null;
};

function FinancialScoreCard({ altmanValue, piotroskiValue, scoreCurrency, scoreTableRows, glossary }: FinancialCardProps) {
  const altmanGlossary =
    (glossary && (glossary as any).altmanZScore) ||
    (glossary && (glossary as any).altmanScore) ||
    null;
  const piotroskiGlossary =
    (glossary && (glossary as any).piotroskiScore) ||
    (glossary && (glossary as any).piotroskiFScore) ||
    null;

  return (
    <div className="space-y-4">
      {(altmanGlossary || piotroskiGlossary) && (
        <div className="rounded-lg border border-slate-200 bg-white/80 p-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Glossary</div>
          {altmanGlossary?.description && (
            <div className="mt-2 text-sm text-slate-700">
              <span className="font-semibold">Altman Z-Score:</span> {altmanGlossary.description}
            </div>
          )}
          {piotroskiGlossary?.description && (
            <div className="mt-2 text-sm text-slate-700">
              <span className="font-semibold">Piotroski F-Score:</span> {piotroskiGlossary.description}
            </div>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white/70 p-3">
          <div className="text-sm font-semibold text-slate-800">Altman Z-Score</div>
          <div className="mt-2 flex justify-center">
            <ReactApexChart
              type="radialBar"
              height={220}
              series={[
                Math.max(0, Math.min(100, altmanValue !== null ? (Math.min(altmanValue, 6) / 6) * 100 : 0)),
              ]}
              options={{
                chart: { toolbar: { show: false } },
                plotOptions: {
                  radialBar: {
                    hollow: { size: "60%" },
                    dataLabels: {
                      name: { show: false },
                      value: { formatter: () => (altmanValue !== null ? altmanValue.toFixed(2) : "-") },
                    },
                  },
                },
                colors: [
                  altmanValue === null ? "#94a3b8" : altmanValue < 1.8 ? "#ef4444" : altmanValue < 3 ? "#f59e0b" : "#22c55e",
                ],
              }}
            />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white/70 p-3">
          <div className="text-sm font-semibold text-slate-800">Piotroski F-Score</div>
          <div className="mt-2 flex justify-center">
            <ReactApexChart
              type="radialBar"
              height={220}
              series={[
                Math.max(0, Math.min(100, piotroskiValue !== null ? (Math.min(piotroskiValue, 9) / 9) * 100 : 0)),
              ]}
              options={{
                chart: { toolbar: { show: false } },
                plotOptions: {
                  radialBar: {
                    hollow: { size: "60%" },
                    dataLabels: {
                      name: { show: false },
                      value: { formatter: () => (piotroskiValue !== null ? piotroskiValue.toFixed(1) : "-") },
                    },
                  },
                },
                colors: [
                  piotroskiValue === null ? "#94a3b8" : piotroskiValue <= 4 ? "#ef4444" : piotroskiValue <= 7 ? "#f59e0b" : "#22c55e",
                ],
              }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white/80 p-3">
        <div className="text-sm font-semibold text-slate-800">Financial scores ({scoreCurrency ?? "-"})</div>
        <div className="mt-2">
          {scoreTableRows.length ? (
            <table className="min-w-[280px] text-sm text-slate-700">
              <tbody>
                {scoreTableRows.map((row) => (
                  <tr key={row.label}>
                    <td className="pr-3 py-1 font-semibold text-slate-600">{row.label}</td>
                    <td className="py-1">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-sm text-slate-600">Nessun dato disponibile.</div>
          )}
        </div>
      </div>
    </div>
  );
}

type TickerAnalysisTabProps = {
  scoreStatus: AnalysisStatus;
  scoreTab: "financial" | "ownerEarnings" | "enterpriseValues";
  onChangeScoreTab: (tab: "financial" | "ownerEarnings" | "enterpriseValues") => void;
  altmanValue: number | null;
  piotroskiValue: number | null;
  scoreCurrency?: string;
  scoreTableRows: { label: string; value: string }[];
  ownerMetrics: StatementMetric[];
  ownerStatus: AnalysisStatus;
  enterpriseMetrics: StatementMetric[];
  enterpriseStatus: AnalysisStatus;
  financialGlossary?: GlossaryDoc | null;
  ownerGlossary?: GlossaryDoc | null;
  enterpriseGlossary?: GlossaryDoc | null;
};

export function TickerAnalysisTab({
  scoreStatus,
  scoreTab,
  onChangeScoreTab,
  altmanValue,
  piotroskiValue,
  scoreCurrency,
  scoreTableRows,
  ownerMetrics,
  ownerStatus,
  enterpriseMetrics,
  enterpriseStatus,
  financialGlossary,
  ownerGlossary,
  enterpriseGlossary,}: TickerAnalysisTabProps) {
  if (scoreStatus === "no-key") {
    return (
      <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
        Imposta la variabile VITE_FMP_API_KEY per mostrare i punteggi finanziari.
      </div>
    );
  }
  if (scoreStatus === "error") {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        Impossibile recuperare i punteggi finanziari.
      </div>
    );
  }
  if (scoreStatus === "loading") {
    return <div className="text-sm text-slate-600">Caricamento punteggi...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      <div className="h-full rounded-lg border border-slate-200 bg-white/70 p-3 text-sm text-slate-700">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Score</div>
        <ul className="mt-2 space-y-1">
          {[
            { id: "financial" as const, label: "Financial Score" },
            { id: "ownerEarnings" as const, label: "Owner Earnings" },
            { id: "enterpriseValues" as const, label: "Enterprise Values" },
          ].map((item) => {
            const active = scoreTab === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onChangeScoreTab(item.id)}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm font-semibold ${
                    active ? "bg-slate-900 text-white" : "bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="lg:col-span-3 space-y-4">
        {scoreTab === "financial" && (
          <FinancialScoreCard
            altmanValue={altmanValue}
            piotroskiValue={piotroskiValue}
            scoreCurrency={scoreCurrency}
            scoreTableRows={scoreTableRows}
            glossary={financialGlossary}
          />
        )}

        {scoreTab === "ownerEarnings" && (
          <TickerStatementTab metrics={ownerMetrics} status={ownerStatus} glossary={ownerGlossary} />
        )}

        {scoreTab === "enterpriseValues" && (
          <TickerStatementTab metrics={enterpriseMetrics} status={enterpriseStatus} glossary={enterpriseGlossary} />
        )}
      </div>
    </div>
  );
}

export default TickerAnalysisTab;
