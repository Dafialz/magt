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

  // ✅ split claimables
  claimableBuyerNano: bigint;
  claimableReferralNano: bigint;

  // ✅ backwards compat (total = buyer + referral)
  claimableNano: bigint;
};

/* ===== price (✅ EXACTLY as in presale.tact: roundPriceNano) =====
   roundPriceNano(i) returns nanoTON per 1 token
   so TON per token = nanoTON / 1e9
*/

export const ROUND_PRICE_NANO = [
  11489000, 13443000, 15729000, 18403000, 21532000,
  25191000, 29471000, 34483000, 40345000, 47206000,
  55231000, 64618000, 75603000, 88455000, 103495000,
  121086000, 141671000, 165757000, 193935000, 226397000,
];

export function getRoundPriceNano(roundIndex: number): bigint {
  const i = clampRoundIndex(roundIndex);
  const v = ROUND_PRICE_NANO[i] ?? 0;
  return BigInt(v < 0 ? 0 : v);
}

// ✅ THIS is what calculator should use (TON per 1 MAGT)
export function getRoundPriceTon(roundIndex: number): number {
  const nano = Number(getRoundPriceNano(roundIndex));
  if (!Number.isFinite(nano) || nano <= 0) return 0;
  return nano / 1e9;
}

/* ===== legacy (kept to avoid breaking imports; NOT used by calculator) ===== */
export function priceUsd(roundIndex: number): number {
  const base = 0.011;
  const step = 0.001;
  return base + roundIndex * step;
}
export const TON_USD_REFERENCE = 5;

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

async function fetchJson<T>(
  url: string,
  opts?: { retries?: number; timeoutMs?: number }
): Promise<T> {
  const retries = Math.max(0, Math.floor(opts?.retries ?? 0));
  const timeoutMs = Math.max(2000, Math.floor(opts?.timeoutMs ?? 12_000));

  for (let attempt = 0; attempt <= retries; attempt++) {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), timeoutMs);

    let r: Response;
    try {
      // IMPORTANT: no custom headers here (avoids TonAPI CORS preflight issues)
      r = await fetch(url, { cache: "no-store", signal: ac.signal });
    } catch (e: any) {
      clearTimeout(t);
      const msg = String(e?.name ?? e?.message ?? "");
      if (msg.includes("AbortError") || msg.includes("aborted")) {
        if (attempt < retries) continue;
        throw new Error("FETCH_TIMEOUT");
      }
      if (attempt < retries) continue;
      throw new Error("FETCH_FAILED");
    } finally {
      clearTimeout(t);
    }

    if (r.status === 429) {
      const retryAfterMs = retryAfterToMs(r.headers.get("retry-after"));
      if (attempt < retries) {
        await sleep(Math.min(1500, retryAfterMs));
        continue;
      }
      throw new RateLimitError(retryAfterMs, "PROVIDER_RATE_LIMIT");
    }

    if (!r.ok) {
      if (attempt < retries) continue;
      throw new Error(`HTTP ${r.status}`);
    }

    try {
      return (await r.json()) as T;
    } catch {
      if (attempt < retries) continue;
      throw new Error("JSON_PARSE_FAILED");
    }
  }

  throw new Error("UNREACHABLE");
}

/* ===========================
   ✅ TonAPI (fallback)
   =========================== */

type TonRunGetResp = {
  exit_code?: number;
  exitCode?: number;
  stack?: any[];
};

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

  return await fetchJson<TonRunGetResp>(url, {
    retries: Math.max(0, opts?.retries ?? 0),
    timeoutMs: 12_000,
  });
}

/* ===========================
   ✅ Toncenter JSON-RPC (primary)
   =========================== */

let TONCENTER_QUEUE: Promise<void> = Promise.resolve();
let TONCENTER_LAST_AT = 0;

function toncenterMinIntervalMs() {
  return TONCENTER_API_KEY ? 200 : 1200;
}

