export function GrowthInfoContent() {
  return (
    <div className="space-y-4 text-slate-900">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-700">
          Score opportunistico (più aggressivo del Total) che stima la probabilità di una crescita di prezzo sostenuta
          nel breve/medio termine combinando momentum, volumi, rischio e contesto di mercato.
        </p>
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-700">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Range 0–100</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Update: daily</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Classe: Opportunistic</span>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Componenti di input</h3>
          <ul className="mt-2 space-y-2 text-sm text-slate-800">
            <li>
              <span className="font-semibold">momentumScore</span>: forza del trend (es. scores_daily.momentum_score o
              combinazione con short).
            </li>
            <li>
              <span className="font-semibold">volumeScore</span>: qualità del movimento basata sui volumi (RVOL, spike,
              efficienza); può provenire da metriche daily o intraday.
            </li>
            <li>
              <span className="font-semibold">riskScore</span>: penalizza setup fragili (volatilità / leverage / solvency).
            </li>
            <li>
              <span className="font-semibold">marketScore</span>: misura se il mercato aiuta (Market Risk Score alto).
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pesi di default</h3>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800">
              <span className="font-mono text-slate-700">wt_growth_momentum</span>
              <span className="font-semibold text-slate-900">45</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800">
              <span className="font-mono text-slate-700">wt_growth_volume</span>
              <span className="font-semibold text-slate-900">25</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800">
              <span className="font-mono text-slate-700">wt_growth_risk</span>
              <span className="font-semibold text-slate-900">15</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800">
              <span className="font-mono text-slate-700">wt_growth_market</span>
              <span className="font-semibold text-slate-900">15</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Formula</h3>
        <pre className="mt-2 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-[12px] text-slate-900">
growth_probability =
  normalize(
    wt_gm   · momentumScore +
    wt_gv   · volumeScore   +
    wt_gr   · riskScore     +
    wt_gmkt · marketScore
  )

normalize(x) = x / (wt_gm + wt_gv + wt_gr + wt_gmkt) scaled to 0..100
        </pre>
        <p className="mt-2 text-sm text-slate-700">
          normalize(...) divide per la somma dei pesi (o scala) per riportare lo score in 0–100.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Interpretazione</h3>
          <ul className="mt-2 space-y-2 text-sm text-slate-800">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span>
                <b>&gt; 75</b> → candidato “growth breakout” (se il contesto è ok)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span>
                <b>55–75</b> → potenziale crescita, serve conferma (volume / market)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-rose-400" />
              <span>
                <b>&lt; 55</b> → bassa probabilità di trend sostenuto
              </span>
            </li>
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Caratteristiche</h3>
          <ul className="mt-2 space-y-2 text-sm text-slate-800">
            <li>Range: 0–100</li>
            <li>Aggiornamento: daily (meglio se volumeScore include intraday)</li>
            <li>Uso: filtro opportunistico per shortlist più aggressive</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
