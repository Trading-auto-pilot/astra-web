import { useEffect, useState } from "react";
import SectionHeader from "../molecules/content/SectionHeader";
import AppIcon from "../atoms/icon/AppIcon";
import { useMicroserviceSlug } from "../../hooks/useHashRouter";
import { fetchContainers, type ContainerInfo } from "../../api/serviceFlags";

// Import dedicated microservice components
import AlertingServiceMicroservicePage from "./microservices/AlertingServiceMicroservicePage";
import TickerScannerMicroservicePage from "./microservices/TickerScannerMicroservicePage";
import MarketDataServiceMicroservicePage from "./microservices/MarketDataServiceMicroservicePage";
import RedisWsBridgeMicroservicePage from "./microservices/RedisWsBridgeMicroservicePage";
import CachemanagerMicroservicePage from "./microservices/CachemanagerMicroservicePage";
import DbmanagerMicroservicePage from "./microservices/DbmanagerMicroservicePage";
import DecisionEngineMicroservicePage from "./microservices/DecisionEngineMicroservicePage";
import IbkrBridgeMicroservicePage from "./microservices/IbkrBridgeMicroservicePage";
import IBKRKeepaliceMicroservicePage from "./microservices/IBKRKeepaliceMicroservicePage";
import SchedulerMicroservicePage from "./microservices/SchedulerMicroservicePage";
import IbkrgwMicroservicePage from "./microservices/IbkrgwMicroservicePage";
import LiquidityManagerMicroservicePage from "./microservices/LiquidityManagerMicroservicePage";
import ServiceControlPlaneMicroservicePage from "./microservices/ServiceControlPlaneMicroservicePage";
import BrokerExecutorIbkrMicroservicePage from "./microservices/BrokerExecutorIbkrMicroservicePage";
import DatahubMicroservicePage from "./microservices/DatahubMicroservicePage";
import McpGatewayMicroservicePage from "./microservices/McpGatewayMicroservicePage";
import CapitalManagerMicroservicePage from "./microservices/CapitalManagerMicroservicePage";
import IbkrLoginDesktopMicroservicePage from "./microservices/IbkrLoginDesktopMicroservicePage";

