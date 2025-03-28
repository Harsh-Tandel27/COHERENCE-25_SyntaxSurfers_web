"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { year: '2015', temperature: 80, humidity: 65 },
  { year: '2016', temperature: 45, humidity: 70 },
  { year: '2017', temperature: 40, humidity: 20 },
  { year: '2018', temperature: 30, humidity: 50 },
  { year: '2019', temperature: 55, humidity: 35 },
  { year: '2020', temperature: 85, humidity: 75 },
]

export default function AnalyticsChart() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Weather Trends</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm text-muted-foreground">Temperature</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-sm text-muted-foreground">Humidity</span>
          </div>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="hsl(var(--chart-1))" 
              strokeWidth={2}
              name="Temperature"
            />
            <Line 
              type="monotone" 
              dataKey="humidity" 
              stroke="hsl(var(--chart-2))" 
              strokeWidth={2}
              name="Humidity"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}