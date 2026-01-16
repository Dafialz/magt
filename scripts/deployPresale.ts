// scripts/deployPresale.ts
import { Address, toNano } from "@ton/core";
import { NetworkProvider } from "@ton/blueprint";
import { Presale } from "../build/Presale/Presale_Presale";

export async function run(provider: NetworkProvider) {
  const sender = provider.sender();
  const owner = sender.address;
  if (!owner) throw new Error("No sender address. Connect your wallet and try again.");

  // ✅ Jetton Minter (testnet)
  const jettonMinter = Address.parse("EQBxf0WPlKLvrQtgqawLe_vHsxfJ4GdNJbGvwVXPmpUIdOlx");

  // ✅ IMPORTANT: Presale init requires (owner, jettonMinter)
  const presale = provider.open(await Presale.fromInit(owner, jettonMinter));

  console.log("Deploying Presale...");
  await presale.send(
    sender,
    { value: toNano("0.08") },
    { $$type: "Deploy", queryId: 0n } as any
  );

  await provider.waitForDeploy(presale.address);

  console.log("✅ Deployed Presale at:", presale.address.toString());
  console.log("👑 Owner:", owner.toString());
  console.log("🪙 Jetton Minter:", jettonMinter.toString());
  console.log("➡️ NEXT: run setJettonWallet, then fundPresaleJettons, then sendTonToPresaleJettonWallet");
}
