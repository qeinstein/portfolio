export type MarkdownHeading = {
  id: string;
  text: string;
  level: 1 | 2 | 3 | 4;
};

export function slugifyHeading(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function stripInlineMarkdown(value: string) {
  return value
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[*_~]/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function createHeadingIdFactory() {
  const seen = new Map<string, number>();

  return (text: string) => {
    const base = slugifyHeading(text) || "section";
    const current = seen.get(base) ?? 0;
    seen.set(base, current + 1);
    return current === 0 ? base : `${base}-${current + 1}`;
  };
}

export function extractMarkdownHeadings(markdown: string): MarkdownHeading[] {
  const headings: MarkdownHeading[] = [];
  const getId = createHeadingIdFactory();

  const lines = markdown.split(/\r?\n/);
  let isInsideFence = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      isInsideFence = !isInsideFence;
      continue;
    }

    if (isInsideFence) {
      continue;
    }

    const match = /^(#{1,4})\s+(.*)$/.exec(trimmed);
    if (!match) {
      continue;
    }

    const level = match[1].length as 1 | 2 | 3 | 4;
    const rawText = match[2].replace(/\s+#+\s*$/, "");
    const text = stripInlineMarkdown(rawText);

    if (!text) {
      continue;
    }

    headings.push({
      id: getId(text),
      text,
      level,
    });
  }

  return headings;
}
