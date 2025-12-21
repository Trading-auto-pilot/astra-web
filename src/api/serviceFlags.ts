import { env } from "../config/env";

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

export async function fetchServiceFlags(signal?: AbortSignal): Promise<ServiceFlag[]> {
  const token = getToken();
  const response = await fetch(buildUrl("/servicecontrolplane/service-flags"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal,
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    const message = (data as any)?.message ?? (data as any)?.error ?? "Unable to load service flags";
    throw new Error(typeof message === "string" ? message : "Unable to load service flags");
  }

  if (Array.isArray((data as any)?.items)) return (data as any).items as ServiceFlag[];
  if (Array.isArray(data)) return data as ServiceFlag[];
  return [];
}

export async function updateServiceFlag(
  id: number | string,
  payload: Partial<ServiceFlag>
): Promise<ServiceFlag> {
  const token = getToken();
  const response = await fetch(buildUrl(`/servicecontrolplane/service-flags/${id}`), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    const message = (data as any)?.message ?? (data as any)?.error ?? "Unable to update service flag";
    throw new Error(typeof message === "string" ? message : "Unable to update service flag");
  }

  return (data as any)?.item ?? data;
}

// Cachemanager dbLogger helpers
export async function fetchCacheDbLoggerStatus(signal?: AbortSignal): Promise<boolean> {
  const token = getToken();
  const response = await fetch(buildUrl("/cachemanager/dbLogger"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal,
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    const message = (data as any)?.message ?? (data as any)?.error ?? "Unable to load dbLogger status";
    throw new Error(typeof message === "string" ? message : "Unable to load dbLogger status");
  }

  // Supporta payload: { ok: true, data: true } oppure { enabled: true } ecc.
  const payload: any = data;
  const enabled =
    typeof payload?.data === "boolean"
      ? payload.data
      : payload?.data?.enabled ??
        payload?.data?.dbLogEnabled ??
        payload?.enabled ??
        payload?.status ??
        payload?.on;
  return !!enabled;
}

export async function setCacheDbLoggerStatus(enable: boolean): Promise<void> {
  const token = getToken();
  const response = await fetch(buildUrl(`/cachemanager/dbLogger/${enable ? "on" : "off"}`), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    const message = (data as any)?.message ?? (data as any)?.error ?? "Unable to update dbLogger status";
    throw new Error(typeof message === "string" ? message : "Unable to update dbLogger status");
  }
}

export async function fetchCacheLogLevel(signal?: AbortSignal): Promise<string | null> {
  const token = getToken();
  const response = await fetch(buildUrl("/cachemanager/status/logLevel"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal,
  });

  const data = await parseJsonSafely(response);
  if (!response.ok) {
    const message = (data as any)?.message ?? (data as any)?.error ?? "Unable to load log level";
    throw new Error(typeof message === "string" ? message : "Unable to load log level");
  }

  const level =
    (data as any)?.cacheManager ??
    (data as any)?.logLevel ??
    (data as any)?.level ??
    (data as any)?.logging;

  return typeof level === "string" ? level : null;
}

export async function setCacheLogLevel(logLevel: string): Promise<void> {
  const token = getToken();
  const response = await fetch(buildUrl("/cachemanager/status/logLevel"), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ logLevel }),
  });

  const data = await parseJsonSafely(response);
  if (!response.ok) {
    const message = (data as any)?.message ?? (data as any)?.error ?? "Unable to update log level";
    throw new Error(typeof message === "string" ? message : "Unable to update log level");
  }
}

export async function fetchCacheReleaseInfo(signal?: AbortSignal): Promise<ReleaseInfo> {
  const token = getToken();
  const response = await fetch(buildUrl("/cachemanager/release"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal,
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    const message = (data as any)?.message ?? (data as any)?.error ?? "Unable to load release info";
    throw new Error(typeof message === "string" ? message : "Unable to load release info");
  }

  return data as ReleaseInfo;
}

export async function fetchCacheSettings(signal?: AbortSignal): Promise<Record<string, unknown>> {
  const token = getToken();
  const response = await fetch(buildUrl("/cachemanager/settings"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal,
  });

  const data = await parseJsonSafely(response);
  if (!response.ok) {
    const message = (data as any)?.message ?? (data as any)?.error ?? "Unable to load settings";
    throw new Error(typeof message === "string" ? message : "Unable to load settings");
  }

  return (data as any)?.data || {};
}

export async function updateCacheSetting(setting: string, value: unknown): Promise<Record<string, unknown>> {
  const token = getToken();
  const response = await fetch(buildUrl("/cachemanager/settings"), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ setting, value }),
  });

  const data = await parseJsonSafely(response);
  if (!response.ok) {
    const message = (data as any)?.message ?? (data as any)?.error ?? "Unable to update setting";
    throw new Error(typeof message === "string" ? message : "Unable to update setting");
  }

  return (data as any)?.data || {};
}

