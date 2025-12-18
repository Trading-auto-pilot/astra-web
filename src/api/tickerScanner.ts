import { env } from "../config/env";

export type TickerScanJob = {
  id: string;
  status?: string;
  totalRawTickers?: number;
  totalProcessed?: number;
  dbHits?: number;
  newCalculated?: number;
  error?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

const buildUrl = (path: string) => `${env.apiBaseUrl}${path}`;

const getToken = () => {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem("astraai:auth:token");
};

const parseJsonSafely = async (response: Response) => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return text;
  }
};

export async function fetchTickerScanJobs(signal?: AbortSignal): Promise<TickerScanJob[]> {
  const token = getToken();
  const response = await fetch(buildUrl("/tickerscanner/scan/jobs"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal,
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    const message = (data as any)?.message ?? (data as any)?.error ?? "Unable to load scan jobs";
    throw new Error(typeof message === "string" ? message : "Unable to load scan jobs");
  }

  if (Array.isArray((data as any)?.jobs)) return (data as any).jobs as TickerScanJob[];
  if (Array.isArray(data)) return data as TickerScanJob[];
  return [];
}

const doRequest = async (path: string, options: RequestInit = {}) => {
  const token = getToken();
  const response = await fetch(buildUrl(path), {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await parseJsonSafely(response);
  if (!response.ok) {
    const message = (data as any)?.message ?? (data as any)?.error ?? "Request failed";
    throw new Error(typeof message === "string" ? message : "Request failed");
  }
  return data;
};

export async function startTickerScan(): Promise<any> {
  return doRequest("/tickerscanner/scan", { method: "GET" });
}

export async function startTickerScanForce(): Promise<any> {
  return doRequest("/tickerscanner/scan/force", { method: "GET" });
}

export async function refreshTickerMomentum(): Promise<any> {
  return doRequest("/tickerscanner/momentum/refresh", { method: "POST" });
}
