import { useEffect, useMemo, useRef, useState } from "react";
import {
  fetchAdminUsers,
  fetchAdminUserPermissions,
  deleteAdminUserClientNavigation,
  updateAdminUserClientNavigation,
  fetchAdminUserClientNavigation,
  createAdminUserClientNavigation,
  deleteAdminUser,
  createAdminUser,
  createAdminUserPermission,
  deleteAdminUserPermission,
  updateAdminUser,
  updateAdminUserPermission,
  type AdminUser,} from "../../api/users";
import SectionHeader from "../molecules/content/SectionHeader";
import AppIcon from "../atoms/icon/AppIcon";

type Status = "idle" | "loading" | "error";

const formatDate = (value: string | undefined) => {
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

const flagLabel = (value: boolean | null | undefined) => (value ? "Yes" : "No");

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const getDisplayName = (user: AdminUser) => {
  if (user.username) return user.username;
  if (user.email) return user.email;
  return user.id ?? "-";
};

const toBool = (value: unknown): boolean | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["1", "true", "yes", "y", "si", "sì"].includes(normalized)) return true;
    if (["0", "false", "no", "n"].includes(normalized)) return false;
  }
  return Boolean(value);
};

const getFlag = (user: AdminUser, keys: string[]) => {
  for (const key of keys) {
    const value = (user as any)[key];
    const bool = toBool(value);
    if (bool !== null) return bool;
  }
  return false;
};

const getDateField = (user: AdminUser, keys: string[]) => {
  for (const key of keys) {
    const value = (user as any)[key];
    if (typeof value === "string" && value) return value;
  }
  return undefined;
};

const HTTP_METHOD_OPTIONS = ["GET", "POST", "PUT", "DELETE", "ANY"];


const NAV_PAGE_OPTIONS: { label: string; value: string }[] = [
  { label: "Overview", value: "overview" },
  { label: "Tickers", value: "dashboard/tickers" },
  { label: "Users", value: "admin/users" },
  { label: "Scheduler", value: "admin/scheduler" },
];

