// src/lib/presale.ts
import { Address, beginCell } from "@ton/core";
import {
  TONAPI_BASE,
  JETTON_MASTER,
  PRESALE_CONTRACT,
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

export const ROUND_USD_PRICES = [
  0.000153,
  0.000173,
  0.000195,
  0.000219,
  0.000246,
  0.000277,
  0.000312,
  0.000351,
  0.000395,
  0.000444,
  0.0005,
  0.000562,
  0.000632,
  0.000711,
  0.0008,
  0.0009,
  0.001012,
  0.001138,
  0.00128,
  0.00144,
];

export const TOTAL_ROUNDS = ROUNDS_TOKENS.length;

export type PresaleSnapshot = {
  nowMs: number;
  presaleAddress: string;

  currentRound: number; // 0-based
  roundTokens: number; // tokens in this round
  roundUsdPrice: number;

  soldInRound: number; // tokens sold in current round
  soldTotal: number; // tokens sold total (all rounds)

  totalRaisedTon: number; // in TON
  soldInRoundNano: bigint;
  soldTotalNano: bigint;
  totalRaisedNano: bigint;

  tonUsdPrice?: number | null;

  walletAddress?: string;
  walletJettonBalance?: bigint; // raw nanojettons
  walletJettonBalancePretty?: number;

  claimableJettons?: bigint; // raw nanojettons
  claimedJettons?: bigint; // raw nanojettons

  isFallback?: boolean;
};

type BaseEntry = {
  ts: number;
  data: {
    currentRound: number;
    soldTotalNano: bigint;
    soldInRoundNano: bigint;
    totalRaisedNano: bigint;
  };
};

const BASE_CACHE = new Map<string, BaseEntry>();
const BASE_MIN_INTERVAL_MS = 8_000;

const CLAIMABLE_CACHE = new Map<
  string,
  { ts: number; data: { claimableJettons: bigint; claimedJettons: bigint } }
>();
const CLAIMABLE_MIN_INTERVAL_MS = 30_000;

function isSaneBaseUpdate(
  prev: BaseEntry["data"] | undefined,
  next: BaseEntry["data"]
): boolean {
  if (!prev) return true;

  const prevHadProgress = prev.soldTotalNano > 0n || prev.totalRaisedNano > 0n;
  const nextIsZeroed = next.soldTotalNano === 0n && next.totalRaisedNano === 0n;
  if (prevHadProgress && nextIsZeroed) return false;

  if (next.soldTotalNano < prev.soldTotalNano) return false;
  if (next.totalRaisedNano < prev.totalRaisedNano) return false;

  if (next.currentRound + 1 < prev.currentRound) return false;

  return true;
}

/* ===== main ===== */

export async function getPresaleSnapshot(args?: {
  presaleAddress?: string;
  walletAddress?: string;
  force?: boolean;
}): Promise<PresaleSnapshot> {
  const presaleAddress = args?.presaleAddress ?? PRESALE_CONTRACT;
  const walletAddress = args?.walletAddress;

  const nowMs = Date.now();

  // base snapshot (progress)
  const base = await getBaseSnapshot({
    presaleAddress,
    force: args?.force,
  });

  const currentRound = clampRound(base.currentRound);

  const soldTotalNano = base.soldTotalNano;
  const soldInRoundNano = base.soldInRoundNano;
  const totalRaisedNano = base.totalRaisedNano;

  const soldTotal = nanoToTokenFloat(soldTotalNano);
  const soldInRound = nanoToTokenFloat(soldInRoundNano);
  const totalRaisedTon = nanoTonToFloat(totalRaisedNano);

  const roundTokens = ROUNDS_TOKENS[currentRound] ?? 0;
  const roundUsdPrice = ROUND_USD_PRICES[currentRound] ?? ROUND_USD_PRICES[0];

  // optional: wallet jetton balance
  let walletJettonBalance: bigint | undefined;
  let walletJettonBalancePretty: number | undefined;

  if (walletAddress) {
    walletJettonBalance = await getJettonWalletBalance({
      walletAddress,
      jettonMaster: JETTON_MASTER,
    });
    walletJettonBalancePretty = nanoToTokenFloat(walletJettonBalance);
  }

  // optional: claimable
  let claimableJettons: bigint | undefined;
  let claimedJettons: bigint | undefined;

  if (walletAddress) {
    const cc = await getClaimables({
      presaleAddress,
      walletAddress,
      force: args?.force,
    });
    claimableJettons = cc.claimableJettons;
    claimedJettons = cc.claimedJettons;
  }

  // optional: TON/USD (best effort)
  let tonUsdPrice: number | null | undefined;
  try {
    tonUsdPrice = await getTonUsdPrice();
  } catch {
    tonUsdPrice = null;
  }

  return {
    nowMs,
    presaleAddress,

    currentRound,
    roundTokens,
    roundUsdPrice,

    soldInRound,
    soldTotal,

    totalRaisedTon,
    soldInRoundNano,
    soldTotalNano,
    totalRaisedNano,

    tonUsdPrice,

    walletAddress,
    walletJettonBalance,
    walletJettonBalancePretty,

    claimableJettons,
    claimedJettons,

    isFallback: (base as any)?.isFallback ?? false,
  };
}

/* ===== base snapshot ===== */

class RateLimitError extends Error {
  name = "RateLimitError";
}

let toncenterQueue = Promise.resolve();

async function toncenterSchedule() {
  let released = false;

  const releaseRaw = () => {
    released = true;
  };

  const prev = toncenterQueue;

  toncenterQueue = toncenterQueue.then(async () => {
    await prev;
    if (!released) {
      // 4 rps target (250ms spacing)
      await sleep(260);
    }
  });

  await prev;

  return () => {
    released = true;
    releaseRaw();
  };
}

async function toncenterRpc<T>(method: string, params: any): Promise<T> {
  const release = await toncenterSchedule();

  const ac = new AbortController();
  const timeoutMs = 12_000;
  const t = setTimeout(() => ac.abort(), timeoutMs);

  try {
    const body = { jsonrpc: "2.0", id: 1, method, params };

    let r: Response;
    try {
      r = await fetch(TONCENTER_JSONRPC, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
        signal: ac.signal,
      });
    } catch (e: any) {
      const msg = String(e?.name ?? e?.message ?? "");
      if (msg.includes("AbortError") || msg.includes("aborted")) {
        throw new Error("TONCENTER_TIMEOUT");
      }
      throw new Error("TONCENTER_FETCH_FAILED");
    }

    if (r.status === 429) throw new RateLimitError("TONCENTER_429");
    if (!r.ok) throw new Error(`TONCENTER_HTTP_${r.status}`);

    const j = (await r.json()) as any;
    if (j?.error) throw new Error(`TONCENTER_RPC_${j.error.code}`);
    return j.result as T;
  } finally {
    clearTimeout(t);
    release();
  }
}

