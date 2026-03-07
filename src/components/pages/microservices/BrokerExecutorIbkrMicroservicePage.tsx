import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import MicroserviceGeneralTab from "../../molecules/microservice/MicroserviceGeneralTab";
import { env } from "../../../config/env";
import AppIcon from "../../atoms/icon/AppIcon";

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
 * Componente per la gestione della pagina del microservizio brokerExecutor-ibkr
 *
 * Questo componente gestisce solo il tab "General Settings" con le impostazioni comuni:
 * - DB Logger, Log Level
 * - Communication Channels
 * - Logs
 */
export default function BrokerExecutorIbkrMicroservicePage({
  onReleaseChange,
  onHealthChange,
  onOpenReleaseModal,
}: Props) {
  const [activeTab, setActiveTab] = useState<"general" | "orders" | "positions">("general");
  const [orders, setOrders] = useState<Record<string, any>[]>([]);
  const [positions, setPositions] = useState<Record<string, any>[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [positionsLoading, setPositionsLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [positionsError, setPositionsError] = useState<string | null>(null);
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});
  const [showAddOrderForm, setShowAddOrderForm] = useState(false);
  const [addOrderLoading, setAddOrderLoading] = useState(false);
  const [addOrderError, setAddOrderError] = useState<string | null>(null);
  const [editOrderLoading, setEditOrderLoading] = useState(false);
  const [editOrderError, setEditOrderError] = useState<string | null>(null);
  const [editOrderTarget, setEditOrderTarget] = useState<Record<string, any> | null>(null);
  const [deleteOrderLoading, setDeleteOrderLoading] = useState(false);
  const [deleteOrderError, setDeleteOrderError] = useState<string | null>(null);
  const [deleteOrderTarget, setDeleteOrderTarget] = useState<{
    row: Record<string, any>;
    childrenCount: number;
  } | null>(null);
  const [newOrderForm, setNewOrderForm] = useState({
    symbol: "",
    quantity: "1",
    limitPrice: "",
    stopLossPrice: "",
    stopLossLimitPrice: "",
    takeProfitPrice: "",
  });
  const [editOrderForm, setEditOrderForm] = useState({
    symbol: "",
    limitPrice: "",
    stopLossPrice: "",
    takeProfitPrice: "",
  });
  const [wsStatusLoading, setWsStatusLoading] = useState(false);
  const [wsStatusError, setWsStatusError] = useState<string | null>(null);
  const [wsStatusData, setWsStatusData] = useState<any>(null);

  const token = useMemo(
    () => (typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null),
    []
  );

  const loadOrders = useCallback(async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const res = await fetch(`${env.apiBaseUrl}/broker-executor-ibkr/orders`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Errore caricamento ordini");
      }
      const items = Array.isArray(data?.items) ? data.items : [];
      setOrders(items);
    } catch (err: any) {
      setOrdersError(err?.message || "Errore caricamento ordini");
    } finally {
      setOrdersLoading(false);
    }
  }, [token]);

  const loadPositions = useCallback(async () => {
    setPositionsLoading(true);
    setPositionsError(null);
    try {
      const res = await fetch(`${env.apiBaseUrl}/broker-executor-ibkr/positions`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Errore caricamento posizioni");
      }
      const items = Array.isArray(data?.items) ? data.items : [];
      setPositions(items);
    } catch (err: any) {
      setPositionsError(err?.message || "Errore caricamento posizioni");
    } finally {
      setPositionsLoading(false);
    }
  }, [token]);

  const loadWsStatus = useCallback(async () => {
    setWsStatusLoading(true);
    setWsStatusError(null);
    try {
      const res = await fetch(`${env.apiBaseUrl}/broker-executor-ibkr/ws/status`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || data?.message || "Errore caricamento ws status");
      }
      setWsStatusData(data?.data || null);
    } catch (err: any) {
      setWsStatusError(err?.message || "Errore caricamento ws status");
    } finally {
      setWsStatusLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === "orders") {
      loadOrders();
      loadWsStatus();
    }
    if (activeTab === "positions") loadPositions();
  }, [activeTab, loadOrders, loadPositions, loadWsStatus]);

  useEffect(() => {
    if (activeTab !== "orders") return;
    const t = setInterval(() => {
      loadWsStatus();
    }, 3000);
    return () => clearInterval(t);
  }, [activeTab, loadWsStatus]);

  useEffect(() => {
    setExpandedParents((prev) => {
      const next = { ...prev };
      let changed = false;
      const parentIds = new Set<string>();
      const parentRefs = new Set<string>();

      for (const row of orders) {
        const orderId = String(row?.orderId || "").trim();
        const parentOrderId = String(row?.parentOrderId || "").trim();
        if (orderId) parentIds.add(orderId);
        if (parentOrderId) parentRefs.add(parentOrderId);
      }

      for (const parentId of parentRefs) {
        if (!parentIds.has(parentId)) continue;
        if (typeof next[parentId] === "undefined") {
          next[parentId] = true;
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [orders]);

  const orderTree = useMemo(() => {
    const parents: Record<string, Record<string, any>> = {};
    const childrenByParent: Record<string, Record<string, any>[]> = {};
    const orphanParents: Record<string, Record<string, any>> = {};

    for (const row of orders) {
      const orderId = String(row?.orderId || "").trim();
      const parentOrderId = String(row?.parentOrderId || "").trim();
      const isChild = !!parentOrderId && parentOrderId !== orderId;

      if (isChild) {
        if (!childrenByParent[parentOrderId]) childrenByParent[parentOrderId] = [];
        childrenByParent[parentOrderId].push(row);
        continue;
      }

      if (orderId) parents[orderId] = row;
      else orphanParents[`orphan-${Object.keys(orphanParents).length}`] = row;
    }

    for (const parentOrderId of Object.keys(childrenByParent)) {
      if (!parents[parentOrderId]) {
        const list = childrenByParent[parentOrderId];
        const fallback = list[0] || {};
        orphanParents[`missing-parent-${parentOrderId}`] = {
          orderId: parentOrderId,
          status: fallback?.status || "-",
          symbol: fallback?.symbol || "-",
          side: "-",
          quantity: "-",
          limitPrice: "-",
          stopLossPrice: "-",
          takeProfitPrice: "-",
          tif: "-",
        };
      }
    }

    const result: Array<{ parent: Record<string, any>; children: Record<string, any>[] }> = [];
    for (const id of Object.keys(parents)) {
      result.push({ parent: parents[id], children: childrenByParent[id] || [] });
    }
    for (const id of Object.keys(orphanParents)) {
      const orderId = String(orphanParents[id]?.orderId || "");
      result.push({
        parent: orphanParents[id],
        children: orderId ? childrenByParent[orderId] || [] : [],
      });
    }

    return result;
  }, [orders]);

  const submitOrder = useCallback(
    async (side: "BUY" | "SELL") => {
      setAddOrderError(null);
      setAddOrderLoading(true);
      try {
        const symbol = String(newOrderForm.symbol || "").trim().toUpperCase();
        const quantity = Number(newOrderForm.quantity);
        const limitPrice = Number(newOrderForm.limitPrice);
        const stopLossPrice = Number(newOrderForm.stopLossPrice);
        const stopLossLimitPrice =
          newOrderForm.stopLossLimitPrice === ""
            ? stopLossPrice
            : Number(newOrderForm.stopLossLimitPrice);
        const takeProfitPrice = Number(newOrderForm.takeProfitPrice);

        if (!symbol) throw new Error("Symbol obbligatorio");
        if (!Number.isFinite(quantity) || quantity <= 0) throw new Error("Quantity non valida");
        if (!Number.isFinite(limitPrice) || limitPrice <= 0) throw new Error("Limit non valido");
        if (!Number.isFinite(stopLossPrice) || stopLossPrice <= 0) throw new Error("SL non valido");
        if (!Number.isFinite(stopLossLimitPrice) || stopLossLimitPrice <= 0) {
          throw new Error("SL Limit non valido");
        }
        if (!Number.isFinite(takeProfitPrice) || takeProfitPrice <= 0) throw new Error("TP non valido");

        const res = await fetch(`${env.apiBaseUrl}/broker-executor-ibkr/order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            side,
            symbol,
            quantity,
            limitPrice,
            stopLossPrice,
            stopLossLimitPrice,
            takeProfitPrice,
            timeInForce: "DAY",
          }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data?.error || data?.message || "Errore creazione ordine");
        }

        setShowAddOrderForm(false);
        setNewOrderForm({
          symbol: "",
          quantity: "1",
          limitPrice: "",
          stopLossPrice: "",
          stopLossLimitPrice: "",
          takeProfitPrice: "",
        });
        loadOrders();
      } catch (err: any) {
        setAddOrderError(err?.message || "Errore creazione ordine");
      } finally {
        setAddOrderLoading(false);
      }
    },
    [newOrderForm, token, loadOrders]
  );

  const openEditOrder = useCallback((row: Record<string, any>) => {
    setEditOrderError(null);
    setEditOrderTarget(row);
    setEditOrderForm({
      symbol: String(row?.symbol || ""),
      limitPrice: String(row?.limitPrice ?? ""),
      stopLossPrice: String(row?.stopLossPrice ?? ""),
      takeProfitPrice: String(row?.takeProfitPrice ?? ""),
    });
  }, []);

  const saveEditOrder = useCallback(async () => {
    if (!editOrderTarget?.orderId) return;
    setEditOrderError(null);
    setEditOrderLoading(true);
    try {
      const payload = {
        limitPrice: Number(editOrderForm.limitPrice),
        stopLossPrice: Number(editOrderForm.stopLossPrice),
        takeProfitPrice: Number(editOrderForm.takeProfitPrice),
      };

      if (!Number.isFinite(payload.limitPrice) || payload.limitPrice <= 0) {
        throw new Error("Limit non valido");
      }
      if (!Number.isFinite(payload.stopLossPrice) || payload.stopLossPrice <= 0) {
        throw new Error("SL non valido");
      }
      if (!Number.isFinite(payload.takeProfitPrice) || payload.takeProfitPrice <= 0) {
        throw new Error("TP non valido");
      }

      const res = await fetch(
        `${env.apiBaseUrl}/broker-executor-ibkr/order/${encodeURIComponent(String(editOrderTarget.orderId))}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Errore salvataggio ordine");
      }

      setEditOrderTarget(null);
      loadOrders();
    } catch (err: any) {
      setEditOrderError(err?.message || "Errore salvataggio ordine");
    } finally {
      setEditOrderLoading(false);
    }
  }, [editOrderForm, editOrderTarget, token, loadOrders]);

  const confirmDeleteOrder = useCallback(async () => {
    if (!deleteOrderTarget?.row?.orderId) return;
    setDeleteOrderError(null);
    setDeleteOrderLoading(true);
    try {
      const res = await fetch(
        `${env.apiBaseUrl}/broker-executor-ibkr/order/${encodeURIComponent(String(deleteOrderTarget.row.orderId))}`,
        {
          method: "DELETE",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Errore cancellazione ordine");
      }
      setDeleteOrderTarget(null);
      loadOrders();
    } catch (err: any) {
      setDeleteOrderError(err?.message || "Errore cancellazione ordine");
    } finally {
      setDeleteOrderLoading(false);
    }
  }, [deleteOrderTarget, token, loadOrders]);

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      <div className="flex gap-6 border-b border-slate-200">
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "general" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
          }`}
          onClick={() => setActiveTab("general")}
        >
          General Settings
        </button>
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "orders" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
          }`}
          onClick={() => setActiveTab("orders")}
        >
          Ordini
        </button>
        <button
          type="button"
          className={`pb-2 text-xs font-semibold transition ${
            activeTab === "positions" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500"
          }`}
          onClick={() => setActiveTab("positions")}
        >
          Posizioni
        </button>
      </div>

      {activeTab === "general" && (
        <div className="flex-1 min-h-0 flex flex-col">
          <MicroserviceGeneralTab
            microservice="broker-executor-ibkr"
            onReleaseChange={onReleaseChange}
            onHealthChange={onHealthChange}
            onOpenReleaseModal={onOpenReleaseModal}
          />
        </div>
      )}

      {activeTab === "orders" && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Ordini</div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-md border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => {
                  setAddOrderError(null);
                  setShowAddOrderForm(true);
                }}
              >
                Add Order
              </button>
              <button
                type="button"
                className="rounded-md border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                onClick={loadOrders}
                disabled={ordersLoading}
              >
                {ordersLoading ? "Aggiornamento..." : "Aggiorna"}
              </button>
            </div>
          </div>

          {ordersError && (
            <div className="mb-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">
              {ordersError}
            </div>
          )}

          <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[12px] font-semibold text-slate-800">WS Orders Listener</div>
              <button
                type="button"
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-700 hover:bg-slate-50"
                onClick={loadWsStatus}
                disabled={wsStatusLoading}
              >
                {wsStatusLoading ? "Loading..." : "Refresh"}
              </button>
            </div>

            {wsStatusError && (
              <div className="mb-2 rounded-md border border-rose-200 bg-rose-50 px-2 py-1 text-[10px] text-rose-700">
                {wsStatusError}
              </div>
            )}

            <div className="mb-2 grid grid-cols-1 gap-2 text-[10px] text-slate-700 md:grid-cols-4">
              <div className="rounded border border-slate-200 bg-white px-2 py-1">
                <span className="text-slate-500">Status:</span>{" "}
                <span className="font-semibold">{wsStatusData?.connection?.listenerStatus || "-"}</span>
              </div>
              <div className="rounded border border-slate-200 bg-white px-2 py-1">
                <span className="text-slate-500">Connected:</span>{" "}
                <span className="font-semibold">{wsStatusData?.connection?.connected ? "Yes" : "No"}</span>
              </div>
              <div className="rounded border border-slate-200 bg-white px-2 py-1">
                <span className="text-slate-500">Last Message:</span>{" "}
                <span className="font-semibold">{wsStatusData?.connection?.lastMessageAt || "-"}</span>
              </div>
              <div className="rounded border border-slate-200 bg-white px-2 py-1">
                <span className="text-slate-500">Next Reconnect:</span>{" "}
                <span className="font-semibold">{wsStatusData?.connection?.nextReconnectAt || "-"}</span>
              </div>
            </div>

            <div className="max-h-48 overflow-auto rounded border border-slate-200 bg-white">
              <table className="w-full text-left text-[10px] text-slate-600">
                <thead className="bg-slate-100 text-[9px] uppercase text-slate-500">
                  <tr>
                    <th className="px-2 py-1">TS</th>
                    <th className="px-2 py-1">Order ID</th>
                    <th className="px-2 py-1">Parent</th>
                    <th className="px-2 py-1">Symbol</th>
                    <th className="px-2 py-1">Status</th>
                    <th className="px-2 py-1">Filled</th>
                  </tr>
                </thead>
                <tbody>
                  {(Array.isArray(wsStatusData?.messages) ? wsStatusData.messages : []).slice(0, 50).map((m: any, idx: number) => (
                    <tr key={`${m?.ts || "ts"}-${m?.orderId || "id"}-${idx}`} className="border-t border-slate-100">
                      <td className="px-2 py-1">{m?.ts || "-"}</td>
                      <td className="px-2 py-1">{m?.orderId || "-"}</td>
                      <td className="px-2 py-1">{m?.parentOrderId || "-"}</td>
                      <td className="px-2 py-1">{m?.symbol || "-"}</td>
                      <td className="px-2 py-1">{m?.status || "-"}</td>
                      <td className="px-2 py-1">{m?.filledQty ?? "-"}</td>
                    </tr>
                  ))}
                  {(!Array.isArray(wsStatusData?.messages) || wsStatusData.messages.length === 0) && (
                    <tr>
                      <td className="px-2 py-2 text-center text-[10px] text-slate-400" colSpan={6}>
                        Nessun messaggio ricevuto.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] text-slate-600">
              <thead className="bg-slate-50 text-[10px] uppercase text-slate-400">
                <tr>
                  <th className="px-3 py-2">Order ID</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Symbol</th>
                  <th className="px-3 py-2">Side</th>
                  <th className="px-3 py-2">Qty</th>
                  <th className="px-3 py-2">Limit</th>
                  <th className="px-3 py-2">SL</th>
                  <th className="px-3 py-2">TP</th>
                  <th className="px-3 py-2">TIF</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orderTree.map((group, groupIdx) => {
                  const parent = group.parent;
                  const children = group.children || [];
                  const parentId = String(parent?.orderId || `group-${groupIdx}`);
                  const hasChildren = children.length > 0;
                  const expanded = hasChildren ? (expandedParents[parentId] ?? true) : false;

                  return (
                    <Fragment key={`grp-${parentId}-${groupIdx}`}>
                      <tr key={`parent-${parentId}-${groupIdx}`} className="border-t border-slate-100 bg-white">
                        <td className="px-3 py-2 text-slate-700">
                          <div className="flex items-center gap-2">
                            {hasChildren ? (
                              <button
                                type="button"
                                className="inline-flex h-4 w-4 items-center justify-center rounded border border-slate-300 text-[10px] text-slate-600 hover:bg-slate-50"
                                onClick={() =>
                                  setExpandedParents((prev) => ({ ...prev, [parentId]: !(prev[parentId] ?? true) }))
                                }
                                title={expanded ? "Collapse" : "Expand"}
                              >
                                {expanded ? "-" : "+"}
                              </button>
                            ) : (
                              <span className="inline-block h-4 w-4" />
                            )}
                            <span>{parent.orderId || "-"}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2">{parent.status || "-"}</td>
                        <td className="px-3 py-2">{parent.symbol || "-"}</td>
                        <td className="px-3 py-2">{parent.side || "-"}</td>
                        <td className="px-3 py-2">{parent.quantity ?? "-"}</td>
                        <td className="px-3 py-2">{parent.limitPrice ?? "-"}</td>
                        <td className="px-3 py-2">{parent.stopLossPrice ?? "-"}</td>
                        <td className="px-3 py-2">{parent.takeProfitPrice ?? "-"}</td>
                        <td className="px-3 py-2">{parent.tif || "-"}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              className="rounded border border-slate-200 p-1 text-slate-600 hover:bg-slate-50"
                              onClick={() => openEditOrder(parent)}
                              title="Edit order"
                            >
                              <AppIcon icon="mdi:pencil-outline" className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              className="rounded border border-rose-200 p-1 text-rose-600 hover:bg-rose-50"
                              onClick={() =>
                                setDeleteOrderTarget({
                                  row: parent,
                                  childrenCount: children.length,
                                })
                              }
                              title="Delete order"
                            >
                              <AppIcon icon="mdi:trash-can-outline" className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {hasChildren &&
                        expanded &&
                        children.map((child, childIdx) => (
                          <tr
                            key={`child-${parentId}-${child.orderId || childIdx}`}
                            className="border-t border-slate-100 bg-slate-50/70"
                          >
                            <td className="px-3 py-2 pl-10 text-slate-600">
                              <span className="mr-1 text-slate-400">↳</span>
                              {child.orderId || "-"}{" "}
                              <span className="text-[10px] uppercase text-slate-400">
                                {child.bracketRole || "CHILD"}
                              </span>
                            </td>
                            <td className="px-3 py-2">{child.status || "-"}</td>
                            <td className="px-3 py-2">{child.symbol || "-"}</td>
                            <td className="px-3 py-2">{child.side || "-"}</td>
                            <td className="px-3 py-2">{child.quantity ?? "-"}</td>
                            <td className="px-3 py-2">{child.limitPrice ?? "-"}</td>
                            <td className="px-3 py-2">{child.stopLossPrice ?? "-"}</td>
                            <td className="px-3 py-2">{child.takeProfitPrice ?? "-"}</td>
                            <td className="px-3 py-2">{child.tif || "-"}</td>
                            <td className="px-3 py-2">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  className="rounded border border-rose-200 p-1 text-rose-600 hover:bg-rose-50"
                                  onClick={() =>
                                    setDeleteOrderTarget({
                                      row: child,
                                      childrenCount: 0,
                                    })
                                  }
                                  title="Delete order"
                                >
                                  <AppIcon icon="mdi:trash-can-outline" className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </Fragment>
                  );
                })}
                {!ordersLoading && orders.length === 0 && (
                  <tr>
                    <td className="px-3 py-3 text-center text-[11px] text-slate-400" colSpan={10}>
                      Nessun ordine trovato.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAddOrderForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
            <div className="mb-3 text-sm font-semibold text-slate-900">Add Order</div>

            {addOrderError && (
              <div className="mb-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">
                {addOrderError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-3">
              <label className="text-[11px] font-semibold text-slate-600">
                Symbol
                <input
                  type="text"
                  value={newOrderForm.symbol}
                  onChange={(e) =>
                    setNewOrderForm((prev) => ({ ...prev, symbol: e.target.value.toUpperCase() }))
                  }
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-[12px] outline-none focus:border-slate-400"
                  placeholder="AAPL"
                />
              </label>

              <label className="text-[11px] font-semibold text-slate-600">
                Quantity
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={newOrderForm.quantity}
                  onChange={(e) => setNewOrderForm((prev) => ({ ...prev, quantity: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-[12px] outline-none focus:border-slate-400"
                  placeholder="1"
                />
              </label>

              <label className="text-[11px] font-semibold text-slate-600">
                Limit
                <input
                  type="number"
                  step="0.0001"
                  value={newOrderForm.limitPrice}
                  onChange={(e) => setNewOrderForm((prev) => ({ ...prev, limitPrice: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-[12px] outline-none focus:border-slate-400"
                  placeholder="100.00"
                />
              </label>

              <label className="text-[11px] font-semibold text-slate-600">
                SL Stop
                <input
                  type="number"
                  step="0.0001"
                  value={newOrderForm.stopLossPrice}
                  onChange={(e) => setNewOrderForm((prev) => ({ ...prev, stopLossPrice: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-[12px] outline-none focus:border-slate-400"
                  placeholder="95.00"
                />
              </label>
              <label className="text-[11px] font-semibold text-slate-600">
                SL Limit
                <input
                  type="number"
                  step="0.0001"
                  value={newOrderForm.stopLossLimitPrice}
                  onChange={(e) =>
                    setNewOrderForm((prev) => ({ ...prev, stopLossLimitPrice: e.target.value }))
                  }
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-[12px] outline-none focus:border-slate-400"
                  placeholder="94.90 (default = SL Stop)"
                />
              </label>

              <label className="text-[11px] font-semibold text-slate-600">
                TP
                <input
                  type="number"
                  step="0.0001"
                  value={newOrderForm.takeProfitPrice}
                  onChange={(e) => setNewOrderForm((prev) => ({ ...prev, takeProfitPrice: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-[12px] outline-none focus:border-slate-400"
                  placeholder="110.00"
                />
              </label>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                className="rounded-md border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => {
                  setShowAddOrderForm(false);
                  setAddOrderError(null);
                }}
                disabled={addOrderLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-md bg-blue-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
                onClick={() => submitOrder("BUY")}
                disabled={addOrderLoading}
              >
                BUY
              </button>
              <button
                type="button"
                className="rounded-md bg-red-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-red-500 disabled:opacity-60"
                onClick={() => submitOrder("SELL")}
                disabled={addOrderLoading}
              >
                SELL
              </button>
            </div>
          </div>
        </div>
      )}

      {editOrderTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
            <div className="mb-3 text-sm font-semibold text-slate-900">Edit Order</div>

            {editOrderError && (
              <div className="mb-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">
                {editOrderError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-3">
              <label className="text-[11px] font-semibold text-slate-600">
                Symbol
                <input
                  type="text"
                  value={editOrderForm.symbol}
                  readOnly
                  className="mt-1 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-500"
                />
              </label>
              <label className="text-[11px] font-semibold text-slate-600">
                Limit
                <input
                  type="number"
                  step="0.0001"
                  value={editOrderForm.limitPrice}
                  onChange={(e) => setEditOrderForm((prev) => ({ ...prev, limitPrice: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-[12px] outline-none focus:border-slate-400"
                />
              </label>
              <label className="text-[11px] font-semibold text-slate-600">
                SL
                <input
                  type="number"
                  step="0.0001"
                  value={editOrderForm.stopLossPrice}
                  onChange={(e) => setEditOrderForm((prev) => ({ ...prev, stopLossPrice: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-[12px] outline-none focus:border-slate-400"
                />
              </label>
              <label className="text-[11px] font-semibold text-slate-600">
                TP
                <input
                  type="number"
                  step="0.0001"
                  value={editOrderForm.takeProfitPrice}
                  onChange={(e) => setEditOrderForm((prev) => ({ ...prev, takeProfitPrice: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-[12px] outline-none focus:border-slate-400"
                />
              </label>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                className="rounded-md border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => {
                  setEditOrderTarget(null);
                  setEditOrderError(null);
                }}
                disabled={editOrderLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-md bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                onClick={saveEditOrder}
                disabled={editOrderLoading}
              >
                SAVE
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteOrderTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
            <div className="text-sm font-semibold text-slate-900">Conferma cancellazione</div>
            <div className="mt-2 text-[12px] text-slate-700">
              Vuoi cancellare l&apos;ordine <span className="font-semibold">{deleteOrderTarget.row?.orderId}</span>?
              {deleteOrderTarget.childrenCount > 0 && (
                <span>
                  {" "}
                  Verranno cancellati anche i {deleteOrderTarget.childrenCount} ordini child collegati.
                </span>
              )}
            </div>

            {deleteOrderError && (
              <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">
                {deleteOrderError}
              </div>
            )}

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                className="rounded-md border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => {
                  setDeleteOrderTarget(null);
                  setDeleteOrderError(null);
                }}
                disabled={deleteOrderLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-md bg-rose-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-rose-500 disabled:opacity-60"
                onClick={confirmDeleteOrder}
                disabled={deleteOrderLoading}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "positions" && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Posizioni</div>
            <button
              type="button"
              className="rounded-md border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
              onClick={loadPositions}
              disabled={positionsLoading}
            >
              {positionsLoading ? "Aggiornamento..." : "Aggiorna"}
            </button>
          </div>

          {positionsError && (
            <div className="mb-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">
              {positionsError}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] text-slate-600">
              <thead className="bg-slate-50 text-[10px] uppercase text-slate-400">
                <tr>
                  <th className="px-3 py-2">Account</th>
                  <th className="px-3 py-2">Conid</th>
                  <th className="px-3 py-2">Symbol</th>
                  <th className="px-3 py-2">Qty</th>
                  <th className="px-3 py-2">Avg Price</th>
                  <th className="px-3 py-2">Market Price</th>
                  <th className="px-3 py-2">Market Value</th>
                  <th className="px-3 py-2">Currency</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((row, idx) => (
                  <tr key={`${row.conid || row.symbol || "row"}-${idx}`} className="border-t border-slate-100">
                    <td className="px-3 py-2 text-slate-700">{row.accountId || "-"}</td>
                    <td className="px-3 py-2">{row.conid || "-"}</td>
                    <td className="px-3 py-2">{row.symbol || "-"}</td>
                    <td className="px-3 py-2">{row.quantity ?? "-"}</td>
                    <td className="px-3 py-2">{row.avgPrice ?? "-"}</td>
                    <td className="px-3 py-2">{row.marketPrice ?? "-"}</td>
                    <td className="px-3 py-2">{row.marketValue ?? "-"}</td>
                    <td className="px-3 py-2">{row.currency || "-"}</td>
                  </tr>
                ))}
                {!positionsLoading && positions.length === 0 && (
                  <tr>
                    <td className="px-3 py-3 text-center text-[11px] text-slate-400" colSpan={8}>
                      Nessuna posizione trovata.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
