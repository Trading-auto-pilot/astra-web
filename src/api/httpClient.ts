import { env } from "../config/env";

/**
 * Centralized HTTP client for API requests.
 * Handles authentication, base URL construction, and response parsing.
 */

const AUTH_TOKEN_KEY = "astraai:auth:token";

/**
 * Build full URL from path
 */
export const buildUrl = (path: string): string => `${env.apiBaseUrl}${path}`;

/**
 * Get auth token from localStorage
 */
export const getToken = (): string | null => {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Set auth token in localStorage
 */
export const setToken = (token: string): void => {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

/**
 * Remove auth token from localStorage
 */
export const removeToken = (): void => {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

/**
 * Safely parse JSON response, returning empty object or raw text on failure
 */
export const parseJsonSafely = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return text;
  }
};

/**
 * HTTP Error with status code and response data
 */
export class HttpError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Request options extending RequestInit with additional config
 */
export type HttpClientOptions = RequestInit & {
  /** Skip adding Authorization header */
  skipAuth?: boolean;
  /** Use absolute URL instead of building from base */
  absoluteUrl?: boolean;
};

/**
 * Centralized fetch function with authentication and error handling
 */
export async function httpClient<T = unknown>(
  path: string,
  options: HttpClientOptions = {}
): Promise<T> {
  const { skipAuth, absoluteUrl, ...fetchOptions } = options;

  const url = absoluteUrl ? path : buildUrl(path);
  const token = skipAuth ? null : getToken();

  const response = await fetch(url, {
    credentials: "include",
    ...fetchOptions,
    headers: {
      ...(fetchOptions.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    const message =
      (data as Record<string, unknown>)?.error ??
      (data as Record<string, unknown>)?.message ??
      "Request failed";
    throw new HttpError(
      typeof message === "string" ? message : "Request failed",
      response.status,
      data
    );
  }

  return data as T;
}

/**
 * Convenience methods for common HTTP verbs
 */
export const http = {
  get: <T = unknown>(path: string, options?: HttpClientOptions) =>
    httpClient<T>(path, { ...options, method: "GET" }),

  post: <T = unknown>(path: string, body?: unknown, options?: HttpClientOptions) =>
    httpClient<T>(path, {
      ...options,
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T = unknown>(path: string, body?: unknown, options?: HttpClientOptions) =>
    httpClient<T>(path, {
      ...options,
      method: "PUT",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T = unknown>(path: string, body?: unknown, options?: HttpClientOptions) =>
    httpClient<T>(path, {
      ...options,
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T = unknown>(path: string, options?: HttpClientOptions) =>
    httpClient<T>(path, { ...options, method: "DELETE" }),
};

export default http;