async function getBaseSnapshot(args: {
  presaleAddress: string;
  force?: boolean;
}): Promise<BaseEntry["data"] & { isFallback?: boolean }> {
  const bKey = `base:${args.presaleAddress}`;
  const prev = BASE_CACHE.get(bKey);

  if (!args.force && prev && Date.now() - prev.ts < BASE_MIN_INTERVAL_MS) {
    return prev.data;
  }

  // ===== Try TONCENTER first =====
  try {
    const [currentRound, soldTotalNano, soldInRoundNano, totalRaisedNano] =
      await toncenterRpc<[number, string, string, string]>(
        "runGetMethod",
        [
          args.presaleAddress,
          "getPresaleState",
          [],
        ]
      ).then((res: any) => {
        const stack = res?.stack ?? res?.result?.stack ?? [];
        // Expect: (currentRound, soldTotalNano, soldInRoundNano, totalRaisedNano)
        const getNum = (i: number) => Number(stack?.[i]?.[1] ?? 0);
        const getBig = (i: number) => BigInt(stack?.[i]?.[1] ?? 0);
        return [
          getNum(0),
          getBig(1).toString(),
          getBig(2).toString(),
          getBig(3).toString(),
        ] as [number, string, string, string];
      });

    const base = {
      currentRound: clampRound(currentRound),
      soldTotalNano: BigInt(soldTotalNano),
      soldInRoundNano: BigInt(soldInRoundNano),
      totalRaisedNano: BigInt(totalRaisedNano),
    };

    // sanitize negatives (paranoia)
    const sane = {
      currentRound: base.currentRound < 0 ? 0 : base.currentRound,
      soldTotalNano: base.soldTotalNano < 0n ? 0n : base.soldTotalNano,
      soldInRoundNano: base.soldInRoundNano < 0n ? 0n : base.soldInRoundNano,
      totalRaisedNano: base.totalRaisedNano < 0n ? 0n : base.totalRaisedNano,
    };

    if (!isSaneBaseUpdate(BASE_CACHE.get(bKey)?.data, sane)) {
      const prev = BASE_CACHE.get(bKey);
      if (prev?.data) return prev.data;
    }

    BASE_CACHE.set(bKey, { ts: Date.now(), data: sane });
    return sane;
  } catch (e: any) {
    if (e instanceof RateLimitError) {
      const prev = BASE_CACHE.get(bKey);
      const cooldownUntil = Date.now() + BASE_MIN_INTERVAL_MS;
      if (prev?.data) {
        BASE_CACHE.set(bKey, { ts: cooldownUntil, data: prev.data });
        return prev.data;
      }
    }
    // fall through to TONAPI
  }

  // ===== TONAPI fallback =====
  try {
    const res = await tonapiRunMethod(args.presaleAddress, "getPresaleState");

    const stack = res?.stack ?? [];
    const getNum = (i: number) => Number(stack?.[i]?.[1] ?? 0);
    const getBig = (i: number) => BigInt(stack?.[i]?.[1] ?? 0);

    const currentRound = getNum(0);
    const soldTotalNano = getBig(1);
    const soldInRoundNano = getBig(2);
    const totalRaisedNano = getBig(3);

    const base = {
      currentRound: clampRound(currentRound),
      soldTotalNano,
      soldInRoundNano,
      totalRaisedNano,
      isFallback: true as const,
    };

    if (!isSaneBaseUpdate(BASE_CACHE.get(bKey)?.data, base)) {
      const prev = BASE_CACHE.get(bKey);
      if (prev?.data) return prev.data;
    }

    BASE_CACHE.set(bKey, { ts: Date.now(), data: base });
    return base;
  } catch {
    // If both fail, return cached if exists
    const prev = BASE_CACHE.get(bKey);
    if (prev?.data) return prev.data;

    // absolute last resort
    return {
      currentRound: 0,
      soldTotalNano: 0n,
      soldInRoundNano: 0n,
      totalRaisedNano: 0n,
      isFallback: true as const,
    };
  }
}

