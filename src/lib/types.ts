export interface Post {
  slug: string;
  title: string;
  date: string; // ISO date, e.g. "2026-01-15"
  description?: string;
  substack?: string; // optional link to the original Substack post
  content: string; // raw markdown body
}

export function formatDate(date: string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
