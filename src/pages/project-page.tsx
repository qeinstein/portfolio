import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { ContentMetaStrip } from "@/components/content-meta-strip";
import { ContentPagination } from "@/components/content-pagination";
import { MarkdownContent } from "@/components/markdown-content";
import { NotFoundState } from "@/components/not-found-state";
import { OnThisPage } from "@/components/on-this-page";
import {
  getAdjacentEntries,
  getProjectEntryBySlug,
  projectEntries,
  type ProjectEntry,
} from "@/lib/content";
import { extractMarkdownHeadings } from "@/lib/markdown-headings";
import { portfolio } from "@/lib/portfolio-data";
import { usePageMetadata } from "@/lib/seo";

export function ProjectPage() {
  const { slug } = useParams();
  const projectMeta = projectEntries.find((entry) => entry.slug === slug);
  const { previous, next } = getAdjacentEntries(projectEntries, slug);
  const [project, setProject] = useState<ProjectEntry | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(projectMeta));

  usePageMetadata(
    projectMeta
      ? {
          title: `${projectMeta.title} | Projects | ${portfolio.meta.name}`,
          description: projectMeta.excerpt,
          pathname: `/projects/${projectMeta.slug}`,
        }
      : {
          title: `Missing project | ${portfolio.meta.name}`,
          description: "The requested project case study could not be found.",
          pathname: "/",
        }
  );

  useEffect(() => {
    let isCancelled = false;

    if (!projectMeta) {
      setProject(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    getProjectEntryBySlug(slug)
      .then((entry) => {
        if (!isCancelled) {
          setProject(entry ?? null);
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
  }, [projectMeta, slug]);

  if (!projectMeta) {
    return (
      <NotFoundState
        eyebrow="Missing project"
        title="This case study is not available."
        description="The project link is broken or the case study has not been published."
      />
    );
  }

  const headings = useMemo(
    () => (project?.content ? extractMarkdownHeadings(project.content) : []),
    [project?.content]
  );

  return (
    <article className="mx-auto max-w-5xl py-16 md:py-24">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="min-w-0">
          <div className="mx-auto max-w-3xl space-y-6 lg:mx-0">
            <Link
              to="/#projects"
              className="inline-flex text-sm text-muted transition-colors duration-200 hover:text-ink"
            >
              Back to projects
            </Link>
            <h1 className="text-4xl font-medium tracking-tight text-ink md:text-5xl">
              {projectMeta.title}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted">
              {projectMeta.excerpt}
            </p>
            <ContentMetaStrip
              items={[
                {
                  label: "Role",
                  value: projectMeta.role || "Independent build",
                },
                {
                  label: "Stack",
                  value:
                    projectMeta.stack.length > 0
                      ? projectMeta.stack.join(", ")
                      : "TBD",
                },
                {
                  label: "Status",
                  value: projectMeta.status || "Shipped",
                },
                {
                  label: "Links",
                  value:
                    projectMeta.link || projectMeta.repo ? (
                      <span className="flex flex-wrap gap-3">
                        {projectMeta.link ? (
                          <a
                            href={projectMeta.link}
                            className="transition-opacity duration-200 hover:opacity-70"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Live
                          </a>
                        ) : null}
                        {projectMeta.repo ? (
                          <a
                            href={projectMeta.repo}
                            className="transition-opacity duration-200 hover:opacity-70"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Repo
                          </a>
                        ) : null}
                      </span>
                    ) : (
                      "Available on request"
                    ),
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
          <div id="article-content" className="mx-auto mt-12 max-w-3xl border-t border-line pt-8 lg:mx-0">
            {isLoading || !project ? (
              <p className="text-base leading-8 text-muted">Loading project...</p>
            ) : (
              <MarkdownContent content={project.content} />
            )}
          </div>
          <div className="mx-auto mt-12 max-w-3xl lg:mx-0">
            <ContentPagination
              previous={
                previous
                  ? {
                      href: `/projects/${previous.slug}`,
                      label: "Previous project",
                      title: previous.title,
                    }
                  : undefined
              }
              next={
                next
                  ? {
                      href: `/projects/${next.slug}`,
                      label: "Next project",
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
