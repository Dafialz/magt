// src/lib/presale.ts

import { TONAPI_BASE, JETTON_MASTER, PRESALE_CONTRACT } from "./config";

/* ===== Tokenomics/rounds constants ===== */

export const ROUNDS_TOKENS = [
  65_225_022, 57_039_669, 50_370_908, 44_326_399, 39_007_231,
  34_326_365, 30_207_200, 26_582_336, 23_392_455, 20_585_361,
  18_115_117, 15_941_303, 14_028_347, 12_344_945, 10_863_552,
  9_559_925, 8_412_734, 7_423_267, 6_514_821, 5_733_043,
];

// alias щоб не ламати старі імпорти
export const ROUND_TOKENS = ROUNDS_TOKENS;

// загальний пресейл = сума раундів (у тебе так і є в контракті/логіці)
export const TOTAL_PRESALE_TOKENS = ROUNDS_TOKENS.reduce((a, b) => a + b, 0);

// jetton decimals = 9
const JETTON_DECIMALS = 9n;
const NANO = 10n ** JETTON_DECIMALS;
const TOTAL_PRESALE_NANO = BigInt(TOTAL_PRESALE_TOKENS) * NANO;

export type PresaleSnapshot = {
  currentRound: number;
  soldTotalNano: bigint;
  soldInRoundNano: bigint;
  totalRaisedNano: bigint; // поточний TON баланс presale (не "lifetime raised")
  claimableNano: bigint; // тут: твій MAGT balance (jetton balance), як у тебе і було в UI
};

/* ===== price (як було у тебе) ===== */
export function priceUsd(roundIndex: number): number {
  // якщо у тебе інша формула/таблиця — залишай свою. Я лишив приклад.
  // (у твоєму UI головне: щоб roundIndex був правильний)
  const base = 0.011; // приклад
  const step = 0.001; // приклад
  return base + roundIndex * step;
}

/* ===== helpers ===== */

export function fromNano(n: bigint): number {
  // безпечне перетворення в number для UI (для великих значень — обрізаємо точність, але UI ок)
  const s = n.toString();
  if (s.length <= 9) return Number(s) / 1e9;
  const head = s.slice(0, -9);
  const tail = s.slice(-9);
  return Number(`${head}.${tail}`); // ок для UI
}

async function fetchJson<T>(url: string): Promise<T> {
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return (await r.json()) as T;
}

async function tonApiGetAccountBalanceNano(address: string): Promise<bigint> {
  const url = `${TONAPI_BASE}/v2/accounts/${address}?t=${Date.now()}`;
  const j = await fetchJson<any>(url);
  const bal = j?.balance;
  return BigInt(bal ?? 0);
}

/**
 * Returns jetton balance in nano (as bigint).
 * Uses: GET /v2/accounts/{address}/jettons
 */
async function tonApiGetWalletJettonBalanceNano(
  walletAddress: string,
  jettonMaster: string
): Promise<bigint> {
  const url = `${TONAPI_BASE}/v2/accounts/${walletAddress}/jettons?t=${Date.now()}`;
  const j = await fetchJson<any>(url);

  const balances = Array.isArray(j?.balances) ? j.balances : [];
  const found = balances.find(
    (b: any) => b?.jetton?.address === jettonMaster
  );

  const bal = found?.balance;
  return BigInt(bal ?? 0);
}

function clampRoundIndex(i: number): number {
  return Math.max(0, Math.min(i, ROUNDS_TOKENS.length - 1));
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

  // якщо все продано
  const last = clampRoundIndex(ROUNDS_TOKENS.length - 1);
  const lastCapNano = BigInt(ROUNDS_TOKENS[last]) * NANO;
  return { currentRound: last, soldInRoundNano: lastCapNano };
}

/* ===== main ===== */

export async function getPresaleSnapshot(args?: {
  presaleAddress?: string;
  walletAddress?: string;
}): Promise<PresaleSnapshot> {
  const presaleAddress = args?.presaleAddress ?? PRESALE_CONTRACT;
  const walletAddress = args?.walletAddress;

  // 1) TON баланс presale
  const totalRaisedNano = await tonApiGetAccountBalanceNano(presaleAddress);

  // 2) залишок MAGT у presale (через jettons list)
  // TonAPI віддає jetton balance по owner-address, навіть якщо owner = smart-contract.
  const remainingNano = await tonApiGetWalletJettonBalanceNano(
    presaleAddress,
    JETTON_MASTER
  );

  // sold = total_presale - remaining (не даємо піти в мінус)
  const soldTotalNano =
    TOTAL_PRESALE_NANO > remainingNano
      ? TOTAL_PRESALE_NANO - remainingNano
      : 0n;

  const { currentRound, soldInRoundNano } = calcRoundFromSold(soldTotalNano);

  // 3) “Your MAGT” (як у тебе в UI): jetton balance по твоєму гаманцю
  let claimableNano = 0n;
  if (walletAddress) {
    claimableNano = await tonApiGetWalletJettonBalanceNano(
      walletAddress,
      JETTON_MASTER
    );
  }

  return {
    currentRound,
    soldTotalNano,
    soldInRoundNano,
    totalRaisedNano,
    claimableNano,
  };
}
