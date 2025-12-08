const DEFAULT_API_BASE = "https://api.trading.expovin.it";

const normalizeUrl = (url: string) => url.replace(/\/+$/, "");

const apiBaseFromEnv =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  (import.meta.env.VITE_API_BASE as string | undefined) ||
  DEFAULT_API_BASE;

export const env = {
  apiBaseUrl: normalizeUrl(apiBaseFromEnv),
};

export type EnvConfig = typeof env;
