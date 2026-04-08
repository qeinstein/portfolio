import whoIAmRaw from "../../who-i-am.md?raw";

import { MarkdownContent } from "@/components/markdown-content";
import { OnThisPage } from "@/components/on-this-page";
import { extractMarkdownHeadings } from "@/lib/markdown-headings";
import { portfolio } from "@/lib/portfolio-data";
import { usePageMetadata } from "@/lib/seo";

function stripFrontmatter(raw: string) {
  return raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "").trim();
}

export function WhoIAmPage() {
  usePageMetadata({
    title: `Who I Am | ${portfolio.meta.name}`,
    description: "A short, editable overview of who I am and how I work.",
    pathname: "/who-i-am",
  });

  const content = stripFrontmatter(whoIAmRaw);
  const headings = extractMarkdownHeadings(content);

  return (
    <article className="mx-auto max-w-5xl py-16 md:py-24">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="min-w-0">
          <div className="mx-auto max-w-3xl space-y-5 lg:mx-0">
            <p className="text-xs uppercase tracking-[0.24em] text-muted">
              Edit `who-i-am.md`
            </p>
            <h1 className="text-4xl font-medium tracking-tight text-ink md:text-5xl">
              Who I am
            </h1>
          </div>

          <div className="mx-auto mt-10 max-w-3xl lg:hidden lg:mx-0">
            <OnThisPage variant="inline" headings={headings} contentRootId="who-i-am" />
          </div>

          <div id="who-i-am" className="mx-auto mt-10 max-w-3xl lg:mx-0">
            <MarkdownContent content={content} />
          </div>
        </div>
        <OnThisPage headings={headings} contentRootId="who-i-am" />
      </div>
    </article>
  );
}

