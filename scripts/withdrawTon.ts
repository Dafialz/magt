// scripts/withdrawTon.ts
import { toNano } from "@ton/core";
import { NetworkProvider } from "@ton/blueprint";
import { Presale } from "../build/Presale/Presale_Presale";
import { PRESALE } from "./addresses";

// ENV:
//  AMOUNT_TON=5     (скільки TON вивести; дефолт 1)
//  MSG_TON=0.08     (скільки TON прикріпити як газ до повідомлення; дефолт 0.08)
function env(key: string): string | undefined {
  return (process.env[key] ?? "").trim() || undefined;
}

export async function run(provider: NetworkProvider) {
  const sender = provider.sender();
  const owner = sender.address;

  if (!owner) {
    throw new Error(
      [
        "No sender address. Connect your OWNER wallet and try again.",
        "",
        "✅ FIX:",
        "Run the script again and choose: 'TON Connect compatible mobile wallet (example: Tonkeeper)'",
        "Do NOT choose 'Create a ton:// deep link'.",
      ].join("\n")
    );
  }

  const presale = provider.open(await Presale.fromAddress(PRESALE));

  const amountTon = env("AMOUNT_TON") ?? "1";
  const msgTon = env("MSG_TON") ?? "0.08";

  console.log("🏷️ Presale:", PRESALE.toString());
  console.log("👑 Sender/Owner:", owner.toString());
  console.log("💸 Withdraw amount:", amountTon, "TON");
  console.log("⛽ Message value:", msgTon, "TON");

  // Контракт відправляє TON на self.owner (тобто на owner-гаманець, який деплоїв/вказаний у контракті)
  await presale.send(
    sender,
    { value: toNano(msgTon) },
    { $$type: "Withdraw", amount: toNano(amountTon) } as any
  );

  console.log("✅ Withdraw message sent. Check tonscan for outgoing transfer to owner.");
}
