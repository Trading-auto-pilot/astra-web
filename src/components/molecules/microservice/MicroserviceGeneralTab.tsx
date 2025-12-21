import { useCallback, useEffect, useMemo, useState } from "react";
import BaseButton from "../../atoms/base/buttons/BaseButton";
import AppIcon from "../../atoms/icon/AppIcon";
import MicroserviceLogsCard from "./MicroserviceLogsCard";
import { env } from "../../../config/env";

type Status = "idle" | "loading" | "error";

type ReleaseInfo = {
  version?: string | null;
  lastUpdate?: string | null;
  microservice?: string | null;
  note?: string[] | null;
};

type ChannelUiState = {
  on: boolean;
  intervalsMs: string;
  params?: Record<string, any>;
};

type Props = {
  microservice: string;
  onDbLoggerChange?: (enabled: boolean) => void;
  onLogLevelChange?: (level: string | null) => void;
  onReleaseChange?: (rel: ReleaseInfo | null) => void;
  onHealthChange?: (health: Record<string, any> | null) => void;
  onOpenReleaseModal?: () => void;
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

export default function MicroserviceGeneralTab({
  microservice,
  onDbLoggerChange,
  onLogLevelChange,
  onReleaseChange,
  onHealthChange,
  onOpenReleaseModal,
}: Props) {
  const [dbLogger, setDbLogger] = useState<boolean | null>(null);
  const [dbLoggerStatus, setDbLoggerStatus] = useState<Status>("idle");
  const [dbLoggerError, setDbLoggerError] = useState<string | null>(null);
  const [logLevel, setLogLevel] = useState<string | null>(null);
  const [logLevelStatus, setLogLevelStatus] = useState<Status>("idle");
  const [logLevelError, setLogLevelError] = useState<string | null>(null);
  const [release, setRelease] = useState<ReleaseInfo | null>(null);
  const [health, setHealth] = useState<Record<string, any> | null>(null);
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
  const [communicationRaw, setCommunicationRaw] = useState<Record<string, any> | null>(null);
  const [communicationMax, setCommunicationMax] = useState<number | null>(null);
  const [communicationStatus, setCommunicationStatus] = useState<Status>("idle");
  const [communicationError, setCommunicationError] = useState<string | null>(null);
  const [communicationSuccess, setCommunicationSuccess] = useState<string | null>(null);
  const [communicationSaving, setCommunicationSaving] = useState(false);

  const lowerName = microservice.toLowerCase();
  const isCache = lowerName === "cachemanager";
  const hasDbControls = true;
  const token = useMemo(() => {
    if (typeof localStorage === "undefined") return null;
    return localStorage.getItem("astraai:auth:token");
  }, []);

  const buildUrl = useCallback(
    (path: string) => {
      const ms = microservice.replace(/^\/+|\/+$/g, "");
      const p = path.replace(/^\/+/, "");
      return `${env.apiBaseUrl}/${ms}/${p}`;
    },
    [microservice]
  );

  const parseJsonSafely = async (response: Response) => {
    const text = await response.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      return text;
    }
  };

  const apiGet = useCallback(
    async (path: string) => {
      const res = await fetch(buildUrl(path), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await parseJsonSafely(res);
      if (!res.ok) {
        const message = (data as any)?.message || (data as any)?.error || "Errore richiesta";
        throw new Error(message);
      }
      return data;
    },
    [buildUrl, token]
  );

  const apiSend = useCallback(
    async (method: "PUT" | "POST", path: string, body?: any) => {
      const res = await fetch(buildUrl(path), {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await parseJsonSafely(res);
      if (!res.ok) {
        const message = (data as any)?.message || (data as any)?.error || "Errore richiesta";
        throw new Error(message);
      }
      return data;
    },
    [buildUrl, token]
  );

  const fetchCacheSettings = useCallback(async () => {
    const data = await apiGet("settings");
    return (data as any)?.data ?? data;
  }, [apiGet]);

  const reloadCacheSettings = useCallback(async () => {
    return apiSend("POST", "settings/reload");
  }, [apiSend]);

  const updateCacheSetting = useCallback(
    async (key: string, value: any) => {
      return apiSend("PUT", "settings", { [key]: value });
    },
    [apiSend]
  );

  const updateCacheCommunicationChannels = useCallback(
    async (payload: Record<string, { on: boolean; params: Record<string, any> }>) => {
      return apiSend("PUT", "status/communicationChannels", payload);
    },
    [apiSend]
  );

  const updateSchedulerCommunicationChannels = useCallback(
    async (payload: Record<string, { on: boolean; params: Record<string, any> }>) => {
      return apiSend("PUT", "status/communicationChannels", payload);
    },
    [apiSend]
  );

  const normalizeChannels = useCallback((input: Record<string, any>) => {
    const result: Record<string, ChannelUiState> = {};
    Object.entries(input || {}).forEach(([key, value]) => {
      if (key === "maxAllowedIntervalMs" || key === "details" || key === "communicationChannels") return;
      if (value === undefined || value === null) return;
      const on = !!(value as any)?.on;
      const params = (value as any)?.params || {};
      const msVal = params?.intervalsMs;
      result[key] = {
        on,
        intervalsMs: msVal !== undefined && msVal !== null ? String(msVal) : "",
        params,
      };
    });
    return result;
  }, []);

  useEffect(() => {
    apiGet("release")
      .then((info) => {
        setRelease(info as ReleaseInfo);
        onReleaseChange?.(info as ReleaseInfo);
      })
      .catch(() => {
        setRelease(null);
        onReleaseChange?.(null);
      });

    apiGet("status/health")
      .then((data) => {
        setHealth(data as any);
        onHealthChange?.(data as any);
      })
      .catch(() => {
        setHealth(null);
        onHealthChange?.(null);
      });

    if (hasDbControls) {
      setDbLoggerStatus("loading");
      setDbLoggerError(null);
      apiGet("dbLogger")
        .then((enabled) => {
          const on = typeof (enabled as any)?.data === "boolean" ? (enabled as any).data : !!(enabled as any)?.enabled;
          setDbLogger(on);
          setDbLoggerStatus("idle");
          onDbLoggerChange?.(on);
        })
        .catch((err: any) => {
          setDbLoggerError(err?.message || "Errore nel leggere dbLogger");
          setDbLoggerStatus("error");
        });

      setLogLevelStatus("loading");
      setLogLevelError(null);
      apiGet("status/logLevel")
        .then((lvl) => {
          const key = lowerName || microservice.toLowerCase();
          const level =
            (typeof lvl === "object" && lvl !== null
              ? Object.values(lvl)[0]
              : undefined) ||
            (lvl as any)?.[key] ||
            (lvl as any)?.logLevel ||
            (lvl as any)?.level ||
            (lvl as any)?.logging ||
            (typeof lvl === "string" ? lvl : null);
          setLogLevel(level);
          setLogLevelStatus("idle");
          onLogLevelChange?.(level ?? null);
        })
        .catch((err: any) => {
          setLogLevelError(err?.message || "Errore nel leggere log level");
          setLogLevelStatus("error");
        });

      if (isCache) {
        setSettingsStatus("loading");
        setSettingsError(null);
        setSettingsSuccess(null);
        apiGet("settings")
          .then((data) => {
            const payload = (data as any)?.data || data;
            setSettings(payload);
            const obj: Record<string, string> = {};
            Object.entries(payload || {}).forEach(([k, v]) => {
              obj[k] = v != null ? String(v) : "";
            });
            setEditableSettings(obj);
            setSettingsStatus("idle");
          })
          .catch((err: any) => {
            setSettingsError(err?.message || "Errore nel leggere i settings");
            setSettingsStatus("error");
          });
      } else {
        setSettings(null);
        setEditableSettings({});
        setSettingsStatus("idle");
      }
    } else {
      setDbLogger(null);
      setLogLevel(null);
      setSettings(null);
      setEditableSettings({});
      setSettingsStatus("idle");
    }

    setCommunicationStatus("loading");
    setCommunicationError(null);
    setCommunicationSuccess(null);
    apiGet("status/communicationChannels")
      .then((data) => {
        const payload = (data as any)?.communicationChannels ?? data;
        const maxVal =
          (data as any)?.maxAllowedIntervalMs ??
          (payload as any)?.maxAllowedIntervalMs ??
          (payload as any)?.details?.maxAllowedIntervalMs ??
          null;
        const normalized = normalizeChannels(payload);
        setCommunicationRaw(payload as any);
        setCommunicationMax(maxVal !== undefined && maxVal !== null ? Number(maxVal) : null);
        setCommunicationChannels(normalized);
        setCommunicationOriginal(normalized);
        setCommunicationStatus("idle");
      })
      .catch((err: any) => {
        setCommunicationError(err?.message || "Errore nel leggere i communication channels");
        setCommunicationStatus("error");
      });
  }, [microservice]);

  const handleSaveChannels = useCallback(async () => {
    setCommunicationError(null);
    setCommunicationSuccess(null);

    const getSafeMs = (value: ChannelUiState | undefined, prev: ChannelUiState | undefined) => {
      const raw = value?.intervalsMs ?? prev?.intervalsMs ?? "";
      const parsed = parseInt(String(raw), 10);
      if (Number.isInteger(parsed) && parsed > 0) return parsed;
      const prevParsed = parseInt(String(prev?.intervalsMs ?? ""), 10);
      if (Number.isInteger(prevParsed) && prevParsed > 0) return prevParsed;
      return 1000;
    };

    const changes: Record<string, ChannelUiState> = {};
    Object.entries(communicationChannels || {}).forEach(([key, value]) => {
      const prev = communicationOriginal[key];
      const currentMs = value.intervalsMs || prev?.intervalsMs || "";
      const prevMs = prev?.intervalsMs || "";
      if (!prev || currentMs !== prevMs) {
        changes[key] = { ...value, intervalsMs: currentMs };
      }
    });

    if (Object.keys(changes).length === 0) {
      setCommunicationSuccess("Nessuna modifica da salvare");
      return;
    }

    const buildPayload = () => {
      const base = communicationRaw ? JSON.parse(JSON.stringify(communicationRaw)) : {};

      const applyChannels = (target: Record<string, any> | undefined) => {
        if (!target) return;
        Object.entries(communicationChannels || {}).forEach(([key, value]) => {
          const prev = communicationOriginal[key];
          const safeMs = getSafeMs(value, prev);
          const params = { ...(value.params || prev?.params || target?.[key]?.params || {}) };
          target[key] = { on: !!value.on, params: { ...params, intervalsMs: safeMs } };
        });
      };

      applyChannels(base);

      if (!base.communicationChannels) base.communicationChannels = {};
      applyChannels(base.communicationChannels);

      if (!base.details) base.details = {};
      applyChannels(base.details);

      if (communicationMax !== null && communicationMax !== undefined) {
        base.maxAllowedIntervalMs = communicationMax;
        if (base.details && typeof base.details === "object") {
          base.details.maxAllowedIntervalMs = communicationMax;
        }
      }

      return base;
    };

    const fullPayload = buildPayload();

    setCommunicationSaving(true);
    try {
      const updater = isCache ? updateCacheCommunicationChannels : updateSchedulerCommunicationChannels;
      const updated = await updater(fullPayload as any);
      const rawResponse = (updated as any)?.communicationChannels ?? updated ?? fullPayload;
      const maxVal =
        (updated as any)?.maxAllowedIntervalMs ??
        (rawResponse as any)?.maxAllowedIntervalMs ??
        (rawResponse as any)?.details?.maxAllowedIntervalMs ??
        communicationMax;
      const latest = normalizeChannels(rawResponse as any);
      setCommunicationRaw(rawResponse as any);
      setCommunicationMax(maxVal !== undefined && maxVal !== null ? Number(maxVal) : null);
      setCommunicationChannels(latest);
      setCommunicationOriginal(latest);
      setCommunicationSuccess("Canali aggiornati");
    } catch (err: any) {
      setCommunicationError(err?.message || "Errore salvando i communication channels");
    } finally {
      setCommunicationSaving(false);
    }
  }, [communicationChannels, communicationOriginal, isCache, normalizeChannels]);

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
      setCommunicationChannels((prev) => ({
        ...prev,
        [key]: {
          ...(prev[key] || { intervalsMs: "", params: {} }),
          on: nextOn,
          params: prev[key]?.params || communicationOriginal[key]?.params || {},
        },
      }));

      setCommunicationSaving(true);
      try {
        const payloadBase = communicationRaw ? JSON.parse(JSON.stringify(communicationRaw)) : {};

        const applyChannels = (target: Record<string, any> | undefined) => {
          if (!target) return;
          Object.entries({
            ...communicationChannels,
            [key]: {
              ...current,
              on: nextOn,
              intervalsMs: String(parsed) || communicationOriginal[key]?.intervalsMs || "",
              params: current.params || communicationOriginal[key]?.params || {},
            },
          }).forEach(([chKey, value]) => {
            const msVal = getSafeMs(value as any, communicationOriginal[chKey]);
            const params = { ...((value as any)?.params || communicationOriginal[chKey]?.params || {}) };
            target[chKey] = { on: !!(value as any).on, params: { ...params, intervalsMs: msVal } };
          });
        };

        applyChannels(payloadBase);

        if (!payloadBase.communicationChannels) payloadBase.communicationChannels = {};
        applyChannels(payloadBase.communicationChannels);

        if (!payloadBase.details) payloadBase.details = {};
        applyChannels(payloadBase.details);

        if (communicationMax !== null && communicationMax !== undefined) {
          payloadBase.maxAllowedIntervalMs = communicationMax;
          if (payloadBase.details && typeof payloadBase.details === "object") {
            payloadBase.details.maxAllowedIntervalMs = communicationMax;
          }
        }

        const updater = isCache ? updateCacheCommunicationChannels : updateSchedulerCommunicationChannels;
        const updated = await updater(payloadBase as any);
        const rawResponse = (updated as any)?.communicationChannels ?? updated ?? payloadBase;
        const maxVal =
          (updated as any)?.maxAllowedIntervalMs ??
          (rawResponse as any)?.maxAllowedIntervalMs ??
          (rawResponse as any)?.details?.maxAllowedIntervalMs ??
          communicationMax;
        const normalized = normalizeChannels(rawResponse as any);
        setCommunicationRaw(rawResponse as any);
        setCommunicationMax(maxVal !== undefined && maxVal !== null ? Number(maxVal) : null);
        setCommunicationChannels(normalized);
        setCommunicationOriginal(normalized);
        setCommunicationSuccess(`Canale ${key} aggiornato`);
      } catch (err: any) {
        setCommunicationChannels((prev) => ({
          ...prev,
          [key]: {
            ...(prev[key] || { intervalsMs: "", params: {} }),
            on: prevOn,
            params: prev[key]?.params || communicationOriginal[key]?.params || {},
          },
        }));
        setCommunicationError(err?.message || `Errore aggiornando il canale ${key}`);
      } finally {
        setCommunicationSaving(false);
      }
    },
    [communicationChannels, communicationOriginal, isCache, normalizeChannels]
  );

  return (
    <div className="mt-2 grid gap-3 md:grid-cols-2">
      <div className="rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-[11px] text-slate-700">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <table className="min-w-[200px] text-[11px] text-slate-700">
              <tbody>
                <tr>
                  <td className="pr-3 font-semibold text-slate-600">Service Enabled</td>
                  <td className="py-1">
                    <div className="text-[11px] text-slate-500">Gestito nella pagina service flags.</div>
                  </td>
                </tr>
                {hasDbControls && (
                  <>
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
                                await apiSend("PUT", `dbLogger/${next ? "on" : "off"}`);
                                setDbLoggerStatus("idle");
                                onDbLoggerChange?.(next);
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
                          <span className="text-[11px] font-semibold text-slate-700">{dbLogger ? "On" : "Off"}</span>
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
                                await apiSend("PUT", "status/logLevel", { logLevel: next });
                                setLogLevel(next);
                                onLogLevelChange?.(next);
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
                        <div className="mt-1 text-[11px] text-slate-500">Seleziona il livello di log del microservizio.</div>
                      </td>
                    </tr>
                  </>
                )}
                <tr>
                  <td className="pr-3 font-semibold text-slate-600">Updated</td>
                  <td className="py-1 whitespace-nowrap">{formatDateTime(release?.lastUpdate)}</td>
                </tr>
              </tbody>
            </table>
            {dbLoggerError && (
              <div className="mt-2 text-[11px] text-amber-700">{dbLoggerError}</div>
            )}
            {logLevelError && (
              <div className="mt-2 text-[11px] text-amber-700">{logLevelError}</div>
            )}
          </div>
          <div className="flex w-full flex-col gap-2 md:w-auto">
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
            <BaseButton
              variant="outline"
              color="neutral"
              size="sm"
              startIcon={<AppIcon icon="mdi:information-outline" />}
              onClick={() => {
                onOpenReleaseModal?.();
              }}
              disabled={!release}
            >
              Release info
            </BaseButton>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-[11px] text-slate-700">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-700">Communication channels</div>
          {communicationStatus === "loading" && (
            <span className="text-[11px] text-slate-500">Caricamento...</span>
          )}
        </div>
        {communicationError && (
          <div className="mb-2 text-[11px] text-amber-700">{communicationError}</div>
        )}
        {communicationSuccess && (
          <div className="mb-2 text-[11px] text-emerald-700">{communicationSuccess}</div>
        )}
        <div className="rounded-md border border-slate-100 bg-white">
          {Object.entries(communicationChannels || {}).map(([key, ch]) => (
            <div key={key} className="flex items-center gap-3 border-b border-slate-100 px-3 py-2 last:border-b-0">
              <div className="w-32 text-[11px] font-semibold text-slate-600 capitalize">{key}</div>
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
                      [key]: {
                        ...(prev[key] || { on: false, params: {} }),
                        intervalsMs: e.target.value,
                        params: prev[key]?.params || communicationOriginal[key]?.params || {},
                      },
                    }))
                  }
                  disabled={communicationSaving}
                />
              </div>
              {ch.params && Object.keys(ch.params).length > 1 && (
                <div className="ml-auto text-[11px] text-slate-500">
                  {Object.entries(ch.params)
                    .filter(([k]) => k !== "intervalsMs")
                    .map(([k, v]) => (
                      <div key={k} className="text-[11px]">
                        {k}: {String(v)}
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
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

      <div className="md:col-span-2 mt-3">
        <MicroserviceLogsCard microservice={microservice} limit={100} />
      </div>

      {showSettingsModal && (
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
                <div className="mb-2 text-[11px] text-amber-700">{settingsError}</div>
              )}
              {settingsSuccess && (
                <div className="mb-2 text-[11px] text-emerald-700">{settingsSuccess}</div>
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
                <div className="mt-2 text-[11px] text-amber-700">{saveSettingsError}</div>
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
