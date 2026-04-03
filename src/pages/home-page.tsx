import { BlogList } from "@/components/blog-list";
import { ExperienceList } from "@/components/experience-list";
import { HeroComponent } from "@/components/hero-component";
import { ProjectGrid } from "@/components/project-grid";
import { SectionShell } from "@/components/section-shell";
import { SkillTags } from "@/components/skill-tags";
import { portfolio } from "@/lib/portfolio-data";
import { usePageMetadata } from "@/lib/seo";

export function HomePage() {
  usePageMetadata({
    title: `${portfolio.meta.name} | Backend, Distributed Systems, and AI`,
    description: portfolio.hero.subheadline,
    pathname: "/"
  });

  return (
    <>
      <HeroComponent />
      <SectionShell id="about" eyebrow="About" title="About">
        <p className="max-w-3xl text-base leading-8 text-muted md:text-lg">
          {portfolio.about}
        </p>
      </SectionShell>
      <SectionShell id="experience" eyebrow="Experience" title="Experience">
        <ExperienceList />
      </SectionShell>
      <SectionShell id="projects" eyebrow="Projects" title="Projects">
        <ProjectGrid />
      </SectionShell>
      <SectionShell id="skills" eyebrow="Skills" title="Skills">
        <SkillTags />
      </SectionShell>
      <SectionShell id="blog-preview" eyebrow="Blog" title="Blog">
        <BlogList />
      </SectionShell>
    </>
  );
}
