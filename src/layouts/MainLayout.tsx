import { useEffect, useRef, useState, type ReactNode } from "react";
import Logo from "../components/atoms/media/Logo";
import UserMenu from "../components/molecules/navigation/UserMenu";
import { useRelease } from "../hooks/useReleaseInfo";
import BaseButton from "../components/atoms/base/buttons/BaseButton";
import { fetchServiceFlags } from "../api/serviceFlags";
import { redisWsBridgeClient } from "../services/ws/redisWsBridgeClient";

export type MainLayoutProps = {
  children: ReactNode;
  title?: string;
  userName?: string;
  navEntries?: any[];
};

type NavLink = {
  label: string;
  href?: string;
  children?: NavLink[];
};

const formatLabel = (slug: string) =>
  slug
    .split(/[-_/]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const buildNavLinks = (navEntries?: any[]): NavLink[] => {
  const normalizeClientNavPage = (page: string): string => {
    const trimmed = String(page || "").trim();
    if (!trimmed) return "";
    return trimmed
      .replace(/^#\/?/, "")
      .replace(/^\/+/, "")
      .replace(/\/+$/, "");
  };

  const links: NavLink[] = [{ label: "Overview", href: "#/overview" }];

  if (!Array.isArray(navEntries)) {
    return links;
  }

  const dashboardChildren: NavLink[] = [];
  const adminChildren: NavLink[] = [];

  navEntries.forEach((entry) => {
    const rawPage = entry?.page;
    if (typeof rawPage !== "string") return;
    const page = normalizeClientNavPage(rawPage);

    if (page === "dashboard/*" || page === "dashboard" || page === "dashboard/tickers") {
      const href = "#/dashboard/tickers";
      if (!dashboardChildren.some((child) => child.href === href)) {
        dashboardChildren.push({ label: "Tickers", href });
      }
      const userHref = "#/dashboard/user_tickers";
      if (!dashboardChildren.some((child) => child.href === userHref)) {
        dashboardChildren.push({ label: "User Tickers", href: userHref });
      }
      return;
    }

    if (page === "admin/*" || page === "admin") {
      ["users", "api_key", "scheduler", "microservice"].forEach((segment) => {
        const href = `#/admin/${segment}`;
        const label =
          segment === "api_key"
            ? "API Key"
            : segment === "microservice"
              ? "Microservice"
              : formatLabel(segment);
        if (!adminChildren.some((child) => child.href === href)) {
          adminChildren.push({ label, href });
        }
      });
      return;
    }

    if (page.startsWith("admin/")) {
      const segment = page.replace(/^admin\//, "");
      if (!segment) return;
      const href = `#/admin/${segment}`;
      const label =
        segment === "api_key"
          ? "API Key"
          : segment === "microservice"
            ? "Microservice"
            : formatLabel(segment);
      if (!adminChildren.some((child) => child.href === href)) {
        adminChildren.push({ label, href });
      }
      return;
    }
  });

  if (dashboardChildren.length) {
    links.push({ label: "Dashboard", children: dashboardChildren });
  }

  if (adminChildren.length) {
    const order = { users: 0, api_key: 1, scheduler: 2, microservice: 3 } as Record<string, number>;
    adminChildren.sort((a, b) => {
      const aKey = String(a.href || "").replace(/^#\/admin\//, "");
      const bKey = String(b.href || "").replace(/^#\/admin\//, "");
      return (order[aKey] ?? 99) - (order[bKey] ?? 99);
    });

    links.push({ label: "Admin", children: adminChildren });
  }

  return links;
};

export function MainLayout({
  children,
  title = "Dashboard",
  userName,
  navEntries,
}: MainLayoutProps) {
  // Title is available for future heading usage.
  void title;
  const release = useRelease();
  const navLinks = buildNavLinks(navEntries);
  const currentHash = typeof window !== "undefined" ? window.location.hash || "#/overview" : "#/overview";
  const [openNav, setOpenNav] = useState(false);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [microservices, setMicroservices] = useState<string[]>([]);
  const [microserviceMenuOpen, setMicroserviceMenuOpen] = useState(false);
  const [gwStatus, setGwStatus] = useState("UNKNOWN");
  const [gwInfo, setGwInfo] = useState<Record<string, unknown> | null>(null);
  const [keepaliveTelemetry, setKeepaliveTelemetry] = useState<Record<string, any> | null>(null);
  const [ssodhTelemetry, setSsodhTelemetry] = useState<Record<string, any> | null>(null);
  const [gwLastSource, setGwLastSource] = useState<string | null>(null);
  const keepaliveRef = useRef<Record<string, any> | null>(null);
  const ssodhRef = useRef<Record<string, any> | null>(null);
  const [showGwModal, setShowGwModal] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [selectedAccountType, setSelectedAccountType] = useState<string | null>(null);

  const statusIndicatorTone =
    gwStatus === "GW_BRIDGE_OK"
      ? "bg-emerald-500"
      : gwStatus === "GW_UP"
        ? "bg-emerald-500"
        : gwStatus === "GW_NO_AUTH"
          ? "bg-amber-400"
          : gwStatus === "GW_UP_BUT_ERROR"
            ? "bg-red-500"
            : gwStatus === "GW_DOWN"
              ? "bg-red-500"
              : "bg-slate-400";
  const statusIndicatorPulse =
    gwStatus === "GW_UP" || gwStatus === "GW_UP_BUT_ERROR" ? "status-indicator--blink" : "";

  const computeGwStatus = (keepalive: any, ssodh: any, fallback?: string) => {
    const authStatus = keepalive?.lastAuthStatus;
    const tickleStatus = keepalive?.lastTickleStatus;
    const status = typeof authStatus === "number" ? authStatus : tickleStatus;
    if (status === 401) return "GW_NO_AUTH";
    if (status === 200) {
      const authOk = ssodh?.ssodhInit?.authStatus?.data?.authenticated;
      const ssodhOk = ssodh?.ssodhInit?.ssodhInit?.data?.passed;
      if (authOk && ssodhOk) return "GW_BRIDGE_OK";
      if (ssodh?.ssodhInit) return "GW_UP_BUT_ERROR";
      return "GW_UP";
    }
    if (typeof status === "number") return "GW_UP_BUT_ERROR";
    return fallback || "GW_DOWN";
  };

  const closeNav = () => setOpenNav(false);

  useEffect(() => {
    fetchServiceFlags()
      .then((items) => {
        const names = Array.from(
          new Set(
            items
              .map((i) => i.microservice)
              .filter((n): n is string => !!n)
              .map((n) => n.trim())
          )
        ).sort((a, b) => a.localeCompare(b));
        setMicroservices(names);
      })
      .catch(() => {
        setMicroservices([]);
      });
  }, []);

  useEffect(() => {
    const readSelection = () => {
      if (typeof localStorage === "undefined") return;
      const accountId = localStorage.getItem("astraai:ibkr:accountId");
      const accountType = localStorage.getItem("astraai:ibkr:accountType");
      setSelectedAccountId(accountId);
      setSelectedAccountType(accountType);
    };

    readSelection();

    const handleStorage = (event: StorageEvent) => {
      if (!event.key || !event.key.startsWith("astraai:ibkr:")) return;
      readSelection();
    };
    const handleCustom = () => readSelection();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("ibkr-account-change", handleCustom as EventListener);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("ibkr-account-change", handleCustom as EventListener);
    };
  }, []);

  useEffect(() => {
    redisWsBridgeClient.start();
    const unsubscribe = redisWsBridgeClient.subscribe({
      filter: (msg) => {
        const channel = msg?.__channel || msg?.channel;
        if (typeof channel === "string") {
          return (
            channel.endsWith(".ibkr-keepalive.telemetry") ||
            channel.endsWith(".ibkr-bridge.telemetry")
          );
        }
        return msg?.type === "keepalive";
      },
      onMessage: (msg) => {
        const channel = msg?.__channel || msg?.channel || "";
        const payload = msg?.keepalive || msg?.payload || msg;
        const isKeepalive =
          String(channel).endsWith(".ibkr-keepalive.telemetry") ||
          payload?.__source === "ibkr-keepalive";
        const isBridge =
          String(channel).endsWith(".ibkr-bridge.telemetry") ||
          payload?.__source === "ibkr-bridge";

        const nextKeepalive = isKeepalive ? payload : keepaliveRef.current;
        const nextSsodh = isBridge ? payload : ssodhRef.current;

        if (isKeepalive) {
          setKeepaliveTelemetry(payload);
          keepaliveRef.current = payload;
          setGwLastSource("ibkr-keepalive");
        }
        if (isBridge) {
          setSsodhTelemetry(payload);
          ssodhRef.current = payload;
          setGwLastSource("ibkr-bridge");
        }

        const status = computeGwStatus(nextKeepalive, nextSsodh, gwStatus);
        setGwStatus(typeof status === "string" && status ? status : "UNKNOWN");
        setGwInfo({
          keepalive: nextKeepalive,
          ssodhInit: nextSsodh,
        });
      },
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 transform border-r border-slate-200 bg-white p-4 transition-transform duration-200 md:static md:translate-x-0 ${
          openNav ? "translate-x-0 shadow-lg" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <Logo />
          <button
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            onClick={closeNav}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <nav className="mt-6 space-y-2 text-sm text-slate-700">
          {navLinks.map((link) => {
            if (link.children && link.children.length) {
              const activeChild = link.children.some(
                (child) =>
                  child.href && (currentHash === child.href || currentHash.startsWith(`${child.href}/`))
              );
              return (
                <div key={link.label} className="space-y-1">
                  <div
                    className={`px-3 py-2 text-[11px] font-semibold uppercase tracking-wide ${
                      activeChild ? "text-slate-800" : "text-slate-500"
                    }`}
                  >
                    {link.label}
                  </div>
                  <div className="space-y-1 pl-2">
                    {link.children.map((child) => {
                      const isMicroserviceEntry = child.label === "Microservice";
                      const isActive =
                        child.href && (currentHash === child.href || currentHash.startsWith(`${child.href}/`));
                      if (isMicroserviceEntry) {
                        const microHref = child.href ?? "#/admin/microservice";
                        return (
                          <div key={child.href ?? child.label} className="space-y-1">
                            <div
                              className={`flex w-full items-center justify-between rounded-md px-3 py-2 hover:bg-slate-100 ${
                                isActive ? "bg-slate-100 font-semibold text-slate-900" : ""
                              }`}
                            >
                              <a
                                className="flex-1 text-left"
                                href={microHref}
                                onClick={closeNav}
                              >
                                Microservice
                              </a>
                              <button
                                type="button"
                                className="ml-2 rounded px-1 text-xs text-slate-500 hover:bg-slate-200"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setMicroserviceMenuOpen((prev) => !prev);
                                }}
                                aria-label="Toggle microservice menu"
                            >
                              {microserviceMenuOpen ? "▼" : "▶"}
                            </button>
                          </div>
                          {microserviceMenuOpen && microservices.length > 0 && (
                            <div className="space-y-1 pl-4">
                              {microservices.map((name) => {
                                const href = `#/admin/microservice/${encodeURIComponent(name)}`;
                                const active =
                                  currentHash === href || currentHash.startsWith(`${href}/`);
                                return (
                                    <a
                                      key={href}
                                      className={`block rounded-md px-3 py-2 hover:bg-slate-100 ${
                                        active ? "bg-slate-100 font-semibold text-slate-900" : ""
                                      }`}
                                      href={href}
                                      onClick={closeNav}
                                    >
                                      {name}
                                    </a>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      }
                      return (
                        <a
                          key={child.href ?? child.label}
                          className={`block rounded-md px-3 py-2 hover:bg-slate-100 ${
                            isActive ? "bg-slate-100 font-semibold text-slate-900" : ""
                          }`}
                          href={child.href ?? "#"}
                          onClick={closeNav}
                        >
                          {child.label}
                        </a>
                      );
                    })}
                  </div>
                </div>
              );
            }

            const isActive = link.href && (currentHash === link.href || currentHash.startsWith(`${link.href}/`));
            return (
              <a
                key={link.href ?? link.label}
                className={`block rounded-md px-3 py-2 hover:bg-slate-100 ${
                  isActive ? "bg-slate-100 font-semibold text-slate-900" : ""
                }`}
                href={link.href ?? "#"}
                onClick={closeNav}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {openNav && <div className="fixed inset-0 z-30 bg-black/30 md:hidden" onClick={closeNav} />}

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              className="rounded-md p-2 text-slate-700 hover:bg-slate-100 md:hidden"
              onClick={() => setOpenNav((prev) => !prev)}
              aria-label="Apri/chiudi menu"
            >
              ☰
            </button>
            <div className="text-lg font-semibold text-slate-900">
              Astra Trading AI <span className="text-slate-500">(Autopilot)</span>
            </div>
          </div>
          <UserMenu userName={userName} />
        </header>
        <main className="flex-1 overflow-y-auto p-4 pb-16">{children}</main>
        <footer className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between border-t border-slate-200 bg-white/90 px-3 py-2 text-[11px] text-slate-600 backdrop-blur">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-2 rounded px-2 py-1 transition hover:bg-slate-100"
              onClick={() => setShowGwModal(true)}
              aria-label="Apri dettaglio stato IBKR"
            >
              <span className="inline-flex items-center gap-2" title={`Gateway status: ${gwStatus}`}>
                <span
                  className={`status-indicator h-2.5 w-2.5 rounded-full ${statusIndicatorTone} ${statusIndicatorPulse}`}
                  aria-hidden="true"
                />
                <span>{gwStatus}</span>
              </span>
            </button>
            {selectedAccountId ? (
              <span className="inline-flex items-center gap-2 rounded px-2 py-1 text-[11px] text-slate-600">
                Connesso al conto {selectedAccountId}
                {selectedAccountType ? (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold text-white ${
                      selectedAccountType === "DEMO"
                        ? "bg-red-500"
                        : selectedAccountType === "INDIVIDUAL"
                          ? "bg-emerald-500"
                          : "bg-slate-500"
                    }`}
                  >
                    {selectedAccountType}
                  </span>
                ) : null}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <button
              type="button"
              className="rounded px-2 py-1 transition hover:bg-slate-100"
              onClick={() => setShowReleaseModal(true)}
            >
              Versione {release?.version ?? "-"}
            </button>
            {release?.lastUpdate ? <span>Last update {release.lastUpdate}</span> : null}
          </div>
        </footer>
      </div>

      {showReleaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div>
                <div className="text-base font-semibold text-slate-900">Release info</div>
                <div className="text-[11px] text-slate-500">
                  {release?.version ? `v${release.version}` : "versione non disponibile"}
                  {release?.lastUpdate ? ` · ${release.lastUpdate}` : ""}
                </div>
              </div>
              <div className="flex gap-2">
                <BaseButton
                  variant="outline"
                  color="neutral"
                  size="sm"
                  onClick={() => setShowReleaseModal(false)}
                >
                  Chiudi
                </BaseButton>
              </div>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-4 py-3 text-[11px] text-slate-700">
              <pre className="rounded-md bg-slate-50 px-3 py-2 text-[11px] text-slate-800">
                {JSON.stringify(release, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {showGwModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div>
                <div className="text-base font-semibold text-slate-900">IBKR status</div>
                <div className="text-[11px] text-slate-500">
                  DEV.ibkr-keepalive.telemetry + DEV.ibkr-bridge.telemetry
                </div>
              </div>
            </div>
            <div className="max-h-[70vh] space-y-4 overflow-y-auto px-4 py-4 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <span className={`status-indicator h-2.5 w-2.5 rounded-full ${statusIndicatorTone}`} />
                <span className="font-semibold">gwStatus</span>
                <span>{gwStatus}</span>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-600">
                <div className="font-semibold text-slate-700">Significato stati</div>
                <div className="mt-2 grid gap-2 md:grid-cols-2">
                  <div>
                    <span className="font-semibold">GW_UP</span>: gateway OK (keepalive), bridge non confermato
                  </div>
                  <div>
                    <span className="font-semibold">GW_NO_AUTH</span>: gateway OK, iServer non autenticato
                  </div>
                  <div>
                    <span className="font-semibold">GW_DOWN</span>: gateway non raggiungibile
                  </div>
                  <div>
                    <span className="font-semibold">GW_UP_BUT_ERROR</span>: gateway OK ma errore iServer/ssodh
                  </div>
                  <div>
                    <span className="font-semibold">GW_BRIDGE_OK</span>: iServer autenticato e ssodh init ok
                  </div>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {(() => {
                  const keepalive = (gwInfo?.keepalive as Record<string, unknown>) || {};
                  const ssodh = (gwInfo?.ssodhInit as Record<string, unknown>) || {};
                  const rows: Array<{ label: string; value: unknown }> = [
                    { label: "lastAuthStatus", value: keepalive.lastAuthStatus },
                    { label: "lastTickleStatus", value: keepalive.lastTickleStatus },
                    { label: "lastTickleAt", value: keepalive.lastTickleAt },
                    { label: "ssodhAuth", value: ssodh?.ssodhInit?.authStatus?.data?.authenticated },
                    { label: "ssodhPassed", value: ssodh?.ssodhInit?.ssodhInit?.data?.passed },
                    { label: "lastSsodhInitAt", value: ssodh?.lastSsodhInitAt },
                    { label: "lastSource", value: gwLastSource },
                  ];

                  return rows.map((row) => (
                    <div key={row.label} className="rounded-lg border border-slate-200 bg-white p-3">
                      <div className="text-[10px] uppercase tracking-wide text-slate-400">{row.label}</div>
                      <div className="mt-1 text-[12px] font-semibold text-slate-900">
                        {row.value === null || row.value === undefined || row.value === ""
                          ? "-"
                          : String(row.value)}
                      </div>
                    </div>
                  ));
                })()}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  GW_BRIDGE_OK
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 status-indicator--blink" />
                  GW_UP
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  GW_NO_AUTH
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500 status-indicator--blink" />
                  GW_UP_BUT_ERROR
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  GW_DOWN
                </span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-3">
              <BaseButton
                variant="outline"
                color="neutral"
                onClick={() => setShowGwModal(false)}
              >
                Close
              </BaseButton>
              <BaseButton
                variant="solid"
                color="primary"
                onClick={() => window.open("http://localhost:5001", "_blank", "noopener,noreferrer")}
              >
                Connect
              </BaseButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainLayout;
