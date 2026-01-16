// scripts/sendTonToPresaleJettonWallet.ts
import { Address, TupleBuilder, toNano } from "@ton/core";
import { NetworkProvider } from "@ton/blueprint";
import { PRESALE, JETTON_MINTER } from "./addresses";

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

export async function run(provider: NetworkProvider) {
  const sender = provider.sender();
  const owner = sender.address;

  if (!owner) {
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

  const presaleJettonWallet = await getJettonWalletAddress(provider, JETTON_MINTER, PRESALE);

  const tonGas = process.env.TON_GAS ?? "0.5"; // default 0.5 TON
  const value = toNano(tonGas);

  console.log("👤 From:", owner.toString());
  console.log("🏷️ Presale:", PRESALE.toString());
  console.log("🪙 Jetton Minter:", JETTON_MINTER.toString());
  console.log("🏦 Presale Jetton Wallet:", presaleJettonWallet.toString());
  console.log("⛽ Sending TON for gas:", tonGas, "TON");

  await sender.send({
    to: presaleJettonWallet,
    value,
    bounce: false, // safer for activation/top-up
  });

  console.log("✅ TON sent to Presale Jetton Wallet");
  console.log("➡️ Next: blueprint run fundPresaleJettons --testnet");
  console.log("ℹ️ Tip: you can change amount: TON_GAS=0.3 blueprint run sendTonToPresaleJettonWallet --testnet");
}
