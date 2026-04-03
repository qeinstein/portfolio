import { ReactNode } from "react";

type SectionShellProps = {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  layout?: "split" | "stacked";
  hasDivider?: boolean;
};

export function SectionShell({
  id,
  eyebrow,
  title,
  children,
  layout = "split",
  hasDivider = true
}: SectionShellProps) {
  const borderClass = hasDivider ? "border-t border-line" : "";

  return (
    <section
      id={id}
      className={
        layout === "stacked"
          ? `${borderClass} py-14 md:py-20`
          : `grid gap-8 ${borderClass} py-14 md:grid-cols-[180px_minmax(0,1fr)] md:gap-10 md:py-20`
      }
    >
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-muted">{eyebrow}</p>
        <h2 className="text-lg font-medium tracking-tight text-ink">{title}</h2>
      </div>
      <div className={layout === "stacked" ? "mt-8" : undefined}>{children}</div>
    </section>
  );
}
