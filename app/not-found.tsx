import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-5xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid w-full gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">404</p>
          <h1 className="mt-4 text-4xl font-bold text-slate-900 dark:text-slate-50">页面没有找到</h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">你访问的内容可能还没有发布，或者链接地址有误。</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-500"
            >
              返回首页
            </Link>
            <Link
              href="/posts"
              className="inline-flex rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:text-slate-200"
            >
              浏览文章
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">你可以尝试：</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>• 在文章页使用搜索与筛选功能</li>
            <li>• 从标签页按专题查找内容</li>
            <li>• 从归档页按年份回看更新</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
