// Sparkline — minimal HUD trend line with soft area fill. Static, no animation.
export function Sparkline({
  data,
  width = 128,
  height = 36,
  accent = "var(--wire)",
  label,
}: {
  data: number[];
  width?: number;
  height?: number;
  accent?: string;
  label: string;
}) {
  if (data.length < 2) {
    return (
      <svg width={width} height={height} role="img" aria-label={label}>
        <rect x="1" y={height / 2 - 0.5} width={width - 2} height="1" fill="var(--hair)" />
      </svg>
    );
  }
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (width - 4) + 2;
    const y = height - 2 - ((v - min) / range) * (height - 8);
    return [x, y] as const;
  });
  const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `2,${height} ${line} ${width - 2},${height}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={`spark-${label.replace(/\W/g, "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.28" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#spark-${label.replace(/\W/g, "")})`} />
      <polyline
        points={line}
        fill="none"
        stroke={accent}
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="square"
      />
      <circle
        cx={pts[pts.length - 1][0]}
        cy={pts[pts.length - 1][1]}
        r="2"
        fill={accent}
      />
    </svg>
  );
}
