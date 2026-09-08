# carywang.com

Personal website — self-introduction, icon links, and a text blog, deployed on
Vercel's free tier.

Built with [Next.js](https://nextjs.org) (App Router) and Tailwind CSS. The
background is a dynamic blue "haze" that follows the cursor (see
`src/components/BlueHaze.tsx`). The site is a single page with two animated
views: **Home** and **Writing** (a two-pane reader with the article list on the
left and the text on the right).

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

## Deploying

1. Push this repo to GitHub.
2. On Vercel: **Add New → Project → Import** this repo.
3. Framework auto-detects as Next.js — click **Deploy**.

## Customizing

- **Intro + links** — edit `src/components/Site.tsx`.
- **Background colors** — edit `src/components/BlueHaze.tsx` (gradients) and
  `src/app/globals.css` (base colors + typography).
- **Favicon** — replace `src/app/icon.png`.
- **Site title / meta** — edit `src/app/layout.tsx`.
