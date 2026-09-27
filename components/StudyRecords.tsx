"use client";

import { useEffect, useState } from "react";
import { Plus, Clock, Trash2 } from "lucide-react";

import { seedStudyRecords, type StudyRecord } from "@/lib/growth";

const STORAGE_KEY = "learning:study-records:v1";

function load(): StudyRecord[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StudyRecord[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function StudyRecords() {
  const [records, setRecords] = useState<StudyRecord[]>(seedStudyRecords);
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("Java");
  const [hours, setHours] = useState("1");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      const saved = load();
      if (saved) setRecords(saved);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const persist = (next: StudyRecord[]) => {
    setRecords(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const add = () => {
    const t = title.trim();
    if (!t) return;
    const rec: StudyRecord = {
      id: `sr-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      title: t,
      description: description.trim(),
      hours: Number(hours) || 0,
      topic: topic.trim() || "通用",
    };
    persist([rec, ...records]);
    setTitle("");
    setDescription("");
    setHours("1");
  };

  const remove = (id: string) => {
    persist(records.filter((r) => r.id !== id));
  };

  const totalHours = records.reduce((s, r) => s + r.hours, 0);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
          学习记录
        </h2>
        <span className="flex items-center gap-1.5 text-sm text-print">
          <Clock size={14} /> 累计 {totalHours.toFixed(1)} 小时 · {records.length} 条
        </span>
      </div>

      <div className="card mb-6 p-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-[1fr_120px_100px_auto]">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="今天学了什么？"
            className="col-span-2 input-base md:col-span-1"
            aria-label="记录标题"
          />
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="主题"
            className="input-base"
            aria-label="主题"
          />
          <input
            type="number"
            min="0.5"
            step="0.5"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="input-base"
            aria-label="小时"
          />
          <button
            type="button"
            onClick={add}
            className="col-span-2 btn-primary gap-1.5 px-4 py-2 md:col-span-1"
          >
            <Plus size={15} /> 记录
          </button>
        </div>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="一句话笔记（可选）…"
          className="mt-3 w-full input-base"
          aria-label="笔记"
        />
      </div>

      <div className="relative ml-3 border-l-2 border-hair pl-8">
        {records.map((record) => (
          <div key={record.id} className="relative mb-5 last:mb-0 group">
            <span className="absolute -left-[41px] top-3 h-3.5 w-3.5 rounded-full border-2 border-panel bg-wire" />
            <article className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-print">
                    <time dateTime={record.date}>{record.date}</time>
                    <span className="rounded-full bg-raise px-2 py-0.5">
                      {record.topic}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {record.hours}h
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-foreground">{record.title}</h3>
                  {record.description && (
                    <p className="mt-1 text-sm text-print">
                      {record.description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(record.id)}
                  className="shrink-0 p-1.5 text-muted transition-opacity hover:bg-alert/10 hover:text-alert md:opacity-0 md:group-hover:opacity-100"
                  aria-label="删除记录"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  );
}
