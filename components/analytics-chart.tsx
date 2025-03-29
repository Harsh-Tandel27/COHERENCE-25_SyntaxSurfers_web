"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const COLORS = ["#FF5733", "#4287f5", "#2ECC71", "#FFC300", "#9B59B6"]

const data = [
  { year: "2015", temperature: 80, humidity: 65 },
  { year: "2016", temperature: 45, humidity: 70 },
  { year: "2017", temperature: 40, humidity: 20 },
  { year: "2018", temperature: 30, humidity: 50 },
  { year: "2019", temperature: 55, humidity: 35 },
  { year: "2020", temperature: 85, humidity: 75 },
]

export default function AnalyticsChart() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Weather Trends</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-1))]" />
            <span className="text-sm text-muted-foreground">Temperature</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-2))]" />
            <span className="text-sm text-muted-foreground">Humidity</span>
          </div>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="timestamp" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />
            {data.length > 0 &&
              Object.keys(data[0])
                .filter((key) => key !== "timestamp")
                .map((key, index) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                  />
                ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

