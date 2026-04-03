import { portfolio } from "@/lib/portfolio-data";

import { FadeIn } from "./fade-in";

export function SkillTags() {
  return (
    <div className="divide-y divide-line">
      {Object.entries(portfolio.skills).map(([category, items], index) => (
        <FadeIn key={category} delay={index * 0.05}>
          <article className="grid gap-3 py-5 md:grid-cols-[180px_minmax(0,1fr)] md:gap-8">
            <h3 className="text-[11px] uppercase tracking-[0.22em] text-muted">
              {category}
            </h3>
            <p className="max-w-3xl text-[15px] leading-8 text-ink">
              {items.join(", ")}.
            </p>
          </article>
        </FadeIn>
      ))}
    </div>
  );
}
