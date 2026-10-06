import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { initialPortfolio } from "../src/lib/portfolio";
const prisma = new PrismaClient();
async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 12) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (12+ chars) before seeding.");
  await prisma.adminUser.upsert({ where: { email }, update: {}, create: { email, passwordHash: await bcrypt.hash(password, 12) } });
  await prisma.portfolio.upsert({ where: { id: "main" }, update: {}, create: { id: "main", content: JSON.parse(JSON.stringify(initialPortfolio)) } });
}
main().finally(() => prisma.$disconnect());
