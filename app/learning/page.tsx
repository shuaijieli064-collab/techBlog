import { CheckCircle2, Circle, Code, Database, Server, Globe } from "lucide-react";

const roadmap = [
  {
    category: "Java 基础",
    icon: Code,
    color: "text-sky-600",
    bgColor: "bg-sky-50 dark:bg-sky-900/30",
    items: [
      { name: "面向对象", mastered: true },
      { name: "集合框架", mastered: true },
      { name: "异常处理", mastered: true },
      { name: "IO流", mastered: true },
      { name: "多线程", mastered: false },
      { name: "JVM", mastered: false },
    ],
  },
  {
    category: "后端框架",
    icon: Server,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/30",
    items: [
      { name: "Spring", mastered: true },
      { name: "Spring Boot", mastered: true },
      { name: "MyBatis", mastered: false },
      { name: "Spring Security", mastered: false },
      { name: "微服务", mastered: false },
    ],
  },
  {
    category: "数据库",
    icon: Database,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/30",
    items: [
      { name: "MySQL 基础", mastered: true },
      { name: "SQL 优化", mastered: true },
      { name: "事务与锁", mastered: false },
      { name: "Redis", mastered: false },
    ],
  },
  {
    category: "计算机基础",
    icon: Globe,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/30",
    items: [
      { name: "数据结构", mastered: true },
      { name: "算法", mastered: false },
      { name: "操作系统", mastered: false },
      { name: "计算机网络", mastered: false },
    ],
  },
];

const algorithms = [
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
];

export default function LearningPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Learning</p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">学习中心</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          系统化学习路径与算法练习追踪，记录每一步成长。
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-6">学习路线图</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {roadmap.map((section) => {
            const masteredCount = section.items.filter((i) => i.mastered).length;
            const progress = Math.round((masteredCount / section.items.length) * 100);

            return (
              <div key={section.category} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${section.bgColor}`}>
                    <section.icon size={20} className={section.color} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-50">{section.category}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{masteredCount}/{section.items.length} 已掌握</p>
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                  <div className={`h-full rounded-full transition-all duration-500 ${section.color.replace('text-', 'bg-')}`} style={{ width: `${progress}%` }} />
                </div>
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <div key={item.name} className="flex items-center gap-2.5">
                      {item.mastered ? (
                        <CheckCircle2 size={16} className="text-sky-500" />
                      ) : (
                        <Circle size={16} className="text-slate-300 dark:text-slate-600" />
                      )}
                      <span className={`text-sm ${item.mastered ? 'text-slate-500 dark:text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-6">算法练习</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {algorithms.map((algo) => {
            const progress = Math.round((algo.mastered / algo.count) * 100);
            return (
              <div key={algo.name} className="rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-slate-900 dark:text-slate-50">{algo.name}</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{algo.mastered}/{algo.count}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-purple-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
