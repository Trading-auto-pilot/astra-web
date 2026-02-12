import { useEffect, useMemo, useState } from "react";
import AppIcon from "../atoms/icon/AppIcon";
import SectionHeader from "../molecules/content/SectionHeader";
import {
  deleteSchedulerJob,
  fetchSchedulerJobs,
  createSchedulerJob,
  reloadSchedulerJobs,
  updateSchedulerJob,
  runSchedulerJob,
  fetchSchedulerJobLastRun,
  type SchedulerJob,
  type SchedulerLastRun,
} from "../../api/scheduler";
import { redisWsBridgeClient } from "../../services/ws/redisWsBridgeClient";
import { resolveText } from "../../utils/textResolver";
import TextResolverHelpModal from "../molecules/content/TextResolverHelpModal";

type Status = "idle" | "loading" | "error";
type RuleDraft = {
  id?: number | string;
  ruleType?: string;
  daysOfWeekText?: string;
  daysOfMonthText?: string;
  time?: string;
  _markedForDelete?: boolean;
};

const HTTP_METHOD_OPTIONS = ["GET", "POST", "PUT", "PATCH", "DELETE", "ANY"];
const RULE_TYPE_OPTIONS = ["daily", "weekly", "monthly"];
const fallbackTimezones = ["UTC", "Asia/Dubai", "Europe/Rome"];
const timezones = typeof Intl !== "undefined" && "supportedValuesOf" in Intl
  ? (Intl as any).supportedValuesOf("timeZone")
  : fallbackTimezones;

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

const parseTime = (time?: string | null) => {
  if (!time) return null;
  const [h, m] = String(time).split(":").map((item) => Number(item));
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  return { hours: h, minutes: m };
};

const parseWeekday = (value: string) => {
  const normalized = value.trim().toLowerCase();
  const map: Record<string, number> = {
    "0": 0,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    sun: 0,
    sunday: 0,
    mon: 1,
    monday: 1,
    tue: 2,
    tuesday: 2,
    wed: 3,
    wednesday: 3,
    thu: 4,
    thursday: 4,
    fri: 5,
    friday: 5,
    sat: 6,
    saturday: 6,
  };
  return map[normalized];
};

const buildDateWithTime = (base: Date, time?: string | null) => {
  const parsed = parseTime(time);
  const date = new Date(base);
  if (parsed) {
    date.setHours(parsed.hours, parsed.minutes, 0, 0);
  } else {
    date.setHours(0, 0, 0, 0);
  }
  return date;
};

const computeNextRun = (job: SchedulerJob): Date | null => {
  const rules = Array.isArray(job.rules) ? job.rules : [];
  if (!rules.length) return null;
  const now = new Date();
  let earliest: Date | null = null;

  const tryCandidate = (candidate: Date) => {
    if (candidate <= now) return;
    if (!earliest || candidate < earliest) earliest = candidate;
  };

  rules.forEach((rule: any) => {
    const ruleType = (rule.ruleType ?? rule.rule_type ?? "").toString().toLowerCase();
    const time = rule.time ?? rule.time_hhmm ?? null;

    if (ruleType === "daily" || !ruleType) {
      const todayCandidate = buildDateWithTime(now, time);
      if (todayCandidate > now) {
        tryCandidate(todayCandidate);
      } else {
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        tryCandidate(buildDateWithTime(tomorrow, time));
      }
      return;
    }

    if (ruleType === "weekly") {
      const days = Array.isArray(rule.daysOfWeek)
        ? rule.daysOfWeek
        : Array.isArray(rule.days_of_week)
          ? rule.days_of_week
          : [];
      const parsedDays = days
        .map((day: string) => parseWeekday(String(day)))
        .filter((day: number | undefined) => day !== undefined) as number[];
      const targetDays = parsedDays.length ? parsedDays : [now.getDay()];
      for (let i = 0; i < 14; i += 1) {
        const candidate = new Date(now);
        candidate.setDate(now.getDate() + i);
        if (!targetDays.includes(candidate.getDay())) continue;
        tryCandidate(buildDateWithTime(candidate, time));
        if (earliest) return;
      }
      return;
    }

    if (ruleType === "monthly") {
      const daysOfMonth = Array.isArray(rule.daysOfMonth)
        ? rule.daysOfMonth
        : Array.isArray(rule.days_of_month)
          ? rule.days_of_month
          : [];
      const parsedDays = daysOfMonth
        .map((day: string | number) => Number(day))
        .filter((day: number) => Number.isFinite(day));
      const targetDays = parsedDays.length ? parsedDays : [now.getDate()];
      for (let i = 0; i < 62; i += 1) {
        const candidate = new Date(now);
        candidate.setDate(now.getDate() + i);
        if (!targetDays.includes(candidate.getDate())) continue;
        tryCandidate(buildDateWithTime(candidate, time));
        if (earliest) return;
      }
    }
  });

  return earliest;
};

