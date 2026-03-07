const DEFAULT_API_BASE = "https://api.trading.expovin.it";
const DEFAULT_HELP_BASE = "https://help.trading.expovin.it";
const normalizeUrl = (url: string) => url.replace(/\/+$/, "");

const apiBaseFromEnv =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  (import.meta.env.VITE_API_BASE as string | undefined) ||
  DEFAULT_API_BASE;
const helpBaseFromEnv =
  (import.meta.env.VITE_HELP_BASE as string | undefined) ||
  DEFAULT_HELP_BASE;

export const env = {
  apiBaseUrl: normalizeUrl(apiBaseFromEnv),
  helpBase: normalizeUrl(helpBaseFromEnv),
  fmpApiKey: (import.meta.env.VITE_FMP_API_KEY as string) || "",
  appEnv: (import.meta.env.VITE_ENV as string | undefined) || "DEV",
};

export type EnvConfig = typeof env;
