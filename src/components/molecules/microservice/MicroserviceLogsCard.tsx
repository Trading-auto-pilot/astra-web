import { useEffect, useMemo, useRef, useState } from "react";
import BaseButton from "../../atoms/base/buttons/BaseButton";
import AppIcon from "../../atoms/icon/AppIcon";
import { redisWsBridgeClient } from "../../../services/ws/redisWsBridgeClient";
import { env } from "../../../config/env";
import { readStorage, readStorageJson, writeStorageJson } from "../../../utils/storage";

type LogRow = {
  id?: number | string;
  timestamp?: string;
  level?: string;
  microservice?: string;
  module?: string;
  moduleName?: string;
  functionName?: string;
  message?: string;
  meta?: any;
  [key: string]: any;
};

type Props = {
  microservice?: string | null;
  limit?: number;
  fillHeight?: boolean;
  className?: string;
};

const getToken = () => {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem("astraai:auth:token");
};

const toUtcDate = (value?: string) => {
  if (!value) return null;
  const raw = String(value).trim();
  if (!raw) return null;
  const hasTz = /[zZ]|[+-]\d{2}:?\d{2}$/.test(raw);
  if (hasTz) return new Date(raw);
  const normalized = raw.includes("T") ? raw : raw.replace(" ", "T");
  const match = normalized.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,6}))?$/
  );
  if (match) {
    const [, y, mo, d, h, mi, s, msRaw] = match;
    const ms = msRaw ? Number(msRaw.padEnd(3, "0").slice(0, 3)) : 0;
    const utcMs = Date.UTC(
      Number(y),
      Number(mo) - 1,
      Number(d),
      Number(h),
      Number(mi),
      Number(s),
      ms
    );
    return new Date(utcMs);
  }
  return new Date(`${normalized}Z`);
};

const formatDateTime = (value?: string, timeZone: "UTC" | "Asia/Dubai" = "UTC") => {
  const date = toUtcDate(value);
  if (!date || Number.isNaN(date.getTime())) return value || "-";
  return date.toLocaleString("it-IT", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone,
  });
};

const levelColor: Record<string, string> = {
  trace: "text-fuchsia-700 bg-fuchsia-50 border-fuchsia-200", // magenta
  debug: "text-fuchsia-700 bg-fuchsia-50 border-fuchsia-200",
  log: "text-cyan-700 bg-cyan-50 border-cyan-200", // cyan
  info: "text-emerald-700 bg-emerald-50 border-emerald-200", // green
  warning: "text-amber-700 bg-amber-50 border-amber-200", // yellow
  error: "text-red-700 bg-red-50 border-red-200", // red
};
const levelSolid: Record<string, string> = {
  error: "bg-red-500 text-white",
  warning: "bg-amber-500 text-white",
  info: "bg-emerald-500 text-white",
  log: "bg-cyan-500 text-white",
  trace: "bg-fuchsia-500 text-white",
};

const levelOrder = ["error", "warning", "info", "log", "trace"] as const;
type LevelKey = (typeof levelOrder)[number];
const serviceOptions = [
  "all",
  "alertingservice",
  "authservice",
  "cachemanager",
  "decision-engine",
  "dbmanager",
  "ibkr-bridge",
  "ibkr-keepalive",
  "market-data-service",
  "rediswsbridge",
  "scheduler",
  "servicecontrolplane",
  "shared",
  "tickerscanner",
];

const normalizeLevel = (value?: string): LevelKey => {
  const raw = String(value || "log").toLowerCase();
  if (raw === "warn") return "warning";
  if (raw === "debug") return "trace";
  if (levelOrder.includes(raw as LevelKey)) return raw as LevelKey;
  return "log";
};

const getLevelRank = (value?: string) => {
  const normalized = normalizeLevel(value);
  return levelOrder.indexOf(normalized);
};

