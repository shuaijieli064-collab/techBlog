"use client";

import { useMemo, useState } from "react";
import { Archive, CheckCircle2, Inbox, RotateCcw, Trash2, Zap } from "lucide-react";

import { defaultDailyTasks, type DailyTask } from "@/components/DailyTasks";import { SectionRule } from "@/components/SectionRule";
import { useWorkspace } from "@/lib/workspace/client";

export type BoardTask = {
  id: string;
  title: string;
  tag: string;
  priority: 0 | 1 | 2;
  status: "backlog" | "today" | "done";
  createdAt: string;
};

const priorityLabel: Record<number, { label: string; cls: string }> = {
  0: { label: "普通", cls: "text-muted" },
  1: { label: "重要", cls: "text-signal" },
  2: { label: "紧急", cls: "text-alert" },
};

const statusOrder: Array<BoardTask["status"]> = ["backlog", "today", "done"];
const statusTitle: Record<BoardTask["status"], string> = {
  backlog: "待办",
  today: "今日",
  done: "已完成",
};

function sameTask(a: { title: string; tag: string }, b: { title: string; tag: string }) {
  return a.title === b.title && a.tag === b.tag;
}

export function TaskBoard() {
  const [board, setBoard] = useWorkspace<BoardTask[]>("task-board", []);
  const [daily, setDaily] = useWorkspace<DailyTask[]>("daily-tasks", defaultDailyTasks);
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [priority, setPriority] = useState<0 | 1 | 2>(0);

  const tasks = useMemo(() => (Array.isArray(board) ? board : []), [board]);
  const dailyTasks = useMemo(
    () => (Array.isArray(daily) ? daily : defaultDailyTasks),
    [daily],
  );

  const add = () => {
    const t = title.trim();
    if (!t) return;
    const item: BoardTask = {
      id: `tb-${Date.now()}`,
      title: t,
      tag: tag.trim() || "自定义",
      priority,
      status: "backlog",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setBoard([item, ...tasks]);
    setTitle("");
    setTag("");
    setPriority(0);
  };

  const moveToToday = (task: BoardTask) => {
    if (task.status === "today") return;
    const exists = dailyTasks.some((d) => sameTask(d, task));
    const nextDaily = exists
      ? dailyTasks
      : [
          ...dailyTasks,
          {
            id: dailyTasks.reduce((max, d) => Math.max(max, d.id), 0) + 1,
            title: task.title,
            tag: task.tag,
            done: false,
          },
        ];
    setDaily(nextDaily);
    setBoard(tasks.map((t) => (t.id === task.id ? { ...t, status: "today" } : t)));
  };

  const complete = (task: BoardTask) => {
    setDaily(
      dailyTasks.map((d) =>
        sameTask(d, task) && !d.done ? { ...d, done: true } : d,
      ),
    );
    setBoard(tasks.map((t) => (t.id === task.id ? { ...t, status: "done" } : t)));
  };

  const restore = (task: BoardTask) => {
    setDaily(dailyTasks.filter((d) => !sameTask(d, task)));
    setBoard(tasks.map((t) => (t.id === task.id ? { ...t, status: "backlog" } : t)));
  };

  const remove = (task: BoardTask) => {
    if (task.status === "today") {
      setDaily(dailyTasks.filter((d) => !sameTask(d, task)));
    }
    setBoard(tasks.filter((t) => t.id !== task.id));
  };

  const groups = useMemo(
    () =>
      statusOrder.map((status) => ({
        status,
        items: tasks.filter((t) => t.status === status),
      })),
    [tasks],
  );

  const counts = {
    backlog: groups[0].items.length,
    today: groups[1].items.length,
    done: groups[2].items.length,
  };

  return (
    <div id="task-board" className="card p-6">
      <SectionRule
        title="任务箱"
        meta={`${counts.today} 今日 · ${counts.backlog} 待办 · ${counts.done} 完成`}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") add();
          }}
          placeholder="新任务，回车加入待办…"
          className="input-base min-w-0 flex-1"
          aria-label="任务箱新任务"
        />
        <input
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="标签"
          className="input-base w-24"
          aria-label="任务箱标签"
        />
        <div className="flex items-center gap-1" role="group" aria-label="优先级">
          {([0, 1, 2] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              aria-pressed={priority === p}
              className={`rounded-full border px-2 py-1.5 font-mono text-[11px] transition-colors ${
                priority === p
                  ? "border-wire bg-wire/10 text-wire"
                  : "border-hair text-muted hover:text-print"
              }`}
            >
              {priorityLabel[p].label}
            </button>
          ))}
        </div>
        <button type="button" onClick={add} className="btn-primary">
          加入
        </button>
      </div>

      <div className="space-y-5">
        {groups.map((group) => (
          <div key={group.status}>
            <div className="mb-2 flex items-center gap-2">
              {group.status === "backlog" && <Inbox size={13} className="text-muted" />}
              {group.status === "today" && <Zap size={13} className="text-wire" />}
              {group.status === "done" && <Archive size={13} className="text-muted" />}
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-print">
                {statusTitle[group.status]}
              </span>
              <span className="font-mono text-[11px] text-muted">{group.items.length}</span>
            </div>

            {group.items.length === 0 && (
              <p className="rounded-md border border-dashed border-hair px-3 py-2.5 font-mono text-xs text-muted">
                {"//"} {group.status === "done" ? "还没有已完成的任务" : "暂无任务"}
              </p>
            )}

            <div className="space-y-1.5">
              {group.items.map((task) => {
                const pri = priorityLabel[task.priority];
                return (
                  <div
                    key={task.id}
                    className="group flex items-center gap-2.5 rounded-md border border-hair px-3 py-2 transition-colors hover:border-wire/60"
                  >
                    <span
                      aria-hidden
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        task.priority === 2
                          ? "bg-alert"
                          : task.priority === 1
                            ? "bg-signal"
                            : "bg-hair"
                      }`}
                    />
                    <span
                      className={`flex-1 truncate text-sm ${
                        task.status === "done"
                          ? "text-muted line-through"
                          : "text-foreground"
                      }`}
                    >
                      {task.title}
                    </span>
                    <span className="chip">{task.tag}</span>
                    <span className={`font-mono text-[10px] ${pri.cls}`}>{pri.label}</span>
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                      {task.status === "backlog" && (
                        <button
                          type="button"
                          onClick={() => moveToToday(task)}
                          className="p-1 text-wire hover:bg-wire/10"
                          aria-label="移到今日"
                          title="移到今日任务清单"
                        >
                          <Zap size={13} />
                        </button>
                      )}
                      {task.status === "today" && (
                        <button
                          type="button"
                          onClick={() => complete(task)}
                          className="p-1 text-wire hover:bg-wire/10"
                          aria-label="完成任务"
                          title="标记完成并同步今日清单"
                        >
                          <CheckCircle2 size={13} />
                        </button>
                      )}
                      {task.status === "done" && (
                        <button
                          type="button"
                          onClick={() => restore(task)}
                          className="p-1 text-muted hover:bg-raise hover:text-print"
                          aria-label="恢复任务"
                          title="恢复到待办"
                        >
                          <RotateCcw size={13} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => remove(task)}
                        className="p-1 text-muted transition-colors hover:bg-alert/10 hover:text-alert"
                        aria-label="删除任务"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
