export function MomentumShortInfoContent() {
  const copyFormula = () => {
    const text = `r5   = (P_t / P_{t-5})  - 1
r10  = (P_t / P_{t-10}) - 1

raw_short = 0.6·r5 + 0.4·r10

momentum_score_short = percentile_rank(raw_short) × 100`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  return (
    <div className="space-y-4 text-slate-900">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-700">
          Score giornaliero di momentum di brevissimo periodo basato su ritorni a 5 e 10 giorni, combinati in un raw
          short e trasformati in percentile rank per ottenere uno score 0–100.
        </p>
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-700">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Range 0–100</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Update: daily</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Horizon: 5–10d</span>
        </div>
      </div>

      {/* Row 2: Definizioni/Ritorni + Pesi affiancati */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Definizioni input</h3>
          <ul className="space-y-2 text-sm text-slate-800">
            <li>
              <span className="font-semibold">Pₜ</span> – Close al giorno t.
            </li>
            <li>
              <span className="font-semibold">Pₜ₋₅</span> – Close 5 giorni di trading prima (≈ 1 settimana).
            </li>
            <li>
              <span className="font-semibold">Pₜ₋₁₀</span> – Close 10 giorni di trading prima (≈ 2 settimane).
            </li>
          </ul>

          <div className="h-px bg-slate-200" />

          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ritorni</h3>
          <ul className="space-y-2 text-sm text-slate-800">
            <li>
              <div className="font-semibold">r5</div>
              <div className="font-mono text-xs rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-slate-900">
                r5 = (Pₜ / Pₜ₋₅) − 1
              </div>
              <div className="text-slate-600">Accelerazione molto recente.</div>
            </li>
            <li>
              <div className="font-semibold">r10</div>
              <div className="font-mono text-xs rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-slate-900">
                r10 = (Pₜ / Pₜ₋₁₀) − 1
              </div>
              <div className="text-slate-600">Trend breve più stabile.</div>
            </li>
          </ul>

          <div className="h-px bg-slate-200" />

          <p className="text-sm text-slate-700">
            Il raw short dà più peso all’accelerazione immediata (r5), mantenendo stabilità con r10. Poi applichiamo un
            percentile rank cross-sectional per ottenere uno score relativo (0–100).
          </p>
        </div>

        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Combinazione (raw)</h3>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            {[
              { k: "w5", v: "0.60" },
              { k: "w10", v: "0.40" },
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
{`r5   = (P_t / P_{t-5})  - 1
r10  = (P_t / P_{t-10}) - 1

raw_short = 0.6·r5 + 0.4·r10

momentum_score_short = percentile_rank(raw_short) × 100`}
        </pre>
        <p className="mt-2 text-[12px] text-slate-600">
          percentile_rank(raw_short) è la posizione percentuale rispetto all’universo dello stesso giorno (0 peggiori,
          1 migliori).
        </p>
      </div>

      {/* Row 4: Interpretazione full width */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Interpretazione rapida</h3>
        <div className="mt-2 space-y-2 text-[13px] text-slate-800">
          <div className="flex items-start gap-2">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>
              <b>&gt; 75</b> → accelerazione forte (possibile breakout)
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span>
              <b>50–75</b> → accelerazione moderata
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span>
              <b>&lt; 40</b> → assenza di momentum di breve
            </span>
          </div>
        </div>
      </div>

      {/* Row 5: Caratteristiche / nota full width */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Caratteristiche</h3>
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-700">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Range 0–100</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Aggiornamento daily</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Relativo cross-section</span>
        </div>
        <div className="mt-3 text-[12px] text-slate-600">
          Suggerimento: score alto = accelerazione recente; utile per breakout, ma più sensibile a reversal.
        </div>
      </div>
    </div>
  );
}
