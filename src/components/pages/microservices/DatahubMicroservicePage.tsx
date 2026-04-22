import { useCallback, useEffect, useMemo, useState } from "react";
import MicroserviceGeneralTab from "../../molecules/microservice/MicroserviceGeneralTab";
import AppIcon from "../../atoms/icon/AppIcon";
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
  initialTab?: "general" | "tables" | "export";
  lockToTab?: "general" | "tables" | "export" | null;
};

type SchemaInfo = {
  tables?: string[];
  tablesDetailed?: Array<{ name: string; schema?: string; type?: string }>;
  tablesBySchema?: Record<string, string[]>;
  manualRoutes?: Array<{ name: string; path: string }>;
  lastRefresh?: string | null;
  totalEndpoints?: number;
};

type TableData = {
  data: any[];
  count?: number;
  total?: number;
  limit?: number;
  offset?: number;
};

type CachingConfig = {
  tableName: string;
  enabled: boolean;
  ttl: number;
  createdAt?: string;
  updatedAt?: string;
};

/**
 * Componente per la gestione della pagina del microservizio datahub
 *
 * Questo componente gestisce:
 * - Tab "General Settings": impostazioni comuni (DB Logger, Log Level, Communication Channels, Logs)
 * - Tab "Tables": navigazione e visualizzazione dati delle tabelle del database
 */
