import DashboardLayout from "../../layouts/DashboardLayout";
import SectionHeader from "../molecules/content/SectionHeader";
import Badge from "../atoms/form/Badge";
import BaseButton from "../atoms/base/buttons/BaseButton";
import AppIcon from "../atoms/icon/AppIcon";
import ChartLegend from "../molecules/charts/ChartLegend";
import ECharts from "../molecules/charts/ECharts";
import TickersPage from "./TickersPage";
import UsersPage from "./UsersPage";
import SchedulerPage from "./SchedulerPage";
import ApiKeysPage from "./ApiKeysPage";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

const summary = [
  { label: "Entrate", value: "€12.4k", trend: "+8%" },
  { label: "Utenti attivi", value: "8.2k", trend: "+3%" },
  { label: "Ticket aperti", value: "42", trend: "-5%" },
];

const chartData = [
  { label: "Lun", value: 18 },
  { label: "Mar", value: 26 },
  { label: "Mer", value: 21 },
  { label: "Gio", value: 30 },
  { label: "Ven", value: 24 },
];

export type DashboardPageProps = {
  userName?: string;
  navEntries?: any[];
  extraContent?: ReactNode;
};

type AppSection = "overview" | "tickers" | "users" | "scheduler" | "apiKeys";

const getAppSection = (): AppSection => {
  if (typeof window === "undefined") return "overview";
  const cleaned = window.location.hash.replace(/^#\/?/, "");
  const parts = cleaned.split(/[/?]/).filter(Boolean);

  if (parts[0] === "overview") return "overview";

  if (parts[0] === "dashboard") {
    if (parts[1] === "tickers") return "tickers";
    return "overview";
  }

  if (parts[0] === "admin") {
    if (parts[1] === "users") return "users";
    if (parts[1] === "scheduler") return "scheduler";
    if (parts[1] === "api_key") return "apiKeys";
    return "overview";
  }

  return "overview";
};

export function DashboardPage({ extraContent, userName, navEntries }: DashboardPageProps) {
  const [section, setSection] = useState<AppSection>(() => getAppSection());

  useEffect(() => {
    const syncSection = () => setSection(getAppSection());
    window.addEventListener("hashchange", syncSection);
    syncSection();
    return () => window.removeEventListener("hashchange", syncSection);
  }, []);

  if (section === "tickers") {
    return (
      <DashboardLayout userName={userName} navEntries={navEntries}>
        <TickersPage />
      </DashboardLayout>
    );
  }

  if (section === "users") {
    return (
      <DashboardLayout userName={userName} navEntries={navEntries}>
        <UsersPage />
      </DashboardLayout>
    );
  }

  if (section === "apiKeys") {
    return (
      <DashboardLayout userName={userName} navEntries={navEntries}>
        <ApiKeysPage />
      </DashboardLayout>
    );
  }

  if (section === "scheduler") {
    return (
      <DashboardLayout userName={userName} navEntries={navEntries}>
        <SchedulerPage />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userName={userName} navEntries={navEntries}>
      <div className="space-y-6">
        <SectionHeader
          title="Overview"
          subTitle="Sintesi delle metriche principali"
          actionComponent={
            <BaseButton
              startIcon={<AppIcon icon="mdi:download-outline" />}
              variant="outline"
              color="neutral"
            >
              Esporta
            </BaseButton>
          }
        />

        {extraContent}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {summary.map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-xs uppercase tracking-wide text-slate-500">{item.label}</div>
              <div className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</div>
              <Badge tone={item.trend.startsWith("-") ? "warning" : "success"} className="mt-2">
                {item.trend}
              </Badge>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <SectionHeader title="Andamento visite" subTitle="Ultimi 5 giorni" />
            <ECharts
              option={{
                title: { text: "Visite" },
                xAxis: { data: chartData.map((d) => d.label) },
                series: [{ data: chartData.map((d) => d.value) }],
              }}
              height={180}
            />
            <div className="flex flex-wrap items-center gap-3">
              {chartData.map((item) => (
                <ChartLegend key={item.label} label={item.label} color="#3b82f6" />
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <SectionHeader title="Azioni rapide" subTitle="Gestisci rapidamente il workspace" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <BaseButton startIcon={<AppIcon icon="mdi:plus" />}>Nuovo report</BaseButton>
              <BaseButton variant="outline" color="neutral" startIcon={<AppIcon icon="mdi:account-group-outline" />}>
                Invita team
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;
