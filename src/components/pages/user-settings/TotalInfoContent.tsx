export function TotalInfoContent() {
  const copyFormula = () => {
    const text = `total_score =
  0.35·momentum_score +
  0.25·quality_score +
  0.20·valuation_score +
  0.20·risk_score`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  return (
    <div className="space-y-4 text-slate-900">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-700">
          Valutazione sintetica e bilanciata del titolo: combina trend di prezzo, qualità fondamentale, valutazione e
          profilo di rischio in un unico indicatore comparabile.
        </p>
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-700">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Range 0–100</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Aggiornamento: daily</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Ranking: cross-section</span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Row 1: Obiettivo full width */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Obiettivo</h3>
          <p className="text-sm text-slate-800">
            Bilancia trend-following e fondamentali includendo valutazione e controllo rischio per un ranking comparabile
            nello stesso giorno.
          </p>
        </div>

        {/* Row 2: Componenti + Pesi affiancati */}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Componenti di input</h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-800">
              <li>
                <span className="font-semibold">momentum_score</span> – Forza del trend di prezzo (medio-lungo).
              </li>
              <li>
                <span className="font-semibold">quality_score</span> – Qualità strutturale (redditività, efficienza,
                solidità).
              </li>
              <li>
                <span className="font-semibold">valuation_score</span> – Prezzo caro/conveniente vs fondamentali.
              </li>
              <li>
                <span className="font-semibold">risk_score</span> – Penalizza volatilità eccessiva, leva, rischio
                insolvenza.
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Base model (pesi)</h3>
            <div className="mt-2 grid grid-cols-1 gap-2 text-sm">
              {[
                { k: "w_momentum", v: "0.35" },
                { k: "w_quality", v: "0.25" },
                { k: "w_valuation", v: "0.20" },
                { k: "w_risk", v: "0.20" },
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
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-800 hover:bg-slate-100"
            >
              Copy
            </button>
          </div>
          <pre className="overflow-auto rounded-lg border border-slate-200 bg-white p-3 text-[12px] text-slate-900">
{`total_score =
  0.35·momentum_score +
  0.25·quality_score +
  0.20·valuation_score +
  0.20·risk_score`}
          </pre>
          <p className="mt-2 text-xs text-slate-600">
            Pesi trend-following bilanciati: priorità al mercato, conferma fondamentali, controllo prezzo e rischio.
          </p>
        </div>

        {/* Row 4: Neutralità & comparabilità full width */}
        <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-3 text-sm text-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Neutralità & comparabilità</h3>
          <p className="mt-1 text-sm text-slate-800">
            <b>Neutralità:</b> uguale per tutti gli utenti (prima dell’overlay user). <b>Comparabilità:</b> ranking
            cross-section nello stesso giorno (0–100).
          </p>
        </div>

        {/* Row 5: Ruolo full width */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ruolo</h3>
          <p className="mt-1 text-sm text-slate-800">
            <code className="font-mono text-xs">scores_daily.total_score</code> → ranking oggettivo di base.&nbsp;
            <code className="font-mono text-xs">user_scores_daily.total_score</code> → ranking personalizzato (pesi
            user/pipe). Ponte tra analisi quantitativa, selezione titoli e decisione operativa.
          </p>
        </div>

        {/* Row 6: Caratteristiche full width */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Caratteristiche</h3>
          <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-700">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Range 0–100</span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Aggiornamento daily</span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Ranking cross-section</span>
          </div>
        </div>
      </div>

      <div className="text-[12px] text-slate-600">
        Suggerimento: Total Score è “baseline ranking”; l’overlay utente decide preferenze (risk appetite, bias
        settoriali, ecc.).
      </div>
    </div>
  );
}
