export function PiotroskiInfoContent() {
  return (
    <section className="space-y-4 text-slate-900">
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Cos’è e che tipo di indicatore è</h3>
          </header>
          <div className="px-5 py-4">
            <p className="text-sm leading-6 text-slate-700">
              Il <span className="font-semibold text-slate-900">Piotroski F-Score</span> è un indicatore “a checklist” basato su bilancio e conto economico: assegna{" "}
              <span className="font-medium text-slate-900">1 punto</span> per ciascun criterio di solidità finanziaria soddisfatto, per un totale compreso tra{" "}
              <span className="font-semibold">0 e 9</span>.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Serve per distinguere aziende <span className="font-medium text-slate-900">finanziariamente solide</span> da aziende{" "}
              <span className="font-medium text-slate-900">fragili</span>, e per ridurre il rischio di “value trap” quando un titolo appare economico ma il bilancio sta
              peggiorando.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 flex-none rounded-full bg-slate-900" />
                <span>
                  <span className="font-medium text-slate-900">Tipo:</span> indicatore fondamentale, discreto (0–9)
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 flex-none rounded-full bg-slate-900" />
                <span>
                  <span className="font-medium text-slate-900">Focus:</span> redditività, leva/liquidità, efficienza operativa
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 flex-none rounded-full bg-slate-900" />
                <span>
                  <span className="font-medium text-slate-900">Uso tipico:</span> filtro di qualità e anti-fragilità
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Cosa valuta (struttura)</h3>
          </header>
          <div className="space-y-3 px-5 py-4">
            <p className="text-sm leading-6 text-slate-700">Il punteggio totale (0–9) deriva dalla somma di criteri raggruppati in tre aree:</p>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Redditività</div>
                <p className="mt-2 text-sm leading-6 text-slate-700">Segnali di utili e cash flow positivi/migliorativi.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Leva / Liquidità</div>
                <p className="mt-2 text-sm leading-6 text-slate-700">Riduzione della leva e migliore capacità di far fronte agli impegni.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Efficienza</div>
                <p className="mt-2 text-sm leading-6 text-slate-700">Miglioramento di margini e rotazione degli asset.</p>
              </div>
            </div>
            <p className="text-xs text-slate-600">
              Nota: i dettagli dei 9 criteri possono variare in base alla disponibilità dati del provider; la logica resta una checklist 0/1 per criterio.
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
                Il Piotroski è un indicatore discreto: <span className="font-semibold text-slate-900">0</span> (debole) →{" "}
                <span className="font-semibold text-slate-900">9</span> (molto forte).
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      F-Score
                    </th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      Significato
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">0 – 3</td>
                    <td className="px-4 py-2 text-slate-700">Debole (fragilità finanziaria / possibile value trap)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">4 – 6</td>
                    <td className="px-4 py-2 text-slate-700">Intermedio (qualità media)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">7 – 9</td>
                    <td className="px-4 py-2 text-slate-700">Forte (solidità e miglioramento dei fondamentali)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Limiti del Piotroski</h3>
          </header>
          <div className="px-5 py-4">
            <ul className="list-disc pl-5 text-sm leading-6 text-slate-700">
              <li>
                <span className="font-medium text-slate-900">Non è un indicatore di prezzo:</span> non dice quando entrare o uscire.
              </li>
              <li>
                <span className="font-medium text-slate-900">È discreto:</span> cambia “a scatti” (0/1 per criterio), non in modo continuo.
              </li>
              <li>
                <span className="font-medium text-slate-900">Dipende dalla qualità dei dati:</span> se alcune voci di bilancio mancano o sono incomplete, il punteggio può
                risultare meno affidabile.
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Piotroski → Piotroski Score (0–100)</h3>
          </header>
          <div className="space-y-4 px-5 py-4">
            <p className="text-sm leading-6 text-slate-700">
              Il valore discreto (0–9) viene trasformato in uno <span className="font-semibold text-slate-900">piot_score</span>{" "}
              normalizzato su scala <span className="font-semibold">0–100</span> per uniformarlo agli altri score del sistema.
            </p>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Normalizzazione</div>
              <div className="mt-2 font-mono text-sm text-slate-900">piot_score = (Piotroski / 9) × 100</div>
              <p className="mt-2 text-xs text-slate-600">
                Normalizzazione lineare: il range è noto e fisso (0–9). Il filtro nel sistema si applica sul{" "}
                <span className="font-medium text-slate-900">piot_score</span> (0–100).
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      Piot Score
                    </th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      Significato
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">0 – 33</td>
                    <td className="px-4 py-2 text-slate-700">Debole</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">33 – 67</td>
                    <td className="px-4 py-2 text-slate-700">Intermedio</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">67 – 100</td>
                    <td className="px-4 py-2 text-slate-700">Forte</td>
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
              <li>
                Il <span className="font-medium text-slate-900">piot_score</span> è un input del{" "}
                <span className="font-medium text-slate-900">Quality Score</span>.
              </li>
              <li>Funziona come filtro di solidità per ridurre aziende fragili o in deterioramento.</li>
            </ul>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Peso nel Quality Score</div>
              <div className="mt-2 font-mono text-sm text-slate-900">
                quality_score = 0.35·roe_score + 0.25·roa_score + 0.25·op_margin_score + 0.15·piot_score
              </div>
              <p className="mt-2 text-xs text-slate-600">Piotroski contribuisce con un peso pari a 0.15.</p>
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
                <span className="font-medium text-slate-900">F-Score 7–9</span> → fondamentali solidi, rischio value trap ridotto
              </li>
              <li>
                <span className="font-medium text-slate-900">F-Score 4–6</span> → qualità media, serve conferma con ROE/ROA/margini
              </li>
              <li>
                <span className="font-medium text-slate-900">F-Score 0–3</span> → fragilità, aumentano i warning
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
              Il Piotroski è un indicatore fondamentale “a checklist” che misura la solidità e la traiettoria dei fondamentali. È utile come filtro
              anti-fragilità e anti-value-trap, complementando ROE/ROA e margini operativi.
            </p>
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-100 px-5 py-3">
        <p className="text-xs text-slate-500">
          Fonte: fundamentals “as-of”. Il piot_score è normalizzato linearmente (0–9 → 0–100) e usato nel Quality Score.
        </p>
      </footer>
    </section>
  );
}
