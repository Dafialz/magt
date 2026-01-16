// scripts/withdraw.ts
import { toNano } from "@ton/core";
import { NetworkProvider } from "@ton/blueprint";
import { Presale } from "../build/Presale/Presale_Presale";
import { PRESALE } from "./addresses";

// ENV:
//  AMOUNT=0.5      (скільки TON вивести з пресейлу)
//  WITHDRAW_GAS=0.06
function env(key: string): string | undefined {
  return (process.env[key] ?? "").trim() || undefined;
}

export async function run(provider: NetworkProvider) {
  const sender = provider.sender();
  const owner = sender.address;
  if (!owner) throw new Error("No sender address. Connect owner wallet and retry.");

  const presale = provider.open(await Presale.fromAddress(PRESALE));

  const amountTon = env("AMOUNT") ?? "0.2";
  const gas = env("WITHDRAW_GAS") ?? "0.06";

  console.log("🏷️ Presale:", PRESALE.toString());
  console.log("👑 Owner:", owner.toString());
  console.log("💸 Withdraw amount:", amountTon, "TON");
  console.log("⛽ Withdraw gas:", gas, "TON");

  await presale.send(
    sender,
    { value: toNano(gas) },
    { $$type: "Withdraw", amount: toNano(amountTon) } as any
  );

  console.log("✅ Withdraw sent. (Працює тільки якщо sender == owner у контракті)");
}
