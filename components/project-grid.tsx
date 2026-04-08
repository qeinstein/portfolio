import { Link } from "react-router-dom";

import { projectEntries, type ProjectEntryMeta } from "@/lib/content";

import { FadeIn } from "./fade-in";

function ExternalArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className ?? "h-4 w-4"}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17L17 7" />
      <path d="M10 7h7v7" />
    </svg>
  );
}

function ProjectCard({
  slug,
  title,
  excerpt,
  stack,
  status,
  repo
}: ProjectEntryMeta) {
  const hasRepo = Boolean(repo);

  return (
    <article className="-mx-4 rounded-lg px-4 py-5 transition-colors duration-200 hover:bg-surface/40">
      <div className="grid gap-4 md:grid-cols-[minmax(0,190px)_minmax(0,1fr)_minmax(0,220px)] md:gap-8">
        <div className="min-w-0 space-y-2">
          {hasRepo ? (
            <a
              href={repo}
              className="group/title inline-flex items-center gap-1 font-secondary text-lg font-medium tracking-tight text-ink transition-colors duration-200 hover:text-accent"
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${title} repository`}
            >
              <span className="truncate">{title}</span>
              <ExternalArrowIcon className="h-4 w-4 text-muted transition-colors duration-200 group-hover/title:text-accent" />
            </a>
          ) : (
            <Link
              to={`/projects/${slug}`}
              className="inline-flex items-center gap-1 font-secondary text-lg font-medium tracking-tight text-ink transition-colors duration-200 hover:text-accent"
            >
              <span className="truncate">{title}</span>
            </Link>
          )}
          {status ? (
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
              {status}
            </p>
          ) : null}
        </div>

        <div className="min-w-0 space-y-3">
          <p className="text-sm leading-7 text-muted">{excerpt}</p>
          <Link
            to={`/projects/${slug}`}
            className="group/link inline-flex items-center gap-1.5 text-sm text-muted transition-colors duration-200 hover:text-ink"
          >
            Read case study
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 md:justify-end">
          {stack.map((item) => (
            <span
              key={`${slug}-${item}`}
              className="inline-flex items-center rounded-full border border-line bg-surface/35 px-3 py-1 font-mono text-[11px] font-medium leading-5 tracking-tight text-muted"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

type ProjectGridProps = {
  items?: ProjectEntryMeta[];
};

export function ProjectGrid({ items }: ProjectGridProps) {
  const resolvedItems = items ?? projectEntries;
  return (
    <div className="divide-y divide-line">
      {resolvedItems.map((project, index) => (
        <FadeIn key={project.slug} delay={index * 0.05}>
          <ProjectCard {...project} />
        </FadeIn>
      ))}
    </div>
  );
}
