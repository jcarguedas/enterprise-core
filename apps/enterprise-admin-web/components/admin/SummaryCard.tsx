type SummaryCardProps = {
  description: string;
  status?: string;
  title: string;
};

export function SummaryCard({ description, status, title }: SummaryCardProps) {
  return (
    <article className="app-card rounded-lg border p-5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="app-text text-base font-semibold">{title}</h2>
        {status ? (
          <span className="app-badge-neutral inline-flex shrink-0 rounded-md border px-2 py-1 text-xs font-semibold">
            {status}
          </span>
        ) : null}
      </div>
      <p className="app-muted mt-4 text-sm leading-6">{description}</p>
    </article>
  );
}
