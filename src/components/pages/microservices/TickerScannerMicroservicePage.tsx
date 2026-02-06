import { useState } from "react";
import MicroserviceGeneralTab from "../../molecules/microservice/MicroserviceGeneralTab";
import TickerScannerAdminPage from "../TickerScannerAdminPage";

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
 * Componente per la gestione della pagina del microservizio TickerScanner
 *
 * Questo componente gestisce:
 * - Tab "General Settings": impostazioni comuni a tutti i microservizi (DB Logger, Log Level, Communication Channels, Logs)
 * - Tab "Specific": funzionalità specifiche di TickerScanner (job scanner, history, ecc.)
 */
export default function TickerScannerMicroservicePage({
  onReleaseChange,
  onHealthChange,
  onOpenReleaseModal,
}: Props) {
  // Stato locale per gestire il tab attivo
  const [activeTab, setActiveTab] = useState<"general" | "specific">("general");

  return (
    <div>
      {/* BARRA DEI TAB */}
      <div className="flex gap-6 border-b border-slate-200">
        {/* Tab General Settings */}
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "general" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
          }`}
          onClick={() => setActiveTab("general")}
        >
          General Settings
        </button>

        {/* Tab Specific (funzionalità specifiche di TickerScanner) */}
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "specific" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
          }`}
          onClick={() => setActiveTab("specific")}
        >
          Specific
        </button>
      </div>

      {/* CONTENUTO DEI TAB */}

      {/* Tab General: Usa il componente condiviso MicroserviceGeneralTab */}
      {activeTab === "general" && (
        <MicroserviceGeneralTab
          microservice="tickerscanner" // Nome del microservizio per costruire le URL API corrette
          onReleaseChange={onReleaseChange} // Passa il callback al componente figlio
          onHealthChange={onHealthChange} // Passa il callback al componente figlio
          onOpenReleaseModal={onOpenReleaseModal} // Passa il callback al componente figlio
        />
      )}

      {/* Tab Specific: Usa il componente esistente TickerScannerAdminPage */}
      {activeTab === "specific" && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-white px-3 py-3 text-[11px] text-slate-700">
          {/*
            TickerScannerAdminPage contiene tutta la logica specifica:
            - Gestione job scanner
            - Visualizzazione history
            - Configurazioni specifiche del ticker scanner
          */}
          <TickerScannerAdminPage />
        </div>
      )}
    </div>
  );
}
