import { useEffect, useState } from "react";
import SectionHeader from "../molecules/content/SectionHeader";
import UserGeneralTab from "./user-settings/UserGeneralTab";
import UserWeightsTab from "./user-settings/UserWeightsTab";
import UserFiltersTab from "./user-settings/UserFiltersTab";
import UserOrderByTab from "./user-settings/UserOrderByTab";

type TabKey = "general" | "weights" | "filters" | "orderby";

type TabDef = {
  key: TabKey;
  label: string;
};

const TABS: TabDef[] = [
  { key: "general", label: "General" },
  { key: "weights", label: "Scores weighted" },
  { key: "filters", label: "Filters" },
  { key: "orderby", label: "Order By" },
];

const getTabFromHash = (): TabKey => {
  if (typeof window === "undefined") return "weights";
  const hash = window.location.hash || "";
  const [, queryString] = hash.split("?");
  if (queryString) {
    const params = new URLSearchParams(queryString);
    const tabParam = params.get("tab");
    if (tabParam && ["general", "weights", "filters"].includes(tabParam)) {
      return tabParam as TabKey;
    }
  }
  return "weights";
};

export default function UserSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>(() => getTabFromHash());

  useEffect(() => {
    const syncTab = () => setActiveTab(getTabFromHash());
    window.addEventListener("hashchange", syncTab);
    return () => window.removeEventListener("hashchange", syncTab);
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case "general":
        return <UserGeneralTab />;
      case "weights":
        return <UserWeightsTab />;
      case "filters":
        return <UserFiltersTab />;
      case "orderby":
        return <UserOrderByTab />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <SectionHeader title="User Settings" subTitle="Configura le preferenze personali" />

      <div className="flex items-center gap-2 border-b border-slate-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`px-3 py-2 text-[11px] font-semibold ${
              activeTab === tab.key ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>{renderTab()}</div>
    </div>
  );
}
