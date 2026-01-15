// src/components/PresaleProgress.tsx
import { Card } from "./Card";
import { ProgressBar } from "./ProgressBar";
import { getRoundPriceTon, ROUNDS_TOKENS } from "../lib/presale";
import type { LangCode } from "../lib/i18n";
import { t } from "../lib/i18n";

const TOTAL_PRESALE = 500_000_000;

export function PresaleProgress({
  lang,
  currentRound,
  soldTotal,
  soldInRound,
}: {
  lang: LangCode;
  currentRound: number;
  soldTotal: number;
  soldInRound: number;
}) {
  const safeRound = Math.max(0, Math.min(currentRound, ROUNDS_TOKENS.length - 1));
  const roundMax = ROUNDS_TOKENS[safeRound] ?? 0;

  const totalValue = Math.max(0, soldTotal);
  const roundValue = Math.max(0, soldInRound);

  const priceTon = getRoundPriceTon(safeRound);

  return (
    <Card>
      <div className="text-lg font-semibold">{t(lang, "progress__title")}</div>

      {/* TOTAL */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>{t(lang, "progress__total")}</span>
          <span className="text-zinc-400" />
        </div>

        <ProgressBar value={totalValue} max={TOTAL_PRESALE} />

        <div className="mt-1 text-xs text-zinc-400">
          {totalValue.toLocaleString()} / {TOTAL_PRESALE.toLocaleString()} MAGT
        </div>
      </div>

      {/* ROUND */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>
            {t(lang, "progress__round")} {safeRound + 1}
          </span>
          <span className="text-zinc-400">TON{priceTon.toFixed(6)} / MAGT</span>
        </div>

        <ProgressBar value={roundValue} max={roundMax} />

        <div className="mt-1 text-xs text-zinc-400">
          {roundValue.toLocaleString()} / {roundMax.toLocaleString()} MAGT
        </div>
      </div>
    </Card>
  );
}
