import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import type { ThemeName } from "@/src/App";
import { EntryPortal } from "@/components/entry-portal";
import { OnboardingTour, TOUR_KEY } from "@/components/onboarding-tour";
import { portfolio } from "@/lib/portfolio-data";
import { vscodeThemes } from "@/lib/vscode-themes";
import { getExplorerTree, getFileDescriptor, type ExplorerNode } from "@/lib/vscode-files";
import { VSCodeEditor } from "@/components/vscode-workspace/editor";

type VSCodeWorkspaceProps = {
  theme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
};

export type EditorTab =
  | {
      id: string;
      kind: "file";
      fileId: string;
      title: string;
    }
  | {
      id: string;
      kind: "diff";
      leftFileId: string;
      rightFileId: string;
      title: string;
    };

type EditorGroup = {
  id: "left" | "right";
  tabs: EditorTab[];
  activeTabId: string | null;
};

const FILE_ROW_OFFSET = 0.625;
const FOLDER_ROW_OFFSET = 0.5;
const EXPLORER_WIDTH_STORAGE_KEY = "workspace_explorer_width";
const EXPLORER_DEFAULT_WIDTH = 288;
const EXPLORER_MIN_WIDTH = 240;
const EXPLORER_MAX_WIDTH = 448;
const MAX_SEARCH_RESULTS = 8;

type ExplorerSearchEntry = {
  fileId: string;
  name: string;
  folderPath: string;
  fullPath: string;
};

type ExplorerSearchResult = {
  entry: ExplorerSearchEntry;
  score: number;
};

function createTabId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Markdown file icon — document with hash lines
function FileIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M3 2.5A1.5 1.5 0 0 1 4.5 1h4.586a1 1 0 0 1 .707.293l3.414 3.414A1 1 0 0 1 13.5 5.414V13.5A1.5 1.5 0 0 1 12 15H4.5A1.5 1.5 0 0 1 3 13.5v-11Zm1.5-.5a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5H12a.5.5 0 0 0 .5-.5V6H9.5A1.5 1.5 0 0 1 8 4.5V2H4.5Zm4 0v2.5a.5.5 0 0 0 .5.5h2.793L8.5 2ZM5.5 9a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5Zm0 2a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5Z" />
    </svg>
  );
}

// Folder icons — closed and open variants + named variants
function FolderClosedIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="currentColor">
      <path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25V5.75A1.75 1.75 0 0 0 14.25 4H7.5L5.972 2.474A1.75 1.75 0 0 0 4.728 2H1.75ZM1.5 2.75c0-.138.112-.25.25-.25H4.73c.066 0 .13.026.177.073L6.384 4H1.5V2.75Zm0 2.75h12.75c.138 0 .25.112.25.25v7.5a.25.25 0 0 1-.25.25H1.75a.25.25 0 0 1-.25-.25V5.5Z" />
    </svg>
  );
}

function FolderOpenIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="currentColor">
      <path d="M.513 1.513A1.75 1.75 0 0 1 1.75 1h3.5c.55 0 1.07.26 1.4.7l.9 1.2h6.7A1.75 1.75 0 0 1 16 4.65v7.6A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25V2.75c0-.464.184-.91.513-1.237ZM1.75 2.5a.25.25 0 0 0-.25.25V4h3.21l-.603-.804a.25.25 0 0 0-.2-.1H1.75Zm12.5 3H1.5v6.75c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-6.5a.25.25 0 0 0-.25-.25Z" />
    </svg>
  );
}

// Named folder variants (monochrome, single shade)
function FolderAboutIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="currentColor">
        <path d="M.513 1.513A1.75 1.75 0 0 1 1.75 1h3.5c.55 0 1.07.26 1.4.7l.9 1.2h6.7A1.75 1.75 0 0 1 16 4.65v7.6A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25V2.75c0-.464.184-.91.513-1.237ZM1.75 2.5a.25.25 0 0 0-.25.25V4h3.21l-.603-.804a.25.25 0 0 0-.2-.1H1.75Zm12.5 3H1.5v6.75c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-6.5a.25.25 0 0 0-.25-.25Z" />
        <circle cx="8" cy="9.5" r="1.5" fill="currentColor" opacity="0.7" />
        <path d="M5.5 12.5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="currentColor">
      <path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25V5.75A1.75 1.75 0 0 0 14.25 4H7.5L5.972 2.474A1.75 1.75 0 0 0 4.728 2H1.75ZM1.5 2.75c0-.138.112-.25.25-.25H4.73c.066 0 .13.026.177.073L6.384 4H1.5V2.75Zm0 2.75h12.75c.138 0 .25.112.25.25v7.5a.25.25 0 0 1-.25.25H1.75a.25.25 0 0 1-.25-.25V5.5Z" />
      <circle cx="8" cy="9.5" r="1.5" fill="currentColor" opacity="0.7" />
      <path d="M5.5 12.5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

