import { useEffect, useMemo, useState } from "react";
import SectionHeader from "../molecules/content/SectionHeader";
import { env } from "../../config/env";
import "rc-slider/assets/index.css";
import Slider from "rc-slider";

type WeightKey = string;
type WeightRecord = Record<WeightKey, number | null>;

const friendlyLabel = (key: string) =>
  key
    .replace(/^wt_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

type Tab = "general" | "weights";

const growthKeys: WeightKey[] = [
  "wt_growth_momentum",
  "wt_growth_volume",
  "wt_growth_risk",
  "wt_growth_market",
];

const DEFAULT_GROWTH_WEIGHTS = {
  wt_growth_momentum: 45,
  wt_growth_volume: 25,
  wt_growth_risk: 15,
  wt_growth_market: 15,
};

const shortKeys: WeightKey[] = ["wt_short_struct", "wt_short_market"];

const DEFAULT_SHORT_WEIGHTS = {
  wt_short_struct: 60,
  wt_short_market: 40,
};

const marketKeys: WeightKey[] = ["wt_ms_trend", "wt_ms_regime", "wt_ms_corr_penalty_max"];

const DEFAULT_MARKET_WEIGHTS = {
  wt_ms_trend: 55,
  wt_ms_regime: 35,
  wt_ms_corr_penalty_max: 20,
};

const marketRiskKeys: WeightKey[] = ["wt_mr_vol_safe", "wt_mr_dd_safe", "wt_mr_gap_safe", "wt_mr_trend_safe"];

const DEFAULT_MARKET_RISK_WEIGHTS = {
  wt_mr_vol_safe: 40,
  wt_mr_dd_safe: 30,
  wt_mr_gap_safe: 20,
  wt_mr_trend_safe: 10,
};

const volumeKeys: WeightKey[] = ["wt_vol_spike", "wt_vol_directional", "wt_vol_efficiency", "wt_vol_range"];

const DEFAULT_VOLUME_WEIGHTS = {
  wt_vol_spike: 40,
  wt_vol_directional: 30,
  wt_vol_efficiency: 20,
  wt_vol_range: 10,
};

const momentumShortKeys: WeightKey[] = [
  "wt_mom_short_ret",
  "wt_mom_short_trend",
  "wt_mom_short_structure",
  "wt_mom_short_rsi",
];

const DEFAULT_MOMENTUM_SHORT_WEIGHTS = {
  wt_mom_short_ret: 35,
  wt_mom_short_trend: 30,
  wt_mom_short_structure: 20,
  wt_mom_short_rsi: 15,
};

const momentumLongKeys: WeightKey[] = ["wt_mom_12m", "wt_mom_6m", "wt_mom_3m", "wt_mom_1m", "wt_mom_trend"];

const DEFAULT_MOMENTUM_LONG_WEIGHTS = {
  wt_mom_12m: 40,
  wt_mom_6m: 25,
  wt_mom_3m: 20,
  wt_mom_1m: 5,
  wt_mom_trend: 10,
};

const doubleTopKeys: WeightKey[] = [
  "wt_doubletop_distance",
  "wt_doubletop_ma_structure",
  "wt_doubletop_long_pressure",
];

const DEFAULT_DOUBLE_TOP_WEIGHTS = {
  wt_doubletop_distance: 45,
  wt_doubletop_ma_structure: 35,
  wt_doubletop_long_pressure: 20,
};

const ALL_DEFAULTS: WeightRecord = {
  ...DEFAULT_GROWTH_WEIGHTS,
  ...DEFAULT_SHORT_WEIGHTS,
  ...DEFAULT_MARKET_WEIGHTS,
  ...DEFAULT_MARKET_RISK_WEIGHTS,
  ...DEFAULT_VOLUME_WEIGHTS,
  ...DEFAULT_MOMENTUM_SHORT_WEIGHTS,
  ...DEFAULT_MOMENTUM_LONG_WEIGHTS,
  ...DEFAULT_DOUBLE_TOP_WEIGHTS,
};

const normalizeWeights = (data: any): WeightRecord => {
  const out: WeightRecord = { ...ALL_DEFAULTS };
  const knownKeys = [
    ...growthKeys,
    ...shortKeys,
    ...marketKeys,
    ...marketRiskKeys,
    ...volumeKeys,
    ...momentumShortKeys,
    ...momentumLongKeys,
    ...doubleTopKeys,
  ];
  if (data && typeof data === "object") {
    knownKeys.forEach((k) => {
      const raw = (data as any)[k];
      const v = Number(raw);
      if (Number.isFinite(v)) {
        const normalized = v <= 1 ? v * 100 : v;
        out[k] = normalized;
      }
    });
  }
  return out;
};

export default function UserSettingsPage() {
  const [weights, setWeights] = useState<WeightRecord>({ ...ALL_DEFAULTS });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("general");
  const [userId, setUserId] = useState<number | null>(null);

  const token = useMemo(
    () => (typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null),
    []
  );

  const fetchWeights = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${env.apiBaseUrl}/auth/admin/me`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const me = await res.json();
      const userId = me?.user?.id ?? me?.id ?? me?.tokenPayload?.sub;
      const data = me?.scoreWeights;
      if (!userId) throw new Error("Utente non valido");
      setUserId(Number(userId));
      setWeights(normalizeWeights(data));
    } catch (err: any) {
      setError(err?.message || "Errore durante il caricamento");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeights();
  }, []);

  const handleSave = async (nextWeights?: WeightRecord) => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      let uid = userId;
      if (!uid) {
        const resMe = await fetch(`${env.apiBaseUrl}/auth/admin/me`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (!resMe.ok) throw new Error(`HTTP ${resMe.status}`);
        const me = await resMe.json();
        uid = Number(me?.user?.id ?? me?.id ?? me?.tokenPayload?.sub);
        if (!uid) throw new Error("Utente non valido");
        setUserId(uid);
      }

      const payload = nextWeights || weights;

      const res = await fetch(`${env.apiBaseUrl}/auth/admin/user/${uid}/score-weights`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (nextWeights) setWeights(nextWeights);
      setSuccess("Pesi aggiornati con successo");
    } catch (err: any) {
      setError(err?.message || "Errore durante il salvataggio");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <SectionHeader title="User Settings" subTitle="Configura le preferenze personali" />

      <div className="flex gap-2">
        {[
          { id: "general" as const, label: "General" },
          { id: "weights" as const, label: "Pesi scores" },
        ].map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                active
                  ? "border-slate-800 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {tab === "general" && (
        <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm text-sm text-slate-700">
          Nessuna impostazione generale disponibile al momento.
        </div>
      )}

      {tab === "weights" && (
        <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">Pesi scores</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                onClick={() => setWeights({ ...DEFAULT_GROWTH_WEIGHTS })}
                disabled={loading || saving}
              >
                Set default
              </button>
              <button
                type="button"
                className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                onClick={() => fetchWeights()}
                disabled={loading}
              >
                Reload
              </button>
              <button
                type="button"
                className="rounded-md bg-slate-900 px-3 py-1 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                onClick={() => handleSave()}
                disabled={saving}
              >
                {saving ? "Salvataggio..." : "Save"}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-3 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              {success}
            </div>
          )}

          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
            <div className="border-b border-slate-200 bg-slate-50 px-3 py-2">
              <div className="text-sm font-semibold text-slate-800">Growth Probability</div>
              <p className="mt-1 text-xs text-slate-600">
                Stima la probabilità che il titolo cresca nel breve periodo. Formula: GM * wt(GM) + GV * wt(GV) + GR * wt(GR) + GMR * wt(GMR), dove i pesi (GM, GV, GR, GMR) devono sommare 100.
              </p>
            </div>
            <div className="space-y-4 p-4">
              {(() => {
                const w1 = Number(weights.wt_growth_momentum) || 0;
                const w2 = Number(weights.wt_growth_volume) || 0;
                const w3 = Number(weights.wt_growth_risk) || 0;
                const hasValues = w1 + w2 + w3 > 0;
                const baseW1 = hasValues ? w1 : DEFAULT_GROWTH_WEIGHTS.wt_growth_momentum;
                const baseW2 = hasValues ? w2 : DEFAULT_GROWTH_WEIGHTS.wt_growth_volume;
                const baseW3 = hasValues ? w3 : DEFAULT_GROWTH_WEIGHTS.wt_growth_risk;
                const cuts = [
                  Math.min(100, Math.max(0, baseW1)),
                  Math.min(100, Math.max(0, baseW1 + baseW2)),
                  Math.min(100, Math.max(0, baseW1 + baseW2 + baseW3)),
                ];
                const handleCutsChange = (vals: number | number[]) => {
                  if (!Array.isArray(vals) || vals.length !== 3) return;
                  const [c1, c2, c3] = vals.map((v) => Math.min(100, Math.max(0, v)));
                  const newW1 = c1;
                  const newW2 = Math.max(0, c2 - c1);
                  const newW3 = Math.max(0, c3 - c2);
                  const newW4 = Math.max(0, 100 - c3);
                  const updated: WeightRecord = {
                    ...weights,
                    wt_growth_momentum: newW1,
                    wt_growth_volume: newW2,
                    wt_growth_risk: newW3,
                    wt_growth_market: newW4,
                  };
                  setWeights(updated);
                };
                return (
                  <div className="space-y-2 rounded-md border border-slate-200 bg-white/80 px-3 py-3 shadow-inner">
                    <Slider
                      range
                      min={0}
                      max={100}
                      step={1}
                      allowCross={false}
                      pushable={1}
                      value={cuts}
                      onChange={handleCutsChange}
                      trackStyle={[{ backgroundColor: "#0ea5e9" }]}
                      handleStyle={[
                        { borderColor: "#0ea5e9", backgroundColor: "#0ea5e9" },
                        { borderColor: "#10b981", backgroundColor: "#10b981" },
                        { borderColor: "#f59e0b", backgroundColor: "#f59e0b" },
                      ]}
                    />
                    <div className="flex h-2 overflow-hidden rounded bg-slate-100">
                      <div className="h-full bg-blue-500/70" style={{ width: `${Math.max(0, w1)}%` }} />
                      <div className="h-full bg-emerald-500/70" style={{ width: `${Math.max(0, w2)}%` }} />
                      <div className="h-full bg-amber-500/70" style={{ width: `${Math.max(0, w3)}%` }} />
                      <div
                        className="h-full bg-rose-500/70"
                        style={{ width: `${Math.max(0, 100 - (w1 + w2 + w3))}%` }}
                      />
                    </div>
                  </div>
                );
              })()}

              <div className="grid grid-cols-2 gap-3 text-sm">
                {growthKeys.map((key) => (
                  <div key={key} className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex h-3 w-3 rounded-full ${
                            key === "wt_growth_momentum"
                              ? "bg-blue-500"
                              : key === "wt_growth_volume"
                              ? "bg-emerald-500"
                              : key === "wt_growth_risk"
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                        />
                        <span className="font-semibold text-slate-800">
                          {friendlyLabel(key)}{" "}
                          <span className="text-xs font-normal text-slate-500">
                            (
                            {key === "wt_growth_momentum"
                              ? "GM"
                              : key === "wt_growth_volume"
                              ? "GV"
                              : key === "wt_growth_risk"
                              ? "GR"
                              : "GMR"}
                            )
                          </span>
                        </span>
                      </div>
                      <span className="text-xs text-slate-600">{Number(weights[key] ?? 0).toFixed(2)}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-b border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-sm font-semibold text-slate-800">Market score</div>
                <p className="mt-1 text-xs text-slate-600">
                  Pesa trend di mercato, regime risk-on/off e penalità per alta correlazione in mercato debole.
                </p>
              </div>
              <div className="space-y-3 rounded-md border border-slate-200 bg-white/80 px-3 py-3 shadow-inner">
                {(() => {
                  const t = Number(weights.wt_ms_trend) || 0;
                  const r = Number(weights.wt_ms_regime) || 0;
                  const p = Number(weights.wt_ms_corr_penalty_max) || 0;
                  const cuts = [
                    Math.min(100, Math.max(0, t)),
                    Math.min(100, Math.max(0, t + r)),
                    Math.min(100, Math.max(0, Math.min(100, t + r + p))),
                  ];
                  const handleMarketChange = (vals: number | number[]) => {
                    if (!Array.isArray(vals) || vals.length !== 3) return;
                    const [c1, c2, c3] = vals.map((v) => Math.min(100, Math.max(0, v)));
                    const newT = c1;
                    const newR = Math.max(0, c2 - c1);
                    const newP = Math.max(0, c3 - c2);
                    setWeights((prev) => ({
                      ...prev,
                      wt_ms_trend: newT,
                      wt_ms_regime: newR,
                      wt_ms_corr_penalty_max: newP,
                    }));
                  };
                  return (
                    <>
                      <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                        <span>Pesi trend (T) / regime (R) / penalità corr. (Pen)</span>
                        <span className="text-xs text-slate-600">
                          T {t.toFixed(1)}% · R {r.toFixed(1)}% · Pen {p.toFixed(1)}%
                        </span>
                      </div>
                      <Slider
                        range
                        min={0}
                        max={100}
                        step={1}
                        allowCross={false}
                        pushable={1}
                        value={cuts}
                        onChange={handleMarketChange}
                        trackStyle={[{ backgroundColor: "#0ea5e9" }]}
                        handleStyle={[
                          { borderColor: "#0ea5e9", backgroundColor: "#0ea5e9" },
                          { borderColor: "#10b981", backgroundColor: "#10b981" },
                          { borderColor: "#f59e0b", backgroundColor: "#f59e0b" },
                        ]}
                      />
                      <div className="flex h-2 overflow-hidden rounded bg-slate-100">
                        <div className="h-full bg-blue-500/70" style={{ width: `${Math.max(0, t)}%` }} />
                        <div className="h-full bg-emerald-500/70" style={{ width: `${Math.max(0, r)}%` }} />
                        <div className="h-full bg-amber-500/70" style={{ width: `${Math.max(0, p)}%` }} />
                        <div
                          className="h-full bg-slate-300/70"
                          style={{ width: `${Math.max(0, 100 - (t + r + p))}%` }}
                        />
                      </div>
                    </>
                  );
                })()}
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-3 w-3 rounded-full bg-blue-500" />
                        <span className="font-semibold text-slate-800">Trend (T)</span>
                      </div>
                      <span className="text-xs text-slate-600">{Number(weights.wt_ms_trend ?? 0).toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                        <span className="font-semibold text-slate-800">Regime (R)</span>
                      </div>
                      <span className="text-xs text-slate-600">{Number(weights.wt_ms_regime ?? 0).toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-3 w-3 rounded-full bg-amber-500" />
                        <span className="font-semibold text-slate-800">Penalità corr. (Pen)</span>
                      </div>
                      <span className="text-xs text-slate-600">
                        {Number(weights.wt_ms_corr_penalty_max ?? 0).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-sm font-semibold text-slate-800">ShortRisk combinato</div>
                <p className="mt-1 text-xs text-slate-600">
                  Pesa rischio strutturale (SR) e rischio di mercato (MR) nel punteggio short risk combinato.
                </p>
              </div>
              <div className="space-y-3 rounded-md border border-slate-200 bg-white/80 px-3 py-3 shadow-inner">
                {(() => {
                  const rawStruct = Number(weights.wt_short_struct) || 0;
                  const rawMarket = Number(weights.wt_short_market) || 0;
                  const hasShort = rawStruct + rawMarket > 0;
                  const structWeight = hasShort ? rawStruct : DEFAULT_SHORT_WEIGHTS.wt_short_struct;
                  const marketWeight = hasShort ? rawMarket : DEFAULT_SHORT_WEIGHTS.wt_short_market;
                  const handleShortChange = (val: number | number[]) => {
                    const v = Array.isArray(val) ? val[0] : val;
                    const clamped = Math.min(100, Math.max(0, Number(v) || 0));
                    setWeights((prev) => ({
                      ...prev,
                      wt_short_struct: clamped,
                      wt_short_market: Math.max(0, 100 - clamped),
                    }));
                  };
                  return (
                    <>
                      <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                        <span>Peso rischio strutturale (SR) / mercato (MR)</span>
                        <span className="text-xs text-slate-600">
                          SR {structWeight.toFixed(1)}% · MR {marketWeight.toFixed(1)}%
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={structWeight}
                        onChange={handleShortChange}
                        trackStyle={[{ backgroundColor: "#0ea5e9" }]}
                        handleStyle={[{ borderColor: "#0ea5e9", backgroundColor: "#0ea5e9" }]}
                      />
                      <div className="flex h-2 overflow-hidden rounded bg-slate-100">
                        <div className="h-full bg-blue-500/70" style={{ width: `${structWeight}%` }} />
                        <div className="h-full bg-rose-500/70" style={{ width: `${marketWeight}%` }} />
                      </div>
                    </>
                  );
                })()}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-3 w-3 rounded-full bg-blue-500" />
                        <span className="font-semibold text-slate-800">Peso rischio strutturale (SR)</span>
                      </div>
                      <span className="text-xs text-slate-600">{Number(weights.wt_short_struct ?? 0).toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-3 w-3 rounded-full bg-rose-500" />
                        <span className="font-semibold text-slate-800">Peso rischio di mercato (MR)</span>
                      </div>
                      <span className="text-xs text-slate-600">{Number(weights.wt_short_market ?? 0).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-sm font-semibold text-slate-800">Market risk score</div>
                <p className="mt-1 text-xs text-slate-600">
                  Pesa volatilit&agrave; (volSafe), drawdown (ddSafe), gap (gapSafe) e trendSafe nel rischio di mercato.
                </p>
              </div>
              <div className="space-y-3 rounded-md border border-slate-200 bg-white/80 px-3 py-3 shadow-inner">
                {(() => {
                  const vRaw = Number(weights.wt_mr_vol_safe) || 0;
                  const ddRaw = Number(weights.wt_mr_dd_safe) || 0;
                  const gapRaw = Number(weights.wt_mr_gap_safe) || 0;
                  const trendRaw = Number(weights.wt_mr_trend_safe) || 0;
                  const hasMr = vRaw + ddRaw + gapRaw + trendRaw > 0;
                  const v = hasMr ? vRaw : DEFAULT_MARKET_RISK_WEIGHTS.wt_mr_vol_safe;
                  const dd = hasMr ? ddRaw : DEFAULT_MARKET_RISK_WEIGHTS.wt_mr_dd_safe;
                  const gap = hasMr ? gapRaw : DEFAULT_MARKET_RISK_WEIGHTS.wt_mr_gap_safe;
                  const trend = hasMr ? trendRaw : DEFAULT_MARKET_RISK_WEIGHTS.wt_mr_trend_safe;
                  const cuts = [
                    Math.min(100, Math.max(0, v)),
                    Math.min(100, Math.max(0, v + dd)),
                    Math.min(100, Math.max(0, v + dd + gap)),
                    Math.min(100, Math.max(0, Math.min(100, v + dd + gap + trend))),
                  ];
                  const handleMrChange = (vals: number | number[]) => {
                    if (!Array.isArray(vals) || vals.length !== 4) return;
                    const [c1, c2, c3, c4] = vals.map((v) => Math.min(100, Math.max(0, v)));
                    const newV = c1;
                    const newDd = Math.max(0, c2 - c1);
                    const newGap = Math.max(0, c3 - c2);
                    const newTrend = Math.max(0, c4 - c3);
                    setWeights((prev) => ({
                      ...prev,
                      wt_mr_vol_safe: newV,
                      wt_mr_dd_safe: newDd,
                      wt_mr_gap_safe: newGap,
                      wt_mr_trend_safe: newTrend,
                    }));
                  };
                  return (
                    <>
                      <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                        <span>Pesi volSafe / ddSafe / gapSafe / trendSafe</span>
                        <span className="text-xs text-slate-600">
                          V {v.toFixed(1)}% · DD {dd.toFixed(1)}% · GAP {gap.toFixed(1)}% · TR {trend.toFixed(1)}%
                        </span>
                      </div>
                      <Slider
                        range
                        min={0}
                        max={100}
                        step={1}
                        allowCross={false}
                        pushable={1}
                        value={cuts}
                        onChange={handleMrChange}
                        trackStyle={[{ backgroundColor: "#0ea5e9" }]}
                        handleStyle={[
                          { borderColor: "#0ea5e9", backgroundColor: "#0ea5e9" },
                          { borderColor: "#10b981", backgroundColor: "#10b981" },
                          { borderColor: "#f59e0b", backgroundColor: "#f59e0b" },
                          { borderColor: "#6366f1", backgroundColor: "#6366f1" },
                        ]}
                      />
                      <div className="flex h-2 overflow-hidden rounded bg-slate-100">
                        <div className="h-full bg-blue-500/70" style={{ width: `${Math.max(0, v)}%` }} />
                        <div className="h-full bg-emerald-500/70" style={{ width: `${Math.max(0, dd)}%` }} />
                        <div className="h-full bg-amber-500/70" style={{ width: `${Math.max(0, gap)}%` }} />
                        <div className="h-full bg-indigo-500/70" style={{ width: `${Math.max(0, trend)}%` }} />
                        <div
                          className="h-full bg-slate-300/70"
                          style={{ width: `${Math.max(0, 100 - (v + dd + gap + trend))}%` }}
                        />
                      </div>
                    </>
                  );
                })()}
                <div className="grid grid-cols-4 gap-3 text-sm">
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-3 w-3 rounded-full bg-blue-500" />
                        <span className="font-semibold text-slate-800">volSafe (V)</span>
                      </div>
                      <span className="text-xs text-slate-600">{Number(weights.wt_mr_vol_safe ?? 0).toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                        <span className="font-semibold text-slate-800">ddSafe (DD)</span>
                      </div>
                      <span className="text-xs text-slate-600">{Number(weights.wt_mr_dd_safe ?? 0).toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-3 w-3 rounded-full bg-amber-500" />
                        <span className="font-semibold text-slate-800">gapSafe (GAP)</span>
                      </div>
                      <span className="text-xs text-slate-600">{Number(weights.wt_mr_gap_safe ?? 0).toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-3 w-3 rounded-full bg-indigo-500" />
                        <span className="font-semibold text-slate-800">trendSafe (TR)</span>
                      </div>
                      <span className="text-xs text-slate-600">{Number(weights.wt_mr_trend_safe ?? 0).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-sm font-semibold text-slate-800">Volume score</div>
                <p className="mt-1 text-xs text-slate-600">
                  Pesa spike di volume, direzionalit&agrave;, efficienza e range nel punteggio volume.
                </p>
              </div>
              <div className="space-y-3 rounded-md border border-slate-200 bg-white/80 px-3 py-3 shadow-inner">
                {(() => {
                  const sRaw = Number(weights.wt_vol_spike) || 0;
                  const dRaw = Number(weights.wt_vol_directional) || 0;
                  const eRaw = Number(weights.wt_vol_efficiency) || 0;
                  const rRaw = Number(weights.wt_vol_range) || 0;
                  const hasVol = sRaw + dRaw + eRaw + rRaw > 0;
                  const s = hasVol ? sRaw : DEFAULT_VOLUME_WEIGHTS.wt_vol_spike;
                  const d = hasVol ? dRaw : DEFAULT_VOLUME_WEIGHTS.wt_vol_directional;
                  const e = hasVol ? eRaw : DEFAULT_VOLUME_WEIGHTS.wt_vol_efficiency;
                  const r = hasVol ? rRaw : DEFAULT_VOLUME_WEIGHTS.wt_vol_range;
                  const cuts = [
                    Math.min(100, Math.max(0, s)),
                    Math.min(100, Math.max(0, s + d)),
                    Math.min(100, Math.max(0, s + d + e)),
                    Math.min(100, Math.max(0, Math.min(100, s + d + e + r))),
                  ];
                  const handleVolChange = (vals: number | number[]) => {
                    if (!Array.isArray(vals) || vals.length !== 4) return;
                    const [c1, c2, c3, c4] = vals.map((v) => Math.min(100, Math.max(0, v)));
                    const newS = c1;
                    const newD = Math.max(0, c2 - c1);
                    const newE = Math.max(0, c3 - c2);
                    const newR = Math.max(0, c4 - c3);
                    setWeights((prev) => ({
                      ...prev,
                      wt_vol_spike: newS,
                      wt_vol_directional: newD,
                      wt_vol_efficiency: newE,
                      wt_vol_range: newR,
                    }));
                  };
                  return (
                    <>
                      <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                        <span>Pesi spike (S) / directional (D) / efficiency (E) / range (R)</span>
                        <span className="text-xs text-slate-600">
                          S {s.toFixed(1)}% · D {d.toFixed(1)}% · E {e.toFixed(1)}% · R {r.toFixed(1)}%
                        </span>
                      </div>
                      <Slider
                        range
                        min={0}
                        max={100}
                        step={1}
                        allowCross={false}
                        pushable={1}
                        value={cuts}
                        onChange={handleVolChange}
                        trackStyle={[{ backgroundColor: "#0ea5e9" }]}
                        handleStyle={[
                          { borderColor: "#0ea5e9", backgroundColor: "#0ea5e9" },
                          { borderColor: "#10b981", backgroundColor: "#10b981" },
                          { borderColor: "#f59e0b", backgroundColor: "#f59e0b" },
                          { borderColor: "#6366f1", backgroundColor: "#6366f1" },
                        ]}
                      />
                      <div className="flex h-2 overflow-hidden rounded bg-slate-100">
                        <div className="h-full bg-blue-500/70" style={{ width: `${Math.max(0, s)}%` }} />
                        <div className="h-full bg-emerald-500/70" style={{ width: `${Math.max(0, d)}%` }} />
                        <div className="h-full bg-amber-500/70" style={{ width: `${Math.max(0, e)}%` }} />
                        <div className="h-full bg-indigo-500/70" style={{ width: `${Math.max(0, r)}%` }} />
                        <div
                          className="h-full bg-slate-300/70"
                          style={{ width: `${Math.max(0, 100 - (s + d + e + r))}%` }}
                        />
                      </div>
                    </>
                  );
                })()}
                <div className="grid grid-cols-4 gap-3 text-sm">
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-3 w-3 rounded-full bg-blue-500" />
                        <span className="font-semibold text-slate-800">Spike (S)</span>
                      </div>
                      <span className="text-xs text-slate-600">{Number(weights.wt_vol_spike ?? 0).toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                        <span className="font-semibold text-slate-800">Directional (D)</span>
                      </div>
                      <span className="text-xs text-slate-600">
                        {Number(weights.wt_vol_directional ?? 0).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-3 w-3 rounded-full bg-amber-500" />
                        <span className="font-semibold text-slate-800">Efficiency (E)</span>
                      </div>
                      <span className="text-xs text-slate-600">
                        {Number(weights.wt_vol_efficiency ?? 0).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-3 w-3 rounded-full bg-indigo-500" />
                        <span className="font-semibold text-slate-800">Range (R)</span>
                      </div>
                      <span className="text-xs text-slate-600">{Number(weights.wt_vol_range ?? 0).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-sm font-semibold text-slate-800">Momentum short (price action)</div>
                <p className="mt-1 text-xs text-slate-600">
                  Pesa ritorno vs ATR (ret), trend, struttura e RSI nel punteggio momentum short.
                </p>
              </div>
              <div className="space-y-3 rounded-md border border-slate-200 bg-white/80 px-3 py-3 shadow-inner">
                {(() => {
                  const rRaw = Number(weights.wt_mom_short_ret) || 0;
                  const tRaw = Number(weights.wt_mom_short_trend) || 0;
                  const sRaw = Number(weights.wt_mom_short_structure) || 0;
                  const rsiRaw = Number(weights.wt_mom_short_rsi) || 0;
                  const hasMs = rRaw + tRaw + sRaw + rsiRaw > 0;
                  const retW = hasMs ? rRaw : DEFAULT_MOMENTUM_SHORT_WEIGHTS.wt_mom_short_ret;
                  const trendW = hasMs ? tRaw : DEFAULT_MOMENTUM_SHORT_WEIGHTS.wt_mom_short_trend;
                  const structW = hasMs ? sRaw : DEFAULT_MOMENTUM_SHORT_WEIGHTS.wt_mom_short_structure;
                  const rsiW = hasMs ? rsiRaw : DEFAULT_MOMENTUM_SHORT_WEIGHTS.wt_mom_short_rsi;
                  const cuts = [
                    Math.min(100, Math.max(0, retW)),
                    Math.min(100, Math.max(0, retW + trendW)),
                    Math.min(100, Math.max(0, retW + trendW + structW)),
                    Math.min(100, Math.max(0, Math.min(100, retW + trendW + structW + rsiW))),
                  ];
                  const handleMomShortChange = (vals: number | number[]) => {
                    if (!Array.isArray(vals) || vals.length !== 4) return;
                    const [c1, c2, c3, c4] = vals.map((v) => Math.min(100, Math.max(0, v)));
                    const newRet = c1;
                    const newTrend = Math.max(0, c2 - c1);
                    const newStruct = Math.max(0, c3 - c2);
                    const newRsi = Math.max(0, c4 - c3);
                    setWeights((prev) => ({
                      ...prev,
                      wt_mom_short_ret: newRet,
                      wt_mom_short_trend: newTrend,
                      wt_mom_short_structure: newStruct,
                      wt_mom_short_rsi: newRsi,
                    }));
                  };
                  return (
                    <>
                      <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                        <span>Pesi ret / trend / structure / RSI</span>
                        <span className="text-xs text-slate-600">
                          RET {retW.toFixed(1)}% · TR {trendW.toFixed(1)}% · STR {structW.toFixed(1)}% · RSI{" "}
                          {rsiW.toFixed(1)}%
                        </span>
                      </div>
                      <Slider
                        range
                        min={0}
                        max={100}
                        step={1}
                        allowCross={false}
                        pushable={1}
                        value={cuts}
                        onChange={handleMomShortChange}
                        trackStyle={[{ backgroundColor: "#0ea5e9" }]}
                        handleStyle={[
                          { borderColor: "#0ea5e9", backgroundColor: "#0ea5e9" },
                          { borderColor: "#10b981", backgroundColor: "#10b981" },
                          { borderColor: "#f59e0b", backgroundColor: "#f59e0b" },
                          { borderColor: "#6366f1", backgroundColor: "#6366f1" },
                        ]}
                      />
                      <div className="flex h-2 overflow-hidden rounded bg-slate-100">
                        <div className="h-full bg-blue-500/70" style={{ width: `${Math.max(0, retW)}%` }} />
                        <div className="h-full bg-emerald-500/70" style={{ width: `${Math.max(0, trendW)}%` }} />
                        <div className="h-full bg-amber-500/70" style={{ width: `${Math.max(0, structW)}%` }} />
                        <div className="h-full bg-indigo-500/70" style={{ width: `${Math.max(0, rsiW)}%` }} />
                        <div
                          className="h-full bg-slate-300/70"
                          style={{ width: `${Math.max(0, 100 - (retW + trendW + structW + rsiW))}%` }}
                        />
                      </div>
                    </>
                  );
                })()}
                <div className="grid grid-cols-4 gap-3 text-sm">
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-3 w-3 rounded-full bg-blue-500" />
                        <span className="font-semibold text-slate-800">retScore (RET)</span>
                      </div>
                      <span className="text-xs text-slate-600">{Number(weights.wt_mom_short_ret ?? 0).toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                        <span className="font-semibold text-slate-800">trendScore (TR)</span>
                      </div>
                      <span className="text-xs text-slate-600">
                        {Number(weights.wt_mom_short_trend ?? 0).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-3 w-3 rounded-full bg-amber-500" />
                        <span className="font-semibold text-slate-800">structure (STR)</span>
                      </div>
                      <span className="text-xs text-slate-600">
                        {Number(weights.wt_mom_short_structure ?? 0).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-3 w-3 rounded-full bg-indigo-500" />
                        <span className="font-semibold text-slate-800">RSI (RSI)</span>
                      </div>
                      <span className="text-xs text-slate-600">{Number(weights.wt_mom_short_rsi ?? 0).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-sm font-semibold text-slate-800">Momentum “lungo” (12/6/3/1m + trend)</div>
                <p className="mt-1 text-xs text-slate-600">
                  Pesa le finestre 12m, 6m, 3m, 1m e il trend nel punteggio momentum complessivo.
                </p>
              </div>
              <div className="space-y-3 rounded-md border border-slate-200 bg-white/80 px-3 py-3 shadow-inner">
                {(() => {
                  const w12 = Number(weights.wt_mom_12m) || 0;
                  const w6 = Number(weights.wt_mom_6m) || 0;
                  const w3 = Number(weights.wt_mom_3m) || 0;
                  const w1 = Number(weights.wt_mom_1m) || 0;
                  const wTrend = Number(weights.wt_mom_trend) || 0;
                  const hasLong = w12 + w6 + w3 + w1 + wTrend > 0;
                  const m12 = hasLong ? w12 : DEFAULT_MOMENTUM_LONG_WEIGHTS.wt_mom_12m;
                  const m6 = hasLong ? w6 : DEFAULT_MOMENTUM_LONG_WEIGHTS.wt_mom_6m;
                  const m3 = hasLong ? w3 : DEFAULT_MOMENTUM_LONG_WEIGHTS.wt_mom_3m;
                  const m1 = hasLong ? w1 : DEFAULT_MOMENTUM_LONG_WEIGHTS.wt_mom_1m;
                  const mTrend = hasLong ? wTrend : DEFAULT_MOMENTUM_LONG_WEIGHTS.wt_mom_trend;
                  const cuts = [
                    Math.min(100, Math.max(0, m12)),
                    Math.min(100, Math.max(0, m12 + m6)),
                    Math.min(100, Math.max(0, m12 + m6 + m3)),
                    Math.min(100, Math.max(0, m12 + m6 + m3 + m1)),
                  ];
                  const handleMomLongChange = (vals: number | number[]) => {
                    if (!Array.isArray(vals) || vals.length !== 4) return;
                    const [c1, c2, c3, c4] = vals.map((v) => Math.min(100, Math.max(0, v)));
                    const new12 = c1;
                    const new6 = Math.max(0, c2 - c1);
                    const new3 = Math.max(0, c3 - c2);
                    const new1 = Math.max(0, c4 - c3);
                    const newTrend = Math.max(0, 100 - c4);
                    setWeights((prev) => ({
                      ...prev,
                      wt_mom_12m: new12,
                      wt_mom_6m: new6,
                      wt_mom_3m: new3,
                      wt_mom_1m: new1,
                      wt_mom_trend: newTrend,
                    }));
                  };
                  return (
                    <>
                      <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                        <span>Pesi 12m / 6m / 3m / 1m / trend</span>
                        <span className="text-xs text-slate-600">
                          12m {m12.toFixed(1)}% · 6m {m6.toFixed(1)}% · 3m {m3.toFixed(1)}% · 1m {m1.toFixed(1)}% ·
                          Trend {mTrend.toFixed(1)}%
                        </span>
                      </div>
                      <Slider
                        range
                        min={0}
                        max={100}
                        step={1}
                        allowCross={false}
                        pushable={1}
                        value={cuts}
                        onChange={handleMomLongChange}
                        trackStyle={[{ backgroundColor: "#0ea5e9" }]}
                        handleStyle={[
                          { borderColor: "#0ea5e9", backgroundColor: "#0ea5e9" },
                          { borderColor: "#10b981", backgroundColor: "#10b981" },
                          { borderColor: "#f59e0b", backgroundColor: "#f59e0b" },
                          { borderColor: "#6366f1", backgroundColor: "#6366f1" },
                        ]}
                      />
                      <div className="flex h-2 overflow-hidden rounded bg-slate-100">
                        <div className="h-full bg-blue-500/70" style={{ width: `${Math.max(0, m12)}%` }} />
                        <div className="h-full bg-emerald-500/70" style={{ width: `${Math.max(0, m6)}%` }} />
                        <div className="h-full bg-amber-500/70" style={{ width: `${Math.max(0, m3)}%` }} />
                        <div className="h-full bg-indigo-500/70" style={{ width: `${Math.max(0, m1)}%` }} />
                        <div className="h-full bg-rose-500/70" style={{ width: `${Math.max(0, mTrend)}%` }} />
                        <div
                          className="h-full bg-slate-300/70"
                          style={{ width: `${Math.max(0, 100 - (m12 + m6 + m3 + m1 + mTrend))}%` }}
                        />
                      </div>
                    </>
                  );
                })()}
                <div className="grid grid-cols-5 gap-3 text-sm">
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-3 w-3 rounded-full bg-blue-500" />
                        <span className="font-semibold text-slate-800">12m</span>
                      </div>
                      <span className="text-xs text-slate-600">{Number(weights.wt_mom_12m ?? 0).toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                        <span className="font-semibold text-slate-800">6m</span>
                      </div>
                      <span className="text-xs text-slate-600">{Number(weights.wt_mom_6m ?? 0).toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-3 w-3 rounded-full bg-amber-500" />
                        <span className="font-semibold text-slate-800">3m</span>
                      </div>
                      <span className="text-xs text-slate-600">{Number(weights.wt_mom_3m ?? 0).toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-3 w-3 rounded-full bg-indigo-500" />
                        <span className="font-semibold text-slate-800">1m</span>
                      </div>
                      <span className="text-xs text-slate-600">{Number(weights.wt_mom_1m ?? 0).toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-3 w-3 rounded-full bg-rose-500" />
                        <span className="font-semibold text-slate-800">Trend</span>
                      </div>
                      <span className="text-xs text-slate-600">{Number(weights.wt_mom_trend ?? 0).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-sm font-semibold text-slate-800">Double top</div>
                <p className="mt-1 text-xs text-slate-600">
                  Pesa distanza dai massimi, struttura delle medie e “long-term pressure” nel punteggio double top.
                </p>
              </div>
              <div className="space-y-3 rounded-md border border-slate-200 bg-white/80 px-3 py-3 shadow-inner">
                {(() => {
                  const distRaw = Number(weights.wt_doubletop_distance) || 0;
                  const maRaw = Number(weights.wt_doubletop_ma_structure) || 0;
                  const lpRaw = Number(weights.wt_doubletop_long_pressure) || 0;
                  const hasDt = distRaw + maRaw + lpRaw > 0;
                  const dist = hasDt ? distRaw : DEFAULT_DOUBLE_TOP_WEIGHTS.wt_doubletop_distance;
                  const ma = hasDt ? maRaw : DEFAULT_DOUBLE_TOP_WEIGHTS.wt_doubletop_ma_structure;
                  const lp = hasDt ? lpRaw : DEFAULT_DOUBLE_TOP_WEIGHTS.wt_doubletop_long_pressure;
                  const cuts = [
                    Math.min(100, Math.max(0, dist)),
                    Math.min(100, Math.max(0, dist + ma)),
                    Math.min(100, Math.max(0, Math.min(100, dist + ma + lp))),
                  ];
                  const handleDtChange = (vals: number | number[]) => {
                    if (!Array.isArray(vals) || vals.length !== 3) return;
                    const [c1, c2, c3] = vals.map((v) => Math.min(100, Math.max(0, v)));
                    const newDist = c1;
                    const newMa = Math.max(0, c2 - c1);
                    const newLp = Math.max(0, c3 - c2);
                    setWeights((prev) => ({
                      ...prev,
                      wt_doubletop_distance: newDist,
                      wt_doubletop_ma_structure: newMa,
                      wt_doubletop_long_pressure: newLp,
                    }));
                  };
                  return (
                    <>
                      <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                        <span>Distanza / MA structure / Long pressure</span>
                        <span className="text-xs text-slate-600">
                          Dist {dist.toFixed(1)}% · MA {ma.toFixed(1)}% · LP {lp.toFixed(1)}%
                        </span>
                      </div>
                      <Slider
                        range
                        min={0}
                        max={100}
                        step={1}
                        allowCross={false}
                        pushable={1}
                        value={cuts}
                        onChange={handleDtChange}
                        trackStyle={[{ backgroundColor: "#0ea5e9" }]}
                        handleStyle={[
                          { borderColor: "#0ea5e9", backgroundColor: "#0ea5e9" },
                          { borderColor: "#10b981", backgroundColor: "#10b981" },
                          { borderColor: "#f59e0b", backgroundColor: "#f59e0b" },
                        ]}
                      />
                      <div className="flex h-2 overflow-hidden rounded bg-slate-100">
                        <div className="h-full bg-blue-500/70" style={{ width: `${Math.max(0, dist)}%` }} />
                        <div className="h-full bg-emerald-500/70" style={{ width: `${Math.max(0, ma)}%` }} />
                        <div className="h-full bg-amber-500/70" style={{ width: `${Math.max(0, lp)}%` }} />
                        <div
                          className="h-full bg-slate-300/70"
                          style={{ width: `${Math.max(0, 100 - (dist + ma + lp))}%` }}
                        />
                      </div>
                    </>
                  );
                })()}
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-3 w-3 rounded-full bg-blue-500" />
                        <span className="font-semibold text-slate-800">Distanza</span>
                      </div>
                      <span className="text-xs text-slate-600">
                        {Number(weights.wt_doubletop_distance ?? 0).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                        <span className="font-semibold text-slate-800">MA structure</span>
                      </div>
                      <span className="text-xs text-slate-600">
                        {Number(weights.wt_doubletop_ma_structure ?? 0).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-3 w-3 rounded-full bg-amber-500" />
                        <span className="font-semibold text-slate-800">Long pressure</span>
                      </div>
                      <span className="text-xs text-slate-600">
                        {Number(weights.wt_doubletop_long_pressure ?? 0).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
