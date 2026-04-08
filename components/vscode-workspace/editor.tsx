import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import type { EditorTab } from "@/components/vscode-workspace";
import { LoadingType } from "@/components/loading-type";
import { MarkdownContent } from "@/components/markdown-content";
import { OnThisPage } from "@/components/on-this-page";
import { WorkspaceState } from "@/components/workspace-state";
import { extractMarkdownHeadings } from "@/lib/markdown-headings";
import { getFileDescriptor } from "@/lib/vscode-files";

import { VSCodeDiffView } from "./diff";

type VSCodeEditorProps = {
  groupId: "left" | "right";
  group: {
    id: "left" | "right";
    tabs: EditorTab[];
    activeTabId: string | null;
  };
  isActive: boolean;
  onOpenFile: (fileId: string) => void;
  onCloseTab: (groupId: "left" | "right", tabId: string) => void;
  onSetActiveTab: (groupId: "left" | "right", tabId: string) => void;
  onSplitRight: (groupId: "left" | "right", tabId: string) => void;
  onCompare: (fileId: string) => void;
};

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6l-12 12" />
    </svg>
  );
}

function SplitIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 5h16v14H4z" />
      <path d="M12 5v14" />
    </svg>
  );
}

function DiffIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 7h7" />
      <path d="M7 12h10" />
      <path d="M7 17h7" />
      <path d="M17 7l2 2-2 2" />
      <path d="M17 17l2-2-2-2" />
    </svg>
  );
}

