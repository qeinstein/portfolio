import fs from "node:fs/promises";
import path from "node:path";

import {
  parseMarkdownFile,
  sortByDateDesc,
  sortByTitleAsc,
} from "./content-manifest-utils.mjs";

const rootDir = process.cwd();
const generatedDir = path.join(rootDir, "generated");
const outputPath = path.join(generatedDir, "content-manifest.json");

async function readContentDirectory(dirName, type) {
  const absoluteDir = path.join(rootDir, "content", dirName);
  const filenames = (await fs.readdir(absoluteDir))
    .filter((file) => file.endsWith(".md"))
    .sort();

  const entries = await Promise.all(
    filenames.map(async (filename) => {
      const absolutePath = path.join(absoluteDir, filename);
      const relativePath = path.relative(rootDir, absolutePath);
      const raw = await fs.readFile(absolutePath, "utf8");
      return parseMarkdownFile(raw, type, relativePath);
    })
  );

  return entries.filter((entry) => entry.published);
}

async function generateManifest() {
  const [blogPosts, projectEntries] = await Promise.all([
    readContentDirectory("blog", "blog"),
    readContentDirectory("projects", "project"),
  ]);

  const manifest = {
    blogPosts: blogPosts.sort(sortByDateDesc),
    projectEntries: projectEntries.sort(sortByTitleAsc),
  };

  await fs.mkdir(generatedDir, { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

generateManifest().catch((error) => {
  console.error("Failed to generate content manifest.");
  console.error(error);
  process.exit(1);
});
