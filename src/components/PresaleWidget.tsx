// src/components/PresaleWidget.tsx
import { useMemo, useState } from "react";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { beginCell, Address } from "@ton/core";
import { Card } from "./Card";
import { toNumberSafe } from "../lib/format";
import { safeValidUntil, toNanoTon } from "../lib/ton";
import { PRESALE_CONTRACT } from "../lib/config";
import type { LangCode } from "../lib/i18n";
import { t } from "../lib/i18n";

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

/**
 * ✅ Contract expects:
 * message(0x42555901) Buy { ref: Address?; }
 *
 * ref = Address? is encoded as MaybeAddress in TON:
 * - addr_none (00) => null
 * - addr_std  (10) => internal address
 *
 * ✅ Therefore: DO NOT add an extra boolean bit.
 *
 * Якщо ref НЕ заданий — краще відправити пустий body (receive()),
 * щоб контракт викликав processBuy(null).
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

    return ref; // валідний реферал
  } catch {
    return null;
  }
}

export function PresaleWidget({
  lang,
  onTxSent,
}: {
  lang: LangCode;
  onTxSent?: () => void;
}) {
  const addr = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();

  const [tonAmount, setTonAmount] = useState("1");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const payload = useMemo(() => {
    if (!addr) return undefined;
    const self = Address.parse(addr);
    const ref = getRefOrNull(self);

    // якщо ref нема — payload не треба (спрацює receive())
    if (!ref) return undefined;

    return buildBuyPayloadBase64(ref);
  }, [addr]);

  async function buyWithTon() {
    if (!addr) return setMsg(t(lang, "presale_widget__10"));

    const ton = toNumberSafe(tonAmount);
    if (ton <= 0) return setMsg(t(lang, "presale_widget__11"));

    setLoading(true);
    setMsg("");

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

      setMsg(t(lang, "presale_widget__13"));
      onTxSent?.();
    } catch (e: any) {
      setMsg(e?.message ?? t(lang, "presale_widget__14"));
    } finally {
      setLoading(false);
    }
  }

  const canBuy = !!addr && !loading;

  return (
    <Card>
      <div className="text-lg font-semibold">{t(lang, "presale_widget__1")}</div>

      <input
        value={tonAmount}
        onChange={(e) => setTonAmount(e.target.value)}
        className="mt-3 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2"
        placeholder="1"
      />

      <button
        disabled={!canBuy}
        onClick={buyWithTon}
        className="mt-4 h-10 w-full rounded-xl border border-white/10 bg-white/5 disabled:opacity-60"
      >
        {loading ? "Processing..." : "Buy MAGT"}
      </button>

      {msg && <div className="mt-2 text-xs text-zinc-400">{msg}</div>}
    </Card>
  );
}
