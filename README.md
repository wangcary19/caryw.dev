# carywang.com

Personal website — self-introduction, icon links, and a text blog, deployed on
Vercel's free tier.

Built with [Next.js](https://nextjs.org) (App Router) and Tailwind CSS. It's a
single wide page: a short intro with icon links, then a list of article cards
that expand inline to the right. The background is a holographic gradient of
drifting color blobs that slowly cycles hue.

## Running locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Writing / Substack import

Posts are Markdown files in `content/posts/`. To pull posts from Substack:

```bash
node scripts/import-substack.mjs
```

This fetches the RSS feed at `https://wangcary.substack.com/feed` and converts
each post into a `.md` file (edit `FEED_URL` in the script to change the
source). Each post links back to its Substack original via the `substack:`
frontmatter field, which renders a "Read on Substack →" button.

## Background

A pure-CSS holographic background (`src/components/LiveBackground.tsx` + the
`.holo-*` styles in `src/app/globals.css`): a dark base with three blurred
blue/cyan/violet blobs that drift slowly and cycle hue. No images or WebGL —
very light on the CPU/GPU.

## Deploying

1. Push this repo to GitHub.
2. On Vercel: **Add New → Project → Import** this repo.
3. Framework auto-detects as Next.js — click **Deploy**.

## Customizing

- **Intro + links** — edit `src/app/page.tsx`.
- **Article cards / reading pane** — edit `src/components/WritingSection.tsx`.
- **Background** — edit `src/components/LiveBackground.tsx` and the `.holo-*`
  styles in `src/app/globals.css`.
- **Corner-frame button style + typography** — edit `src/app/globals.css`.
- **Favicon** — replace `src/app/icon.png`.
- **Site title / meta** — edit `src/app/layout.tsx`.
