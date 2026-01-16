// src/lib/presale.ts

import { JETTON_MASTER, TONAPI_BASE } from "./config";

export type PresaleSnapshot = {
  currentRound: number;
  soldTotalNano: bigint;
  soldInRoundNano: bigint;
  totalRaisedNano: bigint;
  /**
   * In the UI we currently display this as "Your MAGT".
   * For now we fill it from the wallet's Jetton balance (via TonAPI).
   */
  claimableNano: bigint;
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

/** ✅ Single source of truth for TON price per MAGT (for UI). */
export function getRoundPriceTon(round: number): number {
  const i = Math.max(0, Math.min(round | 0, ROUNDS_PRICE_NANO.length - 1));
  return Number(ROUNDS_PRICE_NANO[i]) / 1e9;
}

/** Backward compatible helper. */
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

/** TonAPI: get jettons for owner (wallet) */
async function tonApiGetJettons(owner: string): Promise<any> {
  const url = `${TONAPI_BASE}/v2/accounts/${owner}/jettons`;
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`TonAPI jettons failed: ${res.status}`);
  return res.json();
}

/**
 * "Presale way" for now:
 * - We show "Your MAGT" as current Jetton balance (from TonAPI)
 * - Presale stats (round/raised/sold) can be added later via on-chain get-methods
 */
export async function getPresaleSnapshot(args: {
  presaleAddress: string;
  walletAddress?: string;
}): Promise<PresaleSnapshot> {
  let yourMagtNano = 0n;

  if (args.walletAddress) {
    try {
      const data = await tonApiGetJettons(args.walletAddress);

      const items: any[] = Array.isArray(data?.balances) ? data.balances : [];

      const magt = items.find((x) => {
        const master = x?.jetton?.address ?? x?.jetton?.jetton_master;
        return typeof master === "string" && master === JETTON_MASTER;
      });

      const balance = magt?.balance;
      if (typeof balance === "string" || typeof balance === "number") {
        yourMagtNano = BigInt(balance);
      }
    } catch {
      // keep 0, UI will show 0 instead of crashing
    }
  }

  return {
    currentRound: 0,
    soldTotalNano: 0n,
    soldInRoundNano: 0n,
    totalRaisedNano: 0n,
    claimableNano: yourMagtNano,
  };
}
