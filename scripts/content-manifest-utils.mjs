import path from "node:path";

import matter from "gray-matter";

export function sortByDateDesc(left, right) {
  return right.date.localeCompare(left.date);
}

export function sortByTitleAsc(left, right) {
  return left.title.localeCompare(right.title);
}

export function slugFromFilename(filename) {
  return filename.replace(/\.md$/i, "");
}

export function normalizeString(value, fallback = "") {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return typeof value === "string" ? value.trim() : fallback;
}

export function normalizeBoolean(value, fallback = true) {
  return typeof value === "boolean" ? value : fallback;
}

export function normalizeStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseMarkdownFile(raw, type, relativePath) {
  const { data } = matter(raw);
  const slug = slugFromFilename(path.basename(relativePath));

  if (type === "blog") {
    return {
      slug,
      title: normalizeString(data.title, slug),
      date: normalizeString(data.date),
      excerpt: normalizeString(data.excerpt),
      published: normalizeBoolean(data.published),
      tags: normalizeStringArray(data.tags),
      sourcePath: `/${relativePath.replace(/\\/g, "/")}`,
    };
  }

  return {
    slug,
    title: normalizeString(data.title, slug),
    excerpt: normalizeString(data.excerpt),
    published: normalizeBoolean(data.published),
    featured: normalizeBoolean(data.featured, false),
    tags: normalizeStringArray(data.tags),
    stack: normalizeStringArray(data.stack),
    role: normalizeString(data.role),
    status: normalizeString(data.status),
    link: normalizeString(data.link),
    repo: normalizeString(data.repo),
    sourcePath: `/${relativePath.replace(/\\/g, "/")}`,
  };
}
