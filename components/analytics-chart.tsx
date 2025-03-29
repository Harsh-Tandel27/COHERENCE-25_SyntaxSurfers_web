"use client";

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
const CITY = "Palghar"; // You can change this dynamically

interface WeatherData {
  date: string;
  temperature: number;
  humidity: number;
}

export default function AnalyticsChart() {
  const [data, setData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/history.json?key=${API_KEY}&q=${CITY}&dt=2024-03-20`
        );
        const result = await response.json();

        if (result.error) throw new Error(result.error.message);

        const formattedData = result.forecast.forecastday[0].hour.map(
          (hour: any) => ({
            date: hour.time.split(" ")[1], // Extracting just the time part
            temperature: hour.temp_c,
            humidity: hour.humidity,
          })
        );

        setData(formattedData);
      } catch (error: any) {
        setError(error.message);
      }
      setLoading(false);
    };

    fetchWeatherData();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Weather Trends (Last 24 Hours)</h2>

      {loading ? (
        <p>Loading data...</p>
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