type ReleaseInfo = {
  version?: string | null;
  lastUpdate?: string | null;
  microservice?: string | null;
  note?: string[] | null;
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("it-IT", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AdminMicroserviceDetailPage() {
  // Shared state
  const [release, setRelease] = useState<ReleaseInfo | null>(null);
  const [health, setHealth] = useState<Record<string, any> | null>(null);
  const [containerInfo, setContainerInfo] = useState<ContainerInfo | null>(null);
  const [showReleaseModal, setShowReleaseModal] = useState(false);

  // Get microservice slug from URL hash - hook handles hashchange automatically
  const slug = useMicroserviceSlug();

  // Normalize slug for comparison
  const normalizedSlug = slug?.toLowerCase();

  // Reset state when slug changes
  useEffect(() => {
    setRelease(null);
    setHealth(null);
    setContainerInfo(null);
    setShowReleaseModal(false);
  }, [slug]);

  const normalizeId = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

  const healthValue = String(health?.status ?? health?.health ?? "").toLowerCase();
  const containerStatus = String(containerInfo?.status ?? "").toLowerCase();
  const containerState = String(containerInfo?.state ?? "").toLowerCase();

  const isHealthyFromHealth =
    healthValue === "ok" || healthValue === "healthy" || healthValue === "up" || healthValue === "running";
  const isUnhealthyFromHealth =
    healthValue === "error" || healthValue === "unhealthy" || healthValue === "down" || healthValue === "failed";

  const isHealthyFromContainer =
    containerStatus.includes("healthy") ||
    (containerState === "running" && !containerStatus.includes("unhealthy"));
  const isUnhealthyFromContainer =
    containerStatus.includes("unhealthy") || containerState === "exited" || containerState === "dead";

  const isHealthy = isHealthyFromHealth || (!isUnhealthyFromHealth && isHealthyFromContainer);
  const isUnhealthy = isUnhealthyFromHealth || isUnhealthyFromContainer;
  const healthLabel = isHealthy ? "Healthy" : isUnhealthy ? "Unhealthy" : "Unknown";
  const healthLabelLower = healthLabel.toLowerCase();
  const statusUpMatch = containerInfo?.status?.match(/\bUp\b[^,]*/i);
  const upText = statusUpMatch ? statusUpMatch[0].replace(/\s*\((healthy|unhealthy)\)\s*$/i, "").trim() : null;

  useEffect(() => {
    if (!normalizedSlug) return;
    let active = true;

    fetchContainers()
      .then((list) => {
        if (!active) return;
        const target = normalizeId(normalizedSlug);
        const match = list.find((c) => {
          const name = normalizeId(c.name || "");
          return name.includes(target) || target.includes(name);
        });
        setContainerInfo(match || null);
      })
      .catch(() => {
        if (active) setContainerInfo(null);
      });

    return () => {
      active = false;
    };
  }, [normalizedSlug]);

  // Render appropriate microservice component based on slug
  const renderMicroservice = () => {
    switch (normalizedSlug) {
      case "alertingservice":
        return (
          <AlertingServiceMicroservicePage
            onReleaseChange={setRelease}
            onHealthChange={setHealth}
            onOpenReleaseModal={() => setShowReleaseModal(true)}
          />
        );

      case "tickerscanner":
        return (
          <TickerScannerMicroservicePage
            onReleaseChange={setRelease}
            onHealthChange={setHealth}
            onOpenReleaseModal={() => setShowReleaseModal(true)}
          />
        );

      case "market-data-service":
        return (
          <MarketDataServiceMicroservicePage
            onReleaseChange={setRelease}
            onHealthChange={setHealth}
            onOpenReleaseModal={() => setShowReleaseModal(true)}
          />
        );

      case "rediswsbridge":
      case "redis-ws-bridge":
        return (
          <RedisWsBridgeMicroservicePage
            onReleaseChange={setRelease}
            onHealthChange={setHealth}
            onOpenReleaseModal={() => setShowReleaseModal(true)}
          />
        );

      case "cachemanager":
        return (
          <CachemanagerMicroservicePage
            onReleaseChange={setRelease}
            onHealthChange={setHealth}
            onOpenReleaseModal={() => setShowReleaseModal(true)}
          />
        );

      case "dbmanager":
        return (
          <DbmanagerMicroservicePage
            onReleaseChange={setRelease}
            onHealthChange={setHealth}
            onOpenReleaseModal={() => setShowReleaseModal(true)}
          />
        );

      case "decision-engine":
        return (
          <DecisionEngineMicroservicePage
            onReleaseChange={setRelease}
            onHealthChange={setHealth}
            onOpenReleaseModal={() => setShowReleaseModal(true)}
          />
        );

      case "ibkr-bridge":
        return (
          <IbkrBridgeMicroservicePage
            onReleaseChange={setRelease}
            onHealthChange={setHealth}
            onOpenReleaseModal={() => setShowReleaseModal(true)}
          />
        );

      case "ibkr-keepalive":
        return (
          <IBKRKeepaliceMicroservicePage
            onReleaseChange={setRelease}
            onHealthChange={setHealth}
            onOpenReleaseModal={() => setShowReleaseModal(true)}
          />
        );

      case "scheduler":
        return (
          <SchedulerMicroservicePage
            onReleaseChange={setRelease}
            onHealthChange={setHealth}
            onOpenReleaseModal={() => setShowReleaseModal(true)}
          />
        );

      case "ibkrgw":
        return (
          <IbkrgwMicroservicePage
            onReleaseChange={setRelease}
            onHealthChange={setHealth}
            onOpenReleaseModal={() => setShowReleaseModal(true)}
          />
        );


      case "liquidity-manager":
        return (
          <LiquidityManagerMicroservicePage
            onReleaseChange={setRelease}
            onHealthChange={setHealth}
            onOpenReleaseModal={() => setShowReleaseModal(true)}
          />
        );

      case "servicecontrolplane":
        return (
          <ServiceControlPlaneMicroservicePage
            onReleaseChange={setRelease}
            onHealthChange={setHealth}
            onOpenReleaseModal={() => setShowReleaseModal(true)}
          />
        );


      case "broker-executor-ibkr":
        return (
          <BrokerExecutorIbkrMicroservicePage
            onReleaseChange={setRelease}
            onHealthChange={setHealth}
            onOpenReleaseModal={() => setShowReleaseModal(true)}
          />
        );


      case "datahub":
        return (
          <DatahubMicroservicePage
            onReleaseChange={setRelease}
            onHealthChange={setHealth}
            onOpenReleaseModal={() => setShowReleaseModal(true)}
          />
        );


      case "mcp-gateway":
        return (
          <McpGatewayMicroservicePage
            onReleaseChange={setRelease}
            onHealthChange={setHealth}
            onOpenReleaseModal={() => setShowReleaseModal(true)}
          />
        );


      case "capital-manager":
        return (
          <CapitalManagerMicroservicePage
            onReleaseChange={setRelease}
            onHealthChange={setHealth}
            onOpenReleaseModal={() => setShowReleaseModal(true)}
          />
        );


      case "ibkr-login-desktop":
        return (
          <IbkrLoginDesktopMicroservicePage
            onReleaseChange={setRelease}
            onHealthChange={setHealth}
            onOpenReleaseModal={() => setShowReleaseModal(true)}
          />
        );

      default:
        return (
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-8 text-center shadow-sm">
            <AppIcon icon="mdi:alert-circle-outline" className="mx-auto h-12 w-12 text-slate-400" />
            <div className="mt-3 text-sm font-semibold text-slate-700">Microservizio non trovato</div>
            <div className="mt-1 text-xs text-slate-500">
              Il microservizio &quot;{slug || "-"}&quot; non è stato riconosciuto.
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4 p-4">
      <SectionHeader
        title={
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900">Microservice: {slug || "-"}</span>
            {(release?.version || containerInfo) && (
              <span className="text-xs font-normal text-slate-500">
                {release?.version ? `Version ${release.version}` : "Version -"}
                {containerInfo ? ` - ${containerInfo.id.slice(0, 12)}` : ""}
                {upText ? ` (${upText})` : ""}
              </span>
            )}
          </div>
        }
        subTitle=""
        actionComponent={
          <div className="flex items-center gap-3">
            {(health || containerInfo) && (
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    isHealthy ? "bg-emerald-500" : isUnhealthy ? "bg-rose-500" : "bg-amber-500"
                  }`}
                />
                <span className="text-xs text-slate-600">
                  {containerInfo?.state || "unknown"} ({healthLabelLower})
                </span>
              </div>
            )}
          </div>
        }
      />

      {/* key forces re-mount when navigating between microservices */}
      <div key={slug || "unknown"} className="flex-1 min-h-0 flex flex-col">{renderMicroservice()}</div>

      {/* Release Notes Modal */}
      {showReleaseModal && release && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex w-full max-w-2xl flex-col rounded-xl bg-white p-5 shadow-xl max-h-[80vh]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-slate-900">Release Information</div>
                <div className="text-sm text-slate-500">{release.microservice}</div>
              </div>
              <button
                type="button"
                className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => setShowReleaseModal(false)}
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              <div className="space-y-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="text-xs font-semibold text-slate-700">Version</div>
                  <div className="mt-1 text-sm text-slate-900">{release.version || "-"}</div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="text-xs font-semibold text-slate-700">Last Update</div>
                  <div className="mt-1 text-sm text-slate-900">{formatDateTime(release.lastUpdate)}</div>
                </div>

                {release.note && release.note.length > 0 && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <div className="text-xs font-semibold text-slate-700">Release Notes</div>
                    <ul className="mt-2 space-y-1 text-sm text-slate-700">
                      {release.note.map((note, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
