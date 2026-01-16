// src/lib/config.ts

/**
 * ✅ Network selector
 * Priority:
 * 1) URL param (?network=testnet|mainnet, ?testnet=1, also from hash)
 * 2) VITE_TON_NETWORK from env
 * 3) Production domain (magtcoin.com) -> mainnet
 * 4) Everything else -> testnet
 */
function detectNetwork(): "testnet" | "mainnet" {
  const href = window.location.href;
  const url = new URL(href);

  const normalize = (v?: string | null) => {
    const s = (v ?? "").trim().toLowerCase();
    if (s === "testnet" || s === "mainnet") return s as "testnet" | "mainnet";
    return null;
  };

  // 1) URL search params
  const forcedSearch =
    normalize(url.searchParams.get("network")) ??
    (url.searchParams.get("testnet") === "1" ? "testnet" : null) ??
    (url.searchParams.get("mainnet") === "1" ? "mainnet" : null);

  if (forcedSearch) return forcedSearch;

  // 2) URL hash (#network=testnet)
  if (url.hash) {
    const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
    const forcedHash =
      normalize(hashParams.get("network")) ??
      (hashParams.get("testnet") === "1" ? "testnet" : null) ??
      (hashParams.get("mainnet") === "1" ? "mainnet" : null);

    if (forcedHash) return forcedHash;
  }

  // 3) Env override (Vite)
  const envNet = normalize((import.meta as any)?.env?.VITE_TON_NETWORK);
  if (envNet) return envNet;

  // 4) Fallback by domain
  const host = window.location.hostname.toLowerCase();
  const isProdDomain = host === "magtcoin.com" || host === "www.magtcoin.com";
  return isProdDomain ? "mainnet" : "testnet";
}

export const NETWORK = detectNetwork();
export const IS_TESTNET = NETWORK === "testnet";

/**
 * ✅ TonConnect manifest MUST be served from the same domain
 */
export const TONCONNECT_MANIFEST_URL =
  `${window.location.origin}/tonconnect-manifest.json`;

/** ✅ TonAPI base */
export const TONAPI_BASE = IS_TESTNET
  ? "https://testnet.tonapi.io"
  : "https://tonapi.io";

/**
 * ✅ Contracts (addresses)
 * Change ONLY these when you redeploy.
 */
export const PRESALE_CONTRACT = IS_TESTNET
  ? "EQCE9yKrcWUjhqg9b-b5RFpcYtDwUHnniH9j1QQEWks4zwUE" // testnet
  : "EQB5YKJxw9D_FFLzHHg4yXlbaSWlmy9p4d2Akk3TsnlYxx94"; // mainnet

export const JETTON_MASTER = IS_TESTNET
  ? "EQBxf0WPlKLvrQtgqawLe_vHsxfJ4GdNJbGvwVXPmpUIdOlx" // testnet
  : "EQDxQWrZz7vI1EqVvtDv1sFLmvK1hNpxrQpvMXhjBasUSXjx"; // mainnet

// 🧠 Debug helpers (safe to keep)
;(window as any).__MAGT_NETWORK__ = NETWORK;
;(window as any).__MAGT_PRESALE__ = PRESALE_CONTRACT;
