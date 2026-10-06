import { db } from "@/lib/db";
import { initialPortfolio, PortfolioData } from "@/lib/portfolio";
export async function getPortfolio(): Promise<PortfolioData> {
  try { const item = await db.portfolio.findUnique({ where: { id: "main" } }); return (item?.content as unknown as PortfolioData) ?? initialPortfolio; }
  catch { return initialPortfolio; }
}
