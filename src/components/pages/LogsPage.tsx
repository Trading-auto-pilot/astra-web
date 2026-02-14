import MicroserviceLogsCard from "../molecules/microservice/MicroserviceLogsCard";
import SectionHeader from "../molecules/content/SectionHeader";

export default function LogsPage() {
  return (
    <div className="flex h-full flex-col">
      <SectionHeader
        title="System Logs"
        subTitle="View and filter logs from all microservices"
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
