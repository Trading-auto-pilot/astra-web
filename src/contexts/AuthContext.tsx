import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { authenticate, fetchCurrentAdmin, type LoginPayload, type UserInfo } from "../api/auth";

// ============================================================================
// Types
// ============================================================================

type NavEntry = {
  page?: string;
  [key: string]: unknown;
};

type AuthState = {
  user: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  allowedPages: string[];
  navEntries: NavEntry[];
};

type AuthContextValue = AuthState & {
  login: (credentials: LoginPayload) => Promise<void>;
  logout: () => void;
  checkAuth: (token?: string) => Promise<string[]>;
};

// ============================================================================
// Constants
// ============================================================================

const TOKEN_KEY = "astraai:auth:token";
const NAV_CACHE_KEY = "astraai:auth:clientNavigation";
const USERNAME_CACHE_KEY = "astraai:auth:username";
const USERNAME_LOGIN_KEY = "astraai:login:username";

// ============================================================================
// Helpers
// ============================================================================

const normalizeClientNavPage = (page: string): string => {
  const trimmed = String(page || "").trim();
  if (!trimmed) return "";
  return trimmed
    .replace(/^#\/?/, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
};

const normalizeAllowedPages = (rawPages: string[]): string[] => {
  const normalized = rawPages
    .map((p) => normalizeClientNavPage(p))
    .filter(Boolean);

  const expanded: string[] = [...normalized];

  // Wildcard support: dashboard/* enables all dashboard pages.
  if (normalized.includes("dashboard/*") || normalized.includes("dashboard")) {
    if (!expanded.includes("dashboard/tickers")) expanded.push("dashboard/tickers");
    if (!expanded.includes("dashboard/user_tickers")) expanded.push("dashboard/user_tickers");
    if (!expanded.includes("dashboard/user-settings")) expanded.push("dashboard/user-settings");
  }

  // Alias normalization for dashboard pages.
  if (expanded.includes("dashboard/user-tickers") && !expanded.includes("dashboard/user_tickers")) {
    expanded.push("dashboard/user_tickers");
  }
  if (expanded.includes("dashboard/user_tickers") && !expanded.includes("dashboard/user-tickers")) {
    expanded.push("dashboard/user-tickers");
  }
  if (expanded.includes("dashboard/user_settings") && !expanded.includes("dashboard/user-settings")) {
    expanded.push("dashboard/user-settings");
  }
  if (expanded.includes("dashboard/user-settings") && !expanded.includes("dashboard/user_settings")) {
    expanded.push("dashboard/user_settings");
  }

  if (normalized.includes("admin/*") || normalized.includes("admin")) {
    if (!expanded.includes("admin/users")) expanded.push("admin/users");
    if (!expanded.includes("admin/scheduler")) expanded.push("admin/scheduler");
    if (!expanded.includes("admin/api_key")) expanded.push("admin/api_key");
    if (!expanded.includes("admin/logs")) expanded.push("admin/logs");
    if (!expanded.includes("admin/microservice")) expanded.push("admin/microservice");
    if (!expanded.includes("admin/alerts")) expanded.push("admin/alerts");
  }

  // Always allow Overview as safe fallback.
  if (!expanded.includes("overview")) {
    expanded.unshift("overview");
  }

  return Array.from(new Set(expanded));
};

const getStoredToken = (): string | null => {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

const getStoredNavEntries = (): NavEntry[] => {
  if (typeof localStorage === "undefined") return [];
  const cached = localStorage.getItem(NAV_CACHE_KEY);
  if (!cached) return [];
  try {
    const parsed = JSON.parse(cached);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getStoredUsername = (): string | null => {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(USERNAME_CACHE_KEY) || localStorage.getItem(USERNAME_LOGIN_KEY);
};

// ============================================================================
// Context
// ============================================================================

const AuthContext = createContext<AuthContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  // Initialize state from localStorage for faster hydration
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<UserInfo | null>(() => {
    const username = getStoredUsername();
    return username ? { username } : null;
  });
  const [navEntries, setNavEntries] = useState<NavEntry[]>(() => {
    const storedToken = getStoredToken();
    return storedToken ? getStoredNavEntries() : [];
  });
  const [allowedPages, setAllowedPages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cache refs to avoid redundant API calls
  const allowedPagesRef = useRef<string[] | null>(null);
  const navTokenRef = useRef<string | null>(null);

  const isAuthenticated = Boolean(token);

  // Login handler
  const login = useCallback(async (credentials: LoginPayload) => {
    setIsLoading(true);
    try {
      const result = await authenticate(credentials);
      const newToken = result.token || null;

      // Store token
      if (newToken) {
        localStorage.setItem(TOKEN_KEY, newToken);
      }

      // Store username
      if (result.user?.username) {
        localStorage.setItem(USERNAME_CACHE_KEY, result.user.username);
        localStorage.setItem(USERNAME_LOGIN_KEY, result.user.username);
      }

      setToken(newToken);
      setUser(result.user);

      // Fetch navigation entries
      const profile = await fetchCurrentAdmin(newToken || undefined);
      const entries = Array.isArray((profile as any).clientNavigation)
        ? (profile as any).clientNavigation
        : [];

      const normalizedEntries = entries.map((entry: any) => ({
        ...entry,
        page: typeof entry?.page === "string" ? normalizeClientNavPage(entry.page) : entry?.page,
      }));

      setNavEntries(normalizedEntries);

      const pages = normalizeAllowedPages(
        entries
          .map((entry: any) => entry?.page)
          .filter((p: unknown): p is string => Boolean(p))
      );

      setAllowedPages(pages);
      allowedPagesRef.current = pages;
      navTokenRef.current = newToken;

      // Cache navigation
      try {
        localStorage.setItem(NAV_CACHE_KEY, JSON.stringify(normalizedEntries));
      } catch {
        // Ignore cache write errors
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout handler
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(NAV_CACHE_KEY);
    localStorage.removeItem(USERNAME_CACHE_KEY);

    setToken(null);
    setUser(null);
    setNavEntries([]);
    setAllowedPages([]);
    allowedPagesRef.current = null;
    navTokenRef.current = null;
  }, []);

  // Check auth and fetch navigation (used by guards)
  const checkAuth = useCallback(async (providedToken?: string): Promise<string[]> => {
    const storedToken = providedToken ?? getStoredToken();
    const tokenMarker = storedToken ?? null;

    // Return cached if available
    if (allowedPagesRef.current && navTokenRef.current === tokenMarker) {
      return allowedPagesRef.current;
    }

    if (!storedToken) {
      throw new Error("No token available");
    }

    setIsLoading(true);
    try {
      const profile = await fetchCurrentAdmin(storedToken);
      const entries = Array.isArray((profile as any).clientNavigation)
        ? (profile as any).clientNavigation
        : [];

      const normalizedEntries = entries.map((entry: any) => ({
        ...entry,
        page: typeof entry?.page === "string" ? normalizeClientNavPage(entry.page) : entry?.page,
      }));

      setNavEntries(normalizedEntries);

      const pages = normalizeAllowedPages(
        entries
          .map((entry: any) => entry?.page)
          .filter((p: unknown): p is string => Boolean(p))
      );

      setAllowedPages(pages);
      allowedPagesRef.current = pages;
      navTokenRef.current = tokenMarker;

      // Update user info
      if (profile) {
        setUser(profile);
        if (typeof (profile as any).username === "string") {
          localStorage.setItem(USERNAME_CACHE_KEY, (profile as any).username);
          localStorage.setItem(USERNAME_LOGIN_KEY, (profile as any).username);
        }
      }

      // Cache navigation
      try {
        localStorage.setItem(NAV_CACHE_KEY, JSON.stringify(normalizedEntries));
      } catch {
        // Ignore cache write errors
      }

      return pages;
    } catch (error) {
      // Clear invalid token
      logout();
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  // Memoize context value
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated,
      isLoading,
      allowedPages,
      navEntries,
      login,
      logout,
      checkAuth,
    }),
    [user, token, isAuthenticated, isLoading, allowedPages, navEntries, login, logout, checkAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================================================
// Hook
// ============================================================================

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// ============================================================================
// Exports
// ============================================================================

export { normalizeClientNavPage, normalizeAllowedPages };
export type { NavEntry, AuthState };
