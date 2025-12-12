export type DetailRow = { key: string; value: string };

export type TickerDetailTabProps = {
  detailRows: DetailRow[];
};

export function TickerDetailTab({ detailRows }: TickerDetailTabProps) {
  if (!detailRows.length) {
    return <div className="px-2 py-3 text-sm text-slate-500">Nessun dettaglio disponibile.</div>;
  }

  const columns: DetailRow[][] = [[], [], []];
  detailRows.forEach((row, idx) => {
    columns[idx % 3].push(row);
  });

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      {columns.map((col, colIdx) => (
        <div key={`col-${colIdx}`} className="rounded-lg border border-slate-200 bg-white/80">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              {col.map((row) => (
                <tr key={row.key}>
                  <td className="w-32 bg-slate-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                    {row.key}
                  </td>
                  <td className="px-3 py-2 text-[12px] text-slate-800 break-words">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default TickerDetailTab;
