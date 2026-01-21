// src/components/ProjectsSection.tsx
import { Card } from "./Card";
import type { LangCode } from "../lib/i18n";
import { t } from "../lib/i18n";

const MILESTONES = [
  { label: "10,000$", value: 10_000 },
  { label: "500,000$", value: 500_000 },
  { label: "5,000,000$", value: 5_000_000 },
  { label: "15,000,000$", value: 15_000_000 },
] as const;

// 🔒 unlock threshold for first project
const PROJECT_1_UNLOCK_USD = 10_000;

export function ProjectsSection({
  lang,
  raisedUsd,
}: {
  lang: LangCode;
  raisedUsd: number;
}) {
  const progressPct = milestoneProgressPercent(raisedUsd);

  const project1Unlocked = raisedUsd >= PROJECT_1_UNLOCK_USD;

  return (
    <Card>
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-lg font-semibold">
            {t(lang, "projects__title")}
          </div>
          <div className="mt-1 text-sm text-zinc-400">
            {t(lang, "projects__subtitle")}
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-zinc-400">
            {t(lang, "projects__raised")}
          </div>
          <div className="text-sm font-semibold">
            ${formatMoney(raisedUsd)}
          </div>
        </div>
      </div>

      {/* MILESTONES */}
      <div className="mt-5">
        <div className="grid grid-cols-4 gap-2 text-center text-xs text-zinc-300">
          {MILESTONES.map((m) => (
            <div
              key={m.value}
              className="rounded-xl border border-zinc-800 bg-zinc-950/40 py-2"
            >
              {m.label}
            </div>
          ))}
        </div>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-[width] duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="mt-2 flex justify-between text-[11px] text-zinc-500">
          <span>{t(lang, "projects__seg_seed")}</span>
          <span>{t(lang, "projects__seg_grow")}</span>
          <span>{t(lang, "projects__seg_scale")}</span>
          <span>{t(lang, "projects__seg_ecosystem")}</span>
        </div>
      </div>

      {/* PROJECT CARDS */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {/* PROJECT 1 — MAGIC TIME TAP */}
        {project1Unlocked ? (
          <a
            href="https://t.me/MagicTimeTapBot/magictime?startapp=ref_zzyUPc53FPOwOSn2DcNZirHyusu1"
            target="_blank"
            rel="noreferrer"
            className="group rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 transition hover:border-zinc-600"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold">
                {t(lang, "projects__tap_title")}
              </div>
              <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[11px] text-emerald-300">
                {t(lang, "projects__live")}
              </span>
            </div>

            <div className="mt-2 text-sm text-zinc-400">
              {t(lang, "projects__tap_desc")}
            </div>

            <div className="mt-4 text-xs text-zinc-500 group-hover:text-zinc-300">
              {t(lang, "projects__open")}
            </div>
          </a>
        ) : (
          <LockedProjectCard
            lang={lang}
            title={t(lang, "projects__tap_title")}
            subtitle={t(lang, "projects__unlock_at").replace("{amount}", `$${formatMoney(PROJECT_1_UNLOCK_USD)}`)}
          />
        )}

        {/* OTHER PROJECTS */}
        <LockedProjectCard
          lang={lang}
          title={t(lang, "projects__p2")}
          subtitle={t(lang, "projects__coming_soon")}
        />
        <LockedProjectCard
          lang={lang}
          title={t(lang, "projects__p3")}
          subtitle={t(lang, "projects__coming_soon")}
        />
        <LockedProjectCard
          lang={lang}
          title={t(lang, "projects__p4")}
          subtitle={t(lang, "projects__coming_soon")}
        />
      </div>
    </Card>
  );
}

function LockedProjectCard({
  lang,
  title,
  subtitle,
}: {
  lang: LangCode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
      <div className="pointer-events-none select-none blur-[3px]">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold">{title}</div>
          <span className="rounded-full bg-zinc-700/30 px-2 py-1 text-[11px] text-zinc-300">
            {t(lang, "projects__locked")}
          </span>
        </div>
        <div className="mt-2 text-sm text-zinc-400">{subtitle}</div>
        <div className="mt-4 h-2 w-2/3 rounded-full bg-zinc-800" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-2xl border border-zinc-700 bg-zinc-950/80 px-4 py-2 text-xs text-zinc-200">
          🔒 {t(lang, "projects__coming_soon")}
        </div>
      </div>
    </div>
  );
}

function milestoneProgressPercent(raisedUsd: number) {
  const x = Math.max(0, Number.isFinite(raisedUsd) ? raisedUsd : 0);

  const seg = [
    { a: 0, b: 500_000 },
    { a: 500_000, b: 5_000_000 },
    { a: 5_000_000, b: 15_000_000 },
  ] as const;

  const segWidth = 100 / 3;

  if (x <= seg[0].b) return (x / seg[0].b) * segWidth;
  if (x <= seg[1].b)
    return segWidth + ((x - seg[1].a) / (seg[1].b - seg[1].a)) * segWidth;
  if (x <= seg[2].b)
    return (
      2 * segWidth +
      ((x - seg[2].a) / (seg[2].b - seg[2].a)) * segWidth
    );

  return 100;
}

function formatMoney(n: number) {
  const x = Math.max(0, Number.isFinite(n) ? n : 0);
  if (x >= 1_000_000) return (x / 1_000_000).toFixed(2) + "M";
  if (x >= 1_000) return (x / 1_000).toFixed(2) + "K";
  return x.toFixed(0);
}
