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
  CloudRain,
  Droplets,
  Search,
  Waves,
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
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function WaterLevelPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [waterData, setWaterData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchWaterData();
  }, []);

  const fetchWaterData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Using USGS Water Services API for real water data
      const response = await fetch(
        "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=01646500&parameterCd=00060,00065&siteStatus=active"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch water data");
      }

      const data = await response.json();

      // Process and transform the data
      const processedData = processWaterData(data);
      setWaterData(processedData);
    } catch (err) {
      console.error("Error fetching water data:", err);
      setError("Unable to fetch water data. Using sample data instead.");

      // Fallback to sample data if API fails
      setWaterData(getSampleWaterData());
    } finally {
      setIsLoading(false);
    }
  };

  const processWaterData = (apiData: any) => {
    try {
      // Extract relevant data from the USGS response
      const timeSeries = apiData.value.timeSeries || [];

      // Get discharge data (00060) and gage height data (00065)
      const dischargeData = timeSeries.find(
        (series: any) => series.variable.variableCode[0].value === "00060"
      );

      const gageHeightData = timeSeries.find(
        (series: any) => series.variable.variableCode[0].value === "00065"
      );

      // Extract values
      const currentDischarge =
        dischargeData?.values[0]?.value[0]?.value || "N/A";
      const currentGageHeight =
        gageHeightData?.values[0]?.value[0]?.value || "N/A";

      // Get historical data points
      const historicalData =
        gageHeightData?.values[0]?.value
          .slice(0, 24)
          .map((item: any, index: number) => ({
            time: new Date(item.dateTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            level: Number.parseFloat(item.value),
            discharge: Number.parseFloat(
              dischargeData?.values[0]?.value[index]?.value || 0
            ),
          }))
          .reverse() || [];

      // Calculate water quality metrics (simulated)
      const waterQualityData = [
        { name: "Dissolved Oxygen", value: 7.2 + Math.random() * 1.5 },
        { name: "pH", value: 6.8 + Math.random() * 1.4 },
        { name: "Turbidity", value: 2.5 + Math.random() * 3 },
        { name: "Temperature", value: 18 + Math.random() * 4 },
        { name: "Conductivity", value: 320 + Math.random() * 80 },
      ];

      // Calculate reservoir data (simulated)
      const reservoirCapacity = 85 + Math.random() * 10;
      const reservoirData = [
        { name: "Current Level", value: reservoirCapacity },
        { name: "Remaining", value: 100 - reservoirCapacity },
      ];

      return {
        currentLevel: Number.parseFloat(currentGageHeight),
        currentDischarge: Number.parseFloat(currentDischarge),
        historicalData,
        waterQualityData,
        reservoirCapacity,
        reservoirData,
        floodRisk: calculateFloodRisk(Number.parseFloat(currentGageHeight)),
        precipitationForecast: generatePrecipitationForecast(),
      };
    } catch (error) {
      console.error("Error processing water data:", error);
      return getSampleWaterData();
    }
  };

  const calculateFloodRisk = (currentLevel: number) => {
    // Simulated flood risk calculation
    if (currentLevel > 15) return { level: "High", percentage: 80 };
    if (currentLevel > 10) return { level: "Moderate", percentage: 40 };
    return { level: "Low", percentage: 10 };
  };

  const generatePrecipitationForecast = () => {
    // Simulated precipitation forecast
    return Array.from({ length: 7 }, (_, i) => ({
      day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i],
      precipitation: Math.random() * 25,
    }));
  };

  const getSampleWaterData = () => {
    // Sample data for when API fails
    const historicalData = Array.from({ length: 24 }, (_, i) => ({
      time: `${(i + 1) % 12 || 12}${i + 1 >= 12 ? "pm" : "am"}`,
      level: 8 + Math.sin(i / 3) * 2 + Math.random() * 0.5,
      discharge: 200 + Math.sin(i / 3) * 50 + Math.random() * 20,
    }));

    const waterQualityData = [
      { name: "Dissolved Oxygen", value: 7.8 },
      { name: "pH", value: 7.2 },
      { name: "Turbidity", value: 3.5 },
      { name: "Temperature", value: 19.5 },
      { name: "Conductivity", value: 350 },
    ];

    const reservoirCapacity = 78;
    const reservoirData = [
      { name: "Current Level", value: reservoirCapacity },
      { name: "Remaining", value: 100 - reservoirCapacity },
    ];

    return {
      currentLevel: 9.2,
      currentDischarge: 245,
      historicalData,
      waterQualityData,
      reservoirCapacity,
      reservoirData,
      floodRisk: { level: "Low", percentage: 15 },
      precipitationForecast: Array.from({ length: 7 }, (_, i) => ({
        day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i],
        precipitation: Math.random() * 25,
      })),
    };
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would search for a specific water body or location
    if (searchQuery.trim()) {
      setIsLoading(true);
      // Simulate search delay
      setTimeout(() => {
        setWaterData(getSampleWaterData());
        setIsLoading(false);
      }, 1000);
    }
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"];

  return (
    <main className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Water Level Monitoring</h1>
          <p className="text-muted-foreground">
            Real-time water level data and flood risk analysis
          </p>
        </div>

        <form onSubmit={handleSearch} className="w-full md:w-auto flex gap-2">
          <Input
            type="text"
            placeholder="Search water body..."
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
          <TabsTrigger value="historical">Historical Data</TabsTrigger>
          <TabsTrigger value="quality">Water Quality</TabsTrigger>
          <TabsTrigger value="forecast">Precipitation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Waves className="h-5 w-5 text-blue-500" />
                  Current Water Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-16 w-full" />
                ) : (
                  <>
                    <div className="text-3xl font-bold">
                      {waterData?.currentLevel.toFixed(1)} ft
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Normal range: 6.5 - 12.0 ft
                    </p>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${
                          waterData?.currentLevel < 8
                            ? "bg-green-500"
                            : waterData?.currentLevel < 12
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            (waterData?.currentLevel / 20) * 100,
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
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  Reservoir Capacity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-16 w-full" />
                ) : (
                  <>
                    <div className="text-3xl font-bold">
                      {waterData?.reservoirCapacity.toFixed(1)}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {waterData?.reservoirCapacity > 90
                        ? "Near capacity"
                        : waterData?.reservoirCapacity > 70
                        ? "Good levels"
                        : waterData?.reservoirCapacity > 40
                        ? "Moderate levels"
                        : "Low levels"}
                    </p>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${
                          waterData?.reservoirCapacity < 40
                            ? "bg-red-500"
                            : waterData?.reservoirCapacity < 70
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                        }`}
                        style={{ width: `${waterData?.reservoirCapacity}%` }}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Flood Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-16 w-full" />
                ) : (
                  <>
                    <div className="text-3xl font-bold">
                      {waterData?.floodRisk.level}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {waterData?.floodRisk.level === "Low"
                        ? "No immediate risk"
                        : waterData?.floodRisk.level === "Moderate"
                        ? "Monitor conditions"
                        : "Take precautions"}
                    </p>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${
                          waterData?.floodRisk.level === "Low"
                            ? "bg-green-500"
                            : waterData?.floodRisk.level === "Moderate"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${waterData?.floodRisk.percentage}%` }}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Reservoir Status</CardTitle>
              <CardDescription>Current water storage capacity</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={waterData?.reservoirData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        fill={COLORS[0]}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {waterData?.reservoirData.map(
                          (_: any, index: number) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={index === 0 ? "#0088FE" : "#EEEEEE"}
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historical Water Levels</CardTitle>
              <CardDescription>
                Last 24 hours of water level data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { time: "10:00 AM", level: 5.2 },
                        { time: "11:00 AM", level: 5.8 },
                        { time: "12:00 PM", level: 6.1 },
                        { time: "1:00 PM", level: 5.9 },
                        { time: "2:00 PM", level: 6.3 },
                        { time: "3:00 PM", level: 6.7 },
                        { time: "4:00 PM", level: 6.2 },
                        { time: "5:00 PM", level: 6.5 },
                        { time: "6:00 PM", level: 6.8 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="level"
                        name="Water Level (ft)"
                        stroke="hsl(var(--chart-1))"
                        fill={COLORS[1]}
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Water Discharge Rate</CardTitle>
              <CardDescription>Cubic feet per second (cfs)</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { time: "00:00", discharge: 150 },
                        { time: "03:00", discharge: 180 },
                        { time: "06:00", discharge: 200 },
                        { time: "09:00", discharge: 170 },
                        { time: "12:00", discharge: 220 },
                        { time: "15:00", discharge: 210 },
                        { time: "18:00", discharge: 190 },
                        { time: "21:00", discharge: 160 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="discharge"
                        name="Discharge (cfs)"
                        fill={COLORS[4]}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Water Quality Metrics</CardTitle>
              <CardDescription>
                Current water quality parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={waterData?.waterQualityData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="value"
                        name="Value"
                        fill={COLORS[0]}
                        radius={[0, 4, 4, 0]}
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
                <CardTitle className="text-lg">Water Quality Index</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-16 w-full" />
                ) : (
                  <>
                    <div className="text-3xl font-bold">Good</div>
                    <p className="text-sm text-muted-foreground">
                      Water quality is suitable for all uses
                    </p>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div className="h-full w-[75%] rounded-full bg-green-500" />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pollutant Levels</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-16 w-full" />
                ) : (
                  <>
                    <div className="text-3xl font-bold">Low</div>
                    <p className="text-sm text-muted-foreground">
                      Below threshold for all measured pollutants
                    </p>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div className="h-full w-[20%] rounded-full bg-green-500" />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Precipitation Forecast</CardTitle>
              <CardDescription>7-day precipitation outlook</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={waterData?.precipitationForecast}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="precipitation"
                        name="Precipitation (mm)"
                        fill={COLORS[3]}
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
                  <CloudRain className="h-5 w-5 text-blue-500" />
                  Expected Rainfall
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-16 w-full" />
                ) : (
                  <>
                    <div className="text-3xl font-bold">
                      {waterData?.precipitationForecast
                        .reduce(
                          (sum: number, day: any) => sum + day.precipitation,
                          0
                        )
                        .toFixed(1)}{" "}
                      mm
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total expected over next 7 days
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  Next Significant Rainfall
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-16 w-full" />
                ) : (
                  <>
                    <div className="text-3xl font-bold">
                      {waterData?.precipitationForecast.find(
                        (day: any) => day.precipitation > 10
                      )?.day || "None"}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {waterData?.precipitationForecast.find(
                        (day: any) => day.precipitation > 10
                      )
                        ? "Expected heavy rainfall"
                        : "No significant rainfall expected"}
                    </p>
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
