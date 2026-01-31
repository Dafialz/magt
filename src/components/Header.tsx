// src/components/Header.tsx
import { LangSwitcher } from "./LangSwitcher";
import type { LangCode } from "../lib/i18n";

export function Header({
  lang,
  setLang,
}: {
  lang: LangCode;
  setLang: (l: LangCode) => void;
}) {
  return (
    <header className="flex items-center justify-between py-4">
      <div className="text-xl font-bold">MAGT</div>

      {/* LangSwitcher expects value + onChange */}
      <LangSwitcher value={lang} onChange={setLang} />
    </header>
  );
}
