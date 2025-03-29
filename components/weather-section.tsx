"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Cloud, CloudRain, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF6384"]

interface WeatherData {
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  airQuality: number
  condition: string
  airMetrics: { name: string; value: number }[]
  forecast: {
    day: string
    temperature: number
    condition: string
  }[]
}

export function WeatherSection() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const API_KEY = process.env.NEXT_PUBLIC_OW_API_KEY

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=Palghar&days=5&aqi=yes`,
        )
        const data = await response.json()

        if (data.error) {
          throw new Error(data.error.message)
        }

        console.log("Weather API Response:", data)

        setWeatherData({
          temperature: data.current?.temp_c ?? 0,
          feelsLike: data.current?.feelslike_c ?? 0,
          humidity: data.current?.humidity ?? 0,
          windSpeed: data.current?.wind_kph ?? 0,
          airQuality: data.current?.air_quality?.["us-epa-index"] ?? 50,
          condition: data.current?.condition?.text || "Unknown",
          airMetrics: [
            { name: "CO", value: data.current?.air_quality?.co ?? 0 },
            { name: "NO₂", value: data.current?.air_quality?.no2 ?? 0 },
            { name: "O₃", value: data.current?.air_quality?.o3 ?? 0 },
            { name: "SO₂", value: data.current?.air_quality?.so2 ?? 0 },
            { name: "PM2.5", value: data.current?.air_quality?.pm2_5 ?? 0 },
            { name: "PM10", value: data.current?.air_quality?.pm10 ?? 0 },
          ],
          forecast:
            data.forecast?.forecastday?.map((day: any) => ({
              day: new Date(day.date).toLocaleDateString("en-US", {
                weekday: "short",
              }),
              temperature: day.day?.avgtemp_c ?? 0,
              condition: day.day?.condition?.text || "Unknown",
            })) || [],
        })
      } catch (error: any) {
        console.error("Error fetching weather data:", error)
        setError(error.message)
      }
      setLoading(false)
    }

    fetchWeatherData()
  }, [])

  const getAirQualityLabel = (aqi: number) => {
    if (aqi <= 50) return "Good"
    if (aqi <= 100) return "Moderate"
    if (aqi <= 150) return "Unhealthy for Sensitive Groups"
    if (aqi <= 200) return "Unhealthy"
    if (aqi <= 300) return "Very Unhealthy"
    return "Hazardous"
  }

  const getWeatherIcon = (condition: string) => {
    if (condition.toLowerCase().includes("sun")) return <Sun className="h-5 w-5 text-amber-500" />
    if (condition.toLowerCase().includes("cloud")) return <Cloud className="h-5 w-5 text-gray-500" />
    if (condition.toLowerCase().includes("rain")) return <CloudRain className="h-5 w-5 text-blue-500" />
    return <Cloud className="h-5 w-5 text-gray-500" />
  }
  const airQualityData = weatherData
    ? Object.entries(weatherData.airQuality).map(([key, value], index) => ({
        name: key.toUpperCase(),
        value,
        color: COLORS[index % COLORS.length],
      }))
    : []

  return (
    <>
      <Card className="shadow-lg border-none">
        <CardHeader>
          <CardTitle>Weather Conditions</CardTitle>
          <CardDescription>Current weather and air quality data</CardDescription>
        </CardHeader>
        <CardContent>
          {loading || !weatherData ? (
            <Skeleton className="h-[180px] w-full" />
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-5xl font-bold">{weatherData.temperature}°C</div>
                  <div className="text-muted-foreground">Feels like {weatherData.feelsLike}°C</div>
                  <div className="mt-2 text-sm font-medium">{weatherData.condition}</div>
                </div>
                <Sun className="h-20 w-20 text-amber-400" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg mt-6 border-none">
        <CardHeader>
          <CardTitle>Air Quality</CardTitle>
        </CardHeader>
        <CardContent>
          {loading || !weatherData ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={weatherData.airMetrics}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {weatherData.airMetrics.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </>
  )
}

