import { useMemo, useState } from "react";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { beginCell, Address } from "@ton/core";
import { Card } from "./Card";
import { toNumberSafe } from "../lib/format";
import { safeValidUntil, toNanoTon } from "../lib/ton";
import { PRESALE_CONTRACT } from "../lib/config";
import type { LangCode } from "../lib/i18n";

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

/**
 * Buy opcode
 */
function buildBuyPayloadBase64(ref: Address) {
  const BUY_OPCODE = 0x42555901;
  const cell = beginCell().storeUint(BUY_OPCODE, 32).storeAddress(ref).endCell();
  return bytesToBase64(cell.toBoc({ idx: false }));
}

function getRefOrNull(self: Address): Address | null {
  try {
    const refParam = new URLSearchParams(window.location.search).get("ref");
    if (!refParam) return null;

    const ref = Address.parse(refParam);
    if (ref.equals(self)) return null;

    return ref;
  } catch {
    return null;
  }
}

type TxStatus = "idle" | "confirming" | "sent" | "error";

export function PresaleWidget({
  lang,
  onTxSent,
}: {
  lang: LangCode;
  onTxSent?: () => void;
}) {
  // ✅ keep prop for compatibility with App.tsx, but mark as used
  void lang;

  const addr = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();

  const [tonAmount, setTonAmount] = useState("1");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<TxStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const payload = useMemo(() => {
    if (!addr) return undefined;
    const self = Address.parse(addr);
    const ref = getRefOrNull(self);
    if (!ref) return undefined;
    return buildBuyPayloadBase64(ref);
  }, [addr]);

  const ton = toNumberSafe(tonAmount);
  const receiveMagt = ton > 0 ? ton : 0; // ⬅️ легко замінити формулу

  async function buyWithTon() {
    if (!addr) return;

    if (ton < 1) {
      setStatus("error");
      setErrorMsg("Minimum purchase is 1 TON");
      return;
    }

    setLoading(true);
    setStatus("confirming");
    setErrorMsg("");

    try {
      await tonConnectUI.sendTransaction({
        validUntil: safeValidUntil(5 * 60 - 10),
        messages: [
          {
            address: PRESALE_CONTRACT,
            amount: toNanoTon(ton),
            ...(payload ? { payload } : {}),
          },
        ],
      });

      setStatus("sent");
      onTxSent?.();
    } catch (e: any) {
      setStatus("error");
      setErrorMsg(e?.message ?? "Transaction failed");
    } finally {
      setLoading(false);
    }
  }

  const buttonText = !addr
    ? "Connect wallet"
    : loading
    ? "Processing..."
    : "Buy MAGT";

  return (
    <Card>
      {/* Header */}
      <div className="text-lg font-semibold">Buy MAGT</div>
      <div className="text-xs text-zinc-400">Pay in TON · Instant on-chain</div>

      {/* Input */}
      <div className="mt-4">
        <div className="mb-1 text-xs text-zinc-400">You pay (TON)</div>
        <input
          value={tonAmount}
          onChange={(e) => setTonAmount(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2"
          placeholder="1"
        />
      </div>

      {/* Receive */}
      <div className="mt-2 text-sm text-zinc-300">
        You receive (MAGT):{" "}
        <span className="font-semibold">{receiveMagt.toFixed(3)}</span>
      </div>

      {/* Button */}
      <button
        disabled={loading}
        onClick={buyWithTon}
        className="mt-4 h-10 w-full rounded-xl border border-white/10 bg-white/5
                   hover:bg-white/10 disabled:opacity-60"
      >
        {buttonText}
      </button>

      {/* Status alerts */}
      {status === "confirming" && (
        <div className="mt-3 rounded-lg bg-yellow-500/10 px-3 py-2 text-xs text-yellow-300">
          ⏳ Confirming transaction…
        </div>
      )}

      {status === "sent" && (
        <div className="mt-3 rounded-lg bg-green-500/10 px-3 py-2 text-xs text-green-300">
          ✅ Transaction sent
        </div>
      )}

      {status === "error" && (
        <div className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">
          ❌ Failed: {errorMsg}{" "}
          <button onClick={() => setStatus("idle")} className="ml-1 underline">
            Try again
          </button>
        </div>
      )}
    </Card>
  );
}
