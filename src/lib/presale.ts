// src/lib/presale.ts

import { Address, beginCell } from "@ton/core";
import {
  TONAPI_BASE,
  JETTON_MASTER,
  PRESALE_CONTRACT,
  TONCENTER_API_KEY,
  TONCENTER_JSONRPC,
} from "./config";

/* ===== Tokenomics/rounds constants ===== */

export const ROUNDS_TOKENS = [
  65_225_022, 57_039_669, 50_370_908, 44_326_399, 39_007_231,
  34_326_365, 30_207_200, 26_582_336, 23_392_455, 20_585_361,
  18_115_117, 15_941_303, 14_028_347, 12_344_945, 10_863_552,
  9_559_925, 8_412_734, 7_423_267, 6_514_821, 5_733_043,
];

// backwards compat
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

  // ✅ NEW (for correct UI)
  claimableBuyerNano: bigint;    // getter claimableBuyerNano(address)
  claimableReferralNano: bigint; // getter claimableReferralNano(address)

  // backwards compat:
  claimableNano: bigint; // total = buyer + referral (or getter claimableNano(address) if you still want)
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
  constructor(retryAfterMs: number, msg = "RATE_LIMIT") {
    super(msg);
    this.retryAfterMs = retryAfterMs;
  }
}

function retryAfterToMs(h: string | null): number {
  if (!h) return 30_000;
  const n = Number(h);
  if (Number.isFinite(n) && n > 0) return Math.min(120_000, n * 1000);
  return 30_000;
}

async function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function fetchJson<T>(
  url: string,
  opts?: {
    retries?: number;
  }
): Promise<T> {
  const retries = Math.max(0, Math.floor(opts?.retries ?? 0));

  for (let attempt = 0; attempt <= retries; attempt++) {
    let r: Response;
    try {
      r = await fetch(url, {
        cache: "no-store",
        headers: {
          "cache-control": "no-cache",
          pragma: "no-cache",
        },
      });
    } catch {
      throw new Error("FETCH_FAILED");
    }

    if (r.status === 429) {
      const retryAfterMs = retryAfterToMs(r.headers.get("retry-after"));
      if (attempt < retries) {
        await sleep(Math.min(1500, retryAfterMs));
        continue;
      }
      throw new RateLimitError(retryAfterMs, "TONAPI_RATE_LIMIT");
    }

    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return (await r.json()) as T;
  }

  throw new Error("UNREACHABLE");
}

type TonRunGetResp = {
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

/* ===========================
   ✅ TonAPI (no burst)
   =========================== */

async function tonApiRunGetMethod(
  accountId: string,
  methodName: string,
  args: string[] = [],
  opts?: { retries?: number }
): Promise<TonRunGetResp> {
  const qs = new URLSearchParams();
  for (const a of args) qs.append("args", a);
  qs.set("t", String(Date.now()));

  const url = `${TONAPI_BASE}/v2/blockchain/accounts/${accountId}/methods/${encodeURIComponent(
    methodName
  )}?${qs.toString()}`;

  return await fetchJson<TonRunGetResp>(url, { retries: opts?.retries ?? 0 });
}

/* ===========================
   ✅ Toncenter JSON-RPC (rate limited)
   =========================== */

let TONCENTER_QUEUE: Promise<void> = Promise.resolve();
let TONCENTER_LAST_AT = 0;

// без API key ставимо більший інтервал, з key — менший
function toncenterMinIntervalMs() {
  return TONCENTER_API_KEY ? 250 : 1500;
}

/**
 * Schedules a single slot in the toncenter queue.
 * Returns a release() that is safe to call multiple times.
 */
async function toncenterSchedule() {
  const prev = TONCENTER_QUEUE;

  let releaseRaw!: () => void;
  TONCENTER_QUEUE = new Promise<void>((r) => (releaseRaw = r));

  await prev;

  const wait = TONCENTER_LAST_AT + toncenterMinIntervalMs() - Date.now();
  if (wait > 0) await sleep(wait);

  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    releaseRaw();
  };

  return release;
}

