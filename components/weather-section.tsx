"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplets, Thermometer, Wind, CloudRain, Sun, Cloud } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

interface WeatherData {
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  airQuality: number
  condition: string
  forecast: {
    day: string
    temperature: number
    condition: string
  }[]
}

export function WeatherSection() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real implementation, you would fetch data from the OpenWeather API
    const fetchWeatherData = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock data
      setWeatherData({
        temperature: 22,
        feelsLike: 24,
        humidity: 65,
        windSpeed: 12,
        airQuality: 42,
        condition: "Partly Cloudy",
        forecast: [
          { day: "Mon", temperature: 22, condition: "cloudy" },
          { day: "Tue", temperature: 25, condition: "sunny" },
          { day: "Wed", temperature: 20, condition: "rainy" },
          { day: "Thu", temperature: 18, condition: "rainy" },
          { day: "Fri", temperature: 23, condition: "cloudy" },
        ],
      })
      setLoading(false)
    }

    fetchWeatherData()

    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchWeatherData()
    }, 300000) // Update every 5 minutes

    return () => clearInterval(interval)
  }, [])

  const getAirQualityLabel = (aqi: number) => {
    if (aqi <= 50) return "Good"
    if (aqi <= 100) return "Moderate"
    if (aqi <= 150) return "Unhealthy for Sensitive Groups"
    if (aqi <= 200) return "Unhealthy"
    if (aqi <= 300) return "Very Unhealthy"
    return "Hazardous"
  }

  const getAirQualityColor = (aqi: number) => {
    if (aqi <= 50) return "bg-green-500"
    if (aqi <= 100) return "bg-yellow-500"
    if (aqi <= 150) return "bg-orange-500"
    if (aqi <= 200) return "bg-red-500"
    if (aqi <= 300) return "bg-purple-500"
    return "bg-rose-900"
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun className="h-5 w-5 text-amber-500" />
      case "cloudy":
        return <Cloud className="h-5 w-5 text-gray-500" />
      case "rainy":
        return <CloudRain className="h-5 w-5 text-blue-500" />
      default:
        return <Cloud className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Weather Conditions</CardTitle>
          <CardDescription>Current weather and air quality data</CardDescription>
        </CardHeader>
        <CardContent>
          {loading || !weatherData ? (
            <div className="space-y-4">
              <Skeleton className="h-[180px] w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-[100px] w-full" />
                <Skeleton className="h-[100px] w-full" />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-5xl font-bold">{weatherData.temperature}°C</div>
                  <div className="text-muted-foreground">Feels like {weatherData.feelsLike}°C</div>
                  <div className="mt-2 text-sm font-medium">{weatherData.condition}</div>
                </div>
                <div className="text-6xl">
                  {weatherData.condition.toLowerCase().includes("cloud") ? (
                    <Cloud className="h-20 w-20 text-gray-400" />
                  ) : weatherData.condition.toLowerCase().includes("rain") ? (
                    <CloudRain className="h-20 w-20 text-blue-400" />
                  ) : (
                    <Sun className="h-20 w-20 text-amber-400" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Humidity</span>
                  </div>
                  <div className="text-2xl font-bold">{weatherData.humidity}%</div>
                </div>
                <div className="flex flex-col gap-2 rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Wind</span>
                  </div>
                  <div className="text-2xl font-bold">{weatherData.windSpeed} km/h</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">Air Quality Index</span>
                  </div>
                  <span className="text-sm font-medium">{getAirQualityLabel(weatherData.airQuality)}</span>
                </div>
                <Progress
                  value={weatherData.airQuality / 3}
                  className="h-2"
                  indicatorClassName={getAirQualityColor(weatherData.airQuality)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Good</span>
                  <span>Moderate</span>
                  <span>Unhealthy</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>5-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          {loading || !weatherData ? (
            <div className="grid grid-cols-5 gap-2">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-[100px] w-full" />
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2">
              {weatherData.forecast.map((day, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center rounded-lg border p-2 text-center"
                >
                  <div className="text-sm font-medium">{day.day}</div>
                  {getWeatherIcon(day.condition)}
                  <div className="mt-1 text-lg font-bold">{day.temperature}°</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}

