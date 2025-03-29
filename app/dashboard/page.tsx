"use client";

import AnalyticsChart from "@/components/analytics-chart";
import CityAnalytics from "@/components/city-analytics";
import DashboardStats from "@/components/dashboard-stats";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import WeatherAlert from "@/components/weather-overview";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [city, setCity] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryCity = params.get("city");
    if (queryCity) {
      setCity(queryCity);
    }
  }, [searchQuery]);

  const handleSearch = (event: any) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      router.push(`?city=${searchQuery.trim()}`);
      setCity(searchQuery.trim());
    }
  };

  return (
    <main className="px-6 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Weather Analytics</h1>
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Button type="submit">Search</Button>
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <DashboardStats city={city} />
      </div>

      <div className="grid gap-6 grid-cols-12">
        <Card className="p-6 col-span-12 md:col-span-3">
          <WeatherAlert />
        </Card>
        <Card className="p-6 col-span-12 md:col-span-9">
          <CityAnalytics city={city} />
        </Card>
      </div>

      <Card className="p-6">
        <AnalyticsChart city={city} />
      </Card>
    </main>
  );
}
