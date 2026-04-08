import { Link } from "react-router-dom";

type PaginationEntry = {
  href: string;
  label: string;
  title: string;
};

type ContentPaginationProps = {
  previous?: PaginationEntry;
  next?: PaginationEntry;
};

export function ContentPagination({
  previous,
  next
}: ContentPaginationProps) {
  if (!previous && !next) {
    return null;
  }

  return (
    <nav
      aria-label="Content navigation"
      className="grid gap-3 border-t border-line pt-8 md:grid-cols-2"
    >
      {previous ? (
        <Link
          to={previous.href}
          className="group flex items-start justify-between gap-6 py-3 transition-colors duration-200 hover:text-ink"
        >
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
              {previous.label}
            </p>
            <p className="mt-2 text-base font-medium tracking-tight text-ink transition-colors duration-200 group-hover:text-accent">
              {previous.title}
            </p>
          </div>
          <span className="shrink-0 text-sm text-muted transition-colors duration-200 group-hover:text-ink">
            View
          </span>
        </Link>
      ) : (
        <div className="hidden md:block" />
      )}
      {next ? (
        <Link
          to={next.href}
          className="group flex items-start justify-between gap-6 py-3 transition-colors duration-200 hover:text-ink md:flex-row-reverse md:text-right"
        >
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
              {next.label}
            </p>
            <p className="mt-2 text-base font-medium tracking-tight text-ink transition-colors duration-200 group-hover:text-accent">
              {next.title}
            </p>
          </div>
          <span className="shrink-0 text-sm text-muted transition-colors duration-200 group-hover:text-ink">
            View
          </span>
        </Link>
      ) : (
        <div className="hidden md:block" />
      )}
    </nav>
  );
}
