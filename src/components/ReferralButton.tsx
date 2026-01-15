// src/components/ReferralButton.tsx
import React from "react";
import type { LangCode } from "../lib/i18n";
import { t } from "../lib/i18n";

const LS_REF_OWNER = "magt_ref_owner";

export function ReferralButton({
  lang,
  address,
}: {
  lang: LangCode;
  address?: string | null;
}) {
  const [copied, setCopied] = React.useState(false);

  const link = React.useMemo(() => {
    const base = window.location.origin;
    const ref = address ? encodeURIComponent(address) : "";
    return ref ? `${base}/?ref=${ref}` : `${base}/`;
  }, [address]);

  async function copy() {
    // ✅ important: store owner first, then copy
    if (address) {
      try {
        localStorage.setItem(LS_REF_OWNER, address);
      } catch {
        // ignore
      }
    }

    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // fallback
      try {
        const el = document.createElement("textarea");
        el.value = link;
        el.setAttribute("readonly", "");
        el.style.position = "fixed";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);

        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      } catch {
        // do nothing
      }
    }
  }

  return (
    <button
      onClick={copy}
      className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-900 disabled:opacity-60"
      type="button"
      disabled={!address}
      title={!address ? t(lang, "ref__need_wallet") : undefined}
    >
      {copied ? t(lang, "copied") : t(lang, "copy_ref")}
    </button>
  );
}
