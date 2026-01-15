// src/components/SiteFooter.tsx
import React from "react";
import { Card } from "./Card";
import type { LangCode } from "../lib/i18n";
import { DOCS } from "../lib/i18n";

type DocKey = "privacy" | "terms" | "disclaimer" | "liquidity";

const LABELS: Record<LangCode, { privacy: string; terms: string; disclaimer: string; liquidity: string; close: string; footerDisclaimer: string }> = {
  en: {
    privacy: "Privacy Policy",
    terms: "Terms",
    disclaimer: "Disclaimer",
    liquidity: "Liquidity Lock",
    close: "Close",
    footerDisclaimer: "Disclaimer: Crypto is risky. Do your own research.",
  },
  uk: {
    privacy: "Політика конфіденційності",
    terms: "Умови",
    disclaimer: "Дисклеймер",
    liquidity: "Лок ліквідності",
    close: "Закрити",
    footerDisclaimer: "Дисклеймер: Крипта — це ризик. Досліджуй самостійно.",
  },
  ru: {
    privacy: "Политика конфиденциальности",
    terms: "Условия",
    disclaimer: "Дисклеймер",
    liquidity: "Лок ликвидности",
    close: "Закрыть",
    footerDisclaimer: "Дисклеймер: Крипта — это риск. DYOR.",
  },
  es: {
    privacy: "Política de privacidad",
    terms: "Términos",
    disclaimer: "Descargo",
    liquidity: "Bloqueo de liquidez",
    close: "Cerrar",
    footerDisclaimer: "Aviso: Las criptos son riesgosas. Investiga por tu cuenta.",
  },
  fr: {
    privacy: "Politique de confidentialité",
    terms: "Conditions",
    disclaimer: "Avertissement",
    liquidity: "Verrouillage de liquidité",
    close: "Fermer",
    footerDisclaimer: "Avertissement : Les cryptos sont risquées. Faites vos propres recherches.",
  },
  pt: {
    privacy: "Política de Privacidade",
    terms: "Termos",
    disclaimer: "Isenção",
    liquidity: "Bloqueio de Liquidez",
    close: "Fechar",
    footerDisclaimer: "Aviso: Cripto é arriscado. Faça sua própria pesquisa.",
  },
  cn: {
    privacy: "隐私政策",
    terms: "条款",
    disclaimer: "免责声明",
    liquidity: "流动性锁定",
    close: "关闭",
    footerDisclaimer: "免责声明：加密投资有风险，请自行研究。",
  },
  in: {
    privacy: "गोपनीयता नीति",
    terms: "नियम",
    disclaimer: "अस्वीकरण",
    liquidity: "लिक्विडिटी लॉक",
    close: "बंद करें",
    footerDisclaimer: "अस्वीकरण: क्रिप्टो जोखिमभरा है। अपना शोध स्वयं करें।",
  },
  id: {
    privacy: "Kebijakan Privasi",
    terms: "Ketentuan",
    disclaimer: "Penafian",
    liquidity: "Kunci Likuiditas",
    close: "Tutup",
    footerDisclaimer: "Penafian: Kripto berisiko. Lakukan riset sendiri.",
  },
  sa: {
    privacy: "سياسة الخصوصية",
    terms: "الشروط",
    disclaimer: "إخلاء المسؤولية",
    liquidity: "قفل السيولة",
    close: "إغلاق",
    footerDisclaimer: "تنبيه: العملات الرقمية عالية المخاطر. قم بأبحاثك الخاصة.",
  },
  bd: {
    privacy: "গোপনীয়তা নীতি",
    terms: "শর্তাবলী",
    disclaimer: "দায়মুক্তি",
    liquidity: "লিকুইডিটি লক",
    close: "বন্ধ করুন",
    footerDisclaimer: "দায়মুক্তি: ক্রিপ্টো ঝুঁকিপূর্ণ। নিজে গবেষণা করুন।",
  },
};

function renderDoc(md: string) {
  const lines = (md || "").split("\n");
  const nodes: React.ReactNode[] = [];
  let list: string[] = [];

  const flushList = () => {
    if (!list.length) return;
    nodes.push(
      <ul key={"ul-" + nodes.length} className="mt-2 list-disc space-y-1 pl-5 text-zinc-200/90">
        {list.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    );
    list = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i] ?? "";
    const line = raw.trim();

    if (!line) {
      flushList();
      continue;
    }

    if (line.startsWith("- ")) {
      list.push(line.slice(2).trim());
      continue;
    }

    flushList();

    if (line.startsWith("## ")) {
      nodes.push(
        <div key={"h2-" + i} className="mt-5 text-base font-semibold text-white">
          {line.slice(3)}
        </div>
      );
      continue;
    }

    if (line.startsWith("# ")) {
      nodes.push(
        <div key={"h1-" + i} className="mt-2 text-lg font-semibold text-white">
          {line.slice(2)}
        </div>
      );
      continue;
    }

    nodes.push(
      <div key={"p-" + i} className="mt-2 text-zinc-200/90 whitespace-pre-line">
        {raw}
      </div>
    );
  }

  flushList();
  return nodes;
}

