// src/components/SeoHead.tsx
import { useEffect } from "react";

export function SeoHead({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang || "en";
    // можеш змінити як хочеш
    document.title = "MAGIC TIME Presale";
  }, [lang]);

  return null;
}
