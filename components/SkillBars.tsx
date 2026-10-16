"use client";

import { defaultSkillLevels, skills, type Skill } from "@/lib/growth";
import { useWorkspace } from "@/lib/workspace/client";

function normalize(input: Record<string, number>): Record<string, number> {
  if (!input || typeof input !== "object" || Array.isArray(input)) return defaultSkillLevels;
  return input;
}

export function SkillBars({ variant }: { variant: "dashboard" | "profile" }) {
  const [stored] = useWorkspace<Record<string, number>>("skill-levels", defaultSkillLevels);
  const levels = normalize(stored);
  const items: Skill[] = skills.map((s) => ({
    ...s,
    level: Math.min(100, Math.max(0, levels[s.name] ?? s.level)),
  }));

  if (variant === "profile") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.slice(0, 8).map((skill) => (
          <div key={skill.name}>
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="text-foreground">{skill.name}</span>
              <span className="text-xs text-print">{skill.level}%</span>
            </div>
            <div className="h-2  bg-hair">
              <div
                className={`h-full  ${skill.color} transition-all duration-500`}
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((skill) => (
        <div key={skill.name}>
          <div className="mb-1.5 flex justify-between font-mono text-xs">
            <span className="text-print">{skill.name}</span>
            <span className="text-muted">{skill.level}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-hair/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-wire to-violet transition-all duration-500 shadow-[0_0_8px_rgba(92,225,255,0.5)]"
              style={{ width: `${skill.level}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
