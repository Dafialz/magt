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
        "group relative overflow-hidden rounded-2xl",
        "border border-white/10",
        "bg-gradient-to-b from-black/70 via-black/45 to-black/70",
        "backdrop-blur-md",
        "shadow-[0_20px_60px_rgba(0,0,0,0.55)]",
        "p-5",
        // hover / focus
        "transition-all duration-300 ease-out",
        "hover:border-white/20 hover:shadow-[0_25px_80px_rgba(0,0,0,0.75)]",
        className,
      ].join(" ")}
    >
      {/* === SOFT GLOW (IDLE) === */}
      <div className="pointer-events-none absolute inset-0 opacity-30 transition-opacity duration-300 group-hover:opacity-60">
        <div className="absolute -top-12 left-6 h-24 w-32 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-12 right-6 h-24 w-32 rounded-full bg-purple-400/20 blur-3xl" />
      </div>

      {/* === EDGE GLOW (HOVER) === */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10" />
        <div className="absolute inset-0 rounded-2xl ring-1 ring-cyan-400/10 blur-sm" />
      </div>

      {/* === CONTENT === */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
