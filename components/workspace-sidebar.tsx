import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { ThemeToggle } from "@/components/theme-toggle";
import { portfolio } from "@/lib/portfolio-data";
import { getWorkspaceTree, type WorkspaceNode } from "@/lib/workspace-tree";

type WorkspaceSidebarProps = {
  theme: "dark" | "light";
  onToggleTheme: () => void;
  isOpen: boolean;
  onClose: () => void;
};

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={`h-4 w-4 transition-transform duration-200 ${
        open ? "rotate-90" : "rotate-0"
      }`}
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

function FileIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

function isNodeActive(node: WorkspaceNode, pathname: string): boolean {
  if (node.type === "file") {
    return pathname === node.to;
  }

  return node.children.some((child) => isNodeActive(child, pathname));
}

function TreeNode({
  node,
  depth,
  pathname,
  openFolders,
  onToggleFolder,
  onNavigate,
}: {
  node: WorkspaceNode;
  depth: number;
  pathname: string;
  openFolders: Set<string>;
  onToggleFolder: (id: string) => void;
  onNavigate: () => void;
}) {
  if (node.type === "file") {
    const active = pathname === node.to;
    return (
      <Link
        to={node.to}
        onClick={onNavigate}
        className={`flex items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors duration-200 ${
          active
            ? "bg-surface text-ink ring-1 ring-line"
            : "text-muted hover:bg-surface/60 hover:text-ink"
        }`}
        style={{ paddingLeft: depth * 14 + 8 }}
        aria-current={active ? "page" : undefined}
      >
        <FileIcon />
        <span className="truncate font-mono text-[12px]">{node.name}</span>
      </Link>
    );
  }

  const open = openFolders.has(node.id);
  const active = isNodeActive(node, pathname);

  return (
    <div>
      <button
        type="button"
        onClick={() => onToggleFolder(node.id)}
        className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors duration-200 ${
          active
            ? "text-ink"
            : "text-muted hover:bg-surface/60 hover:text-ink"
        }`}
        style={{ paddingLeft: depth * 14 + 8 }}
        aria-expanded={open}
      >
        <span className="shrink-0 text-muted">
          <Chevron open={open} />
        </span>
        <FolderIcon />
        <span className="truncate font-secondary text-[13px]">{node.name}</span>
      </button>
      {open ? (
        <div className="mt-1 space-y-1">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              pathname={pathname}
              openFolders={openFolders}
              onToggleFolder={onToggleFolder}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function WorkspaceSidebar({
  theme,
  onToggleTheme,
  isOpen,
  onClose,
}: WorkspaceSidebarProps) {
  const location = useLocation();
  const tree = useMemo(() => getWorkspaceTree(), []);
  const [openFolders, setOpenFolders] = useState<Set<string>>(() => {
    if (typeof window === "undefined") {
      return new Set<string>();
    }

    try {
      const raw = localStorage.getItem("workspace_open_folders");
      if (!raw) {
        return new Set<string>();
      }
      const parsed = JSON.parse(raw) as string[];
      return new Set(parsed);
    } catch {
      return new Set<string>();
    }
  });

  useEffect(() => {
    const defaultOpen = tree
      .filter((node) => node.type === "folder" && node.defaultOpen)
      .map((node) => node.id);

    setOpenFolders((current) => {
      if (current.size > 0) {
        return current;
      }
      return new Set(defaultOpen);
    });
  }, [tree]);

  useEffect(() => {
    localStorage.setItem(
      "workspace_open_folders",
      JSON.stringify(Array.from(openFolders))
    );
  }, [openFolders]);

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

  const sidebar = (
    <aside className="h-full w-[300px] shrink-0 border-r border-line bg-surface/20">
      <div className="flex h-14 items-center justify-between gap-3 border-b border-line px-4">
        <div className="min-w-0">
          <p className="truncate font-secondary text-sm font-medium text-ink">
            {portfolio.meta.name}
          </p>
          <p className="truncate text-xs text-muted">Workspace</p>
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>

      <div className="px-3 py-4">
        <p className="px-2 pb-3 text-[11px] uppercase tracking-[0.22em] text-muted">
          Explorer
        </p>
        <div className="space-y-1">
          {tree.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              depth={0}
              pathname={location.pathname}
              openFolders={openFolders}
              onToggleFolder={toggleFolder}
              onNavigate={onClose}
            />
          ))}
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden md:block">{sidebar}</div>
      {isOpen ? (
        <div
          className="fixed inset-0 z-50 bg-canvas/70 backdrop-blur-sm md:hidden"
          onClick={onClose}
          role="presentation"
        >
          <div
            className="h-full"
            onClick={(event) => event.stopPropagation()}
            role="presentation"
          >
            {sidebar}
          </div>
        </div>
      ) : null}
    </>
  );
}
