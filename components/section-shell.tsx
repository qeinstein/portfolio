import { ReactNode } from "react";
import { motion } from "framer-motion";

type SectionShellProps = {
  id: string;
  title: string;
  children: ReactNode;
  action?: ReactNode;
  layout?: "split" | "stacked";
  hasDivider?: boolean;
};

export function SectionShell({
  id,
  title,
  children,
  action,
  layout = "split",
  hasDivider = true
}: SectionShellProps) {
  const borderClass = hasDivider ? "border-t border-line" : "";

  return (
    <section
      id={id}
      className={
        layout === "stacked"
          ? `${borderClass} py-9 md:py-12`
          : `grid gap-8 ${borderClass} py-9 md:grid-cols-[180px_minmax(0,1fr)] md:gap-10 md:py-12`
      }
    >
      <div
        className={
          layout === "stacked"
            ? "flex flex-wrap items-end justify-between gap-6"
            : "space-y-2"
        }
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <motion.span
              className="inline-block h-5 w-0.5 origin-top rounded-full bg-accent"
              aria-hidden="true"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
            <h2 className="text-xl font-medium tracking-tight text-ink md:text-2xl">
              {title}
            </h2>
          </div>
        </div>
        {layout === "stacked" ? action : null}
      </div>
      <div className={layout === "stacked" ? "mt-6" : undefined}>{children}</div>
    </section>
  );
}
