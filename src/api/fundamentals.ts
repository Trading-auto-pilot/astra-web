import { env } from "../config/env";

export type FundamentalRecord = {
  ticker?: string;
  symbol?: string;
  name?: string;
  sector?: string;
  industry?: string;
  country?: string;
  price?: number;
  marketCap?: number;
  peRatio?: number;
  dividendYield?: number;
  changePercent?: number;
  valuation_score?: number;
  quality_score?: number;
  risk_score?: number;
  momentum_score?: number;
  total_score?: number;
  [key: string]: unknown;
};

const FUNDAMENTALS_ENDPOINT = `${env.apiBaseUrl}/tickerscanner/fundamentals`;
const FMP_VARIANTS_ENDPOINT = "https://financialmodelingprep.com/stable/search-exchange-variants";
const FMP_INCOME_ENDPOINT = "https://financialmodelingprep.com/stable/income-statement";
const FMP_BALANCE_ENDPOINT = "https://financialmodelingprep.com/stable/balance-sheet-statement";
const FMP_CASH_ENDPOINT = "https://financialmodelingprep.com/stable/cash-flow-statement";
const FMP_SCORES_ENDPOINT = "https://financialmodelingprep.com/stable/financial-scores";
const FMP_OWNER_EARNINGS_ENDPOINT = "https://financialmodelingprep.com/stable/owner-earnings";
const FMP_ENTERPRISE_VALUES_ENDPOINT = "https://financialmodelingprep.com/stable/enterprise-values";
const FMP_FINANCIAL_REPORTS_ENDPOINT = "https://financialmodelingprep.com/stable/financial-reports-json";
const FMP_SEGMENT_PRODUCT_ENDPOINT = "https://financialmodelingprep.com/stable/revenue-product-segmentation";
const FMP_SEGMENT_GEOGRAPHIC_ENDPOINT = "https://financialmodelingprep.com/stable/revenue-geographic-segmentation";
const FMP_KEY_METRICS_ENDPOINT = "https://financialmodelingprep.com/stable/key-metrics";
const FMP_KEY_METRICS_TTM_ENDPOINT = "https://financialmodelingprep.com/stable/key-metrics-ttm";
const FMP_RATIOS_ENDPOINT = "https://financialmodelingprep.com/stable/ratios";
const FMP_RATIOS_TTM_ENDPOINT = "https://financialmodelingprep.com/stable/ratios-ttm";
const FMP_ARTICLES_ENDPOINT = "https://financialmodelingprep.com/stable/fmp-articles";
const FMP_GENERAL_LATEST_ENDPOINT = "https://financialmodelingprep.com/stable/news/general-latest";
const FMP_STOCK_LATEST_ENDPOINT = "https://financialmodelingprep.com/stable/news/stock-latest";
const FMP_STOCK_SEARCH_ENDPOINT = "https://financialmodelingprep.com/stable/news/stock";
const FMP_EOD_LIGHT_ENDPOINT = "https://financialmodelingprep.com/stable/historical-price-eod/light";

const parseJsonSafely = async (response: Response) => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return text;
  }
};

const extractRecords = (payload: any): FundamentalRecord[] => {
  if (Array.isArray(payload)) return payload as FundamentalRecord[];
  if (payload && typeof payload === "object") {
    if (Array.isArray((payload as any).data)) return (payload as any).data as FundamentalRecord[];
    if (Array.isArray((payload as any).results)) return (payload as any).results as FundamentalRecord[];
  }
  return [];
};

export async function fetchFundamentals(): Promise<FundamentalRecord[]> {
  const token =
    typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;

  const response = await fetch(FUNDAMENTALS_ENDPOINT, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    const message = (data as any)?.message ?? "Unable to load fundamentals";
    throw new Error(typeof message === "string" ? message : "Unable to load fundamentals");
  }

  return extractRecords(data);
}

export async function fetchFmpVariant(symbol: string, signal?: AbortSignal): Promise<any | null> {
  if (!env.fmpApiKey) {
    throw new Error("Missing FMP API key");
  }

  const url = `${FMP_VARIANTS_ENDPOINT}?symbol=${encodeURIComponent(symbol)}&apikey=${env.fmpApiKey}`;

  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error("FMP search failed");
  }
  const data = await res.json();
  if (!Array.isArray(data) || !data.length) return null;
  // Prefer exact symbol if present; otherwise first result.
  const exact = data.find(
    (item: any) => typeof item?.symbol === "string" && item.symbol.toUpperCase() === symbol.toUpperCase()
  );
  return exact ?? data[0] ?? null;
}