/* ===== claimables ===== */

async function getClaimables(args: {
  presaleAddress: string;
  walletAddress: string;
  force?: boolean;
}): Promise<{ claimableJettons: bigint; claimedJettons: bigint }> {
  const key = `claim:${args.presaleAddress}:${args.walletAddress}`;
  const prev = CLAIMABLE_CACHE.get(key);

  if (!args.force && prev && Date.now() - prev.ts < CLAIMABLE_MIN_INTERVAL_MS) {
    return prev.data;
  }

  // prefer tonapi (lighter)
  try {
    const res = await tonapiRunMethod(args.presaleAddress, "getClaimables", [
      { type: "slice", cell: addrToSliceBoc(args.walletAddress) },
    ]);

    const stack = res?.stack ?? [];
    const claimable = BigInt(stack?.[0]?.[1] ?? 0);
    const claimed = BigInt(stack?.[1]?.[1] ?? 0);

    const data = {
      claimableJettons: claimable < 0n ? 0n : claimable,
      claimedJettons: claimed < 0n ? 0n : claimed,
    };

    CLAIMABLE_CACHE.set(key, { ts: Date.now(), data });
    return data;
  } catch {
    // fallback toncenter
  }

  try {
    const res: any = await toncenterRpc("runGetMethod", [
      args.presaleAddress,
      "getClaimables",
      [["tvm.Slice", addrToSliceBoc(args.walletAddress)]],
    ]);

    const stack = res?.stack ?? res?.result?.stack ?? [];
    const claimable = BigInt(stack?.[0]?.[1] ?? 0);
    const claimed = BigInt(stack?.[1]?.[1] ?? 0);

    const data = {
      claimableJettons: claimable < 0n ? 0n : claimable,
      claimedJettons: claimed < 0n ? 0n : claimed,
    };

    CLAIMABLE_CACHE.set(key, { ts: Date.now(), data });
    return data;
  } catch {
    const prev = CLAIMABLE_CACHE.get(key);
    if (prev?.data) return prev.data;

    return { claimableJettons: 0n, claimedJettons: 0n };
  }
}

