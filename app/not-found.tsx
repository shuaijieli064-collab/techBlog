import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4 py-16">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-wire">404</p>
        <h1 className="mt-4 text-4xl font-bold font-display text-foreground">页面没有找到</h1>
        <p className="mt-4 text-lg text-print">
          你访问的内容可能还没有发布，或者链接有些偏差。
        </p>
        <Link
          href="/"
          className="mt-8 btn-primary px-5 py-3"
        >
          返回首页
        </Link>
      </div>
    </main>
  );
}
