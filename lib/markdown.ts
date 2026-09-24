type Block =
  | { type: "h1" | "h2" | "h3" | "p" | "li" | "quote"; html: string }
  | { type: "code"; lang: string; code: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "hr" }
  | { type: "ul"; items: string[] };

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function inline(text: string): string {
  let s = escapeHtml(text);
  s = s.replace(/`([^`]+)`/g, '<code class="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-rose-600 dark:bg-slate-800 dark:text-rose-400">$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
  s = s.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)]+|\/[^)]*)\)/g,
    '<a href="$2" class="text-sky-600 underline decoration-sky-300 underline-offset-2 hover:text-sky-500 dark:text-sky-400">$1</a>',
  );
  s = s.replace(/~~([^~]+)~~/g, '<span class="text-slate-400 line-through">$1</span>');
  return s;
}

function parseTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

export function markdownToBlocks(md: string): Block[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (/^```/.test(line)) {
      const lang = line.slice(3).trim() || "text";
      const code: string[] = [];
      i += 1;
      while (i < lines.length && !/^```/.test(lines[i])) {
        code.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push({ type: "code", lang, code: code.join("\n") });
      continue;
    }

    if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
      blocks.push({ type: "hr" });
      i += 1;
      continue;
    }

    if (/^#\s+/.test(line)) {
      blocks.push({ type: "h1", html: inline(line.replace(/^#\s+/, "")) });
      i += 1;
      continue;
    }
    if (/^###\s+/.test(line)) {
      blocks.push({ type: "h3", html: inline(line.replace(/^###\s+/, "")) });
      i += 1;
      continue;
    }
    if (/^##\s+/.test(line)) {
      blocks.push({ type: "h2", html: inline(line.replace(/^##\s+/, "")) });
      i += 1;
      continue;
    }

    if (/^\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
      const headers = parseTableRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) {
        rows.push(parseTableRow(lines[i]).map((c) => inline(c)));
        i += 1;
      }
      blocks.push({ type: "table", headers: headers.map((h) => inline(h)), rows });
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^>\s?/, ""));
        i += 1;
      }
      blocks.push({ type: "quote", html: inline(quote.join(" ")) });
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        let item = lines[i].replace(/^\s*[-*]\s+/, "");
        if (/^\[[ xX]\]\s+/.test(item)) {
          const done = /^\[[xX]\]/.test(item);
          const label = item.replace(/^\[[ xX]\]\s+/, "");
          item = done
            ? `<span class="mr-1 text-sky-600">☑</span><span class="text-slate-400 line-through">${inline(label)}</span>`
            : `<span class="mr-1 text-slate-400">☐</span>${inline(label)}`;
        } else {
          item = inline(item);
        }
        items.push(item);
        i += 1;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(inline(lines[i].replace(/^\s*\d+\.\s+/, "")));
        i += 1;
      }
      const block = { type: "ul" as const, items, ordered: true } as Block & {
        ordered?: boolean;
      };
      blocks.push(block);
      continue;
    }

    const para: string[] = [line];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#|```|>|\s*[-*]\s|\s*\d+\.\s|\|)/.test(lines[i])
    ) {
      para.push(lines[i]);
      i += 1;
    }
    blocks.push({ type: "p", html: inline(para.join(" ")) });
  }

  return blocks;
}

export function renderMarkdown(md: string): string {
  const blocks = markdownToBlocks(md);
  return blocks
    .map((b) => {
      switch (b.type) {
        case "h1":
          return `<h1 class="mt-2 mb-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">${b.html}</h1>`;
        case "h2":
          return `<h2 class="mt-8 mb-3 text-xl font-semibold text-slate-900 dark:text-slate-50">${b.html}</h2>`;
        case "h3":
          return `<h3 class="mt-6 mb-2 text-lg font-semibold text-slate-800 dark:text-slate-100">${b.html}</h3>`;
        case "p":
          return `<p class="my-3 leading-7 text-slate-600 dark:text-slate-300">${b.html}</p>`;
        case "quote":
          return `<blockquote class="my-4 border-l-4 border-sky-400 bg-sky-50/60 px-4 py-3 text-slate-700 dark:border-sky-500 dark:bg-sky-950/40 dark:text-slate-200">${b.html}</blockquote>`;
        case "code":
          return `<pre class="my-4 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-950 p-4 text-sm text-slate-100 dark:border-slate-800"><code data-lang="${escapeHtml(b.lang)}">${escapeHtml(b.code)}</code></pre>`;
        case "hr":
          return `<hr class="my-8 border-slate-200 dark:border-slate-800" />`;
        case "table":
          return `<div class="my-4 overflow-x-auto"><table class="w-full min-w-[480px] border-collapse text-sm"><thead><tr class="bg-slate-50 dark:bg-slate-900">${b.headers
            .map(
              (h) =>
                `<th class="border border-slate-200 px-3 py-2 text-left font-medium text-slate-700 dark:border-slate-700 dark:text-slate-300">${h}</th>`,
            )
            .join("")}</tr></thead><tbody>${b.rows
            .map(
              (row) =>
                `<tr>${row
                  .map(
                    (c) =>
                      `<td class="border border-slate-200 px-3 py-2 text-slate-600 dark:border-slate-700 dark:text-slate-300">${c}</td>`,
                  )
                  .join("")}</tr>`,
            )
            .join("")}</tbody></table></div>`;
        case "ul": {
          const ordered = (b as Block & { ordered?: boolean }).ordered;
          const tag = ordered ? "ol" : "ul";
          const hasCheckbox = b.items.some((it) => it.includes("☑") || it.includes("☐"));
          let cls = ordered
            ? "my-3 list-decimal space-y-1.5 pl-5 text-slate-600 marker:text-sky-500 dark:text-slate-300"
            : "my-3 list-disc space-y-1.5 pl-5 text-slate-600 marker:text-sky-500 dark:text-slate-300";
          if (hasCheckbox && !ordered) {
            cls = "my-3 list-none space-y-1.5 pl-1 text-slate-600 dark:text-slate-300";
          }
          return `<${tag} class="${cls}">${b.items.map((it) => `<li class="leading-7">${it}</li>`).join("")}</${tag}>`;
        }
        default:
          return "";
      }
    })
    .join("\n");
}
