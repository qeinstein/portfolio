import { describe, expect, it } from "vitest";

import {
  parseMarkdownFile,
  sortByDateDesc,
  sortByTitleAsc,
} from "../scripts/content-manifest-utils.mjs";

describe("content manifest utilities", () => {
  it("parses blog frontmatter with arrays and source paths", () => {
    const entry = parseMarkdownFile(
      `---
title: Example Post
date: 2026-04-03
excerpt: Example excerpt
published: true
tags:
  - systems
  - ai
---

# Example
`,
      "blog",
      "content/blog/example-post.md"
    );

    expect(entry).toMatchObject({
      slug: "example-post",
      title: "Example Post",
      date: "2026-04-03",
      excerpt: "Example excerpt",
      published: true,
      tags: ["systems", "ai"],
      sourcePath: "/content/blog/example-post.md",
    });
  });

  it("parses project frontmatter and preserves optional links", () => {
    const entry = parseMarkdownFile(
      `---
title: Example Project
excerpt: Project summary
published: true
tags: [go, systems]
stack: [Go, Docker]
role: Founder
status: Active
link: https://example.com
repo: https://github.com/example/project
---
`,
      "project",
      "content/projects/example-project.md"
    );

    expect(entry).toMatchObject({
      slug: "example-project",
      title: "Example Project",
      tags: ["go", "systems"],
      stack: ["Go", "Docker"],
      role: "Founder",
      status: "Active",
      link: "https://example.com",
      repo: "https://github.com/example/project",
    });
  });

  it("sorts blog entries by newest date first", () => {
    const entries = [
      { date: "2026-01-01" },
      { date: "2026-05-01" },
      { date: "2026-03-01" },
    ];

    expect(entries.sort(sortByDateDesc)).toEqual([
      { date: "2026-05-01" },
      { date: "2026-03-01" },
      { date: "2026-01-01" },
    ]);
  });

  it("sorts project entries by title ascending", () => {
    const entries = [{ title: "Velarix" }, { title: "Delta" }, { title: "MCP" }];

    expect(entries.sort(sortByTitleAsc)).toEqual([
      { title: "Delta" },
      { title: "MCP" },
      { title: "Velarix" },
    ]);
  });
});
