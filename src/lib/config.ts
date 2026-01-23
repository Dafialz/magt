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

/** ✅ TonAPI base (DO NOT rely on it as primary in browser; may be blocked by CORS/429) */
export const TONAPI_BASE = IS_TESTNET ? "https://testnet.tonapi.io" : "https://tonapi.io";

/**
 * ✅ Toncenter JSON-RPC (PRIMARY for onchain getters)
 *
 * IMPORTANT:
 * - Any `VITE_*` variable is **not secret** in a frontend build (it is bundled into JS).
 * - We still avoid custom headers here to reduce CORS/preflight issues.
 * - Toncenter supports passing the key via `?api_key=...` query param.
 */
const TONCENTER_JSONRPC_BASE = IS_TESTNET
  ? "https://testnet.toncenter.com/api/v2/jsonRPC"
  : "https://toncenter.com/api/v2/jsonRPC";

export const TONCENTER_API_KEY =
  ((import.meta as any)?.env?.VITE_TONCENTER_API_KEY as string | undefined) ||
  ((import.meta as any)?.env?.VITE_TONCENTER_KEY as string | undefined) ||
  undefined;

/** ✅ Final JSON-RPC endpoint (adds ?api_key=... when key exists) */
export const TONCENTER_JSONRPC = (() => {
  const key = TONCENTER_API_KEY?.trim();
  if (!key) return TONCENTER_JSONRPC_BASE;

  const sep = TONCENTER_JSONRPC_BASE.includes("?") ? "&" : "?";
  return `${TONCENTER_JSONRPC_BASE}${sep}api_key=${encodeURIComponent(key)}`;
})();

/**
 * ✅ Contracts (addresses)
 * Change ONLY these when you redeploy...
 */
export const PRESALE_CONTRACT = IS_TESTNET
  ? "EQA5hmaTH4pNyqOQeGCjxIMlYmpgqrbSnS_RaYBXKPJUpUeW"
  : "EQB5YKJxw9D_FFLzHHg4yXlbaSWlmy9p4d2Akk3TsnlYxx94";

export const JETTON_MASTER = IS_TESTNET
  ? "EQBxf0WPlKLvrQtgqawLe_vHsxfJ4GdNJbGvwVXPmpUIdOlx"
  : "EQDxQWrZz7vI1EqVvtDv1sFLmvK1hNpxrQpvMXhjBasUSXjx";
