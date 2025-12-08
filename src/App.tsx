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

type RouteId = "landing" | "maintenance" | "contact" | "login" | "dashboard" | "404";

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
    case "dashboard":
      return "dashboard";
    case "404":
      return "404";
    default:
      return "404";
  }
};

const PROTECTED_ROUTES = new Set<RouteId>(["dashboard"]);
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
  const showNav = !["landing", "login", "dashboard"].includes(route);

  const setHash = (id: RouteId) => {
    window.location.hash = `/${id}`;
  };

  const redirectTo = useCallback((id: RouteId, fromHashChange = false) => {
    if (!fromHashChange) {
      setHash(id);
    }
    setRoute(id);
  }, []);

  const ensureClientNavigation = useCallback(
    async (token?: string): Promise<string[]> => {
      if (allowedPagesRef.current) return allowedPagesRef.current;

      // Use cached navigation only if we still have a token; otherwise force a fresh check.
      if (token && navEntries.length) {
        const cachedName =
          localStorage.getItem(USERNAME_CACHE_KEY) || localStorage.getItem(USERNAME_LOGIN_KEY);
        if (cachedName) {
          setUserName((prev) => prev || cachedName);
        }
        const pages = navEntries
          .map((entry) => (entry && typeof entry === "object" ? (entry as any).page : null))
          .filter((p: unknown): p is string => Boolean(p));
        allowedPagesRef.current = pages;
        return pages;
      }
      const profile = await fetchCurrentAdmin(token);
      const entries = Array.isArray((profile as any).clientNavigation)
        ? (profile as any).clientNavigation
        : [];
      setNavEntries(entries);
      const pages = entries
        .map((entry: any) => entry?.page)
        .filter((p: unknown): p is string => Boolean(p));
      allowedPagesRef.current = pages;
      if (profile && typeof (profile as any).username === "string") {
        setUserName((profile as any).username);
        localStorage.setItem(USERNAME_CACHE_KEY, (profile as any).username);
        localStorage.setItem(USERNAME_LOGIN_KEY, (profile as any).username);
      }
      try {
        localStorage.setItem(NAV_CACHE_KEY, JSON.stringify(entries));
      } catch {
        // ignore cache write errors
      }
      return pages;
    },
    [navEntries]
  );

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
        if (allowedPages.includes(target)) {
          redirectTo(target, fromHashChange);
        } else {
          redirectTo("404", fromHashChange);
        }
      } catch (error) {
        console.error("Auth check failed", error);
        if (token) {
          localStorage.removeItem("astraai:auth:token");
        }
        localStorage.removeItem(NAV_CACHE_KEY);
        localStorage.removeItem(USERNAME_CACHE_KEY);
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
      case "dashboard":
        return <DashboardPage userName={userName ?? undefined} navEntries={navEntries} />;
      default:
        return <NotFoundPage />;
    }
  }, [route]);

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
                variant={route === "dashboard" ? "solid" : "outline"}
                color="neutral"
                size="sm"
                onClick={() => setHash("dashboard")}
              >
                Dashboard
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
