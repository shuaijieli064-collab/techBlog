"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, Download } from "lucide-react";

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
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);

  const template = templates.find((t) => t.id === templateId) ?? templates[0];

  const generate = () => {
    const subject = topic.trim() || "（未填写主题）";
    const today = new Date().toISOString().slice(0, 10);
    const md = `# ${subject}

> 由「AI 生成博客草稿」模板生成 · ${today} · 状态：draft

## 背景

${template.prompt}

主题：${subject}

## 关键点

1. 
2. 
3. 

## 正文草稿

（在这里粘贴笔记或要点，继续让 AI 扩写…）

## 小结

- 

## 下一步

- [ ] 补充代码示例
- [ ] 校对术语与链接
- [ ] 发布前把 status 改为 published
`;
    setDraft(md);
    setCopied(false);
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
    a.download = `${(topic.trim() || "draft").replace(/[\\/:*?"<>|]+/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-8 rounded-[4px] border border-wire/30 bg-wire/[0.05] p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-hair bg-panel">
          <Sparkles size={18} className="text-wire" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">AI 生成博客草稿</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            本地模板先生成 Markdown 骨架；接入 Edge Functions 后可换真模型。
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_200px_auto]">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="博客主题，如：HashMap 扩容机制"
          className="input-base"
          aria-label="博客主题"
        />
        <select
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
          className="input-base"
          aria-label="模板类型"
        >
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={generate}
          className="btn-primary px-5 py-2.5"
        >
          <Sparkles size={15} /> 生成草稿
        </button>
      </div>

      {draft && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">draft.md</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={copy}
                className="inline-flex items-center gap-1 rounded-[4px] border border-hair bg-panel px-2.5 py-1 text-xs font-medium text-print hover:border-wire"
              >
                {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                {copied ? "已复制" : "复制"}
              </button>
              <button
                type="button"
                onClick={download}
                className="inline-flex items-center gap-1 rounded-[4px] border border-hair bg-panel px-2.5 py-1 text-xs font-medium text-print hover:border-wire"
              >
                <Download size={12} /> 下载 .md
              </button>
            </div>
          </div>
          <pre className="max-h-72 overflow-auto rounded-[4px] border border-hair bg-background p-4 font-mono text-xs leading-6 text-print">
            {draft}
          </pre>
        </div>
      )}
    </div>
  );
}
