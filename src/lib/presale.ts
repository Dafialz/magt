// src/lib/presale.ts

import { Address, beginCell } from "@ton/core";
import { TONAPI_BASE, JETTON_MASTER, PRESALE_CONTRACT } from "./config";

/* ===== Tokenomics/rounds constants ===== */

export const ROUNDS_TOKENS = [
  65_225_022, 57_039_669, 50_370_908, 44_326_399, 39_007_231,
  34_326_365, 30_207_200, 26_582_336, 23_392_455, 20_585_361,
  18_115_117, 15_941_303, 14_028_347, 12_344_945, 10_863_552,
  9_559_925, 8_412_734, 7_423_267, 6_514_821, 5_733_043,
];

export const ROUND_TOKENS = ROUNDS_TOKENS;
export const TOTAL_PRESALE_TOKENS = ROUNDS_TOKENS.reduce((a, b) => a + b, 0);

// jetton decimals = 9
const JETTON_DECIMALS = 9n;
const NANO = 10n ** JETTON_DECIMALS;
const TOTAL_PRESALE_NANO = BigInt(TOTAL_PRESALE_TOKENS) * NANO;

export type PresaleSnapshot = {
  currentRound: number;
  soldTotalNano: bigint;
  soldInRoundNano: bigint;
  totalRaisedNano: bigint;
  claimableNano: bigint; // getter claimableNano(address)
};

/* ===== price ===== */
export function priceUsd(roundIndex: number): number {
  const base = 0.011;
  const step = 0.001;
  return base + roundIndex * step;
}

export const TON_USD_REFERENCE = 5;

export function getRoundPriceTon(roundIndex: number): number {
  const i = clampRoundIndex(roundIndex);
  const usd = priceUsd(i);

  const tonUsd = TON_USD_REFERENCE;
  if (!Number.isFinite(usd) || usd <= 0) return 0;
  if (!Number.isFinite(tonUsd) || tonUsd <= 0) return 0;

  const ton = usd / tonUsd;
  return Number.isFinite(ton) && ton > 0 ? ton : 0;
}

/* ===== helpers ===== */

export function fromNano(n: bigint): number {
  const s = n.toString();
  if (s.length <= 9) return Number(s) / 1e9;
  const head = s.slice(0, -9);
  const tail = s.slice(-9);
  return Number(`${head}.${tail}`);
}

class RateLimitError extends Error {
  retryAfterMs: number;
  constructor(retryAfterMs: number) {
    super("TONAPI_RATE_LIMIT");
    this.retryAfterMs = retryAfterMs;
  }
}

function retryAfterToMs(h: string | null): number {
  if (!h) return 10_000;
  const n = Number(h);
  if (Number.isFinite(n) && n > 0) return Math.min(60_000, n * 1000);
  return 10_000;
}

async function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function fetchJson<T>(
  url: string,
  opts?: {
    /** How many times to retry on TONAPI rate limit (429). */
    retries?: number;
  }
): Promise<T> {
  const retries = Math.max(0, Math.floor(opts?.retries ?? 0));

  for (let attempt = 0; attempt <= retries; attempt++) {
    const r = await fetch(url, {
      cache: "no-store",
      headers: {
        // extra anti-cache for some CDNs
        "cache-control": "no-cache",
        pragma: "no-cache",
      },
    });

    if (r.status === 429) {
      const retryAfterMs = retryAfterToMs(r.headers.get("retry-after"));

      // if we still have attempts left -> short wait then retry
      if (attempt < retries) {
        await sleep(Math.min(1500, retryAfterMs));
        continue;
      }

      throw new RateLimitError(retryAfterMs);
    }

    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return (await r.json()) as T;
  }

  // unreachable
  throw new Error("UNREACHABLE");
}

type TonApiRunGetMethodResp = {
  exit_code?: number;
  exitCode?: number;
  stack?: any[];
};

