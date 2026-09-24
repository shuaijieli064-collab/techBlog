import { Inbox } from "lucide-react";

export function EmptyState({
  title = "暂无内容",
  description = "换个筛选条件，或稍后再来看看。",
  action,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/50 py-16 text-center dark:border-slate-700 dark:bg-slate-950/40">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900">
        <Inbox size={22} className="text-slate-400" />
      </div>
      <p className="text-base font-semibold text-slate-700 dark:text-slate-200">{title}</p>
      <p className="mt-1.5 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
