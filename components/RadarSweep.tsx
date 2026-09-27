type Blip = { label: string; left: number; top: number; delay: number };

const blips: Blip[] = [
  { label: "博客", left: 70.9, top: 25.1, delay: 0 },
  { label: "笔记", left: 59.4, top: 66.2, delay: 0.5 },
  { label: "项目", left: 6.5, top: 65.8, delay: 1.0 },
  { label: "AI", left: 27.0, top: 27.0, delay: 1.5 },
];

const ticks = Array.from({ length: 24 }, (_, i) => i * 15);

export function RadarSweep() {
  return (
    <div className="card hud-corners relative p-4 sm:p-5">
      <div className="relative mx-auto aspect-square w-full max-w-[330px]">
        <svg viewBox="0 0 320 320" className="h-full w-full" role="img" aria-label="站点模块雷达图：博客、笔记、项目、AI 中心">
          <defs>
            <linearGradient id="radar-sweep-grad" x1="160" y1="160" x2="288" y2="86" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#5ce1ff" stopOpacity="0.32" />
              <stop offset="1" stopColor="#5ce1ff" stopOpacity="0" />
            </linearGradient>
          </defs>

          <circle cx="160" cy="160" r="148" fill="none" className="stroke-hair" strokeWidth="1" />
          <circle cx="160" cy="160" r="104" fill="none" className="stroke-hair" strokeWidth="1" />
          <circle cx="160" cy="160" r="60" fill="none" className="stroke-hair" strokeWidth="1" />
          <path d="M160 12v296M12 160h296" className="stroke-hair" strokeWidth="1" strokeDasharray="2 7" />

          {ticks.map((deg) => {
            const major = deg % 90 === 0;
            const rad = (deg * Math.PI) / 180;
            const r2 = 148;
            const r1 = major ? 138 : 144;
            return (
              <line
                key={deg}
                x1={160 + r1 * Math.sin(rad)}
                y1={160 - r1 * Math.cos(rad)}
                x2={160 + r2 * Math.sin(rad)}
                y2={160 - r2 * Math.cos(rad)}
                className="stroke-hair"
                strokeWidth={major ? 1.6 : 1}
              />
            );
          })}

          <g data-radar-sweep style={{ transformOrigin: "160px 160px", animation: "radar-rotate 6s linear infinite" }}>
            <path d="M160 160 L160 12 A148 148 0 0 1 288.2 86 Z" fill="url(#radar-sweep-grad)" />
            <line x1="160" y1="160" x2="160" y2="12" stroke="#5ce1ff" strokeWidth="1.5" strokeOpacity="0.8" />
          </g>

          <circle cx="160" cy="160" r="8" fill="none" className="stroke-wire" strokeWidth="1" strokeOpacity="0.5" />
          <circle cx="160" cy="160" r="3" fill="#5ce1ff" />
        </svg>

        {blips.map((b) => (
          <div
            key={b.label}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${b.left}%`, top: `${b.top}%` }}
          >
            <span
              aria-hidden
              className="status-dot block h-1.5 w-1.5 rounded-full bg-wire shadow-[0_0_8px_var(--glow)]"
              style={{ animationDelay: `${b.delay}s` }}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[10px] tracking-[0.06em] text-print">
              {b.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-hair pt-3 font-mono text-[10px] tracking-[0.1em] text-muted">
        <span aria-hidden>RADAR · WORKSPACE</span>
        <span className="flex items-center gap-1.5">
          <span className="status-dot h-1.5 w-1.5 rounded-full bg-wire" aria-hidden />
          持续更新
        </span>
      </div>
    </div>
  );
}
