import { BlogList } from "@/components/blog-list";
import { ExperienceList } from "@/components/experience-list";
import { HeroComponent } from "@/components/hero-component";
import { ProjectGrid } from "@/components/project-grid";
import { SectionShell } from "@/components/section-shell";
import { SkillTags } from "@/components/skill-tags";
import { projectEntries } from "@/lib/content";
import { portfolio } from "@/lib/portfolio-data";
import { usePageMetadata } from "@/lib/seo";
import { Link } from "react-router-dom";

export function HomePage() {
  usePageMetadata({
    title: `${portfolio.meta.name} | Backend, Distributed Systems, and AI`,
    description: portfolio.hero.subheadline,
    pathname: "/"
  });

  const featuredExperiences = portfolio.experience.filter((item) => item.featured);
  const experiencePreview = (featuredExperiences.length > 0
    ? featuredExperiences
    : portfolio.experience
  ).slice(0, 2);

  const featuredProjects = projectEntries.filter((item) => item.featured);
  const projectsPreview = (featuredProjects.length > 0
    ? featuredProjects
    : projectEntries
  ).slice(0, 3);

  return (
    <>
      <HeroComponent />
      <SectionShell
        id="experience"
        title="Experience"
        layout="stacked"
        action={
          <Link
            to="/experience"
            className="text-sm text-muted transition duration-200 hover:text-ink hover:drop-shadow-[0_0_12px_rgba(79,70,229,0.45)]"
          >
            View all &rarr;
          </Link>
        }
      >
        <ExperienceList items={experiencePreview} />
      </SectionShell>
      <SectionShell
        id="projects"
        title="Projects"
        layout="stacked"
        action={
          <Link
            to="/projects"
            className="text-sm text-muted transition duration-200 hover:text-ink hover:drop-shadow-[0_0_12px_rgba(79,70,229,0.45)]"
          >
            View all &rarr;
          </Link>
        }
      >
        <ProjectGrid items={projectsPreview} />
      </SectionShell>
      <SectionShell id="skills" title="Skills" layout="stacked">
        <SkillTags />
      </SectionShell>
      <SectionShell
        id="blog-preview"
        title="Blog"
        layout="stacked"
        action={
          <Link
            to="/blog"
            className="text-sm text-muted transition duration-200 hover:text-ink hover:drop-shadow-[0_0_12px_rgba(79,70,229,0.45)]"
          >
            All posts &rarr;
          </Link>
        }
      >
        <BlogList />
      </SectionShell>
    </>
  );
}
