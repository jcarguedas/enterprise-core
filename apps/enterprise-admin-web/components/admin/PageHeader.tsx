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
    <div className="border-b border-[#d8dee8] pb-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="inline-flex w-fit rounded-md border border-[#c9d3e2] bg-white px-3 py-1 text-sm font-medium text-[#334155] shadow-sm">
          {eyebrow}
        </p>
        {rightBadge ? (
          <span className="inline-flex w-fit rounded-md border border-[#cbd5e1] bg-[#f8fafc] px-2 py-1 text-xs font-semibold text-[#334155]">
            {rightBadge}
          </span>
        ) : null}
      </div>
      <h1 className="text-3xl font-semibold leading-tight text-[#0f172a] sm:text-4xl">
        {title}
      </h1>
      {children}
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#475569] sm:text-base">
        {description}
      </p>
    </div>
  );
}
