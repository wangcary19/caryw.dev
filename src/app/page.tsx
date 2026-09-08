import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/posts";

const links = [
  { label: "GitHub", href: "https://github.com/wangcary19" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/carywang" },
  { label: "Email", href: "mailto:wangcary19@gmail.com" },
  { label: "Writing", href: "/blog" },
  { label: "Resume", href: "/resume.pdf" },
];

export default function Home() {
  const posts = getAllPosts().slice(0, 5);

  return (
    <main className="mx-auto max-w-2xl px-6 py-20 sm:py-28">
      <header>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Cary Wang
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-blue-100/85">
          Software engineer. I like building useful, durable things for the
          web. This is where I keep my writing and the links people usually
          ask for.
        </p>

        <nav className="mt-8 flex flex-wrap gap-3">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="rounded-full border border-blue-300/20 bg-blue-400/5 px-4 py-2 text-sm font-medium text-blue-100 transition hover:border-blue-300/50 hover:bg-blue-400/15"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </header>

      <section className="mt-20">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-blue-200/60">
            Recent writing
          </h2>
          <Link
            href="/blog"
            className="text-sm text-blue-300 hover:text-blue-100"
          >
            All posts →
          </Link>
        </div>

        <ul className="mt-6 space-y-6">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-medium text-white group-hover:text-blue-200">
                    {post.title}
                  </h3>
                  {post.substack && (
                    <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-xs font-medium text-blue-300">
                      Substack
                    </span>
                  )}
                </div>
                <time className="mt-1 block text-sm text-blue-200/50">
                  {formatDate(post.date)}
                </time>
                {post.description && (
                  <p className="mt-2 text-blue-100/70">{post.description}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-24 border-t border-blue-300/10 pt-8 text-sm text-blue-200/40">
        © {new Date().getFullYear()} Cary Wang
      </footer>
    </main>
  );
}
