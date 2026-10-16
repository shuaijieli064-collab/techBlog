"use client";

import { RingProgress } from "@/components/viz/RingProgress";
import { defaultData } from "@/components/LearningRoadmap";
import { useWorkspace } from "@/lib/workspace/client";

type AlgoDefault = { name: string; count: number; mastered: number };
type AlgoStored = { name: string; mastered: number };

// Single source of truth: algorithm seed data lives with the learning roadmap.
const defaults: AlgoDefault[] = defaultData.algorithms;

const storedDefaults: AlgoStored[] = defaults.map(({ name, mastered }) => ({ name, mastered }));

function mergeWithDefaults(stored: AlgoStored[]): AlgoDefault[] {
  return defaults.map((item) => {
    const hit = stored.find((p) => p && p.name === item.name);
    if (!hit || typeof hit.mastered !== "number") return item;
    return { ...item, mastered: Math.min(item.count, Math.max(0, hit.mastered)) };
  });
}

export function AlgorithmProgress() {
  const [stored, setStored] = useWorkspace<AlgoStored[]>("algorithms", storedDefaults);

  const items = Array.isArray(stored) ? mergeWithDefaults(stored) : defaults;

  const masteredTotal = items.reduce((a, i) => a + i.mastered, 0);
  const countTotal = items.reduce((a, i) => a + i.count, 0);
  const overall = countTotal ? masteredTotal / countTotal : 0;
  const pct = Math.round(overall * 100);

  const bump = (name: string, delta: number) => {
    const next = items.map((item) =>
      item.name === name
        ? { ...item, mastered: Math.min(item.count, Math.max(0, item.mastered + delta)) }
        : item,
    );
    setStored(next.map(({ name: n, mastered }) => ({ name: n, mastered })));
  };

  return (
    <div>
      <div className="card mb-5 flex items-center gap-5 p-5">
        <RingProgress
          value={overall}
          size={78}
          stroke={6}
          center={`${pct}%`}
          label="算法总体进度"
        />
        <div>
          <div className="label-mono">ALGORITHM MASTERY</div>
          <div className="mt-1.5 font-mono text-sm text-print">
            已掌握 <span className="text-wire">{masteredTotal}</span>/{countTotal} 题
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map((algo) => {
        const progress = Math.round((algo.mastered / algo.count) * 100);
        return (
          <div
            key={algo.name}
            className="card card-hover p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display font-medium text-foreground">{algo.name}</h3>
              <span className="text-xs text-print">
                {algo.mastered}/{algo.count}
              </span>
            </div>
            <div className="mb-3 h-2 rounded-full bg-hair">
              <div
                className="h-full rounded-full bg-wire transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => bump(algo.name, -1)}
                className="flex-1 rounded-md border border-hair py-1 text-xs text-print transition-colors hover:border-wire hover:text-wire"
                aria-label={`减少 ${algo.name} 已掌握`}
              >
                −
              </button>
              <button
                type="button"
                onClick={() => bump(algo.name, 1)}
                className="flex-1 rounded-md border border-hair py-1 text-xs text-print transition-colors hover:border-wire hover:text-wire"
                aria-label={`增加 ${algo.name} 已掌握`}
              >
                +
              </button>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}
