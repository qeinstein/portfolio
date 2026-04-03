import { Children, isValidElement } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
  content: string;
};

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="markdown-shell">
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight]}
        remarkPlugins={[remarkGfm]}
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
          h1: ({ children }) => (
            <h1 className="text-3xl font-medium tracking-tight text-ink md:text-4xl">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="pt-4 text-xl font-medium tracking-tight text-ink md:text-2xl">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="pt-3 text-base font-medium tracking-tight text-ink md:text-lg">
              {children}
            </h3>
          ),
          ul: ({ children }) => (
            <ul className="space-y-2 pl-5 text-[15px] leading-7 text-ink/90 marker:text-ink md:text-base">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-2 pl-5 text-[15px] leading-7 text-ink/90 marker:text-ink md:text-base">
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
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          code: ({ className, children }) =>
            className ? (
              <code
                className={`${className} block min-w-full rounded-none bg-transparent px-4 py-3 text-[13px] leading-6 md:text-sm`}
              >
                {children}
              </code>
            ) : (
              <code className="rounded-md bg-surface/90 px-1.5 py-0.5 text-[0.92em] text-ink">
                {children}
              </code>
            ),
          pre: ({ children }) => (
            <pre className="overflow-x-auto rounded-2xl border border-line bg-surface/90">
              {children}
            </pre>
          ),
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
