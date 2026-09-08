import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface Post {
  slug: string;
  title: string;
  date: string; // ISO date, e.g. "2026-01-15"
  description?: string;
  substack?: string; // optional link to the original Substack post
  content: string; // raw markdown body
}

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
  const files = fs.readdirSync(postsDir).filter(
    (f) => f.endsWith(".md") && !f.toLowerCase().startsWith("readme"),
  );
  return files
    .map((f) => readPost(f.replace(/\.md$/, "")))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | undefined {
  try {
    return readPost(slug);
  } catch {
    return undefined;
  }
}

export function formatDate(date: string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function yearOf(date: string): string {
  const y = new Date(date).getFullYear();
  return Number.isNaN(y) ? "" : String(y);
}
