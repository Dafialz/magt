// src/app/App.tsx
import { useEffect, useMemo, useRef, useState } from "react";

import { Header } from "../components/Header";
import { SeoHead } from "../components/SeoHead";
import { PresaleWidget } from "../components/PresaleWidget";
import { PresaleProgress } from "../components/PresaleProgress";
import { TonToMagtCalculator } from "../components/TonToMagtCalculator";
import { TrustSection } from "../components/TrustSection";
import { Tokenomics } from "../components/Tokenomics";
import { Roadmap } from "../components/Roadmap";
import { FAQ } from "../components/FAQ";
import { SiteFooter } from "../components/SiteFooter";
import { ReferralButton } from "../components/ReferralButton";
import { useLang } from "../components/LangSwitcher";
import { ProjectsSection } from "../components/ProjectsSection";
import { Card } from "../components/Card";

import { useTonAddress } from "@tonconnect/ui-react";
import { Address } from "@ton/core";

import bg from "../assets/bg.png";

import { PRESALE_CONTRACT } from "../lib/config";
import {
  fromNano,
  getPresaleSnapshot,
  type PresaleSnapshot,
  priceUsd,
  ROUNDS_TOKENS,
} from "../lib/presale";
import { t } from "../lib/i18n";

/* =====================================================
   🔴 GLOBAL SWITCH FOR CLAIM BUTTON
   ===================================================== */
const CLAIM_ENABLED_GLOBALLY = false;
/* ===================================================== */

const LS_REF_OWNER = "magt_ref_owner";

function normAddr(s: string): string | null {
  try {
    return Address.parse(s).toRawString();
  } catch {
    return null;
  }
}

function readRefParamNorm(): string | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (!ref) return null;
    return normAddr(ref);
  } catch {
    return null;
  }
}

function readRefOwnerFromLSNorm(): string | null {
  try {
    const v = localStorage.getItem(LS_REF_OWNER);
    if (!v) return null;
    return normAddr(v);
  } catch {
    return null;
  }
}

