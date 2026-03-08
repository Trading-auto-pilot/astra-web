import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardPage from "./components/pages/DashboardPage";
import MobilePage from "./components/pages/MobilePage";
import LandingPage from "./components/pages/landing/Homepage";
import MaintenancePage from "./components/pages/landing/Maintenance";
import NotFoundPage from "./components/pages/landing/NotFound";
import ContactPage from "./components/pages/landing/Contact";
import Logo from "./components/atoms/media/Logo";
import LoginPage from "./components/pages/auth/LoginPage";
import BaseButton from "./components/atoms/base/buttons/BaseButton";
import {
  type RouteId,
  getRouteId,
  getPermissionKey,
  navigate as hashNavigate,
  getCurrentHash,
} from "./utils/routing";
import {
  AuthProvider,
  useAuth,
  normalizeClientNavPage,
} from "./contexts/AuthContext";

const PROTECTED_ROUTES = new Set<RouteId>(["overview", "dashboard", "admin", "mobile"]);

function AppContent() {
  const {
    isLoading: authLoading,
    navEntries,
    user,
    checkAuth,
    logout,
  } = useAuth();

  const [route, setRoute] = useState<RouteId>("landing");
  const [authChecking, setAuthChecking] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<RouteId | null>(null);

  const userName = user?.username ?? null;

  // Show the public top nav only on public pages.
  const showNav = !["landing", "login", "overview", "dashboard", "admin", "mobile"].includes(route);

  const setHash = (id: RouteId) => {
    hashNavigate(id);
  };

  const redirectTo = useCallback((id: RouteId, fromHashChange = false) => {
    if (!fromHashChange) {
      setHash(id);
    }
    setRoute(id);
  }, []);

  const guardAndNavigate = useCallback(
    async (target: RouteId, fromHashChange = false) => {
      if (!PROTECTED_ROUTES.has(target)) {
        setPendingRoute(null);
        redirectTo(target, fromHashChange);
        return;
      }

      setPendingRoute(target);
      setAuthChecking(true);

      try {
        const pages = await checkAuth();
        const requestedHash = getCurrentHash();
        const permissionKey = normalizeClientNavPage(getPermissionKey(requestedHash));

        if (pages.includes(permissionKey) || (target === "mobile" && pages.includes("overview"))) {
          redirectTo(target, fromHashChange);
          return;
        }

        // Safe fallback: overview.
        if (pages.includes("overview")) {
          redirectTo("overview", false);
          return;
        }

        redirectTo("404", fromHashChange);
      } catch (error) {
        console.error("Auth check failed", error);
        logout();
        redirectTo("login", fromHashChange);
      } finally {
        setPendingRoute(null);
        setAuthChecking(false);
      }
    },
    [checkAuth, logout, redirectTo]
  );

  useEffect(() => {
    const syncFromHash = () => {
      const id = getRouteId(getCurrentHash());
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
      case "mobile":
        return <MobilePage />;
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
        {(authChecking || authLoading) && pendingRoute ? (
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

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
