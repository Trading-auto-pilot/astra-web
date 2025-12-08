import type { ReactNode } from "react";
import Logo from "../components/atoms/media/Logo";
import UserMenu from "../components/molecules/navigation/UserMenu";

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
  const navLinks = buildNavLinks(navEntries);
  const currentHash = typeof window !== "undefined" ? window.location.hash || "#/dashboard" : "#/dashboard";

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-60 flex-col border-r border-slate-200 bg-white p-4 md:flex">
        <Logo />
        <nav className="mt-6 space-y-2 text-sm text-slate-700">
          {navLinks.map((link) => {
            const isActive =
              currentHash === link.href || currentHash.startsWith(`${link.href}/`);
            return (
              <a
                key={link.href}
                className={`block rounded-md px-3 py-2 hover:bg-slate-100 ${
                  isActive ? "bg-slate-100 font-semibold text-slate-900" : ""
                }`}
                href={link.href}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
          <div className="text-lg font-semibold text-slate-900">
            Astra Trading AI <span className="text-slate-500">(Autopilot)</span>
          </div>
          <UserMenu userName={userName} />
        </header>
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}

export default MainLayout;
