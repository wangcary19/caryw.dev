import type { ComponentType } from "react";
import { getAllPosts } from "@/lib/posts";
import WritingSection from "@/components/WritingSection";
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
    <main className="golden min-h-screen pb-24 pt-16 sm:pt-24">
      <section>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          ✌️ Hi · 你好 · Salut · 今日は
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100/85">
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
      </section>

      <section className="mt-24">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-blue-200/60">
          Writing
        </h2>
        <div className="mt-8">
          <WritingSection posts={posts} />
        </div>
      </section>
    </main>
  );
}
