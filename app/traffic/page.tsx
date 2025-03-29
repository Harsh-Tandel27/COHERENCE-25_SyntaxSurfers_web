"use client"

import type React from "react"

import TrafficInsights from "@/components/traffic-insights"
import TrafficMap from "@/components/traffic-map"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Search } from "lucide-react"
import { useState } from "react"

export default function TrafficPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState({
    lat: 19.3835727,
    lng: 72.8294563,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("map")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      // Use Geocoding API to convert city name to coordinates
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          searchQuery,
        )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
      )

      const data = await response.json()
      console.log(data)

      if (data.status === "OK" && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location
        setLocation({ lat, lng })
      } else {
        setError("Location not found. Please try another search.")
      }
    } catch (err) {
      setError("An error occurred while searching. Please try again.")
      console.error("Search error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Traffic Congestion</h1>
          <p className="text-muted-foreground">Real-time traffic data and congestion analysis</p>
        </div>

        <form onSubmit={handleSearch} className="w-full md:w-auto flex gap-2">
          <Input
            type="text"
            placeholder="Search city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="md:w-[300px]"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Skeleton className="h-5 w-5 rounded-full" /> : <Search className="h-5 w-5" />}
          </Button>
        </form>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="insights">Traffic Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-4">
          <Card className="border-none">
            <CardContent className="p-0">
              <div className="h-[600px] rounded-lg overflow-hidden">
                <TrafficMap location={location} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <TrafficInsights location={location} />
        </TabsContent>
      </Tabs>
    </main>
  )
}

