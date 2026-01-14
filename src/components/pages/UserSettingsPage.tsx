import { useEffect, useState } from "react";
import SectionHeader from "../molecules/content/SectionHeader";
import UserGeneralTab from "./user-settings/UserGeneralTab";
import UserScoresTab from "./user-settings/UserScoresTab";

type TabKey = "general" | "scores";

type TabDef = {
  key: TabKey;
  label: string;
};

const TABS: TabDef[] = [
  { key: "general", label: "General" },
  { key: "scores", label: "Scores" },
];

const STORAGE_KEY = "astraai:user-settings:tab";

const getStoredTab = (): TabKey | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "general" || stored === "scores" ? (stored as TabKey) : null;
  } catch {
    return null;
  }
};

const getTabFromHash = (): TabKey | null => {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash || "";
  const [, queryString] = hash.split("?");
  if (queryString) {
    const params = new URLSearchParams(queryString);
    const tabParam = params.get("tab");
    if (tabParam && ["general", "scores"].includes(tabParam)) {
      return tabParam as TabKey;
    }
  }
  return null;
};

export default function UserSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    return getTabFromHash() || getStoredTab() || "general";
  });

  useEffect(() => {
    const syncTab = () => {
      const next = getTabFromHash();
      if (next) setActiveTab(next);
    };
    window.addEventListener("hashchange", syncTab);
    return () => window.removeEventListener("hashchange", syncTab);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, activeTab);
    } catch {
      /* ignore storage errors */
    }
  }, [activeTab]);

  const renderTab = () => {
    switch (activeTab) {
      case "general":
        return <UserGeneralTab />;
      case "scores":
        return <UserScoresTab />;
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
