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

import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { beginCell } from "@ton/core";

import bg from "../assets/bg.png";

import { PRESALE_CONTRACT } from "../lib/config";
import {
  fromNano,
  getPresaleSnapshot,
  type PresaleSnapshot,
  priceUsd,
  ROUNDS_TOKENS,
} from "../lib/presale";
import { safeValidUntil, toNanoTon } from "../lib/ton";
import { t } from "../lib/i18n";

/* =====================================================
   ✅ CLAIM ENABLED
   ===================================================== */
const CLAIM_ENABLED_GLOBALLY = true;
/* ===================================================== */

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

// ✅ Claim payload: opcode "CLAI" (0x434C4149) + query_id:Int (257 bits)
function buildClaimPayloadBase64(): string {
  const qid = BigInt(Date.now());
  const cell = beginCell()
    .storeUint(0x434c4149, 32) // "CLAI"
    .storeInt(qid, 257) // Claim.query_id: Int
    .endCell();

  return bytesToBase64(cell.toBoc({ idx: false }));
}

export default function App() {
  const { lang, setLang } = useLang();
  const addr = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();

  const [dataError, setDataError] = useState<string>("");

  const [snapshot, setSnapshot] = useState<PresaleSnapshot>({
    currentRound: 0,
    soldTotalNano: 0n,
    soldInRoundNano: 0n,
    totalRaisedNano: 0n,

    claimableBuyerNano: 0n,
    claimableReferralNano: 0n,

    claimableNano: 0n,
  });

  const [refreshTick, setRefreshTick] = useState(0);
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

  const yourMagt = useMemo(
    () => fromNano(snapshot.claimableBuyerNano ?? 0n),
    [snapshot.claimableBuyerNano]
  );

  const referralMagt = useMemo(
    () => fromNano(snapshot.claimableReferralNano ?? 0n),
    [snapshot.claimableReferralNano]
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

  const reloadOnchain = async (force = false) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    try {
      const snap = await getPresaleSnapshot({
        presaleAddress: PRESALE_CONTRACT,
        walletAddress: addr || undefined,
        force,
      });

      setSnapshot(snap);
      setDataError("");
    } catch (e: any) {
      console.error("[SNAPSHOT ERROR]", e);
      setDataError(String(e?.message ?? e));
    } finally {
      inFlightRef.current = false;
    }
  };

  useEffect(() => {
    reloadOnchain(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addr, refreshTick]);

  useEffect(() => {
    const id = window.setInterval(() => setRefreshTick((x) => x + 1), 12_000);
    return () => window.clearInterval(id);
  }, []);

  const claimEnabled = CLAIM_ENABLED_GLOBALLY && !!addr;

  const forceRefreshAfterTx = () => {
    if (document.hidden) return;

    reloadOnchain(true);

    window.setTimeout(() => {
      if (!document.hidden) reloadOnchain(true);
    }, 12_000);

    window.setTimeout(() => {
      if (!document.hidden) reloadOnchain(true);
    }, 30_000);
  };

  const onClaimClick = async () => {
    if (!addr) return;

    try {
      await tonConnectUI.sendTransaction({
        validUntil: safeValidUntil(5 * 60 - 10),
        messages: [
          {
            address: PRESALE_CONTRACT,
            amount: toNanoTon("0.35"),
            payload: buildClaimPayloadBase64(),
          },
        ],
      });

      forceRefreshAfterTx();
    } catch (e) {
      console.error("[CLAIM ERROR]", e);
    }
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
        <div className="h-[260px] sm:h-[300px] md:h-[340px] lg:h-[380px]" />

        {/* ✅ 3 SMALL INFO CARDS (ABOVE MAIN 2 CARDS) */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-4">
            <div className="text-xs text-zinc-400">{t(lang, "app__network")}</div>
            <div className="mt-1 text-sm font-semibold">TON</div>
          </Card>

          <Card className="p-4">
            <div className="text-xs text-zinc-400">{t(lang, "app__ref_bonus")}</div>
            <div className="mt-1 text-sm font-semibold">+5%</div>
          </Card>

          <Card className="p-4">
            <div className="text-xs text-zinc-400">{t(lang, "app__token")}</div>
            <div className="mt-1 text-sm font-semibold">MAGT</div>
          </Card>
        </div>

        {/* MAIN 2 CARDS */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card>
            <div className="text-sm text-zinc-400">{t(lang, "app__your_magt")}</div>
            <div className="mt-2 text-3xl font-semibold">
              {yourMagt.toFixed(3)} MAGT
            </div>

            <button
              disabled={!claimEnabled}
              onClick={onClaimClick}
              className="mt-4 h-10 w-full rounded-xl border border-white/10 bg-white/5
                         text-sm font-semibold hover:bg-white/10 disabled:opacity-60"
              title={!addr ? t(lang, "presale_widget__9") : undefined}
            >
              {t(lang, "app__claim")}
            </button>

            <div className="mt-2 text-xs text-zinc-500">
              {t(lang, "app__claim_gas_note")}
            </div>
          </Card>

          <Card>
            <div className="text-sm text-zinc-400">{t(lang, "app__referral_magt")}</div>
            <div className="mt-2 text-3xl font-semibold">
              {referralMagt.toFixed(3)} MAGT
            </div>

            <div className="mt-4">
              <ReferralButton lang={lang} />
            </div>
          </Card>
        </div>

        <div className="mt-10">
          <PresaleProgress
            lang={lang}
            currentRound={currentRound}
            soldInRound={soldInRound}
            soldTotal={soldTotal}
          />

          {dataError && (
            <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              {t(lang, "app__onchain_error_prefix")} {dataError}
            </div>
          )}
        </div>

        <div className="mt-10">
          <TonToMagtCalculator lang={lang} currentRound={currentRound} />
        </div>

        <div className="mt-10">
          {/* ✅ FIX: pass currentRound so Buy MAGT "You receive" uses round price */}
          <PresaleWidget
            lang={lang}
            currentRound={currentRound}
            onTxSent={forceRefreshAfterTx}
          />
        </div>

        <div className="mt-10">
          <ProjectsSection lang={lang} raisedUsd={raisedUsd} />
        </div>

        <div className="mt-10">
          <TrustSection lang={lang} />
        </div>

        <div className="mt-10">
          <Tokenomics lang={lang} />
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
    </div>
  );
}
