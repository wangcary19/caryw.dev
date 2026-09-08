// Imports posts from a Substack RSS feed into content/posts/ as Markdown.
// Usage: node scripts/import-substack.mjs
// Edit FEED_URL to point at your Substack. Safe to re-run (overwrites by slug).

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import TurndownService from "turndown";
import { XMLParser } from "fast-xml-parser";

const FEED_URL = "https://wangcary.substack.com/feed";
const OUT_DIR = path.join(process.cwd(), "content", "posts");

function stripHtml(str) {
  return (str || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Removes Substack's injected subscription CTAs and share boilerplate.
function cleanBoilerplate(md) {
  return md
    .split("\n")
    .filter((line) => {
      const t = line.trim();
      if (/Thanks for reading .*Substack/i.test(t)) return false;
      if (/Subscribe for free/i.test(t)) return false;
      if (/Share this post/i.test(t)) return false;
      return true;
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function cdata(node) {
  if (node == null) return "";
  if (typeof node === "string") return node;
  return node.__cdata ?? "";
}

async function main() {
  const res = await fetch(FEED_URL);
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  const xml = await res.text();

  const parser = new XMLParser({ cdataPropName: "__cdata", trimValues: false });
  const doc = parser.parse(xml);
  const rawItems = doc?.rss?.channel?.item ?? [];
  const items = Array.isArray(rawItems) ? rawItems : [rawItems];

  const td = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });

  for (const it of items) {
    const title = cdata(it.title).trim();
    const link = (it.link || "").trim();
    const pubDate = (it.pubDate || "").trim();
    const bodyHtml = cdata(it["content:encoded"]);
    const desc = stripHtml(cdata(it.description)).slice(0, 200);

    let bodyMd = cleanBoilerplate(td.turndown(bodyHtml));

    const slug = link.split("/").filter(Boolean).pop() || "post";
    const d = new Date(pubDate);
    const iso = Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);

    const frontmatter = [
      "---",
      `title: ${JSON.stringify(title)}`,
      `date: "${iso}"`,
      desc ? `description: ${JSON.stringify(desc)}` : "",
      link ? `substack: "${link}"` : "",
      "---",
    ]
      .filter(Boolean)
      .join("\n");

    mkdirSync(OUT_DIR, { recursive: true });
    const outPath = path.join(OUT_DIR, `${slug}.md`);
    writeFileSync(outPath, `${frontmatter}\n\n${bodyMd}\n`);
    console.log(`✓ wrote ${slug}.md (${bodyMd.length} chars)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
