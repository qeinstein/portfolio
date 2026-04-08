import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { ContentMetaStrip } from "@/components/content-meta-strip";
import { ContentPagination } from "@/components/content-pagination";
import { MarkdownContent } from "@/components/markdown-content";
import { NotFoundState } from "@/components/not-found-state";
import { OnThisPage } from "@/components/on-this-page";
import {
  blogPosts,
  formatContentDate,
  getAdjacentEntries,
  getBlogPostBySlug,
  type BlogEntry,
} from "@/lib/content";
import { extractMarkdownHeadings } from "@/lib/markdown-headings";
import { portfolio } from "@/lib/portfolio-data";
import { usePageMetadata } from "@/lib/seo";

export function BlogPostPage() {
  const { slug } = useParams();
  const postMeta = blogPosts.find((entry) => entry.slug === slug);
  const { previous, next } = getAdjacentEntries(blogPosts, slug);
  const [post, setPost] = useState<BlogEntry | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(postMeta));

  usePageMetadata(
    postMeta
      ? {
          title: `${postMeta.title} | Blog | ${portfolio.meta.name}`,
          description: postMeta.excerpt,
          pathname: `/blog/${postMeta.slug}`,
          type: "article",
        }
      : {
          title: `Missing post | ${portfolio.meta.name}`,
          description: "The requested blog post could not be found.",
          pathname: "/blog",
        }
  );

  useEffect(() => {
    let isCancelled = false;

    if (!postMeta) {
      setPost(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    getBlogPostBySlug(slug)
      .then((entry) => {
        if (!isCancelled) {
          setPost(entry ?? null);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [postMeta, slug]);

  if (!postMeta) {
    return (
      <NotFoundState
        eyebrow="Missing post"
        title="This post is not available."
        description="The article may be unpublished, renamed, or removed."
      />
    );
  }

  const headings = useMemo(
    () => (post?.content ? extractMarkdownHeadings(post.content) : []),
    [post?.content]
  );

  return (
    <article className="mx-auto max-w-5xl py-16 md:py-24">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="min-w-0">
          <div className="mx-auto max-w-3xl space-y-5 lg:mx-0">
            <p className="text-[11px] uppercase tracking-[0.24em] text-muted">Blog</p>
            <h1 className="text-4xl font-medium tracking-tight text-ink md:text-5xl">
              {postMeta.title}
            </h1>
            <p className="text-base leading-7 text-muted">{postMeta.excerpt}</p>
            <ContentMetaStrip
              items={[
                {
                  label: "Published",
                  value: formatContentDate(postMeta.date),
                },
                {
                  label: "Tags",
                  value:
                    postMeta.tags.length > 0
                      ? postMeta.tags.join(", ")
                      : "General notes",
                },
              ]}
            />
          </div>
          <div className="mx-auto mt-10 max-w-3xl lg:hidden lg:mx-0">
            <OnThisPage
              variant="inline"
              headings={headings}
              contentRootId="article-content"
            />
          </div>
          <div id="article-content" className="mx-auto mt-10 max-w-3xl lg:mx-0">
            {isLoading || !post ? (
              <p className="text-base leading-8 text-muted">Loading post...</p>
            ) : (
              <MarkdownContent content={post.content} />
            )}
          </div>
          <div className="mx-auto mt-12 max-w-3xl lg:mx-0">
            <ContentPagination
              previous={
                previous
                  ? {
                      href: `/blog/${previous.slug}`,
                      label: "Newer post",
                      title: previous.title,
                    }
                  : undefined
              }
              next={
                next
                  ? {
                      href: `/blog/${next.slug}`,
                      label: "Older post",
                      title: next.title,
                    }
                  : undefined
              }
            />
          </div>
        </div>
        <OnThisPage headings={headings} contentRootId="article-content" />
      </div>
    </article>
  );
}
