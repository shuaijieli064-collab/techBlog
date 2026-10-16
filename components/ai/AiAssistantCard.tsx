"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Sparkles, Loader2, AlertTriangle, RefreshCw, Copy, Check, ArrowUpRight } from "lucide-react";

import { Markdown } from "@/components/Markdown";
import { SectionRule } from "@/components/SectionRule";
import { defaultData } from "@/components/LearningRoadmap";
import { useWorkspace } from "@/lib/workspace/client";

const SYSTEM_PROMPT =
  "你是一名严谨的个人开发者工作台助理。根据用户提供的真实工作台数据，给出今天最值得做的 3-5 条行动建议，覆盖学习与任务两条线。每条一行，格式：- [优先级 高/中/低] 建议内容（一句话理由）。不要寒暄，不要输出无关内容，输出 Markdown。";

type Task = { title?: string; tag?: string; done?: boolean };
type BoardTask = { title?: string; status?: string; priority?: number };
type Record = { date?: string; topic?: string; hours?: number; title?: string };
type Alg = { name?: string; count?: number; mastered?: number };

export function AiAssistantCard() {
  const [tasks] = useWorkspace<Task[]>("daily-tasks", []);
  const [board] = useWorkspace<BoardTask[]>("task-board", []);
  const [records] = useWorkspace<Record[]>("study-records", []);
  const [mastered] = useWorkspace<boolean[][]>(
    "learning-mastered",
    defaultData.roadmap.map((s) => s.defaults),
  );
  const [algs] = useWorkspace<Alg[]>("algorithms", defaultData.algorithms);

  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const buildContext = useCallback(() => {
    const validTasks = Array.isArray(tasks) ? tasks : [];
    const validBoard = Array.isArray(board) ? board : [];
    const validRecords = Array.isArray(records) ? records : [];
    const flags =
      Array.isArray(mastered) && mastered.length === defaultData.roadmap.length
        ? mastered
        : defaultData.roadmap.map((s) => s.defaults);
    const validAlgs = Array.isArray(algs) ? algs : defaultData.algorithms;

    const taskLine = validTasks.length
      ? validTasks
          .map((t) => `- ${t.done ? "[x]" : "[ ]"} ${t.title ?? ""}（${t.tag ?? ""}）`)
          .join("\n")
      : "（今日暂无任务）";
    const backlog = validBoard.filter((t) => t.status === "backlog").slice(0, 5);
    const boardLine = backlog.length
      ? backlog.map((t) => `- ${t.title ?? ""}`).join("\n")
      : "（任务箱暂无待办）";
    const recordLine = validRecords.length
      ? validRecords
          .slice(0, 5)
          .map((r) => `- ${r.date ?? ""} ${r.topic ?? ""} ${r.hours ?? 0}h ${r.title ?? ""}`)
          .join("\n")
      : "（暂无学习记录）";
    const roadmapLine = defaultData.roadmap
      .map((sec, i) => {
        const undone = sec.items.filter((_, j) => !flags[i][j]);
        return undone.length ? `- ${sec.category}：未掌握 ${undone.join("、")}` : `- ${sec.category}：已完成`;
      })
      .join("\n");
    const algLine = validAlgs.length
      ? validAlgs.map((x) => `- ${x.name ?? ""} ${x.mastered ?? 0}/${x.count ?? 0}`).join("\n")
      : "（暂无算法数据）";

    return `【今日任务】\n${taskLine}\n\n【任务箱待办】\n${boardLine}\n\n【最近学习记录】\n${recordLine}\n\n【学习路线图进度】\n${roadmapLine}\n\n【算法练习】\n${algLine}\n\n请基于以上真实数据，给出今天最值得做的行动建议。`;
  }, [tasks, board, records, mastered, algs]);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: buildContext() },
          ],
          temperature: 0.5,
          max_tokens: 1024,
          stream: true,
        }),
      });
      if (!res.ok) {
        let detail = `HTTP ${res.status}`;
        try {
          const errBody = (await res.json()) as { error?: { message?: string } | string };
          if (typeof errBody.error === "string") detail = errBody.error;
          else if (errBody.error && typeof errBody.error === "object" && errBody.error.message) {
            detail = errBody.error.message;
          }
        } catch {
          /* ignore parse error */
        }
        throw new Error(detail);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("无法读取响应流");
      const decoder = new TextDecoder();
      let buffer = "";
      let content = "";
      setAdvice("");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const payload = trimmed.slice(5).trim();
          if (payload === "[DONE]") continue;
          try {
            const parsed = JSON.parse(payload) as {
              choices?: Array<{ delta?: { content?: string; reasoning_content?: string } }>;
            };
            const delta = parsed.choices?.[0]?.delta;
            const text = (delta?.content ?? "") + (delta?.reasoning_content ?? "");
            if (text) {
              content += text;
              setAdvice(content);
            }
          } catch {
            /* ignore malformed chunk */
          }
        }
      }

      if (!content) throw new Error("模型返回为空");
      setAdvice(content.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败");
    } finally {
      setLoading(false);
    }
  }, [buildContext]);

  const copy = async () => {
    if (!advice) return;
    try {
      await navigator.clipboard.writeText(advice);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="card p-6">
      <SectionRule
        title="AI 助手"
        meta={loading ? "THINKING" : advice ? "LIVE · 已生成" : "LIVE · 基于真实数据"}
      />
      <div className="space-y-3">
        {error && (
          <div className="flex items-start gap-2 border border-alert/40 bg-alert/10 p-3 text-sm text-alert">
            <AlertTriangle size={15} className="mt-0.5 shrink-0" />
            <span>生成失败：{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex items-center gap-2 rounded-lg border border-hair bg-background/70 p-4 font-mono text-[13px] text-print">
            <Loader2 size={14} className="animate-spin text-wire" /> 正在结合今日任务、学习记录与路线图生成建议…
          </div>
        ) : advice ? (
          <div className="rounded-lg border border-wire/20 bg-background/70 p-4">
            <div className="md-body max-h-80 overflow-auto text-[13px] leading-6 text-print">
              <Markdown content={advice} />
            </div>
          </div>
        ) : (
          <p className="rounded-lg border border-hair bg-background/70 p-4 font-mono text-[13px] leading-6 text-print">
            <span className="mr-1.5 text-signal">{"❯"}</span>
            结合今日任务、任务箱、学习记录、路线图与算法进度生成今日行动建议。
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => generate()}
            disabled={loading}
            className="btn-primary btn-sm inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : advice ? (
              <RefreshCw size={14} />
            ) : (
              <Sparkles size={14} />
            )}
            {advice ? "重新生成" : "生成今日建议"}
          </button>
          {advice && (
            <>
              <button
                type="button"
                onClick={copy}
                className="inline-flex items-center gap-1.5 rounded-full border border-hair bg-panel px-3 py-2 text-sm text-print transition-colors hover:border-wire"
              >
                {copied ? <Check size={14} className="text-wire" /> : <Copy size={14} />}
                {copied ? "已复制" : "复制"}
              </button>
              <Link
                href="/ai/chat?agent=tutor"
                className="inline-flex items-center gap-1.5 px-2 text-sm font-medium text-wire hover:opacity-80"
              >
                去 AI 对话 <ArrowUpRight size={14} />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