export function SchedulerPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<SchedulerJob[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [createDraft, setCreateDraft] = useState<SchedulerJob>({
    jobKey: "",
    description: "",
    enabled: true,
    openMarket: false,
    exchanges: [],
    method: "GET",
    url: "",
    timeoutMs: 15000,
    retry: { maxAttempts: 1, backoffMs: 5000 },
    timezone: "UTC",
  });
  const [createRules, setCreateRules] = useState<RuleDraft[]>([]);
  const [createHeadersText, setCreateHeadersText] = useState("{}");
  const [createBodyText, setCreateBodyText] = useState("");
  const [createStatus, setCreateStatus] = useState<Status>("idle");
  const [createError, setCreateError] = useState<string | null>(null);
  const [detailStatus, setDetailStatus] = useState<Status>("idle");
  const [detailError, setDetailError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<SchedulerJob | null>(null);
  const [editingDraft, setEditingDraft] = useState<SchedulerJob | null>(null);
  const [editingRules, setEditingRules] = useState<RuleDraft[]>([]);
  const [headersText, setHeadersText] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [resolveEnabled, setResolveEnabled] = useState(false);
  const [showResolverHelp, setShowResolverHelp] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showRunModal, setShowRunModal] = useState(false);
  const [selectedRunJobKey, setSelectedRunJobKey] = useState<string | null>(null);
  const [lastRunData, setLastRunData] = useState<SchedulerLastRun | null>(null);
  const [lastRunLoading, setLastRunLoading] = useState(false);
  const [showRunNowModal, setShowRunNowModal] = useState(false);
  const [runNowJob, setRunNowJob] = useState<SchedulerJob | null>(null);
  const [runNowHeadersText, setRunNowHeadersText] = useState("{}");
  const [runNowBodyText, setRunNowBodyText] = useState("");
  const [runNowStatus, setRunNowStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [runNowError, setRunNowError] = useState<string | null>(null);
  const [runNowResolveEnabled, setRunNowResolveEnabled] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    setError(null);

    fetchSchedulerJobs(controller.signal)
      .then((data) => {
        setJobs(Array.isArray(data) ? data : []);
        setStatus("idle");
      })
      .catch((err: any) => {
        setError(err?.message || "Errore durante il caricamento dei job");
        setStatus("error");
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    redisWsBridgeClient.start();
    const unsubscribe = redisWsBridgeClient.subscribe({
      filter: (msg) => {
        if (!msg || typeof msg !== "object") return false;
        if (msg.type !== "momentumRefresh") return false;
        const channel = typeof msg.__channel === "string" ? msg.__channel : "";
        if (channel && !channel.includes(".tickerscanner.telemetry")) return false;
        return typeof msg.jobKey === "string" && msg.jobKey.trim().length > 0;
      },
      onMessage: (payload) => {
        const jobKey = String(payload.jobKey || "").trim();
        if (!jobKey) return;
        setLastRunsByJobKey((prev) => ({ ...prev, [jobKey]: payload }));
      },
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const rows = useMemo(() => jobs, [jobs]);

  const seedDraftFromJob = (job: SchedulerJob) => {
    setEditingDraft({ ...job });
    const rules = Array.isArray(job.rules) ? job.rules : [];
    setEditingRules(
      rules.map((rule: any) => ({
        id: rule.id,
        ruleType: rule.ruleType ?? rule.rule_type ?? "",
        daysOfWeekText: Array.isArray(rule.daysOfWeek)
          ? rule.daysOfWeek.join(",")
          : "",
        daysOfMonthText: Array.isArray(rule.daysOfMonth)
          ? rule.daysOfMonth.join(",")
          : "",
        time: rule.time ?? "",
      }))
    );
    setHeadersText(JSON.stringify(job.headers ?? {}, null, 2));
    setBodyText(
      job.body === null || job.body === undefined
        ? ""
        : JSON.stringify(job.body, null, 2)
    );
  };

  const handleEdit = async (job: SchedulerJob) => {
    setDetailStatus("loading");
    setDetailError(null);

    try {
      await reloadSchedulerJobs();
      const updated = await fetchSchedulerJobs();
      setJobs(updated);
      const fresh = updated.find((item) => String(item.id) === String(job.id));
      const nextJob = fresh ?? job;
      setSelectedJob(nextJob);
      seedDraftFromJob(nextJob);
      setDetailStatus("idle");
    } catch (err: any) {
      setSelectedJob(job);
      seedDraftFromJob(job);
      setDetailError(err?.message || "Errore durante il reload dei job");
      setDetailStatus("error");
    }
  };

  const updateDraftField = (key: string, value: unknown) => {
    setEditingDraft((prev) => ({ ...(prev || {}), [key]: value }));
  };

  const updateRuleField = (idx: number, key: string, value: unknown) => {
    setEditingRules((prev) =>
      prev.map((rule, index) =>
        index === idx ? { ...rule, [key]: value } : rule
      )
    );
  };

  const addRuleRow = () => {
    setEditingRules((prev) => [
      ...prev,
      {
        ruleType: "daily",
        daysOfWeekText: "",
        daysOfMonthText: "",
        time: "00:00",
      },
    ]);
  };

  const toggleRuleDelete = (idx: number) => {
    setEditingRules((prev) =>
      prev.map((rule, index) =>
        index === idx ? { ...rule, _markedForDelete: !rule._markedForDelete } : rule
      )
    );
  };

  const parseList = (value?: string) =>
    String(value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const parseNumberList = (value?: string) =>
    parseList(value).map((item) => {
      const numeric = Number(item);
      return Number.isFinite(numeric) ? numeric : item;
    });

  const handleSave = async () => {
    if (!editingDraft || !editingDraft.id) return;
    setSaving(true);
    setSaveError(null);

    let headers: Record<string, unknown> | null = null;
    let body: Record<string, unknown> | null = null;

    try {
      headers = headersText.trim() ? JSON.parse(headersText) : {};
    } catch {
      setSaveError("Headers non sono un JSON valido.");
      setSaving(false);
      return;
    }

    try {
      body = bodyText.trim() ? JSON.parse(bodyText) : null;
    } catch {
      setSaveError("Body non e un JSON valido. I placeholder vanno tra virgolette, es: \"[[yesterday]]\".");
      setSaving(false);
      return;
    }

    const rules = editingRules
      .filter((rule) => !rule._markedForDelete)
      .map((rule) => ({
        ruleType: rule.ruleType || "daily",
        daysOfWeek: parseList(rule.daysOfWeekText),
        daysOfMonth: parseNumberList(rule.daysOfMonthText),
        time: rule.time || "00:00",
      }));

    const payload = {
      job: {
        jobKey: editingDraft.jobKey,
        description: editingDraft.description,
        enabled: !!editingDraft.enabled,
        openMarket: !!editingDraft.openMarket,
        exchanges:
          typeof (editingDraft as any)?.exchangesText === "string"
            ? parseList((editingDraft as any)?.exchangesText)
            : Array.isArray(editingDraft.exchanges)
              ? editingDraft.exchanges
              : [],
        method: editingDraft.method || "GET",
        url: editingDraft.url,
        headers,
        body,
        timeoutMs: Number(editingDraft.timeoutMs) || 15000,
        retry: {
          maxAttempts: Number((editingDraft as any)?.retry?.maxAttempts) || 1,
          backoffMs: Number((editingDraft as any)?.retry?.backoffMs) || 5000,
        },
        timezone: editingDraft.timezone || "UTC",
      },
      rules,
    };

    try {
      await updateSchedulerJob(editingDraft.id, payload);
      const refreshed = await fetchSchedulerJobs();
      setJobs(refreshed);
      const fresh = refreshed.find((item) => String(item.id) === String(editingDraft.id));
      if (fresh) {
        setSelectedJob(fresh);
        seedDraftFromJob(fresh);
      }
    } catch (err: any) {
      setSaveError(err?.message || "Errore durante il salvataggio");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editingDraft?.id) return;
    const confirmed = window.confirm("Questa operazione e irreversibile. Procedere?");
    if (!confirmed) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      await deleteSchedulerJob(editingDraft.id);
      const refreshed = await fetchSchedulerJobs();
      setJobs(refreshed);
      setSelectedJob(null);
      setEditingDraft(null);
    } catch (err: any) {
      setDeleteError(err?.message || "Errore durante la cancellazione");
    } finally {
      setDeleting(false);
    }
  };

  const openRunNowModal = (job: SchedulerJob) => {
    setRunNowJob(job);
    setRunNowHeadersText(JSON.stringify(job.headers ?? {}, null, 2));
    setRunNowBodyText(
      job.body === null || job.body === undefined
        ? ""
        : typeof job.body === "string"
          ? job.body
          : JSON.stringify(job.body, null, 2)
    );
    setRunNowStatus("idle");
    setRunNowError(null);
    setShowRunNowModal(true);
  };

  const closeRunNowModal = () => {
    setShowRunNowModal(false);
    setRunNowJob(null);
    setRunNowStatus("idle");
    setRunNowError(null);
  };

  const handleRunNow = async () => {
    if (!runNowJob?.jobKey) return;
    setRunNowStatus("loading");
    setRunNowError(null);

    let headersOverride: Record<string, unknown> | undefined;
    let bodyOverride: unknown | undefined;

    try {
      headersOverride = runNowHeadersText.trim() ? JSON.parse(runNowHeadersText) : undefined;
    } catch {
      setRunNowError("Headers non sono un JSON valido. I placeholder vanno tra virgolette, es: \"[[yesterday]]\".");
      setRunNowStatus("error");
      return;
    }

    try {
      bodyOverride = runNowBodyText.trim() ? JSON.parse(runNowBodyText) : undefined;
    } catch {
      setRunNowError("Body non e un JSON valido. I placeholder vanno tra virgolette, es: \"[[yesterday]]\".");
      setRunNowStatus("error");
      return;
    }

    const overrides: { headers?: Record<string, unknown>; body?: unknown } = {};
    if (headersOverride) overrides.headers = headersOverride;
    if (bodyOverride !== undefined) overrides.body = bodyOverride;

    try {
      await runSchedulerJob(runNowJob.jobKey, Object.keys(overrides).length ? overrides : undefined);
      setRunNowStatus("success");
      setTimeout(() => closeRunNowModal(), 1500);
    } catch (err: any) {
      setRunNowError(err?.message || "Errore durante l'avvio del job");
      setRunNowStatus("error");
    }
  };

  const updateCreateField = (key: string, value: unknown) => {
    setCreateDraft((prev) => ({ ...(prev || {}), [key]: value }));
  };

  const updateCreateRuleField = (idx: number, key: string, value: unknown) => {
    setCreateRules((prev) =>
      prev.map((rule, index) =>
        index === idx ? { ...rule, [key]: value } : rule
      )
    );
  };

  const addCreateRuleRow = () => {
    setCreateRules((prev) => [
      ...prev,
      {
        ruleType: "daily",
        daysOfWeekText: "",
        daysOfMonthText: "",
        time: "",
      },
    ]);
  };

  const toggleCreateRuleDelete = (idx: number) => {
    setCreateRules((prev) =>
      prev.map((rule, index) =>
        index === idx ? { ...rule, _markedForDelete: !rule._markedForDelete } : rule
      )
    );
  };

  const resetCreateForm = () => {
    setCreateDraft({
      jobKey: "",
      description: "",
      enabled: true,
      method: "GET",
      url: "",
      timeoutMs: 15000,
      retry: { maxAttempts: 1, backoffMs: 5000 },
      timezone: "UTC",
    });
    setCreateRules([]);
    setCreateHeadersText("{}");
    setCreateBodyText("");
    setCreateError(null);
    setCreateStatus("idle");
  };

  const handleCreate = async () => {
    if (!createDraft.jobKey || !createDraft.url) {
      setCreateError("Job key e URL sono obbligatori.");
      return;
    }
    setCreateStatus("loading");
    setCreateError(null);

    let headers: Record<string, unknown> | null = null;
    let body: Record<string, unknown> | null = null;

    try {
      headers = createHeadersText.trim() ? JSON.parse(createHeadersText) : {};
    } catch {
      setCreateError("Headers non sono un JSON valido.");
      setCreateStatus("error");
      return;
    }

    try {
      body = createBodyText.trim() ? JSON.parse(createBodyText) : null;
    } catch {
      setCreateError("Body non e un JSON valido.");
      setCreateStatus("error");
      return;
    }

    const rules = createRules
      .filter((rule) => !rule._markedForDelete)
      .map((rule) => ({
        ruleType: rule.ruleType || "daily",
        daysOfWeek: parseList(rule.daysOfWeekText),
        daysOfMonth: parseNumberList(rule.daysOfMonthText),
        time: rule.time || "00:00",
      }));

    const payload = {
      job: {
        jobKey: createDraft.jobKey,
        description: createDraft.description,
        enabled: !!createDraft.enabled,
        openMarket: !!createDraft.openMarket,
        exchanges:
          typeof (createDraft as any)?.exchangesText === "string"
            ? parseList((createDraft as any)?.exchangesText)
            : Array.isArray(createDraft.exchanges)
              ? createDraft.exchanges
              : [],
        method: createDraft.method || "GET",
        url: createDraft.url,
        headers,
        body,
        timeoutMs: Number(createDraft.timeoutMs) || 15000,
        retry: {
          maxAttempts: Number((createDraft as any)?.retry?.maxAttempts) || 1,
          backoffMs: Number((createDraft as any)?.retry?.backoffMs) || 5000,
        },
        timezone: createDraft.timezone || "UTC",
      },
      rules,
    };

    try {
      await createSchedulerJob(payload);
      const refreshed = await fetchSchedulerJobs();
      setJobs(refreshed);
      setShowCreate(false);
      resetCreateForm();
      setCreateStatus("idle");
    } catch (err: any) {
      setCreateError(err?.message || "Errore durante la creazione del job");
      setCreateStatus("error");
    }
  };

  return (
    <div className="space-y-4">
      <SectionHeader title="Scheduler" subTitle="Gestione scheduler" />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          onClick={() => {
            setShowCreate((prev) => !prev);
            if (!showCreate) resetCreateForm();
          }}
        >
          <AppIcon icon="mdi:calendar-plus" className="h-4 w-4" />
          {showCreate ? "Chiudi creazione" : "Add scheduler"}
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600"
          onClick={async () => {
            try {
              await reloadSchedulerJobs();
              const refreshed = await fetchSchedulerJobs();
              setJobs(refreshed);
            } catch (err: any) {
              setError(err?.message || "Errore durante il reload");
              setStatus("error");
            }
          }}
          title="Reload engine scheduler"
          aria-label="Reload engine scheduler"
        >
          <AppIcon icon="mdi:engine-outline" className="h-4 w-4" />
          Reload engine
        </button>
      </div>

      {showCreate && (
        <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-base font-semibold text-slate-900">Nuovo task</div>
            <button
              type="button"
              className="text-sm font-semibold text-slate-600 hover:text-slate-800"
              onClick={() => setShowCreate(false)}
            >
              Chiudi
            </button>
          </div>

          {createError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {createError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
              Job key
              <input
                type="text"
                value={createDraft.jobKey ?? ""}
                onChange={(e) => updateCreateField("jobKey", e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
              Metodo
              <select
                value={createDraft.method ?? "GET"}
                onChange={(e) => updateCreateField("method", e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
              >
                {HTTP_METHOD_OPTIONS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600 md:col-span-2">
              Descrizione
              <input
                type="text"
                value={createDraft.description ?? ""}
                onChange={(e) => updateCreateField("description", e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600 md:col-span-2">
              <span className="flex items-center gap-2">
                URL
                <button
                  type="button"
                  onClick={() => setResolveEnabled((v) => !v)}
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-md border text-[10px] font-bold transition ${
                    resolveEnabled
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-slate-300 bg-white text-slate-400"
                  }`}
                  title="Anteprima placeholder risolti"
                >
                  f
                </button>
              </span>
              <input
                type="text"
                value={createDraft.url ?? ""}
                onChange={(e) => updateCreateField("url", e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
              />
              {resolveEnabled && createDraft.url?.includes("[[") && (
                <div className="mt-1 rounded-md border border-blue-100 bg-blue-50 px-2 py-1 text-[11px] text-blue-700">
                  <span className="font-semibold">Preview:</span> {resolveText(createDraft.url || "")}
                </div>
              )}
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <input
                type="checkbox"
                checked={!!createDraft.enabled}
                onChange={(e) => updateCreateField("enabled", e.target.checked)}
              />
              Enabled
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <input
                type="checkbox"
                checked={!!createDraft.openMarket}
                onChange={(e) => updateCreateField("openMarket", e.target.checked)}
              />
              Market aware (skip se exchange chiuso)
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600 md:col-span-2">
              Exchanges (comma)
              <input
                type="text"
                placeholder="NYSE,NASDAQ"
                value={(createDraft as any)?.exchangesText ?? (createDraft.exchanges || []).join(",")}
                onChange={(e) => updateCreateField("exchangesText", e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
              Timeout (ms)
              <input
                type="number"
                min={0}
                value={createDraft.timeoutMs ?? ""}
                onChange={(e) => updateCreateField("timeoutMs", e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
              Timezone
              <select
                value={createDraft.timezone ?? "UTC"}
                onChange={(e) => updateCreateField("timezone", e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
              >
                {timezones.map((zone: string) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
              Retry max attempts
              <input
                type="number"
                min={0}
                value={(createDraft as any)?.retry?.maxAttempts ?? ""}
                onChange={(e) =>
                  setCreateDraft((prev) => ({
                    ...(prev || {}),
                    retry: {
                      ...(prev?.retry as any),
                      maxAttempts: e.target.value,
                    },
                  }))
                }
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
              Retry backoff (ms)
              <input
                type="number"
                min={0}
                value={(createDraft as any)?.retry?.backoffMs ?? ""}
                onChange={(e) =>
                  setCreateDraft((prev) => ({
                    ...(prev || {}),
                    retry: {
                      ...(prev?.retry as any),
                      backoffMs: e.target.value,
                    },
                  }))
                }
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600 md:col-span-2">
              Headers (JSON)
              <textarea
                value={createHeadersText}
                onChange={(e) => setCreateHeadersText(e.target.value)}
                className="min-h-[70px] rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600 md:col-span-2">
              Body (JSON)
              <textarea
                value={createBodyText}
                onChange={(e) => setCreateBodyText(e.target.value)}
                className="min-h-[70px] rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
              />
            </label>
            <div className="text-xs font-semibold text-slate-600 md:col-span-2">
              Rules
              <div className="mt-2 space-y-3">
                {createRules.map((rule, idx) => (
                  <div
                    key={`new-${idx}`}
                    className={`grid grid-cols-1 gap-2 rounded-md border border-slate-200 bg-slate-50 p-2 md:grid-cols-4 ${
                      rule._markedForDelete ? "opacity-60" : ""
                    }`}
                  >
                    <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
                      Rule type
                      <select
                        value={rule.ruleType ?? "daily"}
                        onChange={(e) => updateCreateRuleField(idx, "ruleType", e.target.value)}
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px]"
                      >
                        {RULE_TYPE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
                      Days of week
                      <input
                        type="text"
                        placeholder="Mon,Tue"
                        value={rule.daysOfWeekText ?? ""}
                        onChange={(e) => updateCreateRuleField(idx, "daysOfWeekText", e.target.value)}
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px]"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
                      Days of month
                      <input
                        type="text"
                        placeholder="1,15,30"
                        value={rule.daysOfMonthText ?? ""}
                        onChange={(e) => updateCreateRuleField(idx, "daysOfMonthText", e.target.value)}
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px]"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
                      Time
                      <input
                        type="time"
                        value={rule.time ?? ""}
                        onChange={(e) => updateCreateRuleField(idx, "time", e.target.value)}
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px]"
                      />
                    </label>
                    <div className="flex items-end justify-end md:col-span-4">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-slate-200 bg-white p-1 text-red-600 shadow-sm transition hover:border-slate-300 hover:text-red-700"
                        onClick={() => toggleCreateRuleDelete(idx)}
                        aria-label={rule._markedForDelete ? "Ripristina regola" : "Rimuovi regola"}
                      >
                        {rule._markedForDelete ? (
                          <span className="text-[11px] font-semibold text-slate-600">Ripristina</span>
                        ) : (
                          <AppIcon icon="mdi:trash-can-outline" className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-blue-700"
                  onClick={addCreateRuleRow}
                >
                  <AppIcon icon="mdi:plus" className="h-4 w-4" />
                  Aggiungi regola
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              className="rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
              onClick={handleCreate}
              disabled={createStatus === "loading"}
            >
              {createStatus === "loading" ? "Salvataggio..." : "Crea scheduler"}
            </button>
          </div>
        </div>
      )}

      {status === "loading" && (
        <div className="text-sm text-slate-600">Caricamento...</div>
      )}
      {status === "error" && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      {status === "idle" && rows.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
          Nessun job schedulato.
        </div>
      )}

      {status === "idle" && rows.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-2 py-1.5 font-semibold">Job key</th>
                <th className="px-2 py-1.5 font-semibold">Descrizione</th>
                <th className="px-2 py-1.5 font-semibold">Enabled</th>
                <th className="px-2 py-1.5 font-semibold">Last run</th>
                <th className="px-2 py-1.5 font-semibold">Next run</th>
                <th className="px-2 py-1.5 font-semibold">Last status</th>
                <th className="px-2 py-1.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((job) => (
                <tr key={job.id ?? job.jobKey ?? job.url} className="hover:bg-slate-50">
                  <td className="px-2 py-1.5 font-semibold text-slate-900">
                    {job.jobKey ?? "-"}
                  </td>
                  <td className="px-2 py-1.5 text-slate-700">
                    {job.description ?? "-"}
                  </td>
                  <td className="px-2 py-1.5 text-slate-700">
                    {job.enabled ? "Yes" : "No"}
                  </td>
                  <td className="px-2 py-1.5 text-slate-700">
                    {formatDateTime(
                      (job as any).last_run_at ??
                        (job as any).lastRunAt ??
                        (job as any).last_run ??
                        (job as any).lastRun ??
                        null
                    )}
                  </td>
                  <td className="px-2 py-1.5 text-slate-700">
                    {(() => {
                      const next = computeNextRun(job);
                      if (!next) return "-";
                      return next.toLocaleString("it-IT", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: job.timezone || "UTC",
                      });
                    })()}
                  </td>
                  <td className="px-2 py-1.5 text-slate-700">
                    {(job as any).last_status ?? (job as any).lastStatus ?? "-"}
                  </td>
                  <td className="px-2 py-1.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-blue-700"
                        aria-label="Modifica scheduler"
                        onClick={() => handleEdit(job)}
                      >
                        <AppIcon icon="mdi:pencil" className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-800"
                        aria-label="Log di esecuzione"
                        title="Log di esecuzione"
                        onClick={async () => {
                          const jobKey = String(job.jobKey || "").trim();
                          if (!jobKey) return;
                          setSelectedRunJobKey(jobKey);
                          setLastRunData(null);
                          setLastRunLoading(true);
                          setShowRunModal(true);
                          try {
                            const data = await fetchSchedulerJobLastRun(jobKey);
                            setLastRunData(data);
                          } catch {
                            setLastRunData(null);
                          } finally {
                            setLastRunLoading(false);
                          }
                        }}
                      >
                        <AppIcon icon="mdi:clipboard-text-outline" className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-emerald-700 shadow-sm transition hover:border-slate-300 hover:text-emerald-800"
                        aria-label="Run now"
                        title="Run now"
                        onClick={() => openRunNowModal(job)}
                      >
                        <AppIcon icon="mdi:play" className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedJob && editingDraft && (
        <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-base font-semibold text-slate-900">Dettagli job</div>
            <button
              type="button"
              className="text-sm font-semibold text-slate-600 hover:text-slate-800"
              onClick={() => {
                setSelectedJob(null);
                setEditingDraft(null);
              }}
            >
              Chiudi
            </button>
          </div>

          {detailStatus === "loading" && (
            <div className="text-sm text-slate-600">Aggiornamento regole...</div>
          )}
          {detailStatus === "error" && detailError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {detailError}
            </div>
          )}
          {saveError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {saveError}
            </div>
          )}
          {deleteError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {deleteError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <div className="text-xs font-semibold text-slate-600">
              ID
              <div className="mt-1 text-sm text-slate-800">{editingDraft.id ?? "-"}</div>
            </div>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
              Job key
              <input
                type="text"
                value={editingDraft.jobKey ?? ""}
                onChange={(e) => updateDraftField("jobKey", e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600 md:col-span-2">
              Descrizione
              <input
                type="text"
                value={editingDraft.description ?? ""}
                onChange={(e) => updateDraftField("description", e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600 md:col-span-2">
              Exchanges (comma)
              <input
                type="text"
                placeholder="NYSE,NASDAQ"
                value={
                  (editingDraft as any)?.exchangesText ??
                  (Array.isArray(editingDraft.exchanges) ? editingDraft.exchanges.join(",") : "")
                }
                onChange={(e) => updateDraftField("exchangesText", e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
              Metodo
              <select
                value={editingDraft.method ?? "GET"}
                onChange={(e) => updateDraftField("method", e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
              >
                {HTTP_METHOD_OPTIONS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <input
                type="checkbox"
                checked={!!editingDraft.enabled}
                onChange={(e) => updateDraftField("enabled", e.target.checked)}
              />
              Enabled
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <input
                type="checkbox"
                checked={!!editingDraft.openMarket}
                onChange={(e) => updateDraftField("openMarket", e.target.checked)}
              />
              Market aware (skip se exchange chiuso)
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600 md:col-span-2">
              <span className="flex items-center gap-2">
                URL
                <button
                  type="button"
                  onClick={() => setResolveEnabled((v) => !v)}
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-md border text-[10px] font-bold transition ${
                    resolveEnabled
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-slate-300 bg-white text-slate-400"
                  }`}
                  title="Anteprima placeholder risolti"
                >
                  f
                </button>
              </span>
              <input
                type="text"
                value={editingDraft.url ?? ""}
                onChange={(e) => updateDraftField("url", e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
              />
              {resolveEnabled && editingDraft.url?.includes("[[") && (
                <div className="mt-1 rounded-md border border-blue-100 bg-blue-50 px-2 py-1 text-[11px] text-blue-700">
                  <span className="font-semibold">Preview:</span> {resolveText(editingDraft.url || "")}
                </div>
              )}
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
              Timeout (ms)
              <input
                type="number"
                min={0}
                value={editingDraft.timeoutMs ?? ""}
                onChange={(e) => updateDraftField("timeoutMs", e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
              Timezone
              <select
                value={editingDraft.timezone ?? "UTC"}
                onChange={(e) => updateDraftField("timezone", e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
              >
                {timezones.map((zone: string) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
              Retry max attempts
              <input
                type="number"
                min={0}
                value={(editingDraft as any)?.retry?.maxAttempts ?? ""}
                onChange={(e) =>
                  setEditingDraft((prev) => ({
                    ...(prev || {}),
                    retry: {
                      ...(prev?.retry as any),
                      maxAttempts: e.target.value,
                    },
                  }))
                }
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
              Retry backoff (ms)
              <input
                type="number"
                min={0}
                value={(editingDraft as any)?.retry?.backoffMs ?? ""}
                onChange={(e) =>
                  setEditingDraft((prev) => ({
                    ...(prev || {}),
                    retry: {
                      ...(prev?.retry as any),
                      backoffMs: e.target.value,
                    },
                  }))
                }
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
              />
            </label>
            <div className="flex items-center gap-2 md:col-span-2">
              <button
                type="button"
                onClick={() => setResolveEnabled((v) => !v)}
                className={`inline-flex h-6 w-6 items-center justify-center rounded-md border text-xs font-bold transition ${
                  resolveEnabled
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-slate-300 bg-white text-slate-400"
                }`}
                title="Anteprima placeholder risolti"
              >
                f
              </button>
              <button
                type="button"
                onClick={() => setShowResolverHelp(true)}
                className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-400 transition hover:border-slate-400 hover:text-slate-600"
                title="Guida placeholder"
              >
                <AppIcon icon="mdi:information-outline" className="h-4 w-4" />
              </button>
              <span className="text-[11px] text-slate-500">
                Anteprima placeholder <code className="rounded bg-slate-100 px-1">{"[[today]]"}</code> — i placeholder vengono risolti a runtime dal backend
              </span>
            </div>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600 md:col-span-2">
              Headers (JSON)
              <textarea
                value={headersText}
                onChange={(e) => setHeadersText(e.target.value)}
                className="min-h-[70px] rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
              />
              {resolveEnabled && headersText.includes("[[") && (
                <pre className="mt-1 rounded-md border border-blue-100 bg-blue-50 px-2 py-1 text-[11px] text-blue-700 whitespace-pre-wrap">
                  <span className="font-semibold">Preview:</span>{"\n"}{resolveText(headersText)}
                </pre>
              )}
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600 md:col-span-2">
              Body (JSON)
              <textarea
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                className="min-h-[70px] rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
              />
              {resolveEnabled && bodyText.includes("[[") && (
                <pre className="mt-1 rounded-md border border-blue-100 bg-blue-50 px-2 py-1 text-[11px] text-blue-700 whitespace-pre-wrap">
                  <span className="font-semibold">Preview:</span>{"\n"}{resolveText(bodyText)}
                </pre>
              )}
            </label>
            <div className="text-xs font-semibold text-slate-600 md:col-span-2">
              Rules
              <div className="mt-2 space-y-3">
                {editingRules.map((rule, idx) => (
                  <div
                    key={`${rule.id ?? "new"}-${idx}`}
                    className={`grid grid-cols-1 gap-2 rounded-md border border-slate-200 bg-slate-50 p-2 md:grid-cols-4 ${
                      rule._markedForDelete ? "opacity-60" : ""
                    }`}
                  >
                    <div className="text-xs font-semibold text-slate-600">
                      ID
                      <div className="mt-1 text-sm text-slate-800">{rule.id ?? "-"}</div>
                    </div>
                    <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
                      Rule type
                      <select
                        value={rule.ruleType ?? "daily"}
                        onChange={(e) => updateRuleField(idx, "ruleType", e.target.value)}
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px]"
                      >
                        {RULE_TYPE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
                      Days of week
                      <input
                        type="text"
                        placeholder="Mon,Tue"
                        value={rule.daysOfWeekText ?? ""}
                        onChange={(e) => updateRuleField(idx, "daysOfWeekText", e.target.value)}
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px]"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
                      Days of month
                      <input
                        type="text"
                        placeholder="1,15,30"
                        value={rule.daysOfMonthText ?? ""}
                        onChange={(e) => updateRuleField(idx, "daysOfMonthText", e.target.value)}
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px]"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
                      Time
                      <input
                        type="time"
                        value={rule.time ?? ""}
                        onChange={(e) => updateRuleField(idx, "time", e.target.value)}
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px]"
                      />
                    </label>
                    <div className="flex items-end justify-end md:col-span-3">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-slate-200 bg-white p-1 text-red-600 shadow-sm transition hover:border-slate-300 hover:text-red-700"
                        onClick={() => toggleRuleDelete(idx)}
                        aria-label={rule._markedForDelete ? "Ripristina regola" : "Rimuovi regola"}
                      >
                        {rule._markedForDelete ? (
                          <span className="text-[11px] font-semibold text-slate-600">Ripristina</span>
                        ) : (
                          <AppIcon icon="mdi:trash-can-outline" className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-blue-700"
                  onClick={addRuleRow}
                >
                  <AppIcon icon="mdi:plus" className="h-4 w-4" />
                  Aggiungi regola
                </button>
              </div>
            </div>
            <div className="text-xs font-semibold text-slate-600 md:col-span-2">
              Aggiornato
              <div className="mt-1 text-sm text-slate-800">
                {formatDateTime((selectedJob as any).updated_at ?? (selectedJob as any).updatedAt ?? null)}
              </div>
            </div>
            <div className="text-xs font-semibold text-slate-600 md:col-span-2">
              Creato
              <div className="mt-1 text-sm text-slate-800">
                {formatDateTime((selectedJob as any).created_at ?? (selectedJob as any).createdAt ?? null)}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Cancellazione..." : "Delete this Task"}
            </button>
            <button
              type="button"
              className="rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Salvataggio..." : "Salva modifiche"}
            </button>
          </div>
        </div>
      )}

      {showRunModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-semibold text-slate-900">Ultima esecuzione</div>
                <div className="text-xs text-slate-500">
                  {selectedRunJobKey ? `Job key: ${selectedRunJobKey}` : "Job key non disponibile"}
                </div>
              </div>
              <button
                type="button"
                className="text-sm font-semibold text-slate-600 hover:text-slate-800"
                onClick={() => {
                  setShowRunModal(false);
                  setSelectedRunJobKey(null);
                }}
              >
                Chiudi
              </button>
            </div>
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
              {lastRunLoading ? (
                <div className="text-slate-500">Caricamento...</div>
              ) : lastRunData ? (
                <pre className="max-h-[360px] overflow-auto whitespace-pre-wrap">
                  {JSON.stringify(lastRunData, null, 2)}
                </pre>
              ) : (
                <div className="text-slate-500">Nessun dato trovato su Redis per questo job.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {showRunNowModal && runNowJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-semibold text-slate-900">Esecuzione manuale</div>
                <div className="mt-0.5 text-xs text-slate-500">
                  Stai per avviare manualmente questo task. L'esecuzione avverra come se fosse schedulata.
                </div>
              </div>
              <button
                type="button"
                className="text-sm font-semibold text-slate-400 hover:text-slate-600"
                onClick={closeRunNowModal}
              >
                <AppIcon icon="mdi:close" className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>
                  <span className="font-semibold text-slate-500">Job key</span>
                  <div className="text-slate-800">{runNowJob.jobKey ?? "-"}</div>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Metodo</span>
                  <div className="text-slate-800">{runNowJob.method ?? "GET"}</div>
                </div>
                <div className="col-span-2 mt-1">
                  <span className="font-semibold text-slate-500">URL</span>
                  <div className="truncate text-slate-800">{runNowJob.url ?? "-"}</div>
                </div>
                <div className="col-span-2 mt-1">
                  <span className="font-semibold text-slate-500">Descrizione</span>
                  <div className="text-slate-800">{runNowJob.description || "-"}</div>
                </div>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRunNowResolveEnabled((v) => !v)}
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-md border text-xs font-bold transition ${
                    runNowResolveEnabled
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-slate-300 bg-white text-slate-400"
                  }`}
                  title="Anteprima placeholder risolti"
                >
                  f
                </button>
                <button
                  type="button"
                  onClick={() => setShowResolverHelp(true)}
                  className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-400 transition hover:border-slate-400 hover:text-slate-600"
                  title="Guida placeholder"
                >
                  <AppIcon icon="mdi:information-outline" className="h-4 w-4" />
                </button>
                <span className="text-[11px] text-slate-500">
                  Anteprima placeholder — risolti a runtime dal backend
                </span>
              </div>
              {runNowResolveEnabled && runNowJob?.url?.includes("[[") && (
                <div className="rounded-md border border-blue-100 bg-blue-50 px-2 py-1 text-[11px] text-blue-700">
                  <span className="font-semibold">URL preview:</span> {resolveText(runNowJob.url || "")}
                </div>
              )}
              <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
                Headers override (JSON)
                <textarea
                  value={runNowHeadersText}
                  onChange={(e) => setRunNowHeadersText(e.target.value)}
                  className="min-h-[60px] rounded-md border border-slate-200 bg-white px-2 py-1 font-mono text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                />
                {runNowResolveEnabled && runNowHeadersText.includes("[[") && (
                  <pre className="mt-1 rounded-md border border-blue-100 bg-blue-50 px-2 py-1 text-[11px] text-blue-700 whitespace-pre-wrap">
                    <span className="font-semibold">Preview:</span>{"\n"}{resolveText(runNowHeadersText)}
                  </pre>
                )}
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
                Body override (JSON)
                <textarea
                  value={runNowBodyText}
                  onChange={(e) => setRunNowBodyText(e.target.value)}
                  className="min-h-[60px] rounded-md border border-slate-200 bg-white px-2 py-1 font-mono text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                />
                {runNowResolveEnabled && runNowBodyText.includes("[[") && (
                  <pre className="mt-1 rounded-md border border-blue-100 bg-blue-50 px-2 py-1 text-[11px] text-blue-700 whitespace-pre-wrap">
                    <span className="font-semibold">Preview:</span>{"\n"}{resolveText(runNowBodyText)}
                  </pre>
                )}
              </label>
            </div>

            {runNowError && (
              <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {runNowError}
              </div>
            )}

            {runNowStatus === "success" && (
              <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                Job avviato con successo
              </div>
            )}

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                onClick={closeRunNowModal}
              >
                Annulla
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
                onClick={handleRunNow}
                disabled={runNowStatus === "loading" || runNowStatus === "success"}
              >
                <AppIcon icon="mdi:play" className="h-4 w-4" />
                {runNowStatus === "loading" ? "Avvio..." : "Avvia task"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showResolverHelp && (
        <TextResolverHelpModal onClose={() => setShowResolverHelp(false)} />
      )}
    </div>
  );
}

export default SchedulerPage;