export async function fetchFmpIncomeStatement(symbol: string, signal?: AbortSignal): Promise<any[]> {
  if (!env.fmpApiKey) {
    throw new Error("Missing FMP API key");
  }

  const url = `${FMP_INCOME_ENDPOINT}?symbol=${encodeURIComponent(symbol)}&apikey=${env.fmpApiKey}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error("FMP income statement fetch failed");
  }
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data;
}

export async function fetchFmpBalanceSheet(symbol: string, signal?: AbortSignal): Promise<any[]> {
  if (!env.fmpApiKey) {
    throw new Error("Missing FMP API key");
  }

  const url = `${FMP_BALANCE_ENDPOINT}?symbol=${encodeURIComponent(symbol)}&apikey=${env.fmpApiKey}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error("FMP balance sheet fetch failed");
  }
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data;
}

export async function fetchFmpCashFlow(symbol: string, signal?: AbortSignal): Promise<any[]> {
  if (!env.fmpApiKey) {
    throw new Error("Missing FMP API key");
  }

  const url = `${FMP_CASH_ENDPOINT}?symbol=${encodeURIComponent(symbol)}&apikey=${env.fmpApiKey}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error("FMP cash flow fetch failed");
  }
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data;
}

export async function fetchFmpFinancialScores(symbol: string, signal?: AbortSignal): Promise<any[]> {
  if (!env.fmpApiKey) {
    throw new Error("Missing FMP API key");
  }

  const url = `${FMP_SCORES_ENDPOINT}?symbol=${encodeURIComponent(symbol)}&apikey=${env.fmpApiKey}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error("FMP financial scores fetch failed");
  }
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data;
}

export async function fetchFmpOwnerEarnings(symbol: string, signal?: AbortSignal): Promise<any[]> {
  if (!env.fmpApiKey) {
    throw new Error("Missing FMP API key");
  }

  const url = `${FMP_OWNER_EARNINGS_ENDPOINT}?symbol=${encodeURIComponent(symbol)}&apikey=${env.fmpApiKey}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error("FMP owner earnings fetch failed");
  }
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data;
}

export async function fetchFmpEnterpriseValues(symbol: string, signal?: AbortSignal): Promise<any[]> {
  if (!env.fmpApiKey) {
    throw new Error("Missing FMP API key");
  }

  const url = `${FMP_ENTERPRISE_VALUES_ENDPOINT}?symbol=${encodeURIComponent(symbol)}&apikey=${env.fmpApiKey}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error("FMP enterprise values fetch failed");
  }
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data;
}

export async function fetchFmpFinancialReports(symbol: string, signal?: AbortSignal): Promise<any[]> {
  if (!env.fmpApiKey) {
    throw new Error("Missing FMP API key");
  }

  // FMP richiede almeno symbol e l'anno da recuperare.
  const lastYear = new Date().getFullYear() - 1;
  const url = `${FMP_FINANCIAL_REPORTS_ENDPOINT}?symbol=${encodeURIComponent(
    symbol
  )}&period=FY&year=${lastYear}&apikey=${env.fmpApiKey}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "FMP financial reports fetch failed");
  }
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (Array.isArray((data as any)?.items)) return (data as any).items;
  return [];
}

export async function fetchFmpRevenueProductSegmentation(symbol: string, signal?: AbortSignal): Promise<any[]> {
  if (!env.fmpApiKey) {
    throw new Error("Missing FMP API key");
  }

  const url = `${FMP_SEGMENT_PRODUCT_ENDPOINT}?symbol=${encodeURIComponent(symbol)}&apikey=${env.fmpApiKey}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "FMP product segmentation fetch failed");
  }
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (Array.isArray((data as any)?.data)) return (data as any).data;
  return [];
}

export async function fetchFmpRevenueGeographicSegmentation(symbol: string, signal?: AbortSignal): Promise<any[]> {
  if (!env.fmpApiKey) {
    throw new Error("Missing FMP API key");
  }

  const url = `${FMP_SEGMENT_GEOGRAPHIC_ENDPOINT}?symbol=${encodeURIComponent(symbol)}&apikey=${env.fmpApiKey}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "FMP geographic segmentation fetch failed");
  }
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (Array.isArray((data as any)?.data)) return (data as any).data;
  return [];
}

export async function fetchFmpKeyMetrics(symbol: string, signal?: AbortSignal): Promise<any[]> {
  if (!env.fmpApiKey) {
    throw new Error("Missing FMP API key");
  }

  const url = `${FMP_KEY_METRICS_ENDPOINT}?symbol=${encodeURIComponent(symbol)}&apikey=${env.fmpApiKey}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error("FMP key metrics fetch failed");
  }
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data;
}

export async function fetchFmpKeyMetricsTtm(symbol: string, signal?: AbortSignal): Promise<any[]> {
  if (!env.fmpApiKey) {
    throw new Error("Missing FMP API key");
  }

  const url = `${FMP_KEY_METRICS_TTM_ENDPOINT}?symbol=${encodeURIComponent(symbol)}&apikey=${env.fmpApiKey}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error("FMP key metrics TTM fetch failed");
  }
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data;
}

export async function fetchFmpRatios(symbol: string, signal?: AbortSignal): Promise<any[]> {
  if (!env.fmpApiKey) {
    throw new Error("Missing FMP API key");
  }

  const url = `${FMP_RATIOS_ENDPOINT}?symbol=${encodeURIComponent(symbol)}&apikey=${env.fmpApiKey}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error("FMP ratios fetch failed");
  }
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data;
}

