import { portfolio } from "@/lib/portfolio-data";
import { usePageMetadata } from "@/lib/seo";
import { motion } from "framer-motion";

export function WhoIAmPage() {
  usePageMetadata({
    title: `Who I Am | ${portfolio.meta.name}`,
    description: "A short overview of who I am, how I work, and what I care about.",
    pathname: "/who-i-am",
  });

  const fadeIn = (delay: number) => ({
    initial: { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <article className="mx-auto max-w-4xl py-12 md:py-20 space-y-12">
      {/* Page Header */}
      <header className="space-y-4 border-b border-line pb-8">
        <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-accent">
          BIOGRAPHY
        </p>
        <h1 className="text-3xl font-medium tracking-tight text-ink md:text-5xl">
          Who I Am
        </h1>
        <p className="text-base text-muted max-w-2xl leading-relaxed">
          A software engineer and AI researcher operating at the convergence of distributed systems, machine learning compression, and quantum computing.
        </p>
      </header>

      {/* Main Grid Content */}
      <div className="grid gap-10 md:grid-cols-[1fr_300px]">
        {/* Left Column: Narrative */}
        <div className="space-y-8 min-w-0">
          <section className="space-y-4">
            <h2 className="font-secondary text-xl font-medium text-ink">Introduction</h2>
            <p className="text-sm leading-7 text-muted">
              I’m Toheeb — a backend and AI engineer focused on building reliable systems with clear boundaries, visible failure modes, and good operational ergonomics. I build things with the understanding that software is meant to run under constraints, fail deterministically, and remain understandable under load.
            </p>
            <p className="text-sm leading-7 text-muted">
              Rather than chasing hype cycles, I spend my time exploring how deep mathematical models (such as quantum computing) translate into practical computation, and how to optimize key pipelines (like LLM memory caching) to make advanced AI run effectively.
            </p>
          </section>

          {/* Quote Block */}
          <motion.blockquote 
            className="border-l-2 border-accent bg-surface/15 p-4 rounded-r-md"
            {...fadeIn(0.05)}
          >
            <p className="font-mono text-xs italic leading-6 text-ink">
              "I prefer designs that make tradeoffs explicit—such as capacity, backpressure, and correctness bounds—over abstractions that pretend complexity doesn't exist."
            </p>
          </motion.blockquote>

          <section className="space-y-4">
            <h2 className="font-secondary text-xl font-medium text-ink">How I Work</h2>
            <div className="space-y-3 text-sm leading-7 text-muted">
              <p>
                <strong>Tight Feedback Loops:</strong> I write code to be shipped small, measured continuously, and iterated on. Running benchmarks is not an afterthought—it’s how I validate design decisions.
              </p>
              <p>
                <strong>Observability in the Hot Path:</strong> I believe if a failure mode isn't visible, the feature isn't done. I design APIs to return actionable errors and backpressure headers rather than silently degrading.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-secondary text-xl font-medium text-ink">Outside Work</h2>
            <p className="text-sm leading-7 text-muted">
              I’m exploring quantum computing alongside AI research. I enjoy writing detailed reports on my findings, conducting empirical benchmarks (like matched spectral analysis of feature maps), and contributing to open-source systems.
            </p>
          </section>
        </div>

        {/* Right Column: Key Metrics & Info cards */}
        <div className="space-y-6">
          {/* Card: What I Care About */}
          <div className="rounded-lg border border-line bg-surface/10 p-5 space-y-4">
            <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
              Core Focus
            </h3>
            <ul className="space-y-3">
              <li className="space-y-1">
                <h4 className="text-xs font-medium text-ink">Concurrency &amp; Distributed Core</h4>
                <p className="text-[11px] leading-relaxed text-muted">Go G-M-P scheduler mechanics, channels, thread-safety, and database replication patterns.</p>
              </li>
              <li className="space-y-1">
                <h4 className="text-xs font-medium text-ink">AI Research</h4>
                <p className="text-[11px] leading-relaxed text-muted">LLM evaluation, agent architectures, and KV cache optimization.</p>
              </li>
              <li className="space-y-1">
                <h4 className="text-xs font-medium text-ink">Quantum Computing</h4>
                <p className="text-[11px] leading-relaxed text-muted">Exploring how quantum algorithms and feature maps apply to machine learning.</p>
              </li>
            </ul>
          </div>

          {/* Card: Info Sheet */}
          <div className="rounded-lg border border-line bg-surface/10 p-5 space-y-3 text-xs">
            <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
              Metadata
            </h3>
            <div className="flex justify-between py-1.5 border-b border-line/30">
              <span className="text-muted">Current Role</span>
              <span className="text-ink text-right">Founder @ Velarix</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-line/30">
              <span className="text-muted">Education</span>
              <span className="text-ink text-right">B.Sc. Computer Science</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-line/30">
              <span className="text-muted">University</span>
              <span className="text-ink text-right">University of Lagos</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted">Location</span>
              <span className="text-ink text-right">{portfolio.meta.location}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
export default WhoIAmPage;
