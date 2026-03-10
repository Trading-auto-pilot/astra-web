import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchServiceFlags,
  updateServiceFlag,
  fetchContainers,
  doContainerAction,
  type ServiceFlag,
  type ContainerInfo,
} from "../../api/serviceFlags";
import SectionHeader from "../molecules/content/SectionHeader";
import BaseButton from "../atoms/base/buttons/BaseButton";
import AppIcon from "../atoms/icon/AppIcon";

type Status = "idle" | "loading" | "error";

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

function containerStateBadge(state: string) {
  if (state === "running") return { label: "RUNNING", cls: "bg-emerald-100 text-emerald-700" };
  if (state === "exited") return { label: "STOPPED", cls: "bg-rose-100 text-rose-700" };
  if (state === "restarting") return { label: "RESTARTING", cls: "bg-amber-100 text-amber-700" };
  if (state === "paused") return { label: "PAUSED", cls: "bg-slate-100 text-slate-500" };
  if (state === "dead") return { label: "DEAD", cls: "bg-rose-200 text-rose-800" };
  return { label: state.toUpperCase(), cls: "bg-slate-100 text-slate-500" };
}

function extractImageTag(image?: string) {
  if (!image) return null;
  const withoutDigest = image.split("@")[0] || image;
  const lastSlash = withoutDigest.lastIndexOf("/");
  const lastColon = withoutDigest.lastIndexOf(":");
  if (lastColon > lastSlash) {
    const tag = withoutDigest.slice(lastColon + 1).trim();
    return tag || null;
  }
  return null;
}