export async function fetchFmpRatiosTtm(symbol: string, signal?: AbortSignal): Promise<any[]> {
  if (!env.fmpApiKey) {
    throw new Error("Missing FMP API key");
  }

  const url = `${FMP_RATIOS_TTM_ENDPOINT}?symbol=${encodeURIComponent(symbol)}&apikey=${env.fmpApiKey}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error("FMP ratios TTM fetch failed");
  }
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data;
}

export async function fetchFmpArticles(symbol: string, signal?: AbortSignal): Promise<any[]> {
  if (!env.fmpApiKey) {
    throw new Error("Missing FMP API key");
  }

  const url = `${FMP_ARTICLES_ENDPOINT}?symbol=${encodeURIComponent(symbol)}&limit=20&apikey=${env.fmpApiKey}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "FMP articles fetch failed");
  }
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (Array.isArray((data as any)?.data)) return (data as any).data;
  return [];
}

export async function fetchGeneralLatest(symbol: string, signal?: AbortSignal): Promise<any[]> {
  if (!env.fmpApiKey) {
    throw new Error("Missing FMP API key");
  }

  const url = new URL(FMP_GENERAL_LATEST_ENDPOINT);
  url.searchParams.set("page", "0");
  url.searchParams.set("limit", "20");
  url.searchParams.set("apikey", env.fmpApiKey);

  const res = await fetch(url.toString(), { method: "GET", signal });

  const data = await parseJsonSafely(res);
  if (!res.ok) {
    const message = (data as any)?.message ?? "General latest fetch failed";
    throw new Error(typeof message === "string" ? message : "General latest fetch failed");
  }

  if (Array.isArray(data)) return data;
  if (Array.isArray((data as any)?.data)) return (data as any).data;
  if (Array.isArray((data as any)?.results)) return (data as any).results;
  return [];
}

export async function fetchStockLatest(symbol: string, signal?: AbortSignal): Promise<any[]> {
  if (!env.fmpApiKey) {
    throw new Error("Missing FMP API key");
  }

  const url = new URL(FMP_STOCK_LATEST_ENDPOINT);
  url.searchParams.set("page", "0");
  url.searchParams.set("limit", "200");
  url.searchParams.set("apikey", env.fmpApiKey);

  const res = await fetch(url.toString(), { method: "GET", signal });

  const data = await parseJsonSafely(res);
  if (!res.ok) {
    const message = (data as any)?.message ?? "Stock latest fetch failed";
    throw new Error(typeof message === "string" ? message : "Stock latest fetch failed");
  }

  if (Array.isArray(data)) return data;
  if (Array.isArray((data as any)?.data)) return (data as any).data;
  if (Array.isArray((data as any)?.results)) return (data as any).results;
  return [];
}

export async function fetchStockSearch(symbol: string, signal?: AbortSignal): Promise<any[]> {
  if (!env.fmpApiKey) {
    throw new Error("Missing FMP API key");
  }

  const url = `${FMP_STOCK_SEARCH_ENDPOINT}?symbols=${encodeURIComponent(symbol)}&apikey=${env.fmpApiKey}`;

  const res = await fetch(url, { method: "GET", signal });
  const data = await parseJsonSafely(res);

  if (!res.ok) {
    const message = (data as any)?.message ?? "Stock search fetch failed";
    throw new Error(typeof message === "string" ? message : "Stock search fetch failed");
  }

  if (Array.isArray(data)) return data;
  if (Array.isArray((data as any)?.data)) return (data as any).data;
  if (Array.isArray((data as any)?.results)) return (data as any).results;
  return [];
}

export async function fetchFmpEodLight(symbol: string, signal?: AbortSignal): Promise<any[]> {
  if (!env.fmpApiKey) {
    throw new Error("Missing FMP API key");
  }

  const url = `${FMP_EOD_LIGHT_ENDPOINT}?symbol=${encodeURIComponent(symbol)}&apikey=${env.fmpApiKey}`;

  const res = await fetch(url, { method: "GET", signal });
  const data = await parseJsonSafely(res);

  if (!res.ok) {
    const message = (data as any)?.message ?? "EOD light fetch failed";
    throw new Error(typeof message === "string" ? message : "EOD light fetch failed");
  }

  if (Array.isArray(data)) return data;
  if (Array.isArray((data as any)?.historical)) return (data as any).historical;
  if (Array.isArray((data as any)?.results)) return (data as any).results;
  return [];
}
