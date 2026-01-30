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
 * For mainnet domain magtcoin.com it is correct.
 * If you later create testnet.magtcoin.com — manifest must exist there too.
 */
export const TONCONNECT_MANIFEST_URL = `${window.location.origin}/tonconnect-manifest.json`;

/** ✅ TonAPI base */
export const TONAPI_BASE = IS_TESTNET ? "https://testnet.tonapi.io" : "https://tonapi.io";

/**
 * ✅ Toncenter JSON-RPC endpoints (network-specific)
 */
const TONCENTER_JSONRPC_BASE = IS_TESTNET
  ? "https://testnet.toncenter.com/api/v2/jsonRPC"
  : "https://toncenter.com/api/v2/jsonRPC";

/**
 * ✅ Use different keys for different networks.
 * Put these in Netlify env:
 * - VITE_TONCENTER_API_KEY_MAINNET
 * - VITE_TONCENTER_API_KEY_TESTNET
 *
 * If you set only one key and it doesn't match the network -> you will get 401.
 *
 * ⚠️ Any VITE_* is public in frontend build. Do NOT put "secret" keys here if you don't want them exposed.
 */
const TONCENTER_API_KEY_MAINNET =
  ((import.meta as any)?.env?.VITE_TONCENTER_API_KEY_MAINNET as string | undefined) ||
  ((import.meta as any)?.env?.VITE_TONCENTER_MAINNET_KEY as string | undefined) ||
  undefined;

const TONCENTER_API_KEY_TESTNET =
  ((import.meta as any)?.env?.VITE_TONCENTER_API_KEY_TESTNET as string | undefined) ||
  ((import.meta as any)?.env?.VITE_TONCENTER_TESTNET_KEY as string | undefined) ||
  undefined;

export const TONCENTER_API_KEY = (IS_TESTNET ? TONCENTER_API_KEY_TESTNET : TONCENTER_API_KEY_MAINNET) || undefined;

/**
 * ✅ Final JSON-RPC endpoint (adds ?api_key=... when key exists)
 * If key is missing -> works without key (may be rate-limited, but won't be 401).
 */
export const TONCENTER_JSONRPC = (() => {
  const key = TONCENTER_API_KEY?.trim();
  if (!key) return TONCENTER_JSONRPC_BASE;

  const sep = TONCENTER_JSONRPC_BASE.includes("?") ? "&" : "?";
  return `${TONCENTER_JSONRPC_BASE}${sep}api_key=${encodeURIComponent(key)}`;
})();

/**
 * ✅ Contracts (addresses)
 * Change ONLY these when you redeploy...
 *
 * testnet values must match your presale-contract repo scripts/addresses.ts
 */
export const PRESALE_CONTRACT = IS_TESTNET
  ? "EQBUUq2H8W1ftuqMcpgmX6xy9EK-NsCmIeYFwuB5zQB-K80v"
  : "EQB5YKJxw9D_FFLzHHg4yXlbaSWlmy9p4d2Akk3TsnlYxx94";

export const JETTON_MASTER = IS_TESTNET
  ? "EQBxf0WPlKLvrQtgqawLe_vHsxfJ4GdNJbGvwVXPmpUIdOlx"
  : "EQDxQWrZz7vI1EqVvtDv1sFLmvK1hNpxrQpvMXhjBasUSXjx";
