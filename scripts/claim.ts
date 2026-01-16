// scripts/claim.ts
import { toNano } from "@ton/core";
import { NetworkProvider } from "@ton/blueprint";
import { Presale } from "../build/Presale/Presale_Presale";
import { PRESALE } from "./addresses";

function env(key: string): string | undefined {
  return (process.env[key] ?? "").trim() || undefined;
}

function asBigInt(v: unknown): bigint {
  if (typeof v === "bigint") return v;
  if (typeof v === "number") return BigInt(v);
  if (typeof v === "string" && v.trim() !== "") return BigInt(v);
  return 0n;
}

export async function run(provider: NetworkProvider) {
  const sender = provider.sender();
  const claimer = sender.address;

  if (!claimer) {
    throw new Error(
      [
        "No sender address. Connect your wallet and try again.",
        "",
        "✅ FIX:",
        "Run the script again and choose: 'TON Connect compatible mobile wallet (example: Tonkeeper)'",
        "Do NOT choose 'Create a ton:// deep link'.",
      ].join("\n")
    );
  }

  const presale = provider.open(await Presale.fromAddress(PRESALE));

  // default gas, can override: CLAIM_GAS=0.35
  const gasStr = env("CLAIM_GAS") ?? "0.35";
  const gas = toNano(gasStr);

  console.log("🏷️ Presale:", PRESALE.toString());
  console.log("👤 Claimer:", claimer.toString());

  const jettonWalletSet = asBigInt(await presale.getJettonWalletSet());
  const claimableNano = asBigInt(await presale.getClaimableNano(claimer));
  const claimPendingNow = asBigInt(await presale.getClaimPendingNow());
  const claimPendingQuery = asBigInt(await presale.getClaimPendingQuery());

  console.log("🔎 jettonWalletSet:", jettonWalletSet.toString());
  console.log("🔎 claimableNano:", claimableNano.toString());
  console.log("🔎 claimPendingNow:", claimPendingNow.toString());
  console.log("🔎 claimPendingQuery:", claimPendingQuery.toString());

  if (jettonWalletSet !== 1n) {
    console.log("❌ Jetton wallet is not set on presale.");
    console.log("➡️ Run: ./node_modules/.bin/blueprint run setJettonWallet --testnet");
    return;
  }

  if (claimPendingNow === 1n) {
    console.log("⏳ Claim is pending already. Wait 10-30 sec and run:");
    console.log("➡️ ./node_modules/.bin/blueprint run check --testnet");
    return;
  }

  if (claimableNano === 0n) {
    console.log("✅ Nothing to claim (claimableNano = 0).");
    return;
  }

  // ✅ unique query_id (milliseconds) to avoid collisions
  const queryId = BigInt(Date.now());

  console.log("⛽ Claim gas:", gasStr, "TON");
  console.log("🆔 Claim query_id:", queryId.toString());
  console.log("📩 Sending Claim (TYPED)... approve in your wallet");

  // ✅ IMPORTANT:
  // Use typed message so it lands in receive(msg: Claim) for sure.
  await presale.send(sender, { value: gas }, { $$type: "Claim", query_id: queryId } as any);

  console.log("✅ Claim sent.");
  console.log("➡️ Next: ./node_modules/.bin/blueprint run check --testnet");
}