export default function DatahubMicroservicePage({
  onReleaseChange,
  onHealthChange,
  onOpenReleaseModal,
  initialTab = "general",
  lockToTab = null,
}: Props) {
  // Gestione tab attivo
  const [activeTab, setActiveTab] = useState<"general" | "tables" | "export">(initialTab);

  // Stato per il tab Tables
  const [schema, setSchema] = useState<SchemaInfo | null>(null);
  const [schemaStatus, setSchemaStatus] = useState<Status>("idle");
  const [schemaError, setSchemaError] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [tableDataStatus, setTableDataStatus] = useState<Status>("idle");
  const [tableDataError, setTableDataError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(100);
  const [showColumnsModal, setShowColumnsModal] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

  // Stato per il caching
  const [cachingConfig, setCachingConfig] = useState<CachingConfig | null>(null);
  const [cachingStatus, setCachingStatus] = useState<Status>("idle");
  const [ttlEnabled, setTtlEnabled] = useState(false);

  // Stato per i filtri
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [filterModalColumn, setFilterModalColumn] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState("");
  const [filterOperator, setFilterOperator] = useState("=");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [isDateColumn, setIsDateColumn] = useState(false);

  // Stato per il tab Export
  const [archiveMonths, setArchiveMonths] = useState(6);
  const [archiveStatus, setArchiveStatus] = useState<Status>("idle");
  const [archiveResult, setArchiveResult] = useState<{
    archived: number;
    deleted: number;
    files: Array<{ filename: string; ym: string; count: number; sizeBytes: number }>;
    message?: string;
  } | null>(null);
  const [archiveError, setArchiveError] = useState<string | null>(null);
  const [archiveFiles, setArchiveFiles] = useState<
    Array<{ filename: string; sizeBytes: number; createdAt: string; modifiedAt: string }>
  >([]);
  const [archiveListStatus, setArchiveListStatus] = useState<Status>("idle");
  const [archiveListError, setArchiveListError] = useState<string | null>(null);
  const [restoringFile, setRestoringFile] = useState<string | null>(null);
  const [restoreResultByFile, setRestoreResultByFile] = useState<Record<string, number>>({});
  const [restoreErrorByFile, setRestoreErrorByFile] = useState<Record<string, string>>({});

  const token =
    typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;

  /**
   * Carica lo schema dal datahub
   */
  const fetchSchema = useCallback(async () => {
    setSchemaStatus("loading");
    setSchemaError(null);
    try {
      const res = await fetch(`${env.apiBaseUrl}/datahub/api/schema`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || data?.message || "Errore caricamento schema");
      }
      setSchema(data);
      setSchemaStatus("idle");
    } catch (err: any) {
      setSchemaStatus("error");
      setSchemaError(err?.message || "Errore caricamento schema");
    }
  }, [token]);

  /**
   * Carica i dati di una tabella specifica
   */
  const fetchTableData = useCallback(
    async (tableName: string, offset: number = 0, filters: Record<string, string> = {}) => {
      setTableDataStatus("loading");
      setTableDataError(null);
      try {
        // Build query string with filters
        const params = new URLSearchParams({
          limit: pageSize.toString(),
          offset: offset.toString(),
        });

        // Add filters to query string
        Object.entries(filters).forEach(([key, value]) => {
          params.append(key, value);
        });

        const res = await fetch(
          `${env.apiBaseUrl}/datahub/api/table/${tableName}?${params.toString()}`,
          {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data?.ok === false) {
          throw new Error(data?.error || data?.message || "Errore caricamento dati tabella");
        }
        setTableData(data);
        setTableDataStatus("idle");
      } catch (err: any) {
        setTableDataStatus("error");
        setTableDataError(err?.message || "Errore caricamento dati tabella");
      }
    },
    [token, pageSize]
  );

  /**
   * Carica la configurazione del caching per una tabella
   */
  const fetchCachingConfig = useCallback(
    async (tableName: string) => {
      setCachingStatus("loading");
      try {
        const res = await fetch(`${env.apiBaseUrl}/datahub/api/caching/${tableName}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data?.ok === false) {
          throw new Error(data?.error || "Errore caricamento configurazione caching");
        }
        setCachingConfig(data.data);
        setTtlEnabled(data.data.ttl > 0);
        setCachingStatus("idle");
      } catch (err: any) {
        setCachingStatus("error");
        console.error("Error fetching caching config:", err);
      }
    },
    [token]
  );

  /**
   * Aggiorna la configurazione del caching per una tabella
   */
  const updateCachingConfig = useCallback(
    async (tableName: string, enabled: boolean, ttl: number) => {
      setCachingStatus("loading");
      try {
        const res = await fetch(`${env.apiBaseUrl}/datahub/api/caching/${tableName}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ enabled, ttl }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data?.ok === false) {
          throw new Error(data?.error || "Errore aggiornamento configurazione caching");
        }
        setCachingConfig(data.data);
        setTtlEnabled(data.data.ttl > 0);
        setCachingStatus("idle");
      } catch (err: any) {
        setCachingStatus("error");
        console.error("Error updating caching config:", err);
      }
    },
    [token]
  );

  /**
   * Gestisce il cambio di tabella selezionata
   */
  const handleTableSelect = useCallback(
    (tableName: string) => {
      setSelectedTable(tableName);
      setCurrentPage(0);
      setActiveFilters({}); // Reset filters when changing table
      fetchTableData(tableName, 0, {});
      fetchCachingConfig(tableName);
    },
    [fetchTableData, fetchCachingConfig]
  );

  /**
   * Gestisce il cambio pagina
   */
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (!selectedTable) return;
      setCurrentPage(newPage);
      fetchTableData(selectedTable, newPage * pageSize, activeFilters);
    },
    [selectedTable, pageSize, fetchTableData, activeFilters]
  );

  /**
   * Gestisce il cambio di dimensione pagina (limit)
   */
  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      if (!selectedTable) return;
      setPageSize(newSize);
      setCurrentPage(0); // Reset to first page
      fetchTableData(selectedTable, 0, activeFilters);
    },
    [selectedTable, fetchTableData, activeFilters]
  );

  /**
   * Rileva se una colonna contiene date
   */
  const isDateColumnCheck = useCallback((columnName: string): boolean => {
    if (!tableData?.data || tableData.data.length === 0) return false;

    // Check first few non-null values
    for (let i = 0; i < Math.min(5, tableData.data.length); i++) {
      const value = tableData.data[i][columnName];
      if (value != null && value !== "") {
        const strValue = String(value);
        // Check for ISO date format (YYYY-MM-DD) or datetime format
        const datePattern = /^\d{4}-\d{2}-\d{2}(T|\s|$)/;
        if (datePattern.test(strValue)) {
          return true;
        }
      }
    }
    return false;
  }, [tableData]);

  /**
   * Apre il modal per impostare un filtro su una colonna
   */
  const handleOpenFilterModal = useCallback((columnName: string) => {
    setFilterModalColumn(columnName);

    // Check if this is a date column
    const isDate = isDateColumnCheck(columnName);
    setIsDateColumn(isDate);

    // Pre-fill with existing filters
    const existingFilterGte = activeFilters[`${columnName}__gte`];
    const existingFilterLte = activeFilters[`${columnName}__lte`];
    const existingFilterLt = activeFilters[`${columnName}__lt`];
    const existingFilterSimple = activeFilters[columnName];

    if (isDate && (existingFilterGte || existingFilterLte || existingFilterLt)) {
      // Date range filters
      setFilterDateFrom(existingFilterGte || "");

      // If using __lt (less than), subtract 1 day to show the actual end date
      if (existingFilterLt) {
        const [year, month, day] = existingFilterLt.split('-').map(Number);
        const ltDate = new Date(Date.UTC(year, month - 1, day));
        ltDate.setUTCDate(ltDate.getUTCDate() - 1);
        const actualEndDate = ltDate.toISOString().split('T')[0];
        setFilterDateTo(actualEndDate);
      } else {
        setFilterDateTo(existingFilterLte || "");
      }
    } else if (existingFilterSimple) {
      // Simple filter with operator
      if (existingFilterSimple.startsWith(">=")) {
        setFilterOperator(">=");
        setFilterValue(existingFilterSimple.slice(2));
      } else if (existingFilterSimple.startsWith("<=")) {
        setFilterOperator("<=");
        setFilterValue(existingFilterSimple.slice(2));
      } else if (existingFilterSimple.startsWith(">")) {
        setFilterOperator(">");
        setFilterValue(existingFilterSimple.slice(1));
      } else if (existingFilterSimple.startsWith("<")) {
        setFilterOperator("<");
        setFilterValue(existingFilterSimple.slice(1));
      } else {
        setFilterOperator("=");
        setFilterValue(existingFilterSimple);
      }
    } else {
      // Reset to defaults
      setFilterOperator("=");
      setFilterValue("");
      setFilterDateFrom("");
      setFilterDateTo("");
    }
  }, [activeFilters, isDateColumnCheck]);

  /**
   * Applica il filtro alla colonna corrente
   */
  const handleApplyFilter = useCallback(() => {
    if (!filterModalColumn || !selectedTable) return;

    const newFilters = { ...activeFilters };

    // Remove any existing filters for this column
    delete newFilters[filterModalColumn];
    delete newFilters[`${filterModalColumn}__gte`];
    delete newFilters[`${filterModalColumn}__lte`];
    delete newFilters[`${filterModalColumn}__gt`];
    delete newFilters[`${filterModalColumn}__lt`];
    delete newFilters[`${filterModalColumn}__eq`];

    if (isDateColumn) {
      // Date range filter
      if (filterDateFrom) {
        newFilters[`${filterModalColumn}__gte`] = filterDateFrom;
      }
      if (filterDateTo) {
        // Add one day to include the entire end date (00:00:00 to 23:59:59)
        // Parse date components and use UTC to avoid timezone issues
        const [year, month, day] = filterDateTo.split('-').map(Number);
        const endDate = new Date(Date.UTC(year, month - 1, day));
        endDate.setUTCDate(endDate.getUTCDate() + 1);
        const nextDay = endDate.toISOString().split('T')[0];
        newFilters[`${filterModalColumn}__lt`] = nextDay; // Use < instead of <=
      }
    } else {
      // Simple filter with operator
      if (filterValue.trim()) {
        const filterWithOperator = filterOperator === "="
          ? filterValue.trim()
          : `${filterOperator}${filterValue.trim()}`;

        newFilters[filterModalColumn] = filterWithOperator;
      }
    }

    setActiveFilters(newFilters);
    setCurrentPage(0);
    fetchTableData(selectedTable, 0, newFilters);
    setFilterModalColumn(null);
    setFilterValue("");
    setFilterOperator("=");
    setFilterDateFrom("");
    setFilterDateTo("");
    setIsDateColumn(false);
  }, [
    filterModalColumn,
    filterValue,
    filterOperator,
    filterDateFrom,
    filterDateTo,
    isDateColumn,
    activeFilters,
    selectedTable,
    fetchTableData,
  ]);

  /**
   * Rimuove il filtro dalla colonna corrente
   */
  const handleRemoveFilter = useCallback(() => {
    if (!filterModalColumn || !selectedTable) return;

    const newFilters = { ...activeFilters };
    // Remove all possible filter variations for this column
    delete newFilters[filterModalColumn];
    delete newFilters[`${filterModalColumn}__gte`];
    delete newFilters[`${filterModalColumn}__lte`];
    delete newFilters[`${filterModalColumn}__gt`];
    delete newFilters[`${filterModalColumn}__lt`];
    delete newFilters[`${filterModalColumn}__eq`];

    setActiveFilters(newFilters);
    setCurrentPage(0);
    fetchTableData(selectedTable, 0, newFilters);
    setFilterModalColumn(null);
    setFilterValue("");
    setFilterOperator("=");
    setFilterDateFrom("");
    setFilterDateTo("");
    setIsDateColumn(false);
  }, [filterModalColumn, activeFilters, selectedTable, fetchTableData]);

  /**
   * Refresh dello schema
   */
  const handleRefreshSchema = useCallback(async () => {
    setSchemaStatus("loading");
    setSchemaError(null);
    try {
      const res = await fetch(`${env.apiBaseUrl}/datahub/api/refresh`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || data?.message || "Errore refresh schema");
      }
      await fetchSchema();
    } catch (err: any) {
      setSchemaStatus("error");
      setSchemaError(err?.message || "Errore refresh schema");
    }
  }, [fetchSchema, token]);

  // Carica lo schema quando si entra nel tab Tables
  useEffect(() => {
    if (activeTab === "tables" && !schema) {
      fetchSchema();
    }
  }, [activeTab, schema, fetchSchema]);

  // Gestione lockToTab
  useEffect(() => {
    if (lockToTab && activeTab !== lockToTab) {
      setActiveTab(lockToTab);
    }
  }, [activeTab, lockToTab]);

  // Ottieni tutte le colonne disponibili dalla tabella corrente
  const availableColumns = useMemo(() => {
    if (!tableData?.data || tableData.data.length === 0) return [];
    return Object.keys(tableData.data[0]);
  }, [tableData?.data]);

  // Carica/salva le colonne visibili dal/nel localStorage
  useEffect(() => {
    if (!selectedTable || availableColumns.length === 0) return;

    const storageKey = `datahub:visible-columns:${selectedTable}`;
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Verifica che le colonne salvate esistano ancora
        const validColumns = parsed.filter((col: string) => availableColumns.includes(col));
        setVisibleColumns(validColumns.length > 0 ? validColumns : availableColumns);
      } catch {
        setVisibleColumns(availableColumns);
      }
    } else {
      setVisibleColumns(availableColumns);
    }
  }, [selectedTable, availableColumns]);

  // Salva le colonne visibili quando cambiano
  const handleToggleColumn = useCallback(
    (column: string) => {
      if (!selectedTable) return;

      setVisibleColumns((prev) => {
        const newVisible = prev.includes(column)
          ? prev.filter((col) => col !== column)
          : [...prev, column];

        // Salva nel localStorage
        const storageKey = `datahub:visible-columns:${selectedTable}`;
        localStorage.setItem(storageKey, JSON.stringify(newVisible));

        return newVisible;
      });
    },
    [selectedTable]
  );

  // Seleziona/deseleziona tutte le colonne
  const handleToggleAllColumns = useCallback(
    (selectAll: boolean) => {
      if (!selectedTable) return;

      const newVisible = selectAll ? availableColumns : [];
      setVisibleColumns(newVisible);

      // Salva nel localStorage
      const storageKey = `datahub:visible-columns:${selectedTable}`;
      localStorage.setItem(storageKey, JSON.stringify(newVisible));
    },
    [selectedTable, availableColumns]
  );

  const totalPages = tableData?.total ? Math.ceil(tableData.total / pageSize) : 0;

  /**
   * Carica la lista dei file archiviati
   */
  const fetchArchiveList = useCallback(async () => {
    setArchiveListStatus("loading");
    setArchiveListError(null);
    try {
      const res = await fetch(`${env.apiBaseUrl}/datahub/api/custom/logsArchive/list`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || "Errore caricamento lista archivi");
      }
      setArchiveFiles(data.items ?? []);
      setArchiveListStatus("idle");
    } catch (err: any) {
      setArchiveListStatus("error");
      setArchiveListError(err?.message || "Errore caricamento lista archivi");
    }
  }, [token]);

  // Carica la lista archivi quando si entra nel tab Export
  useEffect(() => {
    if (activeTab === "export") {
      fetchArchiveList();
    }
  }, [activeTab, fetchArchiveList]);

  /**
   * Avvia l'archiviazione dei log più vecchi di N mesi
   */
  const handleArchive = useCallback(async () => {
    setArchiveStatus("loading");
    setArchiveError(null);
    setArchiveResult(null);
    try {
      const res = await fetch(`${env.apiBaseUrl}/datahub/api/custom/logsArchive/archive`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ months_to_keep: archiveMonths }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || "Errore durante l'archiviazione");
      }
      setArchiveResult(data);
      setArchiveStatus("idle");
      // Aggiorna la lista dei file
      fetchArchiveList();
    } catch (err: any) {
      setArchiveStatus("error");
      setArchiveError(err?.message || "Errore durante l'archiviazione");
    }
  }, [token, archiveMonths, fetchArchiveList]);

  /**
   * Ripristina un file archiviato nel DB
   */
  const handleRestore = useCallback(async (filename: string) => {
    setRestoringFile(filename);
    setRestoreErrorByFile((prev) => { const next = { ...prev }; delete next[filename]; return next; });
    setRestoreResultByFile((prev) => { const next = { ...prev }; delete next[filename]; return next; });
    try {
      const res = await fetch(
        `${env.apiBaseUrl}/datahub/api/custom/logsArchive/restore/${encodeURIComponent(filename)}`,
        {
          method: "POST",
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || "Errore durante il ripristino");
      }
      setRestoreResultByFile((prev) => ({ ...prev, [filename]: data.restored ?? 0 }));
    } catch (err: any) {
      setRestoreErrorByFile((prev) => ({
        ...prev,
        [filename]: err?.message || "Errore durante il ripristino",
      }));
    } finally {
      setRestoringFile(null);
    }
  }, [token]);

  // Filtra le tabelle di sistema (quelle che iniziano con __)
  const userTables = useMemo(() => {
    return schema?.tables?.filter((table) => !table.startsWith("__")) || [];
  }, [schema?.tables]);

  const groupedUserTables = useMemo(() => {
    const grouped = schema?.tablesBySchema || {};
    const entries = Object.entries(grouped)
      .map(([schemaName, tableNames]) => [
        schemaName,
        (Array.isArray(tableNames) ? tableNames : []).filter((table) => !String(table).startsWith("__")),
      ] as const)
      .filter(([, tableNames]) => tableNames.length > 0);

    if (entries.length > 0) {
      return entries;
    }

    if (userTables.length > 0) {
      return [["Tables", userTables]] as Array<[string, string[]]>;
    }

    return [] as Array<[string, string[]]>;
  }, [schema?.tablesBySchema, userTables]);

  /**
   * Controlla se una colonna ha filtri attivi (inclusi quelli con suffissi)
   */
  const hasActiveFilter = useCallback((columnName: string): boolean => {
    return !!(
      activeFilters[columnName] ||
      activeFilters[`${columnName}__gte`] ||
      activeFilters[`${columnName}__lte`] ||
      activeFilters[`${columnName}__gt`] ||
      activeFilters[`${columnName}__lt`] ||
      activeFilters[`${columnName}__eq`]
    );
  }, [activeFilters]);

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      {/* BARRA DEI TAB */}
      {!lockToTab && (
        <div className="flex gap-6 border-b border-slate-200">
          {/* Tab General Settings */}
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

          {/* Tab Tables */}
          <button
            type="button"
            className={`pb-2 text-xs font-semibold transition ${
              activeTab === "tables"
                ? "border-b-2 border-slate-900 text-slate-900"
                : "text-slate-500"
            }`}
            onClick={() => setActiveTab("tables")}
          >
            Tables
          </button>

          {/* Tab Export */}
          <button
            type="button"
            className={`pb-2 text-xs font-semibold transition ${
              activeTab === "export"
                ? "border-b-2 border-slate-900 text-slate-900"
                : "text-slate-500"
            }`}
            onClick={() => setActiveTab("export")}
          >
            Export
          </button>
        </div>
      )}

      {/* CONTENUTO DEI TAB */}

      {/* Tab General: Usa il componente condiviso */}
      {activeTab === "general" && (
        <div className="flex-1 min-h-0 flex flex-col">
          <MicroserviceGeneralTab
            microservice="datahub"
            onReleaseChange={onReleaseChange}
            onHealthChange={onHealthChange}
            onOpenReleaseModal={onOpenReleaseModal}
          />
        </div>
      )}

      {/* Tab Tables: Menu a sinistra + Dati a destra */}
      {activeTab === "tables" && (
        <div className="mt-4 flex flex-1 min-h-0 gap-4">
          {/* Menu a sinistra con lista tabelle */}
          <div className="w-64 flex-shrink-0 flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-4 py-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">Tables</div>
                <div className="text-[10px] text-slate-500">
                  {userTables.length} tabelle
                </div>
              </div>
              <button
                type="button"
                className="rounded-md border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                onClick={handleRefreshSchema}
                disabled={schemaStatus === "loading"}
              >
                {schemaStatus === "loading" ? "..." : "Refresh"}
              </button>
            </div>

            {schemaError && (
              <div className="px-4 py-2 text-[10px] text-rose-600">{schemaError}</div>
            )}

            <div className="flex-1 overflow-y-auto">
              {schemaStatus === "loading" && !schema && (
                <div className="px-4 py-4 text-center text-[11px] text-slate-400">
                  Caricamento...
                </div>
              )}

              {userTables.length > 0 && (
                <div className="p-2 space-y-3">
                  {groupedUserTables.map(([schemaName, tableNames]) => (
                    <div key={schemaName} className="space-y-1">
                      <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        {schemaName}
                      </div>
                      {tableNames.map((tableName) => (
                        <button
                          key={`${schemaName}:${tableName}`}
                          type="button"
                          className={`w-full rounded-md px-3 py-2 text-left text-[11px] font-medium transition ${
                            selectedTable === tableName
                              ? "bg-slate-900 text-white"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                          onClick={() => handleTableSelect(tableName)}
                        >
                          {tableName}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {schema && userTables.length === 0 && (
                <div className="px-4 py-4 text-center text-[11px] text-slate-400">
                  Nessuna tabella trovata
                </div>
              )}
            </div>
          </div>

          {/* Contenuto a destra: diviso in controlli (20%) + dati (80%) */}
          <div className="flex-1 min-h-0 flex flex-col gap-4">
            {!selectedTable && (
              <div className="flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm text-[11px] text-slate-400">
                Seleziona una tabella per visualizzare i dati
              </div>
            )}

            {selectedTable && (
              <>
                {/* Riga superiore: API Endpoints (50%) + Controls (50%) */}
                <div className="h-[20%] min-h-[120px] flex gap-4">
                  {/* Colonna 1: API Endpoints */}
                  <div className="flex-1 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="border-b border-slate-100 px-4 py-2 bg-slate-50">
                      <div className="text-xs font-semibold text-slate-900">API Endpoints</div>
                      <div className="text-[10px] text-slate-500">
                        Endpoint generati automaticamente
                      </div>
                    </div>

                    <div className="p-4 overflow-auto h-[calc(100%-60px)]">
                      <div className="space-y-2">
                        {/* GET all */}
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 min-w-[45px] justify-center">
                            GET
                          </span>
                          <span className="text-[11px] font-mono text-slate-600">
                            /api/table/{selectedTable}
                          </span>
                        </div>

                        {/* GET by key */}
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 min-w-[45px] justify-center">
                            GET
                          </span>
                          <span className="text-[11px] font-mono text-slate-600">
                            /api/table/{selectedTable}/&#123;key&#125;
                          </span>
                        </div>

                        {/* POST */}
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 min-w-[45px] justify-center">
                            POST
                          </span>
                          <span className="text-[11px] font-mono text-slate-600">
                            /api/table/{selectedTable}
                          </span>
                        </div>

                        {/* PUT */}
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 min-w-[45px] justify-center">
                            PUT
                          </span>
                          <span className="text-[11px] font-mono text-slate-600">
                            /api/table/{selectedTable}/&#123;key&#125;
                          </span>
                        </div>

                        {/* DELETE */}
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700 min-w-[45px] justify-center">
                            DELETE
                          </span>
                          <span className="text-[11px] font-mono text-slate-600">
                            /api/table/{selectedTable}/&#123;key&#125;
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Colonna 2: Controls per il caching */}
                  <div className="flex-1 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="border-b border-slate-100 px-4 py-2 bg-slate-50">
                      <div className="text-xs font-semibold text-slate-900">Cache Controls</div>
                      <div className="text-[10px] text-slate-500">
                        Configurazione caching Redis
                      </div>
                    </div>

                    <div className="p-4 h-[calc(100%-60px)] flex flex-col gap-3">
                      {cachingStatus === "loading" && (
                        <div className="text-[11px] text-slate-400">Caricamento configurazione...</div>
                      )}

                      {cachingStatus === "error" && (
                        <div className="text-[11px] text-rose-600">
                          Errore caricamento configurazione caching
                        </div>
                      )}

                      {cachingStatus === "idle" && !cachingConfig && (
                        <div className="text-[11px] text-slate-400">
                          Nessuna configurazione disponibile
                        </div>
                      )}

                      {cachingStatus === "idle" && cachingConfig && (
                        <>
                          {/* Switch per abilitare/disabilitare cache */}
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-[11px] font-semibold text-slate-900">
                                Cache abilitata
                              </div>
                              <div className="text-[10px] text-slate-500">
                                Attiva caching Redis per questa tabella
                              </div>
                            </div>
                            <button
                              type="button"
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                                cachingConfig.enabled ? "bg-slate-900" : "bg-slate-200"
                              }`}
                              onClick={() =>
                                updateCachingConfig(
                                  selectedTable,
                                  !cachingConfig.enabled,
                                  cachingConfig.ttl
                                )
                              }
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                  cachingConfig.enabled ? "translate-x-6" : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>

                          {/* Checkbox per abilitare TTL */}
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="ttl-enabled"
                              checked={ttlEnabled}
                              onChange={(e) => {
                                const enabled = e.target.checked;
                                setTtlEnabled(enabled);
                                if (!enabled) {
                                  updateCachingConfig(selectedTable, cachingConfig.enabled, 0);
                                }
                              }}
                              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                            />
                            <label
                              htmlFor="ttl-enabled"
                              className="text-[11px] font-medium text-slate-700 cursor-pointer"
                            >
                              Abilita TTL (Time To Live)
                            </label>
                          </div>

                          {/* Campo numerico per TTL */}
                          {ttlEnabled && (
                            <div>
                              <label className="block text-[10px] font-medium text-slate-700 mb-1">
                                TTL (secondi)
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="1"
                                  value={cachingConfig.ttl || 0}
                                  onChange={(e) => {
                                    const newTtl = parseInt(e.target.value) || 0;
                                    setCachingConfig({ ...cachingConfig, ttl: newTtl });
                                  }}
                                  onBlur={(e) => {
                                    const newTtl = parseInt(e.target.value) || 0;
                                    if (newTtl > 0) {
                                      updateCachingConfig(
                                        selectedTable,
                                        cachingConfig.enabled,
                                        newTtl
                                      );
                                    }
                                  }}
                                  className="flex-1 rounded-md border border-slate-200 px-3 py-1.5 text-[11px] text-slate-700"
                                  placeholder="Es. 300"
                                />
                                <button
                                  type="button"
                                  className="rounded-md bg-slate-900 px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-slate-800"
                                  onClick={() =>
                                    updateCachingConfig(
                                      selectedTable,
                                      cachingConfig.enabled,
                                      cachingConfig.ttl
                                    )
                                  }
                                >
                                  Salva
                                </button>
                              </div>
                              <div className="mt-1 text-[9px] text-slate-500">
                                0 = nessuna scadenza
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Scheda dati (80%) */}
                <div className="flex-1 min-h-0 flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 px-4 py-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{selectedTable}</div>
                      <div className="text-[10px] text-slate-500">
                        {tableData?.total
                          ? `${tableData.total} record totali`
                          : "Nessun dato disponibile"}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                      onClick={() => setShowColumnsModal(true)}
                      title="Seleziona colonne"
                    >
                      <AppIcon icon="mdi:view-column" className="h-4 w-4" />
                    </button>
                  </div>

                  {tableDataError && (
                    <div className="px-4 py-2 text-[10px] text-rose-600">{tableDataError}</div>
                  )}

                  {tableDataStatus === "loading" && (
                    <div className="flex flex-1 items-center justify-center text-[11px] text-slate-400">
                      Caricamento dati...
                    </div>
                  )}

                  {tableDataStatus === "idle" && tableData && (
                    <>
                      <div className="flex-1 overflow-auto">
                        <table className="w-full text-left text-[11px] text-slate-600">
                          <thead className="sticky top-0 bg-slate-50 text-[10px] uppercase text-slate-400">
                            <tr>
                              {tableData.data &&
                                tableData.data.length > 0 &&
                                Object.keys(tableData.data[0])
                                  .filter((key) => visibleColumns.includes(key))
                                  .map((key) => (
                                    <th key={key} className="px-3 py-2 whitespace-nowrap">
                                      <div className="flex items-center gap-1.5">
                                        <span>{key}</span>
                                        <button
                                          type="button"
                                          onClick={() => handleOpenFilterModal(key)}
                                          className="p-0.5 hover:bg-slate-200 rounded transition"
                                          title={hasActiveFilter(key) ? "Filtro attivo" : "Aggiungi filtro"}
                                        >
                                          <AppIcon
                                            icon={hasActiveFilter(key) ? "mdi:filter" : "mdi:filter-outline"}
                                            className={`h-3.5 w-3.5 ${
                                              hasActiveFilter(key) ? "text-slate-900" : "text-slate-400"
                                            }`}
                                          />
                                        </button>
                                      </div>
                                    </th>
                                  ))}
                            </tr>
                          </thead>
                          <tbody>
                            {tableData.data &&
                              tableData.data.map((row, rowIndex) => (
                                <tr key={rowIndex} className="border-t border-slate-100">
                                  {Object.entries(row)
                                    .filter(([key]) => visibleColumns.includes(key))
                                    .map(([, value], colIndex) => (
                                      <td key={colIndex} className="px-3 py-2 whitespace-nowrap">
                                        {value === null
                                          ? "-"
                                          : typeof value === "object"
                                            ? JSON.stringify(value)
                                            : String(value)}
                                      </td>
                                    ))}
                                </tr>
                              ))}
                          </tbody>
                        </table>

                        {tableData.data && tableData.data.length === 0 && (
                          <div className="px-4 py-8 text-center text-[11px] text-slate-400">
                            Nessun dato disponibile
                          </div>
                        )}
                      </div>

                      {/* Paginazione */}
                      <div className="border-t border-slate-100 px-4 py-3 flex items-center justify-between gap-4">
                        <div className="text-[10px] text-slate-500">
                          {tableData.count} di {tableData.total} record
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Controllo Righe per pagina */}
                          <div className="flex items-center gap-2">
                            <label className="text-[10px] text-slate-600 whitespace-nowrap">
                              Righe per pagina:
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="1000"
                              value={pageSize}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 1;
                                if (value >= 1 && value <= 1000) {
                                  handlePageSizeChange(value);
                                }
                              }}
                              className="w-16 rounded-md border border-slate-200 px-2 py-1 text-[10px] text-slate-700"
                            />
                          </div>

                          {/* Navigazione pagine */}
                          {totalPages > 1 && (
                            <>
                              <div className="h-4 w-px bg-slate-200" />
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  className="rounded-md border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                                  onClick={() => handlePageChange(currentPage - 1)}
                                  disabled={currentPage === 0}
                                >
                                  Prev
                                </button>

                                <div className="flex items-center gap-1">
                                  <label className="text-[10px] text-slate-600">Pagina:</label>
                                  <input
                                    type="number"
                                    min="1"
                                    max={totalPages}
                                    value={currentPage + 1}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value) || 1;
                                      const page = Math.max(1, Math.min(totalPages, value)) - 1;
                                      handlePageChange(page);
                                    }}
                                    className="w-14 rounded-md border border-slate-200 px-2 py-1 text-[10px] text-slate-700 text-center"
                                  />
                                  <span className="text-[10px] text-slate-600">/ {totalPages}</span>
                                </div>

                                <button
                                  type="button"
                                  className="rounded-md border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                                  onClick={() => handlePageChange(currentPage + 1)}
                                  disabled={currentPage >= totalPages - 1}
                                >
                                  Next
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Tab Export */}
      {activeTab === "export" && (
        <div className="mt-4 flex flex-1 min-h-0 flex-col gap-4">
          {/* Sezione Archiviazione */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-4 py-3 bg-slate-50">
              <div className="text-sm font-semibold text-slate-900">Archivia Log</div>
              <div className="text-[10px] text-slate-500">
                Esporta i log più vecchi su file .ndjson.gz e rimuovili dal database
              </div>
            </div>

            <div className="p-4 flex flex-wrap items-end gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1.5">
                  Mesi da conservare
                </label>
                <input
                  type="number"
                  min={1}
                  value={archiveMonths}
                  onChange={(e) =>
                    setArchiveMonths(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-24 rounded-md border border-slate-200 px-3 py-2 text-[11px] text-slate-700"
                />
              </div>
              <button
                type="button"
                className="rounded-md bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                onClick={handleArchive}
                disabled={archiveStatus === "loading"}
              >
                {archiveStatus === "loading" ? "Archiviazione in corso..." : "Avvia Archiviazione"}
              </button>
            </div>

            {archiveError && (
              <div className="px-4 pb-4 text-[11px] text-rose-600">{archiveError}</div>
            )}

            {archiveResult && (
              <div className="mx-4 mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <div className="text-[11px] font-semibold text-emerald-800">
                  {archiveResult.message ?? "Archiviazione completata"}
                </div>
                {(archiveResult.archived > 0 || archiveResult.files.length > 0) && (
                  <>
                    <div className="mt-1.5 flex gap-6 text-[10px] text-emerald-700">
                      <div>Record archiviati: <strong>{archiveResult.archived}</strong></div>
                      <div>Record eliminati: <strong>{archiveResult.deleted}</strong></div>
                      <div>File creati: <strong>{archiveResult.files.length}</strong></div>
                    </div>
                    {archiveResult.files.length > 0 && (
                      <div className="mt-2 space-y-0.5">
                        {archiveResult.files.map((f) => (
                          <div key={f.ym} className="flex items-center gap-3 text-[10px] text-emerald-700">
                            <span className="font-mono font-semibold">{f.filename}</span>
                            <span>{f.count} record</span>
                            <span>{(f.sizeBytes / 1024).toFixed(1)} KB</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Lista file archiviati */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex-1 min-h-0 flex flex-col">
            <div className="border-b border-slate-100 px-4 py-3 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">File Archiviati</div>
                <div className="text-[10px] text-slate-500">
                  {archiveFiles.length} file nella cartella archivio
                </div>
              </div>
              <button
                type="button"
                className="rounded-md border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                onClick={fetchArchiveList}
                disabled={archiveListStatus === "loading"}
              >
                {archiveListStatus === "loading" ? "..." : "Refresh"}
              </button>
            </div>

            {archiveListError && (
              <div className="px-4 py-2 text-[11px] text-rose-600">{archiveListError}</div>
            )}

            <div className="flex-1 overflow-y-auto">
              {archiveListStatus === "loading" && archiveFiles.length === 0 && (
                <div className="px-4 py-8 text-center text-[11px] text-slate-400">
                  Caricamento...
                </div>
              )}

              {archiveListStatus !== "loading" && archiveFiles.length === 0 && !archiveListError && (
                <div className="px-4 py-8 text-center text-[11px] text-slate-400">
                  Nessun file archiviato trovato
                </div>
              )}

              {archiveFiles.length > 0 && (
                <table className="w-full text-[11px]">
                  <thead className="bg-slate-50 text-[10px] font-semibold text-slate-500 uppercase sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left">File</th>
                      <th className="px-4 py-2 text-right whitespace-nowrap">Dimensione</th>
                      <th className="px-4 py-2 text-left whitespace-nowrap">Creato</th>
                      <th className="px-4 py-2 text-left">Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {archiveFiles.map((f) => (
                      <tr key={f.filename} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-2.5 font-mono text-slate-700 break-all">
                          {f.filename}
                        </td>
                        <td className="px-4 py-2.5 text-right text-slate-500 whitespace-nowrap">
                          {(f.sizeBytes / 1024).toFixed(1)} KB
                        </td>
                        <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">
                          {new Date(f.createdAt).toLocaleString("it-IT")}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              type="button"
                              className="rounded-md border border-slate-200 px-3 py-1 text-[10px] font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                              disabled={restoringFile === f.filename}
                              onClick={() => handleRestore(f.filename)}
                            >
                              {restoringFile === f.filename ? "Ripristino..." : "Ripristina"}
                            </button>
                            {restoreResultByFile[f.filename] !== undefined && (
                              <span className="text-[10px] font-semibold text-emerald-600">
                                +{restoreResultByFile[f.filename]} record ripristinati
                              </span>
                            )}
                            {restoreErrorByFile[f.filename] && (
                              <span className="text-[10px] text-rose-500">
                                {restoreErrorByFile[f.filename]}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal per la selezione delle colonne */}
      {showColumnsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowColumnsModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">Seleziona Colonne</div>
                <div className="text-[10px] text-slate-500">
                  {visibleColumns.length} di {availableColumns.length} colonne selezionate
                </div>
              </div>
              <button
                type="button"
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                onClick={() => setShowColumnsModal(false)}
              >
                <AppIcon icon="mdi:close" className="h-5 w-5" />
              </button>
            </div>

            {/* Azioni rapide */}
            <div className="border-b border-slate-200 px-4 py-2 flex items-center gap-2">
              <button
                type="button"
                className="rounded-md border border-slate-200 px-3 py-1.5 text-[10px] font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => handleToggleAllColumns(true)}
              >
                Seleziona tutte
              </button>
              <button
                type="button"
                className="rounded-md border border-slate-200 px-3 py-1.5 text-[10px] font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => handleToggleAllColumns(false)}
              >
                Deseleziona tutte
              </button>
            </div>

            {/* Lista colonne */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {availableColumns.map((column) => (
                  <label
                    key={column}
                    className="flex items-center gap-3 cursor-pointer rounded-md px-3 py-2 hover:bg-slate-50 transition"
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns.includes(column)}
                      onChange={() => handleToggleColumn(column)}
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                    />
                    <span className="text-[11px] font-medium text-slate-700">{column}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 px-4 py-3 flex justify-end">
              <button
                type="button"
                className="rounded-md bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white hover:bg-slate-800"
                onClick={() => setShowColumnsModal(false)}
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal per impostare il filtro */}
      {filterModalColumn && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setFilterModalColumn(null)}
        >
          <div
            className="bg-white rounded-xl shadow-lg w-full max-w-md flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">Filtro Colonna</div>
                <div className="text-[10px] text-slate-500">{filterModalColumn}</div>
              </div>
              <button
                type="button"
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                onClick={() => setFilterModalColumn(null)}
              >
                <AppIcon icon="mdi:close" className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">
              {isDateColumn ? (
                <>
                  {/* Date Range Picker */}
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1.5">
                      Data Da
                    </label>
                    <input
                      type="date"
                      value={filterDateFrom}
                      onChange={(e) => setFilterDateFrom(e.target.value)}
                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-[11px] text-slate-700"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1.5">
                      Data A
                    </label>
                    <input
                      type="date"
                      value={filterDateTo}
                      onChange={(e) => setFilterDateTo(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleApplyFilter();
                        }
                      }}
                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-[11px] text-slate-700"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Operatore per numeri/stringhe */}
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1.5">
                      Operatore
                    </label>
                    <select
                      value={filterOperator}
                      onChange={(e) => setFilterOperator(e.target.value)}
                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-[11px] text-slate-700"
                    >
                      <option value="=">Uguale (=)</option>
                      <option value=">">Maggiore di (&gt;)</option>
                      <option value="<">Minore di (&lt;)</option>
                      <option value=">=">Maggiore o uguale (&gt;=)</option>
                      <option value="<=">Minore o uguale (&lt;=)</option>
                    </select>
                  </div>

                  {/* Valore */}
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1.5">
                      Valore
                    </label>
                    <input
                      type="text"
                      value={filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleApplyFilter();
                        }
                      }}
                      placeholder="Inserisci il valore da filtrare"
                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-[11px] text-slate-700"
                      autoFocus
                    />
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 px-4 py-3 flex justify-between">
              <button
                type="button"
                className="rounded-md border border-slate-200 px-4 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                onClick={handleRemoveFilter}
                disabled={!hasActiveFilter(filterModalColumn)}
              >
                Rimuovi Filtro
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-md border border-slate-200 px-4 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() => setFilterModalColumn(null)}
                >
                  Annulla
                </button>
                <button
                  type="button"
                  className="rounded-md bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white hover:bg-slate-800"
                  onClick={handleApplyFilter}
                >
                  Applica
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
