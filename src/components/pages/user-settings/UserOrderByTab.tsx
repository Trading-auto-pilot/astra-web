import { useEffect, useState, useCallback } from "react";
import { env } from "../../../config/env";

type OrderOption = {
  key: string;
  label: string;
};

const AVAILABLE_FIELDS: OrderOption[] = [
  { key: "growth_probability", label: "Growth Probability" },
  { key: "momentum_score", label: "Momentum" },
  { key: "risk_score", label: "Risk" },
  { key: "market_score", label: "Market" },
  { key: "mom1mScore", label: "Mom 1M" },
  { key: "mom3mScore", label: "Mom 3M" },
  { key: "mom6mScore", label: "Mom 6M" },
  { key: "mom12mScore", label: "Mom 12M" },
  { key: "double_top_score", label: "Double Top" },
];

type OrderByRow = {
  id?: number;
  field: string;
  direction: "ASC" | "DESC";
  order_id?: number;
};

export default function UserOrderByTab() {
  const [rows, setRows] = useState<OrderByRow[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [pipes, setPipes] = useState<Array<{ id: number; name: string; enabled?: boolean }>>([]);
  const [pipesLoading, setPipesLoading] = useState(false);
  const [selectedPipeId, setSelectedPipeId] = useState<number | null>(null);

  useEffect(() => {
    const t = typeof localStorage !== "undefined" ? localStorage.getItem("astraai:auth:token") : null;
    setToken(t);
  }, []);

  const loadPipes = useCallback(async () => {
    if (!token) return null;
    try {
      setPipesLoading(true);
      const resp = await fetch(`${env.apiBaseUrl}/tickerscanner/fundamentals/users/pipes`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await resp.json().catch(() => ({}));
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      const enabled = list
        .map((p: any) => ({ ...p, enabled: p?.enabled === true || p?.enabled === 1 || p?.enabled === "1" }))
        .filter((p: any) => p.enabled);
      setPipes(enabled);
      if (enabled.length && selectedPipeId === null) {
        setSelectedPipeId(enabled[0].id);
        return enabled[0].id;
      }
      return enabled.find((p: any) => p.id === selectedPipeId)?.id ?? null;
    } catch {
      setPipes([]);
      return null;
    } finally {
      setPipesLoading(false);
    }
  }, [token, selectedPipeId]);

  const loadOrders = useCallback(
    async (pipeId: number | null) => {
      if (!token || pipeId === null || pipeId === undefined) return;
      try {
        const resp = await fetch(
          `${env.apiBaseUrl}/tickerscanner/fundamentals/user-order/${encodeURIComponent(pipeId)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!resp.ok) {
          setRows([]);
          return;
        }
        const data = await resp.json();
        const arr = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        const parsed = arr
          .map((r: any) => ({
            id: r.id,
            order_id: r.order_id,
            field: r.field || r.order_field || r.name,
            direction: (r.direction || r.dir || "DESC").toUpperCase() === "ASC" ? "ASC" : "DESC",
          }))
          .filter((r: { field: unknown }) => Boolean(r.field));
        setRows(parsed);
      } catch {
        setRows([]);
      }
    },
    [token]
  );

  useEffect(() => {
    if (!token) return;
    (async () => {
      const firstPipe = await loadPipes();
      const targetPipe = firstPipe ?? selectedPipeId;
      if (targetPipe !== null && targetPipe !== undefined) {
        setSelectedPipeId(targetPipe);
        loadOrders(targetPipe);
      }
    })();
  }, [token, loadPipes, selectedPipeId, loadOrders]);

  useEffect(() => {
    if (selectedPipeId !== null) {
      loadOrders(selectedPipeId);
    }
  }, [selectedPipeId, loadOrders]);

  const updateRow = (idx: number, patch: Partial<OrderByRow>) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  const addRow = () => setRows((prev) => [...prev, { field: "growth_probability", direction: "DESC" }]);
  const removeRow = async (idx: number) => {
    const row = rows[idx];
    setRows((prev) => prev.filter((_, i) => i !== idx));
    if (!token || !row?.id || selectedPipeId === null) return;
    try {
      await fetch(
        `${env.apiBaseUrl}/tickerscanner/fundamentals/user-order/${row.id}/${encodeURIComponent(selectedPipeId)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch {
      /* ignore */
    }
  };

  const moveRow = (idx: number, delta: number) => {
    setRows((prev) => {
      const next = [...prev];
      const newIdx = idx + delta;
      if (newIdx < 0 || newIdx >= next.length) return prev;
      const [item] = next.splice(idx, 1);
      next.splice(newIdx, 0, item);
      return next;
    });
  };

  const save = async () => {
    if (!token || selectedPipeId === null) {
      setMessage("Seleziona una pipe per salvare l'ordinamento.");
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      rows.forEach((r, idx) => {
        r.order_id = idx + 1;
      });
      for (const row of rows) {
        if (row.id) {
          await fetch(
            `${env.apiBaseUrl}/tickerscanner/fundamentals/user-order/${row.id}/${encodeURIComponent(selectedPipeId)}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                order_field: row.field,
                direction: row.direction,
                order_id: row.order_id,
                pipe_id: selectedPipeId,
              }),
            }
          );
        } else {
          const resp = await fetch(
            `${env.apiBaseUrl}/tickerscanner/fundamentals/user-order/${encodeURIComponent(selectedPipeId)}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                order_field: row.field,
                direction: row.direction,
                order_id: row.order_id,
                pipe_id: selectedPipeId,
              }),
            }
          );
          if (resp.ok) {
            const data = await resp.json();
            if (data?.insertId) {
              row.id = data.insertId;
            }
          }
        }
      }
      setMessage("Ordine salvato");
    } catch (err: any) {
      setMessage(err?.message || "Errore salvataggio");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-[220px,1fr]">
      <div className="rounded-lg border border-slate-200 bg-white p-3">
        <div className="mb-2 text-xs font-semibold text-slate-600">Pipes abilitate</div>
        {pipesLoading && <div className="text-xs text-slate-500">Caricamento...</div>}
        {!pipesLoading && pipes.length === 0 && (
          <div className="text-xs text-slate-500">Nessuna pipe abilitata.</div>
        )}
        <div className="flex flex-col gap-2">
          {pipes.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPipeId(p.id)}
              className={`rounded-md px-3 py-2 text-left text-xs font-semibold ${
                selectedPipeId === p.id
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {p.name || `Pipe ${p.id}`}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">Order By</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={addRow}
              className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              disabled={selectedPipeId === null}
            >
              + Aggiungi
            </button>
            <button
              onClick={save}
              disabled={saving || selectedPipeId === null}
              className="rounded-md bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow-sm disabled:opacity-50"
            >
              {saving ? "Salvo..." : "Salva"}
            </button>
          </div>
        </div>
        {selectedPipeId === null && (
          <div className="rounded-md bg-slate-100 px-3 py-2 text-xs text-slate-700">
            Seleziona una pipe per gestire l'ordinamento.
          </div>
        )}
        {message && <div className="rounded-md bg-slate-100 px-3 py-2 text-xs text-slate-700">{message}</div>}
        <div className="space-y-2">
          {rows.map((row, idx) => (
            <div key={idx} className="flex items-center gap-2 rounded-md border border-slate-200 p-2">
              <select
                value={row.field}
                onChange={(e) => updateRow(idx, { field: e.target.value })}
                className="flex-1 rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-800"
              >
                {AVAILABLE_FIELDS.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <select
                value={row.direction}
                onChange={(e) => updateRow(idx, { direction: e.target.value === "ASC" ? "ASC" : "DESC" })}
                className="w-28 rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-800"
              >
                <option value="DESC">Discendente</option>
                <option value="ASC">Ascendente</option>
              </select>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveRow(idx, -1)}
                  className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
                  aria-label="Sposta su"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveRow(idx, 1)}
                  className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
                  aria-label="Sposta giù"
                >
                  ↓
                </button>
              </div>
              <button
                onClick={() => removeRow(idx)}
                className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
              >
                Rimuovi
              </button>
            </div>
          ))}
          {!rows.length && <div className="text-xs text-slate-500">Nessun ordine definito.</div>}
        </div>
      </div>
    </div>
  );
}
