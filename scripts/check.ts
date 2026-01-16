// scripts/check.ts
import { Address, TupleBuilder } from "@ton/core";
import { NetworkProvider } from "@ton/blueprint";
import { Presale } from "../build/Presale/Presale_Presale";
import { PRESALE, JETTON_MINTER } from "./addresses";

// ENV:
//  BUYER=EQ...               (кого перевіряти; якщо нема — перевіряємо sender.address)
//  ADDR=EQ...                (додатково перевірити claimable для будь-якої адреси, напр. реферала)
//  SAFE_REMAIN_TON=0.7       (скільки TON залишати на пресейлі при withdraw; дефолт 0.7)
function env(key: string): string | undefined {
  return (process.env[key] ?? "").trim() || undefined;
}

async function getJettonWalletAddress(
  provider: NetworkProvider,
  minter: Address,
  owner: Address
): Promise<Address> {
  const p = provider.provider(minter);
  const tb = new TupleBuilder();
  tb.writeAddress(owner);
  const res = await p.get("get_wallet_address", tb.build());
  return res.stack.readAddress();
}

function asBigInt(v: unknown): bigint {
  if (typeof v === "bigint") return v;
  if (typeof v === "number") return BigInt(v);
  if (typeof v === "string" && v.trim() !== "") return BigInt(v);
  return 0n;
}

function formatJettons(nano: bigint): string {
  const DEC = 1_000_000_000n;
  const whole = nano / DEC;
  const frac = nano % DEC;
  return `${whole.toString()}.${frac.toString().padStart(9, "0")}`;
}

function formatTonFromNano(nano: bigint): string {
  const DEC = 1_000_000_000n;
  const whole = nano / DEC;
  const frac = nano % DEC;
  return `${whole.toString()}.${frac.toString().padStart(9, "0")}`;
}

function safeReadFirstCoins(stack: any): bigint | null {
  // get_wallet_data(): (balance, owner, jetton, code)
  try {
    if (typeof stack?.readBigNumber === "function") return asBigInt(stack.readBigNumber());
  } catch {}
  try {
    if (typeof stack?.readBigInt === "function") return asBigInt(stack.readBigInt());
  } catch {}
  try {
    if (typeof stack?.readCoins === "function") return asBigInt(stack.readCoins());
  } catch {}
  try {
    if (typeof stack?.readInt === "function") return asBigInt(stack.readInt());
  } catch {}
  return null;
}

type AccState = {
  type: string; // "active" | "uninit" | "frozen" | "nonexist" | ...
  balanceNano: bigint;
};

async function getAccountState(provider: NetworkProvider, addr: Address): Promise<AccState> {
  const st = await provider.provider(addr).getState();
  const type = (st?.state as any)?.type ?? "nonexist";
  const balanceNano = asBigInt(st?.balance);
  return { type: String(type), balanceNano };
}

async function getJettonWalletInfo(
  provider: NetworkProvider,
  jettonWallet: Address
): Promise<{ state: string; tonBalanceNano: bigint; jettonBalanceNano: bigint | null; error?: string }> {
  const acc = await getAccountState(provider, jettonWallet);

  if (acc.type !== "active") {
    return { state: acc.type, tonBalanceNano: acc.balanceNano, jettonBalanceNano: null };
  }

  try {
    const p = provider.provider(jettonWallet);
    const res = await p.get("get_wallet_data", []);
    const b = safeReadFirstCoins(res.stack);
    return { state: acc.type, tonBalanceNano: acc.balanceNano, jettonBalanceNano: b };
  } catch (e: any) {
    return {
      state: acc.type,
      tonBalanceNano: acc.balanceNano,
      jettonBalanceNano: null,
      error: String(e?.message ?? e),
    };
  }
}

function parseOptAddress(s?: string): Address | null {
  if (!s) return null;
  try {
    return Address.parse(s);
  } catch {
    return null;
  }
}

