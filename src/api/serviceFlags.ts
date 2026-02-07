import { http, httpClient } from "./httpClient";

export type ServiceFlag = {
  id: number;
  env: string;
  microservice: string;
  enabled: number | boolean;
  note?: string | null;
  updated_at?: string | null;
};

export type ReleaseInfo = {
  version?: string | null;
  lastUpdate?: string | null;
  microservice?: string | null;
  note?: string[] | null;
};

export type CommunicationChannelConfig = {
  on?: boolean;
  params?: {
    intervalsMs?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export type CommunicationChannels = Record<string, CommunicationChannelConfig>;

export async function fetchServiceFlags(signal?: AbortSignal): Promise<ServiceFlag[]> {
  const data = await httpClient<any>("/servicecontrolplane/service-flags", { method: "GET", signal });
  if (Array.isArray(data?.items)) return data.items as ServiceFlag[];
  if (Array.isArray(data)) return data as ServiceFlag[];
  return [];
}

export async function updateServiceFlag(
  id: number | string,
  payload: Partial<ServiceFlag>
): Promise<ServiceFlag> {
  const data = await http.put<any>(`/servicecontrolplane/service-flags/${id}`, payload);
  return data?.item ?? data;
}

// Cachemanager dbLogger helpers
export async function fetchCacheDbLoggerStatus(signal?: AbortSignal): Promise<boolean> {
  const data = await httpClient<any>("/cachemanager/dbLogger", { method: "GET", signal });
  const enabled =
    typeof data?.data === "boolean"
      ? data.data
      : data?.data?.enabled ??
        data?.data?.dbLogEnabled ??
        data?.enabled ??
        data?.status ??
        data?.on;
  return !!enabled;
}

export async function setCacheDbLoggerStatus(enable: boolean): Promise<void> {
  await http.put(`/cachemanager/dbLogger/${enable ? "on" : "off"}`);
}

export async function fetchCacheLogLevel(signal?: AbortSignal): Promise<string | null> {
  const data = await httpClient<any>("/cachemanager/status/logLevel", { method: "GET", signal });
  const level = data?.cacheManager ?? data?.logLevel ?? data?.level ?? data?.logging;
  return typeof level === "string" ? level : null;
}

export async function setCacheLogLevel(logLevel: string): Promise<void> {
  await http.put("/cachemanager/status/logLevel", { logLevel });
}

export async function fetchCacheReleaseInfo(signal?: AbortSignal): Promise<ReleaseInfo> {
  return httpClient<ReleaseInfo>("/cachemanager/release", { method: "GET", signal });
}

export async function fetchCacheSettings(signal?: AbortSignal): Promise<Record<string, unknown>> {
  const data = await httpClient<any>("/cachemanager/settings", { method: "GET", signal });
  return data?.data || {};
}

export async function updateCacheSetting(setting: string, value: unknown): Promise<Record<string, unknown>> {
  const data = await http.put<any>("/cachemanager/settings", { setting, value });
  return data?.data || {};
}

export async function reloadCacheSettings(): Promise<Record<string, unknown>> {
  const data = await http.post<any>("/cachemanager/settings/reload");
  return data?.data || {};
}

export async function fetchCacheHealth(signal?: AbortSignal): Promise<Record<string, unknown>> {
  return httpClient<Record<string, unknown>>("/cachemanager/status/health", { method: "GET", signal });
}

export async function fetchCacheCommunicationChannels(
  signal?: AbortSignal
): Promise<CommunicationChannels> {
  const data = await httpClient<any>("/cachemanager/status/communicationChannels", { method: "GET", signal });
  return data?.communicationChannels || data?.channels || {};
}

export async function updateCacheCommunicationChannels(
  payload: CommunicationChannels
): Promise<CommunicationChannels> {
  const data = await http.put<any>("/cachemanager/status/communicationChannels", { communicationChannels: payload });
  return data?.communicationChannels || data?.channels || payload;
}

// Scheduler equivalents
export async function fetchSchedulerReleaseInfo(signal?: AbortSignal): Promise<ReleaseInfo> {
  return httpClient<ReleaseInfo>("/scheduler/release", { method: "GET", signal });
}

export async function fetchSchedulerHealth(signal?: AbortSignal): Promise<Record<string, unknown>> {
  return httpClient<Record<string, unknown>>("/scheduler/status/health", { method: "GET", signal });
}

export async function fetchSchedulerCommunicationChannels(
  signal?: AbortSignal
): Promise<CommunicationChannels> {
  const data = await httpClient<any>("/scheduler/status/communicationChannels", { method: "GET", signal });
  return data?.communicationChannels || data?.channels || {};
}

export async function updateSchedulerCommunicationChannels(
  payload: CommunicationChannels
): Promise<CommunicationChannels> {
  const data = await http.put<any>("/scheduler/status/communicationChannels", { communicationChannels: payload });
  return data?.communicationChannels || data?.channels || payload;
}
