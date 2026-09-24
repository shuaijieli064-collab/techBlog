"use client";

import { useEffect, useState } from "react";
import type { Skill } from "@/lib/growth";
import { skills as defaultSkills } from "@/lib/growth";

const STORAGE_KEY = "growth:skill-levels:v1";

export function SkillLevels() {
  const [levels, setLevels] = useState<Record<string, number>>(
    Object.fromEntries(defaultSkills.map((s) => [s.name, s.level])),
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw) as Record<string, number>;
        if (parsed && typeof parsed === "object") {
          setLevels((prev) => ({ ...prev, ...parsed }));
        }
      } catch {
        /* ignore */
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const update = (name: string, level: number) => {
    const clamped = Math.min(100, Math.max(0, level));
    setLevels((prev) => {
      const next = { ...prev, [name]: clamped };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {defaultSkills.map((skill: Skill) => {
        const level = levels[skill.name] ?? skill.level;
        return (
          <div
            key={skill.name}
            className="rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-900 dark:text-slate-50">{skill.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{skill.category}</div>
              </div>
              <span className="text-lg font-bold text-sky-600">{level}%</span>
            </div>
            <div className="mb-3 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full rounded-full ${skill.color} transition-all duration-500`}
                style={{ width: `${level}%` }}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => update(skill.name, level - 5)}
                className="flex-1 rounded-lg border border-slate-200 py-1 text-xs text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300"
                aria-label={`降低 ${skill.name}`}
              >
                −5%
              </button>
              <button
                type="button"
                onClick={() => update(skill.name, level + 5)}
                className="flex-1 rounded-lg border border-slate-200 py-1 text-xs text-slate-600 hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:text-slate-300"
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