function TabButton({
  active,
  title,
  onClick,
  onClose,
}: {
  active: boolean;
  title: string;
  onClick: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className={`group flex min-w-0 shrink-0 items-center gap-1 rounded-t-[0.7rem] border border-b-0 pl-2.5 pr-1 sm:pl-3 sm:pr-1.5 transition-colors duration-200 ${
        active
          ? "bg-[var(--vscode-tab-active)] text-ink shadow-[inset_0_2px_0_rgb(var(--accent)/0.55)]"
          : "bg-[var(--vscode-tab)] text-muted hover:text-ink"
      }`}
      style={{
        borderColor: active ? "var(--vscode-border)" : "transparent",
      }}
    >
      <button
        type="button"
        onClick={onClick}
        className="min-w-0 flex-1 py-2 text-left sm:py-2.5"
      >
        <span className="block max-w-[140px] truncate font-mono text-[11px] sm:max-w-[220px] sm:text-[12px]">
          {title}
        </span>
      </button>
      <button
        type="button"
        onClick={onClose}
        className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-all duration-200 hover:bg-white/5 hover:text-ink focus-visible:opacity-100 ${
          active
            ? "text-ink/80"
            : "text-muted opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
        }`}
        aria-label={`Close ${title}`}
        title="Close"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

export function VSCodeEditor({
  groupId,
  group,
  isActive,
  onOpenFile,
  onCloseTab,
  onSetActiveTab,
  onSplitRight,
  onCompare,
}: VSCodeEditorProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const activeTab = useMemo(
    () => group.tabs.find((tab) => tab.id === group.activeTabId) ?? group.tabs[0],
    [group.activeTabId, group.tabs]
  );

  const [contentState, setContentState] = useState<
    | { status: "empty" }
    | { status: "loading" }
    | { status: "ready"; content: string }
    | { status: "error"; message: string }
  >({ status: "empty" });

  useEffect(() => {
    let cancelled = false;

    if (!activeTab) {
      setContentState({ status: "empty" });
      return;
    }

    if (activeTab.kind === "diff") {
      setContentState({ status: "empty" });
      return;
    }

    const descriptor = getFileDescriptor(activeTab.fileId);
    if (!descriptor) {
      setContentState({
        status: "error",
        message: `Could not load ${activeTab.fileId}.`,
      });
      return;
    }

    setContentState({ status: "loading" });
    descriptor
      .load()
      .then((next) => {
        if (!cancelled) {
          setContentState({ status: "ready", content: next });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setContentState({
            status: "error",
            message: `Failed to load ${activeTab.fileId}.`,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  const headings = useMemo(
    () =>
      contentState.status === "ready"
        ? extractMarkdownHeadings(contentState.content)
        : [],
    [contentState]
  );

  const contentRootId = `editor-content-${groupId}`;

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col">
      <div
        className="workspace-scroll flex h-10 min-w-0 items-end gap-0.5 overflow-x-auto px-1.5 pt-1.5 sm:h-11 sm:gap-1 sm:px-2 sm:pt-2"
        style={{ borderBottom: "1px solid var(--vscode-border)" }}
      >
        <AnimatePresence initial={false}>
          {group.tabs.map((tab) => (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, x: -10, width: 0 }}
              animate={{ opacity: 1, x: 0, width: "auto" }}
              exit={{ opacity: 0, x: -6, width: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: "hidden", flexShrink: 0 }}
            >
              <TabButton
                active={tab.id === group.activeTabId}
                title={tab.title}
                onClick={() => onSetActiveTab(groupId, tab.id)}
                onClose={() => onCloseTab(groupId, tab.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="ml-auto flex items-center gap-1 px-1 sm:gap-2 sm:px-2">
          {activeTab?.kind === "file" ? (
            <>
              <button
                type="button"
                onClick={() => onCompare(activeTab.fileId)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-white/5 hover:text-ink sm:h-8 sm:w-8"
                aria-label="Compare file"
                title="Compare file"
              >
                <DiffIcon />
              </button>
              <button
                type="button"
                onClick={() => onSplitRight(groupId, activeTab.id)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-white/5 hover:text-ink sm:h-8 sm:w-8"
                aria-label="Split editor right"
                title="Split editor right"
              >
                <SplitIcon />
              </button>
            </>
          ) : null}
          <span
            className={`hidden text-[11px] uppercase tracking-[0.22em] sm:inline ${
              isActive ? "text-ink" : "text-muted"
            }`}
          >
            {groupId === "left" ? "Main" : "Split"}
          </span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="workspace-scroll relative min-h-0 flex-1 overflow-auto px-3 py-3 [scrollbar-gutter:stable] sm:px-4 sm:py-4 md:px-6 md:py-5"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab?.id ?? "empty"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {!activeTab ? (
              <div className="mx-auto w-full max-w-3xl">
                <WorkspaceState
                  title="No file open"
                  description="Open something from the sidebar to keep reading, or restore the welcome file."
                >
                  <button
                    type="button"
                    onClick={() => onOpenFile("welcome.md")}
                    className="ui-control px-4 text-sm"
                  >
                    Reopen welcome.md
                  </button>
                </WorkspaceState>
              </div>
            ) : activeTab.kind === "diff" ? (
              <VSCodeDiffView
                leftFileId={activeTab.leftFileId}
                rightFileId={activeTab.rightFileId}
                onOpenFile={onOpenFile}
              />
            ) : contentState.status === "loading" ? (
              <div className="mx-auto w-full max-w-3xl">
                <WorkspaceState
                  title="Loading file"
                  description="Rendering content, formatting code blocks, and loading related links."
                >
                  <LoadingType label="Loading" />
                </WorkspaceState>
              </div>
            ) : contentState.status === "error" ? (
              <div className="mx-auto w-full max-w-3xl">
                <WorkspaceState
                  tone="error"
                  title="File unavailable"
                  description={contentState.message}
                />
              </div>
            ) : contentState.status === "ready" ? (
              <div className="mx-auto w-full max-w-5xl pb-6 sm:pb-8">
                <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_176px] xl:gap-10">
                  <div id={contentRootId} className="min-w-0">
                    <MarkdownContent
                      content={contentState.content}
                      onOpenWorkspaceFile={onOpenFile}
                    />
                  </div>
                  <OnThisPage
                    headings={headings}
                    contentRootId={contentRootId}
                    scrollEl={scrollRef.current}
                  />
                </div>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
