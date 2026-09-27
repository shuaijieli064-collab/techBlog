"use client";

import { useEffect, useState } from "react";

export type TelemetryItem = { label: string; value: number; unit: string };

export function Telemetry({ items }: { items: TelemetryItem[] }) {
  const [counts, setCounts] = useState<number[]>(() => items.map((i) => i.value));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = performance.now();
    const dur = 750;
    let raf = 0;
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setCounts(items.map((i) => Math.round(i.value * eased)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [items]);

  return (
    <div className="mt-4 grid grid-cols-2 gap-px border border-hair bg-hair sm:grid-cols-4">
      {items.map((item, i) => (
        <div key={item.label} className="bg-panel px-5 py-4">
          <div className="label-mono">{item.label}</div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-extrabold tabular-nums text-foreground">
              {String(counts[i] ?? 0).padStart(2, "0")}
            </span>
            <span className="font-mono text-[11px] text-wire">{item.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
