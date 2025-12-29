import { useEffect, useState, type ReactNode } from "react";
import Logo from "../components/atoms/media/Logo";
import UserMenu from "../components/molecules/navigation/UserMenu";
import { useRelease } from "../hooks/useReleaseInfo";
import BaseButton from "../components/atoms/base/buttons/BaseButton";
import { fetchServiceFlags } from "../api/serviceFlags";

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
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700">Status</span>
            <span>App ready</span>
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
    </div>
  );
}

export default MainLayout;
