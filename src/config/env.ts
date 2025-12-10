const DEFAULT_API_BASE = "https://api.trading.expovin.it";
const normalizeUrl = (url: string) => url.replace(/\/+$/, "");

const apiBaseFromEnv =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  (import.meta.env.VITE_API_BASE as string | undefined) ||
  DEFAULT_API_BASE;

export const env = {
  apiBaseUrl: normalizeUrl(apiBaseFromEnv),
  fmpApiKey: import.meta.env.VITE_FMP_API_KEY as string | "4c69521fc50b653ed6e006f094a265f7",
};

export type EnvConfig = typeof env;
