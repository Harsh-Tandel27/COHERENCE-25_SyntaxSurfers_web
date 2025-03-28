"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Thermometer, Droplets, Wind } from "lucide-react"

const stats = [
  {
    title: "Temperature",
    value: "24°C",
    progress: 65,
    icon: Thermometer,
    color: "bg-red-500",
    description: "Above Average",
  },
  {
    title: "Humidity",
    value: "68%",
    progress: 68,
    icon: Droplets,
    color: "bg-blue-500",
    description: "High Humidity",
  },
  {
    title: "Wind Speed",
    value: "12 km/h",
    progress: 32,
    icon: Wind,
    color: "bg-emerald-500",
    description: "Light Breeze",
  },
]

export default function DashboardStats() {
  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="text-sm text-muted-foreground mt-1">{stat.description}</p>
            </div>
            <div className={`p-2 rounded-lg ${stat.color}`}>
              <stat.icon className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <Progress value={stat.progress} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0%</span>
              <span>{stat.progress}%</span>
            </div>
          </div>
        </Card>
      ))}
    </>
  )
}