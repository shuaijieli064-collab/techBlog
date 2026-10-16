export type GrowthEventType = "milestone" | "post" | "project" | "learning" | "achievement";

export interface GrowthEvent {
  id: string;
  date: string;
  type: GrowthEventType;
  title: string;
  description: string;
  tags: string[];
}

export type Skill = {
  name: string;
  level: number;
  color: string;
  category: string;
};

export const skills: Skill[] = [
  { name: "Java", level: 80, color: "bg-wire", category: "语言" },
  { name: "算法", level: 50, color: "bg-wire", category: "计算机基础" },
  { name: "Spring", level: 30, color: "bg-wire", category: "框架" },
  { name: "MySQL", level: 60, color: "bg-wire", category: "数据库" },
  { name: "Git", level: 70, color: "bg-wire", category: "工程" },
  { name: "AI 工具", level: 80, color: "bg-wire", category: "工具" },
  { name: "数据结构", level: 65, color: "bg-wire", category: "计算机基础" },
  { name: "前端", level: 55, color: "bg-wire", category: "语言" },
];

export const defaultSkillLevels: Record<string, number> = Object.fromEntries(
  skills.map((s) => [s.name, s.level]),
);

export const growthEvents: GrowthEvent[] = [
  {
    id: "1",
    date: "2026-09-20",
    type: "milestone",
    title: "个人工作台上线",
    description: "完成 Developer Workspace 核心页面：Dashboard、项目中心、学习中心、AI Center。",
    tags: ["里程碑", "全栈"],
  },
  {
    id: "2",
    date: "2026-09-15",
    type: "post",
    title: "发布《HashMap 源码分析》",
    description: "整理 Java 集合框架底层实现，深入理解红黑树与扩容机制。",
    tags: ["博客", "Java"],
  },
  {
    id: "3",
    date: "2026-09-10",
    type: "project",
    title: "学习助手项目 v1.0",
    description: "完成项目第一个可用版本，支持学习计划管理和进度追踪。",
    tags: ["项目", "Spring Boot"],
  },
  {
    id: "4",
    date: "2026-09-01",
    type: "learning",
    title: "完成数据结构课程",
    description: "系统学习线性表、树、图、排序与查找，配套刷题 80+。",
    tags: ["学习", "数据结构"],
  },
  {
    id: "5",
    date: "2026-08-25",
    type: "achievement",
    title: "连续学习 30 天",
    description: "保持每日学习打卡，累计学习时长超过 60 小时。",
    tags: ["成就", "坚持"],
  },
  {
    id: "6",
    date: "2026-08-18",
    type: "post",
    title: "发布《第一次做网站的复盘》",
    description: "记录从零搭建个人网站的完整过程与踩坑总结。",
    tags: ["博客", "复盘"],
  },
  {
    id: "7",
    date: "2026-08-10",
    type: "learning",
    title: "开始算法专项训练",
    description: "建立 LeetCode 刷题节奏，覆盖数组、哈希、双指针等专题。",
    tags: ["学习", "算法"],
  },
  {
    id: "8",
    date: "2026-08-01",
    type: "milestone",
    title: "技术博客启动",
    description: "确立博客定位：记录软件工程学习、项目实践与成长复盘。",
    tags: ["里程碑", "博客"],
  },
];

export const typeLabels: Record<GrowthEventType, string> = {
  milestone: "里程碑",
  post: "文章",
  project: "项目",
  learning: "学习",
  achievement: "成就",
};

export const typeColors: Record<GrowthEventType, { bg: string; text: string; dot: string }> = {
  milestone: { bg: "bg-wire/10", text: "text-wire", dot: "bg-wire" },
  post: { bg: "bg-violet/10", text: "text-violet", dot: "bg-violet" },
  project: { bg: "bg-signal/10", text: "text-signal", dot: "bg-signal" },
  learning: { bg: "bg-wire/10", text: "text-wire", dot: "bg-wire" },
  achievement: { bg: "bg-alert/10", text: "text-alert", dot: "bg-alert" },
};

export type StudyRecord = {
  id: string;
  date: string;
  title: string;
  description: string;
  hours: number;
  topic: string;
};

function localIso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Seed records dated relative to `base` so a fresh visitor sees a believable
 * recent study chain instead of hardcoded dates that go stale immediately.
 * Entries: -1, -2, -4, -5 days (a realistic gap on day 3).
 */
export function makeSeedStudyRecords(base: Date = new Date()): StudyRecord[] {
  const template: Array<Omit<StudyRecord, "id" | "date">> = [
    {
      title: "ConcurrentHashMap 源码",
      description: "分段锁 → CAS + synchronized，理解 size 计算与扩容协同。",
      hours: 1.5,
      topic: "Java",
    },
    {
      title: "LeetCode 两数之和 / 三数之和",
      description: "哈希与双指针对比，整理时间复杂度笔记。",
      hours: 1,
      topic: "算法",
    },
    {
      title: "Spring Boot 自动配置",
      description: "梳理 @EnableAutoConfiguration 与 starter 加载链路。",
      hours: 2,
      topic: "后端",
    },
    {
      title: "MySQL 索引与执行计划",
      description: "EXPLAIN 关键列解读，回表与覆盖索引场景复盘。",
      hours: 1.5,
      topic: "数据库",
    },
  ];
  const offsets = [1, 2, 4, 5];
  return template.map((item, i) => {
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() - offsets[i]);
    return { id: `sr-${i + 1}`, date: localIso(d), ...item };
  });
}

/**
 * Consecutive study days ending today (or yesterday when today has no record
 * yet, so an unfinished day does not reset the streak).
 */
export function computeStreak(
  records: Array<{ date: string }>,
  today: Date = new Date(),
): number {
  const days = new Set(records.map((r) => r.date));
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!days.has(localIso(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  let streak = 0;
  while (days.has(localIso(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
