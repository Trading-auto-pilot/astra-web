import { http, httpClient } from "./httpClient";

export type SchedulerRetry = {
  maxAttempts?: number | string;
  backoffMs?: number | string;
};

export type SchedulerJob = {
  id?: number | string;
  jobKey?: string;
  description?: string;
  enabled?: boolean;
  openMarket?: boolean;
  exchanges?: string[];
  method?: string;
  url?: string;
  timezone?: string;
  timeoutMs?: number | string;
  retry?: SchedulerRetry;
  rules?: Array<Record<string, unknown>>;
  [key: string]: unknown;
};

export async function fetchSchedulerJobs(signal?: AbortSignal): Promise<SchedulerJob[]> {
  const data = await httpClient<any>("/scheduler/jobs?include_disabled=1", { method: "GET", signal });
  if (Array.isArray(data?.items)) return data.items as SchedulerJob[];
  if (Array.isArray(data)) return data as SchedulerJob[];
  return [];
}

export async function reloadSchedulerJobs(): Promise<void> {
  await http.post("/scheduler/reload");
}

export async function updateSchedulerJob(
  jobId: string | number,
  payload: Record<string, unknown>
): Promise<unknown> {
  return http.put(`/scheduler/jobs/${jobId}`, payload);
}

export async function createSchedulerJob(payload: Record<string, unknown>): Promise<unknown> {
  return http.post("/scheduler/jobs", payload);
}

export async function deleteSchedulerJob(jobId: string | number): Promise<unknown> {
  return http.delete(`/scheduler/job/${jobId}`);
}