export async function reloadCacheSettings(): Promise<Record<string, unknown>> {
  const token = getToken();
  const response = await fetch(buildUrl("/cachemanager/settings/reload"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await parseJsonSafely(response);
  if (!response.ok) {
    const message = (data as any)?.message ?? (data as any)?.error ?? "Unable to reload settings";
    throw new Error(typeof message === "string" ? message : "Unable to reload settings");
  }

  // dopo il reload possiamo richiamare GET /settings, ma restituiamo il payload per coerenza
  return (data as any)?.data || {};
}

export async function fetchCacheHealth(signal?: AbortSignal): Promise<Record<string, unknown>> {
  const token = getToken();
  const response = await fetch(buildUrl("/cachemanager/status/health"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal,
  });

  const data = await parseJsonSafely(response);
  if (!response.ok) {
    const message = (data as any)?.message ?? (data as any)?.error ?? "Unable to load health";
    throw new Error(typeof message === "string" ? message : "Unable to load health");
  }
  return data as Record<string, unknown>;
}

export async function fetchCacheCommunicationChannels(
  signal?: AbortSignal
): Promise<CommunicationChannels> {
  const token = getToken();
  const response = await fetch(buildUrl("/cachemanager/status/communicationChannels"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal,
  });

  const data = await parseJsonSafely(response);
  if (!response.ok) {
    const message =
      (data as any)?.message ?? (data as any)?.error ?? "Unable to load communication channels";
    throw new Error(typeof message === "string" ? message : "Unable to load communication channels");
  }

  return (data as any)?.communicationChannels || (data as any)?.channels || {};
}

export async function updateCacheCommunicationChannels(
  payload: CommunicationChannels
): Promise<CommunicationChannels> {
  const token = getToken();
  const response = await fetch(buildUrl("/cachemanager/status/communicationChannels"), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ communicationChannels: payload }),
  });

  const data = await parseJsonSafely(response);
  if (!response.ok) {
    const message =
      (data as any)?.message ?? (data as any)?.error ?? "Unable to update communication channels";
    throw new Error(
      typeof message === "string" ? message : "Unable to update communication channels"
    );
  }

  return (data as any)?.communicationChannels || (data as any)?.channels || payload;
}

// Scheduler equivalents
export async function fetchSchedulerReleaseInfo(signal?: AbortSignal): Promise<ReleaseInfo> {
  const token = getToken();
  const response = await fetch(buildUrl("/scheduler/release"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal,
  });
  const data = await parseJsonSafely(response);
  if (!response.ok) {
    const message = (data as any)?.message ?? (data as any)?.error ?? "Unable to load scheduler release";
    throw new Error(typeof message === "string" ? message : "Unable to load scheduler release");
  }
  return data as ReleaseInfo;
}

export async function fetchSchedulerHealth(signal?: AbortSignal): Promise<Record<string, unknown>> {
  const token = getToken();
  const response = await fetch(buildUrl("/scheduler/status/health"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal,
  });
  const data = await parseJsonSafely(response);
  if (!response.ok) {
    const message = (data as any)?.message ?? (data as any)?.error ?? "Unable to load scheduler health";
    throw new Error(typeof message === "string" ? message : "Unable to load scheduler health");
  }
  return data as Record<string, unknown>;
}

export async function fetchSchedulerCommunicationChannels(
  signal?: AbortSignal
): Promise<CommunicationChannels> {
  const token = getToken();
  const response = await fetch(buildUrl("/scheduler/status/communicationChannels"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal,
  });

  const data = await parseJsonSafely(response);
  if (!response.ok) {
    const message =
      (data as any)?.message ?? (data as any)?.error ?? "Unable to load communication channels";
    throw new Error(typeof message === "string" ? message : "Unable to load communication channels");
  }

  return (data as any)?.communicationChannels || (data as any)?.channels || {};
}

export async function updateSchedulerCommunicationChannels(
  payload: CommunicationChannels
): Promise<CommunicationChannels> {
  const token = getToken();
  const response = await fetch(buildUrl("/scheduler/status/communicationChannels"), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ communicationChannels: payload }),
  });

  const data = await parseJsonSafely(response);
  if (!response.ok) {
    const message =
      (data as any)?.message ?? (data as any)?.error ?? "Unable to update communication channels";
    throw new Error(
      typeof message === "string" ? message : "Unable to update communication channels"
    );
  }

  return (data as any)?.communicationChannels || (data as any)?.channels || payload;
}
