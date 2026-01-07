export function AltmanInfoContent() {
  return (
    <section className="space-y-4 text-slate-900">
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Cos’è e che tipo di indice è</h3>
          </header>
          <div className="px-5 py-4">
            <p className="text-sm leading-6 text-slate-700">
              L’<span className="font-semibold text-slate-900">Altman Z-Score</span> è un indice composito che stima la probabilità di{" "}
              <span className="font-medium text-slate-900">insolvenza</span> usando variabili di bilancio (liquidità, redditività, leva e attività).
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              È un segnale di <span className="font-medium text-slate-900">salute finanziaria</span>: valori più alti indicano maggiore solidità; valori bassi indicano fragilità.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 flex-none rounded-full bg-slate-900" />
                <span>
                  <span className="font-medium text-slate-900">Tipo:</span> indice fondamentale, continuo
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 flex-none rounded-full bg-slate-900" />
                <span>
                  <span className="font-medium text-slate-900">Focus:</span> rischio di insolvenza e deterioramento del bilancio
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 flex-none rounded-full bg-slate-900" />
                <span>
                  <span className="font-medium text-slate-900">Uso tipico:</span> filtro di rischio strutturale
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Cosa misura</h3>
          </header>
          <div className="px-5 py-4">
            <p className="text-sm leading-6 text-slate-700">L’Altman Z aggrega più dimensioni della solidità aziendale, tra cui:</p>
            <ul className="mt-3 list-disc pl-5 text-sm leading-6 text-slate-700">
              <li>
                <span className="font-medium text-slate-900">Liquidità</span> e capacità di sostenere impegni nel breve
              </li>
              <li>
                <span className="font-medium text-slate-900">Redditività</span> e accumulo di utili nel tempo
              </li>
              <li>
                <span className="font-medium text-slate-900">Leva</span> e robustezza della struttura del capitale
              </li>
              <li>
                <span className="font-medium text-slate-900">Efficienza</span> nell’uso degli asset (rotazione)
              </li>
            </ul>
            <p className="mt-3 text-xs text-slate-600">
              Nota: esistono varianti della formula (manifatturiero vs non-manifatturiero, private vs public). Nel sistema si usa il valore fornito dal provider.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Range e fasce di interpretazione</h3>
          </header>
          <div className="space-y-4 px-5 py-4">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Range</div>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Non ha un limite massimo teorico. Lettura per fasce: <span className="font-medium text-slate-900">basso = rischio alto</span>,{" "}
                <span className="font-medium text-slate-900">alto = rischio basso</span>.
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Altman Z</th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Significato</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">&lt; 1.8</td>
                    <td className="px-4 py-2 text-slate-700">Distress zone (rischio elevato)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">1.8 – 3.0</td>
                    <td className="px-4 py-2 text-slate-700">Grey zone (attenzione)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">&gt; 3.0</td>
                    <td className="px-4 py-2 text-slate-700">Safe zone (solidità buona)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-600">Le soglie sono indicative e dipendono da settore e variante di Z-Score.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Limiti dell’Altman Z</h3>
          </header>
          <div className="px-5 py-4">
            <ul className="list-disc pl-5 text-sm leading-6 text-slate-700">
              <li>
                <span className="font-medium text-slate-900">Non è un indicatore di prezzo:</span> non dà timing di ingresso/uscita.
              </li>
              <li>
                <span className="font-medium text-slate-900">Dipende da bilanci aggiornati:</span> cambia soprattutto con dati trimestrali/annuali.
              </li>
              <li>
                <span className="font-medium text-slate-900">Settori diversi:</span> alcune industrie (es. financials) possono richiedere interpretazioni specifiche.
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Altman Z → Altman Z Score (0–100)</h3>
          </header>
          <div className="space-y-4 px-5 py-4">
            <p className="text-sm leading-6 text-slate-700">
              L’Altman Z viene trasformato in uno <span className="font-semibold text-slate-900">altman_z_score</span> normalizzato 0–100. Valori più alti indicano minore rischio.
            </p>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Normalizzazione (lineare)</div>
              <div className="mt-2 font-mono text-sm text-slate-900">altman_z_score = clamp(Altman Z / 3, 0, 1) × 100</div>
              <p className="mt-2 text-xs text-slate-600">
                Z ≥ 3 è area di sicurezza (score vicino a 100). Il filtro si applica sull’<b>altman_z_score</b> (percentuale), non sul valore grezzo.
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      Altman Z Score
                    </th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      Significato
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">0 – 30</td>
                    <td className="px-4 py-2 text-slate-700">Rischio elevato (distress)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">30 – 60</td>
                    <td className="px-4 py-2 text-slate-700">Rischio moderato (grey zone)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">60 – 100</td>
                    <td className="px-4 py-2 text-slate-700">Rischio basso (area di sicurezza)</td>
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
              <li>Usato come filtro per evitare aziende in potenziale deterioramento finanziario.</li>
            </ul>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Peso nel Risk Score</div>
              <div className="mt-2 font-mono text-sm text-slate-900">
                risk_score = 0.40·beta_score + 0.35·debt_equity_score + 0.25·altman_z_score
              </div>
              <p className="mt-2 text-xs text-slate-600">Altman Z contribuisce con un peso pari a 0.25.</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Cosa guardare in pratica</h3>
          </header>
          <div className="px-5 py-4">
            <ul className="list-disc pl-5 text-sm leading-6 text-slate-700">
              <li>
                <span className="font-medium text-slate-900">Z &gt; 3</span> → solidità buona, warning ridotti
              </li>
              <li>
                <span className="font-medium text-slate-900">Z 1.8–3</span> → area grigia, aumenta l’attenzione
              </li>
              <li>
                <span className="font-medium text-slate-900">Z &lt; 1.8</span> → rischio alto, filtro più severo
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Sintesi</h3>
          </header>
          <div className="px-5 py-4">
            <p className="text-sm leading-6 text-slate-700">
              L’Altman Z-Score stima il rischio di insolvenza combinando segnali di bilancio. Nel sistema è usato come filtro di rischio strutturale: valori alti indicano
              solidità, valori bassi aumentano i warning e riducono l’idoneità del titolo.
            </p>
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-100 px-5 py-3">
        <p className="text-xs text-slate-500">
          Fonte: fundamentals “as-of”. L’altman_z_score è normalizzato con clamp(Z/3) e usato nel Risk Score.
        </p>
      </footer>
    </section>
  );
}
