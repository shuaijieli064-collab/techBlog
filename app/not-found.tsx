import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4 py-16">
      <div className="text-center">
        <p className="page-eyebrow">404</p>
        <h1 className="page-title mt-4">页面没有找到</h1>
        <p className="page-desc mx-auto">
          你访问的内容可能还没有发布，或者链接有些偏差。
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Link href="/" className="btn-primary">
            返回首页
          </Link>
          <Link href="/posts" className="btn-secondary">
            浏览文章
          </Link>
        </div>
        <form action="/search" method="get" className="mt-10 max-w-md mx-auto text-left">
          <label htmlFor="not-found-search" className="label-mono mb-3 block">
            全局搜索
          </label>
          <div className="flex gap-2">
            <input
              id="not-found-search"
              type="search"
              name="q"
              placeholder="搜索文章、笔记、函数…"
              className="input-base"
            />
            <button type="submit" className="btn-secondary shrink-0">
              搜索
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
