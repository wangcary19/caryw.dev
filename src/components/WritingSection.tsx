"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/types";

export default function WritingSection({ posts }: { posts: Post[] }) {
  const [current, setCurrent] = useState<Post | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openPost = (post: Post) => {
    setCurrent(post);
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <button
            key={post.slug}
            type="button"
            onClick={() => openPost(post)}
            className="group rounded-2xl border border-blue-300/15 bg-blue-400/5 p-6 text-left transition hover:-translate-y-0.5 hover:border-blue-300/40 hover:bg-blue-400/10"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold leading-snug tracking-tight text-white group-hover:text-blue-100">
                {post.title}
              </h3>
              {post.substack && (
                <span className="shrink-0 rounded-full bg-blue-500/15 px-2 py-0.5 text-xs font-medium text-blue-300">
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
            <span className="mt-5 inline-block text-sm font-medium text-blue-300 transition group-hover:text-blue-100">
              Read →
            </span>
          </button>
        ))}
      </div>

      {/* Backdrop */}
      <div
        onClick={close}
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Right pane */}
      <aside
        aria-hidden={!isOpen}
        className={`fixed inset-y-0 right-0 z-40 flex w-full max-w-2xl flex-col border-l border-blue-300/15 bg-[#0a1526]/95 backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {current && (
          <>
            <div className="flex items-center justify-between border-b border-blue-300/10 px-6 py-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-200/60">
                Article
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="Close article"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-300/15 text-blue-200/70 transition hover:bg-blue-400/10 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-8 sm:px-8">
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {current.title}
              </h2>
              <time className="mt-2 block text-sm text-blue-200/50">
                {formatDate(current.date)}
              </time>
              {current.substack && (
                <a
                  href={current.substack}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block rounded-full border border-blue-300/25 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-200 transition hover:bg-blue-400/20"
                >
                  Read on Substack →
                </a>
              )}
              <div className="article mt-6">
                <ReactMarkdown>{current.content}</ReactMarkdown>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
