import { http, httpClient, buildUrl, parseJsonSafely } from "./httpClient";

export type AdminUser = {
  id?: string;
  username?: string;
  email?: string;
  active?: boolean;
  isService?: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
  [key: string]: unknown;
};

export async function fetchAdminUsers(signal?: AbortSignal): Promise<AdminUser[]> {
  const data = await httpClient<AdminUser[]>("/auth/admin/user", { method: "GET", signal });
  return Array.isArray(data) ? data : [];
}

export async function fetchAdminUserPermissions(userId: string | number, signal?: AbortSignal): Promise<unknown[]> {
  const data = await httpClient<any>(`/auth/admin/user/${userId}/permissions`, { method: "GET", signal });
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.permissions)) return data.permissions;
  return [];
}

export async function createAdminUser(payload: Record<string, unknown>): Promise<AdminUser> {
  return http.post<AdminUser>("/auth/admin/user", payload);
}

export async function updateAdminUser(
  userId: string | number,
  payload: Record<string, unknown>,
  tokenOverride?: string | null
): Promise<AdminUser> {
  // Special case: supports token override for password change flow
  if (tokenOverride) {
    const response = await fetch(buildUrl(`/auth/admin/user/${userId}`), {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenOverride}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await parseJsonSafely(response);
    if (!response.ok) {
      const message = (data as any)?.message ?? "Impossibile aggiornare l'utente";
      throw new Error(typeof message === "string" ? message : "Impossibile aggiornare l'utente");
    }
    return data as AdminUser;
  }
  return http.put<AdminUser>(`/auth/admin/user/${userId}`, payload);
}

export async function updateAdminUserPermission(
  userId: string | number,
  permId: string | number,
  payload: Record<string, unknown>
): Promise<unknown> {
  return http.put(`/auth/admin/user/${userId}/permissions/${permId}`, payload);
}

export async function createAdminUserPermission(userId: string | number, payload: Record<string, unknown>): Promise<unknown> {
  return http.post(`/auth/admin/user/${userId}/permissions`, payload);
}

export async function deleteAdminUserPermission(userId: string | number, permId: string | number): Promise<void> {
  try {
    await http.delete(`/auth/admin/user/${userId}/permissions/${permId}`);
  } catch (err: any) {
    // Idempotent delete: treat missing permission as success.
    if (err?.status === 404) return;
    throw err;
  }
}

export async function deleteAdminUser(userId: string | number): Promise<void> {
  // Try primary endpoint first, then fallback
  try {
    await httpClient("/auth/admin/user", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId }),
    });
  } catch (err: any) {
    // Backward-compatible fallback (some environments expose DELETE on `/auth/admin/user/:id`).
    if (err?.status === 404 || err?.status === 405) {
      await http.delete(`/auth/admin/user/${userId}`);
      return;
    }
    throw err;
  }
}

export type ClientNavigationEntry = {
  id?: string | number;
  user_id?: string | number;
  page?: string;
  created_at?: string;
  [key: string]: unknown;
};

export async function fetchAdminUserClientNavigation(
  userId: string | number,
  signal?: AbortSignal
): Promise<ClientNavigationEntry[]> {
  const data = await httpClient<ClientNavigationEntry[]>(`/auth/admin/user/${userId}/client-nav`, { method: "GET", signal });
  return Array.isArray(data) ? data : [];
}

export async function createAdminUserClientNavigation(
  userId: string | number,
  payload: Record<string, unknown>
): Promise<unknown> {
  return http.post(`/auth/admin/user/${userId}/client-nav`, payload);
}

export async function updateAdminUserClientNavigation(
  userId: string | number,
  navId: string | number,
  payload: Record<string, unknown>
): Promise<unknown> {
  return http.put(`/auth/admin/user/${userId}/client-nav/${navId}`, payload);
}

export async function deleteAdminUserClientNavigation(
  userId: string | number,
  navId: string | number
): Promise<void> {
  try {
    await http.delete(`/auth/admin/user/${userId}/client-nav/${navId}`);
  } catch (err: any) {
    if (err?.status === 404) return;
    throw err;
  }
}
