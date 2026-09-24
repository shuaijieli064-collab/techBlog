import { renderMarkdown } from "@/lib/markdown";

export function Markdown({ content }: { content: string }) {
  return (
    <div
      className="md-body"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
}
