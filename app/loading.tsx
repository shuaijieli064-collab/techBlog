export default function Loading() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      aria-busy="true"
      className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8"
    >
      {/* page header skeleton */}
      <div className="mb-10 space-y-3">
        <div className="skeleton h-3 w-24 rounded-full" />
        <div className="skeleton h-8 w-64 rounded-md" />
        <div className="skeleton h-4 w-full max-w-md rounded-md" />
      </div>

      {/* content grid skeleton — mirrors the dashboard/list layouts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="skeleton h-32 rounded-lg" />
          <div className="card p-6">
            <div className="skeleton mb-4 h-4 w-28 rounded-md" />
            <div className="space-y-3">
              <div className="skeleton h-12 rounded-md" />
              <div className="skeleton h-12 rounded-md" />
              <div className="skeleton h-12 rounded-md" />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="card p-6">
            <div className="skeleton mb-4 h-4 w-24 rounded-md" />
            <div className="grid grid-cols-2 gap-3">
              <div className="skeleton h-20 rounded-md" />
              <div className="skeleton h-20 rounded-md" />
              <div className="skeleton h-20 rounded-md" />
              <div className="skeleton h-20 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