export async function run(provider: NetworkProvider) {
  const sender = provider.sender();
  const senderAddr = sender.address;

  const buyerEnv = env("BUYER");
  const buyer = buyerEnv ? Address.parse(buyerEnv) : senderAddr;

  if (!buyer) {
    throw new Error(
      [
        "No BUYER env and no connected wallet address to use as default.",
        "",
        "✅ FIX:",
        "Run the script again and choose: 'TON Connect compatible mobile wallet (example: Tonkeeper)'",
        "Do NOT choose 'Create a ton:// deep link'.",
      ].join("\n")
    );
  }

  const addrEnv = env("ADDR");
  const extraAddr = parseOptAddress(addrEnv);

  const presale = provider.open(await Presale.fromAddress(PRESALE));

  // Presale account state (TON balance)
  const presaleAcc = await getAccountState(provider, PRESALE);

  // Presale getters
  const jettonWalletSet = asBigInt(await presale.getJettonWalletSet());
  const claimableBuyerNano = asBigInt(await presale.getClaimableNano(buyer));
  const pending = asBigInt(await presale.getClaimPendingNow());
  const pendingQ = asBigInt(await presale.getClaimPendingQuery());

  // Extra address claimable (ref / any addr)
  let claimableExtraNano: bigint | null = null;
  if (extraAddr && !extraAddr.equals(buyer)) {
    claimableExtraNano = asBigInt(await presale.getClaimableNano(extraAddr));
  }

  // Wallet addresses (derived from minter)
  const presaleJettonWallet = await getJettonWalletAddress(provider, JETTON_MINTER, PRESALE);
  const buyerJettonWallet = await getJettonWalletAddress(provider, JETTON_MINTER, buyer);

  // Wallet states + balances
  const presaleJetton = await getJettonWalletInfo(provider, presaleJettonWallet);
  const buyerJetton = await getJettonWalletInfo(provider, buyerJettonWallet);

  console.log("🏷️ Presale:", PRESALE.toString());
  console.log("🪙 Jetton Minter:", JETTON_MINTER.toString());
  console.log("💰 Presale TON balance (nanoTON):", presaleAcc.balanceNano.toString());
  console.log("💰 Presale TON balance (TON):", formatTonFromNano(presaleAcc.balanceNano));
  console.log("");

  // Safe withdraw suggestion
  const safeRemainTon = env("SAFE_REMAIN_TON") ?? "0.7";
  const SAFE_REMAIN_NANO = asBigInt(Math.floor(Number(safeRemainTon) * 1e9));
  const withdrawable =
    presaleAcc.balanceNano > SAFE_REMAIN_NANO ? presaleAcc.balanceNano - SAFE_REMAIN_NANO : 0n;

  console.log("💡 Safe withdraw (leave", safeRemainTon, "TON on presale):");
  console.log("   withdrawable (nanoTON):", withdrawable.toString());
  console.log("   withdrawable (TON):", formatTonFromNano(withdrawable));
  console.log(
    "   cmd:",
    `AMOUNT_TON=${Number(formatTonFromNano(withdrawable))} ./node_modules/.bin/blueprint run withdrawTon --testnet`
  );
  console.log("");

  console.log("🏦 Presale Jetton Wallet:", presaleJettonWallet.toString());
  console.log("🧠 Presale Jetton Wallet state:", presaleJetton.state);
  console.log("💰 Presale Jetton Wallet TON balance (nanoTON):", presaleJetton.tonBalanceNano.toString());
  if (presaleJetton.jettonBalanceNano === null) {
    if (presaleJetton.state !== "active") {
      console.log("🪙 Presale Jetton balance: (wallet NOT deployed yet)");
      console.log("➡️ FIX: deploy it by funding (send ANY jettons with FORWARD_TON>0).");
      console.log(
        "➡️ Run: JETTON_TOKENS=1 FORWARD_TON=0.05 JETTON_GAS=0.5 ./node_modules/.bin/blueprint run fundPresaleJettons --testnet"
      );
    } else {
      console.log("🪙 Presale Jetton balance: (cannot read get_wallet_data)");
      if (presaleJetton.error) console.log("   ↳ error:", presaleJetton.error);
    }
  } else {
    console.log("🪙 Presale Jetton balance (nano):", presaleJetton.jettonBalanceNano.toString());
    console.log("🪙 Presale Jetton balance (tokens):", formatJettons(presaleJetton.jettonBalanceNano));
  }

  console.log("");
  console.log("👤 Buyer:", buyer.toString());
  console.log("💼 Buyer Jetton Wallet:", buyerJettonWallet.toString());
  console.log("🧠 Buyer Jetton Wallet state:", buyerJetton.state);
  console.log("💰 Buyer Jetton Wallet TON balance (nanoTON):", buyerJetton.tonBalanceNano.toString());
  if (buyerJetton.jettonBalanceNano === null) {
    console.log("🧾 Buyer Jetton balance: (cannot read get_wallet_data)");
    if (buyerJetton.error) console.log("   ↳ error:", buyerJetton.error);
  } else {
    console.log("🧾 Buyer Jetton balance (nano):", buyerJetton.jettonBalanceNano.toString());
    console.log("🧾 Buyer Jetton balance (tokens):", formatJettons(buyerJetton.jettonBalanceNano));
  }

  console.log("");
  console.log("jettonWalletSet:", jettonWalletSet.toString());
  console.log("claimableNano (buyer):", claimableBuyerNano.toString());
  console.log("claimableTokens (buyer):", formatJettons(claimableBuyerNano));
  console.log("claimPendingNow:", pending.toString());
  console.log("claimPendingQuery:", pendingQ.toString());

  if (extraAddr && !extraAddr.equals(buyer)) {
    console.log("");
    console.log("👥 Extra ADDR:", extraAddr.toString());
    console.log("claimableNano (ADDR):", (claimableExtraNano ?? 0n).toString());
    console.log("claimableTokens (ADDR):", formatJettons(claimableExtraNano ?? 0n));
    // informational: expected ref bonus from buyer claimable (REF_PPM=250, PPM_DEN=1_000_000)
    const expectedRef = (claimableBuyerNano * 250n) / 1_000_000n;
    console.log("ℹ️ Expected ref bonus from buyer claimable (~0.025%):", formatJettons(expectedRef));
  } else if (addrEnv) {
    console.log("");
    console.log("⚠️ ADDR provided but cannot parse or equals buyer. Ignoring ADDR.");
  }

  console.log("");
  if (jettonWalletSet !== 1n) {
    console.log("❌ jettonWalletSet != 1 → setJettonWallet ще не виконаний або не пройшов.");
    console.log("➡️ Run: ./node_modules/.bin/blueprint run setJettonWallet --testnet");
    return;
  }

  if (pending === 1n) {
    console.log("⚠️ claimPendingNow=1 → контракт чекає JettonExcesses або bounce від Presale Jetton Wallet.");
    console.log("➡️ Якщо presale jetton wallet uninit → спочатку задеплой його fundPresaleJettons.");
    console.log("➡️ Next: ./node_modules/.bin/blueprint run check --testnet (через 10-30 сек)");
    return;
  }

  if (claimableBuyerNano > 0n) {
    console.log("✅ You have claimable > 0 (buyer).");
    console.log("➡️ Claim: CLAIM_GAS=0.35 ./node_modules/.bin/blueprint run claim --testnet");
  } else {
    console.log("✅ claimable = 0 (buyer has nothing to claim).");
  }
}
