import { BlogList } from "@/components/blog-list";
import { ExperienceList } from "@/components/experience-list";
import { HeroComponent } from "@/components/hero-component";
import { ProjectGrid } from "@/components/project-grid";
import { SectionShell } from "@/components/section-shell";
import { SkillTags } from "@/components/skill-tags";
import { PublicationsList } from "@/components/publications-list";
import { AwardsList } from "@/components/awards-list";
import { projectEntries } from "@/lib/content";
import { portfolio } from "@/lib/portfolio-data";
import { usePageMetadata } from "@/lib/seo";
import { Link } from "react-router-dom";

export function HomePage() {
  usePageMetadata({
    title: `${portfolio.meta.name} | AI & Systems Engineer`,
    description: portfolio.hero.subheadline,
    pathname: "/"
  });

  const featuredExperiences = portfolio.experience.filter((item) => item.featured);
  const experiencePreview = featuredExperiences.length > 0
    ? featuredExperiences
    : portfolio.experience;

  const featuredProjects = projectEntries.filter((item) => item.featured);
  const projectsPreview = featuredProjects.length > 0
    ? featuredProjects
    : projectEntries;

  return (
    <>
      <HeroComponent />
      
      <SectionShell id="about" title="About" layout="stacked">
        <p className="text-[15px] leading-8 text-muted md:text-base max-w-4xl">
          {portfolio.about}
        </p>
      </SectionShell>

      <SectionShell
        id="research"
        title="Research"
        layout="stacked"
      >
        <PublicationsList />
      </SectionShell>

      <SectionShell
        id="experience"
        title="Experience"
        layout="stacked"
        action={
          <Link
            to="/experience"
            className="glow-hover text-xs font-semibold uppercase tracking-wider text-muted transition duration-200 hover:text-ink"
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
            className="glow-hover text-xs font-semibold uppercase tracking-wider text-muted transition duration-200 hover:text-ink"
          >
            View all &rarr;
          </Link>
        }
      >
        <ProjectGrid items={projectsPreview} />
      </SectionShell>

      <SectionShell id="awards" title="Awards" layout="stacked">
        <AwardsList />
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
            className="glow-hover text-xs font-semibold uppercase tracking-wider text-muted transition duration-200 hover:text-ink"
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
export default HomePage;
