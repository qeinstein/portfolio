import { motion } from "framer-motion";

import { portfolio } from "@/lib/portfolio-data";

export function SkillTags() {
  return (
    <div className="divide-y divide-line">
      {Object.entries(portfolio.skills).map(([category, items], categoryIndex) => (
        <article
          key={category}
          className="grid gap-4 py-6 md:grid-cols-[180px_1fr] md:gap-8"
        >
          <motion.h3
            className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted pt-2"
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: categoryIndex * 0.04, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            {category}
          </motion.h3>
          
          {/* Uniform Grid of Skill Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {items.map((skill, skillIndex) => (
              <motion.span
                key={skill}
                className="flex h-9 items-center justify-center text-center rounded border border-line bg-surface/30 px-3 font-mono text-[11px] font-medium text-muted transition-all duration-200 hover:border-accent/40 hover:bg-accent/8 hover:text-ink select-none"
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  delay: categoryIndex * 0.03 + skillIndex * 0.02,
                  duration: 0.28,
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
export default SkillTags;
