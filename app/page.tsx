"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapSection } from "@/components/map-section"
import { WeatherSection } from "@/components/weather-section"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"

export default function Dashboard() {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [loading, setLoading] = useState(false)

  const refreshData = async () => {
    setLoading(true)
    // In a real app, you would refresh your data sources here
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLastUpdated(new Date())
    setLoading(false)
  }

  useEffect(() => {
    // Set up polling for real-time updates
    const interval = setInterval(() => {
      refreshData()
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Overview</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</div>
          <Button size="sm" onClick={refreshData} disabled={loading}>
            <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-2 lg:col-span-5">
          <CardHeader>
            <CardTitle>City Map</CardTitle>
            <CardDescription>Real-time traffic data and emergency routes</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[500px] rounded-b-lg overflow-hidden">
              <MapSection />
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-6 md:col-span-2 lg:col-span-2">
          <WeatherSection />
        </div>
      </div>

      <footer className="mt-6 py-4 border-t">
        <div className="flex flex-col gap-2 text-center text-sm text-muted-foreground md:flex-row md:gap-4 md:text-left">
          <p>© 2025 Smart City Dashboard</p>
          <p className="md:ml-auto">Data provided by OpenWeather and Google Maps</p>
        </div>
      </footer>
    </div>
  )
}

