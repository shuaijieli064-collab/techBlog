export type Block =
  | { type: "h1"; html: string; text: string }
  | { type: "h2" | "h3"; html: string; text: string; id: string }
  | { type: "p" | "li" | "quote"; html: string }
  | { type: "code"; lang: string; code: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "hr" }
  | { type: "ul"; items: string[]; ordered?: boolean };

export type Heading = { id: string; label: string };

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function slugifyHeading(text: string): string {
  return text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, "-");
}

function inline(text: string): string {
  let s = escapeHtml(text);
  s = s.replace(/`([^`]+)`/g, '<code class="border border-hair bg-background px-1.5 py-0.5 font-mono text-[0.9em] text-wire">$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
  s = s.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)]+|\/[^)]*)\)/g,
    '<a href="$2" class="text-wire underline decoration-wire/40 underline-offset-2 hover:opacity-80">$1</a>',
  );
  s = s.replace(/~~([^~]+)~~/g, '<span class="text-muted line-through">$1</span>');
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
  let headingIndex = 0;

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
      const text = line.replace(/^#\s+/, "");
      blocks.push({ type: "h1", html: inline(text), text });
      i += 1;
      continue;
    }
    if (/^(###|##)\s+/.test(line)) {
      const level = line.startsWith("###") ? "h3" : "h2";
      const text = line.replace(/^#{2,3}\s+/, "");
      headingIndex += 1;
      blocks.push({
        type: level,
        html: inline(text),
        text,
        id: `section-${headingIndex}-${slugifyHeading(text)}`,
      });
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
              ? `<span class="mr-1 text-wire">☑</span><span class="text-muted line-through">${inline(label)}</span>`
              : `<span class="mr-1 text-muted">☐</span>${inline(label)}`;
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
      blocks.push({ type: "ul", items, ordered: true });
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

export function extractHeadings(md: string): Heading[] {
  return markdownToBlocks(md)
    .filter((b): b is Extract<Block, { type: "h2" | "h3" }> => b.type === "h2" || b.type === "h3")
    .map((b) => ({ id: b.id, label: b.text }));
}

export function renderBlockHtml(b: Block): string {
  switch (b.type) {
    case "h1":
      return `<h1 class="mt-2 mb-4 text-3xl font-bold tracking-tight text-foreground">${b.html}</h1>`;
    case "h2":
      return `<h2 id="${b.id}" class="mt-8 mb-3 scroll-mt-24 text-xl font-semibold text-foreground">${b.html}</h2>`;
    case "h3":
      return `<h3 id="${b.id}" class="mt-6 mb-2 scroll-mt-24 text-lg font-semibold text-foreground">${b.html}</h3>`;
    case "p":
      return `<p class="my-3 leading-7 text-print">${b.html}</p>`;
    case "quote":
      return `<blockquote class="my-4 border-l-4 border-wire bg-wire/[0.06] px-4 py-3 text-print">${b.html}</blockquote>`;
    case "code":
      return `<pre class="my-4 overflow-x-auto border border-hair bg-[#080d15] p-4 text-sm text-print"><code data-lang="${escapeHtml(b.lang)}">${escapeHtml(b.code)}</code></pre>`;
    case "hr":
      return `<hr class="my-8 border-hair" />`;
    case "table":
      return `<div class="my-4 overflow-x-auto"><table class="w-full min-w-[480px] border-collapse text-sm"><thead><tr class="bg-background">${b.headers
        .map(
          (h) =>
            `<th class="border border-hair px-3 py-2 text-left font-medium text-foreground">${h}</th>`,
        )
        .join("")}</tr></thead><tbody>${b.rows
        .map(
          (row) =>
            `<tr>${row
              .map(
                (c) =>
                  `<td class="border border-hair px-3 py-2 text-print">${c}</td>`,
              )
              .join("")}</tr>`,
        )
        .join("")}</tbody></table></div>`;
    case "ul": {
      const tag = b.ordered ? "ol" : "ul";
      const hasCheckbox = b.items.some((it) => it.includes("☑") || it.includes("☐"));
      let cls = b.ordered
        ? "my-3 list-decimal space-y-1.5 pl-5 text-print marker:text-wire"
        : "my-3 list-disc space-y-1.5 pl-5 text-print marker:text-wire";
      if (hasCheckbox && !b.ordered) {
        cls = "my-3 list-none space-y-1.5 pl-1 text-print";
      }
      return `<${tag} class="${cls}">${b.items.map((it) => `<li class="leading-7">${it}</li>`).join("")}</${tag}>`;
    }
    default:
      return "";
  }
}

