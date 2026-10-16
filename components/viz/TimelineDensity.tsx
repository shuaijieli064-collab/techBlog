// TimelineDensity — segmented distribution bar (growth event mix).
// Segments step down in opacity for depth; no animation.
export function TimelineDensity({
  items,
  className = "",
}: {
  items: { label: string; value: number }[];
  className?: string;
}) {
  const total = items.reduce((a, b) => a + b.value, 0) || 1;
  return (
    <div
      role="img"
      aria-label={`事件分布：${items.map((i) => `${i.label} ${i.value}`).join("，")}`}
      className={`flex h-2.5 w-full gap-px ${className}`}
    >
      {items.map((it, i) => (
        <div
          key={it.label}
          className="h-full bg-wire"
          style={{
            width: `${(it.value / total) * 100}%`,
            opacity: Math.max(0.28, 1 - i * 0.16),
          }}
        />
      ))}
    </div>
  );
}
