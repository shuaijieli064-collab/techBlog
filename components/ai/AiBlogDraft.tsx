"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, Download, Loader2, AlertTriangle, FileText } from "lucide-react";

import { modelOptions } from "@/lib/ai";

const templates = [
  {
    id: "notes",
    label: "学习笔记 → 博客",
    prompt:
      "请把下面的学习笔记整理成一篇结构清晰的技术博客：开头交代背景，正文分 3-4 个小节，结尾给出实践建议与延伸阅读。语气自然，避免空话。",
  },
  {
    id: "review",
    label: "项目复盘 → 博客",
    prompt:
      "请根据以下项目复盘要点生成博客草稿：问题背景、踩坑过程、解决方案、经验沉淀。保留具体技术细节，给出可复用清单。",
  },
  {
    id: "interview",
    label: "面试题 → 博客",
    prompt:
      "请把这道面试题整理成博客：题目描述、思路分析、代码示例、常见追问、一句话总结。适合搜索引擎阅读。",
  },
];

export function AiBlogDraft() {
  const [topic, setTopic] = useState("");
  const [templateId, setTemplateId] = useState(templates[0].id);
  const [model, setModel] = useState(modelOptions[0].id);
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const template = templates.find((t) => t.id === templateId) ?? templates[0];

  const generate = async () => {
    const subject = topic.trim();
    if (!subject) {
      setError("请先填写博客主题");
      return;
    }
    setError(null);
    setLoading(true);
    setDraft("");
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: "你是一名资深技术博客作者，擅长把技术要点整理成结构清晰、代码规范、可读性强的中文博客。输出使用 Markdown 格式，不要包含多余的寒暄。" },
            { role: "user", content: `${template.prompt}\n\n主题：${subject}` },
          ],
          temperature: 0.7,
          max_tokens: 2048,
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
      const data = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const content = data.choices?.[0]?.message?.content ?? "";
      if (!content) throw new Error("模型返回为空");
      const today = new Date().toISOString().slice(0, 10);
      const header = `# ${subject}\n\n> 由 AI 生成博客草稿 · ${today} · 模型：${model} · 状态：draft\n\n`;
      setDraft(header + content.trim());
    } catch (err) {
      const msg = err instanceof Error ? err.message : "生成失败";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const download = () => {
    if (!draft) return;
    const blob = new Blob([draft], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${topic.trim().replace(/[\\/:*?"<>|]+/g, "-") || "draft"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-8 rounded-lg border border-wire/30 bg-wire/[0.05] p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-hair bg-panel">
          <Sparkles size={18} className="text-wire" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">AI 生成博客草稿</h2>
          <p className="text-sm text-print">
            填写主题，选择模板与模型，由大模型直接生成 Markdown 草稿。
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_180px_200px_auto]">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="博客主题，如：HashMap 扩容机制"
          className="input-base"
          aria-label="博客主题"
          disabled={loading}
        />
        <select
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
          className="input-base"
          aria-label="模板类型"
          disabled={loading}
        >
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="input-base"
          aria-label="模型选择"
          disabled={loading}
        >
          {modelOptions.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" /> 生成中…
            </>
          ) : (
            <>
              <Sparkles size={15} /> 生成草稿
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 border border-alert/40 bg-alert/10 p-3 text-sm text-alert">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <span>生成失败：{error}</span>
        </div>
      )}

      {loading && !draft && (
        <div className="mt-4 space-y-2">
          <div className="h-3 w-1/3 animate-pulse rounded bg-hair/60" />
          <div className="h-3 w-full animate-pulse rounded bg-hair/40" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-hair/40" />
          <div className="h-3 w-full animate-pulse rounded bg-hair/40" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-hair/40" />
        </div>
      )}

      {draft && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-print">draft.md</span>
            <div className="flex gap-2">
              <a
                href={`/posts/admin?new=1&title=${encodeURIComponent(topic.trim())}&content=${encodeURIComponent(draft)}`}
                className="inline-flex items-center gap-1 rounded-full border border-wire/50 bg-wire/10 px-2.5 py-1 text-xs font-medium text-wire transition-colors hover:border-wire hover:bg-wire/20"
              >
                <FileText size={12} /> 保存为文章
              </a>
              <button
                type="button"
                onClick={copy}
                className="inline-flex items-center gap-1 rounded-full border border-hair bg-panel px-2.5 py-1 text-xs font-medium text-print hover:border-wire"
              >
                {copied ? <Check size={12} className="text-wire" /> : <Copy size={12} />}
                {copied ? "已复制" : "复制"}
              </button>
              <button
                type="button"
                onClick={download}
                className="inline-flex items-center gap-1 rounded-full border border-hair bg-panel px-2.5 py-1 text-xs font-medium text-print hover:border-wire"
              >
                <Download size={12} /> 下载 .md
              </button>
            </div>
          </div>
          <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg border border-hair bg-background p-4 font-mono text-xs leading-6 text-print">
            {draft}
          </pre>
        </div>
      )}
    </div>
  );
}
