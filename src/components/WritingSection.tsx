"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/types";
import { useReading } from "./reading-context";

export default function WritingSection({ posts }: { posts: Post[] }) {
  const [current, setCurrent] = useState<Post | null>(null);
  const { setReading } = useReading();

  const select = (post: Post) => {
    const next = post.slug === current?.slug ? null : post;
    setCurrent(next);
    setReading(next !== null);
  };

  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
      {/* Vertical cards */}
      <div className="flex flex-col gap-4 lg:w-96 lg:shrink-0">
        {posts.map((post) => {
          const active = post.slug === current?.slug;
          return (
            <button
              key={post.slug}
              type="button"
              onClick={() => select(post)}
              className={`corner-frame group border p-6 text-left transition ${
                active
                  ? "border-blue-300/50 bg-blue-400/15"
                  : "border-blue-300/15 bg-blue-400/5 hover:border-blue-300/40 hover:bg-blue-400/10"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-light leading-snug tracking-tight text-white group-hover:text-blue-100">
                  {post.title}
                </h3>
                {post.substack && (
                  <span className="shrink-0 border border-blue-300/20 bg-blue-500/15 px-2 py-0.5 text-xs font-normal text-blue-300">
                    Substack
                  </span>
                )}
              </div>
              <time className="mt-3 block text-sm text-blue-200/50">
                {formatDate(post.date)}
              </time>
              {post.description && (
                <p className="mt-3 text-sm leading-6 text-blue-100/70">
                  {post.description}
                </p>
              )}
              <span className="mt-5 inline-block text-sm font-normal text-blue-300 transition group-hover:text-blue-100">
                {active ? "Reading →" : "Read →"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Inline article, expanded to the right */}
      <div className="min-w-0 flex-1">
        {current ? (
          <article key={current.slug} className="animate-article">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-light tracking-tight text-white sm:text-3xl">
                {current.title}
              </h2>
              <button
                type="button"
                onClick={() => select(current)}
                aria-label="Close article"
                className="corner-frame corner-frame-sm flex h-9 w-9 shrink-0 items-center justify-center border border-blue-300/15 text-blue-200/70 transition hover:bg-blue-400/10 hover:text-white"
              >
                ✕
              </button>
            </div>
            <time className="mt-2 block text-sm text-blue-200/50">
              {formatDate(current.date)}
            </time>
            {current.substack && (
              <a
                href={current.substack}
                target="_blank"
                rel="noopener noreferrer"
                className="corner-frame corner-frame-sm mt-4 inline-block border border-blue-300/25 bg-blue-400/10 px-4 py-2 text-sm font-normal text-blue-200 transition hover:bg-blue-400/20"
              >
                Read on Substack →
              </a>
            )}
            <div className="article mt-6">
              <ReactMarkdown>{current.content}</ReactMarkdown>
            </div>
          </article>
        ) : (
          <div className="flex min-h-[200px] items-center justify-center border border-dashed border-blue-300/15 text-sm text-blue-200/40">
            Select an article to read
          </div>
        )}
      </div>
    </div>
  );
}
