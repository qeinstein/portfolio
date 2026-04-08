import { ReactNode, useEffect, useState } from "react";

import { WorkspaceGate } from "@/components/workspace-gate";
import { WorkspaceSidebar } from "@/components/workspace-sidebar";
import { portfolio } from "@/lib/portfolio-data";

type WorkspaceLayoutProps = {
  theme: "dark" | "light";
  onToggleTheme: () => void;
  children: ReactNode;
};

function MenuIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

export function WorkspaceLayout({
  theme,
  onToggleTheme,
  children,
}: WorkspaceLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (!hasEntered) {
      return;
    }
    localStorage.setItem("workspace_entered", "true");
  }, [hasEntered]);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {!hasEntered ? (
        <WorkspaceGate onEnter={() => setHasEntered(true)} />
      ) : null}

      <div className="flex min-h-screen">
        <WorkspaceSidebar
          theme={theme}
          onToggleTheme={onToggleTheme}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className="min-w-0 flex-1">
          <div className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-line bg-canvas/88 px-4 backdrop-blur md:hidden">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors duration-200 hover:text-ink"
              aria-label="Open explorer"
            >
              <MenuIcon />
            </button>
            <p className="truncate text-sm text-muted">Explorer</p>
          </div>
          <main className="mx-auto w-full max-w-5xl px-6 py-10 md:px-10">
            {children}
          </main>
          <footer className="border-t border-line">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-6 text-xs text-muted md:px-10">
              <p>&copy; {new Date().getFullYear()} {portfolio.meta.name}</p>
              <div className="flex items-center gap-4">
                <a href={portfolio.meta.github} target="_blank" rel="noreferrer" className="transition-colors duration-200 hover:text-ink">GitHub</a>
                <a href={portfolio.meta.linkedin} target="_blank" rel="noreferrer" className="transition-colors duration-200 hover:text-ink">LinkedIn</a>
                <a href={portfolio.meta.x} target="_blank" rel="noreferrer" className="transition-colors duration-200 hover:text-ink">X</a>
                <a href={`mailto:${portfolio.meta.email}`} className="transition-colors duration-200 hover:text-ink">Email</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

