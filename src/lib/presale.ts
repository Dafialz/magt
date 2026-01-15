// src/lib/presale.ts

export type PresaleSnapshot = {
  currentRound: number;
  soldTotalNano: bigint;     // totalSoldNano() from Presale
  soldInRoundNano: bigint;   // currentRoundSoldNano() from Presale
  totalRaisedNano: bigint;   // totalRaisedNano() from Presale
  claimableNano: bigint;     // we will use this as "Your MAGT" jetton balance (wallet)
};

/**
 * Tokens per round (MAGT). Used for UI progress bars.
 * 20 rounds.
 */
export const ROUNDS_TOKENS = [
  65_225_022, 57_039_669, 50_370_908, 44_326_399, 39_007_231,
  34_326_365, 30_207_200, 26_582_336, 23_392_455, 20_585_361,
  18_115_117, 15_941_303, 14_028_347, 12_344_945, 10_863_552,
  9_559_925, 8_412_734, 7_423_267, 6_514_821, 5_733_043,
] as const;

/**
 * Price per 1 MAGT in nanoTON (1 TON = 1e9 nanoTON).
 * ✅ MUST match contracts/presale.tact -> roundPriceNano(...)
 */
export const ROUNDS_PRICE_NANO = [
  11_489_000, 13_443_000, 15_729_000, 18_403_000, 21_532_000,
  25_191_000, 29_471_000, 34_483_000, 40_345_000, 47_206_000,
  55_231_000, 64_618_000, 75_603_000, 88_455_000, 103_495_000,
  121_086_000, 141_671_000, 165_757_000, 193_935_000, 226_397_000,
] as const;

/**
 * ✅ Single source of truth for TON price per MAGT (for UI).
 * Returns TON per 1 MAGT for a given round index.
 */
export function getRoundPriceTon(round: number): number {
  const i = Math.max(0, Math.min(round | 0, ROUNDS_PRICE_NANO.length - 1));
  return Number(ROUNDS_PRICE_NANO[i]) / 1e9;
}

/**
 * Backward compatible helper.
 * Якщо десь у UI ще використовується priceUsd(), поки повертаємо TON price.
 */
export function priceUsd(round: number): number {
  return getRoundPriceTon(round);
}

/** Convert bigint nano-units (1e9) to number, safe for MAGT ranges (<= 500M). */
export function fromNano(n: bigint): number {
  const base = 1_000_000_000n;
  const i = n / base;
  const f = n % base;
  return Number(i) + Number(f) / 1e9;
}

/* =========================
   On-chain helpers (TonAPI)
   ========================= */

type TonNetwork = "testnet" | "mainnet";

function getNetwork(): TonNetwork {
  const v = (import.meta as any)?.env?.VITE_TON_NETWORK;
  return v === "mainnet" ? "mainnet" : "testnet";
}

function tonApiBase(network: TonNetwork): string {
  // TonAPI endpoints:
  // mainnet: https://tonapi.io
  // testnet: https://testnet.tonapi.io
  return network === "mainnet" ? "https://tonapi.io" : "https://testnet.tonapi.io";
}

function normalizeAddr(a: string): string {
  return (a || "").trim();
}

function asBigIntFromTonApiStackItem(item: any): bigint {
  // TonAPI method response stack items обычно в формате:
  // { type: "num" | "int" | "cell" | "slice", value: "0x..." or "123" }
  // Sometimes can be: ["num","0x..."] depending on proxy.
  if (item == null) throw new Error("Empty stack item");

  // array format: ["num","0x123"]
  if (Array.isArray(item) && item.length >= 2) {
    const v = item[1];
    if (typeof v === "string") {
      if (v.startsWith("0x") || v.startsWith("0X")) return BigInt(v);
      if (/^-?\d+$/.test(v)) return BigInt(v);
    }
  }

  // object format: { type, value }
  if (typeof item === "object") {
    const v = (item as any).value;
    if (typeof v === "string") {
      if (v.startsWith("0x") || v.startsWith("0X")) return BigInt(v);
      if (/^-?\d+$/.test(v)) return BigInt(v);
    }
    // sometimes value can be nested { ... }
    if (typeof v === "number") return BigInt(v);
  }

  throw new Error("Unsupported stack int format: " + JSON.stringify(item));
}

function asIntFromTonApiStackFirst(res: any): bigint {
  // TonAPI response usually:
  // { success: true, stack: [ {type:"num", value:"0x.."}, ... ] }
  const stack = res?.stack;
  if (!Array.isArray(stack) || stack.length === 0) throw new Error("No stack in response");
  return asBigIntFromTonApiStackItem(stack[0]);
}

