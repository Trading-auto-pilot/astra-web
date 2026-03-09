import { useCallback, useEffect, useRef, useState } from "react";
import { env } from "../../../config/env";
import MicroserviceGeneralTab from "../../molecules/microservice/MicroserviceGeneralTab";

type ReleaseInfo = {
  version?: string | null;
  lastUpdate?: string | null;
  microservice?: string | null;
  note?: string[] | null;
};

type Props = {
  onReleaseChange?: (rel: ReleaseInfo | null) => void;
  onHealthChange?: (health: Record<string, any> | null) => void;
  onOpenReleaseModal?: () => void;
};

type Container = {
  id: string;
  name: string;
  image: string;
  state: string;
  status: string;
};

const API = `${env.apiBaseUrl}/servicecontrolplane`;
const getAuthHeaders = (): Record<string, string> => {
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

function stateColor(state: string) {
  if (state === "running") return "bg-emerald-100 text-emerald-700";
  if (state === "exited" || state === "dead") return "bg-rose-100 text-rose-700";
  return "bg-amber-100 text-amber-700";
}

export default function ServiceControlPlaneMicroservicePage({
  onReleaseChange,
  onHealthChange,
  onOpenReleaseModal,
}: Props) {
  const [activeTab, setActiveTab] = useState<"general" | "containers">("general");
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchContainers = useCallback(async () => {
    try {
      const r = await fetch(`${API}/containers`, { headers: getAuthHeaders() });
      const d = await r.json();
      if (d.ok) {
        setContainers(d.containers);
        setError(null);
      } else {
        setError(d.error || "Errore nel caricamento");
      }
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    if (activeTab !== "containers") {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    setLoading(true);
    fetchContainers().finally(() => setLoading(false));
    intervalRef.current = setInterval(fetchContainers, 10000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeTab, fetchContainers]);

  const doAction = async (name: string, action: "start" | "stop" | "restart") => {
    setActionLoading((p) => ({ ...p, [`${name}:${action}`]: true }));
    try {
      await fetch(`${API}/containers/${encodeURIComponent(name)}/${action}`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
    } finally {
      setActionLoading((p) => ({ ...p, [`${name}:${action}`]: false }));
      await fetchContainers();
    }
  };

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      {/* Tab bar */}
      <div className="flex gap-6 border-b border-slate-200">
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "general"
              ? "border-b-2 border-slate-900 text-slate-900"
              : "text-slate-500"
          }`}
          onClick={() => setActiveTab("general")}
        >
          General Settings
        </button>
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "containers"
              ? "border-b-2 border-slate-900 text-slate-900"
              : "text-slate-500"
          }`}
          onClick={() => setActiveTab("containers")}
        >
          Containers
        </button>
      </div>

      {/* General Settings tab */}
      {activeTab === "general" && (
        <div className="flex-1 min-h-0 flex flex-col">
          <MicroserviceGeneralTab
            microservice="servicecontrolplane"
            onReleaseChange={onReleaseChange}
            onHealthChange={onHealthChange}
            onOpenReleaseModal={onOpenReleaseModal}
          />
        </div>
      )}

      {/* Containers tab */}
      {activeTab === "containers" && (
        <div className="flex flex-1 flex-col gap-3 p-4 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-700">Docker Containers</div>
            <button
              type="button"
              onClick={() => fetchContainers()}
              className="rounded bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
            >
              Refresh
            </button>
          </div>

          {loading && (
            <div className="text-xs text-slate-400">Caricamento...</div>
          )}

          {error && (
            <div className="rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>
          )}

          {!loading && !error && containers.length === 0 && (
            <div className="text-xs text-slate-400">Nessun container trovato</div>
          )}

          <div className="flex flex-col gap-2">
            {containers.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3"
              >
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <div className="text-xs font-semibold text-slate-800 truncate">{c.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{c.image}</div>
                  <div className={`mt-1 inline-flex self-start rounded-full px-2 py-0.5 text-[10px] font-semibold ${stateColor(c.state)}`}>
                    {c.status}
                  </div>
                </div>
                <div className="flex gap-1.5 ml-3 flex-shrink-0">
                  <button
                    type="button"
                    disabled={!!actionLoading[`${c.name}:start`] || c.state === "running"}
                    onClick={() => doAction(c.name, "start")}
                    className="rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-500 disabled:opacity-40"
                  >
                    Start
                  </button>
                  <button
                    type="button"
                    disabled={!!actionLoading[`${c.name}:stop`] || c.state !== "running"}
                    onClick={() => doAction(c.name, "stop")}
                    className="rounded bg-rose-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-rose-500 disabled:opacity-40"
                  >
                    Stop
                  </button>
                  <button
                    type="button"
                    disabled={!!actionLoading[`${c.name}:restart`]}
                    onClick={() => doAction(c.name, "restart")}
                    className="rounded bg-slate-700 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-slate-600 disabled:opacity-40"
                  >
                    {actionLoading[`${c.name}:restart`] ? "..." : "Restart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
