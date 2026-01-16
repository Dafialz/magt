// scripts/withdrawPresaleJettons.ts
import { Address, beginCell, toNano } from "@ton/core";
import type { NetworkProvider } from "@ton/blueprint";

/**
 * Env:
 *  - JETTON_WALLET   (required) buyer jetton wallet address (from `check`)
 *  - PRESALE        (required) presale contract address
 *  - AMOUNT_JETTON  (required) amount in tokens (supports decimals up to 9)
 *  - GAS_TON        (optional) default 0.2
 *
 * Example:
 *  JETTON_WALLET=EQBryVra...
 *  PRESALE=EQB5YKJx...
 *  AMOUNT_JETTON=424902087.912089819
 *  GAS_TON=0.5
 */
const OP_JETTON_TRANSFER = 0xf8a7ea5; // standard jetton transfer op

function parseJettonToNano(amount: string, decimals = 9): bigint {
  const s = amount.trim();
  if (!s) throw new Error("AMOUNT_JETTON is empty");

  const [wholeRaw, fracRaw = ""] = s.split(".");
  const whole = wholeRaw === "" ? "0" : wholeRaw;
  const frac = (fracRaw + "0".repeat(decimals)).slice(0, decimals);

  if (!/^\d+$/.test(whole) || !/^\d+$/.test(frac)) {
    throw new Error(`Invalid AMOUNT_JETTON: ${amount}`);
  }

  return BigInt(whole) * 10n ** BigInt(decimals) + BigInt(frac);
}

export async function run(provider: NetworkProvider) {
  const jettonWalletStr = process.env.JETTON_WALLET;
  const presaleStr = process.env.PRESALE;
  const amountStr = process.env.AMOUNT_JETTON;
  const gasStr = process.env.GAS_TON ?? "0.2";

  if (!jettonWalletStr) throw new Error("Missing env JETTON_WALLET");
  if (!presaleStr) throw new Error("Missing env PRESALE");
  if (!amountStr) throw new Error("Missing env AMOUNT_JETTON");

  const jettonWallet = Address.parse(jettonWalletStr);
  const presale = Address.parse(presaleStr);

  const sender = provider.sender();
  const responseDest = sender.address ?? presale; // fallback, but normally sender.address is present

  const amountNano = parseJettonToNano(amountStr, 9);
  const gas = toNano(gasStr);

  // Jetton transfer message body
  const body = beginCell()
    .storeUint(OP_JETTON_TRANSFER, 32)
    .storeUint(BigInt(Date.now()), 64) // query_id
    .storeCoins(amountNano)            // jetton amount (nano)
    .storeAddress(presale)             // destination OWNER address (presale contract)
    .storeAddress(responseDest)        // response destination
    .storeMaybeRef(null)               // custom_payload
    .storeCoins(0)                     // forward_ton_amount
    .storeUint(0, 1)                   // forward_payload: 0 = inline
    .endCell();

  // Send internal msg to YOUR jetton wallet to execute transfer
  await sender.send({
    to: jettonWallet,
    value: gas,
    bounce: true,
    body,
  });

  provider.ui().write(`✅ Sent jetton transfer to Presale owner.`);
  provider.ui().write(`   from JettonWallet: ${jettonWallet.toString()}`);
  provider.ui().write(`   to Presale:        ${presale.toString()}`);
  provider.ui().write(`   amount (nano):     ${amountNano.toString()}`);
}
