import { getAllPosts } from "@/lib/posts";
import Site from "@/components/Site";

export default function Home() {
  const posts = getAllPosts();
  return <Site posts={posts} />;
}
