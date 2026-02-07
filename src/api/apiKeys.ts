import { http } from "./httpClient";

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

export async function listApiKeys(): Promise<ApiKeyRecord[]> {
  const data = await http.get<ApiKeyRecord[]>("/auth/admin/api-keys");
  return Array.isArray(data) ? data : [];
}

export async function createApiKey(payload: Record<string, unknown>): Promise<ApiKeyRecord> {
  return http.post<ApiKeyRecord>("/auth/admin/api-keys", payload);
}

export async function updateApiKey(id: string | number, payload: Record<string, unknown>): Promise<ApiKeyRecord> {
  return http.put<ApiKeyRecord>(`/auth/admin/api-keys/${id}`, payload);
}

export async function deleteApiKey(id: string | number): Promise<unknown> {
  return http.delete(`/auth/admin/api-keys/${id}`);
}

export async function listApiKeyPermissions(apiKeyId: string | number): Promise<unknown[]> {
  const data = await http.get<unknown[]>(`/auth/admin/api-keys/${apiKeyId}/permissions`);
  return Array.isArray(data) ? data : [];
}

export async function createApiKeyPermission(apiKeyId: string | number, payload: Record<string, unknown>): Promise<unknown> {
  return http.post(`/auth/admin/api-keys/${apiKeyId}/permissions`, payload);
}

export async function updateApiKeyPermission(
  apiKeyId: string | number,
  permId: string | number,
  payload: Record<string, unknown>
): Promise<unknown> {
  return http.put(`/auth/admin/api-keys/${apiKeyId}/permissions/${permId}`, payload);
}

export async function deleteApiKeyPermission(apiKeyId: string | number, permId: string | number): Promise<unknown> {
  return http.delete(`/auth/admin/api-keys/${apiKeyId}/permissions/${permId}`);
}
