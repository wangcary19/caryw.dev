# carywang.com

Personal website — self-introduction, portfolio links, and a text blog.

Built with [Next.js](https://nextjs.org) (App Router) and Tailwind CSS, deployed
on [Vercel](https://vercel.com). The background is a dynamic blue "haze" that
follows the cursor and shifts shade with horizontal position (see
`src/components/BlueHaze.tsx`).

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Writing posts

Posts live in `content/posts/` as Markdown files. See `content/posts/README.md`
for the frontmatter format and how to link a post to Substack.

## Deploying

1. Push this repo to GitHub (already done).
2. On Vercel: **Add New → Project → Import** this repo.
3. Framework auto-detects as Next.js — click **Deploy**.

Every push to `main` then deploys automatically.

## Customizing

- **Intro + links** — edit `src/app/page.tsx`.
- **Site title / meta** — edit `src/app/layout.tsx`.
- **Background colors** — edit `src/components/BlueHaze.tsx` (gradients) and
  `src/app/globals.css` (base colors + typography).
- **Resume** — drop `resume.pdf` into `public/` (the home page links to
  `/resume.pdf`).
