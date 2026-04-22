import { useEffect, useMemo, useRef, useState } from "react";
import {
  listApiKeys,
  createApiKey,
  updateApiKey,
  deleteApiKey,
  listApiKeyPermissions,
  createApiKeyPermission,
  updateApiKeyPermission,
  deleteApiKeyPermission,
  type ApiKeyRecord,
} from "../../api/apiKeys";
import SectionHeader from "../molecules/content/SectionHeader";
import AppIcon from "../atoms/icon/AppIcon";

const HTTP_METHOD_OPTIONS = ["GET", "POST", "PUT", "DELETE", "ANY"];

type Status = "idle" | "loading" | "error";

type PermissionDraft = {
  permission_code: string;
  http_method: string;
  resource_pattern: string;
  is_allowed: boolean;
  _markedForDelete?: boolean;
  _clientId?: string;
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const toBool = (value: unknown): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["1", "true", "yes", "y", "si", "sì"].includes(normalized)) return true;
  }
  return false;
};

const getPermissionId = (perm: any) => perm?.id ?? perm?.permission_id ?? null;

const maskApiKey = (value?: string | null) => {
  if (!value) return "-";
  const str = String(value);
  if (str.length <= 4) return `****${str}`;
  return `************${str.slice(-4)}`;
};
const isMarkedForDelete = (perm: any) => !!perm?._markedForDelete;

