import { portfolio } from "@/lib/portfolio-data";
import { FadeIn } from "./fade-in";

export function PublicationsList() {
  return (
    <div className="space-y-12">
      {portfolio.publications.map((pub, index) => {
        const isQuantum = pub.title.toLowerCase().includes("quantum");

        return (
          <FadeIn key={pub.title} delay={index * 0.08}>
            <article className="grid gap-6 md:grid-cols-[180px_1fr] md:gap-8 border-b border-line/40 pb-10 last:border-0 last:pb-0">
              {/* Left Column: Metadata & Links */}
              <div className="space-y-2.5">
                <div className="flex flex-wrap gap-2 md:flex-col md:items-start">
                  <span className="inline-flex rounded-full font-mono text-[9px] font-semibold uppercase tracking-wider text-accent bg-accent/8 border border-accent/20 px-2.5 py-0.5">
                    {pub.journal.replace("Published on ", "")}
                  </span>
                  <span className="font-mono text-[10px] text-muted mt-0.5 md:mt-0">
                    {pub.date}
                  </span>
                </div>
                
                <div className="pt-2 flex flex-row gap-3 md:flex-col md:gap-1.5">
                  <a
                    href={pub.link}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-accent hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Read Publication
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17L17 7" />
                      <path d="M10 7h7v7" />
                    </svg>
                  </a>
                  {pub.codeLink && (
                    <a
                      href={pub.codeLink}
                      className="text-[11px] text-muted hover:text-ink transition-colors duration-200"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Code Repository &rarr;
                    </a>
                  )}
                </div>
              </div>

              {/* Right Column: Content and Metrics */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-secondary text-lg font-medium leading-snug text-ink transition-colors duration-200 hover:text-accent">
                    <a href={pub.link} target="_blank" rel="noreferrer">
                      {pub.title}
                    </a>
                  </h3>
                  
                  {/* Author list with Toheeb's name highlighted */}
                  <p className="text-xs text-muted font-secondary">
                    {pub.authors.split(", ").map((author, idx, arr) => {
                      const isToheeb = author.includes("Toheeb");
                      return (
                        <span key={author}>
                          <span className={isToheeb ? "font-semibold text-ink" : "text-muted"}>
                            {author}
                          </span>
                          {idx < arr.length - 1 ? ", " : ""}
                        </span>
                      );
                    })}
                  </p>
                </div>

                <p className="text-sm leading-relaxed text-muted">
                  {pub.summary}
                </p>

                {/* Key Empirical Results Metric Grid */}
                <div className="rounded border border-line bg-surface/5 py-4 px-5 space-y-3">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink font-semibold block">
                    Empirical Metrics &amp; Benchmarks
                  </span>
                  
                  {isQuantum ? (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 text-xs pt-1">
                      <div className="space-y-0.5 border-l border-accent/30 pl-3">
                        <span className="text-muted block text-[9px] uppercase tracking-wider font-mono">Trials &amp; Grid</span>
                        <span className="font-mono font-medium text-ink">10 datasets, 110+ runs</span>
                      </div>
                      <div className="space-y-0.5 border-l border-accent/30 pl-3">
                        <span className="text-muted block text-[9px] uppercase tracking-wider font-mono">Rank Collapse</span>
                        <span className="font-mono font-medium text-ink">erank ↓ 1.04, κ ↑ 5.7×10⁹</span>
                      </div>
                      <div className="space-y-0.5 border-l border-accent/30 pl-3">
                        <span className="text-muted block text-[9px] uppercase tracking-wider font-mono">CKA Equivalence</span>
                        <span className="font-mono font-medium text-ink">CKA ≥ 0.95 (7/10 datasets)</span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 text-xs pt-1">
                      <div className="space-y-0.5 border-l border-accent/30 pl-3">
                        <span className="text-muted block text-[9px] uppercase tracking-wider font-mono">Semantic Noise</span>
                        <span className="font-mono font-medium text-ink">82.5% accuracy (1k words)</span>
                      </div>
                      <div className="space-y-0.5 border-l border-accent/30 pl-3">
                        <span className="text-muted block text-[9px] uppercase tracking-wider font-mono">Random Context</span>
                        <span className="font-mono font-medium text-ink">97.5% accuracy (4k words)</span>
                      </div>
                      <div className="space-y-0.5 border-l border-accent/30 pl-3">
                        <span className="text-muted block text-[9px] uppercase tracking-wider font-mono">Failure Mode</span>
                        <span className="font-mono font-medium text-ink">24% distractor adoption</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Detailed list of findings */}
                  <ul className="text-xs text-muted space-y-2 pt-3 border-t border-line/30">
                    {pub.findings.map((finding, idx) => (
                      <li key={idx} className="relative pl-4 before:absolute before:left-0 before:top-2 before:h-1 before:w-1 before:rounded-full before:bg-accent/80 leading-relaxed">
                        {finding}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          </FadeIn>
        );
      })}
    </div>
  );
}
export default PublicationsList;