export function SiteFooter({ lang = "en" }: { lang?: LangCode }) {
  const [open, setOpen] = React.useState<DocKey | null>(null);

  // Allow opening docs from Header via custom event:
  // window.dispatchEvent(new CustomEvent("magt:openDoc",{detail:{key:"privacy"}}))
  React.useEffect(() => {
    const onOpen = (e: Event) => {
      const ce = e as CustomEvent;
      const key = ce?.detail?.key as DocKey | undefined;
      if (!key) return;
      setOpen(key);
    };
    window.addEventListener("magt:openDoc", onOpen as any);
    return () => window.removeEventListener("magt:openDoc", onOpen as any);
  }, []);

  const L = LABELS[lang] ?? LABELS.en;

  return (
    <>
      {/* Anchor targets */}
      <div id="social" className="scroll-mt-28" />

      <Card>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="text-xs text-zinc-500">
            © {new Date().getFullYear()} MAGIC TIME
            <div className="mt-2">{L.footerDisclaimer}</div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            {/* Social */}
            <a className="text-zinc-300 hover:text-white" href="https://t.me/magtcoin" target="_blank" rel="noreferrer">
              Telegram
            </a>
            <a className="text-zinc-300 hover:text-white" href="https://x.com/magtcoin?s=21" target="_blank" rel="noreferrer">
              X (Twitter)
            </a>
            <a className="text-zinc-300 hover:text-white" href="https://www.instagram.com/magtcoin/" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a
              className="text-zinc-300 hover:text-white"
              href="https://www.tiktok.com/@magic.time97?_r=1&_t=ZN-92YXAihQEUd"
              target="_blank"
              rel="noreferrer"
            >
              TikTok
            </a>
            <a
              className="text-zinc-300 hover:text-white"
              href="https://www.threads.com/@magtcoin?igshid=NTc4MTIwNjQ2YQ=="
              target="_blank"
              rel="noreferrer"
            >
              Threads
            </a>
            <a
              className="text-zinc-300 hover:text-white"
              href="https://www.facebook.com/share/1AuVfhme9G/?mibextid=wwXIfr"
              target="_blank"
              rel="noreferrer"
            >
              Facebook
            </a>
            <a className="text-zinc-300 hover:text-white" href="https://www.youtube.com/@magtcoin" target="_blank" rel="noreferrer">
              YouTube
            </a>

            {/* Internal docs */}
            <button className="text-left text-zinc-300 hover:text-white" onClick={() => setOpen("privacy")} type="button">
              {L.privacy}
            </button>
            <button className="text-left text-zinc-300 hover:text-white" onClick={() => setOpen("terms")} type="button">
              {L.terms}
            </button>
            <button className="text-left text-zinc-300 hover:text-white" onClick={() => setOpen("disclaimer")} type="button">
              {L.disclaimer}
            </button>
            <button className="text-left text-zinc-300 hover:text-white" onClick={() => setOpen("liquidity")} type="button">
              {L.liquidity}
            </button>
          </div>
        </div>
      </Card>

      <DocModal open={open} onClose={() => setOpen(null)} lang={lang} />
    </>
  );
}

function DocModal({ open, onClose, lang }: { open: DocKey | null; onClose: () => void; lang: LangCode }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const L = LABELS[lang] ?? LABELS.en;

  const title =
    open === "privacy" ? L.privacy : open === "terms" ? L.terms : open === "disclaimer" ? L.disclaimer : L.liquidity;

  const doc = (DOCS[lang]?.[open] ?? DOCS.en?.[open] ?? "") as string;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-sm"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div className="text-base font-semibold text-white">{title}</div>
          <button
            className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-sm text-zinc-200 hover:bg-black/55"
            onClick={onClose}
            type="button"
          >
            {L.close}
          </button>
        </div>

        <div className="max-h-[70vh] overflow-auto px-5 py-4 text-sm text-zinc-200">{renderDoc(doc)}</div>
      </div>
    </div>
  );
}
