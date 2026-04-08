import { Link } from "react-router-dom";

import {
  blogPosts,
  formatContentDate,
  type BlogEntryMeta
} from "@/lib/content";

import { FadeIn } from "./fade-in";

function BlogItem({
  slug,
  date,
  title,
  excerpt,
  tags
}: BlogEntryMeta) {
  return (
    <Link
      to={`/blog/${slug}`}
      className="-mx-4 grid gap-2 rounded-lg px-4 py-5 transition-colors duration-200 hover:bg-surface/40 hover:text-ink md:grid-cols-[160px_minmax(0,1fr)]"
    >
      <p className="text-sm text-muted">{formatContentDate(date)}</p>
      <div className="space-y-1">
        <h3 className="text-base font-medium text-ink">{title}</h3>
        <p className="text-sm leading-7 text-muted">{excerpt}</p>
        {tags.length > 0 ? (
          <p className="pt-1 text-[11px] uppercase tracking-[0.22em] text-muted">
            {tags.join(" / ")}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

export function BlogList() {
  return (
    <div className="divide-y divide-line">
        {blogPosts.map((post, index) => (
          <FadeIn key={post.slug} delay={index * 0.05}>
            <BlogItem {...post} />
          </FadeIn>
        ))}
    </div>
  );
}
