import { portfolio } from "@/lib/portfolio-data";
import { FadeIn } from "./fade-in";

export function PublicationsList() {
  return (
    <div className="space-y-8">
      {portfolio.publications.map((pub, index) => (
        <FadeIn key={pub.title} delay={index * 0.08}>
          <article className="group relative rounded-lg border border-line bg-surface/10 p-5 transition-all duration-200 hover:bg-surface/30 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <div className="space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="font-secondary text-lg font-medium leading-tight text-ink transition-colors duration-200 group-hover:text-accent">
                  <a
                    href={pub.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1"
                  >
                    {pub.title}
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-3.5 w-3.5 opacity-60 transition-all duration-200 group-hover:opacity-100 group-hover:text-accent"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17L17 7" />
                      <path d="M10 7h7v7" />
                    </svg>
                  </a>
                </h3>
                <span className="shrink-0 rounded-full border border-line bg-surface/50 px-2.5 py-0.5 font-mono text-[11px] text-muted">
                  {pub.date}
                </span>
              </div>
              <p className="text-xs font-mono text-muted">
                {pub.authors} &middot; <span className="italic">{pub.journal}</span>
              </p>
              <p className="text-sm leading-6 text-muted">{pub.summary}</p>
              
              <div className="space-y-1.5 border-t border-line/40 pt-3">
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink">
                  Empirical Diagnostics &amp; Findings:
                </p>
                <ul className="space-y-1 pl-1 text-xs leading-relaxed text-muted">
                  {pub.findings.map((finding, idx) => (
                    <li key={idx} className="relative pl-3.5 before:absolute before:left-0 before:top-2 before:h-1 before:w-1 before:rounded-full before:bg-accent">
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4 pt-1 text-xs">
                <a
                  href={pub.link}
                  className="text-accent transition-colors duration-200 hover:text-accent/80"
                  target="_blank"
                  rel="noreferrer"
                >
                  Read Paper &rarr;
                </a>
                {pub.codeLink && (
                  <a
                    href={pub.codeLink}
                    className="text-muted transition-colors duration-200 hover:text-ink"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Code Repository
                  </a>
                )}
              </div>
            </div>
          </article>
        </FadeIn>
      ))}
    </div>
  );
}
