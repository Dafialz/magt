// src/lib/ton.ts
/**
 * Unix timestamp (seconds) "now + N seconds".
 * TonConnect expects `validUntil` in seconds.
 */
export function nowPlus(seconds: number): number {
  return Math.floor(Date.now() / 1000) + Math.max(0, seconds | 0);
}

/**
 * TonConnect UI показує warning якщо validUntil > 5 хв від "now".
 * Тому ми обмежуємо до 5 хв (300с) за замовчуванням.
 */
export function safeValidUntil(seconds: number): number {
  const max = 5 * 60; // 300
  return nowPlus(Math.min(Math.max(0, seconds | 0), max));
}

/**
 * TON -> nanoTON (string)
 * Робимо через строку, щоб уникнути проблем з float (0.1 * 1e9 і т.д.).
 */
export function toNanoTon(ton: number | string): string {
  const s = (typeof ton === "number" ? ton.toString() : ton).trim();
  if (!s) return "0";

  // allow "1", "1.", "1.23"
  if (!/^\d+(?:\.\d+)?$/.test(s)) return "0";

  const [intPartRaw, fracRaw = ""] = s.split(".");
  const intPart = intPartRaw.replace(/^0+(?=\d)/, "");
  const frac = (fracRaw + "000000000").slice(0, 9); // pad/cut to 9 decimals

  const nanoStr = (intPart + frac).replace(/^0+(?=\d)/, "");
  return nanoStr === "" ? "0" : nanoStr;
}

/**
 * Нормалізує введення TON (для інпутів):
 * - тільки цифри і крапка.
 * - максимум 9 знаків після крапки.
 */
export function sanitizeTonInput(v: string): string {
  const cleaned = v.replace(/[^0-9.]/g, "");
  const firstDot = cleaned.indexOf(".");
  if (firstDot === -1) return cleaned;
  const head = cleaned.slice(0, firstDot + 1);
  const tail = cleaned.slice(firstDot + 1).replace(/\./g, "").slice(0, 9);
  return head + tail;
}
