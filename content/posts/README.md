# Posts

Each blog post is a Markdown file in this folder. The filename (minus `.md`)
becomes the URL slug: `hello-world.md` → `/blog/hello-world`.

## Frontmatter

```yaml
---
title: "Post title"
date: "2026-01-15"        # ISO date — used for sorting and grouping by year
description: "One-line summary shown in lists"
substack: "https://..."    # optional — links this post to its Substack original
---
```

- `title` and `date` are required.
- `description` is optional and shows up in post lists.
- `substack` is optional. When present, the post gets a "Substack" badge in
  lists and a "Read on Substack →" button on the post page.

## Adding a post

1. Drop a `.md` file here with the frontmatter above.
2. Commit and push — Vercel rebuilds automatically.

## Importing from Substack

Substack exposes a public RSS feed at `https://<your-subdomain>.substack.com/feed`.
For a simple text archive, paste the post body into a Markdown file and set the
`substack` frontmatter field to the original URL. (Auto-importing the feed at
build time can be added later if you want full automation.)
