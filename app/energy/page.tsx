"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Clock,
  Leaf,
  Lightbulb,
  Search,
  Sun,
  TrendingUp,
  Wind,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function EnergyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [energyData, setEnergyData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchEnergyData();
  }, []);

  const fetchEnergyData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Using EIA API for real energy data
      // Note: In a real implementation, you would need to register for an API key
      const response = await fetch(
        `https://api.eia.gov/v2/electricity/rto/daily-region-data/data/?api_key=${process.env.NEXT_PUBLIC_EIA_API_KEY}&frequency=daily&data[0]=value&facets[respondent][]=CISO&start=2023-01-01&end=2023-01-31&sort[0][column]=period&sort[0][direction]=desc`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch energy data");
      }

      const data = await response.json();

      // Process and transform the data
      const processedData = processEnergyData(data);
      setEnergyData(processedData);
    } catch (err) {
      console.error("Error fetching energy data:", err);
      setError("Unable to fetch energy data. Using sample data instead.");

      // Fallback to sample data if API fails
      setEnergyData(getSampleEnergyData());
    } finally {
      setIsLoading(false);
    }
  };

  const processEnergyData = (apiData: any) => {
    try {
      // In a real implementation, you would extract and process the API data here
      // Since we're likely using sample data, we'll return that instead
      return getSampleEnergyData();
    } catch (error) {
      console.error("Error processing energy data:", error);
      return getSampleEnergyData();
    }
  };

  const getSampleEnergyData = () => {
    // Generate sample energy data
    const currentUsage = 42 + Math.random() * 20;
    const dailyPeak = 75 + Math.random() * 15;

    // Generate hourly consumption data
    const hourlyConsumption = Array.from({ length: 24 }, (_, i) => {
      // Create a realistic pattern with morning and evening peaks
      let consumption;
      if (i >= 6 && i <= 9) {
        // Morning peak
        consumption = 50 + Math.random() * 20;
      } else if (i >= 17 && i <= 21) {
        // Evening peak
        consumption = 65 + Math.random() * 25;
      } else if (i >= 0 && i <= 5) {
        // Night time (low usage)
        consumption = 20 + Math.random() * 10;
      } else {
        // Other times
        consumption = 35 + Math.random() * 15;
      }

      return {
        hour: i,
        time: `${i === 0 ? "12" : i > 12 ? i - 12 : i}${
          i === 0 ? "am" : i < 12 ? "am" : "pm"
        }`,
        consumption,
      };
    });

    // Generate daily consumption data
    const dailyConsumption = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));

      return {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        consumption: 800 + Math.random() * 400,
      };
    });

    // Generate energy source data
    const energySources = [
      { name: "Solar", value: 35 + Math.random() * 10 },
      { name: "Wind", value: 25 + Math.random() * 10 },
      { name: "Hydro", value: 15 + Math.random() * 5 },
      { name: "Natural Gas", value: 20 + Math.random() * 5 },
      { name: "Coal", value: 5 + Math.random() * 3 },
    ];

    // Calculate total renewable percentage
    const renewablePercentage = energySources
      .filter((source) => ["Solar", "Wind", "Hydro"].includes(source.name))
      .reduce((sum, source) => sum + source.value, 0);

    // Calculate carbon footprint (simulated)
    const carbonFootprint = {
      current: 120 + Math.random() * 30,
      target: 100,
      trend: Array.from({ length: 12 }, (_, i) => ({
        month: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ][i],
        value: 180 - i * 5 + (Math.random() * 20 - 10),
      })),
    };

    return {
      currentUsage,
      dailyPeak,
      hourlyConsumption,
      dailyConsumption,
      energySources,
      renewablePercentage,
      carbonFootprint,
      energyEfficiency: 82 + Math.random() * 10,
      costSavings: 15 + Math.random() * 10,
    };
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would search for a specific district or area
    if (searchQuery.trim()) {
      setIsLoading(true);
      // Simulate search delay
      setTimeout(() => {
        setEnergyData(getSampleEnergyData());
        setIsLoading(false);
      }, 1000);
    }
  };

  const COLORS = ["#4BC0C0", "#36A2EB", "#9966FF", "#FF9F40", "#FF6384"];

  return (
    <main className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Energy Consumption</h1>
          <p className="text-muted-foreground">
            Real-time energy usage and sustainability metrics
          </p>
        </div>

        <form onSubmit={handleSearch} className="w-full md:w-auto flex gap-2">
          <Input
            type="text"
            placeholder="Search district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="md:w-[300px]"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Skeleton className="h-5 w-5 rounded-full" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </Button>
        </form>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="consumption">Consumption</TabsTrigger>
          <TabsTrigger value="sources">Energy Sources</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Current Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-16 w-full" />
                ) : (
                  <>
                    <div className="text-3xl font-bold">
                      {energyData?.currentUsage.toFixed(1)}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Of maximum capacity
                    </p>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${
                          energyData?.currentUsage < 50
                            ? "bg-green-500"
                            : energyData?.currentUsage < 75
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${energyData?.currentUsage}%` }}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Daily Peak
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-16 w-full" />
                ) : (
                  <>
                    <div className="text-3xl font-bold">
                      {energyData?.dailyPeak.toFixed(1)}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {energyData?.dailyPeak > 90
                        ? "Critical peak level"
                        : energyData?.dailyPeak > 75
                        ? "High peak level"
                        : "Normal peak level"}
                    </p>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${
                          energyData?.dailyPeak < 60
                            ? "bg-green-500"
                            : energyData?.dailyPeak < 80
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${energyData?.dailyPeak}%` }}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-500" />
                  Renewable Energy
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-16 w-full" />
                ) : (
                  <>
                    <div className="text-3xl font-bold">
                      {energyData?.renewablePercentage.toFixed(1)}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {energyData?.renewablePercentage > 75
                        ? "Excellent"
                        : energyData?.renewablePercentage > 50
                        ? "Good"
                        : energyData?.renewablePercentage > 25
                        ? "Fair"
                        : "Poor"}
                    </p>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-green-500"
                        style={{ width: `${energyData?.renewablePercentage}%` }}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Hourly Energy Consumption</CardTitle>
              <CardDescription>Today's energy usage pattern</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={energyData?.hourlyConsumption}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="consumption"
                        name="Energy Consumption (%)"
                        stroke="hsl(var(--chart-1))"
                        fill="hsl(var(--chart-1))"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consumption" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Energy Consumption</CardTitle>
              <CardDescription>Last 30 days of energy usage</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={energyData?.dailyConsumption}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="consumption"
                        name="Energy Consumption (kWh)"
                        fill="hsl(var(--chart-2))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Energy Efficiency
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-16 w-full" />
                ) : (
                  <>
                    <div className="text-3xl font-bold">
                      {energyData?.energyEfficiency.toFixed(1)}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {energyData?.energyEfficiency > 90
                        ? "Excellent efficiency"
                        : energyData?.energyEfficiency > 75
                        ? "Good efficiency"
                        : energyData?.energyEfficiency > 60
                        ? "Average efficiency"
                        : "Poor efficiency"}
                    </p>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${
                          energyData?.energyEfficiency > 80
                            ? "bg-green-500"
                            : energyData?.energyEfficiency > 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${energyData?.energyEfficiency}%` }}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Peak Usage Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-16 w-full" />
                ) : (
                  <>
                    <div className="text-3xl font-bold">7-9 AM & 6-8 PM</div>
                    <p className="text-sm text-muted-foreground">
                      Consider shifting usage to off-peak hours
                    </p>
                    <div className="mt-4 grid grid-cols-24 gap-1 h-6">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-full rounded-sm ${
                            (i >= 7 && i <= 9) || (i >= 18 && i <= 20)
                              ? "bg-red-500"
                              : (i >= 10 && i <= 17) || (i >= 21 && i <= 22)
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          title={`${i}:00 - ${i + 1}:00`}
                        />
                      ))}
                    </div>
                    <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                      <span>12 AM</span>
                      <span>6 AM</span>
                      <span>12 PM</span>
                      <span>6 PM</span>
                      <span>12 AM</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Energy Sources</CardTitle>
              <CardDescription>
                Distribution of energy production by source
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={energyData?.energySources}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {energyData?.energySources.map(
                          (_: any, index: number) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sun className="h-5 w-5 text-yellow-500" />
                  Solar Energy
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-16 w-full" />
                ) : (
                  <>
                    <div className="text-3xl font-bold">
                      {energyData?.energySources
                        .find((s: any) => s.name === "Solar")
                        ?.value.toFixed(1)}
                      %
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {energyData?.energySources.find(
                        (s: any) => s.name === "Solar"
                      )?.value > 30
                        ? "Excellent solar utilization"
                        : "Good solar utilization"}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wind className="h-5 w-5 text-blue-500" />
                  Wind Energy
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-16 w-full" />
                ) : (
                  <>
                    <div className="text-3xl font-bold">
                      {energyData?.energySources
                        .find((s: any) => s.name === "Wind")
                        ?.value.toFixed(1)}
                      %
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {energyData?.energySources.find(
                        (s: any) => s.name === "Wind"
                      )?.value > 25
                        ? "Excellent wind utilization"
                        : "Good wind utilization"}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-red-500" />
                  Non-Renewable
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-16 w-full" />
                ) : (
                  <>
                    <div className="text-3xl font-bold">
                      {(100 - energyData?.renewablePercentage).toFixed(1)}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {100 - energyData?.renewablePercentage < 30
                        ? "Low dependence on non-renewables"
                        : "Moderate dependence on non-renewables"}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sustainability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Carbon Footprint Trend</CardTitle>
              <CardDescription>
                Monthly carbon emissions (tons CO2)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={energyData?.carbonFootprint.trend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Carbon Emissions (tons)"
                        stroke="hsl(var(--chart-3))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--chart-3))" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        name="Target"
                        stroke="#82ca9d"
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Current Carbon Footprint
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-16 w-full" />
                ) : (
                  <>
                    <div className="text-3xl font-bold">
                      {energyData?.carbonFootprint.current.toFixed(1)} tons
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {energyData?.carbonFootprint.current >
                      energyData?.carbonFootprint.target
                        ? `${(
                            energyData?.carbonFootprint.current -
                            energyData?.carbonFootprint.target
                          ).toFixed(1)} tons above target`
                        : `${(
                            energyData?.carbonFootprint.target -
                            energyData?.carbonFootprint.current
                          ).toFixed(1)} tons below target`}
                    </p>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${
                          energyData?.carbonFootprint.current <=
                          energyData?.carbonFootprint.target
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            (energyData?.carbonFootprint.current / 200) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cost Savings</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-16 w-full" />
                ) : (
                  <>
                    <div className="text-3xl font-bold">
                      {energyData?.costSavings.toFixed(1)}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Savings from energy efficiency measures
                    </p>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-green-500"
                        style={{ width: `${energyData?.costSavings}%` }}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
