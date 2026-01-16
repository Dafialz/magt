// scripts/fundPresaleJettons.ts
import { Address, beginCell, TupleBuilder, toNano } from "@ton/core";
import { NetworkProvider } from "@ton/blueprint";
import { PRESALE, JETTON_MINTER } from "./addresses";

// Jetton transfer op (TEP-74)
const OP_JETTON_TRANSFER = 0x0f8a7ea5;

// 9 decimals
const JETTON_DECIMALS = 1_000_000_000n;

function env(key: string): string | undefined {
  return (process.env[key] ?? "").trim() || undefined;
}

function bigIntFromIntString(v: string | undefined, fallback: bigint): bigint {
  try {
    if (!v) return fallback;
    const s = v.trim();
    if (!s) return fallback;
    if (s.includes(".") || s.includes(",")) return fallback;
    return BigInt(s);
  } catch {
    return fallback;
  }
}

async function getJettonWalletAddress(provider: NetworkProvider, minter: Address, owner: Address): Promise<Address> {
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

  // How many whole jettons to send
  const AMOUNT_TOKENS = env("JETTON_TOKENS") ?? "1";
  const amountNano = bigIntFromIntString(AMOUNT_TOKENS, 1n) * JETTON_DECIMALS;

  // TON attached to message to YOUR jetton wallet (covers fees)
  const gasTon = toNano(env("JETTON_GAS") ?? "0.8");

  // TON forwarded to destination jetton wallet (critical if destination wallet is uninit)
  const forwardTonStr = env("FORWARD_TON") ?? "0.2";
  const forwardTon = toNano(forwardTonStr);

  // Destination OWNER address (not jetton wallet)
  const destOwner = env("DEST") ? Address.parse(env("DEST")!) : PRESALE;

  const myJettonWallet = await getJettonWalletAddress(provider, JETTON_MINTER, owner);
  const destJettonWallet = await getJettonWalletAddress(provider, JETTON_MINTER, destOwner);

  console.log("👤 Sender (your wallet):", owner.toString());
  console.log("🪙 Jetton Minter:", JETTON_MINTER.toString());
  console.log("✅ Your Jetton Wallet:", myJettonWallet.toString());
  console.log("");

  console.log("🎯 Destination OWNER (MUST be owner address):", destOwner.toString());
  console.log("🏦 Destination Jetton Wallet (computed):", destJettonWallet.toString());
  console.log("➡️ Funding:", AMOUNT_TOKENS, "jettons");
  console.log("⛽ JETTON_GAS:", gasTon.toString(), "nanoTON");
  console.log("📦 FORWARD_TON:", forwardTon.toString(), "nanoTON");
  console.log("");

  const emptyForwardPayload = beginCell().endCell();
  const queryId = BigInt(Math.floor(Date.now() / 1000));

  // ✅ TEP-74: forward_payload is Either Cell ^Cell, must write 1-bit tag before ref
  const body = beginCell()
    .storeUint(OP_JETTON_TRANSFER, 32)
    .storeUint(queryId, 64)
    .storeCoins(amountNano)
    .storeAddress(destOwner) // destination = OWNER address
    .storeAddress(owner) // response_destination
    .storeMaybeRef(null) // custom_payload
    .storeCoins(forwardTon) // forward_ton_amount
    .storeBit(true) // ✅ Either: 1 => ref
    .storeRef(emptyForwardPayload) // ✅ forward_payload ref
    .endCell();

  await sender.send({
    to: myJettonWallet,
    value: gasTon,
    body,
  });

  console.log("✅ Sent JettonTransfer (funding). Confirm in your wallet (TESTNET).");
  console.log("➡️ Next: ./node_modules/.bin/blueprint run check --testnet");
  console.log(
    "ℹ️ Examples:\n" +
      "  JETTON_TOKENS=1 FORWARD_TON=0.2 JETTON_GAS=1.2 ./node_modules/.bin/blueprint run fundPresaleJettons --testnet\n" +
      "  JETTON_TOKENS=1 FORWARD_TON=0.7 JETTON_GAS=1.8 ./node_modules/.bin/blueprint run activatePresaleJettonWallet --testnet"
  );
}
