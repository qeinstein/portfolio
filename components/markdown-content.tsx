import { Children, type ReactNode, isValidElement, useEffect, useState } from "react";
import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

import { slugifyHeading } from "@/lib/markdown-headings";

type MarkdownContentProps = {
  content: string;
  onOpenWorkspaceFile?: (fileId: string) => void;
};

function toPlainText(node: unknown): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (!isValidElement(node)) {
    return "";
  }

  const children = (node.props as { children?: unknown }).children;
  return Children.toArray(children as ReactNode).map(toPlainText).join("");
}

function formatLanguageLabel(className?: string) {
  const language = className
    ?.split(" ")
    .find((token) => token.startsWith("language-"))
    ?.replace(/^language-/, "");

  if (!language) {
    return "code";
  }

  return language.replace(/[-_]/g, " ");
}

function CodeBlock({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const rawCode = Children.toArray(children).map(toPlainText).join("").replace(/\n$/, "");
  const languageLabel = formatLanguageLabel(className);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <div className="code-block-shell">
      <div className="code-block-toolbar">
        <span className="code-block-language">{languageLabel}</span>
        <button
          type="button"
          className="ui-ghost-control px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em]"
          onClick={async () => {
            try {
              await navigator.clipboard?.writeText(rawCode);
              setCopied(true);
            } catch {
              setCopied(false);
            }
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="code-block-pre workspace-scroll">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

export function MarkdownContent({ content, onOpenWorkspaceFile }: MarkdownContentProps) {
  const headingCounts = new Map<string, number>();
  const getHeadingId = (headingText: string) => {
    const base = slugifyHeading(headingText) || "section";
    const count = headingCounts.get(base) ?? 0;
    headingCounts.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  };

  return (
    <div className="markdown-shell">
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight]}
        remarkPlugins={[remarkGfm]}
        urlTransform={(url) =>
          url.startsWith("workspace:") ? url : defaultUrlTransform(url)
        }
        components={{
          p: ({ children }) => {
            const nodes = Children.toArray(children).filter(
              (child) => !(typeof child === "string" && child.trim() === "")
            );
            const imageNodes = nodes.filter(
              (child) => isValidElement(child) && child.type === "img"
            );
            const isImageOnlyParagraph = nodes.every(
              (child) =>
                (typeof child === "string" && child.trim() === "") ||
                (isValidElement(child) && child.type === "img")
            );

            if (isImageOnlyParagraph && imageNodes.length === 1) {
              return <div className="markdown-image-block">{nodes[0]}</div>;
            }

            if (isImageOnlyParagraph && imageNodes.length > 1) {
              return (
                <div
                  className="markdown-gallery"
                  data-count={Math.min(imageNodes.length, 3)}
                >
                  {imageNodes}
                </div>
              );
            }

            return (
              <p className="text-[15px] leading-7 text-ink/90 md:text-base">
                {children}
              </p>
            );
          },
          h1: ({ children }) => {
            const headingText = Children.toArray(children).map(toPlainText).join("");
            return (
              <h1
                id={getHeadingId(headingText)}
                className="scroll-mt-28 text-3xl font-medium tracking-tight text-ink md:text-4xl"
              >
                {children}
              </h1>
            );
          },
          h2: ({ children }) => {
            const headingText = Children.toArray(children).map(toPlainText).join("");
            return (
              <h2
                id={getHeadingId(headingText)}
                className="scroll-mt-28 pt-4 text-xl font-medium tracking-tight text-ink md:text-2xl"
              >
                {children}
              </h2>
            );
          },
          h3: ({ children }) => {
            const headingText = Children.toArray(children).map(toPlainText).join("");
            return (
              <h3
                id={getHeadingId(headingText)}
                className="scroll-mt-28 pt-3 text-base font-medium tracking-tight text-ink md:text-lg"
              >
                {children}
              </h3>
            );
          },
          h4: ({ children }) => {
            const headingText = Children.toArray(children).map(toPlainText).join("");
            return (
              <h4
                id={getHeadingId(headingText)}
                className="scroll-mt-28 pt-2 text-sm font-medium tracking-tight text-ink md:text-base"
              >
                {children}
              </h4>
            );
          },
          ul: ({ children }) => (
            <ul className="list-disc space-y-2 pl-5 text-[15px] leading-7 text-ink/90 marker:text-ink md:text-base">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-2 pl-5 text-[15px] leading-7 text-ink/90 marker:text-ink md:text-base">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l border-accent/50 pl-4 text-[15px] leading-7 text-ink/82 md:text-base">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-ink underline decoration-accent/60 underline-offset-4 transition-opacity duration-200 hover:opacity-75"
              onClick={(event) => {
                if (!href) {
                  return;
                }

                if (href.startsWith("workspace:")) {
                  event.preventDefault();
                  onOpenWorkspaceFile?.(href.replace(/^workspace:/, ""));
                  return;
                }
              }}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          code: ({ className, children }) =>
            className ? (
              <CodeBlock className={className}>{children}</CodeBlock>
            ) : (
              <code className="rounded-md border border-line bg-surface/78 px-1.5 py-0.5 text-[0.92em] text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                {children}
              </code>
            ),
          pre: ({ children }) => <>{children}</>,
          img: ({ src, alt, title }) => (
            <figure className="markdown-image-frame">
              <img
                src={src}
                alt={alt ?? ""}
                loading="lazy"
                className="markdown-image"
              />
              {title ? (
                <figcaption className="markdown-image-caption">{title}</figcaption>
              ) : null}
            </figure>
          ),
          hr: () => <hr className="border-0 border-t border-line" />,
          strong: ({ children }) => <strong className="font-medium text-ink">{children}</strong>
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