export function ApiKeysPage() {
  const permClientIdRef = useRef(0);
  const makePermClientId = () => `perm-${++permClientIdRef.current}`;

  const [status, setStatus] = useState<Status>("idle");
  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [createStatus, setCreateStatus] = useState<Status>("idle");
  const [createError, setCreateError] = useState<string | null>(null);
  const [createFieldErrors, setCreateFieldErrors] = useState<Record<string, string | undefined>>({});
  const [lastCreatedKey, setLastCreatedKey] = useState<string | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [createKey, setCreateKey] = useState({
    name: "",
    owner_user_id: "",
    description: "",
    is_active: true,
    expires_at: "",
  });
  const [createPermissions, setCreatePermissions] = useState<PermissionDraft[]>([]);

  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editingDraft, setEditingDraft] = useState<ApiKeyRecord | null>(null);
  const [editingOriginal, setEditingOriginal] = useState<ApiKeyRecord | null>(null);
  const [permissions, setPermissions] = useState<PermissionDraft[]>([]);
  const [originalPermissions, setOriginalPermissions] = useState<any[]>([]);
  const [permStatus, setPermStatus] = useState<Status>("idle");
  const [permError, setPermError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setStatus("loading");
    setError(null);

    listApiKeys()
      .then((data) => {
        if (!active) return;
        setKeys(Array.isArray(data) ? data : []);
        setStatus("idle");
      })
      .catch((err: any) => {
        if (!active) return;
        setStatus("error");
        setError(err?.message || "Errore durante il caricamento delle API key");
      });

    return () => {
      active = false;
    };
  }, []);

  const rows = useMemo(() => keys ?? [], [keys]);

  const startEdit = (key: ApiKeyRecord) => {
    setShowCreate(false);
    setEditingId(key.id ?? null);
    setEditingDraft(key);
    setEditingOriginal(key);
    setSaveError(null);
    setDeleteError(null);

    if (!key.id) {
      setPermissions([]);
      setOriginalPermissions([]);
      setPermStatus("idle");
      setPermError(null);
      return;
    }

    setPermStatus("loading");
    setPermError(null);
    listApiKeyPermissions(key.id)
      .then((data) => {
        const normalized = (Array.isArray(data) ? data : []).map((perm) => ({
          ...(perm as any),
          _markedForDelete: false,
          _clientId: makePermClientId(),
        }));
        setPermissions(normalized as PermissionDraft[]);
        setOriginalPermissions(Array.isArray(data) ? data : []);
        setPermStatus("idle");
      })
      .catch((err: any) => {
        setPermStatus("error");
        setPermError(err?.message || "Errore durante il caricamento dei permessi");
        setPermissions([]);
      });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingDraft(null);
    setEditingOriginal(null);
    setPermissions([]);
    setOriginalPermissions([]);
    setPermStatus("idle");
    setPermError(null);
    setSaving(false);
    setSaveError(null);
    setDeleting(false);
    setDeleteError(null);
  };

  const addPermissionRow = () => {
    setPermissions((prev) => [
      ...prev,
      {
        permission_code: "",
        http_method: "ANY",
        resource_pattern: "",
        is_allowed: true,
        _markedForDelete: false,
        _clientId: makePermClientId(),
      },
    ]);
  };

  const updatePermissionField = (idx: number, key: string, value: unknown) => {
    setPermissions((prev) =>
      prev.map((perm, index) =>
        index === idx && !isMarkedForDelete(perm) ? { ...perm, [key]: value } : perm
      )
    );
  };

  const removePermissionRow = (idx: number) => {
    setPermissions((prev) => {
      const target = prev[idx];
      if (!target) return prev;
      const permId = getPermissionId(target);
      if (permId === null || permId === undefined) {
        return prev.filter((_, index) => index !== idx);
      }
      return prev.map((perm, index) =>
        index === idx ? { ...perm, _markedForDelete: true } : perm
      );
    });
  };

  const addCreatePermissionRow = () => {
    setCreatePermissions((prev) => [
      ...prev,
      { permission_code: "", http_method: "ANY", resource_pattern: "", is_allowed: true },
    ]);
  };

  const updateCreatePermissionField = (idx: number, key: string, value: unknown) => {
    setCreatePermissions((prev) =>
      prev.map((perm, index) => (index === idx ? { ...perm, [key]: value } : perm))
    );
  };

  const removeCreatePermissionRow = (idx: number) => {
    setCreatePermissions((prev) => prev.filter((_, index) => index !== idx));
  };

  const hasKeyChanges = () => {
    if (!editingDraft || !editingOriginal) return false;
    const fields: (keyof ApiKeyRecord)[] = [
      "name",
      "owner_user_id",
      "description",
      "is_active",
      "expires_at",
    ];
    return fields.some((field) => (editingDraft as any)[field] !== (editingOriginal as any)[field]);
  };

  const changedPermissions = useMemo(() => {
    if (!Array.isArray(permissions) || !Array.isArray(originalPermissions)) return [];
    const byId = new Map<string | number, any>();
    originalPermissions.forEach((perm: any) => {
      const key = perm?.id ?? perm?.permission_id ?? perm;
      if (key !== undefined && key !== null) {
        byId.set(key, perm);
      }
    });

    return permissions.filter((perm: any) => {
      if (isMarkedForDelete(perm)) return true;
      const key = perm?.id ?? perm?.permission_id ?? perm;
      if (key === undefined || key === null) return false;
      const orig = byId.get(key);
      if (!orig) return true;
      const fields = ["http_method", "permission_code", "resource_pattern", "is_allowed"];
      return fields.some((field) => (perm as any)?.[field] !== (orig as any)?.[field]);
    });
  }, [permissions, originalPermissions]);

  const onSave = async () => {
    if (!editingId || !editingDraft) return;
    setSaving(true);
    setSaveError(null);

    const tasks: Promise<unknown>[] = [];

    if (hasKeyChanges()) {
      const rawExpiresAt = (editingDraft as any).expires_at ?? null;
      const normalizedExpiresAt =
        typeof rawExpiresAt === "string" && rawExpiresAt.includes("T")
          ? rawExpiresAt.split("T")[0]
          : rawExpiresAt;
      const payload: Record<string, unknown> = {
        name: (editingDraft as any).name ?? null,
        owner_user_id:
          (editingDraft as any).owner_user_id === "" ? null : (editingDraft as any).owner_user_id ?? null,
        description:
          (editingDraft as any).description === "" ? null : (editingDraft as any).description ?? null,
        is_active: toBool((editingDraft as any).is_active),
        expires_at:
          normalizedExpiresAt === "" ? null : normalizedExpiresAt ?? null,
      };
      tasks.push(updateApiKey(editingId, payload));
    }

    changedPermissions.forEach((perm: any) => {
      if (isMarkedForDelete(perm)) return;
      const permId = perm?.id ?? perm?.permission_id;
      if (permId === undefined || permId === null) return;
      const payload: Record<string, unknown> = {
        http_method: perm?.http_method,
        permission_code: perm?.permission_code,
        resource_pattern: perm?.resource_pattern,
        is_allowed: perm?.is_allowed,
      };
      tasks.push(updateApiKeyPermission(editingId, permId, payload));
    });

    permissions
      .filter((perm: any) => !isMarkedForDelete(perm))
      .filter((perm: any) => (perm?.id ?? perm?.permission_id) === undefined || (perm?.id ?? perm?.permission_id) === null)
      .filter(
        (perm: any) =>
          !!String(perm?.permission_code ?? "").trim() || !!String(perm?.resource_pattern ?? "").trim()
      )
      .forEach((perm: any) => {
        tasks.push(
          createApiKeyPermission(editingId, {
            http_method: perm?.http_method,
            permission_code: perm?.permission_code,
            resource_pattern: perm?.resource_pattern,
            is_allowed: perm?.is_allowed,
          })
        );
      });

    permissions
      .filter((perm: any) => isMarkedForDelete(perm))
      .map((perm: any) => perm?.id ?? perm?.permission_id)
      .filter((value: any) => value !== undefined && value !== null)
      .forEach((permId: string | number) => {
        tasks.push(deleteApiKeyPermission(editingId, permId));
      });

    try {
      await Promise.all(tasks);
      setKeys((prev) =>
        prev.map((key) => {
          const keyId = key.id;
          if (keyId === editingId) {
            return {
              ...key,
              ...editingDraft,
            } as ApiKeyRecord;
          }
          return key;
        })
      );
      cancelEdit();
    } catch (err: any) {
      setSaveError(err?.message || "Errore durante il salvataggio");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!editingId) return;
    const confirmed = window.confirm("Questa operazione è irreversibile. Procedere?");
    if (!confirmed) return;

    try {
      setDeleting(true);
      setDeleteError(null);

      const perms = await listApiKeyPermissions(editingId);
      const permIds = (Array.isArray(perms) ? perms : [])
        .map((perm: any) => perm?.id ?? perm?.permission_id)
        .filter((value: any) => value !== undefined && value !== null);

      await Promise.all(permIds.map((permId: string | number) => deleteApiKeyPermission(editingId, permId)));
      await deleteApiKey(editingId);
      setKeys((prev) => prev.filter((key) => (key.id ?? "") !== editingId));
      cancelEdit();
    } catch (err: any) {
      setDeleteError(err?.message || "Errore durante la cancellazione");
    } finally {
      setDeleting(false);
    }
  }

  function resetCreateInputs() {
    setCreateKey({
      name: "",
      owner_user_id: "",
      description: "",
      is_active: true,
      expires_at: "",
    });
    setCreatePermissions([]);
    setCreateStatus("idle");
    setCreateError(null);
    setCreateFieldErrors({});
  }

  const resetCreateForm = () => {
    resetCreateInputs();
    setLastCreatedKey(null);
    setShowKeyModal(false);
    setCopySuccess(null);
  };

  const onCreate = async () => {
    if (createStatus === "loading") return;
    setCreateError(null);
    setCreateFieldErrors({});

    const nextErrors: Record<string, string> = {};
    if (!createKey.name.trim()) nextErrors.name = "Nome obbligatorio.";
    if (Object.keys(nextErrors).length) {
      setCreateFieldErrors(nextErrors);
      setCreateError("Compila i campi obbligatori.");
      return;
    }

    try {
      setCreateStatus("loading");
      const payload: Record<string, unknown> = {
        name: createKey.name.trim(),
        owner_user_id: createKey.owner_user_id || null,
        description: createKey.description || null,
        is_active: createKey.is_active,
        expires_at: createKey.expires_at || null,
      };
      const created = await createApiKey(payload);
      const createdRow: ApiKeyRecord = {
        ...payload,
        ...created,
      };
      const createdKeyValue = (created as any)?.api_key ?? (createdRow as any)?.api_key;
      const keyId = created.id ?? createdRow.id;
      if (keyId) {
        await Promise.all(
          createPermissions
            .filter((perm) => perm.permission_code.trim() || perm.resource_pattern.trim())
            .map((perm) =>
              createApiKeyPermission(keyId, {
                http_method: perm.http_method,
                permission_code: perm.permission_code,
                resource_pattern: perm.resource_pattern,
                is_allowed: perm.is_allowed,
              })
            )
        );
      }
      setKeys((prev) => [createdRow, ...prev]);
      if (createdKeyValue) {
        setLastCreatedKey(String(createdKeyValue));
        setShowKeyModal(true);
        setCopySuccess(null);
      }
      resetCreateInputs();
      setShowCreate(false);
      setCreateStatus("idle");
    } catch (err: any) {
      setCreateError(err?.message || "Errore durante la creazione API key");
      setCreateStatus("idle");
    }
  };

  return (
    <div className="space-y-4">
      <SectionHeader title="API Keys" subTitle="Gestione API Keys" />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          onClick={() => {
            setShowCreate((prev) => !prev);
            cancelEdit();
          }}
        >
          <AppIcon icon="mdi:key-plus" className="h-4 w-4" />
          {showCreate ? "Chiudi creazione" : "Nuova API Key"}
        </button>
      </div>

      {showKeyModal && lastCreatedKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="text-lg font-semibold text-slate-900">API Key creata</div>
            <p className="mt-2 text-sm text-slate-600">
              Questa chiave sara visibile solo ora. Salvala in un posto sicuro.
            </p>
            <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-900 break-all">
              {lastCreatedKey}
            </div>
            {copySuccess && (
              <div className="mt-2 text-xs text-emerald-700">{copySuccess}</div>
            )}
            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => {
                  setShowKeyModal(false);
                }}
              >
                Chiudi
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(lastCreatedKey);
                      setCopySuccess("Copiata negli appunti");
                    } catch {
                      setCopySuccess("Impossibile copiare automaticamente");
                    }
                  }}
                >
                  Copia
                </button>
                <button
                  type="button"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(lastCreatedKey);
                      setCopySuccess("Copiata negli appunti");
                    } catch {
                      setCopySuccess("Impossibile copiare automaticamente");
                    }
                    setShowKeyModal(false);
                  }}
                >
                  Copia e chiudi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {createError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {createError}
        </div>
      )}

      {showCreate && (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-base font-semibold text-slate-900">Crea nuova API key</div>
            <button
              type="button"
              className="text-sm font-semibold text-slate-600 hover:text-slate-800"
              onClick={() => {
                resetCreateForm();
                setShowCreate(false);
              }}
            >
              Chiudi
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
              Nome
              <input
                type="text"
                value={createKey.name}
                onChange={(e) => setCreateKey((prev) => ({ ...prev, name: e.target.value }))}
                className={`rounded-md border bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none ${
                  createFieldErrors.name ? "border-red-300" : "border-slate-200 focus:border-blue-400"
                }`}
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
              Owner User ID
              <input
                type="text"
                value={createKey.owner_user_id}
                onChange={(e) => setCreateKey((prev) => ({ ...prev, owner_user_id: e.target.value }))}
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-400"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
              Scadenza (YYYY-MM-DD)
              <input
                type="date"
                value={createKey.expires_at}
                onChange={(e) => setCreateKey((prev) => ({ ...prev, expires_at: e.target.value }))}
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-400"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600 md:col-span-2">
              Descrizione
              <textarea
                value={createKey.description}
                onChange={(e) => setCreateKey((prev) => ({ ...prev, description: e.target.value }))}
                className="min-h-[80px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-400"
              />
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <input
                type="checkbox"
                checked={createKey.is_active}
                onChange={(e) => setCreateKey((prev) => ({ ...prev, is_active: e.target.checked }))}
              />
              Attiva
            </label>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-600">Permessi API key</div>
              <button
                type="button"
                className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                onClick={addCreatePermissionRow}
              >
                + Permesso
              </button>
            </div>

            {createPermissions.length === 0 && (
              <div className="text-xs text-slate-500">Nessun permesso aggiunto.</div>
            )}

            {createPermissions.map((perm, idx) => (
              <div key={`create-perm-${idx}`} className="grid grid-cols-1 gap-2 md:grid-cols-4">
                <input
                  type="text"
                  placeholder="Permission code"
                  value={perm.permission_code}
                  onChange={(e) => updateCreatePermissionField(idx, "permission_code", e.target.value)}
                  className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="Resource pattern"
                  value={perm.resource_pattern}
                  onChange={(e) => updateCreatePermissionField(idx, "resource_pattern", e.target.value)}
                  className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs"
                />
                <select
                  value={perm.http_method}
                  onChange={(e) => updateCreatePermissionField(idx, "http_method", e.target.value)}
                  className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs"
                >
                  {HTTP_METHOD_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={perm.is_allowed}
                      onChange={(e) => updateCreatePermissionField(idx, "is_allowed", e.target.checked)}
                    />
                    Allowed
                  </label>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md border border-slate-200 bg-white p-1 text-red-600 shadow-sm transition hover:border-slate-300 hover:text-red-700"
                    onClick={() => removeCreatePermissionRow(idx)}
                    aria-label="Rimuovi permesso"
                  >
                    <AppIcon icon="mdi:trash-can-outline" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              onClick={onCreate}
              disabled={createStatus === "loading"}
            >
              {createStatus === "loading" ? "Salvataggio..." : "Crea API key"}
            </button>
          </div>
        </div>
      )}

      {status === "loading" && <div className="text-sm text-slate-600">Caricamento...</div>}
      {status === "error" && <div className="text-sm text-red-600">{error}</div>}

      {status === "idle" && rows.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 font-semibold">Name</th>
                <th className="px-3 py-2 font-semibold">API Key</th>
                <th className="px-3 py-2 font-semibold">Owner</th>
                <th className="px-3 py-2 font-semibold">Active</th>
                <th className="px-3 py-2 font-semibold">Expires</th>
                <th className="px-3 py-2 font-semibold">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((key) => (
                <tr key={key.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-semibold text-slate-900">{key.name}</td>
                  <td className="px-3 py-2 text-slate-700 break-all">{maskApiKey(key.api_key as any)}</td>
                  <td className="px-3 py-2 text-slate-700">{key.owner_user_id ?? "-"}</td>
                  <td className="px-3 py-2 text-slate-700">{toBool(key.is_active) ? "Yes" : "No"}</td>
                  <td className="px-3 py-2 text-slate-700">{formatDate(key.expires_at as any)}</td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => startEdit(key)}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-blue-700"
                      aria-label="Modifica API key"
                    >
                      <AppIcon icon="mdi:pencil" className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingId && editingDraft && (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-base font-semibold text-slate-900">Modifica API key</div>
            <button
              type="button"
              className="text-sm font-semibold text-slate-600 hover:text-slate-800"
              onClick={cancelEdit}
            >
              Chiudi
            </button>
          </div>

          {saveError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {saveError}
            </div>
          )}
          {deleteError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {deleteError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
              Nome
              <input
                type="text"
                value={(editingDraft as any).name ?? ""}
                onChange={(e) => setEditingDraft((prev) => ({ ...(prev || {}), name: e.target.value }))}
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-400"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
              API Key
              <input
                type="text"
                value={maskApiKey((editingDraft as any).api_key ?? "")}
                readOnly
                disabled
                className="cursor-not-allowed rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
              Owner User ID
              <input
                type="text"
                value={(editingDraft as any).owner_user_id ?? ""}
                onChange={(e) => setEditingDraft((prev) => ({ ...(prev || {}), owner_user_id: e.target.value }))}
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-400"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
              Scadenza (YYYY-MM-DD)
              <input
                type="date"
                value={(editingDraft as any).expires_at ?? ""}
                onChange={(e) => setEditingDraft((prev) => ({ ...(prev || {}), expires_at: e.target.value }))}
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-400"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600 md:col-span-2">
              Descrizione
              <textarea
                value={(editingDraft as any).description ?? ""}
                onChange={(e) => setEditingDraft((prev) => ({ ...(prev || {}), description: e.target.value }))}
                className="min-h-[80px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-400"
              />
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <input
                type="checkbox"
                checked={toBool((editingDraft as any).is_active)}
                onChange={(e) => setEditingDraft((prev) => ({ ...(prev || {}), is_active: e.target.checked }))}
              />
              Attiva
            </label>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-600">Permessi API key</div>
              <button
                type="button"
                className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                onClick={addPermissionRow}
              >
                + Permesso
              </button>
            </div>

            {permStatus === "loading" && (
              <div className="text-xs text-slate-500">Caricamento permessi...</div>
            )}
            {permStatus === "error" && (
              <div className="text-xs text-red-600">{permError}</div>
            )}

            {permStatus === "idle" && permissions.length === 0 && (
              <div className="text-xs text-slate-500">Nessun permesso assegnato.</div>
            )}

            {permissions.map((perm, idx) => (
              <div
                key={perm._clientId ?? `perm-${idx}`}
                className={`grid grid-cols-1 gap-2 md:grid-cols-4 ${isMarkedForDelete(perm) ? "opacity-50" : ""}`}
              >
                <input
                  type="text"
                  placeholder="Permission code"
                  value={perm.permission_code}
                  onChange={(e) => updatePermissionField(idx, "permission_code", e.target.value)}
                  className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="Resource pattern"
                  value={perm.resource_pattern}
                  onChange={(e) => updatePermissionField(idx, "resource_pattern", e.target.value)}
                  className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs"
                />
                <select
                  value={perm.http_method}
                  onChange={(e) => updatePermissionField(idx, "http_method", e.target.value)}
                  className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs"
                >
                  {HTTP_METHOD_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={perm.is_allowed}
                      onChange={(e) => updatePermissionField(idx, "is_allowed", e.target.checked)}
                    />
                    Allowed
                  </label>
                  <button
                    type="button"
                    className={`inline-flex items-center rounded-md border border-slate-200 bg-white p-1 text-red-600 shadow-sm transition hover:border-slate-300 hover:text-red-700 ${
                      isMarkedForDelete(perm) ? "opacity-60" : ""
                    }`}
                    onClick={() => removePermissionRow(idx)}
                    aria-label={
                      isMarkedForDelete(perm) ? "Ripristina permesso" : "Rimuovi permesso"
                    }
                  >
                    {isMarkedForDelete(perm) ? (
                      <span className="text-[11px] font-semibold text-slate-600">Ripristina</span>
                    ) : (
                      <AppIcon icon="mdi:trash-can-outline" className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
              onClick={onDelete}
              disabled={deleting}
            >
              {deleting ? "Cancellazione..." : "Elimina API key"}
            </button>

            <button
              type="button"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              onClick={onSave}
              disabled={saving}
            >
              {saving ? "Salvataggio..." : "Salva modifiche"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApiKeysPage;
