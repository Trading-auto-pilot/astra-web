import { useEffect, useState, useMemo, useCallback } from "react";
import { env } from "../../../config/env";
import { ScoreFormulaCard, type Comparator } from "./ScoreFormulaCard";
import { MomentumInfoContent } from "./MomentumInfoContent";
import { MomentumShortInfoContent } from "./MomentumShortInfoContent";
import { QualityInfoContent } from "./QualityInfoContent";
import { RiskInfoContent } from "./RiskInfoContent";
import { ValuationInfoContent } from "./ValuationInfoContent";
import { TotalInfoContent } from "./TotalInfoContent";
import { MarketRiskInfoContent } from "./MarketRiskInfoContent";
import { GrowthInfoContent } from "./GrowthInfoContent";
import { RoeInfoContent } from "./RoeInfoContent";
import { RoaInfoContent } from "./RoaInfoContent";
import { OpMarginInfoContent } from "./OpMarginInfoContent";
import { PiotroskiInfoContent } from "./PiotroskiInfoContent";
import { DebtEquityInfoContent } from "./DebtEquityInfoContent";
import { AltmanInfoContent } from "./AltmanInfoContent";

const SCORES = [
  "Momentum score",
  "Momentum short score",
  "Quality score",
  "Risk score",
  "Valuation score",
  "Total score",
  "Market risk score",
  "Growth probability",
];

const SCORE_DESCRIPTIONS: Record<string, string> = {
  "Growth probability": "Misura la probabilità di crescita del titolo nel medio termine.",
  "Momentum score": "Forza del movimento di prezzo su orizzonte medio.",
  "Momentum short score": "Forza del movimento di prezzo su orizzonte breve.",
  "Quality score": "Solidità fondamentale (ROE, ROA, margini, Piotroski).",
  "Risk score": "Rischio legato a beta, leverage e solvibilità.",
  "Valuation score": "Convenienza relativa (PE, PB, DCF).",
  "Total score": "Sintesi ponderata dei punteggi principali.",
  "Market risk score": "Stress di mercato in base a volatilità, drawdown e gap.",
};

const FILTERS = [
  { key: "roe", label: "ROE", desc: "Return on Equity" },
  { key: "roa", label: "ROA", desc: "Return on Assets" },
  { key: "op_margin", label: "Operating margin", desc: "Margine operativo" },
  { key: "piotroski", label: "Piotroski", desc: "F-Score di solidità" },
  { key: "debt_equity", label: "Debt/Equity", desc: "Leverage finanziario" },
  { key: "altman_z", label: "Altman Z", desc: "Rischio insolvenza" },
];

const FILTER_DESCRIPTIONS: Record<string, string> = FILTERS.reduce(
  (acc, f) => ({ ...acc, [f.label]: f.desc }),
  {} as Record<string, string>
);
const FILTER_LABEL_BY_KEY = FILTERS.reduce((acc, f) => ({ ...acc, [f.key]: f.label }), {} as Record<string, string>);
const SCORE_LABEL_BY_KEY: Record<string, string> = {
  quality_score: "Quality score",
  momentum_score: "Momentum score",
  momentum_score_short: "Momentum short score",
  risk_score: "Risk score",
  valuation_score: "Valuation score",
  total_score: "Total score",
  market_risk_score: "Market risk score",
  market_score: "Market risk score",
  growth_probability: "Growth probability",
  growthProbability: "Growth probability",
};
const LABEL_TO_FILTER_KEY: Record<string, string> = {
  ...Object.fromEntries(Object.entries(FILTER_LABEL_BY_KEY).map(([k, v]) => [v, k])),
  ...Object.fromEntries(Object.entries(SCORE_LABEL_BY_KEY).map(([k, v]) => [v, k])),
};

const filterDefaults = FILTERS.reduce(
  (acc, f) => ({ ...acc, [f.label]: { enabled: false, value: 70, comp: "GT" as Comparator, inOrder: false } }),
  {} as Record<string, { enabled: boolean; value: number; comp: Comparator; inOrder?: boolean }>
);

const baseScoreFlags: Record<string, { enabled: boolean; value: number; comp: Comparator; inOrder?: boolean }> = {
  "Momentum score": { enabled: false, value: 70, comp: "GT", inOrder: false },
  "Momentum short score": { enabled: false, value: 70, comp: "GT", inOrder: false },
  "Quality score": { enabled: false, value: 70, comp: "GT", inOrder: false },
  "Risk score": { enabled: false, value: 70, comp: "GT", inOrder: false },
  "Valuation score": { enabled: false, value: 70, comp: "GT", inOrder: false },
  "Total score": { enabled: false, value: 70, comp: "GT", inOrder: false },
  "Market risk score": { enabled: false, value: 70, comp: "GT", inOrder: false },
  "Growth probability": { enabled: false, value: 70, comp: "GT", inOrder: false },
};

