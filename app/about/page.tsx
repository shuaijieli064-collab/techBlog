import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于我",
  description: "我是林晨，一名软件工程学生，关注前端开发、算法与工程实践。",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="card p-8 sm:p-10">
        <p className="page-eyebrow">关于我</p>
        <h1 className="page-title">我是林晨，一名软件工程学生</h1>

        <div className="mt-8 space-y-6 text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-300">
          <p>
            我正在学习软件工程，关注前端开发、计算机基础和工程实践。这个博客的目标，是把我的学习心得、项目经验和复盘记录沉淀下来，形成一个长期积累的技术作品。
          </p>
          <p>
            目前我最感兴趣的方向包括前端开发、算法学习、产品思维和技术写作。我希望通过持续输出，把零散的知识整理成自己的理解，并把它转化为项目能力。
          </p>
          <p>
            这个站点不追求华丽的呈现，而更注重真实、有价值的内容和持续迭代。它是我成长过程中的一个小型技术档案，也希望它能被看到、被使用、被不断更新。
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { label: "关注方向", value: "前端 / 算法 / 工程" },
            { label: "当前阶段", value: "大二在读" },
            { label: "目标", value: "持续输出与成长" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-900">
              <div className="text-sm text-slate-500 dark:text-slate-400">{item.label}</div>
              <div className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
