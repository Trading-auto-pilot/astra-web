import { useEffect, useMemo, useState } from "react";
import AppIcon from "../atoms/icon/AppIcon";
import SectionHeader from "../molecules/content/SectionHeader";
import {
  deleteSchedulerJob,
  fetchSchedulerJobs,
  createSchedulerJob,
  reloadSchedulerJobs,
  updateSchedulerJob,
  type SchedulerJob,
} from "../../api/scheduler";

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
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
        time: "",
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
      setSaveError("Body non e un JSON valido.");
      setSaving(false);
      return;
    }

    const rules = editingRules
      .filter((rule) => !rule._markedForDelete)
      .map((rule) => ({
        ruleType: rule.ruleType || "daily",
        daysOfWeek: parseList(rule.daysOfWeekText),
        daysOfMonth: parseNumberList(rule.daysOfMonthText),
        time: rule.time || null,
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
        time: rule.time || null,
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
              URL
              <input
                type="text"
                value={createDraft.url ?? ""}
                onChange={(e) => updateCreateField("url", e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
              />
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
                      >
                        <AppIcon icon="mdi:clipboard-text-outline" className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-emerald-700 shadow-sm transition hover:border-slate-300 hover:text-emerald-800"
                        aria-label="Run now"
                        title="Run now"
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
              URL
              <input
                type="text"
                value={editingDraft.url ?? ""}
                onChange={(e) => updateDraftField("url", e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
              />
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
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600 md:col-span-2">
              Headers (JSON)
              <textarea
                value={headersText}
                onChange={(e) => setHeadersText(e.target.value)}
                className="min-h-[70px] rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600 md:col-span-2">
              Body (JSON)
              <textarea
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                className="min-h-[70px] rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
              />
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
    </div>
  );
}

export default SchedulerPage;
