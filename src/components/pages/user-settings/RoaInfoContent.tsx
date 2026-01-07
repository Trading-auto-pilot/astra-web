export function RoaInfoContent() {
  return (
    <section className="space-y-4 text-slate-900">
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Cos’è e cosa misura</h3>
          </header>
          <div className="px-5 py-4">
            <p className="text-sm leading-6 text-slate-700">
              Il <span className="font-semibold text-slate-900">ROA (Return on Assets)</span> misura la capacità di un’azienda di generare utili utilizzando l’insieme delle
              risorse controllate (asset). Indica quanto efficacemente l’azienda trasforma i propri asset in profitto.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 flex-none rounded-full bg-slate-900" />
                <span className="font-medium text-slate-900">Efficienza nell’uso degli asset</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 flex-none rounded-full bg-slate-900" />
                <span>
                  <span className="font-medium text-slate-900">Capacità di generare utili</span> dal totale delle risorse
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 flex-none rounded-full bg-slate-900" />
                <span>
                  <span className="font-medium text-slate-900">Qualità operativa</span> (meno influenzata dalla leva rispetto al ROE)
                </span>
              </li>
            </ul>
            <p className="mt-4 text-sm leading-6 text-slate-700">
              Un ROA elevato indica che l’azienda è efficiente nel generare profitto rispetto alla dimensione del proprio bilancio.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Formula</h3>
          </header>
          <div className="px-5 py-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Calcolo</div>
              <div className="mt-2 font-mono text-sm text-slate-900">ROA = Net Income / Total Assets</div>
              <div className="mt-3 grid gap-2 text-sm text-slate-700">
                <div>
                  <span className="font-medium text-slate-900">Net Income</span> = utile netto del periodo
                </div>
                <div>
                  <span className="font-medium text-slate-900">Total Assets</span> = totale degli asset medi del periodo
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
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Range teorico</div>
              <ul className="mt-2 list-disc pl-5 text-sm leading-6 text-slate-700">
                <li>
                  <span className="font-medium text-slate-900">Minimo:</span> può essere negativo (azienda in perdita)
                </li>
                <li>
                  <span className="font-medium text-slate-900">Massimo:</span> non ha un limite superiore teorico (valori molto elevati possono dipendere da asset “leggeri” o
                  eventi straordinari).
                </li>
              </ul>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">ROA</th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      Significato
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">&lt; 0%</td>
                    <td className="px-4 py-2 text-slate-700">Azienda in perdita</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">0 – 2%</td>
                    <td className="px-4 py-2 text-slate-700">Efficienza molto bassa</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">2 – 5%</td>
                    <td className="px-4 py-2 text-slate-700">Efficienza nella media</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">5 – 10%</td>
                    <td className="px-4 py-2 text-slate-700">Efficienza elevata</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">&gt; 10%</td>
                    <td className="px-4 py-2 text-slate-700">Molto elevata (spesso asset-light)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-600">
              Le soglie variano per settore: aziende capital-intensive tendono ad avere ROA più bassi.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Limiti del ROA</h3>
          </header>
          <div className="px-5 py-4">
            <ul className="list-disc pl-5 text-sm leading-6 text-slate-700">
              <li>
                <span className="font-medium text-slate-900">Influenza della contabilizzazione:</span> politiche contabili e
                ammortamenti possono cambiare la comparabilità.
              </li>
              <li>
                <span className="font-medium text-slate-900">Dipende dall’intensità di capitale:</span> settori con molti
                asset fisici tendono a mostrare ROA più bassi.
              </li>
              <li>
                <span className="font-medium text-slate-900">Eventi straordinari:</span> utili non ricorrenti possono gonfiare
                il ROA in un singolo periodo.
              </li>
            </ul>
            <p className="mt-3 text-sm leading-6 text-slate-700">Per questo il ROA va interpretato insieme a margini e stabilità nel tempo.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">ROA → ROA Score (0–100)</h3>
          </header>
          <div className="space-y-4 px-5 py-4">
            <p className="text-sm leading-6 text-slate-700">
              Per rendere confrontabili aziende diverse, il ROA viene trasformato in uno{" "}
              <span className="font-semibold text-slate-900">roa_score</span> normalizzato su scala 0–100.
            </p>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Metodo di normalizzazione</div>
              <div className="mt-2 font-mono text-sm text-slate-900">roa_score = percentile_rank(ROA) × 100</div>
              <p className="mt-2 text-xs text-slate-600">
                <span className="font-medium text-slate-900">percentile_rank(ROA)</span> restituisce una percentuale (0–1)
                che rappresenta la posizione del titolo rispetto all’universo (o al settore). Il filtro nel sistema si
                applica sul <b>roa_score</b> (percentile), non sul ROA grezzo.
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      ROA Score
                    </th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      Significato
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">0 – 30</td>
                    <td className="px-4 py-2 text-slate-700">Efficienza bassa</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">30 – 60</td>
                    <td className="px-4 py-2 text-slate-700">Efficienza nella media</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">60 – 80</td>
                    <td className="px-4 py-2 text-slate-700">Efficienza elevata</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">80 – 100</td>
                    <td className="px-4 py-2 text-slate-700">Efficienza eccellente</td>
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
                Il <span className="font-medium text-slate-900">roa_score</span> è un input del{" "}
                <span className="font-medium text-slate-900">Quality Score</span>.
              </li>
              <li>Contribuisce alla valutazione dell’efficienza operativa e della qualità del business.</li>
              <li>È considerato insieme a ROE, margine operativo e Piotroski Score.</li>
            </ul>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Peso nel Quality Score</div>
              <div className="mt-2 font-mono text-sm text-slate-900">
                quality_score = 0.35·roe_score + 0.25·roa_score + 0.25·op_margin_score + 0.15·piot_score
              </div>
              <p className="mt-2 text-xs text-slate-600">
                ROA contribuisce con un peso pari a <span className="font-medium text-slate-900">0.25</span>.
              </p>
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
                <span className="font-medium text-slate-900">ROA stabile</span> e in crescita → efficienza migliorata
              </li>
              <li>
                <span className="font-medium text-slate-900">ROA alto</span> con margini solidi → business efficiente
              </li>
              <li>
                <span className="font-medium text-slate-900">ROA basso</span> in settori capital-intensive → può essere normale
                (confronto per settore)
              </li>
              <li>
                <span className="font-medium text-slate-900">ROA volatile</span> → qualità instabile o utili non ricorrenti
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
              Il ROA misura l’efficienza con cui l’azienda trasforma i propri asset in profitto. È meno sensibile alla leva
              finanziaria rispetto al ROE, ma va interpretato per settore e con attenzione alla stabilità nel tempo.
            </p>
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-100 px-5 py-3">
        <p className="text-xs text-slate-500">
          Fonte: fundamentals “as-of”. Il roa_score è calcolato durante il processo di scoring usando percentile rank
          sull’universo selezionato.
        </p>
      </footer>
    </section>
  );
}
