import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
const hits = new Map<string, { n: number; t: number }>();
const schema = z.object({ name: z.string().trim().min(2).max(80), email: z.string().trim().email().max(254), message: z.string().trim().min(10).max(3000), website: z.string().max(0).optional() });
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local", now = Date.now(), prev = hits.get(ip);
  if (prev && prev.t > now - 60 * 60_000 && prev.n >= 5) return NextResponse.json({ error: "Please try again later." }, { status: 429 });
  if (req.headers.get("origin") && req.headers.get("origin") !== new URL(req.url).origin) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  let b; try { b = schema.parse(await req.json()); } catch { return NextResponse.json({ error: "Please check your name, email and message." }, { status: 400 }); }
  if (b.website) return NextResponse.json({ ok: true });
  await db.contactMessage.create({ data: { name: b.name, email: b.email.toLowerCase(), message: b.message } });
  hits.set(ip, { n: prev && prev.t > now - 60 * 60_000 ? prev.n + 1 : 1, t: now });
  return NextResponse.json({ ok: true });
}
