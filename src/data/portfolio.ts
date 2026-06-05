import raw from "./portfolioData.json";
import type { PortfolioData } from "../types/portfolio";

// JSON inference produces a union of per-project `technologies` shapes with
// optional keys, which doesn't satisfy Record<string, string[]> structurally -
// hence the double assertion.
export const portfolioData = raw as unknown as PortfolioData;
