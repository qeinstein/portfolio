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
    <dl className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <div key={item.label} className="grid gap-2 py-4 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-6">
          <dt className="text-[11px] uppercase tracking-[0.22em] text-muted">
            {item.label}
          </dt>
          <dd className="text-sm leading-7 text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
