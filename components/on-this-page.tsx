import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import type { MarkdownHeading } from "@/lib/markdown-headings";

// Minimum headings before the component renders at all
const MIN_HEADINGS = 3;

type OnThisPageProps = {
  headings: MarkdownHeading[];
  contentRootId: string;
  variant?: "sidebar" | "inline";
  /** Pass the scrollable container element when content scrolls inside a div, not the window */
  scrollEl?: HTMLElement | null;
};

function scrollToHeading(
  targetId: string,
  reduced: boolean,
  scrollEl?: HTMLElement | null
) {
  const element = document.getElementById(targetId);
  if (!element) return;

  if (scrollEl) {
    const containerRect = scrollEl.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    scrollEl.scrollTo({
      top: scrollEl.scrollTop + elementRect.top - containerRect.top - 32,
      behavior: reduced ? "auto" : "smooth",
    });
  } else {
    const top = element.getBoundingClientRect().top + window.scrollY - 104;
    window.scrollTo({ top: Math.max(0, top), behavior: reduced ? "auto" : "smooth" });
  }
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 20 20"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <path d="M5 7.5l5 5 5-5" />
    </motion.svg>
  );
}

export function OnThisPage({
  headings,
  contentRootId,
  variant = "sidebar",
  scrollEl,
}: OnThisPageProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const reduced = useReducedMotion() ?? false;

  const visibleHeadings = useMemo(
    () => headings.filter((h) => h.level === 2 || h.level === 3),
    [headings]
  );

  const shouldRender = visibleHeadings.length >= MIN_HEADINGS;

  // IntersectionObserver for active heading + RAF scroll listener for progress
  useEffect(() => {
    if (!shouldRender) return;

    const headingEls = visibleHeadings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (headingEls.length === 0) return;

    const scroller: HTMLElement | Window = scrollEl ?? window;

    const intersecting = new Set<string>();

    function pickActive() {
      for (const el of headingEls) {
        if (intersecting.has(el.id)) { setActiveId(el.id); return; }
      }
      // fallback: last heading scrolled past the trigger line
      const scrollTop = scrollEl ? scrollEl.scrollTop : window.scrollY;
      const containerTop = scrollEl ? scrollEl.getBoundingClientRect().top : 0;
      const triggerLine = containerTop + (scrollEl ? scrollEl.clientHeight : window.innerHeight) * 0.2;
      const candidates = headingEls.filter(
        (el) => el.getBoundingClientRect().top <= triggerLine
      );
      const best = candidates[candidates.length - 1];
      setActiveId(best?.id ?? headingEls[0].id);
      void scrollTop; // suppress unused warning
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target.id);
          else intersecting.delete(entry.target.id);
        }
        pickActive();
      },
      { root: scrollEl ?? null, rootMargin: "-15% 0px -65% 0px", threshold: 0 }
    );

    headingEls.forEach((el) => observer.observe(el));

    // Progress via rAF-throttled scroll listener
    let rafId = 0;

    function updateProgress() {
      rafId = 0;
      if (scrollEl) {
        const max = Math.max(1, scrollEl.scrollHeight - scrollEl.clientHeight);
        setProgress(Math.min(1, Math.max(0, scrollEl.scrollTop / max)));
      } else {
        const root = document.getElementById(contentRootId);
        if (!root) return;
        const rootTop = root.getBoundingClientRect().top + window.scrollY;
        const distance = Math.max(1, root.getBoundingClientRect().height);
        setProgress(Math.min(1, Math.max(0, (window.scrollY + 104 - rootTop) / distance)));
      }
    }

    function onScroll() {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateProgress);
    }

    pickActive();
    updateProgress();

    scroller.addEventListener("scroll", onScroll as EventListener, { passive: true } as AddEventListenerOptions);
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      scroller.removeEventListener("scroll", onScroll as EventListener);
      window.removeEventListener("resize", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [contentRootId, scrollEl, shouldRender, visibleHeadings]);

  // Close mobile panel on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [activeId]);

  if (!shouldRender) return null;

  // ─── Shared nav list ───────────────────────────────────────────────────────
  const navList = (
    <nav aria-label="On this page">
      <ul className="space-y-px">
        {visibleHeadings.map((heading) => {
          const isActive = activeId === heading.id;
          const isH3 = heading.level === 3;

          return (
            <li key={heading.id} className="relative">
              {/* Sliding active indicator */}
              {isActive && (
                <motion.span
                  layoutId="toc-active-bar"
                  className="absolute inset-y-0 left-0 w-[2px] rounded-full bg-accent"
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden="true"
                />
              )}
              <a
                href={`#${heading.id}`}
                aria-current={isActive ? "true" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  if (!scrollEl) window.history.replaceState(null, "", `#${heading.id}`);
                  scrollToHeading(heading.id, reduced, scrollEl);
                  setIsOpen(false);
                }}
                className={[
                  "block border-l py-0.5 pl-3 text-sm transition-colors duration-150",
                  isH3 ? "ml-3 text-[13px]" : "",
                  isActive
                    ? "border-transparent font-medium text-ink"
                    : "border-transparent text-muted hover:text-ink",
                ].join(" ")}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  // ─── Progress bar + header ─────────────────────────────────────────────────
  const header = (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
          On this page
        </p>
        <p
          className="font-mono text-[11px] text-muted tabular-nums"
          aria-label={`${Math.round(progress * 100)} percent read`}
        >
          {Math.round(progress * 100)}%
        </p>
      </div>
      <div className="h-px w-full bg-line" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
        <motion.div
          className="h-full bg-accent"
          style={{ width: `${Math.round(progress * 100)}%` }}
          transition={{ duration: 0.12 }}
        />
      </div>
    </>
  );

  // ─── Inline (mobile collapsible) ──────────────────────────────────────────
  if (variant === "inline") {
    return (
      <div className="lg:hidden">
        <div className="border border-line bg-surface/25">
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
            aria-controls="toc-inline-nav"
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-sm text-ink"
          >
            <span>On this page</span>
            <ChevronIcon open={isOpen} />
          </button>

          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                id="toc-inline-nav"
                key="toc-inline"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: "hidden" }}
              >
                <div className="space-y-3 border-t border-line px-4 py-4">
                  {header}
                  {navList}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // ─── Sidebar (desktop sticky) ─────────────────────────────────────────────
  return (
    <aside className="hidden lg:block" aria-label="Table of contents">
      <div className={`sticky space-y-4 ${scrollEl ? "top-4" : "top-24"}`}>
        {header}
        {navList}
      </div>
    </aside>
  );
}
