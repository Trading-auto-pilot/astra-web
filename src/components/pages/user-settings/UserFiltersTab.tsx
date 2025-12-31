import { useEffect, useMemo, useState, useCallback } from "react";
import { env } from "../../../config/env";

type Comparator = "gt" | "lt";

export default function UserFiltersTab() {
  const defaults = {
    growthProbability: 80,
    growthMomentum: 60,
    growthVolume: 55,
    growthRisk: 50,
    growthMarket: 50,
    msTrend: 55,
    msRegime: 50,
    msCorrPenaltyMax: 40,
    mrVolSafe: 55,
    mrDdSafe: 55,
    mrGapSafe: 55,
    mrTrendSafe: 55,
    volSpike: 60,
    volDirectional: 55,
    volEfficiency: 55,
    volRange: 55,
    momShortRet: 60,
    momShortTrend: 55,
    momShortStructure: 55,
    momShortRsi: 55,
    mom1m: 55,
    mom3m: 55,
    mom6m: 55,
    mom12m: 55,
    doubletopLongPressure: 55,
    doubletopMaStructure: 55,
    doubletopDistance: 55,
    doubletopScore: 55,
  };
  const [growth, setGrowth] = useState<number>(defaults.growthProbability);
  const [comp, setComp] = useState<Comparator>("gt");
  const [enabledGrowth, setEnabledGrowth] = useState<boolean>(true);
  const [momentum, setMomentum] = useState<number>(defaults.growthMomentum);
  const [momentumComp, setMomentumComp] = useState<Comparator>("gt");
  const [enabledMomentum, setEnabledMomentum] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(defaults.growthVolume);
  const [volumeComp, setVolumeComp] = useState<Comparator>("gt");
  const [enabledVolume, setEnabledVolume] = useState<boolean>(true);
  const [risk, setRisk] = useState<number>(defaults.growthRisk);
  const [riskComp, setRiskComp] = useState<Comparator>("gt");
  const [enabledRisk, setEnabledRisk] = useState<boolean>(true);
  const [market, setMarket] = useState<number>(defaults.growthMarket);
  const [marketComp, setMarketComp] = useState<Comparator>("gt");
  const [enabledMarket, setEnabledMarket] = useState<boolean>(true);
  const [msTrend, setMsTrend] = useState<number>(defaults.msTrend);
  const [msTrendComp, setMsTrendComp] = useState<Comparator>("gt");
  const [enabledMsTrend, setEnabledMsTrend] = useState<boolean>(true);
  const [msRegime, setMsRegime] = useState<number>(defaults.msRegime);
  const [msRegimeComp, setMsRegimeComp] = useState<Comparator>("gt");
  const [enabledMsRegime, setEnabledMsRegime] = useState<boolean>(true);
  const [msCorrPenaltyMax, setMsCorrPenaltyMax] = useState<number>(defaults.msCorrPenaltyMax);
  const [msCorrPenaltyComp, setMsCorrPenaltyComp] = useState<Comparator>("lt");
  const [enabledMsCorr, setEnabledMsCorr] = useState<boolean>(true);
  const [mrVolSafe, setMrVolSafe] = useState<number>(defaults.mrVolSafe);
  const [mrVolSafeComp, setMrVolSafeComp] = useState<Comparator>("gt");
  const [enabledMrVol, setEnabledMrVol] = useState<boolean>(true);
  const [mrDdSafe, setMrDdSafe] = useState<number>(defaults.mrDdSafe);
  const [mrDdSafeComp, setMrDdSafeComp] = useState<Comparator>("gt");
  const [enabledMrDd, setEnabledMrDd] = useState<boolean>(true);
  const [mrGapSafe, setMrGapSafe] = useState<number>(defaults.mrGapSafe);
  const [mrGapSafeComp, setMrGapSafeComp] = useState<Comparator>("gt");
  const [enabledMrGap, setEnabledMrGap] = useState<boolean>(true);
  const [mrTrendSafe, setMrTrendSafe] = useState<number>(defaults.mrTrendSafe);
  const [mrTrendSafeComp, setMrTrendSafeComp] = useState<Comparator>("gt");
  const [enabledMrTrend, setEnabledMrTrend] = useState<boolean>(true);
  const [volSpike, setVolSpike] = useState<number>(defaults.volSpike);
  const [volSpikeComp, setVolSpikeComp] = useState<Comparator>("gt");
  const [enabledVolSpike, setEnabledVolSpike] = useState<boolean>(true);
  const [volDirectional, setVolDirectional] = useState<number>(defaults.volDirectional);
  const [volDirectionalComp, setVolDirectionalComp] = useState<Comparator>("gt");
  const [enabledVolDirectional, setEnabledVolDirectional] = useState<boolean>(true);
  const [volEfficiency, setVolEfficiency] = useState<number>(defaults.volEfficiency);
  const [volEfficiencyComp, setVolEfficiencyComp] = useState<Comparator>("gt");
  const [enabledVolEfficiency, setEnabledVolEfficiency] = useState<boolean>(true);
  const [volRange, setVolRange] = useState<number>(defaults.volRange);
  const [volRangeComp, setVolRangeComp] = useState<Comparator>("gt");
  const [enabledVolRange, setEnabledVolRange] = useState<boolean>(true);
  const [momShortRet, setMomShortRet] = useState<number>(defaults.momShortRet);
  const [momShortRetComp, setMomShortRetComp] = useState<Comparator>("gt");
  const [enabledMomShortRet, setEnabledMomShortRet] = useState<boolean>(true);
  const [momShortTrend, setMomShortTrend] = useState<number>(defaults.momShortTrend);
  const [momShortTrendComp, setMomShortTrendComp] = useState<Comparator>("gt");
  const [enabledMomShortTrend, setEnabledMomShortTrend] = useState<boolean>(true);
  const [momShortStructure, setMomShortStructure] = useState<number>(defaults.momShortStructure);
  const [momShortStructureComp, setMomShortStructureComp] = useState<Comparator>("gt");
  const [enabledMomShortStructure, setEnabledMomShortStructure] = useState<boolean>(true);
  const [momShortRsi, setMomShortRsi] = useState<number>(defaults.momShortRsi);
  const [momShortRsiComp, setMomShortRsiComp] = useState<Comparator>("gt");
  const [enabledMomShortRsi, setEnabledMomShortRsi] = useState<boolean>(true);
  const [mom1m, setMom1m] = useState<number>(defaults.mom1m);
  const [mom1mComp, setMom1mComp] = useState<Comparator>("gt");
  const [enabledMom1m, setEnabledMom1m] = useState<boolean>(true);
  const [mom3m, setMom3m] = useState<number>(defaults.mom3m);
  const [mom3mComp, setMom3mComp] = useState<Comparator>("gt");
  const [enabledMom3m, setEnabledMom3m] = useState<boolean>(true);
  const [mom6m, setMom6m] = useState<number>(defaults.mom6m);
  const [mom6mComp, setMom6mComp] = useState<Comparator>("gt");
  const [enabledMom6m, setEnabledMom6m] = useState<boolean>(true);
  const [mom12m, setMom12m] = useState<number>(defaults.mom12m);
  const [mom12mComp, setMom12mComp] = useState<Comparator>("gt");
  const [enabledMom12m, setEnabledMom12m] = useState<boolean>(true);
  const [dtLongPressure, setDtLongPressure] = useState<number>(defaults.doubletopLongPressure);
  const [dtLongPressureComp, setDtLongPressureComp] = useState<Comparator>("gt");
  const [enabledDtLongPressure, setEnabledDtLongPressure] = useState<boolean>(true);
  const [dtMaStructure, setDtMaStructure] = useState<number>(defaults.doubletopMaStructure);
  const [dtMaStructureComp, setDtMaStructureComp] = useState<Comparator>("gt");
  const [enabledDtMaStructure, setEnabledDtMaStructure] = useState<boolean>(true);
  const [dtDistance, setDtDistance] = useState<number>(defaults.doubletopDistance);
  const [dtDistanceComp, setDtDistanceComp] = useState<Comparator>("gt");
  const [enabledDtDistance, setEnabledDtDistance] = useState<boolean>(true);
  const [dtScore, setDtScore] = useState<number>(defaults.doubletopScore);
  const [dtScoreComp, setDtScoreComp] = useState<Comparator>("gt");
  const [enabledDtScore, setEnabledDtScore] = useState<boolean>(true);

  const token = useMemo(
    () => (typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null),
    []
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pipes, setPipes] = useState<Array<{ id: number; name: string; enabled?: boolean }>>([]);
  const [pipesLoading, setPipesLoading] = useState(false);
  const [selectedPipeId, setSelectedPipeId] = useState<number | null>(null);

  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const applyFilterRow = (row: any) => {
    const name = row?.filter_name;
    const value = Number(row?.value);
    const comp: Comparator = row?.comparator === "LT" ? "lt" : "gt";
    const en = !!row?.enabled;
    const val = Number.isFinite(value) ? value : undefined;
    switch (name) {
      case "growthProbability":
        if (val !== undefined) setGrowth(val);
        setComp(comp);
        setEnabledGrowth(en);
        break;
      case "growthMomentum":
        if (val !== undefined) setMomentum(val);
        setMomentumComp(comp);
        setEnabledMomentum(en);
        break;
      case "growthVolume":
        if (val !== undefined) setVolume(val);
        setVolumeComp(comp);
        setEnabledVolume(en);
        break;
      case "growthRisk":
        if (val !== undefined) setRisk(val);
        setRiskComp(comp);
        setEnabledRisk(en);
        break;
      case "growthMarket":
        if (val !== undefined) setMarket(val);
        setMarketComp(comp);
        setEnabledMarket(en);
        break;
      case "msTrend":
        if (val !== undefined) setMsTrend(val);
        setMsTrendComp(comp);
        setEnabledMsTrend(en);
        break;
      case "msRegime":
        if (val !== undefined) setMsRegime(val);
        setMsRegimeComp(comp);
        setEnabledMsRegime(en);
        break;
      case "msCorrPenaltyMax":
        if (val !== undefined) setMsCorrPenaltyMax(val);
        setMsCorrPenaltyComp(comp);
        setEnabledMsCorr(en);
        break;
      case "mrVolSafe":
        if (val !== undefined) setMrVolSafe(val);
        setMrVolSafeComp(comp);
        setEnabledMrVol(en);
        break;
      case "mrDdSafe":
        if (val !== undefined) setMrDdSafe(val);
        setMrDdSafeComp(comp);
        setEnabledMrDd(en);
        break;
      case "mrGapSafe":
        if (val !== undefined) setMrGapSafe(val);
        setMrGapSafeComp(comp);
        setEnabledMrGap(en);
        break;
      case "mrTrendSafe":
        if (val !== undefined) setMrTrendSafe(val);
        setMrTrendSafeComp(comp);
        setEnabledMrTrend(en);
        break;
      case "volSpike":
        if (val !== undefined) setVolSpike(val);
        setVolSpikeComp(comp);
        setEnabledVolSpike(en);
        break;
      case "volDirectional":
        if (val !== undefined) setVolDirectional(val);
        setVolDirectionalComp(comp);
        setEnabledVolDirectional(en);
        break;
      case "volEfficiency":
        if (val !== undefined) setVolEfficiency(val);
        setVolEfficiencyComp(comp);
        setEnabledVolEfficiency(en);
        break;
      case "volRange":
        if (val !== undefined) setVolRange(val);
        setVolRangeComp(comp);
        setEnabledVolRange(en);
        break;
      case "momShortRet":
        if (val !== undefined) setMomShortRet(val);
        setMomShortRetComp(comp);
        setEnabledMomShortRet(en);
        break;
      case "momShortTrend":
        if (val !== undefined) setMomShortTrend(val);
        setMomShortTrendComp(comp);
        setEnabledMomShortTrend(en);
        break;
      case "momShortStructure":
        if (val !== undefined) setMomShortStructure(val);
        setMomShortStructureComp(comp);
        setEnabledMomShortStructure(en);
        break;
      case "momShortRsi":
        if (val !== undefined) setMomShortRsi(val);
        setMomShortRsiComp(comp);
        setEnabledMomShortRsi(en);
        break;
      case "mom1m":
        if (val !== undefined) setMom1m(val);
        setMom1mComp(comp);
        setEnabledMom1m(en);
        break;
      case "mom3m":
        if (val !== undefined) setMom3m(val);
        setMom3mComp(comp);
        setEnabledMom3m(en);
        break;
      case "mom6m":
        if (val !== undefined) setMom6m(val);
        setMom6mComp(comp);
        setEnabledMom6m(en);
        break;
      case "mom12m":
        if (val !== undefined) setMom12m(val);
        setMom12mComp(comp);
        setEnabledMom12m(en);
        break;
      case "doubletopLongPressure":
        if (val !== undefined) setDtLongPressure(val);
        setDtLongPressureComp(comp);
        setEnabledDtLongPressure(en);
        break;
      case "doubletopMaStructure":
        if (val !== undefined) setDtMaStructure(val);
        setDtMaStructureComp(comp);
        setEnabledDtMaStructure(en);
        break;
      case "doubletopDistance":
        if (val !== undefined) setDtDistance(val);
        setDtDistanceComp(comp);
        setEnabledDtDistance(en);
        break;
      case "doubletopScore":
        if (val !== undefined) setDtScore(val);
        setDtScoreComp(comp);
        setEnabledDtScore(en);
        break;
      default:
        break;
    }
  };

  const loadPipes = useCallback(async () => {
    try {
      setPipesLoading(true);
      const resp = await fetch(`${env.apiBaseUrl}/tickerscanner/fundamentals/users/pipes`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await resp.json().catch(() => ({}));
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      const enabled = list
        .map((p: any) => ({ ...p, enabled: p?.enabled === true || p?.enabled === 1 || p?.enabled === "1" }))
        .filter((p: any) => p.enabled);
      setPipes(enabled);
      if (enabled.length && selectedPipeId === null) {
        setSelectedPipeId(enabled[0].id);
        return enabled[0].id;
      }
      return enabled.find((p: any) => p.id === selectedPipeId)?.id ?? null;
    } catch {
      setPipes([]);
      return null;
    } finally {
      setPipesLoading(false);
    }
  }, [token, selectedPipeId]);

  const loadFilters = useCallback(
    async (pipeId: number | null) => {
      if (!token || pipeId === null || pipeId === undefined) {
        setError("Seleziona una pipe per caricare i filtri.");
        return;
      }
      setLoading(true);
      resetMessages();
      try {
        const resp = await fetch(
          `${env.apiBaseUrl}/tickerscanner/fundamentals/user-filters/${encodeURIComponent(pipeId)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        const rows = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        rows.forEach((row: any) => applyFilterRow(row));
        setSuccess("Filtri caricati");
      } catch (err: any) {
        setError(err?.message || "Errore nel caricamento filtri");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) return;
      const firstPipe = await loadPipes();
      const effectivePipe = selectedPipeId ?? firstPipe;
      if (effectivePipe !== null && effectivePipe !== undefined) {
        loadFilters(effectivePipe);
      }
    };
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (selectedPipeId !== null && selectedPipeId !== undefined) {
      loadFilters(selectedPipeId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPipeId]);

  const saveFilters = async () => {
    if (!token || selectedPipeId === null || selectedPipeId === undefined) {
      setError("Seleziona una pipe prima di salvare.");
      return;
    }
    setSaving(true);
    resetMessages();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const toSave = [
      ["growthProbability", growth, comp, enabledGrowth],
      ["growthMomentum", momentum, momentumComp, enabledMomentum],
      ["growthVolume", volume, volumeComp, enabledVolume],
      ["growthRisk", risk, riskComp, enabledRisk],
      ["growthMarket", market, marketComp, enabledMarket],
      ["msTrend", msTrend, msTrendComp, enabledMsTrend],
      ["msRegime", msRegime, msRegimeComp, enabledMsRegime],
      ["msCorrPenaltyMax", msCorrPenaltyMax, msCorrPenaltyComp, enabledMsCorr],
      ["mrVolSafe", mrVolSafe, mrVolSafeComp, enabledMrVol],
      ["mrDdSafe", mrDdSafe, mrDdSafeComp, enabledMrDd],
      ["mrGapSafe", mrGapSafe, mrGapSafeComp, enabledMrGap],
      ["mrTrendSafe", mrTrendSafe, mrTrendSafeComp, enabledMrTrend],
      ["volSpike", volSpike, volSpikeComp, enabledVolSpike],
      ["volDirectional", volDirectional, volDirectionalComp, enabledVolDirectional],
      ["volEfficiency", volEfficiency, volEfficiencyComp, enabledVolEfficiency],
      ["volRange", volRange, volRangeComp, enabledVolRange],
      ["momShortRet", momShortRet, momShortRetComp, enabledMomShortRet],
      ["momShortTrend", momShortTrend, momShortTrendComp, enabledMomShortTrend],
      ["momShortStructure", momShortStructure, momShortStructureComp, enabledMomShortStructure],
      ["momShortRsi", momShortRsi, momShortRsiComp, enabledMomShortRsi],
      ["mom1m", mom1m, mom1mComp, enabledMom1m],
      ["mom3m", mom3m, mom3mComp, enabledMom3m],
      ["mom6m", mom6m, mom6mComp, enabledMom6m],
      ["mom12m", mom12m, mom12mComp, enabledMom12m],
      ["doubletopLongPressure", dtLongPressure, dtLongPressureComp, enabledDtLongPressure],
      ["doubletopMaStructure", dtMaStructure, dtMaStructureComp, enabledDtMaStructure],
      ["doubletopDistance", dtDistance, dtDistanceComp, enabledDtDistance],
      ["doubletopScore", dtScore, dtScoreComp, enabledDtScore],
    ];

    try {
      for (const [name, val, compVal, en] of toSave) {
        const resp = await fetch(
          `${env.apiBaseUrl}/tickerscanner/fundamentals/user-filters/${encodeURIComponent(
            String(name)
          )}/${encodeURIComponent(String(selectedPipeId))}`,
          {
            method: "PUT",
            headers,
            body: JSON.stringify({
              value: val,
              comparator: compVal === "lt" || compVal === "LT" ? "LT" : "GT",
              enabled: !!en,
              pipe_id: selectedPipeId,
            }),
          }
        );
        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status} saving ${name}`);
        }
      }
      setSuccess("Filtri salvati");
    } catch (err: any) {
      setError(err?.message || "Errore salvataggio filtri");
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="grid gap-4 md:grid-cols-[220px,1fr]">
      <div className="space-y-3">
        <div className="bg-white rounded-lg shadow-sm p-4 space-y-2">
          <div className="text-sm font-semibold text-slate-900">Pipe</div>
          {pipesLoading && <div className="text-xs text-slate-500">Caricamento...</div>}
          {!pipesLoading && (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setSelectedPipeId(null)}
                className={`w-full rounded-md border px-3 py-2 text-left text-sm ${
                  selectedPipeId === null
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Default
              </button>
              {pipes.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPipeId(p.id)}
                  className={`w-full rounded-md border px-3 py-2 text-left text-sm ${
                    selectedPipeId === p.id
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {p.name || `Pipe ${p.id}`}
                </button>
              ))}
              {!pipesLoading && pipes.length === 0 && (
                <div className="text-xs text-slate-500">Nessuna pipe abilitata.</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm"
            onClick={() => {
              setError(null);
              setSuccess(null);
              loadFilters(selectedPipeId);
            }}
            disabled={loading}
          >
            Reload
          </button>
        <button
          className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60"
          onClick={saveFilters}
          disabled={saving || loading}
        >
          {saving ? "Salvataggio..." : "Save"}
        </button>
      </div>

        {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        {success && (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Growth Probability</h3>
            <p className="text-sm text-slate-500">
              Imposta una soglia di probabilità di crescita (0-100). Saranno mostrati solo i titoli che rispettano la
              condizione scelta.
            </p>
          </div>
          <button
            className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setGrowth(defaults.growthProbability);
              setComp("gt");
            }}
          >
            Set default
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="growth-comp"
                value="gt"
                checked={comp === "gt"}
                onChange={() => setComp("gt")}
              />
              <span>Maggiore di</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="growth-comp"
                value="lt"
                checked={comp === "lt"}
                onChange={() => setComp("lt")}
              />
              <span>Minore di</span>
            </label>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={growth}
            onChange={(e) => setGrowth(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0</span>
            <span className="text-sm font-semibold text-slate-800">{growth}%</span>
            <span>100</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Condizione: {comp === "gt" ? ">" : "<"} {growth}%</span>
            <label className="inline-flex items-center gap-1 text-slate-600">
              <input type="checkbox" checked={enabledGrowth} onChange={(e) => setEnabledGrowth(e.target.checked)} />
              <span>Enable</span>
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Double top – Score</h3>
            <p className="text-sm text-slate-500">Score complessivo double top (0-100). Soglia esempio &gt; 55%.</p>
          </div>
          <button
            className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setDtScore(defaults.doubletopScore);
              setDtScoreComp("gt");
            }}
          >
            Set default
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="dtScore-comp"
                value="gt"
                checked={dtScoreComp === "gt"}
                onChange={() => setDtScoreComp("gt")}
              />
              <span>Maggiore di</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="dtScore-comp"
                value="lt"
                checked={dtScoreComp === "lt"}
                onChange={() => setDtScoreComp("lt")}
              />
              <span>Minore di</span>
            </label>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={dtScore}
            onChange={(e) => setDtScore(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0</span>
            <span className="text-sm font-semibold text-slate-800">{dtScore}%</span>
            <span>100</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Condizione: {dtScoreComp === "gt" ? ">" : "<"} {dtScore}%</span>
            <label className="inline-flex items-center gap-1 text-slate-600">
              <input type="checkbox" checked={enabledDtScore} onChange={(e) => setEnabledDtScore(e.target.checked)} />
              <span>Enable</span>
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Double top – Long pressure</h3>
            <p className="text-sm text-slate-500">Pressione long di lungo periodo (0-100). Soglia esempio &gt; 55%.</p>
          </div>
          <button
            className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setDtLongPressure(defaults.doubletopLongPressure);
              setDtLongPressureComp("gt");
            }}
          >
            Set default
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="dtLongPressure-comp"
                value="gt"
                checked={dtLongPressureComp === "gt"}
                onChange={() => setDtLongPressureComp("gt")}
              />
              <span>Maggiore di</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="dtLongPressure-comp"
                value="lt"
                checked={dtLongPressureComp === "lt"}
                onChange={() => setDtLongPressureComp("lt")}
              />
              <span>Minore di</span>
            </label>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={dtLongPressure}
            onChange={(e) => setDtLongPressure(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0</span>
            <span className="text-sm font-semibold text-slate-800">{dtLongPressure}%</span>
            <span>100</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Condizione: {dtLongPressureComp === "gt" ? ">" : "<"} {dtLongPressure}%</span>
            <label className="inline-flex items-center gap-1 text-slate-600">
              <input
                type="checkbox"
                checked={enabledDtLongPressure}
                onChange={(e) => setEnabledDtLongPressure(e.target.checked)}
              />
              <span>Enable</span>
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Double top – Distance</h3>
            <p className="text-sm text-slate-500">
              Distanza dai massimi per il pattern double top (0-100). Soglia esempio &gt; 55%.
            </p>
          </div>
        <button
            className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setDtDistance(defaults.doubletopDistance);
              setDtDistanceComp("gt");
            }}
          >
            Set default
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="dtDistance-comp"
                value="gt"
                checked={dtDistanceComp === "gt"}
                onChange={() => setDtDistanceComp("gt")}
              />
              <span>Maggiore di</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="dtDistance-comp"
                value="lt"
                checked={dtDistanceComp === "lt"}
                onChange={() => setDtDistanceComp("lt")}
              />
              <span>Minore di</span>
            </label>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={dtDistance}
            onChange={(e) => setDtDistance(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0</span>
            <span className="text-sm font-semibold text-slate-800">{dtDistance}%</span>
            <span>100</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Condizione: {dtDistanceComp === "gt" ? ">" : "<"} {dtDistance}%</span>
            <label className="inline-flex items-center gap-1 text-slate-600">
              <input
                type="checkbox"
                checked={enabledDtDistance}
                onChange={(e) => setEnabledDtDistance(e.target.checked)}
              />
              <span>Enable</span>
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Double top – MA structure</h3>
            <p className="text-sm text-slate-500">
              Struttura delle medie mobili per double top (0-100). Soglia esempio &gt; 55%.
            </p>
          </div>
          <button
            className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setDtMaStructure(defaults.doubletopMaStructure);
              setDtMaStructureComp("gt");
            }}
          >
            Set default
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="dtMaStructure-comp"
                value="gt"
                checked={dtMaStructureComp === "gt"}
                onChange={() => setDtMaStructureComp("gt")}
              />
              <span>Maggiore di</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="dtMaStructure-comp"
                value="lt"
                checked={dtMaStructureComp === "lt"}
                onChange={() => setDtMaStructureComp("lt")}
              />
              <span>Minore di</span>
            </label>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={dtMaStructure}
            onChange={(e) => setDtMaStructure(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0</span>
            <span className="text-sm font-semibold text-slate-800">{dtMaStructure}%</span>
            <span>100</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Condizione: {dtMaStructureComp === "gt" ? ">" : "<"} {dtMaStructure}%</span>
            <label className="inline-flex items-center gap-1 text-slate-600">
              <input
                type="checkbox"
                checked={enabledDtMaStructure}
                onChange={(e) => setEnabledDtMaStructure(e.target.checked)}
              />
              <span>Enable</span>
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Growth Momentum</h3>
            <p className="text-sm text-slate-500">
              Soglia minima dello score momentum (0-100) per includere il titolo. Un valore consigliato come base è 60%.
            </p>
          </div>
          <button
            className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setMomentum(defaults.growthMomentum);
              setMomentumComp("gt");
            }}
          >
            Set default
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="momentum-comp"
                value="gt"
                checked={momentumComp === "gt"}
                onChange={() => setMomentumComp("gt")}
              />
              <span>Maggiore di</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="momentum-comp"
                value="lt"
                checked={momentumComp === "lt"}
                onChange={() => setMomentumComp("lt")}
              />
              <span>Minore di</span>
            </label>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={momentum}
            onChange={(e) => setMomentum(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0</span>
            <span className="text-sm font-semibold text-slate-800">{momentum}%</span>
            <span>100</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Condizione: {momentumComp === "gt" ? ">" : "<"} {momentum}%</span>
            <label className="inline-flex items-center gap-1 text-slate-600">
              <input
                type="checkbox"
                checked={enabledMomentum}
                onChange={(e) => setEnabledMomentum(e.target.checked)}
              />
              <span>Enable</span>
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Growth Volume</h3>
            <p className="text-sm text-slate-500">
              Soglia minima dello score volume (0-100). Un punto di partenza può essere 55% per privilegiare volumi in crescita.
            </p>
          </div>
          <button
            className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setVolume(defaults.growthVolume);
              setVolumeComp("gt");
            }}
          >
            Set default
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="volume-comp"
                value="gt"
                checked={volumeComp === "gt"}
                onChange={() => setVolumeComp("gt")}
              />
              <span>Maggiore di</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="volume-comp"
                value="lt"
                checked={volumeComp === "lt"}
                onChange={() => setVolumeComp("lt")}
              />
              <span>Minore di</span>
            </label>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0</span>
            <span className="text-sm font-semibold text-slate-800">{volume}%</span>
            <span>100</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Condizione: {volumeComp === "gt" ? ">" : "<"} {volume}%</span>
            <label className="inline-flex items-center gap-1 text-slate-600">
              <input
                type="checkbox"
                checked={enabledVolume}
                onChange={(e) => setEnabledVolume(e.target.checked)}
              />
              <span>Enable</span>
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Growth Risk</h3>
            <p className="text-sm text-slate-500">
              Imposta la soglia di rischio (0-100). Punteggi alti indicano rischio più basso: ad esempio &gt; 50% per
              restare su titoli meno rischiosi.
            </p>
          </div>
          <button
            className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setRisk(defaults.growthRisk);
              setRiskComp("gt");
            }}
          >
            Set default
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="risk-comp"
                value="gt"
                checked={riskComp === "gt"}
                onChange={() => setRiskComp("gt")}
              />
              <span>Maggiore di</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="risk-comp"
                value="lt"
                checked={riskComp === "lt"}
                onChange={() => setRiskComp("lt")}
              />
              <span>Minore di</span>
            </label>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={risk}
            onChange={(e) => setRisk(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0</span>
            <span className="text-sm font-semibold text-slate-800">{risk}%</span>
            <span>100</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Condizione: {riskComp === "gt" ? ">" : "<"} {risk}%</span>
            <label className="inline-flex items-center gap-1 text-slate-600">
              <input type="checkbox" checked={enabledRisk} onChange={(e) => setEnabledRisk(e.target.checked)} />
              <span>Enable</span>
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Growth Market</h3>
            <p className="text-sm text-slate-500">
              Soglia dello score di mercato (0-100). Un valore di partenza può essere 50% per contesto neutro o migliore.
            </p>
          </div>
          <button
            className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setMarket(defaults.growthMarket);
              setMarketComp("gt");
            }}
          >
            Set default
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="market-comp"
                value="gt"
                checked={marketComp === "gt"}
                onChange={() => setMarketComp("gt")}
              />
              <span>Maggiore di</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="market-comp"
                value="lt"
                checked={marketComp === "lt"}
                onChange={() => setMarketComp("lt")}
              />
              <span>Minore di</span>
            </label>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={market}
            onChange={(e) => setMarket(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0</span>
            <span className="text-sm font-semibold text-slate-800">{market}%</span>
            <span>100</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Condizione: {marketComp === "gt" ? ">" : "<"} {market}%</span>
            <label className="inline-flex items-center gap-1 text-slate-600">
              <input type="checkbox" checked={enabledMarket} onChange={(e) => setEnabledMarket(e.target.checked)} />
              <span>Enable</span>
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Trend score (indice)</h3>
            <p className="text-sm text-slate-500">
              Peso del trend dell&apos;indice di mercato (0-100). Una soglia di riferimento può essere 55% per richiedere
              trend positivo.
            </p>
          </div>
          <button
            className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setMsTrend(defaults.msTrend);
              setMsTrendComp("gt");
            }}
          >
            Set default
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="msTrend-comp"
                value="gt"
                checked={msTrendComp === "gt"}
                onChange={() => setMsTrendComp("gt")}
              />
              <span>Maggiore di</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="msTrend-comp"
                value="lt"
                checked={msTrendComp === "lt"}
                onChange={() => setMsTrendComp("lt")}
              />
              <span>Minore di</span>
            </label>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={msTrend}
            onChange={(e) => setMsTrend(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0</span>
            <span className="text-sm font-semibold text-slate-800">{msTrend}%</span>
            <span>100</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Condizione: {msTrendComp === "gt" ? ">" : "<"} {msTrend}%</span>
            <label className="inline-flex items-center gap-1 text-slate-600">
              <input type="checkbox" checked={enabledMsTrend} onChange={(e) => setEnabledMsTrend(e.target.checked)} />
              <span>Enable</span>
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Regime score (risk-on/off)</h3>
            <p className="text-sm text-slate-500">
              Stato di mercato risk-on/risk-off (0-100). Soglia suggerita 50% per richiedere regime almeno neutro.
            </p>
          </div>
          <button
            className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setMsRegime(defaults.msRegime);
              setMsRegimeComp("gt");
            }}
          >
            Set default
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="msRegime-comp"
                value="gt"
                checked={msRegimeComp === "gt"}
                onChange={() => setMsRegimeComp("gt")}
              />
              <span>Maggiore di</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="msRegime-comp"
                value="lt"
                checked={msRegimeComp === "lt"}
                onChange={() => setMsRegimeComp("lt")}
              />
              <span>Minore di</span>
            </label>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={msRegime}
            onChange={(e) => setMsRegime(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0</span>
            <span className="text-sm font-semibold text-slate-800">{msRegime}%</span>
            <span>100</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Condizione: {msRegimeComp === "gt" ? ">" : "<"} {msRegime}%</span>
            <label className="inline-flex items-center gap-1 text-slate-600">
              <input type="checkbox" checked={enabledMsRegime} onChange={(e) => setEnabledMsRegime(e.target.checked)} />
              <span>Enable</span>
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Correlazione penalità max</h3>
            <p className="text-sm text-slate-500">
              Penalità massima per alta correlazione in mercato debole (0-100). Un limite massimo suggerito è 40%.
            </p>
          </div>
          <button
            className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setMsCorrPenaltyMax(defaults.msCorrPenaltyMax);
              setMsCorrPenaltyComp("lt");
            }}
          >
            Set default
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="msCorrPenalty-comp"
                value="gt"
                checked={msCorrPenaltyComp === "gt"}
                onChange={() => setMsCorrPenaltyComp("gt")}
              />
              <span>Maggiore di</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="msCorrPenalty-comp"
                value="lt"
                checked={msCorrPenaltyComp === "lt"}
                onChange={() => setMsCorrPenaltyComp("lt")}
              />
              <span>Minore di</span>
            </label>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={msCorrPenaltyMax}
            onChange={(e) => setMsCorrPenaltyMax(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0</span>
            <span className="text-sm font-semibold text-slate-800">{msCorrPenaltyMax}%</span>
            <span>100</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Condizione: {msCorrPenaltyComp === "gt" ? ">" : "<"} {msCorrPenaltyMax}%</span>
            <label className="inline-flex items-center gap-1 text-slate-600">
              <input type="checkbox" checked={enabledMsCorr} onChange={(e) => setEnabledMsCorr(e.target.checked)} />
              <span>Enable</span>
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Volatilità sicura (mr_vol_safe)</h3>
            <p className="text-sm text-slate-500">
              Quanta parte della volatilità è considerata “safe” (0-100). Soglia suggerita &gt; 55% per privilegiare
              bassa volatilità relativa.
            </p>
          </div>
          <button
            className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setMrVolSafe(defaults.mrVolSafe);
              setMrVolSafeComp("gt");
            }}
          >
            Set default
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="mrVolSafe-comp"
                value="gt"
                checked={mrVolSafeComp === "gt"}
                onChange={() => setMrVolSafeComp("gt")}
              />
              <span>Maggiore di</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="mrVolSafe-comp"
                value="lt"
                checked={mrVolSafeComp === "lt"}
                onChange={() => setMrVolSafeComp("lt")}
              />
              <span>Minore di</span>
            </label>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={mrVolSafe}
            onChange={(e) => setMrVolSafe(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0</span>
            <span className="text-sm font-semibold text-slate-800">{mrVolSafe}%</span>
            <span>100</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Condizione: {mrVolSafeComp === "gt" ? ">" : "<"} {mrVolSafe}%</span>
            <label className="inline-flex items-center gap-1 text-slate-600">
              <input type="checkbox" checked={enabledMrVol} onChange={(e) => setEnabledMrVol(e.target.checked)} />
              <span>Enable</span>
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Drawdown sicuro (mr_dd_safe)</h3>
            <p className="text-sm text-slate-500">
              Tolleranza al drawdown recente (0-100). Valori alti indicano drawdown contenuto; soglia esempio &gt; 55%.
            </p>
          </div>
          <button
            className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setMrDdSafe(defaults.mrDdSafe);
              setMrDdSafeComp("gt");
            }}
          >
            Set default
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="mrDdSafe-comp"
                value="gt"
                checked={mrDdSafeComp === "gt"}
                onChange={() => setMrDdSafeComp("gt")}
              />
              <span>Maggiore di</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="mrDdSafe-comp"
                value="lt"
                checked={mrDdSafeComp === "lt"}
                onChange={() => setMrDdSafeComp("lt")}
              />
              <span>Minore di</span>
            </label>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={mrDdSafe}
            onChange={(e) => setMrDdSafe(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0</span>
            <span className="text-sm font-semibold text-slate-800">{mrDdSafe}%</span>
            <span>100</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Condizione: {mrDdSafeComp === "gt" ? ">" : "<"} {mrDdSafe}%</span>
            <label className="inline-flex items-center gap-1 text-slate-600">
              <input type="checkbox" checked={enabledMrDd} onChange={(e) => setEnabledMrDd(e.target.checked)} />
              <span>Enable</span>
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Gap sicuro (mr_gap_safe)</h3>
            <p className="text-sm text-slate-500">
              Tolleranza ai gap di prezzo (0-100). Valori alti indicano gap contenuti; soglia suggerita &gt; 55%.
            </p>
          </div>
          <button
            className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setMrGapSafe(defaults.mrGapSafe);
              setMrGapSafeComp("gt");
            }}
          >
            Set default
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="mrGapSafe-comp"
                value="gt"
                checked={mrGapSafeComp === "gt"}
                onChange={() => setMrGapSafeComp("gt")}
              />
              <span>Maggiore di</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="mrGapSafe-comp"
                value="lt"
                checked={mrGapSafeComp === "lt"}
                onChange={() => setMrGapSafeComp("lt")}
              />
              <span>Minore di</span>
            </label>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={mrGapSafe}
            onChange={(e) => setMrGapSafe(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0</span>
            <span className="text-sm font-semibold text-slate-800">{mrGapSafe}%</span>
            <span>100</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Condizione: {mrGapSafeComp === "gt" ? ">" : "<"} {mrGapSafe}%</span>
            <label className="inline-flex items-center gap-1 text-slate-600">
              <input type="checkbox" checked={enabledMrGap} onChange={(e) => setEnabledMrGap(e.target.checked)} />
              <span>Enable</span>
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Trend sicuro (mr_trend_safe)</h3>
            <p className="text-sm text-slate-500">
              Sicurezza del trend (0-100). Valori alti indicano trend favorevole; soglia esempio &gt; 55%.
            </p>
          </div>
          <button
            className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setMrTrendSafe(defaults.mrTrendSafe);
              setMrTrendSafeComp("gt");
            }}
          >
            Set default
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="mrTrendSafe-comp"
                value="gt"
                checked={mrTrendSafeComp === "gt"}
                onChange={() => setMrTrendSafeComp("gt")}
              />
              <span>Maggiore di</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="mrTrendSafe-comp"
                value="lt"
                checked={mrTrendSafeComp === "lt"}
                onChange={() => setMrTrendSafeComp("lt")}
              />
              <span>Minore di</span>
            </label>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={mrTrendSafe}
            onChange={(e) => setMrTrendSafe(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0</span>
            <span className="text-sm font-semibold text-slate-800">{mrTrendSafe}%</span>
            <span>100</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Condizione: {mrTrendSafeComp === "gt" ? ">" : "<"} {mrTrendSafe}%</span>
            <label className="inline-flex items-center gap-1 text-slate-600">
              <input
                type="checkbox"
                checked={enabledMrTrend}
                onChange={(e) => setEnabledMrTrend(e.target.checked)}
              />
              <span>Enable</span>
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Volume spike (vol_spike)</h3>
            <p className="text-sm text-slate-500">
              Intensità dello spike di volume (0-100). Soglia di partenza 60% per richiedere volumi sopra la media.
            </p>
          </div>
          <button
            className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setVolSpike(defaults.volSpike);
              setVolSpikeComp("gt");
            }}
          >
            Set default
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="volSpike-comp"
                value="gt"
                checked={volSpikeComp === "gt"}
                onChange={() => setVolSpikeComp("gt")}
              />
              <span>Maggiore di</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="volSpike-comp"
                value="lt"
                checked={volSpikeComp === "lt"}
                onChange={() => setVolSpikeComp("lt")}
              />
              <span>Minore di</span>
            </label>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={volSpike}
            onChange={(e) => setVolSpike(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0</span>
            <span className="text-sm font-semibold text-slate-800">{volSpike}%</span>
            <span>100</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Condizione: {volSpikeComp === "gt" ? ">" : "<"} {volSpike}%</span>
            <label className="inline-flex items-center gap-1 text-slate-600">
              <input
                type="checkbox"
                checked={enabledVolSpike}
                onChange={(e) => setEnabledVolSpike(e.target.checked)}
              />
              <span>Enable</span>
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Volume direzionale (vol_directional)</h3>
            <p className="text-sm text-slate-500">
              Volume a favore del movimento (0-100). Soglia consigliata &gt; 55% per preferire volumi che spingono il prezzo.
            </p>
          </div>
          <button
            className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setVolDirectional(defaults.volDirectional);
              setVolDirectionalComp("gt");
            }}
          >
            Set default
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="volDirectional-comp"
                value="gt"
                checked={volDirectionalComp === "gt"}
                onChange={() => setVolDirectionalComp("gt")}
              />
              <span>Maggiore di</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="volDirectional-comp"
                value="lt"
                checked={volDirectionalComp === "lt"}
                onChange={() => setVolDirectionalComp("lt")}
              />
              <span>Minore di</span>
            </label>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={volDirectional}
            onChange={(e) => setVolDirectional(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0</span>
            <span className="text-sm font-semibold text-slate-800">{volDirectional}%</span>
            <span>100</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Condizione: {volDirectionalComp === "gt" ? ">" : "<"} {volDirectional}%</span>
            <label className="inline-flex items-center gap-1 text-slate-600">
              <input
                type="checkbox"
                checked={enabledVolDirectional}
                onChange={(e) => setEnabledVolDirectional(e.target.checked)}
              />
              <span>Enable</span>
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Efficienza prezzo/volume (vol_efficiency)</h3>
            <p className="text-sm text-slate-500">
              Quanto il movimento di prezzo è efficiente rispetto al volume (0-100). Soglia esempio &gt; 55%.
            </p>
          </div>
          <button
            className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setVolEfficiency(defaults.volEfficiency);
              setVolEfficiencyComp("gt");
            }}
          >
            Set default
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="volEfficiency-comp"
                value="gt"
                checked={volEfficiencyComp === "gt"}
                onChange={() => setVolEfficiencyComp("gt")}
              />
              <span>Maggiore di</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="volEfficiency-comp"
                value="lt"
                checked={volEfficiencyComp === "lt"}
                onChange={() => setVolEfficiencyComp("lt")}
              />
              <span>Minore di</span>
            </label>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={volEfficiency}
            onChange={(e) => setVolEfficiency(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0</span>
            <span className="text-sm font-semibold text-slate-800">{volEfficiency}%</span>
            <span>100</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Condizione: {volEfficiencyComp === "gt" ? ">" : "<"} {volEfficiency}%</span>
            <label className="inline-flex items-center gap-1 text-slate-600">
              <input
                type="checkbox"
                checked={enabledVolEfficiency}
                onChange={(e) => setEnabledVolEfficiency(e.target.checked)}
              />
              <span>Enable</span>
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Range espansione (vol_range)</h3>
            <p className="text-sm text-slate-500">
              Espansione del range rispetto all&apos;ATR (0-100). Soglia esempio &gt; 55% per preferire range ampi e confermati.
            </p>
          </div>
          <button
            className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setVolRange(defaults.volRange);
              setVolRangeComp("gt");
            }}
          >
            Set default
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="volRange-comp"
                value="gt"
                checked={volRangeComp === "gt"}
                onChange={() => setVolRangeComp("gt")}
              />
              <span>Maggiore di</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="volRange-comp"
                value="lt"
                checked={volRangeComp === "lt"}
                onChange={() => setVolRangeComp("lt")}
              />
              <span>Minore di</span>
            </label>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={volRange}
            onChange={(e) => setVolRange(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0</span>
            <span className="text-sm font-semibold text-slate-800">{volRange}%</span>
            <span>100</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Condizione: {volRangeComp === "gt" ? ">" : "<"} {volRange}%</span>
            <label className="inline-flex items-center gap-1 text-slate-600">
              <input
                type="checkbox"
                checked={enabledVolRange}
                onChange={(e) => setEnabledVolRange(e.target.checked)}
              />
              <span>Enable</span>
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Momentum short – Return (mom_short_ret)</h3>
            <p className="text-sm text-slate-500">
              Ritorno vs ATR (0-100). Soglia suggerita &gt; 60% per movimenti significativi rispetto alla volatilità.
            </p>
          </div>
          <button
            className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setMomShortRet(defaults.momShortRet);
              setMomShortRetComp("gt");
            }}
          >
            Set default
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="momShortRet-comp"
                value="gt"
                checked={momShortRetComp === "gt"}
                onChange={() => setMomShortRetComp("gt")}
              />
              <span>Maggiore di</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="momShortRet-comp"
                value="lt"
                checked={momShortRetComp === "lt"}
                onChange={() => setMomShortRetComp("lt")}
              />
              <span>Minore di</span>
            </label>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={momShortRet}
            onChange={(e) => setMomShortRet(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0</span>
            <span className="text-sm font-semibold text-slate-800">{momShortRet}%</span>
            <span>100</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Condizione: {momShortRetComp === "gt" ? ">" : "<"} {momShortRet}%</span>
            <label className="inline-flex items-center gap-1 text-slate-600">
              <input
                type="checkbox"
                checked={enabledMomShortRet}
                onChange={(e) => setEnabledMomShortRet(e.target.checked)}
              />
              <span>Enable</span>
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Momentum short – Trend (mom_short_trend)</h3>
            <p className="text-sm text-slate-500">
              Allineamento di trend a breve (0-100). Soglia esempio &gt; 55% per richiedere trend favorevole.
            </p>
          </div>
          <button
            className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setMomShortTrend(defaults.momShortTrend);
              setMomShortTrendComp("gt");
            }}
          >
            Set default
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="momShortTrend-comp"
                value="gt"
                checked={momShortTrendComp === "gt"}
                onChange={() => setMomShortTrendComp("gt")}
              />
              <span>Maggiore di</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="momShortTrend-comp"
                value="lt"
                checked={momShortTrendComp === "lt"}
                onChange={() => setMomShortTrendComp("lt")}
              />
              <span>Minore di</span>
            </label>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={momShortTrend}
            onChange={(e) => setMomShortTrend(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0</span>
            <span className="text-sm font-semibold text-slate-800">{momShortTrend}%</span>
            <span>100</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Condizione: {momShortTrendComp === "gt" ? ">" : "<"} {momShortTrend}%</span>
            <label className="inline-flex items-center gap-1 text-slate-600">
              <input
                type="checkbox"
                checked={enabledMomShortTrend}
                onChange={(e) => setEnabledMomShortTrend(e.target.checked)}
              />
              <span>Enable</span>
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Momentum short – Structure (mom_short_structure)</h3>
            <p className="text-sm text-slate-500">
              Posizionamento del prezzo nel range (0-100). Soglia esempio &gt; 55% per privilegiare struttura favorevole.
            </p>
          </div>
          <button
            className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setMomShortStructure(defaults.momShortStructure);
              setMomShortStructureComp("gt");
            }}
          >
            Set default
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="momShortStructure-comp"
                value="gt"
                checked={momShortStructureComp === "gt"}
                onChange={() => setMomShortStructureComp("gt")}
              />
              <span>Maggiore di</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="momShortStructure-comp"
                value="lt"
                checked={momShortStructureComp === "lt"}
                onChange={() => setMomShortStructureComp("lt")}
              />
              <span>Minore di</span>
            </label>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={momShortStructure}
            onChange={(e) => setMomShortStructure(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0</span>
            <span className="text-sm font-semibold text-slate-800">{momShortStructure}%</span>
            <span>100</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Condizione: {momShortStructureComp === "gt" ? ">" : "<"} {momShortStructure}%</span>
            <label className="inline-flex items-center gap-1 text-slate-600">
              <input
                type="checkbox"
                checked={enabledMomShortStructure}
                onChange={(e) => setEnabledMomShortStructure(e.target.checked)}
              />
              <span>Enable</span>
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Momentum short – RSI (mom_short_rsi)</h3>
            <p className="text-sm text-slate-500">
              Posizione RSI nel range desiderato (0-100). Soglia esempio &gt; 55% per RSI in zona favorevole.
            </p>
          </div>
          <button
            className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setMomShortRsi(defaults.momShortRsi);
              setMomShortRsiComp("gt");
            }}
          >
            Set default
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="momShortRsi-comp"
                value="gt"
                checked={momShortRsiComp === "gt"}
                onChange={() => setMomShortRsiComp("gt")}
              />
              <span>Maggiore di</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="momShortRsi-comp"
                value="lt"
                checked={momShortRsiComp === "lt"}
                onChange={() => setMomShortRsiComp("lt")}
              />
              <span>Minore di</span>
            </label>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={momShortRsi}
            onChange={(e) => setMomShortRsi(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0</span>
            <span className="text-sm font-semibold text-slate-800">{momShortRsi}%</span>
            <span>100</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Condizione: {momShortRsiComp === "gt" ? ">" : "<"} {momShortRsi}%</span>
            <label className="inline-flex items-center gap-1 text-slate-600">
              <input
                type="checkbox"
                checked={enabledMomShortRsi}
                onChange={(e) => setEnabledMomShortRsi(e.target.checked)}
              />
              <span>Enable</span>
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Momentum 1M (mom_1m)</h3>
            <p className="text-sm text-slate-500">
              Momentum a 1 mese (0-100). Soglia esempio &gt; 55% per trend mensile favorevole.
            </p>
          </div>
          <button
            className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setMom1m(defaults.mom1m);
              setMom1mComp("gt");
            }}
          >
            Set default
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="mom1m-comp"
                value="gt"
                checked={mom1mComp === "gt"}
                onChange={() => setMom1mComp("gt")}
              />
              <span>Maggiore di</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="mom1m-comp"
                value="lt"
                checked={mom1mComp === "lt"}
                onChange={() => setMom1mComp("lt")}
              />
              <span>Minore di</span>
            </label>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={mom1m}
            onChange={(e) => setMom1m(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0</span>
            <span className="text-sm font-semibold text-slate-800">{mom1m}%</span>
            <span>100</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Condizione: {mom1mComp === "gt" ? ">" : "<"} {mom1m}%</span>
            <label className="inline-flex items-center gap-1 text-slate-600">
              <input type="checkbox" checked={enabledMom1m} onChange={(e) => setEnabledMom1m(e.target.checked)} />
              <span>Enable</span>
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Momentum 3M (mom_3m)</h3>
            <p className="text-sm text-slate-500">Momentum a 3 mesi (0-100). Soglia esempio &gt; 55%.</p>
          </div>
          <button
            className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setMom3m(defaults.mom3m);
              setMom3mComp("gt");
            }}
          >
            Set default
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="mom3m-comp"
                value="gt"
                checked={mom3mComp === "gt"}
                onChange={() => setMom3mComp("gt")}
              />
              <span>Maggiore di</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="mom3m-comp"
                value="lt"
                checked={mom3mComp === "lt"}
                onChange={() => setMom3mComp("lt")}
              />
              <span>Minore di</span>
            </label>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={mom3m}
            onChange={(e) => setMom3m(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0</span>
            <span className="text-sm font-semibold text-slate-800">{mom3m}%</span>
            <span>100</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Condizione: {mom3mComp === "gt" ? ">" : "<"} {mom3m}%</span>
            <label className="inline-flex items-center gap-1 text-slate-600">
              <input type="checkbox" checked={enabledMom3m} onChange={(e) => setEnabledMom3m(e.target.checked)} />
              <span>Enable</span>
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Momentum 6M (mom_6m)</h3>
            <p className="text-sm text-slate-500">Momentum a 6 mesi (0-100). Soglia esempio &gt; 55%.</p>
          </div>
          <button
            className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setMom6m(defaults.mom6m);
              setMom6mComp("gt");
            }}
          >
            Set default
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="mom6m-comp"
                value="gt"
                checked={mom6mComp === "gt"}
                onChange={() => setMom6mComp("gt")}
              />
              <span>Maggiore di</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="mom6m-comp"
                value="lt"
                checked={mom6mComp === "lt"}
                onChange={() => setMom6mComp("lt")}
              />
              <span>Minore di</span>
            </label>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={mom6m}
            onChange={(e) => setMom6m(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0</span>
            <span className="text-sm font-semibold text-slate-800">{mom6m}%</span>
            <span>100</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Condizione: {mom6mComp === "gt" ? ">" : "<"} {mom6m}%</span>
            <label className="inline-flex items-center gap-1 text-slate-600">
              <input type="checkbox" checked={enabledMom6m} onChange={(e) => setEnabledMom6m(e.target.checked)} />
              <span>Enable</span>
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Momentum 12M (mom_12m)</h3>
            <p className="text-sm text-slate-500">Momentum a 12 mesi (0-100). Soglia esempio &gt; 55%.</p>
          </div>
          <button
            className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setMom12m(defaults.mom12m);
              setMom12mComp("gt");
            }}
          >
            Set default
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="mom12m-comp"
                value="gt"
                checked={mom12mComp === "gt"}
                onChange={() => setMom12mComp("gt")}
              />
              <span>Maggiore di</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="mom12m-comp"
                value="lt"
                checked={mom12mComp === "lt"}
                onChange={() => setMom12mComp("lt")}
              />
              <span>Minore di</span>
            </label>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={mom12m}
            onChange={(e) => setMom12m(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0</span>
            <span className="text-sm font-semibold text-slate-800">{mom12m}%</span>
            <span>100</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Condizione: {mom12mComp === "gt" ? ">" : "<"} {mom12m}%</span>
            <label className="inline-flex items-center gap-1 text-slate-600">
              <input type="checkbox" checked={enabledMom12m} onChange={(e) => setEnabledMom12m(e.target.checked)} />
              <span>Enable</span>
            </label>
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}
