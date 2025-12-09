import { useEffect, useMemo, useState } from "react";
import { fetchFundamentals, type FundamentalRecord } from "../../api/fundamentals";
import SectionHeader from "../molecules/content/SectionHeader";

type SortKey = "momentum" | "quality" | "risk" | "valuation" | "total";

const getHashSymbol = () => {
  if (typeof window === "undefined") return null;
  const cleaned = window.location.hash.replace(/^#\/?/, "");
  const parts = cleaned.split("/");
  if (parts[0] === "dashboard" && parts[1] === "tickers" && parts[2]) {
    return decodeURIComponent(parts[2]);
  }
  return null;
};

const clampScore = (value: number) => Math.max(0, Math.min(100, value));

const parseScore = (value: unknown): number | null => {
  if (value === null || value === undefined) return null;
  const parsed = typeof value === "string" ? Number(value) : (value as number);
  if (!Number.isFinite(parsed)) return null;
  return clampScore(parsed);
};

const getScoreColor = (value: number) => {
  if (value < 20) return { bar: "bg-red-500", text: "text-red-600" };
  if (value < 40) return { bar: "bg-orange-500", text: "text-orange-600" };
  if (value < 60) return { bar: "bg-amber-400", text: "text-amber-600" };
  if (value < 80) return { bar: "bg-blue-500", text: "text-blue-600" };
  return { bar: "bg-green-500", text: "text-green-600" };
};

export function TickersPage() {
  const [records, setRecords] = useState<FundamentalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("total");
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(() => getHashSymbol());
  const [selectedRecord, setSelectedRecord] = useState<FundamentalRecord | null>(null);
  const [showDetails, setShowDetails] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetchFundamentals()
      .then((data) => {
        if (!active) return;
        setRecords(Array.isArray(data) ? data : []);
      })
      .catch((err: any) => {
        if (!active) return;
        const message =
          err?.message && typeof err.message === "string"
            ? err.message
            : "Errore durante il caricamento dei ticker";
        setError(message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const syncSymbol = () => {
      setSelectedSymbol(getHashSymbol());
    };
    window.addEventListener("hashchange", syncSymbol);
    return () => window.removeEventListener("hashchange", syncSymbol);
  }, []);

  useEffect(() => {
    if (!selectedSymbol) {
      setSelectedRecord(null);
      return;
    }
    const found = records.find((item) => {
      const symbol = (item as any).ticker || (item as any).symbol;
      return typeof symbol === "string" && symbol.toUpperCase() === selectedSymbol.toUpperCase();
    });
    setSelectedRecord(found ?? null);
  }, [records, selectedSymbol]);

  const topRows = useMemo(() => {
    const scoreKeyMap: Record<SortKey, string[]> = {
      momentum: ["momentum_score"],
      quality: ["quality_score"],
      risk: ["risk_score"],
      valuation: ["valuation_score", "valuation_scores"],
      total: ["total_score", "score", "totalScore"],
    };

    const keys = scoreKeyMap[sortKey];

    const getScore = (item: FundamentalRecord, keyList: string[]) => {
      for (const key of keyList) {
        const value = (item as any)[key];
        const parsed = parseScore(value);
        if (parsed !== null) return parsed;
      }
      return null;
    };

    const sorted = [...records].sort((a, b) => {
      const aScore = getScore(a, keys);
      const bScore = getScore(b, keys);
      if (aScore === null && bScore === null) return 0;
      if (aScore === null) return 1;
      if (bScore === null) return -1;
      return bScore - aScore;
    });

    return sorted.slice(0, 50);
  }, [records, sortKey]);

  const detailRows = useMemo(() => {
    if (!selectedRecord) return [];
    const rows: { key: string; value: string }[] = [];

    Object.entries(selectedRecord).forEach(([key, value]) => {
      if (key === "momentum_json") {
        let parsed: any = null;
        if (typeof value === "string") {
          try {
            parsed = JSON.parse(value);
          } catch {
            parsed = value;
          }
        } else {
          parsed = value;
        }

        if (parsed && typeof parsed === "object") {
          Object.entries(parsed as Record<string, unknown>).forEach(([k, v]) => {
            let display = "-";
            if (v === null || v === undefined) display = "-";
            else if (typeof v === "number" || typeof v === "boolean") display = String(v);
            else if (typeof v === "string") display = v;
            else if (Array.isArray(v)) display = v.length ? JSON.stringify(v) : "[]";
            else if (typeof v === "object") display = JSON.stringify(v);
            rows.push({ key: `momentum_json.${k}`, value: display });
          });
          return;
        }
      }

      let display = "-";
      if (value === null || value === undefined) {
        display = "-";
      } else if (typeof value === "number" || typeof value === "boolean") {
        display = String(value);
      } else if (typeof value === "string") {
        display = value;
      } else if (Array.isArray(value)) {
        display = value.length ? JSON.stringify(value) : "[]";
      } else if (typeof value === "object") {
        display = JSON.stringify(value);
      }
      rows.push({ key, value: display });
    });

    return rows;
  }, [selectedRecord]);

  if (selectedSymbol) {
    const name =
      (selectedRecord as any)?.name ||
      (selectedRecord as any)?.companyName ||
      (selectedRecord as any)?.company ||
      selectedSymbol;

    return (
      <div className="space-y-4">
        <SectionHeader
          title="Ticker detail"
          subTitle="Visualizza le informazioni del singolo ticker"
          actionComponent={
            <button
              onClick={() => {
                window.location.hash = "/dashboard/tickers";
                setSelectedSymbol(null);
              }}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              ← Torna alla lista
            </button>
          }
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Ticker
          </div>
          <div className="mt-1 text-3xl font-bold text-slate-900">{selectedSymbol}</div>
          <div className="mt-2 text-xl font-semibold text-slate-800">{name}</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <SectionHeader title="Dettaglio" subTitle="Tutti i campi disponibili per il ticker" />
            <button
              onClick={() => setShowDetails((v) => !v)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {showDetails ? "Nascondi" : "Mostra"}
            </button>
          </div>

          {showDetails && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-white/80 p-4">
              {detailRows.length ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {detailRows.map((row) => (
                    <div
                      key={row.key}
                      className="rounded-lg border border-slate-100 bg-white px-3 py-3 shadow-sm"
                    >
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {row.key}
                      </div>
                      <div className="mt-1 break-words text-sm text-slate-800">{row.value}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-2 py-3 text-sm text-slate-500">Nessun dettaglio disponibile.</div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SectionHeader title="Ticker Scanner" subTitle="Top 50 fundamentals" />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
          <div className="text-sm text-slate-600">
            Osserva i principali ticker con le metriche fondamentali aggiornate.
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "momentum", label: "Best Momentum" },
              { key: "quality", label: "Best Quality" },
              { key: "risk", label: "Best Risk" },
              { key: "valuation", label: "Best Value" },
              { key: "total", label: "Best General" },
            ].map((option) => {
              const active = sortKey === option.key;
              return (
                <button
                  key={option.key}
                  onClick={() => setSortKey(option.key as SortKey)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    active
                      ? "border-slate-800 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center px-6 py-10 text-sm text-slate-500">
            Caricamento in corso...
          </div>
        ) : error ? (
          <div className="px-6 py-4 text-sm text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Ticker</th>
                  <th className="px-4 py-3 font-semibold">Settore</th>
                  <th className="px-4 py-3 font-semibold">Industria</th>
                  <th className="px-4 py-3 font-semibold">Paese</th>
                  <th className="px-4 py-3 font-semibold">Scores</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {topRows.map((item, idx) => {
                  const symbol = item.ticker || item.symbol || "-";

                  const getScore = (...keys: string[]) => {
                    for (const key of keys) {
                      const value = (item as any)[key];
                      if (value !== undefined && value !== null) return value;
                    }
                    return null;
                  };

                  const scoreBadges = [
                    { label: "Valuation", value: getScore("valuation_score", "valuation_scores") },
                    { label: "Quality", value: getScore("quality_score") },
                    { label: "Risk", value: getScore("risk_score") },
                    { label: "Momentum", value: getScore("momentum_score") },
                    { label: "Total", value: getScore("total_score", "score", "totalScore") },
                  ];

                  return (
                    <tr
                      key={`${symbol}-${idx}`}
                      className="cursor-pointer hover:bg-slate-50"
                      onClick={() => {
                        if (symbol && symbol !== "-") {
                          window.location.hash = `#/dashboard/tickers/${encodeURIComponent(symbol)}`;
                          setSelectedSymbol(symbol);
                        }
                      }}
                    >
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        <div className="flex items-center gap-3">
                          {symbol && (
                            <img
                              src={`https://financialmodelingprep.com/image-stock/${symbol}.png`}
                              alt={`${symbol} logo`}
                              className="h-8 w-8 rounded-md border border-slate-200 bg-white object-contain"
                              onError={(e) => {
                                // Hide broken logos without breaking layout.
                                e.currentTarget.style.visibility = "hidden";
                              }}
                            />
                          )}
                          <span>{symbol}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{item.sector || "-"}</td>
                      <td className="px-4 py-3">{item.industry || "-"}</td>
                      <td className="px-4 py-3">{(item as any).country || "-"}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-3">
                          {scoreBadges.map((score) => {
                            const scoreValue = parseScore(score.value);
                            const displayValue =
                              scoreValue !== null ? `${scoreValue.toFixed(1)}%` : "-";
                            const color = scoreValue !== null ? getScoreColor(scoreValue) : null;

                            return (
                              <div key={score.label} className="w-48 min-w-[10rem] space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-slate-500">{score.label}</span>
                                  <span className={`tabular-nums font-semibold ${color?.text ?? "text-slate-700"}`}>
                                    {displayValue}
                                  </span>
                                </div>
                                <div className="h-2 rounded-full bg-slate-100">
                                  <div
                                    className={`h-full rounded-full transition-all duration-200 ${color?.bar ?? "bg-slate-300"}`}
                                    style={{ width: `${scoreValue ?? 0}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!topRows.length && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-500">
                      Nessun dato disponibile.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default TickersPage;
