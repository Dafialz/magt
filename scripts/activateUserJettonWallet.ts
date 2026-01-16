// scripts/activateUserJettonWallet.ts
import { Address, beginCell, toNano, TupleBuilder } from "@ton/core";
import { NetworkProvider } from "@ton/blueprint";
import { JETTON_MINTER } from "./addresses";

/*
  ENV:
    DEST=EQ...            (owner address of referral you want to activate)
    JETTON_TOKENS=1       (tokens to send, whole tokens)
    FORWARD_TON=0.5       (forward TON inside jetton transfer)
    JETTON_GAS=1.5        (TON sent to YOUR jetton wallet as gas)
    QUERY_ID=1            (optional)
    COMMENT="activate"    (optional)
*/

const OP_JETTON_TRANSFER = 0x0f8a7ea5;

function env(key: string): string | undefined {
  return (process.env[key] ?? "").trim() || undefined;
}

function toNanoJettons(tokens: string): bigint {
  const DEC = 1_000_000_000n;
  const s = (tokens ?? "0").trim();
  if (!s) return 0n;

  if (!s.includes(".")) return BigInt(s) * DEC;

  const [w, fRaw] = s.split(".");
  const frac = (fRaw ?? "").padEnd(9, "0").slice(0, 9);
  const whole = w && w !== "" ? BigInt(w) : 0n;
  const fracN = frac ? BigInt(frac) : 0n;
  return whole * DEC + fracN;
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
  return res.stack.readAddress(); // ✅ це працює у тебе (бо check.ts вже працює)
}

function buildForwardPayloadCell(text: string) {
  const comment = (text ?? "").trim();
  if (!comment) return beginCell().endCell();
  return beginCell().storeUint(0, 32).storeStringTail(comment).endCell();
}

export async function run(provider: NetworkProvider) {
  const sender = provider.sender();
  const myAddr = sender.address;

  if (!myAddr) {
    throw new Error(
      [
        "No sender address. Connect your wallet and try again.",
        "",
        "✅ FIX:",
        "Run again and choose TON Connect compatible wallet.",
        "Do NOT choose 'Create a ton:// deep link'.",
      ].join("\n")
    );
  }

  const destStr = env("DEST");
  if (!destStr) throw new Error("Missing ENV DEST=EQ... (destination OWNER address).");
  const destOwner = Address.parse(destStr);

  const jettonTokensStr = env("JETTON_TOKENS") ?? "1";
  const amountJettons = toNanoJettons(jettonTokensStr);
  if (amountJettons <= 0n) throw new Error("JETTON_TOKENS must be > 0");

  const forwardTonStr = env("FORWARD_TON") ?? "0.5";
  const jettonGasStr = env("JETTON_GAS") ?? "1.5";
  const queryIdStr = env("QUERY_ID") ?? "1";
  const comment = env("COMMENT") ?? "activate";

  const forwardTon = toNano(forwardTonStr);
  const jettonGas = toNano(jettonGasStr);
  const queryId = BigInt(queryIdStr);

  // ✅ get YOUR jetton wallet (owner = your wallet)
  const myJettonWallet = await getJettonWalletAddress(provider, JETTON_MINTER, myAddr);

  console.log("👤 Sender (your wallet):", myAddr.toString());
  console.log("🪙 Jetton Minter:", JETTON_MINTER.toString());
  console.log("✅ Your Jetton Wallet:", myJettonWallet.toString());
  console.log("");
  console.log("🎯 Destination OWNER:", destOwner.toString());
  console.log("➡️ Activate by JettonTransfer:");
  console.log("   JETTON_TOKENS:", jettonTokensStr);
  console.log("   FORWARD_TON:", forwardTonStr, "TON");
  console.log("   JETTON_GAS:", jettonGasStr, "TON");
  console.log("");

  const forwardPayloadCell = buildForwardPayloadCell(comment);

  // forward_payload = Either:
  //  1 + ref(cell)
  const body = beginCell()
    .storeUint(OP_JETTON_TRANSFER, 32)
    .storeUint(queryId, 64)
    .storeCoins(amountJettons)
    .storeAddress(destOwner) // destination OWNER
    .storeAddress(myAddr)    // response_destination
    .storeMaybeRef(null)     // custom_payload
    .storeCoins(forwardTon)  // forward_ton_amount
    .storeUint(1, 1)         // ✅ tag = 1 (ref)
    .storeRef(forwardPayloadCell)
    .endCell();

  console.log("📩 Sending JettonTransfer to YOUR Jetton Wallet (it forwards to DEST)...");

  await sender.send({
    to: myJettonWallet,
    value: jettonGas,
    body,
  });

  console.log("✅ Sent. Now check DEST wallet state:");
  console.log(`BUYER=${destOwner.toString()} ./node_modules/.bin/blueprint run check --testnet`);
}
