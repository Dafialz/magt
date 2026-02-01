import { useMemo, useState } from "react";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { beginCell, Address } from "@ton/core";
import { Card } from "./Card";
import { safeValidUntil, toNanoTon, sanitizeTonInput, tonStringToNumber } from "../lib/ton";
import { PRESALE_CONTRACT } from "../lib/config";
import type { LangCode } from "../lib/i18n";
import { t } from "../lib/i18n";
import { getRoundPriceTon } from "../lib/presale";

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

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
  currentRound,
  onTxSent,
}: {
  lang: LangCode;
  currentRound: number;
  onTxSent?: () => void;
}) {
  const addr = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();

  // ✅ keep as string (never buy from number)
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

  // ✅ normalize user input
  const tonAmountSanitized = useMemo(() => sanitizeTonInput(tonAmount), [tonAmount]);

  // ✅ for UI estimate ONLY
  const ton = useMemo(() => tonStringToNumber(tonAmountSanitized), [tonAmountSanitized]);

  // NOTE: this is an ESTIMATE for the current round price; final amount is calculated, on-chain.
  const roundPrice = getRoundPriceTon(currentRound);
  const receiveMagt = roundPrice > 0 ? ton / roundPrice : 0;

  async function buyWithTon() {
    if (!addr) return;

    // ✅ enforce min buy based on sanitized string number
    if (ton < 1) {
      setStatus("error");
      setErrorMsg(t(lang, "buy__min_error"));
      return;
    }

    // ✅ CRITICAL: send exact nanoTON derived from STRING (not number)
    const nano = toNanoTon(tonAmountSanitized);

    // Extra safety: if conversion failed, block tx
    if (!nano || nano === "0") {
      setStatus("error");
      setErrorMsg("Invalid TON amount");
      return;
    }

    // Extra safety: protect from accidental huge amounts
    // (You can adjust this cap; it prevents “oops, sent 1000 TON”.)
    if (ton > 100) {
      const ok = window.confirm(`You are about to send ${tonAmountSanitized} TON. Continue?`);
      if (!ok) return;
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
            amount: nano,
            ...(payload ? { payload } : {}),
          },
        ],
      });

      setStatus("sent");
      onTxSent?.();
    } catch (e: any) {
      setStatus("error");
      setErrorMsg(e?.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <div className="text-lg font-semibold">{t(lang, "buy__title")}</div>
      <div className="text-xs text-zinc-400">{t(lang, "buy__subtitle")}</div>

      <div className="mt-4">
        <div className="mb-1 text-xs text-zinc-400">{t(lang, "buy__pay_label")}</div>
        <input
          value={tonAmount}
          onChange={(e) => setTonAmount(sanitizeTonInput(e.target.value))}
          className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2"
          placeholder="1"
          inputMode="decimal"
        />
      </div>

      <div className="mt-2 text-sm text-zinc-300">
        {t(lang, "buy__receive_label")}:{" "}
        <span className="font-semibold">{receiveMagt.toFixed(2)}</span>
      </div>

      <div className="mt-1 text-xs text-zinc-500">
        Round {currentRound + 1} · price ≈ {roundPrice.toFixed(6)} TON / MAGT
      </div>

      {status === "error" && errorMsg ? (
        <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-xs text-red-200">
          {errorMsg}
        </div>
      ) : null}

      {status === "sent" ? (
        <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2 text-xs text-emerald-200">
          Sent ✅
        </div>
      ) : null}

      <button
        disabled={loading}
        onClick={buyWithTon}
        className="mt-4 h-10 w-full rounded-xl border border-white/10 bg-white/5
                   hover:bg-white/10 disabled:opacity-60"
      >
        {loading ? t(lang, "buy__confirming") : t(lang, "buy__button")}
      </button>
    </Card>
  );
}
