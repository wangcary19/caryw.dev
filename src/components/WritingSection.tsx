"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/types";

export default function WritingSection({ posts }: { posts: Post[] }) {
  const [current, setCurrent] = useState<Post | null>(null);

  const select = (post: Post) =>
    setCurrent(post.slug === current?.slug ? null : post);

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
                  ? "border-blue-300/50 bg-[#0c1a2f]"
                  : "border-blue-300/15 bg-blue-400/5 hover:border-blue-300/40 hover:bg-[#0c1a2f]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-light leading-snug tracking-tight text-white group-hover:text-blue-100">
                  {post.title}
                </h3>
                {post.substack && (
                  <span className="shrink-0 border border-blue-300/20 bg-blue-500/15 px-2 py-0.5 text-xs font-normal text-blue-200">
                    Substack
                  </span>
                )}
              </div>
              <time className="mt-3 block text-sm text-white/45">
                {formatDate(post.date)}
              </time>
              {post.description && (
                <p className="mt-3 text-sm leading-6 text-white/70">
                  {post.description}
                </p>
              )}
              <span className="mt-5 inline-block text-sm font-normal text-white/70 transition group-hover:text-white">
                {active ? "Reading →" : "Read →"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Inline article, expanded to the right */}
      <div className="min-w-0 flex-1">
        {current ? (
          <article
            key={current.slug}
            className="animate-article corner-frame border border-blue-300/20 bg-[#0c1a2f] p-6 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-light tracking-tight text-white sm:text-3xl">
                {current.title}
              </h2>
              <button
                type="button"
                onClick={() => select(current)}
                aria-label="Close article"
                className="corner-frame corner-frame-sm flex h-9 w-9 shrink-0 items-center justify-center border border-blue-300/15 text-white/70 transition hover:bg-[#163451] hover:text-white"
              >
                ✕
              </button>
            </div>
            <time className="mt-2 block text-sm text-white/45">
              {formatDate(current.date)}
            </time>
            {current.substack && (
              <a
                href={current.substack}
                target="_blank"
                rel="noopener noreferrer"
                className="corner-frame corner-frame-sm mt-4 inline-block border border-blue-300/25 bg-blue-400/10 px-4 py-2 text-sm font-normal text-white/80 transition hover:bg-[#163451] hover:text-white"
              >
                Read on Substack →
              </a>
            )}
            <div className="article mt-6">
              <ReactMarkdown>{current.content}</ReactMarkdown>
            </div>
          </article>
        ) : (
          <div className="flex min-h-[200px] items-center justify-center border border-dashed border-blue-300/15 text-sm text-white/40">
            Select an article to read
          </div>
        )}
      </div>
    </div>
  );
}
