import { Inbox } from "lucide-react";

export function EmptyState({
  title = "暂无内容",
  description = "换个筛选条件，或稍后再来看看。",
  action,
  icon,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-hair bg-panel/40 px-6 py-16 text-center">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-hair text-muted">
        {icon ?? <Inbox size={18} />}
      </div>
      <p className="font-mono text-[11px] tracking-[0.14em] text-muted">NO SIGNAL</p>
      <p className="mt-2 text-base font-semibold text-foreground">{title}</p>
      <p className="mt-1.5 max-w-sm text-sm leading-6 text-print">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
