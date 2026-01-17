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
import { Address, beginCell } from "@ton/core";

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

const CLAIM_ENABLED_GLOBALLY = true;
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

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

// ✅ Claim payload MUST match presale.tact:
// message(0x434C4149) Claim { query_id: Int }
function buildClaimPayloadBase64(): string {
  const qid = BigInt(Date.now());

  const cell = beginCell()
    .storeUint(0x434c4149, 32) // "CLAI"
    .storeInt(qid, 257) // Int (Tact)
    .endCell();

  return bytesToBase64(cell.toBoc({ idx: false }));
}

export default function App() {
  const { lang, setLang } = useLang();
  const addr = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();

  const [snapshot, setSnapshot] = useState<PresaleSnapshot>({
    currentRound: 0,
    soldTotalNano: 0n,
    soldInRoundNano: 0n,
    totalRaisedNano: 0n,
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
      // ignore
    } finally {
      inFlightRef.current = false;
    }
  };

  useEffect(() => {
    reloadOnchain();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addr, refreshTick]);

  useEffect(() => {
    // ✅ 60s polling щоб не ловити TonAPI 429
    const id = window.setInterval(() => setRefreshTick((x) => x + 1), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const claimEnabled = CLAIM_ENABLED_GLOBALLY && !!addr;

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

      // разово форсимо оновлення
      setRefreshTick((x) => x + 1);
    } catch {
      // ignore
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

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <div className="text-sm text-zinc-400">{t(lang, "app__your_magt")}</div>
            <div className="mt-2 text-3xl font-semibold">
              {claimableMagt.toFixed(3)} MAGT
            </div>

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
            <div className="mt-2 text-3xl font-semibold">
              {referralMagt.toFixed(3)} MAGT
            </div>

            <div className="mt-4">
              <ReferralButton lang={lang} />
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
            <div className="mt-2 text-xs text-zinc-500 break-all">
              Presale: {PRESALE_CONTRACT}
            </div>
          </Card>
        </div>

        <div className="mt-10">
          <TonToMagtCalculator lang={lang} currentRound={currentRound} />
        </div>

        <section id="buy" className="mt-10 scroll-mt-28">
          <PresaleWidget lang={lang} onTxSent={() => setRefreshTick((x) => x + 1)} />
        </section>

        <section className="mt-14">
          <ProjectsSection lang={lang} raisedUsd={raisedUsd} />
        </section>

        <section className="mt-14 grid gap-10">
          <TrustSection lang={lang} />
          <Tokenomics lang={lang} />
          <Roadmap lang={lang} />
        </section>

        <section id="faq" className="mt-14 scroll-mt-28">
          <FAQ lang={lang} />
        </section>

        <section id="social" className="mt-14 scroll-mt-28">
          <SiteFooter lang={lang} />
        </section>
      </main>
    </div>
  );
}
