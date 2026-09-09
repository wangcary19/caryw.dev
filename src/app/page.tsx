import { getAllPosts } from "@/lib/posts";
import WritingSection from "@/components/WritingSection";
import ProfileButtons from "@/components/ProfileButtons";

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
          Hi · 你好 · Salut · 今日は. I’m Cary “Cart” Wang, a developer based in NYC
          with a love for languages both computer and human. When not tinkering
          with code, I’m in the great outdoors, making music, or writing poems.
          <span className="terminal-cursor" aria-hidden="true" />
        </p>

        <ProfileButtons />
      </section>

      <section className="mt-10">
        <WritingSection posts={posts} />
      </section>
    </main>
  );
}