export default function MicroserviceLogsCard({
  microservice,
  limit = 15,
  fillHeight = false,
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [rows, setRows] = useState<LogRow[]>([]);
  const [liveRows, setLiveRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wsError, setWsError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [pageSize, setPageSize] = useState<number>(limit || 15);
  const [onlyThisService, setOnlyThisService] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("all");
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [selectedFunction, setSelectedFunction] = useState<string>("all");
  const [dateStart, setDateStart] = useState<string>("");
  const [dateEnd, setDateEnd] = useState<string>("");
  const [dateStartDraft, setDateStartDraft] = useState<string>("");
  const [dateEndDraft, setDateEndDraft] = useState<string>("");
  const [messageQuery, setMessageQuery] = useState<string>("");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [levelFilter, setLevelFilter] = useState<LevelKey>("log");
  const [timeZone, setTimeZone] = useState<"UTC" | "Asia/Dubai">("UTC");
  const token = useMemo(() => getToken(), []);
  const storageKey = useMemo(
    () => `astraai:logs:filters:${microservice ? String(microservice).toLowerCase() : "all"}`,
    [microservice]
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [jsonDetail, setJsonDetail] = useState<any | null>(null);
  const [selectedRow, setSelectedRow] = useState<LogRow | null>(null);
  const [alertMode, setAlertMode] = useState(false);
  const [alertSaveStatus, setAlertSaveStatus] = useState<"idle" | "loading" | "error">("idle");
  const [alertSaveError, setAlertSaveError] = useState<string | null>(null);
  const [alertFormData, setAlertFormData] = useState<{
    name: string;
    enabled: boolean;
    levels: string[];
    microservice: string;
    module: string;
    functionName: string;
    message: string;
    channelWhatsapp: boolean;
    channelEmail: boolean;
    emailTo: string;
    emailSubject: string;
    template: string;
  }>({
    name: "",
    enabled: true,
    levels: [],
    microservice: "",
    module: "",
    functionName: "",
    message: "",
    channelWhatsapp: true,
    channelEmail: false,
    emailTo: "",
    emailSubject: "",
    template: "Alert: {{message}}",
  });

  const normalizeJsonDetail = (value: any) => {
    if (value === null || value === undefined) return null;
    if (typeof value !== "string") return value;

    let current: any = value.trim();
    if (!current) return value;

    // Parse string payloads only when they are valid JSON.
    for (let i = 0; i < 2 && typeof current === "string"; i += 1) {
      const probe = current.trim();
      if (!probe) break;
      const startsLikeJson =
        probe.startsWith("{") ||
        probe.startsWith("[") ||
        probe.startsWith("\"{") ||
        probe.startsWith("\"[");
      if (!startsLikeJson) break;
      try {
        current = JSON.parse(probe);
      } catch {
        break;
      }
    }

    return current;
  };

  const openJsonDetail = (value: any) => {
    setJsonDetail(normalizeJsonDetail(value));
  };

  const closeJsonDetail = () => {
    setJsonDetail(null);
  };

  const openRowDetail = (row: LogRow) => {
    setSelectedRow(row);
    setAlertMode(false);
  };

  const closeRowDetail = () => {
    setSelectedRow(null);
    setAlertMode(false);
  };

  const enableAlertMode = () => {
    if (!selectedRow) return;
    const serviceName = String(selectedRow.microservice || "");
    const msgText = String(selectedRow.message || "");
    setAlertFormData({
      name: `Alert ${serviceName} - ${normalizeLevel(selectedRow.level)}`,
      enabled: true,
      levels: [normalizeLevel(selectedRow.level)],
      microservice: serviceName,
      module: String(selectedRow.module || selectedRow.moduleName || ""),
      functionName: String(selectedRow.functionName || ""),
      message: msgText,
      channelWhatsapp: true,
      channelEmail: false,
      emailTo: "",
      emailSubject: `Alert ${serviceName}`,
      template: `Alert: {{message}}`,
    });
    setAlertMode(true);
    setAlertSaveStatus("idle");
    setAlertSaveError(null);
  };

  const handleSaveAlert = async () => {
    setAlertSaveStatus("loading");
    setAlertSaveError(null);
    try {
      const matchJson = {
        levels: alertFormData.levels,
        services: alertFormData.microservice ? [alertFormData.microservice] : [],
        message_grep: alertFormData.message.trim(),
      };
      const channels = [
        ...(alertFormData.channelWhatsapp ? ["whatsapp"] : []),
        ...(alertFormData.channelEmail ? ["email"] : []),
      ];
      const actionsJson = {
        channels,
        template: alertFormData.template.trim(),
        to: alertFormData.emailTo.trim(),
        subject: alertFormData.emailSubject.trim(),
      };
      const payload = {
        name: alertFormData.name.trim(),
        enabled: alertFormData.enabled ? 1 : 0,
        match_json: matchJson,
        actions_json: actionsJson,
      };

      const res = await fetch(`${env.apiBaseUrl}/alertingservice/alerting-rules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || data?.message || "Errore salvataggio alert");
      }

      setAlertSaveStatus("idle");
      closeRowDetail();
    } catch (err: any) {
      setAlertSaveStatus("error");
      setAlertSaveError(err?.message || "Errore salvataggio alert");
    }
  };

  const extractEmbeddedJson = (text: string): { message: string; json: any | null } => {
    const trimmed = text.trimEnd();
    const endCh = trimmed[trimmed.length - 1];
    if (endCh === "}" || endCh === "]") {
      const startCh = endCh === "}" ? "{" : "[";
      let idx = trimmed.lastIndexOf(startCh);
      let attempts = 0;
      while (idx >= 0 && attempts < 5) {
        try {
          const candidate = trimmed.slice(idx);
          const parsed = JSON.parse(candidate);
          return { message: trimmed.slice(0, idx).trim(), json: parsed };
        } catch {
          idx = trimmed.lastIndexOf(startCh, idx - 1);
          attempts++;
        }
      }
    }
    return { message: text, json: null };
  };

  const normalizeMessage = (payload: any): LogRow | null => {
    if (!payload || typeof payload !== "object") return null;
    const rawChannel =
      typeof payload?.__channel === "string"
        ? payload.__channel
        : typeof payload?.channel === "string"
          ? payload.channel
          : null;
    const channelParts = rawChannel ? String(rawChannel).split(".") : [];
    const hasLogsChannel = rawChannel ? rawChannel.includes(".logs.") : false;
    if (!hasLogsChannel && !payload?.level && payload?.type !== "log") return null;

    const level =
      payload?.level ||
      (channelParts.length ? channelParts[channelParts.length - 1] : undefined) ||
      "log";
    const channelService = channelParts.length > 1 ? channelParts[1] : undefined;
    const channelModule = channelParts.length > 2 ? channelParts[2] : undefined;
    const entryService = payload?.microservice || channelService || microservice || "-";
    const entryModule = payload?.module || payload?.moduleName || channelModule || "-";
    let entryMessage =
      typeof payload?.message === "string"
        ? payload.message
        : payload?.message
          ? JSON.stringify(payload.message)
          : payload?.msg
            ? String(payload.msg)
            : JSON.stringify(payload);
    const entryTimestamp = payload?.ts || payload?.timestamp || payload?.time;

    // JSON extraction: usa details dal bus, altrimenti estrai dal messaggio
    let jsonDetails: any = payload?.details ?? null;
    if (jsonDetails === null || jsonDetails === undefined) {
      const extracted = extractEmbeddedJson(entryMessage);
      if (extracted.json !== null) {
        entryMessage = extracted.message;
        jsonDetails = extracted.json;
      }
    }

    const effectiveService =
      selectedService !== "all"
        ? selectedService
        : onlyThisService
          ? microservice
          : null;
    if (effectiveService) {
      if (String(entryService).toLowerCase() !== String(effectiveService).toLowerCase()) return null;
    }

    return {
      id: payload?.id || `live-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      timestamp: entryTimestamp,
      level,
      microservice: entryService,
      module: entryModule,
      functionName: payload?.functionName,
      message: entryMessage,
      jsonDetails: jsonDetails !== null ? (typeof jsonDetails === "string" ? jsonDetails : JSON.stringify(jsonDetails)) : null,
      meta: payload,
      __live: true,
    };
  };

  useEffect(() => {
    const stored = readStorageJson<{
      level?: string;
      service?: string;
      moduleName?: string;
      functionName?: string;
      dateStart?: string;
      dateEnd?: string;
      messageQuery?: string;
    }>(storageKey, {});

    let nextLevel: LevelKey = "log";
    if (stored.level && levelOrder.includes(stored.level as LevelKey)) {
      nextLevel = stored.level as LevelKey;
    } else {
      const legacyKey = `astraai:logs:level:${microservice ? String(microservice).toLowerCase() : "all"}`;
      const legacy = readStorage(legacyKey);
      if (legacy && levelOrder.includes(legacy as LevelKey)) {
        nextLevel = legacy as LevelKey;
      }
    }

    setLevelFilter(nextLevel);
    if (stored.service && serviceOptions.includes(stored.service)) {
      setSelectedService(stored.service);
    } else {
      setSelectedService("all");
    }
    if (stored.moduleName) {
      setSelectedModule(stored.moduleName);
    } else {
      setSelectedModule("all");
    }
    if (stored.functionName) {
      setSelectedFunction(stored.functionName);
    } else {
      setSelectedFunction("all");
    }
    if (stored.dateStart) {
      setDateStart(stored.dateStart);
      setDateStartDraft(stored.dateStart);
    }
    if (stored.dateEnd) {
      setDateEnd(stored.dateEnd);
      setDateEndDraft(stored.dateEnd);
    }
    if (stored.messageQuery) {
      setMessageQuery(stored.messageQuery);
    }
  }, [storageKey]);

  useEffect(() => {
    writeStorageJson(storageKey, {
      level: levelFilter,
      service: selectedService,
      moduleName: selectedModule,
      functionName: selectedFunction,
      dateStart,
      dateEnd,
      messageQuery,
    });
  }, [
    storageKey,
    levelFilter,
    selectedService,
    selectedFunction,
    dateStart,
    dateEnd,
    messageQuery,
    selectedModule,
  ]);

  // No JavaScript height calculation needed - using CSS flex layout instead

  useEffect(() => {
    if (!isExpanded) return;
    if (!modalRef.current) return;
    modalRef.current.focus();
  }, [isExpanded]);

  const fetchLogs = async (pageIndex = 0, sizeArg?: number) => {
    setLoading(true);
    setError(null);
    try {
      const size = Number.isFinite(sizeArg) && sizeArg ? sizeArg : pageSize || 15;
      const safeSize = Math.max(1, Math.min(size, 1000));
      const params = new URLSearchParams();
      if (safeSize) params.set("limit", String(safeSize));
      const offset = pageIndex * safeSize;
      if (offset > 0) params.set("offset", String(offset));
      const effectiveService =
        selectedService !== "all"
          ? selectedService
          : onlyThisService
            ? microservice
            : null;
      const moduleParam = selectedModule !== "all" ? selectedModule : "";
      const functionParam = selectedFunction !== "all" ? selectedFunction : "";
      const msParam = effectiveService ? String(effectiveService).trim() : "";
      if (msParam) params.set("microservice", msParam);
      if (moduleParam) params.set("module", moduleParam);
      if (functionParam) params.set("function", functionParam);
      if (dateStart) params.set("startDate", dateStart);
      if (dateEnd) params.set("endDate", dateEnd);
      const levelIdx = getLevelRank(levelFilter);
      if (levelIdx >= 0) {
        const levelsForQuery = levelOrder.slice(0, levelIdx + 1);
        if (levelsForQuery.length > 0) params.set("level", levelsForQuery.join(","));
      }
      const url = `${env.apiBaseUrl}/cachemanager/Log${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Errore nel recupero log");
      }
      const items = Array.isArray(data)
        ? data
        : Array.isArray(data?.logs)
          ? data.logs
          : Array.isArray(data?.items)
            ? data.items
            : [];
      setRows(items);
      setLiveRows([]);
      const metaPage =
        typeof data?.page === "number"
          ? data.page
          : typeof data?.offset === "number"
            ? Math.floor(data.offset / safeSize)
            : pageIndex;
      setPage(metaPage);
      const metaHasMore =
        typeof data?.count === "number"
          ? data.count >= safeSize
          : items.length >= safeSize;
      setHasMore(metaHasMore);
    } catch (e: any) {
      setError(e?.message || "Errore nel recupero log");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    fetchLogs(0, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    microservice,
    pageSize,
    onlyThisService,
    selectedService,
    selectedModule,
    selectedFunction,
    dateStart,
    dateEnd,
    levelFilter,
  ]);

  useEffect(() => {
    setWsError(null);
    const unsubscribe = redisWsBridgeClient.subscribe({
      filter: (msg) => {
        if (!msg || typeof msg !== "object") return false;
        if (onlyThisService && microservice) {
          const service = String(msg?.microservice || "").toLowerCase();
          if (service && service !== String(microservice).toLowerCase()) return false;
        }
        if (selectedService !== "all") {
          const service = String(msg?.microservice || "").toLowerCase();
          if (service !== String(selectedService).toLowerCase()) return false;
        }
        const channel =
          typeof msg?.__channel === "string" ? msg.__channel : typeof msg?.channel === "string" ? msg.channel : "";
        if (channel && !channel.startsWith(`${env.appEnv}.`)) return false;
        return channel.includes(".logs.") || typeof msg?.level === "string" || msg?.type === "log";
      },
      onMessage: (payload) => {
        const entry = normalizeMessage(payload);
        if (!entry) return;
        if (
          selectedFunction !== "all" &&
          String(entry.functionName || "").toLowerCase() !==
            String(selectedFunction).toLowerCase()
        ) {
          return;
        }
        if (
          selectedModule !== "all" &&
          String(entry.module || entry.moduleName || "").toLowerCase() !==
            String(selectedModule).toLowerCase()
        ) {
          return;
        }
        if (dateStart || dateEnd) {
          const startMs = dateStart ? new Date(dateStart).getTime() : null;
          const endMs = dateEnd ? new Date(dateEnd).getTime() : null;
          const tsRaw = entry.timestamp ?? (entry as any).ts ?? (entry as any).time;
          const ts = tsRaw ? new Date(tsRaw as string).getTime() : NaN;
          if (Number.isNaN(ts)) return;
          if (startMs && ts < startMs) return;
          if (endMs && ts > endMs) return;
        }
        if (messageQuery) {
          const msg = String(entry.message || "").toLowerCase();
          if (!msg.includes(messageQuery.toLowerCase())) return;
        }
        setLiveRows((prev) => {
          const next = [entry, ...prev];
          return next.slice(0, 200);
        });
      },
      onStatus: (status, detail) => {
        if (status === "error" || status === "closed") {
          setWsError(detail || "Errore connessione websocket");
        } else if (status === "open") {
          setWsError(null);
        }
      },
    });

    return () => {
      unsubscribe();
    };
  }, [microservice, onlyThisService, selectedService, selectedModule, selectedFunction, dateStart, dateEnd, messageQuery]);

  const filteredRows = useMemo(() => {
    const threshold = getLevelRank(levelFilter);
    const combined = [...liveRows, ...rows];
    const effectiveService =
      selectedService !== "all"
        ? selectedService
        : onlyThisService
          ? microservice
          : null;
    const moduleParam = selectedModule !== "all" ? selectedModule : null;
    const startMs = dateStart ? new Date(dateStart).getTime() : null;
    const endMs = dateEnd ? new Date(dateEnd).getTime() : null;
    return combined.filter((row) => {
      if (getLevelRank(row.level) > threshold) return false;
      if (selectedFunction !== "all") {
        const fnOk =
          String(row.functionName || "").toLowerCase() ===
          String(selectedFunction).toLowerCase();
        if (!fnOk) return false;
      }
      if (moduleParam) {
        const modValue = String(row.module || row.moduleName || "").toLowerCase();
        if (modValue !== String(moduleParam).toLowerCase()) return false;
      }
      if (startMs || endMs) {
        const tsRaw = row.timestamp ?? row.ts ?? row.time;
        const ts = tsRaw ? new Date(tsRaw as string).getTime() : NaN;
        if (Number.isNaN(ts)) return false;
        if (startMs && ts < startMs) return false;
        if (endMs && ts > endMs) return false;
      }
      if (messageQuery) {
        const msg = String(row.message || "").toLowerCase();
        if (!msg.includes(messageQuery.toLowerCase())) return false;
      }
      if (!effectiveService) return true;
      return (
        String(row.microservice || "").toLowerCase() ===
        String(effectiveService).toLowerCase()
      );
    }).sort((a, b) => {
      // Sort by timestamp DESC (most recent first)
      const timeA = toUtcDate(a.timestamp ?? a.ts ?? a.time);
      const timeB = toUtcDate(b.timestamp ?? b.ts ?? b.time);
      if (!timeA || !timeB) return 0;
      return timeB.getTime() - timeA.getTime();
    });
  }, [
    rows,
    liveRows,
    levelFilter,
    microservice,
    onlyThisService,
    selectedService,
    selectedModule,
    selectedFunction,
    dateStart,
    dateEnd,
    messageQuery,
  ]);

  const moduleOptions = useMemo(() => {
    const base = new Set<string>();
    [...rows, ...liveRows].forEach((row) => {
      const name = row?.module || row?.moduleName ? String(row.module || row.moduleName) : "";
      if (name) base.add(name);
    });
    return ["all", ...Array.from(base).sort((a, b) => a.localeCompare(b))];
  }, [rows, liveRows]);

  const functionOptions = useMemo(() => {
    const base = new Set<string>();
    [...rows, ...liveRows].forEach((row) => {
      const name = row?.functionName ? String(row.functionName) : "";
      if (name) base.add(name);
    });
    return ["all", ...Array.from(base).sort((a, b) => a.localeCompare(b))];
  }, [rows, liveRows]);

  const applyPageSize = (value: number) => {
    const next = Number.isFinite(value) && value > 0 ? Math.min(Math.floor(value), 1000) : 15;
    setPageSize(next);
    fetchLogs(0, next);
  };

  const renderHeader = (expanded: boolean) => (
    <div className="px-3 py-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-slate-700">Logs</div>
          <div className="text-[11px] text-slate-500">
            {microservice ? `Microservice: ${microservice}` : "Ultimi log"}
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
        <div className="flex items-center gap-2">
          <div className="flex w-56 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
            {levelOrder.map((lvl, idx) => {
              const isActive = levelFilter === lvl;
              const isFilled = idx <= getLevelRank(levelFilter);
              return (
                <button
                  key={lvl}
                  type="button"
                  className={`flex-1 border-r border-slate-200 px-1.5 py-1 text-[10px] font-semibold uppercase tracking-wide transition last:border-r-0 ${
                    isFilled ? levelSolid[lvl] : "bg-slate-100 text-slate-500"
                  } ${isActive ? "ring-1 ring-inset ring-slate-900" : ""}`}
                  onClick={() => setLevelFilter(lvl)}
                  disabled={loading}
                >
                  {lvl}
                </button>
              );
            })}
          </div>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 text-[11px] text-slate-600">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={onlyThisService}
            onChange={(e) => setOnlyThisService(e.target.checked)}
            disabled={loading}
          />
          <span
            className={`relative inline-flex h-5 w-9 items-center rounded-full border transition ${
              onlyThisService ? "border-emerald-300 bg-emerald-500" : "border-slate-300 bg-slate-200"
            } ${loading ? "opacity-70" : ""}`}
          >
            <span
              className={`h-4 w-4 rounded-full bg-white shadow transition ${
                onlyThisService ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </span>
          <span className="text-[11px] font-semibold text-slate-700">
            {microservice || "Questo servizio"}
          </span>
        </label>
        <label className="inline-flex cursor-pointer items-center gap-2 text-[11px] text-slate-600">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={timeZone === "Asia/Dubai"}
            onChange={(e) => setTimeZone(e.target.checked ? "Asia/Dubai" : "UTC")}
            disabled={loading}
          />
          <span
            className={`relative inline-flex h-5 w-12 items-center rounded-full border transition ${
              timeZone === "Asia/Dubai" ? "border-slate-300 bg-slate-900" : "border-slate-300 bg-slate-200"
            } ${loading ? "opacity-70" : ""}`}
          >
            <span
              className={`h-4 w-4 rounded-full bg-white shadow transition ${
                timeZone === "Asia/Dubai" ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </span>
          <span className="text-[11px] font-semibold text-slate-700">
            {timeZone === "Asia/Dubai" ? "Asia/Dubai" : "UTC"}
          </span>
        </label>
        <select
          className="h-8 rounded-md border border-slate-200 bg-white px-2 text-[11px] text-slate-700 focus:border-blue-400 focus:outline-none"
          value={selectedService}
          onChange={(event) => {
            setSelectedService(event.target.value);
          }}
          disabled={loading}
        >
          {serviceOptions.map((service) => (
            <option key={service} value={service}>
              {service === "all" ? "Tutti i servizi" : service}
            </option>
          ))}
        </select>
        <select
          className="h-8 min-w-[9rem] rounded-md border border-slate-200 bg-white px-2 text-[11px] text-slate-700 focus:border-blue-400 focus:outline-none"
          value={selectedModule}
          onChange={(event) => {
            setSelectedModule(event.target.value);
          }}
          disabled={loading}
        >
          {moduleOptions.map((mod) => (
            <option key={mod} value={mod}>
              {mod === "all" ? "Tutti i moduli" : mod}
            </option>
          ))}
        </select>
        <select
          className="h-8 min-w-[9rem] rounded-md border border-slate-200 bg-white px-2 text-[11px] text-slate-700 focus:border-blue-400 focus:outline-none"
          value={selectedFunction}
          onChange={(event) => {
            setSelectedFunction(event.target.value);
          }}
          disabled={loading}
        >
          {functionOptions.map((fn) => (
            <option key={fn} value={fn}>
              {fn === "all" ? "Tutte le funzioni" : fn}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Cerca messaggio..."
          className="h-8 min-w-[10rem] rounded-md border border-slate-200 bg-white px-2 text-[11px] text-slate-700 focus:border-blue-400 focus:outline-none"
          value={messageQuery}
          onChange={(event) => setMessageQuery(event.target.value)}
          disabled={loading}
        />
        <div className="relative">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
            onClick={() => setDatePickerOpen((prev) => !prev)}
            title="Filtro data"
          >
            <AppIcon icon="mdi:calendar-range" />
          </button>
          {datePickerOpen && (
            <div className="absolute right-0 z-20 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
              <div className="text-[11px] font-semibold text-slate-700">Range data</div>
              <div className="mt-2 grid gap-2 text-[11px] text-slate-700">
                <label className="grid gap-1">
                  <span>Inizio</span>
                  <input
                    type="datetime-local"
                    className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-800 focus:border-blue-400 focus:outline-none"
                    value={dateStartDraft}
                    onChange={(e) => setDateStartDraft(e.target.value)}
                  />
                </label>
                <label className="grid gap-1">
                  <span>Fine</span>
                  <input
                    type="datetime-local"
                    className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-800 focus:border-blue-400 focus:outline-none"
                    value={dateEndDraft}
                    onChange={(e) => setDateEndDraft(e.target.value)}
                  />
                </label>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-700"
                  onClick={() => {
                    setDateStart("");
                    setDateEnd("");
                    setDateStartDraft("");
                    setDateEndDraft("");
                  }}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="rounded-md border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() => {
                    setDateStart(dateStartDraft);
                    setDateEnd(dateEndDraft);
                    setDatePickerOpen(false);
                  }}
                >
                  Apply
                </button>
                <button
                  type="button"
                  className="rounded-md border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() => setDatePickerOpen(false)}
                >
                  Chiudi
                </button>
              </div>
            </div>
          )}
        </div>
        <BaseButton
          variant="outline"
          color="neutral"
          size="sm"
          startIcon={<AppIcon icon="mdi:refresh" />}
          onClick={() => fetchLogs(page, pageSize)}
          disabled={loading}
        >
          Aggiorna
        </BaseButton>
        <BaseButton
          variant="outline"
          color="neutral"
          size="sm"
          startIcon={<AppIcon icon="mdi:close-circle-outline" />}
          onClick={() => {
            setLevelFilter("log");
            setSelectedService("all");
            setSelectedModule("all");
            setSelectedFunction("all");
            setMessageQuery("");
            setDateStart("");
            setDateEnd("");
            setDateStartDraft("");
            setDateEndDraft("");
          }}
          disabled={loading}
        >
          Clear
        </BaseButton>
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
          onClick={() => setIsExpanded(!expanded)}
          title={expanded ? "Comprimi" : "Espandi"}
        >
          <AppIcon icon={expanded ? "mdi:arrow-collapse" : "mdi:arrow-expand"} />
        </button>
      </div>
    </div>
  );

  const renderLogsTable = (forModal = false) => {
    // In modal or when fillHeight is true, use flex-1 to fill available space
    const tableBodyClass = forModal || fillHeight ? "flex-1 min-h-0" : "max-h-64";

    return (
      <div className="flex flex-1 min-h-0 flex-col">
        {error && (
          <div className="mx-3 mb-2 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] text-amber-700">
            {error}
          </div>
        )}
        {wsError && (
          <div className="mx-3 mb-2 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] text-amber-700">
            {wsError}
          </div>
        )}
        <div className="flex flex-1 min-h-0 flex-col overflow-x-auto">
          <div className={`${tableBodyClass} overflow-y-auto`}>
          <table className="w-full table-fixed divide-y divide-slate-200 text-[11px] text-slate-700">
            <colgroup>
              <col style={{ width: "5.5rem" }} />
              <col style={{ width: "9rem" }} />
              <col style={{ width: "6rem" }} />
              <col style={{ width: "8rem" }} />
              <col style={{ width: "8rem" }} />
              <col style={{ width: "8rem" }} />
              <col />
              <col style={{ width: "3.25rem" }} />
            </colgroup>
            <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500 sticky top-0">
              <tr>
                <th className="px-3 py-2 font-semibold">ID</th>
                <th className="px-3 py-2 font-semibold">
                  Time {timeZone === "UTC" ? "(UTC)" : "(Asia/Dubai)"}
                </th>
                <th className="px-3 py-2 font-semibold">Level</th>
                <th className="px-3 py-2 font-semibold">Service</th>
                <th className="px-3 py-2 font-semibold">Module</th>
                <th className="px-3 py-2 font-semibold">Function</th>
                <th className="px-3 py-2 font-semibold">Message</th>
                <th className="px-3 py-2 font-semibold">JSON</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td className="px-3 py-3 text-[11px] text-slate-500" colSpan={8}>
                    Caricamento...
                  </td>
                </tr>
              )}
              {!loading && filteredRows.length === 0 && (
                <tr>
                  <td className="px-3 py-3 text-[11px] text-slate-500" colSpan={8}>
                    Nessun log disponibile
                  </td>
                </tr>
              )}
              {!loading &&
                filteredRows.map((row, idx) => {
                  const lvl = String(row.level || "").toLowerCase();
                  const pill = levelColor[lvl] || levelColor.log;
                  const isOwnService =
                    microservice && row.microservice
                      ? String(row.microservice).toLowerCase() === String(microservice).toLowerCase()
                      : true;
                  const isLive = Boolean((row as any).__live);
                  const jsonDetails = row.jsonDetails ?? row.json_details ?? null;
                  return (
                    <tr
                      key={row.id || idx}
                      className={`cursor-pointer hover:bg-slate-50 ${isLive ? "bg-amber-50/70" : ""}`}
                      onClick={() => openRowDetail(row)}
                    >
                      <td className={`px-3 py-2 whitespace-nowrap ${!isOwnService ? "text-slate-400" : ""}`}>
                        {isLive && row.id ? `L.${String(row.id).slice(-3)}` : (row.id ?? "-")}
                      </td>
                      <td className={`px-3 py-2 whitespace-nowrap ${!isOwnService ? "text-slate-400" : ""}`}>
                        {formatDateTime(row.timestamp as string, timeZone)}
                      </td>
                      <td className={`px-3 py-2 ${!isOwnService ? "text-slate-400" : ""}`}>
                        <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${pill}`}>
                          {row.level || "-"}
                        </span>
                      </td>
                      <td className={`px-3 py-2 whitespace-nowrap ${!isOwnService ? "text-slate-400" : ""}`}>
                        {row.microservice || microservice || "-"}
                      </td>
                      <td className={`px-3 py-2 whitespace-nowrap ${!isOwnService ? "text-slate-400" : ""}`}>
                        {row.module || row.moduleName || "-"}
                      </td>
                      <td className={`px-3 py-2 whitespace-nowrap ${!isOwnService ? "text-slate-400" : ""}`}>
                        {row.functionName || "-"}
                      </td>
                      <td className={`px-3 py-2 ${!isOwnService ? "text-slate-400" : ""}`}>
                        <div className="line-clamp-3 whitespace-pre-wrap break-words text-[11px]">
                          {row.message || "-"}
                        </div>
                      </td>
                      <td className={`px-3 py-2 ${!isOwnService ? "text-slate-400" : ""}`}>
                        {jsonDetails ? (
                          <button
                            type="button"
                            className="inline-flex items-center justify-center rounded border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-700 hover:bg-slate-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              openJsonDetail(jsonDetails);
                            }}
                            title="Dettagli JSON"
                            aria-label="Dettagli JSON"
                          >
                            <AppIcon icon="mdi:code-json" className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 px-3 py-2 text-[11px] text-slate-600">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-600">Page {page + 1}</span>
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-500">Limit</span>
              <input
                type="number"
                min={1}
                max={1000}
                className="w-16 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-800 focus:border-blue-400 focus:outline-none"
                value={pageSize}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setPageSize(Number.isFinite(val) && val > 0 ? val : 1);
                }}
                onBlur={() => applyPageSize(pageSize)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applyPageSize(pageSize);
                  }
                }}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <BaseButton
              variant="outline"
              color="neutral"
              size="sm"
              disabled={loading || page === 0}
              onClick={() => fetchLogs(Math.max(0, page - 1), pageSize)}
            >
              Prev
            </BaseButton>
            <BaseButton
              variant="outline"
              color="neutral"
              size="sm"
              disabled={loading || !hasMore}
              onClick={() => fetchLogs(page + 1, pageSize)}
            >
              Next
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`flex min-h-0 flex-col rounded-lg border border-slate-200 bg-white/70 shadow-sm ${fillHeight ? "flex-1" : ""} ${className}`}
    >
      {renderHeader(false)}
      {renderLogsTable()}

      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 p-3 pb-16">
          <div
            ref={modalRef}
            tabIndex={-1}
            className="flex max-h-full w-full flex-col rounded-xl border border-slate-200 bg-white shadow-xl outline-none"
          >
            {renderHeader(true)}
            {renderLogsTable(true)}
          </div>
        </div>
      )}

      {jsonDetail && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="flex w-full max-w-2xl flex-col rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div className="text-sm font-semibold text-slate-900">Dettagli JSON</div>
              <button
                type="button"
                className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
                onClick={closeJsonDetail}
              >
                Close
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto p-4">
              <pre className="whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800">
{typeof jsonDetail === "string" ? jsonDetail : JSON.stringify(jsonDetail, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {selectedRow && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="flex w-full max-w-3xl flex-col rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div className="text-sm font-semibold text-slate-900">Dettagli Log</div>
            </div>
            <div className="max-h-[70vh] overflow-auto p-4">
              <table className="w-full border-collapse text-xs">
                <tbody>
                  {!alertMode && Object.entries(selectedRow).map(([key, value]) => {
                    // Skip internal fields
                    if (key === "__live") return null;

                    let displayValue: string;
                    if (value === null || value === undefined) {
                      displayValue = "-";
                    } else if (typeof value === "object") {
                      displayValue = JSON.stringify(value, null, 2);
                    } else if (key === "timestamp" || key === "ts" || key === "time") {
                      displayValue = formatDateTime(String(value), timeZone);
                    } else {
                      displayValue = String(value);
                    }

                    return (
                      <tr key={key} className="border-b border-slate-100">
                        <td className="px-3 py-2 font-semibold text-slate-700 align-top w-48">
                          {key}
                        </td>
                        <td className="px-3 py-2 text-slate-600">
                          <div className="whitespace-pre-wrap break-words">
                            {displayValue}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {alertMode && (
                    <>
                      <tr className="border-b border-slate-100">
                        <td className="px-3 py-2 font-semibold text-slate-700 align-top w-48">Nome regola</td>
                        <td className="px-3 py-2 text-slate-600">
                          <input
                            type="text"
                            value={alertFormData.name}
                            onChange={(e) => setAlertFormData((prev) => ({ ...prev, name: e.target.value }))}
                            className="w-full rounded border border-slate-200 px-2 py-1 text-xs"
                            placeholder="Es. Alert errors cachemanager"
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="px-3 py-2 font-semibold text-slate-700 align-top w-48">Attiva regola</td>
                        <td className="px-3 py-2 text-slate-600">
                          <label className="inline-flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={alertFormData.enabled}
                              onChange={(e) => setAlertFormData((prev) => ({ ...prev, enabled: e.target.checked }))}
                              className="rounded border-slate-300"
                            />
                            <span className="text-xs">Enabled</span>
                          </label>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="px-3 py-2 font-semibold text-slate-700 align-top w-48">level</td>
                        <td className="px-3 py-2 text-slate-600">
                          <div className="flex flex-wrap gap-2">
                            {levelOrder.map((lvl) => (
                              <label key={lvl} className="inline-flex items-center gap-1">
                                <input
                                  type="checkbox"
                                  checked={alertFormData.levels.includes(lvl)}
                                  onChange={(e) => {
                                    setAlertFormData((prev) => ({
                                      ...prev,
                                      levels: e.target.checked
                                        ? [...prev.levels, lvl]
                                        : prev.levels.filter((l) => l !== lvl),
                                    }));
                                  }}
                                  className="rounded border-slate-300"
                                />
                                <span className="text-xs capitalize">{lvl}</span>
                              </label>
                            ))}
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="px-3 py-2 font-semibold text-slate-700 align-top w-48">microservice</td>
                        <td className="px-3 py-2 text-slate-600">
                          <select
                            value={alertFormData.microservice}
                            onChange={(e) => setAlertFormData((prev) => ({ ...prev, microservice: e.target.value }))}
                            className="w-full rounded border border-slate-200 px-2 py-1 text-xs"
                          >
                            {serviceOptions.map((service) => (
                              <option key={service} value={service}>
                                {service}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="px-3 py-2 font-semibold text-slate-700 align-top w-48">module</td>
                        <td className="px-3 py-2 text-slate-600">
                          <select
                            value={alertFormData.module}
                            onChange={(e) => setAlertFormData((prev) => ({ ...prev, module: e.target.value }))}
                            className="w-full rounded border border-slate-200 px-2 py-1 text-xs"
                          >
                            <option value="">-</option>
                            {moduleOptions.filter((m) => m !== "all").map((mod) => (
                              <option key={mod} value={mod}>
                                {mod}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="px-3 py-2 font-semibold text-slate-700 align-top w-48">functionName</td>
                        <td className="px-3 py-2 text-slate-600">
                          <select
                            value={alertFormData.functionName}
                            onChange={(e) => setAlertFormData((prev) => ({ ...prev, functionName: e.target.value }))}
                            className="w-full rounded border border-slate-200 px-2 py-1 text-xs"
                          >
                            <option value="">-</option>
                            {functionOptions.filter((f) => f !== "all").map((fn) => (
                              <option key={fn} value={fn}>
                                {fn}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="px-3 py-2 font-semibold text-slate-700 align-top w-48">message</td>
                        <td className="px-3 py-2 text-slate-600">
                          <textarea
                            value={alertFormData.message}
                            onChange={(e) => setAlertFormData((prev) => ({ ...prev, message: e.target.value }))}
                            className="w-full rounded border border-slate-200 px-2 py-1 text-xs"
                            rows={3}
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100 bg-slate-50">
                        <td className="px-3 py-3 font-semibold text-slate-900 align-top w-48" colSpan={2}>
                          Actions
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="px-3 py-2 font-semibold text-slate-700 align-top w-48">Channels</td>
                        <td className="px-3 py-2 text-slate-600">
                          <div className="flex flex-wrap gap-3">
                            <label className="inline-flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={alertFormData.channelWhatsapp}
                                onChange={(e) => setAlertFormData((prev) => ({ ...prev, channelWhatsapp: e.target.checked }))}
                                className="rounded border-slate-300"
                              />
                              <span className="text-xs">Whatsapp</span>
                            </label>
                            <label className="inline-flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={alertFormData.channelEmail}
                                onChange={(e) => setAlertFormData((prev) => ({ ...prev, channelEmail: e.target.checked }))}
                                className="rounded border-slate-300"
                              />
                              <span className="text-xs">Email</span>
                            </label>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="px-3 py-2 font-semibold text-slate-700 align-top w-48">Email To</td>
                        <td className="px-3 py-2 text-slate-600">
                          <input
                            type="text"
                            value={alertFormData.emailTo}
                            onChange={(e) => setAlertFormData((prev) => ({ ...prev, emailTo: e.target.value }))}
                            className="w-full rounded border border-slate-200 px-2 py-1 text-xs"
                            placeholder="destinatario email"
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="px-3 py-2 font-semibold text-slate-700 align-top w-48">Email Subject</td>
                        <td className="px-3 py-2 text-slate-600">
                          <input
                            type="text"
                            value={alertFormData.emailSubject}
                            onChange={(e) => setAlertFormData((prev) => ({ ...prev, emailSubject: e.target.value }))}
                            className="w-full rounded border border-slate-200 px-2 py-1 text-xs"
                            placeholder="Oggetto alert"
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="px-3 py-2 font-semibold text-slate-700 align-top w-48">Template</td>
                        <td className="px-3 py-2 text-slate-600">
                          <textarea
                            value={alertFormData.template}
                            onChange={(e) => setAlertFormData((prev) => ({ ...prev, template: e.target.value }))}
                            className="w-full rounded border border-slate-200 px-2 py-1 text-xs"
                            rows={3}
                            placeholder="Alert: {{message}}"
                          />
                          <div className="mt-2 rounded-md border border-slate-200 bg-white px-2 py-2 text-[10px] text-slate-600">
                            <div className="font-semibold text-slate-700">Template tags</div>
                            <div className="mt-1 grid gap-x-3 gap-y-1 sm:grid-cols-2">
                              <span>
                                <span className="font-semibold text-slate-700">{"{{message}}"}</span> messaggio
                              </span>
                              <span>
                                <span className="font-semibold text-slate-700">{"{{time}}"}</span> timestamp
                              </span>
                              <span>
                                <span className="font-semibold text-slate-700">{"{{id}}"}</span> id log
                              </span>
                              <span>
                                <span className="font-semibold text-slate-700">{"{{level}}"}</span> livello
                              </span>
                              <span>
                                <span className="font-semibold text-slate-700">{"{{service}}"}</span> microservizio
                              </span>
                              <span>
                                <span className="font-semibold text-slate-700">{"{{module}}"}</span> modulo
                              </span>
                              <span>
                                <span className="font-semibold text-slate-700">{"{{function}}"}</span> funzione
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
              <div className="flex items-center gap-2">
                {!alertMode && (
                  <BaseButton
                    variant="solid"
                    color="primary"
                    size="sm"
                    onClick={enableAlertMode}
                  >
                    Set as Alert
                  </BaseButton>
                )}
                {alertMode && (
                  <BaseButton
                    variant="solid"
                    color="primary"
                    size="sm"
                    onClick={handleSaveAlert}
                    disabled={
                      !alertFormData.name.trim() ||
                      alertSaveStatus === "loading" ||
                      (alertFormData.channelEmail && (!alertFormData.emailTo.trim() || !alertFormData.emailSubject.trim())) ||
                      (!alertFormData.channelEmail && !alertFormData.channelWhatsapp)
                    }
                  >
                    {alertSaveStatus === "loading" ? "Saving..." : "Save as Alert"}
                  </BaseButton>
                )}
                {alertSaveError && (
                  <span className="text-xs text-rose-600">{alertSaveError}</span>
                )}
              </div>
              <BaseButton
                variant="outline"
                color="neutral"
                size="sm"
                onClick={closeRowDetail}
              >
                CLOSE
              </BaseButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
