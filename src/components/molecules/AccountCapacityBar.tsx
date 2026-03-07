/**
 * AccountCapacityBar
 *
 * Horizontal stacked progress bar representing IBKR account capacity.
 *
 * BAR LAYOUT (2 colors only):
 *   [████████████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░]
 *    ←────────────── BLUE (Equity) ──────────────→←─ PURPLE ─→
 *                                                  (IBKR Margin)
 *
 * Inside the BLUE segment, white vertical markers divide:
 *   [Open Positions] | [Active Orders Reserved] | [Residual Cash]
 *
 * A draggable cursor on the bar sets MAX_INVESTMENT (defaults to end of blue).
 *
 * DERIVED VALUES:
 *   ibkrMarginTop         = max(availableFunds - totalCashValue, 0)
 *   openPositions         = grossPositionValue  (or netLiq - cash as fallback)
 *   reservedCashForOrders = min(activeOrdersCash, totalCashValue)
 *   residualCash          = max(totalCashValue - reservedCashForOrders, 0)
 *   totalVisualCapacity   = netLiquidation + ibkrMarginTop
 */

import { useRef, useState, useCallback } from "react";

export type AccountCapacityBarProps = {
  /** Net liquidation value — drives the blue segment width */
  netLiquidation: number;
  /** Total cash value — available for investment */
  totalCashValue: number;
  /** Gross position value — optional, defaults to netLiquidation - totalCashValue */
  grossPositionValue?: number;
  /** IBKR available funds — used to derive margin on top */
  availableFunds: number;
  /** Sum of active orders notional (reserved cash for pending orders) */
  activeOrdersCash?: number;
  /** Controlled MAX_INVESTMENT value */
  maxInvestment?: number;
  /** Called when the user drags the MAX_INVESTMENT cursor */
  onMaxInvestmentChange?: (value: number) => void;
  className?: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtUSD = (v: number) =>
  v.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

const fmtPct = (v: number, of: number) =>
  of > 0 ? `${((v / of) * 100).toFixed(1)}%` : "–";

const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));

// ── Component ─────────────────────────────────────────────────────────────────

