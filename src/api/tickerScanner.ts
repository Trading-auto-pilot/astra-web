import { http, httpClient } from "./httpClient";

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

export type TickerScanJobHistory = {
  id?: number;
  job_id?: string;
  status?: string;
  total_raw_tickers?: number;
  total_processed?: number;
  db_hits?: number;
  new_calculated?: number;
  error?: string | null;
  errors_json?: any;
  params_json?: any;
  started_at?: string;
  finished_at?: string;
  created_at?: string;
  updated_at?: string;
};

export async function fetchTickerScanJobs(signal?: AbortSignal): Promise<TickerScanJob[]> {
  const data = await httpClient<any>("/tickerscanner/scan/jobs", { method: "GET", signal });
  if (Array.isArray(data?.jobs)) return data.jobs as TickerScanJob[];
  if (Array.isArray(data)) return data as TickerScanJob[];
  return [];
}

export async function fetchTickerScanJobHistory(limit = 20): Promise<TickerScanJobHistory[]> {
  const data = await http.get<any>(`/tickerscanner/fundamentals/ticker-scan-jobs?limit=${encodeURIComponent(String(limit))}`);
  if (Array.isArray(data?.data)) return data.data as TickerScanJobHistory[];
  if (Array.isArray(data)) return data as TickerScanJobHistory[];
  return [];
}

export async function deleteTickerScanJobHistory(id: number): Promise<unknown> {
  return http.delete(`/tickerscanner/fundamentals/ticker-scan-jobs/${encodeURIComponent(String(id))}`);
}

export async function startTickerScan(): Promise<unknown> {
  return http.get("/tickerscanner/scan");
}

export async function startTickerScanForce(): Promise<unknown> {
  return http.get("/tickerscanner/scan/force");
}

export async function refreshTickerMomentum(): Promise<unknown> {
  return http.post("/tickerscanner/momentum/refresh");
}

export async function updateMarketDaily(): Promise<unknown> {
  return http.post("/tickerscanner/fundamentals/update-market-daily");
}

export type MarketDailyJob = {
  id: string;
  status?: string;
  createdAt?: string;
  startedAt?: string;
  finishedAt?: string;
  updatedAt?: string;
  totalSymbols?: number;
  processed?: number;
  inserted?: number;
  updated?: number;
  errors?: any[];
  error?: any;
};

export async function fetchMarketDailyJobs(): Promise<MarketDailyJob[]> {
  const data = await http.get<any>("/tickerscanner/fundamentals/update-market-daily");
  if (Array.isArray(data?.jobs)) return data.jobs as MarketDailyJob[];
  if (Array.isArray(data)) return data as MarketDailyJob[];
  return [];
}

export type MarketDailyJobHistory = {
  id?: number;
  job_id?: string;
  status?: string;
  total_symbols?: number;
  processed?: number;
  inserted?: number;
  updated?: number;
  error_count?: number;
  errors_json?: any;
  params_json?: any;
  started_at?: string;
  finished_at?: string;
  created_at?: string;
  updated_at?: string;
};

export async function fetchMarketDailyJobHistory(limit = 20): Promise<MarketDailyJobHistory[]> {
  const data = await http.get<any>(`/tickerscanner/fundamentals/market-daily-jobs?limit=${encodeURIComponent(String(limit))}`);
  if (Array.isArray(data?.data)) return data.data as MarketDailyJobHistory[];
  if (Array.isArray(data)) return data as MarketDailyJobHistory[];
  return [];
}

export async function deleteMarketDailyJobHistory(id: number): Promise<unknown> {
  return http.delete(`/tickerscanner/fundamentals/market-daily-jobs/${encodeURIComponent(String(id))}`);
}

export async function cancelMarketDailyJob(jobId: string): Promise<unknown> {
  return http.delete(`/tickerscanner/fundamentals/update-market-daily/${encodeURIComponent(jobId)}`);
}

export async function cancelTickerScanJob(jobId: string): Promise<unknown> {
  return http.delete(`/tickerscanner/scan/jobs/${encodeURIComponent(jobId)}`);
}

export type UserDailyJob = {
  id: string;
  status?: string;
  createdAt?: string;
  startedAt?: string;
  finishedAt?: string;
  updatedAt?: string;
  processed?: number;
  saved?: number;
  total?: number;
  date?: string;
  pipeId?: number | null;
  errors?: any[];
  error?: any;
};

export type UserDailyScoreJob = {
  id?: number;
  job_id?: string;
  user_id?: number;
  pipe_id?: number | null;
  status?: string;
  target_date?: string;
  model_name?: string;
  model_version?: string;
  total_items?: number;
  saved_items?: number;
  error_count?: number;
  errors_json?: any;
  params_json?: any;
  started_at?: string;
  finished_at?: string;
  created_at?: string;
  updated_at?: string;
};

export async function startUserDailyJob(
  date: string,
  pipeId?: number | null,
  version?: string,
  name?: string
): Promise<{ jobId: string }> {
  const body: Record<string, unknown> = { date };
  if (pipeId !== undefined && pipeId !== null) body.pipeId = pipeId;
  if (version) body.version = version;
  if (name) body.name = name;
  return http.post<{ jobId: string }>("/tickerscanner/fundamentals/user-daily-scores", body);
}

export async function fetchUserDailyJobs(): Promise<UserDailyJob[]> {
  const data = await http.get<any>("/tickerscanner/fundamentals/user-daily-scores");
  if (Array.isArray(data?.jobs)) return data.jobs as UserDailyJob[];
  if (Array.isArray(data)) return data as UserDailyJob[];
  return [];
}

export async function cancelUserDailyJob(jobId: string): Promise<unknown> {
  return http.delete(`/tickerscanner/fundamentals/user-daily-scores/${encodeURIComponent(jobId)}`);
}

export async function fetchUserDailyScoreJobs(limit = 20): Promise<UserDailyScoreJob[]> {
  const data = await http.get<any>(`/tickerscanner/fundamentals/user-daily-score-jobs?limit=${encodeURIComponent(String(limit))}`);
  if (Array.isArray(data?.data)) return data.data as UserDailyScoreJob[];
  if (Array.isArray(data)) return data as UserDailyScoreJob[];
  return [];
}

export async function deleteUserDailyScoreJob(id: number): Promise<unknown> {
  return http.delete(`/tickerscanner/fundamentals/user-daily-score-jobs/${encodeURIComponent(String(id))}`);
}

export async function fetchScoresDailyByUser(pipeId: number, scoreDate: string): Promise<unknown[]> {
  const data = await http.get<any>(`/tickerscanner/fundamentals/scores-daily/by-user/${encodeURIComponent(String(pipeId))}/${encodeURIComponent(scoreDate)}`);
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data)) return data;
  return [];
}

export async function fetchMarketDailyCompare(tradeDate: string): Promise<unknown[]> {
  const data = await http.get<any>(`/tickerscanner/fundamentals/market-daily/compare?trade_date=${encodeURIComponent(tradeDate)}`);
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data)) return data;
  return [];
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
  const data = await http.get<any>("/tickerscanner/fundamentals/users/pipes");
  if (Array.isArray(data?.data)) return data.data as UserPipe[];
  if (Array.isArray(data)) return data as UserPipe[];
  return [];
}
