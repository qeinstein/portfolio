import { motion } from "framer-motion";

import { portfolio } from "@/lib/portfolio-data";

export function SkillTags() {
  return (
    <div className="divide-y divide-line">
      {Object.entries(portfolio.skills).map(([category, items], categoryIndex) => (
        <article
          key={category}
          className="grid gap-3 py-5 md:grid-cols-[180px_minmax(0,1fr)] md:gap-8"
        >
          <motion.h3
            className="text-[11px] uppercase tracking-[0.22em] text-muted"
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: categoryIndex * 0.04, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            {category}
          </motion.h3>
          <div className="flex flex-wrap gap-2">
            {items.map((skill, skillIndex) => (
              <motion.span
                key={skill}
                className="inline-flex items-center rounded-full border border-line bg-surface/40 px-3 py-1 font-mono text-[11px] font-medium tracking-tight text-muted transition-colors duration-200 hover:border-accent/30 hover:bg-accent/8 hover:text-ink"
                initial={{ opacity: 0, scale: 0.82 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  delay: categoryIndex * 0.04 + skillIndex * 0.03,
                  duration: 0.32,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
