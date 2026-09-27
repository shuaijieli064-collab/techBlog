export default function Loading() {
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-4 py-16">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-hair border-t-wire" />
        <p className="text-sm text-print">加载中…</p>
      </div>
    </main>
  );
}
