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
 * ✅ Contracts (addresses)
 * Change ONLY these when you redeploy.
 */
export const PRESALE_CONTRACT = IS_TESTNET
  // ✅ from your deployed testnet project (ADDR=... converted to friendly):
  ? "EQBNE7SAd3FrDrc-1GOWcmt5YZdtvsDdTk7QOFKW1221oing"
  : "EQB5YKJxw9D_FFLzHHg4yXlbaSWlmy9p4d2Akk3TsnlYxx94";

export const JETTON_MASTER = IS_TESTNET
  ? "EQBxf0WPlKLvrQtgqawLe_vHsxfJ4GdNJbGvwVXPmpUIdOlx"
  : "EQDxQWrZz7vI1EqVvtDv1sFLmvK1hNpxrQpvMXhjBasUSXjx";
