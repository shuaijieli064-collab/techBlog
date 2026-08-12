import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4 py-16">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">404</p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900 dark:text-slate-50">页面没有找到</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          你访问的内容可能还没有发布，或者链接有些偏差。
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-500"
        >
          返回首页
        </Link>
      </div>
    </main>
  );
}
