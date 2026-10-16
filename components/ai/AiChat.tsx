"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Send,
  Loader2,
  AlertTriangle,
  Trash2,
  ListTodo,
  BookOpen,
  Map,
  Bot,
  User,
} from "lucide-react";

import { Markdown } from "@/components/Markdown";
import { defaultData } from "@/components/LearningRoadmap";
import { agentPresets, modelOptions, DEFAULT_MODEL } from "@/lib/ai";

type Msg = { role: "user" | "assistant"; content: string };
type ChatError = { message: string; docs?: string };

const STORAGE_KEY = "ai-chat:v1";

const GENERAL_SYSTEM =
  "你是一名得力的个人开发者工作台助手。回答简洁、直接、可执行：能用列表就不用段落，代码用 Markdown 代码块，中文回答。不要寒暄，不要输出与问题无关的内容。";

const WELCOME: Msg = {
  role: "assistant",
  content:
    "你好，我是接入 ModelScope 的工作台助手。\n\n- 右上角可**切换模型**与 **Agent 角色**（代码 / 写作 / 调试 / 审查 / 学习 / 翻译）\n- 输入框上方可**注入工作台真实数据**：今日任务、学习记录、路线图进度，让回答基于你的实际情况\n- 会话自动保存在本地浏览器",
};

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function scrollToBottom(el: HTMLDivElement | null) {
  if (!el) return;
  if (prefersReducedMotion) {
    el.scrollIntoView();
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

export function AiChat({ initialAgent }: { initialAgent?: string }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [agentId, setAgentId] = useState<string>(initialAgent ?? "general");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ChatError | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 首次挂载：恢复本地会话（异步读取，避免 effect 内同步 setState）；
  // 无历史时保持欢迎语，渲染侧以 hydrated 区分占位与真实内容
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      if (cancelled) return;
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as { messages?: Msg[]; model?: string; agentId?: string };
          if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
            setMessages(parsed.messages);
            if (typeof parsed.model === "string") setModel(parsed.model);
            if (typeof parsed.agentId === "string") setAgentId(parsed.agentId);
          }
        }
      } catch {
        /* ignore corrupt storage */
      }
      setHydrated(true);
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  // 持久化
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, model, agentId }));
    } catch {
      /* storage unavailable */
    }
  }, [messages, model, agentId, hydrated]);

  useEffect(() => {
    scrollToBottom(bottomRef.current);
  }, [messages, loading]);

  const send = useCallback(
    async (textOverride?: string) => {
      const text = (textOverride ?? input).trim();
      if (!text || loading) return;
      const userMsg: Msg = { role: "user", content: text };
      const next = [...messages, userMsg];
      setMessages(next);
      setInput("");
      setError(null);
      setLoading(true);
      const agent = agentPresets.find((a) => a.id === agentId);
      const system = agent ? agent.system : GENERAL_SYSTEM;
      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: system },
              ...next.map((m) => ({ role: m.role, content: m.content })),
            ],
            temperature: 0.7,
            max_tokens: 2048,
            stream: true,
          }),
        });
        if (!res.ok) {
          let detail = `HTTP ${res.status}`;
          let docs: string | undefined;
          try {
            const errBody = (await res.json()) as { error?: { message?: string } | string; detail?: string; docs?: string };
            if (typeof errBody.error === "string") detail = errBody.error;
            else if (errBody.error && typeof errBody.error === "object" && errBody.error.message) {
              detail = errBody.error.message;
            }
            if (errBody.detail) detail = errBody.detail;
            docs = errBody.docs;
          } catch {
            /* ignore parse error */
          }
          const err = new Error(detail);
          (err as Error & { docs?: string }).docs = docs;
          throw err;
        }

        // 流式解析 SSE
        const reader = res.body?.getReader();
        if (!reader) throw new Error("无法读取响应流");
        const decoder = new TextDecoder();
        let buffer = "";
        let assistantContent = "";

        // 先占位 assistant 消息，后续逐字更新
        setMessages([...next, { role: "assistant", content: "" }]);

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
                assistantContent += text;
                setMessages([...next, { role: "assistant", content: assistantContent }]);
              }
            } catch {
              /* ignore malformed chunk */
            }
          }
        }

        if (!assistantContent) throw new Error("模型返回为空");
      } catch (err) {
        const docs = err instanceof Error ? (err as Error & { docs?: string }).docs : undefined;
        setError({
          message: err instanceof Error ? err.message : "对话失败",
          docs,
        });
        // 出错时移除占位的 assistant 消息
        setMessages(next);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, messages, model, agentId],
  );

  const clear = () => {
    setMessages([WELCOME]);
    setError(null);
  };

  const injectContext = useCallback(async (kind: "tasks" | "records" | "roadmap") => {
    setError(null);
    try {
      let text = "";
      if (kind === "tasks") {
        const body = (await fetch("/api/workspace/daily-tasks", { cache: "no-store" }).then((r) => r.json())) as {
          data?: Array<{ title?: string; tag?: string; done?: boolean }>;
        };
        const tasks = Array.isArray(body.data) ? body.data : [];
        text =
          "【今日任务】\n" +
          (tasks.length
            ? tasks.map((t) => `- ${t.done ? "[x]" : "[ ]"} ${t.title ?? ""}（${t.tag ?? ""}）`).join("\n")
            : "（今日暂无任务）");
      } else if (kind === "records") {
        const body = (await fetch("/api/workspace/study-records", { cache: "no-store" }).then((r) => r.json())) as {
          data?: Array<{ date?: string; topic?: string; hours?: number; title?: string }>;
        };
        const recs = Array.isArray(body.data) ? body.data : [];
        text =
          "【最近学习记录】\n" +
          (recs.length
            ? recs
                .slice(0, 6)
                .map((r) => `- ${r.date ?? ""} ${r.topic ?? ""} ${r.hours ?? 0}h ${r.title ?? ""}`)
                .join("\n")
            : "（暂无学习记录）");
      } else {
        const [mBody, aBody] = await Promise.all([
          fetch("/api/workspace/learning-mastered", { cache: "no-store" }).then((r) => r.json()),
          fetch("/api/workspace/algorithms", { cache: "no-store" }).then((r) => r.json()),
        ]);
        const flags =
          Array.isArray(mBody.data) && mBody.data.length === defaultData.roadmap.length
            ? (mBody.data as boolean[][])
            : defaultData.roadmap.map((s) => s.defaults);
        const lines = defaultData.roadmap.map((sec, i) => {
          const undone = sec.items.filter((_, j) => !flags[i][j]);
          return undone.length ? `- ${sec.category}：未掌握 ${undone.join("、")}` : `- ${sec.category}：已全部掌握`;
        });
        const algs = Array.isArray(aBody.data) ? (aBody.data as Array<{ name: string; count: number; mastered: number }>) : defaultData.algorithms;
        text =
          "【学习路线图进度】\n" +
          lines.join("\n") +
          "\n【算法练习】\n" +
          (algs.length ? algs.map((x) => `- ${x.name} ${x.mastered}/${x.count}`).join("\n") : "（暂无数据）");
      }
      setInput((prev) => (prev ? prev + "\n\n" + text : text));
    } catch {
      setError({ message: "获取工作台数据失败，请稍后重试" });
    }
  }, []);

  const displayMessages = messages.length > 0 ? messages : [WELCOME];

  return (
    <div className="card flex min-h-[560px] flex-col p-0">
      {/* 工具栏 */}
      <div className="flex flex-wrap items-center gap-3 border-b border-hair p-4">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="input-base w-auto"
            aria-label="模型选择"
          >
            {modelOptions.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
          <select
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            className="input-base w-auto"
            aria-label="Agent 预设"
          >
            <option value="general">通用助手</option>
            {agentPresets.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="font-mono text-[10px] text-muted">
            {agentId === "general" ? "GENERAL" : agentPresets.find((a) => a.id === agentId)?.role}
          </span>
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-1 rounded-full border border-hair bg-panel px-2.5 py-1 text-xs text-print transition-colors hover:border-alert hover:text-alert"
            aria-label="清空会话"
          >
            <Trash2 size={12} /> 清空
          </button>
        </div>
      </div>

      {/* 上下文注入 */}
      <div className="flex flex-wrap items-center gap-2 border-b border-hair px-4 py-2.5">
        <span className="font-mono text-[10px] text-muted">注入工作台数据</span>
        <button
          type="button"
          onClick={() => injectContext("tasks")}
          className="inline-flex items-center gap-1 rounded-full border border-hair bg-panel px-2.5 py-1 text-xs text-print transition-colors hover:border-wire hover:text-wire"
        >
          <ListTodo size={12} /> 今日任务
        </button>
        <button
          type="button"
          onClick={() => injectContext("records")}
          className="inline-flex items-center gap-1 rounded-full border border-hair bg-panel px-2.5 py-1 text-xs text-print transition-colors hover:border-wire hover:text-wire"
        >
          <BookOpen size={12} /> 学习记录
        </button>
        <button
          type="button"
          onClick={() => injectContext("roadmap")}
          className="inline-flex items-center gap-1 rounded-full border border-hair bg-panel px-2.5 py-1 text-xs text-print transition-colors hover:border-wire hover:text-wire"
        >
          <Map size={12} /> 路线图进度
        </button>
      </div>

      {/* 消息区 */}
      <div className="min-h-0 flex-1 space-y-4 overflow-auto p-4">
        {displayMessages.map((m, i) => (
          <div key={i} className={`fade-up flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                m.role === "user" ? "border-wire/50 bg-wire/10 text-wire" : "border-hair bg-panel text-print"
              }`}
            >
              {m.role === "user" ? <User size={13} /> : <Bot size={13} />}
            </div>
            <div
              className={`max-w-[85%] rounded-xl border p-3.5 text-sm leading-6 ${
                m.role === "user"
                  ? "border-wire/30 bg-wire/[0.06] text-foreground rounded-br-sm"
                  : "border-hair bg-panel text-print rounded-bl-sm"
              }`}
            >
              {m.role === "user" ? (
                <p className="whitespace-pre-wrap">{m.content}</p>
              ) : (
                <div className="md-body">
                  <Markdown content={m.content} />
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 pl-10 font-mono text-xs text-muted">
            <Loader2 size={13} className="animate-spin text-wire" /> 正在思考…
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 错误 + 输入 */}
      <div className="border-t border-hair p-4">
        {error && (
          <div className="mb-3 flex items-start gap-2 border border-alert/40 bg-alert/10 p-3 text-sm text-alert">
            <AlertTriangle size={15} className="mt-0.5 shrink-0" />
            <div>
              <span>请求失败：{error.message}</span>
              {error.docs && (
                <a
                  href={error.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-xs underline hover:text-wire"
                >
                  查看文档
                </a>
              )}
            </div>
          </div>
        )}
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            placeholder="输入问题，Enter 发送，Shift+Enter 换行…"
            rows={2}
            disabled={loading}
            className="input-base min-h-[44px] flex-1 resize-none py-2.5"
            aria-label="对话输入"
          />
          <button
            type="button"
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="btn-primary btn-sm flex shrink-0 items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
