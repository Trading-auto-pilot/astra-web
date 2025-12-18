import { useState, type ReactNode } from "react";
import Logo from "../components/atoms/media/Logo";
import UserMenu from "../components/molecules/navigation/UserMenu";
import { useRelease } from "../hooks/useReleaseInfo";

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
      return;
    }

    if (page === "admin/*" || page === "admin") {
      ["users", "scheduler"].forEach((segment) => {
        const href = `#/admin/${segment}`;
        const label = formatLabel(segment);
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
      const label = formatLabel(segment);
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
    const order = { users: 0, scheduler: 1 } as Record<string, number>;
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

  const closeNav = () => setOpenNav(false);

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
        <div className="mt-3 flex items-center justify-end text-xs text-slate-400">
          <span>versione {(release as any)?.version ?? "-"}</span>
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
                      const isActive =
                        child.href && (currentHash === child.href || currentHash.startsWith(`${child.href}/`));
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
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}

export default MainLayout;
