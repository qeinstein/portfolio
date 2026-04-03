import { BlogList } from "@/components/blog-list";
import { TextType } from "@/components/text-type";
import { portfolio } from "@/lib/portfolio-data";
import { usePageMetadata } from "@/lib/seo";

export function BlogPage() {
  usePageMetadata({
    title: `Blog | ${portfolio.meta.name}`,
    description: "Writing on distributed systems, AI architectures, and open-source.",
    pathname: "/blog"
  });

  return (
    <section className="mx-auto max-w-3xl py-16 md:py-24">
      <div className="space-y-6">
        <p className="text-xs uppercase tracking-[0.24em] text-muted">Blog</p>
        <h1 className="text-4xl font-medium tracking-tight text-ink md:text-5xl">
          Thoughts on distributed systems, AI architectures, and open-source.
        </h1>
        <p className="text-[15px] leading-8 text-muted md:text-base">
          Writing on{" "}
          <TextType
            texts={[
              "distributed systems",
              "AI architectures",
              "open-source"
            ]}
            className="text-ink"
          />
          .
        </p>
      </div>
      <div className="mt-14 border-t border-line pt-8">
        <BlogList />
      </div>
    </section>
  );
}
