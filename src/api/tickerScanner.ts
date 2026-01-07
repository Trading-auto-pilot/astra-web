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

export async function updateMarketDaily(): Promise<any> {
  return doRequest("/tickerscanner/fundamentals/update-market-daily", { method: "POST" });
}

export type MarketDailyJob = {
  id: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  totalSymbols?: number;
  processed?: number;
  inserted?: number;
  updated?: number;
  errors?: any[];
  error?: any;
};

export async function fetchMarketDailyJobs(): Promise<MarketDailyJob[]> {
  const data = await doRequest("/tickerscanner/fundamentals/update-market-daily", { method: "GET" });
  if (Array.isArray((data as any)?.jobs)) return (data as any).jobs as MarketDailyJob[];
  if (Array.isArray(data)) return data as MarketDailyJob[];
  return [];
}

export async function cancelMarketDailyJob(jobId: string): Promise<any> {
  return doRequest(`/tickerscanner/fundamentals/update-market-daily/${encodeURIComponent(jobId)}`, {
    method: "DELETE",
  });
}

export async function cancelTickerScanJob(jobId: string): Promise<any> {
  return doRequest(`/tickerscanner/scan/jobs/${encodeURIComponent(jobId)}`, {
    method: "DELETE",
  });
}

export type UserDailyJob = {
  id: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  processed?: number;
  saved?: number;
  total?: number;
  date?: string;
  pipeId?: number | null;
  errors?: any[];
  error?: any;
};

export async function startUserDailyJob(
  date: string,
  pipeId?: number | null,
  version?: string,
  name?: string
): Promise<{ jobId: string }> {
  const body: any = { date };
  if (pipeId !== undefined && pipeId !== null) body.pipeId = pipeId;
  if (version) body.version = version;
  if (name) body.name = name;
  return doRequest("/tickerscanner/fundamentals/user-daily-scores", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function fetchUserDailyJobs(): Promise<UserDailyJob[]> {
  const data = await doRequest("/tickerscanner/fundamentals/user-daily-scores", { method: "GET" });
  if (Array.isArray((data as any)?.jobs)) return (data as any).jobs as UserDailyJob[];
  if (Array.isArray(data)) return data as UserDailyJob[];
  return [];
}

export async function cancelUserDailyJob(jobId: string): Promise<any> {
  return doRequest(`/tickerscanner/fundamentals/user-daily-scores/${encodeURIComponent(jobId)}`, { method: "DELETE" });
}

// Pipes (utili per selezione pipe nella UI)
export type UserPipe = {
  id: number;
  name?: string;
  description?: string;
  enabled?: boolean;
  pipe_id?: number;
};

export async function fetchUserPipes(): Promise<UserPipe[]> {
  const data = await doRequest("/tickerscanner/fundamentals/users/pipes", { method: "GET" });
  if (Array.isArray((data as any)?.data)) return (data as any).data as UserPipe[];
  if (Array.isArray(data)) return data as UserPipe[];
  return [];
}
