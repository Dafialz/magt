// src/components/ReferralButton.tsx
import { useTonAddress } from "@tonconnect/ui-react";

export function ReferralButton() {
  const address = useTonAddress();

  if (!address) {
    return (
      <button
        disabled
        className="h-10 w-full rounded-xl border border-white/10 bg-white/5 text-sm opacity-60"
      >
        Connect wallet
      </button>
    );
  }

  const refLink = `${window.location.origin}/?ref=${address}`;

  function copy() {
    navigator.clipboard.writeText(refLink);
  }

  return (
    <button
      onClick={copy}
      className="h-10 w-full rounded-xl border border-white/10 bg-white/5
                 text-sm font-semibold hover:bg-white/10"
    >
      Copy referral link
    </button>
  );
}
