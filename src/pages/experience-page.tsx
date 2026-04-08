import { ExperienceList } from "@/components/experience-list";
import { portfolio } from "@/lib/portfolio-data";
import { usePageMetadata } from "@/lib/seo";

export function ExperiencePage() {
  usePageMetadata({
    title: `Experience | ${portfolio.meta.name}`,
    description: "Roles, internships, and shipped work.",
    pathname: "/experience",
  });

  return (
    <section className="mx-auto max-w-5xl py-16 md:py-24">
      <div className="space-y-6">
        <p className="text-xs uppercase tracking-[0.24em] text-muted">Experience</p>
        <h1 className="text-4xl font-medium tracking-tight text-ink md:text-5xl">
          Experience
        </h1>
        <p className="text-[15px] leading-8 text-muted md:text-base">
          Roles, internships, and the work I shipped along the way.
        </p>
      </div>
      <div className="mt-14 border-t border-line pt-2">
        <ExperienceList />
      </div>
    </section>
  );
}
