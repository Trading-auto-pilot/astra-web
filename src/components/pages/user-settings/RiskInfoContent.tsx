export function RiskInfoContent() {
  const copyFormula = () => {
    const text = `risk_score =
  0.40·beta_score +
  0.35·debt_equity_score +
  0.25·altman_z_score`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  return (
    <div className="space-y-4 text-slate-900">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-700">
          Score composito che misura il profilo di rischio strutturale e di mercato del titolo, combinando volatilità,
          leva finanziaria e solvibilità.
        </p>
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-700">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Range 0–100</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Uso: safety filter</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Update: daily/quarterly</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Componenti di input</h3>
            <ul className="space-y-2 text-sm text-slate-800">
              <li>
                <span className="font-semibold">beta (rolling 252d)</span> – sensibilità ai movimenti di mercato (≈ 1 anno).
              </li>
              <li>
                <span className="font-semibold">debt_equity</span> – leva finanziaria (Debito / Patrimonio Netto).
              </li>
              <li>
                <span className="font-semibold">altman_z</span> – Z-Score di solvibilità (più alto ⇒ minor probabilità di
                default).
              </li>
            </ul>

            <div className="h-px bg-slate-200" />

            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Normalizzazione</h3>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
              <pre className="overflow-auto rounded-lg border border-slate-200 bg-white p-3 text-[12px] text-slate-900">
{`beta_score        = clamp(1 − |beta − 1| / 1.5, 0, 1) × 100
debt_equity_score = step_function(debt_equity) × 100
altman_z_score    = clamp(altman_z / 3, 0, 1) × 100`}
              </pre>
              <p className="mt-2 text-xs text-slate-600">
                Beta penalizza deviazioni da 1, debt/equity usa una funzione a gradini, Altman Z viene normalizzato su 0–3.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pesi di default</h3>
            <div className="mt-2 grid grid-cols-1 gap-2 text-sm">
              {[
                { k: "beta_score", v: "0.40" },
                { k: "debt_equity_score", v: "0.35" },
                { k: "altman_z_score", v: "0.25" },
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
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Formula</h3>
            <button
              type="button"
              onClick={copyFormula}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-800 hover:bg-slate-100"
            >
              Copy
            </button>
          </div>
          <pre className="overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-[12px] text-slate-900">
{`risk_score =
  0.40·beta_score +
  0.35·debt_equity_score +
  0.25·altman_z_score`}
          </pre>
          <p className="mt-2 text-xs text-slate-600">
            Pesi: rischio di mercato (beta), rischio finanziario (leverage), rischio di solvibilità (default).
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Interpretazione</h3>
          <div className="mt-2 space-y-2 text-[13px] text-slate-800">
            <div className="flex items-start gap-2">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span>
                <b>&gt; 70</b> → rischio basso / controllato
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span>
                <b>40–70</b> → rischio moderato
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-rose-500" />
              <span>
                <b>&lt; 40</b> → rischio elevato
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Caratteristiche</h3>
          <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-700">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Range 0–100</span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
              Update: daily (beta), quarterly (leverage/Altman)
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
              Uso: penalizzazione titoli fragili
            </span>
          </div>
        </div>
      </div>

      <div className="text-[12px] text-slate-600">Uso tipico: filtro di sicurezza e penalizzazione titoli instabili.</div>
    </div>
  );
}
