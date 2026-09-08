# carywang.com

Personal website — self-introduction, icon links, and a text blog, deployed on
Vercel's free tier.

Built with [Next.js](https://nextjs.org) (App Router) and Tailwind CSS. It's a
single wide page: a short intro with icon links, then a list of article cards
that expand inline to the right. The background is a high-resolution "live
wallpaper" with slow motion and a blur-when-reading effect.

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

`public/background.jpg` (3840×2160) is shown full-screen with a slow Ken Burns
pan/zoom (`src/components/LiveBackground.tsx`). Motion pauses when the tab is
hidden or the user is idle, and the image blurs when an article is expanded.

- **Image:** "Svitjordbreen on Svalbard calving" — photo by
  [AWeith](https://commons.wikimedia.org/wiki/User:AWeith),
  [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), via
  Wikimedia Commons.

To change the background, replace `public/background.jpg` (keep the filename).

## Deploying

1. Push this repo to GitHub.
2. On Vercel: **Add New → Project → Import** this repo.
3. Framework auto-detects as Next.js — click **Deploy**.

## Customizing

- **Intro + links** — edit `src/app/page.tsx`.
- **Article cards / reading pane** — edit `src/components/WritingSection.tsx`.
- **Background + motion** — edit `src/components/LiveBackground.tsx` and the
  `.live-bg*` styles in `src/app/globals.css`.
- **Corner-frame button style + typography** — edit `src/app/globals.css`.
- **Favicon** — replace `src/app/icon.png`.
- **Site title / meta** — edit `src/app/layout.tsx`.
