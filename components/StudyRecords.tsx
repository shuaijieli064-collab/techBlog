"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Clock, Pencil, Plus, Trash2, X } from "lucide-react";

import { makeSeedStudyRecords, type StudyRecord } from "@/lib/growth";
import { useWorkspace } from "@/lib/workspace/client";

const TOPICS = ["Java", "算法", "后端", "数据库", "前端", "工具", "其他"] as const;

type Editing = { id: string } | null;

function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function weekBounds(): { thisMonday: string; lastMonday: string } {
  const today = new Date();
  const day = (today.getDay() + 6) % 7; // 0 = Monday
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - day);
  const lastMonday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() - 7);
  return { thisMonday: isoDate(monday), lastMonday: isoDate(lastMonday) };
}

type GroupKey = "本周" | "上周" | "更早";

function groupKey(date: string, bounds: { thisMonday: string; lastMonday: string }): GroupKey {
  if (date >= bounds.thisMonday) return "本周";
  if (date >= bounds.lastMonday) return "上周";
  return "更早";
}

const groupOrder: GroupKey[] = ["本周", "上周", "更早"];

export function StudyRecords() {
  const seeds = useMemo(() => makeSeedStudyRecords(), []);
  const [stored, setRecords, ready] = useWorkspace<StudyRecord[]>("study-records", seeds);
  const records = useMemo(() => (Array.isArray(stored) ? stored : seeds), [stored, seeds]);

  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState<string>("Java");
  const [hours, setHours] = useState("1");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState<Editing>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("focus") === "record") {
      titleRef.current?.focus();
    }
  }, []);

  const bounds = useMemo(() => weekBounds(), []);

  const submit = () => {
    const t = title.trim();
    if (!t) return;
    if (editing) {
      setRecords(
        records.map((r) =>
          r.id === editing.id
            ? {
                ...r,
                title: t,
                description: description.trim(),
                hours: Number(hours) || 0,
                topic: topic.trim() || "其他",
              }
            : r,
        ),
      );
      setEditing(null);
    } else {
      const rec: StudyRecord = {
        id: `sr-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        title: t,
        description: description.trim(),
        hours: Number(hours) || 0,
        topic: topic.trim() || "其他",
      };
      setRecords([rec, ...records]);
    }
    setTitle("");
    setDescription("");
    setHours("1");
    setTopic("Java");
  };

  const cancelEdit = () => {
    setEditing(null);
    setTitle("");
    setDescription("");
    setHours("1");
    setTopic("Java");
  };

  const startEdit = (record: StudyRecord) => {
    setEditing({ id: record.id });
    setTitle(record.title);
    setTopic(record.topic);
    setHours(String(record.hours));
    setDescription(record.description);
    titleRef.current?.focus();
  };

  const remove = (id: string) => {
    if (editing?.id === id) setEditing(null);
    setRecords(records.filter((r) => r.id !== id));
  };

  const totalHours = records.reduce((s, r) => s + r.hours, 0);
  const weekHours = records
    .filter((r) => r.date >= bounds.thisMonday)
    .reduce((s, r) => s + r.hours, 0);
  const sorted = [...records].sort((a, b) =>
    a.date === b.date ? 0 : a.date < b.date ? 1 : -1,
  );
  const groups = groupOrder
    .map((g) => ({ key: g, items: sorted.filter((r) => groupKey(r.date, bounds) === g) }))
    .filter((g) => g.items.length > 0);

  if (!ready) {
    return (
      <div className="space-y-4" aria-busy>
        <div className="h-8 w-48 animate-pulse rounded-md border border-hair bg-panel" />
        <div className="h-32 animate-pulse rounded-lg border border-hair bg-panel" />
        <div className="h-24 animate-pulse rounded-lg border border-hair bg-panel" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
          学习记录
        </h2>
        <span className="flex items-center gap-3 text-sm text-print">
          <span className="flex items-center gap-1.5">
            <Clock size={14} /> 本周 {weekHours.toFixed(1)}h
          </span>
          <span className="font-mono text-xs text-muted">
            累计 {totalHours.toFixed(1)}h · {records.length} 条
          </span>
        </span>
      </div>

      <div className="card mb-6 p-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-[1fr_120px_100px_auto]">
          <input
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder="今天学了什么？"
            className="col-span-2 input-base md:col-span-1"
            aria-label="记录标题"
          />
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="input-base"
            aria-label="主题"
          >
            {TOPICS.map((t) => (
              <option key={t} value={t} className="bg-panel">
                {t}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="0.5"
            step="0.5"
            max="24"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="input-base"
            aria-label="小时"
          />
          <button
            type="button"
            onClick={submit}
            className="col-span-2 btn-primary gap-1.5 md:col-span-1"
          >
            {editing ? (
              <>
                <Check size={15} /> 保存
              </>
            ) : (
              <>
                <Plus size={15} /> 记录
              </>
            )}
          </button>
        </div>
        <div className="mt-3 flex gap-2">
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="一句话笔记（可选）…"
            className="w-full input-base"
            aria-label="笔记"
          />
          {editing && (
            <button
              type="button"
              onClick={cancelEdit}
              className="btn-secondary btn-xs shrink-0 gap-1"
              aria-label="取消编辑"
            >
              <X size={14} /> 取消
            </button>
          )}
        </div>
        {editing && (
          <p className="mt-2 font-mono text-[11px] text-signal">
            {"//"} 编辑中：保存将更新原记录的时间与主题之外的全部字段。
          </p>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 border-dashed p-10 text-center">
          <Clock size={20} className="text-muted" />
          <p className="font-mono text-sm text-print">
            {"//"} 还没有学习记录 — 用上方表单记录第一条吧。
          </p>
        </div>
      ) : (
        <div className="space-y-7">
          {groups.map((group) => (
            <div key={group.key}>
              <div className="mb-3 flex items-center gap-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-print">
                  {group.key}
                </span>
                <span className="font-mono text-[11px] text-muted">{group.items.length} 条</span>
                <span className="h-px flex-1 bg-hair" />
              </div>
              <div className="relative ml-3 border-l-2 border-hair pl-8">
                {group.items.map((record) => (
                  <div key={record.id} className="group relative mb-5 last:mb-0">
                    <span className="absolute -left-[41px] top-3 h-3.5 w-3.5 rounded-full border-2 border-panel bg-wire" />
                    <article
                      className={`card p-4 ${editing?.id === record.id ? "border-signal/60" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-print">
                            <time dateTime={record.date}>{record.date}</time>
                            <span className="bg-raise px-2 py-0.5">
                              {record.topic}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={11} /> {record.hours}h
                            </span>
                          </div>
                          <h3 className="font-display font-semibold text-foreground">
                            {record.title}
                          </h3>
                          {record.description && (
                            <p className="mt-1 text-sm text-print">{record.description}</p>
                          )}
                        </div>
                        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                          <button
                            type="button"
                            onClick={() => startEdit(record)}
                            className="p-1.5 text-muted transition-colors hover:bg-wire/10 hover:text-wire"
                            aria-label="编辑记录"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(record.id)}
                            className="p-1.5 text-muted transition-colors hover:bg-alert/10 hover:text-alert"
                            aria-label="删除记录"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
