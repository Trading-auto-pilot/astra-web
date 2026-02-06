// modules/RuleEngine.js
"use strict";

const axios = require("axios");
const TwilioClient = require("./twilio");
const EmailClient = require("./email");

const DEFAULT_WINDOW_SECONDS = 300;
const DEFAULT_MAX_PER_WINDOW = 3;
const DEFAULT_DEDUP_SECONDS = 0;

class RuleEngine {
  constructor({ bus, logger, dbmanagerUrl, env }) {
    this.bus = bus;
    this.logger = logger;
    this.dbmanagerUrl = dbmanagerUrl;
    this.env = env || "DEV";

    this.rules = [];
    this.stateByRuleId = new Map();

    this.pattern =
      process.env.ALERTING_LOGS_PATTERN || `${this.env}.*.*.logs.*`;

    this.windowSeconds = Number(process.env.ALERTING_WINDOW_SECONDS) || DEFAULT_WINDOW_SECONDS;
    this.maxPerWindow = Number(process.env.ALERTING_MAX_PER_WINDOW) || DEFAULT_MAX_PER_WINDOW;
    this.dedupSeconds = Number(process.env.ALERTING_DEDUP_SECONDS) || DEFAULT_DEDUP_SECONDS;

    this.http = axios.create({
      baseURL: this.dbmanagerUrl,
      timeout: 15000,
      validateStatus: () => true,
    });

    this.twilio = new TwilioClient({ logger: this.logger });
    this.email = new EmailClient({ logger: this.logger });
  }

  async start() {
    await this.reloadRules();
    await this.subscribe();
    this.logger.info(
      `[ruleEngine] started pattern=${this.pattern} rules=${this.rules.length}`
    );
  }

  async subscribe() {
    await this.bus.psubscribe(this.pattern, async (msg, raw, channel) => {
      const payload = msg ?? this.safeJson(raw);
      if (!payload || typeof payload !== "object") return;
      await this.onLogMessage(payload, channel);
    });
  }

  async reloadRules() {
    const rulesResp = await this.http.get("/alerting-rules");
    if (rulesResp.status >= 400) {
      this.logger.error(
        `[ruleEngine] reload rules failed status=${rulesResp.status}`
      );
      return { ok: false, error: "rules load failed", status: rulesResp.status };
    }
    this.rules = Array.isArray(rulesResp.data?.items)
      ? rulesResp.data.items
      : [];

    const stateResp = await this.http.get("/alerting-state");
    if (stateResp.status < 400 && Array.isArray(stateResp.data?.items)) {
      this.stateByRuleId.clear();
      for (const st of stateResp.data.items) {
        if (st?.rule_id != null) this.stateByRuleId.set(Number(st.rule_id), st);
      }
    }

    this.logger.info(
      `[ruleEngine] reload ok rules=${this.rules.length} state=${this.stateByRuleId.size}`
    );
    return { ok: true, rules: this.rules.length, state: this.stateByRuleId.size };
  }

