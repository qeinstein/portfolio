import { Link } from "react-router-dom";

import { projectEntries, type ProjectEntryMeta } from "@/lib/content";

import { FadeIn } from "./fade-in";

function ProjectCard({
  slug,
  title,
  excerpt,
  stack,
  status
}: ProjectEntryMeta) {
  return (
    <Link to={`/projects/${slug}`} className="block">
      <article className="group py-4 transition-colors duration-200">
        <div className="flex items-start justify-between gap-6">
          <h3 className="max-w-3xl text-lg font-medium tracking-tight text-ink transition-colors duration-200 group-hover:text-accent">
            {title}
          </h3>
          <span className="shrink-0 text-sm text-muted transition-colors duration-200 group-hover:text-ink">
            View
          </span>
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">{excerpt}</p>
        {stack.length > 0 || status ? (
          <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-muted">
            {[stack.slice(0, 3).join(" / "), status].filter(Boolean).join("  •  ")}
          </p>
        ) : null}
      </article>
    </Link>
  );
}

export function ProjectGrid() {
  return (
    <div className="divide-y divide-line">
      {projectEntries.map((project, index) => (
        <FadeIn key={project.slug} delay={index * 0.05}>
          <ProjectCard {...project} />
        </FadeIn>
      ))}
    </div>
  );
}
