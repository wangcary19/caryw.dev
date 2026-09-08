import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import { getAllPosts, getPost, formatDate } from "@/lib/posts";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: `${post.title} — Cary Wang`, description: post.description };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <Link href="/blog" className="text-sm text-blue-300 hover:text-blue-100">
        ← Writing
      </Link>

      <article className="mt-8">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {post.title}
          </h1>
          <time className="mt-3 block text-sm text-blue-200/50">
            {formatDate(post.date)}
          </time>
          {post.substack && (
            <a
              href={post.substack}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-full border border-blue-300/25 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-200 transition hover:bg-blue-400/20"
            >
              Read on Substack →
            </a>
          )}
        </header>

        <div className="article">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>

      <div className="mt-16">
        <Link href="/blog" className="text-sm text-blue-300 hover:text-blue-100">
          ← All writing
        </Link>
      </div>
    </main>
  );
}
