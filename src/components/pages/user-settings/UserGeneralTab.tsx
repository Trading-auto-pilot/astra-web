import { FormEvent, useEffect, useMemo, useState } from "react";
import { env } from "../../../config/env";

export default function UserGeneralTab() {
  const [username, setUsername] = useState("");
  const [lastLogin, setLastLogin] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Solo UI: qui andrebbe chiamata l'API di update profilo.
    setMessage("Funzione di salvataggio da collegare alle API.");
  };

  const token = useMemo(
    () => (typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null),
    []
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${env.apiBaseUrl}/auth/admin/me`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await res.json().catch(() => ({}));
        const user = data?.user || {};
        setUsername(user.username || "");
        setEmail(user.email || "");
        setLastLogin(user.last_login_at || user.lastLoginAt || null);
      } catch (err) {
        // best-effort: lasciare i campi vuoti in caso di errore
      }
    };
    fetchProfile();
  }, [token]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4 text-sm text-slate-700">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-slate-500">Username</div>
          <div className="text-lg font-semibold text-slate-900">{username || "-"}</div>
        </div>
        {lastLogin && (
          <div className="text-xs text-slate-500">
            Last login: <span className="font-semibold text-slate-700">{lastLogin}</span>
          </div>
        )}
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-600">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="nome@dominio.com"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-600">Nuova password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-600">Conferma password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-600">Immagine profilo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files?.[0] || null)}
            className="w-full text-sm text-slate-600"
          />
          {avatar && <p className="text-xs text-slate-500">Selezionato: {avatar.name}</p>}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
          >
            Salva modifiche
          </button>
        </div>
      </form>

      {message && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">{message}</div>
      )}
    </div>
  );
}
