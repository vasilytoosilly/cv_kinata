import { getPortfolioData } from "@/lib/supabase";
import defaultPortfolio from "@/../data/portfolio.json";
import HomeClient from "@/components/HomeClient";

export default async function Home() {
  let portfolio = defaultPortfolio;
  try {
    const data = await getPortfolioData();
    if (data) {
      portfolio = data;
    }
  } catch (err) {
    console.error("Failed to load portfolio data on server:", err);
  }

  return <HomeClient initialPortfolio={portfolio} />;
}
