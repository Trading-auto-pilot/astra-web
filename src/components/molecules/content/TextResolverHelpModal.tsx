import AppIcon from "../../atoms/icon/AppIcon";

type Props = { onClose: () => void };

const C = ({ children }: { children: React.ReactNode }) => (
  <code className="rounded bg-slate-100 px-1 py-0.5 text-[11px] font-semibold text-blue-700">
    {children}
  </code>
);

const rows: [string, string, string][] = [
  ["[[today]]", "Data odierna", "2026-02-07"],
  ["[[today,DD/MM/YYYY]]", "Formato custom", "07/02/2026"],
  ["[[today+3]]", "Offset +3 giorni", "2026-02-10"],
  ["[[today-7,DD-MM-YYYY]]", "Offset -7 formattato", "31-01-2026"],
  ["[[yesterday]]", "Alias today-1", "2026-02-06"],
  ["[[tomorrow]]", "Alias today+1", "2026-02-08"],
  ["[[now]]", "Datetime ISO", "2026-02-07T14:30:00.000Z"],
  ["[[now,YYYY-MM-DD HH:mm:ss]]", "Datetime formattato", "2026-02-07 14:30:00"],
  ["[[lastBusinessDay]]", "Ultimo giorno lavorativo", "2026-02-06"],
  ["[[lastBusinessDay-3]]", "3 business day fa", "2026-02-03"],
  ["[[timestamp]]", "Unix epoch (secondi)", "1738950000"],
  ["[[uuid]]", "UUID v4", "a3f1b2c4-d5e6-..."],
];

const tokens: [string, string, string][] = [
  ["YYYY", "Anno 4 cifre", "2026"],
  ["MM", "Mese 2 cifre", "02"],
  ["DD", "Giorno 2 cifre", "07"],
  ["HH", "Ore 24h", "14"],
  ["mm", "Minuti", "30"],
  ["ss", "Secondi", "05"],
];

export default function TextResolverHelpModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-3">
          <div>
            <div className="text-base font-semibold text-slate-900">
              textResolver &mdash; Placeholder dinamici
            </div>
            <div className="mt-0.5 text-[11px] text-slate-500">
              Sintassi: <C>{"[[keyword+offset,FORMAT]]"}</C> &mdash; offset e formato sono opzionali
            </div>
          </div>
          <button
            type="button"
            className="text-slate-400 transition hover:text-slate-600"
            onClick={onClose}
          >
            <AppIcon icon="mdi:close" className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4 text-xs text-slate-700">
          {/* Quick reference table */}
          <h3 className="mb-2 text-xs font-semibold text-blue-700">Placeholder disponibili</h3>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500">
                  <th className="px-3 py-2 font-semibold">Placeholder</th>
                  <th className="px-3 py-2 font-semibold">Descrizione</th>
                  <th className="px-3 py-2 font-semibold">Esempio</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(([ph, desc, ex]) => (
                  <tr key={ph} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="whitespace-nowrap px-3 py-1.5">
                      <C>{ph}</C>
                    </td>
                    <td className="px-3 py-1.5 text-slate-600">{desc}</td>
                    <td className="whitespace-nowrap px-3 py-1.5 font-mono text-slate-500">{ex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Format tokens */}
          <h3 className="mb-2 mt-4 text-xs font-semibold text-blue-700">Token di formato</h3>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500">
                  <th className="px-3 py-2 font-semibold">Token</th>
                  <th className="px-3 py-2 font-semibold">Descrizione</th>
                  <th className="px-3 py-2 font-semibold">Esempio</th>
                </tr>
              </thead>
              <tbody>
                {tokens.map(([t, d, e]) => (
                  <tr key={t} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-1.5"><C>{t}</C></td>
                    <td className="px-3 py-1.5 text-slate-600">{d}</td>
                    <td className="px-3 py-1.5 font-mono text-slate-500">{e}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Examples */}
          <h3 className="mb-2 mt-4 text-xs font-semibold text-blue-700">Esempi</h3>
          <div className="space-y-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="font-mono text-[11px] text-slate-700">
                <span className="text-slate-400">URL:</span>{" "}
                {"https://api.example.com/data?from="}
                <span className="font-semibold text-blue-600">{"[[today-7]]"}</span>
                {"&to="}
                <span className="font-semibold text-blue-600">{"[[today]]"}</span>
              </div>
              <div className="mt-1 font-mono text-[11px] text-emerald-600">
                {"=> https://api.example.com/data?from=2026-01-31&to=2026-02-07"}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="font-mono text-[11px] text-slate-700">
                <span className="text-slate-400">Body:</span>{" "}
                {'{ "date": "'}
                <span className="font-semibold text-blue-600">{"[[lastBusinessDay,DD/MM/YYYY]]"}</span>
                {'", "id": "'}
                <span className="font-semibold text-blue-600">{"[[uuid]]"}</span>
                {'" }'}
              </div>
              <div className="mt-1 font-mono text-[11px] text-emerald-600">
                {'=> { "date": "06/02/2026", "id": "a3f1b2c4-..." }'}
              </div>
            </div>
          </div>

          {/* Behavior notes */}
          <h3 className="mb-2 mt-4 text-xs font-semibold text-blue-700">Note</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
              <div className="mb-1 text-[10px] font-semibold uppercase text-emerald-600">safe</div>
              <div className="text-[11px] text-slate-600">
                Placeholder non riconosciuti restano invariati: <C>{"[[foo]]"}</C> rimane <C>{"[[foo]]"}</C>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
              <div className="mb-1 text-[10px] font-semibold uppercase text-violet-600">offset composti</div>
              <div className="text-[11px] text-slate-600">
                <C>{"[[yesterday-2]]"}</C> = today - 3 &mdash; <C>{"[[tomorrow+5]]"}</C> = today + 6
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
              <div className="mb-1 text-[10px] font-semibold uppercase text-amber-600">lastBusinessDay</div>
              <div className="text-[11px] text-slate-600">
                L'offset conta in business day (lun-ven), saltando sabato e domenica.
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
              <div className="mb-1 text-[10px] font-semibold uppercase text-amber-600">formato vuoto</div>
              <div className="text-[11px] text-slate-600">
                <C>{"[[today,]]"}</C> con formato vuoto usa il default <C>YYYY-MM-DD</C>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
