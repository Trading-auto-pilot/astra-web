export type DetailRow = { key: string; value: string };

export type MomentumComponents = {
  score: number | null;
  doubleTopScore: number | null;
  components: Record<string, unknown> | null;
};

export type TickerDetailTabProps = {
  detailRows: DetailRow[];
  momentumComponents?: MomentumComponents | null;
};

const formatMomentumValue = (value: unknown) => {
  if (value === null || value === undefined) return "-";
  if (typeof value === "number" && Number.isFinite(value)) return value.toFixed(2);
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.length ? value.join(", ") : "[]";
  return JSON.stringify(value);
};

const flattenComponents = (obj: Record<string, unknown>, prefix = ""): DetailRow[] => {
  return Object.entries(obj).flatMap(([key, val]) => {
    const label = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === "object" && !Array.isArray(val)) {
      return flattenComponents(val as Record<string, unknown>, label);
    }
    return [{ key: label, value: formatMomentumValue(val) }];
  });
};

export function TickerDetailTab({ detailRows, momentumComponents }: TickerDetailTabProps) {
  if (!detailRows.length) {
    return <div className="px-2 py-3 text-sm text-slate-500">Nessun dettaglio disponibile.</div>;
  }

  const columns: DetailRow[][] = [[], [], []];
  detailRows.forEach((row, idx) => {
    columns[idx % 3].push(row);
  });

  const momentumRows =
    momentumComponents?.components && typeof momentumComponents.components === "object"
      ? flattenComponents(momentumComponents.components)
      : [];

  const showMomentumSection =
    momentumComponents &&
    (momentumRows.length > 0 || momentumComponents.score !== null || momentumComponents.doubleTopScore !== null);

  return (
    <div className="space-y-4">
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

      {showMomentumSection && (
        <div className="rounded-lg border border-slate-200 bg-white/80">
          <div className="border-b border-slate-100 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
            Momentum components
          </div>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              {momentumComponents?.score !== null && (
                <tr>
                  <td className="w-48 bg-slate-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                    score
                  </td>
                  <td className="px-3 py-2 text-[12px] text-slate-800 break-words">
                    {momentumComponents.score.toFixed(2)}
                  </td>
                </tr>
              )}
              {momentumComponents?.doubleTopScore !== null && (
                <tr>
                  <td className="w-48 bg-slate-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                    doubleTopScore
                  </td>
                  <td className="px-3 py-2 text-[12px] text-slate-800 break-words">
                    {momentumComponents.doubleTopScore.toFixed(2)}
                  </td>
                </tr>
              )}
              {momentumRows.map((row) => (
                <tr key={row.key}>
                  <td className="w-48 bg-slate-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                    {row.key}
                  </td>
                  <td className="px-3 py-2 text-[12px] text-slate-800 break-words">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TickerDetailTab;
