"use client";

import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#FF5733", "#4287f5"];
const API_KEY = process.env.NEXT_PUBLIC_OW_API_KEY;

interface ForecastData {
  date: string;
  temperature: number;
  humidity: number;
}

export default function ForecastChart({ city }: { city: string | null }) {
  const [data, setData] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { place } = useUser();

  useEffect(() => {
    const fetchForecastData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${
            city || place
          }&days=7&aqi=no`
        );
        const result = await response.json();

        if (result.error) throw new Error(result.error.message);

        // Extracting forecast data for the next 7 days
        const formattedData = result.forecast.forecastday.map((day: any) => ({
          date: new Date(day.date).toLocaleDateString("en-US", {
            weekday: "short", // "Mon", "Tue", etc.
          }),
          temperature: day.day.avgtemp_c,
          humidity: day.day.avghumidity,
        }));

        setData(formattedData);
      } catch (error: any) {
        setError(error.message);
      }
      setLoading(false);
    };

    fetchForecastData();
  }, [city]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">
        7-Day Weather Forecast : {city || place}
      </h2>

      {loading ? (
        <p>Loading forecast data...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke={COLORS[0]}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="humidity"
                stroke={COLORS[1]}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
