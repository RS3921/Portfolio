import { getPortfolio } from "@/lib/data";
import PortfolioView from "@/components/ReferencePortfolioView";
import "./reference-portfolio.css";
export const dynamic = "force-dynamic";
export default async function Home() { const data = await getPortfolio(); return <PortfolioView data={data} />; }
