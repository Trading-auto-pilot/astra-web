import BaseButton from "../../atoms/base/buttons/BaseButton";
import AppIcon from "../../atoms/icon/AppIcon";

type Status = "idle" | "loading" | "error";

type ReleaseInfo = {
  version?: string | null;
  lastUpdate?: string | null;
  microservice?: string | null;
  note?: string[] | null;
};

type Props = {
  microservice: string;
  dbLogger: boolean | null;
  dbLoggerStatus: Status;
  dbLoggerError: string | null;
  logLevel: string | null;
  logLevelStatus: Status;
  logLevelError: string | null;
  release: ReleaseInfo | null;
  onDbLoggerChange: (enabled: boolean) => Promise<void>;
  onLogLevelChange: (level: string) => Promise<void>;
  onOpenDbSettings: () => void;
  onOpenReleaseInfo: () => void;
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

export default function MicroserviceDbSettingsCard({
  microservice: _microservice,
  dbLogger,
  dbLoggerStatus,
  dbLoggerError,
  logLevel,
  logLevelStatus,
  logLevelError,
  release,
  onDbLoggerChange,
  onLogLevelChange,
  onOpenDbSettings,
  onOpenReleaseInfo,
}: Props) {

  return (
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
                        await onDbLoggerChange(!dbLogger);
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
                  <div className="mt-1 text-[11px] text-slate-500">Abilita o disabilita la scrittura dei log in DB.</div>
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
                        await onLogLevelChange(e.target.value);
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
              <tr>
                <td className="pr-3 font-semibold text-slate-600">Updated</td>
                <td className="py-1 whitespace-nowrap">{formatDateTime(release?.lastUpdate)}</td>
              </tr>
            </tbody>
          </table>
          {dbLoggerError && <div className="mt-2 text-[11px] text-amber-700">{dbLoggerError}</div>}
          {logLevelError && <div className="mt-2 text-[11px] text-amber-700">{logLevelError}</div>}
        </div>
        <div className="flex w-full flex-col gap-2 md:w-auto">
          <BaseButton
            variant="outline"
            color="neutral"
            size="sm"
            startIcon={<AppIcon icon="mdi:database-settings" />}
            onClick={onOpenDbSettings}
          >
            DB Settings
          </BaseButton>
          <BaseButton
            variant="outline"
            color="neutral"
            size="sm"
            startIcon={<AppIcon icon="mdi:information-outline" />}
            onClick={onOpenReleaseInfo}
            disabled={!release}
          >
            Release info
          </BaseButton>
        </div>
      </div>
    </div>
  );
}
