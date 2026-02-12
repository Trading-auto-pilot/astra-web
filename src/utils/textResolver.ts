// ---------------------------------------------------------------------------
// textResolver – risolve placeholder [[...]] in testi dinamici (frontend)
//
// Sintassi supportata:
//   [[today]]                     => data odierna YYYY-MM-DD
//   [[today,DD/MM/YYYY]]         => data odierna con formato custom
//   [[today+3]]                  => oggi + 3 giorni
//   [[today-7,DD-MM-YYYY]]       => oggi - 7 giorni formattato
//   [[yesterday]]                => alias today-1
//   [[tomorrow]]                 => alias today+1
//   [[now]]                      => datetime ISO completo
//   [[now,YYYY-MM-DD HH:mm:ss]] => datetime formattato
//   [[lastBusinessDay]]          => ultimo giorno lavorativo (lun-ven)
//   [[lastBusinessDay-5]]        => 5 business day fa
//   [[timestamp]]                => unix epoch in secondi
//   [[uuid]]                     => identificativo univoco v4
//   [[chiave]]                   => valore da vars (se passato)
// ---------------------------------------------------------------------------

const PLACEHOLDER_RE = /\[\[([^\]]+)\]\]/g;
const DATE_BUILTIN_RE =
  /^(today|now|yesterday|tomorrow|lastBusinessDay)([+-]\d+)?(?:,(.+))?$/;

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function formatDate(date: Date, format = "YYYY-MM-DD"): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error(`[textResolver] Data non valida: ${date}`);
  }
  const tokens: Record<string, string> = {
    YYYY: String(date.getFullYear()),
    MM: pad2(date.getMonth() + 1),
    DD: pad2(date.getDate()),
    HH: pad2(date.getHours()),
    mm: pad2(date.getMinutes()),
    ss: pad2(date.getSeconds()),
  };
  let result = format;
  for (const [token, value] of Object.entries(tokens)) {
    result = result.split(token).join(value);
  }
  return result;
}

function applyBusinessDayOffset(date: Date, offset: number): Date {
  const d = new Date(date.getTime());
  const dow = d.getDay();
  if (dow === 0) d.setDate(d.getDate() - 2);
  else if (dow === 6) d.setDate(d.getDate() - 1);

  if (offset === 0) return d;

  const step = offset > 0 ? 1 : -1;
  let remaining = Math.abs(offset);
  while (remaining > 0) {
    d.setDate(d.getDate() + step);
    const wd = d.getDay();
    if (wd !== 0 && wd !== 6) remaining--;
  }
  return d;
}

function parseExpression(expr: string) {
  const m = DATE_BUILTIN_RE.exec(expr.trim());
  if (!m) return null;

  let keyword = m[1];
  let offset = m[2] ? parseInt(m[2], 10) : 0;
  const format = m[3] && m[3].trim() ? m[3].trim() : null;

  if (keyword === "yesterday") {
    keyword = "today";
    offset += -1;
  } else if (keyword === "tomorrow") {
    keyword = "today";
    offset += 1;
  }

  return { keyword, offset, format };
}

function resolvePlaceholder(
  expr: string,
  vars: Record<string, unknown>,
  now: Date
): string | null {
  const trimmed = expr.trim();

  if (trimmed === "timestamp") {
    return String(Math.floor(now.getTime() / 1000));
  }

  if (trimmed === "uuid") {
    return crypto.randomUUID();
  }

  const parsed = parseExpression(trimmed);
  if (parsed) {
    if (parsed.keyword === "lastBusinessDay") {
      const d = applyBusinessDayOffset(now, parsed.offset);
      return formatDate(d, parsed.format || "YYYY-MM-DD");
    }

    const d = new Date(now.getTime());
    if (parsed.offset) d.setDate(d.getDate() + parsed.offset);

    if (parsed.keyword === "now") {
      return parsed.format ? formatDate(d, parsed.format) : d.toISOString();
    }
    return formatDate(d, parsed.format || "YYYY-MM-DD");
  }

  if (vars && Object.prototype.hasOwnProperty.call(vars, trimmed)) {
    const val = vars[trimmed];
    return val == null ? "" : String(val);
  }

  return null;
}

export function resolveText(
  text: string,
  vars: Record<string, unknown> = {},
  opts: { now?: Date; jsonAware?: boolean } = {}
): string {
  if (typeof text !== "string") return text;
  if (!text.includes("[[")) return text;

  const now = opts.now instanceof Date ? opts.now : new Date();

  return text.replace(
    PLACEHOLDER_RE,
    (match, expr: string, offset: number) => {
      const resolved = resolvePlaceholder(expr, vars, now);
      if (resolved === null) return match;

      if (opts.jsonAware) {
        const before = offset > 0 ? text[offset - 1] : "";
        const after =
          offset + match.length < text.length ? text[offset + match.length] : "";

        // Se gia dentro virgolette "[[...]]", inserisci il valore diretto
        if (before === '"' && after === '"') return resolved;

        // Se il valore e' un primitivo JSON valido (numero, bool, null), lascialo bare
        if (
          /^-?\d+(\.\d+)?$/.test(resolved) ||
          resolved === "true" ||
          resolved === "false" ||
          resolved === "null"
        ) {
          return resolved;
        }

        // Altrimenti wrappa in virgolette per produrre JSON valido
        return `"${resolved.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
      }

      return resolved;
    }
  );
}
