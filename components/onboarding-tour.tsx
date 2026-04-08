import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const TOUR_KEY = "tour_v1_done";

type Placement = "center" | "right" | "bottom";

type Step = {
  id: string;
  title: string;
  body: string;
  target?: string; // value of data-onboarding attribute
  placement: Placement;
};

const STEPS: Step[] = [
  {
    id: "welcome",
    title: "Welcome to the workspace",
    body: "This portfolio is built like a VS Code editor. Everything you'd normally find in a nav menu lives here as files you can open and read.",
    placement: "center",
  },
  {
    id: "explorer",
    title: "Navigate from the sidebar",
    body: "Open any file to read it — projects, blog posts, experience. The search bar at the top finds anything instantly.",
    target: "explorer",
    placement: "right",
  },
  {
    id: "theme",
    title: "Theme was randomized for you",
    body: "We picked a theme at random on your first visit. Click the settings icon here to change it anytime.",
    target: "settings",
    placement: "right",
  },
];

const TOOLTIP_WIDTH = 272;

type Pos = {
  top: number;
  left: number;
  arrowOffsetY?: number;
  resolved: Placement;
};

function computePos(target: string | undefined, placement: Placement): Pos {
  const isMobile = window.innerWidth < 768;

  if (!target || placement === "center" || isMobile) {
    return {
      top: window.innerHeight / 2,
      left: window.innerWidth / 2,
      resolved: "center",
    };
  }

  const el = document.querySelector<HTMLElement>(`[data-onboarding="${target}"]`);
  if (!el) {
    return { top: window.innerHeight / 2, left: window.innerWidth / 2, resolved: "center" };
  }

  const r = el.getBoundingClientRect();

  if (placement === "right") {
    const tooltipTop = Math.max(12, r.top + r.height / 2 - 72);
    const clampedTop = Math.min(tooltipTop, window.innerHeight - 200);
    const arrowOffsetY = r.top + r.height / 2 - clampedTop;
    return {
      top: clampedTop,
      left: Math.min(r.right + 14, window.innerWidth - TOOLTIP_WIDTH - 12),
      arrowOffsetY,
      resolved: "right",
    };
  }

  if (placement === "bottom") {
    return {
      top: r.bottom + 12,
      left: Math.max(8, Math.min(r.left + r.width / 2 - TOOLTIP_WIDTH / 2, window.innerWidth - TOOLTIP_WIDTH - 8)),
      resolved: "bottom",
    };
  }

  return { top: window.innerHeight / 2, left: window.innerWidth / 2, resolved: "center" };
}

type OnboardingTourProps = {
  onDone: () => void;
};

export function OnboardingTour({ onDone }: OnboardingTourProps) {
  const [step, setStep] = useState(0);
  const [pos, setPos] = useState<Pos>({ top: 0, left: 0, resolved: "center" });

  const current = STEPS[step];
  const tooltipWidth = `min(${TOOLTIP_WIDTH}px, calc(100vw - 1.5rem))`;

  const measure = useCallback(() => {
    if (!current) return;
    setPos(computePos(current.target, current.placement));
  }, [current]);

  useEffect(() => {
    // Small delay so layout has settled after entry portal closes
    const t = setTimeout(measure, 80);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  if (!current) return null;

  const isLast = step === STEPS.length - 1;
  const isCenter = pos.resolved === "center";

  const tooltipStyle: React.CSSProperties = isCenter
    ? {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: tooltipWidth,
        zIndex: 9998,
      }
    : {
        position: "fixed",
        top: pos.top,
        left: pos.left,
        width: tooltipWidth,
        zIndex: 9998,
      };

  return (
    <>
      {/* Dim overlay — only for centered steps */}
      <AnimatePresence>
        {isCenter && (
          <motion.div
            key="overlay"
            className="pointer-events-none fixed inset-0 bg-canvas/40 backdrop-blur-[2px]"
            style={{ zIndex: 9997 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Progress dots */}
      <div
        className="fixed bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 sm:bottom-8"
        style={{ zIndex: 9999, pointerEvents: "none" }}
      >
        {STEPS.map((s, i) => (
          <span
            key={s.id}
            className={`inline-block h-1 rounded-full transition-all duration-300 ${
              i === step
                ? "w-5 bg-accent"
                : i < step
                  ? "w-1.5 bg-accent/45"
                  : "w-1.5 bg-muted/30"
            }`}
          />
        ))}
      </div>

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          style={{ ...tooltipStyle, pointerEvents: "auto" }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Arrow pointing left (tooltip is to the right of target) */}
          {pos.resolved === "right" && pos.arrowOffsetY !== undefined && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-[7px] h-3 w-3 rotate-45 border-b border-l"
              style={{
                top: Math.max(10, pos.arrowOffsetY - 6),
                background: "var(--vscode-panel, rgb(var(--surface)))",
                borderColor: "var(--line)",
              }}
            />
          )}

          {/* Arrow pointing up (tooltip is below target) */}
          {pos.resolved === "bottom" && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-[7px] left-5 h-3 w-3 rotate-45 border-l border-t"
              style={{
                background: "var(--vscode-panel, rgb(var(--surface)))",
                borderColor: "var(--line)",
              }}
            />
          )}

          <div className="ui-panel overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-2.5">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted">
                {step + 1} of {STEPS.length}
              </p>
              <button
                type="button"
                onClick={onDone}
                className="text-[11px] text-muted transition-colors duration-150 hover:text-ink"
              >
                Skip
              </button>
            </div>

            {/* Body */}
            <div className="px-4 py-3.5">
              <h3 className="text-sm font-medium text-ink">{current.title}</h3>
              <p className="mt-1.5 text-xs leading-[1.65] text-muted">{current.body}</p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="text-xs text-muted transition-colors duration-150 hover:text-ink"
                >
                  Back
                </button>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={() => {
                  if (isLast) {
                    onDone();
                  } else {
                    setStep(step + 1);
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-accent transition-opacity duration-150 hover:opacity-75"
              >
                {isLast ? "Got it" : "Next"}
                {!isLast && (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
