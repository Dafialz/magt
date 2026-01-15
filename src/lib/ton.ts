// src/lib/ton.ts
export function nowPlus(seconds: number) {
  return Math.floor(Date.now() / 1000) + seconds;
}

export function toNanoTon(ton: number) {
  // TON -> nanoTON
  if (!Number.isFinite(ton) || ton <= 0) return "0";
  return String(Math.floor(ton * 1e9));
}
