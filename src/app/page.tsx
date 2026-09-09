import type { ComponentType } from "react";
import { getAllPosts } from "@/lib/posts";
import WritingSection from "@/components/WritingSection";
import {
  GitHubIcon,
  LinkedInIcon,
  SubstackIcon,
  DownloadIcon,
} from "@/components/icons";
import type { IconProps } from "@/components/icons";

const links: {
  label: string;
  href: string;
  Icon: ComponentType<IconProps>;
  download?: string;
}[] = [
  { label: "GitHub", href: "https://github.com/wangcary19", Icon: GitHubIcon },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/carywang/",
    Icon: LinkedInIcon,
  },
  {
    label: "Substack",
    href: "https://wangcary.substack.com/",
    Icon: SubstackIcon,
  },
  {
    label: "Resume",
    href: "/resume.pdf",
    Icon: DownloadIcon,
    download: "Cary-Wang-Resume.pdf",
  },
];

export default function Home() {
  const posts = getAllPosts();

  return (
    <main className="golden min-h-screen pb-24 pt-16 sm:pt-24">
      <section>
        <h1 className="text-3xl font-light leading-none text-white">
          <span aria-hidden="true">✌️</span>
          <span className="sr-only">Hi</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-white/90">
          Hi · 你好 · Salut · 今日は. I’m Cary “Cart” Wang, a developer from New
          York City with a love for languages both computer and human. When not
          tinkering with code, I can be found in the great outdoors.
          <span className="terminal-cursor" aria-hidden="true" />
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {links.map(({ label, href, Icon, download }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              download={download}
              aria-label={label}
              title={label}
              className="corner-frame corner-frame-sm flex h-11 w-11 items-center justify-center border border-blue-300/20 bg-blue-400/5 text-white/80 transition hover:border-blue-300/50 hover:bg-[#0c1a2f] hover:text-white"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <WritingSection posts={posts} />
      </section>
    </main>
  );
}