  safeJson(raw) {
    if (!raw || typeof raw !== "string") return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  normalizeEvent(payload, channel) {
    const ts = payload.ts ? new Date(payload.ts).getTime() : Date.now();
    return {
      ts,
      tsIso: payload.ts || new Date(ts).toISOString(),
      level: payload.level,
      microservice: payload.microservice,
      moduleName: payload.moduleName,
      functionName: payload.functionName,
      message: payload.message,
      channel,
      raw: payload,
    };
  }

  isMatch(event, rule) {
    const match = rule.match_json || {};
    if (rule.enabled === 0 || rule.enabled === false) return false;

    const inList = (v, list) =>
      !Array.isArray(list) || list.length === 0 || list.includes(v);

    if (!inList(event.level, match.levels)) return false;
    if (!inList(event.microservice, match.services)) return false;
    if (!inList(event.moduleName, match.modules)) return false;
    if (!inList(event.functionName, match.functions)) return false;
    if (!inList(event.channel, match.channels)) return false;

    if (match.message_grep) {
      try {
        const re = new RegExp(match.message_grep, "i");
        if (!re.test(event.message || "")) return false;
      } catch {
        return false;
      }
    }

    if (match.after_ts) {
      const t = new Date(match.after_ts).getTime();
      if (Number.isFinite(t) && event.ts < t) return false;
    }
    if (match.before_ts) {
      const t = new Date(match.before_ts).getTime();
      if (Number.isFinite(t) && event.ts > t) return false;
    }
    if (Array.isArray(match.between_ts) && match.between_ts.length === 2) {
      const a = new Date(match.between_ts[0]).getTime();
      const b = new Date(match.between_ts[1]).getTime();
      if (Number.isFinite(a) && event.ts < a) return false;
      if (Number.isFinite(b) && event.ts > b) return false;
    }

    return true;
  }

  async onLogMessage(payload, channel) {
    const event = this.normalizeEvent(payload, channel);
    if (!event.level || !event.microservice) return;

    for (const rule of this.rules) {
      if (!this.isMatch(event, rule)) continue;
      await this.applyRule(rule, event);
    }
  }

  buildHash(event) {
    return [
      event.level,
      event.microservice,
      event.moduleName,
      event.functionName,
      event.message,
    ]
      .filter(Boolean)
      .join("|");
  }

  renderTemplate(template, event) {
    const map = {
      message: event.message,
      level: event.level,
      microservice: event.microservice,
      moduleName: event.moduleName,
      functionName: event.functionName,
      ts: event.tsIso,
      channel: event.channel,
    };
    return String(template || "")
      .replace(/\{\{\s*(\w+)\s*\}\}/g, (_m, k) =>
        map[k] != null ? String(map[k]) : ""
      );
  }

  async ensureState(ruleId) {
    const key = Number(ruleId);
    if (this.stateByRuleId.has(key)) return this.stateByRuleId.get(key);
    const resp = await this.http.post("/alerting-state", { rule_id: key });
    if (resp.status >= 400) return null;
    const state = { rule_id: key, id: resp.data?.id };
    this.stateByRuleId.set(key, state);
    return state;
  }

  async updateState(ruleId, patch) {
    const state = await this.ensureState(ruleId);
    if (!state?.id) return;
    const resp = await this.http.put(`/alerting-state/${state.id}`, {
      rule_id: ruleId,
      ...patch,
    });
    if (resp.status < 400) {
      this.stateByRuleId.set(Number(ruleId), {
        ...state,
        ...patch,
      });
    }
  }

  async applyRule(rule, event) {
    const ruleId = Number(rule.id || rule.rule_id || rule.ruleId);
    if (!ruleId) return;

    const match = rule.match_json || {};
    const actions = rule.actions_json || {};

    const now = Date.now();
    const state = await this.ensureState(ruleId);
    const lastSentAt = state?.last_sent_at ? new Date(state.last_sent_at).getTime() : null;
    const lastHash = state?.last_hash || null;
    const windowStart = state?.window_start_at ? new Date(state.window_start_at).getTime() : null;
    const windowSeconds = Number(match.window_seconds) || this.windowSeconds;
    const maxPerWindow = Number(match.max_per_window) || this.maxPerWindow;
    const dedupSeconds = Number(match.dedup_seconds) || this.dedupSeconds;

    const hash = this.buildHash(event);

    if (dedupSeconds > 0 && lastHash === hash && lastSentAt && now - lastSentAt < dedupSeconds * 1000) {
      await this.updateState(ruleId, { last_matched_at: new Date(now).toISOString(), last_hash: hash });
      return;
    }

    let windowCount = Number(state?.window_count) || 0;
    let windowStartAt = windowStart;
    if (!windowStartAt || now - windowStartAt > windowSeconds * 1000) {
      windowStartAt = now;
      windowCount = 0;
    }

    if (windowCount >= maxPerWindow) {
      await this.updateState(ruleId, {
        last_matched_at: new Date(now).toISOString(),
        last_hash: hash,
        window_start_at: new Date(windowStartAt).toISOString(),
        window_count: windowCount,
      });
      return;
    }

    const body = this.renderTemplate(actions.template || rule.name || "Alert", event);
    const subject = actions.subject || `Alert: ${rule.name || ruleId}`;

    const deliveries = [];
    const channels = Array.isArray(actions.channels) ? actions.channels : [];

    for (const ch of channels) {
      try {
        if (ch === "whatsapp") {
          const msg = await this.twilio.sendWhatsAppMessage({ body });
          deliveries.push({ provider: "whatsapp", status: "sent", response_json: msg });
        } else if (ch === "email") {
          const info = await this.email.sendEmail({
            to: actions.to || process.env.ALERTING_DEFAULT_EMAIL_TO,
            subject,
            body,
          });
          deliveries.push({ provider: "email", status: "sent", response_json: info });
        }
      } catch (err) {
        deliveries.push({
          provider: ch,
          status: "failed",
          response_json: { error: err?.message || String(err) },
        });
      }
    }

    for (const d of deliveries) {
      await this.http.post("/alerting-deliveries", {
        rule_id: ruleId,
        provider: d.provider,
        status: d.status,
        response_json: d.response_json,
      });
    }

    windowCount += 1;
    await this.updateState(ruleId, {
      last_sent_at: new Date(now).toISOString(),
      last_matched_at: new Date(now).toISOString(),
      last_hash: hash,
      window_start_at: new Date(windowStartAt).toISOString(),
      window_count: windowCount,
    });
  }
}

module.exports = RuleEngine;
