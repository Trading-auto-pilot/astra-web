export function MomentumInfoContent() {
  const copyFormula = () => {
    const text = `r20   = (P_t / P_{t-20})  - 1
r60   = (P_t / P_{t-60})  - 1
r120  = (P_t / P_{t-120}) - 1

raw_mom = 0.5·r20 + 0.3·r60 + 0.2·r120
momentum_score = percentile_rank(raw_mom) × 100`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  return (
    <div className="space-y-4 text-slate-900">
      {/* Row 1: Obiettivo full width */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Obiettivo</h3>
        <p className="text-sm text-slate-800">
          Score giornaliero basato su ritorni a 20/60/120 giorni, combinati in un raw momentum e trasformati in
          percentile rank sull’universo del giorno per ottenere uno score 0–100.
        </p>
      </div>

      {/* Row 2: Definizioni + Pesi affiancati */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Definizioni input</h3>
          <ul className="space-y-2 text-sm text-slate-800">
            <li>
              <span className="font-semibold">Pₜ</span> – Close al giorno t.
            </li>
            <li>
              <span className="font-semibold">Pₜ₋₂₀</span> – Close 20 giorni di trading prima (≈ 1 mese).
            </li>
            <li>
              <span className="font-semibold">Pₜ₋₆₀</span> – Close 60 giorni di trading prima (≈ 3 mesi).
            </li>
            <li>
              <span className="font-semibold">Pₜ₋₁₂₀</span> – Close 120 giorni di trading prima (≈ 6 mesi).
            </li>
          </ul>

          <div className="h-px bg-slate-200" />

          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ritorni</h3>
          <ul className="space-y-2 text-sm text-slate-800">
            <li>
              <div className="font-semibold">r20</div>
              <div className="font-mono text-xs rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-slate-900">
                r20 = (Pₜ / Pₜ₋₂₀) − 1
              </div>
              <div className="text-slate-600">Momentum recente.</div>
            </li>
            <li>
              <div className="font-semibold">r60</div>
              <div className="font-mono text-xs rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-slate-900">
                r60 = (Pₜ / Pₜ₋₆₀) − 1
              </div>
              <div className="text-slate-600">Trend di medio periodo.</div>
            </li>
            <li>
              <div className="font-semibold">r120</div>
              <div className="font-mono text-xs rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-slate-900">
                r120 = (Pₜ / Pₜ₋₁₂₀) − 1
              </div>
              <div className="text-slate-600">Trend di fondo (medio-lungo).</div>
            </li>
          </ul>
        </div>

        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pesi raw</h3>
          <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
            {[
              { k: "w20", v: "0.50" },
              { k: "w60", v: "0.30" },
              { k: "w120", v: "0.20" },
            ].map((w) => (
              <div
                key={w.k}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <span className="font-mono text-slate-800">{w.k}</span>
                <span className="font-semibold text-slate-900">{w.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Formula full width */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
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
{`r20   = (P_t / P_{t-20})  - 1
r60   = (P_t / P_{t-60})  - 1
r120  = (P_t / P_{t-120}) - 1

raw_mom = 0.5·r20 + 0.3·r60 + 0.2·r120

momentum_score = percentile_rank(raw_mom) × 100`}
        </pre>
        <p className="mt-2 text-[12px] text-slate-600">
          percentile_rank(raw_mom) è la posizione percentuale rispetto all’universo dello stesso giorno (0 peggiori, 1
          migliori).
        </p>
      </div>

      {/* Row 4: Interpretazione full width */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Interpretazione rapida</h3>
        <div className="mt-2 space-y-2 text-[13px]">
          <div className="flex items-start gap-2">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span>
              <b>&gt; 70</b> → momentum forte
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span>
              <b>40–60</b> → neutro
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span>
              <b>&lt; 30</b> → momentum debole
            </span>
          </div>
        </div>
      </div>

      {/* Row 5: Caratteristiche / nota full width */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Caratteristiche</h3>
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-700">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Range 0–100</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Aggiornamento daily</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Relativo cross-section</span>
        </div>
        <div className="mt-3 text-[12px] text-slate-600">
          Suggerimento: un momentum score alto indica performance relativa superiore, non garantisce continuazione.
        </div>
      </div>
    </div>
  );
}
