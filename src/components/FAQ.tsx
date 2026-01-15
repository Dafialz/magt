// src/components/FAQ.tsx
import { Card } from "./Card";
import type { LangCode } from "../lib/i18n";
import { FAQ_ITEMS, t } from "../lib/i18n";

export function FAQ({ lang }: { lang: LangCode }) {
  const items = (FAQ_ITEMS[lang] ?? FAQ_ITEMS.en) as { q: string; a: string }[];

  return (
    <Card>
      <div className="text-lg font-semibold">{t(lang, "faq_title")}</div>

      <div className="mt-4 space-y-3">
        {items.map((it, idx) => (
          <details
            key={idx}
            className="group rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4 open:bg-zinc-950/60"
          >
            <summary className="cursor-pointer list-none text-sm font-semibold">
              <div className="flex items-center justify-between gap-3">
                <span>{it.q}</span>
                <span className="text-zinc-500 transition group-open:rotate-45">+</span>
              </div>
            </summary>

            <div className="mt-3 whitespace-pre-line text-sm text-zinc-300">{it.a}</div>
          </details>
        ))}
      </div>
    </Card>
  );
}
