import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchCacheDbLoggerStatus,
  fetchCacheLogLevel,
  fetchCacheReleaseInfo,
  fetchCacheSettings,
  fetchCacheHealth,
  reloadCacheSettings,
  updateCacheSetting,
  fetchCacheCommunicationChannels,
  updateCacheCommunicationChannels,
  fetchServiceFlags,
  setCacheLogLevel,
  setCacheDbLoggerStatus,
  updateServiceFlag,
  type ServiceFlag,
} from "../../api/serviceFlags";
import SectionHeader from "../molecules/content/SectionHeader";
import BaseButton from "../atoms/base/buttons/BaseButton";
import AppIcon from "../atoms/icon/AppIcon";
import MicroserviceLogsCard from "../molecules/microservice/MicroserviceLogsCard";

type Status = "idle" | "loading" | "error";

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

const formatUptime = (value?: number | string) => {
  if (value === undefined || value === null) return "";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (!Number.isFinite(num)) return String(value);
  const totalSeconds = Math.max(0, Math.floor(num));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const parts = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (parts.length === 0) parts.push(`${totalSeconds}s`);
  return parts.join(" ");
};

type AlertProps = {
  message: string;
  tone?: "error" | "warn" | "success";
  onClose?: () => void;
};

const Alert = ({ message, tone = "error", onClose }: AlertProps) => {
  const palette =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "warn"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-red-200 bg-red-50 text-red-700";
  return (
    <div
      className={`relative rounded-md border ${palette} px-3 py-2 text-xs pr-8`}
    >
      {message}
      {onClose && (
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-1 text-[11px] text-slate-500 hover:bg-slate-100"
          onClick={onClose}
          aria-label="Chiudi"
        >
          ×
        </button>
      )}
    </div>
  );
};

type ChannelUiState = {
  on: boolean;
  intervalsMs: string;
};

type HealthInfo = {
  status?: string;
  uptime?: number | string;
  [key: string]: any;
};

const channelOrder = ["telemetry", "metrics", "data", "logs"];

