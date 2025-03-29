"use client";

import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#FF5733", "#4287f5", "#2ECC71", "#FFC300", "#9B59B6"]; // Defined colors for better visibility

const API_KEY = process.env.NEXT_PUBLIC_OW_API_KEY;

export default function CityAnalytics({ city }: { city: string | null }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { place } = useUser();

  useEffect(() => {
    const fetchAirQualityData = async () => {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${
            city || place
          }&days=7&aqi=yes`
        );
        const result = await response.json();

        if (result.error) throw new Error(result.error.message);

        console.log("Fetched Air Quality Data:", result);

        // Extract Air Quality Index (PM2.5) for last 7 days
        const formattedData = result.forecast.forecastday.map(
          (day: any, index: number) => ({
            name: new Date(day.date).toLocaleDateString("en-US", {
              weekday: "short",
            }),
            pm25: day.day?.air_quality?.pm2_5 ?? 0,
            color: COLORS[index % COLORS.length],
          })
        );

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching air quality data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAirQualityData();
  }, [city]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">
        Air Quality Index (PM2.5) : {city || place}
      </h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                label={{ value: "PM2.5", angle: -90, position: "insideLeft" }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="pm25"
                stroke={COLORS[0]}
                strokeWidth={2}
                dot={{ fill: COLORS[0], r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
