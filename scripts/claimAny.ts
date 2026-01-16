// scripts/claimAny.ts
import { beginCell, toNano } from "@ton/core";
import { NetworkProvider } from "@ton/blueprint";
import { PRESALE } from "./addresses";

// MUST match presale.tact: message(0x434C4149) Claim { query_id: Int; }
const OP_CLAIM = 0x434c4149; // "CLAI"

function env(key: string): string | undefined {
  return (process.env[key] ?? "").trim() || undefined;
}

export async function run(provider: NetworkProvider) {
  const claimGasStr = env("CLAIM_GAS") ?? "0.35";
  const qidStr = env("QID") ?? String(Date.now());

  const claimGas = toNano(claimGasStr);
  const qid = BigInt(qidStr);

  // ✅ IMPORTANT: Tact Int = 257-bit signed by default
  const body = beginCell()
    .storeUint(OP_CLAIM, 32)
    .storeInt(qid, 257) // ✅ FIX (було storeUint(qid, 64))
    .endCell();

  console.log("🏷️ Presale:", PRESALE.toString());
  console.log("⛽ Claim gas:", claimGasStr, "TON");
  console.log("🆔 query_id:", qid.toString());
  console.log("");
  console.log("➡️ This is a SIGNED transaction from the wallet you open the link with.");
  console.log("➡️ Open the ton:// link in the REFERRAL wallet (Tonkeeper TESTNET).");

  // Deep link / QR (works when you choose 'Create a ton:// deep link')
  await provider.sender().send({
    to: PRESALE,
    value: claimGas,
    body,
  });

  console.log("✅ Claim tx prepared/sent.");
  console.log("➡️ Now run check:");
  console.log("BUYER=<REF_ADDR_EQ...> ./node_modules/.bin/blueprint run check --testnet");
}