export default function AccountCapacityBar({
  netLiquidation,
  totalCashValue,
  grossPositionValue,
  availableFunds,
  activeOrdersCash = 0,
  maxInvestment,
  onMaxInvestmentChange,
  className = "",
}: AccountCapacityBarProps) {
  // ── Derived ────────────────────────────────────────────────────────────────
  const ibkrMarginTop   = Math.max(availableFunds - totalCashValue, 0);
  const openPositions   = grossPositionValue != null
    ? grossPositionValue
    : Math.max(netLiquidation - totalCashValue, 0);
  const availableCash   = totalCashValue;
  const reservedCash    = clamp(activeOrdersCash, 0, availableCash);
  const residualCash    = Math.max(availableCash - reservedCash, 0);
  const totalCapacity   = netLiquidation + ibkrMarginTop;

  if (totalCapacity <= 0) return null;

  // ── Percentages (all relative to totalCapacity) ────────────────────────────
  const pct = (v: number) => clamp((v / totalCapacity) * 100);

  const bluePct   = pct(netLiquidation);   // width of the blue (Equity) segment
  const purplePct = pct(ibkrMarginTop);    // width of the purple (IBKR Margin) segment

  // Marker positions (as % of totalCapacity) — these fall inside the blue segment
  const m1Pct = pct(openPositions);                     // end of Open Positions
  const m2Pct = pct(openPositions + reservedCash);      // end of Active Orders Reserved

  // ── Label segment widths (% of total bar width) ───────────────────────────
  const seg1W = m1Pct;                  // Open Positions
  const seg2W = m2Pct - m1Pct;         // Active Orders Reserved
  const seg3W = bluePct - m2Pct;       // Residual Cash
  const seg4W = purplePct;             // IBKR Margin On Top

  // ── MAX_INVESTMENT cursor ──────────────────────────────────────────────────
  // Internal state (used when prop is uncontrolled). Default = end of blue.
  const [internalMaxInv, setInternalMaxInv] = useState<number | null>(null);
  const effectiveMaxInv  = maxInvestment ?? internalMaxInv ?? netLiquidation;
  const maxInvPct        = clamp((effectiveMaxInv / totalCapacity) * 100);
  const barRef           = useRef<HTMLDivElement>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Capture pointer on the element so pointermove fires on it even when mouse leaves
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);

    const updateFromEvent = (clientX: number) => {
      const rect = barRef.current?.getBoundingClientRect();
      if (!rect) return;
      const rawPct = clamp((clientX - rect.left) / rect.width * 100);
      const newVal = Math.round((rawPct / 100) * totalCapacity * 100) / 100;
      setInternalMaxInv(newVal);
      onMaxInvestmentChange?.(newVal);
    };

    // With setPointerCapture, pointermove/pointerup fire on the element — not on window
    const onMove = (me: PointerEvent) => updateFromEvent(me.clientX);
    const onUp = () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    updateFromEvent(e.clientX);
  }, [totalCapacity, onMaxInvestmentChange]);

  return (
    <div className={`select-none ${className}`}>

      {/* ── Header numbers ──────────────────────────────────────────────── */}
      <div className="mb-4 flex flex-wrap items-baseline gap-x-6 gap-y-1">
        <div className="text-[11px]">
          <span className="text-slate-400">Equity  </span>
          <span className="font-bold text-blue-600 tabular-nums">{fmtUSD(netLiquidation)}</span>
        </div>
        <div className="text-[11px]">
          <span className="text-slate-400">IBKR Margin On Top  </span>
          <span className="font-bold text-violet-500 tabular-nums">{fmtUSD(ibkrMarginTop)}</span>
        </div>
        <div className="text-[11px]">
          <span className="text-slate-400">Total Capacity  </span>
          <span className="font-bold text-slate-800 tabular-nums">{fmtUSD(totalCapacity)}</span>
        </div>
        <div className="text-[11px]">
          <span className="text-slate-400">MAX_INVESTMENT  </span>
          <span className="font-bold text-amber-600 tabular-nums">{fmtUSD(effectiveMaxInv)}</span>
          <span className="ml-1 text-slate-400">({fmtPct(effectiveMaxInv, totalCapacity)})</span>
        </div>
      </div>

      {/* ── Bar ─────────────────────────────────────────────────────────── */}
      <div ref={barRef} className="relative">

        {/* Track + fills — overflow:hidden clips fills to pill shape */}
        <div className="relative h-10 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">

          {/* BLUE — Equity (netLiquidation) */}
          <div
            className="absolute inset-y-0 left-0 bg-blue-500 transition-all duration-300"
            style={{ width: `${bluePct}%` }}
            title={`Equity: ${fmtUSD(netLiquidation)} (${fmtPct(netLiquidation, totalCapacity)})`}
          />

          {/* PURPLE — IBKR Margin On Top */}
          {purplePct > 0 && (
            <div
              className="absolute inset-y-0 bg-violet-500 transition-all duration-300"
              style={{ left: `${bluePct}%`, width: `${purplePct}%` }}
              title={`IBKR Margin On Top: ${fmtUSD(ibkrMarginTop)} (${fmtPct(ibkrMarginTop, totalCapacity)})`}
            />
          )}

          {/* Thin white divider between blue and purple */}
          {purplePct > 0.5 && (
            <div
              className="absolute inset-y-0 w-0.5 bg-white/70"
              style={{ left: `${bluePct}%`, transform: "translateX(-50%)" }}
            />
          )}
        </div>

        {/* ── MAX_INVESTMENT draggable cursor ─────────────────────────── */}
        <div
          className="absolute top-0 z-10 h-10 w-8 cursor-ew-resize touch-none"
          style={{ left: `${maxInvPct}%`, transform: "translateX(-50%)" }}
          onPointerDown={handlePointerDown}
          title={`MAX_INVESTMENT: ${fmtUSD(effectiveMaxInv)}`}
        >
          {/* Value label — above the bar */}
          <div className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm">
            {fmtUSD(effectiveMaxInv)}
          </div>
          {/* Vertical amber line through full bar height */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-amber-400 opacity-90" />
          {/* Round handle — vertically centered on bar */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-500 bg-white shadow-md" />
        </div>

        {/* Bracket spans row */}
        <div className="pointer-events-none relative mt-1 h-[6px]">

          {/* Bracket: Open Positions [0 → m1Pct] */}
          {m1Pct > 1 && (
            <div className="absolute inset-y-0" style={{ left: 0, width: `${m1Pct}%` }}>
              <div className="absolute inset-x-0 bottom-0 h-px bg-slate-700 dark:bg-slate-300" />
              <div className="absolute inset-y-0 left-0 w-px bg-slate-700 dark:bg-slate-300" />
              <div className="absolute inset-y-0 right-0 w-px bg-slate-700 dark:bg-slate-300" />
            </div>
          )}

          {/* Bracket: Cash [m1Pct → bluePct] with internal marker at m2Pct */}
          {(bluePct - m1Pct) > 1 && (
            <div className="absolute inset-y-0" style={{ left: `${m1Pct}%`, width: `${bluePct - m1Pct}%` }}>
              <div className="absolute inset-x-0 bottom-0 h-px bg-slate-700 dark:bg-slate-300" />
              <div className="absolute inset-y-0 left-0 w-px bg-slate-700 dark:bg-slate-300" />
              <div className="absolute inset-y-0 right-0 w-px bg-slate-700 dark:bg-slate-300" />
              {/* Inner divider: Active Orders | Residual Cash */}
              {m2Pct > m1Pct + 1 && m2Pct < bluePct - 1 && (
                <div
                  className="absolute inset-y-0 w-px bg-slate-500 dark:bg-slate-400"
                  style={{ left: `${((m2Pct - m1Pct) / (bluePct - m1Pct)) * 100}%` }}
                />
              )}
            </div>
          )}

        </div>

        {/* Tick marks below the bar — thin black lines outside the bar */}
        <div className="pointer-events-none relative h-2.5">
          {/* Tick: end of Open Positions (m1) */}
          {m1Pct > 1 && m1Pct < 99 && (
            <div
              className="absolute top-0 h-full w-px bg-slate-800 dark:bg-slate-200"
              style={{ left: `${m1Pct}%` }}
              title={`End of Open Positions: ${fmtUSD(openPositions)}`}
            />
          )}
          {/* Tick: start of Residual Cash (m2 = end of Active Orders) */}
          {m2Pct > m1Pct + 1 && m2Pct < bluePct - 1 && (
            <div
              className="absolute top-0 h-full w-px bg-slate-800 dark:bg-slate-200"
              style={{ left: `${m2Pct}%` }}
              title={`Start of Residual Cash: ${fmtUSD(residualCash)}`}
            />
          )}
          {/* Tick: end of Residual Cash = end of blue (start of purple) */}
          {purplePct > 0.5 && (
            <div
              className="absolute top-0 h-full w-px bg-slate-500 dark:bg-slate-300"
              style={{ left: `${bluePct}%` }}
              title={`End of Equity / Start of IBKR Margin`}
            />
          )}
        </div>
      </div>

      {/* ── Proportional labels below bar ───────────────────────────────── */}
      <div className="mt-2 flex" aria-label="Segment breakdown">

        {/* Open Positions */}
        {seg1W > 2 && (
          <div
            className="overflow-hidden truncate py-1 pr-2"
            style={{ width: `${seg1W}%` }}
            title={`Open Positions: ${fmtUSD(openPositions)} — ${fmtPct(openPositions, netLiquidation)} of Equity`}
          >
            <div className="text-[9px] font-semibold text-blue-700 dark:text-blue-400">Open Positions</div>
            <div className="text-[9px] tabular-nums text-slate-600 dark:text-slate-300">{fmtUSD(openPositions)}</div>
            <div className="text-[9px] text-slate-400">{fmtPct(openPositions, netLiquidation)}</div>
          </div>
        )}

        {/* Active Orders Reserved */}
        {seg2W > 2 && (
          <div
            className="overflow-hidden truncate py-1 pr-2"
            style={{ width: `${seg2W}%` }}
            title={`Active Orders Reserved: ${fmtUSD(reservedCash)} — ${fmtPct(reservedCash, availableCash)} of Cash`}
          >
            <div className="text-[9px] font-semibold text-blue-600 dark:text-blue-300">Active Orders</div>
            <div className="text-[9px] tabular-nums text-slate-600 dark:text-slate-300">{fmtUSD(reservedCash)}</div>
            <div className="text-[9px] text-slate-400">{fmtPct(reservedCash, availableCash)} of cash</div>
          </div>
        )}

        {/* Residual Cash */}
        {seg3W > 2 && (
          <div
            className="overflow-hidden truncate py-1 pr-2"
            style={{ width: `${seg3W}%` }}
            title={`Residual Cash: ${fmtUSD(residualCash)} — ${fmtPct(residualCash, availableCash)} of Cash`}
          >
            <div className="text-[9px] font-semibold text-blue-400 dark:text-blue-200">Residual Cash</div>
            <div className="text-[9px] tabular-nums text-slate-600 dark:text-slate-300">{fmtUSD(residualCash)}</div>
            <div className="text-[9px] text-slate-400">{fmtPct(residualCash, availableCash)} of cash</div>
          </div>
        )}

        {/* IBKR Margin On Top */}
        {seg4W > 2 && (
          <div
            className="overflow-hidden truncate py-1"
            style={{ width: `${seg4W}%` }}
            title={`IBKR Margin On Top: ${fmtUSD(ibkrMarginTop)} — ${fmtPct(ibkrMarginTop, totalCapacity)} of Total Capacity`}
          >
            <div className="text-[9px] font-semibold text-violet-600 dark:text-violet-300">IBKR Margin</div>
            <div className="text-[9px] tabular-nums text-slate-600 dark:text-slate-300">{fmtUSD(ibkrMarginTop)}</div>
            <div className="text-[9px] text-slate-400">{fmtPct(ibkrMarginTop, totalCapacity)} of capacity</div>
          </div>
        )}
      </div>

      {/* ── Mini legend ─────────────────────────────────────────────────── */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-100 pt-2 dark:border-slate-700">
        <span className="flex items-center gap-1.5 text-[9px] text-slate-400">
          <span className="inline-block h-2 w-4 rounded-sm bg-blue-500" />
          Equity (netLiquidation)
        </span>
        <span className="flex items-center gap-1.5 text-[9px] text-slate-400">
          <span className="inline-block h-2 w-4 rounded-sm bg-violet-500" />
          IBKR Margin On Top
        </span>
        <span className="flex items-center gap-1.5 text-[9px] text-slate-400">
          <span className="inline-block h-3 w-px bg-slate-300" />
          Internal divisions: Open Positions · Active Orders · Residual Cash
        </span>
        <span className="flex items-center gap-1.5 text-[9px] text-slate-400">
          <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-amber-500 bg-white" />
          MAX_INVESTMENT (drag to adjust)
        </span>
      </div>
    </div>
  );
}
