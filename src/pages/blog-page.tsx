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
    <section className="mx-auto max-w-5xl py-16 md:py-24">
      <div className="space-y-6">
        <p className="text-sm text-muted">I write Interesting things, Enjoy your read.</p>
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
      <div className="mt-12">
        <BlogList />
      </div>
    </section>
  );
}
