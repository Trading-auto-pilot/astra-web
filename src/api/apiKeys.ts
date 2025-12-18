import { env } from "../config/env";

export type ApiKeyRecord = {
  id?: string | number;
  name?: string;
  api_key?: string;
  owner_user_id?: string | number | null;
  description?: string | null;
  is_active?: boolean | number;
  expires_at?: string | null;
  created_at?: string;
  updated_at?: string;
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

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const response = await fetch(buildUrl(path), {
    credentials: "include",
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    const message = (data as any)?.error ?? (data as any)?.message ?? "Request failed";
    throw new Error(typeof message === "string" ? message : "Request failed");
  }

  return data;
}

export async function listApiKeys(): Promise<ApiKeyRecord[]> {
  const data = await apiFetch("/auth/admin/api-keys", { method: "GET" });
  return Array.isArray(data) ? (data as ApiKeyRecord[]) : [];
}

export async function createApiKey(payload: Record<string, unknown>): Promise<ApiKeyRecord> {
  return apiFetch("/auth/admin/api-keys", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updateApiKey(id: string | number, payload: Record<string, unknown>): Promise<ApiKeyRecord> {
  return apiFetch(`/auth/admin/api-keys/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteApiKey(id: string | number): Promise<any> {
  return apiFetch(`/auth/admin/api-keys/${id}`, { method: "DELETE" });
}

export async function listApiKeyPermissions(apiKeyId: string | number): Promise<any[]> {
  const data = await apiFetch(`/auth/admin/api-keys/${apiKeyId}/permissions`, { method: "GET" });
  return Array.isArray(data) ? data : [];
}

export async function createApiKeyPermission(apiKeyId: string | number, payload: Record<string, unknown>): Promise<any> {
  return apiFetch(`/auth/admin/api-keys/${apiKeyId}/permissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updateApiKeyPermission(
  apiKeyId: string | number,
  permId: string | number,
  payload: Record<string, unknown>
): Promise<any> {
  return apiFetch(`/auth/admin/api-keys/${apiKeyId}/permissions/${permId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteApiKeyPermission(apiKeyId: string | number, permId: string | number): Promise<any> {
  return apiFetch(`/auth/admin/api-keys/${apiKeyId}/permissions/${permId}`, { method: "DELETE" });
}
