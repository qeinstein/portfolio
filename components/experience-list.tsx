import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

import { Experience, portfolio } from "@/lib/portfolio-data";

type ExperienceItemProps = Experience & {
  index: number;
  onOpen: (trigger: HTMLButtonElement) => void;
};

function ExperienceItem({
  company,
  role,
  period,
  summary,
  blogSlug,
  featured,
  index,
  onOpen,
}: ExperienceItemProps) {
  return (
    <motion.article
      className="relative pl-9"
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.07, duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Timeline dot */}
      <span
        className={`absolute left-0 top-[18px] flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
          featured
            ? "border-accent bg-accent/15 shadow-[0_0_10px_rgb(var(--accent)/0.3)]"
            : "border-line bg-canvas"
        }`}
      >
        {featured && (
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        )}
      </span>

      <div className="pb-10">
        {/* Header row */}
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
          <div className="space-y-0.5">
            {blogSlug ? (
              <Link
                to={`/blog/${blogSlug}`}
                className="text-base font-medium text-ink transition-colors duration-200 hover:text-accent"
              >
                {company}
              </Link>
            ) : (
              <h3 className="text-base font-medium text-ink">{company}</h3>
            )}
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              {role}
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-line bg-surface/50 px-2.5 py-0.5 font-mono text-[11px] text-muted">
            {period}
          </span>
        </div>

        {/* Summary */}
        <p className="mt-3 text-sm leading-7 text-muted">{summary}</p>

        {/* Actions */}
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={(e) => onOpen(e.currentTarget)}
            className="group/btn inline-flex items-center gap-1.5 text-xs text-muted transition-colors duration-200 hover:text-ink"
          >
            Details
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-3 w-3 transition-transform duration-200 group-hover/btn:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </button>
          {blogSlug ? (
            <Link
              to={`/blog/${blogSlug}`}
              className="group/note inline-flex items-center gap-1.5 text-xs text-muted transition-colors duration-200 hover:text-ink"
            >
              Founder note
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-3 w-3 transition-transform duration-200 group-hover/note:translate-x-0.5"
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
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

type ExperienceModalProps = {
  item: Experience;
  onClose: () => void;
  returnFocusTo: HTMLButtonElement | null;
};

function ExperienceModal({ item, onClose, returnFocusTo }: ExperienceModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("disabled"));

      if (focusable.length === 0) { event.preventDefault(); return; }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      returnFocusTo?.focus();
    };
  }, [onClose, returnFocusTo]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-canvas/84 px-4 py-6 backdrop-blur-sm md:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      role="presentation"
    >
      <motion.div
        ref={dialogRef}
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto border border-line bg-canvas px-6 py-6 md:px-8 md:py-8"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="experience-dialog-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
              Experience
            </p>
            <h3
              id="experience-dialog-title"
              className="text-2xl font-medium tracking-tight text-ink"
            >
              {item.company}
            </h3>
            <p className="text-sm text-muted">
              {item.role} · {item.period}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="shrink-0 text-sm text-muted transition-colors duration-200 hover:text-ink"
          >
            Close
          </button>
        </div>

        <p className="mt-6 text-sm leading-7 text-muted">{item.summary}</p>

        <ul className="mt-6 space-y-3 pl-5 text-sm leading-7 text-muted marker:text-ink">
          {item.details.map((detail) => (
            <li key={detail} className="pl-1">{detail}</li>
          ))}
        </ul>

        {item.blogSlug ? (
          <div className="mt-6 border-t border-line pt-5">
            <Link
              to={`/blog/${item.blogSlug}`}
              className="text-sm text-ink transition-opacity duration-200 hover:opacity-70"
            >
              Read the Velarix founder note
            </Link>
          </div>
        ) : null}
      </motion.div>
    </motion.div>
  );
}

type ExperienceListProps = {
  items?: Experience[];
};

export function ExperienceList({ items }: ExperienceListProps) {
  const [activeExperience, setActiveExperience] = useState<Experience | null>(null);
  const [activeTrigger, setActiveTrigger] = useState<HTMLButtonElement | null>(null);
  const resolvedItems = items ?? portfolio.experience;

  return (
    <>
      {/* Timeline container — vertical line runs through all items */}
      <div className="relative">
        <span
          aria-hidden="true"
          className="absolute left-[7px] top-5 bottom-0 w-px bg-line"
        />
        <div className="space-y-0">
          {resolvedItems.map((item, index) => (
            <ExperienceItem
              key={`${item.company}-${item.period}`}
              {...item}
              index={index}
              onOpen={(trigger) => {
                setActiveTrigger(trigger);
                setActiveExperience(item);
              }}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeExperience ? (
          <ExperienceModal
            key={activeExperience.company}
            item={activeExperience}
            returnFocusTo={activeTrigger}
            onClose={() => {
              setActiveExperience(null);
              setActiveTrigger(null);
            }}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
