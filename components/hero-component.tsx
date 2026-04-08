"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";

import { portfolio } from "@/lib/portfolio-data";

export function HeroComponent() {
  const reduced = useReducedMotion();

  const item = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.52, ease: [0.22, 1, 0.36, 1] },
        };

  return (
    <section className="border-b border-line py-10 md:py-14">
      <div className="max-w-4xl space-y-6">
        <div className="space-y-5">
          <motion.p className="text-[11px] uppercase tracking-[0.24em] text-muted" {...item(0)}>
            {portfolio.meta.titles}
          </motion.p>
          <motion.h1
            className="max-w-4xl text-4xl font-medium leading-[1.02] tracking-tightest text-ink md:text-6xl"
            {...item(0.08)}
          >
            {portfolio.hero.headline}
          </motion.h1>
          <motion.p
            className="max-w-3xl text-[15px] leading-8 text-muted md:text-lg"
            {...item(0.18)}
          >
            {portfolio.hero.subheadline}
          </motion.p>
        </div>
        <motion.div className="flex flex-wrap gap-4" {...item(0.28)}>
          <a
            href={portfolio.meta.githubDirect}
            className="inline-flex items-center gap-2 bg-accent/90 px-5 py-2.5 text-sm font-medium text-canvas transition-all duration-200 hover:bg-accent hover:shadow-[0_0_24px_rgba(var(--accent)/0.35)]"
            target="_blank"
            rel="noreferrer"
          >
            View GitHub
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7" /><path d="M10 7h7v7" /></svg>
          </a>
          <Link
            to="/who-i-am"
            className="inline-flex items-center gap-2 border border-line px-5 py-2.5 text-sm text-ink transition-colors duration-200 hover:bg-surface"
          >
            Who I am
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
          </Link>
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 px-1 py-2.5 text-sm text-muted transition-colors duration-200 hover:text-ink"
          >
            Read Blog
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
