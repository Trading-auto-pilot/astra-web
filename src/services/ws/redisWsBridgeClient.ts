import { env } from "../../config/env";

type WsStatus = "idle" | "connecting" | "open" | "closed" | "error";

type Subscription = {
  id: number;
  filter?: (msg: any) => boolean;
  onMessage: (msg: any) => void;
  onStatus?: (status: WsStatus, detail?: string) => void;
};

type WsLogEntry = {
  ts: string;
  level: "info" | "warning" | "error";
  message: string;
};

const makeWsBase = () => {
  try {
    const url = new URL(env.apiBaseUrl);
    const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    const protocol = isLocal ? "ws:" : url.protocol.replace(/^http/, "ws");
    return `${protocol}//${url.host}`;
  } catch {
    return env.apiBaseUrl.replace(/^http/, "ws");
  }
};

class RedisWsBridgeClient {
  private socket: WebSocket | null = null;
  private status: WsStatus = "idle";
  private subscriptions = new Map<number, Subscription>();
  private statusSubscribers = new Set<(status: WsStatus, detail?: string) => void>();
  private keepAlive = false;
  private nextId = 1;
  private reconnectDelayMs = 1000;
  private reconnectTimer: number | null = null;
  private closeTimer: number | null = null;
  private closeDelayMs = 800;
  private lastError: string | null = null;
  private lastConnectedAt: string | null = null;
  private lastMessageAt: string | null = null;
  private lastCloseAt: string | null = null;
  private logs: WsLogEntry[] = [];

  start() {
    this.keepAlive = true;
    this.connectIfNeeded();
  }

  stop() {
    this.keepAlive = false;
    if (this.subscriptions.size === 0) {
      this.closeSocket();
    }
  }

  subscribe(options: Omit<Subscription, "id">) {
    const id = this.nextId++;
    this.subscriptions.set(id, { id, ...options });
    this.connectIfNeeded();
    return () => this.unsubscribe(id);
  }

  onStatus(cb: (status: WsStatus, detail?: string) => void) {
    this.statusSubscribers.add(cb);
    cb(this.status, this.lastError || undefined);
    return () => this.statusSubscribers.delete(cb);
  }

  getHealth() {
    return {
      status: this.status,
      lastError: this.lastError,
      lastConnectedAt: this.lastConnectedAt,
      lastMessageAt: this.lastMessageAt,
      lastCloseAt: this.lastCloseAt,
      subscriptions: this.subscriptions.size,
    };
  }

  getLogs() {
    return [...this.logs];
  }

  private unsubscribe(id: number) {
    this.subscriptions.delete(id);
    if (this.subscriptions.size === 0) {
      this.scheduleClose();
    }
  }

  private connectIfNeeded() {
    if (typeof window === "undefined") return;
    if (this.socket && (this.status === "connecting" || this.status === "open")) return;
    if (this.subscriptions.size === 0 && !this.keepAlive) return;
    if (this.closeTimer) {
      window.clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
    this.openSocket();
  }

  private openSocket() {
    const wsBase = makeWsBase();
    const wsUrl = `${wsBase}/redis-ws-bridge/ws`;
    this.setStatus("connecting");
    this.pushLog("info", `Connecting to ${wsUrl}`);

    try {
      const socket = new WebSocket(wsUrl);
      this.socket = socket;

      socket.onopen = () => {
        this.reconnectDelayMs = 1000;
        this.lastConnectedAt = new Date().toISOString();
        this.setStatus("open");
        this.pushLog("info", "Websocket connected");
      };

      socket.onerror = () => {
        this.setStatus("error", "Errore connessione websocket");
      };

      socket.onclose = (event) => {
        this.socket = null;
        this.lastCloseAt = new Date().toISOString();
        if (this.subscriptions.size > 0) {
          this.scheduleReconnect();
        }
        if (this.status === "open" || this.status === "connecting") {
          this.setStatus(
            "closed",
            `Websocket closed (code=${event.code}${event.reason ? `, reason=${event.reason}` : ""})`
          );
        }
      };

      socket.onmessage = (event) => {
        let payload: any = event.data;
        try {
          payload = JSON.parse(event.data);
        } catch {
          payload = event.data;
        }
        this.lastMessageAt = new Date().toISOString();
        for (const sub of this.subscriptions.values()) {
          if (sub.filter && !sub.filter(payload)) continue;
          sub.onMessage(payload);
        }
      };
    } catch (err: any) {
      this.setStatus("error", err?.message || "Errore connessione websocket");
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer || this.subscriptions.size === 0) return;
    const delay = Math.min(this.reconnectDelayMs, 30000);
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      this.connectIfNeeded();
    }, delay);
    this.reconnectDelayMs = Math.min(this.reconnectDelayMs * 2, 30000);
  }

  private scheduleClose() {
    if (this.closeTimer) return;
    this.closeTimer = window.setTimeout(() => {
      this.closeTimer = null;
      if (this.subscriptions.size === 0) {
        this.closeSocket();
      }
    }, this.closeDelayMs);
  }

  private closeSocket() {
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.closeTimer) {
      window.clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.setStatus("closed");
  }

  private setStatus(status: WsStatus, detail?: string) {
    this.status = status;
    this.lastError = status === "error" || status === "closed" ? detail || this.lastError : null;
    if (detail) {
      const level = status === "error" ? "error" : status === "closed" ? "warning" : "info";
      this.pushLog(level, detail);
    }
    for (const sub of this.subscriptions.values()) {
      sub.onStatus?.(status, detail);
    }
    for (const cb of this.statusSubscribers.values()) {
      cb(status, detail);
    }
  }

  private pushLog(level: WsLogEntry["level"], message: string) {
    const entry = { ts: new Date().toISOString(), level, message };
    this.logs = [entry, ...this.logs].slice(0, 50);
  }
}

export const redisWsBridgeClient = new RedisWsBridgeClient();
