// scripts/setJettonWallet.ts
import { Address, TupleBuilder, toNano } from "@ton/core";
import { NetworkProvider } from "@ton/blueprint";
import { Presale } from "../build/Presale/Presale_Presale";
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

  // In TON Connect mode sender.address exists.
  // In "deep link" mode it might be null -> we stop early with a clear hint.
  const owner = sender.address;
  if (!owner) {
    throw new Error(
      [
        "No sender address. Connect your wallet and try again.",
        "",
        "✅ FIX:",
        "Run the script again and choose: 'TON Connect compatible mobile wallet (example: Tonkeeper)'",
        "Do NOT choose 'Create a ton:// deep link' for this project.",
      ].join("\n")
    );
  }

  const presale = provider.open(await Presale.fromAddress(PRESALE));

  // ✅ Presale Jetton Wallet owner MUST be the presale contract address
  const presaleJettonWallet = await getJettonWalletAddress(provider, JETTON_MINTER, PRESALE);

  console.log("👑 Sender/Owner:", owner.toString());
  console.log("🏷️ Presale:", PRESALE.toString());
  console.log("🪙 Jetton Minter:", JETTON_MINTER.toString());
  console.log("🏦 Presale Jetton Wallet (owner=Presale):", presaleJettonWallet.toString());

  console.log("\n➡️ Sending SetJettonWallet to Presale...");
  await presale.send(
    sender,
    { value: toNano("0.07") }, // a bit more gas for reliability
    { $$type: "SetJettonWallet", wallet: presaleJettonWallet } as any
  );

  console.log("✅ Sent SetJettonWallet. Confirm in your wallet (TESTNET).");
  console.log("ℹ️ Next: sendTonToPresaleJettonWallet -> fundPresaleJettons -> buy -> claim");
}
