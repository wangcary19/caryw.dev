"use client";

import { useState } from "react";
import type { ComponentType, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { GitHubIcon, LinkedInIcon, MailIcon, SubstackIcon } from "./icons";
import type { IconProps } from "./icons";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/types";

const socialLinks: {
  label: string;
  href: string;
  Icon: ComponentType<IconProps>;
}[] = [
  { label: "GitHub", href: "https://github.com/wangcary19", Icon: GitHubIcon },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/carywang/",
    Icon: LinkedInIcon,
  },
  { label: "Email", href: "mailto:wangcary19@gmail.com", Icon: MailIcon },
  {
    label: "Substack",
    href: "https://wangcary.substack.com/",
    Icon: SubstackIcon,
  },
];

type View = "home" | "writing";

export default function Site({ posts }: { posts: Post[] }) {
  const [view, setView] = useState<View>("home");
  const [selected, setSelected] = useState(posts[0]?.slug ?? "");

  const current = posts.find((p) => p.slug === selected) ?? posts[0];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-blue-300/10 bg-[#08111f]/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <button
            onClick={() => setView("home")}
            className="text-base font-semibold tracking-tight text-white"
          >
            Cary Wang
          </button>
          <nav className="flex items-center gap-1 rounded-full border border-blue-300/15 bg-blue-400/5 p-1">
            <TabButton active={view === "home"} onClick={() => setView("home")}>
              Home
            </TabButton>
            <TabButton
              active={view === "writing"}
              onClick={() => setView("writing")}
            >
              Writing
            </TabButton>
          </nav>
        </div>
      </header>

      {view === "home" ? (
        <HomeView />
      ) : (
        <WritingView posts={posts} current={current} onSelect={setSelected} />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-blue-400/20 text-white"
          : "text-blue-200/60 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function HomeView() {
  return (
    <main className="animate-view mx-auto flex max-w-2xl flex-col px-6 py-24 sm:py-32">
      <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        ✌️ Hi · 你好 · Salut · 今日は
      </h1>
      <p className="mt-6 text-lg leading-8 text-blue-100/85">
        I’m Cary “Cart” Wang, a developer from New York City with a love for
        languages both computer and human. When not tinkering with code, I can
        be found in the great outdoors.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        {socialLinks.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            aria-label={label}
            title={label}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-300/20 bg-blue-400/5 text-blue-100 transition hover:border-blue-300/50 hover:bg-blue-400/15 hover:text-white"
          >
            <Icon className="h-5 w-5" />
          </a>
        ))}
      </div>
    </main>
  );
}

function WritingView({
  posts,
  current,
  onSelect,
}: {
  posts: Post[];
  current: Post | undefined;
  onSelect: (slug: string) => void;
}) {
  return (
    <div className="animate-view mx-auto flex max-w-5xl flex-col px-6 pt-10 md:flex-row md:gap-10">
      <aside className="md:w-72 md:shrink-0 md:border-r md:border-blue-300/10 md:pr-6">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-blue-200/60">
          Articles
        </h2>
        <ul className="mt-4 flex gap-2 overflow-x-auto pb-2 md:flex-col md:gap-0 md:overflow-x-visible md:pb-0">
          {posts.map((post) => {
            const active = post.slug === current?.slug;
            return (
              <li
                key={post.slug}
                className="md:border-b md:border-blue-300/5 md:last:border-0"
              >
                <button
                  onClick={() => onSelect(post.slug)}
                  className={`w-full rounded-lg px-3 py-3 text-left transition md:rounded-none md:px-0 ${
                    active
                      ? "bg-blue-400/10 text-white md:bg-transparent"
                      : "text-blue-200/70 hover:text-white"
                  }`}
                >
                  <span
                    className={`block text-sm font-medium ${
                      active ? "text-blue-100" : ""
                    }`}
                  >
                    {post.title}
                  </span>
                  <time className="mt-0.5 block text-xs text-blue-200/40">
                    {formatDate(post.date)}
                  </time>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <article
        key={current?.slug}
        className="animate-view mt-8 min-w-0 flex-1 pb-24 md:mt-0"
      >
        {current && (
          <>
            <header className="mb-8">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {current.title}
              </h1>
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
            </header>
            <div className="article">
              <ReactMarkdown>{current.content}</ReactMarkdown>
            </div>
          </>
        )}
      </article>
    </div>
  );
}
