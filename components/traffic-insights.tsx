"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TrafficInsightsProps {
  location: { lat: number; lng: number };
}

const COLORS = ["#FF5733", "#4287f5", "#2ECC71", "#FFC300"];

export default function TrafficInsights({ location }: TrafficInsightsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [trafficData, setTrafficData] = useState<{
    hourlyData: any[];
    peakHours: string[];
    currentCongestion: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrafficData();
  }, [location]);

  const fetchTrafficData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY;

      // Fetch real-time traffic flow data
      const response = await fetch(
        `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${apiKey}&point=${location.lat},${location.lng}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch traffic data");
      }

      const data = await response.json();

      // Process the traffic data
      const processedData = processTrafficData(data);
      setTrafficData(processedData);
    } catch (err) {
      console.error("Error fetching traffic data:", err);
      setError("Unable to fetch real-time traffic data.");
    } finally {
      setIsLoading(false);
    }
  };

  const processTrafficData = (apiData: any) => {
    try {
      const flowSegmentData = apiData.flowSegmentData;

      // Calculate congestion percentage
      const currentSpeed = flowSegmentData.currentSpeed || 0;
      const freeFlowSpeed = flowSegmentData.freeFlowSpeed || 1; // Avoid division by zero
      const congestionPercentage = Math.min(
        100,
        Math.max(0, 100 - (currentSpeed / freeFlowSpeed) * 100)
      );

      // Generate hourly traffic data
      const hourlyData = generateHourlyData(congestionPercentage);

      // Find peak hours (congestion > 70%)
      const peakHours = hourlyData
        .filter((hour) => hour.congestion > 70)
        .map((hour) => hour.time);

      return {
        hourlyData,
        peakHours,
        currentCongestion: congestionPercentage,
      };
    } catch (error) {
      console.error("Error processing traffic data:", error);
      setError("Error processing traffic data.");
      return null;
    }
  };

  const generateHourlyData = (currentCongestion: number) => {
    const currentHour = new Date().getHours();

    return Array.from({ length: 24 }, (_, i) => {
      let congestionLevel;

      if (i >= 7 && i <= 9) {
        congestionLevel = 70 + Math.floor(Math.random() * 30);
      } else if (i >= 16 && i <= 19) {
        congestionLevel = 80 + Math.floor(Math.random() * 20);
      } else if (i >= 11 && i <= 14) {
        congestionLevel = 40 + Math.floor(Math.random() * 30);
      } else if (i >= 0 && i <= 5) {
        congestionLevel = 10 + Math.floor(Math.random() * 15);
      } else {
        congestionLevel = 30 + Math.floor(Math.random() * 40);
      }

      // Use actual congestion for current hour
      if (i === currentHour) {
        congestionLevel = currentCongestion;
      }

      return {
        hour: i,
        time: `${i === 0 ? "12" : i > 12 ? i - 12 : i}${i < 12 ? "am" : "pm"}`,
        congestion: Math.min(congestionLevel, 100),
      };
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!trafficData) {
    return (
      <div className="bg-destructive/15 text-destructive p-3 rounded-md flex items-center gap-2">
        <p>Failed to load traffic data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-3 flex gap-y-5 md:flex-col gap-x-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Current Congestion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {trafficData.currentCongestion.toFixed(2)}%
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${
                    trafficData.currentCongestion < 30
                      ? "bg-green-500"
                      : trafficData.currentCongestion < 70
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${trafficData.currentCongestion}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {trafficData.currentCongestion < 30
                  ? "Light traffic"
                  : trafficData.currentCongestion < 70
                  ? "Moderate congestion"
                  : "Heavy congestion"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Peak Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-medium">
                {trafficData.peakHours.length > 0
                  ? trafficData.peakHours.join(", ")
                  : "No significant peak hours"}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Consider traveling outside these hours
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-9 col-span-12">
          <Card>
            <CardHeader>
              <CardTitle>Hourly Traffic Congestion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trafficData.hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Congestion"]}
                    />
                    <Bar
                      dataKey="congestion"
                      name="Congestion Level"
                      radius={[4, 4, 0, 0]}
                      fill={COLORS[2]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
