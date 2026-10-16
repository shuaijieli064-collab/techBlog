// HeatGrid — GitHub-style contribution grid (deterministic pseudo-random,
// clearly labelled as illustrative until a real GitHub API is connected).
function hash(x: number, y: number): number {
  let h = x * 374761 + y * 668263;
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >> 16)) >>> 0) % 100;
}

const LEVELS = ["rgba(120, 190, 230, 0.10)", "rgba(92, 225, 255, 0.18)", "rgba(92, 225, 255, 0.34)", "rgba(92, 225, 255, 0.55)", "var(--wire)"];

export function HeatGrid({
  weeks = 24,
  rows = 7,
  className = "",
}: {
  weeks?: number;
  rows?: number;
  className?: string;
}) {
  const cells: { key: string; color: string }[] = [];
  for (let x = 0; x < weeks; x++) {
    for (let y = 0; y < rows; y++) {
      const v = hash(x, y);
      const level = v < 42 ? 0 : v < 64 ? 1 : v < 80 ? 2 : v < 92 ? 3 : 4;
      cells.push({ key: `${x}-${y}`, color: LEVELS[level] });
    }
  }
  return (
    <div
      role="img"
      aria-label="GitHub 贡献热力图（示意数据，接入 API 后自动同步）"
      className={`grid gap-[3px] ${className}`}
      style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` }}
    >
      {cells.map((c) => (
        <span key={c.key} className="aspect-square w-full" style={{ background: c.color }} />
      ))}
    </div>
  );
}
