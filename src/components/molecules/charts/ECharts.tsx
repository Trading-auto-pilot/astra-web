import type { ReactNode } from "react";

export type EChartsSeries = {
  name?: string;
  data: number[];
};

export type EChartsOption = {
  title?: { text?: string };
  xAxis?: { data?: string[] };
  series?: EChartsSeries[];
};

export type EChartsProps = {
  option: EChartsOption;
  height?: number;
  className?: string;
  footer?: ReactNode;
};

/**
 * Lightweight placeholder for echarts-for-react. Renders a basic bar chart using the first series.
 */
export function ECharts({ option, height = 220, className = "", footer }: EChartsProps) {
  const labels = option.xAxis?.data || option.series?.[0]?.data.map((_, idx) => `#${idx + 1}`) || [];
  const data = option.series?.[0]?.data || [];
  const maxVal = Math.max(...data, 1);

  return (
    <div className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {option.title?.text && (
        <div className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900">
          {option.title.text}
        </div>
      )}
      <div className="px-4 py-3">
        <div className="flex items-end gap-3" style={{ minHeight: height }}>
          {data.map((val, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div
                className="w-10 rounded-t-md bg-blue-500 transition"
                style={{ height: `${(val / maxVal) * (height - 40)}px` }}
                title={`${labels[idx] ?? ""}: ${val}`}
              />
              <span className="text-xs text-slate-500">{labels[idx]}</span>
            </div>
          ))}
        </div>
        {footer && <div className="mt-3 text-xs text-slate-500">{footer}</div>}
      </div>
    </div>
  );
}

export default ECharts;
