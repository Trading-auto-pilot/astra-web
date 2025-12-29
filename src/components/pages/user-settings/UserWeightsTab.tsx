import { useCallback, useEffect, useMemo, useState } from "react";
import { env } from "../../../config/env";
import "rc-slider/assets/index.css";
import Slider from "rc-slider";

type WeightKey = string;
type WeightRecord = Record<WeightKey, number>;

// Preferiamo Range (multi handle). Se non disponibile come proprietà, fallback a Slider con prop range.
const Range =
  ((Slider as any).Range as typeof Slider | undefined) ||
  (((props: any) => <Slider range {...props} />) as unknown as typeof Slider);

const COLORS = ["#7c3aed", "#0ea5e9", "#22c55e", "#f59e0b", "#ef4444"];

const SHORT_LABELS: Record<WeightKey, string> = {
  wt_growth_momentum: "GM",
  wt_growth_volume: "GV",
  wt_growth_risk: "GR",
  wt_growth_market: "GMk",
  wt_short_struct: "SR",
  wt_short_market: "MR",
  wt_ms_trend: "T",
  wt_ms_regime: "R",
  wt_ms_corr_penalty_max: "Pen",
  wt_mr_vol_safe: "Vol",
  wt_mr_dd_safe: "DD",
  wt_mr_gap_safe: "Gap",
  wt_mr_trend_safe: "Trend",
  wt_vol_spike: "Spike",
  wt_vol_directional: "Dir",
  wt_vol_efficiency: "Eff",
  wt_vol_range: "Range",
  wt_mom_short_ret: "Ret",
  wt_mom_short_trend: "Trend",
  wt_mom_short_structure: "Struct",
  wt_mom_short_rsi: "RSI",
  wt_mom_12m: "12m",
  wt_mom_6m: "6m",
  wt_mom_3m: "3m",
  wt_mom_1m: "1m",
  wt_mom_trend: "Trend",
  wt_doubletop_distance: "Dist",
  wt_doubletop_ma_structure: "MA Struct",
  wt_doubletop_long_pressure: "Pressure",
};

