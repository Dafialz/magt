// src/components/Roadmap.tsx
import { Card } from "./Card";
import type { LangCode } from "../lib/i18n";
import { t } from "../lib/i18n";

export function Roadmap({ lang }: { lang: LangCode }) {
  const steps = [
    { q: "Q1", title: t(lang, "roadmap__q1") },
    { q: "Q2", title: t(lang, "roadmap__q2") },
    { q: "Q3", title: t(lang, "roadmap__q3") },
    { q: "Q4", title: t(lang, "roadmap__q4") },
  ];

  return (
    <Card>
      <div className="text-lg font-semibold">
        {t(lang, "roadmap__title")}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {steps.map((s) => (
          <div
            key={s.q}
            className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4"
          >
            <div className="text-xs text-zinc-400">{s.q}</div>
            <div className="mt-1 text-sm font-semibold">{s.title}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
