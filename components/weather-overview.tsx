"use client"

import { Card } from "@/components/ui/card"
import { Cloud, Droplets, Wind } from "lucide-react"

export default function WeatherOverview() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Weather Overview</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Cloud className="h-5 w-5 text-blue-500" />
            <span className="font-medium">Temperature</span>
          </div>
          <p className="mt-2 text-2xl font-bold">24°C</p>
          <p className="text-sm text-muted-foreground">Partly cloudy</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            <span className="font-medium">Humidity</span>
          </div>
          <p className="mt-2 text-2xl font-bold">65%</p>
          <p className="text-sm text-muted-foreground">Moderate</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Wind className="h-5 w-5 text-blue-500" />
            <span className="font-medium">Wind Speed</span>
          </div>
          <p className="mt-2 text-2xl font-bold">12 km/h</p>
          <p className="text-sm text-muted-foreground">Light breeze</p>
        </Card>
      </div>
    </div>
  )
}