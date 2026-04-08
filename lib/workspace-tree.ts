import { blogPosts, projectEntries } from "@/lib/content";

export type WorkspaceNode =
  | {
      type: "folder";
      id: string;
      name: string;
      children: WorkspaceNode[];
      defaultOpen?: boolean;
    }
  | {
      type: "file";
      id: string;
      name: string;
      to: string;
    };

function filenameFromSlug(slug: string) {
  return `${slug}.md`;
}

export function getWorkspaceTree(): WorkspaceNode[] {
  const projectsFolder: WorkspaceNode = {
    type: "folder",
    id: "folder-projects",
    name: "projects",
    defaultOpen: true,
    children: [
      { type: "file", id: "file-projects-index", name: "index.md", to: "/projects" },
      ...projectEntries.map((entry) => ({
        type: "file" as const,
        id: `project-${entry.slug}`,
        name: filenameFromSlug(entry.slug),
        to: `/projects/${entry.slug}`,
      })),
    ],
  };

  const blogFolder: WorkspaceNode = {
    type: "folder",
    id: "folder-blog",
    name: "blog",
    defaultOpen: false,
    children: [
      { type: "file", id: "file-blog-index", name: "index.md", to: "/blog" },
      ...blogPosts.map((entry) => ({
        type: "file" as const,
        id: `blog-${entry.slug}`,
        name: filenameFromSlug(entry.slug),
        to: `/blog/${entry.slug}`,
      })),
    ],
  };

  const aboutFolder: WorkspaceNode = {
    type: "folder",
    id: "folder-about",
    name: "about",
    defaultOpen: true,
    children: [
      { type: "file", id: "file-who-i-am", name: "who-i-am.md", to: "/who-i-am" },
      { type: "file", id: "file-experience", name: "experience.md", to: "/experience" },
    ],
  };

  return [aboutFolder, projectsFolder, blogFolder];
}

