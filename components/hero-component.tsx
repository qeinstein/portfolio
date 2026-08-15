"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";

import { portfolio } from "@/lib/portfolio-data";
import { QuantumCanvas } from "@/components/quantum-canvas";

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
    <section className="border-b border-line py-5 md:py-8">
      <div className="grid gap-10 items-center md:grid-cols-[1fr_auto] md:gap-14">
        <div className="space-y-6">
          <div className="space-y-4">
            <motion.p 
              className="text-[10px] font-mono font-semibold uppercase tracking-[0.24em] text-accent" 
              {...item(0)}
            >
              {portfolio.meta.titles}
            </motion.p>
            
            <motion.h1
              className="text-4xl font-medium leading-[1.05] tracking-tightest text-ink md:text-5xl lg:text-6xl"
              {...item(0.08)}
            >
              {portfolio.hero.headline}
            </motion.h1>
            
            <motion.p
              className="text-[15px] leading-8 text-muted sm:text-base md:text-lg md:leading-8 max-w-xl"
              {...item(0.18)}
            >
              {portfolio.hero.subheadline}
            </motion.p>
          </div>
          
          <motion.div className="flex flex-wrap gap-4 pt-2" {...item(0.28)}>
            <a
              href={portfolio.meta.githubDirect}
              className="inline-flex items-center gap-2 bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-all duration-200 hover:opacity-90 hover:shadow-[var(--cta-shadow)]"
              target="_blank"
              rel="noreferrer"
            >
              View GitHub
              <svg 
                aria-hidden="true" 
                viewBox="0 0 24 24" 
                className="h-4 w-4" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M7 17L17 7" />
                <path d="M10 7h7v7" />
              </svg>
            </a>
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 px-1 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted transition-colors duration-200 hover:text-ink"
            >
              Read Blog
              <svg 
                aria-hidden="true" 
                viewBox="0 0 24 24" 
                className="h-3.5 w-3.5" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
        
        <motion.div
          className="flex justify-center shrink-0"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Portrait emerging from the wave-manifold field */}
          <div className="group relative aspect-[4/5] w-[280px] sm:w-[320px] md:w-[360px]">
            {/* Ambient accent bloom behind the subject */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-4 bottom-0 top-10 rounded-[50%] opacity-60 blur-3xl"
              style={{ backgroundColor: "var(--portrait-bloom)" }}
              animate={reduced ? undefined : { opacity: [0.45, 0.85, 0.45] }}
              transition={
                reduced
                  ? undefined
                  : { duration: 9, repeat: Infinity, ease: "easeInOut" }
              }
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <QuantumCanvas />
            </div>

            {/* Slow drift keeps the portrait alive without pulling focus */}
            <motion.div
              className="pointer-events-none absolute inset-0 z-10"
              animate={reduced ? undefined : { y: [0, -7, 0] }}
              transition={
                reduced
                  ? undefined
                  : { duration: 11, repeat: Infinity, ease: "easeInOut" }
              }
            >
              <img
                src="/toheeb-ogunade.jpg"
                alt={portfolio.meta.name}
                width={1152}
                height={1536}
                loading="eager"
                decoding="async"
                className="absolute inset-x-0 bottom-0 h-[88%] w-full object-cover object-bottom"
                style={{
                  maskImage:
                    "linear-gradient(to top, rgb(0 0 0) 82%, rgb(0 0 0 / 0) 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to top, rgb(0 0 0) 82%, rgb(0 0 0 / 0) 100%)"
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
export default HeroComponent;
