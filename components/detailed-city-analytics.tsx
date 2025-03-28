"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Cloud, Droplets, Wind, Thermometer, Sun, CloudRain } from "lucide-react"

const weatherData = [
  { day: 'Mon', temp: 22, humidity: 65, wind: 12 },
  { day: 'Tue', temp: 24, humidity: 62, wind: 10 },
  { day: 'Wed', temp: 21, humidity: 68, wind: 14 },
  { day: 'Thu', temp: 25, humidity: 60, wind: 8 },
  { day: 'Fri', temp: 23, humidity: 63, wind: 11 },
]

const pollutionData = [
  { time: '6am', pm25: 35, pm10: 45, no2: 25 },
  { time: '9am', pm25: 42, pm10: 55, no2: 30 },
  { time: '12pm', pm25: 38, pm10: 50, no2: 28 },
  { time: '3pm', pm25: 40, pm10: 52, no2: 32 },
  { time: '6pm', pm25: 36, pm10: 48, no2: 27 },
]

export default function DetailedCityAnalytics({ city }: { city: string }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Thermometer className="h-5 w-5 text-red-500" />
            <span className="font-medium">Temperature</span>
          </div>
          <p className="mt-2 text-2xl font-bold">24°C</p>
          <p className="text-sm text-muted-foreground">Feels like 26°C</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Sun className="h-5 w-5 text-yellow-500" />
            <span className="font-medium">UV Index</span>
          </div>
          <p className="mt-2 text-2xl font-bold">6</p>
          <p className="text-sm text-muted-foreground">Moderate</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <CloudRain className="h-5 w-5 text-blue-500" />
            <span className="font-medium">Precipitation</span>
          </div>
          <p className="mt-2 text-2xl font-bold">30%</p>
          <p className="text-sm text-muted-foreground">Light rain possible</p>
        </Card>
      </div>

      <Tabs defaultValue="weather" className="space-y-4">
        <TabsList>
          <TabsTrigger value="weather">Weather Forecast</TabsTrigger>
          <TabsTrigger value="pollution">Air Quality</TabsTrigger>
        </TabsList>
        <TabsContent value="weather" className="space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">5-Day Weather Trend</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weatherData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="temp" 
                    stroke="hsl(var(--primary))" 
                    name="Temperature (°C)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="pollution" className="space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Air Pollution Levels</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pollutionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="pm25" fill="hsl(var(--chart-1))" name="PM2.5" />
                  <Bar dataKey="pm10" fill="hsl(var(--chart-2))" name="PM10" />
                  <Bar dataKey="no2" fill="hsl(var(--chart-3))" name="NO2" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}