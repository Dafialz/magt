import React from "react";
import { Card } from "./Card";
import { toNumberSafe } from "../lib/format";
import { getRoundPriceTon } from "../lib/presale"; // ❗ єдине джерело
import type { LangCode } from "../lib/i18n";
import { t } from "../lib/i18n";

/**
 * Дозволяє вводити:
 *  - "0"
 *  - "0."
 *  - "0.0"
 *  - "0.0000"
 */
function sanitizeDecimal(raw: string, maxDecimals: number): string {
  let v = raw.replace(",", ".");

  // тільки цифри і крапка
  v = v.replace(/[^\d.]/g, "");

  // тільки одна крапка
  const firstDot = v.indexOf(".");
  if (firstDot !== -1) {
    const before = v.slice(0, firstDot + 1);
    const after = v.slice(firstDot + 1).replace(/\./g, "");
    v = before + after;
  }

  // обрізаємо decimals, але НЕ чіпаємо "0."
  const [i, f] = v.split(".");
  if (f !== undefined) {
    return `${i}.${f.slice(0, maxDecimals)}`;
  }

  return v;
}

export function TonToMagtCalculator({
  lang,
  currentRound,
}: {
  lang: LangCode;
  currentRound: number;
}) {
  // YOU PAY
  const [ton, setTon] = React.useState("50");

  // PRICE PER MAGT
  const [customPrice, setCustomPrice] = React.useState("");

  const tonNum = Math.max(0, toNumberSafe(ton));

  // ✅ ЦІНА З КОНТРАКТУ (1 в 1 як presale.tact)
  const roundPrice = getRoundPriceTon(currentRound);

  const customNum = toNumberSafe(customPrice);
  const price = customPrice !== "" && customNum > 0 ? customNum : roundPrice;

  const magt = price > 0 ? tonNum / price : 0;

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold">
            {t(lang, "calc__title")}
          </div>
          <div className="mt-1 text-sm text-zinc-400">
            {t(lang, "calc__subtitle")}
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-zinc-400">Round price</div>
          <div className="text-sm font-semibold">
            TON{roundPrice.toFixed(6)} / MAGT
          </div>
        </div>
      </div>

      {/* PAY / PRICE / RECEIVE */}
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {/* YOU PAY */}
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-md">
          <div className="text-xs text-zinc-400">You pay</div>
          <div className="mt-1 text-sm font-semibold">TON</div>

          <input
            value={ton}
            onChange={(e) => setTon(sanitizeDecimal(e.target.value, 2))}
            className="mt-3 w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 outline-none"
            placeholder="0.00"
            inputMode="decimal"
          />

          <div className="mt-3 flex gap-2">
            <QuickBtn onClick={() => setTon("50")}>50</QuickBtn>
            <QuickBtn onClick={() => setTon("100")}>100</QuickBtn>
            <QuickBtn onClick={() => setTon("250")}>250</QuickBtn>
            <QuickBtn onClick={() => setTon("500")}>500</QuickBtn>
          </div>
        </div>

        {/* PRICE */}
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-md">
          <div className="text-xs text-zinc-400">Price per MAGT</div>
          <div className="mt-1 text-sm font-semibold">TON / MAGT</div>

          <input
            value={customPrice}
            onChange={(e) => setCustomPrice(sanitizeDecimal(e.target.value, 4))}
            className="mt-3 w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 outline-none"
            placeholder="0.0000"
            inputMode="decimal"
          />

          <button
            type="button"
            onClick={() => setCustomPrice("")}
            className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-semibold"
          >
            Use round price
          </button>
        </div>

        {/* YOU RECEIVE */}
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-md">
          <div className="text-xs text-zinc-400">You receive</div>
          <div className="mt-1 text-sm font-semibold">MAGT</div>
          <div className="mt-3 text-2xl font-semibold">
            {formatBig(magt)}
          </div>
        </div>
      </div>
    </Card>
  );
}

function QuickBtn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs"
    >
      {children}
    </button>
  );
}

function formatBig(n: number) {
  if (!Number.isFinite(n)) return "0";
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
  }).format(n);
}
