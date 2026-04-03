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
          className="rounded-2xl border border-line px-5 py-4 transition-colors duration-200 hover:bg-surface"
        >
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
            {previous.label}
          </p>
          <p className="mt-2 text-base font-medium tracking-tight text-ink">
            {previous.title}
          </p>
        </Link>
      ) : (
        <div className="hidden md:block" />
      )}
      {next ? (
        <Link
          to={next.href}
          className="rounded-2xl border border-line px-5 py-4 transition-colors duration-200 hover:bg-surface md:text-right"
        >
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
            {next.label}
          </p>
          <p className="mt-2 text-base font-medium tracking-tight text-ink">
            {next.title}
          </p>
        </Link>
      ) : (
        <div className="hidden md:block" />
      )}
    </nav>
  );
}
