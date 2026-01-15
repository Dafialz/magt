// src/components/Card.tsx
import React from "react";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl",
        "border border-white/10",
        "bg-gradient-to-b from-black/70 via-black/45 to-black/70",
        "backdrop-blur-md",
        "shadow-[0_20px_60px_rgba(0,0,0,0.55)]",
        "p-5",
        className,
      ].join(" ")}
    >
      {/* glow */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-12 left-4 h-24 w-32 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-12 right-4 h-24 w-32 rounded-full bg-purple-400/20 blur-3xl" />
      </div>

      <div className="relative">{children}</div>
    </div>
  );
}
