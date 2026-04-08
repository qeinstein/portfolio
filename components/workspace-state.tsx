import type { ReactNode } from "react";

type WorkspaceStateProps = {
  tone?: "info" | "error";
  title: string;
  description: string;
  children?: ReactNode;
};

function InfoIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 10.5v5" />
      <path d="M12 7.75h.01" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 2.8 19h18.4L12 3Z" />
      <path d="M12 9v4.5" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function WorkspaceState({
  tone = "info",
  title,
  description,
  children,
}: WorkspaceStateProps) {
  return (
    <section className="state-panel">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="state-panel-icon shrink-0" data-tone={tone}>
          {tone === "error" ? <ErrorIcon /> : <InfoIcon />}
        </div>
        <div className="min-w-0 space-y-2">
          <p className="state-panel-title">{title}</p>
          <p className="state-panel-copy">{description}</p>
          {children ? <div className="flex flex-wrap gap-3 pt-1">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