function FolderProjectsIcon({ open }: { open: boolean }) {
  const base = open ? (
    <path d="M.513 1.513A1.75 1.75 0 0 1 1.75 1h3.5c.55 0 1.07.26 1.4.7l.9 1.2h6.7A1.75 1.75 0 0 1 16 4.65v7.6A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25V2.75c0-.464.184-.91.513-1.237ZM1.75 2.5a.25.25 0 0 0-.25.25V4h3.21l-.603-.804a.25.25 0 0 0-.2-.1H1.75Zm12.5 3H1.5v6.75c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-6.5a.25.25 0 0 0-.25-.25Z" />
  ) : (
    <path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25V5.75A1.75 1.75 0 0 0 14.25 4H7.5L5.972 2.474A1.75 1.75 0 0 0 4.728 2H1.75ZM1.5 2.75c0-.138.112-.25.25-.25H4.73c.066 0 .13.026.177.073L6.384 4H1.5V2.75Zm0 2.75h12.75c.138 0 .25.112.25.25v7.5a.25.25 0 0 1-.25.25H1.75a.25.25 0 0 1-.25-.25V5.5Z" />
  );
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="currentColor">
      {base}
      <path d="M6 7.5h4M8 6v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.7" />
      <rect x="5.5" y="10" width="5" height="1" rx="0.5" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

function FolderBlogIcon({ open }: { open: boolean }) {
  const base = open ? (
    <path d="M.513 1.513A1.75 1.75 0 0 1 1.75 1h3.5c.55 0 1.07.26 1.4.7l.9 1.2h6.7A1.75 1.75 0 0 1 16 4.65v7.6A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25V2.75c0-.464.184-.91.513-1.237ZM1.75 2.5a.25.25 0 0 0-.25.25V4h3.21l-.603-.804a.25.25 0 0 0-.2-.1H1.75Zm12.5 3H1.5v6.75c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-6.5a.25.25 0 0 0-.25-.25Z" />
  ) : (
    <path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25V5.75A1.75 1.75 0 0 0 14.25 4H7.5L5.972 2.474A1.75 1.75 0 0 0 4.728 2H1.75ZM1.5 2.75c0-.138.112-.25.25-.25H4.73c.066 0 .13.026.177.073L6.384 4H1.5V2.75Zm0 2.75h12.75c.138 0 .25.112.25.25v7.5a.25.25 0 0 1-.25.25H1.75a.25.25 0 0 1-.25-.25V5.5Z" />
  );
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="currentColor">
      {base}
      <path d="M5.5 7.5h5M5.5 9.5h5M5.5 11.5h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.65" />
    </svg>
  );
}

function FolderIcon({ name, open }: { name: string; open: boolean }) {
  if (name === "about") return <FolderAboutIcon open={open} />;
  if (name === "projects") return <FolderProjectsIcon open={open} />;
  if (name === "blog") return <FolderBlogIcon open={open} />;
  return open ? <FolderOpenIcon /> : <FolderClosedIcon />;
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-90" : "rotate-0"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 4l6 6-6 6" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.2 4.6 9.5 6a1 1 0 0 1-.8.54l-1.54.22a1 1 0 0 0-.56 1.7l1.12 1.08a1 1 0 0 1 .28.9l-.26 1.52a1 1 0 0 0 1.45 1.06l1.38-.72a1 1 0 0 1 .94 0l1.38.72a1 1 0 0 0 1.45-1.06l-.26-1.52a1 1 0 0 1 .28-.9l1.12-1.08a1 1 0 0 0-.56-1.7L15.1 6.5a1 1 0 0 1-.8-.54l-.7-1.4a1 1 0 0 0-1.8 0Z" />
      <circle cx="12" cy="10.5" r="2.4" />
      <path d="M12 15.25v4.25" />
      <path d="M9.25 19.5h5.5" />
    </svg>
  );
}