export default function UserScoresTab() {
  const [showMomentumInfo, setShowMomentumInfo] = useState(false);
  const [showMomentumShortInfo, setShowMomentumShortInfo] = useState(false);
  const [showQualityInfo, setShowQualityInfo] = useState(false);
  const [showRiskInfo, setShowRiskInfo] = useState(false);
  const [showValuationInfo, setShowValuationInfo] = useState(false);
  const [showTotalInfo, setShowTotalInfo] = useState(false);
  const [showMarketInfo, setShowMarketInfo] = useState(false);
  const [showGrowthInfo, setShowGrowthInfo] = useState(false);
  const [showRoeInfo, setShowRoeInfo] = useState(false);
  const [showRoaInfo, setShowRoaInfo] = useState(false);
  const [showOpMarginInfo, setShowOpMarginInfo] = useState(false);
  const [showPiotInfo, setShowPiotInfo] = useState(false);
  const [showDebtInfo, setShowDebtInfo] = useState(false);
  const [showAltmanInfo, setShowAltmanInfo] = useState(false);
  const [pipes, setPipes] = useState<Array<{ id: number; name?: string; enabled?: boolean }>>([]);
  const [selectedPipeId, setSelectedPipeId] = useState<number | null>(null);
  const [pipesLoading, setPipesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [placed, setPlaced] = useState<string[]>([]);
  const [orderIds, setOrderIds] = useState<Record<string, number>>({});
  const [dragScore, setDragScore] = useState<string | null>(null);
  const [qualityHandles, setQualityHandles] = useState<number[]>([35, 60, 85]); // 35/25/25/15
  const qualityColors = ["#22c55e", "#a855f7", "#06b6d4", "#f97316"];
  const [qualityFilterEnabled, setQualityFilterEnabled] = useState(false);
  const [qualityFilterValue, setQualityFilterValue] = useState(70);
  const [qualityFilterComp, setQualityFilterComp] = useState<"GT" | "LT">("GT");
  const [momentumHandles, setMomentumHandles] = useState<number[]>([50, 80]); // 50/30/20
  const momentumColors = ["#6366f1", "#22c55e", "#f59e0b"];
  const handlesToMomentumWeights = (handles: number[]) => {
    const [h1, h2] = handles;
    return {
      w20: Math.max(0, h1),
      w60: Math.max(0, h2 - h1),
      w120: Math.max(0, 100 - h2),
    };
  };
  const [momentumFilterEnabled, setMomentumFilterEnabled] = useState(false);
  const [momentumFilterValue, setMomentumFilterValue] = useState(70);
  const [momentumFilterComp, setMomentumFilterComp] = useState<Comparator>("GT");
  const [momentumShortHandles, setMomentumShortHandles] = useState<number[]>([60]); // 60/40
  const [riskHandles, setRiskHandles] = useState<number[]>([40, 75]); // 40/35/25
  const [valuationHandles, setValuationHandles] = useState<number[]>([40, 70]); // 40/30/30
  const [totalHandles, setTotalHandles] = useState<number[]>([35, 60, 80]); // 35/25/20/20
  const [marketRiskHandles, setMarketRiskHandles] = useState<number[]>([40, 70, 90]); // 40/30/20/10
  const [growthHandles, setGrowthHandles] = useState<number[]>([45, 70, 85]); // 45/25/15/15
const baseFilters: Record<string, { enabled: boolean; value: number; comp: Comparator; inOrder?: boolean }> = {
  ...baseScoreFlags,
  ...filterDefaults,
};
const SCORE_DEFAULTS: Record<string, { enabled: boolean; value: number; comp: Comparator; inOrder?: boolean }> = SCORES.reduce(
  (acc, s) => ({
    ...acc,
    [s]: acc[s] || { enabled: false, value: 70, comp: "GT", inOrder: false },
  }),
  { ...baseFilters }
);
  const [genericFilters, setGenericFilters] = useState(SCORE_DEFAULTS);

  const updateGenericFilter = (
    key: string,
    patch: Partial<{ enabled: boolean; value: number; comp: Comparator; inOrder: boolean }>
  ) => {
    setGenericFilters((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || baseFilters[key] || { enabled: false, value: 70, comp: "GT" }), ...patch },
    }));
  };

  const token = useMemo(
    () => (typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null),
    []
  );

  const loadPipes = useCallback(async () => {
    try {
      setPipesLoading(true);
      setError(null);
      const res = await fetch(`${env.apiBaseUrl}/tickerscanner/fundamentals/users/pipes`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json().catch(() => ({}));
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      setPipes(list);
      if (list.length && selectedPipeId === null) {
        setSelectedPipeId(list[0]?.id ?? null);
      }
    } catch (err: any) {
      setError(err?.message || "Errore caricamento pipes");
    } finally {
      setPipesLoading(false);
    }
  }, [token, selectedPipeId]);

  useEffect(() => {
    loadPipes();
  }, [loadPipes]);

  const onDragStart = (score: string) => (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", score);
    setDragScore(score);
    e.dataTransfer.effectAllowed = "move";
  };

  const handlesToQualityWeights = (handles: number[]) => {
    const [h1, h2, h3] = handles;
    return {
      wroe: Math.max(0, h1),
      wroa: Math.max(0, h2 - h1),
      wopm: Math.max(0, h3 - h2),
      wpiot: Math.max(0, 100 - h3),
    };
  };

  const handlesToMarketRiskWeights = (handles: number[]) => {
    const [h1, h2, h3] = handles;
    return {
      wvol: Math.max(0, h1),
      wdd: Math.max(0, h2 - h1),
      wgap: Math.max(0, h3 - h2),
      wtrend: Math.max(0, 100 - h3),
    };
  };

  const handlesToGrowthWeights = (handles: number[]) => {
    const [h1, h2, h3] = handles;
    return {
      wmom: Math.max(0, h1),
      wvol: Math.max(0, h2 - h1),
      wrisk: Math.max(0, h3 - h2),
      wmarket: Math.max(0, 100 - h3),
    };
  };

  const toNum = (val: unknown, fallback: number) => {
    const n = Number(val);
    return Number.isFinite(n) ? n : fallback;
  };

  const normalizeWeights = (weights: number[]) => {
    const total = weights.reduce((acc, v) => acc + (Number.isFinite(v) ? v : 0), 0);
    if (!total) return weights;
    return weights.map((v) => Math.round((v / total) * 100));
  };

  const weightsToHandles = (weights: number[]) => {
    const normalized = normalizeWeights(weights);
    const handles: number[] = [];
    let acc = 0;
    for (let i = 0; i < normalized.length - 1; i++) {
      acc += normalized[i];
      handles.push(Math.min(100, Math.max(0, acc)));
    }
    return handles;
  };

  const buildWeightsPayload = () => {
    const quality = handlesToQualityWeights(qualityHandles);
    const momentum = handlesToMomentumWeights(momentumHandles);
    const momShort = { w5: momentumShortHandles[0] ?? 60, w10: 100 - (momentumShortHandles[0] ?? 60) };
    const risk = { wbeta: riskHandles[0], wde: riskHandles[1] - riskHandles[0], waz: 100 - riskHandles[1] };
    const valuation = { wpe: valuationHandles[0], wpb: valuationHandles[1] - valuationHandles[0], wdcf: 100 - valuationHandles[1] };
    const total = {
      wmom: totalHandles[0],
      wqual: totalHandles[1] - totalHandles[0],
      wval: totalHandles[2] - totalHandles[1],
      wrisk: 100 - totalHandles[2],
    };
    const marketRisk = handlesToMarketRiskWeights(marketRiskHandles);
    const growth = handlesToGrowthWeights(growthHandles);
    return {
      wt_quality_roe: quality.wroe,
      wt_quality_roa: quality.wroa,
      wt_quality_op_margin: quality.wopm,
      wt_quality_piotroski: quality.wpiot,
      wt_raw_mom_20d: momentum.w20,
      wt_raw_mom_60d: momentum.w60,
      wt_raw_mom_120d: momentum.w120,
      wt_raw_short_5d: momShort.w5,
      wt_raw_short_10d: momShort.w10,
      wt_risk_beta: risk.wbeta,
      wt_risk_debt_equity: risk.wde,
      wt_risk_altman: risk.waz,
      wt_val_pe: valuation.wpe,
      wt_val_pb: valuation.wpb,
      wt_val_dcf: valuation.wdcf,
      wt_daily_momentum: total.wmom,
      wt_daily_quality: total.wqual,
      wt_daily_valuation: total.wval,
      wt_daily_risk: total.wrisk,
      wt_mr_vol_safe: marketRisk.wvol,
      wt_mr_dd_safe: marketRisk.wdd,
      wt_mr_gap_safe: marketRisk.wgap,
      wt_mr_trend_safe: marketRisk.wtrend,
      wt_growth_momentum: growth.wmom,
      wt_growth_volume: growth.wvol,
      wt_growth_risk: growth.wrisk,
      wt_growth_market: growth.wmarket,
    };
  };

  const orderFieldToLabel: Record<string, string> = {
    growth_probability: "Growth probability",
    growthProbability: "Growth probability",
    momentum_score: "Momentum score",
    momentum_score_short: "Momentum short score",
    risk_score: "Risk score",
    valuation_score: "Valuation score",
    quality_score: "Quality score",
    total_score: "Total score",
    market_risk_score: "Market risk score",
    market_score: "Market risk score",
  };

  const loadAllForPipe = useCallback(
    async (pipeId: number | null) => {
      if (!pipeId) return;
      const controller = new AbortController();
      try {
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

        // filtri
        let nextFilters = { ...SCORE_DEFAULTS };
        try {
          const filtersRes = await fetch(
            `${env.apiBaseUrl}/tickerscanner/fundamentals/user-filters/${encodeURIComponent(pipeId)}`,
            { headers, signal: controller.signal }
          );
          if (filtersRes.ok) {
            const payload = await filtersRes.json().catch(() => ({} as any));
            const arr = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
            const labelMap = { ...FILTER_LABEL_BY_KEY, ...SCORE_LABEL_BY_KEY };
            arr.forEach((row: any) => {
              const label = labelMap[row?.filter_name] || row?.filter_name;
              if (!label) return;
              nextFilters[label] = {
                enabled: row?.enabled === 1 || row?.enabled === true || row?.enabled === "1",
                value: Number(row?.value ?? row?.threshold ?? 70) || 0,
                comp: (row?.comparator || row?.comp || "GT").toUpperCase() === "LT" ? "LT" : "GT",
                inOrder:
                  row?.inOrder === true ||
                  row?.in_order === true ||
                  row?.inOrder === 1 ||
                  row?.in_order === 1,
              };
            });
          }
        } catch {
          /* ignore */
        }

        // ordine
        let orderedLabels: string[] = [];
        try {
          const orderRes = await fetch(
            `${env.apiBaseUrl}/tickerscanner/fundamentals/user-order/${encodeURIComponent(pipeId)}`,
            { headers, signal: controller.signal }
          );
          if (orderRes.ok) {
            const orderPayload = await orderRes.json().catch(() => ({} as any));
            const arr = Array.isArray(orderPayload?.data) ? orderPayload.data : Array.isArray(orderPayload) ? orderPayload : [];
            const ids: Record<string, number> = {};
            orderedLabels = arr
              .map((r: any) => {
                const label = orderFieldToLabel[r?.field || r?.order_field || r?.name];
                if (label) ids[label] = Number(r?.id);
                return label;
              })
              .filter(Boolean);
            setOrderIds(ids);
          }
        } catch {
          /* ignore */
        }

        // pesi (solo per trigger caricamento, non usati direttamente qui)
        try {
            const weightsRes = await fetch(
              `${env.apiBaseUrl}/tickerscanner/fundamentals/user/score-weights/${encodeURIComponent(pipeId)}`,
              { headers, signal: controller.signal }
            );
            if (weightsRes.ok) {
              const payload = await weightsRes.json().catch(() => ({} as any));
              const data = payload?.data && typeof payload.data === "object" ? payload.data : payload;
              if (data && typeof data === "object") {
                const qualityWeights = [
                  toNum(data.wt_quality_roe, 35),
                  toNum(data.wt_quality_roa, 25),
                  toNum(data.wt_quality_op_margin, 25),
                  toNum(data.wt_quality_piotroski, 15),
                ];
                setQualityHandles(weightsToHandles(qualityWeights));

                const momentumWeights = [
                  toNum(data.wt_raw_mom_20d, 50),
                  toNum(data.wt_raw_mom_60d, 30),
                  toNum(data.wt_raw_mom_120d, 20),
                ];
                setMomentumHandles(weightsToHandles(momentumWeights));

                const momShortWeights = [
                  toNum(data.wt_raw_short_5d, 60),
                  toNum(data.wt_raw_short_10d, 40),
                ];
                setMomentumShortHandles(weightsToHandles(momShortWeights));

                const riskWeights = [
                  toNum(data.wt_risk_beta, 40),
                  toNum(data.wt_risk_debt_equity, 35),
                  toNum(data.wt_risk_altman, 25),
                ];
                setRiskHandles(weightsToHandles(riskWeights));

                const valuationWeights = [
                  toNum(data.wt_val_pe, 40),
                  toNum(data.wt_val_pb, 30),
                  toNum(data.wt_val_dcf, 30),
                ];
                setValuationHandles(weightsToHandles(valuationWeights));

                const totalWeights = [
                  toNum(data.wt_daily_momentum, 35),
                  toNum(data.wt_daily_quality, 25),
                  toNum(data.wt_daily_valuation, 20),
                  toNum(data.wt_daily_risk, 20),
                ];
                setTotalHandles(weightsToHandles(totalWeights));

                const marketRiskWeights = [
                  toNum(data.wt_mr_vol_safe, 40),
                  toNum(data.wt_mr_dd_safe, 30),
                  toNum(data.wt_mr_gap_safe, 20),
                  toNum(data.wt_mr_trend_safe, 10),
                ];
                setMarketRiskHandles(weightsToHandles(marketRiskWeights));

                const growthWeights = [
                  toNum(data.wt_growth_momentum, 45),
                  toNum(data.wt_growth_volume, 25),
                  toNum(data.wt_growth_risk, 15),
                  toNum(data.wt_growth_market, 15),
                ];
                setGrowthHandles(weightsToHandles(growthWeights));
              }
            }
          } catch {
            /* ignore */
          }

        const allItems = [...SCORES, ...FILTERS.map((f) => f.label)];
        const orderSet = new Set(orderedLabels);
        nextFilters = Object.keys(nextFilters).reduce((acc, key) => {
          acc[key] = { ...nextFilters[key], inOrder: orderSet.has(key) };
          return acc;
        }, {} as typeof nextFilters);

        const finalPlaced =
          orderedLabels.length > 0
            ? [...orderedLabels, ...allItems.filter((x) => !orderedLabels.includes(x))]
            : allItems;
        setPlaced(finalPlaced);
        setGenericFilters(nextFilters);
      } catch {
        /* ignore error, lascio stato invariato */
      } finally {
        controller.abort();
      }
    },
    [token]
  );

  useEffect(() => {
    loadAllForPipe(selectedPipeId);
    return () => undefined;
  }, [selectedPipeId, loadAllForPipe]);

  const handleDiscard = async () => {
    setSaveMessage(null);
    await loadAllForPipe(selectedPipeId);
  };

  const handleSave = async () => {
    if (!selectedPipeId) return;
    setSaving(true);
    setSaveMessage(null);
    setError(null);
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      // filtri abilitati
      const enabledFilters = Object.entries(genericFilters)
        .filter(([, v]) => v?.enabled)
        .map(([label, v]) => {
          const key = LABEL_TO_FILTER_KEY[label] || label;
          return {
            filter_name: key,
            comparator: v.comp || "GT",
            value: v.value ?? 0,
            enabled: v.enabled ? 1 : 0,
            in_order: v.inOrder ? 1 : 0,
          };
        });

      await fetch(
        `${env.apiBaseUrl}/tickerscanner/fundamentals/user-filters/${encodeURIComponent(selectedPipeId)}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({ filters: enabledFilters }),
        }
      );

      // ordine
      const ordered = placed
        .filter((lbl) => genericFilters[lbl]?.inOrder)
        .map((lbl, idx) => ({
          id: orderIds[lbl],
          order_field: LABEL_TO_FILTER_KEY[lbl] || lbl,
          pipe_id: selectedPipeId,
          order_id: idx + 1,
          direction: "DESC",
        }));

      const idsToDelete = Object.entries(orderIds)
        .filter(([label, id]) => Number.isFinite(id) && !genericFilters[label]?.inOrder)
        .map(([, id]) => id as number);
      if (idsToDelete.length > 0) {
        await Promise.all(
          idsToDelete.map((id) =>
            fetch(
              `${env.apiBaseUrl}/tickerscanner/fundamentals/user-order/${encodeURIComponent(
                id
              )}?pipeId=${encodeURIComponent(selectedPipeId)}`,
              { method: "DELETE", headers }
            )
          )
        );
        setOrderIds((prev) => {
          const next = { ...prev };
          Object.entries(next).forEach(([label, id]) => {
            if (idsToDelete.includes(id)) delete next[label];
          });
          return next;
        });
      }

      await fetch(
        `${env.apiBaseUrl}/tickerscanner/fundamentals/user-order/pipe/${encodeURIComponent(selectedPipeId)}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({ orders: ordered }),
        }
      );

      // pesi
      const weightsPayload = buildWeightsPayload();
      await fetch(
        `${env.apiBaseUrl}/tickerscanner/fundamentals/user/score-weights/${encodeURIComponent(selectedPipeId)}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify(weightsPayload),
        }
      );

      setSaveMessage("Salvato correttamente");
    } catch (err: any) {
      setError(err?.message || "Errore nel salvataggio");
    } finally {
      setSaving(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    if (!dragScore) return;
    e.preventDefault();
    const score = e.dataTransfer.getData("text/plain");
    if (!score) return;
    setPlaced((prev) => (prev.includes(score) ? prev : [...prev, score]));
    setDragScore(null);
  };

  const onDragOver = (e: React.DragEvent) => {
    if (!dragScore) return;
    e.preventDefault();
  };

  const movePlaced = (fromScore: string, toScore: string) => {
    setPlaced((prev) => {
      const fromIdx = prev.indexOf(fromScore);
      const toIdx = prev.indexOf(toScore);
      if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return prev;
      const next = [...prev];
      next.splice(fromIdx, 1);
      next.splice(toIdx, 0, fromScore);
      return next;
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="space-y-3 md:col-span-1">
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 shadow-sm">
          <div className="text-xs font-semibold text-slate-900">Pipe</div>
          {pipesLoading && <div className="mt-2 text-[11px] text-slate-500">Caricamento...</div>}
          {error && <div className="mt-2 text-[11px] text-red-600">{error}</div>}
          <div className="mt-2 space-y-2">
            {pipes.map((p) => (
              <button
                key={p.id}
                className={`flex w-full items-center justify-between rounded-md border px-2 py-1 text-[12px] font-semibold transition ${
                  selectedPipeId === p.id
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                }`}
                onClick={() => setSelectedPipeId(p.id)}
              >
                <span>{p.name || `Pipe ${p.id}`}</span>
                {p.enabled === false && <span className="text-[10px] text-amber-600">disabled</span>}
              </button>
            ))}
            {!pipes.length && !pipesLoading && (
              <div className="text-[11px] text-slate-500">Nessuna pipe disponibile.</div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 shadow-sm">
          <div className="text-xs font-semibold text-slate-900">Scores</div>
          <div className="mt-2 space-y-1 text-[11px] text-slate-700">
            {SCORES.map((s) => (
            <div
              key={s}
              className="flex cursor-grab items-center gap-2 rounded px-1 py-0.5 hover:bg-slate-100"
              draggable
              onDragStart={onDragStart(s)}
              onDragEnd={() => setDragScore(null)}
            >
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              <span>{s}</span>
            </div>
          ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 shadow-sm">
          <div className="text-xs font-semibold text-slate-900">Filters</div>
          <div className="mt-2 space-y-1 text-[11px] text-slate-700">
            {FILTERS.map((f) => (
              <div
                key={f.key}
                className="flex cursor-grab items-center gap-2 rounded px-1 py-0.5 hover:bg-slate-100"
                draggable
                onDragStart={onDragStart(f.label)}
                onDragEnd={() => setDragScore(null)}
              >
                <span className="h-2 w-2 rounded-full bg-slate-300" />
                <span className="uppercase tracking-wide">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="md:col-span-3 rounded-lg border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-slate-700 shadow-sm"
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-sm font-semibold text-slate-900">Layout scores</div>
            <div className="text-[11px] text-slate-500">
              Trascina uno score dalla colonna di sinistra per creare una card.
            </div>
          </div>
          <div className="flex items-center gap-2">
            {saveMessage && <div className="rounded-md bg-emerald-100 px-2 py-1 text-[11px] text-emerald-700">{saveMessage}</div>}
            {error && <div className="rounded-md bg-rose-100 px-2 py-1 text-[11px] text-rose-700">{error}</div>}
            <button
              className="rounded-md border border-slate-300 px-3 py-1 text-[12px] font-semibold text-slate-700 hover:bg-slate-100"
              onClick={handleDiscard}
              disabled={saving}
            >
              Discard
            </button>
            <button
              className="rounded-md bg-slate-900 px-3 py-1 text-[12px] font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
        {placed.length === 0 && (
          <div className="mt-4 text-[11px] text-slate-500">Nessuno score selezionato.</div>
        )}
        {placed.length > 0 && (
          <div className="mt-4 space-y-3">
            {placed.map((s) => (
              <div
                key={s}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 shadow-sm"
                onDragOver={(e) => {
                  if (!dragScore) return;
                  e.preventDefault();
                  if (dragScore && dragScore !== s) movePlaced(dragScore, s);
                }}
                onDragEnd={() => setDragScore(null)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex w-8 flex-shrink-0 items-center justify-center text-slate-400">
                    <span
                      className="cursor-grab text-lg leading-none"
                      draggable
                      onDragStart={(e) => {
                        setDragScore(s);
                        e.dataTransfer.effectAllowed = "move";
                      }}
                    >
                      ≡
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <span>{FILTER_DESCRIPTIONS[s] ? `Filter: ${s}` : s}</span>
                        {(s === "ROE" ||
                          s === "ROA" ||
                          s === "Operating margin" ||
                          s === "Piotroski" ||
                          s === "Debt/Equity" ||
                          s === "Altman Z") && (
                          <button
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white text-[11px] text-slate-700 hover:bg-slate-100"
                            aria-label="Info"
                            onClick={() =>
                              s === "ROE"
                                ? setShowRoeInfo(true)
                                : s === "ROA"
                                ? setShowRoaInfo(true)
                                : s === "Operating margin"
                                ? setShowOpMarginInfo(true)
                                : s === "Piotroski"
                                ? setShowPiotInfo(true)
                                : s === "Debt/Equity"
                                ? setShowDebtInfo(true)
                                : setShowAltmanInfo(true)
                            }
                          >
                            i
                          </button>
                        )}
                      </div>
                      <button
                        className="text-slate-500 hover:text-red-600"
                        aria-label="Remove"
                        onClick={() => setPlaced((prev) => prev.filter((x) => x !== s))}
                      >
                        ×
                      </button>
                    </div>
                    <div className="mt-2 text-[11px] text-slate-600">
                      {SCORE_DESCRIPTIONS[s] || FILTER_DESCRIPTIONS[s] || "Card creata trascinando lo score."}
                    </div>

                    {FILTER_DESCRIPTIONS[s] && (
                      <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
                        <div className="grid gap-2 md:grid-cols-2">
                          <label className="flex items-center gap-2 text-[12px] font-semibold text-slate-900">
                            <input
                              type="checkbox"
                              checked={genericFilters[s]?.enabled ?? false}
                              onChange={(e) => updateGenericFilter(s, { enabled: e.target.checked })}
                            />
                            <span>Lista solo i tick con {s} sopra/sotto soglia</span>
                          </label>
                          <label className="flex items-center gap-2 text-[12px] font-semibold text-slate-900">
                            <input
                              type="checkbox"
                              checked={genericFilters[s]?.inOrder ?? false}
                              onChange={(e) => updateGenericFilter(s, { inOrder: e.target.checked as any })}
                            />
                            <span>Includi nell&apos;ordine di visualizzazione</span>
                          </label>
                        </div>

                        {genericFilters[s]?.enabled && (
                          <div className="mt-3 space-y-2 text-[12px] text-slate-800">
                            <div className="flex items-center justify-between text-[11px] text-slate-600">
                              <span>
                                Soglia {genericFilters[s]?.comp === "GT" ? "maggiore di" : "minore di"} {genericFilters[s]?.value ?? 0}%
                              </span>
                              <div className="flex items-center gap-2">
                                <label className="flex items-center gap-1">
                                  <input
                                    type="radio"
                                    checked={(genericFilters[s]?.comp ?? "GT") === "GT"}
                                    onChange={() => updateGenericFilter(s, { comp: "GT" })}
                                  />
                                  <span className="text-[11px] text-slate-700">soglia maggiore di</span>
                                </label>
                                <label className="flex items-center gap-1">
                                  <input
                                    type="radio"
                                    checked={(genericFilters[s]?.comp ?? "GT") === "LT"}
                                    onChange={() => updateGenericFilter(s, { comp: "LT" })}
                                  />
                                  <span className="text-[11px] text-slate-700">soglia minore di</span>
                                </label>
                              </div>
                            </div>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={genericFilters[s]?.value ?? 70}
                              onChange={(e) => updateGenericFilter(s, { value: Number(e.target.value) })}
                              className="w-full accent-slate-900"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    { s === "Quality score" && (
                      <div className="relative">
                        <ScoreFormulaCard
                          prefix="Qscore ="
                          infoIcon={{
                            onClick: () => setShowQualityInfo(true),
                            title: "Info quality",
                          }}
                          terms={[
                            { id: "roe", label: "Roe", color: qualityColors[0] },
                            { id: "roa", label: "Roa", color: qualityColors[1] },
                            { id: "opm", label: "Op_margin", color: qualityColors[2] },
                            { id: "piot", label: "Piot", color: qualityColors[3] },
                          ]}
                          handles={qualityHandles}
                          setHandles={setQualityHandles}
                          filterLabel="Lista solo i tick con Quality score sopra/sotto soglia"
                          filterEnabled={qualityFilterEnabled}
                          setFilterEnabled={setQualityFilterEnabled}
                          filterValue={qualityFilterValue}
                          setFilterValue={setQualityFilterValue}
                          filterComp={qualityFilterComp}
                          setFilterComp={setQualityFilterComp}
                          includeOrderEnabled={genericFilters[s]?.inOrder ?? false}
                          setIncludeOrderEnabled={(v) => updateGenericFilter(s, { inOrder: v })}
                        />
                      </div>
                    ) }

                    { s === "Momentum score" && (
                      <div className="relative">
                        <ScoreFormulaCard
                          prefix="raw_mom ="
                          infoIcon={{
                            onClick: () => setShowMomentumInfo(true),
                            title: "Info momentum",
                          }}
                          terms={[
                            { id: "20", label: "r20", color: momentumColors[0] },
                            { id: "60", label: "r60", color: momentumColors[1] },
                            { id: "120", label: "r120", color: momentumColors[2] },
                          ]}
                          handles={momentumHandles}
                          setHandles={setMomentumHandles}
                          filterLabel="Lista solo i tick con Momentum score sopra/sotto soglia"
                          filterEnabled={momentumFilterEnabled}
                          setFilterEnabled={setMomentumFilterEnabled}
                          filterValue={momentumFilterValue}
                          setFilterValue={setMomentumFilterValue}
                          filterComp={momentumFilterComp}
                          setFilterComp={setMomentumFilterComp}
                          includeOrderEnabled={genericFilters[s]?.inOrder ?? false}
                          setIncludeOrderEnabled={(v) => updateGenericFilter(s, { inOrder: v })}
                        />
                      </div>
                    ) }

                    { s === "Momentum short score" && (
                      <div className="relative">
                        <ScoreFormulaCard
                          prefix="mom_short ="
                          infoIcon={{
                            onClick: () => setShowMomentumShortInfo(true),
                            title: "Info momentum short",
                          }}
                          terms={[
                            { id: "5", label: "r5", color: "#0ea5e9" },
                            { id: "10", label: "r10", color: "#6366f1" },
                          ]}
                          handles={momentumShortHandles}
                          setHandles={setMomentumShortHandles}
                          filterLabel="Lista solo i tick con Momentum short sopra/sotto soglia"
                          filterEnabled={genericFilters["Momentum short score"]?.enabled ?? false}
                          setFilterEnabled={(v) => updateGenericFilter("Momentum short score", { enabled: v })}
                          filterValue={genericFilters["Momentum short score"]?.value ?? 70}
                          setFilterValue={(v) => updateGenericFilter("Momentum short score", { value: v })}
                          filterComp={genericFilters["Momentum short score"]?.comp ?? "GT"}
                          setFilterComp={(c) => updateGenericFilter("Momentum short score", { comp: c })}
                          includeOrderEnabled={genericFilters["Momentum short score"]?.inOrder ?? false}
                          setIncludeOrderEnabled={(v) => updateGenericFilter("Momentum short score", { inOrder: v })}
                        />
                      </div>
                    ) }

                    { s === "Risk score" && (
                      <div className="relative">
                        <ScoreFormulaCard
                          prefix="risk ="
                          infoIcon={{
                            onClick: () => setShowRiskInfo(true),
                            title: "Info risk",
                          }}
                          terms={[
                            { id: "beta", label: "beta_score", color: "#ef4444" },
                            { id: "de", label: "debt_equity_score", color: "#f97316" },
                            { id: "az", label: "altman_z_score", color: "#0ea5e9" },
                          ]}
                          handles={riskHandles}
                          setHandles={setRiskHandles}
                          filterLabel="Lista solo i tick con Risk score sopra/sotto soglia"
                          filterEnabled={genericFilters["Risk score"]?.enabled ?? false}
                          setFilterEnabled={(v) => updateGenericFilter("Risk score", { enabled: v })}
                          filterValue={genericFilters["Risk score"]?.value ?? 70}
                          setFilterValue={(v) => updateGenericFilter("Risk score", { value: v })}
                          filterComp={genericFilters["Risk score"]?.comp ?? "GT"}
                          setFilterComp={(c) => updateGenericFilter("Risk score", { comp: c })}
                          includeOrderEnabled={genericFilters["Risk score"]?.inOrder ?? false}
                          setIncludeOrderEnabled={(v) => updateGenericFilter("Risk score", { inOrder: v })}
                        />
                      </div>
                    ) }

                    { s === "Valuation score" && (
                      <div className="relative">
                        <ScoreFormulaCard
                          prefix="val ="
                          infoIcon={{
                            onClick: () => setShowValuationInfo(true),
                            title: "Info valuation",
                          }}
                          terms={[
                            { id: "pe", label: "pe_score", color: "#8b5cf6" },
                            { id: "pb", label: "pb_score", color: "#0ea5e9" },
                            { id: "dcf", label: "dcf_score", color: "#22c55e" },
                          ]}
                          handles={valuationHandles}
                          setHandles={setValuationHandles}
                          filterLabel="Lista solo i tick con Valuation score sopra/sotto soglia"
                          filterEnabled={genericFilters["Valuation score"]?.enabled ?? false}
                          setFilterEnabled={(v) => updateGenericFilter("Valuation score", { enabled: v })}
                          filterValue={genericFilters["Valuation score"]?.value ?? 70}
                          setFilterValue={(v) => updateGenericFilter("Valuation score", { value: v })}
                          filterComp={genericFilters["Valuation score"]?.comp ?? "GT"}
                          setFilterComp={(c) => updateGenericFilter("Valuation score", { comp: c })}
                          includeOrderEnabled={genericFilters["Valuation score"]?.inOrder ?? false}
                          setIncludeOrderEnabled={(v) => updateGenericFilter("Valuation score", { inOrder: v })}
                        />
                      </div>
                    ) }

                    { s === "Total score" && (
                      <div className="relative">
                        <ScoreFormulaCard
                          prefix="total ="
                          infoIcon={{
                            onClick: () => setShowTotalInfo(true),
                            title: "Info total",
                          }}
                          terms={[
                            { id: "mom", label: "momentum_score", color: "#6366f1" },
                            { id: "qual", label: "quality_score", color: "#22c55e" },
                            { id: "val", label: "valuation_score", color: "#8b5cf6" },
                            { id: "risk", label: "risk_score", color: "#ef4444" },
                          ]}
                          handles={totalHandles}
                          setHandles={setTotalHandles}
                          filterLabel="Lista solo i tick con Total score sopra/sotto soglia"
                          filterEnabled={genericFilters["Total score"]?.enabled ?? false}
                          setFilterEnabled={(v) => updateGenericFilter("Total score", { enabled: v })}
                          filterValue={genericFilters["Total score"]?.value ?? 70}
                          setFilterValue={(v) => updateGenericFilter("Total score", { value: v })}
                          filterComp={genericFilters["Total score"]?.comp ?? "GT"}
                          setFilterComp={(c) => updateGenericFilter("Total score", { comp: c })}
                          includeOrderEnabled={genericFilters["Total score"]?.inOrder ?? false}
                          setIncludeOrderEnabled={(v) => updateGenericFilter("Total score", { inOrder: v })}
                        />
                      </div>
                    ) }

                    { s === "Market risk score" && (
                      <div className="relative">
                        <ScoreFormulaCard
                          prefix="mrisk ="
                          infoIcon={{
                            onClick: () => setShowMarketInfo(true),
                            title: "Info market risk",
                          }}
                          terms={[
                            { id: "vol", label: "vol_safe", color: "#22c55e" },
                            { id: "dd", label: "dd_safe", color: "#f97316" },
                            { id: "gap", label: "gap_safe", color: "#6366f1" },
                            { id: "tr", label: "trend_safe", color: "#0ea5e9" },
                          ]}
                          handles={marketRiskHandles}
                          setHandles={setMarketRiskHandles}
                          filterLabel="Lista solo i tick con Market risk score sopra/sotto soglia"
                          filterEnabled={genericFilters["Market risk score"]?.enabled ?? false}
                          setFilterEnabled={(v) => updateGenericFilter("Market risk score", { enabled: v })}
                          filterValue={genericFilters["Market risk score"]?.value ?? 70}
                          setFilterValue={(v) => updateGenericFilter("Market risk score", { value: v })}
                          filterComp={genericFilters["Market risk score"]?.comp ?? "GT"}
                          setFilterComp={(c) => updateGenericFilter("Market risk score", { comp: c })}
                          includeOrderEnabled={genericFilters["Market risk score"]?.inOrder ?? false}
                          setIncludeOrderEnabled={(v) => updateGenericFilter("Market risk score", { inOrder: v })}
                        />
                      </div>
                    ) }

                    { s === "Growth probability" && (
                      <div className="relative">
                        <ScoreFormulaCard
                          prefix="growth ="
                          infoIcon={{
                            onClick: () => setShowGrowthInfo(true),
                            title: "Info growth probability",
                          }}
                          terms={[
                            { id: "mom", label: "momentum_score", color: "#6366f1" },
                            { id: "vol", label: "volume_score", color: "#22c55e" },
                            { id: "risk", label: "risk_score", color: "#ef4444" },
                            { id: "market", label: "market_score", color: "#0ea5e9" },
                          ]}
                          handles={growthHandles}
                          setHandles={setGrowthHandles}
                          filterLabel="Lista solo i tick con Growth probability sopra/sotto soglia"
                          filterEnabled={genericFilters["Growth probability"]?.enabled ?? false}
                          setFilterEnabled={(v) => updateGenericFilter("Growth probability", { enabled: v })}
                          filterValue={genericFilters["Growth probability"]?.value ?? 70}
                          setFilterValue={(v) => updateGenericFilter("Growth probability", { value: v })}
                          filterComp={genericFilters["Growth probability"]?.comp ?? "GT"}
                          setFilterComp={(c) => updateGenericFilter("Growth probability", { comp: c })}
                          includeOrderEnabled={genericFilters["Growth probability"]?.inOrder ?? false}
                          setIncludeOrderEnabled={(v) => updateGenericFilter("Growth probability", { inOrder: v })}
                        />
                      </div>
                    ) }

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <MomentumInfoModal open={showMomentumInfo} onClose={() => setShowMomentumInfo(false)} />
      <MomentumShortInfoModal open={showMomentumShortInfo} onClose={() => setShowMomentumShortInfo(false)} />
      <QualityInfoModal open={showQualityInfo} onClose={() => setShowQualityInfo(false)} />
      <RiskInfoModal open={showRiskInfo} onClose={() => setShowRiskInfo(false)} />
      <ValuationInfoModal open={showValuationInfo} onClose={() => setShowValuationInfo(false)} />
      <TotalInfoModal open={showTotalInfo} onClose={() => setShowTotalInfo(false)} />
      <MarketInfoModal open={showMarketInfo} onClose={() => setShowMarketInfo(false)} />
      <GrowthInfoModal open={showGrowthInfo} onClose={() => setShowGrowthInfo(false)} />
      <RoeInfoModal open={showRoeInfo} onClose={() => setShowRoeInfo(false)} />
      <RoaInfoModal open={showRoaInfo} onClose={() => setShowRoaInfo(false)} />
      <OpMarginInfoModal open={showOpMarginInfo} onClose={() => setShowOpMarginInfo(false)} />
      <PiotInfoModal open={showPiotInfo} onClose={() => setShowPiotInfo(false)} />
      <DebtInfoModal open={showDebtInfo} onClose={() => setShowDebtInfo(false)} />
      <AltmanInfoModal open={showAltmanInfo} onClose={() => setShowAltmanInfo(false)} />
    </div>
  );
}

function MomentumInfoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="max-h-[80vh] w-full max-w-4xl overflow-auto rounded-lg bg-white p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-slate-900">Momentum Score (daily)</div>
          <button
            className="rounded p-1 text-slate-500 hover:bg-slate-100"
            aria-label="Chiudi"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <MomentumInfoContent />
      </div>
    </div>
  );
}

function MomentumShortInfoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="max-h-[80vh] w-full max-w-4xl overflow-auto rounded-lg bg-white p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-slate-900">Momentum Short Score (daily)</div>
          <button
            className="rounded p-1 text-slate-500 hover:bg-slate-100"
            aria-label="Chiudi"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <MomentumShortInfoContent />
      </div>
    </div>
  );
}

function QualityInfoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="max-h-[80vh] w-full max-w-4xl overflow-auto rounded-lg bg-white p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-slate-900">Quality Score (daily)</div>
          <button
            className="rounded p-1 text-slate-500 hover:bg-slate-100"
            aria-label="Chiudi"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <QualityInfoContent />
      </div>
    </div>
  );
}

function RiskInfoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="max-h-[80vh] w-full max-w-4xl overflow-auto rounded-lg bg-white p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-slate-900">Risk Score (daily)</div>
          <button
            className="rounded p-1 text-slate-500 hover:bg-slate-100"
            aria-label="Chiudi"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <RiskInfoContent />
      </div>
    </div>
  );
}

function ValuationInfoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="max-h-[80vh] w-full max-w-4xl overflow-auto rounded-lg bg-white p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-slate-900">Valuation Score</div>
          <button
            className="rounded p-1 text-slate-500 hover:bg-slate-100"
            aria-label="Chiudi"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <ValuationInfoContent />
      </div>
    </div>
  );
}

function TotalInfoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="max-h-[80vh] w-full max-w-4xl overflow-auto rounded-lg bg-white p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-slate-900">Total Score</div>
          <button
            className="rounded p-1 text-slate-500 hover:bg-slate-100"
            aria-label="Chiudi"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <TotalInfoContent />
      </div>
    </div>
  );
}

function MarketInfoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="max-h-[80vh] w-full max-w-4xl overflow-auto rounded-lg bg-white p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-slate-900">Market Risk Score</div>
          <button
            className="rounded p-1 text-slate-500 hover:bg-slate-100"
            aria-label="Chiudi"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <MarketRiskInfoContent />
      </div>
    </div>
  );
}

function RoeInfoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="max-h-[80vh] w-full max-w-4xl overflow-auto rounded-lg bg-white p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-slate-900">ROE</div>
          <button
            className="rounded p-1 text-slate-500 hover:bg-slate-100"
            aria-label="Chiudi"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <RoeInfoContent />
      </div>
    </div>
  );
}

function RoaInfoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="max-h-[80vh] w-full max-w-4xl overflow-auto rounded-lg bg-white p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-slate-900">ROA</div>
          <button
            className="rounded p-1 text-slate-500 hover:bg-slate-100"
            aria-label="Chiudi"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <RoaInfoContent />
      </div>
    </div>
  );
}

function OpMarginInfoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="max-h-[80vh] w-full max-w-4xl overflow-auto rounded-lg bg-white p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-slate-900">Operating Margin</div>
          <button
            className="rounded p-1 text-slate-500 hover:bg-slate-100"
            aria-label="Chiudi"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <OpMarginInfoContent />
      </div>
    </div>
  );
}

function PiotInfoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="max-h-[80vh] w-full max-w-4xl overflow-auto rounded-lg bg-white p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-slate-900">Piotroski F-Score</div>
          <button
            className="rounded p-1 text-slate-500 hover:bg-slate-100"
            aria-label="Chiudi"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <PiotroskiInfoContent />
      </div>
    </div>
  );
}

function DebtInfoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="max-h-[80vh] w-full max-w-4xl overflow-auto rounded-lg bg-white p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-slate-900">Debt / Equity</div>
          <button
            className="rounded p-1 text-slate-500 hover:bg-slate-100"
            aria-label="Chiudi"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <DebtEquityInfoContent />
      </div>
    </div>
  );
}

function AltmanInfoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="max-h-[80vh] w-full max-w-4xl overflow-auto rounded-lg bg-white p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-slate-900">Altman Z-Score</div>
          <button
            className="rounded p-1 text-slate-500 hover:bg-slate-100"
            aria-label="Chiudi"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <AltmanInfoContent />
      </div>
    </div>
  );
}

function GrowthInfoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="max-h-[80vh] w-full max-w-4xl overflow-auto rounded-lg bg-white p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-slate-900">Growth Probability</div>
          <button
            className="rounded p-1 text-slate-500 hover:bg-slate-100"
            aria-label="Chiudi"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <GrowthInfoContent />
      </div>
    </div>
  );
}
