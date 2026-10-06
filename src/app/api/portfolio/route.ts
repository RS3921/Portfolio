import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
const text = z.string().max(20000);
const schema = z.object({ content: z.object({
  profile: z.object({ name:text,title:text,location:text,email:z.string().email().max(254),phone:text,linkedin:text,github:text,tryhackme:text,shortBio:text,longBio:text,resume:text,portrait:text }).passthrough(),
  about: z.object({ introduction:text,goals:text,interests:z.array(text).max(100) }).passthrough(),
  skills: z.array(z.object({category:text,items:z.array(text).max(200)}).passthrough()).max(50),
  projects: z.array(z.object({title:text,subtitle:text,description:text,category:text,year:text,status:text,technologies:z.array(text).max(100),github:text.optional(),live:text.optional(),featured:z.boolean()}).passthrough()).max(200),
  experience: z.array(z.object({role:text,company:text,dates:text,description:z.array(text).max(100)}).passthrough()).max(100),
  education: z.array(z.object({degree:text,institution:text,dates:text,score:text.optional(),detail:text.optional()}).passthrough()).max(100),
  certifications: z.array(z.object({name:text,issuer:text,status:text.optional()}).passthrough()).max(200),
  achievements: z.array(z.object({title:text,detail:text,category:text}).passthrough()).max(200),
  competitions: z.array(z.object({event:text,result:text,detail:text,year:text}).passthrough()).max(200),
  leadership: z.array(z.object({role:text,organization:text,dates:text}).passthrough()).max(200),
  settings: z.object({heroRoles:z.array(text).max(30),heroStatement:text,accent:text,seoTitle:text,seoDescription:text}).passthrough()
}).passthrough() });
export async function PUT(req: NextRequest) {
  const session = await getSession(); if (!session?.sub) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (req.headers.get("origin") && req.headers.get("origin") !== new URL(req.url).origin) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  let body; try { body = schema.parse(await req.json()); } catch (error) { return NextResponse.json({ error: "Portfolio data is incomplete or has invalid field types. Review the required profile, sections and settings structure." }, { status: 400 }); }
  const value = JSON.parse(JSON.stringify(body.content));
  await db.portfolio.upsert({ where: { id: "main" }, update: { content: value }, create: { id: "main", content: value } });
  await db.auditLog.create({ data: { actorId: session.sub, action: "UPDATE_PORTFOLIO", detail: "Portfolio content updated" } });
  return NextResponse.json({ ok: true });
}
