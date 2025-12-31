import type { FormEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { env } from "../../../config/env";

export default function UserGeneralTab() {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [lastLogin, setLastLogin] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pipes, setPipes] = useState<Array<{ id: number; name: string; description?: string; enabled?: boolean }>>([]);
  const [pipesLoading, setPipesLoading] = useState(false);
  const [pipeFormOpen, setPipeFormOpen] = useState(false);
  const [newPipeName, setNewPipeName] = useState("");
  const [newPipeDesc, setNewPipeDesc] = useState("");
  const [savingPipe, setSavingPipe] = useState(false);
  const [pipeError, setPipeError] = useState<string | null>(null);
  const [toggleId, setToggleId] = useState<number | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Solo UI: qui andrebbe chiamata l'API di update profilo.
    setMessage("Funzione di salvataggio da collegare alle API.");
  };

  const token = useMemo(
    () => (typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null),
    []
  );

  const fetchPipes = useCallback(
    async () => {
      try {
        setPipesLoading(true);
        const res = await fetch(`${env.apiBaseUrl}/tickerscanner/fundamentals/users/pipes`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await res.json().catch(() => ({}));
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        const normalized = list.map((p: any) => ({
          ...p,
          enabled: p?.enabled === true || p?.enabled === 1 || p?.enabled === "1",
        }));
        setPipes(normalized);
      } catch (err) {
        setPipes([]);
      } finally {
        setPipesLoading(false);
      }
    },
    [token]
  );

  const togglePipeEnabled = useCallback(
    async (pipeId: number, nextEnabled: boolean) => {
      if (!token) {
        setPipeError("Token o utente non disponibili.");
        return;
      }
      const target = pipes.find((p) => p.id === pipeId);
      if (!target || !target.name) {
        setPipeError("Impossibile aggiornare: pipe non trovata.");
        return;
      }
      setPipeError(null);
      setToggleId(pipeId);
      try {
        const res = await fetch(`${env.apiBaseUrl}/tickerscanner/fundamentals/users/pipes/${pipeId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: target.name || `Pipe ${pipeId}`,
            description: target.description ?? null,
            enabled: nextEnabled,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data?.ok === false) {
          throw new Error(data?.error || "Errore aggiornamento pipe");
        }
        // Aggiorna la lista locale e riallinea con il backend
        setPipes((prev) => prev.map((p) => (p.id === pipeId ? { ...p, enabled: nextEnabled } : p)));
        fetchPipes();
      } catch (err: any) {
        setPipeError(err?.message || "Errore aggiornamento pipe");
      } finally {
        setToggleId(null);
      }
    },
    [token, pipes, fetchPipes]
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
        if (user.id) setUserId(user.id);
        fetchPipes();
      } catch (err) {
        // best-effort: lasciare i campi vuoti in caso di errore
      }
    };
    fetchProfile();
  }, [token, fetchPipes]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4 text-sm text-slate-700">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-slate-500">Username</div>
            <div className="text-lg font-semibold text-slate-900">{username || "-"}</div>
            {userId && <div className="text-[11px] text-slate-500">User ID: {userId}</div>}
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
              <label className="block text-xs font-semibold text-slate-600">Immagine profilo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                className="w-full text-sm text-slate-600"
              />
              {avatar && <p className="text-xs text-slate-500">Selezionato: {avatar.name}</p>}
            </div>
            <div className="space-y-1" />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                const evt = new CustomEvent("open-change-password-modal");
                window.dispatchEvent(evt);
              }}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cambia password
            </button>
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

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4 text-sm text-slate-700">
        <div>
          <div className="text-lg font-semibold text-slate-900">Pipe</div>
          <div className="text-xs text-slate-500">
            Una pipe è un insieme di ticker che risponde a criteri (pesi, filtri, ordini, soglie). Qui definisci le pipe,
            negli altri tab definisci i parametri per ciascuna pipe.
          </div>
        </div>

        <div className="space-y-2">
          {pipesLoading && <div className="text-xs text-slate-500">Caricamento pipe...</div>}
          {!pipesLoading && pipes.length === 0 && (
            <div className="text-xs text-slate-500">Nessuna pipe definita.</div>
          )}
          {!pipesLoading &&
            pipes.map((p) => (
              <div key={p.id} className="rounded-md border border-slate-200 px-3 py-2">
                <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                  <span>{p.name || "-"}</span>
                  <div className="flex items-center gap-3">
                    {p.enabled !== undefined && (
                      <label className="flex items-center gap-2 text-xs font-normal text-slate-600 select-none">
                        <span>{p.enabled ? "Enabled" : "Disabled"}</span>
                        <button
                          type="button"
                          aria-label="Toggle pipe"
                          onClick={() => togglePipeEnabled(p.id, !p.enabled)}
                          disabled={toggleId === p.id}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                            p.enabled ? "bg-emerald-500" : "bg-slate-300"
                          } ${toggleId === p.id ? "opacity-60" : ""}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                              p.enabled ? "translate-x-4" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </label>
                    )}
                    <button
                      type="button"
                      aria-label="Elimina pipe"
                      onClick={async () => {
                        if (!token) return;
                        try {
                          const res = await fetch(
                            `${env.apiBaseUrl}/tickerscanner/fundamentals/users/pipes/${p.id}`,
                            {
                              method: "DELETE",
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            }
                          );
                          const data = await res.json().catch(() => ({}));
                          if (!res.ok || data?.ok === false) {
                            throw new Error(data?.error || "Errore eliminazione pipe");
                          }
                          setPipes((prev) => prev.filter((x) => x.id !== p.id));
                        } catch (err: any) {
                          setPipeError(err?.message || "Errore eliminazione pipe");
                        }
                      }}
                      className="rounded-full p-1 text-red-500 hover:bg-red-50"
                      title="Elimina pipe"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0V5a2 2 0 012-2h2a2 2 0 012 2v2m-9 0h10" />
                      </svg>
                    </button>
                  </div>
                </div>
                {p.description && <div className="text-xs text-slate-600 mt-1">{p.description}</div>}
              </div>
            ))}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              setPipeError(null);
              setPipeFormOpen((prev) => !prev);
            }}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {pipeFormOpen ? "Chiudi" : "Add pipe"}
          </button>
        </div>

        {pipeFormOpen && (
          <div id="pipe-form" className="space-y-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-600">Nome pipe</label>
              <input
                type="text"
                value={newPipeName}
                onChange={(e) => setNewPipeName(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Nome pipe"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-600">Descrizione</label>
              <textarea
                value={newPipeDesc}
                onChange={(e) => setNewPipeDesc(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={2}
                placeholder="Descrizione della pipe"
              />
            </div>
            {pipeError && <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">{pipeError}</div>}
            <div className="flex justify-end">
              <button
                type="button"
                disabled={savingPipe}
                onClick={async () => {
                  if (!token) {
                    setPipeError("Token o utente non disponibili.");
                    return;
                  }
                  if (!newPipeName.trim()) {
                    setPipeError("Inserisci un nome per la pipe.");
                    return;
                  }
                  setPipeError(null);
                  setSavingPipe(true);
                  try {
                    const res = await fetch(`${env.apiBaseUrl}/tickerscanner/fundamentals/users/pipes`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({ name: newPipeName.trim(), description: newPipeDesc.trim() || undefined }),
                    });
                    const data = await res.json().catch(() => ({}));
                    if (!res.ok || data?.ok === false) {
                      throw new Error(data?.error || "Errore creazione pipe");
                    }
                    setNewPipeName("");
                    setNewPipeDesc("");
                    setPipeFormOpen(false);
                    fetchPipes();
                  } catch (err: any) {
                    setPipeError(err?.message || "Errore salvataggio pipe");
                  } finally {
                    setSavingPipe(false);
                  }
                }}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {savingPipe ? "Salvataggio..." : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
