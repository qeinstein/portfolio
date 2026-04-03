# Portfolio Content Guide

This portfolio is a Vite + React site that renders project case studies and blog posts from Markdown files in `content/`.

## Content Locations

- Blog posts: `content/blog/*.md`
- Projects: `content/projects/*.md`

The site generates a content manifest from these files before dev/build/test, then renders the body with `react-markdown`.

## Frontmatter Rules

The repo now uses a real frontmatter parser during content-manifest generation, so standard YAML-style frontmatter works.

Recommended rules:

- Start frontmatter with `---`
- End frontmatter with `---`
- Keep required fields present
- Arrays can be inline or multiline
- Strings can be quoted or unquoted
- Keep the frontmatter flat unless the app is updated to read nested fields

After editing content, run `npm run generate:content` or just run `npm run build`, `npm run dev`, or `npm run test`, which all regenerate the manifest automatically.

## Blog Post Template

Use this for files in `content/blog/`:

```md
---
title: My Blog Title
date: 2026-04-03
excerpt: A short summary for the blog list and SEO description.
published: true
tags: [systems, ai, notes]
---

# My Blog Title

Start with a clear opening paragraph that explains what the post is about.

## Why it matters

Explain the motivation in simple terms.

- Keep paragraphs short
- Use bullets when they make scanning easier
- Prefer concrete examples over vague claims

## Example snippet

```go
func main() {
    println("hello")
}
```

## Closing

End with the main takeaway.
```

## Project Template

Use this for files in `content/projects/`:

```md
---
title: Project Name
excerpt: One-sentence summary shown on the homepage and project header.
published: true
tags: [go, distributed-systems, ai]
stack: [Go, PostgreSQL, Docker]
role: Founder / Engineer / Builder
status: Active build
link: "https://example.com"
repo: "https://github.com/username/repo"
---

# Project Name

Open with a concise explanation of what the project is and why it exists.

## What it does

Describe the core behavior in plain language.

- main capability
- second capability
- third capability

## How it is built

Mention the important code paths or architecture decisions.

```ts
export function createServer() {
  return new Server();
}
```

## Repository

- GitHub: [github.com/username/repo](https://github.com/username/repo)

## Takeaway

Summarize the project in one strong closing paragraph.
```

## Writing Style

- Write for humans first, not for recruiters only
- Explain what the project does before discussing abstractions
- Use code snippets only when they help
- Keep excerpts short and descriptive
- Prefer strong nouns and verbs over buzzwords

## Publishing Checklist

1. Add the Markdown file in the correct `content/` folder.
2. Set `published: true`.
3. Make sure `title`, `excerpt`, and `tags` are present.
4. For projects, include `stack`, `role`, `status`, and `repo` when available.
5. Run `npm run build` to confirm the content parses correctly.

## Images In Markdown

You can add normal standalone images like this:

```md
![Velarix dashboard](/images/velarix-dashboard.png "Velarix dashboard overview")
```

Recommended setup:

- Put image files in `public/images/`
- Reference them as `/images/your-file.png`
- Use the image `title` as the caption text

### Gallery Pattern

If you place multiple images in the same paragraph, the site will render them as a gallery.

```md
![Dashboard](/images/velarix-1.png "Dashboard")
![Graph View](/images/velarix-2.png "Graph view")
```

Behavior:

- 1 image: full-width framed image
- 2 images: 2-column gallery on desktop
- 3 images: 3-column gallery on desktop
- mobile: stacked vertically