/* ===== jetton wallet balance ===== */

async function getJettonWalletBalance(args: {
  walletAddress: string;
  jettonMaster: string;
}): Promise<bigint> {
  // tonapi path: master->walletAddress->balance
  const owner = args.walletAddress;

  const jettonWallet = await tonapiResolveJettonWallet({
    master: args.jettonMaster,
    owner,
  });

  if (!jettonWallet) return 0n;

  try {
    const info = await tonapiGetJettonWallet(jettonWallet);
    const bal = BigInt(info?.balance ?? 0);
    return bal < 0n ? 0n : bal;
  } catch {
    return 0n;
  }
}

/* ===== tonapi helpers ===== */

async function tonapiRunMethod(
  address: string,
  method: string,
  stack?: any[]
): Promise<any> {
  const url = `${TONAPI_BASE}/blockchain/accounts/${address}/methods/${method}`;

  const r = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ stack: stack ?? [] }),
  });

  if (r.status === 429) throw new RateLimitError("TONAPI_429");
  if (!r.ok) throw new Error(`TONAPI_HTTP_${r.status}`);

  return await r.json();
}

async function tonapiResolveJettonWallet(args: {
  master: string;
  owner: string;
}): Promise<string | null> {
  const url = `${TONAPI_BASE}/jettons/${args.master}/wallets/${args.owner}`;

  const r = await fetch(url);
  if (!r.ok) return null;

  const j = await r.json();
  return j?.address ?? null;
}

async function tonapiGetJettonWallet(address: string): Promise<any> {
  const url = `${TONAPI_BASE}/jetton/wallets/${address}`;

  const r = await fetch(url);
  if (!r.ok) throw new Error(`TONAPI_HTTP_${r.status}`);

  return await r.json();
}

/* ===== price helpers (best effort) ===== */

async function getTonUsdPrice(): Promise<number | null> {
  // Keep it simple: try tonapi rates endpoint if available
  try {
    const r = await fetch(`${TONAPI_BASE}/rates?tokens=ton&currencies=usd`);
    if (!r.ok) return null;
    const j = await r.json();
    const v = Number(j?.rates?.TON?.prices?.USD ?? j?.rates?.ton?.prices?.usd);
    if (!Number.isFinite(v) || v <= 0) return null;
    return v;
  } catch {
    return null;
  }
}

/* ===== utils ===== */

function clampRound(round: number): number {
  if (!Number.isFinite(round) || round < 0) return 0;
  if (round >= TOTAL_ROUNDS) return TOTAL_ROUNDS - 1;
  return round;
}

function nanoToTokenFloat(nano: bigint): number {
  // 9 decimals
  const s = nano < 0n ? (-nano).toString() : nano.toString();
  const neg = nano < 0n;

  const pad = s.padStart(10, "0");
  const int = pad.slice(0, -9);
  const frac = pad.slice(-9).replace(/0+$/, "");

  const out = Number(int + (frac ? "." + frac : ""));
  return neg ? -out : out;
}

function nanoTonToFloat(nano: bigint): number {
  // nanoTON -> TON (9 decimals)
  return nanoToTokenFloat(nano);
}

function addrToSliceBoc(addr: string): string {
  const a = Address.parse(addr);
  const c = beginCell().storeAddress(a).endCell();
  return c.toBoc().toString("base64");
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
