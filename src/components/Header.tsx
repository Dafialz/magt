// src/components/Header.tsx
import React from "react";
import {
  TonConnectButton,
  useTonAddress,
  useTonConnectUI,
} from "@tonconnect/ui-react";

import { shortAddr } from "../lib/format";
import { LangSwitcher } from "./LangSwitcher";
import type { LangCode } from "../lib/i18n";
import { LANGS, FLAG_ICON, t } from "../lib/i18n";

import brandIcon from "../assets/favicon.png";

/** ===== anchors / helpers ===== */
type AnchorId = "buy" | "faq" | "social";

function scrollToId(id: AnchorId) {
  const el = document.getElementById(id);
  if (!el) return;

  const header = document.querySelector("header");
  const headerH = (header as HTMLElement | null)?.offsetHeight ?? 0;

  const top = el.getBoundingClientRect().top + window.scrollY - (headerH + 12);
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

function openDoc(key: "privacy" | "terms" | "disclaimer" | "liquidity") {
  window.dispatchEvent(new CustomEvent("magt:openDoc", { detail: { key } }));
}

export function Header({
  lang,
  onLangChange,
}: {
  lang: LangCode;
  onLangChange: (v: LangCode) => void;
}) {
  const addr = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (id: AnchorId) => {
    setMenuOpen(false);
    scrollToId(id);
  };

  const goPrivacy = () => {
    setMenuOpen(false);
    scrollToId("social");
    setTimeout(() => openDoc("privacy"), 250);
  };

  // ✅ mobile-safe connect button
  const MobileConnectButton = (
    <button
      type="button"
      onClick={() => tonConnectUI.openModal()}
      className={[
        "h-10 shrink-0 rounded-xl border border-white/10 bg-sky-500/90 px-3",
        "text-sm font-semibold text-white shadow-sm hover:bg-sky-500",
        "max-w-[160px] overflow-hidden text-ellipsis whitespace-nowrap",
      ].join(" ")}
      title={addr ? addr : t(lang, "header__10")}
    >
      {addr ? shortAddr(addr) : t(lang, "header__10")}
    </button>
  );

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-900 bg-zinc-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={brandIcon}
            alt="MAGIC TIME"
            className="h-9 w-9 rounded-xl"
          />

          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold">
              MAGIC TIME Presale
            </h1>

            {addr ? (
              <div className="truncate text-xs text-zinc-400">
                {t(lang, "header__2")} {shortAddr(addr)}
              </div>
            ) : null}
          </div>
        </div>

        {/* Desktop nav */}
        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={() => go("buy")}
            className="h-10 rounded-xl border border-white/10 bg-black/35 px-3 text-sm font-semibold text-zinc-100 hover:bg-black/50"
          >
            {t(lang, "header__3")}
          </button>
          <button
            type="button"
            onClick={() => go("faq")}
            className="h-10 rounded-xl border border-white/10 bg-black/35 px-3 text-sm font-semibold text-zinc-100 hover:bg-black/50"
          >
            {t(lang, "header__4")}
          </button>
          <button
            type="button"
            onClick={goPrivacy}
            className="h-10 rounded-xl border border-white/10 bg-black/35 px-3 text-sm font-semibold text-zinc-100 hover:bg-black/50"
          >
            {t(lang, "header__5")}
          </button>
          <button
            type="button"
            onClick={() => go("social")}
            className="h-10 rounded-xl border border-white/10 bg-black/35 px-3 text-sm font-semibold text-zinc-100 hover:bg-black/50"
          >
            {t(lang, "header__6")}
          </button>

          <div className="mx-1 h-8 w-px bg-white/10" />

          <LangSwitcher value={lang} onChange={onLangChange} />
          <TonConnectButton />
        </div>

        {/* Mobile right controls */}
        <div className="flex items-center gap-2 md:hidden">
          {MobileConnectButton}

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="h-10 rounded-xl border border-white/10 bg-black/40 px-3 text-sm font-semibold text-zinc-100 hover:bg-black/55"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
            >
              {t(lang, "header__7")}
            </button>

            {menuOpen ? (
              <div
                className="absolute right-0 z-30 mt-2 w-60 rounded-2xl border border-white/10 bg-zinc-950/90 p-2 backdrop-blur-sm"
                role="menu"
              >
                <div className="max-h-[70vh] overflow-auto">
                  <button
                    type="button"
                    onClick={() => go("buy")}
                    className="w-full rounded-xl px-3 py-2 text-left text-sm text-zinc-100 hover:bg-white/5"
                    role="menuitem"
                  >
                    {t(lang, "header__3")}
                  </button>
                  <button
                    type="button"
                    onClick={() => go("faq")}
                    className="w-full rounded-xl px-3 py-2 text-left text-sm text-zinc-100 hover:bg-white/5"
                    role="menuitem"
                  >
                    {t(lang, "header__4")}
                  </button>
                  <button
                    type="button"
                    onClick={goPrivacy}
                    className="w-full rounded-xl px-3 py-2 text-left text-sm text-zinc-100 hover:bg-white/5"
                    role="menuitem"
                  >
                    {t(lang, "header__5")}
                  </button>
                  <button
                    type="button"
                    onClick={() => go("social")}
                    className="w-full rounded-xl px-3 py-2 text-left text-sm text-zinc-100 hover:bg-white/5"
                    role="menuitem"
                  >
                    {t(lang, "header__6")}
                  </button>

                  <div className="my-2 h-px bg-white/10" />

                  <div className="px-1 pb-1">
                    <div className="mb-2 text-xs font-semibold text-zinc-400">
                      {t(lang, "header__8")}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {LANGS.map((l) => (
                        <button
                          key={l.code}
                          type="button"
                          onClick={() => {
                            onLangChange(l.code);
                            setMenuOpen(false);
                          }}
                          className={[
                            "flex items-center justify-center gap-2 rounded-xl border px-2 py-2 text-xs font-semibold",
                            "bg-black/20 hover:bg-black/35",
                            l.code === lang
                              ? "border-white/20 text-white"
                              : "border-white/10 text-zinc-200",
                          ].join(" ")}
                          aria-current={l.code === lang ? "true" : "false"}
                        >
                          <img
                            src={FLAG_ICON[l.code]}
                            alt={l.code}
                            className="h-4 w-4 rounded-full"
                          />
                          <span>{l.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {menuOpen ? (
        <button
          type="button"
          aria-label="Close menu overlay"
          className="fixed inset-0 z-10 cursor-default bg-transparent md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}
    </header>
  );
}
