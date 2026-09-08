import Link from "next/link";
import { getAllPosts, formatDate, yearOf } from "@/lib/posts";

export default function Blog() {
  const posts = getAllPosts();
  const byYear = new Map<string, typeof posts>();
  for (const post of posts) {
    const y = yearOf(post.date) || "—";
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y)!.push(post);
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <header className="mb-12">
        <Link href="/" className="text-sm text-blue-300 hover:text-blue-100">
          ← Home
        </Link>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
          Writing
        </h1>
      </header>

      {[...byYear.entries()].map(([year, items]) => (
        <section key={year} className="mb-12">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-200/60">
            {year}
          </h2>
          <ul className="space-y-5">
            {items.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-medium text-white group-hover:text-blue-200">
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
                    <p className="mt-1 text-blue-100/70">{post.description}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <Link href="/" className="text-sm text-blue-300 hover:text-blue-100">
        ← Home
      </Link>
    </main>
  );
}
