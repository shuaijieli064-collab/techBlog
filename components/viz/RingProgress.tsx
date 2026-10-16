"use client";

// RingProgress — HUD ring gauge with mono center readout.
// Sweeps once on mount / value change (static under prefers-reduced-motion).
import { useEffect, useState } from "react";

export function RingProgress({
  value,
  size = 104,
  stroke = 7,
  center,
  sub,
  label,
}: {
  value: number; // 0..1
  size?: number;
  stroke?: number;
  center?: string;
  sub?: string;
  label: string;
}) {
  const [p, setP] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    const dur = 850;
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / dur);
      const eased = reduce ? 1 : 1 - Math.pow(1 - k, 3);
      setP(value * eased);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      role="img"
      aria-label={`${label}：${Math.round(value * 100)}%`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--hair)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--wire)"
          strokeWidth={stroke}
          strokeLinecap="square"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - p)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        {center && (
          <span className="font-mono text-lg font-bold tabular-nums text-foreground">{center}</span>
        )}
        {sub && <span className="font-mono text-[10px] tracking-[0.08em] text-muted">{sub}</span>}
      </div>
    </div>
  );
}
