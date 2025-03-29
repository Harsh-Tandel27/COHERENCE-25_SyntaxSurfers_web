"use client"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Droplets, Thermometer, Wind } from "lucide-react"
import { useEffect, useState } from "react"

interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
}

export default function DashboardStats() {
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
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${CITY}&aqi=no`)
        const data = await response.json()

        if (data.error) {
          throw new Error(data.error.message)
        }

        setWeatherData({
          temperature: data.current?.temp_c ?? 0,
          humidity: data.current?.humidity ?? 0,
          windSpeed: data.current?.wind_kph ?? 0,
        })
      } catch (error: any) {
        console.error("Error fetching weather data:", error)
        setError(error.message)
      }
      setLoading(false)
    }

    fetchWeatherData()
  }, [])

  const stats = [
    {
      title: "Temperature",
      value: loading ? "--" : `${weatherData?.temperature}°C`,
      progress: loading ? 0 : (weatherData!.temperature / 50) * 100, // Assume 50°C as max
      icon: Thermometer,
      color: "bg-red-500",
      description: "Above Average",
    },
    {
      title: "Humidity",
      value: loading ? "--" : `${weatherData?.humidity}%`,
      progress: loading ? 0 : weatherData!.humidity,
      icon: Droplets,
      color: "bg-blue-500",
      description: "High Humidity",
    },
    {
      title: "Wind Speed",
      value: loading ? "--" : `${weatherData?.windSpeed} km/h`,
      progress: loading ? 0 : (weatherData!.windSpeed / 100) * 100, // Assume 100 km/h as max
      icon: Wind,
      color: "bg-emerald-500",
      description: "Light Breeze",
    },
  ]

  return (
    <>
      {error && <p className="text-red-500">{error}</p>}
      {stats.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              {loading ? <Skeleton className="h-8 w-20 mt-2" /> : <h3 className="text-2xl font-bold">{stat.value}</h3>}
              {loading ? (
                <Skeleton className="h-4 w-32 mt-1" />
              ) : (
                <p className="text-sm text-muted-foreground mt-1">{stat.description}</p>
              )}
            </div>
            <div className={`p-2 rounded-lg ${stat.color}`}>
              {loading ? <Skeleton className="h-5 w-5" /> : <stat.icon className="h-5 w-5 text-white" />}
            </div>
          </div>
        </Card>
      ))}
    </>
  )
}

