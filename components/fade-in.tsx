"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={prefersReducedMotion ? undefined : { once: true, amount: 0.25 }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay }
      }
    >
      {children}
    </motion.div>
  );
}
