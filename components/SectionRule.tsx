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
    <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-hair pb-3">
      <h2 className="section-title relative flex items-center gap-3">
        <span aria-hidden className="relative flex h-4 w-4 items-center justify-center">
          <span className="absolute inset-0 rounded-full border border-wire/50" />
          <span className="h-1.5 w-1.5 rounded-full bg-wire shadow-[0_0_6px_rgba(92,225,255,0.8)]" />
        </span>
        {title}
      </h2>
      <div className="flex items-baseline gap-4">
        {meta && <span className="hidden font-mono text-xs text-muted sm:inline">{meta}</span>}
        {href && metaLabel && (
          <Link
            href={href}
            className="group inline-flex items-center gap-1 font-mono text-xs text-print underline-offset-4 transition-colors hover:text-wire"
          >
            {metaLabel}
            <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        )}
      </div>
    </div>
  );
}
