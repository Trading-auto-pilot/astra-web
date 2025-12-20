import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchServiceFlags, updateServiceFlag, type ServiceFlag } from "../../api/serviceFlags";
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

export default function AdminMicroservicePage() {
  const [rows, setRows] = useState<ServiceFlag[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

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

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      if (a.env === b.env) return a.microservice.localeCompare(b.microservice);
      return a.env.localeCompare(b.env);
    });
  }, [rows]);

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
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
