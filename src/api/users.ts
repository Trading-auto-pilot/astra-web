import { env } from "../config/env";

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

export async function fetchAdminUsers(signal?: AbortSignal): Promise<AdminUser[]> {
  const token = getToken();
  const response = await fetch(buildUrl("/auth/admin/user"), {
    method: "GET",
    credentials: "include",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal,
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    const message = (data as any)?.message ?? "Impossibile recuperare gli utenti";
    throw new Error(typeof message === "string" ? message : "Impossibile recuperare gli utenti");
  }

  return Array.isArray(data) ? (data as AdminUser[]) : [];
}

export async function fetchAdminUserPermissions(userId: string | number, signal?: AbortSignal): Promise<any[]> {
  const token = getToken();
  const response = await fetch(buildUrl(`/auth/admin/user/${userId}/permissions`), {
    method: "GET",
    credentials: "include",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal,
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    const message = (data as any)?.message ?? "Impossibile recuperare i permessi";
    throw new Error(typeof message === "string" ? message : "Impossibile recuperare i permessi");
  }

  if (Array.isArray(data)) return data as any[];
  if (Array.isArray((data as any)?.permissions)) return (data as any).permissions as any[];
  return [];
}

export async function createAdminUser(payload: Record<string, unknown>): Promise<AdminUser> {
  const token = getToken();
  const response = await fetch(buildUrl("/auth/admin/user"), {
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
    const message = (data as any)?.message ?? "Impossibile creare l'utente";
    throw new Error(typeof message === "string" ? message : "Impossibile creare l'utente");
  }

  return data as AdminUser;
}

export async function updateAdminUser(userId: string | number, payload: Record<string, unknown>): Promise<AdminUser> {
  const token = getToken();
  const response = await fetch(buildUrl(`/auth/admin/user/${userId}`), {
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
    const message = (data as any)?.message ?? "Impossibile aggiornare l'utente";
    throw new Error(typeof message === "string" ? message : "Impossibile aggiornare l'utente");
  }

  return data as AdminUser;
}

export async function updateAdminUserPermission(
  userId: string | number,
  permId: string | number,
  payload: Record<string, unknown>
): Promise<any> {
  const token = getToken();
  const response = await fetch(buildUrl(`/auth/admin/user/${userId}/permissions/${permId}`), {
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
    const message = (data as any)?.message ?? "Impossibile aggiornare il permesso";
    throw new Error(typeof message === "string" ? message : "Impossibile aggiornare il permesso");
  }

  return data;
}

export async function createAdminUserPermission(userId: string | number, payload: Record<string, unknown>): Promise<any> {
  const token = getToken();
  const response = await fetch(buildUrl(`/auth/admin/user/${userId}/permissions`), {
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
    const message = (data as any)?.message ?? "Impossibile creare il permesso";
    throw new Error(typeof message === "string" ? message : "Impossibile creare il permesso");
  }

  return data;
}

export async function deleteAdminUserPermission(userId: string | number, permId: string | number): Promise<void> {
  const token = getToken();
  const response = await fetch(buildUrl(`/auth/admin/user/${userId}/permissions/${permId}`), {
    method: "DELETE",
    credentials: "include",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  // Idempotent delete: treat missing permission as success.
  if (response.status === 404) return;

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    const message = (data as any)?.message ?? "Impossibile cancellare il permesso";
    throw new Error(typeof message === "string" ? message : "Impossibile cancellare il permesso");
  }
}

export async function deleteAdminUser(userId: string | number): Promise<void> {
  const token = getToken();
  const baseHeaders = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(buildUrl("/auth/admin/user"), {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...baseHeaders,
    },
    body: JSON.stringify({ id: userId }),
  });

  // Backward-compatible fallback (some environments expose DELETE on `/auth/admin/user/:id`).
  if (response.status === 404 || response.status === 405) {
    const fallback = await fetch(buildUrl(`/auth/admin/user/${userId}`), {
      method: "DELETE",
      credentials: "include",
      headers: baseHeaders,
    });
    const fallbackData = await parseJsonSafely(fallback);
    if (!fallback.ok) {
      const message = (fallbackData as any)?.message ?? "Impossibile cancellare l'utente";
      throw new Error(typeof message === "string" ? message : "Impossibile cancellare l'utente");
    }
    return;
  }

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    const message = (data as any)?.message ?? "Impossibile cancellare l'utente";
    throw new Error(typeof message === "string" ? message : "Impossibile cancellare l'utente");
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
  const token = getToken();
  const response = await fetch(buildUrl(`/auth/admin/user/${userId}/client-nav`), {
    method: "GET",
    credentials: "include",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal,
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    const message = (data as any)?.message ?? "Impossibile recuperare la navigazione";
    throw new Error(typeof message === "string" ? message : "Impossibile recuperare la navigazione");
  }

  return Array.isArray(data) ? (data as ClientNavigationEntry[]) : [];
}

export async function createAdminUserClientNavigation(
  userId: string | number,
  payload: Record<string, unknown>
): Promise<any> {
  const token = getToken();
  const response = await fetch(buildUrl(`/auth/admin/user/${userId}/client-nav`), {
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
    const message = (data as any)?.message ?? "Impossibile creare la navigazione";
    throw new Error(typeof message === "string" ? message : "Impossibile creare la navigazione");
  }

  return data;
}

export async function updateAdminUserClientNavigation(
  userId: string | number,
  navId: string | number,
  payload: Record<string, unknown>
): Promise<any> {
  const token = getToken();
  const response = await fetch(buildUrl(`/auth/admin/user/${userId}/client-nav/${navId}`), {
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
    const message = (data as any)?.message ?? "Impossibile aggiornare la navigazione";
    throw new Error(typeof message === "string" ? message : "Impossibile aggiornare la navigazione");
  }

  return data;
}

export async function deleteAdminUserClientNavigation(
  userId: string | number,
  navId: string | number
): Promise<void> {
  const token = getToken();
  const response = await fetch(buildUrl(`/auth/admin/user/${userId}/client-nav/${navId}`), {
    method: "DELETE",
    credentials: "include",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (response.status === 404) return;

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    const message = (data as any)?.message ?? "Impossibile cancellare la navigazione";
    throw new Error(typeof message === "string" ? message : "Impossibile cancellare la navigazione");
  }
}
