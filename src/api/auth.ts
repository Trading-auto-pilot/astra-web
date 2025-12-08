import { env } from "../config/env";

export type LoginPayload = {
  username: string;
  password: string;
};

export type UserInfo = {
  id?: string;
  username?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
};

const endpoints = {
  login: "/auth/login",
  me: "/auth/admin/me",
};

const buildUrl = (path: string) => `${env.apiBaseUrl}${path}`;

const parseJsonSafely = async (response: Response) => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return text;
  }
};

const extractToken = (payload: any): string | undefined => {
  if (!payload || typeof payload !== "object") return undefined;
  return (
    payload.accessToken ||
    payload.token ||
    payload.jwt ||
    payload.data?.token ||
    payload.data?.accessToken
  );
};

export async function login(credentials: LoginPayload) {
  const response = await fetch(buildUrl(endpoints.login), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    const message = (data as any)?.message ?? "Credenziali non valide";
    throw new Error(typeof message === "string" ? message : "Credenziali non valide");
  }

  return {
    data,
    token: extractToken(data),
  };
}

export async function fetchCurrentAdmin(token?: string): Promise<UserInfo> {
  const response = await fetch(buildUrl(endpoints.me), {
    method: "GET",
    credentials: "include",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    const message = (data as any)?.message ?? "Impossibile recuperare il profilo";
    throw new Error(typeof message === "string" ? message : "Impossibile recuperare il profilo");
  }

  return data as UserInfo;
}

export async function authenticate(credentials: LoginPayload) {
  const loginResult = await login(credentials);
  const user = await fetchCurrentAdmin(loginResult.token);
  return { user, token: loginResult.token };
}
