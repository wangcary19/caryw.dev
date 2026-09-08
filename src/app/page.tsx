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
              className="corner-frame corner-frame-sm flex h-11 w-11 items-center justify-center border border-blue-300/20 bg-blue-400/5 text-white/80 transition hover:border-blue-300/50 hover:bg-blue-400/15 hover:text-white"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </section>

      <section className="mt-24">
        <h2 className="text-sm font-light uppercase tracking-widest text-white/50">
          Writing
        </h2>
        <div className="mt-8">
          <WritingSection posts={posts} />
        </div>
      </section>

      <footer className="mt-24 border-t border-white/10 pt-6 text-xs leading-6 text-white/40">
        Background:{" "}
        <a
          href="https://commons.wikimedia.org/wiki/File:Svitjordbreen_on_Svalbard_calving.jpg"
          className="text-blue-300 hover:text-blue-100"
          target="_blank"
          rel="noopener noreferrer"
        >
          “Svitjordbreen on Svalbard calving”
        </a>{" "}
        by{" "}
        <a
          href="https://commons.wikimedia.org/wiki/User:AWeith"
          className="text-blue-300 hover:text-blue-100"
          target="_blank"
          rel="noopener noreferrer"
        >
          AWeith
        </a>
        ,{" "}
        <a
          href="https://creativecommons.org/licenses/by-sa/4.0/"
          className="text-blue-300 hover:text-blue-100"
          target="_blank"
          rel="noopener noreferrer"
        >
          CC BY-SA 4.0
        </a>
        , via Wikimedia Commons.
      </footer>
    </main>
  );
}