export default function App() {
  const { lang, setLang } = useLang();
  const addr = useTonAddress();

  const [snapshot, setSnapshot] = useState<PresaleSnapshot>({
    currentRound: 0,
    soldTotalNano: 0n,
    soldInRoundNano: 0n,
    totalRaisedNano: 0n,
    claimableNano: 0n,
  });

  const inFlightRef = useRef(false);

  const currentRound = snapshot.currentRound;

  const soldTotal = useMemo(
    () => fromNano(snapshot.soldTotalNano),
    [snapshot.soldTotalNano]
  );
  const soldInRound = useMemo(
    () => fromNano(snapshot.soldInRoundNano),
    [snapshot.soldInRoundNano]
  );

  const claimableMagt = useMemo(
    () => fromNano(snapshot.claimableNano),
    [snapshot.claimableNano]
  );

  const isReferralOwner = useMemo(() => {
    if (!addr) return false;
    const me = normAddr(addr);
    if (!me) return false;

    const refParam = readRefParamNorm();
    if (refParam && refParam === me) return true;

    const refOwner = readRefOwnerFromLSNorm();
    if (refOwner && refOwner === me) return true;

    return false;
  }, [addr]);

  // Referral MAGT (поки що логіка як була: якщо ти owner — показуємо claimable)
  const referralMagt = useMemo(
    () => (isReferralOwner ? claimableMagt : 0),
    [isReferralOwner, claimableMagt]
  );

  const raisedUsd = useMemo(() => {
    const round = Math.max(0, Math.min(currentRound, ROUNDS_TOKENS.length - 1));
    let usd = 0;

    for (let i = 0; i < round; i++) {
      const cap = ROUNDS_TOKENS[i] ?? 0;
      usd += cap * priceUsd(i);
    }

    usd += soldInRound * priceUsd(round);
    return Number.isFinite(usd) && usd > 0 ? usd : 0;
  }, [currentRound, soldInRound]);

  const reloadOnchain = async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    try {
      const data = await getPresaleSnapshot({
        presaleAddress: PRESALE_CONTRACT,
        walletAddress: addr || undefined,
      });
      setSnapshot(data);
    } catch {
      // не ламаємо UI
    } finally {
      inFlightRef.current = false;
    }
  };

  useEffect(() => {
    reloadOnchain();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addr]);

  const claimEnabled = CLAIM_ENABLED_GLOBALLY && false;

  const onClaimClick = async () => {
    // claim буде ввімкнено після TGE
    return;
  };

  return (
    <div className="min-h-screen text-white">
      <SeoHead lang={lang} />

      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <Header lang={lang} onLangChange={setLang} />

      <main className="mx-auto max-w-6xl px-4 py-10">
        {/* ✅ Просто залишаємо місце під банер, без логотипів/текстів */}
        <div className="h-[260px] sm:h-[300px] md:h-[340px] lg:h-[380px]" />

        {/* ✅ 2 БЛОКИ (як на старому сайті) */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Your MAGT */}
          <Card>
            <div className="text-sm text-zinc-400">Your MAGT</div>

            <div className="mt-2 text-2xl font-semibold">
              {Number.isFinite(claimableMagt) ? claimableMagt.toLocaleString() : "0"}{" "}
              MAGT
            </div>

            <div className="mt-1 text-xs text-zinc-500">
              Claim is disabled during presale.
            </div>

            {/* ✅ CLAIM КНОПКА ТУТ */}
            <button
              onClick={onClaimClick}
              disabled={!claimEnabled}
              className={[
                "mt-4 h-11 w-full rounded-2xl px-5 text-sm font-semibold border border-white/10 bg-black/55",
                "opacity-50 cursor-not-allowed",
              ].join(" ")}
              title="Claim will be enabled after TGE"
            >
              {t(lang, "app__3")}
            </button>
          </Card>

          {/* Referral MAGT */}
          <Card>
            <div className="text-sm text-zinc-400">Referral MAGT</div>

            <div className="mt-2 text-2xl font-semibold">
              {Number.isFinite(referralMagt) ? referralMagt.toLocaleString() : "0"}{" "}
              MAGT
            </div>

            <div className="mt-1 text-xs text-zinc-500">
              Open your referral link (or press Copy referral link) and connect wallet
            </div>

            {/* ✅ COPY REFERRAL LINK КНОПКА ТУТ */}
            <div className="mt-4">
              <ReferralButton lang={lang} address={addr} />
            </div>
          </Card>
        </div>

        {/* ✅ 3 БЛОКИ (Network / Ref / Token) */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <div className="text-sm text-zinc-400">Network</div>
            <div className="mt-1 text-lg font-semibold">TON</div>
          </Card>

          <Card>
            <div className="text-sm text-zinc-400">REF BONUS +5%</div>
            <div className="mt-1 text-lg font-semibold">MAGT</div>
          </Card>

          <Card>
            <div className="text-sm text-zinc-400">Token</div>
            <div className="mt-1 text-lg font-semibold">MAGT</div>
          </Card>
        </div>

        {/* PROGRESS */}
        <div className="mt-12">
          <PresaleProgress
            lang={lang}
            currentRound={currentRound}
            soldTotal={soldTotal}
            soldInRound={soldInRound}
          />
        </div>

        {/* CALC */}
        <div className="mt-10">
          <TonToMagtCalculator lang={lang} currentRound={currentRound} />
        </div>

        {/* BUY (anchor for header button) */}
        <section id="buy" className="mt-10 scroll-mt-28">
          <PresaleWidget lang={lang} />
        </section>

        {/* PROJECTS / MILESTONES */}
        <section className="mt-14">
          <ProjectsSection lang={lang} raisedUsd={raisedUsd} />
        </section>

        {/* TRUST / TOKENOMICS / ROADMAP */}
        <section className="mt-14 grid gap-10">
          <TrustSection lang={lang} />
          <Tokenomics lang={lang} />
          <Roadmap lang={lang} />
        </section>

        {/* FAQ (anchor for header button) */}
        <section id="faq" className="mt-14 scroll-mt-28">
          <FAQ lang={lang} />
        </section>

        {/* SOCIAL */}
        <section id="social" className="mt-14 scroll-mt-28">
          <SiteFooter lang={lang} />
        </section>
      </main>
    </div>
  );
}
