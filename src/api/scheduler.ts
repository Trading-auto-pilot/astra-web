import { env } from "../config/env";

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

export async function fetchSchedulerJobs(signal?: AbortSignal): Promise<SchedulerJob[]> {
  const token = getToken();
  const response = await fetch(buildUrl("/scheduler/jobs"), {
    method: "GET",
    credentials: "include",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal,
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    const message = (data as any)?.message ?? "Impossibile recuperare i job scheduler";
    throw new Error(typeof message === "string" ? message : "Impossibile recuperare i job scheduler");
  }

  if (Array.isArray((data as any)?.items)) return (data as any).items as SchedulerJob[];
  if (Array.isArray(data)) return data as SchedulerJob[];
  return [];
}

export async function reloadSchedulerJobs(): Promise<void> {
  const token = getToken();
  const response = await fetch(buildUrl("/scheduler/reload"), {
    method: "POST",
    credentials: "include",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    const message = (data as any)?.message ?? "Impossibile ricaricare i job scheduler";
    throw new Error(typeof message === "string" ? message : "Impossibile ricaricare i job scheduler");
  }
}

export async function updateSchedulerJob(
  jobId: string | number,
  payload: Record<string, unknown>
): Promise<any> {
  const token = getToken();
  const response = await fetch(buildUrl(`/scheduler/jobs/${jobId}`), {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    const message = (data as any)?.message ?? "Impossibile aggiornare il job scheduler";
    throw new Error(typeof message === "string" ? message : "Impossibile aggiornare il job scheduler");
  }

  return data;
}

export async function createSchedulerJob(payload: Record<string, unknown>): Promise<any> {
  const token = getToken();
  const response = await fetch(buildUrl("/scheduler/jobs"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    const message = (data as any)?.message ?? "Impossibile creare il job scheduler";
    throw new Error(typeof message === "string" ? message : "Impossibile creare il job scheduler");
  }

  return data;
}

export async function deleteSchedulerJob(jobId: string | number): Promise<any> {
  const token = getToken();
  const response = await fetch(buildUrl(`/scheduler/job/${jobId}`), {
    method: "DELETE",
    credentials: "include",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    const message = (data as any)?.message ?? "Impossibile cancellare il job scheduler";
    throw new Error(typeof message === "string" ? message : "Impossibile cancellare il job scheduler");
  }

  return data;
}
