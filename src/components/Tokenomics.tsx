// src/components/Tokenomics.tsx
import { Card } from "./Card";
import type { LangCode } from "../lib/i18n";
import { t } from "../lib/i18n";

const TOTAL = 10_000_000_000;

const rows = [
  { key: "presale", pct: 5.25 },
  { key: "liquidity", pct: 2.5 },
  { key: "team", pct: 1.25, suffixKey: "tokenomics__locked_suffix" }, // "(locked)" translation
  { key: "marketing", pct: 5.0 },
  { key: "other", pct: 81.0 },
] as const;

export function Tokenomics({ lang }: { lang: LangCode }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-semibold">
            {t(lang, "tokenomics_title")}
          </div>

          <div className="mt-1 text-sm text-zinc-400">
            {t(lang, "total_supply")}:{" "}
            <span className="text-zinc-200 font-semibold">
              {TOTAL.toLocaleString()} MAGT
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {rows.map((r) => {
          const base = t(lang, r.key);
          const suffix =
            "suffixKey" in r && r.suffixKey ? ` ${t(lang, r.suffixKey)}` : "";
          const label = `${base}${suffix}`;

          return (
            <div
              key={r.key}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4"
            >
              <div className="mb-2 flex items-center justify-between text-sm">
                <div className="font-semibold">{label}</div>
                <div className="text-zinc-400">{r.pct}%</div>
              </div>

              <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
                  style={{ width: `${Math.min(100, r.pct)}%` }}
                />
              </div>

              <div className="mt-2 text-xs text-zinc-400">
                ≈ {Math.floor((TOTAL * r.pct) / 100).toLocaleString()} MAGT
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
