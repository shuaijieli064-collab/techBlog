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
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700">
      <Inbox size={40} className="mb-4 text-slate-400" />
      <p className="text-lg font-medium text-slate-700 dark:text-slate-200">{title}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
