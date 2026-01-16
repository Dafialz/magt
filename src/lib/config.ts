// src/lib/config.ts

/**
 * ✅ Network selector
 * - Production domain (magtcoin.com) -> mainnet
 * - Everything else (Netlify previews, localhost) -> testnet
 * - You can force via query param: ?network=testnet|mainnet
 */
function detectNetwork(): "testnet" | "mainnet" {
  const params = new URLSearchParams(window.location.search);
  const forced = params.get("network");
  if (forced === "testnet" || forced === "mainnet") return forced;

  const host = window.location.hostname.toLowerCase();
  const isProdDomain = host === "magtcoin.com" || host === "www.magtcoin.com";
  return isProdDomain ? "mainnet" : "testnet";
}

export const NETWORK = detectNetwork();
export const IS_TESTNET = NETWORK === "testnet";

/**
 * ✅ TonConnect manifest MUST be served from the same domain as your frontend
 * (Netlify / localhost / magtcoin.com)
 */
export const TONCONNECT_MANIFEST_URL = `${window.location.origin}/tonconnect-manifest.json`;

/** ✅ TonAPI base */
export const TONAPI_BASE = IS_TESTNET
  ? "https://testnet.tonapi.io"
  : "https://tonapi.io";

/**
 * ✅ Contracts (addresses)
 * Change ONLY these when you redeploy.
 * Keep testnet addresses here, mainnet addresses for production domain.
 */
export const PRESALE_CONTRACT = IS_TESTNET
  ? "EQCE9yKrcWUjhqg9b-b5RFpcYtDwUHnniH9j1QQEWks4zwUE"
  : "EQB5YKJxw9D_FFLzHHg4yXlbaSWlmy9p4d2Akk3TsnlYxx94";

export const JETTON_MASTER = IS_TESTNET
  ? "EQBxf0WPlKLvrQtgqawLe_vHsxfJ4GdNJbGvwVXPmpUIdOlx"
  : "EQDxQWrZz7vI1EqVvtDv1sFLmvK1hNpxrQpvMXhjBasUSXjx";
