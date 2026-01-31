// src/components/PresaleProgress.tsx
import { Card } from "./Card";
import type { LangCode } from "../lib/i18n";
import { t } from "../lib/i18n";
import { ROUNDS_TOKENS } from "../lib/presale";

function safeNum(n: number): number {
  return Number.isFinite(n) ? n : 0;
}

function clamp01(x: number): number {
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

function fmt3(n: number): string {
  const x = safeNum(n);
  return x.toLocaleString(undefined, { maximumFractionDigits: 3 });
}

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
  const safeRound = Math.max(
    0,
    Math.min(safeNum(currentRound), ROUNDS_TOKENS.length - 1)
  );

  const roundCap = safeNum(ROUNDS_TOKENS[safeRound] ?? 0);
  const totalCap = ROUNDS_TOKENS.reduce((sum, x) => sum + safeNum(x ?? 0), 0);

  const sRound = Math.max(0, safeNum(soldInRound));
  const sTotal = Math.max(0, safeNum(soldTotal));

  const roundProgress = clamp01(roundCap > 0 ? sRound / roundCap : 0);
  const totalProgress = clamp01(totalCap > 0 ? sTotal / totalCap : 0);

  return (
    <Card>
      <div className="text-lg font-semibold">{t(lang, "presale_progress__1")}</div>
      <div className="mt-1 text-sm text-zinc-400">{t(lang, "presale_progress__2")}</div>

      {/* Important: This is GLOBAL presale statistics, not user's wallet balance */}
      <div className="mt-2 text-xs text-zinc-500">
        Global presale stats (not your wallet balance).
      </div>

      <div className="mt-5 space-y-6">
        {/* ===== TOTAL PRESALE (GLOBAL) ===== */}
        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">{t(lang, "presale_progress__total_presale")}</span>
            <span className="text-zinc-400">{Math.floor(totalProgress * 100)}%</span>
          </div>

          <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-white/25" style={{ width: `${totalProgress * 100}%` }} />
          </div>

          <div className="mt-3 text-xs text-zinc-400">
            <span className="text-white/90">{fmt3(sTotal)}</span> /{" "}
            {totalCap.toLocaleString()} MAGT
          </div>
        </div>

        {/* ===== ROUND (GLOBAL) ===== */}
        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">
              {t(lang, "presale_progress__3")} {safeRound + 1}
            </span>
            <span className="text-zinc-400">{Math.floor(roundProgress * 100)}%</span>
          </div>

          <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-white/25" style={{ width: `${roundProgress * 100}%` }} />
          </div>

          <div className="mt-3 text-xs text-zinc-400">
            {t(lang, "presale_progress__4")}{" "}
            <span className="text-white/90">{fmt3(sRound)}</span> /{" "}
            {roundCap.toLocaleString()} MAGT
          </div>

          {/* Explicit: NOT user's tokens */}
          <div className="mt-2 text-xs text-zinc-500">
            Total sold overall: <span className="text-white/90">{fmt3(sTotal)}</span> MAGT
          </div>
        </div>
      </div>
    </Card>
  );
}