function clampRoundIndex(i: number): number {
  return Math.max(0, Math.min(i, ROUNDS_TOKENS.length - 1));
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function stackItemToBigInt(item: any): bigint {
  // TonAPI v2 може повертати stack як:
  // ["num","0x..."] або ["num","123"] або {type:"num", value:"..."}
  const t = Array.isArray(item) ? item[0] : item?.type;
  const v = Array.isArray(item) ? item[1] : item?.value;

  if (t === "num" || t === "int") {
    const s = String(v ?? "0");
    try {
      return BigInt(s);
    } catch {
      return 0n;
    }
  }

  if (typeof v === "string") {
    try {
      if (/^-?\d+$/.test(v)) return BigInt(v);
      if (v.startsWith("0x") || v.startsWith("-0x")) return BigInt(v);
    } catch {
      // ignore
    }
  }

  return 0n;
}

async function tonApiRunGetMethod(
  accountId: string,
  methodName: string,
  args: string[] = [],
  opts?: { retries?: number }
): Promise<TonApiRunGetMethodResp> {
  const qs = new URLSearchParams();
  for (const a of args) qs.append("args", a);

  // анти-кеш на CDN
  qs.set("t", String(Date.now()));

  const url = `${TONAPI_BASE}/v2/blockchain/accounts/${accountId}/methods/${encodeURIComponent(
    methodName
  )}?${qs.toString()}`;

  return await fetchJson<TonApiRunGetMethodResp>(url, { retries: opts?.retries ?? 0 });
}

function addressArgToBocB64(addr: string): string {
  const a = Address.parse(addr);
  const cell = beginCell().storeAddress(a).endCell();
  return bytesToBase64(cell.toBoc({ idx: false }));
}

/**
 * TonAPI getter з Address аргументом очікує args = [BOC(base64) cell]
 */
async function getClaimableFromContract(
  presaleAddr: string,
  walletAddr: string,
  opts?: { retries?: number }
): Promise<bigint> {
  const bocArg = addressArgToBocB64(walletAddr);
  const r = await tonApiRunGetMethod(presaleAddr, "claimableNano", [bocArg], opts);
  const exit = r.exit_code ?? r.exitCode ?? 1;
  if (exit === 0 && r.stack?.length) return stackItemToBigInt(r.stack[0]);
  return 0n;
}

/* ===== fallback (старий метод) ===== */

async function tonApiGetAccountBalanceNano(address: string): Promise<bigint> {
  const url = `${TONAPI_BASE}/v2/accounts/${address}?t=${Date.now()}`;
  const j = await fetchJson<any>(url);
  return BigInt(j?.balance ?? 0);
}

async function tonApiGetWalletJettonBalanceNano(
  walletAddress: string,
  jettonMaster: string
): Promise<bigint> {
  const url = `${TONAPI_BASE}/v2/accounts/${walletAddress}/jettons?t=${Date.now()}`;
  const j = await fetchJson<any>(url);

  const balances = Array.isArray(j?.balances) ? j.balances : [];
  const found = balances.find((b: any) => b?.jetton?.address === jettonMaster);

  return BigInt(found?.balance ?? 0);
}

function calcRoundFromSold(soldTotalNano: bigint): {
  currentRound: number;
  soldInRoundNano: bigint;
} {
  let cum = 0n;
  for (let i = 0; i < ROUNDS_TOKENS.length; i++) {
    const capNano = BigInt(ROUNDS_TOKENS[i]) * NANO;
    if (soldTotalNano < cum + capNano) {
      return { currentRound: i, soldInRoundNano: soldTotalNano - cum };
    }
    cum += capNano;
  }
  const last = clampRoundIndex(ROUNDS_TOKENS.length - 1);
  const lastCapNano = BigInt(ROUNDS_TOKENS[last]) * NANO;
  return { currentRound: last, soldInRoundNano: lastCapNano };
}

/* ===== anti-429 cache / coalescing ===== */

type CacheEntry = {
  ts: number;
  data?: PresaleSnapshot;
  inFlight?: Promise<PresaleSnapshot>;
  cooldownUntil?: number;
};

const SNAPSHOT_CACHE = new Map<string, CacheEntry>();

function cacheKey(presale: string, wallet?: string) {
  return `${presale}::${wallet ?? "-"}`;
}

const MIN_FETCH_INTERVAL_MS = 8_000;

function emptySnapshot(): PresaleSnapshot {
  return {
    currentRound: 0,
    soldTotalNano: 0n,
    soldInRoundNano: 0n,
    totalRaisedNano: 0n,
    claimableNano: 0n,
  };
}

/* ===== main ===== */

export async function getPresaleSnapshot(args?: {
  presaleAddress?: string;
  walletAddress?: string;
  force?: boolean; // ✅ bypass cache після TX
}): Promise<PresaleSnapshot> {
  const presaleAddress = args?.presaleAddress ?? PRESALE_CONTRACT;
  const walletAddress = args?.walletAddress;
  const force = !!args?.force;

  // When force=true (after TX) we allow a small retry window on 429.
  const tonApiRetries = force ? 1 : 0;

  const key = cacheKey(presaleAddress, walletAddress);
  const t0 = Date.now();
  const entry: CacheEntry = SNAPSHOT_CACHE.get(key) ?? { ts: 0 };

  // cooldown після 429
  if (!force && entry.cooldownUntil && t0 < entry.cooldownUntil) {
    return entry.data ?? emptySnapshot();
  }

  // coalesce
  if (entry.inFlight) return entry.inFlight;

  // cache interval
  if (!force && entry.data && t0 - entry.ts < MIN_FETCH_INTERVAL_MS) {
    return entry.data;
  }

  const doFetch = (async () => {
    try {
      // ✅ основне: читаємо getter-и контракту
      const [rRaised, rSold, rRound, rRoundSold] = await Promise.all([
        tonApiRunGetMethod(presaleAddress, "totalRaisedNano", [], { retries: tonApiRetries }),
        tonApiRunGetMethod(presaleAddress, "totalSoldNano", [], { retries: tonApiRetries }),
        tonApiRunGetMethod(presaleAddress, "currentRound", [], { retries: tonApiRetries }),
        tonApiRunGetMethod(presaleAddress, "currentRoundSoldNano", [], { retries: tonApiRetries }),
      ]);

      const ok =
        (rRaised.exit_code ?? rRaised.exitCode ?? 1) === 0 &&
        (rSold.exit_code ?? rSold.exitCode ?? 1) === 0 &&
        (rRound.exit_code ?? rRound.exitCode ?? 1) === 0 &&
        (rRoundSold.exit_code ?? rRoundSold.exitCode ?? 1) === 0 &&
        !!rRaised.stack?.length &&
        !!rSold.stack?.length &&
        !!rRound.stack?.length &&
        !!rRoundSold.stack?.length;

      if (!ok) throw new Error("GETTERS_FAILED");

      const totalRaisedNano = stackItemToBigInt(rRaised.stack![0]);
      const soldTotalNano = stackItemToBigInt(rSold.stack![0]);
      const currentRound = Number(stackItemToBigInt(rRound.stack![0]));
      const soldInRoundNano = stackItemToBigInt(rRoundSold.stack![0]);

      let claimableNano = 0n;
      if (walletAddress) {
        claimableNano = await getClaimableFromContract(presaleAddress, walletAddress, {
          retries: tonApiRetries,
        });
      }

      const data: PresaleSnapshot = {
        currentRound: clampRoundIndex(currentRound),
        soldTotalNano: soldTotalNano < 0n ? 0n : soldTotalNano,
        soldInRoundNano: soldInRoundNano < 0n ? 0n : soldInRoundNano,
        totalRaisedNano: totalRaisedNano < 0n ? 0n : totalRaisedNano,
        claimableNano: claimableNano < 0n ? 0n : claimableNano,
      };

      SNAPSHOT_CACHE.set(key, { ts: Date.now(), data });
      return data;
    } catch (e: any) {
      // 429 -> cooldown + повертаємо попереднє значення, щоб UI не ставав 0
      if (e instanceof RateLimitError) {
        const prev = SNAPSHOT_CACHE.get(key);
        // Якщо force=true (після TX) — не ставимо довгий cooldown,
        // щоб polling міг одразу повторити запит.
        if (!force) {
          const cooldownUntil = Date.now() + e.retryAfterMs;
          SNAPSHOT_CACHE.set(key, {
            ts: prev?.ts ?? 0,
            data: prev?.data,
            cooldownUntil,
          });
        }
        return prev?.data ?? emptySnapshot();
      }

      // fallback: старий спосіб (не ідеальний, але краще ніж 0)
      try {
        const totalRaisedNano = await tonApiGetAccountBalanceNano(presaleAddress);

        const remainingNano = await tonApiGetWalletJettonBalanceNano(
          presaleAddress,
          JETTON_MASTER
        );

        const soldTotalNano =
          TOTAL_PRESALE_NANO > remainingNano ? TOTAL_PRESALE_NANO - remainingNano : 0n;

        const { currentRound, soldInRoundNano } = calcRoundFromSold(soldTotalNano);

        // тут claimable як jetton balance гаманця — НЕ те саме, але fallback
        let claimableNano = 0n;
        if (walletAddress) {
          claimableNano = await tonApiGetWalletJettonBalanceNano(walletAddress, JETTON_MASTER);
        }

        const data: PresaleSnapshot = {
          currentRound,
          soldTotalNano,
          soldInRoundNano,
          totalRaisedNano,
          claimableNano,
        };

        SNAPSHOT_CACHE.set(key, { ts: Date.now(), data });
        return data;
      } catch {
        return entry.data ?? emptySnapshot();
      }
    } finally {
      const cur = SNAPSHOT_CACHE.get(key);
      if (cur) delete cur.inFlight;
    }
  })();

  SNAPSHOT_CACHE.set(key, { ...entry, inFlight: doFetch });
  return doFetch;
}
