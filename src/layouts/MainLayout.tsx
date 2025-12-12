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

const formatLabel = (slug: string) =>
  slug
    .split(/[-_/]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const buildNavLinks = (navEntries?: any[]) => {
  const links = [
    { label: "Overview", href: "#/dashboard" },
    { label: "Tickers", href: "#/dashboard/tickers" },
  ];
  if (!Array.isArray(navEntries)) return links;

  navEntries.forEach((entry) => {
    const page = entry?.page;
    if (typeof page !== "string") return;
    if (!page.startsWith("dashboard/")) return;
    const segment = page.replace(/^dashboard\//, "");
    if (!segment) return;
    const href = `#/dashboard/${segment}`;
    const label = formatLabel(segment);
    if (!links.some((l) => l.href === href)) {
      links.push({ label, href });
    }
  });
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
  const currentHash = typeof window !== "undefined" ? window.location.hash || "#/dashboard" : "#/dashboard";
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
            const isActive = currentHash === link.href || currentHash.startsWith(`${link.href}/`);
            return (
              <a
                key={link.href}
                className={`block rounded-md px-3 py-2 hover:bg-slate-100 ${
                  isActive ? "bg-slate-100 font-semibold text-slate-900" : ""
                }`}
                href={link.href}
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
