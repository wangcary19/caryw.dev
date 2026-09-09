import { NextResponse } from "next/server";

/**
 * Analytics endpoint. Receives visitor metadata and logs it via stdout, which
 * Vercel surfaces in the project's Runtime Logs (Functions → runtime logs).
 */
export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    // ignore malformed bodies
  }

  const entry = {
    time: new Date().toISOString(),
    ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: req.headers.get("user-agent") ?? null,
    language: req.headers.get("accept-language") ?? null,
    referer: req.headers.get("referer") ?? null,
    ...body,
  };

  console.log("[track]", JSON.stringify(entry));

  return NextResponse.json({ ok: true });
}
