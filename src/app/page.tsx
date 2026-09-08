import type { ComponentType } from "react";
import ReactMarkdown from "react-markdown";
import { getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/types";
import {
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  SubstackIcon,
} from "@/components/icons";
import type { IconProps } from "@/components/icons";

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

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-blue-300/10 bg-[#08111f]/70 backdrop-blur-md">
        <div className="flex max-w-5xl items-center justify-between px-6 py-4 sm:px-10">
          <a href="#top" className="text-base font-semibold tracking-tight text-white">
            Cary Wang
          </a>
          <a
            href="#writing"
            className="rounded-full border border-blue-300/15 bg-blue-400/5 px-4 py-1.5 text-sm font-medium text-blue-100 transition hover:bg-blue-400/15"
          >
            Writing
          </a>
        </div>
      </header>

      <main className="max-w-5xl px-6 pb-24 pt-16 sm:px-10 sm:pt-24">
        <section id="top">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            ✌️ Hi · 你好 · Salut · 今日は
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100/85">
            I’m Cary “Cart” Wang, a developer from New York City with a love for
            languages both computer and human. When not tinkering with code, I
            can be found in the great outdoors.
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
        </section>

        <section id="writing" className="mt-24 scroll-mt-24">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-blue-200/60">
            Writing
          </h2>

          <div className="mt-6 divide-y divide-blue-300/10">
            {posts.map((post) => (
              <article key={post.slug} className="max-w-3xl py-10 first:pt-0">
                <h3 className="text-2xl font-semibold tracking-tight text-white">
                  {post.title}
                </h3>
                <time className="mt-2 block text-sm text-blue-200/50">
                  {formatDate(post.date)}
                </time>
                {post.substack && (
                  <a
                    href={post.substack}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm font-medium text-blue-300 hover:text-blue-100"
                  >
                    Read on Substack →
                  </a>
                )}
                <div className="article mt-6">
                  <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
