import CodeBlock from "@/components/CodeBlock";
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
          <div key={index} dangerouslySetInnerHTML={{ __html: renderBlockHtml(block) }} />
        ),
      )}
    </div>
  );
}
