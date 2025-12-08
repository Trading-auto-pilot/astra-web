import type { ReactNode } from "react";

export type ChartLegendProps = {
  label: string;
  color?: string;
  onClick?: () => void;
  active?: boolean;
  symbol?: ReactNode;
  className?: string;
};

export function ChartLegend({
  label,
  color = "#3b82f6",
  onClick,
  active = false,
  symbol,
  className = "",
}: ChartLegendProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-800 ${className}`}
      style={{ opacity: active ? 0.6 : 1 }}
    >
      {symbol || (
        <span
          className="inline-block rounded-sm"
          style={{ width: 10, height: 8, backgroundColor: color }}
        />
      )}
      <span className="truncate">{label}</span>
    </button>
  );
}

export default ChartLegend;