async function toncenterRunGetMethod(
  accountId: string,
  methodName: string,
  stack: any[] = []
): Promise<TonRunGetResp> {
  const release = await toncenterSchedule();

  try {
    const body = {
      jsonrpc: "2.0",
      id: 1,
      method: "runGetMethod",
      params: {
        address: accountId,
        method: methodName,
        stack,
      },
    };

    let r: Response;
    try {
      r = await fetch(TONCENTER_JSONRPC, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(TONCENTER_API_KEY ? { "X-API-Key": TONCENTER_API_KEY } : {}),
        },
        body: JSON.stringify(body),
      });
    } catch {
      throw new Error("TONCENTER_FETCH_FAILED");
    } finally {
      TONCENTER_LAST_AT = Date.now();
      release();
    }

    if (r.status === 429) {
      // toncenter часто не дає retry-after, ставимо 60s
      throw new RateLimitError(60_000, "TONCENTER_RATE_LIMIT");
    }

    if (!r.ok) throw new Error(`TONCENTER_HTTP_${r.status}`);

    const j = (await r.json()) as any;
    if (j?.error) throw new Error("TONCENTER_RPC_ERROR");

    const res = j?.result ?? j?.result?.result;
    if (!res) throw new Error("TONCENTER_NO_RESULT");

    return {
      exit_code: res.exit_code ?? res.exitCode,
      stack: res.stack,
    };
  } finally {
    // release already executed in fetch finally; this is just safety
    release();
  }
}

/* ===========================
   ✅ claimable argument helpers
   =========================== */

function addressArgToBocB64(addr: string): string {
  const a = Address.parse(addr);
  const cell = beginCell().storeAddress(a).endCell();
  return bytesToBase64(cell.toBoc({ idx: false }));
}

async function getGetterWithAddressArgTonApi(
  presaleAddr: string,
  getterName: string,
  walletAddr: string,
  opts?: { retries?: number }
): Promise<bigint> {
  const bocArg = addressArgToBocB64(walletAddr);
  const r = await tonApiRunGetMethod(presaleAddr, getterName, [bocArg], opts);
  const exit = r.exit_code ?? r.exitCode ?? 1;
  if (exit === 0 && r.stack?.length) return stackItemToBigInt(r.stack[0]);
  return 0n;
}

/**
 * Toncenter is picky about stack types; wrong one => 422.
 * We try multiple formats.
 */
async function getGetterWithAddressArgToncenter(
  presaleAddr: string,
  getterName: string,
  walletAddr: string
): Promise<bigint> {
  const bocArg = addressArgToBocB64(walletAddr);

  const candidates: any[][] = [
    [["tvm.Slice", bocArg]],
    [["slice", bocArg]],
    [{ type: "tvm.Slice", value: bocArg }],
    [{ type: "slice", value: bocArg }],
  ];

  for (const st of candidates) {
    try {
      const r = await toncenterRunGetMethod(presaleAddr, getterName, st);
      const exit = r.exit_code ?? r.exitCode ?? 1;
      if (exit === 0 && r.stack?.length) return stackItemToBigInt(r.stack[0]);
      return 0n;
    } catch (e: any) {
      const msg = String(e?.message ?? "");
      if (msg.includes("TONCENTER_HTTP_422")) continue;
      continue;
    }
  }

  return 0n;
}

