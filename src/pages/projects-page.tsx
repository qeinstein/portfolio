import { ProjectGrid } from "@/components/project-grid";
import { portfolio } from "@/lib/portfolio-data";
import { usePageMetadata } from "@/lib/seo";

export function ProjectsPage() {
  usePageMetadata({
    title: `Projects | ${portfolio.meta.name}`,
    description: "A selection of projects and case studies.",
    pathname: "/projects",
  });

  return (
    <section className="mx-auto max-w-5xl py-16 md:py-24">
      <div className="space-y-6">
        <p className="text-xs uppercase tracking-[0.24em] text-muted">Projects</p>
        <h1 className="text-4xl font-medium tracking-tight text-ink md:text-5xl">
          Projects
        </h1>
        <p className="text-[15px] leading-8 text-muted md:text-base">
          Case studies, experiments, and shipped work.
        </p>
      </div>
      <div className="mt-14 border-t border-line pt-2">
        <ProjectGrid />
      </div>
    </section>
  );
}
