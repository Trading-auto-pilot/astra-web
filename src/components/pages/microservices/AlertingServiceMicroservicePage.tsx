import { useCallback, useEffect, useMemo, useState } from "react";
import AppIcon from "../../atoms/icon/AppIcon";
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
type RuleStatus = "idle" | "loading" | "error";

// Props ricevute dal componente padre (AdminMicroserviceDetailPage)
type Props = {
  onReleaseChange?: (rel: ReleaseInfo | null) => void;
  onHealthChange?: (health: Record<string, any> | null) => void;
  onOpenReleaseModal?: () => void;
};

type AlertingRule = {
  id: number;
  name?: string | null;
  enabled?: number | boolean | null;
  match_json?: Record<string, any> | null;
  actions_json?: Record<string, any> | null;
  created_at?: string | null;
};

type AlertingDelivery = {
  id: number;
  rule_id: number;
  status?: string | null;
  created_at?: string | null;
};

/**
 * Componente per la gestione della pagina del microservizio AlertingService
 *
 * Questo componente gestisce:
 * - Tab "General Settings": impostazioni comuni (DB Logger, Log Level, Communication Channels, Logs)
 * - Tab "Message": invio di messaggi WhatsApp di test
 * - Tab "Email": invio di email di test
 * - Tab "Rule Engine": gestione regole e reload
 */
