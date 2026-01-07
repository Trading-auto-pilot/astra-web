export function OpMarginInfoContent() {
  return (
    <section className="space-y-4 text-slate-900">
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Cos’è e cosa misura</h3>
          </header>
          <div className="px-5 py-4">
            <p className="text-sm leading-6 text-slate-700">
              L’<span className="font-semibold text-slate-900">Operating Margin</span> misura la quota di ricavi che rimane all’azienda dopo aver sostenuto i costi operativi
              direttamente legati all’attività caratteristica. Rappresenta la redditività del core business, indipendente da
              struttura finanziaria, fiscalità ed eventi straordinari.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 flex-none rounded-full bg-slate-900" />
                <span className="font-medium text-slate-900">Efficienza operativa</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 flex-none rounded-full bg-slate-900" />
                <span>
                  <span className="font-medium text-slate-900">Potere di pricing</span> e controllo dei costi
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 flex-none rounded-full bg-slate-900" />
                <span className="font-medium text-slate-900">Qualità del modello di business</span>
              </li>
            </ul>
            <p className="mt-4 text-sm leading-6 text-slate-700">
              Un margine operativo elevato e stabile indica un business efficiente e difendibile nel tempo.
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
              <div className="mt-2 font-mono text-sm text-slate-900">Operating Margin = Operating Income / Revenue</div>
              <div className="mt-3 grid gap-2 text-sm text-slate-700">
                <div>
                  <span className="font-medium text-slate-900">Operating Income</span> = risultato operativo
                </div>
                <div>
                  <span className="font-medium text-slate-900">Revenue</span> = ricavi totali
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
                  <span className="font-medium text-slate-900">Minimo:</span> può essere negativo (attività operativa in perdita)
                </li>
                <li>
                  <span className="font-medium text-slate-900">Massimo:</span> non ha un limite superiore teorico (dipende da settore e modello di business).
                </li>
              </ul>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      Operating Margin
                    </th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      Significato
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">&lt; 0%</td>
                    <td className="px-4 py-2 text-slate-700">Attività operativa in perdita</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">0 – 5%</td>
                    <td className="px-4 py-2 text-slate-700">Margine molto basso</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">5 – 15%</td>
                    <td className="px-4 py-2 text-slate-700">Margine nella media</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">15 – 30%</td>
                    <td className="px-4 py-2 text-slate-700">Margine elevato</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">&gt; 30%</td>
                    <td className="px-4 py-2 text-slate-700">Margine molto elevato (pricing power)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-600">Le soglie variano fortemente per settore.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Limiti dell’Operating Margin</h3>
          </header>
          <div className="px-5 py-4">
            <ul className="list-disc pl-5 text-sm leading-6 text-slate-700">
              <li>
                <span className="font-medium text-slate-900">Sensibile al ciclo economico:</span> in fasi recessive i margini
                tendono a comprimersi.
              </li>
              <li>
                <span className="font-medium text-slate-900">Influenza della contabilizzazione:</span> ammortamenti e
                politiche contabili incidono sulla comparabilità.
              </li>
              <li>
                <span className="font-medium text-slate-900">Non cattura la struttura finanziaria:</span> non considera debito,
                interessi e tasse.
              </li>
            </ul>
            <p className="mt-3 text-sm leading-6 text-slate-700">Va interpretato insieme a ROE, ROA e metriche di rischio finanziario.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Operating Margin → Score (0–100)</h3>
          </header>
          <div className="space-y-4 px-5 py-4">
            <p className="text-sm leading-6 text-slate-700">
              L’Operating Margin viene trasformato in uno <span className="font-semibold text-slate-900">op_margin_score</span>{" "}
              normalizzato su scala 0–100 per rendere confrontabili aziende diverse.
            </p>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Metodo di normalizzazione</div>
              <div className="mt-2 font-mono text-sm text-slate-900">op_margin_score = percentile_rank(Operating Margin) × 100</div>
              <p className="mt-2 text-xs text-slate-600">
                Il <span className="font-medium text-slate-900">percentile rank</span> restituisce la posizione percentuale rispetto all’universo (o settore). Il filtro nel
                sistema si applica sullo <b>op_margin_score</b>, non sul valore grezzo del margine.
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      Operating Margin Score
                    </th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      Significato
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">0 – 30</td>
                    <td className="px-4 py-2 text-slate-700">Redditività operativa bassa</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">30 – 60</td>
                    <td className="px-4 py-2 text-slate-700">Redditività nella media</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">60 – 80</td>
                    <td className="px-4 py-2 text-slate-700">Redditività elevata</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">80 – 100</td>
                    <td className="px-4 py-2 text-slate-700">Redditività operativa eccellente</td>
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
                L’<span className="font-medium text-slate-900">op_margin_score</span> è uno degli input del{" "}
                <span className="font-medium text-slate-900">Quality Score</span>.
              </li>
              <li>Contribuisce alla valutazione della qualità operativa dell’azienda.</li>
            </ul>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Peso nel Quality Score</div>
              <div className="mt-2 font-mono text-sm text-slate-900">
                quality_score = 0.35·roe_score + 0.25·roa_score + 0.25·op_margin_score + 0.15·piot_score
              </div>
              <p className="mt-2 text-xs text-slate-600">
                Operating Margin contribuisce con un peso pari a <span className="font-medium text-slate-900">0.25</span>.
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
                <span className="font-medium text-slate-900">Margine stabile</span> → business difendibile
              </li>
              <li>
                <span className="font-medium text-slate-900">Margine in crescita</span> → miglioramento operativo
              </li>
              <li>
                <span className="font-medium text-slate-900">Margine alto</span> → forte pricing power
              </li>
              <li>
                <span className="font-medium text-slate-900">Margine volatile</span> → modello di business fragile
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
              L’Operating Margin è una metrica chiave per valutare la qualità operativa. È meno influenzato dalla leva
              finanziaria rispetto al ROE ed è centrale nella valutazione della solidità del modello di business.
            </p>
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-100 px-5 py-3">
        <p className="text-xs text-slate-500">
          Fonte: fundamentals “as-of”. L’op_margin_score è calcolato durante il processo di scoring usando percentile rank
          sull’universo selezionato.
        </p>
      </footer>
    </section>
  );
}
