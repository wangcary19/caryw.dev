import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Post } from "./types";

const postsDir = path.join(process.cwd(), "content", "posts");

function readPost(slug: string): Post {
  const fullPath = path.join(postsDir, `${slug}.md`);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "",
    description: data.description,
    substack: data.substack,
    content,
  };
}

export function getAllPosts(): Post[] {
  const files = fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md") && !f.toLowerCase().startsWith("readme"));
  return files
    .map((f) => readPost(f.replace(/\.md$/, "")))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
