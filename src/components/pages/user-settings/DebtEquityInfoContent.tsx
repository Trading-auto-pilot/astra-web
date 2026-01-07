export function DebtEquityInfoContent() {
  return (
    <section className="space-y-4 text-slate-900">
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Cos’è e cosa misura</h3>
          </header>
          <div className="px-5 py-4">
            <p className="text-sm leading-6 text-slate-700">
              Il <span className="font-semibold text-slate-900">Debt / Equity (D/E)</span> misura il grado di leva finanziaria confrontando il debito totale con il patrimonio
              netto degli azionisti. Indica quanto l’azienda finanzia le proprie attività tramite debito rispetto al capitale proprio.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 flex-none rounded-full bg-slate-900" />
                <span>
                  <span className="font-medium text-slate-900">Rischio finanziario</span> e sostenibilità della struttura del capitale
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 flex-none rounded-full bg-slate-900" />
                <span>
                  <span className="font-medium text-slate-900">Sensibilità</span> a rialzi dei tassi e shock macro
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Formula</h3>
          </header>
          <div className="px-5 py-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Calcolo</div>
              <div className="mt-2 font-mono text-sm text-slate-900">Debt / Equity = Total Debt / Shareholders’ Equity</div>
              <div className="mt-3 grid gap-2 text-sm text-slate-700">
                <div>
                  <span className="font-medium text-slate-900">Total Debt</span> = debito finanziario totale (short + long term)
                </div>
                <div>
                  <span className="font-medium text-slate-900">Shareholders’ Equity</span> = patrimonio netto
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Range e fasce di interpretazione</h3>
          </header>
          <div className="space-y-4 px-5 py-4">
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      Debt / Equity
                    </th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      Significato
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">0 – 0.3</td>
                    <td className="px-4 py-2 text-slate-700">Struttura molto prudente</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">0.3 – 0.8</td>
                    <td className="px-4 py-2 text-slate-700">Leva sostenibile</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">0.8 – 1.5</td>
                    <td className="px-4 py-2 text-slate-700">Leva elevata</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">&gt; 1.5</td>
                    <td className="px-4 py-2 text-slate-700">Rischio finanziario alto</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-600">Le soglie variano per settore; banche e utilities sono tipicamente più leverage.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Limiti del Debt / Equity</h3>
          </header>
          <div className="px-5 py-4">
            <ul className="list-disc pl-5 text-sm leading-6 text-slate-700">
              <li>Non distingue tra debito a breve e lungo termine.</li>
              <li>Dipende dalle politiche contabili e dai buyback.</li>
              <li>Non misura direttamente la capacità di servire il debito (vedi Interest Coverage).</li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Debt / Equity → Debt / Equity Score (0–100)</h3>
          </header>
          <div className="space-y-4 px-5 py-4">
            <p className="text-sm leading-6 text-slate-700">
              Il valore di D/E viene trasformato in uno <span className="font-semibold text-slate-900">debt_equity_score</span> normalizzato 0–100, dove valori più alti
              indicano minore rischio.
            </p>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Normalizzazione (a gradini)</div>
              <div className="mt-2 font-mono text-sm text-slate-900">debt_equity_score = step_function(D/E) × 100</div>
              <p className="mt-2 text-xs text-slate-600">
                La funzione assegna punteggi discreti per ridurre rumore e penalizzare fortemente leve eccessive. Il filtro si applica sullo{" "}
                <b>score</b>, non sul D/E grezzo.
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      Debt / Equity Score
                    </th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      Significato
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">80 – 100</td>
                    <td className="px-4 py-2 text-slate-700">Struttura molto solida</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">50 – 80</td>
                    <td className="px-4 py-2 text-slate-700">Leva sostenibile</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">20 – 50</td>
                    <td className="px-4 py-2 text-slate-700">Rischio in aumento</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">0 – 20</td>
                    <td className="px-4 py-2 text-slate-700">Rischio elevato</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Utilizzo nel sistema</h3>
          </header>
          <div className="space-y-3 px-5 py-4">
            <ul className="list-disc pl-5 text-sm leading-6 text-slate-700">
              <li>Input chiave del <span className="font-medium text-slate-900">Risk Score</span>.</li>
              <li>Usato come filtro di sicurezza per evitare eccessiva leva finanziaria.</li>
            </ul>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Peso nel Risk Score</div>
              <div className="mt-2 font-mono text-sm text-slate-900">
                risk_score = 0.40·beta_score + 0.35·debt_equity_score + 0.25·altman_z_score
              </div>
              <p className="mt-2 text-xs text-slate-600">Debt / Equity contribuisce con un peso pari a 0.35.</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Sintesi</h3>
          </header>
          <div className="px-5 py-4">
            <p className="text-sm leading-6 text-slate-700">
              Il Debt / Equity misura la leva finanziaria e il rischio strutturale del bilancio. Nel sistema è utilizzato come filtro di
              sicurezza, privilegiando aziende con struttura del capitale sostenibile.
            </p>
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-100 px-5 py-3">
        <p className="text-xs text-slate-500">
          Fonte: fundamentals “as-of”. Il debt_equity_score è calcolato a gradini e usato nel Risk Score.
        </p>
      </footer>
    </section>
  );
}
