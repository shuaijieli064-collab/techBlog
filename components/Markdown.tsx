import CodeBlock from "@/components/CodeBlock";
import { MarkdownErrorBoundary } from "@/components/MarkdownErrorBoundary";
import { markdownToBlocks, renderBlockHtml } from "@/lib/markdown";

export function Markdown({ content }: { content: string }) {
  const blocks = markdownToBlocks(content);

  return (
    <div className="md-body">
      {blocks.map((block, index) =>
        block.type === "code" ? (
          <div key={index} className="my-4">
            <CodeBlock code={block.code} language={block.lang} />
          </div>
        ) : (
          <MarkdownErrorBoundary key={index}>
            <div dangerouslySetInnerHTML={{ __html: renderBlockHtml(block) }} />
          </MarkdownErrorBoundary>
        ),
      )}
    </div>
  );
}
