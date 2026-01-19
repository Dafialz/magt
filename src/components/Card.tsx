// src/components/Card.tsx
import React from "react";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // CSS variables for glow position
    el.style.setProperty("--glow-x", `${x}%`);
    el.style.setProperty("--glow-y", `${y}%`);
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;

    // smoothly reset to center
    el.style.setProperty("--glow-x", `50%`);
    el.style.setProperty("--glow-y", `50%`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
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
      style={{
        // default center
        ["--glow-x" as any]: "50%",
        ["--glow-y" as any]: "50%",
      }}
    >
      {/* === PARALLAX GLOW (CURSOR) === */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(
                300px circle at var(--glow-x) var(--glow-y),
                rgba(56,189,248,0.18),
                transparent 60%
              )
            `,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(
                260px circle at calc(var(--glow-x) + 6%) calc(var(--glow-y) + 6%),
                rgba(168,85,247,0.14),
                transparent 65%
              )
            `,
          }}
        />
      </div>

      {/* === SOFT AMBIENT GLOW (IDLE) === */}
      <div className="pointer-events-none absolute inset-0 opacity-25 transition-opacity duration-300 group-hover:opacity-40">
        <div className="absolute -top-12 left-6 h-24 w-32 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-12 right-6 h-24 w-32 rounded-full bg-purple-400/20 blur-3xl" />
      </div>

      {/* === EDGE GLOW === */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10" />
        <div className="absolute inset-0 rounded-2xl ring-1 ring-cyan-400/10 blur-sm" />
      </div>

      {/* === CONTENT === */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
