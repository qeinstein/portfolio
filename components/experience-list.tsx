import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { Experience, portfolio } from "@/lib/portfolio-data";

import { FadeIn } from "./fade-in";

type ExperienceItemProps = Experience & {
  onOpen: (trigger: HTMLButtonElement) => void;
};

function ExperienceItem({
  company,
  role,
  period,
  summary,
  blogSlug,
  onOpen
}: ExperienceItemProps) {
  return (
    <article className="py-4">
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-1">
          {blogSlug ? (
            <Link
              to={`/blog/${blogSlug}`}
              className="text-lg font-medium tracking-tight text-ink transition-colors duration-200 hover:text-accent"
            >
              {company}
            </Link>
          ) : (
            <h3 className="text-lg font-medium tracking-tight text-ink">{company}</h3>
          )}
          <p className="text-sm text-muted">{role}</p>
        </div>
        <p className="shrink-0 text-sm text-muted">{period}</p>
      </div>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{summary}</p>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={(event) => {
            onOpen(event.currentTarget);
          }}
          className="text-sm text-ink transition-opacity duration-200 hover:opacity-70"
        >
          Read details
        </button>
        {blogSlug ? (
          <Link
            to={`/blog/${blogSlug}`}
            className="text-sm text-muted transition-colors duration-200 hover:text-ink"
          >
            Founder note
          </Link>
        ) : null}
      </div>
    </article>
  );
}

type ExperienceModalProps = {
  item: Experience;
  onClose: () => void;
  returnFocusTo: HTMLButtonElement | null;
};

function ExperienceModal({
  item,
  onClose,
  returnFocusTo,
}: ExperienceModalProps) {
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

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.hasAttribute("disabled"));

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
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
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-canvas/84 px-4 py-6 backdrop-blur-sm md:items-center"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-line bg-surface px-6 py-6 shadow-2xl shadow-black/30 md:px-8 md:py-8"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="experience-dialog-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
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
            <li key={detail} className="pl-1">
              {detail}
            </li>
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
      </div>
    </div>
  );
}

export function ExperienceList() {
  const [activeExperience, setActiveExperience] = useState<Experience | null>(null);
  const [activeTrigger, setActiveTrigger] = useState<HTMLButtonElement | null>(null);

  return (
    <>
      <div className="divide-y divide-line">
        {portfolio.experience.map((item, index) => (
          <FadeIn key={`${item.company}-${item.period}`} delay={index * 0.06}>
            <ExperienceItem
              {...item}
              onOpen={(trigger) => {
                setActiveTrigger(trigger);
                setActiveExperience(item);
              }}
            />
          </FadeIn>
        ))}
      </div>
      {activeExperience ? (
        <ExperienceModal
          item={activeExperience}
          returnFocusTo={activeTrigger}
          onClose={() => {
            setActiveExperience(null);
            setActiveTrigger(null);
          }}
        />
      ) : null}
    </>
  );
}
