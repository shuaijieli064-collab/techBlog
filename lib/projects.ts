export type ProjectStatus = "planning" | "developing" | "testing" | "completed" | "archived";

export type Project = {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tech: string[];
  status: ProjectStatus;
  progress: number;
  github: string;
  demo?: string;
  docs?: string;
  startDate: string;
  highlights: string[];
  todos: Array<{ text: string; done: boolean }>;
};

export const statusMap: Record<
  ProjectStatus,
  { label: string; color: string }
> = {
  planning: {
    label: "Planning",
    color: "border border-hair bg-background text-print",
  },
  developing: {
    label: "Developing",
    color: "border border-hair bg-background text-print",
  },
  testing: {
    label: "Testing",
    color: "border border-hair bg-background text-print",
  },
  completed: {
    label: "Completed",
    color: "border border-hair bg-background text-print",
  },
  archived: {
    label: "Archived",
    color: "border border-hair bg-background text-print",
  },
};

export const projects: Project[] = [
  {
    id: "study-assistant",
    title: "学习助手",
    description: "基于 AI 的智能学习规划助手，支持学习路线生成、复习提醒、知识掌握度追踪",
    longDescription:
      "面向学生日常学习的规划工具：把课程目标拆成可执行任务，用间隔复习巩固薄弱点，并用掌握度面板反馈进度。后端采用 Spring Boot 三层架构，缓存热点学习计划，前端用 Vue 展示进度看板。",
    tech: ["Java", "Spring Boot", "MySQL", "Redis", "Vue", "AI"],
    status: "developing",
    progress: 40,
    github: "https://github.com",
    startDate: "2026-08",
    highlights: [
      "学习计划生成与每日任务推送",
      "知识点掌握度打分与复习提醒",
      "Redis 缓存热门计划，降低 DB 压力",
    ],
    todos: [
      { text: "用户系统", done: true },
      { text: "AI 对话", done: true },
      { text: "学习计划", done: false },
      { text: "数据统计", done: false },
      { text: "部署上线", done: false },
    ],
  },
  {
    id: "tech-blog",
    title: "开发者工作台",
    description: "集博客、项目管理、学习管理、知识库、AI工具于一体的个人开发者平台",
    longDescription:
      "个人 Developer OS：博客写作与检索、项目/学习/成长看板、知识库与工具箱统一入口。使用 Next.js App Router 与 Tailwind，交互状态先走 localStorage，后续平滑切换到 Supabase。",
    tech: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    status: "developing",
    progress: 75,
    github: "https://github.com",
    demo: "/",
    startDate: "2026-09",
    highlights: [
      "博客搜索 / TOC / 代码高亮 / 点赞阅读量",
      "Dashboard、学习、成长本地持久化交互",
      "AI Center：Models / Agents / Prompts",
      "13+ 浏览器端开发小工具",
    ],
    todos: [
      { text: "Dashboard", done: true },
      { text: "博客系统", done: true },
      { text: "项目管理", done: true },
      { text: "学习中心", done: true },
      { text: "AI Center", done: true },
      { text: "Supabase 接入", done: false },
    ],
  },
  {
    id: "algorithm-tracker",
    title: "算法练习追踪",
    description: "记录算法学习进度、错题本、复习计划，支持按题型和难度分类",
    longDescription:
      "轻量算法进度板：按题型统计已掌握数量，支持本地错题本与复习次数。数据先存浏览器，方便无后端场景快速迭代。",
    tech: ["TypeScript", "LocalStorage"],
    status: "completed",
    progress: 100,
    github: "https://github.com",
    startDate: "2026-07",
    highlights: ["题目分类统计", "进度追踪", "错题本与复习提醒"],
    todos: [
      { text: "题目分类", done: true },
      { text: "进度追踪", done: true },
      { text: "错题本", done: true },
    ],
  },
];

export function getProjectById(id: string) {
  return projects.find((p) => p.id === id);
}
