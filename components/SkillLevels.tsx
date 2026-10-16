"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import type { Skill } from "@/lib/growth";
import { skills as defaultSkills, defaultSkillLevels } from "@/lib/growth";
import { useWorkspace } from "@/lib/workspace/client";

export function SkillLevels() {
  const [stored, setLevels] = useWorkspace<Record<string, number>>(
    "skill-levels",
    defaultSkillLevels,
  );
  const [name, setName] = useState("");

  const levels =
    stored && typeof stored === "object" && !Array.isArray(stored) ? stored : defaultSkillLevels;

  const update = (skill: string, level: number) => {
    const clamped = Math.min(100, Math.max(0, level));
    setLevels({ ...levels, [skill]: clamped });
  };

  const addCustom = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (Object.prototype.hasOwnProperty.call(levels, trimmed)) return;
    setLevels({ ...levels, [trimmed]: 50 });
    setName("");
  };

  const removeCustom = (skill: string) => {
    const next = { ...levels };
    delete next[skill];
    setLevels(next);
  };

  const customNames = Object.keys(levels).filter(
    (k) => !defaultSkills.some((s) => s.name === k),
  );

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addCustom();
          }}
          placeholder="新增自定义技能…"
          className="input-base flex-1"
          aria-label="新技能名称"
        />
        <button type="button" onClick={addCustom} className="btn-primary btn-sm gap-1.5">
          <Plus size={14} /> 添加
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {defaultSkills.map((skill: Skill) => {
          const level = levels[skill.name] ?? skill.level;
          return (
            <div key={skill.name} className="card card-hover p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="font-display font-medium text-foreground">{skill.name}</div>
                  <div className="text-xs text-print">{skill.category}</div>
                </div>
                <span className="text-lg font-bold text-wire">{level}%</span>
              </div>
              <div className="mb-3 h-2 rounded-full bg-hair">
                <div
                  className={`h-full ${skill.color} transition-all duration-500`}
                  style={{ width: `${level}%` }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => update(skill.name, level - 5)}
                  className="flex-1 rounded-md border border-hair py-1 text-xs text-print transition-colors hover:border-wire hover:text-wire"
                  aria-label={`降低 ${skill.name}`}
                >
                  −5%
                </button>
                <button
                  type="button"
                  onClick={() => update(skill.name, level + 5)}
                  className="flex-1 rounded-md border border-hair py-1 text-xs text-print hover:border-wire hover:text-wire"
                  aria-label={`提高 ${skill.name}`}
                >
                  +5%
                </button>
              </div>
            </div>
          );
        })}

        {customNames.map((skillName) => {
          const level = levels[skillName] ?? 50;
          return (
            <div key={skillName} className="card card-hover border-dashed p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="font-display font-medium text-foreground">{skillName}</div>
                  <div className="text-xs text-print">自定义</div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-wire">{level}%</span>
                  <button
                    type="button"
                    onClick={() => removeCustom(skillName)}
                    className="p-1 text-muted transition-colors hover:bg-alert/10 hover:text-alert"
                    aria-label={`删除技能 ${skillName}`}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div className="mb-3 h-2 rounded-full bg-hair">
                <div
                  className="h-full rounded-full bg-wire transition-all duration-500"
                  style={{ width: `${level}%` }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => update(skillName, level - 5)}
                  className="flex-1 rounded-md border border-hair py-1 text-xs text-print transition-colors hover:border-wire hover:text-wire"
                  aria-label={`降低 ${skillName}`}
                >
                  −5%
                </button>
                <button
                  type="button"
                  onClick={() => update(skillName, level + 5)}
                  className="flex-1 rounded-md border border-hair py-1 text-xs text-print hover:border-wire hover:text-wire"
                  aria-label={`提高 ${skillName}`}
                >
                  +5%
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
