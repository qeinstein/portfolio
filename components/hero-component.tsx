"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";

import { portfolio } from "@/lib/portfolio-data";
import { TextType } from "@/components/text-type";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export function HeroComponent() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      variants={container}
      initial={prefersReducedMotion ? false : "hidden"}
      animate={prefersReducedMotion ? undefined : "show"}
      className="border-b border-line py-16 md:py-24"
    >
      <div className="max-w-4xl space-y-8">
        <motion.div variants={item} className="space-y-5">
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted">
            {portfolio.meta.titles}
          </p>
          <h1 className="max-w-4xl text-4xl font-medium leading-[1.02] tracking-tightest text-ink md:text-6xl">
            {portfolio.hero.headline}
          </h1>
          <p className="max-w-3xl text-[15px] leading-8 text-muted md:text-lg">
            Contributor @lima. Currently exploring{" "}
            <TextType
              texts={[
                "distributed systems",
                "recursive AI agents",
                "deterministic system deployments"
              ]}
              className="text-ink"
            />
            .
          </p>
        </motion.div>
        <motion.div variants={item} className="flex flex-wrap gap-4">
          <a
            href={portfolio.meta.githubDirect}
            className="inline-flex items-center border border-line px-4 py-2 text-sm text-ink transition-colors duration-200 hover:bg-surface"
            target="_blank"
            rel="noreferrer"
          >
            View GitHub
          </a>
          <Link
            to="/blog"
            className="inline-flex items-center px-1 py-2 text-sm text-muted transition-colors duration-200 hover:text-ink"
          >
            Read Blog
          </Link>
        </motion.div>
      </div>
      <motion.div
        variants={item}
        className="mt-12 grid gap-4 border-t border-line pt-6 text-sm leading-7 md:grid-cols-[1.2fr_0.9fr_0.9fr]"
      >
        <div className="rounded-2xl border border-line bg-surface/60 px-5 py-5">
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted">
            Contact
          </p>
          <a
            href={`mailto:${portfolio.meta.email}`}
            className="mt-2 block text-base text-ink transition-opacity duration-200 hover:opacity-70"
          >
            {portfolio.meta.email}
          </a>
          <p className="mt-2 text-sm text-muted">
            Open to backend, distributed systems, and applied AI work.
          </p>
        </div>
        <div className="space-y-1 rounded-2xl border border-line px-5 py-5">
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted">
            Based in
          </p>
          <p className="text-[15px] text-ink/90">{portfolio.meta.location}</p>
        </div>
        <div className="space-y-1 rounded-2xl border border-line px-5 py-5">
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted">
            Education
          </p>
          <p className="max-w-sm text-[15px] text-ink/90">{portfolio.meta.education}</p>
        </div>
      </motion.div>
    </motion.section>
  );
}
