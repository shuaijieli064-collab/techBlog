"use client";

import type { Skill } from "@/lib/growth";
import { skills as defaultSkills } from "@/lib/growth";
import { useWorkspace } from "@/lib/workspace/client";

const defaultLevels: Record<string, number> = Object.fromEntries(
  defaultSkills.map((s) => [s.name, s.level]),
);

export function SkillLevels() {
  const [stored, setLevels] = useWorkspace<Record<string, number>>(
    "skill-levels",
    defaultLevels,
  );

  const levels =
    stored && typeof stored === "object" && !Array.isArray(stored) ? stored : defaultLevels;

  const update = (name: string, level: number) => {
    const clamped = Math.min(100, Math.max(0, level));
    setLevels({ ...levels, [name]: clamped });
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {defaultSkills.map((skill: Skill) => {
        const level = levels[skill.name] ?? skill.level;
        return (
          <div
            key={skill.name}
            className="card card-hover p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="font-display font-medium text-foreground">{skill.name}</div>
                <div className="text-xs text-print">{skill.category}</div>
              </div>
              <span className="text-lg font-bold text-wire">{level}%</span>
            </div>
            <div className="mb-3 h-2 rounded-full bg-hair">
              <div
                className={`h-full rounded-full ${skill.color} transition-all duration-500`}
                style={{ width: `${level}%` }}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => update(skill.name, level - 5)}
                className="flex-1 border border-hair py-1 text-xs text-print"
                aria-label={`降低 ${skill.name}`}
              >
                −5%
              </button>
              <button
                type="button"
                onClick={() => update(skill.name, level + 5)}
                className="flex-1 border border-hair py-1 text-xs text-print hover:border-wire hover:text-wire"
                aria-label={`提高 ${skill.name}`}
              >
                +5%
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
