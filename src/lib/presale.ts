// src/lib/presale.ts

export type PresaleSnapshot = {
  currentRound: number;
  soldTotalNano: bigint;
  soldInRoundNano: bigint;
  totalRaisedNano: bigint;
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
 * (Пізніше, якщо треба, зробимо окремо USD-ціни.)
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

// Заглушка: поки без ончейну (щоб проект піднявся)
export async function getPresaleSnapshot(_: {
  presaleAddress: string;
  walletAddress?: string;
}): Promise<PresaleSnapshot> {
  return {
    currentRound: 0,
    soldTotalNano: 0n,
    soldInRoundNano: 0n,
    totalRaisedNano: 0n,
    claimableNano: 0n,
  };
}
