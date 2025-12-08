import type { ReactNode } from "react";
import MainLayout from "./MainLayout";

export type DashboardLayoutProps = {
  children: ReactNode;
  title?: string;
  userName?: string;
  navEntries?: any[];
};

/**
 * Shell della dashboard: sidebar + topbar + canvas centrale.
 * Accetta come children il contenuto della pagina (section overview, chart, ecc.).
 */
export function DashboardLayout({
  children,
  title = "Dashboard",
  userName,
  navEntries,
}: DashboardLayoutProps) {
  return (
    <MainLayout title={title} userName={userName} navEntries={navEntries}>
      {children}
    </MainLayout>
  );
}

export default DashboardLayout;
