import { Link } from "react-router-dom";

type NotFoundStateProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

export function NotFoundState({
  eyebrow = "404",
  title = "That page does not exist.",
  description = "The link is missing or the content has moved."
}: NotFoundStateProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-2xl space-y-6">
        <p className="text-[11px] uppercase tracking-[0.24em] text-muted">
          {eyebrow}
        </p>
        <h1 className="text-4xl font-medium tracking-tight text-ink md:text-5xl">
          {title}
        </h1>
        <p className="text-base leading-8 text-muted">{description}</p>
        <div className="flex flex-wrap gap-4 pt-2">
          <Link
            to="/"
            className="inline-flex items-center rounded-full border border-line px-4 py-2 text-sm text-ink transition-colors duration-200 hover:bg-surface"
          >
            Back home
          </Link>
          <Link
            to="/blog"
            className="inline-flex items-center px-1 py-2 text-sm text-muted transition-colors duration-200 hover:text-ink"
          >
            Browse the blog
          </Link>
        </div>
      </div>
    </section>
  );
}
