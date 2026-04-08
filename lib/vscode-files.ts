import { blogPosts, getBlogPostBySlug, getProjectEntryBySlug, projectEntries } from "@/lib/content";
import { portfolio } from "@/lib/portfolio-data";

import whoIAmRaw from "@/who-i-am.md?raw";

export type ExplorerNode =
  | {
      type: "folder";
      id: string;
      name: string;
      defaultOpen?: boolean;
      children: ExplorerNode[];
    }
  | {
      type: "file";
      id: string;
      name: string;
      fileId: string;
    };

export type FileDescriptor = {
  fileId: string;
  title: string;
  language: "markdown";
  load: () => Promise<string>;
};

function stripFrontmatter(raw: string) {
  return raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "").trim();
}

function toExperienceMarkdown() {
  const lines: string[] = [];
  lines.push("# Experience");
  lines.push("");

  for (const item of portfolio.experience) {
    lines.push(`## ${item.company}`);
    lines.push("");
    lines.push(`**${item.role}** · ${item.period}`);
    lines.push("");
    lines.push(item.summary);
    lines.push("");
    if (item.details.length > 0) {
      lines.push("### Highlights");
      lines.push("");
      for (const detail of item.details) {
        lines.push(`- ${detail}`);
      }
      lines.push("");
    }
  }

  return lines.join("\n").trim();
}

function toContactMarkdown() {
  return [
    "# Contact",
    "",
    "If you'd like to talk about backend engineering, AI systems, research, or a product idea, reach out here:",
    "",
    `- Email: [${portfolio.meta.email}](mailto:${portfolio.meta.email})`,
    `- LinkedIn: [${portfolio.meta.linkedin}](${portfolio.meta.linkedin})`,
    `- GitHub: [${portfolio.meta.githubDirect}](${portfolio.meta.githubDirect})`,
    `- X: [${portfolio.meta.x}](${portfolio.meta.x})`,
    `- Location: ${portfolio.meta.location}`,
    "",
    "I’m open to thoughtful conversations, collaborations, and interesting technical problems.",
  ].join("\n");
}

function welcomeMarkdown() {
  return [
    `# Hi, I'm ${portfolio.meta.name}`,
    "",
    "I build backend systems, AI products, and research-driven software. I care about clear thinking, durable engineering, and work that holds up in production.",
    "",
    "Take a look at my portfolio:",
    "",
    "- [who-i-am.md](workspace:about/who-i-am.md)",
    "- [experience.md](workspace:about/experience.md)",
    "- [contact.md](workspace:about/contact.md)",
    "- [projects](workspace:projects/index.md)",
    "- [blog](workspace:blog/index.md)",
  ].join("\n");
}

export function getExplorerTree(): ExplorerNode[] {
  return [
    {
      type: "folder",
      id: "folder-about",
      name: "about",
      defaultOpen: true,
      children: [
        {
          type: "file",
          id: "file-welcome",
          name: "welcome.md",
          fileId: "welcome.md",
        },
        {
          type: "file",
          id: "file-who-i-am",
          name: "who-i-am.md",
          fileId: "about/who-i-am.md",
        },
        {
          type: "file",
          id: "file-experience",
          name: "experience.md",
          fileId: "about/experience.md",
        },
        {
          type: "file",
          id: "file-contact",
          name: "contact.md",
          fileId: "about/contact.md",
        },
      ],
    },
    {
      type: "folder",
      id: "folder-projects",
      name: "projects",
      defaultOpen: true,
      children: [
        {
          type: "file",
          id: "file-projects-index",
          name: "index.md",
          fileId: "projects/index.md",
        },
        ...projectEntries.map((entry) => ({
          type: "file" as const,
          id: `file-project-${entry.slug}`,
          name: `${entry.slug}.md`,
          fileId: `projects/${entry.slug}.md`,
        })),
      ],
    },
    {
      type: "folder",
      id: "folder-blog",
      name: "blog",
      defaultOpen: false,
      children: [
        {
          type: "file",
          id: "file-blog-index",
          name: "index.md",
          fileId: "blog/index.md",
        },
        ...blogPosts.map((entry) => ({
          type: "file" as const,
          id: `file-blog-${entry.slug}`,
          name: `${entry.slug}.md`,
          fileId: `blog/${entry.slug}.md`,
        })),
      ],
    },
  ];
}

export function getFileDescriptor(fileId: string): FileDescriptor | undefined {
  if (fileId === "welcome.md") {
    return {
      fileId,
      title: "welcome.md",
      language: "markdown",
      load: async () => welcomeMarkdown(),
    };
  }

  if (fileId === "about/who-i-am.md") {
    return {
      fileId,
      title: "who-i-am.md",
      language: "markdown",
      load: async () => stripFrontmatter(whoIAmRaw),
    };
  }

  if (fileId === "about/experience.md") {
    return {
      fileId,
      title: "experience.md",
      language: "markdown",
      load: async () => toExperienceMarkdown(),
    };
  }

  if (fileId === "about/contact.md") {
    return {
      fileId,
      title: "contact.md",
      language: "markdown",
      load: async () => toContactMarkdown(),
    };
  }

  if (fileId === "projects/index.md") {
    return {
      fileId,
      title: "index.md",
      language: "markdown",
      load: async () => {
        const lines: string[] = [];
        lines.push("# Projects");
        lines.push("");
        lines.push("Open a project file:");
        lines.push("");
        for (const entry of projectEntries) {
          lines.push(
            `- **${entry.title}** — [${entry.slug}.md](workspace:projects/${entry.slug}.md)`
          );
        }
        return lines.join("\n");
      },
    };
  }

  if (fileId.startsWith("projects/") && fileId.endsWith(".md")) {
    const slug = fileId.replace(/^projects\//, "").replace(/\.md$/, "");
    const meta = projectEntries.find((entry) => entry.slug === slug);
    if (!meta) {
      return undefined;
    }
    return {
      fileId,
      title: `${meta.title}.md`,
      language: "markdown",
      load: async () => {
        const entry = await getProjectEntryBySlug(slug);
        if (!entry) {
          return `# Missing project\n\nCould not load \`${fileId}\`.`;
        }
        return entry.content;
      },
    };
  }

  if (fileId === "blog/index.md") {
    return {
      fileId,
      title: "index.md",
      language: "markdown",
      load: async () => {
        const lines: string[] = [];
        lines.push("# Blog");
        lines.push("");
        lines.push("Open a post file:");
        lines.push("");
        for (const entry of blogPosts) {
          lines.push(
            `- **${entry.title}** — [${entry.slug}.md](workspace:blog/${entry.slug}.md)`
          );
        }
        return lines.join("\n");
      },
    };
  }

  if (fileId.startsWith("blog/") && fileId.endsWith(".md")) {
    const slug = fileId.replace(/^blog\//, "").replace(/\.md$/, "");
    const meta = blogPosts.find((entry) => entry.slug === slug);
    if (!meta) {
      return undefined;
    }
    return {
      fileId,
      title: `${meta.title}.md`,
      language: "markdown",
      load: async () => {
        const entry = await getBlogPostBySlug(slug);
        if (!entry) {
          return `# Missing post\n\nCould not load \`${fileId}\`.`;
        }
        return entry.content;
      },
    };
  }

  return undefined;
}
