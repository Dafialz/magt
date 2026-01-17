// src/lib/config.ts

/**
 * ✅ Network selector
 * Priority:
 * 1) URL param ?network=testnet|mainnet
 * 2) VITE_TON_NETWORK from env
 * 3) Production domain (magtcoin.com) -> mainnet
 * 4) Everything else -> testnet
 */
function detectNetwork(): "testnet" | "mainnet" {
  // 1) URL override
  const params = new URLSearchParams(window.location.search);
  const forced = params.get("network");
  if (forced === "testnet" || forced === "mainnet") return forced;

  // 2) Env override (Vite)
  const envNet = (import.meta as any)?.env?.VITE_TON_NETWORK;
  if (envNet === "testnet" || envNet === "mainnet") return envNet;

  // 3) Fallback by domain
  const host = window.location.hostname.toLowerCase();
  const isProdDomain = host === "magtcoin.com" || host === "www.magtcoin.com";
  return isProdDomain ? "mainnet" : "testnet";
}

export const NETWORK = detectNetwork();
export const IS_TESTNET = NETWORK === "testnet";

/**
 * ✅ TonConnect manifest MUST be served from the same domain
 */
export const TONCONNECT_MANIFEST_URL = `${window.location.origin}/tonconnect-manifest.json`;

/** ✅ TonAPI base */
export const TONAPI_BASE = IS_TESTNET ? "https://testnet.tonapi.io" : "https://tonapi.io";

/**
 * ✅ Toncenter JSON-RPC (fallback when TonAPI is blocked/unreachable)
 * Without API key Toncenter is rate-limited. You can set:
 * VITE_TONCENTER_API_KEY or VITE_TONCENTER_KEY
 */
export const TONCENTER_JSONRPC = IS_TESTNET
  ? "https://testnet.toncenter.com/api/v2/jsonRPC"
  : "https://toncenter.com/api/v2/jsonRPC";

export const TONCENTER_API_KEY =
  ((import.meta as any)?.env?.VITE_TONCENTER_API_KEY as string | undefined) ||
  ((import.meta as any)?.env?.VITE_TONCENTER_KEY as string | undefined) ||
  undefined;

/**
 * ✅ Contracts (addresses)
 * Change ONLY these when you redeploy.
 */
export const PRESALE_CONTRACT = IS_TESTNET
  // ✅ REAL testnet presale (from your `blueprint run check --testnet`)
  ? "EQCE9yKrcWUjhqg9b-b5RFpcYtDwUHnniH9j1QQEWks4zwUE"
  : "EQB5YKJxw9D_FFLzHHg4yXlbaSWlmy9p4d2Akk3TsnlYxx94";

export const JETTON_MASTER = IS_TESTNET
  ? "EQBxf0WPlKLvrQtgqawLe_vHsxfJ4GdNJbGvwVXPmpUIdOlx"
  : "EQDxQWrZz7vI1EqVvtDv1sFLmvK1hNpxrQpvMXhjBasUSXjx";