export default function AdminMicroservicePage() {
  const [rows, setRows] = useState<ServiceFlag[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [containers, setContainers] = useState<ContainerInfo[]>([]);
  const [containerActionLoading, setContainerActionLoading] = useState<Record<string, boolean>>({});

  const loadContainers = useCallback(async () => {
    try {
      const list = await fetchContainers();
      setContainers(list);
    } catch {
      // servicecontrolplane might not be running — fail silently
    }
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
    await loadContainers();
  }, [loadContainers]);

  useEffect(() => {
    load();
  }, [load]);

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

  const handleContainerAction = useCallback(
    async (containerName: string, action: "start" | "stop" | "restart") => {
      const key = `${containerName}:${action}`;
      setContainerActionLoading((p) => ({ ...p, [key]: true }));
      try {
        await doContainerAction(containerName, action);
        await loadContainers();
      } catch {
        // silent
      } finally {
        setContainerActionLoading((p) => ({ ...p, [key]: false }));
      }
    },
    [loadContainers]
  );

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) =>
      String(a.microservice || "").localeCompare(String(b.microservice || ""), undefined, {
        sensitivity: "base",
      })
    );
  }, [rows]);

  const containerByMicroservice = useMemo(() => {
    const map = new Map<string, ContainerInfo>();
    for (const row of sortedRows) {
      const match = containers.find((c) =>
        c.name.toLowerCase().includes(row.microservice.toLowerCase())
      );
      if (match) map.set(row.microservice, match);
    }
    return map;
  }, [sortedRows, containers]);

  const unmatchedContainers = useMemo(() => {
    const matched = new Set(containerByMicroservice.values());
    return containers
      .filter((c) => !matched.has(c))
      .sort((a, b) =>
        String(a.name || "").localeCompare(String(b.name || ""), undefined, {
          sensitivity: "base",
        })
      );
  }, [containers, containerByMicroservice]);

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Microservice Flags"
        subTitle="Stato abilitazione microservizi per ambiente"
        actionComponent={
          <BaseButton
            variant="outline"
            color="neutral"
            size="sm"
            startIcon={<AppIcon icon="mdi:refresh" />}
            onClick={load}
            disabled={status === "loading"}
          >
            Aggiorna
          </BaseButton>
        }
      />

      {status === "error" && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      {updateError && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          {updateError}
        </div>
      )}

      {status === "loading" && rows.length === 0 && (
        <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
          Caricamento...
        </div>
      )}

      {sortedRows.length === 0 && status !== "loading" && (
        <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
          Nessun flag configurato.
        </div>
      )}

      {sortedRows.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 font-semibold">Microservice</th>
                <th className="px-3 py-2 font-semibold">Enabled</th>
                <th className="px-3 py-2 font-semibold">Note</th>
                <th className="px-3 py-2 font-semibold">Updated</th>
                <th className="px-3 py-2 font-semibold">State</th>
                <th className="px-3 py-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-semibold text-slate-900">
                    <a
                      href={`#/admin/microservice/${encodeURIComponent(row.microservice)}`}
                      className="text-slate-900 underline-offset-2 hover:underline"
                    >
                      {row.microservice}
                    </a>
                    {(() => {
                      const c = containerByMicroservice.get(row.microservice);
                      const tag = extractImageTag(c?.image);
                      if (!tag) return null;
                      return <span className="ml-2 text-[11px] font-normal text-slate-400">v{tag}</span>;
                    })()}
                  </td>
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
                <td className="px-3 py-2">
                  {(() => {
                    const c = containerByMicroservice.get(row.microservice);
                    if (!c) return <span className="text-[11px] text-slate-400">-</span>;
                    const { label, cls } = containerStateBadge(c.state);
                    return (
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${cls}`}
                        title={c.status}
                      >
                        {label}
                      </span>
                    );
                  })()}
                </td>
                <td className="px-3 py-2">
                  {(() => {
                    const c = containerByMicroservice.get(row.microservice);
                    if (!c) return null;
                    const isRunning = c.state === "running";
                    return (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          title="Start"
                          disabled={isRunning || !!containerActionLoading[`${c.name}:start`]}
                          onClick={() => handleContainerAction(c.name, "start")}
                          className="rounded p-1 text-emerald-600 hover:bg-emerald-50 disabled:opacity-30"
                        >
                          <AppIcon icon="mdi:play" className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          title="Stop"
                          disabled={!isRunning || !!containerActionLoading[`${c.name}:stop`]}
                          onClick={() => handleContainerAction(c.name, "stop")}
                          className="rounded p-1 text-rose-600 hover:bg-rose-50 disabled:opacity-30"
                        >
                          <AppIcon icon="mdi:stop" className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          title="Restart"
                          disabled={!!containerActionLoading[`${c.name}:restart`]}
                          onClick={() => handleContainerAction(c.name, "restart")}
                          className="rounded p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                        >
                          <AppIcon icon="mdi:restart" className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })()}
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      )}

      {unmatchedContainers.length > 0 && (
        <>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Altri container (non in tabella flag)
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2 font-semibold">Nome</th>
                  <th className="px-3 py-2 font-semibold">Immagine</th>
                  <th className="px-3 py-2 font-semibold">State</th>
                  <th className="px-3 py-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {unmatchedContainers.map((c) => {
                  const { label, cls } = containerStateBadge(c.state);
                  const isRunning = c.state === "running";
                  return (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 font-semibold text-slate-900">
                        {c.name}
                        {extractImageTag(c.image) ? (
                          <span className="ml-2 text-[11px] font-normal text-slate-400">
                            v{extractImageTag(c.image)}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-3 py-2 text-slate-500 font-mono text-[11px]">{c.image}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${cls}`}
                          title={c.status}
                        >
                          {label}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            title="Start"
                            disabled={isRunning || !!containerActionLoading[`${c.name}:start`]}
                            onClick={() => handleContainerAction(c.name, "start")}
                            className="rounded p-1 text-emerald-600 hover:bg-emerald-50 disabled:opacity-30"
                          >
                            <AppIcon icon="mdi:play" className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            title="Stop"
                            disabled={!isRunning || !!containerActionLoading[`${c.name}:stop`]}
                            onClick={() => handleContainerAction(c.name, "stop")}
                            className="rounded p-1 text-rose-600 hover:bg-rose-50 disabled:opacity-30"
                          >
                            <AppIcon icon="mdi:stop" className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            title="Restart"
                            disabled={!!containerActionLoading[`${c.name}:restart`]}
                            onClick={() => handleContainerAction(c.name, "restart")}
                            className="rounded p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                          >
                            <AppIcon icon="mdi:restart" className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
