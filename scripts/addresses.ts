// scripts/addresses.ts
import { Address } from "@ton/core";

/**
 * ⚠️ SINGLE SOURCE OF TRUTH
 * Якщо деплоїш новий presale — МІНЯЄШ АДРЕСУ ТІЛЬКИ ТУТ
 * і більше НІДЕ
 */

// ✅ ACTIVE PRESALE (testnet) — NEW
export const PRESALE = Address.parse(
  "EQCE9yKrcWUjhqg9b-b5RFpcYtDwUHnniH9j1QQEWks4zwUE"
);

// ✅ Jetton Minter (MAGT / testnet)
export const JETTON_MINTER = Address.parse(
  "EQBxf0WPlKLvrQtgqawLe_vHsxfJ4GdNJbGvwVXPmpUIdOlx"
);
