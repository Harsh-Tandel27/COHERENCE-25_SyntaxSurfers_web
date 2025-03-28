import AnalyticsChart from "@/components/analytics-chart";
import CityAnalytics from "@/components/city-analytics";
import DashboardStats from "@/components/dashboard-stats";
import { Card } from "@/components/ui/card";
import WeatherOverview from "@/components/weather-overview";

export default function Home() {
  return (
    <main className="container py-6 space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <DashboardStats />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <WeatherOverview />
        </Card>
        <Card className="p-6">
          <CityAnalytics />
        </Card>
      </div>

      <Card className="p-6">
        <AnalyticsChart />
      </Card>
    </main>
  );
}
