import { PortfolioProgressPage } from "@/components/portfolio-progress-page";
import { RouteGuard } from "@/components/route-guard";

export default function PortfolioPage() {
  return (
    <RouteGuard>
      <PortfolioProgressPage />
    </RouteGuard>
  );
}
