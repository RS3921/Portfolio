import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
const attempts = new Map<string, { count: number; since: number }>();
const schema = z.object({ email: z.string().email().max(254), password: z.string().min(1).max(200) });
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now(); const hit = attempts.get(ip);
  if (hit && hit.since > now - 15 * 60_000 && hit.count >= 8) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  let body; try { body = schema.parse(await req.json()); } catch { return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 }); }
  const user = await db.adminUser.findUnique({ where: { email: body.email.toLowerCase() } });
  if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) { attempts.set(ip, { count: (hit?.since ?? 0) > now - 15 * 60_000 ? (hit?.count ?? 0) + 1 : 1, since: now }); return NextResponse.json({ error: "Invalid credentials." }, { status: 401 }); }
  attempts.delete(ip); await createSession(user.id, user.email);
  await db.auditLog.create({ data: { actorId: user.id, action: "LOGIN", detail: "Admin signed in" } });
  return NextResponse.json({ ok: true });
}
