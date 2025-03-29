"use client"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Cloud, Droplets, Sun, Wind } from "lucide-react"
import { useEffect, useState } from "react"

interface WeatherData {
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  condition: string
}

export default function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const API_KEY = process.env.NEXT_PUBLIC_OW_API_KEY
  const CITY = "Palghar" // Replace this dynamically if needed

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${CITY}&aqi=yes`)
        const data = await response.json()

        if (data.error) {
          throw new Error(data.error.message)
        }

        setWeatherData({
          temperature: data.current?.temp_c ?? 0,
          feelsLike: data.current?.feelslike_c ?? 0,
          humidity: data.current?.humidity ?? 0,
          windSpeed: data.current?.wind_kph ?? 0,
          condition: data.current?.condition?.text || "Unknown",
        })
      } catch (error: any) {
        console.error("Error fetching weather data:", error)
        setError(error.message)
      }
      setLoading(false)
    }

    fetchWeatherData()
  }, [])

  const getWeatherIcon = (condition: string) => {
    if (condition.toLowerCase().includes("sun")) return <Sun className="h-5 w-5 text-amber-500" />
    if (condition.toLowerCase().includes("cloud")) return <Cloud className="h-5 w-5 text-gray-500" />
    if (condition.toLowerCase().includes("rain")) return <Cloud className="h-5 w-5 text-blue-500" />
    return <Cloud className="h-5 w-5 text-gray-500" />
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Weather Overview</h2>
      {loading || !weatherData ? (
        <Skeleton className="h-[180px] w-full" />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              {getWeatherIcon(weatherData.condition)}
              <span className="font-medium">Temperature</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{weatherData.temperature}°C</p>
            <p className="text-sm text-muted-foreground">Feels like {weatherData.feelsLike}°C</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Humidity</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{weatherData.humidity}%</p>
            <p className="text-sm text-muted-foreground">Moderate</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Wind className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Wind Speed</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{weatherData.windSpeed} km/h</p>
            <p className="text-sm text-muted-foreground">Light breeze</p>
          </Card>
        </div>
      )}
    </div>
  )
}

