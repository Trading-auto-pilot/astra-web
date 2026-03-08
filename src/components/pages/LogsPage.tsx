import MicroserviceLogsCard from "../molecules/microservice/MicroserviceLogsCard";
import SectionHeader from "../molecules/content/SectionHeader";
import AppIcon from "../atoms/icon/AppIcon";
import { env } from "../../config/env";

export default function LogsPage() {
  const logsHelpUrl = `${env.helpBase}/docs/utente/navigazione-menu-laterale-logs`;

  return (
    <div className="flex h-full flex-col">
      <SectionHeader
        title="System Logs"
        subTitle="View and filter logs from all microservices"
        actionComponent={
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            title="Apri guida Logs"
            aria-label="Apri guida Logs"
            onClick={() => window.open(logsHelpUrl, "_blank", "noopener,noreferrer")}
          >
            <AppIcon icon="mdi:help-circle-outline" className="h-4 w-4" />
          </button>
        }
      />
      <div className="mt-4 flex-1">
        <MicroserviceLogsCard
          limit={100}
          fillHeight={true}
          className="h-full"
        />
      </div>
    </div>
  );
}
