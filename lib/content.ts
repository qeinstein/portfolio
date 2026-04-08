import manifest from "@/generated/content-manifest.json";

export type BlogEntryMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  published: boolean;
  tags: string[];
  sourcePath: string;
};

export type ProjectEntryMeta = {
  slug: string;
  title: string;
  excerpt: string;
  published: boolean;
  featured: boolean;
  tags: string[];
  stack: string[];
  role: string;
  status: string;
  link: string;
  repo: string;
  sourcePath: string;
};

export type BlogEntry = BlogEntryMeta & {
  content: string;
};

export type ProjectEntry = ProjectEntryMeta & {
  content: string;
};

type MarkdownLoader = () => Promise<string>;

const blogLoaders = import.meta.glob("/content/blog/*.md", {
  query: "?raw",
  import: "default",
}) as Record<string, MarkdownLoader>;

const projectLoaders = import.meta.glob("/content/projects/*.md", {
  query: "?raw",
  import: "default",
}) as Record<string, MarkdownLoader>;

function stripFrontmatter(raw: string) {
  return raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "").trim();
}

async function loadMarkdownContent(
  sourcePath: string,
  loaders: Record<string, MarkdownLoader>
) {
  const load = loaders[sourcePath];

  if (!load) {
    throw new Error(`Missing markdown loader for ${sourcePath}`);
  }

  const raw = await load();
  return stripFrontmatter(raw);
}

export function formatContentDate(date: string) {
  const timestamp = Date.parse(date);

  if (Number.isNaN(timestamp)) {
    return date;
  }

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(timestamp));
}

export function getAdjacentEntries<T extends { slug: string }>(
  entries: T[],
  slug: string | undefined
) {
  const index = entries.findIndex((entry) => entry.slug === slug);

  if (index === -1) {
    return {
      previous: undefined,
      next: undefined,
    };
  }

  return {
    previous: entries[index - 1],
    next: entries[index + 1],
  };
}

export async function getBlogPostBySlug(slug: string | undefined) {
  const entry = blogPosts.find((post) => post.slug === slug);

  if (!entry) {
    return undefined;
  }

  const content = await loadMarkdownContent(entry.sourcePath, blogLoaders);
  return {
    ...entry,
    content,
  } satisfies BlogEntry;
}

export async function getProjectEntryBySlug(slug: string | undefined) {
  const entry = projectEntries.find((project) => project.slug === slug);

  if (!entry) {
    return undefined;
  }

  const content = await loadMarkdownContent(entry.sourcePath, projectLoaders);
  return {
    ...entry,
    content,
  } satisfies ProjectEntry;
}

export const blogPosts = manifest.blogPosts as BlogEntryMeta[];
export const projectEntries = manifest.projectEntries as ProjectEntryMeta[];
