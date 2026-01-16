// scripts/buy.ts
import { Address, beginCell, toNano } from "@ton/core";
import { NetworkProvider } from "@ton/blueprint";
import { Presale } from "../build/Presale/Presale_Presale";
import { PRESALE } from "./addresses";

// MUST match presale.tact: message(0x42555901) Buy { ref: Address; }
const OP_BUY = 0x42555901;

// ENV:
//  AMOUNT_TON=1.5 (скільки TON витратити)  <-- рекомендовано (твій стиль запуску)
//  TON=1.5        (старий варіант теж підтримується)
//  REF=EQ...      (реферал, опціонально)
//  SENDER=EQ...   (ВАЖЛИВО для "Create a ton:// deep link", бо там нема sender.address)
function env(key: string): string | undefined {
  return (process.env[key] ?? "").trim() || undefined;
}

export async function run(provider: NetworkProvider) {
  const sender = provider.sender();

  // In TON Connect mode, sender.address exists.
  // In deep-link mode, it can be undefined -> allow passing via SENDER env.
  const buyer =
    sender.address ??
    (env("SENDER") ? Address.parse(env("SENDER") as string) : undefined);

  if (!buyer) {
    throw new Error(
      [
        "No sender address.",
        "",
        "✅ FIX (choose one):",
        "1) TON Connect mode: rerun and choose 'TON Connect compatible mobile wallet' (MyTonWallet is OK).",
        "2) Deep link mode: provide your wallet address:",
        "   SENDER=EQ... AMOUNT_TON=1 ./node_modules/.bin/blueprint run buy --testnet",
      ].join("\n")
    );
  }

  const presale = provider.open(await Presale.fromAddress(PRESALE));

  // Support both env names:
  const tonToSpend = env("AMOUNT_TON") ?? env("TON") ?? "1";

  // Optional referral
  const refStr = env("REF");
  const ref = refStr ? Address.parse(refStr) : null;

  console.log("🏷️ Presale:", PRESALE.toString());
  console.log("👤 Buyer:", buyer.toString());
  console.log("🛒 Buying with:", tonToSpend, "TON");

  // If ref is not set OR equals buyer -> send plain TON (receive()).
  if (!ref || ref.equals(buyer)) {
    console.log("🤝 Ref: (none)");
    await presale.send(sender, { value: toNano(tonToSpend) }, null as any);
    console.log("✅ Buy sent (plain TON).");
    console.log("➡️ Next: blueprint run check --testnet");
    console.log("➡️ Then: blueprint run claim --testnet");
    return;
  }

  // Manual payload with fixed opcode to avoid bindings/id drift
  console.log("🤝 Ref:", ref.toString());

  const body = beginCell().storeUint(OP_BUY, 32).storeAddress(ref).endCell();

  await sender.send({
    to: PRESALE,
    value: toNano(tonToSpend),
    body,
  });

  console.log("✅ Buy sent (opcode Buy).");
  console.log("➡️ Next: blueprint run check --testnet");
  console.log("➡️ Then: blueprint run claim --testnet");
}