const friendlyLabel = (key: string) =>
  key
    .replace(/^wt_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const shortLabel = (key: string) => SHORT_LABELS[key] ?? key;

const GROUPS: { id: string; title: string; subtitle: string; keys: WeightKey[] }[] = [
  {
    id: "growth",
    title: "Growth Probability",
    subtitle: "Probabilità di crescita nel breve periodo",
    keys: ["wt_growth_momentum", "wt_growth_volume", "wt_growth_risk", "wt_growth_market"],
  },
  {
    id: "marketScore",
    title: "Market score",
    subtitle: "Trend, regime e penalità di correlazione",
    keys: ["wt_ms_trend", "wt_ms_regime", "wt_ms_corr_penalty_max"],
  },
  {
    id: "shortRisk",
    title: "ShortRisk combinato",
    subtitle: "Peso rischio strutturale e di mercato",
    keys: ["wt_short_struct", "wt_short_market"],
  },
  {
    id: "marketRisk",
    title: "Market risk score",
    subtitle: "Volatilità, drawdown, gap e trend di sicurezza",
    keys: ["wt_mr_vol_safe", "wt_mr_dd_safe", "wt_mr_gap_safe", "wt_mr_trend_safe"],
  },
  {
    id: "volume",
    title: "Volume score",
    subtitle: "Spike, direzionalità, efficienza e range",
    keys: ["wt_vol_spike", "wt_vol_directional", "wt_vol_efficiency", "wt_vol_range"],
  },
  {
    id: "momShort",
    title: "Momentum short (price action)",
    subtitle: "Return, trend, struttura e RSI a breve",
    keys: ["wt_mom_short_ret", "wt_mom_short_trend", "wt_mom_short_structure", "wt_mom_short_rsi"],
  },
  {
    id: "momLong",
    title: "Momentum lungo (12/6/3/1m + trend)",
    subtitle: "Allineamento multi-timeframe",
    keys: ["wt_mom_12m", "wt_mom_6m", "wt_mom_3m", "wt_mom_1m", "wt_mom_trend"],
  },
  {
    id: "doubleTop",
    title: "Double top",
    subtitle: "Distanza, struttura MA e pressione long",
    keys: ["wt_doubletop_distance", "wt_doubletop_ma_structure", "wt_doubletop_long_pressure"],
  },
];

const DEFAULTS: WeightRecord = {
  wt_growth_momentum: 45,
  wt_growth_volume: 25,
  wt_growth_risk: 15,
  wt_growth_market: 15,
  wt_short_struct: 60,
  wt_short_market: 40,
  wt_ms_trend: 55,
  wt_ms_regime: 35,
  wt_ms_corr_penalty_max: 20,
  wt_mr_vol_safe: 40,
  wt_mr_dd_safe: 30,
  wt_mr_gap_safe: 20,
  wt_mr_trend_safe: 10,
  wt_vol_spike: 40,
  wt_vol_directional: 30,
  wt_vol_efficiency: 20,
  wt_vol_range: 10,
  wt_mom_short_ret: 35,
  wt_mom_short_trend: 30,
  wt_mom_short_structure: 20,
  wt_mom_short_rsi: 15,
  wt_mom_12m: 40,
  wt_mom_6m: 25,
  wt_mom_3m: 20,
  wt_mom_1m: 5,
  wt_mom_trend: 10,
  wt_doubletop_distance: 45,
  wt_doubletop_ma_structure: 35,
  wt_doubletop_long_pressure: 20,
};

const ALL_KEYS = GROUPS.flatMap((g) => g.keys);

const normalizeIncoming = (data?: Partial<Record<WeightKey, any>>): WeightRecord => {
  const next: WeightRecord = { ...DEFAULTS };
  if (data && typeof data === "object") {
    ALL_KEYS.forEach((k) => {
      const raw = (data as any)[k];
      if (raw !== undefined && raw !== null) {
        const num = Number(raw);
        if (Number.isFinite(num)) {
          next[k] = num <= 1 ? num * 100 : num;
        }
      }
    });
  }
  return next;
};

const weightsToHandles = (keys: WeightKey[], source: WeightRecord) => {
  const total = keys.reduce((acc, k) => acc + (source[k] ?? 0), 0) || 100;
  let acc = 0;
  return keys.slice(0, -1).map((k) => {
    const pct = ((source[k] ?? 0) / total) * 100;
    acc += pct;
    return acc;
  });
};

const handlesToWeights = (keys: WeightKey[], handles: number[]) => {
  const points = [0, ...handles, 100];
  const next: WeightRecord = {} as WeightRecord;
  keys.forEach((k, idx) => {
    next[k] = Math.max(0, points[idx + 1] - points[idx]);
  });
  return next;
};

export default function UserWeightsTab() {
  const [weights, setWeights] = useState<WeightRecord>({ ...DEFAULTS });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [running, setRunning] = useState(false);

  const token = useMemo(
    () => (typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null),
    []
  );

  const loadWeights = useCallback(async () => {
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
      const uid = Number(me?.user?.id ?? me?.id ?? me?.tokenPayload?.sub);
      if (!uid) throw new Error("Utente non valido");
      setUserId(uid);
      setWeights(normalizeIncoming(me?.scoreWeights));
    } catch (err: any) {
      setError(err?.message || "Errore durante il caricamento");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadWeights();
  }, [loadWeights]);

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${env.apiBaseUrl}/auth/admin/user/${userId}/score-weights`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(weights),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSuccess("Pesi salvati con successo");
    } catch (err: any) {
      setError(err?.message || "Errore durante il salvataggio");
    } finally {
      setSaving(false);
    }
  };

  const handleRecalculate = async () => {
    if (!token) return;
    setRunning(true);
    setError(null);
    setSuccess(null);
    try {
      const resp = await fetch(`${env.apiBaseUrl}/tickerscanner/fundamentals/recalculate-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      setSuccess("Ricalcolo avviato");
    } catch (err: any) {
      setError(err?.message || "Errore durante il ricalcolo");
    } finally {
      setRunning(false);
    }
  };

  const applyDefaults = () => {
    setWeights({ ...DEFAULTS });
    setSuccess(null);
    setError(null);
  };

  const applyGroupDefaults = (groupId: string) => {
    const group = GROUPS.find((g) => g.id === groupId);
    if (!group) return;
    setWeights((prev) => {
      const next = { ...prev };
      group.keys.forEach((k) => {
        next[k] = DEFAULTS[k];
      });
      return next;
    });
    setSuccess(null);
    setError(null);
  };

  const renderCard = (groupId: string) => {
    const group = GROUPS.find((g) => g.id === groupId);
    if (!group) return null;
    const handles = weightsToHandles(group.keys, weights);
    const total = group.keys.reduce((acc, k) => acc + (weights[k] ?? 0), 0);

    return (
      <div key={group.id} className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">{group.title}</h3>
            <p className="text-sm text-slate-500">{group.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
              onClick={() => applyGroupDefaults(group.id)}
            >
              Set default
            </button>
          </div>
        </div>

        <div className="px-2">
          <Range
            value={handles}
            allowCross={false}
            pushable={1}
            step={1}
            onChange={(vals) => {
              const next = handlesToWeights(group.keys, vals as number[]);
              setWeights((prev) => ({ ...prev, ...next }));
              setSuccess(null);
            }}
            trackStyle={group.keys.slice(0, -1).map((_, idx) => ({ backgroundColor: COLORS[idx % COLORS.length] }))}
            handleStyle={handles.map(() => ({
              borderColor: "#0ea5e9",
              backgroundColor: "#fff",
              width: 16,
              height: 16,
              marginTop: -6,
              boxShadow: "0 0 0 2px rgba(14,165,233,0.25)",
            }))}
            railStyle={{ backgroundColor: "#e2e8f0" }}
          />
        </div>

        <div className="space-y-2">
          {group.keys.map((k, idx) => (
            <div key={k} className="flex items-center justify-between text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="font-medium">
                  {friendlyLabel(k)} ({shortLabel(k)})
                </span>
              </div>
              <span className="font-mono">{(weights[k] ?? 0).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-end gap-2">
        <button
          className="px-3 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
          onClick={loadWeights}
          disabled={loading}
        >
          Reload
        </button>
        <button
          className="px-3 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
          onClick={applyDefaults}
        >
          Set default
        </button>
        <button
          className="px-3 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
          onClick={handleRecalculate}
          disabled={running}
        >
          {running ? "Running..." : "Run now"}
        </button>
        <button
          className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
          onClick={handleSave}
          disabled={saving || !userId}
        >
          {saving ? "Salvataggio..." : "Save"}
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{GROUPS.map((g) => renderCard(g.id))}</div>
    </div>
  );
}