const normalizeNavPageValue = (value: unknown) => {
  if (typeof value !== "string") return "";
  return value
    .trim()
    .replace(/^#\/?/, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
};

type CreateNavDraft = {
  page: string;
  locked?: boolean;
};

const getDefaultCreateNav = (): CreateNavDraft => ({
  page: "overview",
  locked: true,
});

type CreatePermissionDraft = {
  permission_code: string;
  http_method: string;
  resource_pattern: string;
  is_allowed: boolean;
  locked?: boolean;
};

const getDefaultCreatePermission = (isAdmin: boolean): CreatePermissionDraft => {
  if (isAdmin) {
    return {
      http_method: "ANY",
      permission_code: "ADMIN_ALL",
      resource_pattern: "*",
      is_allowed: true,
      locked: true,
    };
  }
  return {
    http_method: "GET",
    permission_code: "READ_ME",
    resource_pattern: "/auth/admin/me",
    is_allowed: true,
    locked: true,
  };
};



type EditingNavEntry = {
  id?: string | number;
  user_id?: string | number;
  page?: string;
  created_at?: string;
  updated_at?: string;
  _markedForDelete?: boolean;
  _clientId?: string;
  _locked?: boolean;
};

const getNavId = (entry: unknown) => {
  const value = entry as any;
  return value?.id ?? value?.nav_id ?? null;
};

const getNavClientId = (entry: unknown) => (entry as any)?._clientId as string | undefined;
const isNavMarkedForDelete = (entry: unknown) => !!(entry as any)?._markedForDelete;
const isNavDefault = (entry: unknown) => !!(entry as any)?._locked;

const OVERVIEW_NAV_DEFAULT: EditingNavEntry = {
  page: "overview",
  _markedForDelete: false,
  _locked: true,
};

const normalizeEditingNavDefaults = (entries: EditingNavEntry[]) => {
  const desiredPage = "overview";

  const normalizedEntries = entries.map((entry) => ({
    ...(entry as any),
    page: normalizeNavPageValue((entry as any)?.page) || "",
  }));

  const candidates = normalizedEntries.filter(
    (entry) => String((entry as any)?.page ?? "") === desiredPage
  );
  const keep = candidates.find((entry) => getNavId(entry) !== null) ?? candidates[0] ?? null;

  const next: EditingNavEntry[] = [];

  normalizedEntries.forEach((entry) => {
    const page = String((entry as any)?.page ?? "");
    const entryId = getNavId(entry);

    if (keep && entry === keep) {
      next.push({
        ...(entry as any),
        ...OVERVIEW_NAV_DEFAULT,
        page: desiredPage,
        _markedForDelete: false,
        _locked: true,
      });
      return;
    }

    if (page === desiredPage) {
      if (entryId === null) return; // unsaved duplicate
      next.push({ ...(entry as any), _markedForDelete: true });
      return;
    }

    next.push(entry);
  });

  const hasDesired = next.some(
    (entry) =>
      String((entry as any)?.page ?? "") === desiredPage && !isNavMarkedForDelete(entry)
  );

  if (!hasDesired) {
    next.unshift({ ...OVERVIEW_NAV_DEFAULT, page: desiredPage });
  }

  return next;
};
const getPermissionId = (perm: unknown) => {
  const value = perm as any;
  return value?.id ?? value?.permission_id ?? null;
};

const getPermissionClientId = (perm: unknown) => (perm as any)?._clientId as string | undefined;

const isAdminAllPermission = (perm: unknown) => (perm as any)?.permission_code === "ADMIN_ALL";
const isReadMeDefaultPermission = (perm: unknown) => (perm as any)?.permission_code === "READ_ME";
const isDefaultPermission = (perm: unknown) => isAdminAllPermission(perm) || isReadMeDefaultPermission(perm);
const isMarkedForDelete = (perm: unknown) => !!(perm as any)?._markedForDelete;

const READ_ME_DEFAULT = {
  http_method: "GET",
  permission_code: "READ_ME",
  resource_pattern: "/auth/admin/me",
  is_allowed: true,
  _markedForDelete: false,
};

const ADMIN_ALL_DEFAULT = {
  http_method: "ANY",
  permission_code: "ADMIN_ALL",
  resource_pattern: "*",
  is_allowed: true,
  _markedForDelete: false,
};

const normalizeEditingDefaults = (perms: any[], isAdmin: boolean) => {
  const desiredCode = isAdmin ? "ADMIN_ALL" : "READ_ME";
  const undesiredCode = isAdmin ? "READ_ME" : "ADMIN_ALL";
  const desiredDefaults = isAdmin ? ADMIN_ALL_DEFAULT : READ_ME_DEFAULT;

  // Pick a single desired permission to keep (prefer server-backed `id`).
  const candidates = perms.filter((perm) => (perm as any)?.permission_code === desiredCode);
  const keep =
    candidates.find((perm) => getPermissionId(perm) !== null) ??
    candidates[0] ??
    null;

  const next: any[] = [];

  perms.forEach((perm) => {
    const code = (perm as any)?.permission_code;
    const permId = getPermissionId(perm);

    if (keep && perm === keep) {
      next.push({
        ...(perm as any),
        ...desiredDefaults,
        _markedForDelete: false,
      });
      return;
    }

    if (code === desiredCode || code === undesiredCode) {
      if (permId === null) return; // unsaved: drop immediately
      next.push({ ...(perm as any), _markedForDelete: true });
      return;
    }

    next.push(perm);
  });

  const hasDesired = next.some((perm) => (perm as any)?.permission_code === desiredCode && !isMarkedForDelete(perm));
  if (!hasDesired) {
    next.unshift({ ...desiredDefaults });
  }

  return next;
};

export function UsersPage() {
  const permissionsClientIdRef = useRef(0);
  const makePermissionClientId = () => `perm-${++permissionsClientIdRef.current}`;

  const navClientIdRef = useRef(0);
  const makeNavClientId = () => `nav-${++navClientIdRef.current}`;

  const [status, setStatus] = useState<Status>("idle");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editingDraft, setEditingDraft] = useState<AdminUser | null>(null);
  const [editingOriginal, setEditingOriginal] = useState<AdminUser | null>(null);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [originalPermissions, setOriginalPermissions] = useState<any[]>([]);
  const [clientNavigation, setClientNavigation] = useState<any[]>([]);
  const [originalClientNavigation, setOriginalClientNavigation] = useState<any[]>([]);
  const [navStatus, setNavStatus] = useState<Status>("idle");
  const [navError, setNavError] = useState<string | null>(null);
  const [permStatus, setPermStatus] = useState<Status>("idle");
  const [permError, setPermError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createStatus, setCreateStatus] = useState<Status>("idle");
  const [createError, setCreateError] = useState<string | null>(null);
  const [createFieldErrors, setCreateFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [createUser, setCreateUser] = useState({
    name: "",
    email: "",
    active: true,
    isService: false,
    isAdmin: false,
    password: "",
    confirmPassword: "",
  });
  const [createPermissions, setCreatePermissions] = useState<CreatePermissionDraft[]>([
    getDefaultCreatePermission(false),
  ]);
  const [createClientNavigation, setCreateClientNavigation] = useState<CreateNavDraft[]>([getDefaultCreateNav()]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setStatus("loading");
    setError(null);

    fetchAdminUsers(controller.signal)
      .then((data) => {
        if (!active) return;
        setUsers(Array.isArray(data) ? data : []);
        setStatus("idle");
      })
      .catch((err) => {
        if (!active || err.name === "AbortError") return;
        console.error("Users fetch error", err);
        setStatus("error");
        setError(err.message || "Errore durante il caricamento utenti");
        setUsers([]);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const rows = useMemo(() => users ?? [], [users]);

  const ensurePermissionClientIds = (perms: any[]) =>
    perms.map((perm) => {
      if (getPermissionClientId(perm)) return perm;
      return { ...(perm as any), _clientId: makePermissionClientId() };
    });

  const startEdit = (user: AdminUser) => {
    setShowCreate(false);
    setEditingId(user.id ?? user.email ?? user.username ?? null);
    setEditingDraft(user);
    setEditingOriginal(user);
    setSaveError(null);

    const userKey = user.id ?? user.email ?? user.username;
    if (userKey === undefined || userKey === null) {
      setPermissions([]);
      setOriginalPermissions([]);
      setPermStatus("idle");
      setPermError(null);

      setClientNavigation([]);
      setOriginalClientNavigation([]);
      setNavStatus("idle");
      setNavError(null);
      return;
    }

    // ---- Permissions ----
    const controller = new AbortController();
    setPermissions([]);
    setOriginalPermissions([]);
    setPermStatus("loading");
    setPermError(null);

    fetchAdminUserPermissions(userKey, controller.signal)
      .then((data) => {
        const perms = Array.isArray(data) ? data : [];
        const normalized = perms.map((perm) => ({ ...(perm as any), _markedForDelete: false }));
        const initialIsAdmin = normalized.some((perm) => isAdminAllPermission(perm));
        setPermissions(ensurePermissionClientIds(normalizeEditingDefaults(normalized, initialIsAdmin)));
        setOriginalPermissions(perms);
        setPermStatus("idle");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("User permissions fetch error", err);
        setPermissions([]);
        setPermStatus("error");
        setPermError(err.message || "Errore durante il caricamento permessi");
      });

    // ---- Client navigation ----
    const navController = new AbortController();
    setClientNavigation([]);
    setOriginalClientNavigation([]);
    setNavStatus("loading");
    setNavError(null);

    fetchAdminUserClientNavigation(userKey, navController.signal)
      .then((data) => {
        const rows = Array.isArray(data) ? data : [];
        const normalized = rows.map((entry) => ({
          ...(entry as any),
          page: normalizeNavPageValue((entry as any)?.page) || "",
          _markedForDelete: false,
          _locked: false,
        }));
        setClientNavigation(ensureNavClientIds(normalizeEditingNavDefaults(normalized as any)));
        setOriginalClientNavigation(rows);
        setNavStatus("idle");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("User client navigation fetch error", err);
        setClientNavigation([]);
        setNavStatus("error");
        setNavError(err.message || "Errore durante il caricamento navigazione");
      });

    // No cleanup needed here because fetch triggers once per edit session.
  };

  const ensureNavClientIds = (entries: any[]) =>
    entries.map((entry) => {
      if (getNavClientId(entry)) return entry;
      return { ...(entry as any), _clientId: makeNavClientId() };
    });

  const cancelEdit = () => {
    setEditingId(null);
    setEditingDraft(null);
    setEditingOriginal(null);
    setPermissions([]);
    setOriginalPermissions([]);
    setPermStatus("idle");
    setPermError(null);
    setClientNavigation([]);
    setOriginalClientNavigation([]);
    setNavStatus("idle");
    setNavError(null);
    setSaving(false);
    setSaveError(null);
    setDeleting(false);
    setDeleteError(null);
  };

  const updateDraft = (key: keyof AdminUser, value: unknown) => {
    setEditingDraft((prev) => ({ ...(prev || {}), [key]: value }));
  };

  const updatePermissionField = (index: number, key: string, value: unknown) => {
    setPermissions((prev) => {
      if (!Array.isArray(prev)) return prev;
      return prev.map((perm, idx) => {
        if (idx !== index) return perm;
        if (isDefaultPermission(perm) || isMarkedForDelete(perm)) return perm;
        return { ...(perm as any), [key]: value };
      });
    });
  };

  const updateNavField = (index: number, value: string) => {
    setClientNavigation((prev) => {
      if (!Array.isArray(prev)) return prev;
      return prev.map((entry, idx) => {
        if (idx !== index) return entry;
        if (isNavDefault(entry) || isNavMarkedForDelete(entry)) return entry;
        return { ...(entry as any), page: value };
      });
    });
  };

  const addEditingNavRow = () => {
    setClientNavigation((prev) => [
      ...(Array.isArray(prev) ? prev : []),
      {
        page: "",
        _markedForDelete: false,
        _locked: false,
        _clientId: makeNavClientId(),
      },
    ]);
  };

  const removeEditingNavRow = (idx: number) => {
    setClientNavigation((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      const target = list[idx];
      if (!target) return list;
      if (isNavDefault(target)) return list;

      const navId = getNavId(target);
      if (navId === null) {
        return list.filter((_, index) => index !== idx);
      }

      return list.map((entry, index) =>
        index === idx ? { ...(entry as any), _markedForDelete: true } : entry
      );
    });
  };

  const addEditingPermissionRow = () => {
    setPermissions((prev) => [
      ...prev,
      {
        permission_code: "",
        http_method: "ANY",
        resource_pattern: "",
        is_allowed: true,
        _markedForDelete: false,
        _clientId: makePermissionClientId(),
      },
    ]);
  };

  const removeEditingPermissionRow = (idx: number) => {
    setPermissions((prev) => {
      const target = prev[idx];
      if (!target) return prev;
      if (isDefaultPermission(target)) return prev;

      const permId = getPermissionId(target);
      // New/unsaved permission: remove immediately like in create flow.
      if (permId === undefined || permId === null) {
        return prev.filter((_, index) => index !== idx);
      }
      // Existing permission: mark for delete (actual DELETE on Save).
      return prev.map((perm, index) =>
        index === idx ? { ...(perm as any), _markedForDelete: true } : perm
      );
    });
  };

  const toggleEditingAdmin = (next: boolean) => {
    setPermissions((prev) => ensurePermissionClientIds(normalizeEditingDefaults(prev, next)));
  };

  const resetCreateForm = () => {
    setCreateUser({
      name: "",
      email: "",
      active: true,
      isService: false,
      isAdmin: false,
      password: "",
      confirmPassword: "",
    });
    setCreatePermissions([getDefaultCreatePermission(false)]);
    setCreateClientNavigation([getDefaultCreateNav()]);
    setCreateStatus("idle");
    setCreateError(null);
    setCreateFieldErrors({});
  };

  const addCreatePermissionRow = () => {
    setCreatePermissions((prev) => {
      const ensured = prev.length ? prev : [getDefaultCreatePermission(createUser.isAdmin)];
      return [...ensured, { permission_code: "", http_method: "ANY", resource_pattern: "", is_allowed: true }];
    });
  };

  const updateCreatePermission = (idx: number, key: string, value: unknown) => {
    setCreatePermissions((prev) =>
      prev.map((perm, index) => (index === idx && !perm.locked ? { ...perm, [key]: value } : perm))
    );
  };

  const removeCreatePermissionRow = (idx: number) => {
    setCreatePermissions((prev) => {
      const target = prev[idx];
      if (target?.locked) return prev;
      return prev.filter((_, index) => index !== idx);
    });
  };


  const addCreateNavRow = () => {
    setCreateClientNavigation((prev) => {
      const ensured = prev.length ? prev : [getDefaultCreateNav()];
      return [...ensured, { page: "" }];
    });
  };

  const updateCreateNav = (idx: number, value: string) => {
    setCreateClientNavigation((prev) =>
      prev.map((entry, index) => (index === idx && !entry.locked ? { ...entry, page: value } : entry))
    );
  };

  const removeCreateNavRow = (idx: number) => {
    setCreateClientNavigation((prev) => {
      const target = prev[idx];
      if (target?.locked) return prev;
      return prev.filter((_, index) => index !== idx);
    });
  };

  useEffect(() => {
    if (!showCreate) return;
    setCreatePermissions((prev) => {
      const desired = getDefaultCreatePermission(createUser.isAdmin);
      if (prev.length === 0) return [desired];
      if (!prev[0]?.locked) return [desired, ...prev];

      const current = prev[0];
      const needsUpdate =
        current.permission_code !== desired.permission_code ||
        current.http_method !== desired.http_method ||
        current.resource_pattern !== desired.resource_pattern ||
        current.is_allowed !== desired.is_allowed;
      if (!needsUpdate) return prev;
      return [desired, ...prev.slice(1)];
    });
  }, [createUser.isAdmin, showCreate]);

  const hasUserChanges = () => {
    if (!editingDraft || !editingOriginal) return false;
    const fields: (keyof AdminUser | "isService")[] = ["email", "active", "isService"];
    return fields.some((field) => {
      if (field === "active") {
        return (
          getFlag(editingDraft, ["active", "isActive", "is_active", "enabled"]) !==
          getFlag(editingOriginal, ["active", "isActive", "is_active", "enabled"])
        );
      }
      if (field === "isService") {
        return (
          getFlag(editingDraft, ["isService", "is_service", "service", "serviceAccount"]) !==
          getFlag(editingOriginal, ["isService", "is_service", "service", "serviceAccount"])
        );
      }
      return (editingDraft as any)[field] !== (editingOriginal as any)[field];
    });
  };

  const changedClientNavigation = useMemo(() => {
    if (!Array.isArray(clientNavigation) || !Array.isArray(originalClientNavigation)) return [];
    const byId = new Map<string | number, any>();
    originalClientNavigation.forEach((entry: any) => {
      const key = entry?.id ?? entry?.nav_id ?? entry;
      if (key !== undefined && key !== null) {
        byId.set(key, entry);
      }
    });

    return clientNavigation.filter((entry: any) => {
      if (isNavMarkedForDelete(entry)) return true;
      const id = entry?.id ?? entry?.nav_id;
      const page = normalizeNavPageValue((entry as any)?.page);
      if (id === undefined || id === null) {
        return !!page;
      }
      const orig = byId.get(id);
      if (!orig) return true;
      return normalizeNavPageValue((orig as any)?.page) !== page;
    });
  }, [clientNavigation, originalClientNavigation]);

  const changedPermissions = useMemo(() => {
    if (!Array.isArray(permissions) || !Array.isArray(originalPermissions)) return [];
    const byId = new Map<string | number, any>();
    originalPermissions.forEach((perm: any) => {
      const key = perm?.id ?? perm?.permission_id ?? perm?.code ?? perm;
      if (key !== undefined && key !== null) {
        byId.set(key, perm);
      }
    });
    return permissions.filter((perm: any) => {
      if (isMarkedForDelete(perm)) return true;
      const key = perm?.id ?? perm?.permission_id ?? perm?.code ?? perm;
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
    setDeleteError(null);

    const tasks: Promise<unknown>[] = [];

    if (hasUserChanges()) {
      const payload: Record<string, unknown> = {};
      if ((editingDraft as any).email !== (editingOriginal as any)?.email) {
        payload.email = (editingDraft as any).email ?? null;
      }
      payload.active = getFlag(editingDraft, ["active", "isActive", "is_active", "enabled"]);
      payload.isService = getFlag(editingDraft, ["isService", "is_service", "service", "serviceAccount"]);
      tasks.push(updateAdminUser(editingId, payload));
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
      tasks.push(updateAdminUserPermission(editingId, permId, payload));
    });

    // Create new permissions (without id).
    permissions
      .filter((perm: any) => !isMarkedForDelete(perm))
      .filter(
        (perm: any) =>
          (perm?.id ?? perm?.permission_id) === undefined || (perm?.id ?? perm?.permission_id) === null
      )
      .filter((perm: any) => !!String(perm?.permission_code ?? "").trim() || !!String(perm?.resource_pattern ?? "").trim())
      .forEach((perm: any) => {
        tasks.push(
          createAdminUserPermission(editingId, {
            http_method: perm?.http_method,
            permission_code: perm?.permission_code,
            resource_pattern: perm?.resource_pattern,
            is_allowed: perm?.is_allowed,
          })
        );
      });

    // Delete permissions marked for delete.
    permissions
      .filter((perm: any) => isMarkedForDelete(perm))
      .map((perm: any) => perm?.id ?? perm?.permission_id)
      .filter((value: any) => value !== undefined && value !== null)
      .forEach((permId: string | number) => {
        tasks.push(deleteAdminUserPermission(editingId, permId));
      });



    // Update existing client navigation entries.
    clientNavigation
      .filter((entry: any) => !isNavMarkedForDelete(entry))
      .filter((entry: any) => (entry?.id ?? entry?.nav_id) !== undefined && (entry?.id ?? entry?.nav_id) !== null)
      .forEach((entry: any) => {
        const navId = entry?.id ?? entry?.nav_id;
        const orig = (originalClientNavigation || []).find((o: any) => (o?.id ?? o?.nav_id) === navId);
        const nextPage = normalizeNavPageValue((entry as any)?.page);
        const origPage = normalizeNavPageValue((orig as any)?.page);
        if (nextPage && nextPage !== origPage) {
          tasks.push(updateAdminUserClientNavigation(editingId, navId, { page: nextPage }));
        }
      });

    // Create new client navigation entries (without id).
    const pagesToCreate = Array.from(
      new Set(
        clientNavigation
          .filter((entry: any) => !isNavMarkedForDelete(entry))
          .filter(
            (entry: any) =>
              (entry?.id ?? entry?.nav_id) === undefined || (entry?.id ?? entry?.nav_id) === null
          )
          .map((entry: any) => normalizeNavPageValue((entry as any)?.page))
          .filter(Boolean)
      )
    );

    const existingPages = new Set(
      clientNavigation
        .filter((entry: any) => !isNavMarkedForDelete(entry))
        .filter((entry: any) => (entry?.id ?? entry?.nav_id) !== undefined && (entry?.id ?? entry?.nav_id) !== null)
        .map((entry: any) => normalizeNavPageValue((entry as any)?.page))
        .filter(Boolean)
    );

    pagesToCreate
      .filter((page: string) => !existingPages.has(page))
      .forEach((page: string) => {
        tasks.push(createAdminUserClientNavigation(editingId, { page }));
      });

    // Delete client navigation entries marked for delete.
    clientNavigation
      .filter((entry: any) => isNavMarkedForDelete(entry))
      .map((entry: any) => entry?.id ?? entry?.nav_id)
      .filter((value: any) => value !== undefined && value !== null)
      .forEach((navId: string | number) => {
        tasks.push(deleteAdminUserClientNavigation(editingId, navId));
      });
    try {
      await Promise.all(tasks);
      setUsers((prev) =>
        prev.map((u) => {
          const key = u.id ?? u.email ?? u.username;
          if (key === editingId) {
            return {
              ...u,
              ...editingDraft,
              active: getFlag(editingDraft, ["active", "isActive", "is_active", "enabled"]),
              isService: getFlag(editingDraft, ["isService", "is_service", "service", "serviceAccount"]),
            };
          }
          return u;
        })
      );
      setOriginalPermissions(permissions);
      setEditingOriginal(editingDraft);
      setSaving(false);
      cancelEdit();
    } catch (err: any) {
      console.error("Save user error", err);
      setSaveError(err?.message || "Errore durante il salvataggio");
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!editingId) return;
    const confirmed = window.confirm(
      "Questa operazione è irreversibile. L'utente sarà definitivamente cancellato dal sistema. Procedere?"
    );
    if (!confirmed) return;
    const doubleConfirm = window.confirm("Sei sicuro di voler eliminare questo utente? Conferma nuovamente.");
    if (!doubleConfirm) return;

    try {
      setDeleting(true);
      setDeleteError(null);
      const userKey =
        (editingOriginal as any)?.id ??
        (editingOriginal as any)?.email ??
        (editingOriginal as any)?.username ??
        editingId;



      // Delete user client navigation first.
      const navRows = await fetchAdminUserClientNavigation(userKey);
      const navIds = (Array.isArray(navRows) ? navRows : [])
        .map((row: any) => row?.id ?? row?.nav_id)
        .filter((value: any) => value !== undefined && value !== null);

      const navResults = await Promise.allSettled(
        navIds.map((navId: string | number) => deleteAdminUserClientNavigation(userKey, navId))
      );
      const navErrors = navResults
        .filter((res) => res.status === "rejected")
        .map((res) => (res as PromiseRejectedResult).reason)
        .filter(Boolean);

      if (navErrors.length) {
        const message =
          navErrors[0] instanceof Error
            ? navErrors[0].message
            : "Errore durante la cancellazione della navigazione client";
        throw new Error(message);
      }
      // Delete user permissions first.
      const perms = await fetchAdminUserPermissions(userKey);
      const permIds = (Array.isArray(perms) ? perms : [])
        .map((perm: any) => perm?.id ?? perm?.permission_id)
        .filter((value: any) => value !== undefined && value !== null);

      const results = await Promise.allSettled(
        permIds.map((permId: string | number) => deleteAdminUserPermission(userKey, permId))
      );
      const permErrors = results
        .filter((res) => res.status === "rejected")
        .map((res) => (res as PromiseRejectedResult).reason)
        .filter(Boolean);

      if (permErrors.length) {
        const message =
          permErrors[0] instanceof Error
            ? permErrors[0].message
            : "Errore durante la cancellazione dei permessi utente";
        throw new Error(message);
      }

      await deleteAdminUser(userKey);
      setUsers((prev) => prev.filter((u) => (u.id ?? u.email ?? u.username) !== editingId));
      cancelEdit();
    } catch (err: any) {
      console.error("Delete user error", err);
      setDeleteError(err?.message || "Errore durante la cancellazione");
    } finally {
      setDeleting(false);
    }
  };

  const onCreateUser = async () => {
    if (createStatus === "loading") return;
    setCreateError(null);
    setCreateFieldErrors({});

    const nextFieldErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    let bannerError: string | null = null;

    const username = createUser.name.trim();
    const email = createUser.email.trim();
    if (!username) {
      nextFieldErrors.name = "Nome obbligatorio.";
      bannerError ??= "Nome obbligatorio.";
    }
    if (!email) {
      nextFieldErrors.email = "Email obbligatoria.";
      bannerError ??= "Email obbligatoria.";
    } else if (!isValidEmail(email)) {
      nextFieldErrors.email = "Email non valida.";
      bannerError ??= "Email non valida.";
    }
    if (createUser.password !== createUser.confirmPassword) {
      nextFieldErrors.password = "Le password non coincidono.";
      nextFieldErrors.confirmPassword = "Le password non coincidono.";
      bannerError ??= "Le password non coincidono.";
    }

    if (bannerError) {
      setCreateFieldErrors(nextFieldErrors);
      setCreateError(bannerError);
      return;
    }
    try {
      setCreateStatus("loading");
      const payload: Record<string, unknown> = {
        username,
        email,
        active: createUser.active,
        isService: createUser.isService,
        password: createUser.password,
      };
      const created = await createAdminUser(payload);
      const createdRow: AdminUser = {
        ...created,
        username: created.username ?? username,
        email: created.email ?? email,
        active: typeof created.active === "boolean" ? created.active : createUser.active,
        isService: typeof created.isService === "boolean" ? created.isService : createUser.isService,
      };
      const userId = created.id ?? created.email ?? created.username;
      if (userId && createPermissions.length) {
        await Promise.all(
          createPermissions
            .filter((perm) => perm.locked || perm.permission_code.trim() || perm.resource_pattern.trim())
            .map((perm) =>
              createAdminUserPermission(userId, {
                http_method: perm.http_method,
                permission_code: perm.permission_code,
                resource_pattern: perm.resource_pattern,
                is_allowed: perm.is_allowed,
              })
            )
        );
      }

      if (userId) {
        const pages = Array.from(
          new Set(
            createClientNavigation
              .map((entry) => normalizeNavPageValue(entry.page))
              .filter(Boolean)
          )
        );
        if (!pages.includes("overview")) pages.unshift("overview");

        await Promise.all(pages.map((page) => createAdminUserClientNavigation(userId, { page })));
      }
      setUsers((prev) => [createdRow, ...prev]);
      resetCreateForm();
      setShowCreate(false);
    } catch (err: any) {
      console.error("Create user error", err);
      setCreateError(err?.message || "Errore durante la creazione dell'utente");
      setCreateStatus("idle");
      return;
    }
    setCreateStatus("idle");
  };

  return (
    <div className="space-y-4">
      <SectionHeader title="Users" subTitle="Gestione utenti amministrativi" />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          onClick={() => {
            setShowCreate((prev) => !prev);
            setEditingId(null);
            setEditingDraft(null);
            setEditingOriginal(null);
            setPermissions([]);
            setOriginalPermissions([]);
            setPermStatus("idle");
            setPermError(null);
          }}
        >
          <AppIcon icon="mdi:account-plus" className="h-4 w-4" />
          {showCreate ? "Chiudi creazione" : "Nuovo utente"}
        </button>
      </div>

      {showCreate && (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-base font-semibold text-slate-900">Crea nuovo utente</div>
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
          {createError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {createError}
            </div>
          )}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
              Nome
              <input
                type="text"
                value={createUser.name}
                onChange={(e) => {
                  const value = e.target.value;
                  setCreateUser((prev) => ({ ...prev, name: value }));
                  if (createFieldErrors.name || createError) {
                    setCreateFieldErrors((prev) => ({ ...prev, name: undefined }));
                    setCreateError(null);
                  }
                }}
                className={`rounded-md border bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none ${
                  createFieldErrors.name ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-blue-400"
                }`}
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
              Email
              <input
                type="email"
                value={createUser.email}
                onChange={(e) => {
                  const value = e.target.value;
                  setCreateUser((prev) => ({ ...prev, email: value }));
                  if (createFieldErrors.email || createError) {
                    setCreateFieldErrors((prev) => ({ ...prev, email: undefined }));
                    setCreateError(null);
                  }
                }}
                className={`rounded-md border bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none ${
                  createFieldErrors.email ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-blue-400"
                }`}
              />
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                <input
                  type="checkbox"
                  checked={createUser.active}
                  onChange={(e) => setCreateUser((prev) => ({ ...prev, active: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-semibold text-slate-700">Active</span>
              </label>
              <label className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                <input
                  type="checkbox"
                  checked={createUser.isService}
                  onChange={(e) => setCreateUser((prev) => ({ ...prev, isService: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-semibold text-slate-700">Service</span>
              </label>
              <label className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                <input
                  type="checkbox"
                  checked={createUser.isAdmin}
                  onChange={(e) => setCreateUser((prev) => ({ ...prev, isAdmin: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-semibold text-slate-700">Admin</span>
              </label>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
                Password
                <input
                  type="password"
                  value={createUser.password}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCreateUser((prev) => ({ ...prev, password: value }));
                    if (createFieldErrors.password || createFieldErrors.confirmPassword || createError) {
                      setCreateFieldErrors((prev) => ({
                        ...prev,
                        password: undefined,
                        confirmPassword: undefined,
                      }));
                      setCreateError(null);
                    }
                  }}
                  className={`rounded-md border bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none ${
                    createFieldErrors.password ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-blue-400"
                  }`}
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
                Conferma Password
                <input
                  type="password"
                  value={createUser.confirmPassword}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCreateUser((prev) => ({ ...prev, confirmPassword: value }));
                    if (createFieldErrors.password || createFieldErrors.confirmPassword || createError) {
                      setCreateFieldErrors((prev) => ({
                        ...prev,
                        password: undefined,
                        confirmPassword: undefined,
                      }));
                      setCreateError(null);
                    }
                  }}
                  className={`rounded-md border bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none ${
                    createFieldErrors.confirmPassword
                      ? "border-red-300 focus:border-red-400"
                      : "border-slate-200 focus:border-blue-400"
                  }`}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-800">Permessi</div>
              <button
                type="button"
                onClick={addCreatePermissionRow}
                className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <AppIcon icon="mdi:plus" className="h-4 w-4" />
                Aggiungi permesso
              </button>
            </div>
            {!createPermissions.length && (
              <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                Nessun permesso aggiunto. Premi "Aggiungi permesso".
              </div>
            )}
            {createPermissions.length > 0 && (
              <div className="space-y-2">
                {createPermissions.map((perm, idx) => (
                  <div key={`new-perm-${idx}`} className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
                    {!perm.locked && (
                      <div className="mb-2 flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => removeCreatePermissionRow(idx)}
                          className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                          aria-label="Rimuovi permesso"
                          title="Rimuovi permesso"
                        >
                          <AppIcon icon="mdi:trash-can-outline" className="h-4 w-4" />
                          Rimuovi
                        </button>
                      </div>
                    )}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {perm.locked && (
                        <div className="md:col-span-2 lg:col-span-3">
                          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                            Permesso di default (non modificabile)
                          </div>
                        </div>
                      )}
                      <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                        Permission code
                        <input
                          type="text"
                          value={perm.permission_code}
                          onChange={(e) => updateCreatePermission(idx, "permission_code", e.target.value)}
                          disabled={perm.locked}
                          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none"
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                        HTTP Method
                        <select
                          value={perm.http_method}
                          onChange={(e) => updateCreatePermission(idx, "http_method", e.target.value)}
                          disabled={perm.locked}
                          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none"
                        >
                          {HTTP_METHOD_OPTIONS.map((method) => (
                            <option key={method} value={method}>
                              {method}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                        Resource pattern
                        <input
                          type="text"
                          value={perm.resource_pattern}
                          onChange={(e) => updateCreatePermission(idx, "resource_pattern", e.target.value)}
                          disabled={perm.locked}
                          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none"
                        />
                      </label>
                      <label className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                        <input
                          type="checkbox"
                          checked={perm.is_allowed}
                          onChange={(e) => updateCreatePermission(idx, "is_allowed", e.target.checked)}
                          disabled={perm.locked}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-semibold text-slate-700">Allowed</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}

            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-800">Navigazione</div>
                <button
                  type="button"
                  onClick={addCreateNavRow}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <AppIcon icon="mdi:plus" className="h-4 w-4" />
                  Aggiungi pagina
                </button>
              </div>

              {!createClientNavigation.length && (
                <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  Nessuna pagina aggiunta.
                </div>
              )}

              {createClientNavigation.length > 0 && (
                <div className="space-y-2">
                  <datalist id="nav-pages">
                    {NAV_PAGE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} />
                    ))}
                  </datalist>

                  {createClientNavigation.map((entry, idx) => (
                    <div key={`new-nav-${idx}`} className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
                      {!entry.locked && (
                        <div className="mb-2 flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => removeCreateNavRow(idx)}
                            className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                            aria-label="Rimuovi pagina"
                            title="Rimuovi pagina"
                          >
                            <AppIcon icon="mdi:trash-can-outline" className="h-4 w-4" />
                            Rimuovi
                          </button>
                        </div>
                      )}

                      <div className="grid grid-cols-1 gap-3">
                        {entry.locked && (
                          <div>
                            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                              Pagina di default (Overview)
                            </div>
                          </div>
                        )}

                        <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                          Pagina
                          <input
                            type="text"
                            list="nav-pages"
                            value={entry.page}
                            onChange={(e) => updateCreateNav(idx, e.target.value)}
                            disabled={entry.locked}
                            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none"
                          />
                          <span className="text-[11px] font-normal normal-case text-slate-500">
                            Esempi: {NAV_PAGE_OPTIONS.map((o) => o.value).join(", ")}
                          </span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>


          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCreateUser}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
              disabled={createStatus === "loading"}
            >
              {createStatus === "loading" ? "Creazione..." : "Crea utente"}
            </button>
            <button
              type="button"
              onClick={resetCreateForm}
              className="rounded-md bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {status === "loading" && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Caricamento utenti...
        </div>
      )}

      {status === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error || "Errore durante il caricamento degli utenti."}
        </div>
      )}

      {status === "idle" && !rows.length && (
        <div className="rounded-lg border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-600">
          Nessun utente trovato.
        </div>
      )}

      {rows.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Nome</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Active</th>
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">Created</th>
                <th className="px-4 py-3 font-semibold">Updated</th>
                <th className="px-4 py-3 font-semibold">Last login</th>
                <th className="px-4 py-3 font-semibold text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {rows.map((user) => {
                const isEditing = editingId !== null && editingId === (user.id ?? user.email ?? user.username);
                if (isEditing && editingDraft) {
                  return (
                    <tr key={`edit-${user.id ?? user.email ?? user.username}`}>
                      <td colSpan={8} className="bg-slate-50 px-4 py-3">
                        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <div className="text-base font-semibold text-slate-900">
                                {getDisplayName(editingDraft)}
                              </div>
                              <div className="text-xs text-slate-500">ID: {editingDraft.id ?? "-"}</div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
                                disabled={saving || (!hasUserChanges() && changedPermissions.length === 0 && changedClientNavigation.length === 0)}
                                onClick={onSave}
                              >
                                {saving ? "Saving..." : "Save"}
                              </button>
                              <button
                                type="button"
                                className="rounded-md bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-600"
                                onClick={cancelEdit}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-60"
                                onClick={onDelete}
                                disabled={deleting}
                              >
                                {deleting ? "Deleting..." : "Delete this user"}
                              </button>
                            </div>
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
                            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600 md:col-span-1">
                              Email
                              <input
                                type="email"
                                value={(editingDraft.email as string) ?? ""}
                                onChange={(e) => updateDraft("email", e.target.value)}
                                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none"
                              />
                            </label>
                            <div className="flex items-center gap-3 md:justify-end md:col-span-1">
                              <label className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                                <input
                                  id={`active-${editingId}`}
                                  type="checkbox"
                                  checked={getFlag(editingDraft, ["active", "isActive", "is_active", "enabled"])}
                                  onChange={(e) => updateDraft("active", e.target.checked)}
                                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-semibold text-slate-700">Active</span>
                              </label>
                              <label className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                                <input
                                  id={`service-${editingId}`}
                                  type="checkbox"
                                  checked={getFlag(editingDraft, ["isService", "is_service", "service", "serviceAccount"])}
                                  onChange={(e) => updateDraft("isService", e.target.checked)}
                                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-semibold text-slate-700">Service</span>
                              </label>
                              <label className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                                <input
                                  id={`admin-${editingId}`}
                                  type="checkbox"
                                  checked={permissions.some((perm) => isAdminAllPermission(perm) && !isMarkedForDelete(perm))}
                                  onChange={(e) => toggleEditingAdmin(e.target.checked)}
                                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-semibold text-slate-700">Admin</span>
                              </label>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-3 md:grid-cols-4 text-sm text-slate-500">
                            <div>
                              <div className="text-[11px] uppercase tracking-wide">Nome</div>
                              <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-2">
                                {getDisplayName(editingDraft)}
                              </div>
                            </div>
                            <div>
                              <div className="text-[11px] uppercase tracking-wide">Created</div>
                              <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-2">
                                {formatDate(getDateField(editingDraft, ["createdAt", "created_at"]))}
                              </div>
                            </div>
                            <div>
                              <div className="text-[11px] uppercase tracking-wide">Updated</div>
                              <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-2">
                                {formatDate(getDateField(editingDraft, ["updatedAt", "updated_at"]))}
                              </div>
                            </div>
                            <div>
                              <div className="text-[11px] uppercase tracking-wide">Last login</div>
                              <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-2">
                                {formatDate(getDateField(editingDraft, ["lastLogin", "last_login", "last_login_at"]))}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-600">
                              <span>Permissions</span>
                              <div className="flex items-center gap-2">
                                {permStatus === "loading" && (
                                  <span className="text-[11px] text-slate-500">Caricamento...</span>
                                )}
                                <button
                                  type="button"
                                  onClick={addEditingPermissionRow}
                                  disabled={permStatus !== "idle"}
                                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
                                >
                                  <AppIcon icon="mdi:plus" className="h-4 w-4" />
                                  Aggiungi permesso
                                </button>
                              </div>
                            </div>
                            <div className="mt-2 space-y-3 text-sm text-slate-700">
                              {permStatus === "error" && (
                                <div className="text-red-600 text-xs">{permError || "Errore durante il caricamento permessi."}</div>
                              )}
                              {permStatus === "idle" && !permissions.length && (
                                <div className="text-xs text-slate-500">Nessun permesso assegnato.</div>
                              )}
                              {permStatus === "idle" && permissions.length > 0 && (
                                <div className="space-y-2">
                                  {permissions.map((perm, idx) => {
                                    if (isMarkedForDelete(perm)) return null;
                                    return (
                                      <div
                                        key={getPermissionClientId(perm) ?? String(getPermissionId(perm) ?? idx)}
                                        className="rounded-md border border-slate-200 bg-white p-3 shadow-sm"
                                      >
                                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-800">
                                        <span className="rounded bg-slate-100 px-2 py-1 text-[11px] uppercase tracking-wide">
                                          {`Perm ${perm?.id ?? idx + 1}`}
                                        </span>
                                        <span className="text-[11px] text-slate-500">
                                          Updated: {formatDate(getDateField(perm as any, ["updated_at", "updatedAt"]))}
                                        </span>
                                      </div>
                                      {!isDefaultPermission(perm) && (
                                        <div className="mt-2 flex items-center justify-end">
                                          <button
                                            type="button"
                                            onClick={() => removeEditingPermissionRow(idx)}
                                            className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                                            aria-label="Rimuovi permesso"
                                            title="Rimuovi permesso"
                                          >
                                            <AppIcon icon="mdi:trash-can-outline" className="h-4 w-4" />
                                            Rimuovi
                                          </button>
                                        </div>
                                      )}
                                      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                                        {isAdminAllPermission(perm) && !isMarkedForDelete(perm) && (
                                          <div className="md:col-span-2 lg:col-span-3">
                                            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                                              Permesso Admin (gestito dal flag Admin)
                                            </div>
                                          </div>
                                        )}
                                        {isReadMeDefaultPermission(perm) && !isMarkedForDelete(perm) && (
                                          <div className="md:col-span-2 lg:col-span-3">
                                            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                                              Permesso di default (non modificabile)
                                            </div>
                                          </div>
                                        )}
                                        <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                                          HTTP Method
                                          <select
                                            value={(perm as any)?.http_method ?? ""}
                                            onChange={(e) => updatePermissionField(idx, "http_method", e.target.value)}
                                            disabled={isDefaultPermission(perm) || isMarkedForDelete(perm)}
                                            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none"
                                          >
                                            {HTTP_METHOD_OPTIONS.map((method) => (
                                              <option key={method} value={method}>
                                                {method}
                                              </option>
                                            ))}
                                          </select>
                                        </label>
                                        <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                                          Permission Code
                                          <input
                                            type="text"
                                            value={(perm as any)?.permission_code ?? ""}
                                            onChange={(e) => updatePermissionField(idx, "permission_code", e.target.value)}
                                            disabled={isDefaultPermission(perm) || isMarkedForDelete(perm)}
                                            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none"
                                          />
                                        </label>
                                        <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                                          Resource Pattern
                                          <input
                                            type="text"
                                            value={(perm as any)?.resource_pattern ?? ""}
                                            onChange={(e) => updatePermissionField(idx, "resource_pattern", e.target.value)}
                                            disabled={isDefaultPermission(perm) || isMarkedForDelete(perm)}
                                            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none"
                                          />
                                        </label>
                                        <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                                          <input
                                            id={`perm-allow-${idx}`}
                                            type="checkbox"
                                            checked={!!(perm as any)?.is_allowed}
                                            onChange={(e) => updatePermissionField(idx, "is_allowed", e.target.checked)}
                                            disabled={isDefaultPermission(perm) || isMarkedForDelete(perm)}
                                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                          />
                                          <label htmlFor={`perm-allow-${idx}`} className="text-sm font-semibold text-slate-700">
                                            Allowed
                                          </label>
                                        </div>
                                        <div className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                                          Updated at
                                          <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                                            {formatDate(getDateField(perm as any, ["updated_at", "updatedAt"]))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-600">
                              <span>Client navigation</span>
                              <div className="flex items-center gap-2">
                                {navStatus === "loading" && (
                                  <span className="text-[11px] text-slate-500">Caricamento...</span>
                                )}
                                <button
                                  type="button"
                                  onClick={addEditingNavRow}
                                  disabled={navStatus !== "idle"}
                                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
                                >
                                  <AppIcon icon="mdi:plus" className="h-4 w-4" />
                                  Aggiungi pagina
                                </button>
                              </div>
                            </div>
                            <div className="mt-2 space-y-3 text-sm text-slate-700">
                              {navStatus === "error" && (
                                <div className="text-red-600 text-xs">
                                  {navError || "Errore durante il caricamento navigazione."}
                                </div>
                              )}
                              {navStatus === "idle" && !clientNavigation.length && (
                                <div className="text-xs text-slate-500">Nessuna pagina assegnata.</div>
                              )}
                              {navStatus === "idle" && clientNavigation.length > 0 && (
                                <div className="space-y-2">
                                  <datalist id="nav-pages-edit">
                                    {NAV_PAGE_OPTIONS.map((opt) => (
                                      <option key={opt.value} value={opt.value} />
                                    ))}
                                  </datalist>

                                  {clientNavigation.map((entry: any, navIdx: number) => {
                                    if (isNavMarkedForDelete(entry)) return null;
                                    const navId = entry?.id ?? entry?.nav_id;
                                    return (
                                      <div
                                        key={getNavClientId(entry) ?? String(navId ?? navIdx)}
                                        className="rounded-md border border-slate-200 bg-white p-3 shadow-sm"
                                      >
                                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-800">
                                          <span className="rounded bg-slate-100 px-2 py-1 text-[11px] uppercase tracking-wide">
                                            {`Page ${navId ?? navIdx + 1}`}
                                          </span>
                                          <span className="text-[11px] text-slate-500">
                                            Created: {formatDate(getDateField(entry as any, ["created_at", "createdAt"]))}
                                          </span>
                                        </div>

                                        {!isNavDefault(entry) && (
                                          <div className="mt-2 flex items-center justify-end">
                                            <button
                                              type="button"
                                              onClick={() => removeEditingNavRow(navIdx)}
                                              className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                                              aria-label="Rimuovi pagina"
                                              title="Rimuovi pagina"
                                            >
                                              <AppIcon icon="mdi:trash-can-outline" className="h-4 w-4" />
                                              Rimuovi
                                            </button>
                                          </div>
                                        )}

                                        <div className="mt-3 grid grid-cols-1 gap-3">
                                          {isNavDefault(entry) && (
                                            <div>
                                              <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                                                Pagina di default (Overview)
                                              </div>
                                            </div>
                                          )}

                                          <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                                            Pagina
                                            <input
                                              type="text"
                                              list="nav-pages-edit"
                                              value={String(entry?.page ?? "")}
                                              onChange={(e) => updateNavField(navIdx, e.target.value)}
                                              disabled={isNavDefault(entry) || isNavMarkedForDelete(entry)}
                                              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none"
                                            />
                                            <span className="text-[11px] font-normal normal-case text-slate-500">
                                              Esempi: {NAV_PAGE_OPTIONS.map((o) => o.value).join(", ")}
                                            </span>
                                          </label>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={user.id ?? user.email ?? user.username}>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {getDisplayName(user)}
                    </td>
                    <td className="px-4 py-3">{user.email ?? "-"}</td>
                    <td className="px-4 py-3">
                      {(() => {
                        const active = getFlag(user, ["active", "isActive", "is_active", "enabled"]);
                        return (
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                              active ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {flagLabel(active)}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-4 py-3">
                      {(() => {
                        const service = getFlag(user, ["isService", "is_service", "service", "serviceAccount"]);
                        return (
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            service ? "bg-indigo-50 text-indigo-700" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {flagLabel(service)}
                        </span>
                        );
                      })()}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatDate(getDateField(user, ["createdAt", "created_at"]))}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatDate(getDateField(user, ["updatedAt", "updated_at"]))}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatDate(getDateField(user, ["lastLogin", "last_login", "last_login_at"]))}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-blue-700"
                        onClick={() => startEdit(user)}
                        aria-label="Modifica utente"
                      >
                        <AppIcon icon="mdi:pencil" className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UsersPage;