export default function AdminMicroserviceDetailPage() {
  const [rows, setRows] = useState<ServiceFlag[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [dbLogger, setDbLogger] = useState<boolean | null>(null);
  const [dbLoggerStatus, setDbLoggerStatus] = useState<Status>("idle");
  const [dbLoggerError, setDbLoggerError] = useState<string | null>(null);
  const [logLevel, setLogLevel] = useState<string | null>(null);
  const [logLevelStatus, setLogLevelStatus] = useState<Status>("idle");
  const [logLevelError, setLogLevelError] = useState<string | null>(null);
  const [release, setRelease] = useState<ReleaseInfo | null>(null);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [settings, setSettings] = useState<Record<string, unknown> | null>(null);
  const [settingsStatus, setSettingsStatus] = useState<Status>("idle");
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editableSettings, setEditableSettings] = useState<Record<string, string>>({});
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveSettingsError, setSaveSettingsError] = useState<string | null>(null);
  const [settingsSuccess, setSettingsSuccess] = useState<string | null>(null);
  const [communicationChannels, setCommunicationChannels] = useState<Record<string, ChannelUiState>>({});
  const [communicationOriginal, setCommunicationOriginal] = useState<Record<string, ChannelUiState>>({});
  const [communicationStatus, setCommunicationStatus] = useState<Status>("idle");
  const [communicationError, setCommunicationError] = useState<string | null>(null);
  const [communicationSuccess, setCommunicationSuccess] = useState<string | null>(null);
  const [communicationSaving, setCommunicationSaving] = useState(false);
  const [health, setHealth] = useState<HealthInfo | null>(null);

  const slug = useMemo(() => getSlugFromHash(), []);

  const normalizeChannels = useCallback((input: Record<string, any>) => {
    const result: Record<string, ChannelUiState> = {};
    Object.entries(input || {}).forEach(([key, value]) => {
      const on = !!(value as any)?.on;
      const msVal = (value as any)?.params?.intervalsMs;
      result[key] = { on, intervalsMs: msVal !== undefined && msVal !== null ? String(msVal) : "" };
    });
    return result;
  }, []);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const items = await fetchServiceFlags();
      setRows(items);
      setStatus("idle");
    } catch (err: any) {
      setError(err?.message || "Errore durante il caricamento");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!slug || slug.toLowerCase() !== "cachemanager") return;
    setDbLoggerStatus("loading");
    setDbLoggerError(null);
    fetchCacheDbLoggerStatus()
      .then((enabled) => {
        setDbLogger(enabled);
        setDbLoggerStatus("idle");
      })
      .catch((err: any) => {
        setDbLoggerError(err?.message || "Errore nel leggere dbLogger");
        setDbLoggerStatus("error");
      });

    setLogLevelStatus("loading");
    setLogLevelError(null);
    fetchCacheLogLevel()
      .then((lvl) => {
        setLogLevel(lvl);
        setLogLevelStatus("idle");
      })
      .catch((err: any) => {
        setLogLevelError(err?.message || "Errore nel leggere log level");
        setLogLevelStatus("error");
      });

    fetchCacheReleaseInfo()
      .then((info) => setRelease(info))
      .catch(() => setRelease(null));

    fetchCacheHealth()
      .then((data) => setHealth(data as any))
      .catch(() => setHealth(null));

    setSettingsStatus("loading");
    setSettingsError(null);
    setSettingsSuccess(null);
    fetchCacheSettings()
      .then((data) => {
        setSettings(data);
        const obj: Record<string, string> = {};
        Object.entries(data || {}).forEach(([k, v]) => {
          obj[k] = v != null ? String(v) : "";
        });
        setEditableSettings(obj);
        setSettingsStatus("idle");
      })
      .catch((err: any) => {
        setSettingsError(err?.message || "Errore nel leggere i settings");
        setSettingsStatus("error");
      });
    setCommunicationStatus("loading");
    setCommunicationError(null);
    setCommunicationSuccess(null);
    fetchCacheCommunicationChannels()
      .then((data) => {
        const normalized = normalizeChannels(data);
        setCommunicationChannels(normalized);
        setCommunicationOriginal(normalized);
        setCommunicationStatus("idle");
      })
      .catch((err: any) => {
        setCommunicationError(err?.message || "Errore nel leggere i communication channels");
        setCommunicationStatus("error");
      });
  }, [slug, normalizeChannels]);

  const filtered = useMemo(() => {
    if (!slug) return [];
    return rows.filter((row) => row.microservice?.toLowerCase() === slug.toLowerCase());
  }, [rows, slug]);

  const toggleEnabled = useCallback(
    async (row: ServiceFlag) => {
      const nextEnabled = !Boolean(row.enabled);
      setUpdateError(null);
      setUpdatingId(row.id);

      const prevRows = rows;
      setRows((current) =>
        current.map((item) => (item.id === row.id ? { ...item, enabled: nextEnabled } : item))
      );

      try {
        await updateServiceFlag(row.id, {
          env: row.env,
          microservice: row.microservice,
          enabled: nextEnabled,
          note: row.note ?? null,
        });
      } catch (err: any) {
        setRows(prevRows);
        setUpdateError(err?.message || "Errore durante l'aggiornamento");
      } finally {
        setUpdatingId(null);
      }
    },
    [rows]
  );

  const handleSaveChannels = useCallback(async () => {
    setCommunicationError(null);
    setCommunicationSuccess(null);

    const getSafeMs = (key: string, value: ChannelUiState | undefined, prev: ChannelUiState | undefined) => {
      const raw = value?.intervalsMs ?? prev?.intervalsMs ?? "";
      const parsed = parseInt(String(raw), 10);
      if (Number.isInteger(parsed) && parsed > 0) return parsed;
      const prevParsed = parseInt(String(prev?.intervalsMs ?? ""), 10);
      if (Number.isInteger(prevParsed) && prevParsed > 0) return prevParsed;
      return 1000; // fallback di sicurezza
    };

    // verifica se almeno un intervalsMs è cambiato
    const changes: Record<string, ChannelUiState> = {};
    Object.entries(communicationChannels || {}).forEach(([key, value]) => {
      const prev = communicationOriginal[key];
      const currentMs = value.intervalsMs || prev?.intervalsMs || "";
      const prevMs = prev?.intervalsMs || "";
      // Salviamo solo variazioni sui parametri (intervalsMs). Lo switch viene salvato immediatamente.
      if (!prev || currentMs !== prevMs) {
        changes[key] = { ...value, intervalsMs: currentMs };
      }
    });

    if (Object.keys(changes).length === 0) {
      setCommunicationSuccess("Nessuna modifica da salvare");
      return;
    }

    const fullPayload: Record<string, { on: boolean; params: { intervalsMs: number } }> = {};
    for (const [key, value] of Object.entries(communicationChannels || {})) {
      const prev = communicationOriginal[key];
      const safeMs = getSafeMs(key, value, prev);
      fullPayload[key] = { on: !!value.on, params: { intervalsMs: safeMs } };
    }

    setCommunicationSaving(true);
    try {
      // inviamo l'intera configurazione corrente
      const updated = await updateCacheCommunicationChannels(fullPayload);
      const latest = normalizeChannels({ ...(communicationChannels || {}), ...(updated || {}) });
      setCommunicationChannels(latest);
      setCommunicationOriginal(latest);
      setCommunicationSuccess("Canali aggiornati");
    } catch (err: any) {
      setCommunicationError(err?.message || "Errore salvando i communication channels");
    } finally {
      setCommunicationSaving(false);
    }
  }, [communicationChannels, communicationOriginal, normalizeChannels]);

  const handleToggleChannel = useCallback(
    async (key: string) => {
      const current = communicationChannels[key];
      if (!current) return;
      const prevOn = !!current.on;
      const nextOn = !prevOn;

      const getSafeMs = (value: ChannelUiState | undefined, prev: ChannelUiState | undefined) => {
        const raw = value?.intervalsMs ?? prev?.intervalsMs ?? "";
        const parsed = parseInt(String(raw), 10);
        if (Number.isInteger(parsed) && parsed > 0) return parsed;
        const prevParsed = parseInt(String(prev?.intervalsMs ?? ""), 10);
        if (Number.isInteger(prevParsed) && prevParsed > 0) return prevParsed;
        return 1000;
      };
      const parsed = getSafeMs(current, communicationOriginal[key]);

      setCommunicationError(null);
      setCommunicationSuccess(null);
      // aggiorna subito lo stato locale
      setCommunicationChannels((prev) => ({
        ...prev,
        [key]: { ...(prev[key] || { intervalsMs: "" }), on: nextOn },
      }));

      setCommunicationSaving(true);
      try {
        // payload completo di tutti i canali correnti (incluso quello appena togglato)
        const payload: Record<string, { on: boolean; params: { intervalsMs: number } }> = {};
        const snapshot = {
          ...communicationChannels,
          [key]: { ...current, on: nextOn, intervalsMs: String(parsed) || communicationOriginal[key]?.intervalsMs || "" },
        };
        for (const [chKey, value] of Object.entries(snapshot)) {
          const msVal = getSafeMs(value, communicationOriginal[chKey]);
          payload[chKey] = { on: !!value.on, params: { intervalsMs: msVal } };
        }

        const updated = await updateCacheCommunicationChannels(payload);
        const normalized = normalizeChannels({ ...(communicationOriginal || {}), ...(updated || {}) });
        setCommunicationChannels(normalized);
        setCommunicationOriginal(normalized);
        setCommunicationSuccess(`Canale ${key} aggiornato`);
      } catch (err: any) {
        // rollback
        setCommunicationChannels((prev) => ({
          ...prev,
          [key]: { ...(prev[key] || { intervalsMs: "" }), on: prevOn },
        }));
        setCommunicationError(err?.message || `Errore aggiornando il canale ${key}`);
      } finally {
        setCommunicationSaving(false);
      }
    },
    [communicationChannels, communicationOriginal, normalizeChannels]
  );

  const heading = slug || "Microservice";
  const subtitle = filtered[0]?.note || "";
  const isCachemanager = slug?.toLowerCase() === "cachemanager";
  const releaseTitle = release?.microservice || heading;
  const healthStatus = health?.status ? `Status: ${health.status}` : "";
  const healthUptime = health?.uptime !== undefined ? `Uptime: ${formatUptime(health.uptime)}` : "";
  const healthMeta =
    healthStatus || healthUptime ? [healthStatus, healthUptime].filter(Boolean).join(" · ") : "";
  const releaseMetaParts = [];
  if (release?.version) releaseMetaParts.push(`v${release.version}`);
  if (release?.lastUpdate) releaseMetaParts.push(release.lastUpdate);
  if (healthMeta) releaseMetaParts.push(healthMeta);
  const releaseMeta = releaseMetaParts.join(" · ");

  return (
    <div className="space-y-4">
      <SectionHeader
        title={
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900">{releaseTitle}</span>
            {releaseMeta ? <span className="text-[11px] text-slate-500">{releaseMeta}</span> : null}
          </div>
        }
        subTitle={subtitle}
        actionComponent={
          <div className="flex gap-2">
            <BaseButton
              variant="outline"
              color="neutral"
              size="sm"
              startIcon={<AppIcon icon="mdi:chevron-left" />}
              onClick={() => {
                window.location.hash = "#/admin/microservice";
              }}
            >
              Back
            </BaseButton>
            {isCachemanager && (
              <BaseButton
                variant="outline"
                color="neutral"
                size="sm"
                startIcon={<AppIcon icon="mdi:database-settings" />}
                onClick={() => {
                  setShowSettingsModal(true);
                  setSettingsStatus("loading");
                  setSettingsError(null);
                  setSettingsSuccess(null);
                  fetchCacheSettings()
                    .then((data) => {
                      setSettings(data);
                      const obj: Record<string, string> = {};
                      Object.entries(data || {}).forEach(([k, v]) => {
                        obj[k] = v != null ? String(v) : "";
                      });
                      setEditableSettings(obj);
                      setSettingsStatus("idle");
                    })
                    .catch((err: any) => {
                      setSettingsError(err?.message || "Errore nel leggere i settings");
                      setSettingsStatus("error");
                    });
                }}
              >
                DB Settings
              </BaseButton>
            )}
            <BaseButton
              variant="outline"
              color="neutral"
              size="sm"
              startIcon={<AppIcon icon="mdi:information-outline" />}
              onClick={() => setShowReleaseModal(true)}
              disabled={!release}
            >
              Release info
            </BaseButton>
          </div>
        }
      />

      {status === "error" && error && (
        <Alert message={error} tone="error" onClose={() => setError(null)} />
      )}

      {updateError && (
        <Alert message={updateError} tone="warn" onClose={() => setUpdateError(null)} />
      )}

      {!slug && (
        <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
          Microservizio non specificato.
        </div>
      )}

      {slug && status === "loading" && filtered.length === 0 && (
        <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
          Caricamento...
        </div>
      )}

      {slug && filtered.length === 0 && status !== "loading" && (
        <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
          Nessun flag trovato per {slug}.
        </div>
      )}

      {filtered.length > 0 && !isCachemanager && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 font-semibold">Env</th>
                <th className="px-3 py-2 font-semibold">Enabled</th>
                <th className="px-3 py-2 font-semibold">Note</th>
                <th className="px-3 py-2 font-semibold">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-semibold text-slate-900">{row.env}</td>
                  <td className="px-3 py-2">
                    <label className="inline-flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={!!row.enabled}
                        disabled={updatingId === row.id}
                        onChange={() => toggleEnabled(row)}
                      />
                      <span
                        className={`relative inline-flex h-5 w-9 items-center rounded-full border transition ${
                          row.enabled ? "border-emerald-300 bg-emerald-500" : "border-slate-300 bg-slate-200"
                        } ${updatingId === row.id ? "opacity-70" : ""}`}
                      >
                        <span
                          className={`h-4 w-4 rounded-full bg-white shadow transition ${
                            row.enabled ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </span>
                      <span className="text-[11px] font-semibold text-slate-700">
                        {row.enabled ? "On" : "Off"}
                      </span>
                    </label>
                  </td>
                  <td className="px-3 py-2 text-slate-700">{row.note || "-"}</td>
                  <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{formatDateTime(row.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length > 0 && isCachemanager && (
        <div className="mt-2 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-[11px] text-slate-700">
            <table className="min-w-[200px] text-[11px] text-slate-700">
              <tbody>
                <tr>
                  <td className="pr-3 font-semibold text-slate-600">Service Enabled</td>
                  <td className="py-1">
                    <label className="inline-flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={!!filtered[0].enabled}
                        disabled={updatingId === filtered[0].id}
                        onChange={() => toggleEnabled(filtered[0])}
                      />
                      <span
                        className={`relative inline-flex h-5 w-9 items-center rounded-full border transition ${
                          filtered[0].enabled ? "border-emerald-300 bg-emerald-500" : "border-slate-300 bg-slate-200"
                        } ${updatingId === filtered[0].id ? "opacity-70" : ""}`}
                      >
                        <span
                          className={`h-4 w-4 rounded-full bg-white shadow transition ${
                            filtered[0].enabled ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </span>
                      <span className="text-[11px] font-semibold text-slate-700">
                        {filtered[0].enabled ? "On" : "Off"}
                      </span>
                    </label>
                    <div className="mt-1 text-[11px] text-slate-500">
                      Abilita o disabilita il profilo del microservizio: il processo automatico lo avvia o lo esclude.
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="pr-3 font-semibold text-slate-600">DB Logger</td>
                  <td className="py-1">
                    <label className="inline-flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={!!dbLogger}
                        disabled={dbLoggerStatus === "loading"}
                        onChange={async () => {
                          const next = !dbLogger;
                          setDbLogger(next);
                          setDbLoggerError(null);
                          setDbLoggerStatus("loading");
                          try {
                            await setCacheDbLoggerStatus(next);
                            setDbLoggerStatus("idle");
                          } catch (err: any) {
                            setDbLoggerError(err?.message || "Errore aggiornando dbLogger");
                            setDbLoggerStatus("error");
                          }
                        }}
                      />
                      <span
                        className={`relative inline-flex h-5 w-9 items-center rounded-full border transition ${
                          dbLogger ? "border-emerald-300 bg-emerald-500" : "border-slate-300 bg-slate-200"
                        } ${dbLoggerStatus === "loading" ? "opacity-70" : ""}`}
                      >
                        <span
                          className={`h-4 w-4 rounded-full bg-white shadow transition ${
                            dbLogger ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </span>
                      <span className="text-[11px] font-semibold text-slate-700">
                        {dbLogger ? "On" : "Off"}
                      </span>
                    </label>
                    <div className="mt-1 text-[11px] text-slate-500">
                      Abilita o disabilita la scrittura dei log in DB.
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="pr-3 font-semibold text-slate-600">DB Level</td>
                  <td className="py-1">
                    <div className="flex items-center gap-2">
                      <select
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                        value={logLevel ?? ""}
                        disabled={logLevelStatus === "loading"}
                        onChange={async (e) => {
                          const next = e.target.value;
                          setLogLevelError(null);
                          setLogLevelStatus("loading");
                          try {
                            await setCacheLogLevel(next);
                            setLogLevel(next);
                            setLogLevelStatus("idle");
                          } catch (err: any) {
                            setLogLevelError(err?.message || "Errore aggiornando log level");
                            setLogLevelStatus("error");
                          }
                        }}
                      >
                        <option value="">-</option>
                        <option value="trace">trace</option>
                        <option value="log">log</option>
                        <option value="info">info</option>
                        <option value="warning">warning</option>
                        <option value="error">error</option>
                      </select>
                      {logLevelStatus === "loading" && (
                        <span className="text-[11px] text-slate-500">Aggiornamento...</span>
                      )}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      Seleziona il livello di log del cachemanager.
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="pr-3 font-semibold text-slate-600">Updated</td>
                  <td className="py-1 whitespace-nowrap">{formatDateTime(filtered[0].updated_at)}</td>
                </tr>
              </tbody>
            </table>
            {dbLoggerError && (
              <div className="mt-2">
                <Alert message={dbLoggerError} tone="warn" onClose={() => setDbLoggerError(null)} />
              </div>
            )}
            {logLevelError && (
              <div className="mt-2">
                <Alert message={logLevelError} tone="warn" onClose={() => setLogLevelError(null)} />
              </div>
            )}
          </div>
          <div className="rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-[11px] text-slate-700">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-700">Communication channels</div>
              {communicationStatus === "loading" && (
                <span className="text-[11px] text-slate-500">Caricamento...</span>
              )}
            </div>
            {communicationError && (
              <div className="mb-2">
                <Alert
                  message={communicationError}
                  tone="warn"
                  onClose={() => setCommunicationError(null)}
                />
              </div>
            )}
            {communicationSuccess && (
              <div className="mb-2">
                <Alert
                  message={communicationSuccess}
                  tone="success"
                  onClose={() => setCommunicationSuccess(null)}
                />
              </div>
            )}
            <div className="rounded-md border border-slate-100 bg-white">
              {channelOrder.map((key) => {
                const ch = communicationChannels[key];
                if (!ch) return null;
                return (
                  <div key={key} className="flex items-center gap-3 border-b border-slate-100 px-3 py-2 last:border-b-0">
                    <div className="w-28 text-[11px] font-semibold text-slate-600 capitalize">{key}</div>
                    <label className="inline-flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={!!ch.on}
                        onChange={() => handleToggleChannel(key)}
                        disabled={communicationSaving}
                      />
                      <span
                        className={`relative inline-flex h-5 w-9 items-center rounded-full border transition ${
                          ch.on ? "border-emerald-300 bg-emerald-500" : "border-slate-300 bg-slate-200"
                        } ${communicationSaving ? "opacity-70" : ""}`}
                      >
                        <span
                          className={`h-4 w-4 rounded-full bg-white shadow transition ${
                            ch.on ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </span>
                      <span className="text-[11px] font-semibold text-slate-700">{ch.on ? "On" : "Off"}</span>
                    </label>
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-slate-500">intervalsMs</span>
                      <input
                        type="number"
                        min={1}
                        className="w-24 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                        value={ch.intervalsMs}
                        onChange={(e) =>
                          setCommunicationChannels((prev) => ({
                            ...prev,
                            [key]: { ...(prev[key] || { on: false }), intervalsMs: e.target.value },
                          }))
                        }
                        disabled={communicationSaving}
                      />
                    </div>
                  </div>
                );
              })}
              {Object.keys(communicationChannels || {}).length === 0 && communicationStatus !== "loading" && (
                <div className="px-3 py-2 text-[11px] text-slate-500">Nessun channel disponibile</div>
              )}
            </div>
            <div className="mt-3 flex justify-end">
              <BaseButton
                variant="outline"
                color="neutral"
                size="sm"
                startIcon={<AppIcon icon="mdi:content-save-outline" />}
                disabled={communicationSaving || communicationStatus === "loading"}
                onClick={handleSaveChannels}
              >
                Save channels
              </BaseButton>
            </div>
          </div>
        </div>
      )}
      {filtered.length > 0 && (
        <div className="mt-3">
          <MicroserviceLogsCard microservice={slug} limit={100} />
        </div>
      )}

      {showReleaseModal && release && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <div className="text-base font-semibold text-slate-900">{release.microservice || heading}</div>
                <div className="text-[11px] text-slate-500">
                  {release.version ? `v${release.version}` : "versione non disponibile"}
                  {release.lastUpdate ? ` · ${release.lastUpdate}` : ""}
                </div>
              </div>
              <button
                type="button"
                className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => setShowReleaseModal(false)}
              >
                Chiudi
              </button>
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
              <table className="w-full text-left">
                <tbody>
                  <tr>
                    <td className="pr-2 font-semibold text-slate-600">Versione</td>
                    <td className="text-slate-800">{release.version ?? "-"}</td>
                  </tr>
                  <tr>
                    <td className="pr-2 font-semibold text-slate-600">Last update</td>
                    <td className="text-slate-800">{release.lastUpdate ?? "-"}</td>
                  </tr>
                  <tr>
                    <td className="pr-2 font-semibold text-slate-600 align-top">Note</td>
                    <td className="text-slate-800">
                      {Array.isArray(release.note) && release.note.length ? (
                        <ul className="list-disc pl-4 space-y-1">
                          {release.note.map((n, idx) => (
                            <li key={idx}>{n}</li>
                          ))}
                        </ul>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showSettingsModal && isCachemanager && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div className="text-base font-semibold text-slate-900">DB Settings</div>
              <button
                type="button"
                className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => setShowSettingsModal(false)}
              >
                Chiudi
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto px-4 py-3 text-[11px] text-slate-700">
              {settingsStatus === "loading" && <div className="text-[11px] text-slate-500">Caricamento...</div>}
              {settingsError && (
                <div className="mb-2">
                  <Alert message={settingsError} tone="warn" onClose={() => setSettingsError(null)} />
                </div>
              )}
              {settingsSuccess && (
                <div className="mb-2">
                  <Alert
                    message={settingsSuccess}
                    tone="success"
                    onClose={() => setSettingsSuccess(null)}
                  />
                </div>
              )}
              {!settingsError && settings && (
                <table className="min-w-[200px] text-[11px] text-slate-700">
                  <tbody>
                    {Object.entries(editableSettings).map(([key, val]) => (
                      <tr key={key} className="border-t border-slate-100 first:border-t-0">
                        <td className="pr-3 font-semibold text-slate-600 align-top">{key}</td>
                        <td className="py-1">
                          <input
                            className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                            value={val}
                            onChange={(e) =>
                              setEditableSettings((prev) => ({
                                ...prev,
                                [key]: e.target.value,
                              }))
                            }
                            disabled={savingSettings}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {saveSettingsError && (
                <div className="mt-2">
                  <Alert
                    message={saveSettingsError}
                    tone="warn"
                    onClose={() => setSaveSettingsError(null)}
                  />
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-3">
              <BaseButton
                variant="outline"
                color="neutral"
                size="sm"
                startIcon={<AppIcon icon="mdi:database-refresh" />}
                disabled={savingSettings || settingsStatus === "loading"}
                onClick={async () => {
                  setSettingsStatus("loading");
                  setSettingsError(null);
                  setSaveSettingsError(null);
                  setSettingsSuccess(null);
                  try {
                    await reloadCacheSettings();
                    const data = await fetchCacheSettings();
                    setSettings(data);
                    const obj: Record<string, string> = {};
                    Object.entries(data || {}).forEach(([k, v]) => {
                      obj[k] = v != null ? String(v) : "";
                    });
                    setEditableSettings(obj);
                    setSettingsStatus("idle");
                    setSettingsSuccess("Settings ricaricati dal DB");
                  } catch (err: any) {
                    setSettingsError(err?.message || "Errore nel ricaricare i settings");
                    setSettingsStatus("error");
                  }
                }}
              >
                Reload from DB
              </BaseButton>
              <BaseButton
                variant="outline"
                color="neutral"
                size="sm"
                startIcon={<AppIcon icon="mdi:content-save-outline" />}
                disabled={savingSettings || settingsStatus === "loading"}
                onClick={async () => {
                  if (!settings) return;
                  setSaveSettingsError(null);
                  setSettingsSuccess(null);
                  setSavingSettings(true);
                  try {
                    const changes = Object.entries(editableSettings).filter(
                      ([k, v]) => String(settings?.[k] ?? "") !== v
                    );
                    for (const [key, value] of changes) {
                      await updateCacheSetting(key, value);
                    }
                    const updated: Record<string, unknown> = {};
                    Object.entries(editableSettings).forEach(([k, v]) => {
                      updated[k] = v;
                    });
                    setSettings(updated);
                    setSavingSettings(false);
                    setSettingsSuccess("Settings salvati in cache");
                  } catch (err: any) {
                    setSaveSettingsError(err?.message || "Errore nel salvataggio dei settings");
                    setSavingSettings(false);
                  }
                }}
              >
                Save
              </BaseButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
