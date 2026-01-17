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
  totalRaisedNano: bigint; // lifetime raised (getter totalRaisedNano)
  claimableNano: bigint; // claimable from contract (getter claimableNano)
};

/* ===== price (як було у тебе) ===== */
export function priceUsd(roundIndex: number): number {
  // якщо у тебе інша формула/таблиця — залишай свою. Я лишив приклад.
  // (у твоєму UI головне: щоб roundIndex був правильний)
  const base = 0.011; // приклад
  const step = 0.001; // приклад
  return base + roundIndex * step;
}

/**
 * ===== Round price in TON per 1 MAGT =====
 * ВАЖЛИВО: без контракту ми не можемо точно знати ton-ціну.
 * Але тобі треба щоб збірка проходила і калькулятор мав єдине джерело.
 *
 * Тут ми робимо просту конвертацію через "reference" TON/USD.
 * Якщо в presale.tact ціна інша — заміниш лише цю константу/логіку.
 */
export const TON_USD_REFERENCE = 5; // <-- при бажанні підкоригуєш

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

type TonApiRunGetMethodResp = {
  exit_code?: number;
  exitCode?: number;
  stack?: any;
};

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function stackItemToBigInt(item: any): bigint {
  // TonAPI/toncenter usually returns stack as arrays like ["num","123"]
  // or objects like { type: "num", value: "123" }
  const t = Array.isArray(item) ? item[0] : item?.type;
  const v = Array.isArray(item) ? item[1] : item?.value;
  if (t === "num" || t === "int") {
    const s = String(v ?? "0");
    if (s.startsWith("0x") || s.startsWith("-0x")) return BigInt(s);
    return BigInt(s);
  }
  // sometimes numbers are nested
  if (
    typeof v === "string" &&
    (v.match(/^-?\d+$/) || v.startsWith("0x") || v.startsWith("-0x"))
  ) {
    return BigInt(v);
  }
  return 0n;
}

async function tonApiRunGetMethod(
  accountId: string,
  methodName: string,
  args: string[] = []
): Promise<TonApiRunGetMethodResp> {
  const qs = new URLSearchParams();
  for (const a of args) qs.append("args", a);
  qs.set("t", String(Date.now()));

  // TonAPI v2 blockchain get-method endpoint
  const url = `${TONAPI_BASE}/v2/blockchain/accounts/${accountId}/methods/${encodeURIComponent(
    methodName
  )}?${qs.toString()}`;

  return await fetchJson<TonApiRunGetMethodResp>(url);
}

function addressArgToB64Cell(addr: string): string {
  // TonAPI expects args as strings; for Address type it's a BOC (base64) of a cell containing the address.
  const a = Address.parse(addr);
  const cell = beginCell().storeAddress(a).endCell();
  return bytesToBase64(cell.toBoc({ idx: false }));
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
  const found = balances.find((b: any) => b?.jetton?.address === jettonMaster);

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

  // ✅ Preferred source of truth: contract getters (works for CLAIM variant)
  // If TonAPI get-method fails for any reason, we fall back to the old "remaining jettons" heuristic.
  try {
    const [rRaised, rSold, rRound, rRoundSold] = await Promise.all([
      tonApiRunGetMethod(presaleAddress, "totalRaisedNano"),
      tonApiRunGetMethod(presaleAddress, "totalSoldNano"),
      tonApiRunGetMethod(presaleAddress, "currentRound"),
      tonApiRunGetMethod(presaleAddress, "currentRoundSoldNano"),
    ]);

    const exitRaised = rRaised.exit_code ?? rRaised.exitCode ?? 1;
    const exitSold = rSold.exit_code ?? rSold.exitCode ?? 1;
    const exitRound = rRound.exit_code ?? rRound.exitCode ?? 1;
    const exitRoundSold = rRoundSold.exit_code ?? rRoundSold.exitCode ?? 1;
    if (
      exitRaised !== 0 ||
      exitSold !== 0 ||
      exitRound !== 0 ||
      exitRoundSold !== 0
    ) {
      throw new Error("GETTER_EXIT_CODE");
    }

    const totalRaisedNano = stackItemToBigInt(rRaised.stack?.[0]);
    const soldTotalNano = stackItemToBigInt(rSold.stack?.[0]);
    const currentRound = Number(stackItemToBigInt(rRound.stack?.[0]));
    const soldInRoundNano = stackItemToBigInt(rRoundSold.stack?.[0]);

    let claimableNano = 0n;
    if (walletAddress) {
      const aB64 = addressArgToB64Cell(walletAddress);
      const rClaim = await tonApiRunGetMethod(presaleAddress, "claimableNano", [
        aB64,
      ]);
      const exitClaim = rClaim.exit_code ?? rClaim.exitCode ?? 1;
      if (exitClaim === 0) {
        claimableNano = stackItemToBigInt(rClaim.stack?.[0]);
      }
    }

    return {
      currentRound: clampRoundIndex(currentRound),
      soldTotalNano: soldTotalNano < 0n ? 0n : soldTotalNano,
      soldInRoundNano: soldInRoundNano < 0n ? 0n : soldInRoundNano,
      totalRaisedNano: totalRaisedNano < 0n ? 0n : totalRaisedNano,
      claimableNano: claimableNano < 0n ? 0n : claimableNano,
    };
  } catch {
    // 1) fallback: TON balance presale (not lifetime)
    const totalRaisedNano = await tonApiGetAccountBalanceNano(presaleAddress);

    // 2) fallback: remaining MAGT in presale via jettons list
    const remainingNano = await tonApiGetWalletJettonBalanceNano(
      presaleAddress,
      JETTON_MASTER
    );

    const soldTotalNano =
      TOTAL_PRESALE_NANO > remainingNano ? TOTAL_PRESALE_NANO - remainingNano : 0n;

    const { currentRound, soldInRoundNano } = calcRoundFromSold(soldTotalNano);

    // 3) fallback: show wallet's jetton balance as "Your MAGT"
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
}
