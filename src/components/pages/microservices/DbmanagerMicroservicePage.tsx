import MicroserviceGeneralTab from "../../molecules/microservice/MicroserviceGeneralTab";

type ReleaseInfo = {
  version?: string | null;
  lastUpdate?: string | null;
  microservice?: string | null;
  note?: string[] | null;
};

type Props = {
  onReleaseChange?: (rel: ReleaseInfo | null) => void;
  onHealthChange?: (health: Record<string, any> | null) => void;
  onOpenReleaseModal?: () => void;
};

/**
 * Componente per la gestione della pagina del microservizio DBManager
 *
 * Solo tab "General Settings".
 */
export default function DbmanagerMicroservicePage({
  onReleaseChange,
  onHealthChange,
  onOpenReleaseModal,
}: Props) {
  return (
    <MicroserviceGeneralTab
      microservice="dbmanager"
      onReleaseChange={onReleaseChange}
      onHealthChange={onHealthChange}
      onOpenReleaseModal={onOpenReleaseModal}
    />
  );
}