function SearchIcon() {
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
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function ClearIcon() {
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
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function ClosePanelIcon() {
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
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

function isNodeActive(node: ExplorerNode, activeFileIds: Set<string>): boolean {
  if (node.type === "file") {
    return activeFileIds.has(node.fileId);
  }

  return node.children.some((child) => isNodeActive(child, activeFileIds));
}

function getExplorerPadding(depth: number, offset: number) {
  return {
    paddingLeft: `calc(${depth} * var(--workspace-indent-step) + ${offset}rem)`,
  };
}

function clampExplorerWidth(width: number) {
  return Math.min(EXPLORER_MAX_WIDTH, Math.max(EXPLORER_MIN_WIDTH, width));
}

function normalizeSearchValue(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9./-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function fuzzyScore(target: string, query: string) {
  if (!target || !query) {
    return -1;
  }

  let score = 0;
  let cursor = 0;
  let spanStart = -1;
  let lastMatch = -2;

  for (const char of query) {
    let matchedIndex = -1;

    for (; cursor < target.length; cursor += 1) {
      if (target[cursor] !== char) {
        continue;
      }

      matchedIndex = cursor;
      if (spanStart === -1) {
        spanStart = cursor;
      }
      break;
    }

    if (matchedIndex === -1) {
      return -1;
    }

    score += 8;

    if (matchedIndex === lastMatch + 1) {
      score += 18;
    }

    if (matchedIndex === 0 || "/-_. ".includes(target[matchedIndex - 1])) {
      score += 26;
    }

    lastMatch = matchedIndex;
    cursor = matchedIndex + 1;
  }

  if (spanStart >= 0) {
    score += Math.max(0, 40 - (cursor - spanStart - query.length));
  }

  return score;
}

function flattenExplorerTree(
  nodes: ExplorerNode[],
  parentSegments: string[] = []
): ExplorerSearchEntry[] {
  const entries: ExplorerSearchEntry[] = [];

  for (const node of nodes) {
    if (node.type === "file") {
      entries.push({
        fileId: node.fileId,
        name: node.name,
        folderPath: parentSegments.join("/"),
        fullPath: [...parentSegments, node.name].join("/"),
      });
      continue;
    }

    entries.push(...flattenExplorerTree(node.children, [...parentSegments, node.name]));
  }

  return entries;
}

function scoreExplorerEntry(entry: ExplorerSearchEntry, query: string) {
  const normalizedQuery = normalizeSearchValue(query);
  if (!normalizedQuery) {
    return -1;
  }

  const queryTokens = normalizedQuery.split(" ").filter(Boolean);
  const name = normalizeSearchValue(entry.name);
  const fullPath = normalizeSearchValue(entry.fullPath);
  let score = 0;

  if (name === normalizedQuery) {
    score += 1800;
  }

  if (fullPath === normalizedQuery) {
    score += 1500;
  }

  if (name.startsWith(normalizedQuery)) {
    score += 900;
  }

  if (fullPath.startsWith(normalizedQuery)) {
    score += 650;
  }

  if (name.includes(normalizedQuery)) {
    score += 520;
  }

  if (fullPath.includes(normalizedQuery)) {
    score += 320;
  }

  let tokenHits = 0;

  for (const token of queryTokens) {
    if (name.includes(token)) {
      score += 180;
      tokenHits += 1;
      continue;
    }

    if (fullPath.includes(token)) {
      score += 110;
      tokenHits += 1;
    }
  }

  const fuzzyName = fuzzyScore(name, normalizedQuery);
  const fuzzyPath = fuzzyScore(fullPath, normalizedQuery);

  if (fuzzyName >= 0) {
    score += fuzzyName + 120;
  }

  if (fuzzyPath >= 0) {
    score += fuzzyPath;
  }

  if (
    tokenHits === 0 &&
    fuzzyName < 0 &&
    fuzzyPath < 0 &&
    !name.includes(normalizedQuery) &&
    !fullPath.includes(normalizedQuery)
  ) {
    return -1;
  }

  return score;
}

function highlightSearchText(text: string, query: string) {
  const tokens = normalizeSearchValue(query).split(" ").filter(Boolean);

  for (const token of tokens) {
    const index = text.toLowerCase().indexOf(token);

    if (index === -1) {
      continue;
    }

    return (
      <>
        {text.slice(0, index)}
        <span className="rounded-sm bg-accent/15 px-0.5 text-accent">
          {text.slice(index, index + token.length)}
        </span>
        {text.slice(index + token.length)}
      </>
    );
  }

  return text;
}

function ExplorerNodeRow({
  node,
  depth,
  openFolders,
  activeFileIds,
  onToggleFolder,
  onOpenFile,
  onAfterOpen,
}: {
  node: ExplorerNode;
  depth: number;
  openFolders: Set<string>;
  activeFileIds: Set<string>;
  onToggleFolder: (id: string) => void;
  onOpenFile: (fileId: string) => void;
  onAfterOpen?: () => void;
}) {
  if (node.type === "file") {
    const active = activeFileIds.has(node.fileId);
    return (
      <button
        type="button"
        onClick={() => {
          onOpenFile(node.fileId);
          onAfterOpen?.();
        }}
        className={`flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-left text-sm transition-colors duration-200 ${
          active
            ? "bg-[var(--vscode-tab)] text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
            : "text-muted hover:bg-white/5 hover:text-ink"
        }`}
        style={getExplorerPadding(depth, FILE_ROW_OFFSET)}
      >
        <span className="shrink-0 text-muted">
          <FileIcon />
        </span>
        <span className="truncate font-mono text-[12px]">{node.name}</span>
      </button>
    );
  }

  const open = openFolders.has(node.id);
  const active = isNodeActive(node, activeFileIds);

  return (
    <div>
      <button
        type="button"
        onClick={() => onToggleFolder(node.id)}
        className={`flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-left text-sm transition-colors duration-200 ${
          active ? "text-ink" : "text-muted hover:bg-white/5 hover:text-ink"
        }`}
        style={getExplorerPadding(depth, FOLDER_ROW_OFFSET)}
        aria-expanded={open}
      >
        <span className="text-muted">
          <Chevron open={open} />
        </span>
        <span className="text-muted">
          <FolderIcon name={node.name} open={open} />
        </span>
        <span className="truncate font-secondary text-[13px]">{node.name}</span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="children"
            className="mt-1 space-y-1 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {node.children.map((child) => (
              <ExplorerNodeRow
                key={child.id}
                node={child}
                depth={depth + 1}
                openFolders={openFolders}
                activeFileIds={activeFileIds}
                onToggleFolder={onToggleFolder}
                onOpenFile={onOpenFile}
                onAfterOpen={onAfterOpen}
              />
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function ExplorerPanel({
  activeFileIds,
  openFolders,
  onOpenFile,
  onToggleFolder,
  onDismiss,
  onAfterOpen,
  searchQuery,
  searchResults,
  activeSearchIndex,
  onSearchIndexChange,
  onSearchQueryChange,
  onClearSearch,
  onOpenSearchResult,
  tree,
}: {
  activeFileIds: Set<string>;
  openFolders: Set<string>;
  onOpenFile: (fileId: string) => void;
  onToggleFolder: (id: string) => void;
  onDismiss: () => void;
  onAfterOpen?: () => void;
  searchQuery: string;
  searchResults: ExplorerSearchResult[];
  activeSearchIndex: number;
  onSearchIndexChange: (index: number) => void;
  onSearchQueryChange: (value: string) => void;
  onClearSearch: () => void;
  onOpenSearchResult: (fileId: string) => void;
  tree: ExplorerNode[];
}) {
  const hasSearch = searchQuery.trim().length > 0;
  const searchCountLabel =
    searchResults.length === 1 ? "1 smart match" : `${searchResults.length} smart matches`;

  return (
    <div
      className="flex h-full min-h-0 flex-col"
      style={{
        background: "var(--vscode-sidebar)",
        borderColor: "var(--vscode-border)",
      }}
    >
      <div
        className="border-b px-3.5 pb-4 pt-3.5"
        style={{ borderBottom: "1px solid var(--vscode-border)" }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-ink/80">{portfolio.meta.name}</p>
            <p className="mt-0.5 text-[11px] text-muted">AI Research · Backend Engineer</p>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="ui-ghost-control h-8 w-8 shrink-0"
            aria-label="Close sidebar"
            title="Close sidebar"
          >
            <ClosePanelIcon />
          </button>
        </div>
      </div>

      <div className="workspace-scroll flex-1 overflow-y-auto px-2.5 py-3">
        {hasSearch ? (
          searchResults.length > 0 ? (
            <div className="space-y-1">
              {searchResults.map((result, index) => (
                <button
                  key={result.entry.fileId}
                  type="button"
                  onMouseEnter={() => onSearchIndexChange(index)}
                  onClick={() => {
                    onOpenSearchResult(result.entry.fileId);
                    onAfterOpen?.();
                  }}
                  className={`w-full rounded-[var(--radius-sm)] border px-3 py-2 text-left transition-colors duration-200 ${
                    activeSearchIndex === index
                      ? "border-accent/35 bg-accent/10 text-ink"
                      : "border-transparent text-muted hover:bg-white/5 hover:text-ink"
                  }`}
                >
                  <p className="truncate font-mono text-[12px] text-inherit">
                    {highlightSearchText(result.entry.name, searchQuery)}
                  </p>
                  <p className="mt-1 truncate text-[11px] text-muted/80">
                    {highlightSearchText(
                      result.entry.folderPath || result.entry.fullPath,
                      searchQuery
                    )}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-[var(--radius-md)] border border-dashed border-line bg-white/2 px-4 py-5">
              <p className="text-sm text-ink">No page matched that search.</p>
              <p className="mt-1 text-xs leading-6 text-muted">
                Try a title, slug, folder, or any path fragment.
              </p>
            </div>
          )
        ) : (
          <div className="space-y-1">
            {tree.map((node) => (
              <ExplorerNodeRow
                key={node.id}
                node={node}
                depth={0}
                openFolders={openFolders}
                activeFileIds={activeFileIds}
                onToggleFolder={onToggleFolder}
                onOpenFile={onOpenFile}
                onAfterOpen={onAfterOpen}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function VSCodeWorkspace({ theme, onThemeChange }: VSCodeWorkspaceProps) {
  const tree = useMemo(() => getExplorerTree(), []);
  const flatExplorerEntries = useMemo(() => flattenExplorerTree(tree), [tree]);
  const [hasEntered, setHasEntered] = useState(false);
  const [showTour, setShowTour] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(TOUR_KEY) !== "true";
  });
  const [openFolders, setOpenFolders] = useState<Set<string>>(() => {
    const defaults = tree
      .filter((node) => node.type === "folder" && node.defaultOpen)
      .map((node) => node.id);
    return new Set(defaults);
  });
  const [isExplorerVisible, setIsExplorerVisible] = useState(true);
  const [isMobileExplorerOpen, setIsMobileExplorerOpen] = useState(false);
  const [explorerWidth, setExplorerWidth] = useState(() => {
    if (typeof window === "undefined") {
      return EXPLORER_DEFAULT_WIDTH;
    }

    const stored = Number(localStorage.getItem(EXPLORER_WIDTH_STORAGE_KEY));
    return Number.isFinite(stored)
      ? clampExplorerWidth(stored)
      : EXPLORER_DEFAULT_WIDTH;
  });
  const [isResizingExplorer, setIsResizingExplorer] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [compareSource, setCompareSource] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchIndex, setActiveSearchIndex] = useState(0);
  const [activeGroupId, setActiveGroupId] = useState<"left" | "right">("left");
  const [groups, setGroups] = useState<{ left: EditorGroup; right: EditorGroup | null }>(() => {
    const welcome = getFileDescriptor("welcome.md");
    const initialTab: EditorTab =
      welcome
        ? { id: createTabId(), kind: "file", fileId: welcome.fileId, title: welcome.title }
        : { id: createTabId(), kind: "file", fileId: "welcome.md", title: "welcome.md" };

    return {
      left: { id: "left", tabs: [initialTab], activeTabId: initialTab.id },
      right: null,
    };
  });
  const resizeStateRef = useRef<{ startX: number; startWidth: number } | null>(null);

  useEffect(() => {
    if (hasEntered) {
      localStorage.setItem("workspace_entered", "true");
    }
  }, [hasEntered]);

  useEffect(() => {
    localStorage.setItem(EXPLORER_WIDTH_STORAGE_KEY, String(explorerWidth));
  }, [explorerWidth]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      if (isSettingsOpen) {
        setIsSettingsOpen(false);
      }

      if (isMobileExplorerOpen) {
        setIsMobileExplorerOpen(false);
      }

      if (searchQuery) {
        setSearchQuery("");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMobileExplorerOpen, isSettingsOpen, searchQuery]);

  useEffect(() => {
    if (!isResizingExplorer) {
      return;
    }

    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const onMouseMove = (event: MouseEvent) => {
      const resizeState = resizeStateRef.current;
      if (!resizeState) {
        return;
      }

      setExplorerWidth(
        clampExplorerWidth(resizeState.startWidth + event.clientX - resizeState.startX)
      );
    };

    const onMouseUp = () => {
      resizeStateRef.current = null;
      setIsResizingExplorer(false);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isResizingExplorer]);

  useEffect(() => {
    setActiveSearchIndex(0);
  }, [searchQuery]);

  const activeFileIds = useMemo(() => {
    const ids = new Set<string>();
    for (const tab of groups.left.tabs) {
      if (tab.kind === "file") {
        ids.add(tab.fileId);
      }
    }
    for (const tab of groups.right?.tabs ?? []) {
      if (tab.kind === "file") {
        ids.add(tab.fileId);
      }
    }
    return ids;
  }, [groups.left.tabs, groups.right?.tabs]);

  const activeTheme = useMemo(
    () => vscodeThemes.find((item) => item.id === theme),
    [theme]
  );
  const searchResults = useMemo(() => {
    const query = searchQuery.trim();
    if (!query) {
      return [];
    }

    return flatExplorerEntries
      .map((entry) => ({
        entry,
        score: scoreExplorerEntry(entry, query),
      }))
      .filter((entry): entry is ExplorerSearchResult => entry.score >= 0)
      .sort((left, right) => {
        if (right.score !== left.score) {
          return right.score - left.score;
        }

        return left.entry.fullPath.localeCompare(right.entry.fullPath);
      })
      .slice(0, MAX_SEARCH_RESULTS);
  }, [flatExplorerEntries, searchQuery]);

  const activeGroup = activeGroupId === "left" ? groups.left : groups.right ?? groups.left;
  const activeTabTitle =
    activeGroup.tabs.find((tab) => tab.id === activeGroup.activeTabId)?.title ?? "Portfolio";

  useEffect(() => {
    setActiveSearchIndex((current) =>
      searchResults.length === 0 ? 0 : Math.min(current, searchResults.length - 1)
    );
  }, [searchResults.length]);

  function toggleFolder(id: string) {
    setOpenFolders((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function openFile(fileId: string) {
    if (compareSource && compareSource !== fileId) {
      const left = getFileDescriptor(compareSource);
      const right = getFileDescriptor(fileId);
      setCompareSource(null);

      if (!left || !right) {
        return;
      }

      const diffTab: EditorTab = {
        id: createTabId(),
        kind: "diff",
        leftFileId: compareSource,
        rightFileId: fileId,
        title: `${left.title} ↔ ${right.title}`,
      };

      setGroups((current) => {
        const group = activeGroupId === "left" ? current.left : current.right ?? current.left;
        const nextGroup: EditorGroup = {
          ...group,
          tabs: [...group.tabs, diffTab],
          activeTabId: diffTab.id,
        };

        return activeGroupId === "left"
          ? { ...current, left: nextGroup }
          : { ...current, right: current.right ? nextGroup : current.right };
      });

      return;
    }

    const descriptor = getFileDescriptor(fileId);
    if (!descriptor) {
      return;
    }

    setGroups((current) => {
      const targetKey = activeGroupId;
      const target = targetKey === "left" ? current.left : current.right ?? current.left;
      const existing = target.tabs.find((tab) => tab.kind === "file" && tab.fileId === fileId);
      if (existing) {
        const nextGroup = { ...target, activeTabId: existing.id };
        return targetKey === "left"
          ? { ...current, left: nextGroup }
          : { ...current, right: current.right ? nextGroup : current.right };
      }

      const nextTab: EditorTab = {
        id: createTabId(),
        kind: "file",
        fileId,
        title: descriptor.title,
      };

      const nextGroup = {
        ...target,
        tabs: [...target.tabs, nextTab],
        activeTabId: nextTab.id,
      };

      return targetKey === "left"
        ? { ...current, left: nextGroup }
        : { ...current, right: current.right ? nextGroup : current.right };
    });
  }

  function openSearchResult(fileId: string) {
    setSearchQuery("");
    setActiveSearchIndex(0);
    openFile(fileId);
  }

  function closeTab(groupId: "left" | "right", tabId: string) {
    setGroups((current) => {
      const group = groupId === "left" ? current.left : current.right;
      if (!group) {
        return current;
      }

      const index = group.tabs.findIndex((tab) => tab.id === tabId);
      if (index === -1) {
        return current;
      }

      const nextTabs = group.tabs.filter((tab) => tab.id !== tabId);
      const nextActive =
        group.activeTabId === tabId
          ? nextTabs[index - 1]?.id ?? nextTabs[0]?.id ?? null
          : group.activeTabId;

      const nextGroup: EditorGroup = { ...group, tabs: nextTabs, activeTabId: nextActive };

      if (groupId === "right" && nextTabs.length === 0) {
        return { ...current, right: null };
      }

      return groupId === "left"
        ? { ...current, left: nextGroup }
        : { ...current, right: nextGroup };
    });
  }

  function setActiveTab(groupId: "left" | "right", tabId: string) {
    setActiveGroupId(groupId);
    setGroups((current) => {
      const group = groupId === "left" ? current.left : current.right;
      if (!group) {
        return current;
      }
      const nextGroup = { ...group, activeTabId: tabId };
      return groupId === "left"
        ? { ...current, left: nextGroup }
        : { ...current, right: nextGroup };
    });
  }

  function splitToRight(groupId: "left" | "right", tabId: string) {
    setGroups((current) => {
      const sourceGroup = groupId === "left" ? current.left : current.right;
      if (!sourceGroup) {
        return current;
      }

      const tab = sourceGroup.tabs.find((item) => item.id === tabId);
      if (!tab) {
        return current;
      }

      const rightGroup: EditorGroup = current.right ?? {
        id: "right",
        tabs: [],
        activeTabId: null,
      };

      const exists = rightGroup.tabs.some((item) => item.kind === tab.kind && item.title === tab.title);
      const nextTab = exists ? tab : { ...tab, id: createTabId() };
      const nextRight: EditorGroup = {
        ...rightGroup,
        tabs: exists ? rightGroup.tabs : [...rightGroup.tabs, nextTab],
        activeTabId: nextTab.id,
      };

      return { ...current, right: nextRight };
    });

    setActiveGroupId("right");
  }

  const statusLabel =
    compareSource
      ? `Choose a file to compare with ${compareSource}`
      : activeGroupId === "left"
        ? "Main view"
        : "Split view";

  return (
    <div
      className="h-[100dvh] overflow-hidden"
      style={{
        background: "var(--vscode-bg)",
        color: "rgb(var(--ink))",
      }}
    >
      {!hasEntered ? <EntryPortal onEnter={() => setHasEntered(true)} /> : null}
      {hasEntered && showTour ? (
        <OnboardingTour
          onDone={() => {
            localStorage.setItem(TOUR_KEY, "true");
            setShowTour(false);
          }}
        />
      ) : null}

      <div className="flex h-[calc(100dvh-var(--workspace-statusbar-height))] min-h-0 flex-col md:flex-row">
        <div
          className="flex h-[var(--workspace-titlebar-height)] items-center justify-between gap-3 border-b px-3 md:hidden"
          style={{ background: "var(--vscode-panel)", borderColor: "var(--vscode-border)" }}
        >
          <button
            type="button"
            className="ui-ghost-control h-9 w-9 shrink-0"
            aria-label="Open sidebar"
            title="Open sidebar"
            onClick={() => setIsMobileExplorerOpen(true)}
          >
            <ActivityIcon />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-[12px] text-ink">{activeTabTitle}</p>
            <p className="truncate text-[10px] uppercase tracking-[0.18em] text-muted">
              {compareSource ? "Compare mode" : statusLabel}
            </p>
          </div>
          <button
            type="button"
            className="ui-ghost-control h-9 w-9 shrink-0"
            aria-label="Open settings"
            title="Open settings"
            onClick={() => setIsSettingsOpen(true)}
          >
            <SettingsIcon />
          </button>
        </div>

        <div
          className="hidden h-full w-[var(--workspace-rail-width)] shrink-0 flex-col items-center justify-between border-r px-2 py-2 md:flex"
          style={{ background: "var(--vscode-panel)", borderColor: "var(--vscode-border)" }}
        >
          <button
            type="button"
            className="ui-ghost-control h-10 w-10"
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
            onClick={() => setIsExplorerVisible((current) => !current)}
          >
            <ActivityIcon />
          </button>
          <button
            type="button"
            data-onboarding="settings"
            className="ui-ghost-control h-10 w-10"
            aria-label="Open settings"
            title="Open settings"
            onClick={() => setIsSettingsOpen(true)}
          >
            <SettingsIcon />
          </button>
        </div>

        {isExplorerVisible ? (
          <div
            data-onboarding="explorer"
            className="hidden h-full shrink-0 border-r md:block"
            style={{
              width: `${explorerWidth}px`,
              borderColor: "var(--vscode-border)",
            }}
          >
            <ExplorerPanel
              tree={tree}
              openFolders={openFolders}
              activeFileIds={activeFileIds}
              onToggleFolder={toggleFolder}
              onOpenFile={openFile}
              onDismiss={() => setIsExplorerVisible(false)}
              onAfterOpen={undefined}
              searchQuery={searchQuery}
              searchResults={searchResults}
              activeSearchIndex={activeSearchIndex}
              onSearchIndexChange={setActiveSearchIndex}
              onSearchQueryChange={setSearchQuery}
              onClearSearch={() => setSearchQuery("")}
              onOpenSearchResult={openSearchResult}
            />
          </div>
        ) : null}

        {isExplorerVisible ? (
          <div
            className="relative hidden shrink-0 md:block"
            style={{ width: "var(--workspace-sash-width)" }}
          >
            <button
              type="button"
              aria-label="Resize sidebar"
              title="Drag to resize sidebar"
              onMouseDown={(event) => {
                resizeStateRef.current = {
                  startX: event.clientX,
                  startWidth: explorerWidth,
                };
                setIsResizingExplorer(true);
              }}
              onDoubleClick={() => setExplorerWidth(EXPLORER_DEFAULT_WIDTH)}
              className="absolute inset-y-0 left-1/2 -translate-x-1/2 transition-colors duration-150"
              style={{
                width: "var(--workspace-sash-width)",
                cursor: "col-resize",
              }}
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 transition-colors duration-150"
                style={{
                  background: isResizingExplorer
                    ? "rgb(var(--accent) / 0.75)"
                    : "rgb(255 255 255 / 0.08)",
                }}
              />
              <span className="sr-only">Resize sidebar</span>
            </button>
          </div>
        ) : null}

        {isMobileExplorerOpen ? (
          <div
            className="fixed inset-0 z-[65] bg-black/55 backdrop-blur-sm md:hidden"
            role="presentation"
            onClick={() => setIsMobileExplorerOpen(false)}
          >
            <div
              className="h-full border-r shadow-[var(--shadow-soft)]"
              style={{
                width: `min(${explorerWidth}px, calc(100vw - 1.75rem))`,
                borderColor: "var(--vscode-border)",
              }}
              onClick={(event) => event.stopPropagation()}
              role="presentation"
            >
              <ExplorerPanel
                tree={tree}
                openFolders={openFolders}
                activeFileIds={activeFileIds}
                onToggleFolder={toggleFolder}
                onOpenFile={openFile}
                onDismiss={() => setIsMobileExplorerOpen(false)}
                onAfterOpen={() => setIsMobileExplorerOpen(false)}
                searchQuery={searchQuery}
                searchResults={searchResults}
                activeSearchIndex={activeSearchIndex}
                onSearchIndexChange={setActiveSearchIndex}
                onSearchQueryChange={setSearchQuery}
                onClearSearch={() => setSearchQuery("")}
                onOpenSearchResult={openSearchResult}
              />
            </div>
          </div>
        ) : null}

        <div className="min-h-0 min-w-0 flex-1">
          <div
            className={`grid h-full min-h-0 gap-px ${
              groups.right ? "grid-rows-2 xl:grid-cols-2 xl:grid-rows-1" : "grid-cols-1"
            }`}
            style={{ background: "var(--vscode-border)" }}
          >
            <div
              className="min-h-0 min-w-0"
              style={{ background: "var(--vscode-bg)" }}
              onMouseDown={() => setActiveGroupId("left")}
            >
              <VSCodeEditor
                groupId="left"
                group={groups.left}
                isActive={activeGroupId === "left"}
                onOpenFile={openFile}
                onCloseTab={closeTab}
                onSetActiveTab={setActiveTab}
                onSplitRight={splitToRight}
                onCompare={(fileId) => setCompareSource(fileId)}
              />
            </div>
            {groups.right ? (
              <div
                className="min-h-0 min-w-0"
                style={{ background: "var(--vscode-bg)" }}
                onMouseDown={() => setActiveGroupId("right")}
              >
                <VSCodeEditor
                  groupId="right"
                  group={groups.right}
                  isActive={activeGroupId === "right"}
                  onOpenFile={openFile}
                  onCloseTab={closeTab}
                  onSetActiveTab={setActiveTab}
                  onSplitRight={splitToRight}
                  onCompare={(fileId) => setCompareSource(fileId)}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div
        className="flex h-[var(--workspace-statusbar-height)] items-center justify-between gap-3 border-t px-3 text-[11px] md:px-4"
        style={{
          background: "var(--vscode-status)",
          color: "var(--vscode-status-text)",
          borderColor: "var(--vscode-border)",
        }}
      >
        <p className="truncate">
          {compareSource ? "Compare mode: choose another file" : statusLabel}
        </p>
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="hidden rounded-[0.45rem] bg-black/15 px-2.5 py-0.5 transition-colors duration-200 hover:bg-black/25 md:inline-flex"
          >
            Settings
          </button>
          <p className="truncate">{activeTheme?.label ?? theme}</p>
        </div>
      </div>

      {isSettingsOpen ? (
        <div
          className="fixed inset-0 z-[70] bg-black/50 p-4 backdrop-blur-sm sm:p-6"
          role="presentation"
          onClick={() => setIsSettingsOpen(false)}
        >
          <div
            className="mx-auto flex min-h-full w-full max-w-2xl items-center justify-center"
            role="presentation"
          >
            <div
              className="ui-panel w-full max-w-2xl p-5 text-ink sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-label="Settings"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
                    Settings
                  </p>
                  <h2 className="font-secondary text-xl font-medium text-ink">
                    Portfolio preferences
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="ui-ghost-control h-9 w-9 shrink-0"
                >
                  <ClosePanelIcon />
                </button>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px]">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
                      Theme
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {vscodeThemes.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => onThemeChange(item.id)}
                          data-active={theme === item.id}
                          className="ui-control justify-between px-4 py-3 text-left"
                        >
                          <span className="truncate text-sm">{item.label}</span>
                          <span className="text-[11px] uppercase tracking-[0.16em] text-muted">
                            {theme === item.id ? "Active" : "Set"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
                      Quick actions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setHasEntered(false);
                          setIsSettingsOpen(false);
                        }}
                        className="ui-control px-4 text-sm"
                      >
                        Show intro again
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCompareSource(null);
                          setIsSettingsOpen(false);
                        }}
                        className="ui-control px-4 text-sm"
                      >
                        Clear compare
                      </button>
                    </div>
                  </div>
                </div>

                <div className="ui-panel p-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
                    Status
                  </p>
                  <div className="mt-3 space-y-3 text-sm text-ink/78">
                    <p>Theme: {activeTheme?.label ?? theme}</p>
                    <p>{compareSource ? "Compare mode is armed." : "Editor tools are idle."}</p>
                    <p className="text-muted">
                      Tip: open any file, then use the tab actions to split or diff it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
