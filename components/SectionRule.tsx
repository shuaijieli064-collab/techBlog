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
      <h2 className="section-title flex items-center gap-2.5">
        <span aria-hidden className="h-3.5 w-[3px] shrink-0 bg-wire" />
        {title}
      </h2>
      <div className="flex items-baseline gap-4">
        {meta && <span className="hidden font-mono text-xs text-muted sm:inline">{meta}</span>}
        {href && metaLabel && (
          <Link
            href={href}
            className="font-mono text-xs text-print underline-offset-4 transition-colors hover:text-wire hover:underline"
          >
            {metaLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