async function getClaimableSplit(
  presaleAddr: string,
  walletAddr: string,
  opts?: { retries?: number; force?: boolean }
): Promise<{ buyer: bigint; referral: bigint; total: bigint }> {
  const tonApiRetries = opts?.retries ?? 0;

  try {
    const [buyer, referral] = await Promise.all([
      getGetterWithAddressArgTonApi(presaleAddr, "claimableBuyerNano", walletAddr, { retries: tonApiRetries }),
      getGetterWithAddressArgTonApi(presaleAddr, "claimableReferralNano", walletAddr, { retries: tonApiRetries }),
    ]);
    const total = buyer + referral;
    return { buyer, referral, total };
  } catch {
    const [buyer, referral] = await Promise.all([
      getGetterWithAddressArgToncenter(presaleAddr, "claimableBuyerNano", walletAddr),
      getGetterWithAddressArgToncenter(presaleAddr, "claimableReferralNano", walletAddr),
    ]);
    const total = buyer + referral;
    return { buyer, referral, total };
  }
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

type BaseEntry = {
  ts: number;
  data?: Omit<PresaleSnapshot, "claimableNano" | "claimableBuyerNano" | "claimableReferralNano">;
  inFlight?: Promise<Omit<PresaleSnapshot, "claimableNano" | "claimableBuyerNano" | "claimableReferralNano">>;
  cooldownUntil?: number;
};

type ClaimEntry = {
  ts: number;

  buyer?: bigint;
  referral?: bigint;
  total?: bigint;

  inFlight?: Promise<{ buyer: bigint; referral: bigint; total: bigint }>;
  cooldownUntil?: number;
};

// ✅ one base snapshot per presale
const BASE_CACHE = new Map<string, BaseEntry>();
// claimable is per-wallet
const CLAIM_CACHE = new Map<string, ClaimEntry>();

function baseKey(presale: string) {
  return presale;
}

function claimKey(presale: string, wallet: string) {
  return `${presale}::${wallet}`;
}

// звичайний режим
const MIN_FETCH_INTERVAL_MS = 20_000;
// force режим (після TX)
const MIN_FORCE_INTERVAL_MS = 8_000;
// claimable читаємо рідше
const CLAIMABLE_MIN_INTERVAL_MS = 30_000;

/* ===== main ===== */

export async function getPresaleSnapshot(args?: {
  presaleAddress?: string;
  walletAddress?: string;
  force?: boolean;
}): Promise<PresaleSnapshot> {
  const presaleAddress = args?.presaleAddress ?? PRESALE_CONTRACT;
  const walletAddress = args?.walletAddress;
  const force = !!args?.force;

  const now = Date.now();
  const bKey = baseKey(presaleAddress);
  const baseEntry: BaseEntry = BASE_CACHE.get(bKey) ?? { ts: 0 };

  // cooldown після rate-limit (і в force теж поважаємо)
  if (baseEntry.cooldownUntil && now < baseEntry.cooldownUntil) {
    const base = baseEntry.data;
    return {
      currentRound: base?.currentRound ?? 0,
      soldTotalNano: base?.soldTotalNano ?? 0n,
      soldInRoundNano: base?.soldInRoundNano ?? 0n,
      totalRaisedNano: base?.totalRaisedNano ?? 0n,
      claimableBuyerNano: 0n,
      claimableReferralNano: 0n,
      claimableNano: 0n,
    };
  }

  // coalesce base
  const minInterval = force ? MIN_FORCE_INTERVAL_MS : MIN_FETCH_INTERVAL_MS;
  let basePromise:
    | Promise<Omit<PresaleSnapshot, "claimableNano" | "claimableBuyerNano" | "claimableReferralNano">>
    | undefined = baseEntry.inFlight;

  if (!basePromise) {
    if (baseEntry.data && now - baseEntry.ts < minInterval) {
      basePromise = Promise.resolve(baseEntry.data);
    } else {
      basePromise = (async () => {
        try {
          let rRaised: TonRunGetResp | null = null;
          let rSold: TonRunGetResp | null = null;
          let rRound: TonRunGetResp | null = null;
          let rRoundSold: TonRunGetResp | null = null;

          const tonApiRetries = force ? 1 : 0;

          try {
            rRaised = await tonApiRunGetMethod(presaleAddress, "totalRaisedNano", [], {
              retries: tonApiRetries,
            });
            rSold = await tonApiRunGetMethod(presaleAddress, "totalSoldNano", [], {
              retries: tonApiRetries,
            });
            rRound = await tonApiRunGetMethod(presaleAddress, "currentRound", [], {
              retries: tonApiRetries,
            });
            rRoundSold = await tonApiRunGetMethod(presaleAddress, "currentRoundSoldNano", [], {
              retries: tonApiRetries,
            });
          } catch {
            rRaised = await toncenterRunGetMethod(presaleAddress, "totalRaisedNano");
            rSold = await toncenterRunGetMethod(presaleAddress, "totalSoldNano");
            rRound = await toncenterRunGetMethod(presaleAddress, "currentRound");
            rRoundSold = await toncenterRunGetMethod(presaleAddress, "currentRoundSoldNano");
          }

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

          const base = {
            currentRound: clampRoundIndex(currentRound),
            soldTotalNano: soldTotalNano < 0n ? 0n : soldTotalNano,
            soldInRoundNano: soldInRoundNano < 0n ? 0n : soldInRoundNano,
            totalRaisedNano: totalRaisedNano < 0n ? 0n : totalRaisedNano,
          };

          BASE_CACHE.set(bKey, { ts: Date.now(), data: base });
          return base;
        } catch (e: any) {
          if (e instanceof RateLimitError) {
            const prev = BASE_CACHE.get(bKey);
            const cooldownUntil = Date.now() + Math.max(30_000, e.retryAfterMs);
            BASE_CACHE.set(bKey, {
              ts: prev?.ts ?? 0,
              data: prev?.data,
              cooldownUntil,
            });
            return (
              prev?.data ?? {
                currentRound: 0,
                soldTotalNano: 0n,
                soldInRoundNano: 0n,
                totalRaisedNano: 0n,
              }
            );
          }

          // fallback: старий спосіб (TonAPI accounts/jettons)
          const totalRaisedNano = await tonApiGetAccountBalanceNano(presaleAddress);
          const remainingNano = await tonApiGetWalletJettonBalanceNano(presaleAddress, JETTON_MASTER);
          const soldTotalNano =
            TOTAL_PRESALE_NANO > remainingNano ? TOTAL_PRESALE_NANO - remainingNano : 0n;
          const { currentRound, soldInRoundNano } = calcRoundFromSold(soldTotalNano);

          const base = {
            currentRound,
            soldTotalNano,
            soldInRoundNano,
            totalRaisedNano,
          };

          BASE_CACHE.set(bKey, { ts: Date.now(), data: base });
          return base;
        } finally {
          const cur = BASE_CACHE.get(bKey);
          if (cur) delete cur.inFlight;
        }
      })();

      BASE_CACHE.set(bKey, { ...baseEntry, inFlight: basePromise });
    }
  }

  const base = await basePromise;

  // claimable split (separate cache; expensive getters)
  let claimableBuyerNano = 0n;
  let claimableReferralNano = 0n;
  let claimableNano = 0n;

  if (walletAddress) {
    const cKey = claimKey(presaleAddress, walletAddress);
    const claimEntry: ClaimEntry = CLAIM_CACHE.get(cKey) ?? { ts: 0 };

    if (claimEntry.cooldownUntil && now < claimEntry.cooldownUntil) {
      claimableBuyerNano = claimEntry.buyer ?? 0n;
      claimableReferralNano = claimEntry.referral ?? 0n;
      claimableNano = claimEntry.total ?? (claimableBuyerNano + claimableReferralNano);
    } else if (claimEntry.inFlight) {
      const r = await claimEntry.inFlight;
      claimableBuyerNano = r.buyer;
      claimableReferralNano = r.referral;
      claimableNano = r.total;
    } else {
      const needClaimable = force || now - claimEntry.ts >= CLAIMABLE_MIN_INTERVAL_MS;

      if (!needClaimable && (claimEntry.buyer != null || claimEntry.referral != null || claimEntry.total != null)) {
        claimableBuyerNano = claimEntry.buyer ?? 0n;
        claimableReferralNano = claimEntry.referral ?? 0n;
        claimableNano = claimEntry.total ?? (claimableBuyerNano + claimableReferralNano);
      } else {
        const doClaim = (async () => {
          try {
            const tonApiRetries = force ? 1 : 0;
            return await getClaimableSplit(presaleAddress, walletAddress, { retries: tonApiRetries, force });
          } catch (e: any) {
            if (e instanceof RateLimitError) {
              const prev = CLAIM_CACHE.get(cKey);
              const cooldownUntil = Date.now() + Math.max(30_000, e.retryAfterMs);
              CLAIM_CACHE.set(cKey, {
                ts: prev?.ts ?? 0,
                buyer: prev?.buyer,
                referral: prev?.referral,
                total: prev?.total,
                cooldownUntil,
              });
              const buyer = prev?.buyer ?? 0n;
              const referral = prev?.referral ?? 0n;
              const total = prev?.total ?? (buyer + referral);
              return { buyer, referral, total };
            }

            const buyer = claimEntry.buyer ?? 0n;
            const referral = claimEntry.referral ?? 0n;
            const total = claimEntry.total ?? (buyer + referral);
            return { buyer, referral, total };
          } finally {
            const cur = CLAIM_CACHE.get(cKey);
            if (cur) delete cur.inFlight;
          }
        })();

        CLAIM_CACHE.set(cKey, { ...claimEntry, inFlight: doClaim });

        const r = await doClaim;
        claimableBuyerNano = r.buyer;
        claimableReferralNano = r.referral;
        claimableNano = r.total;

        // store result once
        CLAIM_CACHE.set(cKey, {
          ts: Date.now(),
          buyer: claimableBuyerNano,
          referral: claimableReferralNano,
          total: claimableNano,
        });
      }
    }
  }

  // sanitize
  if (claimableBuyerNano < 0n) claimableBuyerNano = 0n;
  if (claimableReferralNano < 0n) claimableReferralNano = 0n;
  if (claimableNano < 0n) claimableNano = 0n;

  return {
    currentRound: base.currentRound,
    soldTotalNano: base.soldTotalNano,
    soldInRoundNano: base.soldInRoundNano,
    totalRaisedNano: base.totalRaisedNano,

    claimableBuyerNano,
    claimableReferralNano,
    claimableNano, // total
  };
}
