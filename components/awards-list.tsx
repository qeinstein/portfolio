import { portfolio } from "@/lib/portfolio-data";
import { FadeIn } from "./fade-in";

export function AwardsList() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {portfolio.awards.map((award, index) => (
        <FadeIn key={award.title} delay={index * 0.08}>
          <div className="rounded-lg border border-line bg-surface/10 p-5 transition-all duration-200 hover:bg-surface/25">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">
                  {award.issuer}
                </span>
                <span className="rounded-full bg-surface px-2 py-0.5 font-mono text-[9px] text-muted">
                  {award.year}
                </span>
              </div>
              <h3 className="font-secondary text-sm font-medium text-ink">
                {award.title}
              </h3>
              <p className="text-xs leading-relaxed text-muted">
                {award.description}
              </p>
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}
