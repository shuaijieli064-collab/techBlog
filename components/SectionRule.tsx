import Link from "next/link";

export function SectionRule({
  title,
  meta,
  href,
  metaLabel,
}: {
  title: string;
  meta?: string;
  href?: string;
  metaLabel?: string;
}) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-hair pb-2">
      <h2 className="section-title">
        <span className="mr-2 font-mono font-normal text-wire">{"//"}</span>
        {title}
      </h2>
      <div className="flex items-baseline gap-4">
        {meta && <span className="hidden font-mono text-xs text-muted sm:inline">{meta}</span>}
        {href && metaLabel && (
          <Link
            href={href}
            className="font-mono text-xs text-print transition-colors hover:text-wire"
          >
            [ {metaLabel} ]
          </Link>
        )}
      </div>
    </div>
  );
}
