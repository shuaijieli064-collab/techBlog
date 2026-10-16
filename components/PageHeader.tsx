import Link from "next/link";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  code,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  code?: string;
}) {
  return (
    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {(eyebrow || code) && (
          <p className="page-eyebrow">
            {code && (
              <span aria-hidden className="mr-2 text-muted">
                {"// "}
                {code}
                {" · "}
              </span>
            )}
            {eyebrow}
          </p>
        )}
        <h1 className="page-title">{title}</h1>
        {description && <p className="page-desc">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function BackHome() {
  return (
    <Link href="/" className="btn-secondary shrink-0">
      返回首页
    </Link>
  );
}
