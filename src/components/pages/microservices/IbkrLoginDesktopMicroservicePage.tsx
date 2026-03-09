import { useEffect, useState } from "react";
import { env } from "../../../config/env";
import { http } from "../../../api/httpClient";
import AppIcon from "../../atoms/icon/AppIcon";
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

export default function IbkrLoginDesktopMicroservicePage({
  onReleaseChange,
  onHealthChange,
  onOpenReleaseModal,
}: Props) {
  const [activeTab, setActiveTab] = useState<"general" | "desktop">("general");

  // Credentials state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hasPassword, setHasPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{ ok?: boolean; error?: string } | null>(null);
  const [filling, setFilling] = useState(false);
  const [fillResult, setFillResult] = useState<{ ok?: boolean; error?: string } | null>(null);

  // In produzione: api.trading.expovin.it → trading.expovin.it
  // In locale: http://localhost:8080 (invariato)
  const vncBase = env.apiBaseUrl.replace("//api.", "//");
  const vncUrl = `${vncBase}/ibkr-login/vnc.html?autoconnect=1&path=ibkr-login/websockify`;

  useEffect(() => {
    if (activeTab !== "desktop") return;
    http.get<{ username: string; hasPassword: boolean }>("/ibkr-login-desktop/credentials")
      .then((d) => {
        setUsername(d.username || "");
        setHasPassword(!!d.hasPassword);
      })
      .catch(() => {});
  }, [activeTab]);

  const handleSave = async () => {
    setSaving(true);
    setSaveResult(null);
    try {
      const body: Record<string, string> = { username };
      if (password) body.password = password;
      await http.post("/ibkr-login-desktop/credentials", body);
      if (password) setHasPassword(true);
      setPassword("");
      setSaveResult({ ok: true });
    } catch (e: any) {
      setSaveResult({ error: e.message });
    } finally {
      setSaving(false);
    }
  };

  const handleFill = async () => {
    setFilling(true);
    setFillResult(null);
    try {
      const d = await http.post<{ ok: boolean; error?: string }>("/ibkr-login-desktop/credentials/fill");
      setFillResult(d.ok ? { ok: true } : { error: d.error || "Errore" });
    } catch (e: any) {
      setFillResult({ error: e.message });
    } finally {
      setFilling(false);
    }
  };

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      {/* BARRA DEI TAB */}
      <div className="flex gap-6 border-b border-slate-200">
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "general"
              ? "border-b-2 border-slate-900 text-slate-900"
              : "text-slate-500"
          }`}
          onClick={() => setActiveTab("general")}
        >
          General Settings
        </button>
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "desktop"
              ? "border-b-2 border-slate-900 text-slate-900"
              : "text-slate-500"
          }`}
          onClick={() => setActiveTab("desktop")}
        >
          Desktop Remoto
        </button>
      </div>

      {/* Tab General Settings */}
      {activeTab === "general" && (
        <div className="flex-1 min-h-0 flex flex-col">
          <MicroserviceGeneralTab
            microservice="ibkr-login-desktop"
            onReleaseChange={onReleaseChange}
            onHealthChange={onHealthChange}
            onOpenReleaseModal={onOpenReleaseModal}
          />
        </div>
      )}

      {/* Tab Desktop Remoto */}
      {activeTab === "desktop" && (
        <div className="flex flex-1 flex-col gap-6 p-6 overflow-y-auto">

          {/* Credenziali IBKR */}
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="mb-3 text-xs font-semibold text-slate-700">Credenziali IBKR</div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ibkr username"
                  className="rounded border border-slate-200 px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-slate-400"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500">
                  Password {hasPassword && <span className="text-emerald-600">(salvata)</span>}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={hasPassword ? "••••••••  (lascia vuoto per non cambiare)" : "password"}
                  className="rounded border border-slate-200 px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-slate-400"
                />
              </div>
              <button
                type="button"
                disabled={saving}
                onClick={handleSave}
                className="mt-1 self-start rounded bg-slate-800 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
              >
                {saving ? "Salvataggio..." : "Salva credenziali"}
              </button>
              {saveResult && (
                <div className={`text-[11px] font-medium ${saveResult.ok ? "text-emerald-600" : "text-rose-600"}`}>
                  {saveResult.ok ? "Credenziali salvate" : `Errore: ${saveResult.error}`}
                </div>
              )}
            </div>
          </div>

          {/* Azioni desktop */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <AppIcon icon="mdi:monitor-screenshot" className="h-10 w-10 text-slate-400" />
              <div className="text-sm font-semibold text-slate-800">IBKR Client Portal Login</div>
              <div className="max-w-xs text-xs text-slate-500">
                Desktop remoto con Chromium già puntato su{" "}
                <code className="font-mono text-slate-700">https://localhost:5000</code>.
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                disabled={filling}
                onClick={handleFill}
                className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
              >
                <AppIcon icon="mdi:form-textbox-password" className="h-4 w-4" />
                {filling ? "Compilazione..." : "Compila credenziali"}
              </button>

              <a
                href={vncUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-5 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
              >
                <AppIcon icon="mdi:remote-desktop" className="h-4 w-4" />
                Apri Desktop IBKR
              </a>
            </div>

            {fillResult && (
              <div className={`rounded-md px-4 py-2 text-[11px] font-medium ${fillResult.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                {fillResult.ok ? "Credenziali compilate nel browser" : `Errore: ${fillResult.error}`}
              </div>
            )}

            <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-[11px] text-slate-500 max-w-sm text-center">
              Il container condivide il namespace di rete con{" "}
              <code className="font-mono">ibkrgw-paper</code>, quindi{" "}
              <code className="font-mono">localhost:5000</code> risolve direttamente sul gateway.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
