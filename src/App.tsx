import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchCurrentAdmin } from "./api/auth";
import DashboardPage from "./components/pages/DashboardPage";
import LandingPage from "./components/pages/landing/Homepage";
import MaintenancePage from "./components/pages/landing/Maintenance";
import NotFoundPage from "./components/pages/landing/NotFound";
import ContactPage from "./components/pages/landing/Contact";
import Logo from "./components/atoms/media/Logo";
import LoginPage from "./components/pages/auth/LoginPage";
import BaseButton from "./components/atoms/base/buttons/BaseButton";

type RouteId =
  | "landing"
  | "maintenance"
  | "contact"
  | "login"
  | "overview"
  | "dashboard"
  | "admin"
  | "404";

const normalizeHash = (hash: string): RouteId => {
  const cleaned = (hash || "#/landing").replace(/^#\/?/, "");
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

const getPermissionKeyFromHash = (hash: string): string => {
  const cleaned = String(hash || "#/overview")
    .replace(/^#\/?/, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

  const parts = cleaned.split(/[/?]/).filter(Boolean);
  const base = parts[0] || "overview";

  if (base === "overview") return "overview";

  if (base === "dashboard") {
    // /dashboard/tickers/TSLA -> dashboard/tickers
    const section = parts[1];
    if (section === "tickers") return "dashboard/tickers";
    return "dashboard";
  }

  if (base === "admin") {
    const section = parts[1];
    if (section === "users") return "admin/users";
    if (section === "scheduler") return "admin/scheduler";
    if (section === "api_key") return "admin/api_key";
    if (section === "ticker_scanner") return "admin/ticker_scanner";
    return "admin";
  }

  return base;
};

const normalizeClientNavPage = (page: string): string => {
  const trimmed = String(page || "").trim();
  if (!trimmed) return "";

  const cleaned = trimmed
    .replace(/^#\/?/, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

  if (!cleaned) return "";

  // Canonical pages (DB fixed)
  if (cleaned === "overview") return "overview";
  if (cleaned === "dashboard/*" || cleaned === "dashboard") return "dashboard/*";
  if (cleaned === "dashboard/tickers") return "dashboard/tickers";
  if (cleaned === "admin/*" || cleaned === "admin") return "admin/*";
  if (cleaned === "admin/users") return "admin/users";
  if (cleaned === "admin/scheduler") return "admin/scheduler";
  if (cleaned === "admin/api_key") return "admin/api_key";
  if (cleaned === "admin/ticker_scanner") return "admin/ticker_scanner";

  // Small backward-compatible fallbacks
  if (cleaned === "tickers") return "dashboard/tickers";
  if (cleaned === "users") return "admin/users";
  if (cleaned === "scheduler") return "admin/scheduler";

  return cleaned;
};

const normalizeAllowedPages = (rawPages: string[]): string[] => {
  const normalized = rawPages
    .map((p) => normalizeClientNavPage(p))
    .filter(Boolean);

  const expanded: string[] = [...normalized];

  // Wildcard support: dashboard/* enables all dashboard pages.
  if (normalized.includes("dashboard/*") || normalized.includes("dashboard")) {
    if (!expanded.includes("dashboard/tickers")) expanded.push("dashboard/tickers");
  }

  if (normalized.includes("admin/*") || normalized.includes("admin")) {
    if (!expanded.includes("admin/users")) expanded.push("admin/users");
    if (!expanded.includes("admin/scheduler")) expanded.push("admin/scheduler");
    if (!expanded.includes("admin/api_key")) expanded.push("admin/api_key");
    if (!expanded.includes("admin/ticker_scanner")) expanded.push("admin/ticker_scanner");
  }

  // Always allow Overview as safe fallback.
  if (!expanded.includes("overview")) {
    expanded.unshift("overview");
  }

  return Array.from(new Set(expanded));
};

const PROTECTED_ROUTES = new Set<RouteId>(["overview", "dashboard", "admin"]);
const NAV_CACHE_KEY = "astraai:auth:clientNavigation";
const USERNAME_CACHE_KEY = "astraai:auth:username";
const USERNAME_LOGIN_KEY = "astraai:login:username";

export default function App() {
  const [route, setRoute] = useState<RouteId>("landing");
  const [authChecking, setAuthChecking] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<RouteId | null>(null);
  const [navEntries, setNavEntries] = useState<any[]>(() => {
    const token = localStorage.getItem("astraai:auth:token");
    if (!token) return [];
    const cached = localStorage.getItem(NAV_CACHE_KEY);
    if (!cached) return [];
    try {
      const parsed = JSON.parse(cached);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [userName, setUserName] = useState<string | null>(() => {
    return localStorage.getItem(USERNAME_CACHE_KEY) || localStorage.getItem(USERNAME_LOGIN_KEY);
  });

  const allowedPagesRef = useRef<string[] | null>(null);
  const navTokenRef = useRef<string | null>(null);

  // Show the public top nav only on public pages.
  const showNav = !["landing", "login", "overview", "dashboard", "admin"].includes(route);

  const setHash = (id: RouteId) => {
    window.location.hash = `/${id}`;
  };

  const redirectTo = useCallback((id: RouteId, fromHashChange = false) => {
    if (!fromHashChange) {
      setHash(id);
    }
    setRoute(id);
  }, []);

  const ensureClientNavigation = useCallback(async (token?: string): Promise<string[]> => {
    const storedToken = token ?? (localStorage.getItem("astraai:auth:token") || undefined);
    const tokenMarker = storedToken ?? null;

    if (allowedPagesRef.current && navTokenRef.current === tokenMarker) {
      return allowedPagesRef.current;
    }

    const cachedName = localStorage.getItem(USERNAME_CACHE_KEY) || localStorage.getItem(USERNAME_LOGIN_KEY);
    if (cachedName) {
      setUserName((prev) => prev || cachedName);
    }

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

    allowedPagesRef.current = pages;
    navTokenRef.current = tokenMarker;

    if (profile && typeof (profile as any).username === "string") {
      setUserName((profile as any).username);
      localStorage.setItem(USERNAME_CACHE_KEY, (profile as any).username);
      localStorage.setItem(USERNAME_LOGIN_KEY, (profile as any).username);
    }

    try {
      localStorage.setItem(NAV_CACHE_KEY, JSON.stringify(normalizedEntries));
    } catch {
      // ignore cache write errors
    }

    return pages;
  }, []);

  const guardAndNavigate = useCallback(
    async (target: RouteId, fromHashChange = false) => {
      if (!PROTECTED_ROUTES.has(target)) {
        setPendingRoute(null);
        redirectTo(target, fromHashChange);
        return;
      }

      setPendingRoute(target);
      const token = localStorage.getItem("astraai:auth:token") || undefined;

      setAuthChecking(true);
      try {
        const allowedPages = await ensureClientNavigation(token);
        const requestedHash = typeof window !== "undefined" ? window.location.hash : "";
        const permissionKey = normalizeClientNavPage(getPermissionKeyFromHash(requestedHash));

        if (allowedPages.includes(permissionKey)) {
          redirectTo(target, fromHashChange);
          return;
        }

        // Safe fallback: overview.
        if (allowedPages.includes("overview")) {
          redirectTo("overview", false);
          return;
        }

        redirectTo("404", fromHashChange);
      } catch (error) {
        console.error("Auth check failed", error);
        if (token) {
          localStorage.removeItem("astraai:auth:token");
        }
        localStorage.removeItem(NAV_CACHE_KEY);
        localStorage.removeItem(USERNAME_CACHE_KEY);
        allowedPagesRef.current = null;
        navTokenRef.current = null;
        redirectTo("login", fromHashChange);
      } finally {
        setPendingRoute(null);
        setAuthChecking(false);
      }
    },
    [ensureClientNavigation, redirectTo]
  );

  useEffect(() => {
    const syncFromHash = () => {
      const id = normalizeHash(window.location.hash);
      guardAndNavigate(id, true);
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [guardAndNavigate]);

  const Page = useMemo(() => {
    switch (route) {
      case "landing":
        return <LandingPage />;
      case "maintenance":
        return <MaintenancePage />;
      case "contact":
        return <ContactPage />;
      case "login":
        return <LoginPage />;
      case "overview":
      case "dashboard":
      case "admin":
        return <DashboardPage userName={userName ?? undefined} navEntries={navEntries} />;
      default:
        return <NotFoundPage />;
    }
  }, [route, navEntries, userName]);

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900">
      {showNav && (
        <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
            <Logo />
            <div className="flex flex-wrap gap-2">
              <BaseButton
                variant={route === "landing" ? "solid" : "outline"}
                color="neutral"
                size="sm"
                onClick={() => setHash("landing")}
              >
                Landing
              </BaseButton>
              <BaseButton
                variant={route === "maintenance" ? "solid" : "outline"}
                color="neutral"
                size="sm"
                onClick={() => setHash("maintenance")}
              >
                Maintenance
              </BaseButton>
              <BaseButton
                variant={route === "contact" ? "solid" : "outline"}
                color="neutral"
                size="sm"
                onClick={() => setHash("contact")}
              >
                Contact
              </BaseButton>
              <BaseButton
                variant={route === "login" ? "solid" : "outline"}
                color="neutral"
                size="sm"
                onClick={() => setHash("login")}
              >
                Login
              </BaseButton>
              <BaseButton
                variant={route === "404" ? "solid" : "outline"}
                color="neutral"
                size="sm"
                onClick={() => setHash("404")}
              >
                404
              </BaseButton>
            </div>
          </div>
        </div>
      )}

      <div className={showNav ? "min-h-[calc(100vh-56px)] w-full" : "min-h-screen w-full"}>
        {authChecking && pendingRoute ? (
          <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-600">
            Verifica accesso in corso...
          </div>
        ) : (
          Page
        )}
      </div>
    </div>
  );
}
