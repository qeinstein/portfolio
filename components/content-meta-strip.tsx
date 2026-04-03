import { ReactNode } from "react";

type ContentMetaItem = {
  label: string;
  value: ReactNode;
};

type ContentMetaStripProps = {
  items: ContentMetaItem[];
};

export function ContentMetaStrip({ items }: ContentMetaStripProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-line bg-surface/55 px-4 py-4"
        >
          <dt className="text-[11px] uppercase tracking-[0.22em] text-muted">
            {item.label}
          </dt>
          <dd className="mt-2 text-sm leading-7 text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
