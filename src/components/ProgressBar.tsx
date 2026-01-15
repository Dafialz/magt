// src/components/ProgressBar.tsx
export function ProgressBar({
  label,
  value,
  max = 100,
}: {
  label?: string;
  value: number;
  max?: number;
}) {
  const safeMax = Number.isFinite(max) ? max : 0;
  const safeValue = Number.isFinite(value) ? value : 0;

  const pct =
    safeMax > 0 ? Math.max(0, Math.min(100, (safeValue / safeMax) * 100)) : 0;

  return (
    <div>
      {label ? (
        <div className="mb-2 text-sm font-semibold">{label}</div>
      ) : null}

      <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-white/40"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
