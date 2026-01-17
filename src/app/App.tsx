// src/app/App.tsx
import { useEffect, useMemo, useRef, useState } from "react";

import { Header } from "../components/Header";
import { SeoHead } from "../components/SeoHead";
import { PresaleProgress } from "../components/PresaleProgress";
import { TonToMagtCalculator } from "../components/TonToMagtCalculator";
import { TrustSection } from "../components/TrustSection";
import { Tokenomics } from "../components/Tokenomics";
import { Roadmap } from "../components/Roadmap";
import { FAQ } from "../components/FAQ";
import { SiteFooter } from "../components/SiteFooter";
import { ProjectsSection } from "../components/ProjectsSection";
import { ReferralButton } from "../components/ReferralButton";
import { Card } from "../components/Card";

import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { Address, beginCell } from "@ton/core";

import { PRESALE_CONTRACT } from "../lib/config";

import { ROUNDS_TOKENS, fromNano, getPresaleSnapshot, priceUsd } from "../lib/presale";

import { t } from "../lib/i18n";
import type { LangCode } from "../lib/i18n";

function normAddr(a?: string | null) {
  if (!a) return null;
  try {
    return Address.parse(a).toString();
  } catch {
    return null;
  }
}

function readRefOwnerFromLSNorm() {
  try {
    const v = localStorage.getItem("magt_ref_owner");
    return normAddr(v);
  } catch {
    return null;
  }
}

function readRefParamNorm() {
  try {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    return normAddr(ref);
  } catch {
    return null;
  }
}

export default function App() {
  const [lang, setLang] = useState<LangCode>("en");

  const [tonConnectUI] = useTonConnectUI();
  const addr = useTonAddress();

  const [snapshot, setSnapshot] = useState(() => ({
    currentRound: 0,
    soldTotalNano: 0n,
    soldInRoundNano: 0n,
    totalRaisedNano: 0n,
    claimableNano: 0n,
  }));

  const inFlightRef = useRef(false);

  const currentRound = snapshot.currentRound;
  const soldInRound = useMemo(() => fromNano(snapshot.soldInRoundNano), [snapshot.soldInRoundNano]);
  const soldTotal = useMemo(() => fromNano(snapshot.soldTotalNano), [snapshot.soldTotalNano]);
  const claimableMagt = useMemo(() => fromNano(snapshot.claimableNano), [snapshot.claimableNano]);

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

  const referralMagt = useMemo(
    () => (isReferralOwner ? claimableMagt : 0),
    [isReferralOwner, claimableMagt]
  );

  // "Raised (est.)" як і раніше — по soldInRound + ціни раундів
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

  const reloadOnchain = async (force = false) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    try {
      const data = await getPresaleSnapshot({
        presaleAddress: PRESALE_CONTRACT,
        walletAddress: addr || undefined,
        force,
      });
      setSnapshot(data);
    } catch {
      // ignore
    } finally {
      inFlightRef.current = false;
    }
  };

  useEffect(() => {
    reloadOnchain(false);
    const id = setInterval(() => reloadOnchain(false), 20_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addr]);

  const claimEnabled = !!addr && claimableMagt > 0;

  const onClaimClick = async () => {
    if (!addr) return;

    try {
      const to = PRESALE_CONTRACT;
      const amountTon = 0.35;

      const msgBody = beginCell()
        .storeUint(0x434c4149, 32) // "CLAI" (placeholder)
        .storeUint(0, 64)
        .endCell();

      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
          {
            address: to,
            amount: String(Math.floor(amountTon * 1e9)),
            payload: msgBody.toBoc().toString("base64"),
          },
        ],
      });

      // після TX робимо force кілька разів
      setTimeout(() => reloadOnchain(true), 2500);
      setTimeout(() => reloadOnchain(true), 7000);
    } catch {
      // ignore
    }
  };

  return (
    <>
      <SeoHead lang={lang} />

      <div
        className="fixed inset-0 -z-10 bg-black"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(56,189,248,0.18), transparent 40%), radial-gradient(circle at 80% 30%, rgba(217,70,239,0.18), transparent 40%), radial-gradient(circle at 50% 80%, rgba(34,197,94,0.12), transparent 40%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <Header lang={lang} onLangChange={setLang} />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="h-[260px] sm:h-[300px] md:h-[340px] lg:h-[380px]" />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <div className="text-sm text-zinc-400">{t(lang, "app__your_magt")}</div>
            <div className="mt-2 text-3xl font-semibold">{claimableMagt.toFixed(3)} MAGT</div>

            <button
              disabled={!claimEnabled}
              onClick={onClaimClick}
              className="mt-4 h-10 w-full rounded-xl border border-white/10 bg-white/5
                         text-sm font-semibold hover:bg-white/10 disabled:opacity-60"
              title={!addr ? t(lang, "presale_widget__9") : undefined}
            >
              Claim
            </button>

            <div className="mt-2 text-xs text-zinc-500">
              Claim sends ~0.35 TON gas (testnet/mainnet depends on network).
            </div>
          </Card>

          <Card>
            <div className="text-sm text-zinc-400">{t(lang, "app__referral_magt")}</div>
            <div className="mt-2 text-3xl font-semibold">{referralMagt.toFixed(3)} MAGT</div>

            <div className="mt-4">
              <ReferralButton lang={lang} address={addr} />
            </div>
          </Card>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <PresaleProgress
            lang={lang}
            currentRound={currentRound}
            soldInRound={soldInRound}
            soldTotal={soldTotal}
          />

          <Card>
            <div className="text-lg font-semibold">{t(lang, "app__stats")}</div>
            <div className="mt-3 text-sm text-zinc-400">
              Raised (est.): ${raisedUsd.toLocaleString()}
            </div>
            <div className="mt-2 text-xs text-zinc-500 break-all">Presale: {PRESALE_CONTRACT}</div>
          </Card>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* ✅ правильні пропси */}
          <TonToMagtCalculator lang={lang} currentRound={currentRound} />
          <TrustSection lang={lang} />
        </div>

        <div className="mt-10">
          <Tokenomics lang={lang} />
        </div>

        <div className="mt-10">
          {/* ✅ ProjectsSection очікує raisedUsd */}
          <ProjectsSection lang={lang} raisedUsd={raisedUsd} />
        </div>

        <div className="mt-10">
          <Roadmap lang={lang} />
        </div>

        <div className="mt-10">
          <FAQ lang={lang} />
        </div>

        <div className="mt-10">
          <SiteFooter lang={lang} />
        </div>
      </main>
    </>
  );
}
