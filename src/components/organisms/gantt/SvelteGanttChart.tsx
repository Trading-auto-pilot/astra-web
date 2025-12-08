export type GanttTask = {
  id: string;
  label: string;
  start: string; // ISO date
  end: string; // ISO date
};

export type SvelteGanttChartProps = {
  tasks: GanttTask[];
  className?: string;
};

/**
 * Placeholder Gantt chart: renders tasks as timeline bars using pure HTML.
 * Replace with a full Gantt implementation when adding deps.
 */
export function SvelteGanttChart({ tasks, className = "" }: SvelteGanttChartProps) {
  if (!tasks.length) {
    return (
      <div className={`rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 ${className}`}>
        No tasks provided.
      </div>
    );
  }

  const minDate = Math.min(...tasks.map((t) => new Date(t.start).getTime()));
  const maxDate = Math.max(...tasks.map((t) => new Date(t.end).getTime()));
  const span = Math.max(1, maxDate - minDate);

  return (
    <div className={`space-y-3 rounded-lg border border-slate-200 bg-white p-4 ${className}`}>
      <div className="text-sm font-semibold text-slate-900">Gantt placeholder</div>
      <div className="space-y-2">
        {tasks.map((task) => {
          const start = new Date(task.start).getTime();
          const end = new Date(task.end).getTime();
          const leftPct = ((start - minDate) / span) * 100;
          const widthPct = Math.max(4, ((end - start) / span) * 100);
          return (
            <div key={task.id} className="space-y-1">
              <div className="text-xs font-medium text-slate-700">{task.label}</div>
              <div className="relative h-3 w-full rounded-full bg-slate-100">
                <span
                  className="absolute top-0 h-3 rounded-full bg-blue-500"
                  style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  title={`${task.start} → ${task.end}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SvelteGanttChart;