export default function AlertingServiceMicroservicePage({
  onReleaseChange,
  onHealthChange,
  onOpenReleaseModal,
}: Props) {
  // Gestione tab attivo
  const [activeTab, setActiveTab] = useState<"general" | "message" | "email" | "rules">("general");

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

  // Stato per Rule Engine
  const [rules, setRules] = useState<AlertingRule[]>([]);
  const [rulesStatus, setRulesStatus] = useState<RuleStatus>("idle");
  const [rulesError, setRulesError] = useState<string | null>(null);
  const [deliveriesByRule, setDeliveriesByRule] = useState<Record<number, AlertingDelivery>>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertingRule | null>(null);
  const [deleteRule, setDeleteRule] = useState<AlertingRule | null>(null);
  const [newRuleName, setNewRuleName] = useState("");
  const [newRuleEnabled, setNewRuleEnabled] = useState(true);
  const [selectedLevels, setSelectedLevels] = useState<string[]>(["error"]);
  const [selectedService, setSelectedService] = useState<string>("any");
  const [messageGrep, setMessageGrep] = useState("");
  const [channelEmail, setChannelEmail] = useState(false);
  const [channelWhatsapp, setChannelWhatsapp] = useState(true);
  const [emailToValue, setEmailToValue] = useState("");
  const [emailSubjectValue, setEmailSubjectValue] = useState("");
  const [templateText, setTemplateText] = useState("Alert: {{message}}");

  const levelOptions = ["trace", "debug", "info", "warning", "error"];
  const serviceOptions = [
    "any",
    "alertingservice",
    "authservice",
    "cachemanager",
    "decision-engine",
    "dbmanager",
    "ibkr-bridge",
    "ibkr-keepalive",
    "market-data-service",
    "rediswsbridge",
    "scheduler",
    "servicecontrolplane",
    "tickerscanner",
  ];

  const token = useMemo(
    () => (typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null),
    []
  );

  const fetchRules = useCallback(async () => {
    setRulesStatus("loading");
    setRulesError(null);
    try {
      const res = await fetch(`${env.apiBaseUrl}/alertingservice/alerting-rules`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || data?.message || "Errore caricamento regole");
      }
      setRules(Array.isArray(data?.items) ? data.items : []);
      setRulesStatus("idle");
    } catch (err: any) {
      setRulesStatus("error");
      setRulesError(err?.message || "Errore caricamento regole");
    }
  }, [token]);

  const fetchDeliveries = useCallback(async () => {
    try {
      const res = await fetch(`${env.apiBaseUrl}/alertingservice/alerting-deliveries`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || data?.message || "Errore lettura deliveries");
      }
      const items: AlertingDelivery[] = Array.isArray(data?.items) ? data.items : [];
      const map: Record<number, AlertingDelivery> = {};
      for (const delivery of items) {
        if (!delivery?.rule_id) continue;
        const current = map[delivery.rule_id];
        if (!current) {
          map[delivery.rule_id] = delivery;
          continue;
        }
        const currTime = new Date(current.created_at || 0).getTime();
        const nextTime = new Date(delivery.created_at || 0).getTime();
        if (nextTime > currTime) {
          map[delivery.rule_id] = delivery;
        }
      }
      setDeliveriesByRule(map);
    } catch {
      // ignore
    }
  }, [token]);

  const handleReloadRules = useCallback(async () => {
    setRulesStatus("loading");
    setRulesError(null);
    try {
      const res = await fetch(`${env.apiBaseUrl}/alertingservice/alerting/rules/reload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || data?.message || "Errore reload regole");
      }
      await fetchRules();
      await fetchDeliveries();
    } catch (err: any) {
      setRulesStatus("error");
      setRulesError(err?.message || "Errore reload regole");
    }
  }, [fetchRules, fetchDeliveries, token]);

  const handleSaveRule = useCallback(async () => {
    setRulesStatus("loading");
    setRulesError(null);
    try {
      const matchJson = {
        levels: selectedLevels,
        services: selectedService === "any" ? [] : [selectedService],
        message_grep: messageGrep.trim(),
      };
      const channels = [
        ...(channelWhatsapp ? ["whatsapp"] : []),
        ...(channelEmail ? ["email"] : []),
      ];
      const actionsJson = {
        channels,
        template: templateText.trim(),
        to: emailToValue.trim(),
        subject: emailSubjectValue.trim(),
      };
      const payload = {
        name: newRuleName.trim(),
        enabled: newRuleEnabled ? 1 : 0,
        match_json: matchJson,
        actions_json: actionsJson,
      };
      const isEditing = Boolean(editingRule?.id);
      const res = await fetch(
        `${env.apiBaseUrl}/alertingservice/alerting-rules${isEditing ? `/${editingRule?.id}` : ""}`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || data?.message || "Errore salvataggio regola");
      }
      setShowCreateModal(false);
      setEditingRule(null);
      setNewRuleName("");
      await handleReloadRules();
    } catch (err: any) {
      setRulesStatus("error");
      setRulesError(err?.message || "Errore salvataggio regola");
    }
  }, [
    handleReloadRules,
    newRuleEnabled,
    newRuleName,
    selectedLevels,
    selectedService,
    messageGrep,
    channelEmail,
    channelWhatsapp,
    templateText,
    emailToValue,
    emailSubjectValue,
    token,
    editingRule,
  ]);

  const handleDeleteRule = useCallback(async () => {
    if (!deleteRule?.id) return;
    setRulesStatus("loading");
    setRulesError(null);
    try {
      const res = await fetch(
        `${env.apiBaseUrl}/alertingservice/alerting-rules/${deleteRule.id}`,
        {
          method: "DELETE",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || data?.message || "Errore cancellazione regola");
      }
      setDeleteRule(null);
      await handleReloadRules();
    } catch (err: any) {
      setRulesStatus("error");
      setRulesError(err?.message || "Errore cancellazione regola");
    }
  }, [deleteRule, handleReloadRules, token]);

  const openCreateModal = useCallback(() => {
    setEditingRule(null);
    setNewRuleName("");
    setNewRuleEnabled(true);
    setSelectedLevels(["error"]);
    setSelectedService("any");
    setMessageGrep("");
    setChannelEmail(false);
    setChannelWhatsapp(true);
    setEmailToValue("");
    setEmailSubjectValue("");
    setTemplateText("Alert: {{message}}");
    setShowCreateModal(true);
  }, []);

  const openEditModal = useCallback((rule: AlertingRule) => {
    const match = rule.match_json || {};
    const actions = rule.actions_json || {};
    const levels = Array.isArray(match.levels) && match.levels.length ? match.levels : ["error"];
    const services = Array.isArray(match.services) && match.services.length ? match.services : [];
    const channels = Array.isArray(actions.channels) ? actions.channels : [];

    setEditingRule(rule);
    setNewRuleName(rule.name || "");
    setNewRuleEnabled(Boolean(rule.enabled));
    setSelectedLevels(levels);
    setSelectedService(services[0] || "any");
    setMessageGrep(match.message_grep || "");
    setChannelEmail(channels.includes("email"));
    setChannelWhatsapp(channels.includes("whatsapp"));
    setEmailToValue(actions.to || "");
    setEmailSubjectValue(actions.subject || "");
    setTemplateText(actions.template || "Alert: {{message}}");
    setShowCreateModal(true);
  }, []);

  const formatDateShort = (value?: string | null) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDeliveryStatusTone = (status?: string | null) => {
    const normalized = (status || "").toLowerCase();
    if (normalized === "sent" || normalized === "ok" || normalized === "success") {
      return { dot: "bg-emerald-500", label: "Sent" };
    }
    if (normalized === "skipped" || normalized === "suppressed" || normalized === "throttled") {
      return { dot: "bg-amber-500", label: "Skipped" };
    }
    if (normalized === "failed" || normalized === "error") {
      return { dot: "bg-rose-500", label: "Failed" };
    }
    return { dot: "bg-slate-300", label: "N/A" };
  };

  useEffect(() => {
    if (activeTab === "rules") {
      fetchRules();
      fetchDeliveries();
    }
  }, [activeTab, fetchRules, fetchDeliveries]);

  /**
   * Invia un messaggio WhatsApp di test tramite l'endpoint /alertingservice/whatsapp/send
   */
  const handleSendTestMessage = useCallback(async () => {
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
    <div className="flex flex-1 min-h-0 flex-col">
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

        {/* Tab Rule Engine */}
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "rules" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
          }`}
          onClick={() => setActiveTab("rules")}
        >
          Rule Engine
        </button>
      </div>

      {/* CONTENUTO DEI TAB */}

      {/* Tab General: Usa il componente condiviso */}
      {activeTab === "general" && (
        <div className="flex-1 min-h-0 flex flex-col">
          <MicroserviceGeneralTab
            microservice="alertingservice"
            onReleaseChange={onReleaseChange}
            onHealthChange={onHealthChange}
            onOpenReleaseModal={onOpenReleaseModal}
          />
        </div>
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

      {/* Tab Rule Engine: lista regole e azioni */}
      {activeTab === "rules" && (
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-sm font-semibold text-slate-900">Rule Engine</div>
              <div className="text-[11px] text-slate-500">
                Gestione regole e reload dell&apos;engine.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                onClick={openCreateModal}
              >
                Nuova regola
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                onClick={handleReloadRules}
                disabled={rulesStatus === "loading"}
              >
                {rulesStatus === "loading" ? "Reload..." : "Ricarica regole"}
              </button>
            </div>
          </div>

          {rulesError && <div className="text-[11px] text-rose-600">{rulesError}</div>}

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-4 py-2 text-[11px] font-semibold text-slate-600">
              Regole ({rules.length})
            </div>
            <div className="max-h-[520px] overflow-y-auto">
              <table className="w-full text-left text-[11px] text-slate-600">
                <thead className="bg-slate-50 text-[10px] uppercase text-slate-400">
                  <tr>
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Nome</th>
                    <th className="px-3 py-2">Enabled</th>
                    <th className="px-3 py-2">Levels</th>
                    <th className="px-3 py-2">Services</th>
                    <th className="px-3 py-2">Channels</th>
                    <th className="px-3 py-2">Grep</th>
                    <th className="px-3 py-2">Updated</th>
                    <th className="px-3 py-2">Last run</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.map((rule) => {
                    const match = rule.match_json || {};
                    const actions = rule.actions_json || {};
                    const levels = Array.isArray(match.levels) ? match.levels.join(", ") : "-";
                    const services = Array.isArray(match.services) ? match.services.join(", ") : "-";
                    const channels = Array.isArray(actions.channels) ? actions.channels.join(", ") : "-";
                    const lastDelivery = deliveriesByRule[rule.id];
                    const deliveryTone = getDeliveryStatusTone(lastDelivery?.status);
                    return (
                      <tr key={rule.id} className="border-t border-slate-100">
                        <td className="px-3 py-2 text-slate-500">{rule.id}</td>
                        <td className="px-3 py-2 text-slate-800">{rule.name || "-"}</td>
                        <td className="px-3 py-2">
                          {rule.enabled ? (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                              ON
                            </span>
                          ) : (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                              OFF
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2">{levels || "-"}</td>
                        <td className="px-3 py-2">{services || "-"}</td>
                        <td className="px-3 py-2">{channels || "-"}</td>
                        <td className="px-3 py-2">{match.message_grep || "-"}</td>
                        <td className="px-3 py-2">{formatDateShort(rule.created_at)}</td>
                        <td className="px-3 py-2">
                          {lastDelivery ? (
                            <div className="flex items-center gap-2">
                              <span className={`h-2 w-2 rounded-full ${deliveryTone.dot}`} />
                              <span className="text-[10px] font-semibold text-slate-600">
                                {deliveryTone.label}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {formatDateShort(lastDelivery.created_at)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              className="rounded-md border border-slate-200 p-1 text-slate-500 hover:bg-slate-50"
                              onClick={() => openEditModal(rule)}
                            >
                              <AppIcon icon="mdi:pencil-outline" className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              className="rounded-md border border-rose-200 p-1 text-rose-500 hover:bg-rose-50"
                              onClick={() => setDeleteRule(rule)}
                            >
                              <AppIcon icon="mdi:trash-can-outline" className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {rules.length === 0 && rulesStatus !== "loading" && (
                    <tr>
                      <td className="px-3 py-4 text-center text-[11px] text-slate-400" colSpan={10}>
                        Nessuna regola trovata.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-500">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Sent
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> Skipped
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500" /> Failed
            </span>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex w-full max-w-2xl flex-col rounded-xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-slate-900">
                  {editingRule ? "Modifica regola" : "Nuova regola"}
                </div>
                <div className="text-[11px] text-slate-500">Configura match e azioni del rule engine.</div>
              </div>
              <button
                type="button"
                className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => setShowCreateModal(false)}
              >
                Close
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-[11px] font-semibold text-slate-700">
                Nome regola
                <input
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-700"
                  value={newRuleName}
                  onChange={(event) => setNewRuleName(event.target.value)}
                  placeholder="Es. Errors cachemanager"
                />
              </label>
              <label className="text-[11px] font-semibold text-slate-700">
                Enabled
                <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-600">
                  <input
                    type="checkbox"
                    checked={newRuleEnabled}
                    onChange={(event) => setNewRuleEnabled(event.target.checked)}
                  />
                  Attiva la regola
                </div>
              </label>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-[11px] font-semibold text-slate-700">Match</div>
                <div>
                  <div className="text-[10px] font-semibold text-slate-500">Levels</div>
                  <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-slate-600">
                    {levelOptions.map((lvl) => (
                      <label key={lvl} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedLevels.includes(lvl)}
                          onChange={(event) => {
                            setSelectedLevels((prev) =>
                              event.target.checked
                                ? Array.from(new Set([...prev, lvl]))
                                : prev.filter((item) => item !== lvl)
                            );
                          }}
                        />
                        {lvl}
                      </label>
                    ))}
                  </div>
                </div>
                <label className="text-[10px] font-semibold text-slate-500">
                  Service
                  <select
                    className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-700"
                    value={selectedService}
                    onChange={(event) => setSelectedService(event.target.value)}
                  >
                    {serviceOptions.map((service) => (
                      <option key={service} value={service}>
                        {service === "any" ? "Qualsiasi" : service}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-[10px] font-semibold text-slate-500">
                  Message (fuzzy search)
                  <input
                    className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-700"
                    value={messageGrep}
                    onChange={(event) => setMessageGrep(event.target.value)}
                    placeholder="Es. timeout, error, failed..."
                  />
                </label>
              </div>

              <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-[11px] font-semibold text-slate-700">Actions</div>
                <div>
                <div className="text-[10px] font-semibold text-slate-500">Channels</div>
                <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-slate-600">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                        checked={channelWhatsapp}
                        onChange={(event) => setChannelWhatsapp(event.target.checked)}
                      />
                      Whatsapp
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={channelEmail}
                        onChange={(event) => setChannelEmail(event.target.checked)}
                      />
                      Email
                    </label>
                  </div>
                </div>
                <label className="text-[10px] font-semibold text-slate-500">
                  Email To
                  <input
                    className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-700"
                    required={channelEmail}
                    value={emailToValue}
                    onChange={(event) => setEmailToValue(event.target.value)}
                    placeholder="destinatario email"
                  />
                </label>
                <label className="text-[10px] font-semibold text-slate-500">
                  Email Subject
                  <input
                    className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-700"
                    required={channelEmail}
                    value={emailSubjectValue}
                    onChange={(event) => setEmailSubjectValue(event.target.value)}
                    placeholder="Oggetto alert"
                  />
                </label>
                <label className="text-[10px] font-semibold text-slate-500">
                  Template
                  <textarea
                    className="mt-1 h-24 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-700"
                    value={templateText}
                    onChange={(event) => setTemplateText(event.target.value)}
                    placeholder="Alert: {{message}}"
                  />
                </label>
                <div className="rounded-md border border-slate-200 bg-white px-2 py-2 text-[10px] text-slate-600">
                  <div className="font-semibold text-slate-700">Template tags</div>
                  <div className="mt-1 grid gap-x-3 gap-y-1 sm:grid-cols-2">
                    <span>
                      <span className="font-semibold text-slate-700">{"{{message}}"}</span> messaggio
                    </span>
                    <span>
                      <span className="font-semibold text-slate-700">{"{{time}}"}</span> timestamp
                    </span>
                    <span>
                      <span className="font-semibold text-slate-700">{"{{id}}"}</span> id log (se presente)
                    </span>
                    <span>
                      <span className="font-semibold text-slate-700">{"{{level}}"}</span> livello
                    </span>
                    <span>
                      <span className="font-semibold text-slate-700">{"{{service}}"}</span> microservizio
                    </span>
                    <span>
                      <span className="font-semibold text-slate-700">{"{{module}}"}</span> modulo
                    </span>
                    <span>
                      <span className="font-semibold text-slate-700">{"{{function}}"}</span> funzione
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                className="rounded-md border border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                onClick={handleSaveRule}
                disabled={
                  !newRuleName.trim() ||
                  rulesStatus === "loading" ||
                  (channelEmail && (!emailToValue.trim() || !emailSubjectValue.trim())) ||
                  (!channelEmail && !channelWhatsapp)
                }
              >
                {rulesStatus === "loading"
                  ? "Salvataggio..."
                  : editingRule
                    ? "Salva modifiche"
                    : "Crea regola"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <div className="text-sm font-semibold text-slate-900">Conferma cancellazione</div>
            <div className="mt-2 text-[11px] text-slate-600">
              Vuoi eliminare la regola{" "}
              <span className="font-semibold">{deleteRule.name || deleteRule.id}</span>?
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                className="rounded-md border border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => setDeleteRule(null)}
              >
                Annulla
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-rose-600 px-3 py-2 text-[11px] font-semibold text-white hover:bg-rose-500 disabled:opacity-60"
                onClick={handleDeleteRule}
                disabled={rulesStatus === "loading"}
              >
                Elimina
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
