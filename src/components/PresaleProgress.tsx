// src/components/PresaleProgress.tsx
import { Card } from "./Card";
import type { LangCode } from "../lib/i18n";
import { t } from "../lib/i18n";
import { ROUNDS_TOKENS } from "../lib/presale";

export function PresaleProgress({
  lang,
  currentRound,
  soldInRound,
  soldTotal,
}: {
  lang: LangCode;
  currentRound: number;
  soldInRound: number;
  soldTotal: number;
}) {
  const roundCap =
    ROUNDS_TOKENS[Math.max(0, Math.min(currentRound, ROUNDS_TOKENS.length - 1))] ??
    0;
  const progress = roundCap > 0 ? Math.min(1, Math.max(0, soldInRound / roundCap)) : 0;

  return (
    <Card>
      <div className="text-lg font-semibold">{t(lang, "presale_progress__1")}</div>
      <div className="mt-1 text-sm text-zinc-400">{t(lang, "presale_progress__2")}</div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">
            {t(lang, "presale_progress__3")} {currentRound + 1}
          </span>
          <span className="text-zinc-400">{Math.floor(progress * 100)}%</span>
        </div>

        <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-white/25" style={{ width: `${progress * 100}%` }} />
        </div>

        <div className="mt-3 text-xs text-zinc-400">
          {t(lang, "presale_progress__4")}{" "}
          <span className="text-white/90">{soldInRound.toFixed(3)}</span> /{" "}
          {roundCap.toLocaleString()} MAGT
        </div>

        <div className="mt-2 text-xs text-zinc-500">
          {t(lang, "presale_progress__5")}{" "}
          <span className="text-white/90">{soldTotal.toFixed(3)}</span>
        </div>
      </div>
    </Card>
  );
}
