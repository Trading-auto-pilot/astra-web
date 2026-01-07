export function ValuationInfoContent() {
  const copyFormula = () => {
    const text = `valuation_score =
  0.40·pe_score +
  0.30·pb_score +
  0.30·dcf_score`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  return (
    <div className="space-y-4 text-slate-900">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-700">
          Valuta l’attrattività del prezzo rispetto ai fondamentali, penalizzando titoli troppo cari e premiando quelli
          con margine di sicurezza. Non indica il timing di ingresso, ma la ragionevolezza della valutazione attuale.
        </p>
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-700">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Range 0–100</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Uso: anti-overvaluation</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Update: weekly/on change</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Componenti di input</h3>
            <ul className="space-y-2 text-sm text-slate-800">
              <li>
                <span className="font-semibold">pe_score</span> – Punteggio normalizzato (0–100) del P/E. P/E più basso →
                score più alto (a parità di settore).
              </li>
              <li>
                <span className="font-semibold">pb_score</span> – Punteggio normalizzato (0–100) del P/B. Quanto paga il
                mercato il patrimonio netto.
              </li>
              <li>
                <span className="font-semibold">dcf_score</span> – Punteggio normalizzato (0–100) del DCF Upside.
              </li>
            </ul>

            <div className="h-px bg-slate-200" />

            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Normalizzazione</h3>
            <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-3 text-sm text-slate-800">
              Ogni metrica è trasformata in uno score <b>0–100</b> (più conveniente → score più alto). Può essere
              <b> cross-sectional</b> o <b>sector-relative</b> (consigliato).
            </div>

            <div className="h-px bg-slate-200" />

            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nota operativa</h3>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
              Non blocca titoli con momentum molto forte, ma riduce ingressi su eccessi estremi e migliora il profilo
              rischio/rendimento nel medio periodo.
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pesi di default</h3>
            <div className="mt-2 grid grid-cols-1 gap-2 text-sm">
              {[
                { k: "w_pe", v: "0.40" },
                { k: "w_pb", v: "0.30" },
                { k: "w_dcf", v: "0.30" },
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
          <pre className="overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-[12px] text-slate-900">
{`valuation_score =
  0.40·pe_score +
  0.30·pb_score +
  0.30·dcf_score`}
          </pre>
          <p className="mt-2 text-xs text-slate-600">
            Pesi: multiplo utili, valore patrimoniale, contributo fair value teorico.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Interpretazione</h3>
          <div className="mt-2 space-y-2 text-[13px] text-slate-800">
            <div className="flex items-start gap-2">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span>
                <b>&gt; 70</b> → sottovalutato / buon margine di sicurezza
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span>
                <b>40–70</b> → valutazione in linea con i fondamentali
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-rose-500" />
              <span>
                <b>&lt; 40</b> → titolo caro / upside limitato
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Caratteristiche</h3>
          <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-700">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Range 0–100</span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
              Aggiornamento: settimanale o su variazione multipli/DCF
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Uso: filtro anti-overvaluation</span>
          </div>
        </div>
      </div>

      <div className="text-[12px] text-slate-600">
        Suggerimento: combina Valuation + Quality per evitare “cheap traps” e ridurre rischio strutturale.
      </div>
    </div>
  );
}
