export function QualityInfoContent() {
  const copyFormula = () => {
    const text = `quality_score =
  0.35·roe_score +
  0.25·roa_score +
  0.25·op_margin_score +
  0.15·piot_score`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  return (
    <div className="space-y-4 text-slate-900">
      {/* Row 1: Obiettivo full width */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-700">
          Misura la qualità strutturale dell’azienda (redditività, efficienza operativa, solidità finanziaria). Non
          riflette i movimenti di prezzo: descrive la forza economica del business.
        </p>
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-700">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Range 0–100</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Stabilità: alta</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Uso: filtro</span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Row 2: Componenti + Pesi/Formula affiancati */}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Componenti</h3>
            <ul className="space-y-2 text-sm text-slate-800">
              <li>
                <span className="font-semibold">roe_score</span> – ROE normalizzato (0–100). Redditività del capitale
                degli azionisti.
              </li>
              <li>
                <span className="font-semibold">roa_score</span> – ROA normalizzato (0–100). Efficienza nell’uso degli
                asset.
              </li>
              <li>
                <span className="font-semibold">op_margin_score</span> – Margine operativo normalizzato (0–100).
              </li>
              <li>
                <span className="font-semibold">piot_score</span> – Piotroski F-Score normalizzato (0–100). Solidità
                complessiva.
              </li>
            </ul>
          </div>

          <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pesi</h3>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              {[
                { k: "w_roe", v: "0.35" },
                { k: "w_roa", v: "0.25" },
                { k: "w_opm", v: "0.25" },
                { k: "w_piot", v: "0.15" },
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
{`quality_score =
  0.35·roe_score +
  0.25·roa_score +
  0.25·op_margin_score +
  0.15·piot_score`}
          </pre>
          <p className="mt-2 text-xs text-slate-600">
            I pesi riflettono redditività (ROE/ROA), efficienza operativa e robustezza finanziaria.
          </p>
        </div>

        {/* Row 4: Origine dati full width */}
        <div className="rounded-lg border border-violet-200 bg-violet-50/60 p-3 text-sm text-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Origine dei dati</h3>
          <p className="mt-1 text-sm text-slate-800">
            Quality Score derivato dai fundamentals storicizzati ed è valido <b>“as-of date”</b>: non viene ricalcolato
            ogni giorno, viene copiato dal record di{" "}
            <code className="font-mono text-xs">fundamentals_history</code> valido alla data di scoring.
          </p>
        </div>

        {/* Row 5: Interpretazione full width */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Interpretazione</h3>
          <div className="mt-2 space-y-2 text-[13px] text-slate-800">
            <div className="flex items-start gap-2">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span>
                <b>&gt; 70</b> → alta qualità strutturale
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span>
                <b>40–70</b> → qualità nella media
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-rose-500" />
              <span>
                <b>&lt; 40</b> → qualità debole o instabile
              </span>
            </div>
          </div>
        </div>

        {/* Row 6: Caratteristiche full width */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Caratteristiche</h3>
          <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-700">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Range 0–100</span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
              Stabilità: solo su nuovi bilanci/revisioni
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
              Uso: filtro qualità & riduzione rischio strutturale
            </span>
          </div>
        </div>
      </div>

      <div className="text-[12px] text-slate-600">
        Suggerimento: usa il Quality Score come filtro “anti-fragilità” prima di score opportunistici (momentum/volume).
      </div>
    </div>
  );
}