async function toncenterSchedule(): Promise<() => void> {
  const prev = TONCENTER_QUEUE;

  let releaseRaw!: () => void;
  TONCENTER_QUEUE = new Promise<void>((r) => (releaseRaw = r));

  await prev;

  const wait = TONCENTER_LAST_AT + toncenterMinIntervalMs() - Date.now();
  if (wait > 0) await sleep(wait);

  let released = false;
  return () => {
    if (released) return;
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
      // ✅ Browser-safe JSON-RPC call.
      // If you set VITE_TONCENTER_API_KEY on Netlify, config.ts will append
      // `?api_key=...` to TONCENTER_JSONRPC.
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
    } finally {
      TONCENTER_LAST_AT = Date.now();
    }

    if (r.status === 429) throw new RateLimitError(60_000, "TONCENTER_RATE_LIMIT");
    if (!r.ok) throw new Error(`TONCENTER_HTTP_${r.status}`);

    const j = (await r.json()) as any;
    if (j?.error) throw new Error("TONCENTER_RPC_ERROR");

    const res = j?.result ?? j?.result?.result;
    if (!res) throw new Error("TONCENTER_NO_RESULT");

    return res as T;
  } finally {
    clearTimeout(t);
    release();
  }
}

async function toncenterRunGetMethod(
  accountId: string,
  methodName: string,
  stack: any[] = []
): Promise<TonRunGetResp> {
  const res = await toncenterRpc<any>("runGetMethod", {
    address: accountId,
    method: methodName,
    stack,
  });

  return {
    exit_code: res.exit_code ?? res.exitCode,
    stack: res.stack,
  };
}

/* ===========================
   ✅ claimable argument helpers
   =========================== */

function addressArgToBocB64(addr: string): string {
  const a = Address.parse(addr);
  const cell = beginCell().storeAddress(a).endCell();
  return bytesToBase64(cell.toBoc({ idx: false }));
}

async function runGetMaybeBigIntTonApi(
  presaleAddr: string,
  method: string,
  walletAddr: string,
  opts?: { retries?: number }
): Promise<bigint | null> {
  const bocArg = addressArgToBocB64(walletAddr);
  const r = await tonApiRunGetMethod(presaleAddr, method, [bocArg], opts);
  const exit = r.exit_code ?? r.exitCode ?? 1;
  if (exit === 0 && r.stack?.length) return stackItemToBigInt(r.stack[0]);
  return null;
}

async function runGetMaybeBigIntToncenter(
  presaleAddr: string,
  method: string,
  walletAddr: string
): Promise<bigint | null> {
  const bocArg = addressArgToBocB64(walletAddr);

  const candidates: any[][] = [
    [["tvm.Slice", bocArg]],
    [["slice", bocArg]],
    [{ type: "tvm.Slice", value: bocArg }],
    [{ type: "slice", value: bocArg }],
  ];

  for (const st of candidates) {
    try {
      const r = await toncenterRunGetMethod(presaleAddr, method, st);
      const exit = r.exit_code ?? r.exitCode ?? 1;
      if (exit === 0 && r.stack?.length) return stackItemToBigInt(r.stack[0]);
      continue;
    } catch (e: any) {
      const msg = String(e?.message ?? "");
      if (msg.includes("TONCENTER_HTTP_422")) continue;
      continue;
    }
  }

  return null;
}

/* ===== very-last fallback (TonAPI REST; may be blocked) ===== */

async function tonApiGetAccountBalanceNano(address: string): Promise<bigint> {
  const url = `${TONAPI_BASE}/v2/accounts/${address}?t=${Date.now()}`;
  const j = await fetchJson<any>(url, { retries: 0, timeoutMs: 12_000 });
  return BigInt(j?.balance ?? 0);
}

