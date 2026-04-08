import { useEffect, useMemo, useState } from "react";

import { LoadingType } from "@/components/loading-type";
import { WorkspaceState } from "@/components/workspace-state";
import { getFileDescriptor } from "@/lib/vscode-files";

type DiffOp =
  | { type: "equal"; left: string; right: string }
  | { type: "delete"; left: string }
  | { type: "insert"; right: string };

function diffLines(leftText: string, rightText: string): DiffOp[] {
  const left = leftText.split("\n");
  const right = rightText.split("\n");
  const n = left.length;
  const m = right.length;

  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array.from({ length: m + 1 }, () => 0)
  );

  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      dp[i][j] =
        left[i] === right[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const ops: DiffOp[] = [];
  let i = 0;
  let j = 0;

  while (i < n && j < m) {
    if (left[i] === right[j]) {
      ops.push({ type: "equal", left: left[i], right: right[j] });
      i += 1;
      j += 1;
      continue;
    }

    if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: "delete", left: left[i] });
      i += 1;
    } else {
      ops.push({ type: "insert", right: right[j] });
      j += 1;
    }
  }

  while (i < n) {
    ops.push({ type: "delete", left: left[i] });
    i += 1;
  }

  while (j < m) {
    ops.push({ type: "insert", right: right[j] });
    j += 1;
  }

  return ops;
}

type Row = {
  leftNumber?: number;
  rightNumber?: number;
  leftText: string;
  rightText: string;
  kind: "equal" | "delete" | "insert";
};

function toRows(ops: DiffOp[]): Row[] {
  const rows: Row[] = [];
  let leftLine = 1;
  let rightLine = 1;

  for (const op of ops) {
    if (op.type === "equal") {
      rows.push({
        kind: "equal",
        leftNumber: leftLine++,
        rightNumber: rightLine++,
        leftText: op.left,
        rightText: op.right,
      });
      continue;
    }

    if (op.type === "delete") {
      rows.push({
        kind: "delete",
        leftNumber: leftLine++,
        rightNumber: undefined,
        leftText: op.left,
        rightText: "",
      });
      continue;
    }

    rows.push({
      kind: "insert",
      leftNumber: undefined,
      rightNumber: rightLine++,
      leftText: "",
      rightText: op.right,
    });
  }

  return rows;
}

function DiffPane({
  title,
  side,
  rows,
}: {
  title: string;
  side: "left" | "right";
  rows: Row[];
}) {
  return (
    <div className="flex min-w-0 flex-col">
      <div
        className="flex h-9 items-center justify-between px-3 text-xs text-muted"
        style={{ borderBottom: "1px solid var(--vscode-border)" }}
      >
        <p className="truncate font-mono">{title}</p>
      </div>
      <div className="workspace-scroll overflow-x-auto font-mono text-[12px] leading-6">
        {rows.map((row, index) => {
          const number = side === "left" ? row.leftNumber : row.rightNumber;
          const text = side === "left" ? row.leftText : row.rightText;
          const kind = row.kind;
          const bg =
            kind === "delete"
              ? side === "left"
                ? "bg-red-500/10"
                : "bg-transparent"
              : kind === "insert"
                ? side === "right"
                  ? "bg-emerald-500/10"
                  : "bg-transparent"
                : "bg-transparent";

          return (
            <div
              key={`${side}-${index}`}
              className={`grid min-w-max grid-cols-[52px_minmax(0,1fr)] ${bg}`}
            >
              <div className="select-none px-3 text-right text-muted/80">
                {number ?? ""}
              </div>
              <div className="min-w-0 whitespace-pre px-3 text-ink/90">
                {text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function VSCodeDiffView({
  leftFileId,
  rightFileId,
  onOpenFile,
}: {
  leftFileId: string;
  rightFileId: string;
  onOpenFile: (fileId: string) => void;
}) {
  const [leftText, setLeftText] = useState<string>("");
  const [rightText, setRightText] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const left = getFileDescriptor(leftFileId);
    const right = getFileDescriptor(rightFileId);

    if (!left || !right) {
      setErrorMessage(`Could not load ${leftFileId} or ${rightFileId}.`);
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    Promise.all([left.load(), right.load()])
      .then(([l, r]) => {
        if (!cancelled) {
          setLeftText(l);
          setRightText(r);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setErrorMessage(`Failed to compare ${leftFileId} and ${rightFileId}.`);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [leftFileId, rightFileId]);

  const rows = useMemo(() => toRows(diffLines(leftText, rightText)), [leftText, rightText]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <WorkspaceState
          title="Building diff view"
          description="Comparing both files line by line and preparing a side-by-side render."
        >
          <LoadingType label="Loading" />
        </WorkspaceState>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <WorkspaceState
          tone="error"
          title="Diff unavailable"
          description={errorMessage}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Diff:{" "}
          <button
            type="button"
            onClick={() => onOpenFile(leftFileId)}
            className="underline decoration-accent/60 underline-offset-4 hover:opacity-80"
          >
            {leftFileId}
          </button>{" "}
          ↔{" "}
          <button
            type="button"
            onClick={() => onOpenFile(rightFileId)}
            className="underline decoration-accent/60 underline-offset-4 hover:opacity-80"
          >
            {rightFileId}
          </button>
        </p>
      </div>

      <div
        className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] border shadow-[var(--shadow-panel)] lg:grid-cols-2"
        style={{
          borderColor: "var(--vscode-border)",
          background: "var(--vscode-border)",
        }}
      >
        <div className="min-w-0" style={{ background: "var(--vscode-bg)" }}>
          <DiffPane title={leftFileId} side="left" rows={rows} />
        </div>
        <div className="min-w-0" style={{ background: "var(--vscode-bg)" }}>
          <DiffPane title={rightFileId} side="right" rows={rows} />
        </div>
      </div>
    </div>
  );
}
