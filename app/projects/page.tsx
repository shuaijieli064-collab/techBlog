import { GitBranch, Calendar, CheckCircle2, Circle } from "lucide-react";

const projects = [
  {
    id: "study-assistant",
    title: "学习助手",
    description: "基于 AI 的智能学习规划助手，支持学习路线生成、复习提醒、知识掌握度追踪",
    tech: ["Java", "Spring Boot", "MySQL", "Redis", "Vue", "AI"],
    status: "developing" as const,
    progress: 40,
    github: "#",
    startDate: "2026-08",
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
    tech: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    status: "developing" as const,
    progress: 30,
    github: "#",
    startDate: "2026-09",
    todos: [
      { text: "Dashboard", done: true },
      { text: "博客系统", done: true },
      { text: "项目管理", done: false },
      { text: "学习中心", done: false },
      { text: "AI Center", done: false },
    ],
  },
  {
    id: "algorithm-tracker",
    title: "算法练习追踪",
    description: "记录算法学习进度、错题本、复习计划，支持按题型和难度分类",
    tech: ["TypeScript", "LocalStorage"],
    status: "completed" as const,
    progress: 100,
    github: "#",
    startDate: "2026-07",
    todos: [
      { text: "题目分类", done: true },
      { text: "进度追踪", done: true },
      { text: "错题本", done: true },
    ],
  },
];

const statusMap = {
  planning: { label: "Planning", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  developing: { label: "Developing", color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" },
  testing: { label: "Testing", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  completed: { label: "Completed", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  archived: { label: "Archived", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400" },
};

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Projects</p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">项目中心</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          我的个人项目与开源实践，记录从想法到实现的完整过程。
        </p>
      </div>

      <div className="space-y-8">
        {projects.map((project) => {
          const status = statusMap[project.status];
          const completedTodos = project.todos.filter((t) => t.done).length;

          return (
            <article
              key={project.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950 sm:p-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{project.title}</h2>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-base text-slate-600 dark:text-slate-300">{project.description}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>{project.startDate}</span>
                  </div>
                  {project.github && (
                    <a href={project.github} className="flex items-center gap-1.5 hover:text-sky-600 dark:hover:text-sky-400">
                      <GitBranch size={14} />
                      <span>GitHub</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400">进度</span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{project.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-sky-500 transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">技术栈</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span key={t} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">TODO</h3>
                  <span className="text-xs text-slate-400">{completedTodos}/{project.todos.length}</span>
                </div>
                <div className="space-y-2">
                  {project.todos.map((todo, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      {todo.done ? (
                        <CheckCircle2 size={16} className="text-sky-500" />
                      ) : (
                        <Circle size={16} className="text-slate-300 dark:text-slate-600" />
                      )}
                      <span className={`text-sm ${todo.done ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                        {todo.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
