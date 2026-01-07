export function RoeInfoContent() {
  return (
    <section className="space-y-4 text-slate-900">
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Cos’è e cosa misura</h3>
          </header>
          <div className="px-5 py-4">
            <p className="text-sm leading-6 text-slate-700">
              Il <span className="font-semibold text-slate-900">ROE (Return on Equity)</span> misura la capacità di un’azienda di generare utili a partire dal capitale degli
              azionisti. Indica quanto efficacemente il patrimonio netto viene usato per produrre profitto.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 flex-none rounded-full bg-slate-900" />
                <span className="font-medium text-slate-900">Redditività del capitale proprio</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 flex-none rounded-full bg-slate-900" />
                <span className="font-medium text-slate-900">Efficienza del management</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 flex-none rounded-full bg-slate-900" />
                <span>
                  <span className="font-medium text-slate-900">Creazione di valore</span> per gli azionisti
                </span>
              </li>
            </ul>
            <p className="mt-4 text-sm leading-6 text-slate-700">
              Un ROE elevato indica che l’azienda ottiene molti profitti con relativamente poco capitale proprio.
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
              <div className="mt-2 font-mono text-sm text-slate-900">ROE = Net Income / Shareholders’ Equity</div>
              <div className="mt-3 grid gap-2 text-sm text-slate-700">
                <div>
                  <span className="font-medium text-slate-900">Net Income</span> = utile netto del periodo
                </div>
                <div>
                  <span className="font-medium text-slate-900">Shareholders’ Equity</span> = patrimonio netto medio degli
                  azionisti
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
                  <span className="font-medium text-slate-900">Massimo:</span> non ha limite superiore teorico (valori
                  molto elevati possono dipendere da leva alta o equity ridotto).
                </li>
              </ul>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      ROE
                    </th>
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
                    <td className="px-4 py-2 font-medium text-slate-900">0 – 5%</td>
                    <td className="px-4 py-2 text-slate-700">Redditività molto bassa</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">5 – 10%</td>
                    <td className="px-4 py-2 text-slate-700">Redditività debole</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">10 – 15%</td>
                    <td className="px-4 py-2 text-slate-700">Redditività buona</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">15 – 25%</td>
                    <td className="px-4 py-2 text-slate-700">Redditività elevata</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">&gt; 25%</td>
                    <td className="px-4 py-2 text-slate-700">Molto elevata (attenzione alla leva)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-600">Le soglie possono variare in funzione del settore.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Limiti del ROE</h3>
          </header>
          <div className="px-5 py-4">
            <ul className="list-disc pl-5 text-sm leading-6 text-slate-700">
              <li>
                <span className="font-medium text-slate-900">Distorto dalla leva finanziaria:</span> un alto debito può
                gonfiare il ROE senza migliorare il business.
              </li>
              <li>
                <span className="font-medium text-slate-900">Influenza dei buyback:</span> buyback aggressivi riducono
                l’equity → ROE più alto.
              </li>
              <li>
                <span className="font-medium text-slate-900">Non confrontabile cross-sector</span> senza normalizzazione.
              </li>
            </ul>
            <p className="mt-3 text-sm leading-6 text-slate-700">Per questo il ROE non va mai usato da solo.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">ROE → ROE Score (0–100)</h3>
          </header>
          <div className="space-y-4 px-5 py-4">
            <p className="text-sm leading-6 text-slate-700">
              Per rendere confrontabili aziende diverse, il ROE viene trasformato in uno{" "}
              <span className="font-semibold text-slate-900">roe_score</span> normalizzato su scala 0–100.
            </p>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Metodo di normalizzazione</div>
              <div className="mt-2 font-mono text-sm text-slate-900">roe_score = percentile_rank(ROE) × 100</div>
              <p className="mt-2 text-xs text-slate-600">
                <span className="font-medium text-slate-900">percentile_rank(ROE)</span> restituisce una percentuale
                (0–1) che rappresenta la posizione del titolo rispetto all’universo (o al settore). Il filtro nel
                sistema si applica sul <b>roe_score</b> (percentile), non sul ROE grezzo.
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      ROE Score
                    </th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      Significato
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">0 – 30</td>
                    <td className="px-4 py-2 text-slate-700">Redditività bassa</td>
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
                    <td className="px-4 py-2 text-slate-700">Redditività eccellente</td>
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
                Il <span className="font-medium text-slate-900">roe_score</span> è uno degli input principali del{" "}
                <span className="font-medium text-slate-900">Quality Score</span>.
              </li>
              <li>Contribuisce alla valutazione della qualità strutturale.</li>
              <li>È considerato insieme a ROA, margine operativo e Piotroski Score.</li>
            </ul>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Peso nel Quality Score</div>
              <div className="mt-2 font-mono text-sm text-slate-900">
                quality_score = 0.35·roe_score + 0.25·roa_score + 0.25·op_margin_score + 0.15·piot_score
              </div>
              <p className="mt-2 text-xs text-slate-600">ROE è la componente più pesata del Quality Score.</p>
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
                <span className="font-medium text-slate-900">ROE stabile</span> e{" "}
                <span className="font-medium text-slate-900">&gt; 15%</span> → qualità alta
              </li>
              <li>
                <span className="font-medium text-slate-900">ROE molto alto</span> ma con{" "}
                <span className="font-medium text-slate-900">Debt/Equity elevato</span> → warning
              </li>
              <li>
                <span className="font-medium text-slate-900">ROE in crescita</span> → miglioramento strutturale
              </li>
              <li>
                <span className="font-medium text-slate-900">ROE volatile</span> → qualità instabile
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
              Il ROE misura quanto bene l’azienda remunera il capitale degli azionisti, ma va letto insieme a ROA, margini
              e leva finanziaria per evitare interpretazioni fuorvianti.
            </p>
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-100 px-5 py-3">
        <p className="text-xs text-slate-500">
          Fonte: fundamentals “as-of”. Il roe_score è calcolato durante il processo di scoring usando percentile rank
          sull’universo selezionato.
        </p>
      </footer>
    </section>
  );
}
