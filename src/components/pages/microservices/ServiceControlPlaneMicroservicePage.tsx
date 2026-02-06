import MicroserviceGeneralTab from "../../molecules/microservice/MicroserviceGeneralTab";

// Tipo per le informazioni di release del microservizio
type ReleaseInfo = {
  version?: string | null;
  lastUpdate?: string | null;
  microservice?: string | null;
  note?: string[] | null;
};

// Props ricevute dal componente padre (AdminMicroserviceDetailPage)
type Props = {
  onReleaseChange?: (rel: ReleaseInfo | null) => void; // Callback quando cambiano le info di release
  onHealthChange?: (health: Record<string, any> | null) => void; // Callback quando cambia lo stato di health
  onOpenReleaseModal?: () => void; // Callback per aprire il modale con le note di release
};

/**
 * Componente per la gestione della pagina del microservizio Service Control Plane
 *
 * Questo componente gestisce solo il tab "General Settings" con le impostazioni comuni:
 * - DB Logger, Log Level
 * - Communication Channels
 * - Logs
 */
export default function ServiceControlPlaneMicroservicePage({
  onReleaseChange,
  onHealthChange,
  onOpenReleaseModal,
}: Props) {
  return (
    <MicroserviceGeneralTab
      microservice="servicecontrolplane"
      onReleaseChange={onReleaseChange}
      onHealthChange={onHealthChange}
      onOpenReleaseModal={onOpenReleaseModal}
    />
  );
}
