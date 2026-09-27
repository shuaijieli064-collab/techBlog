"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Code, Database, Server, Globe } from "lucide-react";

type RoadmapData = {
  roadmap: Array<{
    category: string;
    items: string[];
    defaults: boolean[];
  }>;
  algorithms: Array<{ name: string; count: number; mastered: number }>;
};

const iconByCategory: Record<string, React.ElementType> = {
  "Java 基础": Code,
  "后端框架": Server,
  数据库: Database,
  计算机基础: Globe,
};

const colorByCategory: Record<string, { color: string; bg: string }> = {
  "Java 基础": { color: "text-wire", bg: "bg-wire/10" },
  "后端框架": { color: "text-wire", bg: "bg-wire/10" },
  数据库: { color: "text-wire", bg: "bg-wire/10" },
  计算机基础: { color: "text-wire", bg: "bg-wire/10" },
};

const defaultData: RoadmapData = {
  roadmap: [
    {
      category: "Java 基础",
      items: ["面向对象", "集合框架", "异常处理", "IO流", "多线程", "JVM"],
      defaults: [true, true, true, true, false, false],
    },
    {
      category: "后端框架",
      items: ["Spring", "Spring Boot", "MyBatis", "Spring Security", "微服务"],
      defaults: [true, true, false, false, false],
    },
    {
      category: "数据库",
      items: ["MySQL 基础", "SQL 优化", "事务与锁", "Redis"],
      defaults: [true, true, false, false],
    },
    {
      category: "计算机基础",
      items: ["数据结构", "算法", "操作系统", "计算机网络"],
      defaults: [true, false, false, false],
    },
  ],
  algorithms: [
    { name: "数组", count: 12, mastered: 8 },
    { name: "字符串", count: 8, mastered: 5 },
    { name: "双指针", count: 5, mastered: 3 },
    { name: "滑动窗口", count: 4, mastered: 2 },
    { name: "链表", count: 6, mastered: 3 },
    { name: "栈/队列", count: 5, mastered: 3 },
    { name: "哈希", count: 7, mastered: 4 },
    { name: "二叉树", count: 8, mastered: 4 },
    { name: "DFS/BFS", count: 6, mastered: 3 },
    { name: "回溯", count: 5, mastered: 2 },
    { name: "动态规划", count: 10, mastered: 4 },
    { name: "贪心", count: 4, mastered: 2 },
  ],
};

const STORAGE_KEY = "learning:mastered:v1";

function loadMastered(): boolean[][] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as boolean[][];
    if (!Array.isArray(parsed) || parsed.length !== defaultData.roadmap.length) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function LearningRoadmap() {
  const [mastered, setMastered] = useState<boolean[][]>(
    defaultData.roadmap.map((s) => s.defaults),
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = loadMastered();
      if (saved) setMastered(saved);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const toggle = (sectionIdx: number, itemIdx: number) => {
    setMastered((prev) => {
      const next = prev.map((row, i) =>
        i === sectionIdx ? row.map((v, j) => (j === itemIdx ? !v : v)) : row,
      );
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {defaultData.roadmap.map((section, sectionIdx) => {
        const Icon = iconByCategory[section.category] ?? Code;
        const colors = colorByCategory[section.category] ?? colorByCategory["Java 基础"];
        const flags = mastered[sectionIdx] ?? section.defaults;
        const masteredCount = flags.filter(Boolean).length;
        const progress = Math.round((masteredCount / section.items.length) * 100);

        return (
          <div
            key={section.category}
            className="card p-6"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center ${colors.bg}`}>
                <Icon size={20} className={colors.color} />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-foreground">{section.category}</h3>
                <p className="text-xs text-print">
                  {masteredCount}/{section.items.length} 已掌握
                </p>
              </div>
              <span className="text-sm font-medium text-foreground">{progress}%</span>
            </div>
            <div className="mb-4 h-2 rounded-full bg-hair">
              <div
                className={`h-full rounded-full transition-all duration-500 ${colors.color.replace("text-", "bg-")}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="space-y-2">
              {section.items.map((item, itemIdx) => {
                const done = flags[itemIdx];
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggle(sectionIdx, itemIdx)}
                    className="flex w-full items-center gap-2.5 px-1 py-1 text-left transition-colors hover:bg-raise"
                    aria-pressed={done}
                  >
                    {done ? (
                      <CheckCircle2 size={16} className="text-wire" />
                    ) : (
                      <Circle size={16} className="text-muted" />
                    )}
                    <span
                      className={`text-sm ${
                        done
                          ? "text-print"
                          : "text-foreground"
                      }`}
                    >
                      {item}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
