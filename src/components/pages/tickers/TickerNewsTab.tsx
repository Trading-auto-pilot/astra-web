import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { fetchFmpArticles, fetchGeneralLatest, fetchStockLatest, fetchStockSearch } from "../../../api/fundamentals";

type ProviderTab = "fmp" | "general" | "stockLatest" | "stockSearch";
type NewsStatus = "idle" | "loading" | "error" | "no-key";

type Props = {
  symbol: string | null;
};

type NormalizedArticle = {
  id: string;
  title: string;
  url?: string;
  summary?: string;
  source?: string;
  image?: string;
  symbols?: string[];
  publishedLabel: string;
  ts: number;
};

const PAGE_SIZE = 3;
const summaryClampStyle: CSSProperties = {
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const providers: { id: ProviderTab; label: string }[] = [
  { id: "fmp", label: "FMP" },
  { id: "general", label: "General" },
  { id: "stockLatest", label: "Stock latest" },
  { id: "stockSearch", label: "Search" },
];

const formatDate = (value: string | number | Date | undefined) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export function TickerNewsTab({ symbol }: Props) {
  const [providerTab, setProviderTab] = useState<ProviderTab>("fmp");
  const [page, setPage] = useState(1);
  const [expandedSummaries, setExpandedSummaries] = useState<Set<string>>(new Set());
  const [fmpStatus, setFmpStatus] = useState<NewsStatus>("idle");
  const [fmpArticles, setFmpArticles] = useState<any[]>([]);
  const [generalStatus, setGeneralStatus] = useState<NewsStatus>("idle");
  const [generalArticles, setGeneralArticles] = useState<any[]>([]);
  const [stockStatus, setStockStatus] = useState<NewsStatus>("idle");
  const [stockArticles, setStockArticles] = useState<any[]>([]);
  const [stockSearchStatus, setStockSearchStatus] = useState<NewsStatus>("idle");
  const [stockSearchArticles, setStockSearchArticles] = useState<any[]>([]);

  useEffect(() => {
    // Reset provider when switching ticker.
    setProviderTab("fmp");
    setFmpArticles([]);
    setGeneralArticles([]);
    setFmpStatus("idle");
    setGeneralStatus("idle");
    setStockArticles([]);
    setStockStatus("idle");
    setStockSearchArticles([]);
    setStockSearchStatus("idle");
  }, [symbol]);

  useEffect(() => {
    if (providerTab !== "fmp") return;
    if (!symbol) {
      setFmpArticles([]);
      setFmpStatus("idle");
      return;
    }

    let active = true;
    const controller = new AbortController();
    setFmpStatus("loading");

    fetchFmpArticles(symbol, controller.signal)
      .then((docs) => {
        if (!active) return;
        setFmpArticles(Array.isArray(docs) ? docs : []);
        setFmpStatus("idle");
      })
      .catch((err) => {
        if (!active || err.name === "AbortError") return;
        console.error("FMP articles fetch error", err);
        setFmpArticles([]);
        setFmpStatus(err.message === "Missing FMP API key" ? "no-key" : "error");
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [providerTab, symbol]);

  useEffect(() => {
    if (providerTab !== "general") return;
    if (!symbol) {
      setGeneralArticles([]);
      setGeneralStatus("idle");
      return;
    }

    let active = true;
    const controller = new AbortController();
    setGeneralStatus("loading");

    fetchGeneralLatest(symbol, controller.signal)
      .then((docs) => {
        if (!active) return;
        setGeneralArticles(Array.isArray(docs) ? docs : []);
        setGeneralStatus("idle");
      })
      .catch((err) => {
        if (!active || err.name === "AbortError") return;
        console.error("General articles fetch error", err);
        setGeneralArticles([]);
        setGeneralStatus(err.message === "Missing FMP API key" ? "no-key" : "error");
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [providerTab, symbol]);

  useEffect(() => {
    if (providerTab !== "stockLatest") return;
    if (!symbol) {
      setStockArticles([]);
      setStockStatus("idle");
      return;
    }

    let active = true;
    const controller = new AbortController();
    setStockStatus("loading");

    fetchStockLatest(symbol, controller.signal)
      .then((docs) => {
        if (!active) return;
        setStockArticles(Array.isArray(docs) ? docs : []);
        setStockStatus("idle");
      })
      .catch((err) => {
        if (!active || err.name === "AbortError") return;
        console.error("Stock latest fetch error", err);
        setStockArticles([]);
        setStockStatus(err.message === "Missing FMP API key" ? "no-key" : "error");
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [providerTab, symbol]);

  useEffect(() => {
    if (providerTab !== "stockSearch") return;
    if (!symbol) {
      setStockSearchArticles([]);
      setStockSearchStatus("idle");
      return;
    }

    let active = true;
    const controller = new AbortController();
    setStockSearchStatus("loading");

    fetchStockSearch(symbol, controller.signal)
      .then((docs) => {
        if (!active) return;
        setStockSearchArticles(Array.isArray(docs) ? docs : []);
        setStockSearchStatus("idle");
      })
      .catch((err) => {
        if (!active || err.name === "AbortError") return;
        console.error("Stock search fetch error", err);
        setStockSearchArticles([]);
        setStockSearchStatus(err.message === "Missing FMP API key" ? "no-key" : "error");
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [providerTab, symbol]);

  const currentStatus =
    providerTab === "fmp"
      ? fmpStatus
      : providerTab === "general"
      ? generalStatus
      : providerTab === "stockLatest"
      ? stockStatus
      : stockSearchStatus;
  const currentArticles =
    providerTab === "fmp"
      ? fmpArticles
      : providerTab === "general"
      ? generalArticles
      : providerTab === "stockLatest"
      ? stockArticles
      : stockSearchArticles;

  const normalized = useMemo<NormalizedArticle[]>(() => {
    const list = Array.isArray(currentArticles) ? currentArticles : [];
    const symbolUpper = symbol ? symbol.toUpperCase() : null;

    const toSymbolList = (value: unknown): string[] => {
      const parts: string[] = [];
      const pushParts = (raw: string) => {
        raw
          .split(/[\s,;]+/)
          .map((s) => s.trim())
          .filter(Boolean)
          .forEach((s) => {
            const cleaned = s.includes(":") ? s.split(":").pop() || s : s;
            parts.push(cleaned.toUpperCase());
          });
      };

      if (Array.isArray(value)) {
        value.forEach((val) => {
          if (typeof val === "string") pushParts(val);
        });
      } else if (typeof value === "string") {
        pushParts(value);
      }

      return Array.from(new Set(parts));
    };

    return list
      .map((item, idx) => {
        const published =
          item?.publishedDate || item?.publishDate || item?.date || item?.datetime || item?.createdAt;
        const ts = published ? new Date(published).getTime() : 0;
        const symbolsArr = toSymbolList(
          (item?.symbols ?? item?.tickers ?? item?.ticker ?? item?.symbol ?? []) as string[] | string
        );
        const summary = (item?.text || item?.description || item?.content || "").toString().trim();

        return {
          id: (item?.id && String(item.id)) || item?.url || item?.link || `${symbol ?? "ticker"}-news-${idx}`,
          title: (item?.title || item?.headline || "Senza titolo").toString(),
          url: (item?.url || item?.link) as string | undefined,
          summary,
          source: (item?.site || item?.source || item?.provider || "FMP").toString(),
          image: (item?.image || item?.image_url || item?.thumbnail) as string | undefined,
          symbols: symbolsArr,
          publishedLabel: formatDate(published),
          ts: Number.isFinite(ts) ? ts : 0,
        };
      })
      .filter((article) => {
        if (providerTab !== "stockLatest" && providerTab !== "stockSearch") return true;
        if (!symbolUpper) return true;
        return (article.symbols || []).some((sym) => sym.toUpperCase() === symbolUpper);
      })
      .sort((a, b) => b.ts - a.ts);
  }, [currentArticles, symbol, providerTab]);

  useEffect(() => {
    setPage(1);
    setExpandedSummaries(new Set());
  }, [providerTab, symbol]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(normalized.length / PAGE_SIZE));
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [normalized.length, page]);

  const renderPagination = (currentPage: number, totalPages: number) => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-sm">
        <button
          type="button"
          onClick={() => setPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="rounded-md px-3 py-1 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Precedente
        </button>
        <div className="flex flex-wrap items-center gap-1">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNumber = idx + 1;
            const active = pageNumber === currentPage;
            return (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={`min-w-[2rem] rounded-md px-2 py-1 text-sm font-semibold transition ${
                  active ? "bg-slate-900 text-white" : "bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="rounded-md px-3 py-1 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Successiva
        </button>
      </div>
    );
  };

  const renderContent = (status: NewsStatus, provider: ProviderTab) => {
    if (!symbol) {
      return <div className="text-sm text-slate-600">Seleziona un ticker per vedere le news.</div>;
    }
    const providerLabel =
      provider === "fmp"
        ? "FMP"
        : provider === "stockLatest"
        ? "Stock latest"
        : provider === "stockSearch"
        ? "Search"
        : "Generali";

    if ((provider === "fmp" || provider === "stockLatest" || provider === "stockSearch") && status === "no-key") {
      return (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Imposta la variabile VITE_FMP_API_KEY per mostrare le news.
        </div>
      );
    }
    if (status === "error") {
      return (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          Impossibile recuperare le news {providerLabel.toLowerCase()}.
        </div>
      );
    }
    if (status === "loading") {
      return <div className="text-sm text-slate-600">Caricamento news...</div>;
    }
    if (!normalized.length) {
      return (
        <div className="rounded-md border border-dashed border-slate-200 bg-white/60 px-3 py-2 text-sm text-slate-600">
          Nessuna news disponibile per questo ticker.
        </div>
      );
    }

    const totalPages = Math.max(1, Math.ceil(normalized.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const startIndex = (safePage - 1) * PAGE_SIZE;
    const pageArticles = normalized.slice(startIndex, startIndex + PAGE_SIZE);

    return (
      <div className="space-y-3">
        {renderPagination(safePage, totalPages)}
        {pageArticles.map((article) => {
          const isFmp = providerTab === "fmp";
          const isExpanded = expandedSummaries.has(article.id);
          return (
            <article
              key={article.id}
              className="flex h-full flex-col gap-3 rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                {article.image ? (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="h-16 w-16 rounded-lg border border-slate-200 bg-white object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-500">
                    News
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
                    <span className="font-semibold uppercase tracking-wide text-slate-600">
                      {article.source}
                    </span>
                    <span>{article.publishedLabel}</span>
                  </div>
                  <a
                    href={article.url ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block text-sm font-semibold text-slate-900 hover:text-blue-700"
                  >
                    {article.title}
                  </a>
                  {article.symbols && article.symbols.length > 0 && (
                    <div className="mt-1 text-[11px] text-slate-500">
                      {article.symbols.map((sym) => sym.toUpperCase()).join(" \u2022 ")}
                    </div>
                  )}
                </div>
              </div>
              {article.summary && (
                <div className="space-y-2">
                  <div
                    className="prose prose-sm max-w-none text-slate-700"
                    style={isFmp && !isExpanded ? summaryClampStyle : undefined}
                    dangerouslySetInnerHTML={{ __html: article.summary }}
                  />
                  {isFmp && (
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedSummaries((prev) => {
                          const next = new Set(prev);
                          if (next.has(article.id)) {
                            next.delete(article.id);
                          } else {
                            next.add(article.id);
                          }
                          return next;
                        })
                      }
                      className="text-sm font-semibold text-slate-700 underline decoration-slate-400 underline-offset-4 hover:text-slate-900"
                    >
                      {isExpanded ? "Mostra meno" : "Mostra tutto"}
                    </button>
                  )}
                </div>
              )}
            </article>
          );
        })}
        {renderPagination(safePage, totalPages)}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      <div className="h-full rounded-lg border border-slate-200 bg-white/70 p-3 text-sm text-slate-700">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Provider</div>
        <ul className="mt-2 space-y-1">
          {providers.map((tab) => {
            const active = providerTab === tab.id;
            return (
              <li key={tab.id}>
                <button
                  type="button"
                  onClick={() => setProviderTab(tab.id)}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm font-semibold ${
                    active ? "bg-slate-900 text-white" : "bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="lg:col-span-3 space-y-3">
        {renderContent(currentStatus, providerTab)}
      </div>
    </div>
  );
}

export default TickerNewsTab;
