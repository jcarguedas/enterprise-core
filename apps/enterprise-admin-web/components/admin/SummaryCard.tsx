type SummaryCardProps = {
  description: string;
  status?: string;
  title: string;
};

export function SummaryCard({ description, status, title }: SummaryCardProps) {
  return (
    <article className="rounded-lg border border-[#d8dee8] bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold text-[#0f172a]">{title}</h2>
        {status ? (
          <span className="inline-flex shrink-0 rounded-md border border-[#cbd5e1] bg-[#f8fafc] px-2 py-1 text-xs font-semibold text-[#334155]">
            {status}
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-sm leading-6 text-[#475569]">{description}</p>
    </article>
  );
}
