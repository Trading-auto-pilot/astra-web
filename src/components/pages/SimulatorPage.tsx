import DashboardLayout from "../../layouts/DashboardLayout";
import SimEngineMicroservicePage from "./microservices/SimEngineMicroservicePage";

type Props = {
  userName?: string;
  navEntries?: any[];
};

export default function SimulatorPage({ userName, navEntries }: Props) {
  return (
    <DashboardLayout userName={userName} navEntries={navEntries}>
      <SimEngineMicroservicePage initialTab="simulation" lockToTab="simulation" />
    </DashboardLayout>
  );
}
