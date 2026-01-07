export function MarketRiskInfoContent() {
  const copyFormula = () => {
    const text = `base_market =
  normalize( wt_ms_trend · trendScore + wt_ms_regime · regimeScore )

market_risk_score =
  clamp( base_market − corrPenalty, 0, 100 )`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  return (
    <div className="space-y-4 text-slate-900">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-700">
          Misura se il contesto di mercato è favorevole o ostile all’assunzione di rischio (risk-on / risk-off) e regola
          l’esposizione quando il mercato è in regime negativo. Agisce come filtro/regolatore sopra i singoli titoli.
        </p>
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-700">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Range 0–100</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Aggiornamento daily/intraday</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Ruolo: exposure regulator</span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Row 1: Obiettivo full width */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Obiettivo</h3>
          <p className="text-sm text-slate-800">
            Identificare il regime risk-on / risk-off e penalizzare l’esposizione quando il mercato è ostile. È uno
            score di contesto che riduce il rischio sistemico.
          </p>
        </div>

        {/* Row 2: componenti + pesi affiancati */}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Componenti di input (concetto)
            </h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-800">
              <li>
                <span className="font-semibold">trendScore</span> – Direzione/forza del trend di un indice di riferimento
                (es. SPY/QQQ o indice settoriale).
              </li>
              <li>
                <span className="font-semibold">regimeScore</span> – Regime risk-on/off (proxy equity vs bond, credito,
                small vs large caps, ecc.).
              </li>
              <li>
                <span className="font-semibold">corrPenalty</span> – Penalità se il mercato è debole e il titolo è molto
                correlato (rischio sistemico).
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pesi di default</h3>
            <div className="mt-2 grid grid-cols-1 gap-2 text-sm">
              {[
                { k: "wt_ms_trend", v: "55" },
                { k: "wt_ms_regime", v: "35" },
                { k: "wt_ms_corr_penalty_max", v: "20" },
              ].map((w) => (
                <div
                  key={w.k}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                >
                  <span className="font-mono text-slate-800">{w.k}</span>
                  <span className="font-semibold text-slate-900">{w.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Formula full width */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Formula</span>
            <button
              type="button"
              onClick={copyFormula}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-800 hover:bg-slate-100"
            >
              Copy
            </button>
          </div>
          <pre className="overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-[12px] text-slate-900">
{`base_market =
  normalize( wt_ms_trend · trendScore + wt_ms_regime · regimeScore )

market_risk_score =
  clamp( base_market − corrPenalty, 0, 100 )`}
          </pre>
          <p className="mt-2 text-xs text-slate-600">
            Pesi: trend del mercato, regime risk-on/off, penalità correlazione quando il mercato è debole e il titolo è
            molto correlato.
          </p>
        </div>

        {/* Row 4: Ruolo operativo full width */}
        <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-3 text-sm text-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ruolo operativo</h3>
          <p className="mt-1 text-sm text-slate-800">
            Filtro/regolatore per esposizione sistemica: in risk-off alza soglie, riduce size, aumenta severità di SL/TP
            o limita nuove aperture.
          </p>
        </div>

        {/* Row 5: Caratteristiche full width */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Caratteristiche</h3>
          <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-700">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Range 0–100</span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Aggiornamento daily/intraday</span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
              Ruolo: filtro/regolatore esposizione
            </span>
          </div>
        </div>
      </div>

      <div className="text-[12px] text-slate-600">
        Suggerimento: quando Market Risk Score scende sotto 40, applica un “risk budget multiplier” &lt; 1 a tutte le
        nuove allocazioni.
      </div>
    </div>
  );
}
