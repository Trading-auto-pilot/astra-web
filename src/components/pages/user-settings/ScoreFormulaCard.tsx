import { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export type Comparator = "GT" | "LT";

type Term = {
  id: string;
  label: string;
  color: string;
};

interface Props {
  prefix: string;
  terms: Term[]; // order matters
  handles: number[]; // n terms => n-1 handles
  setHandles: (vals: number[]) => void;
  filterLabel: string;
  filterEnabled: boolean;
  setFilterEnabled: (enabled: boolean) => void;
  filterValue: number;
  setFilterValue: (val: number) => void;
  filterComp: Comparator;
  setFilterComp: (c: Comparator) => void;
  infoIcon?: { onClick: () => void; title?: string };
  includeOrderEnabled?: boolean;
  setIncludeOrderEnabled?: (v: boolean) => void;
}

const handleStyle = {
  borderColor: "#0ea5e9",
  backgroundColor: "#fff",
  width: 16,
  height: 16,
  marginTop: -6,
  boxShadow: "0 0 0 2px rgba(14,165,233,0.25)",
};

export function ScoreFormulaCard({
  prefix,
  terms,
  handles,
  setHandles,
  filterLabel,
  filterEnabled,
  setFilterEnabled,
  filterValue,
  setFilterValue,
  filterComp,
  setFilterComp,
  infoIcon,
  includeOrderEnabled,
  setIncludeOrderEnabled,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const hasSlider = handles.length > 0;
  const weights = (() => {
    const arr: number[] = [];
    handles.forEach((h, idx) => {
      const prev = idx === 0 ? 0 : handles[idx - 1];
      arr.push(Math.max(0, h - prev));
    });
    arr.push(Math.max(0, 100 - (handles[handles.length - 1] ?? 0)));
    return arr;
  })();

  const railGradient = () => {
    let stops: string[] = [];
    const allStops = hasSlider ? [0, ...handles, 100] : [0, 100];
    for (let i = 0; i < terms.length; i++) {
      const from = allStops[i];
      const to = allStops[i + 1];
      stops.push(`${terms[i].color} ${from}%`, `${terms[i].color} ${to}%`);
    }
    return `linear-gradient(90deg, ${stops.join(",")})`;
  };

  return (
    <div className={`mt-2 rounded border border-slate-200 bg-white px-2 ${collapsed ? "py-1" : "py-2"} text-[12px] text-slate-700`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="font-semibold text-[11px] text-slate-900">Formula</div>
          {infoIcon && (
            <button
              type="button"
              className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[10px] text-slate-600 hover:bg-slate-100"
              onClick={infoIcon.onClick}
              title={infoIcon.title}
            >
              i
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <button
            type="button"
            className="rounded p-1 hover:bg-slate-100 -mt-1"
            aria-label={collapsed ? "Espandi" : "Minimizza"}
            onClick={() => setCollapsed((v) => !v)}
          >
            {collapsed ? "▸" : "▾"}
          </button>
        </div>
      </div>

      {!collapsed && (
        <>
          <div className="mt-1 rounded-md bg-slate-50 px-2 py-2 text-[13px] font-mono leading-6 text-slate-900">
            <div className={`grid w-full grid-rows-2 grid-cols-${terms.length + 1} items-center gap-x-3`}>
              <div className="row-span-2 self-center">{prefix}</div>
              {terms.map((t, idx) => (
                <div key={t.id} className="self-end text-center" style={{ gridColumn: idx + 2, gridRow: 1 }}>
                  <span style={{ color: t.color }}>W</span>
                  <sub style={{ color: t.color }}>{t.id}</sub>·{t.label}
                </div>
              ))}
              {terms.map((t, idx) => (
                <div
                  key={`${t.id}-w`}
                  className="self-start text-center text-[11px] text-slate-900"
                  style={{ gridColumn: idx + 2, gridRow: 2 }}
                >
                  ({(weights[idx] / 100).toFixed(2)})
                </div>
              ))}
            </div>
          </div>

          {hasSlider && (
            <div
              className="mt-2 px-1"
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              onDragStart={(e) => e.preventDefault()}
            >
              <Slider
                range
                min={0}
                max={100}
                step={1}
                value={handles}
                allowCross={false}
                pushable={1}
                onChange={(vals) => {
                  if (Array.isArray(vals)) setHandles(vals as number[]);
                }}
                trackStyle={handles.map(() => ({ backgroundColor: "transparent" }))}
                handleStyle={handles.map(() => ({ ...handleStyle }))}
                railStyle={{ background: railGradient() }}
              />
            </div>
          )}

          <div className="mt-3 rounded border border-slate-200 bg-slate-50 px-2 py-2 text-[12px] text-slate-700">
            <div className="grid gap-2 md:grid-cols-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filterEnabled}
                  onChange={(e) => setFilterEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                />
                <span>{filterLabel}</span>
              </label>
              {setIncludeOrderEnabled && typeof includeOrderEnabled === "boolean" && (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeOrderEnabled}
                    onChange={(e) => setIncludeOrderEnabled(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                  />
                  <span>Includi nell&apos;ordine di visualizzazione</span>
                </label>
              )}
            </div>
            {filterEnabled && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1 text-[11px]">
                    <input
                      type="radio"
                      name={`${prefix}-comp`}
                      value="GT"
                      checked={filterComp === "GT"}
                      onChange={() => setFilterComp("GT")}
                    />
                    <span>&gt;</span>
                  </label>
                  <label className="flex items-center gap-1 text-[11px]">
                    <input
                      type="radio"
                      name={`${prefix}-comp`}
                      value="LT"
                      checked={filterComp === "LT"}
                      onChange={() => setFilterComp("LT")}
                    />
                    <span>&lt;</span>
                  </label>
                  <span className="text-[11px] text-slate-600">
                    soglia {filterComp === "GT" ? "maggiore di" : "minore di"}{" "}
                    <span className="font-semibold">{filterValue}%</span>
                  </span>
                </div>
                <div
                  className="px-1"
                  onMouseDown={(e) => e.stopPropagation()}
                  onDragStart={(e) => e.preventDefault()}
                >
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={filterValue}
                    onChange={(val) => {
                      const next = Array.isArray(val) ? val[0] : (val as number);
                      setFilterValue(next);
                    }}
                    trackStyle={[{ backgroundColor: "#0ea5e9" }]}
                    handleStyle={[{ ...handleStyle }]}
                    railStyle={{ backgroundColor: "#e2e8f0" }}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
