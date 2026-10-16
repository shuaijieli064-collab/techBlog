"use client";

// RadarChart — skill portrait as an HUD-style radar (growth page).
// Reads real skill levels from the workspace store; polygon sweeps outward
// once on mount (static under prefers-reduced-motion).
import { useEffect, useState } from "react";

import { defaultSkillLevels, skills } from "@/lib/growth";
import { useWorkspace } from "@/lib/workspace/client";

export function RadarChart({ className = "" }: { className?: string }) {
  const [stored] = useWorkspace<Record<string, number>>("skill-levels", defaultSkillLevels);
  const levels =
    stored && typeof stored === "object" && !Array.isArray(stored) ? stored : defaultSkillLevels;
  const items = skills.map((s) => ({
    ...s,
    level: Math.min(100, Math.max(0, levels[s.name] ?? s.level)),
  }));

  const [t, setT] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    const dur = 950;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = reduce ? 1 : 1 - Math.pow(1 - p, 3);
      setT(eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const W = 360;
  const H = 300;
  const cx = W / 2;
  const cy = H / 2 + 6;
  const R = 96;
  const n = items.length;
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i: number, r: number): [number, number] => [
    cx + Math.cos(angle(i)) * r,
    cy + Math.sin(angle(i)) * r,
  ];

  const rings = [0.25, 0.5, 0.75, 1].map((f) =>
    items.map((_, i) => pt(i, R * f).join(",")).join(" "),
  );
  const grow = () => R * (0.12 + 0.88 * t);
  const dataPts = items
    .map((it, i) => pt(i, (it.level / 100) * grow()).join(","))
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role="img"
      aria-label={`技能雷达图：${items.map((s) => `${s.name} ${s.level}%`).join("，")}`}
    >
      {rings.map((pts, k) => (
        <polygon
          key={k}
          points={pts}
          fill="none"
          stroke="var(--hair)"
          strokeWidth={k === 3 ? 1 : 0.75}
        />
      ))}
      {items.map((_, i) => {
        const [x1, y1] = pt(i, 0);
        const [x2, y2] = pt(i, R);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--hair)" strokeWidth={0.75} />;
      })}
      <polygon
        points={dataPts}
        fill="rgba(92, 225, 255, 0.09)"
        stroke="var(--wire)"
        strokeWidth={1.5}
      />
      {items.map((it, i) => {
        const [x, y] = pt(i, (it.level / 100) * grow());
        return <circle key={it.name} cx={x} cy={y} r={2.4} fill="var(--wire)" />;
      })}
      {items.map((it, i) => {
        const [x, y] = pt(i, R + 24);
        return (
          <text
            key={it.name}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--print)"
            fontSize="10.5"
            fontFamily="var(--font-geist-mono), monospace"
          >
            {it.name}
          </text>
        );
      })}
    </svg>
  );
}
