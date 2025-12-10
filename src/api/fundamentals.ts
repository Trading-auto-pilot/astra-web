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
