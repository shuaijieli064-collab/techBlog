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
    <div className="flex flex-col items-center justify-center rounded-[4px] border border-dashed border-hair bg-panel/40 px-6 py-16 text-center">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[4px] border border-hair">
        <Inbox size={18} className="text-muted" />
      </div>
      <p className="font-mono text-[11px] tracking-[0.14em] text-muted">NO DATA</p>
      <p className="mt-2 text-base font-semibold text-foreground">{title}</p>
      <p className="mt-1.5 max-w-sm text-sm leading-6 text-print">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
