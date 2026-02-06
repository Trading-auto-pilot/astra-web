import { useCallback, useState } from "react";
import MicroserviceGeneralTab from "../../molecules/microservice/MicroserviceGeneralTab";
import { env } from "../../../config/env";

// Tipo per le informazioni di release del microservizio
type ReleaseInfo = {
  version?: string | null;
  lastUpdate?: string | null;
  microservice?: string | null;
  note?: string[] | null;
};

type Status = "idle" | "loading" | "error";

// Props ricevute dal componente padre (AdminMicroserviceDetailPage)
type Props = {
  onReleaseChange?: (rel: ReleaseInfo | null) => void;
  onHealthChange?: (health: Record<string, any> | null) => void;
  onOpenReleaseModal?: () => void;
};

/**
 * Componente per la gestione della pagina del microservizio AlertingService
 *
 * Questo componente gestisce:
 * - Tab "General Settings": impostazioni comuni (DB Logger, Log Level, Communication Channels, Logs)
 * - Tab "Message": invio di messaggi WhatsApp di test
 * - Tab "Email": invio di email di test
 */
export default function AlertingServiceMicroservicePage({
  onReleaseChange,
  onHealthChange,
  onOpenReleaseModal,
}: Props) {
  // Gestione tab attivo
  const [activeTab, setActiveTab] = useState<"general" | "message" | "email">("general");

  // Stato per il tab Message (WhatsApp)
  const [messageText, setMessageText] = useState("");
  const [messageStatus, setMessageStatus] = useState<Status>("idle");
  const [messageError, setMessageError] = useState<string | null>(null);
  const [messageResult, setMessageResult] = useState<Record<string, any> | null>(null);

  // Stato per il tab Email
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailStatus, setEmailStatus] = useState<Status>("idle");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailResult, setEmailResult] = useState<Record<string, any> | null>(null);

  /**
   * Invia un messaggio WhatsApp di test tramite l'endpoint /alertingservice/whatsapp/send
   */
  const handleSendTestMessage = useCallback(async () => {
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    setMessageStatus("loading");
    setMessageError(null);
    setMessageResult(null);
    try {
      const res = await fetch(`${env.apiBaseUrl}/alertingservice/whatsapp/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ body: messageText.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || data?.message || "Errore invio messaggio");
      }
      setMessageResult(data);
      setMessageStatus("idle");
    } catch (err: any) {
      setMessageStatus("error");
      setMessageError(err?.message || "Errore invio messaggio");
    }
  }, [messageText]);

  /**
   * Invia una email di test tramite l'endpoint /alertingservice/email/send
   */
  const handleSendTestEmail = useCallback(async () => {
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    setEmailStatus("loading");
    setEmailError(null);
    setEmailResult(null);
    try {
      const res = await fetch(`${env.apiBaseUrl}/alertingservice/email/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          to: emailTo.trim(),
          subject: emailSubject.trim(),
          body: emailBody.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || data?.message || "Errore invio email");
      }
      setEmailResult(data);
      setEmailStatus("idle");
    } catch (err: any) {
      setEmailStatus("error");
      setEmailError(err?.message || "Errore invio email");
    }
  }, [emailTo, emailSubject, emailBody]);

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

        {/* Tab Message (WhatsApp test) */}
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "message" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
          }`}
          onClick={() => setActiveTab("message")}
        >
          Message
        </button>

        {/* Tab Email (Email test) */}
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "email" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
          }`}
          onClick={() => setActiveTab("email")}
        >
          Email
        </button>
      </div>

      {/* CONTENUTO DEI TAB */}

      {/* Tab General: Usa il componente condiviso */}
      {activeTab === "general" && (
        <MicroserviceGeneralTab
          microservice="alertingservice"
          onReleaseChange={onReleaseChange}
          onHealthChange={onHealthChange}
          onOpenReleaseModal={onOpenReleaseModal}
        />
      )}

      {/* Tab Message: Form per inviare messaggio WhatsApp di test */}
      {activeTab === "message" && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">Message test</div>
          <div className="mt-1 text-[11px] text-slate-500">
            Invia un messaggio WhatsApp di test tramite alertingservice.
          </div>
          <div className="mt-3">
            <label className="text-[11px] font-semibold text-slate-700">
              Messaggio
              <textarea
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-700"
                rows={4}
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                placeholder="Scrivi il messaggio..."
              />
            </label>
          </div>
          {messageError && <div className="mt-2 text-[11px] text-rose-600">{messageError}</div>}
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              onClick={handleSendTestMessage}
              disabled={!messageText.trim() || messageStatus === "loading"}
            >
              {messageStatus === "loading" ? "Invio..." : "Send"}
            </button>
            {messageStatus === "idle" && messageText.trim() && (
              <span className="text-[11px] text-emerald-600">Pronto</span>
            )}
          </div>
          {/* Visualizza la risposta dall'API */}
          {messageResult && (
            <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-[11px] text-emerald-700">
              <div className="text-[11px] font-semibold text-emerald-800">Risposta</div>
              <div className="mt-1 space-y-1">
                {Object.entries(messageResult).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-2">
                    <span className="w-28 shrink-0 font-semibold text-emerald-800">{key}</span>
                    <span className="break-all text-emerald-700">
                      {typeof value === "string" || typeof value === "number"
                        ? String(value)
                        : JSON.stringify(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Email: Form per inviare email di test */}
      {activeTab === "email" && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">Email test</div>
          <div className="mt-1 text-[11px] text-slate-500">Invia una email di test tramite alertingservice.</div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <label className="text-[11px] font-semibold text-slate-700">
              To
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-700"
                value={emailTo}
                onChange={(event) => setEmailTo(event.target.value)}
                placeholder="email@example.com"
              />
            </label>
            <label className="text-[11px] font-semibold text-slate-700">
              Subject
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-700"
                value={emailSubject}
                onChange={(event) => setEmailSubject(event.target.value)}
                placeholder="Oggetto"
              />
            </label>
          </div>
          <div className="mt-3">
            <label className="text-[11px] font-semibold text-slate-700">
              Text
              <textarea
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-700"
                rows={4}
                value={emailBody}
                onChange={(event) => setEmailBody(event.target.value)}
                placeholder="Scrivi il testo..."
              />
            </label>
          </div>
          {emailError && <div className="mt-2 text-[11px] text-rose-600">{emailError}</div>}
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              onClick={handleSendTestEmail}
              disabled={
                !emailTo.trim() || !emailSubject.trim() || !emailBody.trim() || emailStatus === "loading"
              }
            >
              {emailStatus === "loading" ? "Invio..." : "Send"}
            </button>
          </div>
          {/* Visualizza la risposta dall'API */}
          {emailResult && (
            <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-[11px] text-emerald-700">
              <div className="text-[11px] font-semibold text-emerald-800">Risposta</div>
              <div className="mt-1 space-y-1">
                {Object.entries(emailResult).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-2">
                    <span className="w-28 shrink-0 font-semibold text-emerald-800">{key}</span>
                    <span className="break-all text-emerald-700">
                      {typeof value === "string" || typeof value === "number"
                        ? String(value)
                        : JSON.stringify(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
