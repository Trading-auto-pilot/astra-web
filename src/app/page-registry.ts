export type PageId = "dashboard" | "logs" | "strategies";

type PageConfig = {
  id: PageId;
  title: string;
  component: React.ComponentType;
};

import { DashboardPage } from "../components/pages/DashboardPage";
import { LogsPage } from "../components/pages/LogsPage";
import { StrategiesPage } from "../components/pages/StrategiesPage";

export const PAGES: PageConfig[] = [
  { id: "dashboard",  title: "Dashboard",  component: DashboardPage },
  { id: "logs",       title: "Log Viewer", component: LogsPage },
  { id: "strategies", title: "Strategies", component: StrategiesPage },
];

export function getPage(id: PageId) {
  return PAGES.find(p => p.id === id);
}
