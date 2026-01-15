// src/lib/config.ts

/**
 * TON Connect manifest
 * Для testnet можна залишити той самий,
 * головне щоб manifest був доступний по HTTPS
 */
export const TONCONNECT_MANIFEST_URL =
  "https://magtcoin.com/tonconnect-manifest.json";

/**
 * Presale contract address (TESTNET)
 * Задеплоєний і перевірений через blueprint
 */
export const PRESALE_CONTRACT =
  "EQCE9yKrcWUjhqg9b-b5RFpcYtDwUHnniH9j1QQEWks4zwUE";

/**
 * Network flag (зручно для UI / логіки)
 */
export const IS_TESTNET = true;
