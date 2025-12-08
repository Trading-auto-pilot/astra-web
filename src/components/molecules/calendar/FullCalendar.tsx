export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end?: string;
};

export type FullCalendarProps = {
  events?: CalendarEvent[];
  header?: string;
};

/**
 * Minimal calendar placeholder (no external libs). Renders a simple list of events.
 * Replace with a richer calendar if/when adding @fullcalendar packages.
 */
export function FullCalendar({ events = [], header = "Events" }: FullCalendarProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 text-sm font-semibold text-slate-800">{header}</div>
      {events.length === 0 && (
        <p className="text-sm text-slate-500">No events scheduled.</p>
      )}
      <ul className="space-y-2">
        {events.map((ev) => (
          <li
            key={ev.id}
            className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800"
          >
            <div className="font-medium">{ev.title}</div>
            <div className="text-xs text-slate-500">
              {ev.start}
              {ev.end ? ` → ${ev.end}` : ""}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FullCalendar;
