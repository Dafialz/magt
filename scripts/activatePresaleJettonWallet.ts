// scripts/activatePresaleJettonWallet.ts
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
    // only integer strings for jettons
    if (s.includes(".") || s.includes(",")) return fallback;
    return BigInt(s);
  } catch {
    return fallback;
  }
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

export async function run(provider: NetworkProvider) {
  const sender = provider.sender();
  const owner = sender.address;
  if (!owner) throw new Error("No sender address. Connect your wallet and try again.");

  // ===== params =====
  const JETTON_TOKENS = env("JETTON_TOKENS") ?? "1";

  // forward_ton_amount inside JettonTransfer (goes to destination side)
  // For MyTonWallet usually 0.3–0.8
  const FORWARD_TON = env("FORWARD_TON") ?? "0.5";

  // TON attached to message to YOUR jetton wallet (covers fees)
  // For MyTonWallet usually 1.2–2.0
  const JETTON_GAS = env("JETTON_GAS") ?? "1.5";

  // Destination OWNER address (IMPORTANT: owner, not jetton wallet)
  const destOwner = env("DEST") ? Address.parse(env("DEST")!) : PRESALE;

  // ===== derived =====
  const myJettonWallet = await getJettonWalletAddress(provider, JETTON_MINTER, owner);
  const destJettonWallet = await getJettonWalletAddress(provider, JETTON_MINTER, destOwner);

  const amountNano = bigIntFromIntString(JETTON_TOKENS, 1n) * JETTON_DECIMALS;

  console.log("👤 Owner (your wallet):", owner.toString());
  console.log("🪙 Jetton Minter:", JETTON_MINTER.toString());
  console.log("✅ Your Jetton Wallet:", myJettonWallet.toString());
  console.log("");

  console.log("🎯 Destination OWNER:", destOwner.toString());
  console.log("🏦 Destination Jetton Wallet (computed):", destJettonWallet.toString());
  console.log("");

  console.log("➡️ Activate by JettonTransfer (no pre-fund step):");
  console.log("   JETTON_TOKENS:", JETTON_TOKENS);
  console.log("   FORWARD_TON:", FORWARD_TON, "TON");
  console.log("   JETTON_GAS:", JETTON_GAS, "TON");
  console.log("");
  console.log("🔎 Tonscan search tips:");
  console.log("   1) search YOUR jetton wallet address (outgoing internal transfer):");
  console.log("      ", myJettonWallet.toString());
  console.log("   2) also search destination jetton wallet address:");
  console.log("      ", destJettonWallet.toString());
  console.log("");

  const queryId = BigInt(Math.floor(Date.now() / 1000));
  const emptyForwardPayload = beginCell().endCell();

  // ✅ TEP-74: forward_payload is Either Cell ^Cell
  // MUST store 1-bit tag first:
  // 1 => payload is in ref
  const body = beginCell()
    .storeUint(OP_JETTON_TRANSFER, 32)
    .storeUint(queryId, 64)
    .storeCoins(amountNano)
    .storeAddress(destOwner) // destination = OWNER address
    .storeAddress(owner) // response_destination
    .storeMaybeRef(null) // custom_payload
    .storeCoins(toNano(FORWARD_TON)) // forward_ton_amount > 0
    .storeBit(true) // ✅ Either: 1 => ref follows
    .storeRef(emptyForwardPayload) // ✅ forward_payload ref
    .endCell();

  await sender.send({
    to: myJettonWallet,
    value: toNano(JETTON_GAS),
    body,
  });

  console.log("✅ Sent JettonTransfer for activation.");
  console.log("➡️ Next: ./node_modules/.bin/blueprint run check --testnet");
  console.log("ℹ️ If still uninit: try FORWARD_TON=0.7 and JETTON_GAS=1.8");
}
