import { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  rightBadge?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  rightBadge,
}: PageHeaderProps) {
  return (
    <div className="app-divider border-b pb-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="app-button-secondary inline-flex w-fit rounded-md border px-3 py-1 text-sm font-medium shadow-sm">
          {eyebrow}
        </p>
        {rightBadge ? (
          <span className="app-badge-neutral inline-flex w-fit rounded-md border px-2 py-1 text-xs font-semibold">
            {rightBadge}
          </span>
        ) : null}
      </div>
      <h1 className="app-text text-3xl font-semibold leading-tight sm:text-4xl">
        {title}
      </h1>
      {children}
      <p className="app-muted mt-3 max-w-2xl text-sm leading-6 sm:text-base">
        {description}
      </p>
    </div>
  );
}