async function tonApiGetMethod(args: {
  network: TonNetwork;
  account: string;
  method: string;
}): Promise<any> {
  const base = tonApiBase(args.network);
  const url = `${base}/v2/blockchain/accounts/${encodeURIComponent(args.account)}/methods/${encodeURIComponent(args.method)}`;
  const r = await fetch(url, { method: "GET" });
  if (!r.ok) {
    const t = await r.text().catch(() => "");
    throw new Error(`TonAPI method failed ${r.status}: ${t || r.statusText}`);
  }
  return r.json();
}

async function tonApiGetJettons(args: { network: TonNetwork; account: string }): Promise<any> {
  const base = tonApiBase(args.network);
  const url = `${base}/v2/accounts/${encodeURIComponent(args.account)}/jettons`;
  const r = await fetch(url, { method: "GET" });
  if (!r.ok) {
    const t = await r.text().catch(() => "");
    throw new Error(`TonAPI jettons failed ${r.status}: ${t || r.statusText}`);
  }
  return r.json();
}

function stackAddressToString(stackItem: any): string {
  // TonAPI for address getter can return:
  // stack[0] as { type:"slice", value:"..." } (slice with address)
  // BUT TonAPI often also provides "decoded" field with addr string.
  // We'll try decoded first; else fallback to searching in response.
  if (typeof stackItem === "string") return stackItem;

  // array format:
  if (Array.isArray(stackItem) && typeof stackItem[1] === "string") return stackItem[1];

  if (typeof stackItem === "object" && typeof (stackItem as any).value === "string") {
    // sometimes already human-readable
    return (stackItem as any).value;
  }
  return "";
}

/**
 * ✅ "Presale way": read snapshot from chain.
 *
 * - currentRound: Presale.currentRound()
 * - soldTotalNano: Presale.totalSoldNano()
 * - soldInRoundNano: Presale.currentRoundSoldNano()
 * - totalRaisedNano: Presale.totalRaisedNano()
 * - claimableNano: we set as wallet's MAGT jetton balance ("Your MAGT")
 */
export async function getPresaleSnapshot(input: {
  presaleAddress: string;
  walletAddress?: string;
}): Promise<PresaleSnapshot> {
  const network = getNetwork();
  const presale = normalizeAddr(input.presaleAddress);
  const wallet = input.walletAddress ? normalizeAddr(input.walletAddress) : undefined;

  if (!presale) {
    return {
      currentRound: 0,
      soldTotalNano: 0n,
      soldInRoundNano: 0n,
      totalRaisedNano: 0n,
      claimableNano: 0n,
    };
  }

  // 1) Read basic presale stats
  const [roundRes, soldRes, roundSoldRes, raisedRes] = await Promise.all([
    tonApiGetMethod({ network, account: presale, method: "currentRound" }),
    tonApiGetMethod({ network, account: presale, method: "totalSoldNano" }),
    tonApiGetMethod({ network, account: presale, method: "currentRoundSoldNano" }),
    tonApiGetMethod({ network, account: presale, method: "totalRaisedNano" }),
  ]);

  const currentRound = Number(asIntFromTonApiStackFirst(roundRes));
  const soldTotalNano = asIntFromTonApiStackFirst(soldRes);
  const soldInRoundNano = asIntFromTonApiStackFirst(roundSoldRes);
  const totalRaisedNano = asIntFromTonApiStackFirst(raisedRes);

  // 2) "Your MAGT" — wallet jetton balance
  // We need jetton minter address from presale
  let yourMagtNano = 0n;

  if (wallet) {
    try {
      const minterRes = await tonApiGetMethod({ network, account: presale, method: "jettonMinterAddr" });

      // TonAPI often provides decoded output; try a few places
      const decoded = (minterRes as any)?.decoded;
      let jettonMinter = "";
      if (typeof decoded === "string" && decoded.length > 0) {
        jettonMinter = decoded;
      } else {
        const st = (minterRes as any)?.stack;
        if (Array.isArray(st) && st[0]) {
          jettonMinter = stackAddressToString(st[0]);
        }
      }

      jettonMinter = normalizeAddr(jettonMinter);

      if (jettonMinter) {
        const jettons = await tonApiGetJettons({ network, account: wallet });

        // TonAPI: { balances: [ { balance:"123", jetton:{ address:"..." } } ] }
        const balances: any[] = Array.isArray(jettons?.balances) ? jettons.balances : [];
        const found = balances.find((b) => normalizeAddr(b?.jetton?.address) === jettonMinter);

        if (found?.balance != null) {
          // balance is string integer in nano-jettons (1e9 decimals)
          const s = String(found.balance);
          if (/^\d+$/.test(s)) yourMagtNano = BigInt(s);
        }
      }
    } catch {
      // If TonAPI token endpoint fails, don't break whole snapshot.
      yourMagtNano = 0n;
    }
  }

  return {
    currentRound: Number.isFinite(currentRound) ? currentRound : 0,
    soldTotalNano,
    soldInRoundNano,
    totalRaisedNano,
    claimableNano: yourMagtNano,
  };
}