async function tonApiGetWalletJettonBalanceNano(
  walletAddress: string,
  jettonMaster: string
): Promise<bigint> {
  const url = `${TONAPI_BASE}/v2/accounts/${walletAddress}/jettons?t=${Date.now()}`;
  const j = await fetchJson<any>(url, { retries: 0, timeoutMs: 12_000 });

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

async function fetchBaseViaTonApiFallback(presaleAddress: string): Promise<BaseData> {
  const totalRaisedNano = await tonApiGetAccountBalanceNano(presaleAddress);
  const remainingNano = await tonApiGetWalletJettonBalanceNano(
    presaleAddress,
    JETTON_MASTER
  );

  const soldTotalNano =
    TOTAL_PRESALE_NANO > remainingNano ? TOTAL_PRESALE_NANO - remainingNano : 0n;
  const { currentRound, soldInRoundNano } = calcRoundFromSold(soldTotalNano);

  return {
    currentRound,
    soldTotalNano,
    soldInRoundNano,
    totalRaisedNano,
  };
}

/* ===== anti-429 cache / coalescing ===== */

type BaseEntry = {
  ts: number;
  data?: Omit<
    PresaleSnapshot,
    "claimableNano" | "claimableBuyerNano" | "claimableReferralNano"
  >;
  inFlight?: Promise<
    Omit<
      PresaleSnapshot,
      "claimableNano" | "claimableBuyerNano" | "claimableReferralNano"
    >
  >;
  cooldownUntil?: number;
};

type BaseData = NonNullable<BaseEntry["data"]>;

type ClaimEntry = {
  ts: number;
  buyer?: bigint;
  referral?: bigint;
  inFlight?: Promise<{ buyer: bigint; referral: bigint }>;
  cooldownUntil?: number;
};

const BASE_CACHE = new Map<string, BaseEntry>();
const CLAIM_CACHE = new Map<string, ClaimEntry>();

function baseKey(presale: string) {
  return presale;
}

function claimKey(presale: string, wallet: string) {
  return `${presale}::${wallet}`;
}

const MIN_FETCH_INTERVAL_MS = 20_000;
const MIN_FORCE_INTERVAL_MS = 8_000;
const CLAIMABLE_MIN_INTERVAL_MS = 30_000;

/* ===== sanity filter (prevents UI flicker on bad snapshots) ===== */
function isSaneBaseUpdate(
  prev: BaseData | undefined,
  next: BaseData
): boolean {
  if (!prev) return true;

  // Never accept obvious "zeroing" if we already have non-zero history
  const prevHadProgress = prev.soldTotalNano > 0n || prev.totalRaisedNano > 0n;
  const nextIsZeroed = next.soldTotalNano === 0n && next.totalRaisedNano === 0n;
  if (prevHadProgress && nextIsZeroed) return false;

  // Sold/raised should not go backwards
  if (next.soldTotalNano < prev.soldTotalNano) return false;
  if (next.totalRaisedNano < prev.totalRaisedNano) return false;

  // Round should not jump backwards by more than 1
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
  const force = !!args?.force;

  const now = Date.now();
  const bKey = baseKey(presaleAddress);
  const baseEntry: BaseEntry = BASE_CACHE.get(bKey) ?? { ts: 0 };

  const minInterval = force ? MIN_FORCE_INTERVAL_MS : MIN_FETCH_INTERVAL_MS;

  let basePromise:
    | Promise<
        Omit<
          PresaleSnapshot,
          "claimableNano" | "claimableBuyerNano" | "claimableReferralNano"
        >
      >
    | undefined = baseEntry.inFlight;

  if (!basePromise) {
    if (baseEntry.data && now - baseEntry.ts < minInterval) {
      basePromise = Promise.resolve(baseEntry.data);
    } else if (baseEntry.cooldownUntil && now < baseEntry.cooldownUntil) {
      if (baseEntry.data) {
        basePromise = Promise.resolve(baseEntry.data);
      } else {
        // We are in cooldown (likely due to 429). If we have no cached snapshot yet,
        // try the TonAPI fallback once instead of hard-failing the UI.
        basePromise = (async () => {
          const base = await fetchBaseViaTonApiFallback(presaleAddress);

          if (!isSaneBaseUpdate(BASE_CACHE.get(bKey)?.data, base)) {
            const prev = BASE_CACHE.get(bKey);
            if (prev?.data) return prev.data;
          }

          BASE_CACHE.set(bKey, { ts: Date.now(), data: base });
          return base;
        })();

        BASE_CACHE.set(bKey, { ...baseEntry, inFlight: basePromise });
      }
    } else {
      basePromise = (async () => {
        try {
          // ✅ PRIMARY: Toncenter getters (browser-safe)
          const [rRaised, rSold, rRound, rRoundSold] = await Promise.all([
            toncenterRunGetMethod(presaleAddress, "totalRaisedNano"),
            toncenterRunGetMethod(presaleAddress, "totalSoldNano"),
            toncenterRunGetMethod(presaleAddress, "currentRound"),
            toncenterRunGetMethod(presaleAddress, "currentRoundSoldNano"),
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

          if (!ok) throw new Error("GETTERS_FAILED_TONCENTER");

          const totalRaisedNano = stackItemToBigInt(rRaised.stack![0]);
          const soldTotalNano = stackItemToBigInt(rSold.stack![0]);
          const currentRound = Number(stackItemToBigInt(rRound.stack![0]));
          const soldInRoundNano = stackItemToBigInt(rRoundSold.stack![0]);

          const base: BaseData = {
            currentRound: clampRoundIndex(currentRound),
            soldTotalNano: soldTotalNano < 0n ? 0n : soldTotalNano,
            soldInRoundNano: soldInRoundNano < 0n ? 0n : soldInRoundNano,
            totalRaisedNano: totalRaisedNano < 0n ? 0n : totalRaisedNano,
          };

          if (!isSaneBaseUpdate(BASE_CACHE.get(bKey)?.data, base)) {
            const prev = BASE_CACHE.get(bKey);
            if (prev?.data) return prev.data;
          }

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
            if (prev?.data) return prev.data;

            // No cache yet -> immediately try TonAPI fallback
            const base = await fetchBaseViaTonApiFallback(presaleAddress);

            if (!isSaneBaseUpdate(BASE_CACHE.get(bKey)?.data, base)) {
              const p = BASE_CACHE.get(bKey);
              if (p?.data) return p.data;
            }

            BASE_CACHE.set(bKey, { ts: Date.now(), data: base, cooldownUntil });
            return base;
          }

          // last fallback: TonAPI accounts/jettons (may be blocked; may be less accurate)
          try {
            const base = await fetchBaseViaTonApiFallback(presaleAddress);

            // ✅ prevent flicker on bad fallback snapshots too
            if (!isSaneBaseUpdate(BASE_CACHE.get(bKey)?.data, base)) {
              const prev = BASE_CACHE.get(bKey);
              if (prev?.data) return prev.data;
            }

            BASE_CACHE.set(bKey, { ts: Date.now(), data: base });
            return base;
          } catch {
            const prev = BASE_CACHE.get(bKey);
            if (prev?.data) return prev.data;
            throw new Error("ALL_PROVIDERS_FAILED");
          }
        } finally {
          const cur = BASE_CACHE.get(bKey);
          if (cur) delete cur.inFlight;
        }
      })();

      BASE_CACHE.set(bKey, { ...baseEntry, inFlight: basePromise });
    }
  }

  const base = await basePromise;

  // ✅ claimables (buyer/referral) — per-wallet cache
  let claimBuyer = 0n;
  let claimReferral = 0n;

  if (walletAddress) {
    const cKey = claimKey(presaleAddress, walletAddress);
    const claimEntry: ClaimEntry = CLAIM_CACHE.get(cKey) ?? { ts: 0 };

    if (claimEntry.cooldownUntil && now < claimEntry.cooldownUntil) {
      claimBuyer = claimEntry.buyer ?? 0n;
      claimReferral = claimEntry.referral ?? 0n;
    } else if (claimEntry.inFlight) {
      const r = await claimEntry.inFlight;
      claimBuyer = r.buyer;
      claimReferral = r.referral;
    } else {
      const need = force || now - claimEntry.ts >= CLAIMABLE_MIN_INTERVAL_MS;

      if (!need && claimEntry.buyer != null && claimEntry.referral != null) {
        claimBuyer = claimEntry.buyer;
        claimReferral = claimEntry.referral;
      } else {
        const doClaim = (async () => {
          try {
            const tonApiRetries = force ? 1 : 0;

            const BUYER_METHODS = ["claimableBuyerNano", "claimableBuyer"];
            const REF_METHODS = ["claimableReferralNano", "claimableReferral"];
            const TOTAL_METHODS = ["claimableNano", "claimable"];

            const firstToncenter = async (methods: string[]): Promise<bigint | null> => {
              for (const m of methods) {
                const v = await runGetMaybeBigIntToncenter(presaleAddress, m, walletAddress);
                if (v != null) return v;
              }
              return null;
            };

            const firstTonApi = async (methods: string[]): Promise<bigint | null> => {
              for (const m of methods) {
                try {
                  const v = await runGetMaybeBigIntTonApi(
                    presaleAddress,
                    m,
                    walletAddress,
                    { retries: tonApiRetries }
                  );
                  if (v != null) return v;
                } catch {
                  // ignore and continue
                }
              }
              return null;
            };

            // ✅ PRIMARY: Toncenter
            const [b1, r1] = await Promise.all([
              firstToncenter(BUYER_METHODS),
              firstToncenter(REF_METHODS),
            ]);

            if (b1 != null || r1 != null) {
              return { buyer: b1 ?? 0n, referral: r1 ?? 0n };
            }

            // fallback: old single getter (total)
            const total1 = await firstToncenter(TOTAL_METHODS);
            if (total1 != null) return { buyer: total1, referral: 0n };

            // ✅ LAST fallback: TonAPI (may be blocked by CORS)
            const [b2, r2] = await Promise.all([
              firstTonApi(BUYER_METHODS),
              firstTonApi(REF_METHODS),
            ]);

            if (b2 != null || r2 != null) {
              return { buyer: b2 ?? 0n, referral: r2 ?? 0n };
            }

            const total2 = await firstTonApi(TOTAL_METHODS);
            if (total2 != null) return { buyer: total2, referral: 0n };

            return { buyer: 0n, referral: 0n };
          } catch (e: any) {
            if (e instanceof RateLimitError) {
              const prev = CLAIM_CACHE.get(cKey);
              const cooldownUntil = Date.now() + Math.max(30_000, e.retryAfterMs);
              CLAIM_CACHE.set(cKey, {
                ts: prev?.ts ?? 0,
                buyer: prev?.buyer,
                referral: prev?.referral,
                cooldownUntil,
              });
              return { buyer: prev?.buyer ?? 0n, referral: prev?.referral ?? 0n };
            }
            return { buyer: claimEntry.buyer ?? 0n, referral: claimEntry.referral ?? 0n };
          } finally {
            const cur = CLAIM_CACHE.get(cKey);
            if (cur) delete cur.inFlight;
          }
        })();

        CLAIM_CACHE.set(cKey, { ...claimEntry, inFlight: doClaim });

        const res = await doClaim;
        claimBuyer = res.buyer;
        claimReferral = res.referral;

        CLAIM_CACHE.set(cKey, { ts: Date.now(), buyer: claimBuyer, referral: claimReferral });
      }
    }
  }

  const safeBuyer = claimBuyer < 0n ? 0n : claimBuyer;
  const safeRef = claimReferral < 0n ? 0n : claimReferral;

  return {
    currentRound: base.currentRound,
    soldTotalNano: base.soldTotalNano,
    soldInRoundNano: base.soldInRoundNano,
    totalRaisedNano: base.totalRaisedNano,

    claimableBuyerNano: safeBuyer,
    claimableReferralNano: safeRef,
    claimableNano: safeBuyer + safeRef,
  };
}
