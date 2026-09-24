import Link from "next/link";

export default function KnowledgePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Knowledge Base</p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">个人知识库</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          个人知识库入口。
        </p>
      </div>
      <div className="grid gap-8">
        <div>
          <h2 className="text-xl font-medium text-slate-900 dark:text-slate-50">技术笔记</h2>
          <p>记录技术点、实践过程和心得体会。<br/>点击 <Link href="/posts" className="text-sm text-sky-600 hover:text-sky-500">查看相关博客</Link>。</p>
        </div>
        <div>
          <h2 className="text-xl font-medium text-slate-900 dark:text-slate-50">学习笔记</h2>
          <p>系统化学习路线和知识体系记录。</p>
          <Link href="/learning" className="text-sm text-sky-600 hover:text-sky-500">进入学习中心</Link>
        </div>
        <div>
          <h2 className="text-xl font-medium text-slate-900 dark:text-slate-50">面试题库</h2>
          <p>常见面试题目和答案收集。</p>
        </div>
        <div>
          <h2 className="text-xl font-medium text-slate-900 dark:text-slate-50">常用命令</h2>
          <p>日常开发常用的 shell 命令和技巧。</p>
        </div>
      </div>
    </main>
  );
}