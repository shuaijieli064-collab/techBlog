export default function Loading() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-4 py-16">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-wire dark:border-slate-700 dark:border-t-wire" />
        <p className="text-sm text-slate-500 dark:text-slate-400">加载中…</p>
      </div>
    </main>
  );
}
