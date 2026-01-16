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
 * BUY message MUST match presale.tact:
 * message(0x42555901) Buy { ref: Address; }
 */
function buildBuyPayloadBase64(refAddr: Address): string {
  const BUY_OPCODE = 0x42555901;

  const cell = beginCell()
    .storeUint(BUY_OPCODE, 32)
    .storeAddress(refAddr)
    .endCell();

  return bytesToBase64(cell.toBoc({ idx: false }));
}

function getRefAddressOrNull(): Address | null {
  try {
    const ref = new URLSearchParams(window.location.search).get("ref");
    return ref ? Address.parse(ref) : null;
  } catch {
    return null;
  }
}

/** дозволяє тільки число з '.' і максимум 4 знаки після крапки */
function sanitizeTonInput(raw: string, decimals = 4): string {
  const v = raw.replace(",", ".");
  if (v === "") return "";
  if (!/^\d*\.?\d*$/.test(v)) return v.replace(/[^\d.]/g, "");
  const [intPart, fracPart] = v.split(".");
  if (typeof fracPart === "string") {
    return `${intPart}.${fracPart.slice(0, decimals)}`;
  }
  return intPart;
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

  // ✅ КЛЮЧОВИЙ ФІКС:
  // якщо ref не заданий АБО ref == self -> шлемо plain TON (без payload), як у твоєму CLI buy.ts
  const { payload, refLabel } = useMemo(() => {
    try {
      if (!addr) return { payload: undefined as string | undefined, refLabel: "(none)" };
      const self = Address.parse(addr);
      const ref = getRefAddressOrNull();

      if (!ref || ref.equals(self)) {
        return { payload: undefined, refLabel: "(none)" };
      }

      return { payload: buildBuyPayloadBase64(ref), refLabel: ref.toString() };
    } catch {
      return { payload: undefined, refLabel: "(none)" };
    }
  }, [addr]);

  async function buyWithTon() {
    if (!addr) return setMsg(t(lang, "presale_widget__10"));

    const ton = toNumberSafe(tonAmount);
    if (ton <= 0) return setMsg(t(lang, "presale_widget__11"));

    setLoading(true);
    setMsg("");

    try {
      await tonConnectUI.sendTransaction({
        // <= 5 хв (TonConnect warning не буде)
        validUntil: safeValidUntil(5 * 60 - 10),
        messages: [
          {
            address: PRESALE_CONTRACT,
            amount: toNanoTon(ton),
            ...(payload ? { payload } : {}), // ✅ якщо payload нема — буде plain TON
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

  return (
    <Card>
      <div className="text-lg font-semibold">{t(lang, "presale_widget__1")}</div>
      <div className="mt-1 text-sm text-zinc-400">
        {t(lang, "presale_widget__2")}
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-md">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>{t(lang, "presale_widget__3")}</span>
          <span className="text-[11px] text-zinc-400">
            REF: {refLabel === "(none)" ? "—" : "✅"}
          </span>
        </div>

        <label className="mt-3 block text-xs font-semibold text-emerald-400">
          REF BONUS +5%
        </label>

        <input
          value={tonAmount}
          onChange={(e) => setTonAmount(sanitizeTonInput(e.target.value, 4))}
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2
                     outline-none focus:border-white/20 focus:bg-black/45"
          inputMode="decimal"
          placeholder="1"
        />

        <button
          disabled={loading || !addr}
          onClick={buyWithTon}
          className="mt-4 h-10 w-full rounded-xl border border-white/10 bg-white/5
                     text-sm font-semibold hover:bg-white/10 disabled:opacity-60"
          title={!addr ? t(lang, "presale_widget__9") : undefined}
        >
          {loading
            ? t(lang, "presale_widget__6")
            : addr
            ? t(lang, "presale_widget__7")
            : t(lang, "presale_widget__8")}
        </button>

        {msg ? <div className="mt-3 text-xs text-zinc-300">{msg}</div> : null}
      </div>

      <div className="mt-5 break-all text-xs text-zinc-500">
        {t(lang, "presale_widget__15")} {PRESALE_CONTRACT}
      </div>
    </Card>
  );
}
