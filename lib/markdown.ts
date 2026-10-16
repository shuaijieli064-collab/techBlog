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
  s = s.replace(/`([^`]+)`/g, '<code class="rounded-md border border-hair bg-raise/60 px-1.5 py-0.5 font-mono text-[0.85em] text-wire">$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
  s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
  s = s.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)]+|\/[^)]*)\)/g,
    '<a href="$2" class="text-wire underline decoration-wire/40 underline-offset-[3px] transition-colors hover:decoration-wire">$1</a>',
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
      return `<h1 class="mt-2 mb-4 font-display text-3xl font-bold tracking-tight text-foreground">${b.html}</h1>`;
    case "h2":
      return `<h2 id="${b.id}" class="mt-10 mb-4 flex scroll-mt-24 items-center gap-2.5 font-display text-xl font-semibold text-foreground"><span aria-hidden class="font-mono text-base text-wire/80">#</span>${b.html}</h2>`;
    case "h3":
      return `<h3 id="${b.id}" class="mt-7 mb-2 flex scroll-mt-24 items-center gap-2 font-display text-lg font-semibold text-foreground"><span aria-hidden class="font-mono text-sm text-wire/60">##</span>${b.html}</h3>`;
    case "p":
      return `<p class="my-3 leading-[1.78] text-print">${b.html}</p>`;
    case "quote":
      return `<blockquote class="my-4 rounded-r-lg border-l-2 border-wire bg-wire/[0.05] px-4 py-3 text-print [&>p]:leading-[1.78]">${b.html}</blockquote>`;
    case "code":
      return `<pre class="my-4 overflow-x-auto rounded-lg border border-hair bg-[#080d15] p-4 text-sm text-print"><code data-lang="${escapeHtml(b.lang)}">${escapeHtml(b.code)}</code></pre>`;
    case "hr":
      return `<hr class="my-8 h-px border-0 bg-gradient-to-r from-transparent via-hair to-transparent" />`;
    case "table":
      return `<div class="my-4 overflow-x-auto rounded-lg border border-hair"><table class="w-full min-w-[480px] border-collapse text-sm"><thead><tr class="bg-raise/60">${b.headers
        .map(
          (h) =>
            `<th class="border-b border-hair px-3 py-2 text-left font-medium text-foreground">${h}</th>`,
        )
        .join("")}</tr></thead><tbody>${b.rows
        .map(
          (row) =>
            `<tr class="[&:not(:last-child)]:border-b [&:not(:last-child)]:border-hair/60">${row
              .map(
                (c) =>
                  `<td class="px-3 py-2 text-print">${c}</td>`,
              )
              .join("")}</tr>`,
        )
        .join("")}</tbody></table></div>`;
    case "ul": {
      const tag = b.ordered ? "ol" : "ul";
      const hasCheckbox = b.items.some((it) => it.includes("☑") || it.includes("☐"));
      let cls = b.ordered
        ? "my-3 list-decimal space-y-1.5 pl-5 text-print marker:text-wire/70 marker:font-mono"
        : "my-3 list-disc space-y-1.5 pl-5 text-print marker:text-wire/70";
      if (hasCheckbox && !b.ordered) {
        cls = "my-3 list-none space-y-1.5 pl-1 text-print";
      }
      return `<${tag} class="${cls}">${b.items.map((it) => `<li class="leading-[1.78]">${it}</li>`).join("")}</${tag}>`;
    }
    default:
      return "";
  }
}

