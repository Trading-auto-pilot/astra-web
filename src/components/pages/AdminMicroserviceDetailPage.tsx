import { useEffect, useMemo, useState } from "react";
import SectionHeader from "../molecules/content/SectionHeader";
import AppIcon from "../atoms/icon/AppIcon";

// Import dedicated microservice components
import AlertingServiceMicroservicePage from "./microservices/AlertingServiceMicroservicePage";
import TickerScannerMicroservicePage from "./microservices/TickerScannerMicroservicePage";
import MarketDataServiceMicroservicePage from "./microservices/MarketDataServiceMicroservicePage";
import RedisWsBridgeMicroservicePage from "./microservices/RedisWsBridgeMicroservicePage";
import CachemanagerMicroservicePage from "./microservices/CachemanagerMicroservicePage";
import DecisionEngineMicroservicePage from "./microservices/DecisionEngineMicroservicePage";
import IbkrBridgeMicroservicePage from "./microservices/IbkrBridgeMicroservicePage";
import SchedulerMicroservicePage from "./microservices/SchedulerMicroservicePage";
import IbkrgwMicroservicePage from "./microservices/IbkrgwMicroservicePage";

type ReleaseInfo = {
  version?: string | null;
  lastUpdate?: string | null;
  microservice?: string | null;
  note?: string[] | null;
};

const getSlugFromHash = (): string | null => {
  if (typeof window === "undefined") return null;
  const cleaned = window.location.hash.replace(/^#\/?/, "");
  const parts = cleaned.split("/").filter(Boolean);
  if (parts[0] === "admin" && parts[1] === "microservice" && parts[2]) {
    try {
      return decodeURIComponent(parts[2]);
    } catch {
      return parts[2];
    }
  }
  return null;
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
  const [showReleaseModal, setShowReleaseModal] = useState(false);

  // Get microservice slug from URL hash
  const slug = useMemo(() => getSlugFromHash(), []);

  // Normalize slug for comparison
  const normalizedSlug = slug?.toLowerCase();

  // Reset state when slug changes
  useEffect(() => {
    setRelease(null);
    setHealth(null);
    setShowReleaseModal(false);
  }, [slug]);

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
    <div className="space-y-4 p-4">
      <SectionHeader
        title={
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900">Microservice: {slug || "-"}</span>
            {release?.version && (
              <span className="text-xs font-normal text-slate-500">Version {release.version}</span>
            )}
          </div>
        }
        subTitle=""
        actionComponent={
          health && (
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  health?.status === "ok" || health?.health === "ok" ? "bg-emerald-500" : "bg-rose-500"
                }`}
              />
              <span className="text-xs text-slate-600">
                {health?.status === "ok" || health?.health === "ok" ? "Healthy" : "Unhealthy"}
              </span>
            </div>
          )
        }
      />

      {renderMicroservice()}

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
