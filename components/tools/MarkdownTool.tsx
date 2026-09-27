"use client";

import { useState } from "react";

function inlineMarkdown(src: string): string {
  return src
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\(([^)\s]+)\)/g,
      '<a href="$2" target="_blank" rel="noreferrer">$1</a>',
    );
}

function renderMarkdown(src: string): string {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let inCode = false;
  let codeBuf: string[] = [];
  let listOpen = false;

  const closeList = () => {
    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
  };

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      if (!inCode) {
        closeList();
        inCode = true;
        codeBuf = [];
      } else {
        html.push(
          `<pre class="md-pre"><code>${codeBuf.join("\n").replace(/&/g, "&amp;").replace(/</g, "&lt;")}</code></pre>`,
        );
        inCode = false;
      }
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      continue;
    }
    const h = line.match(/^(#{1,3})\s+(.*)$/);
    if (h) {
      closeList();
      const level = h[1].length;
      html.push(`<h${level} class="md-h${level}">${inlineMarkdown(h[2])}</h${level}>`);
      continue;
    }
    const li = line.match(/^\s*[-*]\s+(.*)$/);
    if (li) {
      if (!listOpen) {
        html.push('<ul class="md-ul">');
        listOpen = true;
      }
      html.push(`<li>${inlineMarkdown(li[1])}</li>`);
      continue;
    }
    if (!line.trim()) {
      closeList();
      continue;
    }
    closeList();
    html.push(`<p>${inlineMarkdown(line)}</p>`);
  }
  if (inCode) {
    html.push(
      `<pre class="md-pre"><code>${codeBuf.join("\n").replace(/&/g, "&amp;").replace(/</g, "&lt;")}</code></pre>`,
    );
  }
  closeList();
  return html.join("\n");
}

export default function MarkdownTool() {
  const [input, setInput] = useState(
    "# 标题\n\n**粗体** 与 *斜体*，`行内代码`。\n\n- 列表项一\n- 列表项二\n\n```ts\nconst a = 1;\n```\n",
  );
  const html = renderMarkdown(input);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        支持标题、粗斜体、行内代码、列表、链接与代码块（本地渲染，已转义 HTML）。
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input-base h-64 font-mono"
          aria-label="Markdown 源码"
        />
        <div
          className="prose-preview h-64 overflow-auto border border-hair bg-background p-4 text-sm leading-7 text-print"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      <style>{`
        .prose-preview .md-h1 { font-size: 1.5rem; font-weight: 700; margin: 0.6rem 0 0.4rem; }
        .prose-preview .md-h2 { font-size: 1.25rem; font-weight: 700; margin: 0.5rem 0 0.35rem; }
        .prose-preview .md-h3 { font-size: 1.1rem; font-weight: 600; margin: 0.4rem 0 0.3rem; }
        .prose-preview .md-ul { list-style: disc; padding-left: 1.25rem; margin: 0.4rem 0; }
        .prose-preview .md-pre { background: #0f172a; color: #e2e8f0; padding: 0.75rem 1rem; border-radius: 4px; overflow: auto; margin: 0.5rem 0; }
        .prose-preview code { font-family: ui-monospace, monospace; background: rgba(148,163,184,.2); padding: 0 .25rem; border-radius: .25rem; }
        .prose-preview .md-pre code { background: transparent; padding: 0; }
        .prose-preview a { color: var(--wire); }
      `}</style>
    </div>
  );
}
