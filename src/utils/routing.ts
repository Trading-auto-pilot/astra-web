/**
 * Centralized routing utilities for hash-based navigation.
 */

export type RouteId =
  | "landing"
  | "maintenance"
  | "contact"
  | "login"
  | "overview"
  | "dashboard"
  | "admin"
  | "404";

/**
 * Clean hash string by removing leading #/ or #
 */
export const cleanHash = (hash: string): string => {
  return (hash || "").replace(/^#\/?/, "");
};

/**
 * Get hash parts as array
 */
export const getHashParts = (hash: string): string[] => {
  return cleanHash(hash).split("/").filter(Boolean);
};

/**
 * Get current hash from window
 */
export const getCurrentHash = (): string => {
  if (typeof window === "undefined") return "";
  return window.location.hash || "";
};

/**
 * Navigate to a path using hash
 */
export const navigate = (path: string): void => {
  if (typeof window === "undefined") return;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  window.location.hash = normalizedPath;
};

/**
 * Normalize hash to RouteId
 */
export const getRouteId = (hash: string): RouteId => {
  const cleaned = cleanHash(hash) || "landing";
  const segment = cleaned.split(/[/?]/)[0] || "landing";

  switch (segment) {
    case "landing":
      return "landing";
    case "maintenance":
      return "maintenance";
    case "contact":
      return "contact";
    case "login":
      return "login";
    case "overview":
      return "overview";
    case "dashboard":
      return "dashboard";
    case "admin":
      return "admin";
    case "404":
      return "404";
    default:
      return "404";
  }
};

/**
 * Get permission key from hash for access control
 */
export const getPermissionKey = (hash: string): string => {
  const cleaned = cleanHash(hash).replace(/^\/+/, "").replace(/\/+$/, "");
  const parts = cleaned.split(/[/?]/).filter(Boolean);
  const base = parts[0] || "overview";

  if (base === "overview") return "overview";

  if (base === "dashboard") {
    const section = parts[1];
    if (section === "tickers") return "dashboard/tickers";
    return "dashboard";
  }

  if (base === "admin") {
    const section = parts[1];
    if (section === "users") return "admin/users";
    if (section === "scheduler") return "admin/scheduler";
    if (section === "api_key") return "admin/api_key";
    if (section === "microservice") return "admin/microservice";
    return "admin";
  }

  return base;
};

/**
 * Normalize client navigation page for DB storage
 */
export const normalizeClientNavPage = (page: string): string => {
  const trimmed = String(page || "").trim();
  if (!trimmed) return "";

  const cleaned = trimmed.replace(/^#\/?/, "").replace(/^\/+/, "").replace(/\/+$/, "");
  if (!cleaned) return "";

  // Canonical pages
  if (cleaned === "overview") return "overview";
  if (cleaned === "dashboard/*" || cleaned === "dashboard") return "dashboard/*";
  if (cleaned === "dashboard/tickers") return "dashboard/tickers";
  if (cleaned === "admin/*" || cleaned === "admin") return "admin/*";
  if (cleaned === "admin/users") return "admin/users";
  if (cleaned === "admin/scheduler") return "admin/scheduler";
  if (cleaned === "admin/api_key") return "admin/api_key";
  if (cleaned === "admin/microservice") return "admin/microservice";

  // Backward-compatible fallbacks
  if (cleaned === "tickers") return "dashboard/tickers";
  if (cleaned === "users") return "admin/users";
  if (cleaned === "scheduler") return "admin/scheduler";
  if (cleaned === "microservice") return "admin/microservice";
  if (cleaned === "api_key") return "admin/api_key";

  return cleaned;
};

/**
 * Extract slug from microservice route
 * e.g., "#/admin/microservice/market-data-service" -> "market-data-service"
 */
export const getMicroserviceSlug = (hash?: string): string | null => {
  const h = hash ?? getCurrentHash();
  const parts = getHashParts(h);

  if (parts[0] === "admin" && parts[1] === "microservice" && parts[2]) {
    try {
      return decodeURIComponent(parts[2]);
    } catch {
      return parts[2];
    }
  }
  return null;
};

/**
 * Extract ticker symbol from tickers route
 * e.g., "#/dashboard/tickers/AAPL" -> "AAPL"
 */
export const getTickerSymbol = (hash?: string): string | null => {
  const h = hash ?? getCurrentHash();
  const parts = getHashParts(h);

  if (parts[0] === "dashboard" && parts[1] === "tickers" && parts[2]) {
    try {
      return decodeURIComponent(parts[2]);
    } catch {
      return parts[2];
    }
  }
  return null;
};

/**
 * Extract user settings tab from route
 * e.g., "#/dashboard/user-settings/weights" -> "weights"
 */
export const getUserSettingsTab = (hash?: string): string | null => {
  const h = hash ?? getCurrentHash();
  const parts = getHashParts(h);

  if (parts[0] === "dashboard" && parts[1] === "user-settings" && parts[2]) {
    return parts[2];
  }
  return null;
};

/**
 * Check if current route matches a pattern
 */
export const matchRoute = (hash: string, pattern: string): boolean => {
  const hashParts = getHashParts(hash);
  const patternParts = pattern.split("/").filter(Boolean);

  if (patternParts.length > hashParts.length) return false;

  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i] === "*") continue;
    if (patternParts[i] !== hashParts[i]) return false;
  }

  return true;
};
