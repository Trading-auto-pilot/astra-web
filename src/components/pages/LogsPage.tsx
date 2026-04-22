import MicroserviceLogsCard from "../molecules/microservice/MicroserviceLogsCard";
import SectionHeader from "../molecules/content/SectionHeader";

export default function LogsPage() {
  return (
    <div className="flex flex-1 min-h-0 flex-col">
      <SectionHeader
        title="System Logs"
        subTitle="View and filter logs from all microservices"
      />
      <div className="mt-4 flex-1 min-h-0 flex flex-col">
        <MicroserviceLogsCard
          limit={100}
          fillHeight={true}
        />
      </div>
    </div>
  );
}
