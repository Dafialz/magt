// src/components/TrustSection.tsx
import { Card } from "./Card";
import type { LangCode } from "../lib/i18n";
import { t } from "../lib/i18n";

export function TrustSection({ lang }: { lang: LangCode }) {
  return (
    <Card>
      <div className="text-lg font-semibold">
        {t(lang, "trust__title")}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <TrustItem
          lang={lang}
          title="trust__1_title"
          text="trust__1_text"
        />
        <TrustItem
          lang={lang}
          title="trust__2_title"
          text="trust__2_text"
        />
        <TrustItem
          lang={lang}
          title="trust__3_title"
          text="trust__3_text"
        />
        <TrustItem
          lang={lang}
          title="trust__4_title"
          text="trust__4_text"
        />
      </div>
    </Card>
  );
}

function TrustItem({
  lang,
  title,
  text,
}: {
  lang: LangCode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
      <div className="text-sm font-semibold">{t(lang, title)}</div>
      <div className="mt-2 text-xs text-zinc-400">{t(lang, text)}</div>
    </div>
  );
}
